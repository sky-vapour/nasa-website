/* Abandoned But Not Forgotten — app.js
   Space background (Three.js stars + Moon + Mars), GSAP scrollytelling,
   procedural rover viewer, dust/storm sim, WebAudio ghosts, HUD. */
   /* LLM UPDATE MARKERS:
   - SITES array: update mission names, years, locations, equipment
   - TICKER_ITEMS: update ticker text
   - HUD messages: customize loader messages
   - All data can be modified per project
   */
(function(){
'use strict';
gsap.registerPlugin(ScrollTrigger);

/* ---------- ARCHIVE DATA (ported verbatim from web-1 lib/data.ts) ---------- */
const SITES = [
{id:'apollo-11',planet:'moon',name:'Tranquility Base',mission:'Apollo 11 · Eagle',agency:'NASA',year:1969,lat:'0.6741° N',lon:'23.4730° E',status:'Silent since 1969',solsActive:'21.5 hrs surface',massKg:'2,034 kg descent stage',equipment:['Eagle descent stage','Laser retroreflector (still used)','Passive seismometer','US flag & plaques','2 Hasselblad cameras','90+ discarded tools & PLSS packs'],story:'Armstrong and Aldrin left behind everything they did not need to get home — backpacks, boots, cameras, even a bag of human waste. The descent stage still sits where it landed, a launch pad for a takeoff watched by 600 million people. Scientists still bounce lasers off its retroreflector today.',epitaph:'The footprints are still there. No wind will ever erase them.',x:68,y:52,hue:45},
{id:'apollo-12',planet:'moon',name:'Ocean of Storms',mission:'Apollo 12 · Intrepid + Surveyor 3',agency:'NASA',year:1969,lat:'3.0124° S',lon:'23.4216° W',status:'Silent since 1977',solsActive:'ALSEP ran 2,671 days',massKg:'~2,211 kg + 270 kg Surveyor',equipment:['Intrepid descent stage','ALSEP central station + RTG','Surveyor 3 (visited on foot!)','Color TV camera','Solar wind spectrometer','Astronaut Bean’s camera'],story:'Pete Conrad landed Intrepid within walking distance of the robotic Surveyor 3 that had landed 2 years earlier. The crew cut pieces off Surveyor and brought them back to Earth — the only time humans have salvaged hardware from another world.',epitaph:'Two robots, three years apart, visited by two walking men.',x:38,y:58,hue:200},
{id:'apollo-14',planet:'moon',name:'Fra Mauro',mission:'Apollo 14 · Antares',agency:'NASA',year:1971,lat:'3.6453° S',lon:'17.4714° W',status:'Silent since 1977',solsActive:'ALSEP ran 2,334 days',massKg:'2,144 kg descent stage',equipment:['Antares descent stage','ALSEP array + mortar','Modular Equipment Transporter','Laser retroreflector','Golf balls (Shepard’s shot)','Javelin + tools'],story:'Alan Shepard hit two golf balls into the lunar dark with a makeshift club. Antares, the MET cart, science pallets and miles of cable remain. The ALSEP station phoned home until 1977, when NASA switched it off to fund Viking on Mars.',epitaph:'Miles and miles… well, about 2 miles. Fore!',x:44,y:60,hue:150},
{id:'apollo-15',planet:'moon',name:'Hadley–Apennine',mission:'Apollo 15 · Falcon + LRV-1',agency:'NASA',year:1971,lat:'26.1322° N',lon:'3.6339° E',status:'Rover parked forever',solsActive:'Rover drove 27.9 km',massKg:'2,809 kg + 210 kg rover',equipment:['Falcon descent stage','Lunar Roving Vehicle-1','ALSEP + heat-flow drill','Hammer & feather','UV camera','Subsatellite (crashed later)'],story:'The first Moon car. Scott and Irwin drove 28 km across rilles and mountains, then parked it with its TV camera aimed at the LM so Earth could watch liftoff. Its battery died within hours.',epitaph:'Odometer: 27.9 km. Fuel: forever empty.',x:56,y:34,hue:20},
{id:'apollo-16',planet:'moon',name:'Descartes Highlands',mission:'Apollo 16 · Orion + LRV-2',agency:'NASA',year:1972,lat:'8.9730° S',lon:'15.5002° E',status:'Rover parked forever',solsActive:'Rover drove 26.7 km',massKg:'2,765 kg + 210 kg rover',equipment:['Orion descent stage','Lunar Roving Vehicle-2','Far-UV camera','ALSEP + magnetometer','16mm movie camera','Family photo left by Charlie Duke'],story:'Young and Duke left a family portrait sealed in plastic on the dust. The far-UV camera they deployed is the only astronomical observatory on another world. LRV-2 is parked nearby, dust-covered.',epitaph:'A family photo under glass, in vacuum, forever.',x:60,y:62,hue:280},
{id:'apollo-17',planet:'moon',name:'Taurus–Littrow',mission:'Apollo 17 · Challenger + LRV-3',agency:'NASA',year:1972,lat:'20.1908° N',lon:'30.7717° E',status:'Last humans left 1972',solsActive:'Rover drove 35.9 km (record)',massKg:'2,798 kg + 210 kg rover',equipment:['Challenger descent stage + plaque','Lunar Roving Vehicle-3 (record holder)','ALSEP + gravimeter + drill cores','Orange soil sampler','Cosmic ray detector','Schmitt’s hammer, Cernan’s camera'],story:'The last camp. Cernan scratched his daughter’s initials — TDC — into the dust before climbing the ladder for the final time. The rover holds the off-world distance record: 35.9 km.',epitaph:'We leave as we came, and God willing, we shall return.',x:72,y:40,hue:350},
{id:'viking-1',planet:'mars',name:'Thomas Mutch Memorial Station',mission:'Viking 1',agency:'NASA',year:1976,lat:'22.27° N',lon:'312.05° E',status:'Silent since 1982',solsActive:'2,243 sols',massKg:'657 kg lander',equipment:['Viking 1 lander body','Biology lab (life experiment)','Seismometer (stuck)','Weather station','RTG power (decayed)','Heatshield + parachute nearby'],story:'The first fully successful Mars landing. It scooped soil looking for life, snapped the first panorama from the surface, and phoned home for six years until its battery died mid-winter.',epitaph:'It searched for life for 2,245 Martian days.',x:30,y:42,hue:30},
{id:'viking-2',planet:'mars',name:'Gerald Soffen Memorial Station',mission:'Viking 2',agency:'NASA',year:1976,lat:'48.27° N',lon:'134.28° E',status:'Silent since 1980',solsActive:'1,281 sols',massKg:'657 kg lander',equipment:['Viking 2 lander body','White frost photographed','Biology + chemistry labs','Seismometer','RTG','Descent hardware field'],story:'Twin of Viking 1, parked in Utopia Planitia where it photographed morning frost — water ice on Mars. Both Vikings operated years beyond their 90-day warranty.',epitaph:'First frost ever photographed on another planet.',x:62,y:24,hue:210},
{id:'pathfinder',planet:'mars',name:'Carl Sagan Memorial Station',mission:'Mars Pathfinder + Sojourner',agency:'NASA',year:1997,lat:'19.13° N',lon:'326.78° E',status:'Silent since 1997',solsActive:'83 sols + rover 7 sols',massKg:'360 kg + 11.5 kg rover',equipment:['Pathfinder tetrahedron lander','Sojourner — first Mars rover','Wedge ramps','APXS spectrometer','Wind socks','Name disc with 100k names'],story:'A beach ball landing: airbags bounced 15 times across Ares Vallis. Then a tiny 11-kg rover named Sojourner rolled down a ramp and became the internet’s first viral robot.',epitaph:'The little rover that taught the world to love robots.',x:44,y:48,hue:45},
{id:'spirit',planet:'mars',name:'Columbia Memorial Station',mission:'MER-A · Spirit',agency:'NASA',year:2004,lat:'14.57° S',lon:'175.48° E',status:'Stuck & silent since 2010',solsActive:'2,210 sols (90 planned!)',massKg:'185 kg rover + lander petals',equipment:['Spirit rover (bogged at Troy)','Landing petals + airbags','Parachute + heatshield + backshell','Rock abrasion tool','Mössbauer spectrometer','Memorial plaque for Columbia crew'],story:'Designed for 90 days, Spirit survived six years and 7.7 km — then broke through a crust into soft sand at Troy. It spent its last winter tilted toward a weak sun until silence on sol 2210.',epitaph:'My battery is low and it’s getting dark.',x:74,y:62,hue:15},
{id:'opportunity',planet:'mars',name:'Challenger Memorial Station',mission:'MER-B · Opportunity',agency:'NASA',year:2004,lat:'1.95° S',lon:'354.47° E',status:'Lost in dust storm 2018',solsActive:'5,111 sols (!!)',massKg:'185 kg rover',equipment:['Opportunity rover (Perseverance Valley)','Eagle Crater landing petals','Heatshield (visited its own shield!)','Parachute','DVD with 4 million names'],story:'The marathon runner. Planned for 90 sols, Oppy drove 45 km over 14 years and found proof Mars was once soaked in salty water. In June 2018 a planet-wide dust storm blotted out the sun. NASA listened for 8 months. Nothing.',epitaph:'45 km. 5,111 sunrises. One last dusty sunset.',x:52,y:56,hue:200},
{id:'phoenix',planet:'mars',name:'Green Valley',mission:'Phoenix',agency:'NASA',year:2008,lat:'68.22° N',lon:'234.25° E',status:'Frozen since 2008',solsActive:'155 sols',massKg:'350 kg lander',equipment:['Phoenix deck + robotic arm','Wet chemistry lab','Parachute + backshell','DVD with 250k names','Lidar weather mast','Ice-scraping scoop'],story:'Phoenix dug into Martian permafrost and tasted liquid water — the first direct touch. It photographed snow falling on Mars. When polar night came, its solar wings iced over.',epitaph:'It found water, then winter found it.',x:70,y:14,hue:180},
{id:'insight',planet:'mars',name:'Homestead Hollow',mission:'InSight + Mole',agency:'NASA',year:2018,lat:'4.50° N',lon:'135.62° E',status:'Dust-covered since 2022',solsActive:'1,440 sols',massKg:'358 kg lander',equipment:['InSight deck (solar wings dust-buried)','SEIS seismometer (marsquakes!)','The Mole (buried itself)','Wind + pressure sensors','RISE radio experiment','Microchips with 2.4M names'],story:'A stethoscope for Mars. InSight felt over 1,300 marsquakes and mapped the planet’s core. But Martian dust slowly smothered its solar panels from 100% to 5% power.',epitaph:'It listened to the heartbeat of Mars until its own stopped.',x:38,y:60,hue:260},
{id:'ingenuity',planet:'mars',name:'Valinor Hills · Chi Airfield',mission:'Ingenuity helicopter',agency:'NASA / JPL',year:2021,lat:'18.50° N',lon:'77.32° E',status:'Grounded since Jan 2024',solsActive:'72 flights · 17 km flown',massKg:'1.8 kg (!)',equipment:['Ingenuity (broken rotor blade)','Wright Brothers Field marker','Debris shield + deployment base','Photographed by Perseverance','Solar panel + tiny legs','Piece of the Wright Flyer aboard!'],story:'The first aircraft on another world weighed less than a bag of sugar and flew 72 times — when engineers hoped for 5. On its last landing it snapped a rotor blade on a featureless dune.',epitaph:'Kitty Hawk → Jezero Crater. 120 years apart, same dream.',x:58,y:44,hue:320}
];
const TICKER_ITEMS = ['6 descent stages on the Moon','3 lunar rovers parked forever','5 ALSEP stations (switched off 1977)','193,000+ kg of human artifacts on the Moon','Viking 1 · silent since 1982','Opportunity · 5,111 sols','Spirit · stuck at Troy','Ingenuity · 72 flights','InSight · 1,300+ marsquakes','Phoenix tasted Martian water','Sojourner · 11.5 kg pioneer','~14,000 kg of hardware on Mars'];

/* ---------- LOADER ---------- */
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderStatus = document.getElementById('loader-status');
const enterBtn = document.getElementById('enter-btn');
const msgs = ['ACQUIRING SIGNAL…','LOCKING DSN ANTENNA…','LOADING LUNAR REGOLITH…','SPINNING MARTIAN DUST…','SIGNAL LOCKED ✓'];
let lp = 0;
const lint = setInterval(()=>{
  lp += Math.random()*28;
  if(lp>=100){lp=100;clearInterval(lint);
    loaderStatus.textContent = msgs[4];
    enterBtn.hidden = false;
    loaderStatus.textContent = 'READY — CLICK TO DESCEND';
  } else {
    loaderBar.style.width = lp+'%';
    loaderStatus.textContent = msgs[Math.min(msgs.length-2, Math.floor(lp/25))];
  }
},220);
function dismissLoader(){ loader.classList.add('done'); setTimeout(()=>loader.remove(), 900); }
enterBtn.addEventListener('click', dismissLoader);
setTimeout(()=>{ if(document.body.contains(loader)) dismissLoader(); }, 7000); // auto-enter

/* ---------- HUD CLOCK + SCROLL ---------- */
const t0 = Date.now();
setInterval(()=>{
  const s = Math.floor((Date.now()-t0)/1000);
  const h=String(Math.floor(s/3600)).padStart(2,'0'), m=String(Math.floor(s%3600/60)).padStart(2,'0'), ss=String(s%60).padStart(2,'0');
  document.getElementById('hud-clock').textContent = `T+ ${h}:${m}:${ss}`;
},1000);

const fill = document.getElementById('scroll-progress-fill');
const hudCam = document.getElementById('hud-cam');
const hudCoord = document.getElementById('hud-coord');

/* ---------- SPACE BACKGROUND (Three.js) ---------- */
const canvas = document.getElementById('space-canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060a);
scene.fog = new THREE.FogExp2(0x05060a, 0.028);
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, .1, 200);
camera.position.set(0,0,14);

// round-dot sprite so points render as circles, not squares
const dotTex = (()=>{
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32,32,0,32,32,32);
  grd.addColorStop(0,'rgba(255,255,255,1)');
  grd.addColorStop(.45,'rgba(255,255,255,1)');
  grd.addColorStop(.75,'rgba(255,255,255,.55)');
  grd.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0,0,64,64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
})();

// stars — round particles in a normal 3D box field
function makeStars(n, spread, size, color){
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(n*3);
  for(let i=0;i<n;i++){ pos[i*3]=(Math.random()-.5)*spread; pos[i*3+1]=(Math.random()-.5)*spread; pos[i*3+2]=(Math.random()-.5)*spread; }
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const m = new THREE.PointsMaterial({size, color, map:dotTex, transparent:true, opacity:.9, alphaTest:.02, depthWrite:false, sizeAttenuation:true});
  return new THREE.Points(g,m);
}
scene.add(makeStars(2600, 160, .35, 0xffffff));
scene.add(makeStars(600, 120, .6, 0x9fd8ff));

// (planet spheres removed — pure starfield; depth comes from dust, warp + parallax)

scene.add(new THREE.AmbientLight(0x8899bb, .7));
const sun = new THREE.DirectionalLight(0xffffff, 1.2); sun.position.set(5,8,6); scene.add(sun);
const rim = new THREE.PointLight(0x57ffb2, .8, 60); rim.position.set(-8,-2,4); scene.add(rim);

function resize(){ renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

// scroll-driven camera flight
let scrollY01 = 0;
ScrollTrigger.create({
  trigger:'#story', start:'top top', end:'bottom bottom', scrub:.6,
  onUpdate(self){
    scrollY01 = self.progress;
    fill.style.width = (self.progress*100)+'%';
    // fake telemetry
    document.getElementById('t-vel').textContent = (self.progress*11).toFixed(1);
    document.getElementById('t-alt').textContent = Math.floor(408 + self.progress*383992);
    hudCoord.textContent = `LAT ${(self.progress*24.5).toFixed(2)} · LON ${(self.progress*77.4).toFixed(2)}`;
  }
});
// per-panel CAM label
document.querySelectorAll('.panel').forEach(p=>{
  ScrollTrigger.create({trigger:p, start:'top 55%', end:'bottom 55%',
    onToggle(self){ if(self.isActive) hudCam.textContent = 'CAM 0'+(1+Math.floor(Math.random()*7))+' · '+p.dataset.cam; }});
});

(function animateSpace(){
  requestAnimationFrame(animateSpace);
  const t = performance.now()*.0002;
  // camera flies: orbital -> moon flyby -> mars descent (+ mouse parallax from web-1 starfield)
  const sh = (window.__sceneShift||{x:0,y:0});
  camera.position.x = Math.sin(scrollY01*Math.PI*2)*2 + scrollY01*2 + sh.x*1.4;
  camera.position.y = 2 - scrollY01*10 + sh.y*1.0;
  camera.position.z = 14 - scrollY01*6;
  camera.lookAt(camera.position.x*.4, camera.position.y-1.5, -20);
  rim.intensity = .6 + Math.sin(t*8)*.25;
  renderer.render(scene, camera);
})();

/* ---------- WEB-1 PORT: mouse parallax + shooting star ---------- */
addEventListener('mousemove', e=>{
  window.__sceneShift = {x: e.clientX/innerWidth - .5, y: -(e.clientY/innerHeight - .5)};
});
(function shootingStar(){
  const el = document.createElement('div');
  el.id = 'shooting-star'; document.body.appendChild(el);
  function shoot(){
    const x = Math.random()*innerWidth*.8, y = Math.random()*innerHeight*.3;
    el.style.left = x+'px'; el.style.top = y+'px'; el.style.opacity = '1';
    el.animate([{transform:'translateX(0) rotate(-18deg)', opacity:1},{transform:'translateX(220px) translateY(84px) rotate(-18deg)', opacity:0}],{duration:900, easing:'ease-out'}).onfinish = ()=>{ el.style.opacity='0'; };
    setTimeout(shoot, 3500 + Math.random()*4500);
  }
  setTimeout(shoot, 2500);
})();

/* ---------- GSAP REVEALS + COUNTERS + OPPY BAR ---------- */
document.querySelectorAll('.reveal').forEach(el=>{
  gsap.to(el, {opacity:1, y:0, duration:1, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 88%'}});
});
document.querySelectorAll('[data-count]').forEach(el=>{
  const target = +el.dataset.count;
  ScrollTrigger.create({trigger:el, start:'top 90%', once:true, onEnter(){
    const obj = {v:0};
    gsap.to(obj, {v:target, duration:1.8, ease:'power2.out', onUpdate(){ el.textContent = Math.round(obj.v).toLocaleString(); }});
  }});
});
gsap.to('.oppy-bar div', {width:'100%', duration:1.6, ease:'power2.inOut',
  scrollTrigger:{trigger:'.oppy-bar', start:'top 85%'}});

/* ---------- HOTSPOTS ---------- */
const HOTSPOT_COPY = {
  'descent engine':'DESCENT ENGINE — the throttleable DPS that soft-landed Eagle. Still bolted to the stage, bell pointed at moondust forever.',
  'ladder / plaque':'LADDER + PLAQUE — “HERE MEN FROM PLANET EARTH FIRST SET FOOT…” 9 rungs, last touched by Cernan-class boots in ’72.',
  'footpad':'FOOTPAD — Buzz’s famous “magnificent desolation” print is meters away. No wind = prints last ~1M years.',
  'wire-mesh wheels':'WIRE-MESH WHEELS — titanium mesh + zinc-coated piano wire. No rubber: it would freeze-shatter at −130°C.',
  'TV camera':'RCA TV CAMERA — ground-controlled from Houston. Filmed Apollo 17’s liftoff, then a static plain. Still aimed at nothing.',
  'abandoned fender repair':'FENDER FIX — Cernan’s hammer snapped it; Schmitt taped maps over it. Without that, rooster-tails of dust would’ve killed the suits.',
  'retroreflector — still used!':'RETROREFLECTOR — the only “abandoned” gear still working. Fire a laser from Earth, get photons back in 2.5 s.',
  '96 bags of human waste':'96 BAGS — jettisoned to save ascent weight. Future archaeologists’ problem. Possibly harboring dormant microbes.',
  'discarded Hasselblad cameras':'HASSELBLADS — 12 bodies left behind (film backs came home). Each click is now a museum piece in vacuum.'
};
document.querySelectorAll('.hotspot').forEach(h=>{
  h.addEventListener('click', ()=>{
    const card = h.closest('.artifact');
    const box = card.querySelector('.hotspot-info');
    card.querySelectorAll('.hotspot').forEach(x=>x.classList.remove('open'));
    h.classList.add('open');
    box.hidden = false;
    box.innerHTML = '<b>◉ '+h.dataset.hotspot.toUpperCase()+'</b><br>'+(HOTSPOT_COPY[h.dataset.hotspot]||'Logged in the surface journal.');
    gsap.fromTo(box,{opacity:0,x:-8},{opacity:1,x:0,duration:.4});
  });
});
document.querySelectorAll('[data-expand]').forEach(b=>{
  b.addEventListener('click', ()=>{
    const card = b.closest('.artifact');
    const box = card.querySelector('.hotspot-info');
    const keys = [...card.querySelectorAll('.hotspot')].map(h=>h.dataset.hotspot);
    box.hidden = false;
    box.innerHTML = keys.map(k=>'<b>◉ '+k.toUpperCase()+'</b><br>'+(HOTSPOT_COPY[k]||'Logged.')+'<br><br>').join('');
    b.textContent = '▾ FIELD LOG OPEN';
  });
});

/* ---------- ROVER VIEWER (procedural Three.js — High-Res) ---------- */
const rc = document.getElementById('rover-canvas');
const rRen = new THREE.WebGLRenderer({canvas:rc, antialias:true, alpha:true, powerPreference:'high-performance'});
rRen.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
rRen.shadowMap.enabled = true;
rRen.shadowMap.type = THREE.PCFSoftShadowMap;
rRen.toneMapping = THREE.ACESFilmicToneMapping;
rRen.toneMappingExposure = 1.1;

const rScene = new THREE.Scene();
const rCam = new THREE.PerspectiveCamera(42, 2, .1, 100);
rCam.position.set(4.4, 2.5, 5.4);

// Lighting: Martian daylight with soft red-soil bounce
rScene.add(new THREE.AmbientLight(0x5a3528, .65));
const key = new THREE.DirectionalLight(0xffecd4, 1.35);
key.position.set(5.5, 7.5, 4.5);
key.castShadow = true;
key.shadow.mapSize.width = 2048;
key.shadow.mapSize.height = 2048;
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 25;
key.shadow.camera.left = -4.5;
key.shadow.camera.right = 4.5;
key.shadow.camera.top = 4.5;
key.shadow.camera.bottom = -4.5;
key.shadow.bias = -0.0004;
rScene.add(key);

const fillL = new THREE.PointLight(0xeb6b38, .75, 25);
fillL.position.set(-3.5, 0.4, -2.5);
rScene.add(fillL);

const rimL = new THREE.PointLight(0x57ffb2, .4, 30);
rimL.position.set(3, 4, -4);
rScene.add(rimL);

const rFog = new THREE.FogExp2(0x702a16, 0.015);
rScene.fog = rFog;

// 3D swirling sandstorm particle system inside rScene
const stormPartCount = 1200;
const stormGeo = new THREE.BufferGeometry();
const stormPos = new Float32Array(stormPartCount * 3);
const stormVels = new Float32Array(stormPartCount * 3);
for(let i=0; i<stormPartCount; i++){
  stormPos[i*3] = (Math.random() - 0.5) * 16;
  stormPos[i*3+1] = -0.8 + Math.random() * 4.5;
  stormPos[i*3+2] = (Math.random() - 0.5) * 16;
  stormVels[i*3] = -0.16 - Math.random() * 0.28;
  stormVels[i*3+1] = (Math.random() - 0.5) * 0.04;
  stormVels[i*3+2] = (Math.random() - 0.5) * 0.06;
}
stormGeo.setAttribute('position', new THREE.BufferAttribute(stormPos, 3));
const stormPartMat = new THREE.PointsMaterial({
  size: 0.16,
  color: 0xee7838,
  map: dotTex,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const stormPoints = new THREE.Points(stormGeo, stormPartMat);
rScene.add(stormPoints);

// High-res procedural textures
const solarTex = (()=>{
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#0b1329'; g.fillRect(0,0,512,512);
  const cols=8, rows=8, pad=4;
  const cw = (512 - pad*(cols+1))/cols;
  const ch = (512 - pad*(rows+1))/rows;
  for(let x=0; x<cols; x++){
    for(let y=0; y<rows; y++){
      const px = pad + x*(cw+pad), py = pad + y*(ch+pad);
      const grd = g.createLinearGradient(px, py, px+cw, py+ch);
      grd.addColorStop(0, '#101e40');
      grd.addColorStop(0.5, '#1e3a8a');
      grd.addColorStop(1, '#0c1730');
      g.fillStyle = grd; g.fillRect(px, py, cw, ch);
      g.strokeStyle = 'rgba(180, 215, 255, 0.45)'; g.lineWidth = 1;
      g.beginPath();
      g.moveTo(px+cw*0.33, py); g.lineTo(px+cw*0.33, py+ch);
      g.moveTo(px+cw*0.66, py); g.lineTo(px+cw*0.66, py+ch);
      g.stroke();
      g.strokeStyle = 'rgba(120, 160, 220, 0.2)';
      for(let gy=py+4; gy<py+ch; gy+=6){
        g.beginPath(); g.moveTo(px+1, gy); g.lineTo(px+cw-1, gy); g.stroke();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
})();

const marsTex = (()=>{
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#7a2f1e'; g.fillRect(0,0,512,512);
  for(let i=0; i<16000; i++){
    const x=Math.random()*512, y=Math.random()*512, sz=Math.random()*2.4+0.5;
    const lum=Math.random();
    g.fillStyle = lum>0.6 ? 'rgba(195, 95, 50, 0.25)' : (lum<0.3 ? 'rgba(50, 15, 10, 0.35)' : 'rgba(235, 120, 65, 0.18)');
    g.beginPath(); g.arc(x, y, sz, 0, Math.PI*2); g.fill();
  }
  // Twin wheel ruts in the sand
  g.fillStyle = 'rgba(42, 12, 8, 0.38)';
  g.fillRect(172, 0, 36, 512); g.fillRect(304, 0, 36, 512);
  g.strokeStyle = 'rgba(215, 105, 55, 0.35)'; g.lineWidth = 2;
  for(let ty=0; ty<512; ty+=12){
    g.beginPath(); g.moveTo(172, ty); g.lineTo(208, ty+4); g.stroke();
    g.beginPath(); g.moveTo(304, ty); g.lineTo(340, ty+4); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  return t;
})();

const goldFoilTex = (()=>{
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#caa357'; g.fillRect(0,0,256,256);
  for(let i=0; i<5000; i++){
    const x=Math.random()*256, y=Math.random()*256, sz=Math.random()*3+1;
    g.fillStyle = Math.random()>.5 ? 'rgba(255, 220, 140, 0.35)' : 'rgba(120, 80, 20, 0.3)';
    g.fillRect(x,y,sz,sz);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
})();

// Martian terrain with rocks
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(7.5, 64),
  new THREE.MeshStandardMaterial({map:marsTex, roughness:0.95, metalness:0.04})
);
ground.rotation.x = -Math.PI/2; ground.position.y = -.92;
ground.receiveShadow = true;
rScene.add(ground);

const rockGroup = new THREE.Group();
const rockMat = new THREE.MeshStandardMaterial({color:0x6b291a, roughness:0.9, metalness:0.1});
const rockCoords = [[-2.5, -1.8, .35], [2.8, -2.1, .28], [-1.8, 2.5, .22], [3.2, 1.4, .4], [-3.1, .8, .26], [1.4, 3.2, .18], [-0.4, -2.8, .25]];
rockCoords.forEach(([rx, rz, rs])=>{
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rs, 1), rockMat);
  rock.position.set(rx, -0.92 + rs*0.65, rz);
  rock.rotation.set(Math.random()*3, Math.random()*3, Math.random()*3);
  rock.castShadow = true; rock.receiveShadow = true;
  rockGroup.add(rock);
});
rScene.add(rockGroup);

const rover = new THREE.Group();
rScene.add(rover);
let dustMat; // referenced by dust slider

function buildRover(kind){
  while(rover.children.length) rover.remove(rover.children[0]);

  const bodyMat = new THREE.MeshStandardMaterial({map:goldFoilTex, color:0xd5b672, metalness:.65, roughness:.38});
  const darkMat = new THREE.MeshStandardMaterial({color:0x22262d, metalness:.75, roughness:.42});
  const alloyMat = new THREE.MeshStandardMaterial({color:0x98a2b3, metalness:.85, roughness:.3});
  const glassMat = new THREE.MeshStandardMaterial({color:0x57ffb2, metalness:.9, roughness:.1, transparent:true, opacity:.85});
  const solarMat = new THREE.MeshStandardMaterial({map:solarTex, metalness:.6, roughness:.25});
  dustMat = new THREE.MeshStandardMaterial({color:0xb86538, transparent:true, opacity:.2, roughness:.95, depthWrite:false});

  const castAll = obj => {
    obj.traverse(c=>{ if(c.isMesh){ c.castShadow = true; c.receiveShadow = true; } });
  };

  if(kind==='ingenuity'){
    // Ingenuity fuselage
    const box = new THREE.Mesh(new THREE.BoxGeometry(.72,.42,.72), bodyMat);
    box.position.y = 0.15; rover.add(box);

    // Optical flow camera lens + laser altimeter on underside
    const camG = new THREE.CylinderGeometry(.06,.06,.1,16);
    const camMesh = new THREE.Mesh(camG, darkMat); camMesh.position.set(0,-.1,0); rover.add(camMesh);
    const lensMesh = new THREE.Mesh(new THREE.CircleGeometry(.045,16), glassMat); lensMesh.rotation.x=Math.PI/2; lensMesh.position.set(0,-.16,0); rover.add(lensMesh);

    // 4 springy carbon composite landing legs with footpads
    const legG = new THREE.CylinderGeometry(.018,.015,1.25,12);
    const footG = new THREE.CylinderGeometry(.08,.08,.02,16);
    [[-.32,-.32, -0.4, -0.4],[.32,-.32, 0.4, -0.4],[-.32,.32, -0.4, 0.4],[.32,.32, 0.4, 0.4]].forEach(([x,z, rx, rz])=>{
      const legGroup = new THREE.Group();
      const l = new THREE.Mesh(legG, darkMat);
      l.position.set(0, -0.55, 0);
      legGroup.position.set(x, 0.15, z);
      legGroup.rotation.z = rx; legGroup.rotation.x = rz;
      legGroup.add(l);
      const foot = new THREE.Mesh(footG, alloyMat);
      foot.position.set(0, -1.15, 0);
      legGroup.add(foot);
      rover.add(legGroup);
    });

    // Central rotor mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,1.25,16), alloyMat);
    mast.position.y = 0.82; rover.add(mast);

    // Coaxial counter-rotating dual rotor blades
    const hubG = new THREE.CylinderGeometry(.08,.08,.08,16);
    const bladeG = new THREE.BoxGeometry(1.9,.02,.14);
    window._blades = [];
    [0.98, 1.26].forEach((y, i)=>{
      const hub = new THREE.Mesh(hubG, darkMat); hub.position.y = y; rover.add(hub);
      const b = new THREE.Mesh(bladeG, new THREE.MeshStandardMaterial({color:0x181a1f, roughness:.5, metalness:.5}));
      b.position.y = y; b.userData.spin = i? -1:1; rover.add(b); window._blades.push(b);
    });

    // Top solar panel + dust coat
    const panelWrap = new THREE.Group(); panelWrap.position.y = 1.45;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.05,.02,.48), solarMat); panelWrap.add(panel);
    const dustLayer = new THREE.Mesh(new THREE.BoxGeometry(1.06,.025,.49), dustMat); panelWrap.add(dustLayer);
    rover.add(panelWrap);

    // Whip antenna
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.4,8), alloyMat);
    ant.position.set(0, 1.7, 0); rover.add(ant);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(.02,12,12), alloyMat);
    tip.position.set(0, 1.9, 0); rover.add(tip);

    document.getElementById('rover-name').textContent = 'INGENUITY · MARS HELICOPTER · 72 FLIGHTS';
    castAll(rover);
    return;
  }

  // MER-Class Rover Body (Spirit & Opportunity)
  const isOppy = kind==='opportunity';

  // 1. Warm Electronics Box (WEB chassis)
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.65, .38, 1.15), bodyMat);
  chassis.position.y = 0.05; rover.add(chassis);

  // 2. Winged Solar Array Deck (Central + Left & Right Wings)
  const solarGroup = new THREE.Group(); solarGroup.position.y = 0.28;
  const mainDeck = new THREE.Mesh(new THREE.BoxGeometry(1.7, .04, 1.2), solarMat);
  solarGroup.add(mainDeck);

  // Angled side solar wings
  const wingG = new THREE.BoxGeometry(0.7, .03, 1.15);
  const leftWing = new THREE.Mesh(wingG, solarMat);
  leftWing.position.set(0, 0.02, 0.95); leftWing.rotation.x = 0.12;
  solarGroup.add(leftWing);

  const rightWing = new THREE.Mesh(wingG, solarMat);
  rightWing.position.set(0, 0.02, -0.95); rightWing.rotation.x = -0.12;
  solarGroup.add(rightWing);

  // Translucent dust accumulation coat covering the solar cells
  const dustDeck = new THREE.Mesh(new THREE.BoxGeometry(1.72, .048, 1.22), dustMat);
  solarGroup.add(dustDeck);
  const dustLeftWing = new THREE.Mesh(new THREE.BoxGeometry(0.71, .036, 1.16), dustMat);
  dustLeftWing.position.set(0, 0.02, 0.95); dustLeftWing.rotation.x = 0.12;
  solarGroup.add(dustLeftWing);
  const dustRightWing = new THREE.Mesh(new THREE.BoxGeometry(0.71, .036, 1.16), dustMat);
  dustRightWing.position.set(0, 0.02, -0.95); dustRightWing.rotation.x = -0.12;
  solarGroup.add(dustRightWing);

  rover.add(solarGroup);

  // 3. Pancam Mast Assembly (PMA)
  const mastBase = new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.15,16), darkMat);
  mastBase.position.set(.6, .35, 0); rover.add(mastBase);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,1.05,16), darkMat);
  mast.position.set(.6, .85, 0); rover.add(mast);

  // Pan/tilt gimbal head
  const head = new THREE.Mesh(new THREE.BoxGeometry(.46,.18,.26), darkMat);
  head.position.set(.6, 1.4, 0); rover.add(head);

  // Stereo Pancam lenses
  const eyeG = new THREE.CylinderGeometry(.045,.045,.14,16);
  [-.12, .12].forEach(z=>{
    const e = new THREE.Mesh(eyeG, alloyMat);
    e.rotation.z = Math.PI/2; e.position.set(.82, 1.4, z); rover.add(e);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(.04, 16), glassMat);
    glass.rotation.y = Math.PI/2; glass.position.set(.895, 1.4, z); rover.add(glass);
  });

  // Navcams & Sunsensor
  const sunSensor = new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.08,12), alloyMat);
  sunSensor.position.set(.54, 1.52, 0); rover.add(sunSensor);

  // 4. High-Gain Gimbaled Antenna (HGA)
  const dishGroup = new THREE.Group(); dishGroup.position.set(-.45, .5, -.25); dishGroup.rotation.z = .35;
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(.26, .08, .08, 24), alloyMat);
  dishGroup.add(dish);
  const feed = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.22,12), darkMat);
  feed.position.y = .14; dishGroup.add(feed);
  rover.add(dishGroup);

  // Low-Gain Antenna mast
  const lga = new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.85,12), alloyMat);
  lga.position.set(-.65, .65, .35); rover.add(lga);

  // 5. Robotic Arm (Instrument Deployment Device — IDD)
  const armGroup = new THREE.Group(); armGroup.position.set(.8, -.05, .25);
  const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.45,12), darkMat);
  seg1.rotation.z = -Math.PI/3; seg1.position.set(.18,-.1,0); armGroup.add(seg1);
  const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.4,12), darkMat);
  seg2.rotation.z = Math.PI/4; seg2.position.set(.45,-.25,0); armGroup.add(seg2);
  const turret = new THREE.Mesh(new THREE.DodecahedronGeometry(.09), alloyMat);
  turret.position.set(.62,-.38,0); armGroup.add(turret);
  rover.add(armGroup);

  // 6. Rocker-Bogie Suspension & Wheels (6 wheels)
  const wheelG = new THREE.CylinderGeometry(.34, .34, .24, 24);
  const hubG = new THREE.CylinderGeometry(.12, .12, .26, 16);
  const wheelM = new THREE.MeshStandardMaterial({color:0x33373e, metalness:.7, roughness:.65});
  const stuckWheelM = new THREE.MeshStandardMaterial({color:0x856545, metalness:.3, roughness:.9}); // Oppy's worn right-front wheel

  const wheelPositions = [
    [-.75, -.78, 0], [0, -.82, 1], [.78, -.78, 2], // left wheels
    [-.75, .78, 3],  [0, .82, 4],  [.78, .78, 5]   // right wheels
  ];

  wheelPositions.forEach(([x, z, idx])=>{
    const isStuck = isOppy && idx === 5;
    const wGroup = new THREE.Group();
    wGroup.position.set(x, -.46, z);

    // Opportunity's right-front steering actuator jammed at 8° in 2005
    if(isStuck){ wGroup.rotation.y = 0.14; }

    const w = new THREE.Mesh(wheelG, isStuck ? stuckWheelM : wheelM);
    w.rotation.x = Math.PI/2; wGroup.add(w);

    const hub = new THREE.Mesh(hubG, alloyMat);
    hub.rotation.x = Math.PI/2; wGroup.add(hub);

    // Suspension strut linkages
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(.032, .032, .5, 12), darkMat);
    strut.position.set(0, .24, 0); strut.rotation.z = (x>0? -.25 : .25);
    wGroup.add(strut);

    rover.add(wGroup);
  });

  document.getElementById('rover-name').textContent =
    isOppy ? 'MER-B · OPPORTUNITY · 2004–2018 (5,111 SOLS)' : 'MER-A · SPIRIT · 2004–2010 (2,210 SOLS)';

  castAll(rover);
}

