// interface.js - dashboard, messages, popups, mobile buttons

const controls = { up: false, down: false, left: false, right: false };

function updateDashboard() {
  document.getElementById("day").textContent = state.day + " / " + DAYS;
    document.getElementById("science").textContent = state.science;

      ["power", "air", "food", "shield", "health"].forEach(key => {
          document.getElementById(key).textContent = state[key];
              const bar = document.getElementById("bar-" + key);
                  const percent = key === "power" ? state.power * (100 / DAILY_POWER) : state[key];
                      bar.style.width = Math.min(100, percent) + "%";
                          bar.className = percent < 30 ? "low" : "";
                            });
                            }

                            function message(text) {
                              document.getElementById("message").textContent = text;
                              }

                              function hint(text) {
                                document.getElementById("hint").textContent = text;
                                }

                                function showOverlay(title, text, source, buttons) {
                                  document.getElementById("ov-title").textContent = title;
                                    document.getElementById("ov-text").textContent = text;
                                      document.getElementById("ov-source").textContent = source;
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

                                                                  function setupMobileControls(onInteract) {
                                                                    document.querySelectorAll(".move").forEach(btn => {
                                                                        const dir = btn.dataset.dir;
                                                                            const on = e => { e.preventDefault(); controls[dir] = true; };
                                                                                const off = e => { e.preventDefault(); controls[dir] = false; };
                                                                                    btn.addEventListener("pointerdown", on);
                                                                                        btn.addEventListener("pointerup", off);
                                                                                            btn.addEventListener("pointercancel", off);
                                                                                                btn.addEventListener("pointerleave", off);
                                                                                                  });
                                                                                                    document.getElementById("interact").addEventListener("click", onInteract);
                                                                                                    }interface