// Preview tabs: Gallery / Description / Controls
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Play Button: Load the game directly in the SAME tab!
document.getElementById("start-play").addEventListener("click", () => {
  // Seamlessly swap the tab's location to your local game file.
  // This bypasses the iframe security block, running the physics engine natively!
  window.location.href = "polytrack.html";
});
