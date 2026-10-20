'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import './lamb-mascot.css'

function constrain(x,y,width,height) {
  return { x: Math.max(0,Math.min(x,window.innerWidth-width)), y: Math.max(0,Math.min(y,window.innerHeight-height)) }
}
export default function LambMascot() {
  const pathname=usePathname(), root=useRef(null), drag=useRef(null), current=useRef(null), sound=useRef(null), suppressClick=useRef(false), hopTimer=useRef(null)
  const [visible,setVisible]=useState(true),[position,setPosition]=useState(null),[dragging,setDragging]=useState(false),[hopping,setHopping]=useState(false)
  function move(x,y) {
    const rect=root.current?.getBoundingClientRect();if(!rect)return
    const next=constrain(x,y,rect.width,rect.height);current.current=next;setPosition(next)
    return next
  }
  function save() { try { if(current.current)sessionStorage.setItem('adp-lamb-position',JSON.stringify(current.current)) } catch {} }
  useEffect(()=>{
    try {
      if(sessionStorage.getItem('adp-lamb-hidden')==='true')setVisible(false)
      const stored=JSON.parse(sessionStorage.getItem('adp-lamb-position')||'null')
      if(stored&&Number.isFinite(stored.x)&&Number.isFinite(stored.y))move(stored.x,stored.y)
    }catch{}
    const resize=()=>{if(current.current){move(current.current.x,current.current.y);save()}}
    window.addEventListener('resize',resize)
    const hide=()=>{if(document.hidden)sound.current?.pause()};document.addEventListener('visibilitychange',hide)
    return ()=>{window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',hide);clearTimeout(hopTimer.current);sound.current?.pause()}
  },[])
  if(!visible||pathname.startsWith('/admin')||pathname.startsWith('/biblia'))return null
  function begin(event){
    if(!event.isPrimary||event.button!==0)return
    suppressClick.current=false
    const rect=root.current.getBoundingClientRect()
    drag.current={id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,moved:false}
    event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);event.preventDefault()
  }
  function update(event){
    const active=drag.current;if(!active||active.id!==event.pointerId)return
    if(Math.hypot(event.clientX-active.x,event.clientY-active.y)>6){active.moved=true;suppressClick.current=true}
    move(active.left+event.clientX-active.x,active.top+event.clientY-active.y)
  }
  function end(event){
    if(drag.current?.id!==event.pointerId)return
    if(event.type!=='pointerup')suppressClick.current=true
    drag.current=null;setDragging(false);save()
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)
  }
  function bleat(){
    if(suppressClick.current){suppressClick.current=false;return}
    setHopping(false);clearTimeout(hopTimer.current)
    requestAnimationFrame(()=>{setHopping(true);hopTimer.current=setTimeout(()=>setHopping(false),650)})
    try{
      if(!sound.current){sound.current=new Audio('/sounds/ovelhinha.mp3');sound.current.preload='auto';sound.current.volume=.55}
      sound.current.pause();sound.current.currentTime=0
      const playing=sound.current.play();if(playing?.catch)playing.catch(()=>{})
    }catch{}
  }
  function keyboard(event){
    if(event.key==='Enter'||event.key===' ')suppressClick.current=false
    const directions={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]},delta=directions[event.key]
    if(!delta)return
    event.preventDefault();const rect=root.current.getBoundingClientRect();move(rect.left+delta[0],rect.top+delta[1]);save()
  }
  return <aside ref={root} className={'lamb-mascot'+(dragging?' is-dragging':'')} aria-label="Ovelhinha do site" style={position?{left:position.x,top:position.y,right:'auto',bottom:'auto'}:undefined}>
    <button type="button" className="lamb-close" aria-label="Ocultar ovelhinha nesta visita" onClick={()=>{setVisible(false);try{sessionStorage.setItem('adp-lamb-hidden','true')}catch{}}}>×</button>
    <button type="button" className={'lamb-character'+(hopping?' lamb-hop':'')} aria-label="Ovelhinha: toque para ouvir ou arraste para mover" onPointerDown={begin} onPointerMove={update} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={keyboard} onClick={bleat}><img src="/images/ovelhinha-adp.webp" width="112" height="112" alt="Ovelhinha branca" draggable="false" /></button>
  </aside>
}
