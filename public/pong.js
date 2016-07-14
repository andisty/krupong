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
var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);

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

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

// defining color and size of pong playfield
var render = function() {
  context.fillStyle = "#050404";
  context.fillRect(0,0, width, height);
  player.render();
  computer.render();
  ball.render();
};

// Players object, paddle so we can render it
function Paddle(y, x, height, width) {
  this.y = y;
  this.x = x;
  this.height = height;
  this.width = width;
  this.y_speed = 0;
  this.x_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#29f709";
  context.fillRect(this.y, this.x, this.height, this.width);
};

// defines default position of player paddle on canvas
function Player() {
  this.paddle = new Paddle(580, 175, 10, 50);
}
// defines default position of computer(player) paddle on canvas
function Computer() {
  this.paddle = new Paddle(10, 175, 10, 50);
}

// To render player and computer paddle on canvas. Using prototype so player and computer inherit properties from paddle object
Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

// defining ball object props. x and y are representing center of circle.
function Ball(y, x) {
  this.y = y;
  this.x = x;
  this.y_speed = 3;
  this.x_speed = 0;
  this.radius = 5;
}
// Once again prototype to inherit above defined Ball props
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.y, this.x, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#29f709";
  context.fill();
};

// ###################################
// ########### Animating #############
// ###################################

// adding update method to ball so it can move(animate) towards player
Ball.prototype.update = function (paddle1, paddle2) {
  this.y += this.y_speed;
  this.x += this.x_speed;
  var top_y = this.y - 5;
  var top_x = this.x - 5;
  var bottom_y = this.y + 5;
  var bottom_x = this.x + 5;

// addig collison detection so when the ball hits the paddle shit happens!
  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 400) { // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > 600) { // a point was scored
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

  // player update function so when you press key 38 you go up 40 you move down
  // the number -4 and 4 define how fast you paddle will travel when you pres left or right now it moves 4 on the canvas
Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) {
      this.paddle.move(0, -6);
    } else if (value == 40) {
      this.paddle.move(0, 6);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

// paddle move function so when player pressed above defined keys the paddle moves 4 on the canvas
Paddle.prototype.move = function(y, x) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.height > 400) { // all the way to the right
    this.x = 400 - this.height;
    this.x_speed = 0;
  }
};
  // #########################################
  // ########### Computer Player #############
  // #########################################

Computer.prototype.update =function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) {
    diff = -5;
  } else if (diff > 0 && diff > 4) {
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.height > 400) {
    this.paddle.x = 400 - this.paddle.height;
  }
};

// adding keyDown object to track key input
  window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });
