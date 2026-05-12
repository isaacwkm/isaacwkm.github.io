class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");

    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {

    }

    create() {
        console.log("S2 Main Menu created");

        //      // Local Init
        //
        //
        //

        this.startingLevel = 1;
        this.ticksElapsed = 0;
        this.coinInserted = false;

        //      // Globals
        //
        //
        //

        my.bgScrollSpeedMult = 0.5;
        my.enemyBp = new EnemyBlueprint(this, -100, -100);

        //      // Scene
        //
        //
        //

        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        this.background = this.add.tileSprite(midX, midY, 800, 600, "purple_background");

        //      // Keybindings
        //
        //
        //

        this.fireKey = this.input.keyboard.addKey(my.settings.keybindings.fire);

        this.input.keyboard.on('keydown', () => {
            this.bringOutTheMainMenu();
        });

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

        //      // Effects/Animations
        //
        //
        //    
        
        //this.anims.create(my.anims.redLaserHit);
        //this.anims.create(my.anims.blueLaserHit);
        //this.anims.create(my.anims.greenLaserHit);

        //      // Text
        //
        //
        //

        this.text = {};

        // score
        GameText.versionInfo(this);
        GameText.addFancyTitleText(this);
        GameText.addControlInstructions(this);
        GameText.addInsertCoin(this, false);

        //      // Audio
        //
        //
        //

        this.game.sound.stopAll();
        
        this.sound.play("bgMusicMain", {
            volume: 0.1   // Background Music
        })



        //      // Level Creation
        //
        //
        //

    }

    sceneDestructor(){

    }

    update() {

        // Scrolling Background
        this.background.tilePositionY -= 4;

        // Insert Coin animation
        this.insertCoinAnim();

        // Insert Credits after a delay
        this.insertCredits();

        // Do something every tick:
        this.ticksElapsed++;
        //console.log();
    }

    bringOutTheMainMenu(){
        if (this.coinInserted == false){
            GameText.addMainMenuOptions(this);
            GameText.addInsertCoin(this, true, 1);
            this.coinInserted = true;
            this.scene.start("level");
        }
    }

    insertCoinAnim(){
        if (this.coinInserted == true){
            return
        }
        else if (this.ticksElapsed % 120 == 0){
            GameText.addInsertCoin(this, true, 0);
        }
        else if (this.ticksElapsed % 120 == 60){
            GameText.addInsertCoin(this, true, 1);
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
        for (let bullet in my.projectilesPlayer){
            my.projectilesPlayer[bullet].update();
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

    insertCredits(){
        if ((this.ticksElapsed) - 240 == 0){
            GameText.addOnScreenCredits(this);
        }
    }

}