/** GALLERY DOT 予約API。設定は「プロジェクトの設定 > スクリプト プロパティ」で行う（README参照）。
 *  必須: RESERVATION_OPEN=true / SLOT_CAPACITY / MAX_COMPANIONS / LAST_SLOT(例18:30) / ADMIN_KEY ; 任意: SHEET_ID, CLOSED_DATES, SITE_URL */
const H=['reservation_id','created_at','name','email','phone','visit_date','visit_time','companion_count','event_id','status','checkin_token','checked_in_at','mug_redeemed_at','marketing_consent','privacy_consent','updated_at'];
const P_=()=>PropertiesService.getScriptProperties().getProperties();
const out_=o=>ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const err_=(field,message)=>({ok:false,field,message});
const clean_=v=>String(v==null?'':v).replace(/[\u0000-\u001f]/g,' ').trim().slice(0,200);
const safe_=v=>/^[=+\-@]/.test(v)?"'"+v:v; // 数式インジェクション対策
function sheet_(){const p=P_(),ss=p.SHEET_ID?SpreadsheetApp.openById(p.SHEET_ID):SpreadsheetApp.getActiveSpreadsheet();let s=ss.getSheetByName('reservations');
  if(!s){s=ss.insertSheet('reservations');s.getRange(1,1,s.getMaxRows(),H.length).setNumberFormat('@');s.appendRow(H);s.setFrozenRows(1)}return s}
function setup(){sheet_()} // 初回に1度実行して権限承認とシート作成
function doGet(e){const q=e.parameter||{};if(q.action==='slots')return out_(slots_(q.date));return out_({ok:true})}
function doPost(e){let b;try{b=JSON.parse(e.postData.contents)}catch(_){return out_(err_('','不正なリクエストです。'))}
  const a={reserve:reserve_,cancel:cancel_,checkin:b=>admin_(b,'checkin'),redeem:b=>admin_(b,'redeem')}[b.action];
  return out_(a?a(b):err_('','不明な操作です。'))}
function dateOk_(d,p){if(!/^2026-10-(1\d|2[0-6])$/.test(d)||d<'2026-10-10')return false;
  const closed=(p.CLOSED_DATES||'2026-10-13,2026-10-20').split(',');if(closed.includes(d))return false;
  return d>=Utilities.formatDate(new Date(),'Asia/Tokyo','yyyy-MM-dd')}
function timeOk_(t,p){const m=/^(\d\d):(\d\d)$/.exec(t);if(!m)return false;const v=+m[1]*60+ +m[2],l=(p.LAST_SLOT||'18:30').split(':');return v%30===0&&v>=720&&v<=+l[0]*60+ +l[1]}
function rows_(){return sheet_().getDataRange().getValues().slice(1)}
function slots_(date){const p=P_(),cap=+p.SLOT_CAPACITY||0,use={};
  rows_().forEach(r=>{if(r[9]==='confirmed'&&r[5]===date)use[r[6]]=(use[r[6]]||0)+1+ +r[7]});
  return{ok:true,full:cap?Object.keys(use).filter(t=>use[t]>=cap):[]}}
