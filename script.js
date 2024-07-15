let pacman = { x: 10, y: 10, direction: 'right' }; // Iniciar no meio
let food;
let score = 0;
let gamePaused = false;
let boardSize = 20;
let cellSize = 20;
let speed = 0.2; // Velocidade reduzida
let foodEaten = false; // Controle de comida

const questions = [
    { question: "Qual é a capital da França?", answers: ["Paris", "paris"] },
    { question: "Quanto é 5 + 7?", answers: ["12"] },
    { question: "Qual é o maior planeta do nosso sistema solar?", answers: ["Júpiter", "júpiter"] }
];
let currentQuestion = null;

function preload() {
    // Carregar a fonte do Font Awesome
    foodIcon = loadFont('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/webfonts/fa-solid-900.woff');
}

function setup() {
    createCanvas(boardSize * cellSize, boardSize * cellSize);
    pacman.x = Math.floor(boardSize / 2); // Colocar Pac-Man no centro
    pacman.y = Math.floor(boardSize / 2);
    food = generateFood();
    textFont(foodIcon); // Configurar fonte para Font Awesome
}

function draw() {
    background(0);
    if (!gamePaused) {
        movePacman();
    }

    drawPacman(pacman.x, pacman.y, pacman.direction);

    // Desenhar a comida se não tiver sido comida
    if (!foodEaten) {
        drawFood(food.x, food.y);
    }

    document.getElementById('score').textContent = 'Pontuação: ' + score;
}

function drawPacman(x, y, direction) {
    fill(255, 255, 0);
    let tm = PI / 16;
    let mI = tm * sin(frameCount * 0.1) + tm;
    let mF = TWO_PI - mI;

    push();
    translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);

    if (direction === 'right') {
        rotate(0);
    } else if (direction === 'left') {
        rotate(PI);
    } else if (direction === 'up') {
        rotate(-HALF_PI);
    } else if (direction === 'down') {
        rotate(HALF_PI);
    }

    arc(0, 0, cellSize, cellSize, mI, mF, PIE);
    pop();
}

function drawFood(x, y) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(cellSize);
    text('\uf5d1', x * cellSize + cellSize / 2, y * cellSize + cellSize / 2); // ícone de maçã
}

function movePacman() {
    let moved = false;
    if (keyIsDown(LEFT_ARROW)) {
        pacman.x -= speed;
        pacman.direction = 'left';
        if (pacman.x < 0) pacman.x = 0; // Borda esquerda
        moved = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        pacman.x += speed;
        pacman.direction = 'right';
        if (pacman.x >= boardSize - 1) pacman.x = boardSize - 1; // Borda direita
        moved = true;
    }
    if (keyIsDown(UP_ARROW)) {
        pacman.y -= speed;
        pacman.direction = 'up';
        if (pacman.y < 0) pacman.y = 0; // Borda superior
        moved = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
        pacman.y += speed;
        pacman.direction = 'down';
        if (pacman.y >= boardSize - 1) pacman.y = boardSize - 1; // Borda inferior
        moved = true;
    }

    // Checar se comeu a comida usando a distância
    if (dist(pacman.x * cellSize, pacman.y * cellSize, food.x * cellSize, food.y * cellSize) < cellSize / 2) {
        foodEaten = true; // Marca a comida como comida
        askQuestion();
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    };
}

function askQuestion() {
    gamePaused = true;
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById('question-text').textContent = currentQuestion.question;
    document.getElementById('question').style.display = 'block';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    const correctAnswers = currentQuestion.answers.map(answer => answer.toLowerCase());

    if (correctAnswers.includes(userAnswer)) {
        score += 10; // Aumenta a pontuação
        food = generateFood(); // Gera nova comida
        foodEaten = false; // Reseta o controle da comida
    }
    document.getElementById('question').style.display = 'none';
    document.getElementById('answer-input').value = '';
    gamePaused = false;
}

document.getElementById('submit-answer').addEventListener('click', checkAnswer);
