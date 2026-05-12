class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, texture, frame, speed, x = 0, y = 0,) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.missed = false;
        this.bulletSpeed = speed;
        this.damage = 10;
        this.scene = scene;

        this.setScale(0.6);

        scene.add.existing(this);

        return this;
    }
   
    // updatePlayerBullets(): update trajectory of player's fired lasers
    update(){
        if (this.active) {
            this.y -= this.bulletSpeed;
            if (this.y < -(this.displayHeight/2)) {
                this.makeInactive();
            }

        }
    }

    setDamage(value){
        this.damage = value;
    }

    makeActive() {
        // Play sound
        this.scene.sound.play("playerLaserShoot", {
            volume: 0.4   // Can adjust volume using this, goes from 0 to 1
        });
        this.visible = true;
        this.active = true;
        this.makeUnMissed();
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
        this.y = -100;
        this.makeUnMissed();
    }

    makeMissed() {
        this.missed = true;
        this.alpha = 0.2;
    }

    makeUnMissed(){
        this.missed = false;
        this.alpha = 1;
    }

}