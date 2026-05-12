// Math-related functions used by other classes in this project
class Maths{

    constructor() {}

    static getRandomFloat(max, min = 0) {
        return Math.random() * (max - min) + min;
    }

    static getRandomInt(max, min = 0) {
        return Math.floor(this.getRandomFloat(max, min));;
    }

    static flipCoin(){
        let result = this.getRandomInt(2);

        if (result == 1){
            return 1;
        }
        else{
            return -1;
        }
    }
}