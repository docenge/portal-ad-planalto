import Link from 'next/link'
import './biblia.css'
import DownloadBible from './download-bible'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Bíblia ADP | AD Planalto Uberlândia', description: 'Leia a Bíblia no portal da AD Planalto Uberlândia e baixe gratuitamente a versão para navegador.' }
export default function BiblePage() {
  return <main id="conteudo" className="bible-page" style={{ maxWidth: 1200, margin: 'auto', padding: '24px 16px' }}>
    <Link href="/">← Voltar ao portal</Link>
    <h1>Bíblia ADP</h1>
    <p>AD Planalto Uberlândia • Leitura gratuita, sem anúncios.</p>
    <p>Almeida de 1911 com ortografia atualizada para o português brasileiro. Mantém a linguagem clássica e a estrutura dos versículos; não é uma edição moderna da ARC.</p>
    <DownloadBible url={process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''} publicKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''} />
    <section className="bible-install-intro"><span>NO SEU CELULAR OU COMPUTADOR</span><h2>Sua Bíblia, sempre por perto.</h2><p>Leia os 66 livros, guarde versículos e anotações, prepare a leitura sem internet e leve a Bíblia ADP para a tela inicial.</p><a className="bible-open-primary" href="/biblia/leitor/index.html">Abrir e instalar Bíblia ADP →</a><p>Android: Chrome → Instalar aplicativo. iPhone: Safari → Compartilhar → Adicionar à Tela de Início.</p><p>A seção Harpa Cristã permite importar seu acervo autorizado, buscar hinos e guardar favoritos. As letras completas ainda não acompanham esta edição.</p></section><h2>Leia a Bíblia aqui no site</h2>
    <a href="/biblia/leitor/index.html">Abrir leitura em tela inteira</a>
    <iframe title="Leitor da Bíblia ADP" src="/biblia/leitor/index.html" style={{ width: '100%', height: 'min(900px, 85vh)', border: '1px solid #d8dfd4', borderRadius: 12, marginTop: 16 }} />
  </main>
}
