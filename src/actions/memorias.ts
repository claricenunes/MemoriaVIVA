'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function adicionarMemoria(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const titulo      = (formData.get('titulo')      as string)?.trim()
  const conteudo    = (formData.get('conteudo')    as string)?.trim()
  const data_memoria = (formData.get('data_memoria') as string)?.trim()
  const categoria   = formData.get('categoria') as string || 'outro'

  if (!titulo || !conteudo || !data_memoria)
    return { error: 'Preencha título, data e o texto da memória' }

  const { error } = await supabase.from('memorias').insert({
    user_id: user.id,
    titulo,
    conteudo,
    data_memoria,
    categoria,
  })

  if (error) return { error: error.message }
  revalidatePath('/memorias')
  return { success: true }
}

export async function deletarMemoria(memoriaId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('memorias')
    .delete()
    .eq('id', memoriaId)
    .eq('user_id', user.id)

  revalidatePath('/memorias')
}
