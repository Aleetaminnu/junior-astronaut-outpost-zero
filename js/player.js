// player.js - the astronaut
// The sprite is drawn from the little text maps below, so there are no image files to load.
// Each letter is a colour and each character is one pixel (12 wide, 16 tall).

const PLAYER_SPEED = 155;
const PIXEL = 2;   // how big each pixel is on screen

const COLOURS = {
  w: 0xf0eee5,   // white suit
    g: 0xb8bcc8,   // grey shading
      v: 0x3d9fc4,   // visor
        V: 0x9fe0f2,   // visor shine
          o: 0xe8883a,   // orange stripe
            k: 0x273c52    // gloves and boots
            };

            const TOP = [
              "....wwww....",
                "...wwwwww...",
                  "..wwvvvvww..",
                    "..wwvVvvww..",
                      "..wwvvvvww..",
                        "...wwwwww...",
                          "..gwwwwwwg..",
                            ".gwwwooowwg.",
                              ".gwwwwwwwwg.",
                                ".kwwwwwwwwk.",
                                  "..wwwwwwww..",
                                    "..wwwwwwww.."
                                    ];

                                    const FRAMES = {
                                      "astro-idle": TOP.concat(["...ww..ww...", "...ww..ww...", "...kk..kk...", "............"]),
                                        "astro-a":    TOP.concat(["...ww..ww...", "...ww..kk...", "...ww.......", "...kk......."]),
                                          "astro-b":    TOP.concat(["...ww..ww...", "...kk..ww...", ".......ww...", ".......kk..."])
                                          };

                                          function drawFrame(scene, key, rows) {
                                            const g = scene.make.graphics({ x: 0, y: 0, add: false });
                                              rows.forEach((row, y) => {
                                                  row.split("").forEach((c, x) => {
                                                        if (COLOURS[c]) {
                                                                g.fillStyle(COLOURS[c]);
                                                                        g.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
                                                                              }
                                                                                  });
                                                                                    });
                                                                                      g.generateTexture(key, 12 * PIXEL, 16 * PIXEL);
                                                                                        g.destroy();
                                                                                        }

                                                                                        function createPlayer(scene) {
                                                                                          for (const key in FRAMES) drawFrame(scene, key, FRAMES[key]);

                                                                                            scene.anims.create({
                                                                                                key: "walk",
                                                                                                    frames: [{ key: "astro-a" }, { key: "astro-idle" }, { key: "astro-b" }, { key: "astro-idle" }],
                                                                                                        frameRate: 8,
                                                                                                            repeat: -1
                                                                                                              });

                                                                                                                // soft shadow under the feet
                                                                                                                  scene.shadow = scene.add.ellipse(480, 336, 20, 7, 0x000000, 0.25);

                                                                                                                    const player = scene.physics.add.sprite(480, 320, "astro-idle");
                                                                                                                      player.setCollideWorldBounds(true);
                                                                                                                        // only the feet collide, so he can walk close to buildings
                                                                                                                          player.body.setSize(16, 12);
                                                                                                                            player.body.setOffset(4, 20);
                                                                                                                              return player;
                                                                                                                              }

                                                                                                                              function stopPlayer(scene) {
                                                                                                                                scene.player.setVelocity(0, 0);
                                                                                                                                  scene.player.anims.stop();
                                                                                                                                    scene.player.setTexture("astro-idle");
                                                                                                                                    }

                                                                                                                                    function movePlayer(scene) {
                                                                                                                                      const k = scene.keys;
                                                                                                                                        let vx = 0, vy = 0;

                                                                                                                                          if (k.left.isDown || k.left2.isDown) vx = -1;
                                                                                                                                            if (k.right.isDown || k.right2.isDown) vx = 1;
                                                                                                                                              if (k.up.isDown || k.up2.isDown) vy = -1;
                                                                                                                                                if (k.down.isDown || k.down2.isDown) vy = 1;

                                                                                                                                                  // joystick: the further you push, the faster he goes
                                                                                                                                                    if (controls.ax !== 0 || controls.ay !== 0) {
                                                                                                                                                        vx = controls.ax;
                                                                                                                                                            vy = controls.ay;
                                                                                                                                                              }

                                                                                                                                                                if (vx !== 0 || vy !== 0) {
                                                                                                                                                                    scene.target = null;   // steering by hand cancels a tap-to-walk
                                                                                                                                                                      } else if (scene.target) {
                                                                                                                                                                          // walking to a spot the player tapped
                                                                                                                                                                              const t = scene.target;
                                                                                                                                                                                  const dx = t.x - scene.player.x;
                                                                                                                                                                                      const dy = t.y - scene.player.y;
                                                                                                                                                                                          const dist = Math.hypot(dx, dy);

                                                                                                                                                                                              if (dist < 8) {
                                                                                                                                                                                                    scene.target = null;
                                                                                                                                                                                                          // we only walk there. Using the building is up to the player (USE button or E).
                                                                                                                                                                                                                if (t.building) showBanner("Arrived at " + t.building.name + ". Press USE when you're ready.", true);
                                                                                                                                                                                                                    } else if (scene.time.now - t.checked > 700) {
                                                                                                                                                                                                                          // not getting closer? something is in the way
                                                                                                                                                                                                                                if (dist > t.lastDist - 6) {
                                                                                                                                                                                                                                        scene.target = null;
                                                                                                                                                                                                                                                message("Something is in the way. Try the joystick or the arrow keys.");
                                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                                              t.lastDist = dist;
                                                                                                                                                                                                                                                                      t.checked = scene.time.now;
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                    if (scene.target) {
                                                                                                                                                                                                                                                                                          vx = dx / dist;
                                                                                                                                                                                                                                                                                                vy = dy / dist;
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                        const v = new Phaser.Math.Vector2(vx, vy);
                                                                                                                                                                                                                                                                                                          if (v.length() > 1) v.normalize();
                                                                                                                                                                                                                                                                                                            v.scale(PLAYER_SPEED);
                                                                                                                                                                                                                                                                                                              scene.player.setVelocity(v.x, v.y);

                                                                                                                                                                                                                                                                                                                // face the way we're walking, and animate only while moving
                                                                                                                                                                                                                                                                                                                  if (vx < -0.1) scene.player.setFlipX(true);
                                                                                                                                                                                                                                                                                                                    if (vx > 0.1) scene.player.setFlipX(false);
                                                                                                                                                                                                                                                                                                                      if (v.length() > 5) {
                                                                                                                                                                                                                                                                                                                          scene.player.anims.play("walk", true);
                                                                                                                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                                                                                                                scene.player.anims.stop();
                                                                                                                                                                                                                                                                                                                                    scene.player.setTexture("astro-idle");
                                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                                        scene.shadow.setPosition(scene.player.x, scene.player.y + 16);
                                                                                                                                                                                                                                                                                                                                        }