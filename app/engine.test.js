import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed, makeCases, respond } from './engine.js';
test('reconciliation is calculated from source figures',()=>{let c=makeCases(seed).find(x=>x.id==='reconcile');assert.match(c.title,/2,350/);assert.match(c.uncertainty,/staff/)});
test('reorder covers one week rounded to supplier pack',()=>{let c=makeCases(seed).find(x=>x.id.startsWith('stock-'));assert.match(c.action,/40-pack/);assert.match(c.evidence[1],/9,800/)});
test('unknown question does not fabricate an answer',()=>assert.match(respond('what is profit?',seed,makeCases(seed)),/I can help/));
test('does not recommend a stockout action for sufficient inventory',()=>{let d=structuredClone(seed);d.inventory.forEach(i=>i.stock=1000);assert.equal(makeCases(d).filter(x=>x.area==='Inventory').length,0)});
test('zero baseline does not claim infinite growth',()=>{let d=structuredClone(seed);d.sales.previous=0;assert.match(respond('sales',d,makeCases(d)),/cannot be calculated/)});
test('zero daily demand does not trigger a reorder',()=>{let d=structuredClone(seed);d.inventory.forEach(i=>i.daily=0);assert.equal(makeCases(d).filter(x=>x.area==='Inventory').length,0)});
