// 1. API のURLを指定（例: JSONPlaceholder のダミーデータを使う）
const url = "https://jsonplaceholder.typicode.com/posts/1";
async function fetchPost() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTPエラー: ${res.status}`);
  }
  return res.json(); // データを返すだけにする
}

(async () => {
  try {
    const data = await fetchPost();
    console.log("取得成功:", data);
    // HTMLに表示するときはここで処理
    document.body.innerHTML = `<h1>${data.title}</h1><p>${data.body}</p>`;
  } catch (e) {
    console.error("データ取得に失敗:", e);
  }
})();
