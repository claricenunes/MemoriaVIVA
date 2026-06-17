'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type Result = { error: string } | { success: true }

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function adicionarTransacao(formData: FormData): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const descricao = String(formData.get('descricao') ?? '').trim()
  const valorAbs  = parseFloat(String(formData.get('valor') ?? '').replace(',', '.'))
  const categoria = String(formData.get('categoria') ?? '')
  const emoji     = String(formData.get('emoji') ?? '💳')
  const data      = String(formData.get('data') ?? todayStr())
  const tipo      = String(formData.get('tipo') ?? 'saida')

  if (!descricao || isNaN(valorAbs) || valorAbs <= 0 || !categoria) {
    return { error: 'Preencha todos os campos obrigatórios' }
  }

  const valor = tipo === 'entrada' ? valorAbs : -valorAbs

  const { error } = await supabase.from('financeiro_transacoes').insert({
    user_id: user.id, descricao, valor, categoria, emoji, data,
  })
  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  return { success: true }
}

export async function deletarTransacao(id: string): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('financeiro_transacoes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  return { success: true }
}

export async function adicionarConta(formData: FormData): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const label      = String(formData.get('label') ?? '').trim()
  const vencimento = String(formData.get('vencimento') ?? '')
  const valor      = parseFloat(String(formData.get('valor') ?? '').replace(',', '.'))

  if (!label || !vencimento || isNaN(valor) || valor <= 0) {
    return { error: 'Preencha todos os campos obrigatórios' }
  }

  const { error } = await supabase.from('financeiro_contas').insert({
    user_id: user.id, label, vencimento, valor,
  })
  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  return { success: true }
}

export async function marcarContaPaga(id: string): Promise<Result> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: conta } = await supabase
    .from('financeiro_contas')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  if (!conta) return { error: 'Conta não encontrada' }

  const { error: txErr } = await supabase.from('financeiro_transacoes').insert({
    user_id: user.id,
    descricao: conta.label,
    valor: -conta.valor,
    categoria: 'Conta',
    emoji: '📄',
    data: todayStr(),
  })
  if (txErr) return { error: txErr.message }

  const { error: delErr } = await supabase
    .from('financeiro_contas')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (delErr) return { error: delErr.message }

  revalidatePath('/financeiro')
  return { success: true }
}
