
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H, mouseActive=false, mouse={x:0,y:0}, last={x:0,y:0};

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

const NOTES = ['♩','♪','♫','♬'];
const CLEF = '𝄞';

function randHue(){ return Math.random()*360; }

class P {
  constructor(x, y, burst){
    this.x=x; this.y=y; this.burst=burst;
    this.hue=randHue();
    this.targetHue=randHue();
    this.hueSpeed=.2+Math.random()*1.8;
    this.sat=70+Math.random()*30;
    this.lit=45+Math.random()*25;
    const spd=burst ? .9+Math.random()*1.9 : .06+Math.random()*.22;
    const a=Math.random()*Math.PI*2;
    this.vx=Math.cos(a)*spd;
    this.vy=Math.sin(a)*spd-(burst?.25:0);
    this.life=1;
    this.decay=burst ? .006+Math.random()*.01 : .004+Math.random()*.006;
    this.size=burst ? 1.3+Math.random()*2.1 : .8+Math.random()*1.3;
    const roll=Math.random();
    if(burst && roll<.15){ this.kind='clef'; this.sym=CLEF; this.fs=17+Math.random()*11; }
    else if(burst && roll<.4){ this.kind='note'; this.sym=NOTES[Math.floor(Math.random()*4)]; this.fs=11+Math.random()*9; }
    else{ this.kind='dot'; }
    this.angle=Math.random()*Math.PI*2;
    this.spin=(Math.random()-.5)*.05;
  }

  update(){
    const diff=this.targetHue-this.hue;
    const delta=((diff+540)%360)-180;
    this.hue+=delta*this.hueSpeed*.016;
    if(Math.abs(delta)<1){ this.targetHue=randHue(); this.hueSpeed=.2+Math.random()*1.8; }
    this.vx*=.963; this.vy*=.963;
    if(this.burst) this.vy-=.007;
    this.x+=this.vx; this.y+=this.vy;
    this.angle+=this.spin;
    this.life-=this.decay;
    return this.life>0;
  }

  draw(){
    const alpha=this.life*(this.burst?.88:.55);
    const col=`hsla(${this.hue},${this.sat}%,${this.lit}%,${alpha})`;
    const glow=`hsla(${this.hue},${this.sat}%,${this.lit}%,.35)`;
    if(this.kind!=='dot'){
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle=col;
      ctx.shadowColor=glow;
      ctx.shadowBlur=this.kind==='clef'?10:6;
      ctx.font=`${this.fs}px serif`;
      ctx.fillText(this.sym,0,0);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle=col;
      ctx.shadowColor=glow;
      ctx.shadowBlur=this.burst?9:3;
      ctx.fill();
    }
    ctx.shadowBlur=0;
  }
}

let parts=[];
let ambTimer=0;

function loop(){
  ctx.clearRect(0,0,W,H);
  ambTimer++;
  if(ambTimer%14===0 && parts.length<80) parts.push(new P(Math.random()*W, Math.random()*H, false));

  if(mouseActive){
    const dx=mouse.x-last.x, dy=mouse.y-last.y;
    const spd=Math.sqrt(dx*dx+dy*dy);
    if(spd>2){
      const n=Math.min(Math.floor(spd*.25)+1,6);
      for(let i=0;i<n;i++) parts.push(new P(mouse.x+(Math.random()-.5)*10, mouse.y+(Math.random()-.5)*10, true));
    }
    last.x=mouse.x; last.y=mouse.y;
  }

  parts=parts.filter(p=>{ const ok=p.update(); if(ok) p.draw(); return ok; });
  requestAnimationFrame(loop);
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e=>{
  mouseActive=true;
  const rect=canvas.getBoundingClientRect();
  mouse.x=e.clientX-rect.left;
  mouse.y=e.clientY-rect.top;
});
window.addEventListener('mouseleave',()=>{ mouseActive=false; });
window.addEventListener('touchmove',e=>{
  e.preventDefault(); mouseActive=true;
  const rect=canvas.getBoundingClientRect();
  mouse.x=e.touches[0].clientX-rect.left;
  mouse.y=e.touches[0].clientY-rect.top;
},{passive:false});
window.addEventListener('touchend',()=>{ mouseActive=false; });

resize();
for(let i=0;i<40;i++) parts.push(new P(Math.random()*W, Math.random()*H, false));
loop();
