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

        this.changeGravity = this.time.addEvent({
            delay: 5000,
            callback: this.changeGravityDirection,
            callbackScope: this,
            loop: true
        });

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

        console.log(`VelX: ${this.player.body.velocity.x}, AccelX: ${this.player.body.acceleration.x}`);
}

    

    changeGravityDirection() {

        const gravityKeys = Object.keys(gravityDir);
        let newGravity = Phaser.Utils.Array.GetRandom(gravityKeys.filter(g => g !== currentGravity));

        currentGravity = newGravity;

        const strength = 500;

        const newX = gravityDir[newGravity].x * strength;
        const newY = gravityDir[newGravity].y * strength;

        this.physics.world.gravity.set(newX, newY);

        this.player.body.setGravity(0, 0);

        console.log("Changing gravity direction to:", currentGravity);

        /*this.player.body.setGravityX(gravityDir[newGravity].x * 500);
        this.player.body.setGravityY(gravityDir[newGravity].y * 500);

        this.physics.world.gravity.x = gravityDir[newGravity].x * 500;
        this.physics.world.gravity.y = gravityDir[newGravity].y * 500;*/

    }

}