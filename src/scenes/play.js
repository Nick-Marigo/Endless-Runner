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
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(width /2, height -100, 'platform').setOrigin(0.5, 0.5);;

        this.player = new Player(this, 100, 450, 'player', 0, 'right');

        this.physics.add.collider(this.player, this.platforms);

        this.keys = this.input.keyboard.addKeys({
            JUMP: Phaser.Input.Keyboard.KeyCodes.W,
            DOWN: Phaser.Input.Keyboard.KeyCodes.S,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

    }

    update(){

        this.background.tilePositionX += 2;

        this.playerFSM.step();

    }

}