class Level extends Phaser.Scene {
    constructor() {
        super("level");

        this.startingLevel = 1;
        this.gameOverTimestamp;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {

    }

    create() {
        console.log("S3 Level created");

        //      // Globals
        //
        //
        //

        my.enemyBp = new EnemyBlueprint(this, -100, -100);
        my.flags.movingAllowed = true;
        my.score.current = 0;


        //      // Key Objects (Menu selection)
        //
        //
        //

        this.fireKey = this.input.keyboard.addKey(my.settings.keybindings.fire);


        //      // Scene
        //
        //
        //

        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        this.background = this.add.tileSprite(midX, midY, 800, 600, "purple_background");


        //      // Effects/Animations
        //
        //
        //    
        
        this.anims.create(my.anims.redLaserHit);
        this.anims.create(my.anims.blueLaserHit);
        this.anims.create(my.anims.greenLaserHit);
        this.anims.create(my.anims.redLaserBall);


        //      // Player Model
        //
        //
        //

        my.players.playerShip = new Player(this);

        //      // Enemies
        //
        //
        //      
        
        

        //      // Projectiles
        //
        //
        //      

        // making player projectiles

        my.projectilesPlayer = {};
        for (let i = 0; i < my.settings.projectiles.maxPlayerBullets; i++){
            my.projectilesPlayer[i] = new Bullet(this, "spaceSprites1", "laserRed16.png", 12);
        }

        // making enemy projectiles

        my.projectilesEnemy = {};

        // Small Blue shots
        my.projectilesEnemy.shotBlueSmall = [];
        for (let i = 0; i < 20; i++){
            my.projectilesEnemy.shotBlueSmall[i] = new EnemyStraightShot(this, "laserBlueShort");
        }

        // Animated Red ball lasers
        my.projectilesEnemy.ballRedAnim = [];
        for (let i = 0; i < 20; i++){
            my.projectilesEnemy.ballRedAnim[i] = new EnemyStraightShot(this, "laserRed09", null, "redLaserBall", 2, 0.5);
        }

        // Medium Green shots
        my.projectilesEnemy.shotGreenMedium = [];
        for (let i = 0; i < 60; i++){
            my.projectilesEnemy.shotGreenMedium[i] = new EnemyStraightShot(this, "laserGreenMedium", null, null, 16, 0.7);
        }

        // Large Green countershots
        my.projectilesEnemy.greenCountershot = [];
        for (let i = 0; i < 20; i++){
            my.projectilesEnemy.greenCountershot[i] = new EnemyStraightShot(this, "laserGreenLong", null, null, 24, 1.5);
        }

        //      // Text
        //
        //
        //

        new GameText(this);
        GameText.versionInfo(this);
        GameText.addLivesOverlay(this, 3);
        GameText.setLivesOverlayIcons(this, 3);
        GameText.addScoreOverlay(this, 0);
        GameText.addCurrLevelOverlay(this, 1);
        // Pop-up Tutorials
        GameText.popUpTutorial(this, 1);


        //      // Level Creation
        //
        //
        //

        my.enemyMan = new EnemyManager(this);
        my.level = new LevelManager(this, 1);

    }

    update() {

        // Scrolling Background
        this.background.tilePositionY -= 1 * my.bgScrollSpeedMult;
        
        // Game State
        this.gameOverAnim();

        // Decrement all cooldown counters
        this.updateCooldowns();

        // Update player (movement, state, etc.)
        my.players.playerShip.update();

        // Update enemy manager
        my.enemyMan.update();

        // Update enemies
        this.updateEnemies();

        // Update bullets
        this.updateBullets();

        // Do something every second:
        // this.doEverySecond();

        // Do something every tick:
        my.gameRuntime++;
        //console.log(my.level.enemyCount.alive);
    }

    doEverySecond(){
        let rt = my.gameRuntime;
        if (rt % 60 != 0){
            return;
        }
        else{
            //Do everhthing here
            rt = Math.floor(rt/60);
            console.log("doEverySecond():");
            console.log(my.players.playerShip);
        }
    }

    updateEnemies(){
        for (let enemy of my.enemies){
            if(enemy){
                enemy.update();
            }
        }
    }

    updateBullets(){
        this.updatePlayerBullets();
        this.updateEnemyBullets();
    }

    updatePlayerBullets(){
        for (let bullet in my.projectilesPlayer){
            my.projectilesPlayer[bullet].update();
        }
    }

    // here
    updateEnemyBullets(){
        for (let category in my.projectilesEnemy) {
            let cat = my.projectilesEnemy[category];
            for (let bullet in cat) {
                let b = cat[bullet].update();
            }
        }
    }

    // updateCooldowns(): reducing cooldown count of all cooldowns (player, enemy, specials)
    updateCooldowns(){
        let entityObj = null;
        for (let entity in my.cooldowns){ // entity: player, enemy, etc.
            entityObj = my.cooldowns[entity];
            for (let cd in entityObj){ // cd: fire, shield, etc.
                entityObj[cd] -= 1;
            }
        }
    }

    gameOverAnim(){
        let gameOverTime = my.gameRuntime - this.gameOverTimestamp;

        if (my.flags.gameOver == false){
            return
        }
        else if ((gameOverTime) - 30 == 0){
            GameText.addEndScore(this, my.score.current);
        }
        else if ((gameOverTime) - 60 == 0){
            GameText.addEndHighscore(this, my.score.high);
        }
        else if ((gameOverTime) - 90 == 0){
            GameText.addPlayAgain(this);
        }
        else if(gameOverTime > 90 && this.fireKey.isDown){
            my.flags.gameOver = false;
            my.level.updateLevelCheck(false);
            this.scene.start("mainMenu");
        }
        
    }

}