class PlayerController {

    constructor(scene) {

        this.scene = scene;

        // Create astronaut

        this.sprite = scene.add.ellipse(
            480, 320,
            28, 30,
            0xf0eee5
        );

        // Physics

        scene.physics.add.existing(this.sprite);

        this.sprite.body.setCircle(14);

        this.sprite.body.setCollideWorldBounds(true);

        // Keyboard controls

        this.keys = scene.input.keyboard.addKeys({

            up: Phaser.Input.Keyboard.KeyCodes.W,

            down: Phaser.Input.Keyboard.KeyCodes.S,

            left: Phaser.Input.Keyboard.KeyCodes.A,

            right: Phaser.Input.Keyboard.KeyCodes.D,

            up2: Phaser.Input.Keyboard.KeyCodes.UP,

            down2: Phaser.Input.Keyboard.KeyCodes.DOWN,

            left2: Phaser.Input.Keyboard.KeyCodes.LEFT,

            right2: Phaser.Input.Keyboard.KeyCodes.RIGHT,

            interact: Phaser.Input.Keyboard.KeyCodes.E,

            space: Phaser.Input.Keyboard.KeyCodes.SPACE

        });

        // Mobile controls

        this.mobile = {

            up: false,

            down: false,

            left: false,

            right: false

        };

        // Focus keyboard on game

        scene.input.on("pointerdown", () => {

            if (scene.game.canvas) {

                scene.game.canvas.focus();

            }

        });

    }

    update() {

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

        // Prevent faster diagonal movement

        const movement = new Phaser.Math.Vector2(vx, vy);

        if (movement.length() > 0) {

            movement.normalize().scale(speed);

        }

        this.sprite.body.setVelocity(
            movement.x,
            movement.y
        );

        // Keyboard interaction

        if (
            Phaser.Input.Keyboard.JustDown(this.keys.interact) ||
            Phaser.Input.Keyboard.JustDown(this.keys.space)
        ) {

            this.scene.interactWithNearest();

        }

    }

}