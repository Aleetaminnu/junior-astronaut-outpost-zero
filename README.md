# Junior Astronaut: Outpost Zero

A 2D top-down lunar outpost game for the NASA Space Apps Challenge "Build a Junior Astronaut Mission Trainer". Built with Phaser 3 and plain JavaScript.

## How to play
- Walk with WASD or arrow keys (on-screen pad on phones).
- Stand near a building and press E or Space (INTERACT on phones).
- You get 10 power each day. Every building costs power, so you can't do everything.
- Press END DAY when you're done. Air, food and shield drop each day, and radiation hurts the crew.
- Survive 7 days and collect 50 science points.

## The trade-off
Power is limited. Life support, food and shielding keep the crew alive, but the Science Lab is how you win. Spending on one means less for the others.

## NASA data used
- DONKI (Space Weather Database): real solar flare and geomagnetic storm events, stored as a saved copy (not live).
- Chang'e 4 lander (Moon) and Curiosity RAD (Mars) radiation measurements for the base radiation level.
- Power, air and food numbers are simplified for gameplay.

## Files
- `js/resources.js` shared numbers and daily rules
- `js/missions.js` events and facts
- `js/interface.js` dashboard, popups, mobile buttons
- `js/player.js` astronaut
- `js/world.js` map and buildings
- `js/main.js` starts the game

## License
MIT