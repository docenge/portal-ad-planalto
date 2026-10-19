'use client'
import {useEffect,useState} from 'react'
export default function ThemeToggle(){
 const[dark,setDark]=useState(false)
 useEffect(()=>{
  const sync=()=>setDark(document.documentElement.dataset.theme==='dark')
  sync()
  const media=window.matchMedia('(prefers-color-scheme: dark)')
  const system=()=>{try{if(localStorage.getItem('adp-theme'))return}catch{}document.documentElement.dataset.theme=media.matches?'dark':'light';sync()}
  const storage=event=>{if(event.key!=='adp-theme')return;const theme=['dark','light'].includes(event.newValue)?event.newValue:media.matches?'dark':'light';document.documentElement.dataset.theme=theme;sync()}
  media.addEventListener('change',system);window.addEventListener('storage',storage)
  return()=>{media.removeEventListener('change',system);window.removeEventListener('storage',storage)}
 },[])
 function toggle(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;setDark(next==='dark');try{localStorage.setItem('adp-theme',next)}catch{}}
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark?'Ativar tema claro':'Ativar tema escuro'} title={dark?'Ativar tema claro':'Ativar tema escuro'}><span aria-hidden="true">{dark?'☀':'☾'}</span><span className="theme-label">{dark?'Claro':'Escuro'}</span></button>
}
