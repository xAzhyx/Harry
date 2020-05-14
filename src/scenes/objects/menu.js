import Phantom from './phantom';
import Conversation from '../gameConfig.json';
import ClosetFunctions from './closetFunctions';
import Use from './MenuFunctions/use';

export default class Menu extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.obj1FromInventory = false;
    this.dontSetInteractive = false;
    this.closetFunctions = new ClosetFunctions(this.scene);
    this.objUse2 = new Use(this.scene);
    const buttonsName = ['EXAMINAR', 'COGER', 'ABRIR', 'CERRAR', 'USAR'];
    this.objectO = 0;
    this.objectOTexts = 0;
    this.textSum = '';

    // CAMBIAR
    this.windowEvent = this.scene.con.wEvent;
    this.stay = false;
    this.arrayText = [];
    this.shadows = [];
    this.area = new Phaser.Geom.Rectangle(0, 0, this.scene.game.canvas.width, this.scene.game.canvas.height);
    // console.log(this.scene);


    this.on('pointerover', () => {
      if (this.stay === false) {
        this.menuTweenOut();
        this.disableInteractive();
      }
    }, this);
    this.setDepth(8);

    this.menu = this.scene.add.sprite(0, 0, 'assets', 'menu.png');
    this.menu.displayWidth = 230;
    this.menu.displayHeight = 280;
    this.menu.alpha = 0;
    this.menu.visible = false;
    this.add(this.menu);

    this.lookAt = this.scene.add.sprite(0, 0, 'assets', 'button.png');
    this.take = this.scene.add.sprite(0, 0, 'assets', 'button.png');
    this.openM = this.scene.add.sprite(0, 0, 'assets', 'button.png');
    this.closeM = this.scene.add.sprite(0, 0, 'assets', 'button.png');
    this.use = this.scene.add.sprite(0, 0, 'assets', 'button.png');
    this.actions = [this.lookAt, this.take, this.openM, this.closeM, this.use];

    for (let i = 0; i < 5; i += 1) {
      const shadow = this.scene.add.sprite(0, 0, 'assets', 'buttonShadow.png');
      shadow.visible = false;
      shadow.displayWidth = 190;
      shadow.displayHeight = 40;
      shadow.setOrigin(0.5, 0.5);
      shadow.alpha = 0;
      shadow.defaultScale = shadow.scale;
      this.add(shadow);
      this.shadows.push(shadow);
    }

    for (let a = 0; a < this.actions.length; a += 1) {
      this.actions[a].visible = false;
      this.actions[a].displayWidth = 190;
      this.actions[a].displayHeight = 40;
      this.actions[a].alpha = 0.7;
      this.actions[a].defaultScale = this.actions[a].scale;
      this.add(this.actions[a]);
    }

    for (let j = 0; j < buttonsName.length; j += 1) {
      const textButton = this.scene.add.text(0, 0, buttonsName[j], {
        fontStyle: 'bold',
        fontSize: '30px',
        fontFamily: 'Arial',
        color: 'black',
        align: 'center',
      }).setDepth(8).setVisible(false).setOrigin(0.5, 0.5);
      textButton.defaultScale = textButton.scale;
      this.arrayText.push(textButton);
    }

    // Text for info objects
    this.objectOTexts = this.scene.make.text({
      x: 90,
      y: 628,
      text: '',
      style: {
        fontStyle: 'bold',
        fontSize: '30px',
        fontFamily: 'Arial',
        color: 'brown',
        align: 'left',
        wordWrap: { width: 1100 },
      },
    });

    // SET INTERACTIVE ALL ELEMENTS OF CONTAINER
    this.each((element) => {
      element.setInteractive({ useHandCursor: true });
    });

    // Look at -> on pointerdown -----------------------
    this.lookAt.on('pointerdown', () => {
      this.buttonTween(this.lookAt);
      this.scene.stop = true;
      this.generalText(this.objectO.information);
    }, this);


    // Take -> on pointerdown -------------------------
    this.take.on('pointerdown', () => {
      this.buttonTween(this.take);
      this.scene.stop = true;
      if (this.objectO.canTake === true) {
        if (this.objectO.setImg === true) {
          this.objectO.picture.setTexture('assets', this.objectO.imgUsed);
        }
        this.generalText('Interesante, lo guardaré en el inventario.');
        // this.objectO.finished = true;
        this.objectO.canTake = false;
        if (this.objectO.name === 'utilBooks') {
          this.scene.arrayObjectsInteractive.forEach((element) => {
            if (element.name === 'book') {
              this.scene.inventory.push(element);
              element.isInInventory = true;
            }
          });
        } else {
          this.objectO.isInInventory = true;
          this.objectO.isInScene = false;
          this.objectO.picture.visible = false;
          this.scene.inventory.push(this.objectO);
        }
        this.menuTweenOut();
      } else {
        this.generalText('No puedo coger esto.');
      }
    }, this);

    // Open -> on pointerdown --------------------------
    this.openM.on('pointerdown', () => {
      this.buttonTween(this.openM);
      this.scene.stop = true;

      if (this.objectO.canOpen) {
        if (this.objectO.isLockedToOpen) {
          this.generalText('Mmmm parece que antes hay que hacer algo con esto.');
        } else if (this.objectO.name === 'closet') {
          this.closetFunctions.openCloset(this.objectO);
        } else if (this.objectO.name === 'book') {
          this.bookFunction();
        } else {
          if (this.objectO.name === 'door') {
            this.generalText('Lo has conseguido!! Por fin podemos irnos!!');
            this.openFinalDoor();
          } else {
            this.generalText('Hecho, lo he abierto.');
          }
          this.objectO.picture.setTexture('assets', this.objectO.objectOpenImg);
          this.menuTweenOut();
          this.objectO.isOpen = true;
          if (this.objectO.name === 'window' && this.windowEvent === true) {
            this.callPhantom();
          }
        }
      } else {
        this.generalText('Lo siento, este objeto no puede abrirse.');
      }
    }, this);

    // Close -> on pointerdown -----------------------------------
    this.closeM.on('pointerdown', () => {
      this.buttonTween(this.closeM);
      this.scene.stop = true;
      if (this.objectO.canOpen) {
        if (this.objectO.name === 'closet' && this.scene.drawer.visible === false) {
          this.closetFunctions.closeCloset(this.objectO);
        } else if (this.objectO.isOpen) {
          this.objectO.picture.setTexture('assets', this.objectO.objectClosedImg);
          this.objectO.isOpen = false;
          this.generalText('Hecho, lo he cerrado.');
          this.menuTweenOut();
        } else {
          this.generalText('Ya está cerrado...');
        }
      } else {
        this.generalText('Esto no se puede cerrar.');
      }
    }, this);

    // Use -> on pointerdown --------------------------------
    this.use.on('pointerdown', () => {
      this.buttonTween(this.use);
      this.scene.exitFunction();
      this.obj1FromInventory = false;
      if (this.objectO.name === 'laser') {
        this.objUse2.laserFunction();
      } else {
        this.scene.inventory.forEach((element) => {
          if (element.name === this.objectO.name) {
            this.obj1FromInventory = true;
          }
        });
        if (this.scene.inventory.length === 0) {
          this.scene.menuContainer.generalText('El inventario está vacío.');
        } else {
          if (this.obj1FromInventory === false) {
            this.scene.openInventory();
            this.scene.menuContainer.generalText('Selecciona algo del inventario.');
          } else {
            this.scene.menuContainer.generalText('Selecciona algo del inventario o del escenario.');
          }
          this.scene.stop = true;
          this.menuTweenOut();
          this.scene.objectToCompare = this.objectO;
          this.scene.using = true;
        }
      }

      // this.objUse2.ckeckIfComesFromInventory(this.objectO);
    }, this);

    // this.scene.input.keyboard.addKey('ESC').on('down', () => {

    // });
  }

  bookFunction() {
    this.menuTweenOut();
    this.scene.exitFunction();
    this.scene.stop = true;
    this.scene.openBook.setVisible(true);
    this.scene.code.setVisible(true);
    this.generalText('Ese código no parece formar parte del resto del contenido, debe servir para algo.');
    this.scene.menuContainer.dontSetInteractive = true;
    this.scene.disableObjectsInteractive();
    this.scene.exit.setPosition(this.scene.openBook.x + this.scene.openBook.width / 2 - 30, this.scene.openBook.y - this.scene.openBook.height / 2 + 50);
    this.scene.exit.setVisible(true);
    this.scene.exit.setInteractive();

  }

  callPhantom() {
    this.menuTweenOut();
    this.scene.harry.stopAnimation();
    this.scene.stopMenu = true;
    this.scene.phan = true;
    this.scene.time.delayedCall(2000, () => {
      const phantom = new Phantom(this.scene, 960, 200, 'assets', 'phantom.png');
      this.generalText('Un momento... algo raro está pasando!');
    }, this);
    this.windowEvent = false;
  }

  openFinalDoor() {
    
  }

  menuAppears(pointer, objectSelected) {
    let valorT = 0;
    let varY = -100;
    let pX = pointer.x;
    let pY = pointer.y;

    if (pointer.x < 150) {
      pX = 150;
    } else if (pointer.x > 1126) {
      pX = 1126;
    }
    if (pointer.y < 170) {
      pY = 170;
    } else if (pointer.y > 448) {
      pY = 448;
    }

    this.actions.forEach((element) => {
      element.setScale(element.defaultScale);
    });
    this.shadows.forEach((element) => {
      element.setScale(element.defaultScale);
    });
    this.arrayText.forEach((element) => {
      element.setScale(element.defaultScale);
    });

    if (this.scene.stopMenu === false && this.scene.phan === false) {
      this.objectO = objectSelected;
      if (this.dontSetInteractive === false) {
        this.scene.disableObjectsInteractive();
      }
      this.scene.stop = true;
      this.menu.visible = true;
      this.menu.x = pX;
      this.menu.y = pY;

      // Set Area Interactive container
      // this.area.setPosition(pointer.x - this.menu.displayWidth / 2 - 20, pointer.y - this.menu.displayHeight / 2 - 10);
      this.setInteractive({
        hitArea: this.area,
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true,
      });

      // this.scene.input.enableDebug(this, 0x00ff00);

      for (let j = 0; j < this.actions.length; j += 1) {
        this.arrayText[j].setVisible(true);
        this.arrayText[j].x = pX;
        this.arrayText[j].y = pY - 100 + valorT;
        this.arrayText[j].alpha = 0;
        valorT += 50;
        this.actions[j].number = j;
        this.actions[j].alpha = 0;
        this.actions[j].x = pX;
        this.actions[j].y = pY + varY;
        varY += 50;
        this.actions[j].visible = true;
      }

      varY = 0;
      for (let i = 0; i < 5; i += 1) {
        this.shadows[i].setVisible(true);
        this.shadows[i].x = pX + 5;
        this.shadows[i].y = pY - 105 + varY;
        this.shadows[i].alpha = 0;
        varY += 50;
      }

      this.scene.tweens.add({
        targets: [this.menu, ...this.actions, ...this.arrayText, ...this.shadows],
        alpha: 1,
        duration: 300,
      });
      this.scaleMenu();
    }
  }

  scaleMenu() {
    this.scaleArray = [];
    this.scaleArray[0] = this.scene.tweens.add({
      targets: [...this.actions, ...this.shadows],
      scaleX: 0.80,
      scaleY: 0.80,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      duration: 200,
    });
    this.scaleArray[1] = this.scene.tweens.add({
      targets: this.arrayText,
      scaleX: 1.05,
      scaleY: 1.05,
      ease: 'linear',
      yoyo: true,
      duration: 200,
    });
    this.scaleArray[2] = this.scene.tweens.add({
      targets: this.menu,
      scaleX: 1.5,
      scaleY: 1.1,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      duration: 200,
    });
  }

  menuTweenOut() {
    // this.disableInteractive();
    this.scaleMenu();

    this.menuDisappear = this.scene.tweens.add({
      targets: [this.menu, ...this.actions, ...this.arrayText, ...this.shadows],
      alpha: 0,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 300,
      onComplete: () => {
        if (this.dontSetInteractive === false) {
          this.scene.setObjectsInteractive();
          this.scene.stop = false;
        }
      },
    });
  }

  buttonTween(currentButton) {
    this.actions.forEach((element) => {
      element.disableInteractive();
    });
    this.butTween = [];
    this.butTween[0] = this.scene.tweens.add({
      targets: currentButton,
      scaleX: 0.70,
      scaleY: 0.70,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      duration: 100,
    });
    this.butTween[1] = this.scene.tweens.add({
      targets: this.arrayText[currentButton.number],
      scaleX: 0.92,
      scaleY: 0.92,
      ease: 'linear',
      yoyo: true,
      duration: 100,
    });
    this.butTween[2] = this.scene.tweens.add({
      targets: this.shadows[currentButton.number],
      scaleX: 0.70,
      scaleY: 0.70,
      x: this.shadows[currentButton.number].x - 5,
      y: this.shadows[currentButton.number].y + 5,
      ease: 'linear',
      onComplete: () => {
        this.scene.time.delayedCall(50, () => {
          this.actions.forEach((element) => {
            element.setInteractive();
          });
        }, this);
      },
      yoyo: true,
      duration: 100,
    });
  }

  generalText(textObject) {
    if (this.delayedCallText) {
      this.delayedCallText.forEach((element) => {
        element.remove();
      });
    }
    if (this.desapearText) {
      // this.desapearText.paused = true;
      this.desapearText.remove();
    }

    this.objectOTexts.setAlpha(0);
    this.textSum = '';
    this.objectOTexts.text = '';
    this.delayedCallText = [];
    this.desapearText = 0;

    this.objectOTexts.alpha = 1;
    for (let i = 0; i < textObject.length; i += 1) {
      this.delayedCallText[i] = this.scene.time.delayedCall(Conversation.textInfoVelocity * i, () => {
        this.textSum += textObject.substr(i, 1);
        this.objectOTexts.text = this.textSum;
      }, this);
    }
    this.textSum = '';
    this.desapearText = this.scene.time.delayedCall(Conversation.textInfoVelocity * textObject.length + 2500, () => { this.objectOTextsDisap(); }, this);
  }

  objectOTextsDisap() {
    this.scene.tweens.add({
      targets: this.objectOTexts,
      alpha: 0,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 400,
    });
  }
}
