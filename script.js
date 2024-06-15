let superBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let gameActive = true;
let activeMiniBoard = null;
let bodyEl = document.querySelector("body");
document.getElementById("message").innerText = `${currentPlayer} to play`;
document.getElementById("message").classList.add("xfont");

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
  if (cell.innerText === "X") {
    cell.classList.add("X");
  } else {
    cell.classList.add("O");
  }

  if (checkMiniBoardWin(miniBoard)) {
    superBoard[superRow][superCol] = currentPlayer;
    miniBoard.classList.add("winner");
    markWinningMiniBoard(miniBoard, currentPlayer);
    if (checkWinner(superBoard) || checkDraw()) {
      document
        .querySelectorAll(".cell")
        .forEach((cell) => cell.classList.remove("active-cell"));
    }
    if (checkWinner(superBoard)) {
      document.getElementById(
        "message"
      ).innerText = `${currentPlayer} wins the game!`;
      bodyEl.style.backgroundColor = currentPlayer === "X" ? "red" : "blue";
      document.getElementById("message").classList.add("white");
      document.querySelector("h1").classList.add("white");

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
  document.getElementById("message").innerText = `${currentPlayer} to play`;
  document
    .getElementById("message")
    .classList.remove(currentPlayer === "X" ? "ofont" : "xfont");
  document
    .getElementById("message")
    .classList.add(currentPlayer === "X" ? "xfont" : "ofont");

  activeMiniBoard =
    superBoard[miniRow][miniCol] === "" ? [miniRow, miniCol] : null;
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.remove("active-cell"));
  if (activeMiniBoard) {
    document
      .querySelector(`.board[data-row="${miniRow}"][data-col="${miniCol}"]`)
      .querySelectorAll(".cell")
      .forEach((cell) => {
        if (cell.innerText === "") {
          cell.classList.add("active-cell");
        }
      });
  }
}

function markWinningMiniBoard(miniBoard, player) {
  const cells = Array.from(miniBoard.getElementsByClassName("cell"));

  let playerColor = "";
  if (player === "X") {
    playerColor = "#f21717";

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      cell.classList.remove("X");
      cell.innerText = "";
      if (
        !(
          (row === 0 && col === 1) ||
          (row === 1 && (col === 0 || col === 2)) ||
          (row === 2 && col === 1)
        )
      ) {
        cell.style.backgroundColor = playerColor;
      }
    });
  } else if (player === "O") {
    playerColor = "blue";

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      cell.classList.remove("O");
      cell.innerText = "";
      if (!(row === 1 && col === 1)) {
        cell.style.backgroundColor = playerColor;
      }
    });
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
  let cells = Array.from(miniBoard.getElementsByClassName("cell")); // Convert HTMLCollection to Array
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
  bodyEl.style.backgroundColor = "white";
  document.querySelector("h1").classList.remove("white");
  document.getElementById("message").classList.remove("ofont", "white");
  document.getElementById("message").classList.add("xfont");
  gameActive = true;
  activeMiniBoard = null;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("winner", "active-cell", "X", "O");
    cell.style.backgroundColor = "";
  });
  document.querySelectorAll(".board").forEach((board) => {
    board.classList.remove("winner");
  });
  document.getElementById("message").innerText = `${currentPlayer} to play`;
}

initializeSuperBoard();
