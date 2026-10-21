// Keep confirmed steps in memory only. A retry of the e-mail step must not
// resend personal details or a prayer that the server already accepted.
export function createSubmissionSender(send = fetch) {
  let confirmedRegistration = null
  let pending = null
  function submit({registration, newsletter}) {
    if (pending) return pending
    pending = (async () => {
      let registered = false
      async function post(path, body, message) {
        let response
        try {
          response = await send(path, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body), signal:AbortSignal.timeout(20000)})
        } catch { throw new Error(message) }
        if (!response.ok) throw new Error(message)
      }
      if (registration) {
        const signature = JSON.stringify(registration)
        if (confirmedRegistration !== signature) {
          await post('/api/community-registration', registration, 'Não foi possível confirmar o cadastro. Tente novamente mais tarde.')
          confirmedRegistration = signature
        }
        registered = true
      }
      if (newsletter) {
        await post('/api/newsletter', newsletter, registered
          ? 'Seu cadastro foi recebido. Apenas a inscrição por e-mail falhou; tente novamente para repetir somente essa etapa.'
          : 'Não foi possível solicitar a inscrição. Tente novamente mais tarde.')
      }
      return {registered}
    })().finally(() => { pending = null })
    return pending
  }
  return submit
}
