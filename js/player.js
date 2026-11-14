// player.js - the astronaut

const PLAYER_SPEED = 155;

function createPlayer(scene) {
  // placeholder astronaut drawn with code, replace with pixel art later
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xf0eee5);
        g.fillRoundedRect(0, 0, 24, 28, 8);
          g.fillStyle(0x3d9fc4);
            g.fillRect(12, 6, 10, 8);
              g.generateTexture("astro", 24, 28);
                g.destroy();

                  const player = scene.physics.add.sprite(480, 320, "astro");
                    player.setCollideWorldBounds(true);
                      return player;
                      }

                      function movePlayer(scene) {
                        const k = scene.keys;
                          let vx = 0, vy = 0;

                            if (k.left.isDown || k.left2.isDown || controls.left) vx = -1;
                              if (k.right.isDown || k.right2.isDown || controls.right) vx = 1;
                                if (k.up.isDown || k.up2.isDown || controls.up) vy = -1;
                                  if (k.down.isDown || k.down2.isDown || controls.down) vy = 1;

                                    const v = new Phaser.Math.Vector2(vx, vy);
                                      if (v.length() > 0) v.normalize().scale(PLAYER_SPEED);
                                        scene.player.setVelocity(v.x, v.y);
                                        }