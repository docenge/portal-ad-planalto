'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
export default function DownloadBible({url, publicKey}) {
  const [client, setClient] = useState(null), [session, setSession] = useState(null), [mode, setMode] = useState('signup'), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [installPrompt, setInstallPrompt] = useState(null)
  useEffect(() => {
    const key = publicKey
    if (!url || !key) { setMessage('O cadastro está indisponível no momento. A leitura abaixo continua gratuita.'); return }
    const supabase = createClient(url, key); setClient(supabase)
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, value) => setSession(value))
    return () => data.subscription.unsubscribe()
  }, [url, publicKey])
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/biblia/leitor/sw.js').catch(() => {})
    const capture = event => { event.preventDefault(); setInstallPrompt(event) }
    window.addEventListener('beforeinstallprompt', capture)
    return () => window.removeEventListener('beforeinstallprompt', capture)
  }, [])
  async function install() {
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage('')
    const form = new FormData(event.currentTarget), email = String(form.get('email')).trim(), password = String(form.get('password'))
    try {
      const result = mode === 'signup' ? await client.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/biblia' } }) : await client.auth.signInWithPassword({ email, password })
      if (result.error) throw result.error
      setMessage(result.data.session ? 'Você já pode baixar gratuitamente.' : 'Confira seu e-mail para confirmar a inscrição. Depois, volte aqui e entre com seu e-mail e senha.')
    } catch { setMessage('Não foi possível concluir. Confira os dados e, se já tem cadastro, use Entrar. Se necessário, tente novamente mais tarde.') }
    finally { setBusy(false) }
  }
  async function download() {
    setBusy(true); setMessage('')
    try {
      const { data } = await client.auth.getSession()
      if (!data.session) throw Error()
      const response = await fetch('/api/biblia/download', { headers: { Authorization: `Bearer ${data.session.access_token}` } })
      if (!response.ok) throw Error()
      const url = URL.createObjectURL(await response.blob()), link = document.createElement('a')
      link.href = url; link.download = 'biblia-ad-planalto.zip'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000)
      setMessage('Download iniciado. Extraia o ZIP e abra index.html. Se o celular bloquear arquivos HTML locais, use a leitura neste site.')
    } catch { setMessage('Não foi possível baixar. Entre novamente e tente outra vez.') }
    finally { setBusy(false) }
  }
  const inputStyle = { display: 'block', width: '100%', padding: 12, margin: '8px 0 16px', border: '1px solid #cbd5e1', borderRadius: 6 }
  return <section style={{ background: '#edf2e8', borderRadius: 12, padding: 24, margin: '24px 0' }}>
    <h2>Baixar o app gratuitamente</h2>
    <p>Instale pelo navegador para ler em Android, iPhone/iPad, Windows ou Linux. A leitura funciona sem internet depois que o texto completo for salvo no aparelho.</p>
    {installPrompt && <button onClick={install}>Instalar Bíblia neste aparelho</button>}
    <p>No Android, Windows e Linux, use Chrome ou Edge e escolha “Instalar aplicativo” no menu. No iPhone/iPad, abra o leitor em tela inteira no Safari e use Compartilhar → Adicionar à Tela de Início.</p>
    <a href="/biblia/leitor/index.html">Abrir a Bíblia para instalar</a>
    <p>Também oferecemos um ZIP com a versão para navegador e seu código-fonte após inscrição. Não é um APK nem um aplicativo de loja. A instalação pelo navegador não exige cadastro.</p>
    {session ? <><p>Você está conectado.</p><button disabled={busy} onClick={download}>{busy ? 'Preparando…' : 'Baixar o app'}</button> <button disabled={busy} onClick={() => client.auth.signOut()}>Sair</button></> : <>
      <p>Faça sua inscrição com e-mail e senha para baixar.</p>
      <div><button type="button" onClick={() => setMode('signup')} aria-pressed={mode === 'signup'}>Fazer inscrição</button> <button type="button" onClick={() => setMode('login')} aria-pressed={mode === 'login'}>Já tenho cadastro</button></div>
      <form onSubmit={submit} style={{ maxWidth: 430, marginTop: 20 }}>
        <label>E-mail<input style={inputStyle} name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Senha<input style={inputStyle} name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} required /></label>
        {mode === 'signup' && <label style={{ display: 'block', marginBottom: 16 }}><input type="checkbox" required /> Quero criar minha conta para acessar o download. O e-mail será utilizado para autenticação e confirmação da conta.</label>}
        <button disabled={!client || busy}>{busy ? 'Aguarde…' : mode === 'signup' ? 'Fazer inscrição gratuita' : 'Entrar'}</button>
      </form></>}
    <p role="status" aria-live="polite">{message}</p>
  </section>
}
