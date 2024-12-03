const board = document.getElementById('board');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function createBoard() {
  board.innerHTML = '';
  boardState.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    if (cell) cellElement.classList.add('taken');
    cellElement.dataset.index = index;
    cellElement.textContent = cell;
    cellElement.addEventListener('click', handleCellClick);
    board.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || boardState[index]) return;

  boardState[index] = currentPlayer;
  createBoard();

  if (checkWin(currentPlayer)) {
    statusText.textContent = `${currentPlayer} venceu!`;
    gameActive = false;
    return;
  }

  if (boardState.every(cell => cell)) {
    statusText.textContent = 'Empate!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = currentPlayer === 'X' ? 'Sua vez!' : 'Vez do computador!';
  
  if (currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  const bestMove = findBestMove();
  boardState[bestMove] = 'O';
  createBoard();

  if (checkWin('O')) {
    statusText.textContent = 'O computador venceu!';
    gameActive = false;
    return;
  }

  if (boardState.every(cell => cell)) {
    statusText.textContent = 'Empate!';
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = 'Sua vez!';
}

function findBestMove() {
  for (let i = 0; i < boardState.length; i++) {
    if (!boardState[i]) {
      boardState[i] = 'O';
      if (checkWin('O')) {
        boardState[i] = null;
        return i;
      }
      boardState[i] = null;
    }
  }

  // Bloqueie o player se ele for vencer
  for (let i = 0; i < boardState.length; i++) {
    if (!boardState[i]) {
      boardState[i] = 'X';
      if (checkWin('X')) {
        boardState[i] = null;
        return i;
      }
      boardState[i] = null;
    }
  }

  
  if (!boardState[4]) {
    return 4;
  }

  
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (!boardState[corner]) {
      return corner;
    }
  }

  
  let availableMoves = boardState
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);
  
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWin(player) {
  return winningCombinations.some(combination =>
    combination.every(index => boardState[index] === player)
  );
}

function resetGame() {
  boardState = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = 'Sua vez!';
  createBoard();
}


createBoard();
