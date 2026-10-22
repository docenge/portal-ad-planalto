/* Bíblia ADP • GPL-3.0-or-later. Imported hymn collections stay on this device. */
(function(root){
function normalizeCollection(input){
 const list=Array.isArray(input)?input:input.hinos;
 if(!Array.isArray(list)||!list.length||list.length>640)throw Error('O arquivo deve conter uma lista de 1 a 640 hinos.');
 const seen=new Set();
 return list.map(item=>{
  const number=Number(item.numero??item.number??item.id),title=String(item.titulo??item.title??item.nome??'').trim();
  if(!Number.isInteger(number)||number<1||number>640||seen.has(number)||!title||title.length>160)throw Error('Confira o número (1–640), o título e os números repetidos.');seen.add(number);
  let verses=item.estrofes??item.verses??item.letra??item.lyrics;
  if(typeof verses==='string')verses=verses.split(/\n\s*\n/);
  if(!Array.isArray(verses)||!verses.length)throw Error('Cada hino precisa de letra em estrofes.');
  verses=verses.map(v=>{
   if(typeof v==='string')return {text:v.trim(),chords:''};
   if(!v||typeof v!=='object')throw Error('Estrofe inválida.');
   return {text:String(v.texto??v.text??'').trim(),chords:String(v.cifras??v.chords??'').trim()};
  });
  if(verses.some(v=>!v.text||v.text.length>10000||v.chords.length>2000))throw Error('Confira o texto das estrofes.');
  return {number,title,verses};
 }).sort((a,b)=>a.number-b.number);
}
root.ADPHarpa={normalizeCollection};if(typeof module!=='undefined')module.exports=root.ADPHarpa;
if(typeof document==='undefined')return;
const by=id=>document.getElementById(id),norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const collectionKey='adp-harpa-collection',favoriteKey='adp-harpa-favorites';let hymns=[],favorites=[],onlyFavorites=false,current=null,chords=false;
try{const saved=localStorage.getItem(collectionKey);if(saved)hymns=normalizeCollection(JSON.parse(saved));favorites=JSON.parse(localStorage.getItem(favoriteKey)||'[]');if(!Array.isArray(favorites))favorites=[]}catch{}
const status=text=>by('harpa-status').textContent=text;
function show(hymn){
 current=hymn;const reader=by('harpa-reader');reader.replaceChildren();reader.hidden=false;
 const h=document.createElement('h3');h.textContent=hymn.number+' — '+hymn.title;
 const favorite=document.createElement('button');favorite.type='button';favorite.textContent=favorites.includes(hymn.number)?'♥ Remover dos favoritos':'♡ Favoritar hino';favorite.setAttribute('aria-pressed',String(favorites.includes(hymn.number)));
 favorite.onclick=()=>{favorites=favorites.includes(hymn.number)?favorites.filter(n=>n!==hymn.number):[...favorites,hymn.number];try{localStorage.setItem(favoriteKey,JSON.stringify(favorites))}catch{status('Não foi possível salvar os favoritos neste navegador.')}show(hymn);list()};reader.append(h,favorite);
 if(hymn.verses.some(v=>v.chords)){const toggle=document.createElement('button');toggle.type='button';toggle.textContent=chords?'Ocultar cifras':'Mostrar cifras';toggle.setAttribute('aria-pressed',String(chords));toggle.onclick=()=>{chords=!chords;show(hymn)};reader.append(toggle)}
 hymn.verses.forEach(v=>{if(chords&&v.chords){const pre=document.createElement('pre');pre.className='harpa-chords';pre.textContent=v.chords;reader.append(pre)}const p=document.createElement('p');p.className='harpa-stanza';p.textContent=v.text;reader.append(p)});
 const nav=document.createElement('div');nav.className='harpa-pagination';const index=hymns.indexOf(hymn);for(const [label,i] of [['← Hino anterior',index-1],['Próximo hino →',index+1]]){const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.disabled=!hymns[i];btn.onclick=()=>show(hymns[i]);nav.append(btn)}reader.append(nav);h.tabIndex=-1;h.focus({preventScroll:true});
}
function list(){
 const query=norm(by('harpa-query').value.trim()),filtered=hymns.filter(h=>(!onlyFavorites||favorites.includes(h.number))&&(!query||String(h.number)===query||norm(h.title).includes(query)));
 const out=by('harpa-results');out.replaceChildren();by('harpa-count').textContent=hymns.length?filtered.length+' hinos encontrados · '+hymns.length+' neste aparelho':'Nenhum acervo importado. Importe um arquivo de hinos para começar.';
 for(const hymn of filtered){const btn=document.createElement('button');btn.type='button';btn.textContent=(favorites.includes(hymn.number)?'♥ ':'')+hymn.number+' — '+hymn.title;btn.onclick=()=>{show(hymn);by('harpa-reader').scrollIntoView({block:'start',behavior:'smooth'})};out.append(btn)}
}
by('harpa-form').onsubmit=e=>{e.preventDefault();list();const q=by('harpa-query').value.trim();const found=hymns.filter(h=>String(h.number)===q||norm(h.title)===norm(q));if(found.length===1){show(found[0]);by('harpa-reader').scrollIntoView({block:'start',behavior:'smooth'})}};
by('harpa-query').oninput=list;by('harpa-favorites').onclick=()=>{onlyFavorites=!onlyFavorites;by('harpa-favorites').setAttribute('aria-pressed',String(onlyFavorites));by('harpa-favorites').textContent=onlyFavorites?'Mostrar todos':'Meus hinos favoritos';list()};
by('harpa-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(!by('harpa-permission').checked)throw Error('Confirme que você tem permissão para utilizar o acervo.');if(file.size>2*1024*1024)throw Error('Escolha um JSON de até 2 MB.');const imported=normalizeCollection(JSON.parse(await file.text()));localStorage.setItem(collectionKey,JSON.stringify(imported));hymns=imported;current=null;by('harpa-reader').hidden=true;list();status(imported.length+' hinos importados. Disponíveis neste navegador, inclusive sem internet.')}catch(err){status(err instanceof SyntaxError?'JSON inválido. Confira o formato do arquivo.':err.message)}finally{e.target.value=''}};
list();
})(typeof window!=='undefined'?window:globalThis);
