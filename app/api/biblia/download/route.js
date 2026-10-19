import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(request) {
  const headers = { 'Cache-Control': 'private, no-store' }
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return Response.json({ error: 'Cadastro indisponível.' }, { status: 503, headers })
  const authorization = request.headers.get('authorization') || ''
  if (!authorization.startsWith('Bearer ')) return Response.json({ error: 'Entre para baixar.' }, { status: 401, headers })
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase.auth.getUser(authorization.slice(7))
    if (error || !data.user || !data.user.email_confirmed_at) return Response.json({ error: 'Confirme seu e-mail e entre para baixar.' }, { status: 401, headers })
    const file = await readFile(path.join(process.cwd(), 'downloads', 'biblia-ad-planalto.zip'))
    return new Response(file, { headers: { ...headers, 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="biblia-ad-planalto.zip"' } })
  } catch { return Response.json({ error: 'Download temporariamente indisponível.' }, { status: 503, headers }) }
}
