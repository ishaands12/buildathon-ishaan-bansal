import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
const root=process.cwd(), port=process.env.PORT||4173;
const files=new Set(['/index.html','/app/main.js','/app/engine.js','/app/style.css']);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  const path=url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);
  if(req.method!=='GET'||!files.has(path)){res.writeHead(404).end('Not found');return}
  const file=await readFile(resolve(root,'.'+path));
  res.writeHead(200,{'Content-Type':types[extname(path)],'X-Content-Type-Options':'nosniff'});res.end(file);
 } catch {res.writeHead(404).end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`BIz running at http://localhost:${port}`));
