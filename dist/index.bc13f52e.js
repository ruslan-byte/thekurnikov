var e,t,n,o,r,i,a,s,u,d,_,l,c,p,f="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{};(e=function(){this.init()}).prototype={init:function(){var e=this||t;return e._counter=1e3,e._html5AudioPool=[],e.html5PoolSize=10,e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.autoUnlock=!0,e._setup(),e},volume:function(e){var n=this||t;if(e=parseFloat(e),n.ctx||d(),void 0!==e&&e>=0&&e<=1){if(n._volume=e,n._muted)return n;n.usingWebAudio&&n.masterGain.gain.setValueAtTime(e,t.ctx.currentTime);for(var o=0;o<n._howls.length;o++)if(!n._howls[o]._webAudio)for(var r=n._howls[o]._getSoundIds(),i=0;i<r.length;i++){var a=n._howls[o]._soundById(r[i]);a&&a._node&&(a._node.volume=a._volume*e)}return n}return n._volume},mute:function(e){var n=this||t;n.ctx||d(),n._muted=e,n.usingWebAudio&&n.masterGain.gain.setValueAtTime(e?0:n._volume,t.ctx.currentTime);for(var o=0;o<n._howls.length;o++)if(!n._howls[o]._webAudio)for(var r=n._howls[o]._getSoundIds(),i=0;i<r.length;i++){var a=n._howls[o]._soundById(r[i]);a&&a._node&&(a._node.muted=!!e||a._muted)}return n},stop:function(){for(var e=this||t,n=0;n<e._howls.length;n++)e._howls[n].stop();return e},unload:function(){for(var e=this||t,n=e._howls.length-1;n>=0;n--)e._howls[n].unload();return e.usingWebAudio&&e.ctx&&void 0!==e.ctx.close&&(e.ctx.close(),e.ctx=null,d()),e},codecs:function(e){return(this||t)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||t;if(e.state=e.ctx&&e.ctx.state||"suspended",e._autoSuspend(),!e.usingWebAudio){if("undefined"!=typeof Audio)try{var n=new Audio;void 0===n.oncanplaythrough&&(e._canPlayEvent="canplay")}catch(t){e.noAudio=!0}else e.noAudio=!0}try{var n=new Audio;n.muted&&(e.noAudio=!0)}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||t,n=null;try{n="undefined"!=typeof Audio?new Audio:null}catch(t){return e}if(!n||"function"!=typeof n.canPlayType)return e;var o=n.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator?e._navigator.userAgent:"",i=r.match(/OPR\/([0-6].)/g),a=i&&33>parseInt(i[0].split("/")[1],10),s=-1!==r.indexOf("Safari")&&-1===r.indexOf("Chrome"),u=r.match(/Version\/(.*?) /),d=s&&u&&15>parseInt(u[1],10);return e._codecs={mp3:!!(!a&&(o||n.canPlayType("audio/mp3;").replace(/^no$/,""))),mpeg:!!o,opus:!!n.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!(n.canPlayType('audio/wav; codecs="1"')||n.canPlayType("audio/wav")).replace(/^no$/,""),aac:!!n.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!n.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(n.canPlayType("audio/x-m4a;")||n.canPlayType("audio/m4a;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),m4b:!!(n.canPlayType("audio/x-m4b;")||n.canPlayType("audio/m4b;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(n.canPlayType("audio/x-mp4;")||n.canPlayType("audio/mp4;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!(!d&&n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),webm:!!(!d&&n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),dolby:!!n.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(n.canPlayType("audio/x-flac;")||n.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_unlockAudio:function(){var e=this||t;if(!e._audioUnlocked&&e.ctx){e._audioUnlocked=!1,e.autoUnlock=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var n=function(t){for(;e._html5AudioPool.length<e.html5PoolSize;)try{var o=new Audio;o._unlocked=!0,e._releaseHtml5Audio(o)}catch(t){e.noAudio=!0;break}for(var r=0;r<e._howls.length;r++)if(!e._howls[r]._webAudio)for(var i=e._howls[r]._getSoundIds(),a=0;a<i.length;a++){var s=e._howls[r]._soundById(i[a]);s&&s._node&&!s._node._unlocked&&(s._node._unlocked=!0,s._node.load())}e._autoResume();var u=e.ctx.createBufferSource();u.buffer=e._scratchBuffer,u.connect(e.ctx.destination),void 0===u.start?u.noteOn(0):u.start(0),"function"==typeof e.ctx.resume&&e.ctx.resume(),u.onended=function(){u.disconnect(0),e._audioUnlocked=!0,document.removeEventListener("touchstart",n,!0),document.removeEventListener("touchend",n,!0),document.removeEventListener("click",n,!0),document.removeEventListener("keydown",n,!0);for(var t=0;t<e._howls.length;t++)e._howls[t]._emit("unlock")}};return document.addEventListener("touchstart",n,!0),document.addEventListener("touchend",n,!0),document.addEventListener("click",n,!0),document.addEventListener("keydown",n,!0),e}},_obtainHtml5Audio:function(){var e=this||t;if(e._html5AudioPool.length)return e._html5AudioPool.pop();var n=new Audio().play();return n&&"undefined"!=typeof Promise&&(n instanceof Promise||"function"==typeof n.then)&&n.catch(function(){console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")}),new Audio},_releaseHtml5Audio:function(e){var n=this||t;return e._unlocked&&n._html5AudioPool.push(e),n},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&void 0!==e.ctx.suspend&&t.usingWebAudio){for(var n=0;n<e._howls.length;n++)if(e._howls[n]._webAudio){for(var o=0;o<e._howls[n]._sounds.length;o++)if(!e._howls[n]._sounds[o]._paused)return e}return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){if(e.autoSuspend){e._suspendTimer=null,e.state="suspending";var t=function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())};e.ctx.suspend().then(t,t)}},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&void 0!==e.ctx.resume&&t.usingWebAudio)return"running"===e.state&&"interrupted"!==e.ctx.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state||"running"===e.state&&"interrupted"===e.ctx.state?(e.ctx.resume().then(function(){e.state="running";for(var t=0;t<e._howls.length;t++)e._howls[t]._emit("resume")}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}},t=new e,(n=function(e){if(!e.src||0===e.src.length){console.error("An array of source files must be passed with any new Howl.");return}this.init(e)}).prototype={init:function(e){var n=this;return t.ctx||d(),n._autoplay=e.autoplay||!1,n._format="string"!=typeof e.format?e.format:[e.format],n._html5=e.html5||!1,n._muted=e.mute||!1,n._loop=e.loop||!1,n._pool=e.pool||5,n._preload="boolean"!=typeof e.preload&&"metadata"!==e.preload||e.preload,n._rate=e.rate||1,n._sprite=e.sprite||{},n._src="string"!=typeof e.src?e.src:[e.src],n._volume=void 0!==e.volume?e.volume:1,n._xhr={method:e.xhr&&e.xhr.method?e.xhr.method:"GET",headers:e.xhr&&e.xhr.headers?e.xhr.headers:null,withCredentials:!!e.xhr&&!!e.xhr.withCredentials&&e.xhr.withCredentials},n._duration=0,n._state="unloaded",n._sounds=[],n._endTimers={},n._queue=[],n._playLock=!1,n._onend=e.onend?[{fn:e.onend}]:[],n._onfade=e.onfade?[{fn:e.onfade}]:[],n._onload=e.onload?[{fn:e.onload}]:[],n._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],n._onplayerror=e.onplayerror?[{fn:e.onplayerror}]:[],n._onpause=e.onpause?[{fn:e.onpause}]:[],n._onplay=e.onplay?[{fn:e.onplay}]:[],n._onstop=e.onstop?[{fn:e.onstop}]:[],n._onmute=e.onmute?[{fn:e.onmute}]:[],n._onvolume=e.onvolume?[{fn:e.onvolume}]:[],n._onrate=e.onrate?[{fn:e.onrate}]:[],n._onseek=e.onseek?[{fn:e.onseek}]:[],n._onunlock=e.onunlock?[{fn:e.onunlock}]:[],n._onresume=[],n._webAudio=t.usingWebAudio&&!n._html5,void 0!==t.ctx&&t.ctx&&t.autoUnlock&&t._unlockAudio(),t._howls.push(n),n._autoplay&&n._queue.push({event:"play",action:function(){n.play()}}),n._preload&&"none"!==n._preload&&n.load(),n},load:function(){var e,n,r=null;if(t.noAudio){this._emit("loaderror",null,"No audio support.");return}"string"==typeof this._src&&(this._src=[this._src]);for(var a=0;a<this._src.length;a++){if(this._format&&this._format[a])e=this._format[a];else{if("string"!=typeof(n=this._src[a])){this._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}(e=/^data:audio\/([^;,]+);/i.exec(n))||(e=/\.([^.]+)$/.exec(n.split("?",1)[0])),e&&(e=e[1].toLowerCase())}if(e||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),e&&t.codecs(e)){r=this._src[a];break}}if(!r){this._emit("loaderror",null,"No codec support for selected audio sources.");return}return this._src=r,this._state="loading","https:"===window.location.protocol&&"http:"===r.slice(0,5)&&(this._html5=!0,this._webAudio=!1),new o(this),this._webAudio&&i(this),this},play:function(e,n){var o=this,r=null;if("number"==typeof e)r=e,e=null;else if("string"==typeof e&&"loaded"===o._state&&!o._sprite[e])return null;else if(void 0===e&&(e="__default",!o._playLock)){for(var i=0,a=0;a<o._sounds.length;a++)o._sounds[a]._paused&&!o._sounds[a]._ended&&(i++,r=o._sounds[a]._id);1===i?e=null:r=null}var s=r?o._soundById(r):o._inactiveSound();if(!s)return null;if(r&&!e&&(e=s._sprite||"__default"),"loaded"!==o._state){s._sprite=e,s._ended=!1;var u=s._id;return o._queue.push({event:"play",action:function(){o.play(u)}}),u}if(r&&!s._paused)return n||o._loadQueue("play"),s._id;o._webAudio&&t._autoResume();var d=Math.max(0,s._seek>0?s._seek:o._sprite[e][0]/1e3),_=Math.max(0,(o._sprite[e][0]+o._sprite[e][1])/1e3-d),l=1e3*_/Math.abs(s._rate),c=o._sprite[e][0]/1e3,p=(o._sprite[e][0]+o._sprite[e][1])/1e3;s._sprite=e,s._ended=!1;var f=function(){s._paused=!1,s._seek=d,s._start=c,s._stop=p,s._loop=!!(s._loop||o._sprite[e][2])};if(d>=p){o._ended(s);return}var h=s._node;if(o._webAudio){var m=function(){o._playLock=!1,f(),o._refreshBuffer(s);var e=s._muted||o._muted?0:s._volume;h.gain.setValueAtTime(e,t.ctx.currentTime),s._playStart=t.ctx.currentTime,void 0===h.bufferSource.start?s._loop?h.bufferSource.noteGrainOn(0,d,86400):h.bufferSource.noteGrainOn(0,d,_):s._loop?h.bufferSource.start(0,d,86400):h.bufferSource.start(0,d,_),l!==1/0&&(o._endTimers[s._id]=setTimeout(o._ended.bind(o,s),l)),n||setTimeout(function(){o._emit("play",s._id),o._loadQueue()},0)};"running"===t.state&&"interrupted"!==t.ctx.state?m():(o._playLock=!0,o.once("resume",m),o._clearTimer(s._id))}else{var v=function(){h.currentTime=d,h.muted=s._muted||o._muted||t._muted||h.muted,h.volume=s._volume*t.volume(),h.playbackRate=s._rate;try{var r=h.play();if(r&&"undefined"!=typeof Promise&&(r instanceof Promise||"function"==typeof r.then)?(o._playLock=!0,f(),r.then(function(){o._playLock=!1,h._unlocked=!0,n?o._loadQueue():o._emit("play",s._id)}).catch(function(){o._playLock=!1,o._emit("playerror",s._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),s._ended=!0,s._paused=!0})):n||(o._playLock=!1,f(),o._emit("play",s._id)),h.playbackRate=s._rate,h.paused){o._emit("playerror",s._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");return}"__default"!==e||s._loop?o._endTimers[s._id]=setTimeout(o._ended.bind(o,s),l):(o._endTimers[s._id]=function(){o._ended(s),h.removeEventListener("ended",o._endTimers[s._id],!1)},h.addEventListener("ended",o._endTimers[s._id],!1))}catch(e){o._emit("playerror",s._id,e)}};"data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"===h.src&&(h.src=o._src,h.load());var A=window&&window.ejecta||!h.readyState&&t._navigator.isCocoonJS;if(h.readyState>=3||A)v();else{o._playLock=!0,o._state="loading";var y=function(){o._state="loaded",v(),h.removeEventListener(t._canPlayEvent,y,!1)};h.addEventListener(t._canPlayEvent,y,!1),o._clearTimer(s._id)}}return s._id},pause:function(e){var t=this;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"pause",action:function(){t.pause(e)}}),t;for(var n=t._getSoundIds(e),o=0;o<n.length;o++){t._clearTimer(n[o]);var r=t._soundById(n[o]);if(r&&!r._paused&&(r._seek=t.seek(n[o]),r._rateSeek=0,r._paused=!0,t._stopFade(n[o]),r._node)){if(t._webAudio){if(!r._node.bufferSource)continue;void 0===r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),t._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause()}arguments[1]||t._emit("pause",r?r._id:null)}return t},stop:function(e,t){var n=this;if("loaded"!==n._state||n._playLock)return n._queue.push({event:"stop",action:function(){n.stop(e)}}),n;for(var o=n._getSoundIds(e),r=0;r<o.length;r++){n._clearTimer(o[r]);var i=n._soundById(o[r]);i&&(i._seek=i._start||0,i._rateSeek=0,i._paused=!0,i._ended=!0,n._stopFade(o[r]),i._node&&(n._webAudio?i._node.bufferSource&&(void 0===i._node.bufferSource.stop?i._node.bufferSource.noteOff(0):i._node.bufferSource.stop(0),n._cleanBuffer(i._node)):isNaN(i._node.duration)&&i._node.duration!==1/0||(i._node.currentTime=i._start||0,i._node.pause(),i._node.duration===1/0&&n._clearSound(i._node))),t||n._emit("stop",i._id))}return n},mute:function(e,n){var o=this;if("loaded"!==o._state||o._playLock)return o._queue.push({event:"mute",action:function(){o.mute(e,n)}}),o;if(void 0===n){if("boolean"!=typeof e)return o._muted;o._muted=e}for(var r=o._getSoundIds(n),i=0;i<r.length;i++){var a=o._soundById(r[i]);a&&(a._muted=e,a._interval&&o._stopFade(a._id),o._webAudio&&a._node?a._node.gain.setValueAtTime(e?0:a._volume,t.ctx.currentTime):a._node&&(a._node.muted=!!t._muted||e),o._emit("mute",a._id))}return o},volume:function(){var e,n,o,r=this,i=arguments;if(0===i.length)return r._volume;if(1===i.length||2===i.length&&void 0===i[1]?r._getSoundIds().indexOf(i[0])>=0?n=parseInt(i[0],10):e=parseFloat(i[0]):i.length>=2&&(e=parseFloat(i[0]),n=parseInt(i[1],10)),void 0===e||!(e>=0)||!(e<=1))return(o=n?r._soundById(n):r._sounds[0])?o._volume:0;if("loaded"!==r._state||r._playLock)return r._queue.push({event:"volume",action:function(){r.volume.apply(r,i)}}),r;void 0===n&&(r._volume=e),n=r._getSoundIds(n);for(var a=0;a<n.length;a++)(o=r._soundById(n[a]))&&(o._volume=e,i[2]||r._stopFade(n[a]),r._webAudio&&o._node&&!o._muted?o._node.gain.setValueAtTime(e,t.ctx.currentTime):o._node&&!o._muted&&(o._node.volume=e*t.volume()),r._emit("volume",o._id));return r},fade:function(e,n,o,r){var i=this;if("loaded"!==i._state||i._playLock)return i._queue.push({event:"fade",action:function(){i.fade(e,n,o,r)}}),i;e=Math.min(Math.max(0,parseFloat(e)),1),n=Math.min(Math.max(0,parseFloat(n)),1),o=parseFloat(o),i.volume(e,r);for(var a=i._getSoundIds(r),s=0;s<a.length;s++){var u=i._soundById(a[s]);if(u){if(r||i._stopFade(a[s]),i._webAudio&&!u._muted){var d=t.ctx.currentTime,_=d+o/1e3;u._volume=e,u._node.gain.setValueAtTime(e,d),u._node.gain.linearRampToValueAtTime(n,_)}i._startFadeInterval(u,e,n,o,a[s],void 0===r)}}return i},_startFadeInterval:function(e,t,n,o,r,i){var a=this,s=t,u=n-t,d=Math.abs(u/.01),_=Date.now();e._fadeTo=n,e._interval=setInterval(function(){var r=(Date.now()-_)/o;_=Date.now(),s+=u*r,s=Math.round(100*s)/100,s=u<0?Math.max(n,s):Math.min(n,s),a._webAudio?e._volume=s:a.volume(s,e._id,!0),i&&(a._volume=s),(n<t&&s<=n||n>t&&s>=n)&&(clearInterval(e._interval),e._interval=null,e._fadeTo=null,a.volume(n,e._id),a._emit("fade",e._id))},Math.max(4,d>0?o/d:o))},_stopFade:function(e){var n=this._soundById(e);return n&&n._interval&&(this._webAudio&&n._node.gain.cancelScheduledValues(t.ctx.currentTime),clearInterval(n._interval),n._interval=null,this.volume(n._fadeTo,e),n._fadeTo=null,this._emit("fade",e)),this},loop:function(){var e,t,n,o=arguments;if(0===o.length)return this._loop;if(1===o.length){if("boolean"!=typeof o[0])return!!(n=this._soundById(parseInt(o[0],10)))&&n._loop;e=o[0],this._loop=e}else 2===o.length&&(e=o[0],t=parseInt(o[1],10));for(var r=this._getSoundIds(t),i=0;i<r.length;i++)(n=this._soundById(r[i]))&&(n._loop=e,this._webAudio&&n._node&&n._node.bufferSource&&(n._node.bufferSource.loop=e,e&&(n._node.bufferSource.loopStart=n._start||0,n._node.bufferSource.loopEnd=n._stop,this.playing(r[i])&&(this.pause(r[i],!0),this.play(r[i],!0)))));return this},rate:function(){var e,n,o,r=this,i=arguments;if(0===i.length?n=r._sounds[0]._id:1===i.length?r._getSoundIds().indexOf(i[0])>=0?n=parseInt(i[0],10):e=parseFloat(i[0]):2===i.length&&(e=parseFloat(i[0]),n=parseInt(i[1],10)),"number"!=typeof e)return(o=r._soundById(n))?o._rate:r._rate;if("loaded"!==r._state||r._playLock)return r._queue.push({event:"rate",action:function(){r.rate.apply(r,i)}}),r;void 0===n&&(r._rate=e),n=r._getSoundIds(n);for(var a=0;a<n.length;a++)if(o=r._soundById(n[a])){r.playing(n[a])&&(o._rateSeek=r.seek(n[a]),o._playStart=r._webAudio?t.ctx.currentTime:o._playStart),o._rate=e,r._webAudio&&o._node&&o._node.bufferSource?o._node.bufferSource.playbackRate.setValueAtTime(e,t.ctx.currentTime):o._node&&(o._node.playbackRate=e);var s=r.seek(n[a]),u=1e3*((r._sprite[o._sprite][0]+r._sprite[o._sprite][1])/1e3-s)/Math.abs(o._rate);(r._endTimers[n[a]]||!o._paused)&&(r._clearTimer(n[a]),r._endTimers[n[a]]=setTimeout(r._ended.bind(r,o),u)),r._emit("rate",o._id)}return r},seek:function(){var e,n,o=this,r=arguments;if(0===r.length?o._sounds.length&&(n=o._sounds[0]._id):1===r.length?o._getSoundIds().indexOf(r[0])>=0?n=parseInt(r[0],10):o._sounds.length&&(n=o._sounds[0]._id,e=parseFloat(r[0])):2===r.length&&(e=parseFloat(r[0]),n=parseInt(r[1],10)),void 0===n)return 0;if("number"==typeof e&&("loaded"!==o._state||o._playLock))return o._queue.push({event:"seek",action:function(){o.seek.apply(o,r)}}),o;var i=o._soundById(n);if(i){if("number"==typeof e&&e>=0){var a=o.playing(n);a&&o.pause(n,!0),i._seek=e,i._ended=!1,o._clearTimer(n),o._webAudio||!i._node||isNaN(i._node.duration)||(i._node.currentTime=e);var s=function(){a&&o.play(n,!0),o._emit("seek",n)};if(a&&!o._webAudio){var u=function(){o._playLock?setTimeout(u,0):s()};setTimeout(u,0)}else s()}else{if(!o._webAudio)return i._node.currentTime;var d=o.playing(n)?t.ctx.currentTime-i._playStart:0,_=i._rateSeek?i._rateSeek-i._seek:0;return i._seek+(_+d*Math.abs(i._rate))}}return o},playing:function(e){if("number"==typeof e){var t=this._soundById(e);return!!t&&!t._paused}for(var n=0;n<this._sounds.length;n++)if(!this._sounds[n]._paused)return!0;return!1},duration:function(e){var t=this._duration,n=this._soundById(e);return n&&(t=this._sprite[n._sprite][1]/1e3),t},state:function(){return this._state},unload:function(){for(var e=this,n=e._sounds,o=0;o<n.length;o++)n[o]._paused||e.stop(n[o]._id),e._webAudio||(e._clearSound(n[o]._node),n[o]._node.removeEventListener("error",n[o]._errorFn,!1),n[o]._node.removeEventListener(t._canPlayEvent,n[o]._loadFn,!1),n[o]._node.removeEventListener("ended",n[o]._endFn,!1),t._releaseHtml5Audio(n[o]._node)),delete n[o]._node,e._clearTimer(n[o]._id);var i=t._howls.indexOf(e);i>=0&&t._howls.splice(i,1);var a=!0;for(o=0;o<t._howls.length;o++)if(t._howls[o]._src===e._src||e._src.indexOf(t._howls[o]._src)>=0){a=!1;break}return r&&a&&delete r[e._src],t.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,t,n,o){var r=this["_on"+e];return"function"==typeof t&&r.push(o?{id:n,fn:t,once:o}:{id:n,fn:t}),this},off:function(e,t,n){var o=this["_on"+e],r=0;if("number"==typeof t&&(n=t,t=null),t||n)for(r=0;r<o.length;r++){var i=n===o[r].id;if(t===o[r].fn&&i||!t&&i){o.splice(r,1);break}}else if(e)this["_on"+e]=[];else{var a=Object.keys(this);for(r=0;r<a.length;r++)0===a[r].indexOf("_on")&&Array.isArray(this[a[r]])&&(this[a[r]]=[])}return this},once:function(e,t,n){return this.on(e,t,n,1),this},_emit:function(e,t,n){for(var o=this["_on"+e],r=o.length-1;r>=0;r--)(!o[r].id||o[r].id===t||"load"===e)&&(setTimeout((function(e){e.call(this,t,n)}).bind(this,o[r].fn),0),o[r].once&&this.off(e,o[r].fn,o[r].id));return this._loadQueue(e),this},_loadQueue:function(e){if(this._queue.length>0){var t=this._queue[0];t.event===e&&(this._queue.shift(),this._loadQueue()),e||t.action()}return this},_ended:function(e){var n=e._sprite;if(!this._webAudio&&e._node&&!e._node.paused&&!e._node.ended&&e._node.currentTime<e._stop)return setTimeout(this._ended.bind(this,e),100),this;var o=!!(e._loop||this._sprite[n][2]);if(this._emit("end",e._id),!this._webAudio&&o&&this.stop(e._id,!0).play(e._id),this._webAudio&&o){this._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=t.ctx.currentTime;var r=(e._stop-e._start)*1e3/Math.abs(e._rate);this._endTimers[e._id]=setTimeout(this._ended.bind(this,e),r)}return this._webAudio&&!o&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,this._clearTimer(e._id),this._cleanBuffer(e._node),t._autoSuspend()),this._webAudio||o||this.stop(e._id,!0),this},_clearTimer:function(e){if(this._endTimers[e]){if("function"!=typeof this._endTimers[e])clearTimeout(this._endTimers[e]);else{var t=this._soundById(e);t&&t._node&&t._node.removeEventListener("ended",this._endTimers[e],!1)}delete this._endTimers[e]}return this},_soundById:function(e){for(var t=0;t<this._sounds.length;t++)if(e===this._sounds[t]._id)return this._sounds[t];return null},_inactiveSound:function(){this._drain();for(var e=0;e<this._sounds.length;e++)if(this._sounds[e]._ended)return this._sounds[e].reset();return new o(this)},_drain:function(){var e=this._pool,t=0,n=0;if(!(this._sounds.length<e)){for(n=0;n<this._sounds.length;n++)this._sounds[n]._ended&&t++;for(n=this._sounds.length-1;n>=0;n--){if(t<=e)return;this._sounds[n]._ended&&(this._webAudio&&this._sounds[n]._node&&this._sounds[n]._node.disconnect(0),this._sounds.splice(n,1),t--)}}},_getSoundIds:function(e){if(void 0!==e)return[e];for(var t=[],n=0;n<this._sounds.length;n++)t.push(this._sounds[n]._id);return t},_refreshBuffer:function(e){return e._node.bufferSource=t.ctx.createBufferSource(),e._node.bufferSource.buffer=r[this._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop||0),e._node.bufferSource.playbackRate.setValueAtTime(e._rate,t.ctx.currentTime),this},_cleanBuffer:function(e){var n=t._navigator&&t._navigator.vendor.indexOf("Apple")>=0;if(t._scratchBuffer&&e.bufferSource&&(e.bufferSource.onended=null,e.bufferSource.disconnect(0),n))try{e.bufferSource.buffer=t._scratchBuffer}catch(e){}return e.bufferSource=null,this},_clearSound:function(e){/MSIE |Trident\//.test(t._navigator&&t._navigator.userAgent)||(e.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")}},(o=function(e){this._parent=e,this.init()}).prototype={init:function(){var e=this._parent;return this._muted=e._muted,this._loop=e._loop,this._volume=e._volume,this._rate=e._rate,this._seek=0,this._paused=!0,this._ended=!0,this._sprite="__default",this._id=++t._counter,e._sounds.push(this),this.create(),this},create:function(){var e=this._parent,n=t._muted||this._muted||this._parent._muted?0:this._volume;return e._webAudio?(this._node=void 0===t.ctx.createGain?t.ctx.createGainNode():t.ctx.createGain(),this._node.gain.setValueAtTime(n,t.ctx.currentTime),this._node.paused=!0,this._node.connect(t.masterGain)):t.noAudio||(this._node=t._obtainHtml5Audio(),this._errorFn=this._errorListener.bind(this),this._node.addEventListener("error",this._errorFn,!1),this._loadFn=this._loadListener.bind(this),this._node.addEventListener(t._canPlayEvent,this._loadFn,!1),this._endFn=this._endListener.bind(this),this._node.addEventListener("ended",this._endFn,!1),this._node.src=e._src,this._node.preload=!0===e._preload?"auto":e._preload,this._node.volume=n*t.volume(),this._node.load()),this},reset:function(){var e=this._parent;return this._muted=e._muted,this._loop=e._loop,this._volume=e._volume,this._rate=e._rate,this._seek=0,this._rateSeek=0,this._paused=!0,this._ended=!0,this._sprite="__default",this._id=++t._counter,this},_errorListener:function(){this._parent._emit("loaderror",this._id,this._node.error?this._node.error.code:0),this._node.removeEventListener("error",this._errorFn,!1)},_loadListener:function(){var e=this._parent;e._duration=Math.ceil(10*this._node.duration)/10,0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue()),this._node.removeEventListener(t._canPlayEvent,this._loadFn,!1)},_endListener:function(){var e=this._parent;e._duration===1/0&&(e._duration=Math.ceil(10*this._node.duration)/10,e._sprite.__default[1]===1/0&&(e._sprite.__default[1]=1e3*e._duration),e._ended(this)),this._node.removeEventListener("ended",this._endFn,!1)}},r={},i=function(e){var t=e._src;if(r[t]){e._duration=r[t].duration,u(e);return}if(/^data:[^;]+;base64,/.test(t)){for(var n=atob(t.split(",")[1]),o=new Uint8Array(n.length),i=0;i<n.length;++i)o[i]=n.charCodeAt(i);s(o.buffer,e)}else{var d=new XMLHttpRequest;d.open(e._xhr.method,t,!0),d.withCredentials=e._xhr.withCredentials,d.responseType="arraybuffer",e._xhr.headers&&Object.keys(e._xhr.headers).forEach(function(t){d.setRequestHeader(t,e._xhr.headers[t])}),d.onload=function(){var t=(d.status+"")[0];if("0"!==t&&"2"!==t&&"3"!==t){e._emit("loaderror",null,"Failed loading audio file with status: "+d.status+".");return}s(d.response,e)},d.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[t],e.load())},a(d)}},a=function(e){try{e.send()}catch(t){e.onerror()}},s=function(e,n){var o=function(){n._emit("loaderror",null,"Decoding audio data failed.")},i=function(e){e&&n._sounds.length>0?(r[n._src]=e,u(n,e)):o()};"undefined"!=typeof Promise&&1===t.ctx.decodeAudioData.length?t.ctx.decodeAudioData(e).then(i).catch(o):t.ctx.decodeAudioData(e,i,o)},u=function(e,t){t&&!e._duration&&(e._duration=t.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue())},d=function(){if(t.usingWebAudio){try{"undefined"!=typeof AudioContext?t.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?t.ctx=new webkitAudioContext:t.usingWebAudio=!1}catch(e){t.usingWebAudio=!1}t.ctx||(t.usingWebAudio=!1);var e=/iP(hone|od|ad)/.test(t._navigator&&t._navigator.platform),n=t._navigator&&t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),o=n?parseInt(n[1],10):null;if(e&&o&&o<9){var r=/safari/.test(t._navigator&&t._navigator.userAgent.toLowerCase());t._navigator&&!r&&(t.usingWebAudio=!1)}t.usingWebAudio&&(t.masterGain=void 0===t.ctx.createGain?t.ctx.createGainNode():t.ctx.createGain(),t.masterGain.gain.setValueAtTime(t._muted?0:t._volume,t.ctx.currentTime),t.masterGain.connect(t.ctx.destination)),t._setup()}},"function"==typeof define&&define.amd&&define([],function(){return{Howler:t,Howl:n}}),void 0!==f?(f.HowlerGlobal=e,f.Howler=t,f.Howl=n,f.Sound=o):"undefined"!=typeof window&&(window.HowlerGlobal=e,window.Howler=t,window.Howl=n,window.Sound=o),HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(e){if(!this.ctx||!this.ctx.listener)return this;for(var t=this._howls.length-1;t>=0;t--)this._howls[t].stereo(e);return this},HowlerGlobal.prototype.pos=function(e,t,n){return this.ctx&&this.ctx.listener?(t="number"!=typeof t?this._pos[1]:t,n="number"!=typeof n?this._pos[2]:n,"number"!=typeof e)?this._pos:(this._pos=[e,t,n],void 0!==this.ctx.listener.positionX?(this.ctx.listener.positionX.setTargetAtTime(this._pos[0],Howler.ctx.currentTime,.1),this.ctx.listener.positionY.setTargetAtTime(this._pos[1],Howler.ctx.currentTime,.1),this.ctx.listener.positionZ.setTargetAtTime(this._pos[2],Howler.ctx.currentTime,.1)):this.ctx.listener.setPosition(this._pos[0],this._pos[1],this._pos[2]),this):this},HowlerGlobal.prototype.orientation=function(e,t,n,o,r,i){if(!this.ctx||!this.ctx.listener)return this;var a=this._orientation;return(t="number"!=typeof t?a[1]:t,n="number"!=typeof n?a[2]:n,o="number"!=typeof o?a[3]:o,r="number"!=typeof r?a[4]:r,i="number"!=typeof i?a[5]:i,"number"!=typeof e)?a:(this._orientation=[e,t,n,o,r,i],void 0!==this.ctx.listener.forwardX?(this.ctx.listener.forwardX.setTargetAtTime(e,Howler.ctx.currentTime,.1),this.ctx.listener.forwardY.setTargetAtTime(t,Howler.ctx.currentTime,.1),this.ctx.listener.forwardZ.setTargetAtTime(n,Howler.ctx.currentTime,.1),this.ctx.listener.upX.setTargetAtTime(o,Howler.ctx.currentTime,.1),this.ctx.listener.upY.setTargetAtTime(r,Howler.ctx.currentTime,.1),this.ctx.listener.upZ.setTargetAtTime(i,Howler.ctx.currentTime,.1)):this.ctx.listener.setOrientation(e,t,n,o,r,i),this)},Howl.prototype.init=(_=Howl.prototype.init,function(e){return this._orientation=e.orientation||[1,0,0],this._stereo=e.stereo||null,this._pos=e.pos||null,this._pannerAttr={coneInnerAngle:void 0!==e.coneInnerAngle?e.coneInnerAngle:360,coneOuterAngle:void 0!==e.coneOuterAngle?e.coneOuterAngle:360,coneOuterGain:void 0!==e.coneOuterGain?e.coneOuterGain:0,distanceModel:void 0!==e.distanceModel?e.distanceModel:"inverse",maxDistance:void 0!==e.maxDistance?e.maxDistance:1e4,panningModel:void 0!==e.panningModel?e.panningModel:"HRTF",refDistance:void 0!==e.refDistance?e.refDistance:1,rolloffFactor:void 0!==e.rolloffFactor?e.rolloffFactor:1},this._onstereo=e.onstereo?[{fn:e.onstereo}]:[],this._onpos=e.onpos?[{fn:e.onpos}]:[],this._onorientation=e.onorientation?[{fn:e.onorientation}]:[],_.call(this,e)}),Howl.prototype.stereo=function(e,t){var n=this;if(!n._webAudio)return n;if("loaded"!==n._state)return n._queue.push({event:"stereo",action:function(){n.stereo(e,t)}}),n;var o=void 0===Howler.ctx.createStereoPanner?"spatial":"stereo";if(void 0===t){if("number"!=typeof e)return n._stereo;n._stereo=e,n._pos=[e,0,0]}for(var r=n._getSoundIds(t),i=0;i<r.length;i++){var a=n._soundById(r[i]);if(a){if("number"!=typeof e)return a._stereo;a._stereo=e,a._pos=[e,0,0],a._node&&(a._pannerAttr.panningModel="equalpower",a._panner&&a._panner.pan||p(a,o),"spatial"===o?void 0!==a._panner.positionX?(a._panner.positionX.setValueAtTime(e,Howler.ctx.currentTime),a._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime),a._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime)):a._panner.setPosition(e,0,0):a._panner.pan.setValueAtTime(e,Howler.ctx.currentTime)),n._emit("stereo",a._id)}}return n},Howl.prototype.pos=function(e,t,n,o){var r=this;if(!r._webAudio)return r;if("loaded"!==r._state)return r._queue.push({event:"pos",action:function(){r.pos(e,t,n,o)}}),r;if(t="number"!=typeof t?0:t,n="number"!=typeof n?-.5:n,void 0===o){if("number"!=typeof e)return r._pos;r._pos=[e,t,n]}for(var i=r._getSoundIds(o),a=0;a<i.length;a++){var s=r._soundById(i[a]);if(s){if("number"!=typeof e)return s._pos;s._pos=[e,t,n],s._node&&((!s._panner||s._panner.pan)&&p(s,"spatial"),void 0!==s._panner.positionX?(s._panner.positionX.setValueAtTime(e,Howler.ctx.currentTime),s._panner.positionY.setValueAtTime(t,Howler.ctx.currentTime),s._panner.positionZ.setValueAtTime(n,Howler.ctx.currentTime)):s._panner.setPosition(e,t,n)),r._emit("pos",s._id)}}return r},Howl.prototype.orientation=function(e,t,n,o){var r=this;if(!r._webAudio)return r;if("loaded"!==r._state)return r._queue.push({event:"orientation",action:function(){r.orientation(e,t,n,o)}}),r;if(t="number"!=typeof t?r._orientation[1]:t,n="number"!=typeof n?r._orientation[2]:n,void 0===o){if("number"!=typeof e)return r._orientation;r._orientation=[e,t,n]}for(var i=r._getSoundIds(o),a=0;a<i.length;a++){var s=r._soundById(i[a]);if(s){if("number"!=typeof e)return s._orientation;s._orientation=[e,t,n],s._node&&(s._panner||(s._pos||(s._pos=r._pos||[0,0,-.5]),p(s,"spatial")),void 0!==s._panner.orientationX?(s._panner.orientationX.setValueAtTime(e,Howler.ctx.currentTime),s._panner.orientationY.setValueAtTime(t,Howler.ctx.currentTime),s._panner.orientationZ.setValueAtTime(n,Howler.ctx.currentTime)):s._panner.setOrientation(e,t,n)),r._emit("orientation",s._id)}}return r},Howl.prototype.pannerAttr=function(){var e,t,n,o=arguments;if(!this._webAudio)return this;if(0===o.length)return this._pannerAttr;if(1===o.length){if("object"!=typeof o[0])return(n=this._soundById(parseInt(o[0],10)))?n._pannerAttr:this._pannerAttr;e=o[0],void 0===t&&(e.pannerAttr||(e.pannerAttr={coneInnerAngle:e.coneInnerAngle,coneOuterAngle:e.coneOuterAngle,coneOuterGain:e.coneOuterGain,distanceModel:e.distanceModel,maxDistance:e.maxDistance,refDistance:e.refDistance,rolloffFactor:e.rolloffFactor,panningModel:e.panningModel}),this._pannerAttr={coneInnerAngle:void 0!==e.pannerAttr.coneInnerAngle?e.pannerAttr.coneInnerAngle:this._coneInnerAngle,coneOuterAngle:void 0!==e.pannerAttr.coneOuterAngle?e.pannerAttr.coneOuterAngle:this._coneOuterAngle,coneOuterGain:void 0!==e.pannerAttr.coneOuterGain?e.pannerAttr.coneOuterGain:this._coneOuterGain,distanceModel:void 0!==e.pannerAttr.distanceModel?e.pannerAttr.distanceModel:this._distanceModel,maxDistance:void 0!==e.pannerAttr.maxDistance?e.pannerAttr.maxDistance:this._maxDistance,refDistance:void 0!==e.pannerAttr.refDistance?e.pannerAttr.refDistance:this._refDistance,rolloffFactor:void 0!==e.pannerAttr.rolloffFactor?e.pannerAttr.rolloffFactor:this._rolloffFactor,panningModel:void 0!==e.pannerAttr.panningModel?e.pannerAttr.panningModel:this._panningModel})}else 2===o.length&&(e=o[0],t=parseInt(o[1],10));for(var r=this._getSoundIds(t),i=0;i<r.length;i++)if(n=this._soundById(r[i])){var a=n._pannerAttr;a={coneInnerAngle:void 0!==e.coneInnerAngle?e.coneInnerAngle:a.coneInnerAngle,coneOuterAngle:void 0!==e.coneOuterAngle?e.coneOuterAngle:a.coneOuterAngle,coneOuterGain:void 0!==e.coneOuterGain?e.coneOuterGain:a.coneOuterGain,distanceModel:void 0!==e.distanceModel?e.distanceModel:a.distanceModel,maxDistance:void 0!==e.maxDistance?e.maxDistance:a.maxDistance,refDistance:void 0!==e.refDistance?e.refDistance:a.refDistance,rolloffFactor:void 0!==e.rolloffFactor?e.rolloffFactor:a.rolloffFactor,panningModel:void 0!==e.panningModel?e.panningModel:a.panningModel};var s=n._panner;s?(s.coneInnerAngle=a.coneInnerAngle,s.coneOuterAngle=a.coneOuterAngle,s.coneOuterGain=a.coneOuterGain,s.distanceModel=a.distanceModel,s.maxDistance=a.maxDistance,s.refDistance=a.refDistance,s.rolloffFactor=a.rolloffFactor,s.panningModel=a.panningModel):(n._pos||(n._pos=this._pos||[0,0,-.5]),p(n,"spatial"))}return this},Sound.prototype.init=(l=Sound.prototype.init,function(){var e=this._parent;this._orientation=e._orientation,this._stereo=e._stereo,this._pos=e._pos,this._pannerAttr=e._pannerAttr,l.call(this),this._stereo?e.stereo(this._stereo):this._pos&&e.pos(this._pos[0],this._pos[1],this._pos[2],this._id)}),Sound.prototype.reset=(c=Sound.prototype.reset,function(){var e=this._parent;return this._orientation=e._orientation,this._stereo=e._stereo,this._pos=e._pos,this._pannerAttr=e._pannerAttr,this._stereo?e.stereo(this._stereo):this._pos?e.pos(this._pos[0],this._pos[1],this._pos[2],this._id):this._panner&&(this._panner.disconnect(0),this._panner=void 0,e._refreshBuffer(this)),c.call(this)}),p=function(e,t){"spatial"===(t=t||"spatial")?(e._panner=Howler.ctx.createPanner(),e._panner.coneInnerAngle=e._pannerAttr.coneInnerAngle,e._panner.coneOuterAngle=e._pannerAttr.coneOuterAngle,e._panner.coneOuterGain=e._pannerAttr.coneOuterGain,e._panner.distanceModel=e._pannerAttr.distanceModel,e._panner.maxDistance=e._pannerAttr.maxDistance,e._panner.refDistance=e._pannerAttr.refDistance,e._panner.rolloffFactor=e._pannerAttr.rolloffFactor,e._panner.panningModel=e._pannerAttr.panningModel,void 0!==e._panner.positionX?(e._panner.positionX.setValueAtTime(e._pos[0],Howler.ctx.currentTime),e._panner.positionY.setValueAtTime(e._pos[1],Howler.ctx.currentTime),e._panner.positionZ.setValueAtTime(e._pos[2],Howler.ctx.currentTime)):e._panner.setPosition(e._pos[0],e._pos[1],e._pos[2]),void 0!==e._panner.orientationX?(e._panner.orientationX.setValueAtTime(e._orientation[0],Howler.ctx.currentTime),e._panner.orientationY.setValueAtTime(e._orientation[1],Howler.ctx.currentTime),e._panner.orientationZ.setValueAtTime(e._orientation[2],Howler.ctx.currentTime)):e._panner.setOrientation(e._orientation[0],e._orientation[1],e._orientation[2])):(e._panner=Howler.ctx.createStereoPanner(),e._panner.pan.setValueAtTime(e._stereo,Howler.ctx.currentTime)),e._panner.connect(e._node),e._paused||e._parent.pause(e._id,!0).play(e._id,!0)};var h={sound:null,init(){this.sound=new n({src:["musicBackground/0.mp3"],volume:.2,loop:!0}),console.log(this.sound)},play(){this.sound.play()}};h.init(),h.play();
//# sourceMappingURL=index.bc13f52e.js.map
