const MOON_RADIATION = 8;
const MARS_RADIATION = 4;

const DIFFICULTY = {
  easy:   { label: "Easy",   power: 2,  event: 0.4, harm: 0.8 },
    normal: { label: "Normal", power: 0,  event: 0.6, harm: 1 },
      hard:   { label: "Hard",   power: -2, event: 0.8, harm: 1.25 }
      };

      function newStats() {
        return {
            days: 0, retries: 0, calls: 0, sheltered: 0, scienceEarned: 0,
                spentLife: 0, spentScience: 0,
                    minAir: 100, minFood: 100, minShield: 100, minHealth: 100
                      };
                      }

                      const state = {
                        stage: 0,
                          day: 1,
                            power: 6,
                              maxPower: 6,
                                air: 70,
                                  food: 70,
                                    shield: 70,
                                      health: 100,
                                        science: 0,
                                          streak: 0,
                                            damage: { radiation: 0, air: 0, food: 0, storm: 0 },
                                              difficulty: "normal",
                                                stats: newStats(),
                                                  paused: false,
                                                    over: false
                                                    };

                                                    function harm() {
                                                      return DIFFICULTY[state.difficulty].harm;
                                                      }

                                                      function radiationBase() {
                                                        return state.stage >= 3 ? MARS_RADIATION : MOON_RADIATION;
                                                        }

                                                        function clamp(v) {
                                                          return Math.max(0, Math.min(100, Math.round(v)));
                                                          }

                                                          function spendPower(cost) {
                                                            if (state.power < cost) return false;
                                                              state.power -= cost;
                                                                return true;
                                                                }

                                                                function applyEffects(fx) {
                                                                  const notes = [];
                                                                    for (const key in fx) {
                                                                        const v = fx[key];
                                                                            if (key === "storm") {
                                                                                  const dmg = Math.round(v * harm() * (1 - state.shield / 100));
                                                                                        state.health = clamp(state.health - dmg);
                                                                                              state.damage.storm += dmg;
                                                                                                    notes.push("The storm cost " + dmg + " health (your shield blocked " + state.shield + "%).");
                                                                                                        } else if (key === "power") {
                                                                                                              state.power = Math.max(0, state.power + v);
                                                                                                                  } else if (key === "science") {
                                                                                                                        state.science = Math.max(0, state.science + v);
                                                                                                                              if (v > 0) state.stats.scienceEarned += v;
                                                                                                                                  } else {
                                                                                                                                        state[key] = clamp(state[key] + v);
                                                                                                                                            }
                                                                                                                                              }
                                                                                                                                                return notes.join(" ");
                                                                                                                                                }

                                                                                                                                                function endDay() {
                                                                                                                                                  state.air = clamp(state.air - 12);
                                                                                                                                                    if (state.stage >= 1) state.food = clamp(state.food - 10);
                                                                                                                                                      state.shield = clamp(state.shield - 8);

                                                                                                                                                        const radiation = Math.round(radiationBase() * harm() * (1 - state.shield / 100));
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

                                                                                                                                                                                        const s = state.stats;
                                                                                                                                                                                          s.days++;
                                                                                                                                                                                            s.minAir = Math.min(s.minAir, state.air);
                                                                                                                                                                                              if (state.stage >= 1) s.minFood = Math.min(s.minFood, state.food);
                                                                                                                                                                                                s.minShield = Math.min(s.minShield, state.shield);
                                                                                                                                                                                                  s.minHealth = Math.min(s.minHealth, state.health);

                                                                                                                                                                                                    let report = "Radiation cost " + radiation + " health.";
                                                                                                                                                                                                      if (state.air === 0) report += " The air ran out!";
                                                                                                                                                                                                        if (state.stage >= 1 && state.food === 0) report += " The food ran out!";
                                                                                                                                                                                                          return report;
                                                                                                                                                                                                          }