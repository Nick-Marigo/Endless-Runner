// Code: Endless Runner
// Name: Nick Marigo
// Date: 2/2/2026

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { 
                x: 0,
                y: 500 
            },
            debug: true
        }
    },
    scene: [ Play]
}

let game = new Phaser.Game(config)

let cursors = null
let { height, width } = game.config

const gravityDir = {
    down: { x: 0, y: 1 },
    up: { x: 0, y: -1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
}

let currentGravity = 'down';

const directions = {
    left: {x: -1, y: 0},
    right: {x: 1, y: 0},
    up: {x: 0, y: -1},
    down: {x: 0, y: 1}
}

let currentDirection = 'right';

const gravityAngles = {
    down: 0,
    left: 90,
    up: 180,
    right: 270
}