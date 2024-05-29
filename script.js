let superBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let gameActive = true;
let activeMiniBoard = null;

function initializeSuperBoard() {
  let superBoardElement = document.getElementById("super-board");

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let miniBoard = document.createElement("div");
      miniBoard.classList.add("board");
      miniBoard.dataset.row = i;
      miniBoard.dataset.col = j;

      for (let k = 0; k < 9; k++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = Math.floor(k / 3);
        cell.dataset.col = k % 3;
        cell.addEventListener("click", () =>
          makeMove(i, j, Math.floor(k / 3), k % 3)
        );
        miniBoard.appendChild(cell);
      }

      superBoardElement.appendChild(miniBoard);
    }
  }
}

function makeMove(superRow, superCol, miniRow, miniCol) {
  if (!gameActive) return;

  if (
    activeMiniBoard !== null &&
    (superRow !== activeMiniBoard[0] || superCol !== activeMiniBoard[1])
  )
    return;

  let miniBoard = document.querySelector(
    `.board[data-row="${superRow}"][data-col="${superCol}"]`
  );
  let cell = miniBoard.querySelector(
    `.cell[data-row="${miniRow}"][data-col="${miniCol}"]`
  );

  if (cell.innerText !== "" || miniBoard.classList.contains("winner")) return;

  cell.innerText = currentPlayer;

  if (checkMiniBoardWin(miniBoard)) {
    superBoard[superRow][superCol] = currentPlayer;
    miniBoard.classList.add("winner");
    markWinningCells(miniBoard, currentPlayer);
    if (checkWinner(superBoard)) {
      document.getElementById(
        "message"
      ).innerText = `${currentPlayer} wins the game!`;
      gameActive = false;
      return;
    } else if (checkDraw()) {
      document.getElementById("message").innerText = "Game is a draw!";
      gameActive = false;
      return;
    }
    document.getElementById(
      "message"
    ).innerText = `${currentPlayer} wins the board!`;
  } else if (miniBoard.querySelectorAll(".cell:not(:empty)").length === 9) {
    superBoard[superRow][superCol] = "draw";
    document.getElementById("message").innerText = "Board is a draw!";
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("message").innerText = `${currentPlayer}'s turn`;

  activeMiniBoard =
    superBoard[miniRow][miniCol] === "" ? [miniRow, miniCol] : null;
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.remove("active-cell"));
  if (activeMiniBoard) {
    document
      .querySelector(`.board[data-row="${miniRow}"][data-col="${miniCol}"]`)
      .querySelectorAll(".cell")
      .forEach((cell) => cell.classList.add("active-cell"));
  }
}

function markWinningCells(miniBoard, player) {
  let cells = miniBoard.getElementsByClassName("cell");
  let board = [];

  for (let i = 0; i < 9; i += 3) {
    board.push([cells[i], cells[i + 1], cells[i + 2]]);
  }

  // Check rows
  for (let row of board) {
    if (row.every((cell) => cell.innerText === player)) {
      row.forEach((cell) => cell.classList.add("winner"));
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    let column = [board[0][i], board[1][i], board[2][i]];
    if (column.every((cell) => cell.innerText === player)) {
      column.forEach((cell) => cell.classList.add("winner"));
    }
  }

  // Check diagonals
  let diagonal1 = [board[0][0], board[1][1], board[2][2]];
  let diagonal2 = [board[0][2], board[1][1], board[2][0]];

  if (diagonal1.every((cell) => cell.innerText === player)) {
    diagonal1.forEach((cell) => cell.classList.add("winner"));
  }
  if (diagonal2.every((cell) => cell.innerText === player)) {
    diagonal2.forEach((cell) => cell.classList.add("winner"));
  }
}

function checkWinner(board) {
  // Check rows and columns
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      return true;
    }
    if (
      board[0][i] !== "" &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return true;
  }
  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return true;
  }

  return false;
}

function checkMiniBoardWin(miniBoard) {
  let cells = miniBoard.getElementsByClassName("cell");
  let board = [];

  for (let i = 0; i < 9; i += 3) {
    board.push([
      cells[i].innerText,
      cells[i + 1].innerText,
      cells[i + 2].innerText,
    ]);
  }

  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== "" &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return true;
  }
  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return true;
  }

  return false;
}

function checkDraw() {
  return superBoard.flat().every((cell) => cell !== "");
}

function resetGame() {
  superBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  gameActive = true;
  activeMiniBoard = null;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("winner", "active-cell");
  });
  document.querySelectorAll(".board").forEach((board) => {
    board.classList.remove("winner");
  });
  document.getElementById("message").innerText = `${currentPlayer}'s turn`;
}

initializeSuperBoard();
