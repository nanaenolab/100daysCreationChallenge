let board = [];
let currentPlayer = 1;
let cellSize = 60;
let blackScore = 2;
let whiteScore = 2;

function setup() {
  createCanvas(480, 520);
  textAlign(CENTER, CENTER);
  textSize(18);

  for (let i = 0; i < 8; i++) {
    board[i] = Array(8).fill(0);
  }
  board[3][3] = -1;
  board[3][4] = 1;
  board[4][3] = 1;
  board[4][4] = -1;
}

function draw() {
  background(80);
  drawBoard();
  updateScore();
  drawScore();

  if (currentPlayer === -1) {
    let bestMove = getBestMove(-1);
    if (bestMove) {
      placeDisk(bestMove.x, bestMove.y, -1);
      currentPlayer = 1;
    }
  }
}

function drawBoard() {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      stroke(0);
      fill(0, 150, 0);
      rect(x * cellSize, y * cellSize, cellSize, cellSize);

      if (board[x][y] !== 0) {
        drawDiskWithFace(x, y, board[x][y]);
      }
    }
  }
}

function drawDiskWithFace(x, y, player) {
  const cx = x * cellSize + cellSize / 2;
  const cy = y * cellSize + cellSize / 2;
  const r = cellSize * 0.8;

  // Disk
  fill(player === 1 ? 0 : 255);
  stroke(0);
  ellipse(cx, cy, r);

  // Face
  const eyeOffsetX = r * 0.2;
  const eyeOffsetY = r * 0.15;
  const eyeSize = r * 0.1;
  fill(player === 1 ? 255 : 0); // eyes contrast with disk

  ellipse(cx - eyeOffsetX, cy - eyeOffsetY, eyeSize);
  ellipse(cx + eyeOffsetX, cy - eyeOffsetY, eyeSize);

  // Smile
  noFill();
  stroke(player === 1 ? 255 : 0);
  strokeWeight(1.5);
  arc(cx, cy + eyeOffsetY * 1.5, r * 0.4, r * 0.25, 0, PI);
}

function mousePressed() {
  if (currentPlayer !== 1) return;

  let x = floor(mouseX / cellSize);
  let y = floor(mouseY / cellSize);

  if (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === 0) {
    if (placeDisk(x, y, currentPlayer)) {
      currentPlayer = -1;
    }
  }
}

function placeDisk(x, y, player) {
  let flipped = getFlips(x, y, player);
  if (flipped.length > 0) {
    board[x][y] = player;
    for (let [i, j] of flipped) {
      board[i][j] = player;
    }
    return true;
  }
  return false;
}

function getFlips(x, y, player) {
  if (board[x][y] !== 0) return [];

  let directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
  ];

  let flipped = [];

  for (let [dx, dy] of directions) {
    let i = x + dx;
    let j = y + dy;
    let path = [];

    while (i >= 0 && i < 8 && j >= 0 && j < 8 && board[i][j] === -player) {
      path.push([i, j]);
      i += dx;
      j += dy;
    }

    if (i >= 0 && i < 8 && j >= 0 && j < 8 && board[i][j] === player && path.length > 0) {
      flipped = flipped.concat(path);
    }
  }

  return flipped;
}

function getBestMove(player) {
  let bestMove = null;
  let maxFlips = 0;

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let flips = getFlips(x, y, player);
      if (flips.length > maxFlips) {
        maxFlips = flips.length;
        bestMove = { x, y };
      }
    }
  }

  return bestMove;
}

function updateScore() {
  blackScore = 0;
  whiteScore = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board[x][y] === 1) blackScore++;
      else if (board[x][y] === -1) whiteScore++;
    }
  }
}

function drawScore() {
  fill(255);
  textSize(18);
  text(`Black: ${blackScore}     White: ${whiteScore}`, width / 2, height - 20);
}
