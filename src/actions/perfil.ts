'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type Result = { error: string } | { success: true }

export async function atualizarPerfil(_prevState: unknown, formData: FormData): Promise<Result> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autenticado' }

    const nome = String(formData.get('nome') ?? '').trim()
    if (!nome) return { error: 'O nome não pode estar vazio' }

    const { error } = await supabase.auth.updateUser({ data: { nome } })
    if (error) return { error: error.message }

    revalidatePath('/perfil')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro ao salvar' }
  }
}
