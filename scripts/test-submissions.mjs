import test from 'node:test'
import assert from 'node:assert/strict'
import {createSubmissionSender} from '../app/submission.mjs'
import {readJson} from '../app/api/read-json.mjs'

test('retry only the failed newsletter after a confirmed registration', async () => {
  const calls = []; let fail = true
  const submit = createSubmissionSender(async path => {
    calls.push(path)
    return {ok: !(path.endsWith('newsletter') && fail)}
  })
  const payload = {registration:{email:'test@example.invalid',prayer:'Teste sintético'}, newsletter:{email:'test@example.invalid',consent:true}}
  await assert.rejects(submit(payload), /cadastro foi recebido/)
  fail = false
  assert.deepEqual(await submit(payload), {registered:true})
  assert.deepEqual(calls, ['/api/community-registration','/api/newsletter','/api/newsletter'])
  await submit({...payload,registration:{...payload.registration,prayer:'Outro pedido'}})
  assert.equal(calls.filter(p=>p.endsWith('community-registration')).length,2)
})
test('concurrent clicks share one request', async () => {
  let release, calls=0
  const submit=createSubmissionSender(()=>{calls++;return new Promise(resolve=>{release=resolve})})
  const first=submit({newsletter:{email:'test@example.invalid'}})
  const second=submit({newsletter:{email:'test@example.invalid'}})
  assert.equal(first,second)
  release({ok:true}); await first; assert.equal(calls,1)
})
test('failed registration can be retried and does not send newsletter', async () => {
  let fail=true; const calls=[]
  const submit=createSubmissionSender(async path=>{calls.push(path);return {ok:!fail}})
  const data={registration:{email:'test@example.invalid'},newsletter:{email:'test@example.invalid'}}
  await assert.rejects(submit(data)); assert.equal(calls.length,1)
  fail=false; await submit(data); assert.equal(calls.length,3)
})
test('bounded parser accepts valid JSON and rejects invalid shapes', async () => {
  const request=body=>new Request('https://example.invalid',{method:'POST',body})
  assert.deepEqual(await readJson(request('{"name":"João"}'),100),{name:'João'})
  for(const body of ['null','[]','{']) await assert.rejects(readJson(request(body),100),e=>e.status===400)
  await assert.rejects(readJson(request('{"name":"éééé"}'),12),e=>e.status===413)
})
test('oversized chunked input is cancelled before reading the complete stream', async () => {
  let cancelled=false
  const stream=new ReadableStream({pull(controller){controller.enqueue(new Uint8Array(20))},cancel(){cancelled=true}})
  const request=new Request('https://example.invalid',{method:'POST',body:stream,duplex:'half'})
  await assert.rejects(readJson(request,10),e=>e.status===413)
  assert.equal(cancelled,true)
})
