import {chapters} from './jornada/content'
export default function sitemap(){const base='https://www.octatopdicas.com.br';return [{url:base,changeFrequency:'monthly',priority:1},...chapters.map(c=>({url:`${base}/jornada/${c.slug}`,changeFrequency:'monthly',priority:.8})),{url:`${base}/sobre-este-site`,changeFrequency:'yearly',priority:.2}]}
