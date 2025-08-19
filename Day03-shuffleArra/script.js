(function () {
  "use strict";

  // TODO: shuffle 関数を実装してください。
  // - 引数: array
  // - 仕様:
  //   1) array を非破壊で処理すること
  //   2) 要素をランダムに並び替える
  //   3) 長さ 0 または 1 のときはそのまま返す
  // - 戻り値: 新しい配列（シャッフル後）

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
    }
    return arr;
  }

  const users = [
    { name: "Taro", age: 20 },
    { name: "Jiro", age: 21 },
    { name: "Hanako", age: 20 },
    { name: "NoName" },
  ];
  //
  // // 例1: 文字列キーでグルーピング
  // // 期待: { "20": [Taro, Hanako], "21": [Jiro], "undefined": [NoName] }

  console.log("元配列", users);
  const shuffled = shuffle(users);
  console.log("シャッフル結果", shuffled);
  console.log("元配列は非破壊？", users); // 変わっていないことを確認

  // --- 動作確認用サンプル ---
  // const nums = [1, 2, 3, 4, 5];
  // console.log(shuffle(nums));
  // console.log(nums); // 元の配列はそのままかチェック
})();
