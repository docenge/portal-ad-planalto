export const runtime='nodejs'
export async function POST(request){
 if(process.env.COMMUNITY_REGISTRATION_ENABLED!=='true'||!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return Response.json({error:'Cadastro ainda não está ativo.'},{status:503})
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origem inválida.'},{status:403})
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Formato inválido.'},{status:415})
 let input;try{const raw=await request.text();if(raw.length>16000)return Response.json({error:'Cadastro muito longo.'},{status:413});input=JSON.parse(raw)}catch{return Response.json({error:'Dados inválidos.'},{status:400})}
 if(!input||typeof input!=='object'||Array.isArray(input))return Response.json({error:'Dados inválidos.'},{status:400})
 if(input.website)return Response.json({ok:true},{status:202})
 const email=typeof input.email==='string'?input.email.trim():''
 if(!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||input.detailsConsent!==true)return Response.json({error:'Confira e-mail e autorização.'},{status:400})
 const fields={};for(const name of ['fullName','street','neighborhood','city','state','postalCode','phone','whatsapp','prayer']){if(input[name]!=null&&typeof input[name]!=='string')return Response.json({error:'Dados inválidos.'},{status:400});const value=(input[name]||'').trim();if(value.length>(name==='prayer'?3000:name==='street'?200:120))return Response.json({error:'Campo muito longo.'},{status:400});if(value)fields[name]=value}
 if(!Object.keys(fields).length)return Response.json({error:'Informe um dado ou pedido de oração.'},{status:400})
 if(fields.prayer&&input.prayerConsent!==true)return Response.json({error:'Autorize o envio do pedido de oração.'},{status:400})
 try{const url=new URL('/rest/v1/rpc/adp_submit_contact',process.env.SUPABASE_URL);if(url.protocol!=='https:')throw Error();const response=await fetch(url,{method:'POST',headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({payload:{email,...fields,detailsConsent:true,prayerConsent:Boolean(fields.prayer&&input.prayerConsent)}}),signal:AbortSignal.timeout(12000)});if(!response.ok)return Response.json({error:'Cadastro indisponível.'},{status:502});return Response.json({ok:true},{status:201})}catch{return Response.json({error:'Cadastro indisponível.'},{status:502})}
}
