import NoticiasClient from '@/components/noticias/noticias-client'
import { fetchNoticias, NOTICIAS_FALLBACK } from '@/lib/rss'

const RSS_URL = 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml'

export default async function NoticiasPage() {
  const vivas = await fetchNoticias(RSS_URL)
  const aoVivo  = vivas.length > 0
  const noticias = aoVivo ? vivas : NOTICIAS_FALLBACK

  const updateTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return <NoticiasClient noticias={noticias} updateTime={updateTime} aoVivo={aoVivo} />
}
