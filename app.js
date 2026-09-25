const KEY = "mazad_lawhat_v1";
const PASS_KEY = "mazad_admin_password";
const DEFAULT_PASS = "1234";

const defaultState = {
  name: "لوحة مميزة",
  numberAr: "١٨٥",
  numberEn: "185",
  lettersAr: "ب ج ر",
  lettersEn: "B J R",
  price: 25000,
  increment: 500,
  endsAt: Date.now() + 2*60*60*1000 + 15*60*1000 + 38*1000,
  active: true,
  bids: []
};

let state = loadState();
let logoData = null;
let timer;

const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString("en-US");
const nowTime = () => new Date().toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"});
function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? {...defaultState,...saved} : defaultState;
  }catch{return defaultState}
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function toast(msg){
  const t=$("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2300);
}
function render(){
  $("plateName").textContent=state.name || "لوحة مميزة";
  $("plateNumberAr").textContent=state.numberAr || "";
  $("plateNumberEn").textContent=state.numberEn || "";
  $("lettersAr").textContent=state.lettersAr || "";
  $("lettersEn").textContent=state.lettersEn || "";
  $("currentPrice").textContent=fmt(state.price);
  $("bidIncrement").textContent=fmt(state.increment)+" ريال";
  $("bidCount").textContent=state.bids.length;
  $("statNumber").textContent=state.numberEn || "";
  $("statLetters").textContent=state.lettersEn || "";
  $("auctionStatus").textContent=state.active ? "جاري المزاد" : "المزاد متوقف";
  document.querySelector(".status-pill i").style.background=state.active?"#53d48a":"#e76f68";
  $("startStopBtn").textContent=state.active ? "إيقاف المزاد" : "تشغيل المزاد";
  renderBids();
  fillForm();
}
function renderBids(){
  const el=$("bidList");
  if(!state.bids.length){el.innerHTML='<div class="empty">لا توجد مزايدات مسجلة حاليًا</div>';return}
  el.innerHTML=state.bids.slice().reverse().map(b=>`
    <div class="bid">
      <span>${escapeHtml(b.name)}</span>
      <strong>${fmt(b.amount)} ريال</strong>
      <small>${escapeHtml(b.time)}</small>
    </div>`).join("");
}
function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function fillForm(){
  $("fName").value=state.name;
  $("fNumberAr").value=state.numberAr;
  $("fNumberEn").value=state.numberEn;
  $("fLettersAr").value=state.lettersAr;
  $("fLettersEn").value=state.lettersEn;
  $("fPrice").value=state.price;
  $("fIncrement").value=state.increment;
  $("fMinutes").value=Math.max(1,Math.round((state.endsAt-Date.now())/60000));
}
function tick(){
  if(state.active && Date.now()>=state.endsAt){
    state.active=false; save(); render(); toast("انتهى المزاد");
  }
  const diff=Math.max(0,state.endsAt-Date.now());
  const h=Math.floor(diff/3600000), m=Math.floor(diff%3600000/60000), s=Math.floor(diff%60000/1000);
  $("countdown").textContent=[h,m,s].map((x,i)=>i===0?String(x).padStart(2,"0"):String(x).padStart(2,"0")).join(":");
}
function openAdmin(){
  $("adminModal").classList.remove("hidden");
  const logged=sessionStorage.getItem("mazad_admin")==="1";
  $("loginView").classList.toggle("hidden",logged);
  $("adminView").classList.toggle("hidden",!logged);
  if(logged) fillForm();
}
function closeModal(){ $("adminModal").classList.add("hidden"); }
$("adminOpenBtn").onclick=openAdmin;
$("newAuctionTopBtn").onclick=openAdmin;
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeModal);
$("loginBtn").onclick=()=>{
  const pass=$("adminPassword").value;
  const stored=localStorage.getItem(PASS_KEY)||DEFAULT_PASS;
  if(pass===stored){
    sessionStorage.setItem("mazad_admin","1");
    $("loginError").textContent="";
    $("loginView").classList.add("hidden");
    $("adminView").classList.remove("hidden");
    fillForm();
  }else $("loginError").textContent="كلمة المرور غير صحيحة";
};
$("logoutBtn").onclick=()=>{
  sessionStorage.removeItem("mazad_admin"); closeModal();
};
$("saveAuctionBtn").onclick=()=>{
  if(sessionStorage.getItem("mazad_admin")!=="1") return;
  const mins=Math.max(1,Number($("fMinutes").value)||60);
  state={
    ...state,
    name:$("fName").value.trim()||"لوحة مميزة",
    numberAr:$("fNumberAr").value.trim(),
    numberEn:$("fNumberEn").value.trim(),
    lettersAr:$("fLettersAr").value.trim(),
    lettersEn:$("fLettersEn").value.trim(),
    price:Math.max(0,Number($("fPrice").value)||0),
    increment:Math.max(1,Number($("fIncrement").value)||500),
    endsAt:Date.now()+mins*60000,
    active:true,
    bids:[]
  };
  save(); render(); toast("تم حفظ وبدء المزاد");
};
$("startStopBtn").onclick=()=>{
  if(state.active){
    state.active=false;
  }else{
    state.active=true;
    if(state.endsAt<=Date.now()) state.endsAt=Date.now()+60*60000;
  }
  save(); render();
};
$("stopAuctionBtn").onclick=()=>{
  state.active=false; save(); render(); toast("تم إيقاف المزاد");
};
$("resetBtn").onclick=()=>{
  if(confirm("هل تريد إعادة المزاد للبيانات الافتراضية؟")){
    state={...defaultState,endsAt:Date.now()+2*60*60*1000+15*60*1000+38*1000,bids:[]};
    save(); render(); toast("تمت إعادة الضبط");
  }
};
$("clearBidsBtn").onclick=()=>{
  if(confirm("مسح جميع المزايدات؟")){
    state.bids=[]; save(); render(); toast("تم مسح المزايدات");
  }
};
$("changePasswordBtn").onclick=()=>{
  const p=$("newPassword").value.trim();
  if(p.length<4){toast("كلمة المرور يجب أن تكون 4 أحرف على الأقل");return}
  localStorage.setItem(PASS_KEY,p); $("newPassword").value=""; toast("تم تغيير كلمة المرور");
};
$("fLogo").addEventListener("change",e=>{
  const file=e.target.files?.[0]; if(!file)return;
  const reader=new FileReader(); reader.onload=()=>{logoData=reader.result; toast("تم تحميل الصورة مؤقتًا")}; reader.readAsDataURL(file);
});
$("year").textContent=new Date().getFullYear();
render(); tick(); timer=setInterval(tick,1000);
