const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 576;

const sizeOfGap = 3;
const numberOfRows = 5;
const tilesInRow = 8;
const tileHeight = 25;
const tileWidth = 120;
const platformWidth = 250;
const platformHeight = 15;
const platformSpeed = 15;
const ballSize = 10;

let verticalSpeed = -7;
let horizontalSpeed = 7;
let pBallAngle = -(Math.random() * (Math.PI / 2) + Math.PI / 4);
let platformX = (canvas.width / 2) - (platformWidth / 2);
let platformY = canvas.height - platformHeight;
let ballY = canvas.height - platformHeight - ballSize;
let ballX = (platformX + (platformWidth / 2)) - (ballSize / 2);
let isRunning = false;

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    }
}

let tiles = {};


function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, platformY, platformWidth, platformHeight);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawTiles() {
    for (let i = 0; i < tilesInRow; i++) {
        for (let j = 0; j < numberOfRows; j++) {
            if (tiles[i][j].status == 1) {
                const tileX = (i * (tileWidth + sizeOfGap) + 10);
                const tileY = (j * (tileHeight + sizeOfGap) + 10);
                tiles[i][j].x = tileX;
                tiles[i][j].y = tileY;
                ctx.beginPath();
                ctx.rect(tileX, tileY, tileWidth, tileHeight);
                ctx.fillStyle = 'blue';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let i = 0; i < tilesInRow; i++) {
        for (let j = 0; j < numberOfRows; j++) {
            const tile = tiles[i][j];

            if (tile.status == 1 && (ballX > tile.x && ballX < tile.x + tileWidth && ballY > tile.y && ballY < tile.y + tileHeight)) {
                verticalSpeed = -verticalSpeed;
                tile.status = 0;
            }
        }
    }

    checkCode();
}

function checkCode() {
    let count = 0;
    const keyPanel = document.querySelector('.key');
    for (let i = 0; i < tilesInRow; i++) {
        for (let j = 0; j < numberOfRows; j++) {
            const tile = tiles[i][j];
            if (tile.status === 1) {
                count++;
            }
        }
    }

    if (count === 3) {
        keyPanel.innerHTML = '4***';
    } else if (count === 2) {
        keyPanel.innerHTML = '48**';

    } else if (count === 1) {
        keyPanel.innerHTML = '481*';

    } else if (count === 0) {
        keyPanel.innerHTML = '4814';
    }
}

function draw() {
    drawTiles();
    drawPlatform();
    drawBall();
    collisionDetection();

    if (isEndGame()) {
        isRunning = false;
        const gameEnd = document.querySelector('.end');
        gameEnd.style.display = 'block';
        return;
    }

    if (ballX + horizontalSpeed > canvas.width - ballSize || ballX + horizontalSpeed < ballSize) {
        horizontalSpeed = -horizontalSpeed;
    }

    if (ballY + verticalSpeed < ballSize) {
        verticalSpeed = -verticalSpeed;
    } else if (ballY + verticalSpeed > platformY - ballSize) {
        if (ballX + ballSize > platformX && ballX - ballSize < platformX + platformWidth) {
            if (ballY = ballY - platformHeight) {
                pBallAngle = ((platformX + platformWidth / 2) - ballX) * 0.05;
                horizontalSpeed = horizontalSpeed + pBallAngle;
                verticalSpeed = -verticalSpeed;
            }
        } else {
            isRunning = false;
            const gameOver = document.querySelector('.game-over');
            gameOver.style.display = 'block';
        }
    }

    if (keys.d.pressed && platformX + platformWidth + platformSpeed < canvas.width) {
        platformX += platformSpeed;
    } else if (keys.a.pressed && platformX - platformSpeed > 0) {
        platformX -= platformSpeed;
    }

    ballX += horizontalSpeed;
    ballY += verticalSpeed;
}

function isEndGame() {
    for (let i = 0; i < tilesInRow; i++) {
        for (let j = 0; j < numberOfRows; j++) {
            const tile = tiles[i][j];
            if (tile.status === 1) {
                return false;
            }
        }
    }

    return true;
}

function loop() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isRunning) {
        draw();
        window.requestAnimationFrame(loop);
    }
}

window.addEventListener('load', ev => {
    const btnPlay = document.querySelector('.play');
    btnPlay.addEventListener('click', startGame);

    const btnRestart = document.querySelector('.restart');
    btnRestart.addEventListener('click', startGame);
})

function startGame() {
    verticalSpeed = -7;
    horizontalSpeed = 7;
    pBallAngle = -(Math.random() * (Math.PI / 2) + Math.PI / 4);
    platformX = (canvas.width / 2) - (platformWidth / 2);
    platformY = canvas.height - platformHeight;
    ballY = canvas.height - platformHeight - ballSize;
    ballX = (platformX + (platformWidth / 2)) - (ballSize / 2);
    isRunning = true;

    const keyPanel = document.querySelector('.key');
    keyPanel.innerHTML = '****';

    hideAllWindows();
    generateNewTiles();
    loop();
}

function hideAllWindows() {
    const start = document.querySelector('.start');
    const gameOver = document.querySelector('.game-over');
    const end = document.querySelector('.end');

    start.style.display = 'none';
    gameOver.style.display = 'none';
    end.style.display = 'none';
}

function generateNewTiles() {
    tiles = {};

    for (let i = 0; i < tilesInRow; i++) {
        tiles[i] = {};

        for (let j = 0; j < numberOfRows; j++) {
            tiles[i][j] = {x: 0, y: 0, status: 1};
        }
    }
}


window.addEventListener('keydown', ev => {
    switch (ev.key) {
        case 'a':
            keys.a.pressed = true;
            break;

        case 'd':
            keys.d.pressed = true;
            break;
    }
});

window.addEventListener('keyup', ev => {
    switch (ev.key) {
        case 'a':
            keys.a.pressed = false;
            break;

        case 'd':
            keys.d.pressed = false;
            break;
    }
});
