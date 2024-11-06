let rectWidth = 300; // スロットの横幅
let rectHeight = 100; // スロットの縦幅
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

function setup() {
  createCanvas(windowWidth, windowHeight);  // キャンバスサイズを画面全体に合わせる
  textSize(24);  // 文字サイズを大きく
  textAlign(CENTER, CENTER);
  
  // 初期のスロット内容を設定
  updateSlotItem();
}

function draw() {
  background(255);
  
  // 画面中央にすべてを配置するために、中央の位置を計算
  let centerX = width / 2;
  let centerY = height / 2;
  
  // 現在のモード名を中央に表示
  fill(0);
  textSize(20);
  text("現在のモード: " + modeNames[mode], centerX, centerY - 200);
  
  // スロットを中央に配置
  let x = centerX - rectWidth / 2;
  let y = centerY - rectHeight / 2;
  fill(200);
  rect(x, y, rectWidth, rectHeight);
  fill(0);
  textSize(24);
  text(currentText, x + rectWidth / 2, y + rectHeight / 2);
  
  // スピンボタンを中央下に配置
  fill(100);
  rect(centerX - 50, centerY + 80, 100, 30);  // スピンボタン
  fill(255);
  text("回す", centerX, centerY + 95);
  
  // モード切り替えボタンをその下に配置
  fill(100);
  rect(centerX - 50, centerY + 120, 100, 30);  // モード切り替えボタン
  fill(255);
  text("モード", centerX, centerY + 135);
  
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
  if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 80 && mouseY < height / 2 + 110) {
    if (!spinning) {
      spinning = true;
      spinCounter = 0;
    }
  }
  
  // モード切り替えボタンのクリック判定
  if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 120 && mouseY < height / 2 + 150) {
    mode = (mode + 1) % 2;  // モードを 0 -> 1 -> 0 と循環させる
    updateSlotItem();       // モードが切り替わったらスロット内容も更新
  }
}

// スロットのアイテムを現在のモードに合わせて更新する関数
function updateSlotItem() {
  let index = int(random(modeItems[mode].length));
  currentText = modeItems[mode][index];
}
