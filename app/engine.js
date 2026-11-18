// Deterministic shop-floor reasoning. Every recommendation retains its evidence.
export const seed = {
  shop: 'Gupta General Store', owner: 'Rajesh ji', date: '18 Nov 2026',
  sales: { today: 42850, previous: 51200, cashExpected: 12600, cashCounted: 11850, upiExpected: 22300, upiReceived: 20700 },
  inventory: [ { name:'Aashirvaad atta 5kg', stock:8, daily:5, supplier:'Sharma Distributors', pack:20, cost:245 }, {name:'Amul butter 500g',stock:14,daily:3, supplier:'Metro Foods',pack:12,cost:258}, {name:'Tata salt 1kg',stock:36,daily:4,supplier:'Sharma Distributors',pack:24,cost:22} ],
  receivables: [{name:'Mehta Tea Stall', amount:12400, days:18},{name:'Verma Caterers',amount:6800,days:4},{name:'Anand Kirana',amount:4300,days:11}],
  staff: [{name:'Aman',role:'Counter',sales:18400, shifts:1},{name:'Pooja',role:'Billing',sales:15900,shifts:1},{name:'Ravi',role:'Stock',sales:null,shifts:1}]
};
export const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
export function makeCases(data) {
  const s=data.sales; const cash=s.cashExpected-s.cashCounted, upi=s.upiExpected-s.upiReceived; const delta = n => n === 0 ? 'matches' : `${money(Math.abs(n))} ${n > 0 ? 'short' : 'over'}`;
  const cases=[];
  if (cash!==0 || upi!==0) cases.push({id:'reconcile', area:'Cash & UPI', priority:'HIGH', title:`Cash and UPI need a second look`, summary:`Cash ${delta(cash)}; UPI ${delta(upi)} against the register.`, evidence:[`Cash: ${money(s.cashCounted)} counted vs ${money(s.cashExpected)} expected`,`UPI: ${money(s.upiReceived)} received vs ${money(s.upiExpected)} expected`], uncertainty:'Pending settlements or entry mistakes can explain this. No conclusion about staff conduct is warranted.', action:'Ask the counter team to recheck today’s entries and UPI settlements.', recipient:'Counter team', channel:'WhatsApp', message:`Namaste team, aaj cash aur UPI entries ek baar match kar lena. Cash ${delta(cash)} aur UPI ${delta(upi)} dikh raha hai; pending settlement bhi check karna. Thank you.`});
  data.inventory.filter(i=>i.daily>0 && i.stock/i.daily<3).forEach(i=>{const qty=Math.max(i.pack,Math.ceil((i.daily*7-i.stock)/i.pack)*i.pack); cases.push({id:'stock-'+i.name,area:'Inventory',priority:'HIGH',title:`${i.name} may run out in ${(i.stock/i.daily).toFixed(1)} days`,summary:`Only ${i.stock} packs remain; recent sales average ${i.daily} a day.`,evidence:[`${i.stock} on hand ÷ ${i.daily}/day = ${(i.stock/i.daily).toFixed(1)} days cover`,`Suggested ${qty} packs × ${money(i.cost)} = ${money(qty*i.cost)} estimated`],uncertainty:'Estimate assumes recent sales continue and does not include stock already on order.',action:`Prepare a ${qty}-pack reorder request for ${i.supplier}.`,recipient:i.supplier,channel:'WhatsApp',message:`Namaste, ${i.name} ke ${qty} packs ki availability aur delivery date confirm kar dijiye. Estimated order ${money(qty*i.cost)}; please share final rate.`});});
  const overdue=data.receivables.filter(x=>x.days>=7).sort((a,b)=>b.amount-a.amount)[0];
  if(overdue && overdue.amount>0)cases.push({id:'udhaar',area:'Udhaar',priority:'MEDIUM',title:`${money(overdue.amount)} due from ${overdue.name}`,summary:`The balance has been open for ${overdue.days} days.`,evidence:[`Open balance: ${money(overdue.amount)}`,`Age: ${overdue.days} days; reminder threshold: 7 days`],uncertainty:'Confirm the ledger and any recent payment before contacting the customer.',action:`Draft a polite payment reminder to ${overdue.name}.`,recipient:overdue.name,channel:'WhatsApp',message:`Namaste, aapke account mein ${money(overdue.amount)} ka balance dikh raha hai. Jab convenient ho please check kar lijiyega; agar payment ho gayi ho toh ignore karein. Dhanyavaad.`});
  return cases;
}
// Intent is deliberately limited; calculations never come from a language model.
export function getIntent(text) {
 const q=text.toLowerCase();
 if(/stock|atta|order|samaan|saman|स्टॉक|आटा|सामान|माल/.test(q)) return 'stock';
 if(/cash|upi|payment|settle|mismatch|कैश|नकद|यूपीआई|पेमेंट|पैसे का मिलान/.test(q)) return 'cash';
 if(/udhaar|udhar|credit|due|outstanding|paisa|receiv|उधार|बकाया|वसूली/.test(q)) return 'udhaar';
 if(/staff|team|employee|aman|pooja|ravi|स्टाफ|कर्मचारी|टीम|अमन|पूजा/.test(q)) return 'staff';
 if(/sale|business|aaj|today|revenue|bikri|बिक्री|बिकरी|सेल|धंधा|दुकान|आज/.test(q)) return 'sales';
 return 'unknown';
}
export function respond(text,data,cases) {
 const intent=getIntent(text);
 if(intent==='stock'){const c=cases.find(x=>x.area==='Inventory');return c?`${c.summary} ${c.evidence.join(' · ')} ${c.uncertainty}`:'No item is below the 3-day stock threshold in the demo data.';}
 if(intent==='cash'){const c=cases.find(x=>x.id==='reconcile');return c?`${c.summary} ${c.uncertainty}`:'The demo cash and UPI totals match.';}
 if(intent==='udhaar')return `Total udhaar is ${money(data.receivables.reduce((a,x)=>a+x.amount,0))}. ${cases.find(x=>x.id==='udhaar')?.summary || ''} Check for recent payments first.`;
 if(intent==='staff')return data.staff.map(p=>`${p.name} (${p.role}): ${p.sales === null ? 'stock duty; no sales figure' : money(p.sales)+' recorded sales'}`).join(' · ')+'. Roles differ, so these figures do not measure individual performance.';
 if(intent==='sales'){let d=data.sales.previous>0?(data.sales.today/data.sales.previous-1)*100:null;return d===null ? `Today’s recorded sales are ${money(data.sales.today)}. The comparison day is zero, so a percentage change cannot be calculated. ${cases.length} items need attention.` : `Today’s recorded sales are ${money(data.sales.today)}, ${Math.abs(d).toFixed(1)}% ${d<0?'below':'above'} the comparison day (${money(data.sales.previous)}). This alone does not explain why. ${cases.length} items need attention.`;}
 return 'I can help with today’s sales, cash and UPI, stock, udhaar, or staff activity. Try “atta kab khatam hoga?” or “cash ka kya scene hai?”';
}
