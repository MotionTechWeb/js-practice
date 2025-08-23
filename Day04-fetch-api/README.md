# 非同期通信

## 最小構成

Notion
https://www.notion.so/2580453cac29807a9ff2caee69f6055b


### AbortController()　について

AbortController は モダンブラウザ（Chrome, Edge, Safari, Firefox の最近のバージョン）なら全部対応済み です。  
  
``` js
const ac = new AbortController();  
const t = setTimeout(() => ac.abort(), timeout);
```

AbortController が「キャンセルするためのスイッチ」を作ります。  
  
ac.signal を fetch に渡しておくと…  
→ ac.abort() を呼んだ瞬間に fetch が強制的に中断されます。  
  
``` js
const ac = new AbortController(); // 中断スイッチを作る
```
AbortController は **「中断用リモコン」**みたいなものです。

その中に .signal という「電波（合図）」が入ってます。

``` js
ac.signal // ← これが「合図（シグナル）」
```
#### 2. fetch に signal を渡す
``` js
fetch(url, { signal: ac.signal });
```
こうすると 「この fetch は ac のリモコンで止められる」 という状態になります。

#### 3. 中断するとどうなる？
``` js
ac.abort(); // ← スイッチを押す
``` 
fetch が「キャンセルされました」という状態になり、

Promise が即座に エラーで reject されます。

その時のエラーは { name: "AbortError" } を持っています。


まだ何もしていない間は普通に通信が進みます。

``` js
const ac = new AbortController();
setTimeout(() => ac.abort(), 5000); // 5秒後に中断

try {
  const res = await fetch("https://httpbin.org/delay/10", { signal: ac.signal });
  // ↑ 10秒待つAPIにアクセス → 5秒で強制終了される
} catch (err) {
  if (err.name === "AbortError") {
    console.log("タイムアウトで中断されました");
  }
}
```


setTimeout で「指定した時間が経過したら abort()」を呼ぶようにしている。  
  
だから、サーバーから返事が無かったら「待ちすぎ！」と強制終了できるわけです。  