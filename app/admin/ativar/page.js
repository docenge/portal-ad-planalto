import Activation from './setup'
export const metadata={title:'Ativar acesso administrativo',robots:{index:false,follow:false}}
export const dynamic='force-dynamic'
export default function Page(){return <main id="conteudo" style={{maxWidth:600,margin:'auto',padding:'6rem 1.5rem'}}><h1>Ative seu acesso</h1><Activation url={process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL||''} publicKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''}/></main>}
