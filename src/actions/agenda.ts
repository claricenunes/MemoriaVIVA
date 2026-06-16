'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function adicionarEvento(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const titulo    = (formData.get('titulo')    as string)?.trim()
  const detalhes  = (formData.get('detalhes')  as string)?.trim() || null
  const data      = formData.get('data')      as string
  const hora      = formData.get('hora')      as string || null
  const categoria = formData.get('categoria') as string || 'outro'
  const cor       = formData.get('cor')       as string || 'azul'
  const icone     = formData.get('icone')     as string || 'calendar'

  if (!titulo || !data) return { error: 'Título e data são obrigatórios' }

  const { error } = await supabase.from('agenda_eventos').insert({
    user_id: user.id,
    titulo,
    detalhes,
    data,
    hora,
    categoria,
    cor,
    icone,
  })

  if (error) return { error: error.message }
  revalidatePath('/agenda')
  return { success: true }
}

export async function editarEvento(
  eventoId: string,
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const titulo    = (formData.get('titulo')    as string)?.trim()
  const detalhes  = (formData.get('detalhes')  as string)?.trim() || null
  const data      = formData.get('data')      as string
  const hora      = formData.get('hora')      as string || null
  const categoria = formData.get('categoria') as string || 'outro'
  const cor       = formData.get('cor')       as string || 'azul'
  const icone     = formData.get('icone')     as string || 'calendar'

  if (!titulo || !data) return { error: 'Título e data são obrigatórios' }

  const { error } = await supabase
    .from('agenda_eventos')
    .update({ titulo, detalhes, data, hora, categoria, cor, icone })
    .eq('id', eventoId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/agenda')
  return { success: true }
}

export async function deletarEvento(eventoId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('agenda_eventos')
    .delete()
    .eq('id', eventoId)
    .eq('user_id', user.id)

  revalidatePath('/agenda')
}
