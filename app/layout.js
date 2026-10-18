import './globals.css'
import { Header, Footer } from './components'
export const metadata = {
  metadataBase: new URL('https://www.octatopdicas.com.br'),
  title: { default: 'AD Planalto — Uberlândia | Uma história de amor e esperança', template: '%s | AD Planalto — Uberlândia' },
  description: 'Conheça a AD Planalto em Uberlândia e percorra o plano de salvação em 12 capítulos: da criação à nova vida em Jesus Cristo.',
  openGraph: { title: 'AD Planalto — Uberlândia', description: 'Uma história de amor. Um novo começo. A mensagem da Bíblia em 12 capítulos.', locale: 'pt_BR', type: 'website', images: [{ url: '/images/jornada-hero.jpg', width: 1536, height: 1024, alt: 'Paisagem simbólica da jornada da fé' }] },
}
export default function RootLayout({children}){return <html lang="pt-BR"><body><a href="#conteudo" className="skip-link">Ir para o conteúdo</a><Header />{children}<Footer /></body></html>}
