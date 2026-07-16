// Preview tabs: Gallery / Description / Controls
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  });
});

// Launch Poly Track directly in a new window/tab 
// This completely bypasses Chrome's local iframe security blocks!
document.getElementById("start-play").addEventListener("click", () => {
  window.open("polytrack.html", "_blank");
});
