// スコアとクリック回数を初期化
let score = 0;
let clickCount = 0;

// スコアを表示する要素を取得
const scoreElement = document.getElementById('score');

// クリックボタンの要素を取得
const clickButton = document.getElementById('clickButton');

// アップグレードのデータを定義
const upgrades = [
  {
    name: 'クリック強化',
    cost: 10,
    baseCost: 10, // 初期コストを保存
    effect: 1,
    owned: 0,
  },
  {
    name: '自動クリック',
    cost: 100,
    baseCost: 100, // 初期コストを保存
    effect: 1,
    owned: 0,
  },
];

// アップグレードを表示する要素を取得
const upgradesElement = document.getElementById('upgrades');

// メッセージを表示する要素を取得
const messageElement = document.getElementById('message');

// アップグレードを表示
function displayUpgrades() {
  upgradesElement.innerHTML = '';
  upgrades.forEach((upgrade, index) => {
    const costSpan = document.createElement('span');
    costSpan.textContent = upgrade.cost;
    const purchaseButton = document.createElement('button');
    purchaseButton.id = `upgrade${index}`;
    purchaseButton.textContent = '購入';
    const upgradeDiv = document.createElement('div');
    upgradeDiv.textContent = `${upgrade.name} (コスト: `;
    upgradeDiv.appendChild(costSpan);
    upgradeDiv.appendChild(purchaseButton);
    upgradesElement.appendChild(upgradeDiv);

    // 購入ボタンのイベントリスナーを追加
    purchaseButton.addEventListener('click', () => {
      if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost *= 1.5; // コストを1.5倍にする
        scoreElement.textContent = score;
        displayUpgrades();
        messageElement.textContent = ''; // メッセージをクリア
      } else {
        messageElement.textContent = 'スコアが足りません！';
        setTimeout(() => {
          messageElement.textContent = ''; // メッセージをクリア
        }, 3000); // 3秒後にメッセージをクリア
      }
    });
  });
}

// アップグレードを表示
displayUpgrades();

// クリックイベントを処理
clickButton.addEventListener('click', () => {
  let clickScore = 1;
  upgrades.forEach(upgrade => {
    if (upgrade.name === 'クリック強化') {
      clickScore += upgrade.effect * upgrade.owned;
    }
  });
  score += clickScore;
  clickCount++;
  scoreElement.textContent = score;
});

// 自動クリック処理
setInterval(() => {
  let autoClickScore = 0;
  upgrades.forEach(upgrade => {
    if (upgrade.name === '自動クリック') {
      autoClickScore += upgrade.effect * upgrade.owned;
    }
  });
  score += autoClickScore;
  scoreElement.textContent = score;
}, 1000); // 1秒ごとに実行

// セーブデータを取得する関数
function getSaveData() {
  return {
    score: score,
    clickCount: clickCount,
    upgrades: upgrades.map(upgrade => ({
      name: upgrade.name,
      cost: upgrade.cost,
      owned: upgrade.owned,
    })),
  };
}

// セーブデータを保存する関数
function saveGame() {
  const saveData = getSaveData();
  localStorage.setItem('clickerGameSave', JSON.stringify(saveData));
}

// セーブデータを読み込む関数
function loadGame() {
  const saveData = localStorage.getItem('clickerGameSave');
  if (saveData) {
    const parsedSaveData = JSON.parse(saveData);
    score = parsedSaveData.score;
    clickCount = parsedSaveData.clickCount;
    parsedSaveData.upgrades.forEach(savedUpgrade => {
      const upgrade = upgrades.find(u => u.name === savedUpgrade.name);
      if (upgrade) {
        upgrade.cost = savedUpgrade.cost;
        upgrade.owned = savedUpgrade.owned;
      }
    });
    scoreElement.textContent = score;
    displayUpgrades();
  } else {
    resetGame();
  }
}

// セーブデータをリセットする関数
function resetGame() {
  localStorage.removeItem('clickerGameSave');
  score = 0;
  clickCount = 0;
  upgrades.forEach(upgrade => {
    upgrade.cost = upgrade.baseCost;
    upgrade.owned = 0;
  });
  scoreElement.textContent = score;
  displayUpgrades();
}

// ゲームの開始時にセーブデータを読み込む
loadGame();

// 定期的にセーブデータを保存
setInterval(saveGame, 5000); // 5秒ごとにセーブ