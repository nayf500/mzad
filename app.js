const KEY='exact_plate_auction_v3';
let s=JSON.parse(localStorage.getItem(KEY)||'null')||{title:'لوحة مميزة',design:'design2.jpg',ar:'٥١٥',en:'515',lar:'هـ ن ر',len:'R N H',price:25000,inc:500,end:Date.now()+1800000,active:true};
const $=x=>document.getElementById(x);
function save(){localStorage.setItem(KEY,JSON.stringify(s))}
function render(){
 $('auctionTitle').textContent=s.title;
 $('plateImg').src=s.design;
 $('numberAr').textContent=s.ar;$('numberEn').textContent=s.en;
 $('lettersAr').textContent=s.lar;$('lettersEn').textContent=s.len;
 $('infoEn').textContent=s.en;$('infoLetters').textContent=s.len;
 $('price').textContent=Number(s.price).toLocaleString('en-US');
 $('increment').textContent=Number(s.inc).toLocaleString('en-US');
 $('stateText').textContent=s.active?'المزاد مباشر':'المزاد متوقف';
 $('status').textContent=s.active?'المزاد مفتوح':'المزاد متوقف';
}
function tick(){
 let d=Math.max(0,s.end-Date.now());
 if(s.active&&d===0){s.active=false;save();render()}
 let h=Math.floor(d/3600000),m=Math.floor(d%3600000/60000),q=Math.floor(d%60000/1000);
 $('timer').textContent=[h,m,q].map(x=>String(x).padStart(2,'0')).join(':');
}
$('adminBtn').onclick=()=>{$('modal').classList.remove('hidden');$('loginBox').classList.remove('hidden');$('adminBox').classList.add('hidden')};
$('close').onclick=()=>$('modal').classList.add('hidden');
$('login').onclick=()=>{
 if($('password').value===(localStorage.getItem('auction_admin_password')||'1234')){
  $('loginBox').classList.add('hidden');$('adminBox').classList.remove('hidden');
  $('fTitle').value=s.title;$('fDesign').value=s.design;$('fAr').value=s.ar;$('fEn').value=s.en;$('fLar').value=s.lar;$('fLen').value=s.len;$('fPrice').value=s.price;$('fInc').value=s.inc;$('fMin').value=Math.max(1,Math.ceil((s.end-Date.now())/60000));
 }else $('error').textContent='كلمة المرور غير صحيحة';
};
$('save').onclick=()=>{
 s={title:$('fTitle').value||'لوحة مميزة',design:$('fDesign').value,ar:$('fAr').value,en:$('fEn').value,lar:$('fLar').value,len:$('fLen').value,price:+$('fPrice').value||0,inc:+$('fInc').value||500,end:Date.now()+(+$('fMin').value||60)*60000,active:true};
 save();render();$('modal').classList.add('hidden');
};
$('stop').onclick=()=>{s.active=false;save();render()};
render();tick();setInterval(tick,1000);