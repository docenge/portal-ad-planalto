import AdminPanel from './panel'
export const metadata={title:'Administração',robots:{index:false,follow:false}}
export const dynamic='force-dynamic'
export default function AdminPage(){return <main id="conteudo" style={{maxWidth:1000,margin:'auto',padding:'6rem 1.5rem'}}><h1>Administração da Igreja AD Planalto</h1><p>Acesso exclusivo aos responsáveis autorizados. Não compartilhe sua senha.</p><AdminPanel url={process.env.SUPABASE_URL||''} publicKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''}/></main>}
