// resources.js - the numbers that everything else changes

const DAYS = 7;
const SCIENCE_GOAL = 50;
const DAILY_POWER = 10;
const MOON_RADIATION = 8;   // health lost per sol with no shield at all

const state = {
  day: 1,
    power: DAILY_POWER,
      air: 70,
        food: 70,
          shield: 70,
            health: 100,
              science: 0,
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
                                            // the shield blocks a % of the radiation
                                                  const dmg = Math.round(v * (1 - state.shield / 100));
                                                        state.health = clamp(state.health - dmg);
                                                              notes.push("The storm cost " + dmg + " health (shield blocked " + state.shield + "%).");
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

                                                                                                    // the sol is over: things wear down, radiation hits
                                                                                                    function endDay() {
                                                                                                      state.air = clamp(state.air - 12);
                                                                                                        state.food = clamp(state.food - 10);
                                                                                                          state.shield = clamp(state.shield - 8);

                                                                                                            const radiation = Math.round(MOON_RADIATION * (1 - state.shield / 100));
                                                                                                              let hurt = radiation;
                                                                                                                if (state.air === 0) hurt += 25;
                                                                                                                  else if (state.air < 25) hurt += 4;
                                                                                                                    if (state.food === 0) hurt += 15;
                                                                                                                      else if (state.food < 25) hurt += 3;

                                                                                                                        const heal = (state.air >= 40 && state.food >= 40) ? 3 : 0;
                                                                                                                          state.health = clamp(state.health + heal - hurt);

                                                                                                                            let report = "Radiation cost " + radiation + " health.";
                                                                                                                              if (state.air === 0) report += " The air ran out!";
                                                                                                                                if (state.food === 0) report += " The food ran out!";
                                                                                                                                  return report;
                                                                                                                                  }