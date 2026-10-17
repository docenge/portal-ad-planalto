import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let congregacoes = []
  let eventos = []
  let avisos = []
  let erroConexao = null

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const [resCong, resEv, resAv] = await Promise.all([
        supabase.from('congregacoes').select('*').order('id'),
        supabase.from('eventos').select('*').order('id'),
        supabase.from('avisos').select('*').eq('ativo', true).order('id')
      ])
      congregacoes = resCong.data || []
      eventos = resEv.data || []
      avisos = resAv.data || []
      if (resCong.error) erroConexao = resCong.error.message
    } catch (err) {
      erroConexao = err.message
    }
  } else {
    erroConexao = 'Variáveis de ambiente do Supabase não encontradas.'
  }

  return (
    <div>
      <header style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: 'white', padding: '3rem 1.5rem', textAlign: 'center', borderBottom: '4px solid #eab308' }}>
        <h1 style={{ margin: 0, fontSize: '2.2rem' }}>AD Madureira — Campo Goiatuba</h1>
        <p style={{ marginTop: '0.75rem', fontSize: '1.1rem', opacity: 0.9 }}>
          Portal Oficial de Comunicação, Eventos e Congregações
        </p>
      </header>

      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
        {erroConexao && (
          <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
            <strong>Aviso de Conexão:</strong> {erroConexao}
          </div>
        )}

        {avisos.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            {avisos.map((aviso) => (
              <div key={aviso.id} style={{ backgroundColor: '#fef9c3', borderLeft: '5px solid #eab308', padding: '1.25rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#854d0e' }}>📢 {aviso.titulo}</h3>
                <p style={{ margin: 0, color: '#713f12' }}>{aviso.conteudo}</p>
              </div>
            ))}
          </section>
        )}

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#1e3a8a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>📅 Próximos Cultos e Eventos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            {eventos.map((ev) => (
              <div key={ev.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                  {ev.data_evento}
                </span>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{ev.titulo}</h3>
                <p style={{ margin: '0 0 0.75rem 0', color: '#475569', fontSize: '0.95rem' }}>{ev.descricao}</p>
                <small style={{ color: '#64748b', fontWeight: 500 }}>📍 Local: {ev.local}</small>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#1e3a8a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>⛪ Nossas Congregações</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            {congregacoes.map((cong) => (
              <div key={cong.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a' }}>{cong.nome}</h3>
                <p style={{ margin: '0.35rem 0', color: '#334155', fontSize: '0.95rem' }}><strong>📍 Endereço:</strong> {cong.endereco}</p>
                <p style={{ margin: '0.35rem 0', color: '#334155', fontSize: '0.95rem' }}><strong>👤 Dirigente:</strong> {cong.dirigente}</p>
                <p style={{ margin: '0.35rem 0', color: '#334155', fontSize: '0.95rem' }}><strong>🕒 Cultos:</strong> {cong.horario_cultos}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'center', padding: '2rem 1rem', marginTop: '4rem' }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Assembleia de Deus Ministério de Madureira — Campo de Goiatuba - GO</p>
      </footer>
    </div>
  )
}
