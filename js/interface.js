// interface.js - dashboard, messages, popups, joystick

// analog joystick values from -1 to 1 (the keyboard is handled in player.js)
const controls = { ax: 0, ay: 0 };

const lastShown = {};
const deltaTimers = {};

function updateDashboard() {
  const st = STAGES[state.stage];
    document.getElementById("stage-name").textContent = "Stage " + (state.stage + 1) + ": " + st.name;
      document.getElementById("day").textContent = state.day + " / " + st.maxDays;
        document.getElementById("science").textContent = state.science;
          document.getElementById("goal").textContent = "Goal: " + st.goal;

            ["power", "air", "food", "shield", "health"].forEach(key => {
                const percent = key === "power" ? state.power * (100 / state.maxPower) : state[key];
                    // text as well as colour, so it works for colour-blind players
                        document.getElementById(key).textContent = state[key] + (percent < 30 ? " LOW" : "");
                            const bar = document.getElementById("bar-" + key);
                                bar.style.width = Math.min(100, percent) + "%";
                                    bar.className = percent < 30 ? "low" : "";

                                        // show +/- next to a meter for a moment when it changes
                                            const now = state[key];
                                                if (lastShown[key] !== undefined && lastShown[key] !== now) {
                                                      const d = now - lastShown[key];
                                                            const el = document.getElementById("d-" + key);
                                                                  el.textContent = (d > 0 ? "+" : "") + d;
                                                                        el.className = d > 0 ? "up" : "down";
                                                                              clearTimeout(deltaTimers[key]);
                                                                                    deltaTimers[key] = setTimeout(() => { el.textContent = ""; }, 2000);
                                                                                        }
                                                                                            lastShown[key] = now;
                                                                                              });
                                                                                              }

                                                                                              function message(text) {
                                                                                                document.getElementById("message").textContent = text;
                                                                                                }

                                                                                                function hint(text) {
                                                                                                  document.getElementById("hint").textContent = text;
                                                                                                  }

                                                                                                  // big message on top of the game, so you can't miss what just happened
                                                                                                  let bannerTimer = null;
                                                                                                  function showBanner(text, good) {
                                                                                                    const b = document.getElementById("banner");
                                                                                                      b.textContent = text;
                                                                                                        b.className = "show" + (good ? "" : " bad");
                                                                                                          clearTimeout(bannerTimer);
                                                                                                            bannerTimer = setTimeout(() => { b.className = ""; }, 2600);
                                                                                                            }

                                                                                                            function showOverlay(title, text, source, buttons) {
                                                                                                              clearControls();
                                                                                                                document.getElementById("ov-title").textContent = title;
                                                                                                                  document.getElementById("ov-text").textContent = text;
                                                                                                                    document.getElementById("ov-source").textContent = source;
                                                                                                                      document.getElementById("ov-extra").innerHTML = "";
                                                                                                                        const box = document.getElementById("ov-buttons");
                                                                                                                          box.innerHTML = "";
                                                                                                                            buttons.forEach(b => {
                                                                                                                                const btn = document.createElement("button");
                                                                                                                                    btn.innerHTML = b.label + (b.note ? "<small>" + b.note + "</small>" : "");
                                                                                                                                        btn.addEventListener("click", b.onClick);
                                                                                                                                            box.appendChild(btn);
                                                                                                                                              });
                                                                                                                                                document.getElementById("overlay").classList.remove("hidden");
                                                                                                                                                }

                                                                                                                                                function hideOverlay() {
                                                                                                                                                  document.getElementById("overlay").classList.add("hidden");
                                                                                                                                                  }

                                                                                                                                                  function clearControls() {
                                                                                                                                                    controls.ax = 0;
                                                                                                                                                      controls.ay = 0;
                                                                                                                                                        const knob = document.getElementById("joy-knob");
                                                                                                                                                          if (knob) knob.style.transform = "translate(0px, 0px)";
                                                                                                                                                          }

                                                                                                                                                          function setupMobileControls(onInteract) {
                                                                                                                                                            const joy = document.getElementById("joy");
                                                                                                                                                              const radius = 45;   // how far the knob can move
                                                                                                                                                                let active = null;   // the finger that is using the joystick

                                                                                                                                                                  function move(e) {
                                                                                                                                                                      const r = joy.getBoundingClientRect();
                                                                                                                                                                          let dx = e.clientX - (r.left + r.width / 2);
                                                                                                                                                                              let dy = e.clientY - (r.top + r.height / 2);
                                                                                                                                                                                  const len = Math.hypot(dx, dy);
                                                                                                                                                                                      if (len > radius) { dx = dx / len * radius; dy = dy / len * radius; }
                                                                                                                                                                                          document.getElementById("joy-knob").style.transform = "translate(" + dx + "px, " + dy + "px)";
                                                                                                                                                                                              // small dead zone in the middle so he doesn't drift
                                                                                                                                                                                                  controls.ax = Math.abs(dx) < 8 ? 0 : dx / radius;
                                                                                                                                                                                                      controls.ay = Math.abs(dy) < 8 ? 0 : dy / radius;
                                                                                                                                                                                                        }

                                                                                                                                                                                                          joy.addEventListener("pointerdown", e => {
                                                                                                                                                                                                              e.preventDefault();
                                                                                                                                                                                                                  active = e.pointerId;
                                                                                                                                                                                                                      if (joy.setPointerCapture) joy.setPointerCapture(e.pointerId);
                                                                                                                                                                                                                          move(e);
                                                                                                                                                                                                                            });
                                                                                                                                                                                                                              joy.addEventListener("pointermove", e => {
                                                                                                                                                                                                                                  if (e.pointerId === active) { e.preventDefault(); move(e); }
                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                      const release = e => {
                                                                                                                                                                                                                                          if (e.pointerId !== active) return;
                                                                                                                                                                                                                                              active = null;
                                                                                                                                                                                                                                                  clearControls();
                                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                                      joy.addEventListener("pointerup", release);
                                                                                                                                                                                                                                                        joy.addEventListener("pointercancel", release);
                                                                                                                                                                                                                                                          joy.addEventListener("lostpointercapture", release);
                                                                                                                                                                                                                                                            joy.addEventListener("contextmenu", e => e.preventDefault());
                                                                                                                                                                                                                                                              joy.addEventListener("selectstart", e => e.preventDefault());

                                                                                                                                                                                                                                                                // safety net: if anything ends the touch, stop moving
                                                                                                                                                                                                                                                                  ["touchend", "touchcancel", "blur", "contextmenu"].forEach(ev => {
                                                                                                                                                                                                                                                                      window.addEventListener(ev, () => { active = null; clearControls(); });
                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                          document.addEventListener("visibilitychange", () => { active = null; clearControls(); });

                                                                                                                                                                                                                                                                            document.getElementById("interact").addEventListener("click", onInteract);
                                                                                                                                                                                                                                                                            }