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
        
    }



}