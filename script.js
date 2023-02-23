// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    colorMode, createCanvas, background, backgroundColor, random, noStroke
 *    HSB, height, width, fill, ellipse, windowWidth, windowHeight,
 *    frameRate, stroke, noFill, rect, keyCode, UP_ARROW, DOWN_ARROW,
 *    LEFT_ARROW, RIGHT_ARROW, text, collideRectRect, noLoop, loop
 */

let backgroundColor, playerSnake, currentApple, score, fr, lives, moreApple;

function setup() {
  // Canvas & color settings
  createCanvas(300, 300);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  fr = 10;
  playerSnake = new Snake();
  currentApple = new Apple();
  moreApple = new yellowApple();
  score = 0;
  lives = 3;
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  frameRate(fr);
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  playerSnake.checkMoreApples();
  // The apple needs fewer methods than the snake to show up on screen.
  currentApple.showSelf();
  moreApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
  gameOver();
  walls();
}

function displayScore() {
  fill(20);
  text(`Score: ${score}`, 20, 20);
  text(`Lives: ${lives}`, 20, 40);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width / 2;
    this.y = height - 10;
    this.direction = "";
    this.speed = 10;
    this.tail = [];
    this.tail.unshift(new TailSegment(this.x, this.y));
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }

    this.tail.unshift(new TailSegment(this.x, this.y));
    this.tail.pop();
  }

  showSelf() {
    stroke("green");
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

  checkApples() {
    if (
      collideRectRect(
        this.x,
        this.y,
        this.size,
        this.size,
        currentApple.x,
        currentApple.y,
        currentApple.size,
        currentApple.size
      )
    ) {
      score++;
      currentApple = new Apple();
      fr++;
      this.extendTail();
    }
  }

  checkMoreApples() {
    if (
      collideRectRect(
        this.x,
        this.y,
        this.size,
        this.size,
        moreApple.x,
        moreApple.y,
        moreApple.size,
        moreApple.size
      )
    ) {
      score = score + 2;
      moreApple = new yellowApple();
      this.extendTail();
      this.extendTail();
    }
  }

  checkCollisions() {
    if (this.tail.length <= 2) {
      return;
    }
    for (let i = 1; i < this.tail.length; i++) {
      if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
        gameOver();
      }
    }
  }

  extendTail() {
    let lastTailSegment = this.tail[this.tail.length - 1];
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
}

class TailSegment {
  constructor(x, y) {
    this.size = 10;
    this.x = x;
    this.y = y;
  }

  showSelf() {
    fill("green");
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

class yellowApple {
  constructor() {
    this.size = 10;
    this.x = random(width - this.size);
    this.y = random(height - this.size);
  }

  showSelf() {
    fill("yellow");
    rect(this.x, this.y, this.size, this.size);
  }
}

class Apple {
  constructor() {
    this.size = 10;
    this.x = random(width - this.size);
    this.y = random(height - this.size);
  }

  showSelf() {
    fill(10, 80, 80);
    rect(this.x, this.y, this.size, this.size);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode);
  if (keyCode === UP_ARROW && playerSnake.direction != "S") {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != "N") {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != "W") {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != "E") {
    playerSnake.direction = "W";
  } else if (keyCode === 32) {
    restartGame();
  } else {
    console.log("wrong key");
  }
}

function restartGame() {
  score = 0;
  playerSnake = new Snake();
  currentApple = new Apple();
  moreApple = new yellowApple();
  loop();
}

function gameOver() {
  if (lives === 0) {
    stroke(0);
    text("GAME OVER", width / 2, height / 2);
    noLoop();
  }
}

function walls() {
  if (playerSnake.x >= width || playerSnake.x <= 0) {
    lives -= 1;
    playerSnake.x = 100;
    playerSnake.y = 100;
  } else if (playerSnake.y <= 0 || playerSnake.y >= height) {
    lives -= 1;
    playerSnake.x = 100;
    playerSnake.y = 100;
  }
}
