
// =====================================
// OUTPOST ZERO
// Main game program
// =====================================

const resources = {
        oxygen: 80,
            water: 80,
                food: 80,
                    power: 80,
                        shield: 80,
                            health: 100,
                                science: 0,
                                    day: 1
};

let gameOver = false;

function clamp(value) {
        return Math.max(0, Math.min(100, value));
}

function updateDashboard() {

        Object.keys(resources).forEach(key => {

                    const element = document.getElementById(key);

                            if (element) {
                                            element.textContent = resources[key];
                            }

                        });

                    }

                    function message(text) {

                            document.getElementById("message").textContent = text;

                    }

                    class OutpostScene extends Phaser.Scene {

                            constructor() {
                                        super("Outpost");
                            }

                                create() {

                                            gameOver = false;

                                                    this.cameras.main.setBackgroundColor("#777d91");

                                                            this.physics.world.setBounds(0, 0, 960, 640);

                                                                    this.drawTerrain();

                                                                            this.buildings = [];

                                                                                    this.addBuilding(170, 155, "HABITAT", 0x397fa9);

                                                                                            this.addBuilding(480, 145, "POWER ARRAY", 0xc9a84c);

                                                                                                    this.addBuilding(790, 155, "GREENHOUSE", 0x438d66);

                                                                                                            this.addBuilding(260, 465, "SCIENCE LAB", 0x8064ad);

                                                                                                                    this.addBuilding(700, 465, "SUPPLY DEPOT", 0xb87555);

                                                                                                                            // Astronaut
                                                                                                                                    this.player = this.add.ellipse(
                                                                                                                                                    480, 320, 28, 30, 0xf0eee5
                                                                                                                                    );

                                                                                                                                            this.physics.add.existing(this.player);

                                                                                                                                                    this.player.body.setCircle(14);

                                                                                                                                                            this.player.body.setCollideWorldBounds(true);

        // Building collisions

        this.buildings.forEach(building => {

            this.physics.add.collider(
                this.player,
                building.shape
            );

        });

        // Camera

        this.cameras.main.setBounds(0, 0, 960, 640);

        this.cameras.main.startFollow(this.player);

        // Keyboard controls

        this.keys = this.input.keyboard.addKeys({

            up: "W",
            down: "S",
            left: "A",
            right: "D",

            up2: "UP",
            down2: "DOWN",
            left2: "LEFT",
            right2: "RIGHT",

            interact: "E",
            space: "SPACE"

        });

        // Mobile controls

        this.mobile = {

            up: false,
            down: false,
            left: false,
            right: false

        };

        this.setupMobileControls();

        updateDashboard();

        message("Welcome, astronaut! Explore your lunar outpost.");

    }

    drawTerrain() {

        const graphics = this.add.graphics();

        graphics.fillStyle(0x777d91);

        graphics.fillRect(0, 0, 960, 640);

        // Lunar craters

        for (let i = 0; i < 100; i++) {

            const x = Phaser.Math.Between(15, 945);

            const y = Phaser.Math.Between(15, 625);

            const radius = Phaser.Math.Between(2, 7);

            graphics.fillStyle(0x969cab, 0.55);

            graphics.fillCircle(x, y, radius);

        }

        // Pathways

        graphics.lineStyle(35, 0x9ca4b2, 0.7);

        graphics.strokeLineShape(
            new Phaser.Geom.Line(480, 220, 480, 410)
        );

        graphics.strokeLineShape(
            new Phaser.Geom.Line(170, 220, 790, 220)
        );

        graphics.strokeLineShape(
            new Phaser.Geom.Line(260, 410, 700, 410)
        );

        // Landing pad

        graphics.lineStyle(4, 0xe1d5a4);

        graphics.strokeCircle(480, 320, 70);

        graphics.fillStyle(0xe1d5a4);

        graphics.fillCircle(480, 320, 3);

    }

    addBuilding(x, y, name, colour) {

        const shape = this.add.rectangle(
            x, y, 112, 76, colour
        );

        this.physics.add.existing(shape, true);

        this.add.rectangle(
            x, y - 26, 88, 10, 0xe8e9ed
        );

        this.add.rectangle(
            x, y + 18, 20, 32, 0x273c52
        );

        this.add.text(
            x, y + 55, name,
            {
                fontSize: "13px",
                color: "#ffffff",
                backgroundColor: "#26364b",
                padding: {
                    x: 5,
                    y: 4
                }
            }
        ).setOrigin(0.5);

        this.buildings.push({

            name: name,
            shape: shape,
            x: x,
            y: y

        });

    }

        setupMobileControls() {

                    document.querySelectorAll(".move").forEach(button => {

                                    const direction = button.dataset.dir;

                                                const press = event => {

                                                                    event.preventDefault();

                                                                                    this.mobile[direction] = true;

                                                };

                                                            const release = event => {

                                                                                event.preventDefault();

                                                                                                this.mobile[direction] = false;

                                                            };

                                                                        button.addEventListener("pointerdown", press);

                                                                                    button.addEventListener("pointerup", release);

                                                                                                button.addEventListener("pointercancel", release);

                                                                                                            button.addEventListener("lostpointercapture", release);

                                                        });

                                                                document.getElementById("interact")
                                                                            .addEventListener("click", () => {

                                                                                                this.interactWithNearest();

                                                                            });

                                                                        }

                                                                            update() {

                                                                                        if (gameOver) return;

                                                                                                const speed = 155;

                                                                                                        let vx = 0;

                                                                                                                let vy = 0;

                                                                                                                        if (
                                                                                                                                        this.keys.left.isDown ||
                                                                                                                                                    this.keys.left2.isDown ||
                                                                                                                                                                this.mobile.left
                                                                                                                        ) {
                                                                                                                                        vx = -speed;
                                                                                                                        }

                                                                                                                                if (
                                                                                                                                                this.keys.right.isDown ||
                                                                                                                                                            this.keys.right2.isDown ||
                                                                                                                                                                        this.mobile.right
                                                                                                                                ) {
                                                                                                                                                vx = speed;
                                                                                                                                }

                                                                                                                                        if (
                                                                                                                                                        this.keys.up.isDown ||
                                                                                                                                                                    this.keys.up2.isDown ||
                                                                                                                                                                                this.mobile.up
                                                                                                                                        ) {
                                                                                                                                                        vy = -speed;
                                                                                                                                        }

                                                                                                                                                if (
                                                                                                                                                                this.keys.down.isDown ||
                                                                                                                                                                            this.keys.down2.isDown ||
                                                                                                                                                                                        this.mobile.down
                                                                                                                                                ) {
                                                                                                                                                                vy = speed;
                                                                                                                                                }

                                                                                                                                                        const movement = new Phaser.Math.Vector2(vx, vy);

                                                                                                                                                                if (movement.length() > 0) {

                                                                                                                                                                                movement.normalize().scale(speed);

                                                                                                                                                                }

                                                                                                                                                                        this.player.body.setVelocity(
                                                                                                                                                                                        movement.x,
                                                                                                                                                                                                    movement.y
                                                                                                                                                                        );

                                                                                                                                                                                if (
                                                                                                                                                                                                Phaser.Input.Keyboard.JustDown(this.keys.interact) ||
                                                                                                                                                                                                            Phaser.Input.Keyboard.JustDown(this.keys.space)
                                                                                                                                                                                ) {

                                                                                                                                                                                                this.interactWithNearest();

                                                                                                                                                                                }

                                                                                                                                                                                        const nearest = this.getNearestBuilding();

                                                                                                                                                                                                if (nearest) {

                                                                                                                                                                                                                message(
                                                                                                                                                                                                                                    "Nearby: " + nearest.name +
                                                                                                                                                                                                                                                    ". Press INTERACT."
                                                                                                                                                                                                                );

                                                                                                                                                                                                            }

                                                                                                                                                                                                        }

                                                                                                                                                                                                            getNearestBuilding() {

                                                                                                                                                                                                                        let nearest = null;

                                                                                                                                                                                                                                let shortest = 110;

                                                                                                                                                                                                                                        this.buildings.forEach(building => {

                                                                                                                                                                                                                                                        const distance = Phaser.Math.Distance.Between(
                                                                                                                                                                                                                                                                            this.player.x,
                                                                                                                                                                                                                                                                                            this.player.y,
                                                                                                                                                                                                                                                                                                            building.x,
                                                                                                                                                                                                                                                                                                                            building.y
                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                    if (distance < shortest) {

                                                                                                                                                                                                                                                                                        shortest = distance;

                                                                                                                                                                                                                                                                                                        nearest = building;

                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                        return nearest;

                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                interactWithNearest() {

                                                                                                                                                                                                                                                                            if (gameOver) return;

                                                                                                                                                                                                                                                                                    const building = this.getNearestBuilding();

                                                                                                                                                                                                                                                                                            if (!building) {

                                                                                                                                                                                                                                                                                                            message("Move closer to a building first.");

                                                                                                                                                                                                                                                                                                                        return;

                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                    this.interact(building.name);

                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                            interact(name) {

                                                                                                                                                                                                                                                                                                        switch (name) {

                                                                                                                                                                                                                                                                                                                        case "HABITAT":

                                                                                                                                                                                                                                                                                                                                        if (resources.power < 5) {

                                                                                                                                                                                                                                                                                                                                                                message("Not enough power to run the habitat.");

                                                                                                                                                                                                                                                                                                                                                                                    return;

                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                        resources.oxygen = clamp(
                                                                                                                                                                                                                                                                                                                                                                                resources.oxygen + 20
                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                        resources.health = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                resources.health + 5
                                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                                        resources.power = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                resources.power - 5
                                                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                                                        message("Habitat: Oxygen replenished. Crew protected!");

                                                                                                                                                                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                    case "POWER ARRAY":

                                                                                                                                                                                                                                                                                                                                                                                                                                                    resources.power = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            resources.power + 25
                                                                                                                                                                                                                                                                                                                                                                                                                                                    );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                    message("Power Array: Solar energy collected!");

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    break;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                case "GREENHOUSE":

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (resources.water < 5 || resources.power < 5) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        message("The greenhouse needs more water and power.");

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.food = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.food + 20
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.water = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.water - 5
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.power = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.power - 5
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                message("Greenhouse: Fresh food harvested!");

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                break;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            case "SCIENCE LAB":

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            if (resources.power < 10) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    message("Not enough power to conduct the experiment.");

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            resources.science += 10;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            resources.power = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    resources.power - 10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            message("Experiment successful! +10 Science Points.");

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            break;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        case "SUPPLY DEPOT":

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.water = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.water + 15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.food = clamp(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.food + 15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        message("Supply Depot: Water and food collected!");

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        break;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            updateDashboard();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    this.checkFailure();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    advanceDay() {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (gameOver) return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (resources.day >= 7) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        this.finishMission();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.day++;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        // Daily consumption

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.oxygen = clamp(resources.oxygen - 10);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.water = clamp(resources.water - 8);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.food = clamp(resources.food - 8);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.power = clamp(resources.power - 8);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.shield = clamp(resources.shield - 4);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        // Health penalties

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (resources.oxygen === 0) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.health -= 15;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (resources.water === 0) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.health -= 10;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (resources.food === 0) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.health -= 10;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (resources.shield < 35) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        resources.health -= 10;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                resources.health = clamp(resources.health);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        updateDashboard();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (this.checkFailure()) return;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        message(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "Day " + resources.day +
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    " begins. Check your life-support systems!"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }

                                                }
    checkFailure() 
    {

        if (resources.health <= 0) {

            resources.health = 0;

            gameOver = true;

            this.player.body.setVelocity(0, 0);

            message(
                "MISSION FAILED! Your crew could not survive."
            );

            updateDashboard();

            return true;

        }

        return false;

    }

    finishMission() 
    {

        gameOver = true;

        this.player.body.setVelocity(0, 0);

        if (resources.science >= 30) {

            message(
                "MISSION SUCCESS! You survived seven days and completed your research!"
            );

        } else {

            message(
                "MISSION ENDED. You survived, but need more science points."
            );

        }

    }



// =====================================
// GAME CONFIGURATION
// =====================================

const config = {

    type: Phaser.AUTO,

    width: 960,

    height: 640,

    parent: "game-container",

    backgroundColor: "#777d91",

    physics: {

        default: "arcade",

        arcade: {

            debug: false

        }

    },

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    scene: [OutpostScene]

};

const game = new Phaser.Game(config);

// =====================================
// END DAY BUTTON
// =====================================

document.getElementById("end-day")
    .addEventListener("click", () => {

        const scene = game.scene.getScene("Outpost");

        if (scene && scene.scene.isActive()) {

            scene.advanceDay();

        }

    });

                            }
