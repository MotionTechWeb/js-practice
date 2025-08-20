// src/main.js
import { createApiClient } from "./apiClient.js";

// 📌 baseURL をまとめる
const api = createApiClient({
  baseURL: "https://jsonplaceholder.typicode.com/",
  timeoutMs: 8000,
});

(async () => {
  try {
    // 🔹 GETリクエスト（クエリで5件だけ取得）
    const posts = await api.get("/posts", { query: { _limit: 5 } });
    console.log("posts:", posts);

    // 🔹 POSTリクエスト（新しい記事を作成）
    const created = await api.post("/posts", {
      title: "hello",
      body: "world",
      userId: 1,
    });
    console.log("created:", created);

    // 🔹 HTMLに反映
    document.body.innerHTML = `
      <h1>Latest Posts</h1>
      <ul>${posts
        .map((p) => `<li><strong>${p.title}</strong></li>`)
        .join("")}</ul>
    `;
  } catch (e) {
    // 🔹 エラー時の処理（UIにも表示）
    console.error(e);
    document.body.innerHTML = `
      <p style="color:red">エラー: ${e.message}</p>
      ${e.status ? `<p>status: ${e.status}</p>` : ""}
    `;
  }
})();
