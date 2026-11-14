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
                                  clearControls();
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

                                                                    function clearControls() {
                                                                      controls.up = controls.down = controls.left = controls.right = false;
                                                                      }

                                                                      function setupMobileControls(onInteract) {
                                                                        document.querySelectorAll(".move").forEach(btn => {
                                                                            const dir = btn.dataset.dir;

                                                                                btn.addEventListener("pointerdown", e => {
                                                                                      e.preventDefault();
                                                                                            // capture the finger so we always get the release, even if it slides off the button
                                                                                                  if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
                                                                                                        controls[dir] = true;
                                                                                                            });

                                                                                                                const off = e => { e.preventDefault(); controls[dir] = false; };
                                                                                                                    btn.addEventListener("pointerup", off);
                                                                                                                        btn.addEventListener("pointercancel", off);
                                                                                                                            btn.addEventListener("lostpointercapture", off);
                                                                                                                                btn.addEventListener("pointerleave", off);

                                                                                                                                    // long press can open a menu or select text on some phones
                                                                                                                                        btn.addEventListener("contextmenu", e => e.preventDefault());
                                                                                                                                            btn.addEventListener("selectstart", e => e.preventDefault());
                                                                                                                                              });

                                                                                                                                                // safety net: if anything ends the touch, stop moving
                                                                                                                                                  ["pointerup", "pointercancel", "touchend", "touchcancel", "blur", "contextmenu"].forEach(ev => {
                                                                                                                                                      window.addEventListener(ev, clearControls);
                                                                                                                                                        });
                                                                                                                                                          document.addEventListener("visibilitychange", clearControls);

                                                                                                                                                            document.getElementById("interact").addEventListener("click", onInteract);
                                                                                                                                                            }