document.addEventListener("DOMContentLoaded", () => {
    const creditsBtn = document.getElementById("credits");
    const instructionsBtn = document.getElementById("instructions");
    const creditsModal = document.getElementById("credits-modal");
    const instructionsModal = document.getElementById("instructions-modal");

    creditsBtn?.addEventListener("click", () => creditsModal?.showModal());
    instructionsBtn?.addEventListener("click", () => instructionsModal?.showModal());

    // Initialize game in ready state
    resetGame();
});

const sign = document.getElementById("sign");
const gameCard = document.getElementById("game");
const input = document.getElementById("input");
const timer = document.getElementById("timer");
const score = document.getElementById("score");

let scoreValue = 0;
let timerValue = 60;
let timerInterval;
let gameStarted = false;
let startTime;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
// Store current letter to check against
let currentLetter = "";

function resetGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    scoreValue = 0;
    timerValue = 60;

    score.textContent = `Score: ${scoreValue}`;
    timer.textContent = `${timerValue.toFixed(2)}s`;

    input.disabled = false;
    input.value = "";
    input.placeholder = "Type to start...";
    input.focus();

    showRandomSign();
}

function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    startTime = Date.now();
    input.placeholder = "Type here...";

    // Start loop
    timerInterval = setInterval(updateTimer, 10);
}

function showRandomSign() {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    currentLetter = randomLetter;
    sign.src = `./letters/${randomLetter}.jpg`;
}

function updateTimer() {
    timerValue = (60000 - (Date.now() - startTime)) / 1000;
    // Prevent floating point errors
    if (timerValue <= 0) {
        timerValue = 0;
    }
    timer.textContent = `${timerValue.toFixed(2)}s`;

    if (timerValue <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    input.disabled = true;
    input.value = "";
    timer.textContent = "Game Over";

    setTimeout(() => {
        const playAgain = confirm("Game Over! Score: " + scoreValue + "\nPlay again?");
        if (playAgain) {
            resetGame();
        }
    }, 100);
}

function flashCard(type) {
    gameCard.classList.remove("correct", "incorrect");
    void gameCard.offsetWidth;
    gameCard.classList.add(type);
    setTimeout(() => {
        gameCard.classList.remove(type);
    }, 500);
}

input.addEventListener("input", (e) => {
    // Start game on first input if not started
    if (!gameStarted) {
        startTimer();
    }

    const val = input.value.trim().toUpperCase();

    if (val.length === 0) return;

    if (val === currentLetter) {
        // Correct
        scoreValue++;
        score.textContent = `Score: ${scoreValue}`;
        flashCard("correct");
        showRandomSign();
        input.value = "";
    } else {
        // Incorrect
        flashCard("incorrect");
        input.value = "";
    }
});