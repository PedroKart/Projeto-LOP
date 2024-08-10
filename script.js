// Variáveis para armazenar o Pac-Man, a comida, a pontuação, e o estado do jogo
let pacman = { x: 10, y: 10, direcao: 'direita' }; 
let comidas = [];
let pontuacao = 0;
let jogoPausado = false;
let tamanhoTabuleiro = 16;
let tamanhoCelula = 26;
let velocidade = 0.2; 
let respostaCorreta = null;
let mensagemErro = '';
let idPergunta = 0;
const perguntas = [
        { pergunta: 'Quanto é 2 + 3?', resposta: 5 },
        { pergunta: 'Quanto é 7 - 4?', resposta: 3 },
        { pergunta: 'Quanto é 5 * 2?', resposta: 10 },
        { pergunta: 'Quanto é 9 / 3?', resposta: 3 },
        { pergunta: 'Quanto é 12 + 8?', resposta: 20 },
        { pergunta: 'Quanto é 15 - 6?', resposta: 9 },
        { pergunta: 'Quanto é 3 * 4?', resposta: 12 },
        { pergunta: 'Quanto é 18 / 2?', resposta: 9 },
        { pergunta: 'Quanto é 20 - 5?', resposta: 15 },
        { pergunta: 'Quanto é 7 * 3?', resposta: 21 },
        { pergunta: 'Quanto é 25 + 14?', resposta: 39 },
        { pergunta: 'Quanto é 50 - 22?', resposta: 28 },
        { pergunta: 'Quanto é 8 * 7?', resposta: 56 },
        { pergunta: 'Quanto é 36 / 6?', resposta: 6 },
        { pergunta: 'Quanto é 14 * 2 + 10?', resposta: 38 },
        { pergunta: 'Quanto é 25 + 30 - 15?', resposta: 40 },
        { pergunta: 'Quanto é 9 * 5 + 4?', resposta: 49 },
        { pergunta: 'Quanto é 8 * 8 - 16?', resposta: 48 },
        { pergunta: 'Quanto é 100 / 4 + 25?', resposta: 50 },
        { pergunta: 'Quanto é 15 * 3 - 5?', resposta: 40 },
        { pergunta: 'Quanto é 18 / 2 + 7 * 2?', resposta: 25 },
        { pergunta: 'Quanto é 6 * 6 + 3 * 3?', resposta: 45 },
        { pergunta: 'Quanto é 40 + 20 / 5?', resposta: 44 },
        { pergunta: 'Quanto é 12 * 4 - 10 / 2?', resposta: 38 },
        { pergunta: 'Quanto é (5 * 5) + (3 * 3)?', resposta: 34 }
    ];

// Configuração inicial do jogo
function setup() {
    // Cria o canvas com o tamanho do tabuleiro
    createCanvas(tamanhoTabuleiro * tamanhoCelula, tamanhoTabuleiro * tamanhoCelula);
    
    // Define a posição inicial do Pac-Man no centro do tabuleiro
    pacman.x = Math.floor(tamanhoTabuleiro / 2);
    pacman.y = Math.floor(tamanhoTabuleiro / 2);
    
    // Gera a primeira pergunta e configura as comidas
    gerarPergunta();
    
    // Define a fonte padrão para o texto
    textFont('Arial');
}


// Desenhar os elementos do jogo a cada frame
function draw() {
    background(0);
    if (!jogoPausado) {
        moverPacman();
    }

    desenharPacman(pacman.x, pacman.y, pacman.direcao);
    desenharComidas();
    exibirMensagemErro();

    document.getElementById('score').textContent = 'Pontuação: ' + pontuacao;
}

// Função para desenhar o Pac-Man na tela
function desenharPacman(x, y, direcao) {
    fill(255, 255, 0); // Cor do Pac-Man
    let tm = PI / 16;
    let mI = tm * sin(frameCount * 0.1) + tm;
    let mF = TWO_PI - mI;

    push();
    translate(x * tamanhoCelula + tamanhoCelula / 2, y * tamanhoCelula + tamanhoCelula / 2);

    // Rotacionar o Pac-Man de acordo com a direção
    if (direcao === 'direita') {
        rotate(0);
    } else if (direcao === 'esquerda') {
        rotate(PI);
    } else if (direcao === 'cima') {
        rotate(-HALF_PI);
    } else if (direcao === 'baixo') {
        rotate(HALF_PI);
    }

    arc(0, 0, tamanhoCelula, tamanhoCelula, mI, mF, PIE);
    pop();
}

// Função para desenhar a comida na tela
function desenharComidas() {
    textAlign(CENTER, CENTER);
    textSize(tamanhoCelula / 2); // Ajustar o tamanho do texto
    fill(0); // Cor do texto

    for (let i = 0; i < comidas.length; i++) {
        let comida = comidas[i];
        
        if (!comida.comidaComida) {
            fill(255, 255, 255); // Cor da bola
            stroke(0); // Borda preta
            strokeWeight(2);
            ellipse(comida.x * tamanhoCelula + tamanhoCelula / 2, comida.y * tamanhoCelula + tamanhoCelula / 2, tamanhoCelula * 0.8);

            fill(0); // Cor do texto dentro da bola
            noStroke();
            text(comida.valor, comida.x * tamanhoCelula + tamanhoCelula / 2, comida.y * tamanhoCelula + tamanhoCelula / 2);
        }
    }
}

