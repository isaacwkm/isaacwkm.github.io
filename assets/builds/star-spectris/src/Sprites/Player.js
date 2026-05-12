class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, x = my.settings.positions.MiddleOfScreenX, y = my.settings.positions.PlayerShipYAxis, texture = "spaceSprites1", frame = "playerShip1_red.png") {
        super(scene, x, y, texture, frame);

        this.scene = scene;
        this.leftKey = scene.input.keyboard.addKey(my.settings.keybindings.moveLeft);
        this.rightKey = scene.input.keyboard.addKey(my.settings.keybindings.moveRight);
        this.fireKey = scene.input.keyboard.addKey(my.settings.keybindings.fire);

        this.playerSpeed = my.settings.movement.playerSpeed;
        this.bulletDamage = 10;

        this.moveBoundLeft = (this.displayWidth / 2);
        this.moveBoundRight = (game.config.width - (this.displayWidth / 2));

        this.properties = {
            health: 30,
            dodge: 0,
            defense: 0,
            baseDefense: 0, // used to keep track of the player's original defense before any buffs are applied
            status: 1, // normal (1), hit recovery (2), dying (3), dead (0 or 4)
        }

        this.tookHitTimestamp;

        this.createFollowerSprites(scene);

        this.setScale(0.5);
        scene.add.existing(this);

        return this;
    }

    makeInactive() {
        this.visible = false;
        this.x = -300;
        this.y = -300;

        
        //my.level.deathUpdate();
    }

    createFollowerSprites(scene) {

        this.shieldSprite1 = scene.add.sprite(0, 0, "t1Shield");
        let s1 = this.shieldSprite1;
        s1.setScale(0.5);
        s1.visible = false;

        this.shieldSprite2 = scene.add.sprite(0, 0, "t2Shield");
        let s2 = this.shieldSprite2;
        s2.setScale(0.5);
        s2.visible = false;
    }

    update() {
        this.checkCollision();
        this.checkStatusEffects();
        this.updatePollingMovement();
        this.updatePollingFire();
        this.updateFollowerMovement();
    }

    // updatePollingMovement(): polling for movement
    updatePollingMovement() {
        if (my.flags.movingAllowed == false) return;

        // Move left
        if ((this.leftKey.isDown) && this.x > this.moveBoundLeft) {
            for (let property in my.players) {
                my.players[property].x -= this.playerSpeed;
            }
        }
        // Move right
        if ((this.rightKey.isDown) && this.x < this.moveBoundRight) {
            for (let property in my.players) {
                my.players[property].x += this.playerSpeed;
            }
        }
    }

    // updatePollingFire(): polling for firing lasers
    updatePollingFire() {
        if (my.cooldowns.player.fire < 0 && (this.fireKey.isDown) && my.flags.firingAllowed == true) {
            this.fireBullet();
        }
    }

    fireBullet() {
        for (let bullet in my.projectilesPlayer) {
            let b = my.projectilesPlayer[bullet];
            if (my.cooldowns.player.fire < 0 && b.active == false) {
                b.x = this.x;
                b.y = this.y - 30;

                b.makeActive();
                b.setDamage(this.bulletDamage);
                my.cooldowns.player.fire = 6; // Shot cooldown
            }
        }
    }

    updateFollowerMovement() {
        this.shieldSprite1.x = this.x;
        this.shieldSprite1.y = this.y - 5;

        this.shieldSprite2.x = this.x;
        this.shieldSprite2.y = this.y;
    }

    checkCollision() {
        for (let category in my.projectilesEnemy) {
            let cat = my.projectilesEnemy[category];
            for (let bullet in cat) {
                let b = cat[bullet];
                if (HitCheck.completeHitCheck(b, this)) {
                    // start animation
                    this.hitAnim = this.scene.add.sprite(b.x, my.settings.positions.PlayerShipYAxis, "laserRed08").setScale(0.5).play("redLaserHitConfirm");

                    // clear out bullet -- put y offscreen, will get reaped next update
                    b.y = -100;
                    b.makeInactive();

                    // update player data
                    // update hp
                    let damage = b.damage;
                    this.loseHP(HitCheck.calculateFinalDmg(damage, this.properties.defense));

                    // set player status to hit recovery if player is not already in hit recovery
                    if (this.properties.status == 1) {
                        this.grantHitRecovery();
                    }

                }
                else {


                }
            }
        }
    }

    checkStatusEffects() {
        if (this.properties.status == 1) { // alive

        }
        else if (this.properties.status == 2) {
            this.handleHitRecovery();
        }
        else if (this.properties.status == 3) {
            my.flags.movingAllowed = false;
            this.dying();
        }
        else if (this.properties.status == 4) {
            console.log("statuseffects() status 4");
            this.gameOver();
        }
    }

    killThis() {
        // Play sound
        this.scene.sound.play("boom_echo", {
            volume: 0.6
        });

        // Set data values
        let ppty = this.properties;
        ppty.status = 3; // update player status

        GameText.setLivesOverlayIcons(this.scene, 0);
        this.tookHitTimestamp = my.gameRuntime;
        my.flags.firingAllowed = false; // disable firing for the duration to bring attention to the player model
        this.properties.dodge = 100;
        return;


    }

    grantHitRecovery() {
        // Set data values
        this.scene.sound.play("boom_echo", {
            volume: 0.6
        });
        let lifebar = Math.ceil(this.properties.health / 10);
        GameText.setLivesOverlayIcons(this.scene, lifebar);
        let ppty = this.properties;
        ppty.defense = 100; // grant temporary damage protection
        ppty.status = 2; // update player status
        this.tookHitTimestamp = my.gameRuntime; // timestamp on when the player got hit

        my.flags.firingAllowed = false; // disable firing for the duration to bring attention to the player model
        return;
    }

    removeHitRecovery() {
        let ppty = this.properties;

        ppty.defense = ppty.baseDefense; // revert defense to original value before buff was given

        if (this.properties.health > 0) {
            ppty.status = 1; // update player status
            my.flags.firingAllowed = true; // disable firing for the duration to bring attention to the player model
        }

        this.shieldSprite1.visible = false;
        this.shieldSprite2.visible = false;

        this.visible = true;
        return;
    }

    handleHitRecovery() {

        this.flashPlayerAvatar();
        this.raiseShieldAnim();
        if (this.properties.health > 0) {
            this.flashShieldWarning();
        }

        if (my.gameRuntime == this.tookHitTimestamp + 120) {
            this.removeHitRecovery();
            if (this.properties.health <= 0) {
                this.properties.status = 3; //make dying
            }
        }
    }

    dying() {
        this.flashPlayerAvatar();

        if (my.gameRuntime == this.tookHitTimestamp + 120) {
            this.removeHitRecovery();
            this.properties.status = 4; //make dead
        }

    }

    gameOver(){
        this.makeInactive();
        this.properties.status = 0;
        my.flags.firingAllowed = false;
        my.flags.gameOver = true;
        this.scene.gameOverTimestamp = my.gameRuntime;
        if (my.score.current > my.score.high){
            my.score.high = my.score.current;
        }
        GameText.addGameOverText(this.scene, false);
        
    }

    flashPlayerAvatar() {
        if (my.gameRuntime % 10 == 0) {
            if (this.visible == true) {
                this.visible = false;
            }
            else {
                this.visible = true;
            }
        }
    }

    raiseShieldAnim() {
        if (my.gameRuntime == this.tookHitTimestamp) {
            this.shieldSprite1.visible = true;
        }
        else if (my.gameRuntime == this.tookHitTimestamp + 5) {
            this.shieldSprite1.visible = false;
            this.shieldSprite2.visible = true;
        }
    }

    flashShieldWarning() {
        if (my.gameRuntime % 40 == 0) {
            this.scene.sound.play("shield5", {
                volume: 0.4   // Can adjust volume using this, goes from 0 to 1
            });
        }
    }

    loseHP(value) {
        //console.log("loseHP()");
        this.properties.health -= value;
        if (this.properties.health <= 0 && this.properties.status != 4) {
            this.killThis();
        }
    }

}