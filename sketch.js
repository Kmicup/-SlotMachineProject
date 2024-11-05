let rectWidth = 200;
let rectHeight = 50;
let modeItems = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"],  // 禁止マスモードの項目
  ["大きいボール", "ボール2個", "鐘を鳴らす"],   // ご褒美モードの項目
  ["全員走る", "全員ケンケン", "避け手の範囲拡大", "四つん這い"] // ペナルティモードの項目
];
let currentTexts = ["", "", ""];
let mode = 0;  // 0: 禁止マスモード, 1: ご褒美モード, 2: ペナルティモード
let modeNames = ["禁止マスモード", "ご褒美モード", "ペナルティモード"];
let spinning = false;
let spinDuration = 20; // スロットが回転するフレーム数
let spinCounter = 0;

function setup() {
  createCanvas(300, 500);  // 縦長のスマホ画面サイズに設定
  
  textSize(20);
  textAlign(CENTER, CENTER);
  
  // 初期の文字を設定
  updateSlotItems();
}

function draw() {
  background(255);
  
  // 現在のモード名を一番上に表示
  fill(0);
  textSize(20);
  text("現在のモード: " + modeNames[mode], width / 2, 40);
  
  // スロットを中央に配置
  if (mode == 0) {
    // 禁止マスモードのときは3つのスロットを表示
    for (let i = 0; i < currentTexts.length; i++) {
      let x = width / 2 - rectWidth / 2;
      let y = height / 3 - rectHeight / 2 + i * (rectHeight + 20);
      fill(200);
      rect(x, y, rectWidth, rectHeight);
      fill(0);
      textSize(24);
      text(currentTexts[i], x + rectWidth / 2, y + rectHeight / 2);
    }
  } else {
    // ご褒美モードとペナルティモードのときは1つのスロットのみ表示
    let x = width / 2 - rectWidth / 2;
    let y = height / 2 - rectHeight / 2;
    fill(200);
    rect(x, y, rectWidth, rectHeight);
    fill(0);
    textSize(24);
    text(currentTexts[0], x + rectWidth / 2, y + rectHeight / 2);
  }
  
  // スピンボタンとモード切り替えボタン
  fill(100);
  rect(width / 2 - 50, height - 80, 100, 30);  // スピンボタン
  fill(255);
  text("Spin", width / 2, height - 65);
  
  fill(100);
  rect(width / 2 - 50, height - 120, 100, 30);  // モード切り替えボタン
  fill(255);
  text("Mode", width / 2, height - 105);
  
  // スロットが回転中であれば、ランダムに内容を変える
  if (spinning) {
    if (spinCounter < spinDuration) {
      updateSlotItems();
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
    mode = (mode + 1) % 3;  // モードを 0 -> 1 -> 2 -> 0 と循環させる
    updateSlotItems();      // モードが切り替わったらスロット内容も更新
  }
}

// スロットのアイテムを現在のモードに合わせて更新する関数
function updateSlotItems() {
  if (mode == 0) {
    // 禁止マスモードのときは3つのスロットすべてに値を設定
    for (let i = 0; i < currentTexts.length; i++) {
      currentTexts[i] = randomText();
    }
  } else {
    // ご褒美モードとペナルティモードのときは1つのスロットのみ表示
    currentTexts[0] = randomText();
  }
}

// 現在のモードに応じてランダムなテキストを選ぶ関数
function randomText() {
  let index = int(random(modeItems[mode].length));
  return modeItems[mode][index];
}
