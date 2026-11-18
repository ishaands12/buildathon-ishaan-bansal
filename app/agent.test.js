import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validatePlan,fallbackPlan,orchestrate} from './agent.js';
import {seed,makeCases} from './engine.js';
test('planner restricts tasks to unique allowed specialists',()=>assert.deepEqual(validatePlan('{"tasks":["cash","transfer_money","cash","stock"]}'),['cash','stock']));
test('fallback routes a mixed question to multiple specialists',()=>assert.deepEqual(fallbackPlan('cash aur stock batao'),['cash','stock']));
test('orchestrator combines evidence-based specialist results',async()=>{const r=await orchestrate('cash aur stock',seed,makeCases(seed),async()=>({tasks:['cash','stock','send_money']}));assert.deepEqual(r.tasks,['cash','stock']);assert.match(r.results[0].text,/750/);assert.match(r.results[1].text,/1.6/);assert.equal(r.source,'local model')});
test('orchestrator falls back safely if model fails',async()=>{const r=await orchestrate('कैश बताओ',seed,makeCases(seed),async()=>{throw Error('offline')});assert.deepEqual(r.tasks,['cash']);assert.equal(r.source,'local rules')});
