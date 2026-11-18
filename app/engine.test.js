import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacySeed as seed, makeCases, respond } from './engine.js';
test('reconciliation is calculated from source figures',()=>{let c=makeCases(seed).find(x=>x.id==='reconcile');assert.match(c.summary,/750.*1,600/);assert.match(c.uncertainty,/staff/)});
test('reorder covers one week rounded to supplier pack',()=>{let c=makeCases(seed).find(x=>x.id.startsWith('stock-'));assert.match(c.action,/40 packs/);assert.match(c.evidence[1],/9,800/)});
test('unknown question does not fabricate an answer',()=>assert.match(respond('what is profit?',seed,makeCases(seed)),/I can help/));
test('does not recommend a stockout action for sufficient inventory',()=>{let d=structuredClone(seed);d.inventory.forEach(i=>i.stock=1000);assert.equal(makeCases(d).filter(x=>x.area==='Inventory').length,0)});
test('zero baseline does not claim infinite growth',()=>{let d=structuredClone(seed);d.sales.previous=0;assert.match(respond('sales',d,makeCases(d)),/cannot be calculated/)});
test('zero daily demand does not trigger a reorder',()=>{let d=structuredClone(seed);d.inventory.forEach(i=>i.daily=0);assert.equal(makeCases(d).filter(x=>x.area==='Inventory').length,0)});

test('overages are reported as over, not as a negative shortage',()=>{let d=structuredClone(seed);d.sales.cashCounted=14000;let c=makeCases(d).find(x=>x.id==='reconcile');assert.match(c.summary,/1,400 over/)});
test('Hindi voice transcription maps to stock and cash questions',()=>{assert.match(respond('आटा कितने दिन चलेगा',seed,makeCases(seed)),/packs remain/);assert.match(respond('कैश का हिसाब',seed,makeCases(seed)),/short/)});
