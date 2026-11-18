import test from 'node:test';
import assert from 'node:assert/strict';
import {analyseSalesCsv,parseCsv,salesSummary} from './document.js';
test('sums paise accurately and ranks quoted item names',()=>{const x=analyseSalesCsv('date,item,amount\n2026-01-01,"Tea, hot",10.10\n2026-01-01,Coffee,20.20\n2026-01-02,"Tea, hot",0.20');assert.equal(x.totalPaise,3050);assert.deepEqual(x.topItems[0],['Coffee',2020]);assert.equal(x.dates.length,2);assert.match(salesSummary(x,'sales.csv'),/₹30.50/)});
test('includes refunds and does not treat revenue as profit',()=>{const x=analyseSalesCsv('amount\n100\n-25.50');assert.equal(x.totalPaise,7450);assert.match(salesSummary(x,'x.csv'),/not profit/)});
test('rejects invalid and ambiguous input instead of inventing values',()=>{for(const x of ['item,quantity\ntea,2','amount,total\n1,2','amount\n2.345','amount,item\n1','amount\n"12','amount\nnot a number'])assert.throws(()=>analyseSalesCsv(x))});
test('supports escaped quotes and CRLF',()=>{assert.deepEqual(parseCsv('item,amount\r\n"Tea ""large""",12\r\n'),[['item','amount'],['Tea "large"','12']])});
