import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FinanceiroClient from './financeiro-client'

export default async function FinanceiroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [{ data: transacoes }, { data: contas }] = await Promise.all([
    supabase
      .from('financeiro_transacoes')
      .select('*')
      .gte('data', `${mesAtual}-01`)
      .order('data', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('financeiro_contas')
      .select('*')
      .eq('paga', false)
      .order('vencimento'),
  ])

  return (
    <FinanceiroClient
      transacoesIniciais={transacoes ?? []}
      contasIniciais={contas ?? []}
    />
  )
}
