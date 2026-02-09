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
        
        const platforms = this.platforms.getChildren();
        const spacing = 900;

        platforms.forEach((p, index) => {
            p.setAngle(gravityAngles[currentGravity]);

            if(currentGravity === 'left' || currentGravity === 'right') {
                p.body.setSize(p.height, p.width);
            } else {
                p.body.setSize(p.width, p.height);
            }

            p.body.updateFromGameObject();

            if (currentGravity === 'down') {
                p.setPosition(index * spacing, height - 50);
            } else if (currentGravity === 'up') {
                p.setPosition(index * spacing, 50);
            } else if(currentGravity === 'left') {
                p.setPosition(50, index * spacing);
            } else if (currentGravity === 'right') {
                p.setPosition(width - 50, index * spacing);
            }
        })

    }

    update() {
        const platforms = this.platforms.getChildren();
        const spacing = 900;
        const totalBuffer = platforms.length * spacing;

        for (const p of platforms) {
            p.x -= (flowVec.x * this.scrollSpeed * dt);
            p.y -= (flowVec.y * this.scrollSpeed * dt);

            if(flowVec.x > 0 && p.x < -spacing/2) p.x += totalBuffer;
            else if (flowVec.x < 0 && p.x > width + spacing/2) p.x -= totalBuffer;
            
            if (flowVec.y > 0 && p.y < -spacing/2) p.y += totalBuffer;
            else if (flowVec.y < 0 && p.y > height + spacing/2) p.y -= totalBuffer;
        }
    }

}