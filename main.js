gsap.registerPlugin(ScrollTrigger);

/* ── SPLASH animations ── */
gsap.fromTo('#sp-ey',  { opacity:0, y:20 }, { opacity:1, y:0, duration:0.7, delay:0.3, ease:'power3.out' });
gsap.fromTo('#sp-h1',  { opacity:0, y:40 }, { opacity:1, y:0, duration:0.8, delay:0.5, ease:'power3.out' });
gsap.fromTo('#sp-sub', { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7, delay:0.75, ease:'power3.out' });
gsap.fromTo('#sp-ctas',{ opacity:0, y:20 }, { opacity:1, y:0, duration:0.6, delay:0.95, ease:'power3.out' });
gsap.fromTo('.blob',   { scale:0.6, opacity:0 }, { scale:1, opacity:1, duration:1.2, delay:0.2, stagger:0.15, ease:'power2.out' });
/* blob float */
gsap.to('.blob1', { y:-18, duration:3.2, yoyo:true, repeat:-1, ease:'sine.inOut' });
gsap.to('.blob2', { y: 14, duration:2.8, yoyo:true, repeat:-1, ease:'sine.inOut', delay:0.5 });
gsap.to('.blob3', { y:-12, duration:3.8, yoyo:true, repeat:-1, ease:'sine.inOut', delay:1 });
gsap.to('.blob4', { y: 10, duration:2.5, yoyo:true, repeat:-1, ease:'sine.inOut', delay:0.3 });

/* ── NAV: splash → auth ── */
function openAuth(mode) {
  const a = document.getElementById('auth');
  a.classList.add('open');
  setAuthMode(mode);
}
function closeAuth() {
  document.getElementById('auth').classList.remove('open');
}

document.getElementById('btn-signup').addEventListener('click', () => openAuth('signup'));
document.getElementById('btn-login') .addEventListener('click', () => openAuth('login'));
document.getElementById('btn-crie')  .addEventListener('click', () => openAuth('signup'));
document.getElementById('btn-explore').addEventListener('click', enterApp);
document.getElementById('auth-back') .addEventListener('click', closeAuth);

/* ── AUTH tabs & mode ── */
const tabSignup = document.getElementById('tab-signup');
const tabLogin  = document.getElementById('tab-login');
const headline  = document.getElementById('auth-headline');
const nameField = document.getElementById('name-field');
const btnEnter  = document.getElementById('btn-enter');
const switchTxt = document.getElementById('auth-switch');
const toggleLink= document.getElementById('auth-toggle');

function setAuthMode(mode) {
  const isSignup = mode === 'signup';
  tabSignup.classList.toggle('on',  isSignup);
  tabLogin .classList.toggle('on', !isSignup);
  headline .textContent = isSignup ? 'Junte-se à comunidade' : 'Bem-vindo de volta';
  btnEnter .textContent = isSignup ? 'Criar conta'          : 'Entrar';
  nameField.style.display = isSignup ? '' : 'none';
  switchTxt.innerHTML = isSignup
    ? 'Já tem conta? <a id="auth-toggle">Entrar</a>'
    : 'Não tem conta? <a id="auth-toggle">Criar conta</a>';
  document.getElementById('auth-toggle').addEventListener('click', () => setAuthMode(isSignup ? 'login' : 'signup'));
}
tabSignup.addEventListener('click', () => setAuthMode('signup'));
tabLogin .addEventListener('click', () => setAuthMode('login'));
toggleLink.addEventListener('click', () => setAuthMode('login'));

/* Enter app after auth */
document.getElementById('btn-enter').addEventListener('click', enterApp);
document.querySelectorAll('.social-btn').forEach(b => b.addEventListener('click', enterApp));

function enterApp() {
  const app = document.getElementById('app');
  const splash = document.getElementById('splash');
  app.classList.add('open');
  gsap.to(splash, { opacity:0, duration:0.5, delay:0.3, onComplete: () => { splash.style.display='none'; } });
  document.getElementById('auth').classList.remove('open');
  initWebGL();
  initFeed();
}

