/* Bíblia ADP • GPL-3.0-or-later */
(()=>{
const status=document.getElementById('install-status'),button=document.getElementById('install-app'),update=document.getElementById('update-app');let prompt=null,registration=null,reloading=false;
const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const say=text=>{if(status)status.textContent=text};
if(installed())button.textContent='Aplicativo instalado';
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;button.hidden=false;button.textContent='Instalar Bíblia ADP'});
window.addEventListener('appinstalled',()=>{prompt=null;button.textContent='Aplicativo instalado';say('Bíblia ADP adicionada aos seus aplicativos.')});
button.onclick=async()=>{if(installed()){say('Você já está usando o aplicativo instalado.');return}if(prompt){const current=prompt;prompt=null;await current.prompt();const result=await current.userChoice;say(result.outcome==='accepted'?'Instalação solicitada. Confira os aplicativos do aparelho.':'Instalação cancelada. Você pode continuar lendo aqui.')}else{document.getElementById('install-help').open=true;say('Veja abaixo como adicionar a Bíblia ADP à tela inicial.')}};
update.onclick=async()=>{if(!registration){say('A atualização pelo navegador ainda não está disponível.');return}try{await registration.update();say(registration.installing?'Baixando a atualização…':'Verificação concluída. Novas versões serão aplicadas automaticamente.')}catch{say('Não foi possível verificar a atualização. Confira a internet.')}};
const hadController=Boolean(navigator.serviceWorker?.controller);
navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(hadController&&!reloading){reloading=true;location.reload()}});
if(!('serviceWorker' in navigator)||!location.protocol.startsWith('http')){say('Leitura local disponível. Para instalar, abra a Bíblia ADP pelo site.');return}
say('Preparando a Bíblia para leitura sem internet…');
navigator.serviceWorker.register('./sw.js').then(async reg=>{registration=reg;await navigator.serviceWorker.ready;const bibleURL=new URL('./biblia.json',location.href).href;const cached=await caches.match(bibleURL);say(cached?'Bíblia completa disponível neste aparelho para leitura sem internet.':'Abra a Bíblia com internet para preparar a leitura offline.');}).catch(()=>say('Leitura online disponível. Não foi possível preparar o modo offline.'));
})();
