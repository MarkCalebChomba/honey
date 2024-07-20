const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth - 20; // Subtracting some margin
    canvas.height = window.innerHeight - 100; // Subtracting space for controls
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const gameWidth = canvas.width;
const gameHeight = canvas.height;

const nahima = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    speed: 5,
    img: new Image()
};
nahima.img.src = 'images/nahima.jpg'; // Replace with the path to your character image

let level = 1;
let obstacles = [];
let treasures = [];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadLevel(level) {
    // Generate random obstacles
    obstacles = [];
    for (let i = 0; i < level + 2; i++) { // Increase number of obstacles with each level
        obstacles.push({
            x: getRandomInt(50, gameWidth - 100),
            y: getRandomInt(50, gameHeight - 100),
            width: 50,
            height: 50,
        });
    }
    
    // Generate random treasures
    treasures = [];
    for (let i = 0; i < 2; i++) {
        treasures.push({
            x: getRandomInt(50, gameWidth - 70),
            y: getRandomInt(50, gameHeight - 70),
            width: 20,
            height: 20,
        });
    }
}

function drawNahima() {
    ctx.drawImage(nahima.img, nahima.x, nahima.y, nahima.width, nahima.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawTreasures() {
    ctx.fillStyle = 'gold';
    treasures.forEach(treasure => {
        ctx.fillRect(treasure.x, treasure.y, treasure.width, treasure.height);
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function moveNahima(direction) {
    switch (direction) {
        case 'up':
            nahima.y -= nahima.speed;
            break;
        case 'down':
            nahima.y += nahima.speed;
            break;
        case 'left':
            nahima.x -= nahima.speed;
            break;
        case 'right':
            nahima.x += nahima.speed;
            break;
    }
}

function detectCollision() {
    for (let obstacle of obstacles) {
        if (nahima.x < obstacle.x + obstacle.width &&
            nahima.x + nahima.width > obstacle.x &&
            nahima.y < obstacle.y + obstacle.height &&
            nahima.y + nahima.height > obstacle.y) {
            alert('Game Over!');
            resetGame();
            return;
        }
    }
    treasures.forEach((treasure, index) => {
        if (nahima.x < treasure.x + treasure.width &&
            nahima.x + nahima.width > treasure.x &&
            nahima.y < treasure.y + treasure.height &&
            nahima.y + nahima.height > treasure.y) {
            treasures.splice(index, 1);
        }
    });
    if (treasures.length === 0) {
        level++;
        alert('You Win! Level ' + level);
        resetGame();
    }
}

function resetGame() {
    nahima.x = 50;
    nahima.y = 50;
    loadLevel(level);
}

function gameLoop() {
    clearCanvas();
    drawNahima();
    drawObstacles();
    drawTreasures();
    detectCollision();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            moveNahima('up');
            break;
        case 'ArrowDown':
            moveNahima('down');
            break;
        case 'ArrowLeft':
            moveNahima('left');
            break;
        case 'ArrowRight':
            moveNahima('right');
            break;
    }
});

document.getElementById('up').addEventListener('click', () => moveNahima('up'));
document.getElementById('down').addEventListener('click', () => moveNahima('down'));
document.getElementById('left').addEventListener('click', () => moveNahima('left'));
document.getElementById('right').addEventListener('click', () => moveNahima('right'));

nahima.img.onload = () => {
    loadLevel(level);
    gameLoop();
};
