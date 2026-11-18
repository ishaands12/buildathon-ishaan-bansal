import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const source=readFileSync(new URL('../api/intent.js',import.meta.url),'utf8');
function handler(fetchImpl){const context={module:{exports:{}},require:createRequire(import.meta.url),Buffer,process:{env:{BIZ_ACCESS_CODE:'secret',INCEPTION_API_KEY:'test'}},fetch:fetchImpl,AbortSignal};vm.runInNewContext(source,context);return context.module.exports}
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(value){this.value=value;return this}}}
test('classifier requires the owner access code before calling provider',async()=>{let called=false;const h=handler(()=>{called=true});const r=response();await h({method:'POST',headers:{},body:{question:'sales'}},r);assert.equal(r.code,401);assert.equal(called,false)});
test('classifier returns only allowlisted tasks',async()=>{const h=handler(async()=>({ok:true,json:async()=>({choices:[{message:{content:'{"tasks":["sales","send_money","cash"]}'}}]})}));const r=response();await h({method:'POST',headers:{'x-biz-code':'secret'},body:{question:'sales and cash'}},r);assert.equal(r.code,200);assert.equal(JSON.stringify(r.value.tasks),'["sales","cash"]')});
test('classifier fails closed when provider is unavailable',async()=>{const h=handler(async()=>({ok:false}));const r=response();await h({method:'POST',headers:{'x-biz-code':'secret'},body:{question:'sales'}},r);assert.equal(r.code,503)});
