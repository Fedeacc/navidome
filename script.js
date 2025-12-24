// ======================
// CONFIGURACIÓN DEL JUEGO
// ======================
const gameData = [
  {
    day: 1,
    question: "¿en qué fecha fue nuestra primer salida? ¿Y qué alimento pediste?",
    answer: "08042025 muffin de arandanos",
    reward: "Muy bien!, 'UNO' de mis mejores recuerdos...sigamos..."
  },
  {
    day: 2,
    question: `
      <p>Escaneá este código, vas a encontrar un número escondido 💖</p>
      <img src="img/4f6fe476c6417f3e76a237ff2f0f5c55.png" class="qr-img">
    `,
    answer: "3",
    reward: "🎉 Muy bien. Segundo dígito desbloqueado."
  },
  {
    day: 3,
    question: `
      <p>🔦 Apagá las luces e introduce la cantidad de gallinas que veas...</p>
      <div id="lights-off">
        <span class="emoji e1">🐓</span>
        <span class="emoji e2">🐓</span>
        <span class="emoji e3">🐓</span>
        <span class="emoji e4">🐓</span>
        <span class="emoji e5">👌</span>
      </div>
    `,
    answer: "0",
    reward: "JAJAJA No hay gallinas… solo gallos. El siguiente dígito es la cantidad de gallos. Esa seguro te la comiste JAJAJAJA."
  },
  {
    day: 4,
    question: `
      <p>🎁 Tocá el regalo para desbloquear el día</p>
      <div id="escape-area">
        <div id="fake-gift">🎁</div>
      </div>
    `,
    answer: null,
    reward: "Espero que no se te haya complicado mucho... El digito es 2... Ya casi llegamos al final!"
  },
{
  day: 5,
  question: `
    <p style="font-size:1.4em; line-height:1.6;">
      Llegaste hasta acá.<br>
      Espero que te haya sacado una sonrisa.<br>
      Realicé esta web desde la ignorancia; con mucha paciencia,<br>
      y sobre todo...Amor.<br>
      Pero eso no es todo...
    </p>
    <p id="redirect-msg" style="margin-top:20px; font-style:italic;">
      Hacé click en el botón para ir a la carta final ❤️
    </p>
  `,
  answer: null,
  reward: "❤️"
}

];

// ======================
// PROGRESO
// ======================
let unlockedDay = parseInt(localStorage.getItem("unlockedDay"), 10);
if (isNaN(unlockedDay)) {
  unlockedDay = 1;
  localStorage.setItem("unlockedDay", unlockedDay);
}

// ======================
// FRONT
// ======================
const daysContainer = document.getElementById("days");
const gameDiv = document.getElementById("game");
const dayTitle = document.getElementById("dayTitle");
const questionText = document.getElementById("question");
const rewardDiv = document.getElementById("reward");
const feedback = document.getElementById("feedback");
const input = document.getElementById("answerInput");
const button = document.getElementById("answerBtn");
const realGift = document.getElementById("real-gift");


let currentDay = null;

// ======================
// CREAR BOTONES DE DÍAS
// ======================
gameData.forEach(data => {
  const div = document.createElement("div");
  div.classList.add("day");
  div.innerText = `Puzzle ${data.day}`;

  if (data.day > unlockedDay) {
    div.classList.add("locked");
  } else {
    div.onclick = () => startDay(data.day);
  }

  daysContainer.appendChild(div);
});

