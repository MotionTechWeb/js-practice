export async function fetchJson(url, {
  method = "GET",
  query,
  headers = {},
  body,
} = {}, timeout = 10000) {
  // URLにクエリを付ける (?key=value)
  const u = new URL(url, location.origin);
  if (query && typeof query === "object") {
    for (const [k, v] of Object.entries(query)) {
      if (v != null) u.searchParams.set(k, String(v));
    }
  }

  // JSONオブジェクトなら自動変換
  const finalHeaders = { ...headers };
  let bodyToSend = body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] ??= "application/json";
    bodyToSend = JSON.stringify(body);
  }

  // タイムアウト処理
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);

  let res;
  try {
    res = await fetch(u, { method, headers: finalHeaders, body: bodyToSend, signal: ac.signal });
  } catch (err) {
    clearTimeout(t);
    if (err.name === "AbortError") {
      throw { message: `タイムアウト (${timeout}ms)`, status: 0 };
    }
    throw { message: `通信エラー: ${err.message}`, status: 0 };
  }
  clearTimeout(t);

  // レスポンス本文
  const ct = res.headers.get("Content-Type") || "";
  const data = res.status === 204
    ? null
    : ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text();

  if (!res.ok) {
    throw {
      message: `HTTPエラー: ${res.status} ${res.statusText}`,
      status: res.status,
      body: data,
    };
  }

  return data;
}
