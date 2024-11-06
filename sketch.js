let rectWidth = 200;
let rectHeight = 50;
let modeItems = [
  ["大きいボール", "中ボール2個", "鐘を鳴らしタイム", "ペナルティ選択", "投げる回数+1"],   // ご褒美モードの項目
  ["禁止マス", "全員ケンケン", "避け手の範囲拡大", "避ける範囲縮小", "一人動けない"] // ペナルティモードの項目
];
let currentText = "";  // スロット表示内容
let mode = 1;  // 初期値: 1 = ペナルティモード (0: ご褒美モード, 1: ペナルティモード)
let modeNames = ["ご褒美モード", "ペナルティモード"];
let spinning = false;
let spinDuration = 20; // スロットが回転するフレーム数
let spinCounter = 0;
let bellCount = 3; // 鈴の数の初期値
let sirenSound;  // サイレン音声用
let isSirenPlaying = false;  // サイレンが再生中かどうか

const threshold = 0.5; // 総合加速度の閾値を0.5に設定
let acceleration = { x: 0, y: 0, z: 0 }; // 加速度のデータ
let totalAccel = 0;  // 総合加速度

function preload() {
  // 音声ファイルの読み込み
  sirenSound = loadSound("宇宙基地サイレン.mp3");
}

function setup() {
  createCanvas(300, 500);  // 縦長のスマホ画面サイズに設定
  
  textSize(20);
  textAlign(CENTER, CENTER);
  
  // 初期のスロット内容を設定
  updateSlotItem();
  
  // 加速度センサーを有効にする
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener('devicemotion', (event) => {
          acceleration.x = event.acceleration.x || 0;
          acceleration.y = event.acceleration.y || 0;
          acceleration.z = event.acceleration.z || 0;
          
          // 総合加速度を計算
          totalAccel = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
          
          // 加速度が閾値を下回った場合に音を鳴らす
          if (totalAccel < threshold && !isSirenPlaying) {
            sirenSound.loop();  // サイレンをループ再生
            isSirenPlaying = true;
          } else if (totalAccel >= threshold && isSirenPlaying) {
            sirenSound.stop();  // サイレンを停止
            isSirenPlaying = false;
          }
        });
      } else {
        alert("加速度センサーへのアクセスが拒否されました。");
      }
    });
  } else {
    alert("このデバイスでは加速度センサーは利用できません。");
  }
}

function draw() {
  background(255);
  
  // 現在のモード名を一番上に表示
  fill(0);
  textSize(20);
  text("現在のモード: " + modeNames[mode], width / 2, 40);
  
  // スロットを中央に配置
  let x = width / 2 - rectWidth / 2;
  let y = height / 2 - rectHeight / 2;
  fill(200);
  rect(x, y, rectWidth, rectHeight);
  fill(0);
  textSize(24);
  text(currentText, x + rectWidth / 2, y + rectHeight / 2);
  
  // スピンボタンとモード切り替えボタン（少し右にずらす）
  fill(100);
  rect(width / 2 - 30, height - 80, 100, 30);  // スピンボタン
  fill(255);
  text("回す", width / 2 + 20, height - 65);
  
  fill(100);
  rect(width / 2 - 30, height - 120, 100, 30);  // モード切り替えボタン
  fill(255);
  text("モード", width / 2 + 20, height - 105);
  
  // 鈴の数表示（＋と−ボタンの上に配置）
  fill(0);
  textSize(16);
  text("鈴の数: " + bellCount, 55, height - 75);
  
  // 鈴の数増減ボタン
  fill(100);
  rect(10, height - 60, 30, 30);  // −ボタン
  rect(70, height - 60, 30, 30);  // ＋ボタン
  fill(255);
  text("-", 25, height - 45);
  text("+", 85, height - 45);
  
  // スロットが回転中であれば、ランダムに内容を変える
  if (spinning) {
    if (spinCounter < spinDuration) {
      updateSlotItem();
      spinCounter++;
    } else {
      spinning = false; // 回転を停止
    }
  }
}

function mousePressed() {
  // スピンボタンのクリック判定
  if (mouseX > width / 2 - 30 && mouseX < width / 2 + 70 && mouseY > height - 80 && mouseY < height - 50) {
    if (!spinning) {
      spinning = true;
      spinCounter = 0;
    }
  }
  
  // モード切り替えボタンのクリック判定
  if (mouseX > width / 2 - 30 && mouseX < width / 2 + 70 && mouseY > height - 120 && mouseY < height - 90) {
    mode = (mode + 1) % 2;  // モードを 0 -> 1 -> 0 と循環させる
    updateSlotItem();       // モードが切り替わったらスロット内容も更新
  }
  
  // 鈴の数増減ボタンのクリック判定
  if (mouseX > 10 && mouseX < 40 && mouseY > height - 60 && mouseY < height - 30) {
    bellCount = max(0, bellCount - 1);  // −ボタンを押すと減少（最低値は0）
  }
  if (mouseX > 70 && mouseX < 100 && mouseY > height - 60 && mouseY < height - 30) {
    bellCount++;  // ＋ボタンを押すと増加
  }
}

// スロットのアイテムを現在のモードに合わせて更新する関数
function updateSlotItem() {
  let index = int(random(modeItems[mode].length));
  currentText = modeItems[mode][index];
}
