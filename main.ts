import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const im=new Int8Array(256).fill(-1),po=new Int8Array(256),pu=new Int8Array(256);
for(const t of [[0,0,0,0],[1,1,0,1],[2,4,0,1],[3,0,1,0],[4,0,1,2],[5,0,2,2],[6,0,2,3],[7,0,3,3],[16,0,2,1],[17,0,2,1],[18,0,2,1],[19,0,2,1],[20,0,2,1],[21,0,2,1],[22,0,2,1],[23,0,1,1],[24,0,2,1],[25,0,2,1],[26,0,2,1],[27,0,1,1],[28,0,2,1],[29,0,2,1],[30,0,2,1],[32,0,2,1],[33,0,2,1],[34,0,2,1],[48,2,0,0],[49,2,1,0],[50,2,1,0],[51,2,0,0],[52,0,0,0],[64,0,1,1],[65,0,2,0],[80,0,1,0],[81,0,1,0],[82,0,0,1],[83,0,1,0]]){im[t[0]]=t[1];po[t[0]]=t[2];pu[t[0]]=t[3];}
const te=new TextEncoder();
function run(p:Uint8Array,g:Uint8Array){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536);
 let s=0,c=0,l=0,j=0,pc=0,n=0;
 const end=(x:number)=>({o:O.slice(0,l),c:x});
 for(;;){
  if(n===1e6)return end(10);
  if(pc<0||pc>=p.length)return end(9);
  const op=p[pc],k=im[op];
  if(k<0)return end(5);
  if(pc+k>=p.length)return end(9);
  n++;
  const nx=pc+1+k;
  if(s<po[op])return end(2);
  if(s-po[op]+pu[op]>256)return end(3);
  pc=nx;
  if(op===0)return end(0);
  if(op===1){D[s++]=(p[nx-1]<<24)>>24;continue;}
  if(op===2){D[s++]=p[nx-4]|(p[nx-3]<<8)|(p[nx-2]<<16)|(p[nx-1]<<24);continue;}
  if(op===3){s--;continue;}
  if(op===4){D[s]=D[s-1];s++;continue;}
  if(op===5){const t=D[s-1];D[s-1]=D[s-2];D[s-2]=t;continue;}
  if(op===6){D[s]=D[s-2];s++;continue;}
  if(op===7){const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;continue;}
  if(op===23){D[s-1]=-D[s-1]|0;continue;}
  if(op===27){D[s-1]=~D[s-1];continue;}
  if(op>=16&&op<=34){
   const b=D[s-1],a=D[s-2];let r=0;
   if(op===16)r=(a+b)|0;
   else if(op===17)r=(a-b)|0;
   else if(op===18)r=Math.imul(a,b);
   else if(op===19){if(!b)return end(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
   else if(op===20){if(!b)return end(4);r=b===-1?0:a%b|0;}
   else if(op===21){if(!b)return end(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
   else if(op===22){if(!b)return end(4);r=(a>>>0)%(b>>>0)|0;}
   else if(op===24)r=a&b;
   else if(op===25)r=a|b;
   else if(op===26)r=a^b;
   else if(op===28)r=a<<(b&31);
   else if(op===29)r=a>>(b&31);
   else if(op===30)r=(a>>>(b&31))|0;
   else if(op===32)r=a===b?1:0;
   else if(op===33)r=a<b?1:0;
   else r=(a>>>0)<(b>>>0)?1:0;
   s-=2;D[s++]=r;continue;
  }
  if(op===48||op===49||op===50){
   const rel=((p[nx-2]|(p[nx-1]<<8))<<16)>>16;
   let t=1;
   if(op!==48){const v=D[--s];t=op===49?v===0?1:0:v!==0?1:0;}
   if(t)pc=nx+rel;
   continue;
  }
  if(op===51){if(c===64)return end(7);C[c++]=nx;pc=p[nx-2]|(p[nx-1]<<8);continue;}
  if(op===52){if(!c)return end(8);pc=C[--c];continue;}
  if(op===64){const a=D[s-1];if(a<0||a>255)return end(6);D[s-1]=M[a];continue;}
  if(op===65){const a=D[s-1],v=D[s-2];if(a<0||a>255)return end(6);s-=2;M[a]=v;continue;}
  if(op===80){const b=te.encode(String(D[s-1]));if(l+b.length>65536)return end(11);s--;O.set(b,l);l+=b.length;continue;}
  if(op===81){if(l+1>65536)return end(11);O[l++]=D[--s]&255;continue;}
  if(op===82){D[s++]=j<g.length?g[j++]:-1;continue;}
  return end(D[--s]&255);
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
 const r=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),r.o);
 writeFileSync(join(O,id,'exit.txt'),r.c+'\n');
}
