import {readFile} from 'node:fs/promises';
import {fallbackPlan,orchestrate} from '../app/agent.js';
import {seed,makeCases} from '../app/engine.js';
const cases=JSON.parse(await readFile(new URL('./EVAL-CASES.json',import.meta.url)));
let exact=0;for(const c of cases){const got=fallbackPlan(c.q);const ok=JSON.stringify([...got].sort())===JSON.stringify([...c.want].sort());if(ok)exact++;else console.log(`FAIL ${JSON.stringify(c.q)} expected=${c.want} actual=${got}`)}
const t=performance.now();for(let i=0;i<1000;i++)await orchestrate('cash and stock',seed,makeCases(seed),null);
console.log(`Fallback routing exact match: ${exact}/${cases.length}`);console.log(`1000 in-process fallback runs: ${(performance.now()-t).toFixed(1)} ms (not end-to-end latency)`);
