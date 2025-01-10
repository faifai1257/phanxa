const nameEntry = document.getElementById("name-entry");
const gameContainer = document.getElementById("game-container");
const playerNameInput = document.getElementById("player-name");
const startGameButton = document.getElementById("start-game-button");
const playerDisplayName = document.getElementById("player-display-name");

const redLight = document.getElementById("red-light");
const yellowLight = document.getElementById("yellow-light");
const greenLight = document.getElementById("green-light");
const statusText = document.getElementById("status");
const reactionTimeDisplay = document.getElementById("time");
const highScoreDisplay = document.getElementById("high-time");
const toggleSoundButton = document.getElementById("toggle-sound");

const redSound = document.getElementById("red-sound");
const yellowSound = document.getElementById("yellow-sound");
const greenSound = document.getElementById("green-sound");
const successSound = document.getElementById("success-sound");
const failSound = document.getElementById("fail-sound");

let reactionStartTime = null;
let gameRunning = false;
let allowClick = false;
let highScore = localStorage.getItem("highScore") || null;
let playerName = localStorage.getItem("playerName") || "";
let soundEnabled = true;

// Hiển thị tên người chơi
if (!playerName) {
  nameEntry.style.display = "block";
} else {
  loadGame();
}

// Lưu tên và bắt đầu
startGameButton.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Vui lòng nhập tên!");
    return;
  }
  localStorage.setItem("playerName", playerName);
  loadGame();
});

function loadGame() {
  nameEntry.style.display = "none";
  gameContainer.style.display = "block";
  playerDisplayName.textContent = playerName;
  if (highScore) highScoreDisplay.textContent = `${highScore} ms`;
  startGame();
}

// Reset game
function startGame() {
  resetLights();
  statusText.textContent = "Chờ tín hiệu...";
  reactionTimeDisplay.textContent = "--";
  gameRunning = true;
  allowClick = false;

  setTimeout(() => {
    if (gameRunning) {
      setLight("green");
      reactionStartTime = Date.now();
      statusText.textContent = "Bấm ngay!";
      allowClick = true;
    }
  }, Math.random() * 3000 + 2000); // Thời gian chờ ngẫu nhiên từ 2-5 giây
}

// Xử lý khi nhấn
document.body.addEventListener("click", () => {
  if (!gameRunning) return;

  if (!allowClick) {
    // Nhấn quá sớm
    playSound(failSound);
    statusText.textContent = "Bạn nhấn quá sớm! Trò chơi sẽ bắt đầu lại sau 5 giây...";
    resetLights();
    gameRunning = false;

    setTimeout(startGame, 5000); // Tự động bắt đầu lại sau 5 giây
    return;
  }

  if (reactionStartTime) {
    // Phản xạ thành công
    const reactionTime = Date.now() - reactionStartTime;
    reactionTimeDisplay.textContent = `${reactionTime} ms`;

    if (!highScore || reactionTime < highScore) {
      highScore = reactionTime;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = `${highScore} ms`;
    }

    playSound(successSound);
    statusText.textContent = "Phản xạ thành công! Trò chơi sẽ bắt đầu lại sau 5 giây...";
    gameRunning = false;
    allowClick = false;

    setTimeout(startGame, 5000); // Tự động bắt đầu lại sau 5 giây
  }
});

// Điều khiển âm thanh
toggleSoundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  toggleSoundButton.textContent = soundEnabled ? "Tắt âm thanh" : "Bật âm thanh";
});

function resetLights() {
  redLight.classList.add("active");
  yellowLight.classList.remove("active");
  greenLight.classList.remove("active");
  reactionStartTime = null;
  allowClick = false;
  playSound(redSound);
}

function setLight(color) {
  redLight.classList.remove("active");
  yellowLight.classList.remove("active");
  greenLight.classList.remove("active");

  if (color === "red") {
    redLight.classList.add("active");
    playSound(redSound);
  } else if (color === "yellow") {
    yellowLight.classList.add("active");
    playSound(yellowSound);
  } else if (color === "green") {
    greenLight.classList.add("active");
    playSound(greenSound);
  }
}

function playSound(sound) {
  if (soundEnabled) {
    sound.currentTime = 0;
    sound.play();
  }
}
