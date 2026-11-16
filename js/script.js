
/* =========================================
   ELEMENTOS DO HTML
========================================= */

const passwordInput = document.getElementById("password");
const checkButton = document.getElementById("check-button");
const message = document.getElementById("message");

const attemptsDisplay = document.getElementById("attempts");
const historyList = document.getElementById("history-list");

const overview = document.getElementById("overview");
const restartButton = document.getElementById("restart-button");

const lockout = document.getElementById("lockout");
const lockoutRestart = document.getElementById("lockout-restart");

const vaultScene = document.querySelector(".vault-scene");
const vaultLabel = document.getElementById("vault-label");


/* =========================================
   VARIÁVEIS DO JOGO
========================================= */

let secretPassword;
let attempts = 0;
let gameFinished = false;

const MAX_ATTEMPTS = 7;


/* =========================================
   INICIAR OU REINICIAR O JOGO
========================================= */

function startGame() {

    // Gera uma senha aleatória entre 1 e 50
    secretPassword = Math.floor(Math.random() * 50) + 1;

    attempts = 0;
    gameFinished = false;

    // Atualiza o contador
    attemptsDisplay.textContent = "00";

    // Limpa o campo
    passwordInput.value = "";

    passwordInput.disabled = false;
    checkButton.disabled = false;

    // Mensagem inicial
    message.textContent = "AGUARDANDO AUTENTICAÇÃO...";
    message.className = "message";


    // FECHA O COFRE
    vaultScene.classList.remove("opened");

    vaultLabel.innerHTML = `
        <span class="red-light"></span>
        SECURITY LOCK ENGAGED
    `;


    // Fecha as telas de resultado
    overview.classList.remove("active");
    lockout.classList.remove("active");


    // Reinicia o histórico
    historyList.innerHTML = `
        <p class="log-entry">
            <span>[SYSTEM]</span>
            Novo protocolo iniciado.
        </p>

        <p class="log-entry">
            <span>[SYSTEM]</span>
            Aguardando código de acesso...
        </p>
    `;

    passwordInput.focus();

}


/* =========================================
   ADICIONAR REGISTRO AO HISTÓRICO
========================================= */

function addHistory(text) {

    const entry = document.createElement("p");

    entry.classList.add("log-entry");

    const time = new Date().toLocaleTimeString("pt-BR");

    const timestamp = document.createElement("span");

    timestamp.textContent = `[${time}]`;

    entry.appendChild(timestamp);

    entry.appendChild(
        document.createTextNode(" " + text)
    );

    historyList.prepend(entry);

}


/* =========================================
   ABRIR O COFRE
========================================= */

function openVault() {

    // Ativa a animação 3D da porta
    vaultScene.classList.add("opened");

    // Atualiza o indicador de segurança
    vaultLabel.innerHTML = `
        <span class="green-light"></span>
        SECURITY LOCK RELEASED
    `;

    // Registra a abertura
    addHistory("Mecanismo de segurança liberado.");

    addHistory("Porta do cofre aberta.");

}


/* =========================================
   BLOQUEAR O SISTEMA
========================================= */

function blockSystem() {

    gameFinished = true;

    passwordInput.disabled = true;
    checkButton.disabled = true;

    message.textContent =
        "ACESSO NEGADO. LIMITE DE TENTATIVAS ATINGIDO.";

    message.className = "message error";

    addHistory("ERRO CRÍTICO: limite de tentativas atingido.");

    addHistory("Sistema de segurança ativado.");

    setTimeout(() => {

        lockout.classList.add("active");

    }, 500);

}


/* =========================================
   VERIFICAR A SENHA
========================================= */

function checkPassword() {

    // Impede novas tentativas após o fim do jogo
    if (gameFinished) return;

    const guess = Number(passwordInput.value);


    // Validação do campo
    if (
        passwordInput.value.trim() === "" ||
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > 50
    ) {

        message.textContent =
            "ERRO: DIGITE UM NÚMERO ENTRE 1 E 50.";

        message.className = "message error";

        return;

    }


    // Conta a tentativa
    attempts++;

    attemptsDisplay.textContent =
        String(attempts).padStart(2, "0");


    // SENHA MENOR QUE A CORRETA
    if (guess < secretPassword) {

        message.textContent = "A SENHA É MAIOR!";

        message.className = "message error";

        addHistory(
            "Código " + guess + ": a senha é maior."
        );

    }


    // SENHA MAIOR QUE A CORRETA
    else if (guess > secretPassword) {

        message.textContent = "A SENHA É MENOR!";

        message.className = "message error";

        addHistory(
            "Código " + guess + ": a senha é menor."
        );

    }


    // SENHA CORRETA
    else {

        message.textContent =
            "CÓDIGO CORRETO. ACESSO AUTORIZADO!";

        message.className = "message success";

        addHistory("Código confirmado com sucesso.");

        gameFinished = true;

        passwordInput.disabled = true;
        checkButton.disabled = true;

        // Abre a porta
        openVault();

        // Mostra a tela de vitória após a animação
        setTimeout(() => {

            overview.classList.add("active");

        }, 2200);

        return;

    }


    // Limpa o campo após a tentativa
    passwordInput.value = "";


    // Verifica se acabou o limite
    if (attempts >= MAX_ATTEMPTS) {

        blockSystem();

        return;

    }


    // Informa quantas tentativas restam
    const remaining = MAX_ATTEMPTS - attempts;

    message.textContent +=
        " TENTATIVAS RESTANTES: " + remaining + ".";

    passwordInput.focus();

}


/* =========================================
   EVENTOS DOS BOTÕES
========================================= */

checkButton.addEventListener("click", checkPassword);

restartButton.addEventListener("click", startGame);

lockoutRestart.addEventListener("click", startGame);


/* =========================================
   TECLA ENTER
========================================= */

passwordInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        checkPassword();
    }

});


/* =========================================
   INICIALIZAÇÃO
========================================= */

startGame();
