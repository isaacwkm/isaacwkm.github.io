// Preset text settings for all on-screen game text
class GameText {

    constructor(scene) {
        scene.text = {};
    }

    static versionInfo(scene) {
        const x = 525;
        const y = 0;

        //scene.text.versionInfo = scene.add.bitmapText(x, y, "arcade", "Prototype Version", 16);

    }

    static addLoadingAnimText(scene, updating = false, frame = 0) {
        //console.log("GameText: animated text");
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 50;
        let y = midY + 50;
        let strDots = "";

        for (let i = 0; i < frame; i++) {
            strDots += ".";
        }

        if (updating == false) {
            scene.text.loadingAnim = scene.add.bitmapText(x, y, "arcade", "Loading" + strDots, 16);
        }
        else {
            scene.text.loadingAnim.setText("Loading" + strDots, 16);
        }

    }

    static addFancyTitleText(scene) {
        const x = 64;
        const y = 0;

        scene.text.fancyTitle = scene.add.bitmapText(x, y, 'ice', 'Star Spectris', 32);

        scene.text.fancyTitle.setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: scene.text.fancyTitle,
            duration: 4000,
            scaleX: 3,
            ease: 'Quad.easeInOut',
            repeat: 0,
            yoyo: false
        });

        scene.tweens.add({
            targets: scene.text.fancyTitle,
            duration: 3000,
            scaleY: 6,
            ease: 'Cubic.easeInOut',
            repeat: 0,
            yoyo: false
        });
    }

    static addControlInstructions(scene) {
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX + 70;
        let y = midY + 250;

        scene.text.controlInstructions1 = scene.add.bitmapText(x + 15, y - 30, "stylized", "ARROW KEYS to move", 16);
        scene.text.controlInstructions2 = scene.add.bitmapText(x, y, "stylized", "Press SPACE to fire", 16);

    }

    static addOnScreenCredits(scene) {
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 380;
        let y = midY - 100;

        scene.text.onScreenCredits1 = scene.add.bitmapText(x, y - 30, "arcade", "Made by Isaac Kim", 16);
        scene.text.onScreenCredits2 = scene.add.bitmapText(x, y, "arcade", "Assets by Kenney Assets", 16);

    }

    static addInsertCoin(scene, updating = false, frame = 0) {
        //console.log("GameText: animated text");
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 85;
        let y = midY + 100;


        if (updating == false) {
            scene.text.insertCoin = scene.add.bitmapText(x, y, "arcade", "INSERT COIN", 16);
        }
        else {
            if (frame == 0){
                scene.text.insertCoin.setText("INSERT COIN", 16);
            }
            else{
                scene.text.insertCoin.setText("", 16);
            }
        }

    }

    static addMainMenuOptions(scene) {
        //console.log("GameText: animated text");
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 80;
        let y = midY - 60;
        let offset = 40;

        scene.selectionCursor = new Player(scene, x - 25, y + 8);
        scene.selectionCursor.setScale(0.2);
        scene.selectionCursor.angle = 90;

        scene.text.playOption = scene.add.bitmapText(x, y, "arcade", "PLAY", 16);

        scene.text.highScoresOption = scene.add.bitmapText(x, y + (offset * 1), "arcade", "HIGH SCORES", 16);

        scene.text.controlsOption = scene.add.bitmapText(x, y + (offset * 2), "arcade", "CONTROLS", 16);

        //scene.text.creditsOption =scene.add.bitmapText(x, y + (offset * 3), "arcade", "CREDITS", 16);

    }

    static addGameOverText(scene, updating = false, frame = 0) {
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 85;
        let y = midY - 100;


        if (updating == false) {
            console.log("GameText updating false");
            scene.text.gameOver = scene.add.bitmapText(x, y, "arcade", "GAME OVER", 24);
        }
        else {
            if (frame == 0){
                console.log("GameText updating false");
                scene.text.gameOver.setText("GAME OVER", 24);
            }
            else{
                console.log("GameText updating false");
                scene.text.gameOver.setText("", 24);
            }
        }
    }

    static addLivesOverlay(scene, maxLives) {
        let x = 5;
        const y = 5;
        let icon;
        let offsetMult = 30;

        scene.text.livesOverlay = scene.add.bitmapText(x, y, "arcade", "Lives:", 16);
        scene.text.livesOverlayIcons = [];

        for (let i = 0; i < maxLives; i++){
            x = 110 + (i * offsetMult);
            icon = new PlayerIcon(scene, x, 13);
            //icon.visible = false;
            scene.text.livesOverlayIcons.push(icon);
        }
        

    }

    static setLivesOverlayIcons(scene, lives) {
        let x = 0;
        const y = 0;
        let icon = scene.text.livesOverlayIcons;

        for (let i = 0; i < icon.length; i++){
            icon[i].visible = false;
        }

        if (lives == 0){
            scene.text.livesOverlay.setText("Lives: DEAD", 16);
        }

        for (let i = 0; i < lives; i++){
            icon[i].visible = true;
        }

    }

    static addScoreOverlay(scene, iniScore = 0) {
        let x = 5;
        const y = 30;

        scene.text.scoreOverlay = scene.add.bitmapText(x, y + 5, "arcade", "Score:", 16);
        scene.text.scoreNum = scene.add.bitmapText(x + 100, y + 4, "arcade", iniScore, 16);

    }

    static setScore(scene, score) {
        scene.text.scoreNum.setText(score, 16);
    }

    static addCurrLevelOverlay(scene, currLevel = 1) {
        let x = 5;
        const y = 60;

        scene.text.currLevel = scene.add.bitmapText(x, y + 5, "stylized", "LEVEL:", 12);
        scene.text.currLevelNum = scene.add.bitmapText(x + 80, y + 5, "stylized", currLevel, 12);

    }

    static setCurrLevel(scene, currLevel) {
        scene.text.currLevelNum.setText(currLevel, 12);
    }


    static addEndScore(scene, score) {
        //console.log("GameText: animated text");
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 80;
        let y = midY - 40;
        
        scene.text.endScore = scene.add.bitmapText(x, y, "arcade", "Score: " + score, 16);

    }

    static addEndHighscore(scene, hiscore) {
        //console.log("GameText: animated text");
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 80;
        let y = midY + 10;
        
        scene.text.endHighscore = scene.add.bitmapText(x, y, "arcade", "Highscore: " + hiscore, 16);

    }

    static addPlayAgain(scene) {
        //console.log("GameText: animated text");
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = midX - 160;
        let y = midY + 170;
        
        scene.text.playAgain = scene.add.bitmapText(x, y, "arcade", "Press space to continue...", 16);

    }

    static popUpTutorial(scene, currLevel){
        if (currLevel > 4){
            // no tutorials after this level
        }
        else if (currLevel == 5){
            
        }
        else if (currLevel == 4){
            this.removeGreenEnemyTip(scene);
        }
        else if (currLevel == 3){
            this.removeDodgeTip(scene);
            this.addGreenEnemyTip(scene);
        }
        else if (currLevel == 2){
            this.addDodgeTip(scene);
        }
    }

    static addDodgeTip(scene) {
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = 10;
        let y = 540;
        
        scene.text.dodgeTip1 = scene.add.bitmapText(x, y, "ui", "Enemies in the 2nd row and up", 24);
        scene.text.dodgeTip2 = scene.add.bitmapText(x, y + 20, "ui", "have increased dodge chance", 24);

    }
    static removeDodgeTip(scene) {

        scene.text.dodgeTip1.setText("");
        scene.text.dodgeTip2.setText("");

    }

    static addGreenEnemyTip(scene) {
        const midX = my.settings.positions.MiddleOfScreenX;
        const midY = my.settings.positions.MiddleOfScreenY;
        let x = 10;
        let y = 540;
        
        scene.text.greenEnemyTip1 = scene.add.bitmapText(x, y, "ui", "The green army fighters will launch", 24);
        scene.text.greenEnemyTip2 = scene.add.bitmapText(x, y + 20, "ui", "a powerful counterattack whenever they dodge!", 24);

    }
    static removeGreenEnemyTip(scene) {

        scene.text.greenEnemyTip1.setText("");
        scene.text.greenEnemyTip2.setText("");

    }


}
