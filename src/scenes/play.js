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

        this.platforms = new Platforms(this, 5, 900);

        this.player = new Player(this, width / 2, 650, 'player', 0, 'right');
        this.player.setDisplaySize(48, 64);

        this.physics.add.collider(this.player, this.platforms.group);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        this.changeGravAndDir = this.time.addEvent({
            delay: 10000,
            callback: this.changeGravityAndDirection,
            callbackScope: this,
            loop: true
        });

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.player) {
            console.log('game over');
            }
        })

    }

    update(time, delta){

        const dt = delta / 1000;

        this.playerFSM.step();

        const flowVec = directions[currentDirection];

        if(flowVec.x !== 0) {
            this.background.tilePositionX += (flowVec.x * this.scrollSpeed * dt);
        } else {
            this.background.tilePositionY += (flowVec.y * this.scrollSpeed * dt);
        }

        // Platform update
        this.platforms.update(dt, this.scrollSpeed, currentDirection);

        //if(this.player.body.blocked.up || this.player.body.blocked.down || this.player.body.blocked.left || this.player.body.blocked.right) {
          //  console.log("Game Over");
        //}

    }

    changeGravityAndDirection() {
        const gravityKeys = Object.keys(gravityDir);

        // get random gravity direction that is not the current one
        let newGravity = Phaser.Utils.Array.GetRandom(gravityKeys.filter(g => g !== currentGravity));
        currentGravity = newGravity;

        this.player.setAngle(gravityAngles[currentGravity]);

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

        this.platforms.updateOrientation(currentGravity);

        console.log(`Gravity: ${currentGravity}, Direction: ${currentDirection}`);

    }

}