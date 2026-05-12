// class HitCheck
// Used to aid other functions in decisions upon sprite collision between projectiles and other entities.
class HitCheck{

    constructor() {}

    static completeHitCheck(bullet, entity) {
        if (this.collides(entity, bullet) && !bullet.missed) {
            if (this.hitCheck(entity.properties.dodge)) {
                return true;
            }
            else {
                bullet.makeMissed();
                if (entity.properties.dodgeAttack != null){
                    if(entity.properties.dodgeAttack == 0){
                        entity.properties.dodgeAttack = 1;
                    }
                }
            }
        }
        return false;
    }

    static hitCheck(dodge) {
        if (Maths.getRandomFloat(100, 0) >= dodge) {
            return true;
        }
        else {
            return false;
        }
    }

    static collides(a, b) {
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        return true;
    }

    static calculateFinalDmg(damage, def) {
        let dmgMult = (100 - def) * 0.01; // percent to decimal conversion
        let finalDamage = damage * dmgMult; // apply damage modifiers
        return finalDamage;
    }
}