let rectWidth = 200;
let rectHeight = 50;
let modeItems = [
  ["大きいボール", "中ボール2個", "鐘を鳴らしタイム", "ペナルティ選択", "投げる回数+1"],  // ご褒美モードの項目
  ["禁止マス", "全員ケンケン", "避け手の範囲拡大", "避ける範囲縮小", "一人動けない"] // ペナルティモードの項目
];
let currentText = "";  // スロット表示内容
let mode = 1;  // 初期値: 1 = ペナルティモード (0: ご褒美モード, 1: ペナルティモード)
let modeNames = ["スロットモード", "加速度センサーモード"];
let slotSpinning = false;
let spinDuration = 20; // スロットが回転するフレーム数
let spinCounter = 0;
let threshold = 0.5; // 加速度の閾値
let audio;
let accelerometerEnabled = false; // 加速度センサーの有効/無効フラグ

function preload() {
  audio = loadSound("宇宙基地サイレン.mp3");
}

function setup() {
  createCanvas(300, 500); // 縦長のスマホ画面サイズに設定
  textSize(20);
  textAlign(CENTER, CENTER);
  updateSlotItem();

  // 加速度センサーのリスナーをセットアップ
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener('devicemotion', handleMotion);
        accelerometerEnabled = true;
      }
    });
  } else {
    window.addEventListener('devicemotion', handleMotion);
    accelerometerEnabled = true;
  }
}

function draw() {
  background(255);

  // 現在のモード名を表示
  fill(0);
  textSize(20);
  text("現在のモード: " + modeNames[mode], width / 2, 40);

  // モードに応じた画面表示
  if (mode === 0) {  // スロットモード
    drawSlot();
  } else {  // 加速度センサーモード
    drawAccelerometer();
  }
}

function drawSlot() {
  let x = width / 2 - rectWidth / 2;
  let y = height / 2 - rectHeight / 2;
  
  // スロット表示
  fill(200);
  rect(x, y, rectWidth, rectHeight);
  fill(0);
  textSize(24);
  text(currentText, x + rectWidth / 2, y + rectHeight / 2);

  // スピンボタンとモード切り替えボタン
  fill(100);
  rect(width / 2 - 50, height - 80, 100, 30);
  fill(255);
  text("回す", width / 2, height - 65);
  fill(100);
  rect(width / 2 - 50, height - 120, 100, 30);
  fill(255);
  text("モード", width / 2, height - 105);

  // スロット回転中
  if (slotSpinning) {
    if (spinCounter < spinDuration) {
      updateSlotItem();
      spinCounter++;
    } else {
      slotSpinning = false;
    }
  }
}

function drawAccelerometer() {
  fill(0);
  textSize(18);
  text("スマホを動かして\n加速度が閾値を下回ると音が鳴ります。", width / 2, height / 2);

  // モード切り替えボタン
  fill(100);
  rect(width / 2 - 50, height - 80, 100, 30);
  fill(255);
  text("モード", width / 2, height - 65);
}

function mousePressed() {
  // スロットモード時のスピンボタン
  if (mode === 0 && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height - 80 && mouseY < height - 50) {
    if (!slotSpinning) {
      slotSpinning = true;
      spinCounter = 0;
    }
  }

  // モード切り替えボタン
  if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height - 120 && mouseY < height - 90) {
    mode = (mode + 1) % 2;
    if (mode === 0) {
      slotSpinning = false;
      updateSlotItem();
    }
  }
}

// スロットのアイテムを現在のモードに合わせて更新する関数
function updateSlotItem() {
  let index = int(random(modeItems[mode].length));
  currentText = modeItems[mode][index];
}

// 加速度センサーのデータを処理
function handleMotion(event) {
  if (mode === 1) {  // 加速度センサーモードでのみ処理
    const acceleration = event.acceleration;
    if (acceleration) {
      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;
      const totalAccel = Math.sqrt(x * x + y * y + z * z);

      // 閾値以下なら音声を再生
      if (totalAccel < threshold && !audio.isPlaying()) {
        audio.loop();
      } else if (totalAccel >= threshold && audio.isPlaying()) {
        audio.stop();
      }
    }
  }
}
