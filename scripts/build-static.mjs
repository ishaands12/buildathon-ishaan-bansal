import {mkdir,copyFile,rm} from 'node:fs/promises';
const files=['index.html','dashboard.html','app/main.js','app/document.js','app/engine.js','app/agent.js','app/meltado.js','app/state.js','app/style.css','app/dashboard.js','app/dashboard.css','app/cafe-sections.js','docs/sample-sales.csv'];
await rm('dist',{recursive:true,force:true});
for(const file of files){await mkdir(`dist/${file.split('/').slice(0,-1).join('/')}`,{recursive:true});await copyFile(file,`dist/${file}`)}
console.log(`Prepared ${files.length} public static files in dist/`);
