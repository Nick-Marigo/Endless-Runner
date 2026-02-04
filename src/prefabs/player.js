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

        let vx = 0;

        if(D.isDown) vx += this.playerMoveVelocity; 
        if(A.isDown) vx -= this.playerMoveVelocity / 3;

        this.setVelocityX(vx - this.scrollSpeed);
        
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

        if(Phaser.Input.Keyboard.JustDown(W) && player.body.blocked.down) {
            player.setVelocityY(-player.jumpSpeed);
            this.stateMachine.transition('jump');
            return;
        }

        if(S.isDown && player.body.blocked.down) {
            this.stateMachine.transition('slide');
            return;
        }

    }
}

class JumpState extends State {
    execute(scene, player) {

        const { S } = scene.keys;

        player.applyRunVelocity(scene);

        if(player.body.blocked.down) {
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
            if (player.body.blocked.down) {
                this.stateMachine.transition('run');
            } else {
                this.stateMachine.transition('jump');
            }   
        }
    }
}
