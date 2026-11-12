
class WorldBuilder {

    constructor(scene) {

        this.scene = scene;

        this.buildings = [];

    }

    createMap() {

        const scene = this.scene;

        scene.cameras.main.setBackgroundColor("#777d91");

        scene.physics.world.setBounds(
            0, 0, 960, 640
        );

        const graphics = scene.add.graphics();

        // Lunar ground

        graphics.fillStyle(0x777d91);

        graphics.fillRect(0, 0, 960, 640);

        // Craters and rocks

        for (let i = 0; i < 100; i++) {

            const x = Phaser.Math.Between(10, 950);

            const y = Phaser.Math.Between(10, 630);

            const size = Phaser.Math.Between(2, 7);

            graphics.fillStyle(0x969cab, 0.6);

            graphics.fillCircle(x, y, size);

        }

        // Main pathways

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

        // Buildings

        this.addBuilding(
            170, 155, "HABITAT", 0x397fa9
        );

        this.addBuilding(
            480, 145, "POWER ARRAY", 0xc9a84c
        );

        this.addBuilding(
            790, 155, "GREENHOUSE", 0x438d66
        );

        this.addBuilding(
            260, 465, "SCIENCE LAB", 0x8064ad
        );

        this.addBuilding(
            700, 465, "SUPPLY DEPOT", 0xb87555
        );

    }

    addBuilding(x, y, name, colour) {

        const scene = this.scene;

        const shape = scene.add.rectangle(
            x, y, 112, 76, colour
        );

        scene.physics.add.existing(shape, true);

        // Roof

        scene.add.rectangle(
            x, y - 26, 88, 10, 0xe8e9ed
        );

        // Door

        scene.add.rectangle(
            x, y + 18, 20, 32, 0x273c52
        );

        // Name

        scene.add.text(
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

            x: x,

            y: y,

            shape: shape

        });

    }

    addCollisions(player) {

        this.buildings.forEach(building => {

            this.scene.physics.add.collider(
                player,
                building.shape
            );

        });

    }

    findNearest(x, y) {

        let nearest = null;

        let shortest = 110;

        this.buildings.forEach(building => {

            const distance = Phaser.Math.Distance.Between(
                x, y,
                building.x, building.y
            );

            if (distance < shortest) {

                shortest = distance;

                nearest = building;

            }

        });

        return nearest;

    }

}
