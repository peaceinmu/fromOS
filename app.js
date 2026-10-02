// 66 則重新創作的繁體中文提示，非原版卡片翻譯。
const strategies = [
  "把注意力移到你一直忽略的地方。",
  "先拿走一個你最捨不得拿走的元素。",
  "把現在的問題當成材料，而不是障礙。",
  "只保留真正不可缺少的部分。",
  "把進行的速度降到原來的一半。",
  "換一種你平常不會選的方法或工具。",
  "讓停頓或留白也成為作品的一部分。",
  "暫時不要修正那個意外。",
  "把最不起眼的部分放大。",
  "選擇看似平凡卻最適合的那個。",
  "做一個與直覺相反的決定。",
  "把兩個毫不相關的元素放在一起。",
  "停止增加，改成減少。",
  "從邊緣開始，而不是從中心。",
  "試一次你平常會特別避開的風格、比例或尺度。",
  "把一個偶然出現的特徵重複三次。",
  "只改變作品的節奏或溫度，不改變核心內容。",
  "想像作品已經完成，再看現在多了什麼。",
  "把視線拉遠，只看整體的平衡。",
  "把視線靠近，只處理一個細節。",
  "保留一個不需要被解釋的部分。",
  "順著前一個痕跡、句子或動作而決定下一步。",
  "問自己：我是在修作品，還是在修自己的不安？",
  "在最確定的地方加入一點不確定。",
  "先不要追求漂亮或完美，追求真實的感覺。",
  "把最安靜、最不起眼的地方變成主角。",
  "讓一個重複的元素逐漸產生變化。",
  "如果只能留下三個元素，你會選什麼？",
  "讓今天的身心狀態決定作品的表現。",
  "把完成的標準和原則暫時忘掉。",
  "換一種距離或角度重新看這件事。",
  "閉上眼，做三次深呼吸，並將注意力放在呼吸上。",
  "從一個你原本想刪掉的地方重新開始。",
  "視線離開作品，起身喝杯水或沖個澡。",
  "把最強烈的地方放輕一點。",
  "把最微弱的感覺再放大一些。",
  "今天只做一項決定。",
  "把原本的秩序打散，再觀察新的關係。",
  "問一個更具體的問題。",
  "讓作品暫時停在未完成。",
  "改變環境、光線或觀看的方式，再感受一次。",
  "把你最熟悉的手法推遲到最後。",
  "接受你無法控制的結果。",
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
  "將一個熟悉的元素放到陌生的位置。",
  "把某個元素縮小到幾乎看不見。",
  "把某個元素放大到改變整體關係。",
  "只處理作品中需要呼吸的部分。",
  "讓一個未完成的區塊保留它的開放性。",
  "重新定義你此刻真正要解決的問題。",
  "把剛淘汰的點子留下，再看看它會引出什麼。",
  "從作品最不平衡的地方開始觀察。",
  "把一個習慣性的選擇換成它的反面。",
  "暫時停止判斷，只記錄你真正看見或感受到的東西。",
  "問自己：如果更少，會不會反而更完整？",
  "簡化和收束。"
];

const promptEl = document.getElementById("prompt");
const cardEl = document.getElementById("card");
const musicBtn = document.getElementById("musicBtn");
const speakerWave = document.getElementById("speakerWave");

let revealed = false;


// =====================================================
// 抽牌
// =====================================================

let lastIndex = -1;
let drawPile = [];


/**
 * Fisher-Yates 洗牌
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [
      array[j],
      array[i]
    ];
  }

  return array;
}


/**
 * 重新建立完整的 66 張牌並洗牌
 */
function refillDrawPile() {

  drawPile = strategies.map(
    (_, index) => index
  );

  shuffleArray(drawPile);


  // 避免上一輪最後一張
  // 與新一輪第一張相同
  if (
    drawPile.length > 1 &&
    lastIndex !== -1 &&
    drawPile[drawPile.length - 1] === lastIndex
  ) {

    const swapIndex =
      Math.floor(
        Math.random() *
        (drawPile.length - 1)
      );

    [
      drawPile[drawPile.length - 1],
      drawPile[swapIndex]
    ] = [
      drawPile[swapIndex],
      drawPile[drawPile.length - 1]
    ];
  }
}


