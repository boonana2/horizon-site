// ---------------------------------------------------------
// Add a new game by adding one object to this list.
// slug = the folder name inside /games/ that holds the game.
// If a game isn't built yet, set ready: false and it'll show
// as a locked tile instead of a broken link.
// ---------------------------------------------------------
const games = [
  { title: "Summit Smash", slug: "smash", blurb: "A fast-paced multiplayer platform fighter inspired by Super Smash Bros.", ready: true },
  { title: "Bomberman", slug: "bomberman", blurb: "A fast-paced multiplayer action game where players place bombs, destroy obstacles, and compete to be the last one standing.", ready: false },
  { title: "Untitled Game", slug: "game-3", blurb: "Not started yet.", ready: false },
];

const grid = document.getElementById("grid");
const count = document.getElementById("game-count");

const readyGames = games.filter(g => g.ready);
count.textContent = `${readyGames.length} live`;

games.forEach((game, i) => {
  const card = document.createElement(game.ready ? "a" : "div");
  card.className = "tile" + (game.ready ? "" : " locked");
  if (game.ready) card.href = `games/${game.slug}/index.html`;
  card.dataset.title = game.title.toLowerCase();

  card.innerHTML = `
    <span class="tile-num">${String(i + 1).padStart(2, "0")}</span>
    <h3>${game.title}</h3>
    <p>${game.blurb}</p>
    <span class="tile-status">${game.ready ? "Play" : "Locked"}</span>
  `;

  grid.appendChild(card);
});

// ---------------------------------------------------------
// Search: filters tiles by title as the user types.
// ---------------------------------------------------------
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll("#grid .tile").forEach(tile => {
      const matches = tile.dataset.title.includes(query);
      tile.style.display = matches ? "" : "none";
    });
  });
}
