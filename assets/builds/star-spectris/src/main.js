// Isaac Kim
// Created: 5/13/2024
// Phaser: 3.70.0
//
// 1-D Movement
//
//
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    fps: { forceSetTimeOut: true, target: 60 },
    scene: [GameConfig, Splash, MainMenu, Level]
}

// global objects
var my = {
    players: {},
    enemies: [],
    counters: {rowsShiftedThisLevel: 0},
    enemiesRowData: [],
    enemyMan: null, // Enemy manager object
    queue: {enemyRows: [], shifting: []},
    enemyBp: null,
    projectilesPlayer: {},
    projectilesEnemy: {shotBlueSmall: []},
    flags: {enemiesShifting: false, stageStart: true, firingAllowed: false, movingAllowed: true, gameOver: false},
    anims: {},
    text: {main: null},
    cooldowns: { player: { fire: 0 } },
    gameRuntime: 0,
    level: null, // level editor/manager object
    levelDataUrl: "src/Data/levelData.json",
    spawnRateDataUrl: "src/Data/spawnRateData.json",
    data: {levelData: {}, spawnRateData: {}},
    difficulty: {healthMult: 1},
    bgScrollSpeedMult: 0.5,
    score: {current: 0, high: 0, rowsCleared: 0},
    defaultConfigs: {
        enemy: {
            id: 0, // unique identifier
            state: "dead", // alive, dying, dead
            health: 40,
            defense: 0, // damage mitigation rate (100 = 100% of damage blocked)
            baseDefense: 0, // base defense to retrieve when reverting defense buffs
            lifetime: 0, // tick counter to use in cycling behavior phases
            row: 1, // Row on-screen. 1: front, 2: middle, 3: back, -1 or 4: offscreen
            dodge: 0, // bullet dodge chance
            baseDodge: 50, // used for reference when reverting buffs
            buffs: {}, // list of active buffs
            debuffs: {}, // list of active debuffs
            allyInFront: null, // true/false: Has ally or doesnt have ally in front
            allyBehind: null, // link to the ally enemy in behind. null indicates it has no ally behind it.
            phaseLifetime: 0, // how long the enemy has been in its current behavior mode.
            phase: "idle", // idle, strafing, re-entry, immobile, etc.
            shootMode: "idle", // idle, shooting, special, cooldown
            shootCooldown: 6, //seconds

        }
    },
    settings: {
        positions: { MiddleOfScreenX: 0, PlayerShipYAxis: 0, MiddleOfScreenY: 0 }, // Constants for starting positions
        keybindings: { moveLeft: "", moveRight: "", fire: "" }, // Key bindings
        movement: { playerSpeed: 0 }, // Movement
        projectiles: { maxPlayerBullets: 0 }, // Projectiles
        layout: { columns: 0, yAxisOfRow: []} // Layout
    }
};

var levelDataGlobal;

const game = new Phaser.Game(config);