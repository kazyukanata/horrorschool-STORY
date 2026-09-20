/* 遠近法の暗い廊下。時間経過で奥の人影が近づく */
function sceneHtml(){
  const sd=[...gameState.currentRoom].reduce((a,c)=>a+c.charCodeAt(0),0),m=Math.floor((gameState.elapsedSeconds||0)/60);
  const vx=200+((sd%5)-2)*16,vy=118,x0=vx-40,x1=vx+40,y0=vy-30,y1=vy+30;
  const yy=(u,f)=>u*y0+f*(260-u*(260-y1)-u*y0);
  const Lw=(u,f)=>[u*x0,yy(u,f)], Rw=(u,f)=>[400-u*(400-x1),yy(u,f)];
  const pt=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const quad=(P,u1,u2,f1,f2)=>pt([P(u1,f1),P(u2,f1),P(u2,f2),P(u1,f2)]);
  let win='',lit='';
  for(let i=0;i<2+sd%2;i++){const u1=.1+i*.26,u2=u1+.16,b1=Lw(u1,1),b2=Lw(u2,1);
    win+=`<polygon points="${quad(Lw,u1,u2,.2,.62)}" fill="url(#mo)"/>`;
    lit+=`<polygon points="${pt([b1,b2,[b2[0]+60*(1-u2),b2[1]+14*(1-u2)],[b1[0]+60*(1-u1),b1[1]+14*(1-u1)]])}" fill="rgba(160,185,210,.16)"/>`;}
  const doors=[[.2,.32],[.55,.65]].map(d=>`<polygon points="${quad(Rw,d[0],d[1],.12,1)}" fill="#04060a" stroke="#1d252b" stroke-width=".6"/>`).join('');
  let fig='';
  if(m>=3){const s=Math.min(.95,.18+m*.05),op=Math.min(.9,.2+m*.05),tilt=m>=9?6:0;
    fig=`<g class="fl"><g transform="translate(${vx+(m>=9?((m%3)-1)*6:0)} ${y1}) scale(${s*.75}) rotate(${tilt})" opacity="${op}" filter="url(#bl)">${window.GHOST_IMG?'<image href="img/ghost.png" x="-50" y="-262" width="100" height="300" preserveAspectRatio="xMidYMax meet"/>':'<use href="#onryo" x="-50" y="-262" width="100" height="300"/>'}</g></g>`;}
  return `<div id="scene" class="absolute inset-0"><svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" class="w-full h-full"><defs><linearGradient id="wl" x1="0" x2="1"><stop offset="0" stop-color="#0b0f13"/><stop offset="1" stop-color="#1b232a"/></linearGradient><linearGradient id="fl" y1="0" y2="1"><stop offset="0" stop-color="#15181b"/><stop offset="1" stop-color="#050607"/></linearGradient><linearGradient id="mo" y1="0" y2="1"><stop offset="0" stop-color="#9fb4c8" stop-opacity=".5"/><stop offset="1" stop-color="#5d7386" stop-opacity=".2"/></linearGradient><filter id="bl"><feGaussianBlur stdDeviation="1.1"/></filter><filter id="b3"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="400" height="260" fill="#030405"/><polygon points="0,0 400,0 ${x1},${y0} ${x0},${y0}" fill="#07090b"/><polygon points="0,260 400,260 ${x1},${y1} ${x0},${y1}" fill="url(#fl)"/><polygon points="0,0 ${x0},${y0} ${x0},${y1} 0,260" fill="url(#wl)"/><polygon points="400,0 ${x1},${y0} ${x1},${y1} 400,260" fill="#0c1116"/><rect x="${x0}" y="${y0}" width="80" height="60" fill="#020303"/><rect x="${vx-9}" y="${y0+12}" width="18" height="48" fill="#0a0d10" stroke="#20292f" stroke-width=".5"/>${win}${doors}<g filter="url(#b3)">${lit}<rect x="${vx-3}" y="${y1}" width="6" height="${260-y1}" fill="#fff" opacity=".05"/></g><g class="fl"><rect x="${vx-14}" y="${y0-3}" width="28" height="3" fill="#cfe3ff"/><ellipse cx="${vx}" cy="${y0}" rx="40" ry="10" fill="#9fb8d8" opacity=".12" filter="url(#b3)"/></g>${fig}</svg><div class="absolute inset-0" style="background:radial-gradient(circle 190px at var(--mx,50%) var(--my,55%),transparent 0,rgba(0,0,0,.3) 50%,rgba(0,0,0,.9) 100%)"></div><div class="absolute top-2 left-3 font-retro text-xl text-red-500 z-10"><span class="timer-blink">●</span> REC <span id="tc" class="text-slate-300"></span></div><div class="absolute top-2 right-3 font-retro text-lg text-slate-400 z-10">BAT ▮▮▯</div></div>`;
}
function refreshScene(){const sc=document.getElementById('scene');if(sc&&!gameState.isGameOver)sc.outerHTML=sceneHtml();}
document.addEventListener('pointermove',e=>{const rv=document.getElementById('room-view'),sc=document.getElementById('scene');if(!rv||!sc)return;const r=rv.getBoundingClientRect();sc.style.setProperty('--mx',(e.clientX-r.left)+'px');sc.style.setProperty('--my',(e.clientY-r.top)+'px');});

/* img/ghost.png があれば実写画像に差し替える */
window.GHOST_IMG=false;
(function(){const im=new Image();im.onload=()=>{window.GHOST_IMG=true;const t='<img src="img/ghost.png" alt="" style="height:100%;width:auto">';document.getElementById('fx-figure').innerHTML=t;const g=document.querySelector('.creeping-ghost');if(g)g.innerHTML=t;refreshScene();};im.src='img/ghost.png';})();
