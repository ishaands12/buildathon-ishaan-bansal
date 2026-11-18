// Small, auditable CSV sales analyser. Monetary arithmetic is performed in paise.
export function parseCsv(text) {
  if (text.length > 2_000_000) throw new Error('File is too large. Use a CSV under 2 MB.');
  const rows=[]; let row=[], cell='', quoted=false, closed=false;
  text=text.replace(/^\uFEFF/, '');
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else{quoted=false;closed=true}}else cell+=c; continue}
    if(closed && c!==',' && c!=='\r' && c!=='\n') throw new Error('Invalid characters after a quoted CSV field.');
    if(c==='"'){if(cell) throw new Error('Invalid quote in CSV.');quoted=true}
    else if(c===','){row.push(cell);cell='';closed=false}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';closed=false}
    else cell+=c;
  }
  if(quoted) throw new Error('Unclosed quoted field in CSV.');
  if(cell||row.length){row.push(cell);if(row.some(v=>v.trim()))rows.push(row)}
  if(rows.length>10001) throw new Error('Use at most 10,000 sales rows.');
  return rows;
}
function paise(raw){
 const s=raw.trim().replace(/^₹\s*/, '').replace(/,/g,'');
 if(!/^-?\d+(?:\.\d{1,2})?$/.test(s)) return null;
 const negative=s.startsWith('-'), n=negative?s.slice(1):s, [whole,frac='']=n.split('.');
 const amount=Number(whole)*100+Number(frac.padEnd(2,'0'));
 return Number.isSafeInteger(amount)?(negative?-amount:amount):null;
}
export function analyseSalesCsv(text){
 const rows=parseCsv(text);if(rows.length<2)throw new Error('Add a header and at least one sales row.');
 const headers=rows[0].map(x=>x.trim().toLowerCase());
 const find=(aliases)=>headers.findIndex(h=>aliases.includes(h));
 const amount=find(['amount','sales','revenue','total']), item=find(['item','product','item name']), date=find(['date','sale date']);
 if(amount<0)throw new Error('A column named amount, sales, revenue or total is required.');
 if(headers.filter(h=>['amount','sales','revenue','total'].includes(h)).length!==1)throw new Error('Use exactly one sales amount column.');
 let total=0;const items=new Map(), dates=new Map();
 rows.slice(1).forEach((r,i)=>{
  if(r.length!==headers.length)throw new Error(`Row ${i+2} has ${r.length} columns; expected ${headers.length}.`);
  const n=paise(r[amount]);if(n===null)throw new Error(`Row ${i+2} has an invalid amount. Use numbers with up to two decimal places.`);
  total+=n;if(!Number.isSafeInteger(total))throw new Error('Total exceeds the supported range.');
  if(item>=0 && r[item].trim()){const name=r[item].trim();items.set(name,(items.get(name)||0)+n)}
  if(date>=0 && r[date].trim()){const value=r[date].trim();dates.set(value,(dates.get(value)||0)+n)}
 });
 const rank=map=>[...map].sort((a,b)=>b[1]-a[1]);
 return {rows:rows.length-1,totalPaise:total,topItems:rank(items).slice(0,3),dates:rank(dates),hasItem:item>=0,hasDate:date>=0};
}
export function formatRupees(p){return '₹'+(p/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
export function salesSummary(a,filename){
 const out=[`Analysis of ${filename} (uploaded CSV)`,`Sales total: ${formatRupees(a.totalPaise)} across ${a.rows} rows. This is the sum of the amount column, including any negative values.`];
 if(a.topItems.length)out.push('Highest sales by item: '+a.topItems.map(([name,n])=>`${name}: ${formatRupees(n)}`).join(' · ')+'.');
 if(a.dates.length)out.push(`Dates listed: ${a.dates.length} distinct values. Dates are grouped exactly as written, not checked for validity.`);
 out.push('Check that amounts represent sales, the same currency and period; totals are not profit and may include tax or duplicate entries.');
 return out.join('\n');
}
