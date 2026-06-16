import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { subscription } = await req.json() as {
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
    }

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Subscription inválida' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id:  user.id,
        endpoint: subscription.endpoint,
        p256dh:   subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
      },
      { onConflict: 'user_id,endpoint' }
    )

    if (error) {
      console.error('[push/subscribe]', error)
      return NextResponse.json({ error: 'Erro ao salvar subscription' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[push/subscribe] unexpected:', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json() as { endpoint: string }
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    await supabase.from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[push/unsubscribe]', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
