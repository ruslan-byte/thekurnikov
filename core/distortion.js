import * as THREE from "three";
import fragment from "./fragment.glsl";
import vertex from "./vertex.glsl";
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

export class DistortionLogo {
    constructor(options) {
        this.scene = new THREE.Scene({});
        this.isMouseOnCanvas = false;

        this.canvasContainer = options.dom;

        this.imgLogo = options.logo;
        this.imgLogohover = document.getElementById('logo-hover');

        this.width = this.canvasContainer.offsetWidth;
        this.height = this.canvasContainer.offsetHeight;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 0.99);

        this.canvasContainer.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 100);
        this.camera.position.set(0, 0, 2);

        var frustumSize = 1;
        this.camera = new THREE.OrthographicCamera(
            frustumSize / -2,
            frustumSize / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
        );
        this.camera.position.set(0, 0, 2);

        this.time = 0;

        this.mouse = {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0,
            vX: 0,
            vY: 0,
        };

        this.isPlaying = true;
        this.settings();
        this.setupResize();
        // анимация заголовка
        this.canvasContainer.addEventListener("mousemove", (event) => {            
            if(!this.isMouseOnCanvas && this.isTextAnimated())
                this.addObjects();
            this.isMouseOnCanvas = true;
            const rect = this.canvasContainer.getBoundingClientRect();
            this.mouse.x = (event.clientX - rect.left) / this.width;
            this.mouse.y = (event.clientY - rect.top) / this.height;
            this.mouse.vX = (this.mouse.x - this.mouse.prevX) * 10;
            this.mouse.vY = (this.mouse.y - this.mouse.prevY) * 10;
            this.mouse.prevX = this.mouse.x;
            this.mouse.prevY = this.mouse.y;
        });

        this.canvasContainer.addEventListener("mouseleave", () => { if(this.isTextAnimated()) {
                this.resetAnimation();
            }
            this.mouse.x = -1;
            this.mouse.y = -1;
            this.mouse.prevX = -1;
            this.mouse.prevY = -1;
            this.mouse.vX = 0;
            this.mouse.vY = 0;
            this.isMouseOnCanvas = false;
        });
    }

    settings() {
        this.settings = {
            grid: 22,
            mouse: 0.6,
            strength: 0.7,
            relaxation: 0.6,
        };
    }
    isTextAnimated()
    {
        return !document.querySelector('.canvas-hidden');
    }

    setupResize() {
        window.addEventListener("resize", ()=>{
            this.resize();
            this.hideCanvas();
        });
    }

    resize() {
        this.width = this.canvasContainer.offsetWidth;
        this.height = this.canvasContainer.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = this.imgLogo.naturalHeight / this.imgLogo.naturalWidth;
        let a1;
        let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = this.height / this.width / this.imageAspect;
        }
        if (this.material)
        {
            this.material.uniforms.resolution.value.x = this.width;
            this.material.uniforms.resolution.value.y = this.height;
            this.material.uniforms.resolution.value.z = a1;
            this.material.uniforms.resolution.value.w = a2;
        }
        this.camera.updateProjectionMatrix();
        this.regenerateGrid();
    }

    regenerateGrid() {
        this.size = this.settings.grid;

        const width = this.size;
        const height = this.size;

        const size = width * height;
        const data = new Float32Array(3 * size);
        const color = new THREE.Color(0xffffff);

        const r = Math.floor(color.r * 255);
        const g = Math.floor(color.g * 255);
        const b = Math.floor(color.b * 255);

        for (let i = 0; i < size; i++) {
            let r = Math.random() * 255 - 125;
            let r1 = Math.random() * 255 - 125;

            const stride = i * 3;

            data[stride] = r;
            data[stride + 1] = r1;
            data[stride + 2] = r;
        }

        this.texture = new THREE.DataTexture(data, width, height, THREE.RedFormat, THREE.FloatType);

        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;

        if (this.material) {
            this.material.uniforms.uDataTexture.value = this.texture;
            this.material.uniforms.resolution.value.x = this.width;
            this.material.uniforms.resolution.value.y = this.height;
            this.material.uniforms.uDataTexture.value.needsUpdate = true;
        }
    }
// эффект при наведении на логотип
    addObjects() {
        this.regenerateGrid();
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.imgLogohover.src, (texture) => {
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            texture.premultiplyAlpha = true;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            // сохраняеться вид анимации
            this.material = new THREE.ShaderMaterial({
                extensions: {
                    derivatives: "#extension GL_OES_standard_derivatives : enable",
                },
                side: THREE.DoubleSide,
                uniforms: {
                    time: {
                        value: 0,
                    },
                    resolution: {
                        value: new THREE.Vector4(),
                    },
                    uTexture: {
                        value: texture,
                    },
                    uDataTexture: {
                        value: this.texture,
                    },
                },
                vertexShader: vertex,
                fragmentShader: fragment,
            });

            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);
            this.render();

            this.resize();
            this.setupResize();
        });
        this.imgLogo.style.opacity = 0;
    }

    resetAnimation()
    {
        
        this.scene.remove(this.scene.children[0]);
        this.hideCanvas();    
        this.imgLogo.style.opacity = 1;
    }
    hideCanvas()
    {
        this.canvasContainer.children[0].setAttribute('height', 0)
        this.canvasContainer.children[0].style.height = 0;
    }
    updateDataTexture() {
        if (!this.isMouseOnCanvas) {
            let data = this.texture.image.data;
            for (let i = 0; i < data.length; i += 1) {
                data[i] *= this.settings.relaxation;
            }
            this.texture.needsUpdate = true;
            return;
        }
        let data = this.texture.image.data;
        const { grid, mouse, strength, relaxation } = this.settings;

        for (let i = 0; i < data.length; i += 1) {
            data[i] *= relaxation;
        }

        let gridMouseX = grid * this.mouse.x;
        let gridMouseY = grid * (1 - this.mouse.y);
        let maxDist = grid * mouse;
        let aspect = this.width / this.height;

        for (let i = 0; i < grid; i++) {
            for (let j = 0; j < grid; j++) {
                let distance = (gridMouseX - i) ** 2 * aspect + (gridMouseY - j) ** 2;
                let maxDistSq = maxDist ** 2;
                if (distance < maxDistSq) {
                    let index = i + grid * j;
                    let power = maxDist / Math.sqrt(distance);
                    power = clamp(power, 0, 1);

                    data[index] += strength * this.mouse.vX * power;
                    data[index + grid * grid] += strength * this.mouse.vY * power;
                }
            }
        }

        this.mouse.vX *= 0.9;
        this.mouse.vY *= 0.9;

        this.texture.needsUpdate = true;
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.05;
        this.updateDataTexture();
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}
