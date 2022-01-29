var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

id = null;

var score = 0;
var lifes = 3;
var gameOver = false;
var gameWin = false;
var isRandomColor = false;

var paddle = new Object();
paddle.height = 10;
paddle.width = 75;
paddle.x = (canvas.width - paddle.width) / 2;
paddle.y = canvas.height - paddle.height;
paddle.dx = 5;

var ball = new Object();
ball.radius = 10;
ball.x = canvas.width / 2;
ball.y = canvas.height - 30;
ball.dx = 3;
ball.dy = -3;

var brick = new Object();
brick.rowCount = 3;
brick.columnCount = 5;
brick.padding = 10;
brick.offsetTop = 30;
brick.offsetLeft = 30;
brick.width = 75;
brick.height = 20;

var key = new Object();
key.leftPressed = false;
key.rightPressed = false;

var bricks = [];
var color = "#0095DD";

function initBrickMatrix() {
    bricks = [];
    for (var c = 0; c < brick.columnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brick.rowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brick.columnCount; c++) {
        for (var r = 0; r < brick.rowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brick.width + brick.padding)) + brick.offsetLeft;
                var brickY = (r * (brick.height + brick.padding)) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brick.width, brick.height);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLifes() {
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText("Lives: " + lifes, canvas.width - 65, 20);
}

function drawString(text, x, y) {
    ctx.font = "32px Arial";
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function collision() {
    for (var c = 0; c < brick.columnCount; c++) {
        for (var r = 0; r < brick.rowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1)
                if (ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;
                    // ball.dx += 0.5;
                    // ball.dy += 0.5;
                    if (score == brick.rowCount * brick.columnCount) {
                        gameWin = true;
                    }
                }
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", refreshHandler);
document.addEventListener("keypress", refreshHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        key.rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        key.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        key.rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        key.leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var mouse = e.clientX - canvas.offsetLeft;
    if (mouse > 0 && mouse < canvas.width) {
        paddle.x = mouse - paddle.width / 2;
        if (paddle.x < 0)
            paddle.x = 0;
        else if (paddle.x + paddle.width > canvas.width)
            paddle.x = canvas.width - paddle.width;

    }
}

function refreshHandler(e) {
     if (gameWin || gameOver) document.location.reload();
 }

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLifes();
    collision();
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawString("GAME OVER", canvas.width / 2, canvas.height / 3);
        drawString("Score: " + score, canvas.width / 2, canvas.height / 2);
        clearInterval(id);
    }
    if (gameWin) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawString("GAME WIN", canvas.width / 2, canvas.height / 3);
        drawString("Score: " + score, canvas.width / 2, canvas.height / 2);
        clearInterval(id);
    }


    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    }
    else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        }

        else {
            lifes--;
            if (!lifes) {
                gameOver = true;
            }
            else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 3;
                ball.dy = -3;
                paddle.x = (canvas.width - paddle.width) / 2;
            }

        }
    }
    if (key.rightPressed) {
        paddle.x += paddle.dx;
        if (paddle.x + paddle.width > canvas.width)
            paddle.x = canvas.width - paddle.width;

    }
    else if (key.leftPressed) {
        paddle.x -= paddle.dx;
        if (paddle.x < 0)
            paddle.x = 0;
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function getRandomColor() {
    color = '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function activeRandomColor() {
    isRandomColor = !isRandomColor;
    if (isRandomColor) {
        colorId = setInterval(getRandomColor, 200);
    }
    else {
        clearInterval(colorId);
        color = "#0095DD";
    }
}

function createGame() {
    if (id != null) clearInterval(id);
    score = 0;
    lifes = 3;
    gameOver = false;
    gameWin = false;

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 3;
    ball.dy = -3;
    paddle.x = (canvas.width - paddle.width) / 2;

    var level = document.getElementById('level').value;
    switch (level) {
        case 'Beginner':
            canvas.width = 480;
            canvas.height = 320;
            brick.rowCount = 3;
            brick.columnCount = 5;
            lifes = 3;
            break;
        case 'Intermediate':
            canvas.width = 960;
            canvas.height = 640;
            brick.rowCount = 6;
            brick.columnCount = 10;
            lifes = 5;
            break;
        case 'Expert':
            canvas.width = 1440;
            canvas.height = 960;
            brick.rowCount = 9;
            brick.columnCount = 15;
            lifes = 6;
            break;
        case 'Custom':
            canvas.width = document.getElementById('canvasWidth').value;
            canvas.height = document.getElementById('canvasHeight').value;
            brick.rowCount = document.getElementById('brickRowCount').value;
            brick.columnCount = document.getElementById('brickColumnCount').value;
            lifes = document.getElementById('lifes').value;
            break;

    }

    initBrickMatrix();
    id = setInterval(draw, 10);
}

function activeCustom() {
    var level = document.getElementById('level').value;
    if (level == 'Custom') {
        var temps = document.getElementsByClassName('temp');
        for (let i = 0; i < temps.length; i++) {
            temps[i].classList.remove('class-hidden');
        }
    }
    else {
        var temps = document.getElementsByClassName('temp');
        for (let i = 0; i < temps.length; i++) {
            temps[i].classList.add('class-hidden');
        }
    }
}