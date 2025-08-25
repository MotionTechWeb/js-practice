// 保存用のキー（この名前で localStorage に保存される）
const STORAGE_KEY = "day05-memo";

// DOM要素を取得して変数に入れておく
const textarea = document.querySelector("#memo");
const statusLabel = document.querySelector("#status");
const saveButton = document.querySelector("#save");
const clearButton = document.querySelector("#clear");

/**
 * メモを localStorage に保存する
 */
function saveMemo() {
  const text = textarea.value; // 入力された内容を取得
  localStorage.setItem(STORAGE_KEY, text); // localStorage に保存（文字列）
  statusLabel.textContent = "保存済み"; // 状態ラベルを更新
}

/**
 * 保存されたメモを読み込む（ページ初期表示時に実行）
 */
function loadMemo() {
  const saved = localStorage.getItem(STORAGE_KEY); // localStorage から取得
  if (saved !== null) {
    // 値が存在すれば復元
    textarea.value = saved;
    statusLabel.textContent = "保存済み";
  } else {
    statusLabel.textContent = "未保存";
  }
}

/**
 * 保存されたメモを削除する
 */
function clearMemo() {
  localStorage.removeItem(STORAGE_KEY); // localStorage から削除
  textarea.value = ""; // 入力欄を空にする
  statusLabel.textContent = "未保存"; // 状態ラベルを更新
}

// ---- イベントリスナーの設定 ----
saveButton.addEventListener("click", saveMemo); // 保存ボタン
clearButton.addEventListener("click", clearMemo); // 削除ボタン
window.addEventListener("DOMContentLoaded", loadMemo); // ページ読込時に復元
