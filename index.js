const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "forestgreen";
const paddle1Color    = "lightblue";
const paddle2Color    = "red";
const paddleBorder    = "black";
const ballColor       = "yellow";
const ballBorderColor = "black";
const ballRadius      = 12.5;
const paddleSpeed     = 50;

let intervalID;
let ballSpeed;
let ballX   = gameWidth  / 2;
let ballY   = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;

let player1Score = 0;
let player2Score = 0;

let paddle1 = {
  width:  25,
  height: 100,
  x:      0,
  y:      0
};
let paddle2 = {
  width:  25,
  height: 100,
  x:      gameWidth - 25,
  y:      gameHeight - 100
};

window.addEventListener("keydown", changeDirection);
resetBtn .addEventListener("click", resetGame);

gameStart();

function gameStart(){
  createBall();
  nextTick();
}

function nextTick(){
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    checkCollision();
    nextTick();
  }, 10);
}

function clearBoard(){
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles(){
  ctx.strokeStyle = paddleBorder;

  ctx.fillStyle = paddle1Color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall(){
  ballSpeed = 1;
  ballXDirection = Math.random() < 0.5 ?  1 : -1;
  ballYDirection = Math.random() < 0.5
    ? Math.random()
    : -Math.random();

  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  drawBall(ballX, ballY);
}

function moveBall(){
  ballX += ballSpeed * ballXDirection;
  ballY += ballSpeed * ballYDirection;
}

function drawBall(x, y){
  ctx.fillStyle   = ballColor;
  ctx.strokeStyle = ballBorderColor;
  ctx.lineWidth   = 2;

  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function checkCollision(){
  // top & bottom
  if (ballY <= ballRadius || ballY >= gameHeight - ballRadius) {
    ballYDirection *= -1;
  }

  // left & right (score)
  if (ballX <= 0) {
    player2Score++;
    updateScore();
    createBall();
    return;
  }
  if (ballX >= gameWidth) {
    player1Score++;
    updateScore();
    createBall();
    return;
  }

  // left paddle
  if (
    ballX <= paddle1.x + paddle1.width + ballRadius &&
    ballY > paddle1.y &&
    ballY < paddle1.y + paddle1.height
  ) {
    ballX = paddle1.x + paddle1.width + ballRadius;
    ballXDirection *= -1;
    ballSpeed++;
  }

  // right paddle
  if (
    ballX >= paddle2.x - ballRadius &&
    ballY > paddle2.y &&
    ballY < paddle2.y + paddle2.height
  ) {
    ballX = paddle2.x - ballRadius;
    ballXDirection *= -1;
    ballSpeed++;
  }
}

function changeDirection(event){
  const key = event.keyCode;
  switch (key) {
    case 87: // W
      if (paddle1.y > 0) paddle1.y -= paddleSpeed;
      break;
    case 83: // S
      if (paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;
      break;
    case 38: // ↑
      if (paddle2.y > 0) paddle2.y -= paddleSpeed;
      break;
    case 40: // ↓
      if (paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
      break;
  }
}

function updateScore(){
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame(){
  player1Score = 0;
  player2Score = 0;
  paddle1 = { width:25, height:100, x:0,                 y:0                };
  paddle2 = { width:25, height:100, x:gameWidth - 25,    y:gameHeight - 100 };
  ballSpeed     = 1;
  ballX         = 0;
  ballY         = 0;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  clearTimeout(intervalID);
  gameStart();
}
