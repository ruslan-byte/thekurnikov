var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},n={},t=e.parcelRequirebab2;null==t&&((t=function(e){if(e in o)return o[e].exports;if(e in n){var t=n[e];delete n[e];var r={id:e,exports:{}};return o[e]=r,t.call(r.exports,r,r.exports),r.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,o){n[e]=o},e.parcelRequirebab2=t),t.register("gO1sJ",function(e,o){Object.defineProperty(e.exports,"music",{get:()=>r,set:void 0,enumerable:!0,configurable:!0});var n=t("llnd1"),r={sound:null,init(){this.sound||(this.sound=new n.Howl({src:[`/musicBackground/${Math.floor(19*Math.random())}.mp3`],volume:.2,loop:!0,autoplay:!0,html5:!0}))}};function i(){r.init(),this.removeEventListener("click",i),this.removeEventListener("focus",i)}document.querySelector("body").addEventListener("click",i),document.querySelector("body").addEventListener("focus",i)}),t("gO1sJ");
//# sourceMappingURL=index.a6fd368b.js.map
