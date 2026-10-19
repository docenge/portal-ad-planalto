import {readFile, writeFile, readdir, mkdir} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {gunzipSync, deflateRawSync} from 'node:zlib'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'scripts/biblia-data'), target = path.join(root, 'public/biblia/leitor')
const parts = (await readdir(source)).filter(n=>n.startsWith('almeida1911.json.gz.part')).sort()
const originalBible = gunzipSync(Buffer.concat(await Promise.all(parts.map(n=>readFile(path.join(source,n))))))
const data = JSON.parse(originalBible)
const orthography = JSON.parse(await readFile(path.join(source, 'ortografia-br.json'), 'utf8'))
const summary = {revision: orthography.updated, books: 66, chapters: 1189, verses: 0, versesUpdated: 0, wordReplacements: 0, transcriptionCorrections: 0}
function tokenReplacement(token) {
  const key = token.toLocaleLowerCase('pt-BR').replaceAll('’', "'")
  const replacement = orthography.replacements[key]
  if (replacement) {
    if (token === token.toLocaleUpperCase('pt-BR')) return replacement.toLocaleUpperCase('pt-BR')
    if (token[0] === token[0].toLocaleUpperCase('pt-BR')) return replacement[0].toLocaleUpperCase('pt-BR') + replacement.slice(1)
    return replacement
  }
  const elision = /^([dn])['’](.+)$/iu.exec(token)
  if (elision) return (elision[1].toLowerCase() === 'd' ? 'de ' : 'em ') + tokenReplacement(elision[2])
  if (token.includes('-')) {
    const parts = token.split('-')
    const endings = {hei:'ei',has:'ás',ha:'á',hemos:'emos',heis:'eis','hão':'ão'}
    if (parts.length >= 3 && /^(me|te|se|lhe|nos|vos|lhes|lo|la|los|las)$/iu.test(parts[parts.length-2]) && endings[parts.at(-1).toLowerCase()]) {
      const ending = endings[parts.pop().toLowerCase()]
      return [...parts.map(tokenReplacement),ending].join('-')
    }
    return parts.map(part => tokenReplacement(part)).join('-')
  }
  return token
}
function modernize(text) {
  return text.replace(/[\p{L}]+(?:['’\-][\p{L}]+)*/gu, token => {
    const replacement = tokenReplacement(token)
    if (replacement !== token) summary.wordReplacements++
    return replacement
  })
}
for (const book of data.books) for (const chapter of book.chapters) for (const verse of chapter.verses) {
  const previous = verse.text
  const correction = orthography.corrections[`${book.nr}:${chapter.chapter}:${verse.verse}`]
  let text = correction ? correction.text : previous
  if (correction) summary.transcriptionCorrections++
  text = modernize(text).replace(/mô-(l[oa]s?)(?=\W|$)/gu, 'mo-$1')
  verse.text = text.trim()
  if (!verse.text) throw Error('Versículo vazio na revisão')
  summary.verses++
  if (previous !== verse.text) summary.versesUpdated++
}
data.translation = orthography.edition
data.description = orthography.scope
data.editorial_revision = summary
const bible = Buffer.from(JSON.stringify(data))
if (data.books.length !== 66 || data.books.reduce((n,b)=>n+b.chapters.length,0)!==1189) throw Error('Acervo bíblico incompleto')
await mkdir(target,{recursive:true});await writeFile(path.join(target,'biblia.json'),bible)
await writeFile(path.join(target,'revisao-ortografica.json'),JSON.stringify({...summary,sources:orthography.sources},null,2))
const files = []
for(const name of (await readdir(target)).sort()) {
 if (name === 'index.html' || name === 'app.js') continue
 files.push([name, await readFile(path.join(target,name))])
}
const html = (await readFile(path.join(target,'index.html'),'utf8')).replace('<script src="app.js"></script>','<script src="biblia-dados.js"></script><script src="app.js"></script>').replace('href="/" data-reader-exit','href="https://portal-ad-planalto.vercel.app/" data-reader-exit')
const js = (await readFile(path.join(target,'app.js'),'utf8')).replace("fetch('biblia.json')","(window.BIBLIA_DADOS ? Promise.resolve({ok:true,json:()=>Promise.resolve(window.BIBLIA_DADOS)}) : fetch('biblia.json'))")
files.push(['index.html',Buffer.from(html)],['app.js',Buffer.from(js)],['biblia-dados.js',Buffer.from('window.BIBLIA_DADOS='+bible.toString()+';')],['LEIA-ME.txt',Buffer.from('Bíblia ADP — Assembleia de Deus Planalto, Uberlândia. Extraia todos os arquivos e abra index.html em um navegador. Em Android, iOS, Windows e Linux, a instalação recomendada é pelo navegador, no leitor do portal. Alguns celulares bloqueiam HTML local. Sem narração. Texto integral Almeida 1911, com atualização editorial da ortografia brasileira e correções de transcrição conferidas no Projeto Gutenberg 62383. Não é ARC moderna. Consulte revisao-ortografica.json para procedência e contagens. Código-fonte e texto incluídos. GPL-3.0-or-later: consulte COPYING. Harpa completa e músicas contemporâneas ainda não incluídas.\n')])
// Standard ZIP format, deflate compression and CRC-32. No runtime ZIP dependency.
function crc32(buffer){let crc=0xffffffff;for(const byte of buffer){crc^=byte;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
const locals=[],central=[];let offset=0
for(const [name,content] of files){
 const filename=Buffer.from(name),compressed=deflateRawSync(content),crc=crc32(content),local=Buffer.alloc(30),entry=Buffer.alloc(46)
 local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(8,8);local.writeUInt16LE(33,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(content.length,22);local.writeUInt16LE(filename.length,26)
 entry.writeUInt32LE(0x02014b50);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);entry.writeUInt16LE(0x800,8);entry.writeUInt16LE(8,10);entry.writeUInt16LE(33,14);entry.writeUInt32LE(crc,16);entry.writeUInt32LE(compressed.length,20);entry.writeUInt32LE(content.length,24);entry.writeUInt16LE(filename.length,28);entry.writeUInt32LE(offset,42)
 locals.push(local,filename,compressed);central.push(entry,filename);offset+=local.length+filename.length+compressed.length
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16)
await mkdir(path.join(root,'downloads'),{recursive:true});await writeFile(path.join(root,'downloads/biblia-ad-planalto.zip'),Buffer.concat([...locals,directory,end]))
console.log('Bíblia ADP: 66 livros, 1.189 capítulos e pacote de download preparados.');console.log(JSON.stringify(summary))
