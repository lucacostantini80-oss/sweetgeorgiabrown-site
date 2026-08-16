const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#site-menu");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const localVideos = document.querySelectorAll("video.listen-video[src]");
localVideos.forEach((video) => {
  const listenSection = video.closest(".listen");
  const showVideo = () => listenSection?.classList.add("is-video-playing");
  const hideVideo = () => listenSection?.classList.remove("is-video-playing");

  video.addEventListener("playing", showVideo);
  video.addEventListener("pause", hideVideo);
  video.addEventListener("error", hideVideo);

  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";

  const start = () => {
    if (!video.paused && video.readyState >= 2) return;
    const promise = video.play();
    if (promise && typeof promise.catch === "function") promise.catch(() => {});
  };

  video.addEventListener("loadeddata", start);
  video.addEventListener("canplay", start);
  video.addEventListener("ended", start);
  video.load();
  start();

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) start();
    }, { threshold: 0.01 }).observe(video);
  }

  window.setInterval(start, 2500);
});
document.querySelectorAll('.listen-portrait[role="button"]').forEach((portrait) => {
  const toggleZoom = () => portrait.classList.toggle('is-zoomed');
  portrait.addEventListener('click', toggleZoom);
  portrait.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleZoom();
    }
  });
});

const contactDialog = document.querySelector("#contact-dialog");
const contactOpen = document.querySelector(".contact-open");
const contactClose = document.querySelector(".contact-close");
const contactForm = document.querySelector("#contact-form");

if (contactDialog && contactOpen && contactForm) {
  contactOpen.addEventListener("click", () => contactDialog.showModal());
  if (contactClose) contactClose.addEventListener("click", () => contactDialog.close());
  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) contactDialog.close();
  });

}

  if (contactForm) contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const data = new FormData(contactForm);
    const subject = "Sweet Georgia Brown enquiry - " + (data.get("eventType") || "event");
    const body = [
      "Name: " + data.get("firstName") + " " + data.get("lastName"),
      "Email: " + data.get("email"),
      "Event type: " + (data.get("eventType") || "Not specified"),
      "Approximate dates: " + (data.get("dateFrom") || "Not specified") + " to " + (data.get("dateTo") || "Not specified"),
      "",
      "Message:",
      data.get("message") || ""
    ].join("\\n");
    window.location.href = "mailto:andreabrunoblues@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });const resumeVideos = () => {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.muted = true;
    video.play().catch(() => {});
  });
};
window.addEventListener("pointerdown", resumeVideos, { passive: true });
window.addEventListener("touchstart", resumeVideos, { passive: true });
window.addEventListener("click", resumeVideos, { passive: true });
window.addEventListener("scroll", resumeVideos, { passive: true });
const hlsVideos = document.querySelectorAll('video source[type="application/x-mpegURL"]');

hlsVideos.forEach((source) => {
  const video = source.closest('video');
  const src = source.getAttribute('src');
  if (!video || !src) return;

  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    video.play().catch(() => {});
  } else if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({ enableWorker: true });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {});
    });
  }
});
const quoteCanvas = document.querySelector("#quote-notes-canvas");
const quoteSection = document.querySelector(".quote");

