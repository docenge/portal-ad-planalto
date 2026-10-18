'use client'
import Link from 'next/link'
export default function MobileMenu(){return <details className="mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Navegação no celular" onClick={e=>{if(e.target.closest('a'))e.currentTarget.closest('details').removeAttribute('open')}}><Link href="/#nossa-fe">Nossa fé</Link><Link href="/#jornada">Os 12 capítulos</Link><Link href="/#comunidade">Nossa comunidade</Link><Link href="/jornada/a-criacao">Começar a leitura →</Link></nav></details>}
