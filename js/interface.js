class GameInterface {

        constructor(scene) {

                this.scene = scene;

                        // Remember the last nearby building

                                this.lastNearby = null;

                                        // Set up controls and buttons

                                                this.setupMobileControls();

                                                        this.setupButtons();

                                                            }

                                                                // Display messages on the game screen

                                                                    showMessage(text) {

                                                                            const element = document.getElementById("message");

                                                                                    if (element) {

                                                                                                element.textContent = text;

                                                                                                        }

                                                                                                            }

                                                                                                                // Set up mobile movement controls

                                                                                                                    setupMobileControls() {

                                                                                                                            document.querySelectorAll(".move").forEach(button => {

                                                                                                                                        const direction = button.dataset.dir;

                                                                                                                                                    const press = event => {

                                                                                                                                                                    event.preventDefault();

                                                                                                                                                                                    this.scene.player.mobile[direction] = true;

                                                                                                                                                                                                };

                                                                                                                                                                                                            const release = event => {

                                                                                                                                                                                                                            event.preventDefault();

                                                                                                                                                                                                                                            this.scene.player.mobile[direction] = false;

                                                                                                                                                                                                                                                        };

                                                                                                                                                                                                                                                                    button.addEventListener("pointerdown", press);

                                                                                                                                                                                                                                                                                button.addEventListener("pointerup", release);

                                                                                                                                                                                                                                                                                            button.addEventListener("pointercancel", release);

                                                                                                                                                                                                                                                                                                        button.addEventListener("lostpointercapture", release);

                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                        // Interaction button

                                                                                                                                                                                                                                                                                                                                const interactButton = document.getElementById("interact");

                                                                                                                                                                                                                                                                                                                                        if (interactButton) {

                                                                                                                                                                                                                                                                                                                                                    interactButton.addEventListener("click", () => {

                                                                                                                                                                                                                                                                                                                                                                    this.scene.interactWithNearest();

                                                                                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                // Set up game buttons

                                                                                                                                                                                                                                                                                                                                                                                                    setupButtons() {

                                                                                                                                                                                                                                                                                                                                                                                                            const endDayButton = document.getElementById("end-day");

                                                                                                                                                                                                                                                                                                                                                                                                                    if (endDayButton) {

                                                                                                                                                                                                                                                                                                                                                                                                                                endDayButton.addEventListener("click", () => {

                                                                                                                                                                                                                                                                                                                                                                                                                                                this.scene.missions.advanceDay();

                                                                                                                                                                                                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                            // Display nearby building information

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                updateNearbyBuilding(building) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (!building) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    this.lastNearby = null;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                // Only update when entering a new building area

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (this.lastNearby !== building.name) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    this.lastNearby = building.name;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                this.showMessage(

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "Nearby: " + building.name +

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ". Press INTERACT."

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }
}