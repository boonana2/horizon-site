const games = [
  { title: "Angry Birds", slug: "angry-birds", blurb: "A physics‑based puzzle game where you launch different birds from a slingshot to destroy structures and knock out enemy pigs.", ready: true },
  { title: "Basketball Legends", slug: "basketball-legends", blurb: "A fast, chaotic arcade basketball game with iconic players and flashy special moves.", ready: true },
  { title: "Chess", slug: "chess", blurb: "A strategic board game where two players move different‑ability pieces on an 8×8 grid to checkmate the opponent’s king.", ready: true },
  { title: "Fireboy & Watergirl: Forest", slug: "fbwg:forest", blurb: "A puzzle-platformer where players guide both characters through several puzzles to reach the exit of each level.", ready: true },
  { title: "Fireboy & Watergirl: Light", slug: "fbwg:light", blurb: "A puzzle-platformer where players guide both characters through several puzzles to reach the exit of each level.", ready: true },
  { title: "Fireboy & Watergirl: Ice", slug: "fbwg:ice", blurb: "A puzzle-platformer where players guide both characters through several puzzles to reach the exit of each level.", ready: true },
  { title: "Fireboy & Watergirl: Crystal", slug: "fbwg:crystal", blurb: "A puzzle-platformer where players guide both characters through several puzzles to reach the exit of each level.", ready: true },
  { title: "Geometry Dash", slug: "gd", blurb: "A rhythm‑based platformer where you jump, fly, and dodge obstacles in fast, music‑synced levels.", ready: true },
  { title: "Geometry Dash Vibes", slug: "gd-vibes", blurb: "A rhythm‑runner where you hold space to float upward and release to drop while dodging spikes and obstacles.", ready: true },
  { title: "Idle Breakout", slug: "idle-breakout", blurb: "An idle brick‑breaking game where you buy balls, upgrade them, and let them destroy blocks automatically to earn more cash.", ready: true },
  { title: "Papa's Bakeria", slug: "pbakeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Burgeria", slug: "pburgeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Cheeseria", slug: "pcheeseria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Cupcakeria", slug: "pcupcakeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Donuteria", slug: "pdonuteria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Freezeria", slug: "pfreezeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Hotdoggeria", slug: "photdoggeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Pancakeria", slug: "ppancakeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Pastaria", slug: "ppastaria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Pizzeria", slug: "ppizzeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Scooperia", slug: "pscooperia", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Sushiria", slug: "psushiria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Taco Mia", slug: "ptacomia", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Papa's Wingeria", slug: "pwingeria", blurb: "A time‑management cooking simulator where you run a restaurant, take orders, prepare food, and serve customers as fast and accurately as possible.", ready: true },
  { title: "Ping Pong", slug: "pingpong", blurb: "A fast, close‑range table sport where two players hit a lightweight ball back and forth using small paddles on a divided table.", ready: true },
  { title: "Poly Track", slug: "polytrack", blurb: "A fast-paced racing game where players race through custom tracks, compete for the fastest times, and build their own courses.", ready: true },
  { title: "Slope", slug: "slope", blurb: "A fast downhill game where you control a speeding ball while dodging obstacles.", ready: true },
  { title: "Subway Surfers", slug: "subway-surfers", blurb: "An endless‑runner where you sprint down train tracks, dodge obstacles, and collect coins while escaping the inspector.", ready: true },
  { title: "Superhot", slug: "superhot", blurb: "A first‑person action shooter game where time only moves when you move.", ready: true },
  { title: "Tennis", slug: "tennis", blurb: "A fast, court‑based sport where players hit a bouncing ball over a net using rackets, trying to land shots inbounds that the opponent can’t return.", ready: true },
  { title: "Tiny Fishing", slug: "tiny-fishing", blurb: "A simple click‑and‑upgrade game where you drop a line, catch stacked fish, and earn coins to extend your line and increase your haul.", ready: true },
  { title: "2048", slug: "2048", blurb: "A sliding‑tile puzzle where you combine matching numbers to reach the 2048 tile.", ready: true },
  { title: "8-Ball", slug: "8ball", blurb: "A classic billiards game where you aim, shoot, and sink all your assigned balls before finishing with the 8‑ball.", ready: true },

  
  { title: "Untitled Game", slug: "game-3", blurb: "Not started yet.", ready: false },
  { title: "Bomberman", slug: "bomberman", blurb: "A fast-paced multiplayer action game where players place bombs to be the last one standing.", ready: false },
  { title: "whatever claude made", slug: "smash", blurb: "A fast-paced multiplayer platform fighter inspired by Super Smash Bros.", ready: false },
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
