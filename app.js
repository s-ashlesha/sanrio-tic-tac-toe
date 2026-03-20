// ASSETS
const IMG_HK = 'assets/hello_kitty_character.png';
const IMG_CN = 'assets/cinnamoroll_player.png';

// CONSTANTS
const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// STATE
let board         = Array(9).fill(null);
let currentPlayer = 1;   // 1 = Hello Kitty, 2 = Cinnamoroll
let gameActive    = true;
let gameStarted   = false;

// ─── AUDIO ───────────────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.12, gain = 0.22) {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol); vol.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playPlace() { playTone(600, 'triangle', 0.10, 0.20); }
function playWin()   { [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f,'triangle',0.20,0.22), i*110)); }
function playDraw()  { playTone(350, 'sawtooth', 0.25, 0.18); }
function playClick() { playTone(440, 'triangle', 0.08, 0.14); }

// ─── DOM REFERENCES ──────────────────────────────────────────
const grid     = document.getElementById('grid');
const statusEl = document.getElementById('statusBubble');
const mainBtn  = document.getElementById('mainBtn');
const btnLabel = document.getElementById('btnLabel');
const cardP1   = document.getElementById('card-p1');
const cardP2   = document.getElementById('card-p2');

// ─── BUTTON HELPERS ──────────────────────────────────────────
function setButtonRestart() {
  mainBtn.className = 'clay-btn state-restart';
  mainBtn.querySelector('.btn-icon').textContent = '↺';
  btnLabel.textContent = 'Restart';
  mainBtn.setAttribute('aria-label', 'Restart Game');
  mainBtn.onclick = restartGame;
}

function setButtonNewGame() {
  mainBtn.className = 'clay-btn state-new';
  mainBtn.querySelector('.btn-icon').textContent = '✦';
  btnLabel.textContent = 'New Game';
  mainBtn.setAttribute('aria-label', 'New Game');
  mainBtn.onclick = newGame;
}

// ─── GRID ────────────────────────────────────────────────────
function buildGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${i + 1}`);
    cell.dataset.index = i;
    cell.addEventListener('click', onCellClick);
    grid.appendChild(cell);
  }
}

// ─── GAME LOGIC ──────────────────────────────────────────────
function onCellClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (!gameActive || board[idx]) return;

  if (!gameStarted) {
    gameStarted = true;
    setButtonRestart();
  }

  board[idx] = currentPlayer;
  renderToken(e.currentTarget, currentPlayer);
  e.currentTarget.classList.add('taken');
  playPlace();

  const winner = checkWinner();
  if (winner) {
    handleWin(winner);
  } else if (board.every(Boolean)) {
    handleDraw();
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
    updateActiveCard();
  }
}

function renderToken(cell, player) {
  const img = document.createElement('img');
  img.className = 'cell-token';
  img.src = player === 1 ? IMG_HK : IMG_CN;
  img.alt = player === 1 ? 'Hello Kitty' : 'Cinnamoroll';
  cell.appendChild(img);
}

function checkWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function handleWin({ player, line }) {
  gameActive = false;
  line.forEach(idx => grid.children[idx].classList.add('win-cell'));
  const name = player === 1 ? 'Hello Kitty' : 'Cinnamoroll';
  statusEl.textContent = `🏆 ${name} Wins!`;
  statusEl.className = 'status-bubble win';
  playWin();
  launchConfetti(player);
}

function handleDraw() {
  gameActive = false;
  statusEl.textContent = `🌸 It's a Draw!`;
  statusEl.className = 'status-bubble draw';
  playDraw();
}

function updateStatus() {
  const name  = currentPlayer === 1 ? 'Hello Kitty' : 'Cinnamoroll';
  const emoji = currentPlayer === 1 ? '🎀' : '🥐';
  statusEl.textContent = `${emoji} ${name}'s Turn!`;
  statusEl.className = 'status-bubble';
}

function updateActiveCard() {
  cardP1.classList.toggle('active-p', currentPlayer === 1);
  cardP2.classList.toggle('active-p', currentPlayer === 2);
}

// ─── CONFETTI ────────────────────────────────────────────────
function launchConfetti(player) {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = player === 1
    ? ['#F7C8D0','#FFDDE2','#FFB5C8','#FFF0F4','#F0A8B8']
    : ['#CFE7FF','#A8CEFF','#D8F0FF','#E8F4FF','#80BFFF'];

  const particles = Array.from({length: 80}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.3 - 40,
    r: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.random() * 20 - 10,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 2 + 1.5,
    shape: Math.random() > 0.5 ? 'circle' : 'heart'
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speed;
      p.angle += p.tiltSpeed;
      p.x += Math.sin(p.angle) * 1.2;
      p.tilt += p.tiltSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tilt * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 140);
      ctx.beginPath();
      if (p.shape === 'heart') {
        const s = p.r * 0.5;
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s, -s*2, s*2.2, s*0.5, 0, s*2);
        ctx.bezierCurveTo(-s*2.2, s*0.5, -s, -s*2, 0, -s);
      } else {
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    });
    frame++;
    if (frame < 160) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ─── GAME CONTROLS ───────────────────────────────────────────
function restartGame() {
  board         = Array(9).fill(null);
  currentPlayer = 1;
  gameActive    = true;
  gameStarted   = true;
  buildGrid();
  updateStatus();
  updateActiveCard();
  statusEl.className = 'status-bubble';
  playClick();
}

function newGame() {
  gameStarted   = true;
  board         = Array(9).fill(null);
  currentPlayer = 1;
  gameActive    = true;
  buildGrid();
  updateStatus();
  updateActiveCard();
  statusEl.className = 'status-bubble';
  setButtonRestart();
  playClick();
}

// ─── INIT ────────────────────────────────────────────────────
setButtonNewGame();
buildGrid();
updateStatus();