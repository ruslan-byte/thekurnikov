var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},t=e.parcelRequirebab2;null==t&&((t=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,n){o[e]=n},e.parcelRequirebab2=t),t.register("gO1sJ",function(e,n){var o=t("llnd1"),r={sound:null,init(){this.sound||(this.sound=new o.Howl({src:[`/musicBackground/${Math.floor(19*Math.random())}.mp3`],volume:.2,loop:!0,autoplay:!0,html5:!0}))}};function i(){r.init(),this.removeEventListener("click",i),this.removeEventListener("focus",i)}document.querySelector("body").addEventListener("click",i),document.querySelector("body").addEventListener("focus",i)}),t("gO1sJ");
//# sourceMappingURL=index.e05a528d.js.map
