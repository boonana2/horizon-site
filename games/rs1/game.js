// Preview tabs panel setup
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Clear menu overlay and dynamically spawn the game iframe on Play click
document.getElementById("start-play").addEventListener("click", () => {
  // Hide the preview overlay menu
  document.getElementById("preview").classList.add("hidden");
  
  const container = document.getElementById("game-container");
  if (container) {
    // Clear any existing content just in case
    container.innerHTML = "";
    
    // Create the iframe dynamically
    const iframe = document.createElement("iframe");
    iframe.id = "game-iframe";
    iframe.src = "rooftopsnipers1.html"; // Load the game cleanly
    
    // Append it to our container
    container.appendChild(iframe);
    
    // Focus the iframe so keyboard controls work instantly
    iframe.onload = () => {
      iframe.focus();
    };
  }
});
