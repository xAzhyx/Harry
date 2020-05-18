export default class GameTime extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene);
    this.scene.add.existing(this);
    this.timerTittle = this.scene.make.text({
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

    this.timeText = this.scene.make.text({
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

    this.finalBg = this.scene.add.sprite(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, 'assets', 'finalBg.png');
    this.finalBg.displayHeight = 300;
    this.finalBg.setDepth(7);
    this.finalBg.setVisible(false);
    this.finalBg.setOrigin(0.5);

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
    if (this.scene.initialTime === 0 || this.scene.finalEvent === true) {
      this.scene.exitFunction();
      this.scene.stop = true;
      this.scene.menuContainer.dontSetInteractive = true;
      this.scene.menuContainer.menuTweenOut();
      this.scene.disableObjectsInteractive();
      this.timerTittle.setVisible(false);
      this.finalBg.setVisible(true);
      this.scene.tweens.add({
        targets: this.finalBg,
        scaleX: 1,
        scaleY: 0.8,
        duration: 300,
        yoyo: true,
        hold: 300,
        repeat: -1,
      });
      this.timeText.setPosition(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY);
      this.timeText.setDepth(9);
      this.finalTextSum = '';
      this.timeForNext = 0;
      if (this.scene.initialTime === 0) {
        this.scene.sound.play('timeOver');
        const textToShow = ['Vaya!', '\nNo lo has conseguido...', '\n\nCrees que podrás...', ' al menos...', 'Cazar esta \nmaldita mosca?'];
        this.textFunction(textToShow);
      } else {
        const textToShow = ['Felicidades!', '\nHas conseguido salir!', '\n\nVete preparándote para...', '', 'Tu próxima\naventura!'];
        this.scene.sound.play('congrats');
        this.textFunction(textToShow);
      }
    } else {
      this.scene.initialTime -= 1; // One second
      if (this.scene.initialTime < 30 && this.scene.initialTime > 0) {
        if (this.scene.initialTime === 29) this.scene.sound.play('hurryUp');
        this.scene.tweens.add({
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
      this.timeText.setText(this.formatTime(this.scene.initialTime));
    }
  }
  
  textFunction(textToShow) {
    this.textCharByChar(textToShow[0], this.timeText);
    for (let i = 1; i < textToShow.length; i += 1) {
      switch (i) {
        case 0: this.timeForNext = 0;
          break;
        case 1: this.timeForNext += textToShow[i - 1].length * 80 + 500;
          break;
        case 2: this.timeForNext += textToShow[i - 1].length * 80 + 700;
          break;
        default: this.timeForNext += textToShow[i - 1].length * 80 + 800;
          break;
      }
      this.scene.time.delayedCall(this.timeForNext, () => {
        if (i === textToShow.length - 1) {
          this.timeText.setAlpha(0);
          this.finalTextSum = '';
          this.textCharByChar(textToShow[i], this.timeText);
          this.scene.tweens.add({
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
  }

  startContdown() {
    this.timeText.setText(this.formatTime(this.scene.initialTime));
    this.gameTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });
  }

  textCharByChar(textToShow, timeText) {
    for (let i = 0; i < textToShow.length; i += 1) {
      this.scene.time.delayedCall(80 * i, () => {
        this.finalTextSum += textToShow.substr(i, 1);
        timeText.setText(this.finalTextSum);
      }, this);
    }
  }
}
