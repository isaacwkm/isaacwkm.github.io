// A helper class that parses JSON data, reformats parsed data into easily-workable formats,
// and contains algorithms for creating enemies.
// Exclusively helps the LevelManager class (reduce code clutter and enable encapsulation)
class LevelLoader{

    constructor() {

        this.enemyCount.enemiesInRow = 0;

        // Spawn rates are based on how any units can appear on each row.
        // The values for each enemy type indicate (on average) how many 
        // of that enemy will appear on each row.
        // For more examples, look at spawnRateData.json .
        let exampleSpawnRates = {
            Blue: { key: 1, value: 5 },
            Green: { key: 2, value: 1.5 },
            Orange: { key: 3, value: 1.5 },
            BlueElite: { key: 4, value: 0 },
            GreenElite: { key: 5, value: 0 },
            OrangeElite: { key: 6, value: 0 },
            RandomElite: { key: 7, value: 1 },
            RandomNormal: { key: 8, value: 0 }
        }
    }

    static parse(level){
        // Check if the level exists
        if (DataParser.levelExists(level) == false) {
            DataParser.throwMissingLevelError();
            return false;
        }
        // Check if the player has reached the end of the game
        if (DataParser.checkCompelteVictory(level) == true){
            // victory
            return false;
        }
        // Check if the health difficulty increased (or decreased)
        DataParser.checkAndSetHealthMultiplier(level);
        DataParser.checkAndSetBgScrollSpeed(level);

        return true;
    }

    // convertWave(array, spawnrates object)
    // Random enemy generation begins with assigning a unique range to each enemy type
    // and creating the enemy of the range in which the random number was created.
    static convertWave(unconvertedWaveArray, convertedSpawnRates) {
        //console.log("convertWave()");
        //console.log("unconvertedWaveArray: " + unconvertedWaveArray);
        let convertedWaveArray = [];
        let myEnemyType = "";
        let target = 0;
        let targetMax = my.settings.layout.columns;

        for (let i = 0; i < unconvertedWaveArray.length; i++) {
            myEnemyType = "";
            target = Maths.getRandomFloat(targetMax);
            //console.log("unconvertedWaveArray[i]: " + unconvertedWaveArray[i]);
            switch (unconvertedWaveArray[i]) {

                case 9: // 9: random ANY (uses row spawnRates object)
                    for (let property in convertedSpawnRates) {
                        if (convertedSpawnRates[property].lowerRange <= target && target < convertedSpawnRates[property].upperRange) {
                            myEnemyType = convertedSpawnRates[property].key;
                        }
                    }
                    convertedWaveArray[i] = myEnemyType;
                    break;

                case 8: // 8: random normal
                    if (target < (targetMax / 3)) {
                        myEnemyType = 1;
                    }
                    else if (target < (targetMax / 3) * 2) {
                        myEnemyType = 2;
                    }
                    else {
                        myEnemyType = 3;
                    }
                    convertedWaveArray[i] = myEnemyType;
                    break;

                case 7: // 7: random elite
                    if (target < (targetMax / 3)) {
                        myEnemyType = 4;
                    }
                    else if (target < (targetMax / 3) * 2) {
                        myEnemyType = 5;
                    }
                    else {
                        myEnemyType = 6;
                    }
                    convertedWaveArray[i] = myEnemyType;
                    break;

                default:
                    //console.log("default statement: LevelEditor.convertWave()");
                    convertedWaveArray[i] = unconvertedWaveArray[i];
            }
        }

        return convertedWaveArray;
    }

