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
        /*this.platforms = this.physics.add.group({ immovable: true, allowGravity: false });
        const p = this.platforms.create(width /2, height -100, 'platform').setOrigin(0.5, 0.5);
        p.setImmovable(true);
        p.body.allowGravity = false;*/

        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,     // JUMP
            S: Phaser.Input.Keyboard.KeyCodes.S,     // SLIDE
            A: Phaser.Input.Keyboard.KeyCodes.A,     // LEFT
            D: Phaser.Input.Keyboard.KeyCodes.D,     // RIGHT
        });

        this.scrollSpeed = 100;

        this.platforms = this.physics.add.group({ immovable: true, allowGravity: false });

        const platformWidth = 900;
        const y = height - 100;

        const count = Math.ceil(width / platformWidth) + 2;

        for(let i = 0; i < count; i++) {
            const p = this.platforms.create(i * platformWidth, y, 'platform').setOrigin(0, 0.5);
            p.setImmovable(true);
            p.body.allowGravity = false;
            p.body.moves = false;
        }

        this.player = new Player(this, width / 2, 650, 'player', 0, 'right');

        this.physics.add.collider(this.player, this.platforms);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

    }

    update(time, delta){

        const dt = delta / 1000;

        this.playerFSM.step();

        this.background.tilePositionX += this.player.scrollSpeed * dt;

        // Move platforms to create scrolling effect
        const platforms = this.platforms.getChildren();
        for (const p of platforms) {
            p.x -= this.scrollSpeed * dt;
        }

        let rightMostX = -Infinity;

        for(const p of platforms) rightMostX = Math.max(rightMostX, p.x);

        const platformWidth = 900;
        
        for(const p of platforms) {
            if(p.x + platformWidth < 0) {
                p.x = rightMostX + platformWidth;
                rightMostX = p.x;
            }
        }

        if(this.player.x < 0) {
            console.log("Game Over");

        }

    }

}