if (quoteCanvas && quoteSection && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
const canvas = quoteCanvas;
const ctx = canvas.getContext('2d');
let W, H, mouseActive=false, mouse={x:0,y:0}, last={x:0,y:0};

function resize(){
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  W = rect.width;
  H = rect.height;
  canvas.width = Math.max(1, Math.floor(W * ratio));
  canvas.height = Math.max(1, Math.floor(H * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
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
quoteSection.addEventListener('pointermove', e=>{
  mouseActive=true;
  const rect=canvas.getBoundingClientRect();
  mouse.x=e.clientX-rect.left;
  mouse.y=e.clientY-rect.top;
});
quoteSection.addEventListener('pointerleave',()=>{ mouseActive=false; });
quoteSection.addEventListener('pointerdown', e => {
  mouseActive = true;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  last.x = mouse.x;
  last.y = mouse.y;
});
quoteSection.addEventListener('pointerup',()=>{ mouseActive=false; });

resize();
for(let i=0;i<40;i++) parts.push(new P(Math.random()*W, Math.random()*H, false));
loop();
}

const customDatePicker = (() => {
  const picker = document.querySelector("#date-picker");
  const displays = [...document.querySelectorAll("[data-date-field]")];
  const values = {
    from: document.querySelector('[data-date-value="from"]'),
    to: document.querySelector('[data-date-value="to"]')
  };
  const grid = picker?.querySelector("[data-date-grid]");
  const monthLabel = picker?.querySelector("[data-date-month]");
  if (!picker || displays.length !== 2 || !grid || !monthLabel) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let activeField = "from";
  let start = null;
  let end = null;

  const key = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "";
  const parse = (value) => value ? new Date(`${value}T00:00:00`) : null;
  const format = (date) => date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
  const sameDay = (a, b) => a && b && key(a) === key(b);
  const isBefore = (a, b) => a.getTime() < b.getTime();
  const isAfter = (a, b) => a.getTime() > b.getTime();

  const syncFields = () => {
    values.from.value = key(start);
    values.to.value = key(end);
    displays.find((input) => input.dataset.dateField === "from").value = format(start);
    displays.find((input) => input.dataset.dateField === "to").value = format(end);
  };

  const render = () => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    monthLabel.textContent = visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    grid.innerHTML = "";
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < offset; i += 1) {
      const empty = document.createElement("span");
      empty.className = "date-cell is-empty";
      grid.append(empty);
    }
    for (let day = 1; day <= days; day += 1) {
      const date = new Date(year, month, day);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "date-cell";
      button.textContent = String(day);
      button.dataset.date = key(date);
      if (isBefore(date, today)) button.classList.add("is-past");
      if (sameDay(date, start)) button.classList.add("is-start");
      if (sameDay(date, end)) button.classList.add("is-end");
      if (start && end && isAfter(date, start) && isBefore(date, end)) button.classList.add("is-in-range");
      if (isBefore(date, today)) button.disabled = true;
      button.addEventListener("click", () => choose(date));
      grid.append(button);
    }
  };

  const open = (field) => {
    activeField = field;
    const current = parse(values[field].value);
    if (current) visibleMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    picker.hidden = false;
    render();
  };

  const choose = (date) => {
    if (isBefore(date, today)) return;
    if (activeField === "from") {
      start = date;
      if (end && isAfter(start, end)) [start, end] = [end, start];
      activeField = "to";
    } else {
      end = date;
      if (start && isBefore(end, start)) [start, end] = [end, start];
      activeField = "from";
    }
    syncFields();
    render();
  };

  displays.forEach((display) => display.addEventListener("click", () => open(display.dataset.dateField)));
  picker.querySelector("[data-date-prev]").addEventListener("click", () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1); render(); });
  picker.querySelector("[data-date-next]").addEventListener("click", () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1); render(); });
  picker.querySelector("[data-date-today]").addEventListener("click", () => { choose(new Date(today)); visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1); render(); });
  picker.querySelector("[data-date-clear]").addEventListener("click", () => { start = null; end = null; activeField = "from"; syncFields(); render(); });
  document.addEventListener("click", (event) => { if (!picker.hidden && !picker.contains(event.target) && !displays.includes(event.target)) picker.hidden = true; });
  syncFields();
  return { render };
})();
const customEventSelects = document.querySelectorAll("[data-custom-select]");
customEventSelects.forEach((container) => {
  const trigger = container.querySelector(".custom-select-trigger");
  const menu = container.querySelector(".custom-select-menu");
  const select = container.querySelector("select");
  if (!trigger || !menu || !select) return;
  const close = () => { menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); };
  trigger.addEventListener("click", () => {
    const open = menu.hidden;
    document.querySelectorAll(".custom-select-menu").forEach((other) => { other.hidden = true; });
    document.querySelectorAll(".custom-select-trigger").forEach((other) => { other.setAttribute("aria-expanded", "false"); });
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("[data-value]").forEach((option) => option.addEventListener("click", () => {
    select.value = option.dataset.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    trigger.textContent = option.dataset.value;
    trigger.classList.add("has-value");
    close();
  }));
  document.addEventListener("click", (event) => { if (!container.contains(event.target)) close(); });
});
const sendEnquiryButton = document.querySelector("#send-enquiry");
if (sendEnquiryButton && contactForm) {
  sendEnquiryButton.addEventListener("click", () => {
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const data = new FormData(contactForm);
    const subject = "Sweet Georgia Brown enquiry - " + (data.get("eventType") || "event");
    const body = [
      "Name: " + data.get("firstName") + " " + data.get("lastName"),
      "Email: " + data.get("email"),
      "Event type: " + (data.get("eventType") || "Not specified"),
      "Approximate dates: " + (data.get("dateFrom") || "Not specified") + " to " + (data.get("dateTo") || "Not specified"),
      "",
      "Message:",
      data.get("message") || ""
    ].join("\n");
    const mailto = "mailto:andreabrunoblues@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    sendEnquiryButton.setAttribute("href", mailto);
    window.location.href = mailto;
  });
}