class ResourceManager {

        constructor() {

                this.data = {
                            oxygen: 80,
                                        water: 80,
                                                    food: 80,
                                                                power: 80,
                                                                            shield: 80,
                                                                                        health: 100,
                                                                                                    science: 0,
                                                                                                                day: 1
                                                                                                                        };

                                                                                                                            }

                                                                                                                                clamp(value) {
                                                                                                                                        return Math.max(0, Math.min(100, value));
                                                                                                                                            }

                                                                                                                                                add(resource, amount) {

                                                                                                                                                        if (this.data[resource] !== undefined) {

                                                                                                                                                                    this.data[resource] = this.clamp(
                                                                                                                                                                                    this.data[resource] + amount
                                                                                                                                                                                                );

                                                                                                                                                                                                        }

                                                                                                                                                                                                                this.update();

                                                                                                                                                                                                                    }

                                                                                                                                                                                                                        use(resource, amount) {

                                                                                                                                                                                                                                this.add(resource, -amount);

                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                        update() {

                                                                                                                                                                                                                                                Object.keys(this.data).forEach(key => {

                                                                                                                                                                                                                                                            const element = document.getElementById(key);

                                                                                                                                                                                                                                                                        if (element) {

                                                                                                                                                                                                                                                                                        element.textContent = this.data[key];

                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                    consumeDailyResources() {

                                                                                                                                                                                                                                                                                                                            this.use("oxygen", 10);

                                                                                                                                                                                                                                                                                                                                    this.use("water", 8);

                                                                                                                                                                                                                                                                                                                                            this.use("food", 8);

                                                                                                                                                                                                                                                                                                                                                    this.use("power", 8);

                                                                                                                                                                                                                                                                                                                                                            this.use("shield", 4);

                                                                                                                                                                                                                                                                                                                                                                    if (this.data.oxygen === 0) {
                                                                                                                                                                                                                                                                                                                                                                                this.use("health", 15);
                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                if (this.data.water === 0) {
                                                                                                                                                                                                                                                                                                                                                                                                            this.use("health", 10);
                                                                                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                                                                                            if (this.data.food === 0) {
                                                                                                                                                                                                                                                                                                                                                                                                                                        this.use("health", 10);
                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (this.data.shield < 35) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    this.use("health", 10);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    this.update();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            isCrewAlive() {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    return this.data.health > 0;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }
}