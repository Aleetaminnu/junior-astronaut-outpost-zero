# Junior Astronaut: Outpost Zero

A 2D top-down lunar outpost game for the NASA Space Apps Challenge "Build a Junior Astronaut Mission Trainer". Built with Phaser 3 and plain JavaScript.

## How to play
- Walk with WASD or arrow keys (on-screen pad on phones).
- Stand near a building and press E or Space (INTERACT on phones).
- Power is limited each day. Every building costs power, so you can't do everything.
- Press END DAY when you're done. Air, food and shield drop each day, and radiation hurts the crew.
- Finish three stages. Each one unlocks a new part of the base: Landing Camp, Base Camp, Science Outpost.

## The trade-off
Power is limited. Life support, food and shielding keep the crew alive, but the Science Lab is how you win. Spending on one means less for the others.

## NASA data used
- DONKI (Space Weather Database): live solar flares from the last 7 days make storms a bit stronger when space weather is active. If the live feed can't be reached, the game uses saved archive events and says so on screen.
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