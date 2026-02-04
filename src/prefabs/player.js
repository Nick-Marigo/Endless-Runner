class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);

        this.direction = direction;

        this.scrollSpeed = 100;
        this.playerMoveVelocity = 300;

        this.jumpSpeed = 450;
        this.isSliding = false;
        
        scene.playerFSM = new StateMachine('run', {
            run: new RunState(),
            jump: new JumpState(),
            slide: new SlideState(),
        }, [scene, this]);
    }

    // Helper function to apply "endless runner" velocity every frame
    applyRunVelocity(scene) {
        
        const { A, D } = scene.keys;

        const flowDirection = directions[currentDirection];
        //const gravityVector = gravityDir[currentGravity];

        //console.log(`Flow Direction: ${flowDirection}`);

        // Calculate player speed (D = Forward, A = Backward)
        let moveMagnitude = -this.scrollSpeed;
        if(D.isDown) moveMagnitude += this.playerMoveVelocity; 
        if(A.isDown) moveMagnitude -= (this.playerMoveVelocity / 3);

        if(flowDirection.x !== 0) {
            this.setVelocityX(flowDirection.x * moveMagnitude);
        } else if (flowDirection.y !== 0) {
            this.setVelocityY(flowDirection.y * moveMagnitude);
        }
        
    }

    applyJump() {
        const jumpVelocity = this.jumpSpeed;
        const gravityVector = gravityDir[currentGravity];

        // Jump in opposite direction of gravity
        if(gravityVector.y !== 0) {
            this.setVelocityY(gravityVector.y * - jumpVelocity);
        } else if (gravityVector.x !== 0) {
            this.setVelocityX(gravityVector.x * - jumpVelocity);
        }
    }

    // Helper function to determine if player is grounded in any direction
    isGrounded() {
        const gravity = this.scene.physics.world.gravity;
        switch(currentGravity) {
            case 'down': return this.body.blocked.down;
            case 'up': return this.body.blocked.up;
            case 'left': return this.body.blocked.left;
            case 'right': return this.body.blocked.right;
        }
        return false;
    }

}

class RunState extends State {

    enter(scene, player) {
        player.isSliding = false;
        // restore size/offset if changed from slide
        /*player.body.setSize(player.width, player.height);
        player.body.setOffset(0, 0);
        player.anims.play('run-' + player.direction, true);*/
    }

    execute(scene, player) {

        const { W, S } = scene.keys;

        player.applyRunVelocity(scene);

        if(Phaser.Input.Keyboard.JustDown(W) && player.isGrounded()) {
            player.applyJump();
            this.stateMachine.transition('jump');
            return;
        }

        if(S.isDown && player.isGrounded()) {
            this.stateMachine.transition('slide');
            return;
        }

    }
}

class JumpState extends State {
    execute(scene, player) {

        const { S } = scene.keys;

        player.applyRunVelocity(scene);

        if(player.isGrounded()) {
            if (S.isDown) {
                 this.stateMachine.transition('slide');
            } else {
                this.stateMachine.transition('run');
            }
        }
    }
}

class SlideState extends State {
    enter(scene, player) {
        player.isSliding = true;

        // adjust size/offset for slide
        /*player.body.setSize();
        player.body.setOffset();
        player.anims.play('slide-' + player.direction, true);*/
    }

    execute(scene, player) {

        const { S } = scene.keys;

        player.applyRunVelocity(scene);

        if(!S.isDown) {
            if (player.isGrounded()) {
                this.stateMachine.transition('run');
            } else {
                this.stateMachine.transition('jump');
            }   
        }
    }
}
