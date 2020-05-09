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
    }, this);

    this.load.on('pointerdown', () => {
      this.buttonGameTween(this.load);
      this.scene.stop = true;
    }, this);

    this.save.on('pointerdown', () => {
      this.buttonGameTween(this.save);
      this.scene.stop = true;
    }, this);

    this.exitGame.on('pointerdown', () => {
      this.buttonGameTween(this.exitGame);
      this.scene.stop = true;
    }, this);
  }

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