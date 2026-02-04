class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);

        this.direction = direction;
        this.playerVelocity = 200;
        
        scene.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
        }, [scene, this]);
    }

}

// Player States
class IdleState extends State { 
    enter(scene, player) {
        player.setVelocity(0);
        //player.anims.play('idle-' + player.direction, true);
        //player.anims.stop();
    }

    execute(scene, player) {
        const { A, D, JUMP, DOWN } = scene.keys;

        if(A.isDown || D.isDown || JUMP.isDown || DOWN.isDown) {
            this.stateMachine.transition('move');
        }
    }
}

class MoveState extends State {
    
    execute(scene, player) {

        const { A, D, JUMP, DOWN } = scene.keys;

        if(!(A.isDown || D.isDown || JUMP.isDown || DOWN.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        let moveDirection = new Phaser.Math.Vector2(0, 0);
        if(D.isDown) {
            moveDirection.x = 1;
            player.direction = 'right';
        } else if(A.isDown) {
            moveDirection.x = -1;
            player.direction = 'left';
        }

        moveDirection.normalize();
        player.setVelocity(player.playerVelocity * moveDirection.x, player.playerVelocity * moveDirection.y);
        //player.anims.play('run-' + player.direction, true);

    }


}