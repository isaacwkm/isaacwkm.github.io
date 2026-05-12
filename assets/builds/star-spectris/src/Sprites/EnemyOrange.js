class EnemyOrange extends Enemy {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    constructor(scene, x, y, identifier, rowOnScreen, texture = "spaceSprites1", frame = "enemyRed3.png") {
        let properties = {
            id: identifier, // unique identifier
            state: "dead", // alive, dying, dead
            health: 40,
            defense: 0, // damage mitigation rate (100 = 100% of damage blocked)
            baseDefense: 0, // base defense to keep track when reverting buffs
            lifetime: 0, // tick counter to use in cycling behavior phases
            row: rowOnScreen, // Row on-screen. 1: front, 2: middle, 3: back, -1: offscreen
            dodge: 0, // bullet dodge chance
            baseDodge: 0, // used for reference when reverting buffs
            buffs: {}, // list of active buffs
            debuffs: {}, // list of active debuffs
            allyInFront: null, // link to the closest ally in front. null indicates it has no ally in front of it.
            allyBehind: null, // link to the closest ally in behind. null indicates it has no ally behind it.
            phaseLifetime: 0, // timer that resets upon completing one entire cycle of phases.
            phase: 0, // standby (0) -> shielding (1) -> repeat (0)
            shootMode: 1, // off (0), normal (1),  special (2)
            shootCooldown: 3, //seconds
        }

        super(scene, texture, frame, x, y, properties);

        this.scene = scene;
        this.phases = ["standby", "shielding"]; // mostly for informational reference. Not to be used over this.properties.phase
        this.phaseDurations = [540, 360];
        this.phaseTargets = MiscFunctions.calculatePhaseTargets(this.phaseDurations);
        const arrLen = this.phaseTargets.length;
        const randOffset = Maths.getRandomInt(this.phaseTargets[arrLen - 1]);
        this.properties.phaseLifetime = randOffset; // randOffset makes the enemy's shooting patterns not synchronized perfectly

        this.createFollowerSprites(scene);
        this.checkPhase();

        return this;
    }

    createFollowerSprites(scene) {

        this.shieldSprite1 = scene.add.sprite(0, 0, "t1Shield");
        let s1 = this.shieldSprite1;
        s1.angle = 180;
        s1.setScale(0.55);
        s1.visible = false;

        this.shieldSprite2 = scene.add.sprite(0, 0, "t2Shield");
        let s2 = this.shieldSprite2;
        s2.angle = 180;
        s2.setScale(0.55);
        s2.visible = false;
    }

    killThis() {
        let s1 = this.shieldSprite1;
        let s2 = this.shieldSprite2;
        s1.visible = false;
        s2.visible = false;

        my.score.current += 50;
        super.killThis();
    }

    makeInactive(){
        super.makeInactive();
    }

    update() {
        // Check for class-specific behavior phases:
        this.updatePhase();

        // Parent Enemy class update procedures
        super.update();

        // Move shield with the enemy
        this.updateFollowerMovement();

        this.properties.phaseLifetime++
    }

    updateFollowerMovement() {
        this.shieldSprite1.x = this.x;
        this.shieldSprite1.y = this.y + 5;

        this.shieldSprite2.x = this.x;
        this.shieldSprite2.y = this.y + 5;
    }
    // Potential phases for this enemy: 
    // 
    updatePhase() {
        let phaseTime = this.properties.phaseLifetime;
        let phaseTargets = this.phaseTargets;

        // Unconditional continuous firing
        if (phaseTime % 300 == 0) {
            this.fireLaser();
        }

        if (phaseTime < phaseTargets[0]) { // During phase 0: Standby mode

            if (phaseTime == (phaseTargets[0] - 60)) { // Early Animation to foreshadow phase change
                //this.shieldSprite1.visible = true; // Update Shield animation
            }
        }
        else if (phaseTime == phaseTargets[0]) { // Transition to phase 1
            this.phaseTransition(1);
        }
        else if (phaseTime < phaseTargets[1]) { // During phase 1: Shield mode

        }
        else if (phaseTime == phaseTargets[1]) { // Transition back to phase 0
            //console.log("Return to phase 0");
            this.phaseTransition(0);
            this.properties.phaseLifetime = 0;
        }

    }

    checkPhase() { // non-continuous version of updatePhase()
        let phaseTime = this.properties.phaseLifetime;
        let phaseTargets = this.phaseTargets;

        if (phaseTime < phaseTargets[0]) { // Transition to phase 0: Standby mode
            this.phaseTransition(0);
        }
        else if (phaseTime < phaseTargets[1]) { // During phase 1: Shield mode
            this.phaseTransition(1);
        }
    }

    phaseTransition(targetPhase) {
        switch (targetPhase) {
            case 0:
                //this.removeShieldBuff();
                this.properties.phase = 0;
                break;

            case 1:
                //this.addShieldBuff();
                this.properties.phase = 1;
                break;

            default:

        }

        return;
    }

    fireLaser() {

        if (this.checkFireOK() == false) {
            //console.log("fire NOT ok");
            return;
        }

        for (let bullet in my.projectilesEnemy.ballRedAnim) {
            let b = my.projectilesEnemy.ballRedAnim[bullet];
            if (b.active == false) {
                b.x = this.x;
                b.y = this.y + 30;

                b.getFired(this.x, this.y);
                b.setDamage(10);
                return;
            }
        }
    }

    checkFireOK() {
        //console.log("checkFireOK() steps: ");
        //console.log("1");
        if (this.properties.row > 2) return false; // no shooting from back rows
        //console.log("2");
        //if (this.properties.allyInFront == true) return false; // no shooting while allies are in front of it
        //console.log("3");
        if (this.properties.shootMode == 0) return false;// no shooting while shootMode flag is 0
        //console.log("4");
        //if (my.queue.shifting[0] != null) return false; // no shooting while shifting down
        //console.log("5");

        return true;
    }

    addShieldBuff() {
        my.sounds.playAscendingShield(this.scene.sound);
        this.properties.defense = 100;
        this.shieldSprite1.visible = false;
        this.shieldSprite2.visible = true;

    }

    removeShieldBuff() {
        //console.log("removeShieldBuff");
        this.properties.defense = this.properties.baseDefense;
        this.shieldSprite2.visible = false;
    }



}