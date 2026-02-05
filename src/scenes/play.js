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
        this.player.setDisplaySize(48, 64);

        this.physics.add.collider(this.player, this.platforms);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        this.changeGravAndDir = this.time.addEvent({
            delay: 5000,
            callback: this.changeGravityAndDirection,
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

        //console.log(`VelX: ${this.player.body.velocity.x}, AccelX: ${this.player.body.acceleration.x}`);
    }

    changeGravityAndDirection() {
        const gravityKeys = Object.keys(gravityDir);

        // get random gravity direction that is not the current one
        let newGravity = Phaser.Utils.Array.GetRandom(gravityKeys.filter(g => g !== currentGravity));
        currentGravity = newGravity;

        // Filter directions to only those perpendicular to the new gravity
        // If gravity is 'up' or 'down' (y != 0), direction must be 'left' or 'right' (x != 0)
        const validDirections = Object.keys(directions).filter(d => {
            const gravityVec = gravityDir[newGravity];
            const dirVec = directions[d];
            // If gravity uses Y, direction must use X, and vice versa
            return gravityVec.y !== 0 ? dirVec.x !== 0 : dirVec.y !== 0;
        });

        let newDirection = Phaser.Utils.Array.GetRandom(validDirections);
        currentDirection = newDirection;

        const strength = 500;
        this.physics.world.gravity.set(gravityDir[newGravity].x * strength, gravityDir[newGravity].y * strength);

        console.log(`Gravity: ${currentGravity}, Direction: ${currentDirection}`);

    }

}