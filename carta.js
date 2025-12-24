const CORRECT_CODE = "1342";

const input = document.getElementById("codeInput");
const button = document.getElementById("unlockBtn");
const feedback = document.getElementById("codeFeedback");
const lockScreen = document.getElementById("lock-screen");
const letter = document.getElementById("letter");
const lock = document.getElementById("lock");
const starsContainer = document.getElementById("stars");

// CLICK EN DESBLOQUEAR
button.addEventListener("click", unlock);

// ENTER PARA DESBLOQUEAR
input.addEventListener("keydown", e => {
  if (e.key === "Enter") unlock();
});

function unlock() {
  const userCode = input.value.trim();

  if (userCode !== CORRECT_CODE) {
    feedback.textContent = "❌ Código incorrecto, probá de nuevo";
    feedback.style.color = "red";
    input.value = "";
    return;
  }

  // DESBLOQUEO CORRECTO
  feedback.textContent = "✨ Código correcto ✨";
  feedback.style.color = "green";

  input.disabled = true;
  button.disabled = true;

  // abrir candado
  lock.textContent = "🔓";
  lock.classList.add("open");

  // efectos
  createStars();
  startSnow();

  // mostrar carta
  setTimeout(() => {
    lockScreen.classList.add("hidden");
    letter.classList.remove("hidden");
  }, 2500);
}

// ⭐ ESTRELLAS
function createStars() {
  for (let i = 0; i < 25; i++) {
    const star = document.createElement("span");
    star.textContent = "⭐";
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.top = Math.random() * window.innerHeight + "px";
    starsContainer.appendChild(star);

    setTimeout(() => star.remove(), 2000);
  }
}

// ❄ NIEVE SIMPLE
function startSnow() {
  const canvas = document.getElementById("snow");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const flakes = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    s: Math.random() + 0.5
  }));

  function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";

    flakes.forEach(f => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      f.y += f.s;
      if (f.y > canvas.height) f.y = 0;
    });

    requestAnimationFrame(snow);
  }

  snow();
}
