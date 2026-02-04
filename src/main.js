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
            debug: true
        }
    },
    scene: [ Play]
}

let game = new Phaser.Game(config)

let cursors = null
let { height, width } = game.config