// Preview tabs: Gallery / Description / Controls
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Preview screen -> Launch Poly Track
document.getElementById("start-play").addEventListener("click", () => {
  // Hide the preview overlay
  document.getElementById("preview").classList.add("hidden");
  
  // Create the iframe and load polytrack.html only AFTER clicking play
  const container = document.getElementById("game-container");
  const iframe = document.createElement("iframe");
  iframe.src = "polytrack.html";
  iframe.allowFullscreen = true;
  iframe.title = "Poly Track";
  
  // Append the game to the screen
  container.appendChild(iframe);
  
  // Focus the iframe automatically so keyboard controls work immediately
  iframe.onload = () => {
    iframe.focus();
  };
});
