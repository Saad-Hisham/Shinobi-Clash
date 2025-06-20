class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
    }

    preload() {
        this.load.spritesheet("halo", "/assets/halo.png", {
            frameWidth: 64,  // Adjust based on your sprite sheet
            frameHeight: 64, // Adjust based on your sprite sheet
        });
    }

    create() {
        const framesPerRow = 7; // Total frames in each row

        // Select which row to play (0-based index)
        const rowIndex = 2; // Example: Playing the 3rd row (Index starts at 0)

        this.anims.create({
            key: "haloGlow",
            frames: this.anims.generateFrameNumbers("halo", { 
                start: rowIndex * framesPerRow, // Calculate first frame of the row
                end: (rowIndex * framesPerRow) + (framesPerRow - 1) // Calculate last frame of the row
            }),
            frameRate: 10, // Speed of animation
            repeat: -1 // Loop animation forever
        });

        // Create the sprite and play the animation
        this.halo = this.add.sprite(400, 300, "halo").setScale(2);
        this.halo.play("haloGlow");
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: GameScene
};

const game = new Phaser.Game(config);
