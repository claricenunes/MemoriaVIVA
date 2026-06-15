'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function salvarCheckin(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const corpo = Number(formData.get('corpo'))
  const mente = Number(formData.get('mente'))
  const nota = (formData.get('nota') as string | null) ?? ''
  const marcadoMedico = formData.get('marcado_medico') === 'true'

  if (!corpo || corpo < 1 || corpo > 10) return { error: 'Selecione como está seu corpo hoje' }
  if (!mente || mente < 1 || mente > 10) return { error: 'Selecione como está sua mente hoje' }

  const hoje = new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('saude_registros')
    .upsert(
      { user_id: user.id, data: hoje, corpo, mente, nota: nota || null, marcado_medico: marcadoMedico },
      { onConflict: 'user_id,data' }
    )

  if (error) return { error: error.message }

  revalidatePath('/saude')
  revalidatePath('/dashboard')
  return { success: true }
}
