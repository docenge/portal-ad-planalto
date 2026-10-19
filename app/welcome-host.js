'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import './welcome-host.css'

export const WELCOME = 'Olá! Seja muito bem-vindo! Eu sou a irmã Dorcas, a anfitriã virtual da Igreja AD Planalto, em Uberlândia. Estou aqui para apresentar nosso site e receber você com carinho. Aqui, você pode conhecer nossa fé, descobrir nossa história, acompanhar os cultos e explorar a Bíblia ADP. Na jornada da fé, cada encontro é uma oportunidade de renovar a esperança em Jesus. Fique à vontade: este espaço também é seu! Vou deixar você agora com um som ambiente suave para conhecer melhor o nosso site. Quando não quiser mais ouvir, toque em Desativar música de fundo. Se a pesquisa por voz estiver ativada, você também pode dizer: desligar o som. Que sua visita seja um momento de paz e uma oportunidade de se aproximar de Deus! Fique à vontade. Até mais!'

export default function WelcomeHost() {
  const pathname = usePathname(), utterance = useRef(null), speakingRef = useRef(false), musicNext = useRef(true)
  const [speaking, setSpeaking] = useState(false), [dismissed, setDismissed] = useState(false), [ambient, setAmbient] = useState(true), [supported, setSupported] = useState(null), [departed, setDeparted] = useState(false), [message, setMessage] = useState('Toque em Ouvir boas-vindas para conhecer o site com a irmã Dorcas.')
  function stopGreeting() {
    speakingRef.current = false; utterance.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }
  function welcome() {
    if (!('speechSynthesis' in window)) { setMessage('A voz não está disponível neste navegador. Leia a mensagem abaixo.'); return }
    stopGreeting()
    setDeparted(false)
    window.dispatchEvent(new CustomEvent('adp-welcome-start'))
    window.dispatchEvent(new CustomEvent('adp-music', { detail: ambient ? 'prepare' : 'stop' }))
    musicNext.current = ambient
    const text = ambient ? WELCOME : WELCOME.replace('Vou deixar você agora com um som ambiente suave para conhecer melhor o nosso site. ', 'Você escolheu explorar o site sem música de fundo. ')
    const speech = new SpeechSynthesisUtterance(text)
    utterance.current = speech; speakingRef.current = true
    speech.lang = 'pt-BR'; speech.rate = .88; speech.pitch = 1.02; speech.volume = .85
    speech.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'pt-BR' && /female|feminina|maria|francisca|helena|luciana|vitoria|vitória|leticia|letícia|raquel|fernanda/i.test(voice.name)) || speechSynthesis.getVoices().find(voice => voice.lang === 'pt-BR') || speechSynthesis.getVoices().find(voice => voice.lang.startsWith('pt')) || null
    setSpeaking(true); setMessage('A irmã Dorcas está dando as boas-vindas. Você pode interromper a qualquer momento.')
    speech.onend = () => {
      if (utterance.current !== speech || !speakingRef.current) return
      speakingRef.current = false; utterance.current = null; setSpeaking(false)
      setDeparted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('adp-dorcas-walk'))))
      if (musicNext.current) { window.dispatchEvent(new CustomEvent('adp-music', { detail: 'start' })); setMessage('Boas-vindas concluídas. A música ambiente foi solicitada; se não ouvir, toque em Ativar música de fundo.') }
      else setMessage('Boas-vindas concluídas. Explore o site no seu ritmo.')
    }
    speech.onerror = () => {
      if (utterance.current !== speech) return
      speakingRef.current = false; utterance.current = null; setSpeaking(false)
      window.dispatchEvent(new CustomEvent('adp-music', { detail: 'stop' }))
      setMessage('Não foi possível reproduzir a voz. Você pode ler a mensagem abaixo e ativar a música pelo botão.')
    }
    window.speechSynthesis.speak(speech)
  }
  useEffect(() => {
    setSupported('speechSynthesis' in window)
    const hide = () => { if (document.hidden) { speakingRef.current = false; utterance.current = null; if ('speechSynthesis' in window) speechSynthesis.cancel(); setSpeaking(false) } }
    document.addEventListener('visibilitychange', hide)
    return () => { speakingRef.current = false; utterance.current = null; if ('speechSynthesis' in window) speechSynthesis.cancel(); document.removeEventListener('visibilitychange', hide) }
  }, [pathname])
  if (pathname !== '/') return null
  if (departed) return <div className="shell welcome-reopen"><button type="button" onClick={() => setDeparted(false)}>Ouvir a irmã Dorcas novamente</button></div>
  if (dismissed) return <div className="shell welcome-reopen"><button type="button" onClick={() => setDismissed(false)}>Conhecer a irmã Dorcas</button></div>
  return <section className={'welcome-host shell' + (speaking ? ' is-speaking' : '')} aria-labelledby="welcome-title">
    <div className="welcome-portrait"><img src="/images/irma-dorcas.webp" alt="Irmã Dorcas, personagem fictícia de cabelo comprido, vestido discreto e sem adereços, sorrindo de forma acolhedora" width="280" height="280" /><span className="welcome-tag">Irmã Dorcas · anfitriã virtual</span><span className="welcome-speaking" aria-hidden="true">{speaking ? '● Falando' : 'Uma recepção para você'}</span></div>
    <div className="welcome-copy"><p className="eyebrow">QUE BOM TER VOCÊ AQUI</p><h2 id="welcome-title">Seja bem-vindo à AD Planalto.</h2><p>Conheça nossa fé, explore nossa história e encontre uma mensagem de esperança. A irmã Dorcas, nossa anfitriã virtual, apresenta o site para você.</p>
      <label className="welcome-option"><input type="checkbox" checked={ambient} disabled={speaking} onChange={e => setAmbient(e.target.checked)} /> Tocar música ambiente depois das boas-vindas</label>
      <div className="welcome-actions"><button className="button button-dark" type="button" disabled={supported === false} onClick={() => speaking ? (stopGreeting(), window.dispatchEvent(new CustomEvent('adp-music', { detail: 'stop' })), setMessage('Boas-vindas interrompidas.')) : welcome()}>{speaking ? 'Parar boas-vindas' : '▶ Ouvir boas-vindas'}</button><button className="welcome-dismiss" type="button" onClick={() => { stopGreeting(); window.dispatchEvent(new CustomEvent('adp-music', { detail: 'stop' })); setDismissed(true) }}>Explorar sem apresentação</button></div>
      <p className="welcome-status" role="status">{supported === false ? 'A narração não está disponível neste navegador. Leia a mensagem abaixo.' : message}</p>
      <details><summary>❔ Ajuda e texto das boas-vindas</summary><p>Para ouvir, toque no botão. Para parar a fala, toque em Parar boas-vindas. Para desligar a música, use o botão de música ou, com a pesquisa por voz ativa, diga “desligar o som”. O microfone não é ativado automaticamente. A voz disponível depende do seu aparelho.</p><blockquote>{WELCOME}</blockquote><small>Dorcas é uma personagem fictícia criada com IA, inspirada no acolhimento e na generosidade da Dorcas de Atos 9. A imagem não representa uma pessoa da igreja. Narração por voz sintética do aparelho.</small></details>
    </div>
  </section>
}
