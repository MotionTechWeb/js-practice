(function () {
  "use strict";

  function fizzBuzz(n) {
    let result = "";
    if (n % 3 === 0) result += "Fizz";
    if (n % 5 === 0) result += "Buzz";
    return result || n;
  }
  for (let i = 1; i <= 100; i++) {
    console.log(fizzBuzz(i));
  }
})();