buildRover('spirit');

// Drag rotate + Zoom with smooth inertia
let dragging=false, px=0, py=0, rotY=.65, tilt=.26, dist=6.6;
rc.addEventListener('pointerdown', e=>{dragging=true;px=e.clientX;py=e.clientY;rc.setPointerCapture(e.pointerId);});
addEventListener('pointerup', ()=>dragging=false);
addEventListener('pointermove', e=>{
  if(!dragging) return;
  rotY += (e.clientX-px)*.008;
  tilt = Math.max(-.15, Math.min(1.05, tilt+(e.clientY-py)*.0045));
  px=e.clientX; py=e.clientY;
});
rc.addEventListener('wheel', e=>{
  e.preventDefault();
  dist = Math.max(3.2, Math.min(11, dist+e.deltaY*.0045));
},{passive:false});

function sizeRover(){
  const w = rc.clientWidth || rc.parentElement.clientWidth || 600;
  const h = rc.clientHeight || 500;
  rRen.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  rRen.setSize(w, h, false);
  rCam.aspect = w/h;
  rCam.updateProjectionMatrix();
}
addEventListener('resize', sizeRover);
sizeRover();

(function animateRover(){
  requestAnimationFrame(animateRover);
  rover.rotation.y += ((rotY) - rover.rotation.y)*.08 + (dragging ? 0 : .0012);

  // Dynamic atmospheric response to sandstorm
  const isStorm = window.__stormActive;
  const targetFog = isStorm ? 0.16 : 0.015;
  rFog.density += (targetFog - rFog.density) * 0.04;

  const targetKeyInt = isStorm ? 0.2 : 1.35;
  key.intensity += (targetKeyInt - key.intensity) * 0.04;

  const targetPartOp = isStorm ? 0.85 : 0;
  stormPartMat.opacity += (targetPartOp - stormPartMat.opacity) * 0.05;

  if(stormPartMat.opacity > 0.01){
    const posArr = stormGeo.attributes.position.array;
    for(let i=0; i<stormPartCount; i++){
      posArr[i*3] += stormVels[i*3];
      posArr[i*3+1] += stormVels[i*3+1];
      posArr[i*3+2] += stormVels[i*3+2];
      if(posArr[i*3] < -8){
        posArr[i*3] = 8;
        posArr[i*3+1] = -0.8 + Math.random() * 4.5;
        posArr[i*3+2] = (Math.random() - 0.5) * 16;
      }
    }
    stormGeo.attributes.position.needsUpdate = true;
  }

  // Camera wind tremor when storm is active
  const stormShake = isStorm ? 0.018 : 0;
  const shakeX = (Math.random() - 0.5) * stormShake;
  const shakeY = (Math.random() - 0.5) * stormShake;

  rCam.position.set(
    Math.sin(rotY)*dist*Math.cos(tilt) + shakeX,
    1.1+tilt*2.8 + shakeY,
    Math.cos(rotY)*dist*Math.cos(tilt)
  );
  rCam.lookAt(0, .15, 0);
  if(window._blades) window._blades.forEach(b=>b.rotation.y += .28*b.userData.spin);
  rRen.render(rScene, rCam);
})();

