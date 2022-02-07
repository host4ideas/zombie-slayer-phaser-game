import menuOptionAudio from './assets/audio/menu/Menu-Selection-Change-D2.mp3';
import soundTrack1 from './assets/audio/music/2021-11-14_-_Ogre_Boss_-_David_Fesliyan.mp3';
import soundTrack2 from './assets/audio/music/2019-05-09_-_Escape_Chase_-_David_Fesliyan.mp3';
import soundTrack3 from './assets/audio/music/60_Second-2022-02-01_-_Eat_This.mp3';

class AudioController {
	#audio1
	#audio2
	#audio3
	#optionSound

	constructor() {
		this.#audio1 = new Audio(soundTrack1);
		this.#audio2 = new Audio(soundTrack2);
		this.#audio3 = new Audio(soundTrack3);
		this.#optionSound = new Audio(menuOptionAudio);
	}

	pauseAllAudios() {
		try {
			this.#audio1.pause();
			this.#audio2.pause();
			this.#audio3.pause();
		} catch (e) {
			console.log("Play: Some audios aren't playing");
		}
	}

	playMenuOptionSound() {
		this.#optionSound.play();
	}

	adjustVolume(value) {
		this.#audio1.volume = value;
		this.#audio2.volume = value;
		this.#audio3.volume = value;
	}

	playST1() {
		this.#audio1.play();
	}

	playST2() {
		this.#audio2.play();
	}

	playST3() {
		this.#audio3.play();
	}

	playRandomST() {
		const option = Math.floor(Math.random() * 3);
		// Play a randomly song each 5 minutes
		switch (option) {
			case 0:
				this.#audio1.play();
				break;
			case 1:
				this.#audio2.play();
				break;
			case 2:
				this.#audio3.play();
				break;
		}
	}
}

const audioController = new AudioController();

export default audioController;