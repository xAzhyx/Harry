import Introduction from '../gameConfig.json';

export default class Intro extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);

    this.setDepth(5);
    this.scene.stop = true;
    this.linesIntroControl = 0;
    this.txtSumIntro = '';
    this.counterConver = 0;
    this.finalPage = false;
    this.pageCount = 0;
    this.pages = [];

    // -------------------------------Sprites------------------------
    for (let i = 0; i < Introduction.intro0.length; i += 1) {
      this.pages[i] = this.scene.add.sprite(this.scene.cameras.main.centerX + 29, this.y - this.height / 2, 'assets2', 'page.png');
      this.pages[i].setOrigin(0, 0);
      this.pages[i].setAlpha(0);
    }

    this.tutoSprite = this.scene.add.sprite(this.scene.cameras.main.centerX + this.width / 4 + 10, this.scene.cameras.main.centerY + 50, 'assets', 'tuto/tuto0.png');
    this.tutoSprite.setDepth(5);
    this.tutoSprite.setScale(0.7);
    this.tutoSprite.setAlpha(0);

    this.arrow = this.scene.add.sprite(this.scene.cameras.main.centerX + this.width / 4 + 30, this.scene.cameras.main.centerY + 100, 'assets', 'arrow.png');
    this.arrow.alpha = 0;
    this.arrow.setDepth(6);
    this.arrow.setRotation(-0.55);
    
    this.circle = this.scene.add.sprite(this.arrow.x - this.arrow.width / 2, this.arrow.y - this.arrow.height / 2, 'assets', 'circle.png');
    this.circle.setDepth(5);
    this.circle.alpha = 0;
    this.circle.setScale(0);
    
    this.info = this.scene.add.sprite(this.scene.cameras.main.centerX + this.width / 4 + 10, this.scene.cameras.main.centerY + 50, 'assets', 'Information/info0.png');
    this.info.setDepth(5);
    this.info.setScale(0.7);
    this.info.setAlpha(0);
    
    
    // -------------------------Text---------------------------------
    this.txtIntro = this.scene.make.text({
      x: this.scene.cameras.main.centerX + 60,
      y: 140,
      text: '',
      origin: { x: 0, y: 0 },
      style: {
        font: 'bold 24px Arial',
        fill: 'black',
        align: 'left',
        wordWrap: { width: 240 },
      },
    });
    this.txtIntro.setDepth(5);
    this.txtIntro.alpha = 0;

    // ---------------------------Frames-------------------------------
    this.introFrames = this.scene.anims.generateFrameNames('assets2', {
      start: 0,
      end: 15,
      zeroPad: 0,
      prefix: 'bookIntro',
      suffix: '.png',
    });

    this.tutoFrames = this.scene.anims.generateFrameNames('assets', {
      start: 0,
      end: 13,
      zeroPad: 0,
      prefix: 'tuto/tuto',
      suffix: '.png',
    });

    this.infoFrames = this.scene.anims.generateFrameNames('assets', {
      start: 0,
      end: 8,
      zeroPad: 0,
      prefix: 'Information/info',
      suffix: '.png',
    });

    // --------------------------Anims--------------------------------
    this.scene.anims.create({
      key: 'intro',
      frames: this.introFrames,
      duration: 800,
    });

    this.scene.anims.create({
      key: 'tuto',
      frames: this.tutoFrames,
      // frameRate: 7,
      duration: 1800,
      repeat: -1,
      repeatDelay: 1000,
    });

    this.scene.anims.create({
      key: 'info',
      frames: this.infoFrames,
      // frameRate: 7,
      duration: 1800,
      repeat: -1,
      repeatDelay: 1000,
    });

    // ------------------DelayedCalls------------------
    this.scene.time.delayedCall(3800, () => {
      this.pages[0].setAlpha(1);
    }, this);

    this.scene.time.delayedCall(3000, () => {
      this.play('intro');
    }, this);

    this.scene.time.delayedCall(4000, () => {
      this.introFunction();
    }, this);


    // -------------------Pointers --------------------
    this.on('pointerdown', () => {
      this.disableInteractive();
      this.scene.tweens.add({
        targets: [this.circle, this.arrow],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if (this.arrowTweens) {
            this.arrowTweens.forEach((element) => {
              element.stop();
            });
          }
        },
      });
      if (this.finalPage === false) {
        this.nextPage();
      } else {
        this.scene.tweens.add({
          targets: [this.txtIntro, ...this.pages],
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.txtIntro.setText('');
            this.anims.playReverse('intro');
            this.scene.tweens.add({
              targets: this,
              alpha: 0,
              duration: 1000,
              delay: 1000,
            });
            this.scene.stop = false;
            this.scene.stopMenu = false;
            this.scene.setObjectsInteractive();
          },
        });
      }
    }, this);

    this.tutoSprite.on('pointerdown', () => {
      this.tutoSprite.disableInteractive();
      this.nextPage();
      this.objectDisappear(this.tutoSprite);
    }, this);

    this.info.on('pointerdown', () => {
      this.info.disableInteractive();
      this.nextPage();
      this.objectDisappear(this.info);
    }, this);
  }

  // -------------------Functions-------------------------
  objectDisappear(objectO) {
    this.scene.tweens.add({
      targets: objectO,
      alpha: 0,
      duration: 200,
      delay: 200,
    });
  }

  arrowClick() {
    this.arrowTweens = [];
    this.arrowTweens[0] = this.scene.tweens.add({
      targets: this.arrow,
      alpha: 1,
      delay: 50,
      duration: 200,
      onComplete: () => {
        this.arrowTweens[1] = this.scene.tweens.add({
          targets: this.arrow,
          x: this.arrow.x - 5,
          y: this.arrow.y - 5,
          duration: 200,
          repeat: -1,
          repeatDelay: 1000,
          yoyo: true,
        });
        this.arrowTweens[2] = this.scene.tweens.add({
          targets: this.circle,
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          duration: 200,
          repeat: -1,
          repeatDelay: 1200,
        });
      },
    });
  }

  nextPage() {
    if (this.linesIntroControl > 2) {
      this.scene.tweens.add({
        targets: this.txtIntro,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          this.txtIntro.setText('');
          this.txtSumIntro = '';
          this.pageFunctions();
        },
      });
    } else {
      this.introFunction();
    }
  }

  pageFunctions() {
    this.pages[this.pageCount].setAlpha(1);
    this.scene.tweens.add({
      targets: this.pages[this.pageCount],
      scaleX: 0,
      duration: 600,
    });
    this.scene.tweens.add({
      targets: this.pages[this.pageCount],
      scaleX: 1.05,
      x: this.x + 25 - this.pages[this.pageCount].width,
      duration: 600,
      delay: 600,
      onComplete: () => {
        this.introFunction();
      },
    });
    this.pageCount += 1;
  }

  tutoAndInfoFunction(objectO, animName) {
    this.scene.tweens.add({
      targets: objectO,
      alpha: 1,
      duration: 200,
      delay: 200,
    });
    objectO.play(animName);
  }

  // ----------------More Important Function -------------------------------
  introFunction() {
    if (this.linesIntroControl !== Introduction.intro0.length) {
      this.introExplication = Introduction.intro0[this.linesIntroControl];
      this.delayedCallTextIntro = [];
      this.txtIntro.setAlpha(1);
      for (let i = 0; i < this.introExplication.length; i += 1) {
        this.delayedCallTextIntro[i] = this.scene.time.delayedCall(Introduction.textInfoVelocity * i, () => {
          this.txtSumIntro += this.introExplication.substr(i, 1);
          this.txtIntro.setText(this.txtSumIntro);
        }, this);
      }
      switch (this.linesIntroControl) {
        case 0:
        case 1:
        case 2:
          // Only when the last char appears cloud become interactive.
          this.scene.time.delayedCall(Introduction.textInfoVelocity * this.introExplication.length, () => {
            this.arrowClick();
            this.setInteractive({
              hitArea: new Phaser.Geom.Ellipse(this.circle.x - this.width / 2, this.circle.y - this.arrow.height + 20, 100, 100),
              hitAreaCallback: Phaser.Geom.Ellipse.Contains,
              useHandCursor: true,
            });
            // this.scene.input.enableDebug(this, 0x00ff00);
          }, this);
          break;
        case 3:
          this.tutoAndInfoFunction(this.tutoSprite, 'tuto');
          this.scene.time.delayedCall(Introduction.textInfoVelocity * this.introExplication.length, () => {
            this.tutoSprite.setInteractive({ useHandCursor: true });
          }, this);
          break;
        case 4:
          this.tutoAndInfoFunction(this.info, 'info');
          this.scene.time.delayedCall(Introduction.textInfoVelocity * this.introExplication.length, () => {
            this.info.setInteractive({ useHandCursor: true });
          }, this);
          break;
        case 5:
          this.scene.time.delayedCall(Introduction.textInfoVelocity * this.introExplication.length + 500, () => {
            this.finalPage = true;
            this.arrowClick();
            this.setInteractive({
              hitArea: new Phaser.Geom.Ellipse(this.circle.x - this.width / 2, this.circle.y - this.arrow.height + 20, 100, 100),
              hitAreaCallback: Phaser.Geom.Ellipse.Contains,
              useHandCursor: true,
            });
          }, this);
          break;
        default:
          break;
      }

      this.linesIntroControl += 1;
    }
  }
}
