import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const source=readFileSync(new URL('../api/chat.js',import.meta.url),'utf8');
function handler(fetchImpl){const context={module:{exports:{}},require:createRequire(import.meta.url),Buffer,process:{env:{BIZ_ACCESS_CODE:'secret',INCEPTION_API_KEY:'test'}},fetch:fetchImpl,AbortSignal};vm.runInNewContext(source,context);return context.module.exports}
function response(){return {setHeader(){},status(n){this.code=n;return this},json(value){this.value=value;return this}}}
const request={method:'POST',headers:{'x-biz-code':'secret'},body:{question:'I am worried about sales',evidence:'Sample sales are ₹100.',history:[]}};
test('model request works without a demo access code',async()=>{let called=false;const h=handler(async()=>{called=true;return {ok:false}});const r=response();await h({...request,headers:{}},r);assert.equal(r.code,503);assert.equal(called,true)});
test('returns generated answer and sentiment',async()=>{const h=handler(async()=>({ok:true,json:async()=>({choices:[{message:{content:'{"answer":"I understand your concern.","sentiment":"negative"}'}}]})}));const r=response();await h(request,r);assert.equal(r.code,200);assert.equal(r.value.sentiment,'negative');assert.match(r.value.answer,/concern/)});
test('handles malformed model output and invalid data without fabricating an answer',async()=>{const h=handler(async()=>({ok:true,json:async()=>({choices:[{message:{content:'invalid'}}]})}));let r=response();await h(request,r);assert.equal(r.code,503);r=response();await h({...request,body:{...request.body,question:'x'.repeat(501)}},r);assert.equal(r.code,400)});