/**
 * 抽下一張
 *
 * 一輪 66 張之內不重複。
 * 全部抽完後才重新洗牌。
 */
function pickNext() {

  if (drawPile.length === 0) {
    refillDrawPile();
  }

  const next = drawPile.pop();

  lastIndex = next;

  return next;
}


// =====================================================
// 翻牌
// =====================================================

function revealCard() {

  promptEl.textContent =
    strategies[pickNext()];

  revealed = true;

  cardEl.classList.add("is-flipped");

  cardEl.setAttribute(
    "aria-pressed",
    "true"
  );

  cardEl.setAttribute(
    "aria-label",
    "訊息已顯示。再點一下回到牌面"
  );
}


function hideCard() {

  revealed = false;

  cardEl.classList.remove("is-flipped");

  cardEl.setAttribute(
    "aria-pressed",
    "false"
  );

  cardEl.setAttribute(
    "aria-label",
    "點擊牌面隨機抽取另一則訊息"
  );
}


function toggleCard() {

  if (revealed) {
    hideCard();
  } else {
    revealCard();
  }
}


// 翻牌只控制牌。
// 完全不控制音樂。
cardEl.addEventListener(
  "click",
  toggleCard
);


cardEl.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      if (!event.repeat) {
        toggleCard();
      }
    }
  }
);


// =====================================================
// 背景音樂
// =====================================================

let audioCtx = null;
let masterGain = null;

let musicOn = false;

// 網站一開始固定為靜音。
let userMuted = true;

let chimeTimer = null;
let padNodes = [];


// =====================================================
// 喇叭圖示
// =====================================================

function updateSpeakerIcon() {

  // 靜音時拿掉聲波。
  if (speakerWave) {
    speakerWave.style.display =
      userMuted ? "none" : "";
  }


  // CSS 的 .is-muted
  // 會顯示喇叭斜線。
  musicBtn.classList.toggle(
    "is-muted",
    userMuted
  );


  musicBtn.setAttribute(
    "aria-pressed",
    userMuted ? "false" : "true"
  );


  const label =
    userMuted
      ? "開啟背景音樂"
      : "關閉背景音樂";


  musicBtn.setAttribute(
    "aria-label",
    label
  );

  musicBtn.title = label;
}


// =====================================================
// 計時器
// =====================================================

function clearChimeTimer() {

  if (chimeTimer !== null) {

    window.clearTimeout(
      chimeTimer
    );

    chimeTimer = null;
  }
}


// =====================================================
// 建立音訊
// =====================================================

function ensureAudio() {

  if (audioCtx) {
    return true;
  }


  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;


  if (!AudioContextClass) {
    return false;
  }


  audioCtx =
    new AudioContextClass();


  masterGain =
    audioCtx.createGain();


  // 建立時先完全靜音。
  masterGain.gain.value = 0;

  masterGain.connect(
    audioCtx.destination
  );


  const frequencies = [
    130.81,
    164.81,
    196.0
  ];


  frequencies.forEach(
    (frequency, index) => {

      const oscillator =
        audioCtx.createOscillator();

      const gain =
        audioCtx.createGain();

      const lfo =
        audioCtx.createOscillator();

      const lfoGain =
        audioCtx.createGain();


      oscillator.type =
        index === 1
          ? "sine"
          : "triangle";


      oscillator.frequency.value =
        frequency;


      gain.gain.value =
        index === 0
          ? 0.030
          : 0.016;


      lfo.type = "sine";

      lfo.frequency.value =
        0.035 +
        index * 0.011;


      lfoGain.gain.value =
        0.006;


      lfo.connect(
        lfoGain
      );

      lfoGain.connect(
        gain.gain
      );


      oscillator.connect(
        gain
      );

      gain.connect(
        masterGain
      );


      oscillator.start();

      lfo.start();


      padNodes.push(
        oscillator,
        gain,
        lfo,
        lfoGain
      );
    }
  );


  return true;
}


