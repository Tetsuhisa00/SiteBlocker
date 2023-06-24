// タブの更新を監視するイベントリスナーを登録する
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // タブが更新された場合、新しいURLを取得する
  const url = changeInfo.url || tab.url;
  
  // ブロックリストにURLが含まれているかをチェックする
  var blockedList = getBlockedList(); // ブロックリストをlocalStorageから取得
  if (blockedList.some(site => url.includes(site))) {
    // ブロックされたページにアクセスしようとした場合の処理をここに記述する
    if (url !== "chrome://newtab/") {
      chrome.tabs.update(tabId, { url: "chrome://newtab/" });
    }
  }
});


// ポップアップウィンドウが開かれた時に実行される処理
document.addEventListener('DOMContentLoaded', function() {
  // ブロックリストの表示
  displayBlockedList();

  // 追加ボタンのクリックイベントリスナー
  document.getElementById('addButton').addEventListener('click', function() {
    // ブロックリストにサイトを追加
    addSiteToBlockedList();
    // ブロックリストの表示を更新
    displayBlockedList();
  });

  // 削除ボタンのクリックイベントリスナー
  document.getElementById('blockedList').addEventListener('click', function(event) {
    // 削除ボタンがクリックされた場合のみ処理を実行
    if (event.target.classList.contains('deleteButton')) {
      // クリックされた行を取得
      var row = event.target.parentNode;
      // ブロックリストからサイトを削除
      removeSiteFromBlockedList(row);
      // ブロックリストの表示を更新
      displayBlockedList();
    }
  });
});

// ブロックリストの表示を更新する関数
function displayBlockedList() {
  // ブロックリストの要素を取得
  var blockedListElement = document.getElementById('blockedList');
  // ブロックリストを取得
  var blockedList = getBlockedList();

  // ブロックリストをクリア
  blockedListElement.innerHTML = '';

  // ブロックリストの各サイトに対して行を作成して追加
  blockedList.forEach(function(site) {
    var row = createRow(site);
    blockedListElement.appendChild(row);
  });
}

// ブロックリストにサイトを追加する関数
function addSiteToBlockedList() {
  var siteInput = document.getElementById('siteInput');
  var site = siteInput.value.trim();

  if (site !== '') {
    // ブロックリストにサイトを追加
    var blockedList = getBlockedList();
    blockedList.push(site);
    saveBlockedList(blockedList);

    // 入力欄をクリア
    siteInput.value = '';
  }
}

// ブロックリストからサイトを削除する関数
function removeSiteFromBlockedList(row) {
  var siteElement = row.querySelector('.site');
  var site = siteElement.textContent;

  // ブロックリストからサイトを削除
  var blockedList = getBlockedList();
  var index = blockedList.indexOf(site);
  if (index > -1) {
    blockedList.splice(index, 1);
    saveBlockedList(blockedList);
  }
}

// ブロックリストを取得する関数
function getBlockedList() {
  var blockedList = localStorage.getItem('blockedList');
  return blockedList ? JSON.parse(blockedList) : [];
}

// ブロックリストを保存する関数
function saveBlockedList(blockedList) {
  localStorage.setItem('blockedList', JSON.stringify(blockedList));
}

// 行要素を作成する関数
function createRow(site) {
  var row = document.createElement('div');
  row.classList.add('row');

  var siteElement = document.createElement('span');
  siteElement.classList.add('site');
  siteElement.textContent = site;

  var deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteButton');
  deleteButton.textContent = '削除';

  row.appendChild(siteElement);
  row.appendChild(deleteButton);

  return row;
}
