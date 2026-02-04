const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 80, paddleWidth = 10;
const ballSize = 5;

let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;
let playerScore = 0, aiScore = 0;

const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

function resetPong() {
    playerScore = 0;
    aiScore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 4;
    ballSpeedY = 4;
    updateScores();
}

function updateScores() {
    document.getElementById('playerScore').innerText = playerScore;
    document.getElementById('aiScore').innerText = aiScore;
}

function draw() {
    // Fond
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ligne du milieu
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Paddles
    ctx.fillStyle = 'var(--primary)';
    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 20, aiY, paddleWidth, paddleHeight);
    
    // Balle
    ctx.fillStyle = 'var(--primary)';
    ctx.fillRect(ballX - ballSize, ballY - ballSize, ballSize * 2, ballSize * 2);
}

function update() {
    // Mouvements du joueur
    if ((keys['ArrowUp'] || keys['z']) && playerY > 0) playerY -= 6;
    if ((keys['ArrowDown'] || keys['s']) && playerY < canvas.height - paddleHeight) playerY += 6;
    
    // IA (simple: suit la balle)
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 35) aiY += 4;
    if (aiCenter > ballY + 35) aiY -= 4;
    
    // Mouvements balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Collisions avec haut/bas
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) ballSpeedY *= -1;
    
    // Collisions avec paddles
    if (ballX - ballSize < 20 && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX *= -1;
        ballSpeedX *= 1.05;
    }
    if (ballX + ballSize > canvas.width - 20 && ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX *= -1;
        ballSpeedX *= 1.05;
    }
    
    // Points
    if (ballX < 0) { aiScore++; ballX = canvas.width / 2; ballY = canvas.height / 2; ballSpeedX = 4; updateScores(); }
    if (ballX > canvas.width) { playerScore++; ballX = canvas.width / 2; ballY = canvas.height / 2; ballSpeedX = -4; updateScores(); }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
