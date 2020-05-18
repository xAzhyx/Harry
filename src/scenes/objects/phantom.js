import Conversation from '../gameConfig.json';

export default class Phantom extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);
    this.setDepth(5);
    this.linesControl = 0;
    this.textSumCloud = '';
    this.scene.stop = true;
    this.sounds = ['phan1', 'phan2', 'phan3', 'phan4'];
    this.soundsPos = 0;

    this.alpha = 0;
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 2000,
    }, this);
    this.phantomTween = this.scene.tweens.add({
      targets: this,
      y: this.y + 50,
      yoyo: true,
      repeat: -1,
      duration: 1500,
    }, this);
    this.talk = this.scene.anims.create({
      key: 'talk',
      frames: [{ key: 'assets', frame: 'phantom.png' }, { key: 'assets', frame: 'phantom3.png' }, { key: 'assets', frame: 'phantom.png' }],
      frameRate: 6,
      repeat: -1,
    });
    // Cloud for conversation
    this.cloud = this.scene.add.sprite(this.x - 250, this.y - 40, 'assets', 'cloud.png');
    this.cloud.setDepth(5);
    this.cloud.setScale(0.8);
    this.cloud.alpha = 0;

    this.cloudTween = this.scene.tweens.add({
      targets: this.cloud,
      alpha: 0.8,
      delay: 2000,
      duration: 1500,
      onStart: () => {
        this.cloudTween2 = this.scene.tweens.add({
          targets: this.cloud,
          scaleX: 0.82,
          scaleY: 0.82,
          // delay: 4000,
          repeatDelay: 2000,
          duration: 100,
          yoyo: true,
          repeat: -1,
        });
      },
    });


    // Text conversation
    this.txtConfig = this.scene.make.text({
      x: this.cloud.x,
      y: this.cloud.y - 20,
      text: '',
      origin: { x: 0.5, y: 0.5 },
      style: {
        font: 'bold 18px Arial',
        fill: 'black',
        align: 'center',
        wordWrap: { width: 180 },
      },
    });
    this.txtConfig.setDepth(5);
    this.txtConfig.alpha = 0;

    // this.scene.tweens.add({
    //   targets: this.txtConfig,
    //   alpha: 1,
    //   delay: 4000,
    //   duration: 2000,
    // });

    this.txtTween = this.scene.tweens.add({
      targets: this.txtConfig,
      scaleX: 1.03,
      scaleY: 1.03,
      delay: 2000,
      repeatDelay: 2000,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });

    this.scene.time.delayedCall(3000, () => {
      this.conversationSwitch();
    }, this);

    this.cloud.on('pointerdown', () => {
      this.cloud.disableInteractive();
      this.scene.tweens.add({
        targets: this.scene.intro.arrow,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.scene.intro.arrowTweens.forEach((element) => {
            element.stop();
          });
          this.scene.intro.circle.setAlpha(0);
          this.scene.intro.arrow.setAlpha(0);
        },
      });
      this.scene.tweens.add({
        targets: this.txtConfig,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.conversationSwitch();
        },
      });
    }, this);
  }

  conversationSwitch() {
    if (this.linesControl !== Conversation.phantomConversation.length) {
      // if (this.linesControl === Conversation.phantomConversation.length - 1) this.talk.repeat = 0;
      this.phantomSound = this.scene.sound.add(this.sounds[this.soundsPos], {
        volume: 0.7,
        loop: true,
      });
      this.phantomSound.play();
      this.soundsPos += 1;
      this.play('talk');
      this.talk.resume();
      this.txtConfig.setText('');
      this.txtConfig.setAlpha(0);
      this.textSumCloud = '';
      this.conver = Conversation.phantomConversation[this.linesControl];
      this.delayedCallTextCloud = [];
      this.txtConfig.setAlpha(1);
      // this.desapearTextCloud = 0;

      for (let i = 0; i < this.conver.length; i += 1) {
        this.delayedCallTextCloud[i] = this.scene.time.delayedCall(Conversation.textInfoVelocity * i, () => {
          if (i === this.conver.length - 1) {
            this.phantomSound.stop();
            this.talk.pause();
            if (this.linesControl === 1) {
              this.scene.intro.arrow.setPosition(this.scene.bag.x + 20 + this.scene.bag.width / 2, this.scene.bag.y + this.scene.bag.height / 2 + 40);
              this.scene.intro.arrow.setDepth(7);
              // this.scene.intro.circle.setPosition(this.scene.intro.arrow.x - this.scene.intro.arrow.width / 2, this.scene.intro.arrow.y - this.scene.intro.arrow.height / 2);
              this.scene.tweens.add({
                targets: this.scene.intro.arrow,
                alpha: 1,
                duration: 500,
                onComplete: () => {
                  this.scene.tweens.add({
                    targets: this.scene.intro.arrow,
                    alpha: 0,
                    duration: 500,
                    delay: 2000,
                    onComplete: () => {
                      this.scene.intro.arrow.setPosition(this.cloud.x + 20, this.cloud.y + 80);
                      this.scene.intro.circle.setPosition(this.scene.intro.arrow.x - this.scene.intro.arrow.width / 2, this.scene.intro.arrow.y - this.scene.intro.arrow.height / 2);
                      this.scene.intro.circle.setDepth(6);
                      this.scene.intro.arrowClick();
                      this.scene.tweens.add({
                        targets: this.scene.intro.arrow,
                        alpha: 1,
                        duration: 20,
                      });
                      // Only when the last char appears cloud become interactive.
                      this.cloud.setInteractive({
                        hitArea: new Phaser.Geom.Ellipse(this.cloud.x / 3, 135, this.cloud.width, 270),
                        hitAreaCallback: Phaser.Geom.Ellipse.Contains,
                        useHandCursor: true,
                      });
                    },
                  });
                },
              });

            } else {
              // Only when the last char appears cloud become interactive.
              this.cloud.setInteractive({
                hitArea: new Phaser.Geom.Ellipse(this.cloud.x / 3, 135, this.cloud.width, 270),
                hitAreaCallback: Phaser.Geom.Ellipse.Contains,
                useHandCursor: true,
              });
            }
          }
          this.textSumCloud += this.conver.substr(i, 1);
          this.txtConfig.setText(this.textSumCloud);
        }, this);
      }
      this.textSumCloud = '';
      this.linesControl += 1;
    } else {
      this.scene.tweens.add({
        targets: [this, this.cloud, this.txtConfig],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          this.cloudTween2.stop();
          this.txtTween.stop();
          this.phantomTween.stop();
          this.scene.stop = false;
          this.scene.stopMenu = false;
          this.scene.setObjectsInteractive();
          this.scene.phan = false;
          this.scene.gameTime.startContdown();
          this.scene.skip.setVisible(false);
        },
      });
    }
  }
}