document.querySelectorAll('.viewer-btns button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.viewer-btns button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    buildRover(b.dataset.rover);
    applyDust(+slider.value);
  });
});

/* ---------- DUST + REALISTIC SANDSTORM SIMULATION ---------- */
const slider = document.getElementById('dust-slider');
const dustVal = document.getElementById('dust-val');
const powerFill = document.getElementById('power-fill');
const powerVal = document.getElementById('power-val');
const dustOverlay = document.getElementById('dust-overlay');
const stormCv = document.getElementById('storm-canvas');
const sCtx = stormCv ? stormCv.getContext('2d') : null;
let stormWidth = window.innerWidth, stormHeight = window.innerHeight;

function resizeStorm(){
  if(!stormCv) return;
  stormWidth = stormCv.width = window.innerWidth;
  stormHeight = stormCv.height = window.innerHeight;
}
window.addEventListener('resize', resizeStorm);
resizeStorm();

// 1. High velocity sand streaks with motion blur
const STREAK_COUNT = 180;
const streaks = [];
for(let i=0; i<STREAK_COUNT; i++){
  streaks.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    len: 35 + Math.random() * 85,
    speed: 24 + Math.random() * 28,
    thick: 0.8 + Math.random() * 1.8,
    alpha: 0.25 + Math.random() * 0.55,
    hue: Math.random() > 0.4 ? 'rgba(235, 115, 55,' : (Math.random() > 0.5 ? 'rgba(180, 65, 25,' : 'rgba(255, 175, 95,')
  });
}

