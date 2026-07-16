const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const GRAVITY = 0.65;
const MOVE_SPEED = 4.2;
const JUMP_FORCE = -13.5;
const FRICTION = 0.85;
const AIR_FRICTION = 0.95;

const platform = { x: 130, y: 400, w: 640, h: 24 };
const blast = { left: -80, right: W + 80, bottom: H + 100 };

// Decorative background (fixed once, drawn every frame behind the action
// so the arena doesn't feel empty at the edges)
const STAR_COUNT = 45;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * W,
  y: Math.random() * platform.y * 0.85,
  r: Math.random() * 1.4 + 0.4,
  o: Math.random() * 0.5 + 0.2,
}));

function makeFighter(opts) {
  return {
    name: opts.name,
    color: opts.color,
    x: opts.x,
    y: 300,
    vx: 0,
    vy: 0,
    w: 42,
    h: 58,
    facing: opts.facing,
    grounded: false,
    damage: 0,
    stocks: 3,
    attackCooldown: 0,
    attackFlash: 0,
    invincible: 0,
    spawnX: opts.x,
    controls: opts.controls,
    isCPU: opts.isCPU || false,
    aiTimer: 0,
  };
}

let p1, p2, mode = null, running = false, keys = {};

function resetFighters() {
  p1 = makeFighter({ name: "Blaze", color: "#FF7A33", x: 300, facing: 1, controls: { left: "a", right: "d", jump: "w", attack: "f" } });
  p2 = makeFighter({ name: "Volt", color: "#6EA8FF", x: 560, facing: -1, controls: { left: "ArrowLeft", right: "ArrowRight", jump: "ArrowUp", attack: "/" }, isCPU: mode === "cpu" });
}

document.addEventListener("keydown", e => { keys[e.key] = true; });
document.addEventListener("keyup", e => { keys[e.key] = false; });

// Preview screen -> mode select menu
document.getElementById("start-play").addEventListener("click", () => {
  document.getElementById("preview").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
});

// Mode select menu -> back to preview
document.getElementById("back-to-preview").addEventListener("click", () => {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("preview").classList.remove("hidden");
});

// Winner screen -> back to preview (instead of an immediate rematch)
document.getElementById("winner-back").addEventListener("click", () => {
  running = false;
  document.getElementById("winner").classList.add("hidden");
  document.getElementById("preview").classList.remove("hidden");
});

document.getElementById("mode-2p").addEventListener("click", () => startGame("2p"));
document.getElementById("mode-cpu").addEventListener("click", () => startGame("cpu"));
document.getElementById("rematch").addEventListener("click", () => startGame(mode));

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("winner").classList.add("hidden");
  resetFighters();
  running = true;
}

function applyPhysics(f) {
  f.vy += GRAVITY;
  f.x += f.vx;
  f.y += f.vy;
  f.vx *= f.grounded ? FRICTION : AIR_FRICTION;

  f.grounded = false;
  if (
    f.y + f.h >= platform.y &&
    f.y + f.h - f.vy <= platform.y + 4 &&
    f.x + f.w > platform.x &&
    f.x < platform.x + platform.w
  ) {
    f.y = platform.y - f.h;
    f.vy = 0;
    f.grounded = true;
  }

  if (f.attackCooldown > 0) f.attackCooldown--;
  if (f.attackFlash > 0) f.attackFlash--;
  if (f.invincible > 0) f.invincible--;
}

function tryAttack(attacker, defender) {
  if (attacker.attackCooldown > 0) return;
  attacker.attackCooldown = 28;
  attacker.attackFlash = 8;

  const reach = 46;
  const originX = attacker.facing === 1 ? attacker.x + attacker.w : attacker.x - reach;
  const hit =
    originX < defender.x + defender.w &&
    originX + reach > defender.x &&
    attacker.y < defender.y + defender.h &&
    attacker.y + attacker.h > defender.y;

  if (hit && defender.invincible === 0) {
    defender.damage += 8;
    const power = 4 + defender.damage * 0.11;
    defender.vx = attacker.facing * power;
    defender.vy = -power * 0.55;
  }
}

function checkKO(f) {
  if (f.x < blast.left || f.x > blast.right || f.y > blast.bottom) {
    f.stocks--;
    f.damage = 0;
    f.x = f.spawnX;
    f.y = 100;
    f.vx = 0;
    f.vy = 0;
    f.invincible = 90;
  }
}

function handleInput(f, opponent) {
  if (f.isCPU) {
    runAI(f, opponent);
    return;
  }
  const c = f.controls;
  if (keys[c.left]) { f.vx = -MOVE_SPEED; f.facing = -1; }
  if (keys[c.right]) { f.vx = MOVE_SPEED; f.facing = 1; }
  if (keys[c.jump] && f.grounded) { f.vy = JUMP_FORCE; f.grounded = false; }
  if (keys[c.attack]) tryAttack(f, opponent);
}

