document.addEventListener('DOMContentLoaded', () => {
  // Elements for main screen overlays
  const startPlayBtn = document.getElementById('start-play');
  const previewOverlay = document.getElementById('preview');
  const menuOverlay = document.getElementById('menu');
  const backBtn = document.getElementById('back-to-preview');
  const mode2pBtn = document.getElementById('mode-2p');
  const modeCpuBtn = document.getElementById('mode-cpu');

  // Elements for tab switching (Gallery, Description, Controls)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // --- 1. HANDLE TAB SWITCHING ---
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');

      const targetPanelId = button.getAttribute('data-tab');
      const targetPanel = document.querySelector(`[data-panel="${targetPanelId}"]`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --- 2. OVERLAY NAVIGATION ---
  if (startPlayBtn && previewOverlay && menuOverlay) {
    startPlayBtn.addEventListener('click', () => {
      previewOverlay.classList.add('hidden');
      menuOverlay.classList.remove('hidden');
    });
  }

  if (backBtn && previewOverlay && menuOverlay) {
    backBtn.addEventListener('click', () => {
      menuOverlay.classList.add('hidden');
      previewOverlay.classList.remove('hidden');
    });
  }

  const launchGame = () => {
    if (menuOverlay) menuOverlay.classList.add('hidden');
    if (previewOverlay) previewOverlay.classList.add('hidden');
    
    const gameCanvas = document.getElementById('screen');
    if (gameCanvas) {
      gameCanvas.focus();
    }
  };

  if (mode2pBtn) mode2pBtn.addEventListener('click', launchGame);
  if (modeCpuBtn) modeCpuBtn.addEventListener('click', launchGame);
});
