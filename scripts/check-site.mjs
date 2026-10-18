import assert from 'node:assert/strict'
import {chapters} from '../app/jornada/content.js'
const origin=process.env.SITE_ORIGIN || 'http://127.0.0.1:3100'
assert.equal(chapters.length,12)
assert.equal(new Set(chapters.map(c=>c.slug)).size,12)
const paths=['/',...chapters.map(c=>`/jornada/${c.slug}`),'/sobre-este-site']
for(const path of paths){
  const response=await fetch(origin+path)
  assert.equal(response.status,200,`${path}: HTTP ${response.status}`)
  const html=await response.text()
  assert.match(html,/AD PLANALTO/)
  assert.doesNotMatch(html,/Goiatuba|UMADGO|Pr\. Presidente|Setor Oeste/)
  assert.match(html,/id="conteudo"/)
  if(path.startsWith('/jornada/')){
    const chapter=chapters.find(c=>path.endsWith(c.slug))
    assert.ok(html.includes(chapter.title),`${path}: chapter title missing`)
    assert.match(html,/Leia o texto na Bíblia/)
    assert.match(html,/Marcar como lido/)
    assert.match(html,/Uma oração para este momento/)
  }
  console.log(`OK ${path}`)
}
for(const path of ['/images/jornada-hero.jpg','/sitemap.xml','/robots.txt','/icon.svg'])assert.equal((await fetch(origin+path)).status,200,path)
assert.equal((await fetch(origin+'/jornada/capitulo-inexistente')).status,404)
console.log('PASS: 14 content routes, 4 public assets/metadata routes and unknown chapter 404.')
