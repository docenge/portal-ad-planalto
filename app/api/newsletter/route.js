import {readJson} from '../read-json.mjs'
export const runtime='nodejs'
export async function POST(request){
 if(process.env.NEWSLETTER_ENABLED!=='true'||!process.env.BREVO_API_KEY||!/^\d+$/.test(process.env.BREVO_LIST_ID||'')||!/^\d+$/.test(process.env.BREVO_DOI_TEMPLATE_ID||''))return Response.json({error:'Inscrições ainda não estão ativas.'},{status:503})
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return Response.json({error:'Origem inválida.'},{status:403})
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Formato inválido.'},{status:415})
 let input;try{input=await readJson(request,2048)}catch(error){return Response.json({error:'Solicitação inválida.'},{status:error.status||400})}
 if(input.website)return Response.json({ok:true},{status:202})
 const email=typeof input.email==='string'?input.email.trim():''
 if(input.consent!==true||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return Response.json({error:'Confira seu e-mail e consentimento.'},{status:400})
 try{const response=await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation',{method:'POST',headers:{'api-key':process.env.BREVO_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,includeListIds:[Number(process.env.BREVO_LIST_ID)],templateId:Number(process.env.BREVO_DOI_TEMPLATE_ID),redirectionUrl:'https://www.octatopdicas.com.br/novidades/confirmado'}),signal:AbortSignal.timeout(12000)});if(!response.ok)return Response.json({error:'Serviço indisponível.'},{status:502});return Response.json({ok:true},{status:202})}catch{return Response.json({error:'Serviço indisponível.'},{status:502})}
}
