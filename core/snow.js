import * as THREE from "three";

export class Snow {
    constructor(scene, count) {
        this.scene = scene;
        this.count = count;
        this.particles = new THREE.Group();
        this.visible = true; // Add a property to control visibility

        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
            alphaTest: 0.95,
            transparent: true,
            map: new THREE.TextureLoader().load(require("../assets/snowflake.png")),
            blending: THREE.AdditiveBlending,
        });

        const positions = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 2;
            const y = Math.random() * 2 - 1;
            const z = (Math.random() - 0) * 1;
            positions.push(x, y, z);
        }

        particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    hide() {
        if (this.visible) {
            this.visible = false;
            this.particles.material.opacity = 0;
        }
    }

    show() {
        if (!this.visible) {
            setTimeout(() => {
                this.visible = true;
                this.particles.material.opacity = 1;
            }, 500);
        }
    }

    update() {
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.0025; // Slower falling speed

            if (positions[i + 1] < -1) {
                // Reset particles to the top
                positions[i + 1] = 1;
            }

            // Apply x-axis constraint
            positions[i] += (Math.random() - 0.5) * 0.00025; // Slower horizontal movement
            if (positions[i] < -1) positions[i] = 1;
            if (positions[i] > 1) positions[i] = -1;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
}
