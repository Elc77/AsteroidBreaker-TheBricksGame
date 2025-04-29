
const backgroundMusic = new Audio('sound/spaceHarrier.mp3');
backgroundMusic.loop = true;
backgroundMusic.play();

function drawIt() {
  var x, y, dx, dy;
  var WIDTH, HEIGHT, r = 20;
  var ctx;
  var paddlex, paddleh, paddlew;
  var rowheight, colwidth, row, col;
  var rightDown = false, leftDown = false;
  var bricks, NROWS, NCOLS, BRICKWIDTH, BRICKHEIGHT, PADDING;
  var brickScales = [];
  var rowcolors = ["#66c2ff", "#66c2ff", "#66c2ff"];
  var paddlecolor = "#00aaff";
  var intervalId = null;
  var intTimer = null;
  var gameOver = false;
  var paused = false;
  var started = false;
  var sekunde = 0;
  var tocke = 0;
  var ballRotation = 0;
  var difficultyDx = 2;
  var difficultyDy = -4;
  let TOTAL_BRICKS;

  var brick = new Image();
  brick.src = "images/asteroid.png";

  var starImage = new Image();
  starImage.src = "images/star3-min.png";

  var powerUps = [];

  function init() {
    ctx = $("#canvas")[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    init_paddle();
    initbricks();
    resetBall();
    updateScore();
    updateTimerDisplay();
    setInterval(draw, 10);
  }

  function resetBall() {
    x = paddlex + paddlew / 2;
    y = HEIGHT - paddleh - r - 1;
    dx = difficultyDx;
    dy = difficultyDy;
  }

  function init_paddle() {
    paddlew = 85;
    paddlex = WIDTH / 2 - paddlew / 2;
    paddleh = 10;
  }

  function initbricks() {
    NROWS = 3;
    NCOLS = 11;
    PADDING = 5;
    BRICKWIDTH = (WIDTH / NCOLS) - 6;
    BRICKHEIGHT = 70;
    TOTAL_BRICKS = NROWS * NCOLS;
    bricks = new Array(NROWS);
    brickScales = new Array(NROWS);
    for (let i = 0; i < NROWS; i++) {
      bricks[i] = new Array(NCOLS);
      brickScales[i] = new Array(NCOLS);
      for (let j = 0; j < NCOLS; j++) {
        bricks[i][j] = 1;
        brickScales[i][j] = {
          speed: 0.002 + Math.random() * 0.003,
          phase: Math.random() * Math.PI * 2
        };
      }
    }
  }

  function draw() {
    clear();

    if (!gameOver && !paused && started) {
      if (x + dx > WIDTH - r || x + dx < r) dx = -dx;
      if (y + dy < r) dy = -dy;
      else if (y + dy > HEIGHT - r) {
        if (x > paddlex && x < paddlex + paddlew) {
          dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
          dy = -dy;
        } else {
          gameOver = true;
          stopGame();
          showGameOverAlert();
        }
      }
      x += dx;
      y += dy;
    }

    // Draw bricks with conditional scaling
    for (let i = 0; i < NROWS; i++) {
      for (let j = 0; j < NCOLS; j++) {
        if (bricks[i][j] == 1) {
          ctx.save();
          let brickX = (j * (BRICKWIDTH + PADDING)) + PADDING;
          let brickY = (i * (BRICKHEIGHT + PADDING)) + PADDING;

          let scale = 1;
          if (!started) {
            let t = Date.now() * brickScales[i][j].speed + brickScales[i][j].phase;
            scale = 1 + 0.1 * Math.sin(t);
          }

          ctx.translate(brickX + BRICKWIDTH / 2, brickY + BRICKHEIGHT / 2);
          ctx.scale(scale, scale);
          ctx.drawImage(brick, -BRICKWIDTH / 2, -BRICKHEIGHT / 2, BRICKWIDTH, BRICKHEIGHT);
          ctx.restore();
        }
      }
    }

    rowheight = BRICKHEIGHT + PADDING;
    colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(y / rowheight);
    col = Math.floor(x / colwidth);

    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
      dy = -dy;
      bricks[row][col] = 0;
      tocke++;
      updateScore();
      new Audio('sound/star_hit.mp3').play();

      if (tocke >= TOTAL_BRICKS) {
        gameOver = true;
        stopGame();
        showWinAlert();
      }
    }

    if (!gameOver && !paused && started) {
      if (rightDown && paddlex + paddlew + 5 <= WIDTH) paddlex += 5;
      else if (leftDown && paddlex - 5 >= 0) paddlex -= 5;
    }

    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    drawStar(x, y, r, ballRotation);

    if (!paused && started && !gameOver) {
      ballRotation += 0.1;
    }
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function drawStar(cx, cy, radius, rotation) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.drawImage(starImage, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
  }

  function onKeyDown(evt) {
    if (evt.keyCode == 39) rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
  }

  function onKeyUp(evt) {
    if (evt.keyCode == 39) rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
  }

  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp);

  function timer() {
    if (!paused && started && !gameOver) {
      sekunde++;
      updateTimerDisplay();
    }
  }

  function updateTimerDisplay() {
    let min = Math.floor(sekunde / 60);
    let sec = sekunde % 60;
    let str = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
    $("#cas").html(str);
  }

  function updateScore() {
    $("#tocke").html(tocke);
  }

  window.startGame = function () {
    if (gameOver || !started) {
      sekunde = 0;
      tocke = 0;
      gameOver = false;
      paused = false;
      started = true;
      initbricks();
      updateScore();
      updateTimerDisplay();
      init_paddle();
      resetBall();
    }
    clearInterval(intTimer);
    intTimer = setInterval(timer, 1000);
  };

  window.pauseGame = function () {
    paused = !paused;
  };

  window.stopGame = function () {
    started = false;
    paused = false;
    clearInterval(intTimer);
  };

  window.resetGame = function () {
    stopGame();
    sekunde = 0;
    tocke = 0;
    updateScore();
    updateTimerDisplay();
    initbricks();
    init_paddle();
    resetBall();
    ballRotation = 0;
  };

  window.showResult = function () {
    alert("Time: " + $("#cas").text() + " | Score: " + $("#tocke").text());
  };

  window.setDifficulty = function (level) {
    if (level === "easy") {
      difficultyDx = 1; difficultyDy = -2;
    } else if (level === "medium") {
      difficultyDx = 4; difficultyDy = -4;
    } else if (level === "hard") {
      difficultyDx = 5; difficultyDy = -6;
    }
  };

  init();

  function showGameOverAlert() {
    swal({
      title: "Game Over!",
      text: "Your score: " + tocke + "\nTime: " + $("#cas").text(),
      confirmButtonText: "OK",
      confirmButtonColor: "#0088CC"
    });
  }

  function showWinAlert() {
    swal({
      title: "You Won! 🎉",
      text: "You broke all the bricks!\nScore: " + tocke + "\nTime: " + $("#cas").text(),
      confirmButtonText: "OK",
      confirmButtonColor: "#00BB88"
    });
  }
}