// 2. Swirling billowing dust clouds / puffs (macro fog clouds)
const PUFF_COUNT = 16;
const puffs = [];
for(let i=0; i<PUFF_COUNT; i++){
  puffs.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 140 + Math.random() * 260,
    speed: 6 + Math.random() * 14,
    alpha: 0.07 + Math.random() * 0.14,
    pulse: Math.random() * Math.PI * 2,
    color: i % 2 === 0 ? '195, 80, 32' : '135, 45, 18'
  });
}

let stormOn = false;
window.__stormActive = false;
let stormActiveIntensity = 0; // 0 to 1

(function renderStormLoop(){
  requestAnimationFrame(renderStormLoop);
  if(!sCtx || !stormCv) return;

  // smoothly ramp storm intensity
  stormActiveIntensity += ((stormOn ? 1 : 0) - stormActiveIntensity) * 0.05;
  if(stormActiveIntensity < 0.005){
    sCtx.clearRect(0, 0, stormWidth, stormHeight);
    return;
  }

  sCtx.clearRect(0, 0, stormWidth, stormHeight);

  // Atmospheric red-ochre dust haze
  sCtx.fillStyle = `rgba(145, 50, 18, ${stormActiveIntensity * 0.32})`;
  sCtx.fillRect(0, 0, stormWidth, stormHeight);

  // Render billowing dust puffs
  puffs.forEach(p=>{
    p.x -= p.speed;
    p.pulse += 0.02;
    if(p.x < -p.r * 2){
      p.x = stormWidth + p.r;
      p.y = Math.random() * stormHeight;
    }
    const curR = p.r * (1 + Math.sin(p.pulse) * 0.15);
    const grad = sCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curR);
    const a = p.alpha * stormActiveIntensity;
    grad.addColorStop(0, `rgba(${p.color}, ${a})`);
    grad.addColorStop(0.5, `rgba(${p.color}, ${a * 0.6})`);
    grad.addColorStop(1, `rgba(${p.color}, 0)`);
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    sCtx.fill();
  });

  // Render whipping sand streaks
  streaks.forEach(s=>{
    s.x -= s.speed;
    s.y += s.speed * 0.16; // downward gust angle
    if(s.x < -s.len || s.y > stormHeight + 40){
      s.x = stormWidth + Math.random() * 80;
      s.y = Math.random() * stormHeight - 50;
      s.speed = 24 + Math.random() * 28;
    }
    const a = s.alpha * stormActiveIntensity;
    sCtx.strokeStyle = `${s.hue} ${a})`;
    sCtx.lineWidth = s.thick;
    sCtx.beginPath();
    sCtx.moveTo(s.x, s.y);
    sCtx.lineTo(s.x + s.len, s.y - s.len * 0.16);
    sCtx.stroke();
  });
})();

function applyDust(v){
  dustVal.textContent = v + '%';
  dustOverlay.style.opacity = .1 + v/100*.55;
  if(dustMat) dustMat.opacity = Math.max(0.04, v/100*.92);
  const wh = Math.round(840 * (1 - v/130));
  powerVal.textContent = wh + ' Wh';
  powerFill.style.width = Math.max(4, 100 - v) + '%';
  powerFill.style.background = v > 75 ? 'var(--mars)' : 'linear-gradient(90deg,var(--neon),var(--amber))';
}
slider.addEventListener('input', ()=>applyDust(+slider.value));
applyDust(20);

const stormBtn = document.getElementById('storm-btn');
function setStorm(on){
  stormOn = on;
  window.__stormActive = on;
  if(stormCv) stormCv.classList.toggle('on', on);
  document.body.classList.toggle('storm-active', on);
  stormBtn.textContent = on ? '◉ STORM ACTIVE — CLICK TO CLEAR' : '◉ TRIGGER SANDSTORM';

  if(on){
    // If WebAudio is playing, tune mode to wind
    if(playing && mode !== 'wind'){
      document.querySelector('.sound-modes [data-mode="wind"]')?.click();
    }
    let v = +slider.value;
    const iv = setInterval(()=>{
      v = Math.min(100, v + 4);
      slider.value = v;
      applyDust(v);
      if(v >= 100 || !stormOn) clearInterval(iv);
    }, 180);
  }
}
stormBtn.addEventListener('click', ()=>setStorm(!stormOn));
document.getElementById('reset-btn').addEventListener('click', ()=>{
  setStorm(false);
  slider.value = 20;
  applyDust(20);
});

