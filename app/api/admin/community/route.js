import {createClient} from '@supabase/supabase-js'
export const runtime='nodejs'
export const dynamic='force-dynamic'
const headers={'Cache-Control':'no-store, private','Vary':'Authorization'}
const reply=(body,status=200)=>Response.json(body,{status,headers})
export async function GET(request){
 const token=request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1]
 if(!token)return reply({error:'Autenticação necessária.'},401)
 if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return reply({error:'Administração ainda não configurada.'},503)
 try{
 const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
 const {data:auth,error:authError}=await db.auth.getUser(token)
 if(authError||!auth?.user)return reply({error:'Sessão inválida. Entre novamente.'},401)
 const {data:admin,error}=await db.from('adp_admins').select('can_manage_contacts,can_manage_prayers,can_manage_newsletter').eq('user_id',auth.user.id).eq('active',true).maybeSingle()
 if(error||!admin)return reply({error:'Sua conta ainda não tem autorização de administrador.'},403)
 const categories=[['contacts','adp_contacts',admin.can_manage_contacts],['prayers','adp_prayer_requests',admin.can_manage_prayers],['newsletter','adp_newsletter_signups',admin.can_manage_newsletter]].filter(([, ,allowed])=>allowed)
 if(!categories.length)return reply({error:'Nenhuma categoria autorizada.'},403)
 const {error:auditError}=await db.from('adp_admin_audit').insert({admin_user_id:auth.user.id,action:'read:'+categories.map(([name])=>name).join(',')})
 if(auditError)return reply({error:'Não foi possível registrar a consulta.'},503)
 const body={}
 for(const [name,table] of categories){const result=await db.from(table).select('*').order('created_at',{ascending:false}).limit(100);if(result.error)return reply({error:'Consulta indisponível.'},503);body[name]=result.data}
 return reply(body)
 }catch{return reply({error:'Consulta indisponível.'},503)}
}
