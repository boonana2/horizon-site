// Preview tabs panel setup
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Clear menu overlay on Play click
document.getElementById("start-play").addEventListener("click", () => {
  document.getElementById("preview").classList.add("hidden");
  
  // Set focus directly onto the game inside the frame box
  const iframe = document.getElementById("game-iframe");
  if (iframe) {
    iframe.focus();
  }
});
