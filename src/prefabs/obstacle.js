class Obstacle extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(50);
    }

    update(dt, scrollSpeed, direction) {
        const flowVec = directions[direction];
        this.x -= (flowVec.x * scrollSpeed * dt);
        this.y -= (flowVec.y * scrollSpeed * dt);

        if(this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
            this.destroy();
        }
    }

}