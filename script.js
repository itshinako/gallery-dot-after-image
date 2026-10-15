(()=>{
const C=window.CONFIG||{},$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.documentElement.classList.add('js');
if(C.GA_ID){const s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+C.GA_ID;document.head.append(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',C.GA_ID)}
const track=(n,p)=>{try{window.gtag&&gtag('event',n,p||{})}catch(e){}};
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400)};
if(C.FEE_TEXT){$('#fee').textContent=C.FEE_TEXT;$$('.fee2').forEach(e=>e.textContent=C.FEE_TEXT)}
// 未設定リンクは遷移させない
$$('[data-link]').forEach(a=>{const u=C[a.dataset.link];if(u){a.href=u;a.target='_blank';a.rel='noopener';a.addEventListener('click',()=>track('line_click',{link:a.dataset.link}))}else{a.setAttribute('aria-disabled','true');a.addEventListener('click',e=>{e.preventDefault();toast('このリンクは準備中です')})}});
$$('[data-cta]').forEach(a=>a.addEventListener('click',()=>track({hero:'hero_reserve_click',sticky:'sticky_reserve_click'}[a.dataset.cta]||'section_reserve_click',{place:a.dataset.cta})));
// header / menu
const hd=$('#hd'),bg=$('#burger');
const menu=o=>{document.body.classList.toggle('menu-open',o);bg.setAttribute('aria-expanded',o)};
bg.onclick=()=>menu(bg.getAttribute('aria-expanded')!=='true');
addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){menu(false);bg.focus()}});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>menu(false)));
// scroll: header + parallax
const px=$$('[data-s]');let tk=0;
const onS=()=>{tk=0;const y=scrollY;hd.classList.toggle('sc',y>40);if(!RM&&y<innerHeight*1.5)px.forEach(e=>e.style.translate='0 '+(y*e.dataset.s)+'px')};
addEventListener('scroll',()=>{if(!tk)tk=requestAnimationFrame(onS)},{passive:true});onS();
// reveal / timeline / final beam
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));
const fin=$('#final');new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)fin.classList.add('in-v')}),{threshold:.4}).observe(fin);
// sticky CTA
const vis=new Set(),stk=$('#stk');
const so=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target.id):vis.delete(e.target.id));stk.classList.toggle('show',!vis.size)},{threshold:.05});
['hero','final','reserve'].forEach(i=>so.observe($('#'+i)));
// carousel
const tr=$('#track'),sl=$$('.slide',tr),pg=$('#pg');
const co=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){sl.forEach(s=>s.classList.toggle('on',s===e.target));pg.textContent=(sl.indexOf(e.target)+1)+' / '+sl.length}}),{root:tr,threshold:.6});
sl.forEach(s=>co.observe(s));sl[0].classList.add('on');
const step=d=>tr.scrollBy({left:d*sl[0].offsetWidth*1.05,behavior:RM?'auto':'smooth'});
$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);
tr.addEventListener('keydown',e=>{if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
// history
$('#more').onclick=e=>{$$('#tl li[hidden]').forEach(l=>l.hidden=false);e.target.hidden=true};
// form
const f=$('#rform'),D=$('#date'),T=$('#time'),N=$('#comp'),msg=$('#msg'),sub=$('#sub');
const DOW='日月火水木金土',CL=['2026-10-13','2026-10-20'].concat(C.CLOSED_DATES||[]);
D.innerHTML='<option value="">選択してください</option>';
for(let d=10;d<=26;d++){const dt=new Date(Date.UTC(2026,9,d)),v='2026-10-'+d,closed=CL.includes(v)||dt.getUTCDay()===2||(C.CLOSED_BOOKING||[]).includes(v);
D.insertAdjacentHTML('beforeend',`<option value="${v}"${closed?' disabled':''}>10/${d}（${DOW[dt.getUTCDay()]}）${closed?' 休廊・受付不可':''}</option>`)}
const slots=[];for(let m=720;m<=(([h,mi])=>h*60+mi)((C.LAST_SLOT||'18:30').split(':').map(Number));m+=30)slots.push(m);
const hm=m=>String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
T.innerHTML='<option value="">選択してください</option>'+slots.map(m=>`<option value="${hm(m)}">${hm(m)}–${hm(m+30)}</option>`).join('');
for(let i=0;i<=(C.MAX_COMPANIONS??2);i++)N.insertAdjacentHTML('beforeend',`<option value="${i}">${i}名</option>`);
D.addEventListener('change',()=>{$$('option',T).forEach(o=>{o.disabled=false;o.textContent=o.textContent.replace(' 満席','')});
 if(C.GAS_WEB_APP_URL&&D.value)fetch(C.GAS_WEB_APP_URL+'?action=slots&date='+D.value).then(r=>r.json()).then(j=>(j.full||[]).forEach(t=>{const o=$(`option[value="${t}"]`,T);if(o){o.disabled=true;o.textContent+=' 満席'}})).catch(()=>{})});
let started=0;f.addEventListener('focusin',()=>{if(!started){started=1;track('reservation_start')}});
const E={name:'お名前を入力してください。',email:'正しいメールアドレスを入力してください。',phone:'電話番号を入力してください。',date:'来場日を選択してください。',time:'来場時間を選択してください。',privacy:'利用規約への同意が必要です。'};
const setErr=(k,m)=>{const el=f.elements[k];if(!el)return;const b=el.closest('label')||el.parentNode;$('.err',b).textContent=m||'';el.setAttribute('aria-invalid',!!m)};
const val=()=>{let first=null;const v=k=>f.elements[k].value.trim();
 const bad={name:!v('name'),email:!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')),phone:!/^[0-9+\-() ]{9,20}$/.test(v('phone')),date:!v('date'),time:!v('time'),privacy:!f.elements.privacy.checked};
 for(const k in bad){setErr(k,bad[k]?E[k]:'');if(bad[k]&&!first)first=f.elements[k]}
 if(first){first.focus();track('reservation_validation_error')}return!first};
f.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='';if(!val())return;
 if(!C.GAS_WEB_APP_URL){msg.textContent='デモモードのため送信されません（予約は確定していません）。config.js の GAS_WEB_APP_URL を設定してください。';return}
 sub.disabled=true;sub.firstChild.textContent='送信中… ';
 const b={action:'reserve',name:f.elements.name.value,email:f.email.value,phone:f.phone.value,visit_date:D.value,visit_time:T.value,companion_count:+N.value,marketing_consent:f.line.checked,privacy_consent:f.privacy.checked,website:f.website.value};
 track('reservation_submit');
 try{const r=await fetch(C.GAS_WEB_APP_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(b)});const j=await r.json();
  if(j&&j.ok)done(j,b);else{if(j&&j.field&&f.elements[j.field==='comp'?'comp':j.field])setErr(j.field==='date'?'date':j.field,j.message);else msg.textContent=(j&&j.message)||'送信に失敗しました。';}}
 catch(x){msg.textContent='通信に失敗しました。もう一度「予約を確定する」を押してください。'}
 sub.disabled=false;sub.firstChild.textContent='予約を確定する '});
function done(j,b){f.hidden=true;$('#demo').hidden=true;const d=$('#done');d.hidden=false;
 $('#dmeta').textContent=`予約番号：${j.reservation_id}／${b.visit_date.replace('2026-','').replace('-','/')} ${b.visit_time}／GALLERY DOT（神宮前1-2-3 DOT BLDG 1F）`;
 if(window.QRCode&&j.checkin_token)new QRCode($('#qr'),{text:j.checkin_token,width:180,height:180});else $('#qr').hidden=true;
 d.scrollIntoView();track('reservation_complete');
 $('#shr').onclick=async()=>{const u=C.SITE_URL||location.origin+location.pathname,t='GALLERY DOT 10周年記念展「AFTER IMAGE」';track('share_click');
  if(navigator.share)try{await navigator.share({title:t,url:u});return}catch(e){}
  try{await navigator.clipboard.writeText(u);toast('URLをコピーしました')}catch(e){toast(u)}}}
if(!C.GAS_WEB_APP_URL)$('#demo').hidden=false;
})();
