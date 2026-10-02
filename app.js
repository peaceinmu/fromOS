// 以下 66 則為重新創作的繁體中文提示，不是 Oblique Strategies 原版卡片的完整翻譯。
// 每一則都刻意寫成可通用於繪畫、文學、設計、攝影、音樂、影像、工藝與其他創作形式。
const strategies = [
  "把注意力移到你一直忽略的地方。",
  "先拿走一個你最捨不得拿走的元素。",
  "把現在的問題當成材料，而不是障礙。",
  "只保留真正不可缺少的部分。",
  "把進行的速度降到原來的一半。",
  "換一種你平常不會選的方法或工具。",
  "讓空白、停頓或留白也成為作品的一部分。",
  "暫時不要修正那個意外。",
  "把最不起眼的部分放大。",
  "如果這只是第一步，下一步會是什麼？",
  "做一個與直覺相反的決定。",
  "把兩個毫不相關的元素放在一起。",
  "停止增加，改成減少。",
  "從邊緣開始，而不是從中心。",
  "試一次你平常會避開的比例或尺度。",
  "把一個偶然出現的特徵重複三次。",
  "只改變作品的節奏與間距，不改變核心內容。",
  "想像作品已經完成，再看現在多了什麼。",
  "把視線拉遠，只看整體的呼吸與關係。",
  "把視線靠近，只處理一個細節。",
  "保留一個不需要被解釋的部分。",
  "讓下一個決定由上一個痕跡、句子或動作產生。",
  "問自己：我是在修作品，還是在修自己的不安？",
  "在最確定的地方加入一點不確定。",
  "先不要追求漂亮，追求真實的感覺。",
  "把最安靜、最不起眼的地方變成主角。",
  "讓一個重複的元素逐漸產生變化。",
  "如果只能留下三個元素，你會選什麼？",
  "讓今天的狀態決定作品的速度與密度。",
  "把完成的標準暫時忘掉。",
  "換一種距離或角度重新看這件事。",
  "不要補滿，讓缺口繼續存在。",
  "從一個你原本想刪掉的地方重新開始。",
  "讓材料、文字或形式本身提示下一步。",
  "把最強烈的地方放輕一點。",
  "把最微弱的感覺再放大一些。",
  "今天只做一個清楚的決定。",
  "把原本的秩序打散，再觀察新的關係。",
  "問一個更小、更具體的問題。",
  "讓作品暫時停在未完成。",
  "改變環境、光線或觀看方式，再看一次。",
  "把你最熟悉的手法推遲到最後。",
  "接受一個你無法完全控制的結果。",
  "如果沒有任何人會看到，你會怎麼做？",
  "把一個限制當成新的規則。",
  "從最簡單的版本開始。",
  "把複雜的部分拆成兩個獨立問題。",
  "先完成一個粗略版本，再決定要保留什麼。",
  "找出作品裡最有生命力的一小部分。",
  "讓一個矛盾同時存在，不急著解決。",
  "用另一種順序重新安排現有元素。",
  "把第一個想到的答案暫時放到一旁。",
  "試著讓作品比原本更安靜。",
  "試著讓作品比原本更直接。",
  "將一個熟悉元素放到陌生的位置。",
  "把某個元素縮小到幾乎看不見。",
  "把某個元素放大到改變整體關係。",
  "只處理作品中最需要呼吸的地方。",
  "讓一個未完成的部分保留它的開放性。",
  "重新定義你此刻真正要解決的問題。",
  "把偶然留下來，再看看它會引出什麼。",
  "從作品最不平衡的地方開始觀察。",
  "把一個習慣性的選擇換成它的反面。",
  "暫時停止判斷，只記錄你真正看見或感受到的東西。",
  "問自己：如果更少，會不會反而更完整？",
  "讓最後一步比你原本預想的更簡單。"
];

const promptEl = document.getElementById("prompt");
const cardEl = document.getElementById("card");
const musicBtn = document.getElementById("musicBtn");
const speakerWave = document.getElementById("speakerWave");
const speakerSlash = document.getElementById("speakerSlash");

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

function revealCard() {
  currentIndex = pickNext();
  promptEl.textContent = strategies[currentIndex];
  revealed = true;
  cardEl.classList.add("is-flipped");
  cardEl.setAttribute("aria-pressed", "true");
  cardEl.setAttribute("aria-label", "訊息已顯示。再點一下回到牌面");
  if (!musicOn) startMusic();
}

function hideCard() {
  revealed = false;
  cardEl.classList.remove("is-flipped");
  cardEl.setAttribute("aria-pressed", "false");
  cardEl.setAttribute("aria-label", "點擊牌面隨機抽取另一則訊息");
}

function toggleCard() {
  if (revealed) hideCard();
  else revealCard();
}

cardEl.addEventListener("click", toggleCard);
cardEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleCard();
  }
});

// ===== 即時合成的療癒空靈環境音 =====
function ensureAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  audioCtx = new AC();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(audioCtx.destination);

  const freqs = [130.81, 164.81, 196.0];
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
  const notes = [523.25, 587.33, 659.25, 783.99, 880.0];
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

function updateSpeakerIcon() {
  // 有聲音時顯示正常喇叭；靜音時才顯示斜線。
  speakerWave.hidden = !musicOn;
  speakerSlash.hidden = musicOn;
  musicBtn.setAttribute("aria-pressed", musicOn ? "true" : "false");
  musicBtn.setAttribute("aria-label", musicOn ? "關閉背景音樂" : "開啟背景音樂");
  musicBtn.title = musicOn ? "關閉背景音樂" : "開啟背景音樂";
}

async function startMusic() {
  ensureAudio();
  if (!audioCtx || !masterGain) return;
  if (audioCtx.state === "suspended") await audioCtx.resume();

  musicOn = true;
  updateSpeakerIcon();

  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.exponentialRampToValueAtTime(0.72, now + 2.5);
  if (!chimeTimer) chimeTimer = window.setTimeout(playChime, 1700);
}

function stopMusic() {
  musicOn = false;
  updateSpeakerIcon();

  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  if (chimeTimer) {
    clearTimeout(chimeTimer);
    chimeTimer = null;
  }
}

musicBtn.addEventListener("click", async (event) => {
  event.stopPropagation();
  if (musicOn) stopMusic();
  else await startMusic();
});

updateSpeakerIcon();
