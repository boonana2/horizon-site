// 1. Preview Screen Tabs Switcher Configuration
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    
    const panel = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
    if (panel) panel.classList.add("active");
  });
});

// 2. Main Play Intercept Initialization
document.getElementById("start-play").addEventListener("click", () => {
  // Hide the initial preview cover screen using display: none directly to bypass CSS cascades
  const previewOverlay = document.getElementById("preview");
  if (previewOverlay) {
    previewOverlay.style.display = "none";
  }

  // Find the canvas element that PolyTrack auto-generated on load
  const gameCanvas = document.querySelector('canvas');
  const container = document.getElementById('polytrack-container');

  // Move the canvas into our stylized grid platform container box
  if (gameCanvas && container) {
    container.appendChild(gameCanvas);
    gameCanvas.focus();
    
    // Force a resize trigger so the game re-centers inside the new box bounds
    window.dispatchEvent(new Event('resize'));
  }
});
