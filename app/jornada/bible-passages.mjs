export function biblePassages(reference) {
  let book = ''
  return reference.split(';').map(part => {
    const text = part.trim()
    const full = /^(.*?)\s+(\d+(?:[–-]\d+)?)$/.exec(text)
    if (full) book = full[1]
    const chapters = full ? full[2] : text
    if (!book || !/^\d+(?:[–-]\d+)?$/.test(chapters)) throw new Error('Referência bíblica inválida')
    return {
      label: `${book} ${chapters}`,
      href: '/biblia/leitor/index.html?q=' + encodeURIComponent(`${book} ${chapters.split(/[–-]/)[0]}`)
    }
  })
}
