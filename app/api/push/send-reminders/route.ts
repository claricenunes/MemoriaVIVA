import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// This route is called by Vercel Cron every minute.
// It finds medications due in the next 15 minutes and sends push notifications.
export async function GET(req: NextRequest) {
  // Protect: only Vercel Cron or requests with CRON_SECRET can call this
  const secret = req.headers.get('x-cron-secret')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const now = new Date()
  const nowHHMM = now.toTimeString().slice(0, 5)   // "HH:MM"
  const in15 = new Date(now.getTime() + 15 * 60_000)
  const in15HHMM = in15.toTimeString().slice(0, 5)
  const hoje = now.toISOString().split('T')[0]

  // Get all active medications whose next horario falls in [now, now+15min]
  const { data: meds } = await supabase
    .from('medicamentos')
    .select('id, user_id, nome, dosagem, horarios')
    .eq('ativo', true)

  if (!meds?.length) return NextResponse.json({ sent: 0 })

  // Get today's registros so we don't notify for already-taken doses
  const medIds = meds.map((m) => m.id)
  const { data: registros } = await supabase
    .from('medicamentos_registros')
    .select('medicamento_id, horario_previsto')
    .in('medicamento_id', medIds)
    .eq('data', hoje)

  const takenSet = new Set(
    (registros ?? []).map((r) => `${r.medicamento_id}:${r.horario_previsto}`)
  )

  // Collect (user_id, med, horario) pairs that need a reminder
  type Reminder = { userId: string; nome: string; dosagem: string; horario: string }
  const reminders: Reminder[] = []

  for (const med of meds) {
    for (const horario of med.horarios as string[]) {
      if (horario >= nowHHMM && horario <= in15HHMM && !takenSet.has(`${med.id}:${horario}`)) {
        reminders.push({ userId: med.user_id, nome: med.nome, dosagem: med.dosagem, horario })
      }
    }
  }

  if (!reminders.length) return NextResponse.json({ sent: 0 })

  // Get push subscriptions for affected users
  const userIds = [...new Set(reminders.map((r) => r.userId))]
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('user_id, endpoint, p256dh, auth_key')
    .in('user_id', userIds)

  if (!subs?.length) return NextResponse.json({ sent: 0 })

  const subsByUser = new Map<string, typeof subs>()
  for (const sub of subs) {
    if (!subsByUser.has(sub.user_id)) subsByUser.set(sub.user_id, [])
    subsByUser.get(sub.user_id)!.push(sub)
  }

  let sent = 0
  const stale: string[] = []

  await Promise.allSettled(
    reminders.flatMap(({ userId, nome, dosagem, horario }) =>
      (subsByUser.get(userId) ?? []).map(async (sub) => {
        const payload = JSON.stringify({
          title: `Hora do remédio — ${horario} 💊`,
          body:  `${nome} • ${dosagem}`,
          icon:  '/icon-192.png',
          url:   '/medicamentos',
          tag:   `med-${userId}-${horario}`,
        })
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
            payload
          )
          sent++
        } catch (err: unknown) {
          const status = (err as { statusCode?: number }).statusCode
          if (status === 410 || status === 404) stale.push(sub.endpoint)
        }
      })
    )
  )

  // Remove expired subscriptions
  if (stale.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', stale)
  }

  return NextResponse.json({ sent, stale: stale.length })
}
