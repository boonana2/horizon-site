// ---------------------------------------------------------
// Add a new game by adding one object to this list.
// slug = the folder name inside /games/ that holds the game.
// If a game isn't built yet, set ready: false and it'll show
// as a locked tile instead of a broken link.
// ---------------------------------------------------------
const games = [
  { title: "Poly Track", slug: "polytrack", blurb: "A fast-paced racing game where players race through custom tracks, compete for the fastest times, and build their own courses.", ready: true },
  { title: "Basketball Legends", slug: "basketball-legends", blurb: "A fast, chaotic arcade basketball game with iconic players and flashy special moves.", ready: true },
  { title: "Slope", slug: "slope", blurb: "A fast downhill game where you control a speeding ball while dodging obstacles.", ready: true },
  { title: "Ping Pong", slug: "pingpong", blurb: "A fast, close‑range table sport where two players hit a lightweight ball back and forth using small paddles on a divided table.", ready: true },
  { title: "Tennis", slug: "tennis", blurb: "A fast, court‑based sport where players hit a bouncing ball over a net using rackets, trying to land shots inbounds that the opponent can’t return.", ready: true },
  { title: "Tiny Fishing", slug: "tiny-fishing", blurb: "A simple click‑and‑upgrade game where you drop a line, catch stacked fish, and earn coins to extend your line and increase your haul.", ready: true },
  { title: "Chess", slug: "chess", blurb: "A strategic board game where two players move different‑ability pieces on an 8×8 grid to checkmate the opponent’s king.", ready: true },


  
  { title: "Untitled Game", slug: "game-3", blurb: "Not started yet.", ready: false },
  { title: "Bomberman", slug: "bomberman", blurb: "A fast-paced multiplayer action game where players place bombs to be the last one standing.", ready: false },
  { title: "old summit", slug: "smash", blurb: "A fast-paced multiplayer platform fighter inspired by Super Smash Bros.", ready: false },
  { title: "Summit Smash", slug: "flash-test", blurb: "A fast-paced multiplayer platform fighter inspired by Super Smash Bros.", ready: false },
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
