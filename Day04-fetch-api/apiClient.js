// 📌 独自のエラークラス
// fetch のエラー時に status や body も一緒に保持しておくと、UI やデバッグで便利
export class ApiError extends Error {
  constructor(message, { status, statusText, url, body }) {
    super(message);
    this.name = "ApiError";
    this.status = status; // HTTP ステータスコード（例: 404, 500）
    this.statusText = statusText; // ステータスの説明文字列
    this.url = url; // どの URL で失敗したか
    this.body = body; // サーバーから返ってきたエラーメッセージ(JSON or text)
  }
}

// 📌 API クライアントを生成する関数
// baseURL や共通の設定をまとめて管理する
export function createApiClient({
  baseURL,
  defaultHeaders = {},
  timeoutMs = 10_000, // デフォルト: 10秒でタイムアウト
  credentials = "same-origin", // Cookie を使う場合は "include" に変更
}) {
  // 実際のリクエスト処理
  async function request(
    path,
    { method = "GET", headers = {}, query, body } = {}
  ) {
    const url = new URL(path, baseURL);

    // 🔹 クエリパラメータを追加（?key=value）
    if (query && typeof query === "object") {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }

    // 🔹 タイムアウト制御（AbortController）
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);

    // 🔹 ヘッダーをまとめる
    const finalHeaders = { ...defaultHeaders, ...headers };
    let bodyToSend = body;

    // JSON オブジェクトを渡した場合は stringify して送る
    if (body && typeof body === "object" && !(body instanceof FormData)) {
      finalHeaders["Content-Type"] ??= "application/json";
      bodyToSend = JSON.stringify(body);
    }

    let res;
    try {
      // fetch 実行
      res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: bodyToSend,
        credentials,
        signal: ac.signal, // タイムアウト制御用
      });
    } catch (err) {
      clearTimeout(t);
      // 通信エラー or タイムアウト
      if (err.name === "AbortError") {
        throw new ApiError(`Request timeout after ${timeoutMs}ms`, {
          status: 0,
          statusText: "ABORTED",
          url: url.href,
          body: null,
        });
      }
      throw new ApiError(`Network error: ${err.message}`, {
        status: 0,
        statusText: "NETWORK",
        url: url.href,
        body: null,
      });
    } finally {
      clearTimeout(t);
    }

    // 🔹 レスポンスを JSON or text にパース
    const ct = res.headers.get("Content-Type") || "";
    let parsed = null;
    if (res.status !== 204) {
      // 204 = No Content
      if (ct.includes("application/json")) {
        try {
          parsed = await res.json();
        } catch {
          parsed = null; // JSON が壊れていたケース
        }
      } else {
        parsed = await res.text();
      }
    }

    // 🔹 エラーレスポンスなら ApiError を投げる
    if (!res.ok) {
      throw new ApiError(`HTTP ${res.status} ${res.statusText}`, {
        status: res.status,
        statusText: res.statusText,
        url: res.url,
        body: parsed,
      });
    }

    return parsed;
  }

  // 🔹 よく使う HTTP メソッドを薄いラッパで提供
  return {
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) =>
      request(path, { ...opts, method: "POST", body }),
    put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
    patch: (path, body, opts) =>
      request(path, { ...opts, method: "PATCH", body }),
    delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
    request, // もっと細かく制御したい場合用
  };
}
