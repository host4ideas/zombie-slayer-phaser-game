import Phaser from 'phaser';
import warpVideo from '../assets/video/wormhole.mp4';
import warpAudioEffect from '../assets/audio/sfx/sci-fi-spaceship-525-sound-effect.mp3';

export default class WarpScene extends Phaser.Scene {
	constructor() {
		// Scene key
		super('warpscene');
	}

	preload() {
		// Load video
		this.load.video('wormhole', warpVideo, 'loadeddata', false, true);
		// Load audio
		this.load.audio('warp_audio_effect', warpAudioEffect);
	}

	create() {
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		// Add video
		var vid = this.add.video(screenCenterX, screenCenterY, 'wormhole');
		// Add audio
		this.sound.add('warp_audio_effect');

		// Set the video size as the display available size
		vid.setDisplaySize(
			(this.cameras.main.worldView.x + this.cameras.main.width),
			(this.cameras.main.worldView.y + this.cameras.main.height)
		);

		// Play video
		vid.play(true);
		// Play audio
		this.sound.play('warp_audio_effect');

		// Prevents video freeze when game is out of focus (i.e. user changes tab on the browser)
		vid.setPaused(false);

		// Delayed fade out effect for the scene
		this.time.delayedCall(3000, () => {
			this.cameras.main.fadeOut(1200, 0, 0, 0);

			// Delayed switch to MainScene (game itself)
			this.time.delayedCall(1200, () => {
				this.scene.switch('mainscene');
			});
		});
	}
}
