// resources.js - the numbers that everything else changes

const MOON_RADIATION = 8;   // health lost per day with no shield at all

const state = {
  stage: 0,          // 0, 1, 2 (shown to the player as Stage 1, 2, 3)
    day: 1,            // day inside the current stage
      power: 6,
        maxPower: 6,
          air: 70,
            food: 70,
              shield: 70,
                health: 100,
                  science: 0,
                    streak: 0,         // good days in a row
                      damage: { radiation: 0, air: 0, food: 0, storm: 0 },   // used to explain what went wrong
                        paused: false,
                          over: false
                          };

                          function clamp(v) {
                            return Math.max(0, Math.min(100, Math.round(v)));
                            }

                            // returns false if there isn't enough power left
                            function spendPower(cost) {
                              if (state.power < cost) return false;
                                state.power -= cost;
                                  return true;
                                  }

                                  // effects come from events, e.g. { air: -5, storm: 30 }
                                  function applyEffects(fx) {
                                    const notes = [];
                                      for (const key in fx) {
                                          const v = fx[key];
                                              if (key === "storm") {
                                                    // the shield blocks a % of the radiation, and real space weather can make storms stronger
                                                          const dmg = Math.round(v * (1 + 0.15 * weatherLevel()) * (1 - state.shield / 100));
                                                                state.health = clamp(state.health - dmg);
                                                                      state.damage.storm += dmg;
                                                                            notes.push("The storm cost " + dmg + " health (your shield blocked " + state.shield + "%).");
                                                                                } else if (key === "power") {
                                                                                      state.power = Math.max(0, state.power + v);
                                                                                          } else if (key === "science") {
                                                                                                state.science = Math.max(0, state.science + v);
                                                                                                    } else {
                                                                                                          state[key] = clamp(state[key] + v);
                                                                                                              }
                                                                                                                }
                                                                                                                  return notes.join(" ");
                                                                                                                  }

                                                                                                                  // the day is over: things wear down, radiation hits
                                                                                                                  function endDay() {
                                                                                                                    state.air = clamp(state.air - 12);
                                                                                                                      if (state.stage >= 1) state.food = clamp(state.food - 10);   // food only matters once the greenhouse is open
                                                                                                                        state.shield = clamp(state.shield - 8);

                                                                                                                          const radiation = Math.round(MOON_RADIATION * (1 + 0.15 * weatherLevel()) * (1 - state.shield / 100));
                                                                                                                            let airHurt = 0, foodHurt = 0;
                                                                                                                              if (state.air === 0) airHurt = 25;
                                                                                                                                else if (state.air < 25) airHurt = 4;
                                                                                                                                  if (state.stage >= 1) {
                                                                                                                                      if (state.food === 0) foodHurt = 15;
                                                                                                                                          else if (state.food < 25) foodHurt = 3;
                                                                                                                                            }

                                                                                                                                              const foodOk = state.stage < 1 || state.food >= 40;
                                                                                                                                                const heal = (state.air >= 40 && foodOk) ? 3 : 0;
                                                                                                                                                  state.health = clamp(state.health + heal - radiation - airHurt - foodHurt);

                                                                                                                                                    state.damage.radiation += radiation;
                                                                                                                                                      state.damage.air += airHurt;
                                                                                                                                                        state.damage.food += foodHurt;

                                                                                                                                                          let report = "Radiation cost " + radiation + " health.";
                                                                                                                                                            if (state.air === 0) report += " The air ran out!";
                                                                                                                                                              if (state.stage >= 1 && state.food === 0) report += " The food ran out!";
                                                                                                                                                                return report;
                                                                                                                                                                }