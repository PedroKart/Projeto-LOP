// Define o estado inicial do Pac-Man, comida, pontuação e outras variáveis do jogo
let pacman = { x: 10, y: 10, direction: 'right' };
let foods = [];
let score = 0;
let gamePaused = false;
let boardSize = 20;
let cellSize = 26;
let speed = 0.2;
let currentQuestionIndex = 0;

// Lista de perguntas e respostas
const questions = [
    { question: "Quanto é 2 + 2?", answer: 4 },
    { question: "Quanto é 5 x 3?", answer: 15 },
    { question: "Quanto é 10 - 7?", answer: 3 },
    { question: "Quanto é 6 / 2?", answer: 3 },
    // Adicione mais perguntas aqui
];

// Função de configuração inicial do jogo
function setup() {
    createCanvas(boardSize * cellSize, boardSize * cellSize); // Cria o canvas
    pacman.x = Math.floor(boardSize / 2); // Posiciona o Pac-Man no centro do tabuleiro
    pacman.y = Math.floor(boardSize / 2);
    generateQuestion(); // Gera a primeira pergunta
    textFont('Arial'); // Define a fonte do texto
}

// Função principal do jogo que é chamada repetidamente
function draw() {
    background(0); // Define o fundo como preto
    if (!gamePaused) { // Se o jogo não estiver pausado
        movePacman(); // Move o Pac-Man
    }

    drawPacman(pacman.x, pacman.y, pacman.direction); // Desenha o Pac-Man
    drawFoods(); // Desenha a comida

    document.getElementById('score').textContent = 'Pontuação: ' + score; // Atualiza a pontuação na tela
}

// Função que desenha o Pac-Man
function drawPacman(x, y, direction) {
    fill(255, 255, 0); // Cor amarela para o Pac-Man
    let tm = PI / 16; // Ângulo mínimo da boca
    let mI = tm * sin(frameCount * 0.1) + tm; // Ângulo inicial da boca
    let mF = TWO_PI - mI; // Ângulo final da boca

    push();
    translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2); // Posiciona o Pac-Man no lugar correto

    // Define a direção do Pac-Man
    if (direction === 'right') {
        rotate(0);
    } else if (direction === 'left') {
        rotate(PI);
    } else if (direction === 'up') {
        rotate(-HALF_PI);
    } else if (direction === 'down') {
        rotate(HALF_PI);
    }

    // Desenha o Pac-Man com boca aberta e fechando
    arc(0, 0, cellSize, cellSize, mI, mF, PIE);
    pop();
}

// Função que desenha as comidas (respostas)
function drawFoods() {
    textAlign(CENTER, CENTER);
    textSize(cellSize / 2); // Ajuste o tamanho do texto
    fill(0); // Cor do texto

    for (let food of foods) {
        if (!food.eaten) { // Se a comida não foi comida
            fill(255, 255, 255); // Cor da bola
            stroke(0); // Borda preta
            strokeWeight(2);
            ellipse(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize * 0.8); // Desenha a bola

            fill(0); // Cor do texto dentro da bola
            noStroke();
            text(food.value, food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2); // Desenha o valor da resposta
        }
    }
}

// Função que move o Pac-Man
function movePacman() {
    let moved = false;
    if (keyIsDown(LEFT_ARROW)) { // Se a tecla seta para esquerda está pressionada
        pacman.x -= speed;
        pacman.direction = 'left';
        if (pacman.x < 0) pacman.x = 0;
        moved = true;
    }
    if (keyIsDown(RIGHT_ARROW)) { // Se a tecla seta para direita está pressionada
        pacman.x += speed;
        pacman.direction = 'right';
        if (pacman.x >= boardSize - 1) pacman.x = boardSize - 1;
        moved = true;
    }
    if (keyIsDown(UP_ARROW)) { // Se a tecla seta para cima está pressionada
        pacman.y -= speed;
        pacman.direction = 'up';
        if (pacman.y < 0) pacman.y = 0;
        moved = true;
    }
    if (keyIsDown(DOWN_ARROW)) { // Se a tecla seta para baixo está pressionada
        pacman.y += speed;
        pacman.direction = 'down';
        if (pacman.y >= boardSize - 1) pacman.y = boardSize - 1;
        moved = true;
    }

    checkFoodCollision(); // Verifica se o Pac-Man comeu alguma comida
}

// Função que gera uma pergunta e posiciona as respostas no tabuleiro
function generateQuestion() {
    const questionData = questions[currentQuestionIndex]; // Pega a pergunta atual
    document.getElementById('question-text').textContent = questionData.question; // Mostra a pergunta na tela

    const answers = generateAnswers(questionData.answer); // Gera respostas (correta e erradas)

    foods = answers.map(answer => ({
        x: Math.floor(Math.random() * boardSize), // Posiciona a resposta em uma posição aleatória no tabuleiro
        y: Math.floor(Math.random() * boardSize),
        value: answer,
        correct: answer === questionData.answer, // Marca a resposta correta
        eaten: false
    }));
}

// Função que gera respostas (uma correta e outras erradas)
function generateAnswers(correctAnswer) {
    const answers = [correctAnswer]; // Começa com a resposta correta
    while (answers.length < 4) { // Gera até ter 4 respostas
        const wrongAnswer = Math.floor(Math.random() * 20); // Gera uma resposta errada
        if (!answers.includes(wrongAnswer)) { // Certifica-se de que não há respostas duplicadas
            answers.push(wrongAnswer);
        }
    }
    return answers.sort(() => Math.random() - 0.5); // Embaralha as respostas
}

// Função que verifica se o Pac-Man comeu alguma comida
function checkFoodCollision() {
    for (let food of foods) {
        if (!food.eaten && dist(pacman.x * cellSize, pacman.y * cellSize, food.x * cellSize, food.y * cellSize) < cellSize / 2) {
            food.eaten = true;
            if (food.correct) { // Se a comida é a resposta correta
                score += 10; // Aumenta a pontuação
                currentQuestionIndex = (currentQuestionIndex + 1) % questions.length; // Passa para a próxima pergunta
                generateQuestion(); // Gera a próxima pergunta
            }
        }
    }
}
