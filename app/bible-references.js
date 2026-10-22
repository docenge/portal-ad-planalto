import Link from 'next/link'

// Keep abbreviated follow-up chapters tied to the preceding book.
export function referenceParts(text) {
 let book='',chapter=''
 return text.split(/;\s*/).flatMap(part=>{
  const match=/^((?:[1-3]\s+)?[^\d]+?)\s+(\d.*)$/.exec(part.trim())
  if(match){book=match[1].trim();part=match[2]}
  return part.split(/,\s*/).map((numbers,i)=>{
   if(numbers.includes(':'))chapter=numbers.split(':')[0]
   const reference=book+' '+(i>0&&chapter&&!numbers.includes(':')?chapter+':':'')+numbers.trim()
   return {label:reference.trim(),href:'/biblia/leitor/index.html?q='+encodeURIComponent(reference.trim())}
  })
 })
}
export default function BibleReferences({text}) {
 return <>{referenceParts(text).map((item,i)=><span key={item.href}>{i>0?'; ':''}<Link href={item.href} className="scripture-reference" aria-label={'Ler '+item.label+' na Bíblia ADP'}>{item.label}</Link></span>)}</>
}