/* ── THREE.JS WebGL ── */
let webglReady = false;
function initWebGL() {
  if (webglReady) return; webglReady = true;
  const canvas = document.getElementById('bg');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:false });
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, 0.1, 100);
  cam.position.z = 6;

  const N = 90;
  const pos = new Float32Array(N*3), col = new Float32Array(N*3), vel = [];
  const pal = [[0.09,0.55,0.02],[0.15,0.75,0.06],[0.95,0.83,0.47]];
  let targetPal = pal;
  for (let i=0;i<N;i++) {
    pos[i*3]=(Math.random()-.5)*14; pos[i*3+1]=(Math.random()-.5)*22; pos[i*3+2]=(Math.random()-.5)*4;
    const c=pal[i%3]; col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
    vel.push({ x:(Math.random()-.5)*0.004, y:(Math.random()-.5)*0.003, ph:Math.random()*Math.PI*2, a:0.003+Math.random()*0.005 });
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:0.07,vertexColors:true,transparent:true,opacity:0.72,blending:THREE.AdditiveBlending,sizeAttenuation:true,depthWrite:false});
  scene.add(new THREE.Points(geo,mat));

  const palettes = {
    default:[[0.09,0.55,0.02],[0.15,0.75,0.06],[0.95,0.83,0.47]],
    evento: [[0.75,0.33,0.23],[0.95,0.45,0.28],[0.95,0.83,0.47]],
    artista:[[0.09,0.55,0.02],[0.15,0.75,0.06],[0.95,0.83,0.47]],
    musica: [[0.95,0.83,0.47],[0.75,0.65,0.25],[0.15,0.75,0.06]],
    banda:  [[0.09,0.55,0.02],[0.75,0.33,0.23],[0.15,0.75,0.06]],
  };
  window._setBgPalette = type => { targetPal = palettes[type]||palettes.default; };

  let mx=0,my=0,t=0;
  window.addEventListener('mousemove',e=>{ mx=(e.clientX/innerWidth-.5)*2; my=-(e.clientY/innerHeight-.5)*2; });
  window.addEventListener('touchmove',e=>{ const tc=e.touches[0]; mx=(tc.clientX/innerWidth-.5)*2; my=-(tc.clientY/innerHeight-.5)*2; },{passive:true});

  (function animate() {
    requestAnimationFrame(animate); t+=0.012;
    const p=geo.attributes.position.array, c=geo.attributes.color.array;
    for(let i=0;i<N;i++){
      p[i*3]  +=vel[i].x+Math.sin(t+vel[i].ph)*vel[i].a+mx*0.0007;
      p[i*3+1]+=vel[i].y+Math.cos(t*.7+vel[i].ph)*vel[i].a*.5+my*0.0007;
      if(Math.abs(p[i*3])>7) vel[i].x*=-1;
      if(Math.abs(p[i*3+1])>11) vel[i].y*=-1;
      const tc=targetPal[i%3];
      c[i*3]+=(tc[0]-c[i*3])*0.008; c[i*3+1]+=(tc[1]-c[i*3+1])*0.008; c[i*3+2]+=(tc[2]-c[i*3+2])*0.008;
    }
    geo.attributes.position.needsUpdate=true; geo.attributes.color.needsUpdate=true;
    cam.position.x+=(mx*.15-cam.position.x)*.04; cam.position.y+=(my*.1-cam.position.y)*.04;
    renderer.render(scene,cam);
  })();
  window.addEventListener('resize',()=>{ renderer.setSize(innerWidth,innerHeight); cam.aspect=innerWidth/innerHeight; cam.updateProjectionMatrix(); });
}

