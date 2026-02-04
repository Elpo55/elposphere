const canvas = document.getElementById('pacmanCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

let pacman = {x: 1, y: 1};
let direction = {x: 0, y: 0};
let nextDirection = {x: 0, y: 0};
let pellets = [];
let ghosts = [];
let score = 0;
let gameRunning = true;

// Créer les pastilles
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.1) pellets.push({x: c, y: r});
    }
}

// Créer les fantômes
for (let i = 0; i < 3; i++) {
    ghosts.push({x: cols - 2, y: rows - 2, vx: Math.random() > 0.5 ? 1 : -1, vy: 0});
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') nextDirection = {x: 0, y: -1};
    if (e.key === 'ArrowDown') nextDirection = {x: 0, y: 1};
    if (e.key === 'ArrowLeft') nextDirection = {x: -1, y: 0};
    if (e.key === 'ArrowRight') nextDirection = {x: 1, y: 0};
});

function resetPacman() {
    pacman = {x: 1, y: 1};
    direction = {x: 0, y: 0};
    nextDirection = {x: 0, y: 0};
    pellets = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() > 0.1) pellets.push({x: c, y: r});
        }
    }
    score = 0;
    gameRunning = true;
    document.getElementById('pacmanScore').innerText = score;
}

function update() {
    direction = nextDirection;
    let newX = pacman.x + direction.x;
    let newY = pacman.y + direction.y;
    
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        pacman.x = newX;
        pacman.y = newY;
    }
    
    // Manger les pastilles
    pellets = pellets.filter(p => {
        if (p.x === pacman.x && p.y === pacman.y) {
            score += 10;
            document.getElementById('pacmanScore').innerText = score;
            return false;
        }
        return true;
    });
    
    // Mouvement fantômes
    ghosts.forEach(g => {
        g.x += g.vx;
        g.y += g.vy;
        if (g.x <= 0 || g.x >= cols - 1) g.vx *= -1;
        if (g.y <= 0 || g.y >= rows - 1) g.vy = (Math.random() > 0.5 ? 1 : -1);
        
        if (g.x === pacman.x && g.y === pacman.y) {
            gameRunning = false;
            alert('Game Over! Score: ' + score);
        }
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pastilles
    ctx.fillStyle = 'var(--primary)';
    pellets.forEach(p => {
        ctx.fillRect(p.x * gridSize + 8, p.y * gridSize + 8, 4, 4);
    });
    
    // Pacman
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0.2, Math.PI * 1.8);
    ctx.fill();
    
    // Fantômes
    ghosts.forEach((g, i) => {
        ctx.fillStyle = ['#FF0000', '#FFB6C1', '#00FFFF'][i];
        ctx.fillRect(g.x * gridSize + 2, g.y * gridSize + 2, gridSize - 4, gridSize - 4);
    });
}

function gameLoop() {
    if (gameRunning) update();
    draw();
    setTimeout(gameLoop, 150);
}

gameLoop();
