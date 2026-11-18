import {respond, getIntent} from './engine.js';
// The planner may select only these specialists. It never computes financial values.
export const SPECIALISTS = Object.freeze(['sales','cash','stock','udhaar','staff']);
const signals={
 sales:/sale|revenue|bikri|बिक्री|बिकरी|सेल/i,
 cash:/cash|upi|payment|settle|mismatch|कैश|नकद|यूपीआई|पेमेंट/i,
 stock:/stock|atta|order|samaan|saman|स्टॉक|आटा|सामान/i,
 udhaar:/udhaar|udhar|credit|due|outstanding|receiv|उधार|बकाया|वसूली/i,
 staff:/staff|team|employee|aman|pooja|ravi|स्टाफ|कर्मचारी|टीम|अमन|पूजा/i,
};
export function validatePlan(raw){
 try{const plan=typeof raw==='string'?JSON.parse(raw):raw;const values=Array.isArray(plan?.tasks)?plan.tasks:[];return [...new Set(values.filter(x=>SPECIALISTS.includes(x)))].slice(0,5)}catch{return []}
}
export function fallbackPlan(question){
 const tasks=SPECIALISTS.filter(key=>signals[key].test(question));
 if(tasks.length)return tasks;
 const intent=getIntent(question);return SPECIALISTS.includes(intent)?[intent]:[];
}
export async function orchestrate(question,data,cases,classify){
 let modelPlan=[];let source='local rules';
 if(classify){try{modelPlan=validatePlan(await classify(question));if(modelPlan.length)source='local model'}catch{}}
 const tasks=[...new Set([...modelPlan,...fallbackPlan(question)])].slice(0,5);
 if(!tasks.length)return {tasks:[],source,results:[{agent:'unknown',text:respond(question,data,cases,'unknown'),caseId:null}]};
 const results=await Promise.all(tasks.map(async agent=>({agent,text:respond(question,data,cases,agent),caseId:agent==='cash'?cases.find(c=>c.id==='reconcile')?.id:agent==='stock'?cases.find(c=>c.area==='Inventory')?.id:agent==='udhaar'?cases.find(c=>c.id==='udhaar')?.id:null})));
 return {tasks,source,results};
}
