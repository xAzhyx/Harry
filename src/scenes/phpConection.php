<?php
  //Create table
  $sql = "CREATE TABLE IF NOT EXISTS objects (
    picture VARCHAR(30) NOT NULL,
    nameObject VARCHAR(30) NOT NULL PRIMARY KEY,
    infomation VARCHAR(1000) NOT NULL,
    canTake BOOLEAN,
    canOpen BOOLEAN,
    isLockedToOpen BOOLEAN,
    isOpen BOOLEAN,
    objectOpenImg VARCHAR(30),
    objectClosedImg VARCHAR(30),
    finished BOOLEAN, 
    displayWidth int,
    displayHeight int,
    fixed BOOLEAN,
    isFull BOOLEAN,
    isAcid BOOLEAN,
    isInScene BOOLEAN,
    isInInventory BOOLEAN
  )";
  $res = $mysqli->query($sql);
  if($res){
    echo "Table created\n";
  }else{
    echo "Error\n";
  }

  // Fill table
  $sql = "INSERT INTO objects VALUES (
    'doorLock.png',
    'door',
    'La salida. Hay que deshacerse de ese candado de alguna forma.',
    0,
    1,
    1,
    0,
    'doorOpen.png',
    'doorUnlock.png',
    0,
    85,
    400,
    0,
    0,
    0,
    1,
    0
  )";
      $res = $mysqli->query($sql);
      if($res){
        echo "OK\n";
      }else{
        echo "Error\n";
      }
  $sql = "INSERT INTO objects VALUES (
    'books.png',
    'utilBooks',
    'Parecen libros de ciencia muy complejos. Uno de ellos tiene menos polvo que el resto, parece que se ha movido hace poco...',
    1,
    0,
    0,
    0,
    '',
    '',
    0,
    70,
    60,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
  $sql = "INSERT INTO objects VALUES (
    'book.png',
    'book',
    'Tiene un pequeño candado, debe de estar ocultando algo importante...',
    0,
    1,
    1,
    0,
    'openBook.png',
    'book.png',
    1,
    55,
    75,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
  $sql = "INSERT INTO objects VALUES (
    'cableBrk.png',
    'brokenCable',
    'Un cable roto. Si lo arreglara igual podría usarlo para algo.',
    1,
    0,
    1,
    0,
    '',
    '',
    0,
    60,
    40,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
  $sql = "INSERT INTO objects VALUES (
    'glass.png',
    'glass',
    'Parece un vaso especial para mezclar o tratar líquidos.',
    1,
    0,
    1,
    0,
    '',
    '',
    0,
    50,
    70,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
  $sql = "INSERT INTO objects VALUES (
    'apparatBrk.png',
    'apparat',
    'No se para que sirve este aparato pero tiene una etiqueta que pone \"Inserte el líquido que desea transformar\".',
    0,
    1,
    0,
    0,
    'apparatBrkOp.png',
    'apparatBrk.png',
    0,
    100,
    100,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
  $sql = "INSERT INTO objects VALUES (
    'key.png',
    'key',
    'Una pequeña llave.',
    1,
    0,
    0,
    0,
    '',
    '',
    0,
    40,
    60,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
  $sql = "INSERT INTO objects VALUES (
    'laserRed.png',
    'laser',
    'Sistema láser que impide que nadie se acerque a la puerta pero puedo ver que tiene un robusto candado.',
    0,
    0,
    0,
    0,
    '',
    '',
    0,
    500,
    145,
    0,
    0,
    0,
    1,
    0
  )";
    $res = $mysqli->query($sql);
    if($res){
      echo "OK\n";
    }else{
      echo "Error\n";
    }
    // ---------------------------------------------------------------
    $sql = "CREATE TABLE IF NOT EXISTS importantValues (
      gameProgress int,
      windowEvent BOOLEAN,
      tutorialFirstTime BOOLEAN
    )";
    $res = $mysqli->query($sql);
    if($res){
      echo "Table created\n";
    }else{
      echo "Error\n";
    }
    $sql = "INSERT INTO importantValues VALUES (
     0,
     1,
     1
    )";
      $res = $mysqli->query($sql);
      if($res){
        echo "OK\n";
      }else{
        echo "Error\n";
      }

}

?>