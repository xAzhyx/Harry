export default class Harry extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);

    // this.displayWidth = 250;
    // this.displayHeight = 400;
    this.setScale(1.3);
    this.setOrigin(0.5, 1);
    this.setDepth(2);
    let dis = 0;
    this.harryFrames = this.scene.anims.generateFrameNames('assets', {
      start: 0,
      end: 7,
      zeroPad: 1,
      prefix: 'harry',
      suffix: '.png',
    });

    // ----------------------------------Movement--------------------------------------
    this.scene.input.on('pointerdown', (pointer) => {
      if (!this.scene.finalEvent) {
        if (this.walkTween != null) {
          this.stopAnimation();
        }

        if (this.scene.bagIsOpen === false && this.scene.stop === false) {
          if (pointer.y > 450 && pointer.y < 600 && pointer.x > 100 && pointer.x < 1110) {
            if (pointer.x > this.x) {
              this.setFlipX(false);
            } else {
              this.setFlipX(true);
            }
            dis = Phaser.Math.Distance.Between(this.x, this.y, pointer.x, pointer.y);
            this.time = (3000 * dis) / 1100;

            // Animation
            this.harrysWalk(pointer.x, pointer.y, this.time);
            this.play('walk');
          } else if (this.walkTween != null) {
            this.stopAnimation();
          }
        }
      } else {
        this.setFlipX(false);
      }
    }, this);
  }

  stopAnimation() {
    if (this.walkTween) {
      this.setTexture('assets', 'harry.png');
      this.anims.stop();
      this.walkTween.stop();
    }
  }

  // Harrys Walk Function --------------------------------------------
  harrysWalk(pointerX, pointerY, time) {
    this.scene.anims.create({
      key: 'walk',
      frames: this.harryFrames,
      // [{ key: 'harryR' }, { key: 'harryRM1' }, { key: 'harryRM2' }, { key: 'harryRM3' }, { key: 'harryRM4' }, { key: 'harryRM5' }, { key: 'harryRM4' }, { key: 'harryRM3' }, { key: 'harryRM6' }, { key: 'harryRM7' }, { key: 'harryRM6' }, { key: 'harryR' }],
      frameRate: 16,
      repeat: -1,
    });
    this.walkTween = this.scene.tweens.add({
      targets: this,
      x: pointerX,
      y: pointerY,
      onComplete: () => {
        this.anims.stop();
        this.setTexture('assets', 'harry.png');
        if (this.scene.finalEvent === true) {
          this.setVisible(false);
          this.scene.finalEvent = false;
        }
      },
      duration: time,
    });
  }
}
