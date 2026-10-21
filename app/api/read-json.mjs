export class RequestBodyError extends Error {
  constructor(status) { super('Solicitação inválida.'); this.status = status }
}

// Enforce the byte limit while reading, including requests without Content-Length.
export async function readJson(request, limit) {
  const length = request.headers.get('content-length')
  if (length && Number(length) > limit) throw new RequestBodyError(413)
  if (!request.body) throw new RequestBodyError(400)
  const reader = request.body.getReader()
  const decoder = new TextDecoder('utf-8', {fatal:true})
  let size = 0, text = ''
  try {
    while (true) {
      const {value, done} = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new RequestBodyError(413)
      }
      text += decoder.decode(value, {stream:true})
    }
    text += decoder.decode()
    const result = JSON.parse(text)
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new RequestBodyError(400)
    return result
  } catch(error) {
    if (error instanceof RequestBodyError) throw error
    throw new RequestBodyError(400)
  } finally { reader.releaseLock() }
}
