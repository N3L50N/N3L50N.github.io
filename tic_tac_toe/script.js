const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreTiesElement = document.getElementById('scoreTies');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = { 'X': 0, 'O': 0, 'Ties': 0 };
let turns = 0; // Track the number of turns played

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

function checkWin() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            message.textContent = `${currentPlayer} wins!`;
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
            scores[currentPlayer]++;
            updateScoreBoard();
        }
    }

    if (!gameBoard.includes('') && gameActive) {
        gameActive = false;
        message.textContent = "It's a tie!";
        scores['Ties']++;
        updateScoreBoard();
    }
}

function updateScoreBoard() {
    scoreXElement.textContent = scores['X'];
    scoreOElement.textContent = scores['O'];
    scoreTiesElement.textContent = scores['Ties'];
}

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.id;

    if (gameBoard[cellIndex] || !gameActive) return;

    gameBoard[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    checkWin();

    if (gameActive) {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        turns++;

        if (currentPlayer === 'O' && gameActive) {
            makeAIMove();
        }
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = '';
    turns = 0;
    currentPlayer = (turns % 2 === 0) ? 'X' : 'O'; // Alternate the starting player
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'winner');
    });
}

function makeAIMove() {
    const bestMove = minimax(gameBoard, 'O').index;
    gameBoard[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;
    cells[bestMove].classList.add(currentPlayer);
    checkWin();
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

function emptyCells(board) {
    return board.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);
}

function minimax(board, player) {
    const availableMoves = emptyCells(board);

    if (checkWinForPlayer(board, 'X')) {
        return { score: -10 };
    } else if (checkWinForPlayer(board, 'O')) {
        return { score: 10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        board[availableMoves[i]] = player;

        if (player === 'O') {
            const result = minimax(board, 'X');
            move.score = result.score;
        } else {
            const result = minimax(board, 'O');
            move.score = result.score;
        }

        board[availableMoves[i]] = '';

        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinForPlayer(board, player) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
updateScoreBoard();
