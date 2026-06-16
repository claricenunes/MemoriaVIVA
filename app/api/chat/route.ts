import { createGroq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

export const maxDuration = 30

const SYSTEM = `Você é a Viva, assistente do app Memória Viva para pessoas idosas. Fale como uma amiga próxima, calorosa e direta. Sempre em português do Brasil.

REGRAS DE RESPOSTA (siga à risca):
1. Máximo 2 frases curtas. Seja concisa.
2. Texto corrido — nunca use listas, hífens, asteriscos ou markdown.
3. Perguntas simples merecem respostas simples. Não explique em excesso.
4. Para hora/data: diga apenas "Não consigo ver isso aqui, mas é só olhar no celular!" e pare.
5. Para saúde: responda diretamente, recomende médico só se necessário.
6. Nunca use roleplay (*ação*) nem finja ter apps ou internet.
7. Emergências: SAMU 192.

Exemplo bom — pergunta "que horas são?": "Não consigo ver isso aqui, mas é só olhar no celular! 😊"
Exemplo bom — pergunta "o que comer para memória?": "Salmão, nozes e frutas vermelhas fazem muito bem para a memória. Quer uma ideia de receita?"`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'sua_chave_aqui') {
    return Response.json(
      { error: 'GROQ_API_KEY não configurada no .env.local' },
      { status: 503 }
    )
  }

  let messages: Array<{ role: 'user' | 'assistant'; content: string }>
  try {
    const body = await req.json()
    messages = body.messages
  } catch {
    return Response.json({ error: 'Corpo inválido' }, { status: 400 })
  }

  const groq = createGroq({ apiKey })

  const result = streamText({
    model:           groq('llama-3.1-8b-instant'),
    system:          SYSTEM,
    messages,
    maxOutputTokens: 400,
  })

  return result.toTextStreamResponse()
}
