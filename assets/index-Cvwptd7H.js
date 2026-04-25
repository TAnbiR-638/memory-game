(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const N of c.addedNodes)N.tagName==="LINK"&&N.rel==="modulepreload"&&o(N)}).observe(document,{childList:!0,subtree:!0});function n(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(a){if(a.ep)return;a.ep=!0;const c=n(a);fetch(a.href,c)}})();const F=10;var D;const ne=((D=window.APP_CONFIG)==null?void 0:D.apiBaseUrl)||void 0||"http://localhost:3000/api",P="memory-game-token",J="memory-game-guest-leaderboards-v1",H=["🍓","🚀","🎵","⚽","🐱","🌈","🎲","⭐","🍎","🍋","🍇","🍉","🥝","🍍","🥑","🥕","🌶️","🌽","🍄","🥜","🍪","🍩","🍫","🍰","🧁","🍿","🥨","🧇","🥞","🍔","🍕","🌭","🍟","🥪","🌮","🍣","🍤","🍜","🍙","🍱","🧃","🥤","☕","🍵","🎸","🎹","🥁","🎺","🎻","🎤","🎯","🏀","🏈","🎾","🏐","🏓","🥊","🥎","🏹","🪁","🧩","🎨","🎬","🎮","🕹️","🧸","🪀","🪄","🔔","💎","🔮","🧭","⌛","🛰️","🛸","🛶","🚲","🚁","🚢","🗺️"],R=[{key:"easy-2x2",difficulty:"Easy",rows:2,cols:2,maxTimeSeconds:60},{key:"easy-4x4",difficulty:"Easy",rows:4,cols:4,maxTimeSeconds:120},{key:"medium-6x6",difficulty:"Medium",rows:6,cols:6,maxTimeSeconds:180},{key:"medium-8x8",difficulty:"Medium",rows:8,cols:8,maxTimeSeconds:240},{key:"hard-10x10",difficulty:"Hard",rows:10,cols:10,maxTimeSeconds:360},{key:"hard-12x12",difficulty:"Hard",rows:12,cols:12,maxTimeSeconds:480}],K=document.querySelector("#app");if(!K)throw new Error("App root not found");K.innerHTML=`
  <main class="game-shell">
    <header class="game-header">
      <h1>Memory Game</h1>
      <p>Match all 8 icon pairs before time runs out.</p>
    </header>

    <section class="auth-panel" aria-label="User login">
      <div class="auth-grid">
        <input id="emailInput" type="email" placeholder="Email" autocomplete="email" />
        <input id="passwordInput" type="password" placeholder="Password" autocomplete="current-password" />
        <button id="signupBtn" type="button" class="auth-btn">Sign up</button>
        <button id="loginBtn" type="button" class="auth-btn auth-btn-secondary">Log in</button>
        <button id="guestBtn" type="button" class="auth-btn auth-btn-secondary">Play Guest</button>
        <button id="logoutBtn" type="button" class="auth-btn auth-btn-ghost" disabled>Log out</button>
      </div>
      <p id="authStatus" class="auth-status">Please log in or sign up to play and save scores.</p>
    </section>

    <section class="level-panel" aria-label="Game level">
      <label for="levelSelect" class="label">Level</label>
      <select id="levelSelect"></select>
      <p id="levelInfo" class="level-info"></p>
    </section>

    <section class="hud" aria-label="Game status">
      <div class="hud-item">
        <span class="label">Time</span>
        <strong id="countdown">00:00 / 03:00</strong>
      </div>
      <div class="hud-item">
        <span class="label">Moves</span>
        <strong id="moves">0</strong>
      </div>
      <div class="hud-item">
        <span class="label">Matched</span>
        <strong id="matched">0 / 8</strong>
      </div>
      <button id="startBtn" class="start-btn" type="button">Start</button>
      <button id="restartBtn" class="restart-btn" type="button">Refresh</button>
    </section>

    <section class="board-wrap">
      <div id="board" class="board" aria-label="Memory game board"></div>
    </section>

    <p id="message" class="message" role="status" aria-live="polite">Click any two cells to find matching icons.</p>

    <section class="stats-panel" aria-label="Game history">
      <article class="stats-card">
        <h2>Minimum Time</h2>
        <p id="bestTime" class="stat-big">No record yet</p>
      </article>

      <article class="stats-card">
        <h2>Leaderboard</h2>
        <ol id="leaderboardList" class="leaderboard-list"></ol>
      </article>
    </section>
  </main>
`;function r(e){const t=document.getElementById(e);if(!t)throw new Error(`Element #${e} not found`);return t}const E=r("board"),se=r("countdown"),oe=r("moves"),ae=r("matched"),f=r("message"),G=r("startBtn"),re=r("restartBtn"),_=r("bestTime"),A=r("leaderboardList"),ie=r("emailInput"),ce=r("passwordInput"),j=r("signupBtn"),z=r("loginBtn"),Y=r("guestBtn"),Q=r("logoutBtn"),p=r("authStatus"),I=r("levelSelect"),le=r("levelInfo");let i=null,l=null,S=!1,C=0,O=0,h=0,M=null,L=!1,g=localStorage.getItem(P)||"",b=null,d="guest",s=R[1];function w(e){const t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function q(e){const t=[...e];for(let n=t.length-1;n>0;n-=1){const o=Math.floor(Math.random()*(n+1));[t[n],t[o]]=[t[o],t[n]]}return t}function de(){const t=s.rows*s.cols/2;if(t>H.length)throw new Error("Not enough icons in pool for selected level.");const n=q(H).slice(0,t);return q([...n,...n])}function k(){se.textContent=`${w(h)} / ${w(s.maxTimeSeconds)}`,oe.textContent=String(C),ae.textContent=`${O} / ${s.rows*s.cols/2}`}function ue(){E.innerHTML=""}function B(){M!==null&&(window.clearInterval(M),M=null)}function me(){B(),M=window.setInterval(()=>{h+=1,k(),h>=s.maxTimeSeconds&&(h=s.maxTimeSeconds,k(),B(),S=!0,L=!1,f.textContent=`Time is up (${w(s.maxTimeSeconds)}). Refresh to try again.`,Z())},1e3)}function V(e){return[...e].sort((t,n)=>t.seconds!==n.seconds?t.seconds-n.seconds:t.moves-n.moves)}function u(e){const t=V(e).slice(0,F);if(A.innerHTML="",t.length===0){const n=document.createElement("li");n.textContent="No completed games yet.",A.appendChild(n),_.textContent="No record yet";return}t.forEach(n=>{const o=document.createElement("li");o.textContent=`${w(n.seconds)} (${n.moves} moves)`,A.appendChild(o)}),_.textContent=w(t[0].seconds)}function W(){const e=localStorage.getItem(J);if(!e)return{};try{const t=JSON.parse(e);return!t||typeof t!="object"?{}:t}catch{return{}}}function fe(e){localStorage.setItem(J,JSON.stringify(e))}function x(e){return(W()[e]||[]).filter(o=>Number.isFinite(o.seconds)&&Number.isFinite(o.moves))}function pe(e,t){const n=W(),o=[...n[e]||[],t];n[e]=V(o).slice(0,F),fe(n)}function U(e){return`${e.difficulty}: ${e.rows}x${e.cols} (${w(e.maxTimeSeconds)})`}function X(){le.textContent=`Current level: ${U(s)}`}function he(){I.innerHTML="",R.forEach(e=>{const t=document.createElement("option");t.value=e.key,t.textContent=U(e),e.key===s.key&&(t.selected=!0),I.appendChild(t)}),X()}function Z(){E.querySelectorAll(".card").forEach(t=>{t.disabled=!0})}function ge(){E.querySelectorAll(".card").forEach(t=>{t.classList.contains("matched")||(t.disabled=!1)})}function be(e,t){const n=document.createElement("button");return n.className="card",n.type="button",n.setAttribute("aria-label",`Hidden card ${t+1}`),n.dataset.icon=e,n.innerHTML=`
    <span class="card-inner">
      <span class="card-back">?</span>
      <span class="card-face">${e}</span>
    </span>
  `,n.addEventListener("click",()=>ye(n)),n}function ye(e){if(!(S||e===i||e.classList.contains("matched"))){if(e.classList.remove("mismatch"),e.classList.add("flipped"),!i){i=e;return}l=e,C+=1,k(),ve()}}function ve(){if(!i||!l)return;if(i.dataset.icon===l.dataset.icon){we();return}Se()}function we(){!i||!l||(i.classList.add("matched"),l.classList.add("matched"),i.disabled=!0,l.disabled=!0,O+=1,f.textContent="Nice match!",ee(),k(),Le())}function Se(){!i||!l||(S=!0,i.classList.add("mismatch"),l.classList.add("mismatch"),f.textContent="Not a match. Cards will hide again.",window.setTimeout(()=>{i==null||i.classList.remove("flipped","mismatch"),l==null||l.classList.remove("flipped","mismatch"),ee()},700))}function ee(){i=null,l=null,S=!1}async function Le(){const e=s.rows*s.cols/2;O===e&&(B(),S=!0,L=!1,await Ce(h,C),f.textContent=`Game over! ${U(s)} completed in ${w(h)} and ${C} moves.`)}function Ee(){L||(L=!0,S=!1,G.disabled=!0,f.textContent="Game started. Find matching pairs!",ge(),me())}function m(){B(),ue(),i=null,l=null,S=!0,L=!1,C=0,O=0,h=0,G.disabled=!1,f.textContent=b?"Click Start to begin, then match pairs.":"Guest mode active. Click Start to begin.";const e=de();E.style.gridTemplateColumns=`repeat(${s.cols}, minmax(0, 1fr))`,e.forEach((t,n)=>{const o=be(t,n);E.appendChild(o)}),Z(),k()}function te(){const e=ie.value.trim(),t=ce.value;return{email:e,password:t}}function y(e,t){g=e||"",b=t||null,g?localStorage.setItem(P,g):localStorage.removeItem(P)}function v(){const e=!!b;if(Q.disabled=!e,j.disabled=!1,z.disabled=!1,Y.disabled=d==="guest",G.disabled=!1,e&&b){p.textContent=`Logged in as ${b.email}. Leaderboard is linked to PostgreSQL by level.`,L||(f.textContent="Click Start to begin, then match pairs.");return}p.textContent="Guest mode: your scores are saved in this browser for each level.",f.textContent="Guest mode active. Click Start to begin."}async function T(e,t={}){const n={"Content-Type":"application/json",...t.headers||{}};g&&(n.Authorization=`Bearer ${g}`);const o=await fetch(`${ne}${e}`,{...t,headers:n}),a=await o.json().catch(()=>({}));if(!o.ok){const c=a.error||"Request failed.";throw new Error(c)}return a}async function $(){if(!b||d==="guest"){u(x(s.key));return}try{const e=await T(`/leaderboard?levelKey=${encodeURIComponent(s.key)}`,{method:"GET"});u(e.entries||[])}catch(e){const t=e instanceof Error?e.message:"Unknown error";p.textContent=`Leaderboard unavailable: ${t}`,u([])}}async function Ce(e,t){if(d==="guest"||!b){pe(s.key,{seconds:e,moves:t}),u(x(s.key));return}try{await T("/games",{method:"POST",body:JSON.stringify({seconds:e,moves:t,levelKey:s.key,difficulty:s.difficulty,gridSize:`${s.rows}x${s.cols}`,maxTimeSeconds:s.maxTimeSeconds})}),await $()}catch(n){const o=n instanceof Error?n.message:"Unknown error";p.textContent=`Could not save score: ${o}`}}async function ke(){const{email:e,password:t}=te();if(!e||t.length<6){p.textContent="Enter a valid email and password (min 6 chars).";return}try{const n=await T("/auth/signup",{method:"POST",body:JSON.stringify({email:e,password:t})});y(n.token,n.user),d="user",v(),m(),await $()}catch(n){const o=n instanceof Error?n.message:"Unknown error";p.textContent=`Signup failed: ${o}`}}async function xe(){const{email:e,password:t}=te();if(!e||!t){p.textContent="Enter email and password.";return}try{const n=await T("/auth/login",{method:"POST",body:JSON.stringify({email:e,password:t})});y(n.token,n.user),d="user",v(),m(),await $()}catch(n){const o=n instanceof Error?n.message:"Unknown error";p.textContent=`Login failed: ${o}`}}function Te(){d="guest",y("",null),v(),m(),u(x(s.key))}function $e(){d="guest",y("",null),v(),m(),u(x(s.key))}async function Me(){if(!g){y("",null),v(),m(),u([]);return}try{const e=await T("/auth/me",{method:"GET"});y(g,e.user),d="user",v(),m(),await $()}catch{d="guest",y("",null),v(),m(),u(x(s.key))}}function Ie(){const e=R.find(t=>t.key===I.value);e&&(s=e,X(),m(),$())}re.addEventListener("click",()=>{window.location.reload()});G.addEventListener("click",Ee);j.addEventListener("click",()=>{ke()});z.addEventListener("click",()=>{xe()});Y.addEventListener("click",$e);Q.addEventListener("click",Te);I.addEventListener("change",Ie);he();Me();
