// Function to assure he call the function 60 times per second result: 60fps
var animate = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

// constructing objects we need for our game + canvas
var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player1 = new Player1();
var player2 = new Player2();
var midfieldLine = new MidfieldLine();
var ball = new Ball(300, 200);
var counterPlayer1 = 0;
var counterPlayer2 = 0;
var keysDown = {};

//function to attach canvas to screen when page loads
window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

// IMPORTANT FUNC -Inception- will update all player objects & will render all objects
//                  and finaly call animate with step function as param to call it again
var step = function() {
  update();
  render();
  animate(step);
};

var reset = function () {
  player1.reset();
  player2.reset();
}

var update = function() {
  player2.update();
  player1.update();
  ball.update(player1.paddle, player2.paddle);
};

// defining color and size of pong playfield
var render = function() {
  context.fillStyle = "#050404";
  context.fillRect(0,0, width, height);
  player1.render();
  player2.render();
  midfieldLine.render();
  ball.render();
};

// Players object, paddle so we can render it
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillRect(this.x, this.y, this.width, this.height);
};

// defines midfield line
function MidfieldLine() {
  this.paddle = new Paddle(298, 0, 4, 400)
}

// defines default position of player paddle on canvas
function Player1() {
  this.paddle = new Paddle(580, 175, 10, 50);
}
// defines default position of computer(player) paddle on canvas
function Player2() {
  this.paddle = new Paddle(10, 175, 10, 50);
}

// To render player and computer paddle on canvas. Using prototype so player and computer inherit properties from paddle object
MidfieldLine.prototype.render = function() {
  context.fillStyle = "#ffffff"
  this.paddle.render();
};

Player1.prototype.render = function() {
  context.fillStyle = "#29f709";
  this.paddle.render();
};

Player2.prototype.render = function() {
  context.fillStyle = "#29f709";
  this.paddle.render();
};

// defining ball object props. x and y are representing center of circle.
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 3;
  this.y_speed = 0;
  this.radius = 5;
}
// Once again prototype to inherit above defined Ball props
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#29f709";
  context.fill();
};

// ###################################
// ########### Animating #############
// ###################################

// adding update method to ball so it can move(animate) towards player
Ball.prototype.update = function (paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

// addig collison detection so when the ball hits the paddle shit happens!
  if(this.y - 5 < 0) { // hitting the left wall
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 400) { // hitting the right wall
    this.y = 395;
    this.y_speed = -this.y_speed;
  }
  // USER PLAYER1
    if(this.x < 0 ) {  // a point was scored
      counterPlayer1 += 1;
      this.y_speed = 0;
      this.x_speed = 3;
      this.y = 200;
      this.x = 300;
      $('#counterPlayer1>span').html(counterPlayer1);
      reset();
      return counterPlayer1;
    }
  // user player2
    if(this.x > 600) {  // a point was scored
      counterPlayer2 += 1;
      this.y_speed = 0;
      this.x_speed = 3;
      this.y = 200;
      this.x = 300;
      $('#counterPlayer2>span').html(counterPlayer2);
      reset();
      return counterPlayer2;
    }

  if(top_x > 300) {
    if(top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
      // hit the player's paddle
      this.y_speed += (paddle1.y_speed / 2);
      this.x_speed = -3;
      this.x += this.x_speed;
    }
  } else {
    if(top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
      // hit the computer's paddle
      this.y_speed += (paddle2.y_speed / 2);
      this.x_speed = 3;
      this.x += this.x_speed;
    }
  }
};

  // player update function so when you press key 38 you go up 40 you move down
  // the number -4 and 4 define how fast you paddle will travel when you pres left or right now it moves 4 on the canvas
Player1.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value === 38) {
      this.paddle.move(0, -6);
    } else if (value === 40) {
      this.paddle.move(0, 6);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Player1.prototype.reset = function() {
  // set to initial position
  this.paddle.x = 580
  this.paddle.y = 175
  this.paddle.render()
}

Player2.prototype.reset = function() {
  // set to initial position
  this.paddle.x = 10
  this.paddle.y = 175
  this.paddle.render()
}

Player2.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value === 87) {
      this.paddle.move(0, -6);
    } else if (value === 83) {
      this.paddle.move(0, 6);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

// paddle move function so when player pressed above defined keys the paddle moves 4 on the canvas
Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) { // all the way to the left
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.width > 360) { // all the way to the right
    this.y = 360 - this.width;
    this.y_speed = 0;
  }
};

// #########################################
// ########### Computer Player #############
// #########################################
//
// Computer.prototype.update = function(ball) {
//   var x_pos = ball.x;
//   var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
//   if(diff < 0 && diff < -4) {
//     diff = -5;
//   } else if (diff > 0 && diff > 4) {
//     diff = 5;
//   }
//   this.paddle.move(0, diff);
//   if(this.paddle.x < 0) {
//     this.paddle.x = 0;
//   } else if (this.paddle.x + this.paddle.height > 400) {
//     this.paddle.x = 400 - this.paddle.height;
//   }
// };

// ############################################ score method test
// ############################################ score method test

// var balloon = $( ".balloon" );
// var counter = 0;
//
// for(var i = 0; i < 5; i++){
//   var balloon_copy = balloon.clone();
//   balloon_copy.css({ left: (200*i)});
//   balloon_copy.appendTo( "body" );
//
//   balloon_copy.click(function(){
//     $(this).remove();
//
//     counter = counter + 1;
//     $('.counter').html(counter);
//   });
// };

// ############################################ score method test
// ############################################ score method test

// adding keyDown object to track key input
  window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });
