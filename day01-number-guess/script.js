 (function () {
 'use strict';
  const maxAttempts = 3;
  let attemptCount = 0;
  let answer = Math.floor(Math.random() * 100) + 1;
  console.log('答え（デバッグ用）:', answer);
  const hatenaBox = document.querySelector('.hatena_box');
  const guessBtn = document.getElementById('guessBtn');
  const guessInput = document.getElementById('guessInput');
  const answerLog = document.querySelector('.answer_log');

  
  answerLog.setAttribute('role', 'status');
  answerLog.setAttribute('aria-live', 'polite');

  function appendLog(text) {
    const p = document.createElement('p');
    p.textContent = text;
    answerLog.appendChild(p);
  }

  function validateInput(value) {
    if (typeof value === 'string') value = value.trim();
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 100;
  }

  guessBtn.addEventListener('click', function() {
    // 再挑戦モード
    if (guessBtn.textContent === '再挑戦') {
      resetGame();
      return;
    }
    if (attemptCount >= maxAttempts) return;

      // 初回回答時に表示
    if (attemptCount === 0) {
      answerLog.style.display = 'block';
    }

    const userGuess = Number(guessInput.value.trim());

    if (!validateInput(userGuess)) {
      appendLog('1~100の正数を入力してください');
      return;
    }

    let msg = '';
    if (userGuess === answer) {
      msg = '正解です！';
      hatenaBox.classList.add('openbox');
      hatenaBox.textContent = answer;
      guessBtn.disabled = true;
      guessInput.disabled = true;
      guessBtn.classList.add('disabled-btn');
      guessBtn.textContent = '正解！';

    } else if (userGuess > answer) {
      msg = 'もっと小さい数字です';
    } else {
      msg = 'もっと大きい数字です';
    }

    attemptCount++;
    const remaining = maxAttempts - attemptCount;
    appendLog(`回答${attemptCount}: ${userGuess} → ${msg}（残り${remaining}回）`);

    if (attemptCount === maxAttempts && userGuess !== answer) {
      appendLog('残念。またチャレンジしてね');
      guessBtn.classList.remove('disabled-btn');
      guessBtn.disabled = false;
      guessInput.disabled = true;
      guessBtn.textContent = '再挑戦';
      guessBtn.classList.add('retry-btn'); // ← 追加
    }
  });
  
  function resetGame() {
    answer = Math.floor(Math.random() * 100) + 1;
    console.log('新しい答え（デバッグ用）:', answer);
    attemptCount = 0;
    guessInput.value = '';
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessBtn.textContent = '回答する';
    guessBtn.classList.remove('disabled-btn');
    guessBtn.classList.remove('retry-btn'); // ← 追加
    hatenaBox.classList.remove('openbox');
    hatenaBox.textContent = '?';
    answerLog.innerHTML = '';
    appendLog('新しいゲームを開始しました！1〜100の整数を当ててください。');
    guessInput.focus();
  }

  guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !guessBtn.disabled) guessBtn.click();
  });

})();