document.addEventListener('DOMContentLoaded', function() {
    // Login Section
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('password');
    const loginContainer = document.getElementById('login-container');
    const gameContainer = document.getElementById('game-container');
    const validPasswords = ["11022024", "11/02/2024", "11-02-2024", "11.02.2024", "11 02 2024"];

    loginButton.onclick = intentarLogin;

    passwordInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            intentarLogin();
        }
    });

    function intentarLogin() {
        const clean = passwordInput.value.replace(/\D/g, '');
        if (validPasswords.some(p => p.replace(/\D/g, '') === clean)) {
            loginContainer.style.display = 'none';
            gameContainer.style.display = 'block';
        } else {
            alert("Contraseña incorrecta");
        }
    }

    // Game Section
    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const continueButton = document.getElementById('continueButton');
    const retryButton = document.getElementById('retryButton');
    const polo = document.getElementById('polo');
    const moni = document.getElementById('moni');
    const kiki = document.getElementById('kiki');

    let poloPosition = 0;
    let moniPosition = 0;
    let kikiPosition = -50;
    let poloSpeed = 0;
    let moniSpeed = 1.2;
    let kikiSpeed = 2;
    let gameInterval;
    let isGameActive = false;
    let kikiActive = false;
    const pistaAncho = 100;
    const finishLine = pistaAncho - 10;

    startButton.onclick = startGame;
    continueButton.onclick = () => {
        gameContainer.style.display = 'none';
        document.getElementById('question-container').style.display = 'block';
        loadQuestion();
    };
    retryButton.onclick = startGame;

    document.addEventListener('keydown', e => {
        if (isGameActive && e.code === 'Space') {
            e.preventDefault();
            poloSpeed = 2.7;
        }
    });

    function startGame() {
        poloPosition = 0;
        moniPosition = 0;
        kikiPosition = -50;
        poloSpeed = 0;
        kikiActive = false;
        isGameActive = true;
        startScreen.style.display = 'none';
        endScreen.style.display = 'none';
        gameInterval = setInterval(updateGame, 20);
    }

    function updateGame() {
        poloPosition += poloSpeed;
        moniPosition += moniSpeed;
        if (!kikiActive && moniPosition > 30) kikiActive = true;
        if (kikiActive) kikiPosition += kikiSpeed;
        poloSpeed *= 0.9;
        polo.style.left = poloPosition + '%';
        moni.style.left = moniPosition + '%';
        kiki.style.left = kikiPosition + '%';
        if (poloPosition >= finishLine) endGame(true);
        else if (moniPosition >= finishLine) endGame(false, "¡Moni ganó!");
        else if (kikiActive && kikiPosition >= poloPosition - 5) endGame(false, "¡Kiki te atrapó!");
    }

    function endGame(win, msg = "") {
        clearInterval(gameInterval);
        isGameActive = false;
        document.getElementById('endTitle').textContent = win ? "¡Felicitaciones mi amor!" : "¡Oh no!";
        document.getElementById('endMessage').textContent = win ? "Sabía que podías ganarle a Kiki ❤️" : msg;
        endScreen.style.display = 'flex';
        if (win) {
            continueButton.style.display = 'block';
            retryButton.style.display = 'none';
        } else {
            continueButton.style.display = 'none';
            retryButton.style.display = 'block';
        }
    }

    // Questions Section
    const questionEl = document.getElementById('question');
    const answerGrid = document.getElementById('answer-grid');
    const questions = [
        { question: "¿Dónde nos dimos nuestro primer beso?", options: ["En un XV", "En mi casa", "En el colegio", "En tu casa"], answer: "En un XV" },
    ];
    let current = 0;

    function loadQuestion() {
        const q = questions[current];
        questionEl.textContent = q.question;
        answerGrid.innerHTML = "";
        showOptions(q);
    }

    function showOptions(q) {
        q.options.sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(opt, btn);
            answerGrid.appendChild(btn);
        });
    }

    function checkAnswer(opt, btn) {
        if (opt === questions[current].answer) {
            btn.classList.add('correct');
            setTimeout(() => {
                current++;
                if (current < questions.length) {
                    loadQuestion();
                } else {
                    showFinal();
                }
            }, 800);
        } else {
            btn.classList.add('incorrect');
        }
    }

    function showFinal() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('final-message').style.display = 'block';
    }
});
