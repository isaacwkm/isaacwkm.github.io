class PlayerIcon extends Phaser.GameObjects.Sprite {

    // Simple small player icon for ui

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    constructor(scene, x = my.settings.positions.MiddleOfScreenX, y = my.settings.positions.MiddleOfScreenY, texture = "spaceSprites1", frame = "playerShip1_red.png") {
        super(scene, x, y, texture, frame);

        this.setScale(0.2);
        this.visible = true; 

        scene.add.existing(this);
    }
}