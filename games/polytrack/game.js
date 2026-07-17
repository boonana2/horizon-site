// Preview tabs switcher setup
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Hide the homepage menu overlay and target keyboard inputs directly into the iframe
document.getElementById("start-play").addEventListener("click", () => {
  document.getElementById("preview").classList.add("hidden");
  
  // Shifts keyboard active state into the game container window directly
  const frame = document.getElementById("game-frame");
  if (frame) {
    frame.focus();
  }
});
