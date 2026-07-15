# The Arcade

## How to add a new game

1. Make a folder inside `games/` named after your game, e.g. `games/snake/`
2. Put that game's `index.html` (and its own CSS/JS) inside that folder
3. Open `script.js` and either edit one of the placeholder entries or add a new one:

```js
{ title: "Snake", slug: "snake", blurb: "Classic grid snake.", ready: true }
```

4. Save, `git add . && git commit -m "add snake" && git push`
5. Cloudflare redeploys automatically within a minute or two

Setting `ready: false` shows the cartridge as locked instead of linking anywhere —
useful for placeholder slots while a game is still being built.
