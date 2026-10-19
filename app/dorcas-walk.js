'use client'
import { useEffect, useRef, useState } from 'react'
import './dorcas-walk.css'

// Points on the original 1536×1024 hero image, following its path toward the cross.
export const DORCAS_PATH = [[850,1030,1],[920,900,.77],[1040,780,.52],[1020,680,.34],[1140,580,.21],[1230,470,.10],[1335,388,.025]]
export default function DorcasWalk() {
  const marker = useRef(null), motion = useRef(null), cleanup = useRef(null), [active,setActive] = useState(false), [ratio,setRatio] = useState(.5), [message,setMessage] = useState('')
  useEffect(() => {
    const asset = new Image(); asset.onload=()=>setRatio(asset.naturalWidth / 4 / asset.naturalHeight); asset.src='/images/dorcas-caminhando.webp'
    function finish() { motion.current?.cancel(); motion.current=null; cleanup.current?.(); cleanup.current=null; setActive(false); marker.current?.closest('.hero')?.classList.remove('dorcas-journey-mode') }
    function start() {
      finish()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setMessage('A irmã Dorcas se despede: até mais!'); return }
      const hero=marker.current?.closest('.hero');if(!hero)return
      hero.classList.add('dorcas-journey-mode');hero.scrollIntoView({behavior:'smooth',block:'start'});setActive(true);setMessage('A irmã Dorcas se despede e caminha pela trilha em direção à cruz.')
      const sprite=marker.current, image=hero.querySelector('.hero-image'), rect=hero.getBoundingClientRect(), fit=Math.max(rect.width/1536,rect.height/1024)
      const [px,py]=getComputedStyle(image).backgroundPosition.split(' ').map(value=>parseFloat(value)/100)
      const dx=(rect.width-1536*fit)*(Number.isFinite(px)?px:.5),dy=(rect.height-1024*fit)*(Number.isFinite(py)?py:.56)
      const frames=DORCAS_PATH.map(([x,y,scale],index)=>({left:(x*fit+dx)+'px',top:(y*fit+dy)+'px',transform:`translate(-50%, -100%) scale(${scale})`,opacity:index===DORCAS_PATH.length-1?0:1,offset:index/(DORCAS_PATH.length-1)}))
      if(!sprite.animate){finish();return}
      motion.current=sprite.animate(frames,{duration:16000,easing:'linear',fill:'forwards'})
      motion.current.onfinish=finish
      // A resized or rotated screen ends the optional animation rather than misaligning the path.
      const resize=()=>finish();window.addEventListener('resize',resize,{once:true});cleanup.current=()=>window.removeEventListener('resize',resize)
    }
    const stop=()=>finish(),hide=()=>{if(document.hidden)finish()}
    window.addEventListener('adp-dorcas-walk',start);window.addEventListener('adp-welcome-start',stop);document.addEventListener('visibilitychange',hide)
    return ()=>{finish();window.removeEventListener('adp-dorcas-walk',start);window.removeEventListener('adp-welcome-start',stop);document.removeEventListener('visibilitychange',hide)}
  },[])
  return <><span className="dorcas-scene-status" role="status">{message}</span><div ref={marker} aria-hidden="true" className={'dorcas-walker'+(active?' active':'')} style={{width:260*ratio,height:260}}><div className="dorcas-walk-sprite" /></div>{active&&<button type="button" className="dorcas-skip" onClick={()=>window.dispatchEvent(new CustomEvent('adp-welcome-start'))}>Pular despedida</button>}</>
}