// =====================================================
// 空靈音效
// =====================================================

function playChime() {

  chimeTimer = null;


  if (
    !audioCtx ||
    audioCtx.state !== "running" ||
    !musicOn ||
    userMuted
  ) {
    return;
  }


  const now =
    audioCtx.currentTime;


  const notes = [
    523.25,
    587.33,
    659.25,
    783.99,
    880.0
  ];


  const frequency =
    notes[
      Math.floor(
        Math.random() *
        notes.length
      )
    ];


  const oscillator =
    audioCtx.createOscillator();

  const gain =
    audioCtx.createGain();

  const filter =
    audioCtx.createBiquadFilter();


  oscillator.type = "sine";


  oscillator.frequency.setValueAtTime(
    frequency,
    now
  );


  filter.type = "lowpass";

  filter.frequency.value =
    1800;


  gain.gain.setValueAtTime(
    0.0001,
    now
  );


  gain.gain.exponentialRampToValueAtTime(
    0.018,
    now + 0.05
  );


  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 4.8
  );


  oscillator.connect(
    filter
  );

  filter.connect(
    gain
  );

  gain.connect(
    masterGain
  );


  oscillator.onended = () => {

    oscillator.disconnect();

    filter.disconnect();

    gain.disconnect();
  };


  oscillator.start(
    now
  );


  oscillator.stop(
    now + 5
  );


  chimeTimer =
    window.setTimeout(
      playChime,
      5500 +
        Math.random() *
        4500
    );
}


// =====================================================
// 開啟音樂
// =====================================================

async function startMusic() {

  // 只有喇叭按鈕取消靜音後
  // 才允許真正播放。
  if (userMuted) {
    return false;
  }


  try {

    if (!ensureAudio()) {
      return false;
    }


    if (
      audioCtx.state !== "running"
    ) {
      await audioCtx.resume();
    }


    // 等待 resume 期間
    // 使用者可能再次按了靜音。
    if (userMuted) {
      return false;
    }


    musicOn = true;


    const now =
      audioCtx.currentTime;


    masterGain.gain.cancelScheduledValues(
      now
    );


    masterGain.gain.setValueAtTime(
      Math.max(
        masterGain.gain.value,
        0.0001
      ),
      now
    );


    masterGain.gain.exponentialRampToValueAtTime(
      0.72,
      now + 2.5
    );


    if (chimeTimer === null) {

      chimeTimer =
        window.setTimeout(
          playChime,
          1700
        );
    }


    return true;

  } catch (error) {

    return false;
  }
}


// =====================================================
// 靜音
// =====================================================

function stopMusic() {

  userMuted = true;

  musicOn = false;


  clearChimeTimer();

  updateSpeakerIcon();


  if (
    !audioCtx ||
    !masterGain
  ) {
    return;
  }


  const now =
    audioCtx.currentTime;


  masterGain.gain.cancelScheduledValues(
    now
  );


  // 立即靜音。
  masterGain.gain.setValueAtTime(
    0,
    now
  );
}


// =====================================================
// 喇叭按鈕
// =====================================================

musicBtn.addEventListener(
  "click",
  async (event) => {

    event.stopPropagation();


    if (userMuted) {

      // 使用者主動開啟聲音。
      userMuted = false;

      updateSpeakerIcon();

      await startMusic();

    } else {

      // 使用者主動靜音。
      stopMusic();
    }
  }
);


// =====================================================
// 初始化
// =====================================================

// 建立第一輪 66 張牌。
refillDrawPile();


// 一進網站固定靜音。
// 不建立 AudioContext，
// 不嘗試自動播放。
userMuted = true;
musicOn = false;

updateSpeakerIcon();
