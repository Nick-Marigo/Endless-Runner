class Platforms {
    constructor(scene, count = 5, spacing = 900) {
        this.scene = scene;
        this.spacing = spacing;

        this.group = scene.physics.add.group({
            immovable: true,
            allowGravity: false
        });
    
        //Create the initial pool of platforms
        for (let i = 0; i < count; i++) {
            const p = this.group.create(0, 0, 'platform').setOrigin(0.5, 0.5);
            p.body.moves = false;
        }

        this.updateOrientation('down');
    
    }

    updateOrientation(newGravity) {

        const platforms = this.group.getChildren();

        platforms.forEach((p, index) => {
            p.setAngle(gravityAngles[newGravity]);

            if(newGravity === 'left' || newGravity === 'right') {
                p.body.setSize(p.height, p.width);
                const startX = (newGravity === 'left') ? 50 : width - 50;
                p.setPosition(startX, (index - 1) * this.spacing);
            } else {
                p.body.setSize(p.width, p.height);
                const startY = (newGravity === 'down') ? height - 50 : 50;
                p.setPosition((index - 1) * this.spacing, startY);
            }

            p.body.updateFromGameObject();

        });

    }

    update(dt, scrollSpeed, direction) {
        const platforms = this.group.getChildren();
        const flowVec = directions[direction];
        const totalBuffer = platforms.length * this.spacing;

        for (const p of platforms) {
            p.x -= (flowVec.x * scrollSpeed * dt);
            p.y -= (flowVec.y * scrollSpeed * dt);

            if(flowVec.x > 0 && p.x < -this.spacing/2) p.x += totalBuffer;
            else if (flowVec.x < 0 && p.x > this.scene.width + this.spacing/2) p.x -= totalBuffer;
            
            if (flowVec.y > 0 && p.y < -this.spacing/2) p.y += totalBuffer;
            else if (flowVec.y < 0 && p.y > this.scene.height + this.spacing/2) p.y -= totalBuffer;
        }
    }

}