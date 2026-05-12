class EnemyBlueprint extends Phaser.GameObjects.Sprite {

    // Class is only used to aid in reference of sprite dimensions for other Classes
    // Is NOT 

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    constructor(scene, x = my.settings.positions.MiddleOfScreenX, y = my.settings.positions.MiddleOfScreenY,  texture = "spaceSprites1", frame = "enemyBlue3.png") {
        super(scene, x, y, texture, frame);

        this.setScale(0.55);
        this.visible = true; 
        // The blueprint enemy should not be visible to the player. 
        // However this.visible doesnt need to be false 
        // because x, y, can be set off screen when creating the enemy

        scene.add.existing(this);
    }
}