import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseModelIntent} from './agent.js';
test('accepts only known tool names',()=>{assert.equal(parseModelIntent('{"intent":"stock"}'),'stock');assert.equal(parseModelIntent('{"intent":"transfer_money"}'),'unknown');assert.equal(parseModelIntent('not json'),'unknown')});
