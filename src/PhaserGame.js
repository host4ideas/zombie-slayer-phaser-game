import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import WarpScene from './scenes/WarpScene';
import WastedScene from './scenes/WastedScene';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pixelArt: true,
  scene: [WarpScene, MainScene, WastedScene],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      // debugShowBody: true,
      gravity: { y: 0 }
    }
  },
};

export default config;