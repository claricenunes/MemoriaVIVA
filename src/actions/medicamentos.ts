'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function marcarTomado(medicamentoId: string, horario: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const hoje = new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('medicamentos_registros')
    .upsert(
      {
        user_id:          user.id,
        medicamento_id:   medicamentoId,
        data:             hoje,
        horario_previsto: horario,
        tomado_em:        new Date().toISOString(),
      },
      { onConflict: 'medicamento_id,data,horario_previsto' }
    )

  if (error) return { error: error.message }

  revalidatePath('/medicamentos')
  revalidatePath('/saude')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function adicionarMedicamento(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const nome = (formData.get('nome') as string | null)?.trim()
  const dosagem = (formData.get('dosagem') as string | null)?.trim()
  const frequencia = (formData.get('frequencia') as string | null)?.trim()
  const horariosRaw = (formData.get('horarios') as string | null)?.trim()
  const estoque = Number(formData.get('estoque') ?? 0)

  if (!nome) return { error: 'Informe o nome do remédio' }
  if (!dosagem) return { error: 'Informe a dosagem' }
  if (!frequencia) return { error: 'Informe a frequência' }

  const horarios = horariosRaw
    ? horariosRaw.split(',').map((h) => h.trim()).filter(Boolean)
    : []

  const { error } = await supabase.from('medicamentos').insert({
    user_id: user.id,
    nome,
    dosagem,
    frequencia,
    horarios,
    estoque,
  })

  if (error) return { error: error.message }

  revalidatePath('/medicamentos')
  return { success: true }
}

export async function excluirMedicamento(
  id: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('medicamentos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/medicamentos')
  revalidatePath('/dashboard')
  return { success: true }
}
