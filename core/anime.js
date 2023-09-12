import anime from "animejs";
import * as THREE from "three";
import { TimelineMax, Power2 } from "gsap/gsap-core";
import { DistortionLogo } from "./distortion";
import { music } from "./music.js";
const images = [
    require("../assets/image-1.png"),
    require("../assets/image-2.png"),
    require("../assets/image-3.png"),
    require("../assets/image-4.png"),
];

class Sketch {
    constructor(opts) {
        this.scene = new THREE.Scene();
        this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
        this.fragment = opts.fragment;
        this.uniforms = opts.uniforms;
        this.renderer = new THREE.WebGLRenderer();

        this.width = window.innerWidth;
        this.height = this.validateHeigth(window.innerHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        this.renderer.setClearColor(0xeeeeee, 1);
        this.duration = opts.duration || 1;
        this.debug = opts.debug || false;
        this.easing = opts.easing || "easeInOut";
        this.prevIndex = null;
        this.onLoad = opts.onLoad;

        this.clicker = document.getElementById("content");

        this.container = document.getElementById("slider");
        this.width = this.container.offsetWidth;
        this.height = this.validateHeigth(this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
        this.camera.position.set(0, 0, 2);
        this.time = 0;
        this.current = 0;
        this.textures = [];

        this.paused = true;
        this.initiate(() => {
            this.setupResize();
            this.settings();
            this.addObjects();
            this.resize();
            this.clickEvent();
            this.play();
        });
    }

    initiate(cb) {
        const promises = [];
        images.forEach((url, i) => {
            let promise = new Promise((resolve) => {
                this.textures[i] = new THREE.TextureLoader().load(url, resolve);
            });
            promises.push(promise);
        });

        Promise.all(promises).then(() => {
            cb();

            this.onLoad();
        });
    }

    clickEvent() {
        const listItems = this.clicker.querySelectorAll("li");

        listItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                this.next(index);

                listItems.forEach((item) => item.classList.remove("active"));
                listItems[index].classList.add("active");
            });
        });
    }
    settings() {
        this.settings = { progress: 0.5 };

        Object.keys(this.uniforms).forEach((item) => {
            this.settings[item] = this.uniforms[item].value;
        });
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = this.textures[0].image.height / this.textures[0].image.width;
        let a1;
        let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = this.height / this.width / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        const dist = this.camera.position.z;
        const height = 1;
        this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

        this.plane.scale.x = this.camera.aspect;
        this.plane.scale.y = 1;

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                progress: { type: "f", value: 0 },
                border: { type: "f", value: 0 },
                intensity: { type: "f", value: 10 },
                scaleX: { type: "f", value: 400 },
                scaleY: { type: "f", value: 400 },
                transition: { type: "f", value: 400 },
                swipe: { type: "f", value: 0 },
                width: { type: "f", value: 0 },
                radius: { type: "f", value: 10 },
                texture1: { type: "f", value: this.textures[0] },
                texture2: { type: "f", value: this.textures[1] },
                displacement: {
                    type: "f",
                    value: new THREE.TextureLoader().load(document.getElementById("displacement").src),
                },
                resolution: { type: "v4", value: new THREE.Vector4() },
            },
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
        });

        this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);

        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    stop() {
        this.paused = true;
    }

    play() {
        this.paused = false;
        this.render();
    }

    next(index) {
        let currentIndex = index;
        if (this.prevIndex === currentIndex) return;


        let len = this.textures.length;
        let nextTexture = this.textures[currentIndex % len];
        this.material.uniforms.texture2.value = nextTexture;
        let tl = new TimelineMax();
        tl.to(this.material.uniforms.progress, this.duration, {
            value: 1,
            ease: Power2[this.easing],
            onComplete: () => {
                this.current = currentIndex % len;
                this.material.uniforms.texture1.value = nextTexture;
                this.material.uniforms.progress.value = 0;
            },
        });
        this.prevIndex = currentIndex;
    }

    render() {
        if (this.paused) return;

        this.time += 0.05;
        this.material.uniforms.time.value = this.time;


        Object.keys(this.uniforms).forEach((item) => {
            this.material.uniforms[item].value = this.settings[item];
        });

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    validateHeigth(height) {
        let minHeigth = 700;
        return (height > 700) ? height : 700;
    }
}

