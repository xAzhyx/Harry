export default class ConnectionDB extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene);
    this.scene.add.existing(this);

    if (sessionStorage.getItem('userName') === null) {
      document.location.href = 'https://xazhyx.github.io/index.html';
    } else {
      this.userNameSession = sessionStorage.getItem('userName');
    }

    this.tuto = '';
    this.wEvent = '';
    this.prog = 0;
    this.gTimer = 0;
    this.objectsToPass = [];

    // const cookieString = document.cookie.split(';', document.cookie.length);
    // let typeOfGame = '';
    // for (let i = 0; i < cookieString.length; i += 1) {
    //   const ck = cookieString[i].split('=', cookieString[i].length);
    //   if (ck[0].trim() === 'typeOfGame') {
    //     typeOfGame = ck[1];
    //   }
    // }
    const dbName = 'harry';

    const connectionDB = indexedDB.open(dbName, 3);
    this.db = '';

    connectionDB.onerror = (event) => {
      alert(`Error:${event}`);
    };
    connectionDB.onupgradeneeded = (event) => {
      this.db = event.target.result;
    };
    connectionDB.onsuccess = (event) => {
      this.db = event.target.result;
      const transaction = this.db.transaction('objects');
      const request = transaction.objectStore('objects').openCursor();
      // let i = 0;
      request.onerror = () => {
        alert('Ha ocurrido un error. Por favor vuelva a loguearse.');
        document.location.href = 'https://xazhyx.github.io/';
      };
      this.loadGame(request);

      // this.loadGameState(request2);
    };
    // for (var i = 0; i < this.objectsToPass.length; i += 1) {
    //   console.log('-------------------');
    //   console.log(this.objectsToPass[i].name);
    //   console.log(this.objectsToPass[i].userName);
    //   console.log(this.objectsToPass[i].picture);
    //   console.log(this.objectsToPass[i].canTake);
    //   console.log('-------------------');
    // }
    // console.log(this.objectsToPass);
  }

  loadGame(request) {
    request.onsuccess = (event2) => {
      const cursor = event2.target.result;
      if (cursor) {
        if (cursor.value.userName === this.userNameSession) {
          const objectProperties = [];
          objectProperties.name = cursor.value.nameObject;
          objectProperties.userName = cursor.value.userName;
          objectProperties.picture = cursor.value.picture;
          objectProperties.information = cursor.value.information;
          objectProperties.objectOpenImg = cursor.value.objectOpenImg;
          objectProperties.objectClosedImg = cursor.value.objectClosedImg;
          objectProperties.displayWidth = cursor.value.displayWidth;
          objectProperties.displayHeight = cursor.value.displayHeight;

          if (cursor.value.canTake === 0) objectProperties.canTake = false;
          else objectProperties.canTake = true;

          if (cursor.value.canOpen === 0) objectProperties.canOpen = false;
          else objectProperties.canOpen = true;

          if (cursor.value.isLockedToOpen === 0) objectProperties.isLockedToOpen = false;
          else objectProperties.isLockedToOpen = true;

          if (cursor.value.isOpen === 0) objectProperties.isOpen = false;
          else objectProperties.isOpen = true;

          if (cursor.value.finished === 0) objectProperties.finished = false;
          else objectProperties.finished = true;

          if (cursor.value.fixed === 0) objectProperties.fixed = false;
          else objectProperties.fixed = true;

          if (cursor.value.isFull === 0) objectProperties.isFull = false;
          else objectProperties.isFull = true;

          if (cursor.value.isAcid === 0) objectProperties.isAcid = false;
          else objectProperties.isAcid = true;

          if (cursor.value.isInScene === 0) objectProperties.isInScene = false;
          else objectProperties.isInScene = true;

          if (cursor.value.isInInventory === 0) objectProperties.isInInventory = false;
          else objectProperties.isInInventory = true;

          this.objectsToPass.push(objectProperties);
        }
        cursor.continue();
      } else {
        const transaction2 = this.db.transaction('users');
        const request2 = transaction2.objectStore('users').openCursor();
        // let i = 0;
        request2.onerror = () => {
          alert('Error on user');
        };
        request2.onsuccess = (event3) => {
          this.loadGameState(request2, event3);
        };
        // console.log(document.cookie.length)
        // console.log(sessionStorage.getItem('userName'));
      }
    };
  }

  loadGameState(request, event) {
    const cursor = event.target.result;
    if (cursor) {
      if (cursor.value.userName === this.userNameSession) {
        if (cursor.value.tutorialFirstTime === 0) this.tuto = false;
        else this.tuto = true;
        if (cursor.value.windowEvent === 0) this.wEvent = false;
        else this.wEvent = true;
        this.prog = cursor.value.gameProgress;
        this.gTimer = cursor.value.gameTimer;
      }
      cursor.continue();
    } else {
      this.scene.dbCallback();
    }
  }

}
