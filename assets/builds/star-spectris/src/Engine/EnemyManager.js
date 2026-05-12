// Class that manages the active enemies on screen and keeps track of significant data
class EnemyManager {

    constructor(scene) {
        this.scene = scene;

        this.currFirstEnemyIndex = 0;
        this.shiftStep = 0;

        this.maxShiftStep = 10;
        this.ticksPerStep = 1;

        this.timestamps = {
            shift: 0
        }
    }

    levelCleanup() {
        this.currFirstEnemyIndex = 0;
    }

    update() {
        //console.log("LevelEditor.update()");

        this.updateShifting(my.gameRuntime);
    }

    // An update that only happens on enemy death.
    // Applicable update procedures should be placed here instead of update() to reduce processing cost.
    deathUpdate() {

        this.checkAndShiftRowsDown(my.gameRuntime);
    }

    updateShifting(runtime) {

        if (my.queue.shifting[0] == null) {
            return;
        }
        else if (this.shiftStep == this.maxShiftStep) {
            this.finishShiftingDown();
        }
        else if (runtime == this.timestamps.shift + this.ticksPerStep) {
            //console.log(this.timestamps.shift);
            this.shiftRowsDown(this.shiftStep, this.maxShiftStep);
            this.timestamps.shift += this.ticksPerStep;
        }
        else {

        }
    }

    checkAndShiftRowsDown(runtime) {
        //console.log("checkAndShiftRowsDown()");
        if (my.enemiesRowData[0] == 0) {

            my.enemiesRowData.shift();

            if (my.level.checkStageCleared()) {
                return;
            }

            const rowLen = my.settings.layout.columns;


            if (my.flags.stageStart == false) { // move the curr enemy index only if the stage is not starting
                //shift index up the array to the frontmost row
                this.currFirstEnemyIndex += rowLen;
            }

            //reset variable
            this.shiftStep = 0;
            // decrement row
            this.decrRowProperties();
            // timestamp shift start so that it can control the period of the transition
            this.timestamps.shift = runtime;
            // shifting "flag" as long as there is one 'q' in the queue
            my.queue.shifting.push('q');

            // checking if initial stage animation of enemies moving forward finished
            my.counters.rowsShiftedThisLevel++;
            if (my.counters.rowsShiftedThisLevel == 4) {
                my.counters.rowsShiftedThisLevel = 0;
                my.level.setStageStartFlag(false);
            }

            //perform first shift step
            this.shiftRowsDown(this.shiftStep, this.maxShiftStep);

            return true;
        }
        else {
            return false;
        }
    }

    finishShiftingDown() {
        //console.log("done shifting...")
        this.shiftStep = 0;
        this.applyRowEffects();
        this.timestamps.shift = -1;
        my.queue.shifting.shift();
        my.level.updateAfterShifting();
        if (!this.checkAndShiftRowsDown(my.gameRuntime)) {
            this.setTimestamps();
        }
    }

    setTimestamps() {
        const rowLen = my.settings.layout.columns;
        let shData;
        let coin;
        let index;
        for (let i = 0; i < 3; i++) {
            coin = Maths.flipCoin();
            for (let j = 0; j < rowLen; j++) {
                index = this.currFirstEnemyIndex + (i * (rowLen)) + j;
                if (my.enemies[index]) {
                    shData = my.enemies[index].shiftData;
                    shData.shMultX = coin; // can be 1 or -1, randomly
                    shData.shChangeTime = my.gameRuntime + 90;
                }
            }
        }

    }

    shiftRowsDown(step = 0, maxShiftStep) {
        const rowLen = my.settings.layout.columns;
        this.shiftStep++;
        //console.log("shifting...");
        for (let i = 0; i < rowLen * 3; i++) {
            if (my.enemies[this.currFirstEnemyIndex + i]) {
                my.enemies[this.currFirstEnemyIndex + i].shiftRowDown(step, maxShiftStep);
            }
        }
    }

    decrRowProperties() {
        const rowLen = my.settings.layout.columns;
        let currEnemy;

        for (let i = 0; i < rowLen * 3; i++) {
            //console.log("decrRowProperties()");
            currEnemy = my.enemies[this.currFirstEnemyIndex + i];
            if (currEnemy != null) {
                currEnemy.decrRowProperty();
            }
        }
    }

    applyRowEffects() {
        const rowLen = my.settings.layout.columns;
        let row = 0;
        let currEnemy;

        for (let i = 0; i < rowLen * 3; i++) {
            row = Math.ceil((i + 1) / 9);
            currEnemy = my.enemies[this.currFirstEnemyIndex + i];

            if (currEnemy != null) {
                currEnemy.makeRowEffects(row);
            }
        }
    }
}