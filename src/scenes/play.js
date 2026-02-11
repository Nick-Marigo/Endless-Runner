class Play extends Phaser.Scene{

    constructor(){
        super()
    }

    init() {

    }

    preload(){

        this.load.image('background', './assets/AlphaBackground.png');
        this.load.image('platform', './assets/Platform.png');
        this.load.image('portal', './assets/debugportal.png');
        this.load.spritesheet('gravityArrow', './assets/GravityArrow.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0
        });
        this.load.spritesheet('directionArrow', './assets/DirectionArrow.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0
        });

    }

    create(){

        this.anims.create({
            key: 'gravityArrowBlink',
            frames: this.anims.generateFrameNumbers('gravityArrow', {start: 0, end: 1}),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'directionArrowBlink',
            frames: this.anims.generateFrameNumbers('directionArrow', {start: 0, end: 1}),
            frameRate: 6,
            repeat: -1
        });

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
        //this.player.setDisplaySize(48, 64);

        this.physics.add.collider(this.player, this.platforms.group);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.player) {
            console.log('game over');
            }
        })

        this.portal = null;
        this.isTransitioning = false;
        this.gravityArrow = this.add.sprite(width / 2, height / 2, 'gravityArrow');
        this.gravityArrow.setVisible(false).setDepth(99);
        this.directionArrow = this.add.sprite(width / 2 + 50, height / 2, 'directionArrow');
        this.directionArrow.setVisible(false).setDepth(99);

        //Starts Cycle for direction arrows and spawning portal
        this.startCycle();

        this.obstacleGroup = this.add.group({ runChildUpdate: true});

        this.obstacleTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.obstacleGroup, () => {
            console.log("Hit Obstacle. Game Over!");

        }, null, this);

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

        if(this.portal && this.portal.active) {
            const flowVec = directions[currentDirection];
            this.portal.x -= (flowVec.x * this.scrollSpeed * dt);
            this.portal.y -= (flowVec.y * this.scrollSpeed * dt);
        }

        // Platform update
        this.platforms.update(dt, this.scrollSpeed, currentDirection);

        if (this.exitPortalObj && this.exitPortalObj.active) {
            this.exitPortalObj.x -= (flowVec.x * this.scrollSpeed * dt);
            this.exitPortalObj.y -= (flowVec.y * this.scrollSpeed * dt);

            if (this.exitPortalObj.x < -200 || this.exitPortalObj.x > width + 200 || this.exitPortalObj.y < -200 || this.exitPortalObj.y > height + 200) {
                this.exitPortalObj.destroy();
                this.isTransitioning = false;
            }
        }

    }

    getGraivtyAndDirection() {
        const gravityKeys = Object.keys(gravityDir);

        // get random gravity direction that is not the current one
        newGravity = Phaser.Utils.Array.GetRandom(gravityKeys.filter(g => g !== currentGravity));
        //currentGravity = newGravity;

        //dthis.player.setAngle(gravityAngles[currentGravity]);

        // Filter directions to only those perpendicular to the new gravity
        // If gravity is 'up' or 'down' (y != 0), direction must be 'left' or 'right' (x != 0)
        const validDirections = Object.keys(directions).filter(d => {
            const gravityVec = gravityDir[newGravity];
            const dirVec = directions[d];
            // If gravity uses Y, direction must use X, and vice versa
            return gravityVec.y !== 0 ? dirVec.x !== 0 : dirVec.y !== 0;
        });

        newDirection = Phaser.Utils.Array.GetRandom(validDirections);
        //currentDirection = newDirection;
    }

    changeGravityAndDirection() {
        const gravityKeys = Object.keys(gravityDir);

        // get random gravity direction that is not the current one
        //let newGravity = Phaser.Utils.Array.GetRandom(gravityKeys.filter(g => g !== currentGravity));
        currentGravity = newGravity;

        this.player.refreshBody();

        // Filter directions to only those perpendicular to the new gravity
        // If gravity is 'up' or 'down' (y != 0), direction must be 'left' or 'right' (x != 0)
        /*const validDirections = Object.keys(directions).filter(d => {
            const gravityVec = gravityDir[newGravity];
            const dirVec = directions[d];
            // If gravity uses Y, direction must use X, and vice versa
            return gravityVec.y !== 0 ? dirVec.x !== 0 : dirVec.y !== 0;
        });*/

        //let newDirection = Phaser.Utils.Array.GetRandom(validDirections);
        currentDirection = newDirection;

        const strength = 500;
        this.physics.world.gravity.set(gravityDir[currentGravity].x * strength, gravityDir[currentGravity].y * strength);

        this.platforms.updateOrientation(currentGravity);

        console.log(`Gravity: ${currentGravity}, Direction: ${currentDirection}`);

    }

    spawnArrows() {

        this.getGraivtyAndDirection();
        this.gravityArrow.setVisible(true);
        this.gravityArrow.play('gravityArrowBlink');
        this.gravityArrow.setAngle(gravityAngles[newGravity] - 180);
        this.directionArrow.setVisible(true);
        this.directionArrow.play('directionArrowBlink');
        this.directionArrow.setAngle(gravityAngles[newDirection] - 180);

    }

    spawnPortal() {
        if(this.isTransitioning) return;

        const flowVec = directions[currentDirection];
        let spawnX, spawnY;
        const offset = 200;

        if(currentGravity === 'down' || currentGravity === 'up') {
            spawnY = (currentGravity === 'down') ? height - offset : offset;
            spawnX = (flowVec.x > 0) ? width + 50 : -50;
        } else {
            spawnX = (currentGravity === 'left') ? offset : width - offset;
            spawnY = (flowVec.y > 0) ? height + 50: -50;
        }

        console.log("Portal spawned at:", spawnX, spawnY);

        this.portal = new Portal(this, spawnX, spawnY, 'portal');
        this.portal.setDepth(100);

        if (currentGravity === 'left' || currentGravity === 'right') {
            this.portal.setAngle(90);
            this.portal.body.setSize(this.portal.height, this.portal.width);
        } else {
            this.portal.setAngle(0);
            this.portal.body.setSize(this.portal.width, this.portal.height);
        }

        this.physics.add.overlap(this.player, this.portal, this.enterPortal, null, this);
    }

    enterPortal() {
        if(this.isTransitioning) return;
        this.isTransitioning = true;
        this.portal.destroy();
        this.gravityArrow.setVisible(false);
        this.directionArrow.setVisible(false);

        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.changeGravityAndDirection();

            const flowVec = directions[currentDirection];
            const floorOffset = 350;
            const progressOffset = 0.33;
            let safeX, safeY;

            if(currentGravity === 'down' || currentGravity === 'up') {
                safeY = (currentGravity === 'down') ? height - floorOffset : floorOffset;
                safeX = (flowVec.x > 0) ? width * progressOffset : width * (1 - progressOffset);
            } else {
                safeX = (currentGravity === 'left') ? floorOffset : width - floorOffset;
                safeY = (flowVec.y > 0) ? height * progressOffset : height * (1 - progressOffset);
            }

            this.player.setPosition(safeX, safeY);
            this.player.body.setVelocity(0, 0);
            this.cameras.main.fadeIn(500);
            this.exitPortal(safeX, safeY);
        });
    }

    exitPortal(safeX, safeY) {
        this.exitPortalObj = this.physics.add.sprite(safeX, safeY, 'portal');
        this.exitPortalObj.setDepth(100);
        this.exitPortalObj.body.setAllowGravity(false);

        if (currentGravity === 'left' || currentGravity === 'right') {
            this.exitPortalObj.setAngle(gravityAngles[currentGravity]);
        }

        this.exitPortalObj.setScale(0);
        this.tweens.add({
            targets: this.exitPortalObj,
            scale: 1,
            duration: 200,
        })

        this.startCycle();

    }

    startCycle() {
        this.runTimer = this.time.delayedCall(15000, () => {
            this.spawnArrows();
        })

        this.portalTimer = this.time.delayedCall(20000, () => {
            this.spawnPortal();
        })
    }

    spawnObstacle() {
        if (this.isTransitioning) return;

        const flowVec = directions[currentDirection];
        if(!flowVec) return;
        const floorOffset = 64;
        let spawnX, spawnY;

        if(currentGravity === 'down' || currentGravity === 'up') {
            spawnY = (currentGravity === 'down') ? height - floorOffset : floorOffset;
            spawnX = (flowVec.x > 0) ? width + 50: -50;
        } else {
            spawnX = (currentGravity === 'left') ? floorOffset : width - floorOffset;
            spawnY = (flowVec.y > 0) ? height + 50 : -50;
        }

        const type = Math.random() > 0.3 ? 'spikes' : 'bar';
        const obs = new Obstacle(this, spawnX, spawnY, type);
        obs.setAngle(gravityAngles[currentGravity]);

        const pushDist = 32;
        const barGap = 90;

        if(currentGravity === 'down') {
            obs.y -= (type === 'bar') ? barGap : pushDist;
        } else if(currentGravity === 'up') {
            obs.y += (type === 'bar') ? barGap : pushDist;
        } else if(currentGravity === 'left') {
            obs.x += (type === 'bar') ? barGap : pushDist;
        } else if(currentGravity === 'right') {
            obs.x -= (type === 'bar') ? barGap : pushDist;
        }

        this.obstacleGroup.add(obs);

    }

}