import Phaser from 'phaser';
import PreloaderScene from './scenes/preloader-scene';
import GameScene from './scenes/game-scene';

const config = {
  type: Phaser.CANVAS,
  parent: 'phaser-div',
  width: 1280,
  height: 720,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scaleMode: Phaser.Scale.FIT,
  scene: [
    PreloaderScene,
    GameScene,
  ],
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
