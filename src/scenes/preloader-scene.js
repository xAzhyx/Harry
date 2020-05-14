// import harryImg from '../Images/frente.png';
// import harry2 from '../Images/harry2.png';
// import closedDoor from '../Images/puertaCerrada.png';
// import closedDoorLock from '../Images/puertaLock.png';
// import openDoor from '../Images/puertaAbierta.png';
// import harryR from '../Images/harry2R.png';
// import harryRM1 from '../Images/harry2RWalk1.png';
// import harryRM2 from '../Images/harry2RWalk2.png';
// import harryRM6 from '../Images/harry2RWalk6.png';
// import harryRM7 from '../Images/harry2RWalk7.png';
// import harryRM3 from '../Images/harry2RWalk3.png';
// import harryRM4 from '../Images/harry2RWalk4.png';
// import harryRM5 from '../Images/harry2RWalk5.png';
// import menuVar from '../Images/menu2.png';
// import button from '../Images/button.png';
// import buttonSha from '../Images/buttonShadow.png';
// import room from '../Images/room.png';
// import books1 from '../Images/libros1.png';
// import books2 from '../Images/libros2.png';
// import books1Taken from '../Images/libros1Cogido.png';
// import book from '../Images/book.png';
// import openBook from '../Images/libroAbierto.png';
// import windowImg from '../Images/ventana.png';
// import openWindowImg from '../Images/ventanaAbierta.png';
// import tableImg from '../Images/mesa.png';
// import oscil from '../Images/osc.png';
// import apparatImg from '../Images/aparato.png';
// import apparatImgBrk from '../Images/aparatoRoto.png';
// import openApparatImg from '../Images/aparatoAbierto.png';
// import openApparatImgBrk from '../Images/aparatoAbiertoRoto.png';
// import glassImg from '../Images/vaso.png';
// import fullGlassImg from '../Images/vasoLleno.png';
// import fullAcidGlassImg from '../Images/vasoLlenoAcido.png';
// import brokenCableImg from '../Images/cableRoto.png';
// import fixedCableImg from '../Images/cableArreglado.png';
// import key from '../Images/llave.png';
// import spirit from '../Images/bicho.png';
// import cloud from '../Images/cloud.png';
// import bagImg from '../Images/mochila.png';
// import exitImg from '../Images/exitX.png';
// import closetImg from '../Images/armarioCerrado.png';
// import openClosetImg from '../Images/armarioAbierto.png';
// import openClosetDraImg from '../Images/armarioCajonAbierto.png';
// import drawerImg from '../Images/cajon.png';
// import redLaser from '../Images/laser.png';
// import greenLaser from '../Images/laserUnLock.png';
// import laserDevice from '../Images/laserDevice.png';

import assetsJson from '../assets/assets.json';
import assetsAtlas from '../assets/assets.png';
import assetsJson2 from '../assets/assets2.json';
import assetsAtlas2 from '../assets/assets2.png';
import room from '../Images/room3.png';
import ctaBG from '../Images/finalBg.png';

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
    this.load.atlas('assets', assetsAtlas, assetsJson);
    this.load.atlas('assets2', assetsAtlas2, assetsJson2);
    this.load.image('room', room);
    this.load.image('ctaBG', ctaBG);
    // this.load.image('openDoor', openDoor);
    // this.load.image('closedDoor', closedDoor);
    // this.load.image('closedDoorLock', closedDoorLock);
    // // harry
    // this.load.image('harry', harryImg);
    // this.load.image('harry2', harry2);
    // this.load.image('harryR', harryR);
    // this.load.image('harryRM1', harryRM1);
    // this.load.image('harryRM2', harryRM2);
    // this.load.image('harryRM6', harryRM6);
    // this.load.image('harryRM7', harryRM7);
    // this.load.image('harryRM3', harryRM3);
    // this.load.image('harryRM4', harryRM4);
    // this.load.image('harryRM5', harryRM5);
    // // menu
    // this.load.image('menu', menuVar);
    // this.load.image('button', button);
    // this.load.image('buttonSha', buttonSha);
    // // room
    // // books
    // this.load.image('books1', books1);
    // this.load.image('books2', books2);
    // this.load.image('books1Taken', books1Taken);
    // this.load.image('book', book);
    // this.load.image('openBook', openBook);
    // // windows
    // this.load.image('window', windowImg);
    // this.load.image('openWindow', openWindowImg);
    // // table & objects
    // this.load.image('table', tableImg);
    // this.load.image('osc', oscil);
    // this.load.image('apparat', apparatImg);
    // this.load.image('apparatBrk', apparatImgBrk);
    // this.load.image('openApparat', openApparatImg);
    // this.load.image('openApparatImgBrk', openApparatImgBrk);
    // this.load.image('glass', glassImg);
    // this.load.image('fullGlass', fullGlassImg);
    // this.load.image('fullAcidGlass', fullAcidGlassImg);
    // this.load.image('brokenCable', brokenCableImg);
    // this.load.image('fixedCable', fixedCableImg);
    // this.load.image('key', key);
    // // spirit
    // this.load.image('spirit', spirit);
    // this.load.image('cloud', cloud);
    // this.load.image('bag', bagImg);

    // this.load.image('exit', exitImg);
    // this.load.image('closet', closetImg);
    // this.load.image('openCloset', openClosetImg);
    // this.load.image('openCloset2', openClosetDraImg);
    // this.load.image('drawer', drawerImg);
    // this.load.image('redLaser', redLaser);
    // this.load.image('greenLaser', greenLaser);
    // this.load.image('laserDevice', laserDevice);
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloaderScene;
