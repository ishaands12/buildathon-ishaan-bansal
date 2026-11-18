import http from 'node:http';
import {verifySignature,extractMessages,createProcessor,sendText} from './bot.js';
const {WHATSAPP_VERIFY_TOKEN:verifyToken,WHATSAPP_APP_SECRET:appSecret,WHATSAPP_ACCESS_TOKEN:token,WHATSAPP_PHONE_NUMBER_ID:phoneNumberId,WHATSAPP_ALLOWED_SENDERS:senders}=process.env;
const apiVersion=process.env.WHATSAPP_API_VERSION||'v27.0';
const port=Number(process.env.WHATSAPP_PORT||8788),host=process.env.WHATSAPP_HOST||'127.0.0.1';
if(!verifyToken||!appSecret||!token||!phoneNumberId||!senders||!/^v\d+\.\d+$/.test(apiVersion)||!/^\d+$/.test(phoneNumberId)){
 console.error('Missing or invalid WhatsApp configuration. See .env.example and README.');process.exit(1);
}
const allowedSenders=new Set(senders.split(',').map(x=>x.trim()).filter(x=>/^\d{6,15}$/.test(x)));
if(!allowedSenders.size){console.error('WHATSAPP_ALLOWED_SENDERS must contain at least one country-code phone number using digits only.');process.exit(1)}
const processMessage=createProcessor({allowedSenders,send:(to,text)=>sendText({to,text,phoneNumberId,token,apiVersion})});
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='GET'&&url.pathname==='/health'){res.writeHead(200).end('ok');return}
  if(req.method==='GET'&&url.pathname==='/webhook'){
   if(url.searchParams.get('hub.mode')==='subscribe'&&url.searchParams.get('hub.verify_token')===verifyToken){res.writeHead(200,{'Content-Type':'text/plain'}).end(url.searchParams.get('hub.challenge')||'');return}
   res.writeHead(403).end('Forbidden');return;
  }
  if(req.method!=='POST'||url.pathname!=='/webhook'){res.writeHead(404).end();return}
  const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1024*1024){res.writeHead(413).end();return}chunks.push(chunk)}
  const body=Buffer.concat(chunks);
  if(!verifySignature(body,req.headers['x-hub-signature-256'],appSecret)){res.writeHead(401).end('Invalid signature');return}
  let payload;try{payload=JSON.parse(body.toString('utf8'))}catch{res.writeHead(400).end('Invalid JSON');return}
  if(payload.object!=='whatsapp_business_account'){res.writeHead(400).end();return}
  for(const msg of extractMessages(payload))if(msg.phoneNumberId===phoneNumberId)await processMessage(msg);
  res.writeHead(200).end('EVENT_RECEIVED');
 }catch(error){console.error('Webhook processing failed:',error.message);if(!res.headersSent)res.writeHead(500).end('Retry later')}
});
server.listen(port,host,()=>console.log(`BIz WhatsApp webhook listening on ${host}:${port}`));
