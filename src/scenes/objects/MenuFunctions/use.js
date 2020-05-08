/* eslint-disable no-param-reassign */
export default class Use extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene);
    this.scene.add.existing(this);

    // this.objectO1 = 0;
    this.comesFromInventory = false;
  }

  usingFunction(objectO1, objectO2) {
    let obj1 = 0;
    let obj2 = 0;
    this.comesFromInventory = false;
    this.scene.inventory.forEach((element) => {
      if (element.name === objectO1.name || element.name === objectO2.name) this.comesFromInventory = true;
    });

    if (this.comesFromInventory === false) {
      this.scene.menuContainer.generalText('Los objetos del escenario se usan con los del inventario.');
      this.scene.objectToCompare = 0;
      // CABLE
    } else if (objectO1.name === 'brokenCable' || objectO2.name === 'brokenCable') {
      if (objectO1.name === 'brokenCable') {
        obj1 = objectO1;
        obj2 = objectO2;
      } else {
        obj1 = objectO2;
        obj2 = objectO1;
      }
      this.cableFunction(obj1, obj2);

      // GLASS
    } else if (objectO1.name === 'glass' || objectO2.name === 'glass') {
      if (objectO1.name === 'glass') {
        obj1 = objectO1;
        obj2 = objectO2;
      } else {
        obj1 = objectO2;
        obj2 = objectO1;
      }
      this.glassFunction(obj1, obj2);

      // KEY
    } else if (objectO1.name === 'key' || objectO2.name === 'key') {
      if (objectO1.name === 'key') {
        obj1 = objectO1;
        obj2 = objectO2;
      } else {
        obj1 = objectO2;
        obj2 = objectO1;
      }
      this.keyFunction(obj1, obj2);
    } else {
      this.scene.menuContainer.generalText('Eso no serviría.');
      this.scene.exitFunction();
      this.scene.objectToCompare = 0;
    }
  }

  laserFunction() {
    if (this.scene.laser.finished === false) {
      this.scene.disableObjectsInteractive();
      this.scene.menuContainer.dontSetInteractive = true;
      this.scene.stop = true;
      this.scene.stopMenu = true;
      this.scene.time.delayedCall(500, () => { this.scene.menuContainer.menuTweenOut(); }, this);
      this.scene.exit.setPosition(this.scene.cameras.main.centerX + this.scene.laserDevice.displayWidth / 2 - 21, this.scene.cameras.main.centerY - this.scene.laserDevice.displayHeight / 2 - 30);
      this.scene.laserDevice.setVisible(true);
      this.scene.exit.setVisible(true);
      this.scene.exit.setInteractive();
      this.scene.laserKeys.forEach((element) => {
        element.setInteractive({ useHandCursor: true });
        element.setVisible(true);
      });
    } else {
      this.scene.menuContainer.generalText('Ya no nos hace falta acceder al dispositivo.');
    }
  }

  cableFunction(obj1, obj2) {
    switch (obj2.name) {
      case 'osc':
        if (obj1.fixed === false) {
          obj1.picture.setTexture('assets', 'cableFix.png');
          obj1.fixed = true;
          obj1.information = 'Cable funcional. Podría servirme para algo.';
          this.scene.menuContainer.generalText('Bien hecho. Hemos arreglado el cable.');
          this.scene.gameProgress += 1;
          this.scene.progressFunction();
        } else this.scene.menuContainer.generalText('El cable ya está arreglado.');
        break;
      case 'apparat':
        if (obj1.fixed === false) this.scene.menuContainer.generalText('Primero debemos hacer algo con el cable. Está roto.');
        else {
          obj2.picture.setTexture('assets', 'apparatFix.png');
          obj2.objectOpenImg = 'apparatFixOp.png';
          obj2.objectClosedImg = 'apparatFix.png';
          obj2.fixed = true;
          obj1.picture.setVisible(false);
          this.scene.gameProgress += 1;
          this.scene.progressFunction();
          for (let i = 0; i < this.scene.inventory.length; i += 1) {
            if (this.scene.inventory[i].name === obj1.name) this.scene.inventory.splice(i, 1);
          }
          this.scene.menuContainer.generalText('Bien hecho. Hemos arreglado el aparato.');
        }
        break;
      default: this.scene.menuContainer.generalText('No puedo usarlo con eso...');
        break;
    }
    this.scene.exitFunction();
    this.scene.objectToCompare = 0;
  }

  glassFunction(obj1, obj2) {
    switch (obj2.name) {
      case 'window':
        if (obj2.isOpen === false) this.scene.menuContainer.generalText('No puedo llenarlo con el cristal delante...');
        else if (obj1.isFull === true) this.scene.menuContainer.generalText('El vaso ya está lleno.');
        else {
          obj1.picture.setTexture('assets', 'glassWater.png');
          obj1.information = 'Vaso lleno de agua.';
          obj1.isFull = true;
          this.scene.gameProgress += 1;
          this.scene.progressFunction();
          this.scene.menuContainer.generalText('Hecho. He llenado el vaso de agua.');
        }
        break;

      case 'apparat':
        if (obj2.isOpen === false) this.scene.menuContainer.generalText('No puedo hacer nada si está cerrado...');
        else if (obj2.fixed === false) this.scene.menuContainer.generalText('No va a funcionar. El aparato está dañado.');
        else if (obj1.isFull === false) this.scene.menuContainer.generalText('El vaso está vacío, no serviría de nada...');
        else if (obj1.isAcid === true) this.scene.menuContainer.generalText('Ya hemos convertido el agua.');
        else {
          obj1.picture.setTexture('assets', 'glassAcid.png');
          obj1.information = 'Vaso lleno de ácido.';
          obj2.information = 'Aparato para transformar líquidos en ácido.';
          obj1.isAcid = true;
          this.scene.gameProgress += 1;
          this.scene.progressFunction();
          this.scene.menuContainer.generalText('Hecho! No se que hace este aparato pero el agua se ha convertido en ácido!');
        }
        break;

      case 'door': if (obj1.isAcid) {
        obj2.isLockedToOpen = false;
        obj2.picture.setTexture('assets', 'doorUnlock.png');
        this.scene.menuContainer.generalText('Creo que este líquido corrosivo derretirá la cerradura.');
        this.scene.gameProgress += 1;
        this.scene.progressFunction();
      } else this.scene.menuContainer.generalText('Hay que hacer mas cosas con el vaso aun.');
        break;
      default: this.scene.menuContainer.generalText('No puedo usarlo con eso...');
        break;
    }

    this.scene.exitFunction();
    this.scene.objectToCompare = 0;
  }

  keyFunction(obj1, obj2) {
    if (obj2.name === 'book') {
      if (obj1.finished === false) {
        obj1.picture.setVisible(false);
        obj1.finished = true;
        for (let i = 0; i < this.scene.inventory.length; i += 1) {
          if (this.scene.inventory[i].name === obj1.name) this.scene.inventory.splice(i, 1);
        }
        obj2.isLockedToOpen = false;
        obj2.information = 'Un libro con información aparentemente valiosa.';
        this.scene.gameProgress += 1;
        this.scene.progressFunction();
        this.scene.menuContainer.generalText('Hecho! Ya podemos abrir el libro cuando queramos.');
      }
    } else {
      this.scene.menuContainer.generalText('No puedo usarlo con eso...');
    }
    this.scene.exitFunction();
    this.scene.objectToCompare = 0;
  }

}