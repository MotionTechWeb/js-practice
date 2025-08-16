(function(){
  const answer = Math.floor(Math.random() * 100) + 1;
  const maxAttempts = 3;
  let attemptCount = 0;
  console.log('答え（デバッグ用）:', answer);
  const hatenaBox = document.querySelector('.hatena_box');
  const guessBtn = document.getElementById('guessBtn');
  const guessInput = document.getElementById('guessInput');
  const answerLog = document.querySelector('.answer_log');

  function appendLog(text) {
    const p = document.createElement('p');
    p.textContent = text;
    answerLog.appendChild(p);
  }

  function validateInput(value) {
    return value && value >= 1 && value <= 100;
  }

  guessBtn.addEventListener('click', function() {
    if (attemptCount >= maxAttempts) return;

      // 初回回答時に表示
    if (attemptCount === 0) {
      answerLog.style.display = 'block';
    }

    const userGuess = Number(guessInput.value);

    if (!validateInput(userGuess)) {
      appendLog('1~100の数字を入力してください');
      return;
    }

    let msg = '';
    if (userGuess === answer) {
      msg = '正解です！';
      hatenaBox.classList.add('openbox');
      hatenaBox.textContent = answer;    
      guessBtn.disabled = true;
      guessBtn.classList.add('disabled-btn');
      guessBtn.textContent = '正解！';

    } else if (userGuess > answer) {
      msg = 'もっと小さい数字です';
    } else {
      msg = 'もっと大きい数字です';
    }

    attemptCount++;
    appendLog(`回答${attemptCount}: ${userGuess} → ${msg}`);

    if (attemptCount === maxAttempts && userGuess !== answer) {
      appendLog('残念。またチャレンジしてね');
      guessBtn.classList.add('disabled-btn'); // クラス追加
      guessBtn.disabled = true;

    }
  });
})();