/* ---------- WEBAUDIO GHOSTS + VISUALIZERS ---------- */
let actx=null, master=null, playing=false, mode='static', nodes=[];
const soundBtn = document.getElementById('sound-btn');
const soundLabel = document.getElementById('sound-label');
const bigBtn = document.getElementById('big-sound-btn');
function ensureAudio(){
  if(actx) return;
  actx = new (window.AudioContext||window.webkitAudioContext)();
  master = actx.createGain(); master.gain.value=.5;
  const analyser = actx.createAnalyser(); analyser.fftSize=256;
  master.connect(analyser); analyser.connect(actx.destination);
  actx._analyser = analyser;
}
function stopNodes(){ nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}}); nodes=[]; }
function startMode(){
  stopNodes(); ensureAudio(); actx.resume();
  if(mode==='static'){
    const buf = actx.createBuffer(1, actx.sampleRate*2, actx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*.25;
    const src = actx.createBufferSource(); src.buffer=buf; src.loop=true;
    const f = actx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=900;
    const lfo = actx.createOscillator(); lfo.frequency.value=.07;
    const lg = actx.createGain(); lg.gain.value=400; lfo.connect(lg); lg.connect(f.frequency);
    src.connect(f); f.connect(master); src.start(); lfo.start(); nodes.push(src,lfo);
    const hum = actx.createOscillator(); hum.type='sine'; hum.frequency.value=54;
    const hg = actx.createGain(); hg.gain.value=.05; hum.connect(hg); hg.connect(master); hum.start(); nodes.push(hum);
  } else if(mode==='beeps'){
    const g = actx.createGain(); g.gain.value=.0; g.connect(master);
    const o = actx.createOscillator(); o.type='square'; o.frequency.value=2525; o.connect(g); o.start();
    nodes.push(o);
    const iv = setInterval(()=>{ if(!playing){clearInterval(iv);return;}
      const t=actx.currentTime; g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(.18,t); g.gain.setValueAtTime(.18,t+.09); g.gain.linearRampToValueAtTime(0,t+.1);
    }, 2000); nodes.push({stop:()=>clearInterval(iv), disconnect:()=>clearInterval(iv)});
  } else { // wind
    const buf = actx.createBuffer(1, actx.sampleRate*2, actx.sampleRate);
    const d = buf.getChannelData(0); let last=0;
    for(let i=0;i<d.length;i++){ const w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.2; }
    const src = actx.createBufferSource(); src.buffer=buf; src.loop=true;
    const f = actx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=400; f.Q.value=.6;
    const lfo = actx.createOscillator(); lfo.frequency.value=.11;
    const lg = actx.createGain(); lg.gain.value=250; lfo.connect(lg); lg.connect(f.frequency);
    src.connect(f); f.connect(master); src.start(); lfo.start(); nodes.push(src,lfo);
  }
}
function setPlaying(on){
  playing=on;
  soundLabel.textContent = on?'SOUND ON':'SOUND OFF';
  bigBtn.textContent = on?'⏸ STOP TRANSMISSION':'▶ PLAY TRANSMISSION';
  if(on) startMode(); else stopNodes();
}
soundBtn.addEventListener('click', ()=>setPlaying(!playing));
bigBtn.addEventListener('click', ()=>setPlaying(!playing));
document.querySelectorAll('.sound-modes button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.sound-modes button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); mode=b.dataset.mode; if(playing) startMode();
  });
});
// visualizers
function drawWave(cv){
  const ctx = cv.getContext('2d');
  function frame(){
    requestAnimationFrame(frame);
    ctx.fillStyle='#000'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.strokeStyle='#57ffb2'; ctx.lineWidth=1.5; ctx.beginPath();
    if(actx&&playing&&actx._analyser){
      const data = new Uint8Array(actx._analyser.frequencyBinCount);
      actx._analyser.getByteFrequencyData(data);
      const step = cv.width/data.length*2;
      for(let i=0;i<data.length;i+=2){
        const h = data[i]/255*cv.height;
        ctx.moveTo(i*step, cv.height/2-h/2); ctx.lineTo(i*step, cv.height/2+h/2);
      }
    } else {
      const t=performance.now()*.002;
      for(let x=0;x<cv.width;x+=4){
        const y=cv.height/2+Math.sin(x*.12+t)*3*(playing?1:.3);
        ctx.moveTo(x,y-2); ctx.lineTo(x,y+2);
      }
    }
    ctx.stroke();
  }
  frame();
}
drawWave(document.getElementById('wave-mini'));
drawWave(document.getElementById('wave-big'));

/* ---------- WEB-1 PORT: ticker + SVG maps + lists + guide + timeline + drawer ---------- */
(function web1port(){
  // ticker (double list for seamless loop, like web-1)
  const track = document.getElementById('ticker-track');
  if(track){
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
    track.innerHTML = items.map(t=>{
      const i = t.indexOf('·');
      return i<0 ? `<span>✦ <b>${t}</b></span>` : `<span>✦ <b>${t.slice(0,i)}</b>${t.slice(i)}</span>`;
    }).join('');
  }
  const SVGNS = 'http://www.w3.org/2000/svg';
  const CRATERS = [{cx:30,cy:30,r:9},{cx:62,cy:24,r:6},{cx:74,cy:58,r:11},{cx:44,cy:66,r:7},{cx:56,cy:46,r:4},{cx:24,cy:54,r:5},{cx:68,cy:76,r:6},{cx:40,cy:42,r:3.5}];
  function buildMap(svgId, planet){
    const svg = document.getElementById(svgId);
    if(!svg) return;
    const isMoon = planet==='moon';
    const gid = svgId+'-grad';
    svg.innerHTML =
      `<defs><radialGradient id="${gid}" cx="35%" cy="30%">`+
      (isMoon
        ? `<stop offset="0%" stop-color="#f8fafc"/><stop offset="38%" stop-color="#cbd5e1"/><stop offset="70%" stop-color="#475569"/><stop offset="100%" stop-color="#020617"/>`
        : `<stop offset="0%" stop-color="#fecdd3"/><stop offset="38%" stop-color="#fb7185"/><stop offset="70%" stop-color="#881337"/><stop offset="100%" stop-color="#020617"/>`)+
      `</radialGradient></defs>`+
      `<circle cx="50" cy="50" r="44" fill="url(#${gid})"/>`+
      CRATERS.map(c=>`<ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.r}" ry="${(c.r*.82).toFixed(1)}" fill="none" stroke="rgba(2,6,23,.45)" stroke-width="0.7"/>`).join('')+
      [20,35,50,65,80].map(v=>`<line x1="${v}" y1="8" x2="${v}" y2="92" stroke="rgba(125,211,252,.12)" stroke-width="0.25"/>`).join('')+
      [20,35,50,65,80].map(v=>`<line x1="8" y1="${v}" x2="92" y2="${v}" stroke="rgba(125,211,252,.12)" stroke-width="0.25"/>`).join('');
    SITES.filter(s=>s.planet===planet).forEach(s=>{
      const g = document.createElementNS(SVGNS,'g');
      g.setAttribute('class','pin'); g.style.cursor='pointer';
      g.innerHTML =
        `<circle class="pin-pulse" cx="${s.x}" cy="${s.y}" r="5.2" fill="transparent" stroke="hsl(${s.hue} 90% 65% / .9)" stroke-width="0.6"/>`+
        `<circle class="pin-core" cx="${s.x}" cy="${s.y}" r="1.9" fill="hsl(${s.hue} 95% 65%)" stroke="#fff" stroke-width="0.5" style="filter:drop-shadow(0 0 4px hsl(${s.hue} 95% 65%))"/>`+
        `<text class="pin-label" x="${s.x}" y="${(s.y-3.4).toFixed(1)}" text-anchor="middle" font-size="3.1" fill="#e9eefe" font-weight="700">${s.mission.split('·')[0].split(' ')[0]} ${String(s.year).slice(2)}</text>`;
      g.addEventListener('click', ()=>openDrawer(s.id));
      svg.appendChild(g);
    });
  }
  buildMap('moon-svg','moon'); buildMap('mars-svg','mars');

  // drawer
  const backdrop = document.getElementById('backdrop');
  const drawer = document.getElementById('drawer');
  function openDrawer(id){
    const s = SITES.find(x=>x.id===id); if(!s||!drawer||!backdrop) return;
    document.getElementById('drawer-chips').innerHTML =
      `<span class="chip">${s.planet.toUpperCase()}</span><span class="chip">${s.year}</span><span class="chip">${s.status}</span>`;
    document.getElementById('drawer-title').textContent = s.name;
    document.getElementById('drawer-sub').textContent = `${s.mission} · ${s.agency}`;
    document.getElementById('drawer-meta').innerHTML =
      `<div><small>LAT</small>${s.lat}</div><div><small>LON</small>${s.lon}</div><div><small>ACTIVE</small>${s.solsActive}</div><div><small>MASS LEFT</small>${s.massKg}</div>`;
    document.getElementById('drawer-story').textContent = s.story;
    document.getElementById('drawer-equip').innerHTML = s.equipment.map(e=>`<li>✦ ${e}</li>`).join('');
    document.getElementById('drawer-epitaph').textContent = `\u201C${s.epitaph}\u201D`;
    document.getElementById('drawer-jump').innerHTML = SITES.filter(x=>x.planet===s.planet)
      .map(x=>`<button data-jump="${x.id}" class="${x.id===s.id?'active':''}">${x.year}</button>`).join('');
    drawer.hidden = false; backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    if(window.gsap) gsap.fromTo(drawer,{x:120,opacity:.4},{x:0,opacity:1,duration:.45,ease:'power3.out'});
    drawer.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>openDrawer(b.dataset.jump)));
    document.querySelectorAll('.site-btn').forEach(b=>b.classList.toggle('active', b.dataset.site===s.id));
  }
  function closeDrawer(){
    if(!drawer||!backdrop) return;
    drawer.hidden = true; backdrop.hidden = true; document.body.style.overflow = '';
  }
  window.openDrawer = openDrawer;
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  addEventListener('keydown', e=>{ if(e.key==='Escape') closeDrawer(); });

  // moon/mars lists
  function buildList(elId, planet){
    const el = document.getElementById(elId); if(!el) return;
    el.innerHTML = '';
    SITES.filter(s=>s.planet===planet).forEach(s=>{
      const b = document.createElement('button');
      b.className='site-btn reveal'; b.dataset.site=s.id; b.style.opacity='1'; b.style.transform='none';
      b.innerHTML = `<h4>📍 ${s.name} — ${s.year}</h4><p>${s.mission} · ${s.solsActive} · ${s.status}</p>`;
      b.addEventListener('click', ()=>openDrawer(s.id));
      el.appendChild(b);
    });
  }
  buildList('moon-list','moon'); buildList('mars-list','mars');

  // field guide cards + filter
  const cardsEl = document.getElementById('guide-cards');
  function buildCards(filter){
    if(!cardsEl) return;
    cardsEl.innerHTML = '';
    SITES.filter(s=>filter==='all'||s.planet===filter).forEach(s=>{
      const d = document.createElement('div');
      d.className='card';
      d.innerHTML = `<div class="mono-label">${s.planet.toUpperCase()} · ${s.year}</div><h4>${s.name}</h4><p>${s.story.slice(0,150)}…</p><div class="equip-line">🎒 ${s.equipment.slice(0,3).join(' · ')}…</div><button class="open-btn">Open full story →</button>`;
      d.querySelector('.open-btn').addEventListener('click', ()=>openDrawer(s.id));
      cardsEl.appendChild(d);
    });
  }
  buildCards('all');
  document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); buildCards(b.dataset.filter);
  }));

  // mars timeline rendered from SITES sorted by year (all planets, like web-1 timeline)
  const tl = document.getElementById('mars-timeline');
  if(tl){
    tl.innerHTML = '';
    [...SITES].sort((a,b)=>a.year-b.year).forEach(s=>{
      const item = document.createElement('div');
      item.className='tl-item reveal'; item.style.opacity='1'; item.style.transform='none';
      const feat = s.id==='opportunity' ? ' featured' : '';
      const dot = s.id==='opportunity' ? 'tl-dot pulse' : 'tl-dot';
      item.innerHTML = `<div class="${dot}"></div><div class="tl-card${feat}"><span class="mono">${s.year} · ${s.mission.toUpperCase()} · ${s.solsActive.toUpperCase()}</span><h3>${s.name}</h3><p>${s.story.slice(0,180)}…</p>${s.id==='opportunity'?'<div class="oppy-bar"><div style="width:100%"></div></div>':''}<button class="expand-btn" style="margin-top:12px">▸ OPEN FILE</button></div>`;
      item.querySelector('button').addEventListener('click', ()=>openDrawer(s.id));
      tl.appendChild(item);
    });
  }
})();
window.__sceneShift = {x:0, y:0};

/* ---------- MEMORIAL CANDLES ---------- */
const lit = new Set();
const litCount = document.getElementById('lit-count');
const litNames = document.getElementById('lit-names');
document.querySelectorAll('.candle').forEach(c=>{
  c.addEventListener('click', ()=>{
    const n = c.dataset.n;
    if(lit.has(n)){ lit.delete(n); c.classList.remove('lit'); }
    else { lit.add(n); c.classList.add('lit');
      gsap.fromTo(c,{scale:.92},{scale:1,duration:.4,ease:'back.out(3)'});
    }
    litCount.textContent = lit.size;
    litNames.textContent = lit.size ? [...lit].join(' · ') : 'click a candle to honor a machine';
  });
});

