import twilio from 'twilio';
import {answerMessage} from '../whatsapp/bot.js';

export function validTwilioRequest(token,signature,url,params){
 if(!token||!signature||!url)return false;
 return twilio.validateRequest(token,signature,url,params);
}
export function parseTwilioForm(body){
 const params={};
 for(const [key,value] of new URLSearchParams(body)){
  if(Object.hasOwn(params,key))throw new Error('Duplicate form parameter');
  params[key]=value;
 }
 return params;
}
export async function replyToMessage(params,allowed,answer=answerMessage){
 const response=new twilio.twiml.MessagingResponse();
 if(!allowed.has(params.From)||!params.From?.startsWith('whatsapp:'))return response.toString();
 const message={type:params.NumMedia&&params.NumMedia!=='0'?'media':'text',text:params.Body};
 response.message((await answer(message)).slice(0,1600));
 return response.toString();
}
