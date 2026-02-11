class Obstacle extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(50);
    }

    update(time, delta) {
        const dt = delta / 1000;
        const scene = this.scene;

        const flowVec = directions[currentDirection];
        const scrollSpeed = scene.scrollSpeed;

        if (flowVec) {
            this.x -= (flowVec.x * scrollSpeed * dt);
            this.y -= (flowVec.y * scrollSpeed * dt);
        }

        if(this.x < -200 || this.x > width + 200 || this.y < -200 || this.y > height + 200) {
            this.destroy();
        }
    }

}