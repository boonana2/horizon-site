// 1. Preview Screen Tabs Switcher Configuration
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// 2. Main Play Intercept Initialization
document.getElementById("start-play").addEventListener("click", () => {
  // Hide the initial preview cover screen
  document.getElementById("preview").classList.add("hidden");

  // Find the canvas elements that PolyTrack auto-generated on load
  const gameCanvas = document.querySelector('canvas');
  const container = document.getElementById('polytrack-container');

  // Move the canvas into our stylized grid platform container
  if (gameCanvas && container) {
    container.appendChild(gameCanvas);
    gameCanvas.focus();
  }
});
