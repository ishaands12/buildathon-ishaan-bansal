import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadData,saveData,addEvent,loadEvents,saveDone,loadDone,resetState} from './state.js';
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
test('shop figures, run activity and simulated approvals are shared and reset together',()=>{resetState();const data=loadData();data.sales.today=60000;saveData(data);addEvent({type:'run',tasks:['sales'],source:'local rules'});saveDone(new Set(['reconcile']));assert.equal(loadData().sales.today,60000);assert.deepEqual(loadEvents()[0].tasks,['sales']);assert.deepEqual(loadDone(),['reconcile']);resetState();assert.notEqual(loadData().sales.today,60000);assert.equal(loadEvents().length,0);assert.deepEqual(loadDone(),[])});
