class Enemy extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    constructor(scene, texture, frame, x, y, propertyObj = my.defaultConfigs.enemy) {
        super(scene, x, y, texture, frame);

        this.setScale(0.55);
        scene.add.existing(this);

        this.scene = scene;

        // For shMultX: 1 = shifting right, -1 = shifting left
        this.shiftData = { shMultX: -1, firstShift: true, shChangeTime: -1 };
        this.lrShifting = { tempPosition: { x: 0, y: 0 } };
        this.moveBoundLeft = (this.displayWidth / 2);
        this.moveBoundRight = (game.config.width - (this.displayWidth / 2));

        this.rowShift = { steps: 3, currentStep: 0, timestamp: 0 };

        this.properties = propertyObj;
        this.properties.health *= my.difficulty.healthMult;

        this.makeActive();

        return this;
    }

    update() {

        if (this.active == false) {
            return;
        }
        this.checkCollision();
        this.updateShifting();
        this.stateCheck();
        this.properties.lifetime++;
    }

    // Check for collision with the enemy
    checkCollision() {
        for (let bullet in my.projectilesPlayer) {
            let b = my.projectilesPlayer[bullet];
            if (HitCheck.completeHitCheck(b, this) && HitCheck.hitCheck(25)) { // natural "dodge" chance of 50 doesn't make bullets inactive. Gives illusion that bullets hit different parts of the enemy ship
                // start animation
                this.hitAnim = this.scene.add.sprite(b.x, b.y - 30, "laserRed08").setScale(0.5).play("redLaserHitConfirm");
                
                // clear out bullet -- put y offscreen, will get reaped next update
                b.y = -100;
                b.makeInactive();

                // Play sound
                this.scene.sound.play("metalHit", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });

                // update enemy HP
                this.loseHP(HitCheck.calculateFinalDmg(b.damage, this.properties.defense));

            }

        }

    }


stateCheck() {
    if (this.properties.state == "alive") {

    }
    else if (this.properties.state == "dying") {
        this.dyingAnimation();
        if (this.properties.lifetime == this.timeOfDeath + 60) {
            this.properties.state = "dead";
            this.alpha = 1;
        }
    }
    else if (this.properties.state == "dead") {
        this.makeInactive();
    }

}

dyingAnimation() {
    //console.log("dyingAnimation()");
    if (this.properties.lifetime % 10 == 0) {
        if (this.visible == true) {
            this.visible = false;
        }
        else {
            this.visible = true;
        }
    }
}

killThis() {
    //console.log("killThis()");
    if (my.level.checkEnemiesAlive(1)) {
        my.flags.firingAllowed = false;
        this.scene.sound.play("boom_echo", {
            volume: 0.5   // special sound for killing last enemy
        });
    }
    else {
        this.scene.sound.play("boom", {
            volume: 0.5  // normal sound when killing enemy
        });
    }

    let loweredAlpha = this.alpha - 0.35;
    if (loweredAlpha < 0.35) {
        loweredAlpha = 0.35;
    }

    my.score.current += 100;
    GameText.setScore(this.scene, my.score.current);
    my.level.decrEnemyAliveCount();
    this.alpha = loweredAlpha;
    this.properties.state = "dying";
    this.timeOfDeath = this.properties.lifetime;
}

loseHP(value) {
    //console.log("loseHP()");
    this.properties.health -= value;
    if (this.properties.health <= 0 && this.properties.state == "alive") {
        this.killThis();
    }
}

updateShifting() {
    let row = this.properties.row;
    let presetY = my.settings.layout.yAxisOfRow;
    let offset;
    if (my.queue.shifting[0] != null) { // Do not bob up and down while shifting rows
    }
    else {
        offset = (row - 1) * 10;
        if (my.gameRuntime % 150 == 0 + offset) {
            this.y = presetY[row] + 5;
        }
        else if (my.gameRuntime % 150 == 90 - offset) {
            this.y = presetY[row] - 5;
        }
    }

    if (this.properties.row != 1) {

    }
    else {
        this.x += 2 * this.shiftData.shMultX;
        if (my.gameRuntime == this.shiftData.shChangeTime) {
            this.shiftData.shMultX *= -1;
            this.shiftData.shChangeTime = my.gameRuntime + 180;
        }
    }

}