/* ---------- FEATURE PACK: cursor, dots, warp, decode, tilt, log, search/favs, scrub, gear, quiz, game, epitaphs, terminal ---------- */
(function features(){
'use strict';
const $ = s=>document.querySelector(s), $$ = s=>[...document.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. CUSTOM CURSOR */
const dot = $('#cursor-dot'), ring = $('#cursor-ring'), label = $('#cursor-label');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.body.classList.add('cursor-on');
  addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    label.style.left=mx+'px'; label.style.top=my+'px';
    const t = e.target.closest('a,button,.pin,.hotspot,input,.card,.site-btn,.gear,canvas');
    ring.classList.toggle('hot', !!t);
    const dotLabel = t?.closest('#dots a')?.querySelector('.dot-label')?.textContent;
    label.textContent = dotLabel ? `◉ ${dotLabel}` : (t ? ('◉ '+(t.dataset.hotspot||t.dataset.rover||t.textContent||'').trim().slice(0,22).toUpperCase()) : `X${String(mx).padStart(4,'0')} Y${String(my).padStart(4,'0')}`);
  });
  (function follow(){ rx+=(mx-rx)*.16; ry+=(my-ry)*.16; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(follow); })();
} else { [dot,ring,label].forEach(el=>el&&el.remove()); }

/* 2. DOTS NAV */
const dotsNav = $('#dots');
if(dotsNav){
  dotsNav.innerHTML = '';
  const panels = $$('.panel');
  const dotLinks = [];

  panels.forEach((p, i)=>{
    if(!p.id) p.id = 'panel-' + i;
    const labelText = p.dataset.label || p.dataset.cam || p.id;
    const a = document.createElement('a');
    a.href = '#' + p.id;
    a.setAttribute('aria-label', labelText);
    a.innerHTML = `<span class="dot-label">${labelText}</span><span class="dot-pip"></span>`;

    a.addEventListener('click', e=>{
      e.preventDefault();
      p.scrollIntoView({ behavior: 'smooth' });
      dotLinks.forEach(x => x.classList.remove('on'));
      a.classList.add('on');
      try { history.replaceState(null, '', '#' + p.id); } catch (_) {}
    });

    dotsNav.appendChild(a);
    dotLinks.push(a);

    ScrollTrigger.create({
      trigger: p,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle(self){
        if(self.isActive){
          dotLinks.forEach(x => x.classList.remove('on'));
          a.classList.add('on');
        }
      }
    });
  });

  function syncActiveDot(){
    const scrollMid = window.scrollY + window.innerHeight * 0.45;
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    let activeIndex = 0;
    if (isAtBottom) {
      activeIndex = panels.length - 1;
    } else {
      panels.forEach((p, idx)=>{
        if (p.offsetTop <= scrollMid) {
          activeIndex = idx;
        }
      });
    }

    dotLinks.forEach((lnk, idx)=>{
      lnk.classList.toggle('on', idx === activeIndex);
    });
  }

  syncActiveDot();
  window.addEventListener('scroll', syncActiveDot, { passive: true });
}

/* 3. WARP ON SCROLL VELOCITY */
const warp = $('#warp');
let lastY = scrollY, warpV = 0;
addEventListener('scroll', ()=>{
  const v = Math.abs(scrollY-lastY); lastY=scrollY;
  warpV = Math.min(1, warpV*.7 + v/400);
  warp.style.opacity = reduceMotion ? 0 : Math.min(.8, warpV).toFixed(2);
  if(camera && !reduceMotion) camera.fov = 60 + warpV*14, camera.updateProjectionMatrix();
},{passive:true});
setInterval(()=>{ warpV*=.9; if(warp) warp.style.opacity=Math.min(.8,warpV).toFixed(2); },100);

/* 4. DECODE TITLES */
const GLYPHS='█▓▒░<>/\\|01';
function decode(el){
  const orig = el.dataset.orig || (el.dataset.orig = el.textContent);
  if(reduceMotion) return;
  let f=0; const iv=setInterval(()=>{
    f++;
    el.textContent = orig.split('').map((c,i)=> i < orig.length*(f/14) ? c : (c===' '||c==='\n'?' ':GLYPHS[Math.floor(Math.random()*GLYPHS.length)])).join('');
    if(f>=14){ el.textContent=orig; clearInterval(iv); }
  },30);
}
$$('.decode').forEach(el=>ScrollTrigger.create({trigger:el, start:'top 85%', once:true, onEnter:()=>decode(el)}));

