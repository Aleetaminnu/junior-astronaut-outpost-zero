// main.js - puts it all together

class OutpostScene extends Phaser.Scene {
  constructor() {
      super("Outpost");
        }

          create() {
              buildWorld(this);
                  this.player = createPlayer(this);
                      this.solids.forEach(s => this.physics.add.collider(this.player, s));

                          this.keys = this.input.keyboard.addKeys({
                                up: "W", down: "S", left: "A", right: "D",
                                      up2: "UP", down2: "DOWN", left2: "LEFT", right2: "RIGHT",
                                            interact: "E", space: "SPACE"
                                                });

                                                    setupMobileControls(() => this.interact());
                                                        planEvents();
                                                            startDay();
                                                              }

                                                                update() {
                                                                    if (state.over || state.paused) {
                                                                          this.player.setVelocity(0, 0);
                                                                                return;
                                                                                    }
                                                                                        movePlayer(this);

                                                                                            if (Phaser.Input.Keyboard.JustDown(this.keys.interact) ||
                                                                                                    Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                                                                                                          this.interact();
                                                                                                              }

                                                                                                                  const near = nearestBuilding(this.player);
                                                                                                                      hint(near ? near.name + " - " + near.job + (near.cost ? " (" + near.cost + " power)" : "") : "");
                                                                                                                        }

                                                                                                                          interact() {
                                                                                                                              if (state.over || state.paused) return;
                                                                                                                                  const b = nearestBuilding(this.player);
                                                                                                                                      if (!b) {
                                                                                                                                            message("Move closer to a building first.");
                                                                                                                                                  return;
                                                                                                                                                      }
                                                                                                                                                          useBuilding(b);
                                                                                                                                                            }
                                                                                                                                                            }

                                                                                                                                                            function startDay() {
                                                                                                                                                              state.power = DAILY_POWER;
                                                                                                                                                                updateDashboard();
                                                                                                                                                                  const ev = todaysEvent();
                                                                                                                                                                    if (!ev) return;

                                                                                                                                                                      state.paused = true;
                                                                                                                                                                        const choose = option => () => {
                                                                                                                                                                            const result = applyEffects(option.fx);
                                                                                                                                                                                hideOverlay();
                                                                                                                                                                                    state.paused = false;
                                                                                                                                                                                        updateDashboard();
                                                                                                                                                                                            message(option.label + ". " + result);
                                                                                                                                                                                                if (state.health <= 0) finish(false);
                                                                                                                                                                                                  };
                                                                                                                                                                                                    showOverlay(ev.title, ev.text, ev.source, [
                                                                                                                                                                                                        { label: ev.a.label, note: ev.a.note, onClick: choose(ev.a) },
                                                                                                                                                                                                            { label: ev.b.label, note: ev.b.note, onClick: choose(ev.b) }
                                                                                                                                                                                                              ]);
                                                                                                                                                                                                              }

                                                                                                                                                                                                              function finishDay() {
                                                                                                                                                                                                                if (state.over || state.paused) return;
                                                                                                                                                                                                                  const report = endDay();
                                                                                                                                                                                                                    updateDashboard();

                                                                                                                                                                                                                      if (state.health <= 0) return finish(false);
                                                                                                                                                                                                                        if (state.day >= DAYS) return finish(true);

                                                                                                                                                                                                                          state.day++;
                                                                                                                                                                                                                            startDay();
                                                                                                                                                                                                                              if (!state.paused) message("Sol " + state.day + " begins. " + report);
                                                                                                                                                                                                                              }

                                                                                                                                                                                                                              function finish(survived) {
                                                                                                                                                                                                                                state.over = true;
                                                                                                                                                                                                                                  state.paused = true;
                                                                                                                                                                                                                                    let title, text;
                                                                                                                                                                                                                                      if (!survived) {
                                                                                                                                                                                                                                          title = "Mission ended early";
                                                                                                                                                                                                                                              text = "The crew could not stay healthy. Try a different plan next time: life support comes first, and a weak shield adds up.";
                                                                                                                                                                                                                                                } else if (state.science >= SCIENCE_GOAL) {
                                                                                                                                                                                                                                                    title = "Mission success!";
                                                                                                                                                                                                                                                        text = "The crew survived " + DAYS + " sols and you collected " + state.science + " science points.";
                                                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                                                              title = "Crew survived, goal missed";
                                                                                                                                                                                                                                                                  text = "You got " + state.science + " of " + SCIENCE_GOAL + " science points. Try giving the lab more power on calm sols.";
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                      showOverlay(title, text, "", [
                                                                                                                                                                                                                                                                          { label: "Play again", note: "", onClick: () => location.reload() }
                                                                                                                                                                                                                                                                            ]);
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                            document.getElementById("end-day").addEventListener("click", finishDay);

                                                                                                                                                                                                                                                                            new Phaser.Game({
                                                                                                                                                                                                                                                                              type: Phaser.AUTO,
                                                                                                                                                                                                                                                                                width: 960,
                                                                                                                                                                                                                                                                                  height: 640,
                                                                                                                                                                                                                                                                                    parent: "game-container",
                                                                                                                                                                                                                                                                                      backgroundColor: "#777d91",
                                                                                                                                                                                                                                                                                        physics: { default: "arcade", arcade: { debug: false } },
                                                                                                                                                                                                                                                                                          scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
                                                                                                                                                                                                                                                                                            scene: [OutpostScene]
                                                                                                                                                                                                                                                                                            });