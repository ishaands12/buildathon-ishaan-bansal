import {seed} from './engine.js';
const DATA='biz.meltado.shop.v1',EVENTS='biz.meltado.activity.v1',DONE='biz.meltado.done.v1';
function read(key,fallback){try{const s=localStorage.getItem(key);return s?JSON.parse(s):fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
export function loadData(){const d=read(DATA,null);return d&&d.sales&&Array.isArray(d.inventory)&&d.inventory.length&&Array.isArray(d.receivables)&&d.receivables.length&&Array.isArray(d.staff)?d:structuredClone(seed)}
export function saveData(data){write(DATA,data)}
export function loadEvents(){const e=read(EVENTS,[]);return Array.isArray(e)?e:[]}
export function addEvent(event){write(EVENTS,[{...event,at:new Date().toISOString()},...loadEvents()].slice(0,40))}
export function loadDone(){const d=read(DONE,[]);return Array.isArray(d)?d:[]}
export function saveDone(done){write(DONE,[...done])}
export function resetState(){for(const key of [DATA,EVENTS,DONE])try{localStorage.removeItem(key)}catch{}}
