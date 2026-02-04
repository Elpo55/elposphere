const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 20;
const cols = canvas.width / blockSize;
const rows = canvas.height / blockSize;

let board = Array(rows).fill(null).map(() => Array(cols).fill(0));
let piece = null;
let score = 0;
let gameRunning = true;

const pieces = [
    {blocks: [[1,1,1,1]], color: 'var(--primary)'},
    {blocks: [[1,1],[1,1]], color: '#FF6B6B'},
    {blocks: [[0,1],[1,1],[1,0]], color: '#4ECDC4'},
    {blocks: [[1,0],[1,1],[0,1]], color: '#FFE66D'},
    {blocks: [[1,1,1],[0,0,1]], color: '#95E1D3'},
];

function getNewPiece() {
    const p = pieces[Math.floor(Math.random() * pieces.length)];
    return {blocks: p.blocks, x: Math.floor(cols / 2) - 1, y: 0, color: p.color};
}

function canMove(piece, dx, dy) {
    for (let r = 0; r < piece.blocks.length; r++) {
        for (let c = 0; c < piece.blocks[r].length; c++) {
            if (piece.blocks[r][c]) {
                const x = piece.x + c + dx;
                const y = piece.y + r + dy;
                if (x < 0 || x >= cols || y >= rows || (y >= 0 && board[y][x])) return false;
            }
        }
    }
    return true;
}

function lock() {
    for (let r = 0; r < piece.blocks.length; r++) {
        for (let c = 0; c < piece.blocks[r].length; c++) {
            if (piece.blocks[r][c]) {
                const y = piece.y + r;
                if (y >= 0) board[y][piece.x + c] = piece.color;
            }
        }
    }
    clearLines();
    piece = getNewPiece();
    if (!canMove(piece, 0, 0)) gameRunning = false;
}

function clearLines() {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r].every(cell => cell)) {
            board.splice(r, 1);
            board.unshift(Array(cols).fill(0));
            score++;
            document.getElementById('tetrisScore').innerText = score;
        }
    }
}

function rotate() {
    const rotated = piece.blocks[0].map((_, i) => piece.blocks.map(row => row[i])).reverse();
    const oldBlocks = piece.blocks;
    piece.blocks = rotated;
    if (!canMove(piece, 0, 0)) piece.blocks = oldBlocks;
}

window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft') canMove(piece, -1, 0) && (piece.x--);
    if (e.key === 'ArrowRight') canMove(piece, 1, 0) && (piece.x++);
    if (e.key === 'ArrowDown') canMove(piece, 0, 1) && (piece.y++);
    if (e.key === ' ') rotate();
});

function resetTetris() {
    board = Array(rows).fill(null).map(() => Array(cols).fill(0));
    score = 0;
    gameRunning = true;
    document.getElementById('tetrisScore').innerText = score;
    piece = getNewPiece();
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
    for (let i = 0; i <= cols; i++) ctx.beginPath(), ctx.moveTo(i * blockSize, 0), ctx.lineTo(i * blockSize, canvas.height), ctx.stroke();
    
    // Board
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                ctx.fillStyle = cell;
                ctx.fillRect(c * blockSize, r * blockSize, blockSize - 1, blockSize - 1);
            }
        });
    });
    
    // Piece actuelle
    if (piece) {
        piece.blocks.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    ctx.fillStyle = piece.color;
                    ctx.fillRect((piece.x + c) * blockSize, (piece.y + r) * blockSize, blockSize - 1, blockSize - 1);
                }
            });
        });
    }
}

function gameLoop() {
    if (gameRunning && canMove(piece, 0, 1)) {
        piece.y++;
    } else if (gameRunning) {
        lock();
    }
    draw();
    setTimeout(gameLoop, 500);
}

piece = getNewPiece();
gameLoop();
