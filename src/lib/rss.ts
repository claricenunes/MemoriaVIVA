export interface NoticiaItem {
  titulo: string
  link: string
  publicado: string
  fonte: string
  categoria: 'Saúde' | 'Esportes' | 'Alegria' | 'Brasil' | 'Notícias'
  emoji: string
  resumo: string
}

// ─── Detecção de categoria por palavras-chave ──────────────────────────────
const CATS: { cat: NoticiaItem['categoria']; emoji: string; kw: string[] }[] = [
  { cat: 'Saúde',    emoji: '💊', kw: ['saúde','saude','médic','medic','hospital','doença','vacin','remédio','remedio','câncer','cancer','bem-estar'] },
  { cat: 'Esportes', emoji: '⚽', kw: ['futebol','esport','copa ','campeonato','jogo ','gol ','atleta','olimp','flamengo','corinthians','palmeiras'] },
  { cat: 'Alegria',  emoji: '😄', kw: ['vovó','avó','neto','conquista','celebra','feliz','alegria','incrível','emocionante','coração','sorriso'] },
  { cat: 'Brasil',   emoji: '🇧🇷', kw: ['brasil','governo','ministér','ministerio','congresso','presidente','senado','lei ','estado ','municipio'] },
]

function detectar(titulo: string, desc: string): { cat: NoticiaItem['categoria']; emoji: string } {
  const texto = (titulo + ' ' + desc).toLowerCase()
  for (const { cat, emoji, kw } of CATS) {
    if (kw.some((k) => texto.includes(k))) return { cat, emoji }
  }
  return { cat: 'Notícias', emoji: '🌎' }
}

function formatarData(pubDate: string): string {
  if (!pubDate) return 'Recente'
  try {
    const d   = new Date(pubDate)
    if (isNaN(d.getTime())) return 'Recente'
    const h   = Math.floor((Date.now() - d.getTime()) / 3_600_000)
    if (h < 1)  return 'Agora'
    if (h < 24) return `Há ${h} hora${h > 1 ? 's' : ''}`
    if (h < 48) return 'Ontem'
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  } catch { return 'Recente' }
}

function extrair(xml: string, tag: string): string {
  const cd = xml.match(new RegExp(`<${tag}>[\\s]*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>[\\s]*<\\/${tag}>`))
  if (cd) return cd[1].trim()
  const pl = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
  return pl ? pl[1].replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#\d+;/g,'').trim() : ''
}

export async function fetchNoticias(url: string): Promise<NoticiaItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MemoriaViva/1.0)' },
    })
    if (!res.ok) return []
    const xml   = await res.text()
    const items: NoticiaItem[] = []
    const rx    = /<item>([\s\S]*?)<\/item>/g
    let m
    while ((m = rx.exec(xml)) !== null && items.length < 20) {
      const c     = m[1]
      const titulo = extrair(c, 'title')
      if (!titulo) continue
      const desc    = extrair(c, 'description')
      const link    = extrair(c, 'link')
      const pubDate = extrair(c, 'pubDate')
      const fonte   = extrair(c, 'dc:creator') || new URL(url).hostname.replace('www.', '')
      const { cat, emoji } = detectar(titulo, desc)
      items.push({ titulo, link, publicado: formatarData(pubDate), fonte, categoria: cat, emoji, resumo: desc.slice(0, 180) })
    }
    return items
  } catch { return [] }
}

// ─── Fallback curado ──────────────────────────────────────────────────────
export const NOTICIAS_FALLBACK: NoticiaItem[] = [
  { titulo: 'Estudo aponta que caminhar 30 minutos por dia reduz risco cardíaco em 35%',    link: '', publicado: 'Há 3 horas',  fonte: 'G1 Saúde',       categoria: 'Saúde',    emoji: '💊', resumo: 'Pesquisadores da Universidade de São Paulo confirmam os benefícios de caminhadas regulares para a saúde cardiovascular.' },
  { titulo: 'Nova lei facilita acesso a medicamentos para idosos em todo o país',            link: '', publicado: 'Há 6 horas',  fonte: 'Agência Brasil', categoria: 'Brasil',   emoji: '🇧🇷', resumo: 'Projeto sancionado pelo presidente garante descontos de até 80% em remédios de uso contínuo para maiores de 60 anos.' },
  { titulo: 'Pesquisa revela que cultivar plantas em casa melhora o humor e reduz estresse', link: '', publicado: 'Há 5 horas',  fonte: 'Viva Bem',       categoria: 'Saúde',    emoji: '🌺', resumo: 'Estudo com 2.000 participantes mostrou redução de 30% nos níveis de cortisol em pessoas que cuidam de plantas.' },
  { titulo: 'Vovó de 78 anos aprende a usar celular e conquista a internet com sua doçaria', link: '', publicado: 'Há 1 dia',   fonte: 'Portal UOL',     categoria: 'Alegria',  emoji: '😄', resumo: 'Dona Maria começou a vender seus doces caseiros pelo WhatsApp e hoje fatura mais de R$ 3 mil por mês.' },
  { titulo: 'Roberto Carlos anuncia turnê de despedida com shows em 15 cidades brasileiras', link: '', publicado: 'Há 1 dia',   fonte: 'Folha de S.Paulo', categoria: 'Notícias', emoji: '🎵', resumo: 'O Rei anunciou que a turnê terá início em março de 2027 e passará pelas principais capitais.' },
  { titulo: 'Previsão indica semana de sol com temperaturas agradáveis no Sudeste',          link: '', publicado: 'Há 2 dias',  fonte: 'Climatempo',     categoria: 'Brasil',   emoji: '🌤️', resumo: 'Tempo firme sem previsão de chuvas significativas até o próximo fim de semana em São Paulo e Rio de Janeiro.' },
  { titulo: 'Futebol: Copa do Brasil define os semifinalistas com viradas emocionantes',     link: '', publicado: 'Há 4 horas', fonte: 'UOL Esporte',    categoria: 'Esportes', emoji: '⚽', resumo: 'Quatro clubes avançam às semifinais após jogos cheios de emoção disputados na última quarta-feira.' },
]
