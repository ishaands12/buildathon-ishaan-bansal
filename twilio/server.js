import http from 'node:http';
import {validTwilioRequest,parseTwilioForm,replyToMessage} from './handler.js';
const {TWILIO_AUTH_TOKEN:token,TWILIO_WEBHOOK_URL:url,TWILIO_ALLOWED_SENDERS:senders}=process.env;
const port=Number(process.env.TWILIO_PORT||8788),host=process.env.TWILIO_HOST||'127.0.0.1';
if(!token||!url?.startsWith('https://')||!senders){console.error('Missing Twilio configuration. See .env.example and README.');process.exit(1)}
const allowed=new Set(senders.split(',').map(s=>s.trim()).filter(s=>/^whatsapp:\+[1-9]\d{6,14}$/.test(s)));
if(!allowed.size){console.error('Set TWILIO_ALLOWED_SENDERS to your WhatsApp number in whatsapp:+countrycode format.');process.exit(1)}
const target=new URL(url);if(target.pathname!=='/twilio'||target.search||target.hash){console.error('TWILIO_WEBHOOK_URL must end in /twilio without a query or fragment.');process.exit(1)}
http.createServer(async(req,res)=>{
 try{
  if(req.method==='GET'&&req.url==='/health'){res.writeHead(200).end('ok');return}
  if(req.method!=='POST'||req.url!=='/twilio'){res.writeHead(404).end();return}
  if(!req.headers['content-type']?.startsWith('application/x-www-form-urlencoded')){res.writeHead(415).end();return}
  let size=0,body='';for await(const chunk of req){size+=chunk.length;if(size>65536){res.writeHead(413).end();return}body+=chunk.toString('utf8')}
  let params;try{params=parseTwilioForm(body)}catch{res.writeHead(400).end();return}
  if(!validTwilioRequest(token,req.headers['x-twilio-signature'],url,params)){res.writeHead(403).end();return}
  const xml=await replyToMessage(params,allowed);
  res.writeHead(200,{'Content-Type':'text/xml; charset=utf-8','Cache-Control':'no-store'}).end(xml);
 }catch(error){console.error('Webhook failed:',error.message);if(!res.headersSent)res.writeHead(500).end()}
}).listen(port,host,()=>console.log(`BIz Twilio webhook listening on ${host}:${port}`));
