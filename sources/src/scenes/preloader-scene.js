import assetsJson from '../assets/assets.json';
import assetsAtlas from '../assets/assets.png';
import assetsJson2 from '../assets/assets2.json';
import assetsAtlas2 from '../assets/assets2.png';
import room from '../Images/room3.png';
import congrats from '../audio/congrats.mp3';
import phan1 from '../audio/phan1.mp3';
import phan2 from '../audio/phan2.mp3';
import phan3 from '../audio/phan3.mp3';
import phan4 from '../audio/phan4.mp3';
import apparat from '../audio/apparat.mp3';
import osc from '../audio/osc.mp3';
import char from '../audio/char.mp3';
import click from '../audio/click.mp3';
import closet from '../audio/closet.mp3';
import correctCode from '../audio/correctCode.mp3';
import incorrectCode from '../audio/incorrectCode.mp3';
import fly from '../audio/fly.mp3';
import glass from '../audio/glass.mp3';
import hurryUp from '../audio/hurryUp.mp3';
import openBook from '../audio/openBook.mp3';
import music from '../audio/music.mp3';
import page from '../audio/page.mp3';
import take from '../audio/take.mp3';
import tecla1 from '../audio/tecla1.mp3';
import tecla2 from '../audio/tecla2.mp3';
import tecla3 from '../audio/tecla3.mp3';
import type from '../audio/typeWriter.mp3';
import timeOver from '../audio/timeOver.mp3';
// import ctaBG from '../Images/finalBg.png';

// <?php
// include '../scenes/phpConection.php';
// ?>

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {
    // this.load.atlasJSONArray('assets', 'assets/assets.png', 'assets/assets.json');
    // door
    this.load.audio('congrats', congrats);
    this.load.audio('phan1', phan1);
    this.load.audio('phan2', phan2);
    this.load.audio('phan3', phan3);
    this.load.audio('phan4', phan4);
    this.load.audio('apparat', apparat);
    this.load.audio('osc', osc);
    this.load.audio('char', char);
    this.load.audio('click', click);
    this.load.audio('closet', closet);
    this.load.audio('correctCode', correctCode);
    this.load.audio('incorrectCode', incorrectCode);
    this.load.audio('fly', fly);
    this.load.audio('glass', glass);
    this.load.audio('hurryUp', hurryUp);
    this.load.audio('openBook', openBook);
    this.load.audio('page', page);
    this.load.audio('music', music);
    this.load.audio('take', take);
    this.load.audio('tecla1', tecla1);
    this.load.audio('tecla2', tecla2);
    this.load.audio('tecla3', tecla3);
    this.load.audio('type', type);
    this.load.audio('timeOver', timeOver);
    this.load.atlas('assets', assetsAtlas, assetsJson);
    this.load.atlas('assets2', assetsAtlas2, assetsJson2);
    this.load.image('room', room);
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloaderScene;
