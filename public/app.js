let tab="login",room=null,lastId=0,me=null,poll=null,ctx=null;
const $=id=>document.getElementById(id);
async function api(url,opts={}){let r=await fetch(url,{...opts,headers:opts.body instanceof FormData?{}:{"Content-Type":"application/json",...(opts.headers||{})}});let d=await r.json();if(!r.ok)throw Error(d.error||"Something went wrong");return d}
function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2600)}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$("authform").elements.username.style.display=tab==="register"?"block":"none";$("authmsg").textContent=tab==="register"?"Create your free account.":"Log in to Plexora.";});
$("authform").elements.username.style.display="none";
$("authform").onsubmit=async e=>{e.preventDefault();let f=new FormData(e.target);try{let d=await api("/api/"+tab,{method:"POST",body:JSON.stringify(Object.fromEntries(f))});me=d.user;showApp()}catch(x){$("authmsg").textContent=x.message}};
async function boot(){try{let d=await api("/api/me");me=d.user;showApp()}catch{}}
function showApp(){$("auth").hidden=true;$("app").hidden=false;$("userbar").textContent=me.username;refreshMe()}
async function refreshMe(){let d=await api("/api/me");me=d.user;$("coins").textContent=me.coins;$("profile").innerHTML=(me.logo?`<img src="${me.logo}" width="32" style="vertical-align:middle;border-radius:50%"> `:"")+esc(me.username)+(me.flippo?' <span class="flip">✦ FLIPPO</span>':"");if(me.banner)$("roomhead").style.backgroundImage=`linear-gradient(#182541bb,#182541bb),url("${me.banner}")`; $("sound").value=me.sound||"chime"}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("create").onclick=async()=>{try{let d=await api("/api/servers",{method:"POST",body:"{}"});toast("Server created! Invite link copied.");navigator.clipboard?.writeText(d.link);enterRoom(d.server)}catch(e){toast(e.message)}};
$("join").onclick=async()=>{try{let d=await api("/api/join",{method:"POST",body:JSON.stringify({invite:$("invite").value})});enterRoom(d.server)}catch(e){toast(e.message)}};
async function enterRoom(s){room=s;$("roomhead").innerHTML=`<h2>${esc(s.name)}</h2><p class="muted">Invite link: <b>${esc(s.invite)}</b> <button id="copy">Copy link</button></p>`;$("copy").onclick=()=>navigator.clipboard?.writeText(location.origin+"/?join="+s.invite);lastId=0;await loadMessages();if(poll)clearInterval(poll);poll=setInterval(loadMessages,1800);$("message").focus()}
async function loadMessages(){if(!room)return;try{let d=await api(`/api/messages/${room.id}?after=${lastId}`);for(let m of d.messages){lastId=Math.max(lastId,m.id);let el=document.createElement("div");el.className="msg";el.innerHTML=`<small>${esc(m.username)} ${m.flippo?'<span class="flip">✦</span>':""} · ${new Date(m.created).toLocaleTimeString()}</small><div>${esc(m.body||"")}</div>${m.image?`<img src="${m.image}">`:""}`;$("messages").append(el);$("messages").scrollTop=$("messages").scrollHeight;if(m.user_id!==me.id)playSound()}if(d.messages.length)refreshMe()}catch{}}
$("sendform").onsubmit=async e=>{e.preventDefault();let body=$("message").value.trim(),photo=$("photo").files[0];if(!body&&!photo)return;let f=new FormData();f.append("body",body);if(photo)f.append("image",photo);try{await api(`/api/messages/${room.id}`,{method:"POST",body:f});$("message").value="";$("photo").value="";await loadMessages()}catch(x){toast(x.message)}};
$("emoji").onclick=()=>$("emojis").hidden=!$("emojis").hidden;
$("emojis").onclick=e=>{if(e.target.textContent.trim())$("message").value+=$("message").value?" "+e.target.textContent.trim():e.target.textContent.trim();$("message").focus()};
$("buy").onclick=async()=>{try{let d=await api("/api/flippo",{method:"POST",body:"{}"});toast(d.message);refreshMe()}catch(e){toast(e.message)}};
$("rename").onclick=async()=>{try{await api("/api/profile",{method:"POST",body:JSON.stringify({username:$("newname").value})});toast("Name updated");refreshMe()}catch(e){toast(e.message)}};
async function upload(field,key){let file=$(field).files[0];if(!file)return;let f=new FormData();f.append("image",file);try{await api("/api/profile/"+key,{method:"POST",body:f});toast("Profile updated");refreshMe()}catch(e){toast(e.message)}}
$("logo").onchange=()=>upload("logo","logo");$("banner").onchange=()=>upload("banner","banner");
$("sound").onchange=async()=>{await api("/api/profile",{method:"POST",body:JSON.stringify({sound:$("sound").value})})};
function playSound(){let s=$("sound").value;if(s==="off")return;try{let c=ctx||(ctx=new AudioContext()),o=c.createOscillator(),g=c.createGain();o.type=s==="pop"?"square":"sine";o.frequency.value=s==="bell"?880:s==="pop"?420:Number($("tone").value);g.gain.value=.07;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.16)}catch{}}
$("preview").onclick=playSound;
$("logout").onclick=async()=>{await api("/api/logout",{method:"POST",body:"{}"});location.reload()};
(async()=>{await boot();let code=new URLSearchParams(location.search).get("join");if(code&&me){$("invite").value=code;$("join").click()}})();