function runAI(f, opponent) {
  f.aiTimer--;
  const dx = opponent.x - f.x;
  const dist = Math.abs(dx);
  f.facing = dx > 0 ? 1 : -1;

  if (dist > 60) {
    f.vx = f.facing * MOVE_SPEED * 0.85;
  } else if (f.aiTimer <= 0) {
    tryAttack(f, opponent);
    f.aiTimer = 20 + Math.random() * 25;
  }

  if (f.grounded && opponent.y < f.y - 40 && Math.random() < 0.03) {
    f.vy = JUMP_FORCE;
    f.grounded = false;
  }
  if (f.grounded && f.x < platform.x + 20 && Math.random() < 0.02) f.vx = MOVE_SPEED;
  if (f.grounded && f.x > platform.x + platform.w - 60 && Math.random() < 0.02) f.vx = -MOVE_SPEED;
}

function drawBackground() {
  // warm glow behind the platform, echoing the homepage hero
  const glow = ctx.createRadialGradient(W / 2, platform.y - 30, 20, W / 2, platform.y - 30, 460);
  glow.addColorStop(0, "rgba(255, 122, 51, 0.16)");
  glow.addColorStop(0.5, "rgba(255, 122, 51, 0.05)");
  glow.addColorStop(1, "rgba(255, 122, 51, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // stars
  stars.forEach(s => {
    ctx.globalAlpha = s.o;
    ctx.fillStyle = "#F3EDF7";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // distant skyline silhouettes on either side, so the far edges
  // don't sit empty next to the platform
  ctx.fillStyle = "#1B1436";
  ctx.beginPath();
  ctx.moveTo(0, platform.y + 24);
  ctx.lineTo(0, platform.y - 70);
  ctx.lineTo(65, platform.y - 100);
  ctx.lineTo(135, platform.y - 60);
  ctx.lineTo(210, platform.y - 110);
  ctx.lineTo(285, platform.y - 45);
  ctx.lineTo(285, platform.y + 24);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(W, platform.y + 24);
  ctx.lineTo(W, platform.y - 70);
  ctx.lineTo(W - 65, platform.y - 105);
  ctx.lineTo(W - 145, platform.y - 55);
  ctx.lineTo(W - 225, platform.y - 115);
  ctx.lineTo(W - 300, platform.y - 50);
  ctx.lineTo(W - 300, platform.y + 24);
  ctx.closePath();
  ctx.fill();

  // ground fade beneath the platform level
  const groundFade = ctx.createLinearGradient(0, platform.y + 24, 0, H);
  groundFade.addColorStop(0, "#1B1436");
  groundFade.addColorStop(1, "#130F28");
  ctx.fillStyle = groundFade;
  ctx.fillRect(0, platform.y + 24, W, H - (platform.y + 24));
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawBackground();

  ctx.fillStyle = "#251B23";
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
  ctx.fillStyle = "#FF7A33";
  ctx.fillRect(platform.x, platform.y, platform.w, 3);

  [p1, p2].forEach(f => {
    ctx.globalAlpha = f.invincible > 0 && f.invincible % 10 < 5 ? 0.3 : 1;
    ctx.fillStyle = f.attackFlash > 0 ? "#FFFFFF" : f.color;
    ctx.fillRect(f.x, f.y, f.w, f.h);

    ctx.fillStyle = "#130F28";
    const eyeX = f.facing === 1 ? f.x + f.w - 12 : f.x + 4;
    ctx.fillRect(eyeX, f.y + 14, 8, 8);

    if (f.attackFlash > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      const hx = f.facing === 1 ? f.x + f.w : f.x - 46;
      ctx.fillRect(hx, f.y + 10, 46, f.h - 20);
    }
    ctx.globalAlpha = 1;
  });

  drawHud(p1, 20, "left");
  drawHud(p2, W - 20, "right");
}

function drawHud(f, x, align) {
  ctx.textAlign = align;
  ctx.font = "600 15px Lexend, sans-serif";
  ctx.fillStyle = "#F3EDF7";
  ctx.fillText(f.name, x, 32);
  ctx.font = "700 22px Lexend, sans-serif";
  ctx.fillStyle = "#FF7A33";
  ctx.fillText(Math.round(f.damage) + "%", x, 58);
  ctx.font = "14px Inter, sans-serif";
  ctx.fillStyle = "#9089A3";
  ctx.fillText("Stocks: " + f.stocks, x, 78);
}

function showWinner(text) {
  running = false;
  document.getElementById("winner-text").textContent = text;
  document.getElementById("winner").classList.remove("hidden");
}

function loop() {
  if (running) {
    handleInput(p1, p2);
    handleInput(p2, p1);
    applyPhysics(p1);
    applyPhysics(p2);
    checkKO(p1);
    checkKO(p2);
    draw();

    if (p1.stocks <= 0) showWinner(p2.name + " Wins!");
    if (p2.stocks <= 0) showWinner(p1.name + " Wins!");
  }
  requestAnimationFrame(loop);
}

loop();