// Função para mover o Pac-Man
function moverPacman() {
    let moveu = false;

    // Verifica se a tecla para a esquerda está pressionada
    if (keyIsDown(LEFT_ARROW)) {
        pacman.x -= velocidade; // Move o Pac-Man para a esquerda
        pacman.direcao = 'esquerda'; // Define a direção para a esquerda
        if (pacman.x < 0) pacman.x = 0; // Garante que o Pac-Man não saia do tabuleiro
        moveu = true;
    } 
    // Verifica se a tecla para a direita está pressionada
    else if (keyIsDown(RIGHT_ARROW)) {
        pacman.x += velocidade; // Move o Pac-Man para a direita
        pacman.direcao = 'direita'; // Define a direção para a direita
        if (pacman.x >= tamanhoTabuleiro - 1) pacman.x = tamanhoTabuleiro - 1; // Garante que o Pac-Man não saia do tabuleiro
        moveu = true;
    } 
    // Verifica se a tecla para cima está pressionada
    else if (keyIsDown(UP_ARROW)) {
        pacman.y -= velocidade; // Move o Pac-Man para cima
        pacman.direcao = 'cima'; // Define a direção para cima
        if (pacman.y < 0) pacman.y = 0; // Garante que o Pac-Man não saia do tabuleiro
        moveu = true;
    } 
    // Verifica se a tecla para baixo está pressionada
    else if (keyIsDown(DOWN_ARROW)) {
        pacman.y += velocidade; // Move o Pac-Man para baixo
        pacman.direcao = 'baixo'; // Define a direção para baixo
        if (pacman.y >= tamanhoTabuleiro - 1) pacman.y = tamanhoTabuleiro - 1; // Garante que o Pac-Man não saia do tabuleiro
        moveu = true;
    }

    verificarColisaoComida(); // Verifica se o Pac-Man colidiu com a comida
}

// Função para gerar uma nova pergunta matemática
function gerarPergunta() {
    // Verifica se o índice da pergunta atual é maior ou igual ao número total de perguntas
    if (idPergunta >= perguntas.length) {
        idPergunta = 0; // Reinicia o índice para o início da lista de perguntas
    }
    
    // Obtém a pergunta atual com base no índice
    const perguntaAtual = perguntas[idPergunta];
    
    // Avança para a próxima pergunta
    idPergunta++;
    
    // Atualiza o texto da pergunta no HTML
    document.getElementById('question-text').textContent = perguntaAtual.pergunta;

    // Gera um array de respostas possíveis para a pergunta atual
    const respostas = gerarRespostas(perguntaAtual.resposta);

    // Cria a lista de comidas com base nas respostas geradas
    comidas = respostas.map(resposta => ({
        x: Math.floor(Math.random() * tamanhoTabuleiro), // Define a posição x aleatória para a comida
        y: Math.floor(Math.random() * tamanhoTabuleiro), // Define a posição y aleatória para a comida
        valor: resposta, // Define o valor da comida
        correta: resposta === perguntaAtual.resposta, // Marca se a comida é a resposta correta
        comidaComida: false // Inicialmente, a comida não foi comida
    }));
}

// Função para gerar respostas possíveis para a pergunta
function gerarRespostas(respostaCorreta) {
    const respostas = [respostaCorreta]; // Inicia o array de respostas com a resposta correta
    
    // Adiciona respostas erradas até que o array tenha 4 respostas
    while (respostas.length < 4) {
        const respostaErrada = Math.floor(Math.random() * 30); // Gera uma resposta errada aleatória
        if (!respostas.includes(respostaErrada)) { // Verifica se a resposta errada não está no array
            respostas.push(respostaErrada); // Adiciona a resposta errada ao array de respostas
        }
    }
    
    // Embaralha as respostas antes de retorná-las
    return respostas.sort(() => Math.random() - 0.5);
}



// Função para verificar se o Pac-Man colidiu com a comida
function verificarColisaoComida() {
    for (let i = 0; i < comidas.length; i++) {
        let comida = comidas[i];

        // Verifica se a comida ainda não foi comida e se há colisão com o Pac-Man
        if (!comida.comidaComida && dist(pacman.x * tamanhoCelula, pacman.y * tamanhoCelula, comida.x * tamanhoCelula, comida.y * tamanhoCelula) < tamanhoCelula / 2) {
            comida.comidaComida = true;

            // Se a comida for a resposta correta, aumenta a pontuação e gera uma nova pergunta
            if (comida.correta) {
                pontuacao += 15;
                gerarPergunta();
            } else {
                // Se a comida for a resposta errada, diminui a pontuação e exibe a mensagem de erro
                pontuacao -= 30;
                mensagemErro = 'Resposta Errada!';
                setTimeout(() => mensagemErro = '', 2000); // Limpa a mensagem após 2 segundos
            }
        }
    }
}

// Função para exibir a mensagem de erro
function exibirMensagemErro() {
    if (mensagemErro) {
        fill(255, 0, 0); // Cor vermelha
        textSize(32);
        textAlign(CENTER, CENTER);
        text(mensagemErro, width / 2, height / 2);
        textStyle(BOLD);

        // Exibir a pontuação abaixo da mensagem de erro
        textSize(24); // Ajustar o tamanho do texto da pontuação, se necessário
        text("- 30 Pontos", width / 2, (height / 2) + 40);
    }
}