const addSlider = () => {
    new Sketch({
        debug: false,
        uniforms: {
            intensity: { value: 0.7, type: "f", min: 0, max: 2 },
        },
        onLoad: addAnimationEntranceText,
        fragment: `
            uniform float time;
            uniform float progress;
            uniform float width;
            uniform float scaleX;
            uniform float scaleY;
            uniform float transition;
            uniform float radius;
            uniform float intensity;
            uniform sampler2D texture1;
            uniform sampler2D texture2;
            uniform sampler2D displacement;
            uniform vec4 resolution;
            varying vec2 vUv;
    
            void main() {
              vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    
             vec4 d1 = texture2D(texture1, newUV);
             vec4 d2 = texture2D(texture2, newUV);
    
             float displace1 = (d1.r + d1.g + d1.b)*0.33;
             float displace2 = (d2.r + d2.g + d2.b)*0.33;
             
             vec4 t1 = texture2D(texture1, vec2(newUV.x, newUV.y + progress * (displace2 * intensity)));
             vec4 t2 = texture2D(texture2, vec2(newUV.x, newUV.y + (1.0 - progress) * (displace1 * intensity)));
    
             gl_FragColor = mix(t1, t2, progress);
    
            }
    
        `,
    });
};
const addAnimationEntranceText = async () => {
    const logo = document.querySelector("img.logo");
    const animatedList = document.querySelectorAll(".animate-text");
    const scenes = document.querySelectorAll(".canvas-hidden");
    const loadingElement = document.querySelector("span.loading");
    const list = document.querySelectorAll(".animate-text");
    const leftTop = document.querySelector(".left-top_about");
    const rightTop = document.querySelector(".right-top_about");

    logo.classList.add("step-two");

    removeHiddenClass(animatedList);
    new DistortionLogo({
        dom: document.getElementById("canvas-container"),
        logo: document.getElementById("logo"),
        alpha: document.getElementById("alpha-glass"),
    });

    logo.addEventListener("animationend", () => {
        logo.classList.add("step-done");
        loadingElement.classList.add("done");

        leftTop.classList.add("done");
        rightTop.classList.add("done");

        setTimeout(() => {
            let index = 0;
            console.log('no-hover');
            const animation = anime.timeline({
                targets: list,
                delay: anime.stagger(50),
                loop: false,
                easing: "easeInOutExpo",
                update: function (anim) {
                    if(anim.progress > 60){
                        if (index < anim.animatables.length) {
                            let currentTarget = anim.animatables[index].target;
                            //появление линий
                            while (currentTarget) {
                                if (currentTarget.classList.contains("list-element")) {
                                    currentTarget.classList.remove("no-hover");
                                    break;
                                }
                                currentTarget = currentTarget.parentElement;
                            }
                            index++;
                        }
                    }
                },
            });
            animation.add({ bottom: 0 });

            setTimeout(() => removeHiddenScenes(scenes), 1000);
        }, 500);
    });
};

const removeHiddenClass = (list) => {
    list.forEach((element) => element.classList.remove("hidden"));
};

const removeHiddenScenes = (list) => {
    list.forEach((element) => element.classList.remove("canvas-hidden"));
};

function getRandomTrack() {
    const trackCount = 20;
    const randomIndex = Math.floor(Math.random() * trackCount) + 1;
    return `./${randomIndex}.mp3`;
}

function setSizeForPage()
{
    let innterHeight = 0;
    if(window.innerHeight < 720 && window.innerWidth > 1820)
        innterHeight = 720
    else if((window.innerHeight < 620 ))
        innterHeight =  620
    else
        innterHeight = window.innerHeight;
    const vh = innterHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

}
function playerInit()
{
    const soundButton = document.querySelector("button.sound");
    const player = document.getElementById("musicPlayer");
    let isPlaying = false;
    let isFirstLoading = true;
    addSlider()
    soundButton.addEventListener("click", () => {
        if (isPlaying) {
            isPlaying = false;
            soundButton.classList.add("pause");
            music.mute();
        } else {
            isPlaying = true;
            soundButton.classList.remove("pause");
            isFirstLoading = false;
            music.init();
            music.unmute();
        }
    });  
}
document.addEventListener("DOMContentLoaded", ()=>{ 
    setSizeForPage();
    playerInit();
}
);
window.addEventListener("resize", setSizeForPage);
