import {createHmac,timingSafeEqual} from 'node:crypto';
import {seed,makeCases} from '../app/engine.js';
import {orchestrate,validatePlan} from '../app/agent.js';

export function verifySignature(body,signature,secret){
 if(!secret || typeof signature!=='string'||!/^sha256=[a-f0-9]{64}$/i.test(signature))return false;
 const actual=Buffer.from(signature.slice(7),'hex');const expected=createHmac('sha256',secret).update(body).digest();
 return actual.length===expected.length && timingSafeEqual(actual,expected);
}
export function extractMessages(payload){
 const output=[];
 for(const entry of payload?.entry||[])for(const change of entry.changes||[]){
  if(change.field!=='messages')continue;
  for(const msg of change.value?.messages||[]){
   if(typeof msg.id!=='string'||typeof msg.from!=='string')continue;
   output.push({id:msg.id,from:msg.from,type:msg.type,text:msg.type==='text'?msg.text?.body:undefined});
  }
 }
 return output;
}
export async function classifyLocally(question,fetcher=fetch){
 const res=await fetcher('http://127.0.0.1:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(6000),body:JSON.stringify({model:process.env.BIZ_OLLAMA_MODEL||'qwen2.5-coder:7b',format:'json',stream:false,options:{temperature:0},messages:[{role:'system',content:'Classify the question into zero or more tasks from sales, cash, stock, udhaar, staff. Return JSON only: {"tasks":["cash","stock"]}. Unsupported requests: {"tasks":[]}. Do not answer or calculate.'},{role:'user',content:question}]})});
 if(!res.ok)throw Error('classifier unavailable');const data=await res.json();return {tasks:validatePlan(data.message?.content)};
}
export async function answerMessage(msg,{classify=classifyLocally}={}){
 if(msg.type!=='text'||typeof msg.text!=='string')return 'Namaste! Abhi main sirf text messages samajhta hoon. Sales, cash, stock, udhaar ya staff ke baare mein likhiye. Voice notes jaldi aayenge.';
 if(msg.text.length>500)return 'Sawaal 500 characters se chhota rakhiye.';
 const text=msg.text.trim();if(!text)return 'Namaste! Apne dhandhe ke baare mein sawaal likhiye.';
 const results=await orchestrate(text,seed,makeCases(seed),classify);
 return `*BIz demo · sample shop data*\n\n${results.results.map(r=>r.text).join('\n\n')}\n\nYeh sample numbers hain; koi real payment, order ya message BIz ne nahi bheja.`;
}
export async function sendText({to,text,phoneNumberId,token,apiVersion,fetcher=fetch}){
 const res=await fetcher(`https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneNumberId)}/messages`,{method:'POST',headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',recipient_type:'individual',to,type:'text',text:{preview_url:false,body:text.slice(0,4096)}}),signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw Error(`WhatsApp send failed (HTTP ${res.status})`);
 return res.json();
}
// The cache prevents duplicate sends within one running process; persistent queues are needed in production.
export function createProcessor({allowedSenders,send,answer=answerMessage,limit=2000}){
 const processed=new Map();
 return async function process(msg){
  if(!allowedSenders.has(msg.from))return 'ignored';
  if(processed.has(msg.id)){await processed.get(msg.id);return 'duplicate'}
  const pending=(async()=>{const text=await answer(msg);await send(msg.from,text)})();processed.set(msg.id,pending);
  try{await pending;if(processed.size>limit)processed.delete(processed.keys().next().value);return 'sent'}catch(e){processed.delete(msg.id);throw e}
 };
}
