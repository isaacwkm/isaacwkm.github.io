class LevelManager {

    // level #
    constructor(scene, currentLevel = 0) {

        this.scene = scene;
        my.queue.enemyRows = [];

        this.currLevel = currentLevel;
        this.levelComplete = false;
        this.enemyCount = { created: 0, alive: 0, enemiesInRow: 0 };
        my.counters.rowsShiftedThisLevel = 0;

        this.defaultLevelConfig = {
            // waves:
            // Arrays towards the end of the waves array are rows towards the front
            // Arrays towards the beginning of the array are rows towards the back
            // Mimics/reflects how waves will appear on-screen

            // wave values:
            // 0: empty
            // 1-3: blue/green/orange enemies 
            // 4-6: elite enemies
            // 7: random elite
            // 8: random normal
            // 9: random ANY (in SPAWNRATES). Uses spawnRates object
            waves: [
                [0, 1, 1, 0, 1, 0, 1, 1, 0],
                [0, 0, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            spawnRates: [
                1,
                1,
                1,
                1
            ]
        }

        this.fetchAndStart();
    }

    async fetchAndStart() {
        //const fetch1 = await this.asyncFetch(my.levelDataUrl,);
        //const fetch2 = await this.asyncFetch(my.spawnRateDataUrl);

        my.data.levelData = await this.asyncFetch(my.levelDataUrl,);
        my.data.spawnRateData = await this.asyncFetch(my.spawnRateDataUrl);
        this.load(this.currLevel);

        //this.consoleOutputEnemies();
        //my.enemies[0].consoleOutputLinks();
    }

    async asyncFetch(url) {
        const response = await fetch(url);
        return response.json();
    }

    updateAfterShifting() {
        if (this.checkEnemiesAlive(0)) { //if last enemy is killed
        }
        else {
            this.putEnemyFromQueueToScreen();
        }
    }

    putEnemyFromQueueToScreen() {
        this.enemyCount.enemiesInRow = 0;
        // Convert an enemy row in queue to enemy row on screen
        if (my.queue.enemyRows[0] != null) {
            LevelLoader.expandingRowCreate(my.queue.enemyRows[0], 4, this);
            my.enemiesRowData.push(this.enemyCount.enemiesInRow); // push enemy count for current row
            my.queue.enemyRows.shift();
        }
    }

    checkEnemiesAlive(num) {
        if (my.level.enemyCount.alive == num) { //if value matches, return true
            return true;
        }
        return false;
    }

    levelCompleteCleanup() {
        my.enemies = [];
        my.enemiesRowData = [];
        my.queue = { enemyRows: [], shifting: [] };
        my.flags = { enemiesShifting: false, stageStart: true, firingAllowed: false, movingAllowed: true, gameOver: false };
        this.enemyCount = { created: 0, alive: 0, enemiesInRow: 0 };
        this.setStageStartFlag(true);
        my.counters.rowsShiftedThisLevel = 0;
        my.enemyMan.levelCleanup();
    }

    updateLevelCheck(levelCompleteFlag = this.levelComplete) {
        if (levelCompleteFlag == true) {
            this.levelCompleteCleanup();
            console.log("LEVEL " + this.currLevel + " COMPLETE!");
            my.score.current += 1000;
            GameText.setScore(this.scene, my.score.current);
            my.bgScrollSpeedMult++;
            this.load(++this.currLevel);
            GameText.setCurrLevel(this.scene, this.currLevel);
            // Pop-up Tutorials
            GameText.popUpTutorial(this.scene, this.currLevel);
        }
        else {
            this.levelCompleteCleanup();
            console.log("LEVEL " + this.currLevel + " GAME OVER!");
        }
    }

    checkStageCleared() {
        if (this.checkEnemiesAlive(0)) {
            this.updateLevelCheck(true);
            return true;
        }
        else {
            return false;
        }
    }

    load(level = 0) { // uses json data (started with trying a switch case, haha). Level index corresponds to json data's level data.
        console.log("LevelEditor.load() " + level);

        this.currLevel = level;

        if (!LevelLoader.parse(level)) {
            return
        }

        // This is the config object format
        let levelConfig = { waves: [], spawn: [] };
        levelConfig.waves = my.data.levelData.Levels[level].waves;
        levelConfig.spawnRates = my.data.levelData.Levels[level].spawnRates;

        this.loadLevel(levelConfig.waves, levelConfig.spawnRates);

        return;
    }

    loadLevel(waveConfig = this.defaultLevelConfig.waves, spawnConfig = this.defaultLevelConfig.spawnRates) {
        //console.log("LevelEditor.loadLevel()");
        //console.log("spawnConfig = " + spawnConfig);
        let waves = waveConfig.length;
        for (let i = 0; i < 3; i++) {
            my.enemiesRowData.push(0);
        }
        let rowOnScr;
        for (let i = waves - 1; i >= 0; i--) {
            //console.log("i, waveconfigi, spawnconfigi, waves-1");
            rowOnScr = waves - i + 3;
            this.createRow(waveConfig[i], spawnConfig[i], rowOnScr);
        }
        my.counters.rowsShiftedThisLevel++;
        my.enemyMan.checkAndShiftRowsDown(my.gameRuntime);
    }

    // createRow(): A powerful function that creates an entire row of enemies on screen.
    // If the screen is full with max amount of rows, creates a row in an off-screen queue.
    // Has a lot of helper functions to get its job done
    // When initially creating visible rows of enemies, row = 1, 2, 3, etc. Afterwards, new rows are created on the last row + 1 (offscreen)
    createRow(waveArray, spawnPreset = 1, rowOnScreen = 1) {
        //console.log("LevelEditor.createRow(waveArray, spawnPreset, rowOnScreen)");
        //console.log("spawnPreset = " + spawnPreset);

        // keep track of how many enemies are actually created in this row
        this.enemyCount.enemiesInRow = 0;

        // see spawnRateData.json for spawnRate presets
        let fetchedSpawnRates = my.data.spawnRateData.spawnRatePresets[spawnPreset];
        //console.log("fetchedSpawnRates = " + fetchedSpawnRates);

        // convertedSpawnRates reformats the fetched spawn rates to a format more friendly for the random generator to work with
        let convertedSpawnRates = LevelLoader.convertSpawnRates(fetchedSpawnRates);

        // Next, we convert the wave array using the converted spawn rates
        let convertedWave = LevelLoader.convertWave(waveArray, convertedSpawnRates);

        // Creation of each enemy in the row

        if (LevelLoader.expandingRowCreate(convertedWave, rowOnScreen, this)) {
            my.enemiesRowData.push(this.enemyCount.enemiesInRow); // push enemy count for current row
        }
    }

    queueRow(convertedWaveArr) {
        my.queue.enemyRows.push(convertedWaveArr);
    }


    // createEnemy() creates an enemy of a specified type
    // creating an enemy requires the following data: scene, texture, frame, x, y, rowOnScreen, propertyObj
    // handled by this class' properties: scene
    // handled by other functions, present in this function's parameters: x, y, row
    // handled in this function: texture, frame, (using type parameter to perform switch/case)
    // handled by other class properties: propertyObj (in class Enemy's child classes)
    createEnemy(type, x, y, row) {
        //console.log("createEnemy()");
        let obj;

        const rowLength = my.settings.layout.columns;
        const enemyCount = my.enemies.length;
        const enemyInFrontIndex = enemyCount - rowLength;
        let index = my.enemies.length;

        switch (type) {
            case 0: // 0 indicates no enemy should be created and an empty spot should be left.
                obj = null;
                my.enemies.push(obj);
                return;

            case 1:
                obj = new EnemyBlue(this.scene, x, y, index, row);
                break;

            case 2:
                obj = new EnemyGreen(this.scene, x, y, index, row);
                break;

            case 3:
                obj = new EnemyOrange(this.scene, x, y, index, row);
                break;

            case 4:

                break;

            case 5:

                break;

            case 6:

                break;

            default:
                console.log(`default statement: LevelEditor.createEnemy(). type: ` + type);
                return;
        }

        let objInFront = my.enemies[enemyInFrontIndex];
        let objTwoRowsInFront = my.enemies[enemyInFrontIndex - rowLength];

        if (objInFront) { // if there is an enemy that exists in front of the enemy that is being created:
            obj.properties.allyInFront = true; // link the current enemy to its ally in front of it
            objInFront.properties.allyBehind = obj; // link the current enemy to its ally in front of it
        }
        else if (objTwoRowsInFront) { //if there is an enemy that exists two rows in front of the enemy that is being created:
            obj.properties.allyInFront = true; // link the current enemy to its ally in front of it
            objTwoRowsInFront.properties.allyBehind = obj; // link the current enemy to its ally in front of it
        }
        my.enemies.push(obj);
        this.incrEnemyCount();
    }

    incrEnemyCount() {
        for (let property in this.enemyCount) {
            this.enemyCount[property]++;
        }
    }

    decrEnemyAliveCount() {
        this.enemyCount.alive--;
    }

    setStageStartFlag(x) {
        if (x == true) {
            my.flags.stageStart = true;
            my.flags.firingAllowed = false;
        }
        else {
            my.flags.stageStart = false;
            my.flags.firingAllowed = true;
        }
    }
}

