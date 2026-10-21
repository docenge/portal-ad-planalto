import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {createRequire} from 'node:module'
import {chapters} from '../app/jornada/content.js'
import {biblePassages} from '../app/jornada/bible-passages.mjs'
const require = createRequire(import.meta.url)
const search = require('../public/biblia/leitor/bible-search.js')
const {books} = JSON.parse(await readFile(new URL('../public/biblia/leitor/biblia.json',import.meta.url),'utf8'))
let count=0
for(const chapter of chapters) {
  for(const passage of biblePassages(chapter.reference)) {
    const url=new URL(passage.href,'https://www.octatopdicas.com.br')
    assert.equal(url.origin,'https://www.octatopdicas.com.br')
    assert.equal(url.pathname,'/biblia/leitor/index.html')
    const ref=search.reference(url.searchParams.get('q'),books)
    assert.ok(ref&&!ref.error,passage.label)
    assert.equal(books[ref.book].name+' '+(ref.chapter+1),url.searchParams.get('q'))
    count++
  }
}
assert.deepEqual(biblePassages('2 Samuel 7; Isaías 9; 53').map(p=>new URL(p.href,'https://example.invalid').searchParams.get('q')),['2 Samuel 7','Isaías 9','Isaías 53'])
console.log(`PASS: ${count} referências dos 12 capítulos abrem no leitor ADP e correspondem ao acervo real.`)
