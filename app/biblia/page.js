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
    <p>Almeida, edição histórica de 1911, com ortografia da fonte preservada. Esta edição não é a ARC moderna.</p>
    <DownloadBible url={process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''} publicKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''} />
    <h2>Leia a Bíblia aqui no site</h2>
    <a href="/biblia/leitor/index.html">Abrir leitura em tela inteira</a>
    <iframe title="Leitor da Bíblia ADP" src="/biblia/leitor/index.html" style={{ width: '100%', height: 'min(900px, 85vh)', border: '1px solid #d8dfd4', borderRadius: 12, marginTop: 16 }} />
  </main>
}
