import {Howl, Howler} from 'howler';

export var music = {
	sound: null,
	volume: 0.03,
	init()
	{
		if(!this.sound)
			this.sound = new Howl({
				src: [`musicBackground/${getRandomInt(19)}.mp3`],
				volume: this.volume,
				loop: true,
				autoplay: true,
				html5:true,
			});
	},
	mute() {
		this.sound.volume(0)
	},
	unmute() {
		this.sound.volume(this.volume)	
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
