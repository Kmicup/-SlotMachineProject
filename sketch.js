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

function setup() {
  createCanvas(300, 500);  // 縦長のスマホ画面サイズに設定
  
  textSize(20);
  textAlign(CENTER, CENTER);
  
  // 初期のスロット内容を設定
  updateSlotItem();
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
  
  // スピンボタンとモード切り替えボタン
  fill(100);
  rect(width / 2 - 50, height - 80, 100, 30);  // スピンボタン
  fill(255);
  text("回す", width / 2, height - 65);
  
  fill(100);
  rect(width / 2 - 50, height - 120, 100, 30);  // モード切り替えボタン
  fill(255);
  text("モード", width / 2, height - 105);
  
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
  if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height - 80 && mouseY < height - 50) {
    if (!spinning) {
      spinning = true;
      spinCounter = 0;
    }
  }
  
  // モード切り替えボタンのクリック判定
  if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height - 120 && mouseY < height - 90) {
    mode = (mode + 1) % 2;  // モードを 0 -> 1 -> 0 と循環させる
    updateSlotItem();       // モードが切り替わったらスロット内容も更新
  }
}

// スロットのアイテムを現在のモードに合わせて更新する関数
function updateSlotItem() {
  let index = int(random(modeItems[mode].length));
  currentText = modeItems[mode][index];
}