shiftRowDown(step = 1, maxSteps = 6) {
    //console.log("Enemy.shiftRowDown()");

    let oldPos = my.settings.layout.yAxisOfRow[this.properties.row + 1];
    let target = my.settings.layout.yAxisOfRow[this.properties.row];
    let offset = Math.abs((target - oldPos));
    let offsetPerStep = offset / maxSteps;

    let newPos = oldPos + (offsetPerStep * step);
    this.y = newPos;
}

decrRowProperty(){
    if (this.properties.row) {
        //console.log("decrRowProperty on " + this.properties.row + " -> " + (this.properties.row-1) )
        this.properties.row -= 1;
    }
}

makeActive() {
    this.visible = true;
    this.properties.dodge = this.properties.baseDodge;
    this.properties.state = "alive";
    //console.log("makeActive(): this.properties.row: " + this.properties.row);
    this.makeRowEffects(this.properties.row);
}

makeEthereal() {
    this.properties.dodge = 100;
    this.properties.buffs.ethereal = true;
}

makeEvasive() {
    this.properties.dodge = 25;
    this.properties.buffs.ethereal = true;
}

makeExtraEvasive() {
    this.alpha = 0.75;
    this.properties.dodge = 75;
    this.properties.buffs.extraEvasive = true;
}

makeStealthed() {
    this.alpha = 0.35;
    this.properties.dodge = 100;
    this.properties.buffs.stealthed = true;
}

makeInactive() {
    this.visible = false;
    this.properties.state = "dead";
    this.x = -300;
    this.y = -300;
    this.removeFrontBackLink(this.properties.allyBehind);
    let index = this.properties.id;
    my.enemiesRowData[this.properties.row - 1]--;
    my.enemies[index] = null;
    my.enemyMan.deathUpdate();
}

makeUnethereal() {
    this.properties.dodge = this.properties.baseDodge;
    if (this.properties.buffs.ethereal) {
        delete this.properties.buffs.ethereal;
    }
}

makeUnevasive() {
    this.properties.dodge = this.properties.baseDodge;
    if (this.properties.buffs.evasive) {
        delete this.properties.buffs.evasive;
    }
}

makeUnextraEvasive() {
    this.alpha = 1;
    this.properties.dodge = this.properties.baseDodge;
    if (this.properties.buffs.extraEvasive) {
        delete this.properties.buffs.extraEvasive;
    }
}

makeUnstealthed() {
    this.alpha = 1;
    this.properties.dodge = this.properties.baseDodge;
    if (this.properties.buffs.stealthed) {
        delete this.properties.buffs.stealthed;
    }
}

makeRowEffects(num) {
    switch (num) {
        case 1: // front row (on screen)
            this.makeUnstealthed();
            this.makeUnextraEvasive();
            break;

        case 2: // middle row (on screen)
            this.makeUnstealthed();

            this.makeExtraEvasive();
            break;

        case 3: // last row (on screen)
            this.makeStealthed();
            break;

        case 4: // offscreen
            this.makeStealthed();
            break;

        case 5: // not rendered
            console.log("makeRowEffects() num is 5.");
            break;

        default:
            throw "makeRowEffects() num is not 1, 2, or 3."

    }

}

removeFrontBackLink(backAlly) {
    if (backAlly) {
        backAlly.properties.allyInFront = false;
    }
    // do something with frontAlly if needed
}

consoleOutputLinks() {
    let str = "";
    let i = 1;
    let prevEnemy = null
    if (my.enemies[0]) {
        prevEnemy = my.enemies[0];
    }
    else {
        console.log("consoleOutputLinks(): Enemy array is empty.")
        return;
    }
    console.log("format: E[num]: [hasAllyInfront, hasAllyBehind]");
    for (let enemy of my.enemies) {
        if (enemy) {
            if (enemy.y != prevEnemy.y) {
                console.log(str);
                str = "";
            }
            str += "E" + i++ + ": [";
            if (enemy.properties.allyInFront) {
                str += "true, ";
            }
            else {
                str += "false, ";
            }
            if (enemy.properties.allyBehind) {
                str += "true], ";
            }
            else {
                str += "false], ";
            }
            prevEnemy = enemy;
        }

    }
    str = str.slice(0, -2);
    console.log(str);
}

}