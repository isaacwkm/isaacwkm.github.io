class GameConfig extends Phaser.Scene {
    constructor() {
        super("gameConfig");

        // Constants for starting positions
        my.settings.positions.MiddleOfScreenX = 400;
        my.settings.positions.PlayerShipYAxis = 500;
        my.settings.positions.MiddleOfScreenY = 300;

        // Key bindings
        my.settings.keybindings.moveLeft = "LEFT";
        my.settings.keybindings.moveRight = "RIGHT";
        my.settings.keybindings.fire = "SPACE";

        // Movement
        my.settings.movement.playerSpeed = 12;

        // Projectiles
        my.settings.projectiles.maxPlayerBullets = 12;

        // Enemy Layout
        my.settings.layout.columns = 9;
        my.settings.layout.yAxisOfRow[1] = 150;

        // Cooldown
        my.cooldowns.player = {};
        my.cooldowns.player.fire = 0;

    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {

        this.load.setPath("assets/");

        // Load sprite atlas
        this.load.setPath("assets/sprites/");
        this.load.atlasXML("spaceSprites1", "sheet.png", "sheet.xml");
        this.load.atlasXML("spaceSprites2", "spaceShooter2_spritesheet.png", "spaceShooter2_spritesheet.xml");

        // Load .pngs

        // Background
        this.load.setPath("assets/image/background");
        this.load.image("purple_background", "purple.png");
        this.load.image("darkPurple_background", "darkPurple.png");
        // Laser anims
        this.load.setPath("assets/image/anims");
        this.load.image("laserRed08", "laserRed08.png");
        this.load.image("laserRed09", "laserRed09.png");
        this.load.image("laserRed10", "laserRed10.png");
        this.load.image("laserBlue08", "laserBlue08.png");
        this.load.image("laserBlue09", "laserBlue09.png");
        this.load.image("laserGreenCharge2", "laserGreen14.png");
        this.load.image("laserGreenCharge1", "laserGreen15.png");
        // High res pngs
        this.load.setPath("assets/image/highres");
        this.load.image("laserBlueShort", "laserBlue06.png");
        this.load.image("t1Shield", "shield1.png");
        this.load.image("t2Shield", "shield2.png");
        this.load.image("laserGreenMedium", "laserGreen10.png");
        this.load.image("laserGreenLong", "laserGreen11.png");
        this.load.image("laserGreenShort", "laserGreen12.png");

        // Font
        this.load.setPath("assets/fonts/");
        this.load.bitmapFont('ice', 'iceicebaby.png', 'iceicebaby.xml');
        this.load.bitmapFont('arcade', 'arcade.png', 'arcade.xml');
        this.load.bitmapFont('stylized', 'atari-smooth.png', 'atari-smooth.xml');
        this.load.bitmapFont('ui', 'clarendon.png', 'clarendon.xml');

        // Sound assets
        this.load.setPath("assets/audio/sfx/");
        this.load.audio("bgMusicMain", "AdhesiveWombatMusic.mp3");
        this.load.audio("playerLaserShoot", "laserSmall_000.ogg");
        this.load.audio("metalHit", "impactMetal_002.ogg");
        this.load.audio("boom", "explosionCrunch_000.ogg");
        this.load.audio("boom_echo", "explosionCrunch_echo.ogg");
        this.load.audio("enemyLaser1", "laserSmall_001.ogg");
        this.load.audio("enemyLaser2", "laserSmall_002.ogg");
        this.load.audio("enemyLaser3", "laserSmall_003.ogg");
        this.load.audio("enemyLaser4", "laserSmall_004.ogg");
        this.load.audio("shield1", "forceField_001.ogg");
        this.load.audio("shield2", "forceField_002.ogg");
        this.load.audio("shield3", "forceField_003.ogg");
        this.load.audio("shield4", "forceField_004.ogg");
        this.load.audio("shield5", "forceField_005.ogg");
        

        // update instruction text
        // document.getElementById('description').innerHTML = '<h2>Controls: <br>A - move left // D - move right // SPACE - shoot</h2>'



    }

    create() {

        //      // Globals
        //
        //
        //

        // inactive enemy for use in setting constants
        my.enemyBp = new EnemyBlueprint(this, -100, -100);

        // set constants using the enemy blueprint created above
        this.setMyLayoutConstants();

        //      // Scene/Level
        //
        //
        //

        //      // Player Model
        //
        //
        //

        //      // Enemies
        //
        //
        //      

        //      // Projectiles
        //
        //
        //      

        //      // Effects/Animations
        //
        //
        //

        my.anims.redLaserHit = {
            key: "redLaserHitConfirm",
            frames: [
                { key: "laserRed09" },
                { key: "laserRed08" },
            ],
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        };

        my.anims.redLaserBall = {
            key: "redLaserBall",
            frames: [
                { key: "laserRed09" },
                { key: "laserRed10" },
            ],
            frameRate: 8,
            repeat: -1,
            hideOnComplete: true
        };

        my.anims.blueLaserHit = {
            key: "blueLaserHitConfirm",
            frames: [
                { key: "laserBlue08" },
                { key: "laserBlue09" },
            ],
            frameRate: 5,
            repeat: 5,
            hideOnComplete: true
        };

        my.anims.greenLaserHit = {
            key: "greenLaserHitConfirm",
            frames: [
                { key: "laserGreenCharge1" },
                { key: "laserGreenCharge2" },
            ],
            frameRate: 20,
            repeat: 5,
            hideOnComplete: true
        };

        //      Sounds
        //
        //
        //

        my.sounds = new AlgorithmicSounds();

        //      Text
        //
        //
        //


        // Move to next scene
        this.scene.start("splash");

    }

    update() {

        //update() should never be reached, as this scene is the config/setup/preload scene.
    }

    // sets global constants for y-specific coordinates in the game's enemy layout
    setMyLayoutConstants() {
        // y-axis offset to space enemies apart from other rows
        let offsetY;

        for (let i = 2; i <= 4; i++) {
            offsetY = (my.enemyBp.displayHeight + 10);
            // location constants on screen
            my.settings.layout.yAxisOfRow[i] = my.settings.layout.yAxisOfRow[i - 1] - offsetY;
        }
    }
}