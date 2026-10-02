// 以下 44 則為重新創作的繁體中文提示，不是 Oblique Strategies 原版卡片的完整翻譯。
const strategies = [
  "把注意力移到你一直忽略的地方。",
  "先拿走一個你最捨不得拿走的元素。",
  "把現在的問題當成材料，而不是障礙。",
  "只保留真正不可缺少的部分。",
  "把速度降到原來的一半。",
  "換一個你平常不會選的工具。",
  "讓空白也成為作品的一部分。",
  "暫時不要修正那個意外。",
  "把最不起眼的部分放大。",
  "如果這只是第一步，下一步會是什麼？",
  "做一個與直覺相反的決定。",
  "把兩個毫不相關的元素放在一起。",
  "停止增加，改成減少。",
  "從邊緣開始，而不是從中心。",
  "試一次你平常會避開的比例。",
  "把一個偶然出現的痕跡重複三次。",
  "只改變節奏，不改變內容。",
  "想像作品已經完成，再看現在多了什麼。",
  "把視線拉遠，只看整體的呼吸。",
  "把視線靠近，只處理一個細節。",
  "保留一個不需要被解釋的部分。",
  "讓下一個決定由前一個痕跡產生。",
  "問自己：我是在修作品，還是在修自己的不安？",
  "在最確定的地方加入一點不確定。",
  "先不要追求漂亮，追求真實的感覺。",
  "把最安靜的地方變成主角。",
  "讓一個重複的動作慢慢產生變化。",
  "如果只能留下三個元素，你會選什麼？",
  "讓今天的狀態決定作品的速度。",
  "把完成的標準暫時忘掉。",
  "用另一種距離重新看這件事。",
  "不要補滿，讓缺口繼續存在。",
  "從一個你原本想刪掉的地方重新開始。",
  "讓材質自己決定下一步。",
  "把最強烈的地方放輕一點。",
  "把最微弱的感覺再放大一些。",
  "今天只做一個清楚的決定。",
  "把秩序打散，再觀察新的關係。",
  "問一個更小、更具體的問題。",
  "讓作品暫時停在未完成。",
  "換一種光線，再看一次。",
  "把你最熟悉的手法推遲到最後。",
  "接受一個你無法完全控制的結果。",
  "如果沒有任何人會看到，你會怎麼做？"
];

const promptEl = document.getElementById("prompt");
const cardEl = document.getElementById("card");
const nextBtn = document.getElementById("nextBtn");
const counterEl = document.getElementById("counter");
const aboutBtn = document.getElementById("aboutBtn");
const aboutPanel = document.getElementById("aboutPanel");
const closeAbout = document.getElementById("closeAbout");
const musicBtn = document.getElementById("musicBtn");

let currentIndex = -1;
let lastIndex = -1;
let revealed = false;
let audioCtx = null;
let masterGain = null;
let musicOn = false;
let chimeTimer = null;
let padNodes = [];

function pickNext() {
  if (strategies.length < 2) return 0;
  let next;
  do {
    next = Math.floor(Math.random() * strategies.length);
  } while (next === lastIndex);
  lastIndex = next;
  return next;
}

function prepareNextCard() {
  currentIndex = pickNext();
  promptEl.textContent = strategies[currentIndex];
  revealed = false;
  cardEl.classList.remove("is-flipped");
  cardEl.setAttribute("aria-pressed", "false");
  cardEl.setAttribute("aria-label", "點擊牌面翻牌查看訊息");
  counterEl.textContent = `44 張創作卡`;
}

function revealCard() {
  if (revealed) return;
  if (currentIndex < 0) currentIndex = pickNext();
  promptEl.textContent = strategies[currentIndex];
  revealed = true;
  cardEl.classList.add("is-flipped");
  cardEl.setAttribute("aria-pressed", "true");
  cardEl.setAttribute("aria-label", "已翻開。按下一張可重新抽牌");
  counterEl.textContent = `${currentIndex + 1} / ${strategies.length}`;
  // 瀏覽器禁止未互動自動播放；第一次翻牌時啟動背景音樂。
  if (!musicOn) startMusic();
}

cardEl.addEventListener("click", revealCard);
nextBtn.addEventListener("click", prepareNextCard);
cardEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    revealCard();
  }
});

function openAbout() {
  aboutPanel.hidden = false;
  aboutBtn.setAttribute("aria-expanded", "true");
}
function closeAboutPanel() {
  aboutPanel.hidden = true;
  aboutBtn.setAttribute("aria-expanded", "false");
}
aboutBtn.addEventListener("click", openAbout);
closeAbout.addEventListener("click", closeAboutPanel);
aboutPanel.addEventListener("click", (e) => {
  if (e.target === aboutPanel) closeAboutPanel();
});

// ===== 即時合成的療癒空靈環境音 =====
// 不使用外部音樂檔，因此不會有第三方音樂授權或路徑問題。
function ensureAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(audioCtx.destination);

  const freqs = [130.81, 164.81, 196.00]; // C3, E3, G3
  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();

    osc.type = i === 1 ? "sine" : "triangle";
    osc.frequency.value = freq;
    gain.gain.value = i === 0 ? 0.030 : 0.016;
    lfo.type = "sine";
    lfo.frequency.value = 0.035 + i * 0.011;
    lfoGain.gain.value = 0.006;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    lfo.start();
    padNodes.push(osc, gain, lfo, lfoGain);
  });
}

function playChime() {
  if (!audioCtx || !musicOn) return;
  const now = audioCtx.currentTime;
  const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
  const freq = notes[Math.floor(Math.random() * notes.length)];

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);
  filter.type = "lowpass";
  filter.frequency.value = 1800;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.018, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 5);

  const nextDelay = 5500 + Math.random() * 4500;
  chimeTimer = window.setTimeout(playChime, nextDelay);
}

async function startMusic() {
  ensureAudio();
  if (!audioCtx || !masterGain) return;
  if (audioCtx.state === "suspended") await audioCtx.resume();
  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.exponentialRampToValueAtTime(0.48, now + 2.5);
  musicOn = true;
  musicBtn.textContent = "音樂：開";
  musicBtn.setAttribute("aria-pressed", "true");
  if (!chimeTimer) chimeTimer = window.setTimeout(playChime, 1700);
}

function stopMusic() {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
  musicOn = false;
  musicBtn.textContent = "音樂：關";
  musicBtn.setAttribute("aria-pressed", "false");
  if (chimeTimer) {
    clearTimeout(chimeTimer);
    chimeTimer = null;
  }
}

musicBtn.addEventListener("click", async () => {
  if (musicOn) stopMusic();
  else await startMusic();
});

prepareNextCard();
