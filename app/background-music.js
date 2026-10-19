'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function BackgroundMusic() {
  const audio = useRef(null), clock = useRef(null), step = useRef(0), on = useRef(false)
  const [playing, setPlaying] = useState(false), [message, setMessage] = useState('Instrumental suave, sem anúncios. Começa desligado.')
  const stopMusic = useCallback(() => {
    on.current = false; clearInterval(clock.current); clock.current = null
    const context = audio.current; audio.current = null
    context?.close().catch(() => {})
    setPlaying(false); setMessage('Música de fundo desativada.')
  }, [])
  const startMusic = useCallback(async () => {
    if (on.current) return
    const Audio = window.AudioContext || window.webkitAudioContext
    if (!Audio) { setMessage('Seu navegador não oferece música de fundo.'); return }
    const context = audio.current || new Audio(); audio.current = context; on.current = true
    try {
      await context.resume()
      if (!on.current) return
      if (context.state !== 'running') { stopMusic(); setMessage('Toque no botão para permitir a música neste navegador.'); return }
      on.current = true; setPlaying(true); setMessage('Música de fundo ativada em volume baixo.')
      const chords = [[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]]
      function play() {
        if (!on.current || context.state !== 'running') return
        const now = context.currentTime, chord = chords[step.current++ % chords.length]
        chord.forEach((frequency,index) => {
          const oscillator = context.createOscillator(), gain = context.createGain()
          oscillator.type = 'sine'; oscillator.frequency.value = frequency / 2
          gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime(0.018,now + 1 + index * .1); gain.gain.linearRampToValueAtTime(0,now + 5.8)
          oscillator.connect(gain); gain.connect(context.destination); oscillator.start(now); oscillator.stop(now + 6)
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
        })
      }
      play(); clock.current = setInterval(play, 6000)
    } catch { stopMusic(); setMessage('Não foi possível iniciar a música. Tente tocar no botão novamente.') }
  }, [stopMusic])
  useEffect(() => {
    const command = event => {
      if (event.detail === 'prepare') {
        stopMusic()
        const Audio = window.AudioContext || window.webkitAudioContext
        if (Audio) { const context = new Audio(); audio.current = context; context.resume().catch(() => {}) }
        return
      }
      if (event.detail === 'stop') stopMusic(); else if (event.detail === 'start') startMusic() }
    const hide = () => { if (document.hidden) stopMusic() }
    window.addEventListener('adp-music', command); document.addEventListener('visibilitychange', hide)
    return () => { on.current = false; clearInterval(clock.current); audio.current?.close().catch(() => {}); window.removeEventListener('adp-music', command); document.removeEventListener('visibilitychange', hide) }
  }, [startMusic, stopMusic])
  return <section aria-label="Música de fundo" className="shell" style={{ padding: '12px 24px', margin: '12px auto', border: '1px solid #b7c4ce', borderRadius: 12 }}>
    <button type="button" aria-pressed={playing} onClick={() => playing ? stopMusic() : startMusic()} style={{ padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>{playing ? '♫ Desativar música de fundo' : '♫ Ativar música de fundo'}</button>
    <span role="status" style={{ display: 'block', fontSize: 13, marginTop: 8 }}>{message}</span>
    <details><summary style={{ cursor: 'pointer', padding: '10px 0' }}>❔ Ajuda da música</summary><p>Toque para ativar ou desativar. Com a pesquisa por voz ativa, diga “desligar o som” ou “desativar música de fundo”. A música para ao sair do site. Sons instrumentais criados no aparelho, sem serviço de streaming.</p></details>
  </section>
}
