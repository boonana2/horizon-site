// Preview tabs panel setup
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Clear menu overlay and initialize game load on Play click
document.getElementById("start-play").addEventListener("click", () => {
  document.getElementById("preview").classList.add("hidden");
  
  const iframe = document.getElementById("game-iframe");
  if (iframe) {
    // Read the stored game file name and inject it into the iframe src attribute
    const gameUrl = iframe.getAttribute("data-src");
    if (gameUrl && !iframe.src) {
      iframe.src = gameUrl;
    }
    
    // Pass control focus into the loading viewport
    iframe.focus();
  }
});
