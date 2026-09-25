const DATA="saudi_mazad_v2", PASS="saudi_mazad_pass";
const initial={name:"لوحة مميزة",type:"private",numAr:"١٨٥",numEn:"185",letAr:"ب ج ر",letEn:"B J R",price:25000,inc:500,ends:Date.now()+1800000,active:true,logo:"saudi",customLogo:"",bids:[]};
let s=load(), selectedLogo=s.logo||"saudi";
function $(x){return document.getElementById(x)}
function load(){try{return {...initial,...JSON.parse(localStorage.getItem(DATA))}}catch{return {...initial}}}
function save(){localStorage.setItem(DATA,JSON.stringify(s))}
function toast(x){let t=$("toast");t.textContent=x;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function logoSvg(type){
 if(type==="blank") return "";
 if(type==="palm") return `<svg viewBox="0 0 100 100"><path d="M50 24V76M50 27C36 17 26 19 17 26M50 33C64 23 74 25 83 32M50 42C37 34 29 36 20 43M50 48C63 40 71 42 80 49" fill="none" stroke="#159447" stroke-width="6"/></svg>`;
 if(type==="building") return `<svg viewBox="0 0 100 100"><path d="M28 78V38L50 20L72 38V78Z" fill="#b88746"/><path d="M38 42H62V78H38Z" fill="#d7b06b"/><path d="M45 49H55V78H45Z" fill="#8e6b3d"/></svg>`;
 if(type==="castle") return `<svg viewBox="0 0 100 100"><path d="M20 78V42L31 30L38 43L50 24L62 43L69 30L80 42V78Z" fill="#b8884a"/><path d="M43 55H57V78H43Z" fill="#76532c"/></svg>`;
 return `<svg viewBox="0 0 100 100"><path d="M50 27C42 18 42 10 50 5C58 10 58 18 50 27Z" fill="#0a8f3d"/><path d="M50 27L50 62M50 39C36 31 28 34 20 40M50 47C64 39 72 42 80 48" fill="none" stroke="#0a8f3d" stroke-width="4"/><path d="M22 68Q50 47 78 68M25 61L75 77M75 61L25 77" fill="none" stroke="#151515" stroke-width="4"/></svg>`;
}
function render(){
 $("auctionTitle").textContent=s.name||"مزاد اللوحة";
 $("numberAr").textContent=s.numAr; $("numberEn").textContent=s.numEn;
 $("lettersAr").textContent=s.letAr; $("lettersEn").textContent=s.letEn;
 $("plateName").textContent=s.name; $("price").textContent=Number(s.price).toLocaleString("en-US");
 $("increment").textContent=Number(s.inc).toLocaleString("en-US")+" ريال";
 $("statNum").textContent=s.numEn; $("statLetters").textContent=s.letEn; $("bidCount").textContent=s.bids.length;
 $("status").innerHTML=`<i style="background:${s.active?"#45d381":"#e76f68"}"></i> ${s.active?"جاري المزاد":"المزاد متوقف"}`;
 $("toggleAuction").textContent=s.active?"إيقاف المزاد":"تشغيل المزاد";
 $("emblemBox").innerHTML=s.customLogo?`<img src="${s.customLogo}" alt="شعار اللوحة">`:logoSvg(s.logo);
 document.querySelectorAll(".logo-choice").forEach(x=>x.classList.toggle("selected",x.dataset.logo===s.logo && !s.customLogo));
 renderBids(); fill();
}
function fill(){
 $("fName").value=s.name;$("fType").value=s.type;$("fNumAr").value=s.numAr;$("fNumEn").value=s.numEn;
 $("fLetAr").value=s.letAr;$("fLetEn").value=s.letEn;$("fPrice").value=s.price;$("fInc").value=s.inc;
 $("fMinutes").value=Math.max(1,Math.ceil((s.ends-Date.now())/60000));
}
function renderBids(){
 $("bids").innerHTML=s.bids.length?s.bids.slice().reverse().map(b=>`<div class="bid"><span>${esc(b.name)}</span><strong>${Number(b.amount).toLocaleString("en-US")} ريال</strong><small>${esc(b.time)}</small></div>`).join(""):'<div class="empty">لا توجد مزايدات مسجلة</div>';
}
function esc(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function tick(){
 if(s.active&&Date.now()>=s.ends){s.active=false;save();render();toast("انتهى المزاد")}
 let d=Math.max(0,s.ends-Date.now()),h=Math.floor(d/3600000),m=Math.floor(d%3600000/60000),sec=Math.floor(d%60000/1000);
 $("timer").textContent=[h,m,sec].map(x=>String(x).padStart(2,"0")).join(":");
}
function openModal(){ $("modal").classList.remove("hidden");let ok=sessionStorage.getItem("admin")==="1";$("login").classList.toggle("hidden",ok);$("admin").classList.toggle("hidden",!ok);if(ok)fill()}
function closeModal(){$("modal").classList.add("hidden")}
$("adminOpen").onclick=openModal;$("close").onclick=closeModal;
$("loginBtn").onclick=()=>{let p=$("password").value,real=localStorage.getItem(PASS)||"1234";if(p===real){sessionStorage.setItem("admin","1");$("login").classList.add("hidden");$("admin").classList.remove("hidden");fill()}else $("error").textContent="كلمة المرور غير صحيحة"};
$("logout").onclick=()=>{sessionStorage.removeItem("admin");closeModal()};
document.querySelectorAll(".logo-choice").forEach(b=>b.onclick=()=>{selectedLogo=b.dataset.logo;s.logo=selectedLogo;s.customLogo="";document.querySelectorAll(".logo-choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
$("fLogo").onchange=e=>{let f=e.target.files?.[0];if(!f)return;let r=new FileReader();r.onload=()=>{s.customLogo=r.result;s.logo="custom";render();toast("تم تجهيز الشعار المخصص")};r.readAsDataURL(f)};
$("save").onclick=()=>{s={...s,name:$("fName").value.trim()||"لوحة مميزة",type:$("fType").value,numAr:$("fNumAr").value.trim(),numEn:$("fNumEn").value.trim(),letAr:$("fLetAr").value.trim(),letEn:$("fLetEn").value.trim(),price:Number($("fPrice").value)||0,inc:Number($("fInc").value)||500,ends:Date.now()+Math.max(1,Number($("fMinutes").value)||60)*60000,active:true,logo:s.logo||selectedLogo,customLogo:s.customLogo||"",bids:[]};save();render();toast("تم حفظ اللوحة وبدء المزاد")};
$("stop").onclick=()=>{s.active=false;save();render();toast("تم إيقاف المزاد")};
$("toggleAuction").onclick=()=>{s.active=!s.active;if(s.active&&s.ends<=Date.now())s.ends=Date.now()+3600000;save();render()};
$("clear").onclick=()=>{if(confirm("مسح سجل المزايدات؟")){s.bids=[];save();render();toast("تم مسح السجل")}};
$("changePass").onclick=()=>{let p=$("newPass").value.trim();if(p.length<4){toast("كلمة المرور قصيرة");return}localStorage.setItem(PASS,p);$("newPass").value="";toast("تم تغيير كلمة المرور")};
render();tick();setInterval(tick,1000);
