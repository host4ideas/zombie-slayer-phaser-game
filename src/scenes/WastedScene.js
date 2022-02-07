import Phaser from 'phaser';
import wastedVideo from '../assets/video/gtav_wasted.mp4';
// Audio controller
import audioController from "../audioController";

export default class WastedScene extends Phaser.Scene {
	constructor() {
		super('wastedscene');
	}

	preload() {
		this.load.video('wasted', wastedVideo, 'loadeddata', true, false);
	}

	create() {
		// Pause all audios
		audioController.pauseAllAudios();

		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		var vid = this.add.video(screenCenterX, screenCenterY, 'wasted');

		vid.setDisplaySize(
			(this.cameras.main.worldView.x + this.cameras.main.width),
			(this.cameras.main.worldView.y + this.cameras.main.height)
		);

		vid.play(false);

		this.time.delayedCall(7000, () => {
			audioController.playRandomST();
			audioController.adjustVolume(1);
			this.sys.game.destroy(true);
		});
	}
}