// ======================
// INICIAR DÍA
// ======================
function startDay(day) {
  currentDay = gameData.find(d => d.day === day);

  gameDiv.classList.remove("hidden");
  rewardDiv.classList.add("hidden");
  feedback.innerText = "";

  dayTitle.innerText = `Día ${currentDay.day}`;
  questionText.innerHTML = currentDay.question;

  // INPUT Y BOTÓN
  if (currentDay.day === 5) {
  input.style.display = "none";

  button.style.display = "";
  button.innerText = "Ir a la carta ❤️";

  button.onclick = () => {
    window.location.href = "carta.html";
  }; }else if (currentDay.answer === null) {
    input.style.display = "none";
    button.style.display = "none";
  } else {
    input.style.display = "";
    button.style.display = "";
    button.innerText = "Responder";
    button.onclick = checkAnswer;
  }

  // REGALO REAL (solo día 4)
  if (realGift) {
    if (day === 4) {
      realGift.style.opacity = "0";
      realGift.style.pointerEvents = "auto";
      realGift.onclick = desbloquearDia;
    } else {
      realGift.style.opacity = "0";
      realGift.style.pointerEvents = "none";
      realGift.onclick = null;
    }
  }

  // JUEGOS ESPECIALES
  setTimeout(() => {
    if (currentDay.day === 3) initLightsOff();
    if (currentDay.day === 4) initEscapeGift();
  }, 0);
}



// ======================
// RESPUESTAS
// ======================
function checkAnswer() {
  const userAnswer = input.value.toLowerCase().trim();

  if (userAnswer === currentDay.answer) {
    desbloquearDia();
  } else {
    feedback.innerText = "❌ Probá de nuevo 💕";
  }
if (currentDay.day === 5) {
  redirectToLetter();
}

  input.value = "";
}

// ======================
// DESBLOQUEAR DÍA
// ======================
function desbloquearDia() {
  feedback.innerText = "✨ Correcto ✨";
  feedback.style.color = "green";

  rewardDiv.innerText = currentDay.reward;
  rewardDiv.classList.remove("hidden");

  if (currentDay.day === unlockedDay) {
    unlockedDay++;
    localStorage.setItem("unlockedDay", unlockedDay);
    actualizarDias();
  }
}

function actualizarDias() {
  const buttons = document.querySelectorAll(".day");
  buttons.forEach((btn, i) => {
    if (i + 1 <= unlockedDay) {
      btn.classList.remove("locked");
      btn.onclick = () => startDay(i + 1);
    }
  });
}

// ======================
// JUEGO LINTERNA
// ======================
function initLightsOff() {
  const box = document.getElementById("lights-off");
  if (!box) return;

  box.addEventListener("mousemove", e => {
    const rect = box.getBoundingClientRect();
    box.style.setProperty("--x", e.clientX - rect.left + "px");
    box.style.setProperty("--y", e.clientY - rect.top + "px");
  });
}


// ======================
// JUEGO REGALO ESCAPISTA
// ======================
function initEscapeGift() {
  const fake = document.getElementById("fake-gift");
  if (!fake) return;

  const area = document.getElementById("escape-area");

  area.addEventListener("mousemove", e => {
    const rect = fake.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    if (Math.hypot(dx, dy) < 100) {
      const maxX = area.clientWidth - rect.width;
      const maxY = area.clientHeight - rect.height;

      fake.style.left = Math.random() * maxX + "px";
      fake.style.top = Math.random() * maxY + "px";
    }
  });

  fake.onclick = () => desbloquearDia();
}

// ======================
// NIEVE
// ======================
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const flakes = Array.from({ length: 120 }, () => ({
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

// ======================
// MÚSICA
// ======================
let musicStarted = false;

document.addEventListener("click", () => {
  if (musicStarted) return;

  const music = document.getElementById("bg-music");
  music.volume = 0;
  music.play();

  let v = 0;
  const fade = setInterval(() => {
    if (v < 0.25) {
      v += 0.01;
      music.volume = v;
    } else {
      clearInterval(fade);
    }
  }, 120);

  musicStarted = true;
}, { once: true });

function toggleMusic() {
  const music = document.getElementById("bg-music");
  music.paused ? music.play() : music.pause();
}

function redirectToLetter() {
  setTimeout(() => {
    window.location.href = "carta.html";
  }, 30000);
}

button.classList.add("final-btn");
