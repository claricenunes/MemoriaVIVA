'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Role = 'user' | 'assistant'
type Msg  = { id: string; role: Role; content: string }

const SUGESTOES = [
  'Quais alimentos são bons para a memória?',
  'Me ensina um exercício leve para fazer em casa',
  'Tenho dormido mal, o que posso fazer?',
  'Me conte uma curiosidade interessante',
  'Como posso organizar minha agenda?',
  'Me ajuda a escrever uma memória da minha vida',
]

function uid() { return Math.random().toString(36).slice(2) }

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '10px 2px' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--mv-azul)', opacity: 0.5,
          animation: 'mv-typing-dot 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}

function Avatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
      background: 'linear-gradient(135deg, var(--mv-azul-soft), var(--mv-salvia-soft))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, alignSelf: 'flex-end',
    }}>
      🤖
    </div>
  )
}

export default function AssistentePage() {
  const [msgs, setMsgs]           = useState<Msg[]>([])
  const [input, setInput]         = useState('')
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [hasSpeech, setHasSpeech] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recogRef  = useRef<unknown>(null)

  const loading = streamingId !== null

  useEffect(() => {
    setHasSpeech(
      !!( (window as unknown as Record<string, unknown>).SpeechRecognition
        || (window as unknown as Record<string, unknown>).webkitSpeechRecognition)
    )
  }, [])

  useEffect(() => {
    const el = document.querySelector('.mv-content-area')
    el?.classList.add('mv-content-area--chat')
    return () => el?.classList.remove('mv-content-area--chat')
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, streamingId])

  async function enviar(texto: string) {
    if (!texto.trim() || loading) return
    setInput('')

    const userMsg: Msg = { id: uid(), role: 'user', content: texto.trim() }
    const history = [...msgs, userMsg]
    const assistantId = uid()

    setMsgs([...history, { id: assistantId, role: 'assistant', content: '' }])
    setStreamingId(assistantId)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const current = accumulated
        setMsgs((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: current } : m)
        )
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Erro desconhecido'
      setMsgs((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `⚠️ ${errMsg}` } : m
        )
      )
    } finally {
      setStreamingId(null)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar(input)
    }
  }

  function startVoice() {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition
               || (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!SR) return
    const r = new (SR as new () => {
      lang: string
      onresult: ((e: { results: { [0]: { [0]: { transcript: string } } } }) => void) | null
      onerror:  (() => void) | null
      onend:    (() => void) | null
      start: () => void; stop: () => void
    })()
    r.lang     = 'pt-BR'
    r.onresult = (e) => setInput(e.results[0][0].transcript)
    r.onerror  = () => setRecording(false)
    r.onend    = () => setRecording(false)
    recogRef.current = r
    r.start()
    setRecording(true)
  }

  function stopVoice() {
    const r = recogRef.current as { stop: () => void } | null
    r?.stop()
    setRecording(false)
  }


  const empty = msgs.length === 0

  return (
    <main style={{
      display: 'flex', flexDirection: 'column',
      flex: 1, minHeight: 0, overflow: 'hidden',
      maxWidth: 'var(--mv-max-width)',
      width: '100%',
      margin: '0 auto', padding: '0 var(--mv-page-px)',
      background: 'var(--mv-bg)',
    }}>
      {/* Header compacto */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
        paddingTop: 'var(--mv-space-4)', paddingBottom: 'var(--mv-space-3)',
        borderBottom: '1px solid var(--mv-border)',
      }}>
        <Link href="/mais" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--mv-text-secondary)', textDecoration: 'none',
          fontSize: 'var(--mv-text-sm)', fontWeight: 600, flexShrink: 0,
        }}>
          <i className="ti ti-chevron-left" aria-hidden="true" style={{ fontSize: 18 }} />
          Mais
        </Link>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--mv-azul-soft), var(--mv-salvia-soft))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🤖</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)', lineHeight: 1.2 }}>Viva</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--mv-text-secondary)' }}>Sua assistente</p>
          </div>
        </div>
        <div style={{ width: 48 }} />
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 'var(--mv-space-3)' }}>
        {empty && (
          <div style={{ textAlign: 'center', paddingTop: 'var(--mv-space-2)' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--mv-azul-soft), var(--mv-salvia-soft))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
            }}>
              🤖
            </div>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 'var(--mv-text-lg)', color: 'var(--mv-text-primary)' }}>
              Olá! Sou a Viva 💙
            </p>
            <p style={{ margin: '0 0 var(--mv-space-5)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
              Estou aqui para ajudar, conversar e cuidar de você.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-2)', textAlign: 'left' }}>
              {SUGESTOES.map((s) => (
                <button key={s} type="button" onClick={() => enviar(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px', borderRadius: 'var(--mv-radius-md)',
                  background: 'var(--mv-card)', border: '1.5px solid var(--mv-border)',
                  textAlign: 'left', cursor: 'pointer', fontSize: 'var(--mv-text-sm)',
                  fontFamily: 'var(--mv-font)', color: 'var(--mv-text-primary)',
                  fontWeight: 500, boxShadow: 'var(--mv-shadow-soft)',
                }}>
                  <i className="ti ti-message-circle" aria-hidden="true" style={{ color: 'var(--mv-azul-deep)', fontSize: 18, flexShrink: 0 }} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
          {msgs.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              {msg.role === 'assistant' && <Avatar />}
              <div style={{
                maxWidth: '80%', padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--mv-terracota), var(--mv-ambar))'
                  : 'var(--mv-card)',
                color:  msg.role === 'user' ? '#fff' : 'var(--mv-text-primary)',
                fontSize: 'var(--mv-text-sm)', lineHeight: 1.65,
                boxShadow: 'var(--mv-shadow-soft)',
                border: msg.role === 'assistant' ? '1.5px solid var(--mv-border)' : 'none',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content
                  ? msg.content
                  : msg.id === streamingId
                    ? <TypingDots />
                    : '...'}
              </div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        flexShrink: 0, paddingBottom: 'var(--mv-space-3)',
        paddingTop: 'var(--mv-space-3)', borderTop: '1px solid var(--mv-border)',
        background: 'var(--mv-bg)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--mv-space-2)', alignItems: 'flex-end' }}>
          {hasSpeech && (
            <button type="button" onClick={recording ? stopVoice : startVoice}
              aria-label={recording ? 'Parar' : 'Falar'}
              style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                border: '1.5px solid',
                borderColor: recording ? 'var(--mv-terracota)' : 'var(--mv-border)',
                background: recording ? 'var(--mv-terracota-soft)' : 'var(--mv-card)',
                color: recording ? 'var(--mv-terracota-deep)' : 'var(--mv-text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
              <i className={recording ? 'ti ti-square-filled' : 'ti ti-microphone'} aria-hidden="true" />
            </button>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escreva sua mensagem..."
            rows={1}
            style={{
              flex: 1, padding: '11px 14px',
              border: '1.5px solid var(--mv-border)', borderRadius: 14,
              fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)',
              background: 'var(--mv-card)', color: 'var(--mv-text-primary)',
              outline: 'none', resize: 'none', lineHeight: 1.5,
              maxHeight: 100, overflowY: 'auto',
            }}
          />

          <button type="button" onClick={() => enviar(input)} disabled={!input.trim() || loading}
            aria-label="Enviar"
            style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--mv-terracota), var(--mv-ambar))'
                : 'var(--mv-border)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 20, transition: 'background 0.2s',
            }}>
            <i className="ti ti-send" aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  )
}