/* ── FEED ── */
function initFeed() {
  const feed     = document.getElementById('feed');
  const feedInner= document.querySelector('.feed-inner');

  /* ── 1. Clone cards para scroll infinito ── */
  const origCards = Array.from(feedInner.querySelectorAll('.card'));
  origCards.forEach(c => {
    const clone = c.cloneNode(true);
    feedInner.appendChild(clone);
  });

  /* Anima entrada dos originais; clones já visíveis */
  gsap.to(origCards, { opacity:1, y:0, duration:0.65, stagger:0.1, delay:0.2, ease:'power3.out' });
  feedInner.querySelectorAll('.card[data-clone]').forEach(c => {
    c.style.cssText += 'opacity:1;transform:translateY(0)';
  });

  /* ── 2. State ── */
  let active=null, scrollTimer=null, fillInt=null, jumping=false;
  let ignoreCollapse = false;

  /* ── 3. Helpers ── */
  const allCards = () => Array.from(feedInner.querySelectorAll('.card'));

  function getCentered() {
    const feedRect = feed.getBoundingClientRect();
    const viewMid  = feedRect.top + feed.clientHeight / 2;
    let best=null, bestD=Infinity;
    allCards().forEach(c => {
      const r = c.getBoundingClientRect();
      const d = Math.abs((r.top + r.height/2) - viewMid);
      if (d < bestD) { bestD=d; best=c; }
    });
    return best;
  }

  function expandCard(card) {
    if (active===card) return;
    if (active) collapseCard(active);
    active=card; card.classList.add('is-active');
    
    ignoreCollapse = true;
    setTimeout(() => { ignoreCollapse = false; }, 650);

    window._setBgPalette && window._setBgPalette(card.dataset.type);
    gsap.fromTo(card.querySelectorAll('.xi > *'),
      {opacity:0,y:16},{opacity:1,y:0,duration:0.42,stagger:0.065,ease:'power2.out',delay:0.1});
    startProg(card);
  }
  function collapseCard(card) {
    card.classList.remove('is-active'); stopProg(card);
    window._setBgPalette && window._setBgPalette('default');
  }
  function startProg(card) {
    stopProg(card);
    const fill=card.querySelector('.prog-fill'); let pct=0;
    fillInt=setInterval(()=>{ pct++; fill.style.width=pct+'%'; if(pct>=100) stopProg(card); },35);
  }
  function stopProg(card) {
    clearInterval(fillInt);
    const fill=card.querySelector('.prog-fill'); if(fill) fill.style.width='0%';
  }

  /* ── 4. Scroll: infinite loop + auto-expand ── */
  feed.addEventListener('scroll', () => {
    /* Colapsa o card atual ao rolar */
    if (!ignoreCollapse && active) { collapseCard(active); active=null; }

    /* ── Infinite scroll seamless ──
       Mede live (cards colapsados = altura estável) */
    if (!jumping && !active) {
      const singleH = feedInner.scrollHeight / 2;
      if (feed.scrollTop >= singleH) {
        jumping = true;
        feed.scrollTop -= singleH;          // pula de volta sem salto visual
        requestAnimationFrame(() => { jumping=false; });
      }
    }

    /* ── Auto-expand após pausa de 480ms ── */
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const best = getCentered();
      if (best && !active) expandCard(best);
    }, 480);
  }, { passive:true });

  /* ── 5. Interações em todos os cards (original + clone) ── */
  function attachCard(card) {
    /* Click: toggle manual */
    card.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      spawnRipple(card, e);
      if (card.classList.contains('is-active')) { collapseCard(card); active=null; }
      else expandCard(card);
    });

    /* Expand on hover for desktop */
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 768) expandCard(card);
    });
    /* 3-D tilt */
    let rect;
    const onMove=(cx,cy)=>{
      if(card.classList.contains('is-active')) return;
      if(!rect) rect=card.getBoundingClientRect();
      const x=(cx-rect.left)/rect.width-.5, y=(cy-rect.top)/rect.height-.5;
      gsap.to(card,{rotationY:x*10,rotationX:-y*7,transformPerspective:900,duration:0.35,ease:'power2.out',overwrite:'auto'});
    };
    const reset=()=>{
      gsap.to(card,{rotationY:0,rotationX:0,duration:0.6,ease:'elastic.out(1,0.75)',overwrite:'auto'});
      rect=null;
    };
    card.addEventListener('mousemove', e=>onMove(e.clientX,e.clientY));
    card.addEventListener('mouseleave', reset);
    card.addEventListener('touchmove',  e=>onMove(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
    card.addEventListener('touchend',   reset);

  }
  allCards().forEach(attachCard);

  /* ── 6. Expande primeiro card ao entrar ── */
  setTimeout(() => { const f=allCards()[0]; if(f) expandCard(f); }, 700);

  /* ── 7. Bottom nav ── */
  const navItems=document.querySelectorAll('.ni');
  navItems.forEach(item=>{
    item.addEventListener('click',()=>{
      const sc=item.dataset.sc;
      navItems.forEach(n=>n.classList.remove('on')); item.classList.add('on');
      gsap.fromTo(item,{scale:0.85},{scale:1,duration:0.4,ease:'elastic.out(1.2,0.6)'});
      if(sc==='feed'){closeScreen('profile');closeScreen('settings');}
      else openScreen(sc);
    });
  });
}

function openScreen(name) {
  const el=document.getElementById('sc-'+name); if(!el) return; el.classList.add('open');
  gsap.fromTo(el.querySelectorAll('.prof-body > *, .sc-hd, .set-grp'),{opacity:0,y:22},{opacity:1,y:0,duration:0.45,stagger:0.07,delay:0.2,ease:'power2.out'});
}
function closeScreen(name) {
  const el=document.getElementById('sc-'+name); if(el) el.classList.remove('open');
  document.querySelectorAll('.ni').forEach(n=>n.classList.toggle('on',n.dataset.sc==='feed'));
}
window.closeScreen=closeScreen;

document.querySelectorAll('.screen').forEach(sc=>{
  let sy=0;
  sc.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;},{passive:true});
  sc.addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-sy>80&&sc.scrollTop===0) closeScreen(sc.id.replace('sc-',''));});
});

function spawnRipple(el,e) {
  const r2=el.getBoundingClientRect(), cx=(e.clientX||r2.left+r2.width/2)-r2.left, cy=(e.clientY||r2.top+r2.height/2)-r2.top;
  const sz=Math.max(r2.width,r2.height)*.8;
  const r=document.createElement('div'); r.className='ripple-el';
  Object.assign(r.style,{width:sz+'px',height:sz+'px',left:(cx-sz/2)+'px',top:(cy-sz/2)+'px'});
  el.appendChild(r); r.addEventListener('animationend',()=>r.remove());
}