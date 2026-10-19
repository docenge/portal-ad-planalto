'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
export function resolveCommand(text) {
  const q = normalize(text)
  if (/\b(desativar|desligar|parar|pausar)\b/.test(q) && /\b(musica|som|audio)\b/.test(q)) return { type: 'music', action: 'stop' }
  if (/\b(ativar|ligar|tocar)\b/.test(q) && /\b(musica|som|audio)\b/.test(q)) return { type: 'music', action: 'start' }
  if (/desativar (?:a )?(?:pesquisa|busca|navegacao) por voz|parar de ouvir/.test(q)) return { type: 'stop' }
  if (/ativar (?:a )?(?:pesquisa|busca|navegacao) por voz/.test(q)) return { type: 'activate' }
  if (/\b(baixar|instalar|download)\b/.test(q) && /\b(biblia|aplicativo|app)\b/.test(q)) return { type: 'navigate', url: '/biblia#baixar-app' }
  if (/\b(biblia|aplicativo da biblia|app da biblia)\b/.test(q)) return { type: 'navigate', url: '/biblia/leitor/index.html' }
  if (/\b(jornada|plano de salvacao)\b/.test(q)) return { type: 'navigate', url: '/#jornada' }
  if (/\b(nossa fe|conhecer a fe)\b/.test(q)) return { type: 'navigate', url: '/#nossa-fe' }
  if (/\b(novidades)\b/.test(q)) return { type: 'navigate', url: '/#novidades' }
  if (/\b(inicio|pagina inicial|portal|voltar ao site)\b/.test(q)) return { type: 'navigate', url: '/' }
  if (/\b(eventos|cultos|programacao)\b/.test(q)) return { type: 'section', heading: 'cultos', label: 'Cultos e eventos' }
  if (/\b(congregacoes|igrejas|enderecos)\b/.test(q)) return { type: 'section', heading: 'congregacoes', label: 'Congregações' }
  if (/\bavisos\b/.test(q)) return { type: 'section', heading: 'novidades', label: 'Avisos' }
  if (/\b(ajuda|comandos)\b/.test(q)) return { type: 'help' }
  return { type: 'unknown' }
}
export default function VoiceNavigation() {
  const router = useRouter(), recognition = useRef(null), enabled = useRef(false), timer = useRef(null)
  const [supported, setSupported] = useState(null), [active, setActive] = useState(false), [message, setMessage] = useState('Toque para ativar e permita o microfone.'), [transcript, setTranscript] = useState(''), [typed, setTyped] = useState('')
  function stop(message = 'Pesquisa por voz desativada.') {
    enabled.current = false; setActive(false); clearTimeout(timer.current); recognition.current?.abort(); setMessage(message)
  }
  function execute(text) {
    setTranscript(text)
    const command = resolveCommand(text)
    if (command.type === 'music') { window.dispatchEvent(new CustomEvent('adp-music', { detail: command.action })); setMessage(command.action === 'stop' ? 'Música de fundo desativada.' : 'Pedido enviado. Se a música não iniciar, toque no botão da música.'); return }
    if (command.type === 'stop') { stop(); return }
    if (command.type === 'activate') { setMessage('Pesquisa por voz ativada. Diga o que deseja abrir.'); return }
    if (command.type === 'navigate') { stop('Abrindo a opção solicitada.'); if (window.location.pathname === '/biblia' && command.url.includes('#')) { const target = Array.from(document.querySelectorAll('h2')).find(h => normalize(h.textContent).includes('baixar')); target?.scrollIntoView({ behavior: 'smooth' }) } else router.push(command.url); return }
    if (command.type === 'section') {
      stop('Abrindo ' + command.label + '.')
      const heading = document.getElementById(command.heading) || Array.from(document.querySelectorAll('h2')).find(h => normalize(h.textContent).includes(command.heading))
      if (heading) { heading.scrollIntoView({ behavior: 'smooth', block: 'start' }); heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }) }
      else if (window.location.pathname !== '/') router.push('/#' + command.heading)
      else setMessage('Essa seção ainda não tem conteúdo publicado.')
      return
    }
    setMessage(command.type === 'help' ? 'Diga: abrir Bíblia, baixar aplicativo da Bíblia, mostrar eventos, mostrar congregações, mostrar avisos ou voltar ao início.' : 'Não entendi esse pedido. Diga “ajuda” para conhecer os comandos disponíveis.')
  }
  function listen() {
    if (!enabled.current || recognition.current) return
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) { stop('Use o campo de comando ou o microfone do teclado.'); return }
    const mic = new Recognition(); recognition.current = mic
    mic.lang = 'pt-BR'; mic.continuous = true; mic.interimResults = false
    mic.onresult = event => { if (!enabled.current) return; for (let i = event.resultIndex; i < event.results.length; i++) { if (event.results[i].isFinal) execute(event.results[i][0].transcript); if (!enabled.current) break } }
    mic.onerror = event => {
      if (!enabled.current) return
      stop(({ 'not-allowed': 'Permita o uso do microfone nas configurações do navegador.', 'no-speech': 'Não ouvi sua fala. Ative novamente para tentar.', network: 'Confira sua conexão com a internet.', 'audio-capture': 'Microfone indisponível neste aparelho.' })[event.error] || 'O reconhecimento de voz não está disponível. Use o campo de comando.')
    }
    mic.onend = () => { recognition.current = null; if (enabled.current) timer.current = setTimeout(listen, 500) }
    try { mic.start(); setMessage('Ouvindo… Diga o que deseja abrir ou “desativar pesquisa por voz”.') } catch { recognition.current = null; stop('Não foi possível iniciar o microfone. Tente novamente.') }
  }
  useEffect(() => {
    setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition))
    const hash = window.location.hash.slice(1)
    if (hash) setTimeout(() => {
      const keyword = hash === 'baixar-app' ? 'baixar' : hash
      const target = document.getElementById(hash) || Array.from(document.querySelectorAll('h2')).find(h => normalize(h.textContent).includes(keyword))
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    const hide = () => { if (document.hidden) stop() }
    const welcomeStart = () => stop('Pesquisa por voz pausada durante as boas-vindas. Toque para reativar depois.')
    window.addEventListener('adp-welcome-start', welcomeStart)
    document.addEventListener('visibilitychange', hide)
    return () => { enabled.current = false; clearTimeout(timer.current); recognition.current?.abort(); document.removeEventListener('visibilitychange', hide); window.removeEventListener('adp-welcome-start', welcomeStart) }
  }, [])
  return <section aria-label="Comandos de voz do portal" style={{ maxWidth: 1000, margin: '20px auto', padding: '18px 24px', background: '#eef2ff', color: '#0f172a', border: '1px solid #c7d2fe', borderRadius: 12 }}>
    <h2 style={{ fontSize: 20, margin: '0 0 12px' }}>Navegue pelo site com sua voz</h2>
    <button type="button" disabled={supported !== true} aria-pressed={active} onClick={() => { if (enabled.current) stop(); else { enabled.current = true; setActive(true); listen() } }} style={{ padding: '12px 18px', borderRadius: 8, border: 0, background: '#1e3a8a', color: '#fff', fontSize: 16 }}>{active ? 'Desativar pesquisa por voz' : 'Ativar pesquisa por voz'}</button>
    <p role="status" aria-live="polite">{supported === false ? 'Voz indisponível neste navegador. Digite o comando ou use o microfone do teclado.' : message}</p>
    {transcript && <p>Você disse: <strong>{transcript}</strong></p>}
    <form onSubmit={e => { e.preventDefault(); stop(); execute(typed) }} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><input aria-label="Comando para o site" value={typed} onChange={e => setTyped(e.target.value)} placeholder="Ex.: abrir Bíblia" required maxLength={250} style={{ padding: 12, flex: '1 1 200px', minWidth: 0 }} /><button type="submit" style={{ padding: 12 }}>Executar comando</button></form>
    <details style={{ marginTop: 14 }}><summary style={{ cursor: 'pointer', fontWeight: 600, padding: '10px 0' }}>❔ Ajuda — como usar a pesquisa por voz</summary><ol><li>Para ativar, toque no botão “Ativar pesquisa por voz”.</li><li>Se o navegador pedir, permita o uso do microfone.</li><li>Diga o que deseja, por exemplo: “Abrir Bíblia” ou “Mostrar eventos”.</li><li>Para desativar, toque em “Desativar pesquisa por voz” ou diga essa mesma frase.</li><li>Para ligar novamente, toque no botão. Com o microfone desligado, o site não escuta comandos.</li></ol><p>“Abrir Bíblia”, “baixar aplicativo da Bíblia”, “mostrar eventos”, “mostrar congregações”, “mostrar avisos”, “desligar o som” ou “voltar ao início”.</p><p>O download abre a área de instalação e cadastro. O navegador pode exigir um toque para instalar ou baixar. A voz pode usar o serviço do navegador e precisar de internet. Para reativar após desligar, toque no botão. A escuta para ao sair do site.</p></details>
  </section>
}