    static convertSpawnRates(spawnRates) {
        //console.log("LevelEditor.convertSpawnRates()");
        let convertedSpawnRates = {};
        let spawnRateTotal = 0;
        let it = 1;

        for (let enemyUnparsed in spawnRates) {
            let enemy = JSON.stringify(enemyUnparsed);
            enemy = MiscFunctions.removeQuotationsFromString(enemy);
            //console.log("enemy: " + enemy);

            // create new property object
            convertedSpawnRates[enemy] = {};

            // set .key
            convertedSpawnRates[enemy].key = it

            // set .lower range
            convertedSpawnRates[enemy].lowerRange = spawnRateTotal;

            // Increase spawn rate total for upper range value
            spawnRateTotal += spawnRates[enemy].value;

            // set .upper range
            convertedSpawnRates[enemy].upperRange = spawnRateTotal;

            // increment iterator for setting key
            it++;

            //console.log(convertedSpawnRates[enemy]);
        }

        // Checking for invalid spawn rates
        if (spawnRateTotal != my.settings.layout.columns) { // Spawn rates should add up to how many units can appear on a row
            //console.log(spawnRateTotal);
            //console.log(spawnRateTotal);
            //console.log(spawnRates);
            throw "convertSpawnRates() - Error: spawn rates add up to over or under the target (target is equal to the number of columns visible)";
        }

        return convertedSpawnRates;
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

        // convertedSpawnRates reformats the fetched spawn rates to a format more friendly
        // for the random generator to work with

        // First, we convert the spawn rates
        let convertedSpawnRates = LevelLoader.convertSpawnRates(fetchedSpawnRates);

        // Second, we convert the wave array using the converted spawn rates
        let convertedWave = LevelLoader.convertWave(waveArray, convertedSpawnRates);

        // Creation of each enemy in the row

        if (LevelLoader.expandingRowCreate(convertedWave, rowOnScreen, this)) {
            my.enemiesRowData.push(this.enemyCount.enemiesInRow); // push enemy count for current row
        }
    }

    static expandingRowCreate(convertedWaveArr, rowOnScreen, lvlMan) {
        //console.log("expandingRowCreate()");
        //console.log("convertedWave: " + convertedWaveArr);
        let cap = my.settings.layout.columns;
        if (cap % 2 == 0) {
            throw "Error - expandingRowCreate(): Expanding Row Creation procedure does not work with an even number of enemies per row";
        }

        if (rowOnScreen >= 5) {
            // create row off-screen
            //console.log("row created off-screen");
            lvlMan.queueRow(convertedWaveArr);
            return false;
        }

        // x-axis offset to space enemies apart from other enemies on the same row
        const offsetX = (my.enemyBp.displayWidth + 10);

        // location constants on screen
        const rowY = my.settings.layout.yAxisOfRow[rowOnScreen];
        const midX = my.settings.positions.MiddleOfScreenX;

        // Create array iterator (index) and set it to the middle of the array
        const midIndex = (Math.floor(cap / 2));
        let index = midIndex;

        let x = midX;

        // "enemiesCreated" increases every time an enemy is created in the loop below.
        // This value is used to access the array's indexes starting from the middle -> outwards.
        let enemiesCreated = 0;

        // Create first enemy of the row in the center of the screen, at the Y coordinate of the specified row
        lvlMan.createEnemy(convertedWaveArr[index], x, rowY, rowOnScreen);

        //console.log("expandingRowCreate's whileLoop");

        index += ++enemiesCreated;

        while (convertedWaveArr[index] != undefined) { // While loop terminates after adding the last enemy of the row (no more indices in the array to traverse)
            // Each iteration of the while loop creates an enemy on both ends of the row.

            // Right-side of the row
            x += (offsetX * enemiesCreated);
            //console.log("convertedWaveArr[Index] = " + convertedWaveArr[index] + ", index = " + index);
            lvlMan.createEnemy(convertedWaveArr[index], x, rowY, rowOnScreen);

            index -= ++enemiesCreated;

            // Left-side of the row
            x -= (offsetX * enemiesCreated);
            //console.log("convertedWaveArr[Index] = " + convertedWaveArr[index] + ", index = " + index);
            lvlMan.createEnemy(convertedWaveArr[index], x, rowY, rowOnScreen);

            index += ++enemiesCreated;
        }

        return true;
    }
}

// Used strictly in the context of parsing data retrieved from the JSON format.
class DataParser{

    constructor() {
    }

    static levelExists(level) {
        if (my.data.levelData.Levels[level] == null) {
            return false
        }
        return true;
    }

    static throwMissingLevelError(){
        console.log("Warning: Next level config data could not be found.");
        console.log("Consider adding a victory flag.");
        throw "LevelEditor.load() null level object."
    }

    static checkCompelteVictory(level) {
        if (my.data.levelData.Levels[level].victory) {
            console.log("Victory!")
            return true;
        }
        return false;
    }

    static checkAndSetHealthMultiplier(level){
        if (my.data.levelData.Levels[level].healthMult != null) {
            my.difficulty.healthMult = my.data.levelData.Levels[level].healthMult;
        }
    }

    static checkAndSetBgScrollSpeed(level){
        if (my.data.levelData.Levels[level].bgScrollSpeed != null){
            my.bgScrollSpeedMult = my.data.levelData.Levels[level].bgScrollSpeed;
        }
    }
}