// world.js - terrain, buildings and what each one does
// cost = power needed to use it

const BUILDINGS = [
  { name: "HABITAT", x: 170, y: 155, colour: 0x397fa9, cost: 2, job: "Life support: +15 air" },
    { name: "POWER ARRAY", x: 480, y: 145, colour: 0xc9a84c, cost: 0, job: "Check the power forecast" },
      { name: "GREENHOUSE", x: 790, y: 155, colour: 0x438d66, cost: 2, job: "Grow food: +14 food" },
        { name: "SCIENCE LAB", x: 260, y: 465, colour: 0x8064ad, cost: 3, job: "Experiment: +10 science" },
          { name: "SUPPLY DEPOT", x: 700, y: 465, colour: 0xb87555, cost: 2, job: "Pile regolith: +16 shield" }
          ];

          function buildWorld(scene) {
            scene.physics.world.setBounds(0, 0, 960, 640);
              scene.cameras.main.setBackgroundColor("#777d91");

                const g = scene.add.graphics();
                  for (let i = 0; i < 100; i++) {
                      g.fillStyle(0x969cab, 0.55);
                          g.fillCircle(Phaser.Math.Between(15, 945), Phaser.Math.Between(15, 625), Phaser.Math.Between(2, 7));
                            }
                              // paths between the buildings
                                g.lineStyle(35, 0x9ca4b2, 0.7);
                                  g.strokeLineShape(new Phaser.Geom.Line(480, 220, 480, 410));
                                    g.strokeLineShape(new Phaser.Geom.Line(170, 220, 790, 220));
                                      g.strokeLineShape(new Phaser.Geom.Line(260, 410, 700, 410));
                                        // landing pad in the middle
                                          g.lineStyle(4, 0xe1d5a4);
                                            g.strokeCircle(480, 320, 70);

                                              scene.solids = [];
                                                BUILDINGS.forEach(b => {
                                                    const body = scene.add.rectangle(b.x, b.y, 112, 76, b.colour);
                                                        scene.physics.add.existing(body, true);
                                                            scene.solids.push(body);
                                                                scene.add.rectangle(b.x, b.y - 26, 88, 10, 0xe8e9ed);   // roof
                                                                    scene.add.rectangle(b.x, b.y + 18, 20, 32, 0x273c52);   // door
                                                                        scene.add.text(b.x, b.y + 55, b.name, {
                                                                              fontSize: "13px", color: "#ffffff", backgroundColor: "#26364b", padding: { x: 5, y: 4 }
                                                                                  }).setOrigin(0.5);
                                                                                    });
                                                                                    }

                                                                                    function nearestBuilding(player) {
                                                                                      let best = null, bestDist = 110;
                                                                                        BUILDINGS.forEach(b => {
                                                                                            const d = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
                                                                                                if (d < bestDist) { bestDist = d; best = b; }
                                                                                                  });
                                                                                                    return best;
                                                                                                    }

                                                                                                    function useBuilding(b) {
                                                                                                      if (b.name === "POWER ARRAY") {
                                                                                                          message("Power left today: " + state.power + ". Your shield blocks " + state.shield +
                                                                                                                "% of radiation. Panels only work in sunlight, so power is limited each day.");
                                                                                                                    return;
                                                                                                                      }
                                                                                                                        if (!spendPower(b.cost)) {
                                                                                                                            message("Not enough power for the " + b.name.toLowerCase() + " (needs " + b.cost + ").");
                                                                                                                                return;
                                                                                                                                  }
                                                                                                                                    if (b.name === "HABITAT") state.air = clamp(state.air + 15);
                                                                                                                                      if (b.name === "GREENHOUSE") state.food = clamp(state.food + 14);
                                                                                                                                        if (b.name === "SCIENCE LAB") state.science += 10;
                                                                                                                                          if (b.name === "SUPPLY DEPOT") state.shield = clamp(state.shield + 16);

                                                                                                                                            message(b.job + " (-" + b.cost + " power). " + FACTS[b.name]);
                                                                                                                                              updateDashboard();
                                                                                                                                              }