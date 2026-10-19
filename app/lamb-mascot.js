'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import './lamb-mascot.css'

function constrain(x,y,width,height) {
  return { x: Math.max(0,Math.min(x,window.innerWidth-width)), y: Math.max(0,Math.min(y,window.innerHeight-height)) }
}
export default function LambMascot() {
  const pathname=usePathname(), root=useRef(null), drag=useRef(null), current=useRef(null), bleated=useRef(false), sound=useRef(null)
  const [visible,setVisible]=useState(true),[position,setPosition]=useState(null),[dragging,setDragging]=useState(false)
  function move(x,y) {
    const rect=root.current?.getBoundingClientRect();if(!rect)return
    const next=constrain(x,y,rect.width,rect.height);current.current=next;setPosition(next)
    return next
  }
  function save() { try { if(current.current)sessionStorage.setItem('adp-lamb-position',JSON.stringify(current.current)) } catch {} }
  useEffect(()=>{
    try {
      bleated.current=sessionStorage.getItem('adp-lamb-bleated')==='true'
      if(sessionStorage.getItem('adp-lamb-hidden')==='true')setVisible(false)
      const stored=JSON.parse(sessionStorage.getItem('adp-lamb-position')||'null')
      if(stored&&Number.isFinite(stored.x)&&Number.isFinite(stored.y))move(stored.x,stored.y)
    }catch{}
    const resize=()=>{if(current.current){move(current.current.x,current.current.y);save()}}
    window.addEventListener('resize',resize)
    return ()=>{window.removeEventListener('resize',resize);sound.current?.close().catch(()=>{})}
  },[])
  if(!visible||pathname.startsWith('/admin')||pathname.startsWith('/biblia'))return null
  function begin(event){
    if(!event.isPrimary||event.button!==0)return
    const rect=root.current.getBoundingClientRect()
    drag.current={id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,moved:false}
    event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);event.preventDefault()
  }
  function update(event){
    const active=drag.current;if(!active||active.id!==event.pointerId)return
    if(Math.hypot(event.clientX-active.x,event.clientY-active.y)>6)active.moved=true
    move(active.left+event.clientX-active.x,active.top+event.clientY-active.y)
  }
  function end(event){
    if(drag.current?.id!==event.pointerId)return
    const tapped=!drag.current.moved&&event.type==='pointerup'
    drag.current=null;setDragging(false);save()
    if(tapped)bleat()
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)
  }
  async function bleat(){
    if(bleated.current)return
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return
    bleated.current=true
    let context
    try{
      context=new Audio();sound.current=context;await context.resume()
      if(context.state!=='running'){bleated.current=false;context.close().catch(()=>{});return}
      try{sessionStorage.setItem('adp-lamb-bleated','true')}catch{}
      const now=context.currentTime
      for(const offset of [0,.72]){
        const voice=context.createOscillator(),vibrato=context.createOscillator(),depth=context.createGain(),volume=context.createGain(),filter=context.createBiquadFilter()
        voice.type='sawtooth';voice.frequency.setValueAtTime(410,now+offset);voice.frequency.exponentialRampToValueAtTime(290,now+offset+.52)
        vibrato.frequency.value=10;depth.gain.value=24;vibrato.connect(depth);depth.connect(voice.frequency)
        filter.type='lowpass';filter.frequency.value=1600;filter.Q.value=1.8
        volume.gain.setValueAtTime(0,now+offset);volume.gain.linearRampToValueAtTime(.055,now+offset+.05);volume.gain.setValueAtTime(.045,now+offset+.36);volume.gain.exponentialRampToValueAtTime(.001,now+offset+.56)
        voice.connect(filter);filter.connect(volume);volume.connect(context.destination)
        voice.start(now+offset);vibrato.start(now+offset);voice.stop(now+offset+.58);vibrato.stop(now+offset+.58)
        if(offset>0)voice.onended=()=>{context.close().catch(()=>{});if(sound.current===context)sound.current=null}
      }
    }catch{bleated.current=false;context?.close().catch(()=>{});sound.current=null}
  }
  function keyboard(event){
    const directions={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]},delta=directions[event.key]
    if(!delta)return
    event.preventDefault();const rect=root.current.getBoundingClientRect();move(rect.left+delta[0],rect.top+delta[1]);save()
  }
  return <aside ref={root} className={'lamb-mascot'+(dragging?' is-dragging':'')} aria-label="Ovelhinha do site" style={position?{left:position.x,top:position.y,right:'auto',bottom:'auto'}:undefined}>
    <button type="button" className="lamb-close" aria-label="Ocultar ovelhinha nesta visita" onClick={()=>{setVisible(false);try{sessionStorage.setItem('adp-lamb-hidden','true')}catch{}}}>×</button>
    <button type="button" className="lamb-character" aria-label="Mover ovelhinha: arraste ou use as teclas de seta" onPointerDown={begin} onPointerMove={update} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={keyboard} onClick={event=>{if(event.detail===0)bleat()}}><img src="/images/ovelhinha-adp.webp" width="112" height="112" alt="Ovelhinha branca" draggable="false" /></button>
  </aside>
}
