class Play extends Phaser.Scene{

    constructor(){
        super()
    }

    init() {

    }

    preload(){

        this.load.image('background', './assets/AlphaBackground.png');
        this.load.image('platform', './assets/Platform.png');

    }

    create(){

        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0);
        this.platform = this.physics.add.sprite(width /2, height -100, 'platform').setOrigin(0.5, 0.5);;

    }

    update(){

        this.background.tilePositionX += 2;

    }

}