function reserve_(b){const p=P_();
  if(p.RESERVATION_OPEN!=='true'||!+p.SLOT_CAPACITY)return err_('','現在、予約受付の準備中です。');
  if(b.website)return err_('','送信できませんでした。');
  const name=clean_(b.name),email=clean_(b.email).toLowerCase(),phone=clean_(b.phone),date=clean_(b.visit_date),time=clean_(b.visit_time),comp=+b.companion_count;
  if(!name)return err_('name','お名前を入力してください。');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return err_('email','正しいメールアドレスを入力してください。');
  if(!/^[0-9+\-() ]{9,20}$/.test(phone))return err_('phone','電話番号を入力してください。');
  if(!dateOk_(date,p))return err_('date','この日は予約できません。');
  if(!timeOk_(time,p))return err_('time','来場時間を選択してください。');
  if(!Number.isInteger(comp)||comp<0||comp>(+p.MAX_COMPANIONS||0))return err_('comp','同伴人数を確認してください。');
  if(b.privacy_consent!==true)return err_('privacy','利用規約への同意が必要です。');
  const lock=LockService.getScriptLock();if(!lock.tryLock(20000))return err_('','混み合っています。しばらくして再度お試しください。');
  try{let used=0;
    for(const r of rows_()){if(r[9]!=='confirmed'||r[5]!==date||r[6]!==time)continue;
      if(String(r[3]).toLowerCase()===email)return err_('email','同じ日時で既に予約されています。');used+=1+ +r[7]}
    if(used+1+comp>+p.SLOT_CAPACITY)return err_('time','この時間帯は満席です。');
    const id='R'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),tok=Utilities.getUuid().replace(/-/g,''),now=Utilities.formatDate(new Date(),'Asia/Tokyo',"yyyy-MM-dd'T'HH:mm:ss");
    sheet_().appendRow([id,now,safe_(name),safe_(email),safe_(phone),date,time,String(comp),'','confirmed',tok,'','',b.marketing_consent?'yes':'no','yes',now]);
    let mail=true;try{mail_(id,name,email,date,time,tok)}catch(x){mail=false;console.error('mail failed')}
    return{ok:true,reservation_id:id,checkin_token:tok,mail_sent:mail}
  }finally{lock.releaseLock()}}
function mail_(id,name,to,date,time,tok){
  const body=`${name} 様\n\nGALLERY DOT 10周年記念展「AFTER IMAGE」のご予約を承りました。\n\n予約番号：${id}\n来場日時：${date} ${time}\n会場：〒150-0001 東京都渋谷区神宮前1-2-3 DOT BLDG 1F\n\n【記念マグカップ】事前予約＋当日QRチェックインが必要／各日先着40点・なくなり次第終了／予約者本人のみ1点（同伴者は対象外）／引換は当日限り／色はお選びいただけない場合があります。\n【変更・キャンセル】前日18:00まで。予約番号を添えて info@gallery-dot.jp へご連絡ください。\n混雑時は入場をご案内する場合があります。\n\nチェックイン用コード：${tok}\n（添付のQRコード画像を受付でご提示ください）\n`;
  const o={name:'GALLERY DOT'};
  try{o.attachments=[UrlFetchApp.fetch('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+tok).getBlob().setName('qr.png')]}catch(x){}
  MailApp.sendEmail(to,'【GALLERY DOT】AFTER IMAGE ご予約完了（'+id+'）',body,o)}
function cancel_(b){const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{const s=sheet_(),v=s.getDataRange().getValues();
    for(let i=1;i<v.length;i++){const r=v[i];if(r[0]===b.reservation_id&&String(r[3]).toLowerCase()===clean_(b.email).toLowerCase()&&r[9]==='confirmed'){
      if(new Date(r[5]+'T18:00:00+09:00').getTime()-864e5<Date.now())return err_('','キャンセル受付は前日18:00までです。');
      s.getRange(i+1,10).setValue('cancelled');s.getRange(i+1,16).setValue(new Date().toISOString());return{ok:true}}}
    return err_('','予約が見つかりません。')}finally{lock.releaseLock()}}
function admin_(b,mode){const key=P_().ADMIN_KEY;if(!key||b.admin_key!==key)return err_('','権限がありません。');
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{const s=sheet_(),v=s.getDataRange().getValues(),now=new Date().toISOString();
    for(let i=1;i<v.length;i++){const r=v[i];if(r[10]!==b.token)continue;
      if(r[9]!=='confirmed')return err_('','この予約は無効です。');
      if(mode==='checkin'){if(r[11])return err_('','チェックイン済みです。');s.getRange(i+1,12).setValue(now)}
      else{if(!r[11])return err_('','先にチェックインしてください。');if(r[12])return err_('','マグカップは引換済みです。');s.getRange(i+1,13).setValue(now)}
      s.getRange(i+1,16).setValue(now);return{ok:true,reservation_id:r[0],companion_count:+r[7]}}
    return err_('','QRが見つかりません。')}finally{lock.releaseLock()}}
