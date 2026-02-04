const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount)};
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let score = 0;
let gameRunning = true;

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = {x: 0, y: -1};
    if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = {x: 0, y: 1};
    if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = {x: -1, y: 0};
    if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = {x: 1, y: 0};
});

function resetSnake() {
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    score = 0;
    gameRunning = true;
    document.getElementById('snakeScore').innerText = score;
}

function update() {
    direction = nextDirection;
    const head = snake[0];
    const newHead = {x: head.x + direction.x, y: head.y + direction.y};
    
    // Vérifier collision avec murs
    if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
        gameRunning = false;
        alert('Game Over! Score: ' + score);
        return;
    }
    
    // Vérifier collision avec soi-même
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        gameRunning = false;
        alert('Game Over! Score: ' + score);
        return;
    }
    
    snake.unshift(newHead);
    
    // Vérifier nourriture
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('snakeScore').innerText = score;
        food = {x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount)};
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    
    // Serpent
    ctx.fillStyle = 'var(--primary)';
    snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? 'var(--primary)' : 'rgba(0, 242, 255, 0.7)';
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
    
    // Nourriture
    ctx.fillStyle = 'var(--accent)';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    if (gameRunning) update();
    draw();
    setTimeout(gameLoop, 100);
}

gameLoop();
