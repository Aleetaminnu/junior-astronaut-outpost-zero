// missions.js - events and the science facts

// "source" lines are real NASA events (saved copy from the DONKI archive)
const EVENT_POOL = [
  {
      title: "Big solar flare",
          text: "A flare is on its way. Fast particles can reach the base.",
              source: "NASA DONKI archive: X9.0 flare, 3 Oct 2024.",
                  a: { label: "Everyone shelters inside", note: "Safe, but lab work stops.", fx: { science: -10, shield: -6 } },
                      b: { label: "Keep working", note: "More science, but the crew gets dosed.", fx: { storm: 40, science: 10 } }
                        },
                          {
                              title: "Radio blackout",
                                  text: "A geomagnetic storm is scrambling the radio.",
                                      source: "NASA DONKI archive: G5 storm, 10-11 May 2024.",
                                          a: { label: "Use the backup radio", note: "Costs 2 power today.", fx: { power: -2 } },
                                              b: { label: "Wait it out", note: "Saves power, but the stale air builds up.", fx: { science: -8, air: -5 } }
                                                },
                                                  {
                                                      title: "Radiation spike",
                                                          text: "The radiation monitor is reading higher than normal.",
                                                              source: "Based on NASA Curiosity RAD readings during the Sept 2017 storm.",
                                                                  a: { label: "Boost the shield", note: "Costs 1 power today.", fx: { shield: 15, power: -1 } },
                                                                      b: { label: "Risk it", note: "1 extra power, but radiation gets through.", fx: { storm: 30, power: 1 } }
                                                                        },
                                                                          {
                                                                              title: "Lunar night is coming",
                                                                                  text: "The Sun is setting. Solar panels make less power in the dark.",
                                                                                      source: "Real fact: much of the Moon has about 14 Earth days of night at a time.",
                                                                                          a: { label: "Run on batteries", note: "Lose 3 power today.", fx: { power: -3, shield: 5 } },
                                                                                              b: { label: "Dim the lights", note: "Lose 1 power, air gets stale.", fx: { power: -1, air: -6, science: -8 } }
                                                                                                },
                                                                                                  {
                                                                                                      title: "Computer glitch",
                                                                                                          text: "The base computer froze.",
                                                                                                              source: "",
                                                                                                                  a: { label: "Ask Earth for help", note: "Radio delay is about 1.3 seconds, but you lose some lab time.", fx: { science: -5 } },
                                                                                                                      b: { label: "Fix it yourself", note: "Faster, but you might break something.", fx: { air: -8, food: -5 } }
                                                                                                                        },
                                                                                                                          {
                                                                                                                              title: "Plants are blooming",
                                                                                                                                  text: "The greenhouse crop is ready early.",
                                                                                                                                      source: "",
                                                                                                                                          a: { label: "Harvest now", note: "Dinner sorted.", fx: { food: 18 } },
                                                                                                                                              b: { label: "Study the plants", note: "Good science, not much food.", fx: { science: 20, food: 5 } }
                                                                                                                                                },
                                                                                                                                                  {
                                                                                                                                                      title: "Airlock leak",
                                                                                                                                                          text: "A small crack is letting air out.",
                                                                                                                                                              source: "",
                                                                                                                                                                  a: { label: "Patch it", note: "Costs 1 power and a little air.", fx: { power: -1, air: -3 } },
                                                                                                                                                                      b: { label: "Ignore it", note: "Saves power, but air escapes.", fx: { air: -16 } }
                                                                                                                                                                        }
                                                                                                                                                                        ];

                                                                                                                                                                        // one event for days 2 to 6, picked at random each game
                                                                                                                                                                        let eventPlan = {};

                                                                                                                                                                        function planEvents() {
                                                                                                                                                                          const pool = EVENT_POOL.slice();
                                                                                                                                                                            pool.sort(() => Math.random() - 0.5);
                                                                                                                                                                              eventPlan = {};
                                                                                                                                                                                for (let d = 2; d <= 6; d++) {
                                                                                                                                                                                    eventPlan[d] = pool[d - 2];
                                                                                                                                                                                      }
                                                                                                                                                                                      }

                                                                                                                                                                                      function todaysEvent() {
                                                                                                                                                                                        return eventPlan[state.day] || null;
                                                                                                                                                                                        }

                                                                                                                                                                                        const FACTS = {
                                                                                                                                                                                          HABITAT: "On the ISS, air and water are recycled as much as possible because resupply is expensive.",
                                                                                                                                                                                            GREENHOUSE: "Astronauts on the ISS have already grown lettuce and chili peppers.",
                                                                                                                                                                                              "SUPPLY DEPOT": "Piling moon soil (regolith) over a habitat is one idea for blocking radiation.",
                                                                                                                                                                                                "SCIENCE LAB": "Real experiments share power with life support, so science has to wait its turn."
                                                                                                                                                                                                };