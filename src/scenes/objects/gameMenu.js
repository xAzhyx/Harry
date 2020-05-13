export default class GameMenuClass extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.shadows = [];
    this.setDepth(8);

    // console.log('gameMenu');
    this.gameMenu = this.scene.add.sprite(980, 160, 'assets', 'menu.png');
    this.gameMenu.displayWidth = 180;
    this.gameMenu.displayHeight = 220;
    this.gameMenu.alpha = 0;
    this.gameMenu.visible = false;
    this.add(this.gameMenu);

    this.newGame = this.scene.add.sprite(0, 0, 'assets', 'newGame.png');
    this.load = this.scene.add.sprite(0, 0, 'assets', 'load.png');
    this.save = this.scene.add.sprite(0, 0, 'assets', 'save.png');
    this.exitGame = this.scene.add.sprite(0, 0, 'assets', 'exitGame.png');
    this.options = [this.newGame, this.load, this.save, this.exitGame];

    for (let i = 0; i < 4; i += 1) {
      const shadow = this.scene.add.sprite(0, 0, 'assets', 'buttonGameMenuShadow.png');
      shadow.visible = false;
      shadow.displayWidth = 140;
      shadow.displayHeight = 45;
      shadow.setOrigin(0.5, 0.5);
      shadow.alpha = 0;
      shadow.defaultScale = shadow.scale;
      this.add(shadow);
      this.shadows.push(shadow);
    }

    for (let a = 0; a < this.options.length; a += 1) {
      this.options[a].visible = false;
      this.options[a].displayWidth = 140;
      this.options[a].displayHeight = 45;
      this.options[a].alpha = 0.7;
      this.options[a].defaultScale = this.options[a].scale;
      this.add(this.options[a]);
    }

    // SET INTERACTIVE ALL ELEMENTS OF CONTAINER
    this.each((element) => {
      element.setInteractive({ useHandCursor: true });
    });
    // console.log(this);
    this.scene.input.enableDebug(this, 0x00ff00);


    this.newGame.on('pointerdown', () => {
      this.buttonGameTween(this.newGame);
      this.scene.stop = true;
      const objectsArray = [
        { nameObject: 'door', userName: this.scene.con.userNameSession, picture: 'doorLock.png', information: 'La salida. Hay que deshacerse de ese candado de alguna forma.', canTake: 0, canOpen: 1, isLockedToOpen: 1, isOpen: 0, objectOpenImg: 'doorOpen.png', objectClosedImg: 'doorUnlock.png', finished: 0, displayWidth: 85, displayHeight: 400, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'utilBooks', userName: this.scene.con.userNameSession, picture: 'books.png', information: 'Parecen libros de ciencia muy complejos. Uno de ellos tiene menos polvo que el resto, parece que se ha movido hace poco...', canTake: 1, canOpen: 0, isLockedToOpen: 0, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 70, displayHeight: 60, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'book', userName: this.scene.con.userNameSession, picture: 'book.png', information: 'Tiene un pequeño candado, debe de estar ocultando algo importante...', canTake: 1, canOpen: 1, isLockedToOpen: 1, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 70, displayHeight: 60, fixed: 0, isFull: 0, isAcid: 0, isInScene: 0, isInInventory: 0 },
        { nameObject: 'brokenCable', userName: this.scene.con.userNameSession, picture: 'cableBrk.png', information: 'Un cable roto. Si lo arreglara igual podría usarlo para algo.', canTake: 1, canOpen: 0, isLockedToOpen: 1, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 70, displayHeight: 50, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'glass', userName: this.scene.con.userNameSession, picture: 'glass.png', information: 'Parece un vaso especial para mezclar o tratar líquidos.', canTake: 1, canOpen: 0, isLockedToOpen: 1, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 50, displayHeight: 70, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'osc', userName: this.scene.con.userNameSession, picture: 'osc.png', information: 'Parece un osciloscopio mejorado con mas funcionalidades. Quizás pueda arreglar algo con él.', canTake: 0, canOpen: 0, isLockedToOpen: 0, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 100, displayHeight: 100, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'apparat', userName: this.scene.con.userNameSession, picture: 'apparatBrk.png', information: 'No se para que sirve este aparato pero tiene una etiqueta que pone "Inserte el líquido que desea transformar".', canTake: 0, canOpen: 1, isLockedToOpen: 0, isOpen: 0, objectOpenImg: 'apparatBrkOp.png', objectClosedImg: 'apparatBrk.png', finished: 0, displayWidth: 100, displayHeight: 100, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'key', userName: this.scene.con.userNameSession, picture: 'key.png', information: 'Una pequeña llave.', canTake: 1, canOpen: 0, isLockedToOpen: 0, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 80, displayHeight: 100, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
        { nameObject: 'laser', userName: this.scene.con.userNameSession, picture: 'laserRed.png', information: 'Sistema láser que impide que nadie se acerque a la puerta pero puedo ver que tiene un robusto candado.', canTake: 0, canOpen: 0, isLockedToOpen: 0, isOpen: 0, objectOpenImg: '', objectClosedImg: '', finished: 0, displayWidth: 145, displayHeight: 500, fixed: 0, isFull: 0, isAcid: 0, isInScene: 1, isInInventory: 0 },
      ];
      const arrayNewGameState = [0, 0, 0];
      this.saveGameState(arrayNewGameState);
      this.deleteDBObjects(objectsArray);
    }, this);

    this.load.on('pointerdown', () => {
      this.buttonGameTween(this.load);
      this.scene.stop = true;
      this.resetGame();
    }, this);

    this.save.on('pointerdown', () => {
      this.buttonGameTween(this.save);
      this.scene.stop = true;
      const arrayGameState = [this.scene.tutorialFirstTime, this.scene.menuContainer.windowEvent, this.scene.gameProgress];
      const arraySavedGameState = [];
      arrayGameState.forEach((element) => {
        if (element === false) arraySavedGameState.push(0);
        else if (element === true) arraySavedGameState.push(1);
        else arraySavedGameState.push(element);
      });
      console.log(arraySavedGameState)
      const arraySavedObjects = this.setArraySavedObjects();
      this.saveGameState(arraySavedGameState);
      this.deleteDBObjects(arraySavedObjects);
    }, this);

    this.exitGame.on('pointerdown', () => {
      this.buttonGameTween(this.exitGame);
      this.scene.stop = true;
      window.location.href = 'http://localhost:3000/loginRegister.html';

    }, this);
  }

  setArraySavedObjects() {
    let obj = {};
    const arraySavedObjects = [];
    function trueOrFalse(val) {
      let valueRet = 0;
      if (val === false) valueRet = 0;
      else valueRet = 1;
      return valueRet;
    }
    for (let i = 0; i < this.scene.arrayObjectsToSave.length; i += 1) {
      // console.log();
      obj = {
        nameObject: this.scene.arrayObjectsToSave[i].name,
        userName: this.scene.con.userNameSession,
        picture: this.scene.arrayObjectsToSave[i].picture.frame.name,
        information: this.scene.arrayObjectsToSave[i].information,
        canTake: trueOrFalse(this.scene.arrayObjectsToSave[i].canTake),
        canOpen: trueOrFalse(this.scene.arrayObjectsToSave[i].canOpen),
        isLockedToOpen: trueOrFalse(this.scene.arrayObjectsToSave[i].isLockedToOpen),
        isOpen: trueOrFalse(this.scene.arrayObjectsToSave[i].isOpen),
        objectOpenImg: this.scene.arrayObjectsToSave[i].objectOpenImg,
        objectClosedImg: this.scene.arrayObjectsToSave[i].objectClosedImg,
        finished: trueOrFalse(this.scene.arrayObjectsToSave[i].finished),
        displayWidth: this.scene.arrayObjectsToSave[i].picture.displayWidth,
        displayHeight: this.scene.arrayObjectsToSave[i].picture.displayHeight,
        fixed: trueOrFalse(this.scene.arrayObjectsToSave[i].fixed),
        isFull: trueOrFalse(this.scene.arrayObjectsToSave[i].isFull),
        isAcid: trueOrFalse(this.scene.arrayObjectsToSave[i].isAcid),
        isInScene: trueOrFalse(this.scene.arrayObjectsToSave[i].isInScene),
        isInInventory: trueOrFalse(this.scene.arrayObjectsToSave[i].isInInventory),
      };
      // console.log('isInScene = ' + this.scene.arrayObjectsToSave[i].isInScene)
      // console.log('isInInventory = '+ this.scene.arrayObjectsToSave[i].isInInventory)
      arraySavedObjects.push(obj);
    }
    // console.log(arraySavedObjects)
    return arraySavedObjects;
  }

  resetGame() {
    this.scene.registry.destroy(); // destroy registry
    this.scene.events.off(); // disable all active events
    this.scene.scene.restart(); // restart current scene
  }

  deleteDBObjects(objectsArray) {
    const transaction = this.scene.con.db.transaction(['objects'], 'readwrite');
    const objStore = transaction.objectStore('objects');
    objStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.userName === this.scene.con.userNameSession) {
          const request = cursor.delete();
          request.onsuccess = () => {
            console.log('Deleted')
          };
        }
        cursor.continue();
      } else {
        this.fillObjects(this.scene.con.db, objectsArray);
      }
    };
  }

  fillObjects(db, objectsArray) {
    const transaction = db.transaction(['objects'], 'readwrite');
    const objStore = transaction.objectStore('objects');
    for (var i in objectsArray) {
      objStore.put(objectsArray[i]);
    }
    this.resetGame();
  }

  saveGameState(obj) {
    const transaction = this.scene.con.db.transaction(['users'], 'readwrite');
    const objStore = transaction.objectStore('users');
    objStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.userName === this.scene.con.userNameSession) {
          const updateData = cursor.value;
          updateData.tutorialFirstTime = obj[0];
          updateData.windowEvent = obj[1];
          updateData.gameProgress = obj[2];
          const request = cursor.update(updateData);
        }
        cursor.continue();
      }
    };
  }

  // setGameState() {
  //   // const obj = [this.scene.tutorialFirstTime, this.scene.windowEvent, this.scene.gameProgress];
  //   const transaction2 = this.scene.con.db.transaction(['users'], 'readwrite');
  //   const objStore2 = transaction2.objectStore('userss');
  //   objStore2.openCursor().onsuccess = (event) => {
  //     const cursor = event.target.result;
  //     if (cursor) {
  //       if (cursor.value.userName === this.scene.con.userNameSession) {
  //         this.scene.tutorialFirstTime = cursor.value.tutorialFirstTime;
  //         this.scene.menuContainer.windowEvent = cursor.value.windowEvent;
  //         this.scene.gameProgress = cursor.value.gameProgress;
  //       }
  //       cursor.continue();
  //     }
  //   };
  // }

  gameMenuAppears() {
    let varY = -75;
    this.scene.stop = true;
    this.gameMenu.visible = true;

    for (let j = 0; j < this.options.length; j += 1) {
      this.options[j].number = j;
      this.options[j].alpha = 0;
      this.options[j].x = this.gameMenu.x;
      this.options[j].y = this.gameMenu.y + varY;
      varY += 50;
      this.options[j].visible = true;
    }

    varY = 0;
    for (let i = 0; i < 4; i += 1) {
      this.shadows[i].setVisible(true);
      this.shadows[i].x = this.options[i].x + 5;
      this.shadows[i].y = this.options[i].y - 5;
      this.shadows[i].alpha = 0;
    }

    this.scene.tweens.add({
      targets: [this.gameMenu, ...this.options, ...this.shadows],
      alpha: 1,
      duration: 300,
    });
    this.scaleGameMenu();
  }


  scaleGameMenu() {
    this.scaleArray = [];
    this.scaleArray[0] = this.scene.tweens.add({
      targets: [...this.options, ...this.shadows],
      scaleX: 0.90,
      scaleY: 0.94,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      duration: 200,
    });
    this.scaleArray[1] = this.scene.tweens.add({
      targets: this.menu,
      scaleX: 1.15,
      scaleY: 0.90,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      duration: 200,
    });
  }

  gameMenuTweenOut() {
    // this.disableInteractive();
    this.scaleGameMenu();

    this.menuDisappear = this.scene.tweens.add({
      targets: [this.gameMenu, ...this.options, ...this.shadows],
      alpha: 0,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 300,
      onComplete: () => {
        this.scene.stop = false;
      },
    });
  }

  buttonGameTween(currentButton) {
    this.options.forEach((element) => {
      element.disableInteractive();
    });
    this.butTween = [];
    this.butTween[0] = this.scene.tweens.add({
      targets: currentButton,
      scaleX: 0.80,
      scaleY: 0.84,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      duration: 100,
    });

    this.butTween[1] = this.scene.tweens.add({
      targets: this.shadows[currentButton.number],
      scaleX: 0.80,
      scaleY: 0.84,
      x: this.shadows[currentButton.number].x - 5,
      y: this.shadows[currentButton.number].y + 5,
      ease: 'linear',
      onComplete: () => {
        this.scene.time.delayedCall(50, () => {
          this.options.forEach((element) => {
            element.setInteractive();
          });
        }, this);
      },
      yoyo: true,
      duration: 100,
    });

  }
}