export default class ClosetFunctions extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene);
    this.scene.add.existing(this);
  }

  openCloset(objectO) {
    if (objectO.picture.frame.name === 'closet.png') {
      this.scene.time.delayedCall(500, () => { this.scene.menuContainer.menuTweenOut(); }, this);
      objectO.picture.setTexture('assets', 'closetOp1.png');
      this.scene.menuContainer.generalText('Hecho, lo he abierto');
      objectO.information = 'Tiene unas extrañas imágenes en las puertas y varios cajones.';
    } else if (objectO.picture.frame.name === 'closetOp2.png' && this.scene.drawer.visible === true) {
      this.scene.menuContainer.generalText('No se puede abrir mas.');
    } else {
      objectO.picture.setTexture('assets', 'closetOp2.png');
      this.scene.menuContainer.generalText('Hecho, lo he abierto');
      this.scene.menuContainer.dontSetInteractive = true;
      this.scene.disableObjectsInteractive();
      this.scene.time.delayedCall(500, () => { this.scene.menuContainer.menuTweenOut(); }, this);
      this.scene.exit.setPosition(this.scene.cameras.main.centerX + this.scene.drawer.displayWidth / 2 - 40, this.scene.cameras.main.centerY - this.scene.drawer.displayHeight / 2 - 5);
      this.scene.drawer.setVisible(true);
      this.scene.exit.setVisible(true);
      this.scene.exit.setInteractive();
      this.scene.burn.setVisible(true);
      this.scene.burn.setInteractive();
      if (this.scene.keyObj.finished === false) {
        this.scene.keyObj.picture.setVisible(true);
        this.scene.keyObj.picture.setInteractive();
      }
      this.scene.inventory.forEach((element) => {
        if (element.name === 'key') {
          this.scene.keyObj.picture.setVisible(false);
        }
      });
    }
    // objectO.picture.removeInteractive();
    // objectO.picture.setInteractive();
    // this.scene.input.enableDebug(objectO.picture, 0x00ff00);
  }

  closeCloset(objectO) {
    if (objectO.picture.frame.name === 'closetOp2.png') {
      objectO.picture.setTexture('assets', 'closetOp1.png');
      this.scene.menuContainer.generalText('Hecho, lo he cerrado.');
      this.scene.time.delayedCall(500, () => { this.scene.menuContainer.menuTweenOut(); }, this);
    } else if (objectO.picture.frame.name === 'closetOp1.png') {
      objectO.picture.setTexture('assets', 'closet.png');
      this.scene.menuContainer.generalText('Hecho, lo he cerrado.');
      this.scene.time.delayedCall(500, () => { this.scene.menuContainer.menuTweenOut(); }, this);
    } else {
      this.scene.menuContainer.generalText('Ya está cerrado...');
    }
    // objectO.picture.removeInteractive();
    // objectO.picture.setInteractive();
  }

}