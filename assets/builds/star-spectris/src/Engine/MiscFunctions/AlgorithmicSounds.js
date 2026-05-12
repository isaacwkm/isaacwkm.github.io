// class AlgorithmicSounds
// plays a sounds using algorithmic methods (random sound selection, ascending pitch, etc.)
class AlgorithmicSounds {
    constructor() {
        this.ascendingShieldCounter = 0;
        this.ascendingShieldDirection = 1;
    }

    static playRandomShot(soundObj) { // pass this.scene.sound object to the soundObj parameter
        let vol = 0.4;
        switch (Maths.getRandomInt(4)) {
            case 0:
                soundObj.play("enemyLaser1", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            case 1:
                soundObj.play("enemyLaser2", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            case 2:
                soundObj.play("enemyLaser3", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            case 3:
                soundObj.play("enemyLaser4", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            default:

        }

    }

    playAscendingShield(soundObj) { // pass this.scene.sound object to the sound parameter
        let vol = 0.4;
        switch (this.ascendingShieldCounter) {
            case -1:
                soundObj.play("shield4", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                this.ascendingShieldDirection = 1;
                break;

            case 0:
                soundObj.play("shield1", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                this.ascendingShieldDirection = 1;
                break;

            case 1:
                soundObj.play("shield2", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            case 2:
                soundObj.play("shield3", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            case 3:
                soundObj.play("shield4", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                break;

            case 4:
                soundObj.play("shield5", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                //this.ascendingShieldDirection = -1;
                break;

            case 5:
                soundObj.play("shield1", {
                    volume: vol   // Can adjust volume using this, goes from 0 to 1
                });
                this.ascendingShieldCounter = -1;
                break;

            default:

        }

        this.ascendingShieldCounter += this.ascendingShieldDirection;
        return;
    }
}