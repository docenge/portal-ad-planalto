import Link from 'next/link'
export const metadata={title:'Novidades da Igreja AD Planalto',robots:{index:false,follow:false}}
export default function Confirmed(){return <main className="shell simple-page" id="conteudo"><p className="eyebrow">NOVIDADES POR E-MAIL</p><h1>Obrigado por<br/><em>caminhar conosco.</em></h1><p>Se você chegou aqui pelo link de confirmação enviado ao seu e-mail, sua solicitação foi processada pelo serviço de inscrições. Você pode cancelar o recebimento pelo link presente em cada mensagem.</p><Link className="button button-dark" href="/">Voltar ao site →</Link></main>}
