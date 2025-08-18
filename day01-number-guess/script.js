(function () {
  "use strict";

  // ===== Config / i18n-ish =====
  const CONFIG = { MIN: 1, MAX: 100, MAX_ATTEMPTS: 3 };
  const MSG = {
    start: `新しいゲームを開始しました！${CONFIG.MIN}〜${CONFIG.MAX}の整数を当ててください。`,
    invalid: `${CONFIG.MIN}〜${CONFIG.MAX}の整数を入力してください`,
    smaller: "もっと小さい数字です",
    bigger: "もっと大きい数字です",
    correct: "正解です！",
    fail: "残念。またチャレンジしてね",
    attempt: (n, guess, hint, remain) =>
      `回答${n}: ${guess} → ${hint}${remain >= 0 ? `（残り${remain}回）` : ""}`,
  };

  // ===== State =====
  let answer = 0;
  let attempts = 0;
  let isGameOver = false;

  // ===== DOM =====
  const form = document.querySelector("#guessForm");
  const hatenaBox = document.querySelector(".hatena_box");
  const guessBtn = document.getElementById("guessBtn");
  const guessInput = document.getElementById("guessInput");
  const answerLog = document.querySelector(".answer_log");
  const resetBtn = document.getElementById("resetBtn");

  // ARIA
  answerLog.setAttribute("role", "log");
  answerLog.setAttribute("aria-live", "polite");

  // ===== Utils =====
  const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const isValid = (v) =>
    Number.isInteger(v) && v >= CONFIG.MIN && v <= CONFIG.MAX;

  const appendLog = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    answerLog.appendChild(p);
  };

  const updateButtons = () => {
    if (isGameOver) {
      // ゲーム終了 → 回答ボタンを隠し、再挑戦を出す
      guessBtn.style.display = "none";
      resetBtn.style.display = "block";
    } else {
      // プレイ中 → 回答ボタンを出し、再挑戦は隠す
      guessBtn.style.display = "block";
      resetBtn.style.display = "none";
    }
  };

  const setGameOver = (over) => {
    isGameOver = over;
    guessInput.disabled = over;
    guessBtn.disabled = over; // 念のため
    updateButtons();
  };

  const resetGame = () => {
    answer = randInt(CONFIG.MIN, CONFIG.MAX);
    attempts = 0;
    setGameOver(false);

    // 表示系の初期化
    hatenaBox.classList.remove("openbox");
    hatenaBox.textContent = "?";
    answerLog.innerHTML = "";
    appendLog(MSG.start); // 初期メッセージ（必要なら表示時に読まれる）

    // 入力系の初期化
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();

    // // デバッグしたいときだけ
    console.log("答え:", answer);
  };

  // ===== Handlers =====
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isGameOver) return;

    if (attempts === 0) {
      // 初回入力時にログを見えるように
      answerLog.style.display = "block";
    }

    const n = Number(guessInput.value.trim());
    if (!isValid(n)) {
      appendLog(MSG.invalid);
      return;
    }

    attempts += 1;

    if (n === answer) {
      hatenaBox.classList.add("openbox");
      hatenaBox.textContent = String(answer);
      appendLog(
        MSG.attempt(attempts, n, MSG.correct, CONFIG.MAX_ATTEMPTS - attempts)
      );
      setGameOver(true); // ここで回答ボタンが隠れ、再挑戦が出る
      return;
    }

    const hint = n > answer ? MSG.smaller : MSG.bigger;
    const remain = CONFIG.MAX_ATTEMPTS - attempts;
    appendLog(MSG.attempt(attempts, n, hint, remain));

    if (remain <= 0) {
      appendLog(MSG.fail);
      setGameOver(true); // ここでも同様に切り替え
    }
  });

  resetBtn?.addEventListener("click", resetGame);

  // 初期化
  resetGame();
})();
