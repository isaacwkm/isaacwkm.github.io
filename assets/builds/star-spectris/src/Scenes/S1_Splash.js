class Splash extends Phaser.Scene {
    constructor() {
        super("splash");

        this.bullets = []
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {

    }

    create() {
        console.log("S1 Splash Screen created");

        //      // Scene
        //
        //
        //

        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        //this.background = this.add.tileSprite(midX, midY, 800, 600, "purple_background");

        //      // Player Model
        //
        //
        //

        let x = midX - 150;
        let y = midY - 70;
        this.playerShip = new Player(this, x, y);
        this.playerShip.angle = 90;

        //      // Enemy Model
        //
        //
        //

        x = midX + 150;
        y = midY - 67;
        this.enemyShip = new EnemyBlueprint(this, x, y);
        this.enemyShip.setScale(0.45);

        // Bullet
        //

        x -= 280;
        y = midY - 70;
        for (let i = 0; i < 3; i++){
            x += 60;
            this.bullets[i] = this.add.sprite(x, y, "spaceSprites1", "laserRed16.png");
            this.bullets[i].setScale(0.8);
            this.bullets[i].angle = 90;
            this.bullets[i].alpha = 0;
        }
        

        //      // Text
        //
        //
        //

        new GameText(this);
        GameText.versionInfo(this);

        // add loading text animation
        GameText.addLoadingAnimText(this, false);
        


        //      // Level Creation
        //
        //
        //

        // Move onto next scene after a delay
        let loadTime = Maths.getRandomInt(360, 120);
        this.startSceneAfterTicks(loadTime);

    }

    update() {

        // Do something every tick:
        this.handleScene();
        this.animateLoading();
        this.ticksElapsed++;
    }

    handleScene(){

        if (this.ticksElapsed == this.targetTicks - 60) {
            // phase out effect
        }
        else if (this.ticksElapsed == this.targetTicks) {
            // Move to next scene
            this.scene.start("mainMenu");
        }


    }

    startSceneAfterTicks(ticks = null) {
        if (ticks != null){
            this.ticksElapsed = 0;
            this.targetTicks = ticks
        }

    }

    animateLoading(firstStep = 0){
        const stepLength = 30;
        const maxSteps = 4;
        let step;

        if (this.ticksElapsed % stepLength == 0){
            step = MiscFunctions.animStepCalculator(this.ticksElapsed, stepLength, maxSteps)
            GameText.addLoadingAnimText(this, true, step);    
        }
        
        
        if (this.ticksElapsed % (stepLength * 2) == 0){
            step = MiscFunctions.animStepCalculator(this.ticksElapsed, stepLength * 2, maxSteps)
            this.animateLoadingBullets(step);
        }   
    }

    animateLoadingBullets(frame){
        if (frame == 3){
            for (let i = 0; i < 3; i++){
                this.bullets[i].alpha = 0;
            }
        }
        else{
            for (let i = 0; i < frame; i++){
                this.bullets[i].alpha = 0.2;
            }
            this.bullets[frame].alpha = 1;
        }
    }

    
}