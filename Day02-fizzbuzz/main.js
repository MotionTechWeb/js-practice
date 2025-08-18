(function () {
  "use strict";

  // DOM要素参照
  function byId(id) {
    return document.getElementById(id);
  }
  const EL = {
    number: byId("number"),
    score: byId("score"),
    lives: byId("lives"),
    message: byId("message"),
    restartBtn: byId("restart"),
    buttons: document.querySelectorAll(".btn"),
  };

  const STATE = {
    current: 1,
    score: 0,
    lives: 3,
    limit: 100,
  };

  let isOver = false;
  let isLocked = false; // 1問ごとの再入防止

  function init() {
    STATE.current = 1;
    STATE.score = 0;
    STATE.lives = 3;
    isOver = false;
    isLocked = false;
    setButtonsEnabled(true);
    showMessage("info", "");
    render();
    showQuestion();
  }

  function render() {
    EL.number.textContent = STATE.current; // 今の数字を表示
    EL.score.textContent = STATE.score; // スコア表示
    EL.lives.textContent = STATE.lives; // ライフ表示
  }

  function showQuestion() {
    EL.number.textContent = STATE.current;
  }

  function fizzBuzz(n) {
    let result = "";
    if (n % 3 === 0) result += "Fizz";
    if (n % 5 === 0) result += "Buzz";
    return result || n;
  }

  function correctLabel(n) {
    const c = fizzBuzz(n);
    if (typeof c === "string") return c.toLowerCase(); // fizz / buzz / fizzbuzz
    return "number"; // 数字のとき
  }

  function handleAnswer(userAnswer) {
    if (isOver || isLocked) return; // 二重実行ガード
    isLocked = true;
    setButtonsEnabled(false);

    const isCorrect = userAnswer === correctLabel(STATE.current);

    if (isCorrect) {
      STATE.score++;
      showMessage("ok", "Correct!");
    } else {
      STATE.lives--;
      const correct = fizzBuzz(STATE.current);
      showMessage("ng", `Wrong… (正解は ${correct})`);
      if (STATE.lives <= 0) {
        render(); // 0を画面に反映
        gameOver();
        return;
      }
    }

    STATE.current++;
    if (STATE.lives <= 0 || STATE.current > STATE.limit) {
      render(); // HUDを更新してから終了
      gameOver();
      return;
    }

    render();
    showQuestion();
    isLocked = false; // 次の問題に進んだのでロック解除
    setButtonsEnabled(true);
  }

  function showMessage(type, text) {
    // type: "ok" | "ng" | "info"
    EL.message.textContent = text;
    EL.message.className = `message ${type}`;
  }

  function setButtonsEnabled(enabled) {
    EL.buttons.forEach((btn) => {
      btn.disabled = !enabled;
    });
    //EL.restartBtn.disabled = enabled; // ゲーム中はリスタート無効にしたいなら
  }

  function gameOver() {
    isOver = true;
    setButtonsEnabled(false);
    showMessage("ng", "Game Over");
  }

  // 回答ボタン
  EL.buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userAnswer = btn.dataset.answer; // "fizz" / "buzz" / "fizzbuzz" / "number"
      handleAnswer(userAnswer);
    });
  });

  // リスタート
  EL.restartBtn.addEventListener("click", () => {
    const ok = window.confirm("最初からやり直しますか？");
    if (!ok) return;
    init();
  });

  // 起動
  init();
})();
