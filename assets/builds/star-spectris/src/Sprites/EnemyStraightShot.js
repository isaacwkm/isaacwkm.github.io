class EnemyStraightShot extends Phaser.GameObjects.Sprite {
    constructor(scene, texture, frame = null, anim = null, speed = 4, scale = 0.5, straight = true, followConfig = null, x = 0, y = 0) {
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.missed = false;

        this.bulletSpeed = speed;
        this.damage = 10;
        this.scene = scene;
        this.straight = straight;
        this.followConfig = followConfig;

        this.setupAimedShots();

        this.setScale(scale);
        if (anim != null) {
            this.play(anim);
        }
        this.anim = anim;

        this.angle = 180;

        scene.add.existing(this);

        return this;
    }

    // updatePlayerBullets(): update trajectory of player's fired lasers
    update() {
        //console.log("Straight Shot Update");
        if (this.active) {
            this.y += this.bulletSpeed;
            //console.log(this.y + ", " + this.displayHeight/2 + ", " + game.config.width);
            if ((this.y - (this.displayHeight / 2)) > game.config.height) {
                this.makeInactive();
            }

        }
    }

    setDamage(value) {
        this.damage = value;
    }

    getFired(enemyX, enemyY){
        if (this.straight == false){
            let playerX = my.players.playership.x;
            let playerY = my.players.playership.y;
            this.addPoint({x: enemyX, y: enemyY});
            this.addPoint({x: playerX, y: playerY});
        }

        this.makeActive();
    }

    makeActive() {
        // Play sound
        AlgorithmicSounds.playRandomShot(this.scene.sound);
        this.visible = true;
        this.active = true;
        this.makeUnMissed();
    }

    makeInactive() {
        //console.log("EnemyStraightShot makeInactive()");
        this.visible = false;
        this.active = false;
        this.y = -100;
        this.makeUnMissed();
    }



    makeMissed() {
        this.missed = true;
        this.alpha = 0.2;
    }

    makeUnMissed() {
        this.missed = false;
        this.alpha = 1;
    }

    setupAimedShots() {
        if (this.straight == true) {
            return;
        }

        if (this.followConfig == null) {
            this.followConfig = {
                from: 0,
                to: 1,
                delay: 0,
                duration: 2000,
                ease: 'Sine.easeInOut',
                repeat: 0,
                yoyo: true,
                rotateToPath: false,
                rotationOffset: -90
            }
        }
        else {
        }

        this.curve = new Phaser.Curves.Spline([]);
        this.curve.addPoint(point);
    }

    addPoint(point) {
        this.curve.addPoint(point);
    }

}