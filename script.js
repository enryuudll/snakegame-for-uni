// dom элементы
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highscoreList = document.getElementById("highscoreList");
const playerNameInput = document.getElementById("playerName");
const pausedOverlay = document.getElementById("pausedOverlay");
const startBtn = document.getElementById("startBtn");

// игровые константы
const boxSize = 20;
const gridWidth = canvas.width / boxSize;
const gridHeight = canvas.height / boxSize;

// гейм статус
let snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let paused = false;
let gameStarted = false;
let interval;

// позиция яблока
let apple = {
	x: Math.floor(Math.random() * gridWidth) * boxSize,
	y: Math.floor(Math.random() * gridHeight) * boxSize,
};

// кнопка старта
startBtn.addEventListener("click", () => {
	if (!gameStarted) {
		gameStarted = true;
		startBtn.disabled = true;
		interval = setInterval(gameLoop, 120);
	}
});

// инпут
document.addEventListener("keydown", (e) => {
	const key = e.key.toUpperCase();
	if (key === "P") {
		paused = !paused;
		pausedOverlay.style.display = paused ? "block" : "none";
		return;
  }

	// логическое управление
	if (key === "W" && direction !== "DOWN") nextDirection = "UP";
	else if (key === "S" && direction !== "UP") nextDirection = "DOWN";
	else if (key === "A" && direction !== "RIGHT") nextDirection = "LEFT";
	else if (key === "D" && direction !== "LEFT") nextDirection = "RIGHT";
});

// луп
function gameLoop() {
	if (paused) return;

	// очистка
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	moveSnake();

	drawSnake();
	drawApple();
}

// мувмент змеи и коллизия
function moveSnake() {
	direction = nextDirection;
	const head = { ...snake[0] };

	// Update head position
	switch (direction) {
		case "LEFT":  head.x -= boxSize; break;
		case "UP":    head.y -= boxSize; break;
		case "RIGHT": head.x += boxSize; break;
		case "DOWN":  head.y += boxSize; break;
	}

	// проход сквозь стены
	if (head.x < 0) head.x = canvas.width - boxSize;
	else if (head.x >= canvas.width) head.x = 0;
	if (head.y < 0) head.y = canvas.height - boxSize;
	else if (head.y >= canvas.height) head.y = 0;

	// самоколлизия
	if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
		saveHighScore();
		alert("Game Over!");
		location.reload();
		return;
	}

	snake.unshift(head);

	// коллизия яблока
	if (head.x === apple.x && head.y === apple.y) {
		score += 10;
		scoreDisplay.textContent = score;
		apple = {
			x: Math.floor(Math.random() * gridWidth) * boxSize,
			y: Math.floor(Math.random() * gridHeight) * boxSize,
		};
	} else {
		snake.pop(); // remove tail
	}
}

// змея(голова светлее тело темнее)+яблоко
function drawSnake() {
	snake.forEach((segment, index) => {
		ctx.fillStyle = index === 0 ? "#0f0" : "#090";
		ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
	});
}

function drawApple() {
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(apple.x + boxSize / 2, apple.y + boxSize / 2, boxSize / 2, 0, 2 * Math.PI);
	ctx.fill();
}

// сохранение скора
function saveHighScore() {
	const name = playerNameInput.value.trim() || "Guest";
	const highScores = JSON.parse(localStorage.getItem("snakeHighScores")) || [];

	highScores.push({ name, score });
	highScores.sort((a, b) => b.score - a.score);
	localStorage.setItem("snakeHighScores", JSON.stringify(highScores.slice(0, 10)));
}

// дисплей скоров
function displayHighScores() {
	const highScores = JSON.parse(localStorage.getItem("snakeHighScores")) || [];
	highscoreList.innerHTML = highScores.map(s => `<li>${s.name}: ${s.score}</li>`).join("");
}

displayHighScores();
