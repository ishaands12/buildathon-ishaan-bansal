import {test} from 'node:test';
import assert from 'node:assert/strict';
import {meltadoSeed,cafeMetrics} from './meltado.js';
import {makeCases,respond} from './engine.js';
import {orchestrate} from './agent.js';
test('sample menu revenue matches categories, today and chart',()=>{const m=cafeMetrics(meltadoSeed);assert.equal(m.revenue,33470);assert.equal(Object.values(m.categories).reduce((a,b)=>a+b,0),m.revenue);assert.equal(meltadoSeed.sales.today,m.revenue);assert.equal(meltadoSeed.weekly.at(-1).sales,m.revenue);assert.equal(meltadoSeed.sales.cashExpected+meltadoSeed.sales.upiExpected+meltadoSeed.sales.cardExpected,m.revenue)});
test('illustrative contribution and remainder use the same item costs',()=>{const m=cafeMetrics(meltadoSeed);assert.equal(m.ingredientCost,13907);assert.equal(m.contribution,m.revenue-m.ingredientCost);assert.equal(m.illustrativeSurplus,m.contribution-m.operatingCost)});
test('milk stock action uses litres and computed supplier quantity',()=>{const c=makeCases(meltadoSeed).find(x=>x.area==='Inventory');assert.match(c.summary,/8 L/);assert.match(c.action,/30 L/);assert.match(c.message,/30 L/)});
test('combined cafe question routes to menu and finance and labels assumptions',async()=>{const r=await orchestrate('menu and food cost',meltadoSeed,makeCases(meltadoSeed),null);assert.ok(r.tasks.includes('menu')&&r.tasks.includes('finance'));assert.match(r.results.find(x=>x.agent==='finance').text,/invented/);assert.match(respond('best seller',meltadoSeed,makeCases(meltadoSeed)),/sample/)});
