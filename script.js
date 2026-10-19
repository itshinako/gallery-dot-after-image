(()=>{
const C=window.CONFIG||{},$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.documentElement.classList.add('js');
if(C.GA_ID){const s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+C.GA_ID;document.head.append(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',C.GA_ID)}
const track=(n,p)=>{try{window.gtag&&gtag('event',n,p||{})}catch(e){}};
const footer=$('footer');
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){
 const paint=document.createElement('canvas'),ctx=paint.getContext('2d');paint.className='footer-paint';footer.prepend(paint);
 let previous=null,fadeFrame=0,lastMove=0;
 const resizePaint=()=>{const r=footer.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);paint.width=Math.round(r.width*dpr);paint.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
 const fadePaint=()=>{const r=footer.getBoundingClientRect();ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.035)';ctx.fillRect(0,0,r.width,r.height);ctx.globalCompositeOperation='source-over';
  if(performance.now()-lastMove<1200)fadeFrame=requestAnimationFrame(fadePaint);else{ctx.clearRect(0,0,r.width,r.height);fadeFrame=0;previous=null}};
 footer.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=footer.getBoundingClientRect(),point={x:e.clientX-r.left,y:e.clientY-r.top};
  ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(previous?previous.x:point.x,previous?previous.y:point.y);ctx.lineTo(point.x,point.y);
  ctx.strokeStyle='rgba(231,28,112,.16)';ctx.lineWidth=30;ctx.shadowColor='rgba(236,25,126,.32)';ctx.shadowBlur=28;ctx.stroke();
  ctx.strokeStyle='rgba(255,93,169,.3)';ctx.lineWidth=12;ctx.shadowBlur=14;ctx.stroke();ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;previous=point;lastMove=performance.now();if(!fadeFrame)fadeFrame=requestAnimationFrame(fadePaint)});
 footer.addEventListener('pointerleave',()=>{previous=null});addEventListener('resize',resizePaint);resizePaint();
}
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400)};
if(C.FEE_TEXT){$('#fee').textContent=C.FEE_TEXT;$$('.fee2').forEach(e=>e.textContent=C.FEE_TEXT)}
// 未設定リンクは遷移させない
$$('[data-link]').forEach(a=>{const u=C[a.dataset.link];if(u){a.href=u;a.target='_blank';a.rel='noopener';a.addEventListener('click',()=>track('line_click',{link:a.dataset.link}))}else{a.setAttribute('aria-disabled','true');a.addEventListener('click',e=>{e.preventDefault();toast('このリンクは準備中です')})}});
$$('[data-cta]').forEach(a=>a.addEventListener('click',()=>track({hero:'hero_reserve_click',sticky:'sticky_reserve_click'}[a.dataset.cta]||'section_reserve_click',{place:a.dataset.cta})));
// parallax / hero motion
const px=$$('[data-s]'),hero=$('#hero');let tk=0;
const onS=()=>{tk=0;const y=scrollY;if(!RM&&y<innerHeight*1.5)px.forEach(e=>e.style.translate='0 '+(y*e.dataset.s)+'px')};
addEventListener('scroll',()=>{if(!tk)tk=requestAnimationFrame(onS)},{passive:true});onS();
let gsapActive=!RM&&!!(window.gsap&&window.ScrollTrigger);
if(gsapActive)try{gsap.registerPlugin(ScrollTrigger)}catch(e){gsapActive=false}
if(gsapActive){
 try{
  const gsapRoot=document.documentElement,title=$('.title'),words=$$('.title-word',title),artworkLayers=$$('.hero-artwork',hero),ghosts=$('.ghosts',hero);
  gsapRoot.classList.add('gsap-ready');
  const intro=gsap.timeline({defaults:{ease:'power3.out'}});
  words.forEach((word,i)=>{gsap.set(word,{opacity:0,x:i%2?72:-72,y:'0.12em',filter:'blur(8px)','--echo-alpha':0});intro.to(word,{opacity:1,x:0,y:0,filter:'blur(0px)',duration:1.65},i*.34);intro.fromTo(word,{'--echo-alpha':0,'--echo-x':'-0.08em'},{'--echo-alpha':.7,'--echo-x':'0em',duration:.24,repeat:1,yoyo:true,ease:'power2.out'},i*.34+.12)});
  gsap.set(artworkLayers,{autoAlpha:0,scale:1.06});gsap.set(artworkLayers[0],{autoAlpha:.38,scale:1});
  const artworkSequence=gsap.timeline({repeat:-1,defaults:{ease:'power2.inOut'}});
  artworkLayers.forEach((layer,i)=>{const next=artworkLayers[(i+1)%artworkLayers.length];artworkSequence.to({}, {duration:3.7});artworkSequence.to(layer,{autoAlpha:0,duration:1.15},'<');artworkSequence.fromTo(next,{autoAlpha:0,scale:1.12,x:i%2?18:-18,y:8},{autoAlpha:.38,scale:1,x:0,y:0,duration:1.35},'<')});
  artworkLayers.forEach((layer,i)=>gsap.to($('img',layer),{scale:1.1,xPercent:i%2?2:-2,yPercent:i%2?-1.5:1.5,duration:15+i*2,repeat:-1,yoyo:true,ease:'sine.inOut',delay:i*.4}));
  gsap.to(ghosts,{yPercent:-8,xPercent:-1,scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
  gsap.to(title,{y:-85,letterSpacing:'.09em',opacity:.12,scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.8}});
  gsap.to(hero,{backgroundPosition:'50% 70%',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
  addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});document.fonts?.ready.then(()=>ScrollTrigger.refresh());
 }catch(e){gsapActive=false;document.documentElement.classList.remove('gsap-ready');gsap.killTweensOf([hero,...px]);gsap.set([hero,...px,$$('.title-word')],{clearProps:'all'})}
}
// reveal / timeline / final beam
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));
const fin=$('#final');new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)fin.classList.add('in-v')}),{threshold:.4}).observe(fin);
// sticky CTA
const vis=new Set(),stk=$('#stk');
const so=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target.id):vis.delete(e.target.id));stk.classList.toggle('show',!vis.size)},{threshold:.05});
['hero','final','reserve'].forEach(i=>so.observe($('#'+i)));
// floating artwork reveal and accessible detail dialog
const artists=$('#artists'),artworks=$$('.artwork',artists),artworkTriggers=$$('.artwork-trigger',artists),artworkImages=$$('.artwork-image',artists),finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
const artworkImageLoader=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const image=$('.artwork-image',entry.target);image.loading='eager';artworkImageLoader.unobserve(entry.target)}}),{rootMargin:'260px'});
artworks.forEach(card=>artworkImageLoader.observe(card));
if(gsapActive){
 try{artworks.forEach((card,i)=>{gsap.fromTo(card,{autoAlpha:0,x:i%2?-36:36,y:42,clipPath:'inset(12% 8% 16% 8%)'},{autoAlpha:1,x:0,y:0,clipPath:'inset(0% 0% 0% 0%)',duration:1.1,ease:'power3.out',immediateRender:false,scrollTrigger:{trigger:card,start:'top 88%',toggleActions:'play none none reverse'}});gsap.fromTo($('.artwork-image',card),{scale:1.12},{scale:1,ease:'none',immediateRender:false,scrollTrigger:{trigger:card,start:'top bottom',end:'center center',scrub:1}})});
  const refreshArtists=()=>ScrollTrigger.refresh();artworkImages.forEach(img=>img.addEventListener('load',refreshArtists,{once:true}));addEventListener('load',refreshArtists,{once:true});
 }catch(e){gsapActive=false;gsap.set([...artworks,...artworkImages],{clearProps:'all'})}
}
if(finePointer&&!RM){artworkTriggers.forEach(trigger=>{trigger.addEventListener('pointerenter',()=>{artists.classList.add('has-hover');artworks.forEach(card=>card.classList.toggle('is-active',card===trigger.closest('.artwork')))});trigger.addEventListener('pointerleave',()=>{artists.classList.remove('has-hover');artworks.forEach(card=>card.classList.remove('is-active'))})})}
const artworkTrack=$('#artworks-track'),artworkPosition=$('#artwork-position');
let activeArtworkIndex=0;
const currentArtworkIndex=()=>{const r=artworkTrack.getBoundingClientRect(),center=r.left+r.width/2;return artworks.reduce((best,card,i)=>Math.abs((card.getBoundingClientRect().left+card.getBoundingClientRect().right)/2-center)<Math.abs((artworks[best].getBoundingClientRect().left+artworks[best].getBoundingClientRect().right)/2-center)?i:best,0)};
const updateArtworkPosition=()=>{activeArtworkIndex=currentArtworkIndex();artworkPosition.textContent=String(activeArtworkIndex+1).padStart(2,'0')+' / '+String(artworks.length).padStart(2,'0')};
const moveArtwork=direction=>{const next=(activeArtworkIndex+direction+artworks.length)%artworks.length,card=artworks[next],trackRect=artworkTrack.getBoundingClientRect(),cardRect=card.getBoundingClientRect(),left=artworkTrack.scrollLeft+cardRect.left-trackRect.left-(artworkTrack.clientWidth-cardRect.width)/2;activeArtworkIndex=next;artworkPosition.textContent=String(next+1).padStart(2,'0')+' / '+String(artworks.length).padStart(2,'0');artworkTrack.scrollTo({left,behavior:RM?'auto':'smooth'})};
$('#artwork-prev').addEventListener('click',()=>moveArtwork(-1));$('#artwork-next').addEventListener('click',()=>moveArtwork(1));artworkTrack.addEventListener('scroll',()=>requestAnimationFrame(updateArtworkPosition),{passive:true});artworkTrack.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();moveArtwork(-1)}if(e.key==='ArrowRight'){e.preventDefault();moveArtwork(1)}});updateArtworkPosition();
const artworkDialog=$('#artwork-dialog'),detailImage=$('#artwork-detail-image'),detailImageWrap=$('#artwork-detail-image-wrap'),detailArtist=$('#artwork-detail-artist'),detailTitle=$('#artwork-detail-title'),detailYear=$('#artwork-detail-year'),detailClose=$('.artwork-detail-close',artworkDialog);let artworkIndex=0,returnFocus=null;
const setDetail=(index,direction=1,animate=false)=>{artworkIndex=(index+artworkTriggers.length)%artworkTriggers.length;const trigger=artworkTriggers[artworkIndex],source=$('.artwork-image',trigger),update=()=>{detailImage.src=source.currentSrc||source.src;detailImage.alt=source.alt;detailImageWrap.dataset.crop=trigger.dataset.crop||'';detailArtist.textContent=trigger.dataset.artist;detailTitle.textContent=trigger.dataset.work;detailYear.textContent=trigger.dataset.year};
 if(animate&&gsapActive&&artworkDialog.open){gsap.to(detailImage,{opacity:0,x:direction*18,filter:'blur(6px)',duration:.16,onComplete:()=>{update();gsap.fromTo(detailImage,{opacity:0,x:-direction*18,filter:'blur(6px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.36,ease:'power2.out'})}})}else{update();detailImage.style.opacity=1;detailImage.style.transform='none';detailImage.style.filter='none'}};
artworkTriggers.forEach((trigger,index)=>trigger.addEventListener('click',()=>{returnFocus=trigger;setDetail(index);artworkDialog.showModal();detailClose.focus();if(gsapActive)gsap.fromTo(detailImage,{opacity:0,scale:.97,filter:'blur(8px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.48,ease:'power2.out'})}));
$('.artwork-detail-prev',artworkDialog).addEventListener('click',()=>setDetail(artworkIndex-1,-1,true));$('.artwork-detail-next',artworkDialog).addEventListener('click',()=>setDetail(artworkIndex+1,1,true));detailClose.addEventListener('click',()=>artworkDialog.close());
artworkDialog.addEventListener('click',e=>{if(e.target===artworkDialog)artworkDialog.close()});artworkDialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();artworkDialog.close()}if(e.key==='ArrowLeft'){e.preventDefault();setDetail(artworkIndex-1,-1,true)}if(e.key==='ArrowRight'){e.preventDefault();setDetail(artworkIndex+1,1,true)}});artworkDialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus();returnFocus=null});
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
