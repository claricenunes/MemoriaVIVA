import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './env'

export async function createClient() {
  const { url, anonKey } = getSupabaseConfig()
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options })
          )
        } catch {
          // Chamado a partir de um Server Component — cookies só podem ser
          // definidos em middleware ou route handlers. Ignorado intencionalmente.
        }
      },
    },
  })
}
