import SiteSearch from './site-search'
import LambMascot from './lamb-mascot'
import './globals.css'
import './theme.css'
import { Header, Footer } from './components'
export const metadata = {
  metadataBase: new URL('https://www.octatopdicas.com.br'),
  title: { default: 'AD Planalto — Uberlândia | Uma história de amor e esperança', template: '%s | AD Planalto — Uberlândia' },
  description: 'Conheça a AD Planalto em Uberlândia e percorra o plano de salvação em 12 capítulos: da criação à nova vida em Jesus Cristo.',
  openGraph: { title: 'AD Planalto — Uberlândia', description: 'Uma história de amor. Um novo começo. A mensagem da Bíblia em 12 capítulos.', locale: 'pt_BR', type: 'website', images: [{ url: '/images/jornada-hero.jpg', width: 1536, height: 1024, alt: 'Paisagem simbólica da jornada da fé' }] },
}
const themeScript="try{var t=localStorage.getItem('adp-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}"
export default function RootLayout({children}){return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><a href="#conteudo" className="skip-link">Ir para o conteúdo</a><Header /><SiteSearch />{children}<Footer /><LambMascot /></body></html>}
