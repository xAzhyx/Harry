import Intro from './objects/intro';
import Harry from './objects/harry';
import Menu from './objects/menu';
import Use from './objects/MenuFunctions/use';
import Code from './gameConfig.json';
import GameMenuClass from './objects/gameMenu';
import ConnectionDB from './connection';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  dbCallback() {
    // - First time => Create db
    // - Register => Take userName && pass
    //             -> Ask security question && Security answer
    //             -> Save in users profile
    //             -> Create new objects profile with userName
    //             -> Reload page
    // - Login => Search userName
    // (game user profile) in objects table ->
    //                       => New Game => Drop objects profile where this userName
    //                                   -> Fill new objects profile with userName with default values
    //                                   -> Start session with userName
    //                       => Load Game => Start session with userName
    //                                     -> Go to game
    //                                     --------------------------------
    //                                     -> Take userName from session
    //                                     -> Take data objects userName profile from DB and load game profile or new profile
    // - Save game => Search userName profile of gameobjects
    //             -> Modify objects profile with current values
    // - Load game => Reload game
    // - New game => Search userName profile of gameobjects
    //            -> Modify objects profile with default values
    //            -> Reliad game page

    // Marco
    const border = this.add.graphics();
    border.lineStyle(4, 0x960000, 1);
    border.fillStyle(0x960000, 0.8);
    border.fillRect(0, 0, 1280, 720);
    border.fillStyle(0x000000, 1);
    border.fillRoundedRect(25, 25, 1228, 570, 15);
    border.fillRoundedRect(25, 620, 1228, 80, 15);

    // Background
    const background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 52, 'room');
    background.displayWidth = 1223;
    background.displayHeight = 562;

    // OBJECTS CLASES
    this.harry = new Harry(this, 300, 500, 'assets', 'harry.png');
    this.menuContainer = new Menu(this, 0, 0);
    this.objUse = new Use(this);
    this.gameMenu = new GameMenuClass(this, 0, 0);
    // this.initialTime = 0;
    this.initialTime = this.con.gTimer;

    // this.input.mouse.disableContextMenu();
    // Timer
    this.timerTittle = this.make.text({
      x: 320,
      y: 60,
      text: 'Tiempo restante:',
      style: {
        fontStyle: 'bold',
        fontSize: '30px',
        fontFamily: 'Arial',
        color: 'black',
        align: 'center',
        wordWrap: { width: 1100 },
      },
    });
    this.timerTittle.setOrigin(0.5);
    this.timerTittle.setDepth(2);

    this.timeText = this.make.text({
      x: 320,
      y: 90,
      // text: this.formatTime(this.initialTime),
      text: '',
      style: {
        fontStyle: 'bold',
        fontSize: '30px',
        fontFamily: 'Arial',
        color: 'black',
        align: 'center',
        wordWrap: { width: 1100 },
      },
    });
    this.timeText.setOrigin(0.5);
    this.timeText.setDepth(2);

    this.looseBG = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'ctaBG');
    this.looseBG.displayHeight = 500;
    this.looseBG.setDepth(7);
    this.looseBG.setVisible(false);
    this.looseBG.setOrigin(0.5);


    // Var for cancel things
    this.stop = false;
    this.stopMenu = false;
    this.phan = false;
    this.using = false;
    this.objectToCompare = 0;
    this.gameProgress = this.con.prog;
    // console.log(this.gameProgress);
    let gameMenuOpen = false;

    // CAMBIAR
    this.tutorialFirstTime = this.con.tuto;
    if (this.tutorialFirstTime === false) {
      this.startContdown();
    }
    // this.tutorialFirstTime = false;

    // Inventory
    this.inventory = [];

    // Drawer objects
    this.drawerObjects = [];

    // Array laser buttons
    this.laserKeys = [];

    // Array of code numbers for the laser device.
    this.codeArray = [];

    // console.log(this);

    // Progress bar

    const barBg = this.add.sprite(this.cameras.main.centerX + 35, 65, 'assets', 'gameMenuBg.png');
    barBg.displayHeight = 60;

    const bar = this.add.sprite(this.cameras.main.centerX, 65, 'assets', 'bar.png');
    barBg.displayWidth = bar.displayWidth + 100;
    bar.setDepth(2);
    this.progressBar = this.add.sprite(this.cameras.main.centerX - bar.width / 2 + 2, 65, 'assets', 'progressBar.png');
    this.progressBar.setOrigin(0, 0.5);
    // console.log(this.progressBar.displayWidth);
    this.progressFunction();

    // Game Menu
    const openGameMenu = this.add.sprite(this.cameras.main.centerX + bar.displayWidth / 2 + 50, 65, 'assets', 'openGameMenu.png');
    openGameMenu.setInteractive({ useHandCursor: true });
    openGameMenu.on('pointerdown', () => {
      if (gameMenuOpen === false) {
        this.gameMenu.gameMenuAppears();
        gameMenuOpen = true;
      } else {
        this.gameMenu.gameMenuTweenOut();
        gameMenuOpen = false;
      }
    }, this);

    // --------------------------- Set objects with load profile --------------------------------------

    console.log(this.scale.width)
    const door = this.setObjectFunction('door');
    door.picture.setPosition(this.scale.width - 55, 348);
    door.picture.setOrigin(1, 0.5);
    door.picture.setDepth(2);

    // Books
    const utilBooks = this.setObjectFunction('utilBooks');
    utilBooks.picture.setPosition(327, 145);
    utilBooks.setImg = true;
    utilBooks.imgUsed = 'booksTaken.png';

    const notUtilBooks = {
      picture: this.add.sprite(500, 140, 'assets', 'books2.png'),
      name: 'nonUtilsBooks',
      information: 'Libros de literatura, ahora mismo no me interesan.',
      canTake: false,
      canOpen: false,
      isLockedToOpen: true,
      isOpen: false,
      objectOpenImg: '',
      objectClosedImg: '',
      setImg: false,
      imgUsed: '',
      finished: false,
    };
    notUtilBooks.picture.displayWidth = 120;
    notUtilBooks.picture.displayHeight = 70;

    // The taken book
    const book = this.setObjectFunction('book');
    book.inventoryDisplayW = 55;
    book.inventoryDisplayH = 75;
    // book.picture.visible = false;

    // Table
    this.table = {
      picture: this.add.sprite(600, 347, 'assets', 'table.png'),
      information: 'Una mesa llena de objetos útiles.',
      canTake: false,
      canOpen: false,
      isLockedToOpen: true,
    };
    this.table.picture.displayWidth = 500;
    this.table.picture.displayHeight = 170;
    this.table.picture.setOrigin(0.5, 0);

    // Cable
    const brokenCable = this.setObjectFunction('brokenCable');
    brokenCable.picture.setPosition(500, 370);
    brokenCable.angle = 30;
    brokenCable.inventoryDisplayW = 60;
    brokenCable.inventoryDisplayH = 40;

    // Glass
    const glass = this.setObjectFunction('glass');
    glass.picture.setPosition(438, 335);
    glass.inventoryDisplayW = 40;
    glass.inventoryDisplayH = 60;


    // Window
    const window = {
      picture: this.add.sprite(930, 100, 'assets', 'window.png'),
      name: 'window',
      information: 'Una ventana que da al exterior. Está lloviendo bastante fuera.',
      canTake: false,
      canOpen: true,
      isOpen: false,
      objectOpenImg: 'windowOpen.png',
      objectClosedImg: 'window.png',
      isLockedToOpen: false,
      setImg: false,
      finished: false,
    };
    window.picture.setDepth(1);
    window.picture.setOrigin(0.5, 0);
    window.picture.displayWidth = 180;
    window.picture.displayHeight = 200;

    // osc
    const osc = this.setObjectFunction('osc');
    osc.picture.setOrigin(0, 0);
    osc.picture.setPosition(550, 280);

    // apparat
    const apparat = this.setObjectFunction('apparat');
    apparat.picture.setOrigin(0, 0);
    apparat.picture.setPosition(660, 280);

    // closet
    const closet = {
      picture: this.add.sprite(190, 205, 'assets', 'closet.png'),
      name: 'closet',
      information: 'Un armario bastante grande.',
      canTake: false,
      canOpen: true,
      objectOpenImg: 'closetOp1.png',
      objectClosedImg: 'closet.png',
      isLockedToOpen: false,
      setImg: true,
      imgUsed: 'closetOp2.png',
      finished: false,
    };
    closet.picture.setOrigin(0.5, 0);

    // Inventory bag
    this.bag = this.add.sprite(60, 50, 'assets', 'bag.png');
    this.bag.setOrigin(0, 0);
    this.bag.setFlipX(true);
    this.bag.displayWidth = 100;
    this.bag.displayHeight = 100;
    this.bag.setInteractive({ useHandCursor: true });
    this.bag.on('pointerdown', () => {
      if (this.phan === false) {
        this.openInventory();
      }
    }, this);

    this.inventoryBag = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'assets', 'menu.png');
    this.inventoryBag.displayWidth = 300;
    this.inventoryBag.displayHeight = 500;
    this.inventoryBag.setDepth(2);
    this.inventoryBag.visible = false;

    this.inventoryBag.setInteractive();

    // Check if bag is open
    this.bagIsOpen = false;

    this.exit = this.add.sprite(this.cameras.main.centerX + this.inventoryBag.displayWidth / 2 - 40, this.cameras.main.centerY - this.inventoryBag.displayHeight / 2 + 40, 'assets', 'exitX.png');
    this.exit.displayWidth = 35;
    this.exit.displayHeight = 30;
    this.exit.setDepth(7);
    this.exit.visible = false;
    this.exit.setInteractive();

    // Key
    this.keyObj = this.setObjectFunction('key');
    this.keyObj.picture.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    this.keyObj.picture.setDepth(4);
    this.keyObj.picture.setVisible(false);
    this.keyObj.inventoryDisplayW = 40;
    this.keyObj.inventoryDisplayH = 60;

    this.drawer = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'assets', 'drawer.png');
    this.drawer.setOrigin(0.5);
    this.drawer.displayWidth = 700;
    this.drawer.displayHeight = 550;
    this.drawer.setDepth(3);
    this.drawer.setVisible(false);

    this.paper = this.add.sprite(this.drawer.x, this.drawer.y + 50, 'assets', 'paper.png');
    this.paper.firstTime = true;
    this.paper.setScale(1.8);
    this.paper.setDepth(4);
    this.paper.setVisible(false);
    this.paper.on('pointerdown', () => {
      if (this.paper.firstTime === true) {
        this.tweens.add({
          targets: this.paper,
          x: this.paper.x - 120,
          y: this.paper.y + 10,
          duration: 300,
        });
        this.paper.firstTime = false;
      }
      this.menuContainer.generalText('Papeles en blanco.');
    });

    this.burn = this.add.sprite(this.drawer.x + 100, this.drawer.y - 60, 'assets', 'closedBurn.png');
    this.burn.displayWidth = 190;
    this.burn.displayHeight = 90;
    this.burn.setRotation(0.5);
    this.burn.setDepth(3);
    this.burn.setVisible(false);
    this.burn.on('pointerdown', () => {
      this.burn.setTexture('assets', 'burn.png');
      this.menuContainer.generalText('Soy un poco patoso. Prefiero no tocar eso por si acaso...');
    });

    this.wallet = this.add.sprite(this.drawer.x - 100, this.drawer.y - 60, 'assets', 'wallet.png');
    this.wallet.displayWidth = 160;
    this.wallet.displayHeight = 140;
    this.wallet.setRotation(-0.5);
    this.wallet.setDepth(3);
    this.wallet.setVisible(false);
    this.wallet.on('pointerdown', () => {
      this.wallet.setTexture('assets', 'walletOut.png');
      this.menuContainer.generalText('No quiero quitarle el dinero a nadie...');
    });

    this.drawerObjects.push(this.burn, this.wallet, this.paper);

    this.openBook = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'assets2', 'openBook.png');
    this.openBook.setDepth(6);
    this.openBook.setVisible(false);
    this.code = this.make.text({
      x: this.openBook.x + 50,
      y: this.openBook.y - 150,
      text: Code.deviceCode,
      style: {
        fontStyle: 'bold',
        fontSize: '25px',
        fontFamily: 'Arial',
        color: 'black',
        align: 'center',
        wordWrap: { width: 1500 },
      },
    });

    this.code.setDepth(7);
    this.code.setAngle(-40);
    this.code.setVisible(false);

    const fly = this.add.sprite(800, 180, 'assets', 'fly0.png');
    fly.displayWidth = 60;
    fly.displayHeight = 40;
    fly.angle = -30;
    fly.setDepth(7);
    this.flyStop = 0;
    this.flyingFunction(fly);
    fly.setInteractive().on('pointerover', () => {
      let goRandomX = 0;
      let goRandomY = 0;
      const randomScapeXmin = Phaser.Math.Between(-30, -50);
      const randomScapeXmax = Phaser.Math.Between(30, 50);
      const randomMinMaxX = Phaser.Math.Between(0, 1);
      if (randomMinMaxX === 0) goRandomX = randomScapeXmin;
      else goRandomX = randomScapeXmax;
      const randomScapeYmin = Phaser.Math.Between(-30, -50);
      const randomScapeYmax = Phaser.Math.Between(30, 50);
      const randomMinMaxY = Phaser.Math.Between(0, 1);
      if (randomMinMaxY === 0) goRandomY = randomScapeYmin;
      else goRandomY = randomScapeYmax;
      this.flyStop.stop();
      fly.disableInteractive();
      this.tweens.add({
        targets: fly,
        x: fly.x + goRandomX,
        y: fly.y + goRandomY,
        duration: 80,
        ease: 'Sine.easeOut',
        onComplete: () => {
          fly.setInteractive();
          this.flyingFunction(fly);
        },
      });
    }, this);

    const flyAnimAssets = this.anims.generateFrameNames('assets', {
      start: 0,
      end: 2,
      zeroPad: 1,
      prefix: 'fly',
      suffix: '.png',
    });

    this.anims.create({
      key: 'fly',
      frames: flyAnimAssets,
      frameRate: 28,
      repeat: -1,
    });
    fly.play('fly');

    this.tweens.add({
      targets: fly,
      angle: 1,
      duration: 20,
      yoyo: true,
      repeat: -1,
    });


    this.laser = this.setObjectFunction('laser');
    this.laser.picture.setPosition(this.scale.width - 30, 40);
    this.laser.picture.setDepth(2);
    this.laser.picture.setOrigin(1, 0);
    // this.laser.picture.setVisible(false);


    this.laserDevice = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'assets', 'laserDevice.png');
    this.laserDevice.displayWidth = 300;
    this.laserDevice.displayHeight = 500;
    this.laserDevice.setDepth(5);
    this.laserDevice.setVisible(false);

    let xDis = 0;
    let yDis = 0;
    let i = 1;
    // let numToString = '';

    const laserKey0 = this.add.sprite(this.cameras.main.centerX, this.laserDevice.y + 130, 'assets', 'Numbers/0.png');
    laserKey0.displayWidth = 70;
    laserKey0.displayHeight = 60;
    laserKey0.setDepth(5);
    laserKey0.setVisible(0);
    laserKey0.setInteractive({ useHandCursor: true });
    this.laserKeys[0] = laserKey0;

    const resetKey = this.add.sprite(laserKey0.x - 80, this.laserDevice.y + 130, 'assets', 'reset.png');
    resetKey.displayWidth = 70;
    resetKey.displayHeight = 60;
    resetKey.setDepth(5);
    resetKey.setVisible(0);
    resetKey.setInteractive({ useHandCursor: true });
    this.laserKeys[10] = resetKey;

    const enterKey = this.add.sprite(laserKey0.x + 80, this.laserDevice.y + 130, 'assets', 'enter.png');
    enterKey.displayWidth = 70;
    enterKey.displayHeight = 60;
    enterKey.setDepth(5);
    enterKey.setVisible(0);
    enterKey.setInteractive({ useHandCursor: true });
    this.laserKeys[11] = enterKey;

    for (let m = 0; m < 3; m += 1) {
      for (let n = 0; n < 3; n += 1) {
        if (i < 10) {
          const laserKey = this.add.sprite(this.laserDevice.x + 35 - this.laserDevice.width / 2 + xDis, this.laserDevice.y - 70 + yDis, 'assets', `Numbers/${i}.png`);
          laserKey.displayWidth = 70;
          laserKey.displayHeight = 60;
          laserKey.setDepth(5);
          laserKey.setVisible(false);
          this.laserKeys[i] = laserKey;
        }
        i += 1;
        xDis += 80;
      }
      xDis = 0;
      yDis += 66;
    }
    this.codeDevice = this.make.text({
      x: this.laserDevice.x + 110,
      y: this.cameras.main.centerY - 240,
      text: '',
      style: {
        fontStyle: 'bold',
        fontSize: '50px',
        fontFamily: 'Arial',
        color: 'black',
        align: 'center',
        wordWrap: { width: 1500 },
      },
    });
    this.codeDevice.setVisible(false);
    for (let h = 0; h < 10; h += 1) {
      this.laserKeys[h].on('pointerdown', () => {
        if (this.codeArray.length < 5) {
          this.codeDevice.x -= 40;
          this.codeArray.push(`${h}`);
          this.codeDevice.setAngle(0);
          this.codeDevice.setText(this.codeArray.join(' '));
          this.codeDevice.setDepth(6);
          this.codeDevice.setVisible(true);
        }
      }, this);
    }
    this.laserKeys[10].on('pointerdown', () => {
      this.resetFunction();
    }, this);
    this.laserKeys[11].on('pointerdown', () => {
      this.enterFunction();
    }, this);


    this.arrayObjectsInteractive = [door, utilBooks, notUtilBooks, book, closet, brokenCable, glass, window, osc, apparat, this.keyObj, this.laser];
    this.arrayObjectsToSave = [door, utilBooks, book, brokenCable, glass, osc, apparat, this.keyObj, this.laser];
    this.setObjectsInteractive();

    this.arrayObjectsInteractive.forEach((element) => {
      element.picture.on('pointerdown', (pointer) => {
        // console.log(this.using);
        if (this.inventoryBag.visible === true) {
          element.picture.displayWidth = element.inventoryDisplayW + 30;
          element.picture.displayHeight = element.inventoryDisplayH + 30;
        }
        if (this.using === false) {
          this.menuContainer.menuAppears(pointer, element);
        } else {
          this.objUse.usingFunction(this.objectToCompare, element);
          this.using = false;
        }
      }, this);
    });
    this.input.keyboard.addKey('i').on('down', () => {
      this.openInventory();
    });

    this.input.keyboard.addKey('ESC').on('down', () => {
      this.menuContainer.menuTweenOut();
      this.menuContainer.dontSetInteractive = false;
      if (this.drawer) {
        this.drawer.setVisible(false);
      }
      this.exitFunction();
      this.stop = false;
    });

    this.exit.on('pointerdown', () => {
      this.exitFunction();
      // this.setObjectsInteractive();
      this.stop = false;
      this.menuContainer.dontSetInteractive = false;
    }, this);

    this.table.picture.on('pointerdown', (pointer) => {
      this.menuContainer.menuAppears(pointer, this.table);
    }, this);
    this.algo = new Phaser.Geom.Rectangle(0, 0, 500, 90);


    if (this.tutorialFirstTime === true) {
      this.disableObjectsInteractive();
      // this.time.delayedCall(1000, () => {
      this.intro = new Intro(this, this.cameras.main.centerX, this.cameras.main.centerY - 50, 'assets2', 'bookIntro0.png');
      // }, this);
      this.tutorialFirstTime = false;

      this.time.delayedCall(5000, () => {
        this.skip = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + this.intro.height / 2 + 50, 'assets', 'skip.png');
        this.skip.setDepth(5);
        this.skip.setInteractive({ useHandCursor: true });

        this.skip.on('pointerdown', () => {
          this.menuContainer.windowEvent = false;
          const arrayGameState = [this.tutorialFirstTime, this.menuContainer.windowEvent, this.gameProgress, this.initialTime];
          const arraySavedGameState = [];
          arrayGameState.forEach((element) => {
            if (element === false) arraySavedGameState.push(0);
            else if (element === true) arraySavedGameState.push(1);
            else arraySavedGameState.push(element);
          });
          // console.log(arraySavedGameState)
          this.gameMenu.saveGameState(arraySavedGameState);
          this.gameMenu.resetGame();
        });
      });
    }
  }

  create() {
    this.con = new ConnectionDB(this);

    this.text = '';
    // Datos x, y, buttons
    this.text = this.add.text(35, 35, '', { fill: '#00ff00' }).setDepth(1);
  }

  setObjectFunction(nameObject) {
    let obj = {};
    for (let j = 0; j < this.con.objectsToPass.length; j += 1) {
      if (this.con.objectsToPass[j].userName === this.con.userNameSession && this.con.objectsToPass[j].name === nameObject) {
        // console.log(this.con.objectsToPass[j]);
        obj = {
          name: nameObject,
          picture: this.add.sprite(0, 0, 'assets', this.con.objectsToPass[j].picture),
          information: this.con.objectsToPass[j].information,
          canTake: this.con.objectsToPass[j].canTake,
          canOpen: this.con.objectsToPass[j].canOpen,
          isLockedToOpen: this.con.objectsToPass[j].isLockedToOpen,
          isOpen: this.con.objectsToPass[j].isOpen,
          objectOpenImg: this.con.objectsToPass[j].objectOpenImg,
          objectClosedImg: this.con.objectsToPass[j].objectClosedImg,
          finished: this.con.objectsToPass[j].finished,
          displayWidth: this.con.objectsToPass[j].displayWidth,
          displayHeight: this.con.objectsToPass[j].displayHeight,
          fixed: this.con.objectsToPass[j].fixed,
          isFull: this.con.objectsToPass[j].isFull,
          isAcid: this.con.objectsToPass[j].isAcid,
          isInScene: this.con.objectsToPass[j].isInScene,
          isInInventory: this.con.objectsToPass[j].isInInventory,
        };
        if (this.con.objectsToPass[j].isInScene === false) obj.picture.setVisible(false);
        if (this.con.objectsToPass[j].isInInventory === true) this.inventory.push(obj);
        obj.picture.displayWidth = this.con.objectsToPass[j].displayWidth;
        obj.picture.displayHeight = this.con.objectsToPass[j].displayHeight;
      }
    }
    return obj;
  }

  setObjectsInteractive() {
    this.bag.setInteractive();
    this.table.picture.setInteractive(this.algo, Phaser.Geom.Rectangle.Contains);
    this.arrayObjectsInteractive.forEach((element) => {
      element.picture.setInteractive();
      element.picture.input.hitArea.setTo(0, 0, element.picture.width, element.picture.height);
      // this.input.enableDebug(element.picture, 0x00ff00);
    });
  }

  disableObjectsInteractive() {
    // Disable objects interactive
    this.bag.disableInteractive();
    this.arrayObjectsInteractive.forEach((element) => {
      element.picture.disableInteractive();
    });
    this.table.picture.disableInteractive();
  }

  openInventory() {
    this.disableObjectsInteractive();
    this.exit.setPosition(this.cameras.main.centerX + this.inventoryBag.displayWidth / 2 - 40, this.cameras.main.centerY - this.inventoryBag.displayHeight / 2 + 40);
    this.exit.setInteractive();

    this.exit.setAlpha(0);
    this.exit.visible = true;
    this.inventoryBag.setAlpha(0);
    this.inventoryBag.visible = true;
    this.exit.displayWidth = 35;
    this.exit.displayHeight = 30;
    this.inventoryBag.displayWidth = 300;
    this.inventoryBag.displayHeight = 500;
    this.inventoryTweens = [];

    this.inventoryTweens[0] = this.tweens.add({
      targets: [this.inventoryBag, this.exit],
      alpha: 1,
      duration: 200,
    });
    this.inventoryTweens[1] = this.tweens.add({
      targets: this.inventoryBag,
      scaleX: 2,
      scaleY: 2,
      duration: 100,
      yoyo: true,
    });
    this.inventoryTweens[2] = this.tweens.add({
      targets: this.exit,
      scaleX: 0.55,
      scaleY: 0.55,
      duration: 100,
      yoyo: true,
    });

    this.bagIsOpen = true;
    let k = 0;
    let posColumn = 0;
    let posRow = 0;
    for (let m = 0; m < 4; m += 1) {
      for (let n = 0; n < 2; n += 1) {
        if (k < this.inventory.length) {
          this.inventory[k].picture.setInteractive();
          this.inventory[k].picture.x = this.cameras.main.centerX - this.inventoryBag.displayWidth / 3 + 40 + posColumn;
          this.inventory[k].picture.y = this.cameras.main.centerY - this.inventoryBag.displayHeight / 3 + 40 + posRow;
          this.inventory[k].picture.displayWidth = this.inventory[k].inventoryDisplayW * 1.3;
          this.inventory[k].picture.displayHeight = this.inventory[k].inventoryDisplayH * 1.3;
          this.inventory[k].picture.visible = true;
          this.inventory[k].scaleObject = {
            x: this.inventory[k].picture.scaleX,
            y: this.inventory[k].picture.scaleY,
          };
          // console.log(this.inventory[k]);
          this.inventory[k].picture.setDepth(3);
        }
        k += 1;
        posColumn += 120;
      }
      posColumn = 0;
      posRow += 130;
    }
    this.tweenIn = 0;
    this.inventory.forEach((element) => {
      this.menuContainer.dontSetInteractive = true;

      element.picture.on('pointerover', () => {
        element.picture.setScale(element.scaleObject.x, element.scaleObject.y);
        this.scaleElement = {
          x: element.picture.scaleX,
          y: element.picture.scaleY,
        };

        this.tweenIn = this.tweens.add({
          targets: element.picture,
          scaleX: element.picture.scaleX * 1.6,
          scaleY: element.picture.scaleY * 1.6,
          duration: 100,
        });
        // element.picture.displayWidth = element.inventoryDisplayW + 50;
        // element.picture.displayHeight = element.inventoryDisplayH + 50;
      }, this);
      element.picture.on('pointerout', () => {
        this.tweenOut = this.tweens.add({
          targets: element.picture,
          scaleX: this.scaleElement.x,
          scaleY: this.scaleElement.y,
          duration: 100,
          // element.picture.displayWidth = element.inventoryDisplayW;
          // element.picture.displayHeight = element.inventoryDisplayH;
        });
      }, this);
    });
  }

  progressFunction() {
    switch (this.gameProgress) {
      case 0: this.progressBar.displayWidth = 0;
        break;
      case 1: this.progressBar.displayWidth = 40.57;
        break;
      case 2: this.progressBar.displayWidth = 81.14;
        break;
      case 3: this.progressBar.displayWidth = 121.71;
        this.progressBar.setPosition(this.progressBar.x - 1, this.progressBar.y);
        break;
      case 4: this.progressBar.displayWidth = 162.28;
        break;
      case 5: this.progressBar.displayWidth = 202.85;
        this.progressBar.setPosition(this.progressBar.x - 1, this.progressBar.y);
        break;
      case 6: this.progressBar.displayWidth = 243.42;
        this.progressBar.setPosition(this.progressBar.x - 1, this.progressBar.y);
        break;
      case 7: this.progressBar.displayWidth = 283.99;
        break;
      default: this.progressBar.displayWidth = 0;
        break;
    }
  }

  enterFunction() {
    const codNum = Number(this.codeArray.join(''));
    if (codNum === Code.deviceCode) {
      this.menuContainer.generalText('Correcto');
      this.gameProgress += 1;
      this.progressFunction();
      let timeCall = 1000;
      for (let i = 0; i < 5; i += 1) {
        let typeLaser = '';
        if (Phaser.Math.IsEven(i) === true) {
          typeLaser = 'laserGreen.png';
        } else {
          typeLaser = 'laserRed.png';
        }
        // eslint-disable-next-line no-loop-func
        this.time.delayedCall(timeCall, () => {
          this.laser.picture.setTexture('assets', typeLaser);
        }, this);
        timeCall += 800;
      }

      this.time.delayedCall(5000, () => {
        this.exitFunction();
        this.laser.picture.setTexture('assets', 'laser.png');
        this.laser.finished = true;
        // this.setObjectsInteractive();
      }, this);
    } else {
      this.laserKeys.forEach((element) => {
        element.disableInteractive();
      });
      this.menuContainer.generalText('Mal');
      this.add.tween({
        targets: this.codeDevice,
        alpha: 0,
        duration: 200,
        yoyo: true,
        repeatDelay: 200,
        repeat: 2,
        onComplete: () => {
          this.add.tween({
            targets: this.codeDevice,
            alpha: 0,
            duration: 200,
            onComplete: () => {
              this.codeDevice.setAlpha(1);
              this.resetFunction();
              this.laserKeys.forEach((element) => {
                element.setInteractive(true);
              });
            },
          });
        },
      });
    }
  }

  resetFunction() {
    this.codeArray.length = 0;
    this.codeDevice.setText('');
    this.codeDevice.x = this.laserDevice.x + 110;
  }

  flyingFunction(fly) {
    const randomFly = {
      x: Phaser.Math.Between(100, 1000),
      y: Phaser.Math.Between(20, 600),
    };
    const dis = Phaser.Math.Distance.Between(fly.x, fly.y, randomFly.x, randomFly.y);
    const flyVelocity = dis / 0.15;
    this.flyStop = this.tweens.add({
      targets: fly,
      x: { value: randomFly.x, ease: 'Back.easeOut', duration: flyVelocity },
      y: randomFly.y,
      delay: 300,
      duration: flyVelocity * 1.1,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.flyingFunction(fly);
      },
    });
  }

  exitFunction() {
    // eslint-disable-next-line no-plusplus
    for (let m = 0; m < this.inventory.length; m += 1) {
      this.inventory[m].picture.visible = false;
    }
    for (let m = 0; m < this.drawerObjects.length; m += 1) {
      this.drawerObjects[m].setVisible(false);
      this.drawerObjects[m].disableInteractive();
    }
    this.laserKeys.forEach((element) => {
      element.setVisible(false);
    });
    this.resetFunction();
    this.codeDevice.setVisible(false);
    this.setObjectsInteractive();
    this.keyObj.picture.setVisible(false);
    this.drawer.setVisible(false);
    this.openBook.setVisible(false);
    this.code.setVisible(false);
    this.laserDevice.setVisible(false);
    this.bagIsOpen = false;
    this.stop = false;
    this.stopMenu = false;
    this.inventoryBag.setActive(false).setVisible(false);
    // this.bag.setInteractive();
    this.exit.disableInteractive().setVisible(false);
  }

  formatTime(seconds) {
    // Minutes
    const minutes = Phaser.Math.FloorTo(seconds / 60);
    // var minutes = Math.floor(seconds / 60);
    // Seconds
    let partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
  }

  onEvent() {
    if (this.initialTime === 0) {
      this.exitFunction();
      this.stop = true;
      this.menuContainer.dontSetInteractive = true;
      this.menuContainer.menuTweenOut();
      this.disableObjectsInteractive();
      this.timerTittle.setVisible(false);
      this.looseBG.setVisible(true);
      this.timeText.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
      this.timeText.setDepth(9);
      this.finalTextSum = '';
      let timeForNext = 0;
      const textToShow = ['Vaya!', '\nNo lo has conseguido...', '\n\nCrees que podrás...', ' al menos...', 'Cazar esta \nmaldita mosca?'];
      this.textCharByChar(textToShow[0], this.timeText);
      for (let i = 1; i < textToShow.length; i += 1) {
        switch (i) {
          case 0: timeForNext = 0;
            break;
          case 1: timeForNext += textToShow[i - 1].length * 80 + 500;
            break;
          case 2: timeForNext += textToShow[i - 1].length * 80 + 700;
            break;
          default: timeForNext += textToShow[i - 1].length * 80 + 900;
            break;
        }
        this.time.delayedCall(timeForNext, () => {
          if (i === textToShow.length - 1) {
            this.timeText.setAlpha(0);
            this.finalTextSum = '';
            this.textCharByChar(textToShow[i], this.timeText);
            this.tweens.add({
              targets: this.timeText,
              alpha: { value: 1, duration: 200, yoyo: false },
              scaleX: { from: 1.3, to: 2 },
              scaleY: { from: 1.3, to: 2 },
              yoyo: true,
              hold: textToShow[i].length * 80,
              duration: 800,
            });
          } else {
            this.textCharByChar(textToShow[i], this.timeText);
          }
        }, this);
      }

      this.gameTimer.remove();
    } else {
      this.initialTime -= 1; // One second
      if (this.initialTime < 30 && this.initialTime > 0) {
        this.tweens.add({
          targets: this.timeText,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 200,
          ease: 'Cubic.easeInOut',
          yoyo: true,
          onStart: () => {
            this.timeText.setColor('red');
          },
          onComplete: () => {
            this.timeText.setColor('black');
          },
        });
      }
      this.timeText.setText(this.formatTime(this.initialTime));
    }
  }

  startContdown() {
    this.timeText.setText(this.formatTime(this.initialTime));
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });

  }

  textCharByChar(textToShow, timeText) {
    for (let i = 0; i < textToShow.length; i += 1) {
      this.time.delayedCall(80 * i, () => {
        this.finalTextSum += textToShow.substr(i, 1);
        timeText.setText(this.finalTextSum);
      }, this);
    }
  }

  update() {
    const pointer = this.input.activePointer;

    this.text.setText([
      `x: ${pointer.worldX}`,
      `y: ${pointer.worldY}`,
      `isDown: ${pointer.isDown}`,
      `rightButtonDown: ${pointer.rightButtonDown()}`]);
  }
}

export default GameScene;
