'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import './lamb-mascot.css'

export default function LambMascot() {
  const pathname = usePathname(), timer = useRef(null)
  const [visible, setVisible] = useState(true), [greeting, setGreeting] = useState(false)
  useEffect(() => {
    try { if (sessionStorage.getItem('adp-lamb-hidden') === 'true') setVisible(false) } catch {}
    return () => clearTimeout(timer.current)
  }, [])
  // Keep the reading and administration surfaces clear.
  if (!visible || pathname.startsWith('/admin') || pathname.startsWith('/biblia')) return null
  function greet() { setGreeting(true); clearTimeout(timer.current); timer.current = setTimeout(() => setGreeting(false), 4500) }
  return <aside className="lamb-mascot" aria-label="Ovelhinha do site">
    <button type="button" className="lamb-close" aria-label="Ocultar ovelhinha nesta visita" title="Ocultar ovelhinha" onClick={() => { setVisible(false); try { sessionStorage.setItem('adp-lamb-hidden', 'true') } catch {} }}>×</button>
    {greeting && <div className="lamb-bubble" role="status">Que bom ter você aqui! 🐑</div>}
    <button type="button" className={'lamb-character' + (greeting ? ' lamb-hello' : '')} onClick={greet} aria-label="Cumprimentar a ovelhinha" title="Olá! Sou a ovelhinha do site."><img src="/images/ovelhinha-adp.webp" width="112" height="112" alt="Ovelhinha branca e fofinha, com expressão carinhosa" draggable="false" /></button>
  </aside>
}
