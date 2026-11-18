import {test} from 'node:test';
import assert from 'node:assert/strict';
import twilio from 'twilio';
import {validTwilioRequest,parseTwilioForm,replyToMessage} from './handler.js';
test('accepts a valid Twilio signature and rejects altered parameters',()=>{const token='secret',url='https://example.com/twilio',params={From:'whatsapp:+919999999999',Body:'cash'};const signature=twilio.getExpectedTwilioSignature(token,url,params);assert.equal(validTwilioRequest(token,signature,url,params),true);assert.equal(validTwilioRequest(token,signature,url,{...params,Body:'stock'}),false)});
test('rejects duplicate form keys',()=>assert.throws(()=>parseTwilioForm('Body=a&Body=b')));
test('answers only allowlisted private sender and XML escapes content',async()=>{const allow=new Set(['whatsapp:+919999999999']),answer=async()=>'<cash & stock>';const xml=await replyToMessage({From:'whatsapp:+919999999999',Body:'cash'},allow,answer);assert.match(xml,/&lt;cash &amp; stock&gt;/);const denied=await replyToMessage({From:'whatsapp:+911111111111',Body:'cash'},allow,answer);assert.doesNotMatch(denied,/<Message>/)});
