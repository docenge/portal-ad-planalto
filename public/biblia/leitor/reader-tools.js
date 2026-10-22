/* Bíblia ADP • GPL-3.0-or-later */
(()=>{
const by=id=>document.getElementById(id),message=text=>by('backup-status').textContent=text;
const focus=by('reading-focus');focus.onclick=()=>{const enabled=document.body.classList.toggle('reading-focus');focus.textContent=enabled?'Voltar à tela completa':'Modo de leitura';focus.setAttribute('aria-pressed',String(enabled));if(enabled)by('heading').scrollIntoView({block:'start',behavior:'smooth'})};
by('backup-export').onclick=()=>{try{
 const data={format:'biblia-adp-backup',version:1,createdAt:new Date().toISOString(),favorites:read('bv-favorites',{}),notes:read('bv-notes',{}),harpa:read('adp-harpa-collection',[]),harpaFavorites:read('adp-harpa-favorites',[])};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='biblia-adp-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Backup preparado. Guarde o arquivo em um lugar seguro. Ele contém suas anotações e favoritos.');
}catch{message('Não foi possível preparar o backup neste navegador.')}};
by('backup-import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{
 if(!books.length)throw Error('Aguarde o carregamento da Bíblia.');if(file.size>6*1024*1024)throw Error('Escolha um backup de até 6 MB.');const data=JSON.parse(await file.text());if(data.format!=='biblia-adp-backup'||data.version!==1)throw Error('Este arquivo não é um backup da Bíblia ADP.');
 const validPosition=(bi,ci)=>Number.isInteger(bi)&&Number.isInteger(ci)&&!!books[bi]?.chapters[ci];
 const addedNotes={};if(!data.notes||typeof data.notes!=='object'||Array.isArray(data.notes))throw Error('Anotações inválidas.');for(const [k,v]of Object.entries(data.notes)){const m=/^(\d+):(\d+)$/.exec(k);if(!m||!validPosition(+m[1],+m[2])||typeof v!=='string'||v.length>50000)throw Error('O backup tem anotações inválidas.');addedNotes[k]=v}
 const addedFavorites={};if(!data.favorites||typeof data.favorites!=='object'||Array.isArray(data.favorites))throw Error('Favoritos inválidos.');for(const value of Object.values(data.favorites)){if(!value||!validPosition(value.b,value.c)||!Number.isInteger(value.verse))throw Error('Versículo favorito inválido.');const verse=books[value.b].chapters[value.c].verses.find(v=>v.verse===value.verse);if(!verse)throw Error('Versículo favorito inexistente.');addedFavorites[`${value.b}:${value.c}:${value.verse}`]={b:value.b,c:value.c,verse:value.verse,name:verse.name,text:verse.text}}
 const restoredHarpa=Array.isArray(data.harpa)&&data.harpa.length?ADPHarpa.normalizeCollection(data.harpa):[];
 const existingHarpa=read('adp-harpa-collection',[]);const mergedHarpa=[...new Map([...restoredHarpa,...(Array.isArray(existingHarpa)?existingHarpa:[])].map(h=>[h.number,h])).values()].sort((a,b)=>a.number-b.number);
 const hymnFavorites=Array.isArray(data.harpaFavorites)?data.harpaFavorites.filter(n=>Number.isInteger(n)&&n>=1&&n<=640):[];
 const nextNotes={...addedNotes,...notes},nextSaved={...addedFavorites,...saved};const entries={'bv-notes':nextNotes,'bv-favorites':nextSaved,'adp-harpa-collection':mergedHarpa,'adp-harpa-favorites':[...new Set([...hymnFavorites,...read('adp-harpa-favorites',[])])]};
 // Roll back on storage quota errors; validate everything before the first write.
 const previous=Object.fromEntries(Object.keys(entries).map(k=>[k,localStorage.getItem(k)]));try{for(const [k,v]of Object.entries(entries))localStorage.setItem(k,JSON.stringify(v))}catch(err){for(const [k,v]of Object.entries(previous)){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}throw err}
 notes=nextNotes;saved=nextSaved;render();message('Backup restaurado. Os dados que já estavam neste aparelho foram preservados. Reabra a Bíblia para atualizar a lista da Harpa.');
}catch(err){message(err instanceof SyntaxError?'O arquivo de backup não é um JSON válido.':err.name==='QuotaExceededError'?'Sem espaço no navegador para restaurar o backup.':err.message)}finally{e.target.value=''}};
const noteState=by('note-status');by('note').addEventListener('input',()=>{try{const stored=JSON.parse(localStorage.getItem('bv-notes')||'{}');noteState.textContent=stored[`${b}:${c}`]===by('note').value?'Anotação salva neste aparelho.':'Não foi possível salvar. Faça uma cópia da anotação.'}catch{noteState.textContent='Não foi possível salvar. Faça uma cópia da anotação.'}});
})();