/* 5. TILT + MAGNETIC */
if(matchMedia('(hover:hover)').matches && !reduceMotion){
  $$('[data-tilt], .artifact, .compare-card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', ()=>card.style.transform='');
  });
  $$('.expand-btn, #big-sound-btn, #enter-btn').forEach(b=>{
    b.addEventListener('mousemove', e=>{
      const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.25}px)`;
    });
    b.addEventListener('mouseleave', ()=>b.style.transform='');
  });
}

/* 6. COMPARE BARS */
$$('.stat-bar').forEach(bar=>{
  ScrollTrigger.create({trigger:bar, start:'top 90%', once:true,
    onEnter:()=>{ const i=bar.querySelector('i'); if(i) requestAnimationFrame(()=>i.style.width=bar.dataset.w+'%', ); i&&(i.style.transition='width 1.2s cubic-bezier(.22,1,.36,1)'); }});
});

/* 7. DSN LOG STREAM */
const LOG_LINES = [
  ['1969-07-20','EAGLE','<b>CONTACT LIGHT.</b> Engine stop. Tranquility Base here.'],
  ['1971-08-01','LRV-1','TV cam parked, aimed at LM. Battery at <b>4%</b>. Goodnight.'],
  ['1972-12-14','LRV-3','Fender held with maps + clamps. Odometer <b>35.9 km</b>. Record.'],
  ['1977-09-30','ALSEP','Central stations <b>switched OFF</b> to fund Viking. Sorry, Moon.'],
  ['1982-11-11','VIKING-1','Battery low after 2,243 sols. Last winter coming.'],
  ['1997-09-27','SAGAN STN','Sojourner silent. Airbags deflated. Dust wins.'],
  ['2004-01-25','SPIRIT','Bounce OK! Airbags retracted. Columbia Memorial Station online.'],
  ['2010-03-22','SPIRIT','Winter sol 2210. Tilt 9°. Phoning fainter… <b>silence.</b>'],
  ['2018-06-10','OPPY','Tau <b>10.8</b>. Sky black at noon. Battery low, getting dark.'],
  ['2019-02-13','DSN','811 recovery commands sent. Oppy not heard. <b>Mission complete.</b>'],
  ['2021-04-19','GINNY','Flight 1: 39 seconds. First powered flight on another world.'],
  ['2024-01-18','GINNY','Rotor damage on flight 72. Grounded at Valinor Hills.'],
  ['NOW','DSN','Still listening on all bands. <b>The ghosts outnumber the living.</b>'],
];
const logEl = $('#dsn-log'); let logPaused=false, li=0;
function pushLog(){
  if(!logEl) return;
  if(!logPaused){
    const [d,who,msg]=LOG_LINES[li%LOG_LINES.length]; li++;
    const div=document.createElement('div');
    div.innerHTML=`<span class="t">[${d}]</span> <b>${who}</b> ▸ ${msg}`;
    logEl.appendChild(div);
    while(logEl.children.length>9) logEl.removeChild(logEl.firstChild);
    if(window.gsap && !reduceMotion) gsap.from(div,{opacity:0,x:-14,duration:.5});
  }
}
if(logEl){ pushLog(); pushLog(); pushLog(); setInterval(pushLog, 2600);
  logEl.parentElement.addEventListener('mouseenter', ()=>logPaused=true);
  logEl.parentElement.addEventListener('mouseleave', ()=>logPaused=false);
  $('#log-pause').addEventListener('click', e=>{ logPaused=!logPaused; e.target.textContent=logPaused?'▶ RESUME':'❚❚ PAUSE'; });
}

/* 8. SEARCH + FAVORITES + DEEP LINK + KEYBOARD */
const favs = new Set(JSON.parse(localStorage.getItem('abnf_favs')||'[]'));
const saveFavs = ()=>localStorage.setItem('abnf_favs', JSON.stringify([...favs]));
let starMode='all', query='';
function applySiteFilter(){
  const q = query.trim().toLowerCase();
  SITES.forEach(s=>{
    const hitQ = !q || (s.name+s.mission+s.status+s.equipment.join(' ')).toLowerCase().includes(q);
    const hitS = starMode==='all' || favs.has(s.id);
    const show = hitQ && hitS;
    $$(`.site-btn[data-site="${s.id}"]`).forEach(b=>b.classList.toggle('dim', false) || (b.style.display=show?'':'none'));
    $$('#moon-svg .pin, #mars-svg .pin').forEach(()=>{});
  });
  // dim SVG pins without match
  drawPins();
  // guide cards
  const gc=$('#guide-cards');
  if(gc) [...gc.children].forEach(c=>{
    const t=c.textContent.toLowerCase();
    c.style.display = (!q||t.includes(q))?'':'none';
  });
}
function drawPins(){
  // re-tint pins: dim those filtered out
  ['moon-svg','mars-svg'].forEach(id=>{
    const svg=document.getElementById(id); if(!svg) return;
    const pins=svg.querySelectorAll('.pin');
    SITES.filter(s=>(id==='moon-svg')===(s.planet==='moon')).forEach((s,i)=>{
      const pin=pins[i]; if(!pin) return;
      const q=query.trim().toLowerCase();
      const hitQ=!q||(s.name+s.mission+s.status+s.equipment.join(' ')).toLowerCase().includes(q);
      const hitS=starMode==='all'||favs.has(s.id);
      pin.classList.toggle('dim', !(hitQ&&hitS));
    });
  });
}
const ss=$('#site-search');
if(ss) ss.addEventListener('input', ()=>{ query=ss.value; applySiteFilter(); });
$$('[data-star]').forEach(b=>b.addEventListener('click', ()=>{
  $$('[data-star]').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  starMode=b.dataset.star; applySiteFilter();
}));
// star buttons on site-btns (delegated, runs after web1port render + on filter rerender safe)
function starify(){
  $$('.site-btn[data-site]').forEach(b=>{
    if(b.querySelector('.star')) return;
    const id=b.dataset.site;
    const st=document.createElement('span');
    st.className='star'; st.textContent=favs.has(id)?'★ ':'☆ ';
    st.style.cssText='color:var(--amber);cursor:pointer;margin-right:6px';
    st.addEventListener('click', e=>{ e.stopPropagation(); favs.has(id)?favs.delete(id):favs.add(id); saveFavs(); st.textContent=favs.has(id)?'★ ':'☆ '; applySiteFilter(); });
    b.prepend(st);
  });
}
starify(); setInterval(starify, 1500);
// deep link: wrap openDrawer
const _open = window.openDrawer;
window.openDrawer = function(id){
  _open(id);
  try{ history.replaceState(null,'','#site='+id); }catch(e){}
  // inject ★ SAVE into drawer chips
  const chips=document.getElementById('drawer-chips');
  if(chips && !chips.querySelector('.save')){
    const b=document.createElement('button');
    b.className='chip save'; b.style.cursor='pointer'; b.style.background='transparent';
    const paint=()=>b.textContent=favs.has(id)?'★ SAVED':'☆ SAVE';
    paint();
    b.addEventListener('click', ()=>{ favs.has(id)?favs.delete(id):favs.add(id); saveFavs(); paint(); starify(); });
    chips.appendChild(b);
  }
  // share button
  if(chips && !chips.querySelector('.share')){
    const sh=document.createElement('button');
    sh.className='chip share'; sh.style.cursor='pointer'; sh.style.background='transparent'; sh.textContent='⧉ COPY LINK';
    sh.addEventListener('click', ()=>{ navigator.clipboard&&navigator.clipboard.writeText(location.href); sh.textContent='✓ COPIED'; setTimeout(()=>sh.textContent='⧉ COPY LINK',1200); });
    chips.appendChild(sh);
  }
};
if(location.hash.startsWith('#site=')){
  const id=location.hash.slice(6);
  setTimeout(()=>{ const s=SITES.find(x=>x.id===id); if(s) window.openDrawer(id); }, 1200);
}
// keyboard: [ ] cycle, / focus search, Esc handled by drawer
addEventListener('keydown', e=>{
  if(e.target.matches('input,textarea')) return;
  const order=SITES.map(s=>s.id);
  const cur=(location.hash.match(/site=([\w-]+)/)||[])[1];
  let i=order.indexOf(cur);
  if(e.key===']'){ i=(i+1+order.length)%order.length; window.openDrawer(order[i]); }
  if(e.key==='['){ i=(i-1+order.length)%order.length; window.openDrawer(order[i]); }
  if(e.key==='/'){ e.preventDefault(); ss&&ss.focus(); }
});

/* 9. YEAR SCRUBBER */
const ys=$('#year-slider'), yv=$('#year-val');
if(ys) ys.addEventListener('input', ()=>{
  const y=+ys.value; yv.textContent=`1969 → ${y}`;
  $$('#mars-timeline .tl-item').forEach(item=>{
    const yr=+(item.textContent.match(/19\d\d|20\d\d/)||[9999])[0];
    item.classList.toggle('dim', yr>y);
  });
  ['moon-svg','mars-svg'].forEach(id=>{
    const svg=document.getElementById(id); if(!svg) return;
    const list=SITES.filter(s=>(id==='moon-svg')===(s.planet==='moon'));
    [...svg.querySelectorAll('.pin')].forEach((pin,i)=>pin.classList.toggle('dim', list[i]&&list[i].year>y));
  });
});

/* 10. GEAR CLOUD */
(function gear(){
  const el=$('#gear-cloud'); if(!el) return;
  const counts={};
  SITES.forEach(s=>s.equipment.forEach(e=>counts[e]=(counts[e]||0)+1));
  function render(f){
    el.innerHTML='';
    Object.entries(counts).filter(([k])=>!f||k.toLowerCase().includes(f.toLowerCase()))
      .sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>{
        const b=document.createElement('button'); b.className='gear';
        b.innerHTML=`${k}<small>×${n}</small>`;
        b.addEventListener('click', ()=>{ query=k.split(' ')[0]; if(ss) ss.value=query; applySiteFilter(); document.getElementById('maps').scrollIntoView({behavior:'smooth'}); });
        el.appendChild(b);
      });
    if(!el.children.length) el.innerHTML='<span class="chip">no gear matches</span>';
  }
  render('');
  $('#gear-search').addEventListener('input', e=>render(e.target.value));
})();

/* 11. QUIZ */
(function quiz(){
  const Q=[
    {q:'Pick a landscape.', opts:['Grey dust, sharp shadows','Red dunes, pink sky','Ice glittering at midnight','A runway that ends in sky'], w:[['apollo-11',2],['opportunity',2],['phoenix',2],['ingenuity',2]]},
    {q:'Pick a lifespan.', opts:['One perfect day','90 days → 14 years','6 winters, then silence','72 impossible flights'], w:[['apollo-11',2],['opportunity',2],['spirit',2],['ingenuity',2]]},
    {q:'Pick a last word.', opts:['“Contact light.”','“My battery is low…”','A faint winter ping','Rotor static, then wind'], w:[['apollo-11',2],['opportunity',2],['spirit',2],['ingenuity',2]]},
    {q:'Pick a relic.', opts:['A plaque + ladder','A taped fender','A family photo','A Wright Flyer swatch'], w:[['apollo-11',2],['apollo-17',2],['apollo-16',2],['ingenuity',2]]},
  ];
  const qEl=$('#quiz-q'), oEl=$('#quiz-opts'), pEl=$('#quiz-prog');
  if(!qEl) return;
  let step=0; const score={};
  function render(){
    if(step>=Q.length){
      const win=Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0];
      const s=SITES.find(x=>x.id===win);
      qEl.innerHTML=`You are <span style="color:var(--amber)">${s.name}</span> — ${s.mission}.`;
      oEl.innerHTML=`<p style="color:#bcc4d2;line-height:1.6">${s.epitaph}</p><button data-act="open">▸ OPEN ${s.name.toUpperCase()} FILE</button>`;
      oEl.querySelector('[data-act]').addEventListener('click', ()=>window.openDrawer(s.id));
      pEl.textContent=`MATCH · ${s.year} · ${s.planet.toUpperCase()}`;
      $('#quiz-restart').hidden=false;
      return;
    }
    const cur=Q[step];
    qEl.textContent=`${step+1}/${Q.length} — ${cur.q}`;
    pEl.textContent=`QUESTION ${step+1} OF ${Q.length}`;
    oEl.innerHTML='';
    cur.opts.forEach((t,i)=>{
      const b=document.createElement('button'); b.textContent=t;
      b.addEventListener('click', ()=>{
        const [qid,qpts]=cur.w[i]; score[qid]=(score[qid]||0)+qpts;
        step++; render();
        if(window.gsap&&!reduceMotion) gsap.from(qEl,{opacity:0,y:10,duration:.4});
      });
      oEl.appendChild(b);
    });
  }
  $('#quiz-restart').addEventListener('click', ()=>{ step=0; for(const k in score) delete score[k]; $('#quiz-restart').hidden=true; render(); });
  render();
})();

/* 12. EPITAPH CAROUSEL */
(function epitaphs(){
  const car=$('#epitaph-car'), dots=$('#epitaph-dots'); if(!car) return;
  let i=0, iv;
  dots.innerHTML=SITES.map((_,k)=>`<button data-k="${k}" aria-label="epitaph ${k}"></button>`).join('');
  const db=[...dots.children];
  function show(k){
    i=k; const s=SITES[i];
    car.innerHTML=`“${s.epitaph}”<br><span style="font-family:var(--mono);font-size:12px;color:var(--dim)">— ${s.name} · ${s.year}</span>`;
    db.forEach((d,j)=>d.classList.toggle('on', j===i));
    if(window.gsap&&!reduceMotion) gsap.fromTo(car,{opacity:0,y:12},{opacity:1,y:0,duration:.6});
  }
  db.forEach(d=>d.addEventListener('click', ()=>{ show(+d.dataset.k); restart(); }));
  function restart(){ clearInterval(iv); iv=setInterval(()=>show((i+1)%SITES.length), 4200); }
  show(4); restart();
})();

})();

/* ---------- LANDER MINI-GAME v2 ---------- */
(function lander(){
  const cv=document.getElementById('lander-canvas'); if(!cv) return;
  const ctx=cv.getContext('2d');
  const stat=document.getElementById('lander-stat'), msg=document.getElementById('lander-msg'),
        warn=document.getElementById('lander-warn'), pad=document.getElementById('lander-pad'),
        ov=document.getElementById('lander-overlay'), ovTitle=document.getElementById('ov-title'),
        ovSub=document.getElementById('ov-sub'), ovStats=document.getElementById('ov-stats'),
        ovBtn=document.getElementById('ov-btn');
  const gAlt=document.getElementById('g-alt'), gVel=document.getElementById('g-vel'), gFuel=document.getElementById('g-fuel'),
        gAltF=document.getElementById('g-alt-fill'), gVelF=document.getElementById('g-vel-fill'), gFuelF=document.getElementById('g-fuel-fill');
  let G=1.62, st=null, thrust=false, parts=[], shake=0;
  let best=+(localStorage.getItem('abnf_best_land')||NaN);
  const bestEl=document.getElementById('lander-best');
  const paintBest=()=>bestEl.textContent=isNaN(best)?'—':best.toFixed(1)+' m/s';
  paintBest();
  // tiny sfx (created on first gesture)
  let AC=null;
  const beep=(f,dur,type='square',vol=.06)=>{ try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(), g=AC.createGain();
    o.type=type; o.frequency.value=f; g.gain.value=vol;
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur);
  }catch(e){} };
  function reset(){
    st={y:30, v:0, fuel:100, t:0, phase:'brief', calls:{}, maxV:0, count:0, lastN:4};
    parts=[]; shake=0;
    ov.hidden=false; ov.classList.remove('fading');
    ovTitle.className=''; ovTitle.textContent="Don't crash the Eagle.";
    ovSub.innerHTML=`Hold <b>SPACE / W / ↑</b> or hold the burn pad. Touch down under <b>4 m/s</b> with fuel left. Under <b>1.5 m/s</b> for three stars. Gravity: <b>${G.toFixed(2)} m/s²</b>.`;
    ovStats.hidden=true; ovBtn.textContent='▶ LAUNCH DESCENT';
    msg.textContent='press LAUNCH — gentle, commander'; warn.textContent='';
    paintGauges();
  }
  function launch(){
    if(st.phase==='fly'||st.phase==='count') return;
    reset(); st.phase='count'; st.count=0; st.lastN=4;
    document.querySelector('.game-wrap').classList.add('land-expand');
    ov.hidden=false; ov.classList.remove('fading');
    ovTitle.className=''; ovStats.hidden=true;
    ovBtn.textContent='▶ LAUNCH DESCENT';
    msg.textContent='Eagle has undocked — descent in 3…';
    stat.textContent='T-3.0s · HOLD ON';
  }
  ovBtn.addEventListener('click', ()=>{ st.phase==='over' ? (reset(), setTimeout(launch, 60)) : launch(); });
  document.getElementById('lander-reset').addEventListener('click', ()=>{ reset(); launch(); });
  document.querySelectorAll('.diff-row button').forEach(b=>b.addEventListener('click', ()=>{
    document.querySelectorAll('.diff-row button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); G=+b.dataset.g; reset();
  }));
  let held=false;
  const burnOn=()=>{ held=true; pad.classList.add('burn'); };
  const burnOff=()=>{ held=false; pad.classList.remove('burn'); };
  addEventListener('keydown', e=>{
    if((e.code==='Space'||e.code==='KeyW'||e.code==='ArrowUp')&&!e.target.matches('input,textarea')){
      e.preventDefault(); burnOn();
      if(st.phase==='brief') launch();
    }
    if(e.code==='Enter'&&st.phase!=='fly') launch();
  });
  addEventListener('keyup', e=>{ if(e.code==='Space'||e.code==='KeyW'||e.code==='ArrowUp') burnOff(); });
  pad.addEventListener('pointerdown', e=>{ e.preventDefault(); try{pad.setPointerCapture(e.pointerId);}catch(_){} burnOn(); });
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>pad.addEventListener(ev, burnOff));
  // terrain (pad flats at center)
  const ground=[]; for(let x=0;x<=720;x+=24) ground.push(330+Math.sin(x*.02)*14+Math.random()*8);
  ground[13]=ground[14]=ground[15]=ground[16]=340;
  const PAD_X0=312, PAD_X1=408, GY=340, PXM=310/100; // px per meter: 310px ≈ 100m arcade fall (~12s)
  function callout(alt){
    const c=st.calls;
    if(alt<70&&!c.a){c.a=1;msg.textContent='70m — looking good, fuel is plenty';}
    if(alt<35&&!c.b){c.b=1;msg.textContent='35m — start thinking about the burn';beep(660,.1);}
    if(alt<15&&!c.d){c.d=1;msg.textContent='15m — ease her down, commander';beep(660,.1);setTimeout(()=>beep(660,.1),180);}
  }
  function paintGauges(){
    const alt=Math.max(0,(GY-st.y-14)/PXM);
    gAlt.textContent=alt.toFixed(0)+'m'; gAltF.style.width=Math.min(100,alt/120*100)+'%';
    gVel.textContent=st.v.toFixed(1)+' m/s'; gVelF.style.width=Math.min(100,st.v/12*100)+'%';
    gFuel.textContent=st.fuel.toFixed(0)+'%'; gFuelF.style.width=st.fuel+'%';
    gFuelF.style.background=st.fuel<25?'var(--mars)':'linear-gradient(90deg,var(--mars),var(--amber),var(--neon))';
  }
  function burst(x,y,n,cols,spd){
    for(let i=0;i<n;i++) parts.push({x,y,vx:(Math.random()-.5)*spd,vy:-Math.random()*spd*.8,
      life:1,sz:1+Math.random()*3,col:cols[i%cols.length]});
  }
  function touchdown(){
    st.phase='over'; thrust=false; pad.classList.remove('burn');
    const v=st.v;
    const stats=`<div><b>${v.toFixed(1)}</b>TOUCHDOWN M/S</div><div><b>${st.fuel.toFixed(0)}%</b>FUEL LEFT</div><div><b>${st.t.toFixed(1)}s</b>FLIGHT TIME</div>`;
    ov.hidden=false; requestAnimationFrame(()=>ov.classList.remove('fading'));
    ovStats.hidden=false; ovStats.innerHTML=stats;
    if(st.fuel<=0&&v>4){
      ovTitle.className='lose'; ovTitle.textContent='✕ Out of fuel. The dust keeps you.';
      ovSub.innerHTML='Dead stick at <b>'+v.toFixed(1)+' m/s</b>. Armstrong had 25 seconds of fuel left — you had none.';
      burst(360,GY-10,40,['#ff5c38','#ffb454','#666'],220); shake=14; beep(110,.5,'sawtooth',.09);
    } else if(v<=1.5){
      ovTitle.className='win'; ovTitle.textContent='✓ CONTACT LIGHT ★★★';
      ovSub.innerHTML='“Houston, Tranquility Base here. The Eagle has landed.” A perfect <b>'+v.toFixed(1)+' m/s</b> touchdown. Neil is jealous.';
      burst(360,GY-6,26,['#cfd6e4','#8a93a5','#57ffb2'],90);
      beep(2525,.09); setTimeout(()=>beep(2525,.09),220);
      if(isNaN(best)||v<best){best=v;localStorage.setItem('abnf_best_land',best);paintBest();}
    } else if(v<=2.5){
      ovTitle.className='win'; ovTitle.textContent='✓ Touchdown ★★';
      ovSub.innerHTML='Gentle at <b>'+v.toFixed(1)+' m/s</b>. The ladder holds. The plaque gleams. Go plant the flag.';
      burst(360,GY-6,20,['#cfd6e4','#8a93a5'],80);
      beep(2525,.09); setTimeout(()=>beep(1760,.12),200);
      if(isNaN(best)||v<best){best=v;localStorage.setItem('abnf_best_land',best);paintBest();}
    } else if(v<=4){
      ovTitle.className='win'; ovTitle.textContent='✓ Survived ★';
      ovSub.innerHTML='A <b>'+v.toFixed(1)+' m/s</b> thud — the legs groan, but she holds. Any landing you walk away from…';
      burst(360,GY-6,16,['#cfd6e4','#666'],90); shake=5; beep(880,.15);
    } else {
      ovTitle.className='lose'; ovTitle.textContent='✕ CRASH at '+v.toFixed(1)+' m/s';
      ovSub.innerHTML='Nothing survives <b>'+v.toFixed(1)+' m/s</b> into regolith. You are now a permanent exhibit — like the real crashed descent stages.';
      burst(360,GY-10,46,['#ff5c38','#ffb454','#fff','#555'],260); shake=16; beep(90,.6,'sawtooth',.1);
    }
    ovBtn.textContent='↺ FLY AGAIN';
    msg.textContent=ovTitle.textContent; warn.textContent='';
    document.querySelector('.game-wrap').classList.remove('land-expand');
  }
  function frame(){
    requestAnimationFrame(frame);
    if(st.phase==='count'){
      st.count+=1/60;
      const n=Math.ceil(3-st.count);
      if(n!==st.lastN&&n>0){ st.lastN=n; ovTitle.textContent=n; beep(660,.12); }
      stat.textContent=`T-${Math.max(0,3-st.count).toFixed(1)}s · HOLD ON`;
      if(st.count>=3.2){
        st.phase='fly';
        ov.classList.add('fading'); setTimeout(()=>ov.hidden=true,380);
        beep(990,.18); setTimeout(()=>beep(1320,.25),170);
        msg.textContent='GO for descent — burn to slow her down';
      }
    }
    if(st.phase==='fly'){
      st.t+=1/60;
      st.v+=G/60;
      thrust = held && st.fuel>0;
      if(thrust){
        st.v-= (G*3.0)/60; st.fuel=Math.max(0,st.fuel-7/60);
        if(Math.random()<.8) parts.push({x:360+(Math.random()-.5)*8,y:st.y+4,vx:(Math.random()-.5)*40,vy:60+Math.random()*80,life:.7,sz:1+Math.random()*3,col:Math.random()<.5?'#fff':'#ffb454'});
      }
      st.y+=st.v*PXM/60; st.maxV=Math.max(st.maxV,st.v);
      const alt=(GY-st.y-14)/PXM;
      callout(alt);
      const danger = alt<30 && st.v>5;
      warn.textContent = st.fuel<=0 ? '⚠ FUEL EMPTY' : danger ? '⚠ TOO FAST' : (alt<12&&st.v>4?'⚠ EASE OFF':'');
      if(danger&&Math.floor(st.t*2)%2===0) beep(440,.06,'square',.03);
      stat.textContent=`T+${st.t.toFixed(1)}s · ALT ${Math.max(0,alt).toFixed(0)}m · VEL ${st.v.toFixed(1)} m/s · FUEL ${st.fuel.toFixed(0)}%`;
      stat.style.color = st.v>4 ? 'var(--mars)' : 'var(--neon)';
      paintGauges();
      if(st.y>=GY-14){ st.y=GY-14; touchdown(); }
      if(st.y<0){st.y=0;st.v=Math.max(0,st.v);}
    }
    // particles
    parts=parts.filter(p=>p.life>0);
    parts.forEach(p=>{ p.x+=p.vx/60; p.y+=p.vy/60; p.vy+=140/60; p.life-=.022; });
    // draw
    ctx.save();
    if(shake>0){ ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake); shake*=.88; if(shake<.4)shake=0; }
    ctx.clearRect(-20,-20,760,420);
    ctx.fillStyle='#8ea2d8';
    for(let i=0;i<60;i++){ const sx=(i*97)%720, sy=(i*53)%260; ctx.globalAlpha=.4+.6*Math.abs(Math.sin(performance.now()*.001+i)); ctx.beginPath(); ctx.arc(sx,sy,1.2,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1;
    ctx.strokeStyle='#3a4358'; ctx.lineWidth=2; ctx.beginPath();
    ground.forEach((g,i)=>{ const x=i*24; i?ctx.lineTo(x,g):ctx.moveTo(x,g); }); ctx.stroke();
    // pad
    ctx.fillStyle='#57ffb2'; ctx.fillRect(288,336,96,6);
    ctx.fillStyle='#57ffb2'; ctx.font='10px monospace'; ctx.fillText('◉ TRANQUILITY PAD',292,332);
    // lander
    const lx=360, ly=st.y;
    ctx.save(); ctx.translate(lx,ly);
    ctx.fillStyle='#e8ecf1'; ctx.fillRect(-10,-14,20,14);
    ctx.fillStyle='#ffb454'; ctx.fillRect(-14,-4,28,4);
    ctx.strokeStyle='#9aa3b2'; ctx.beginPath(); ctx.moveTo(-10,0); ctx.lineTo(-16,10); ctx.moveTo(10,0); ctx.lineTo(16,10); ctx.stroke();
    if(thrust&&st.phase==='fly'&&st.fuel>0){
      const f=10+Math.random()*22;
      const gr=ctx.createLinearGradient(0,0,0,f+10); gr.addColorStop(0,'#fff'); gr.addColorStop(1,'transparent');
      ctx.fillStyle=gr; ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(6,0); ctx.lineTo(0,f+10); ctx.fill();
    }
    // particles (exhaust, dust, debris)
    parts.forEach(p=>{ ctx.globalAlpha=Math.max(0,p.life); ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(p.x,p.y,p.sz/2,0,Math.PI*2); ctx.fill(); });
    ctx.globalAlpha=1;
    // Earth hanging in the black sky
    ctx.fillStyle='#2a7fff'; ctx.beginPath(); ctx.arc(620,52,20,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#9fd8ff'; ctx.beginPath(); ctx.arc(613,45,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(63,169,255,.25)'; ctx.beginPath(); ctx.arc(620,52,26,0,Math.PI*2); ctx.fill();
    ctx.restore();
    stat.textContent = (st.phase==='fly'||st.phase==='count') ? stat.textContent
      : st.phase==='over' ? `TOUCHDOWN ${st.v.toFixed(1)} m/s · FUEL ${st.fuel.toFixed(0)}% · ${st.t.toFixed(1)}s`
      : `T+0.0s · STANDBY · GRAVITY ${G.toFixed(2)} m/s²`;
  }
  reset();
  frame();
})();

/* ---------- TERMINAL CONSOLE ---------- */
(function term(){
  const panel=document.getElementById('term'), out=document.getElementById('term-out'), inp=document.getElementById('term-input');
  if(!panel) return;
  const toggle=v=>{ panel.hidden=v===undefined?!panel.hidden:v; if(!panel.hidden) setTimeout(()=>inp.focus(),50); };
  document.getElementById('term-btn').addEventListener('click', ()=>toggle());
  document.getElementById('term-close').addEventListener('click', ()=>toggle(true));
  addEventListener('keydown', e=>{ if(e.key==='`'&&!e.target.matches('input,textarea')) toggle(); });
  function print(t, cls){ const d=document.createElement('div'); if(cls)d.className=cls; d.innerHTML=t; out.appendChild(d); out.scrollTop=out.scrollHeight; }
  print('A·BNF CONSOLE v1.0 — type <b>help</b>. Try: <b>storm</b> · <b>dust 80</b> · <b>honor oppy</b> · <b>play wind</b>');
  const cmds={
    help:'help · goto [moon|mars|lab|game|quiz] · storm [on|off] · dust [0-100] · honor [name] · play [static|beeps|wind] stop · list · open [site-id] · clear',
    list:()=>SITES.map(s=>s.id).join(' · '),
    clear:()=>{out.innerHTML='';},
  };
  inp.addEventListener('keydown', e=>{
    if(e.key!=='Enter') return;
    const raw=inp.value.trim(); inp.value='';
    print('❯ <span class="cmd">'+raw+'</span>');
    if(!raw) return;
    const [c,...rest]=raw.toLowerCase().split(/\s+/); const arg=rest.join(' ');
    try{
      if(cmds[c]!==undefined){ typeof cmds[c]==='function'?print(cmds[c]()):print(cmds[c]); return; }
      if(c==='goto'){ const el=document.getElementById({moon:'moon',mars:'mars',lab:'lab',game:'game',quiz:'quiz',maps:'maps',guide:'guide',memorial:'memorial'}[arg]||arg); el?el.scrollIntoView({behavior:'smooth'}):print('no such deck: '+arg,'err'); return; }
      if(c==='storm'){ document.getElementById('storm-btn').click(); print('sandstorm toggled. the sky goes black at noon.'); return; }
      if(c==='dust'){ const v=Math.max(0,Math.min(100,+arg||0)); const s=document.getElementById('dust-slider'); s.value=v; s.dispatchEvent(new Event('input')); print(`dust → ${v}%. panels starve.`); return; }
      if(c==='honor'){ const hit=[...document.querySelectorAll('.candle')].find(b=>b.dataset.n.toLowerCase().includes(arg)||arg.includes(b.dataset.n.toLowerCase())); hit?(hit.click(),print(`🕯 light lit for <b>${hit.dataset.n}</b>`)):print('no machine matches “'+arg+'”','err'); return; }
      if(c==='play'){ document.querySelector(`.sound-modes [data-mode="${arg}"]`)?.click(); print(arg==='stop'?'transmission cut.':'tuning '+arg+'…'); if(arg!=='stop'&&document.getElementById('sound-label').textContent==='SOUND OFF')document.getElementById('sound-btn').click(); return; }
      if(c==='stop'){ document.getElementById('sound-btn').click(); print('transmission cut.'); return; }
      if(c==='open'){ const s=SITES.find(x=>x.id===arg||x.name.toLowerCase().includes(arg)); s?window.openDrawer(s.id):print('no site “'+arg+'”. try <b>list</b>.','err'); return; }
      print(`unknown: ${c}. type <b>help</b>.`,'err');
    }catch(err){ print('error: '+err.message,'err'); }
  });
})();

/* ---------- SIGNAL FLICKER ---------- */
setInterval(()=>{
  const el = document.getElementById('hud-signal');
  el.textContent = `SIGNAL ▂▄▆█ ${96+Math.floor(Math.random()*4)}%`;
}, 3000);

})();
