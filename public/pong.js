// Function to assure he call the function 60 times per second result: 60fps
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

// creating canvas
  var canvas = document.createElement('canvas');
  var width = 400;
  var height = 600;
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');

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
  function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
  }

  Paddle.prototype.render = function() {
    context.fillStyle = "#29f709";
    context.fillRect(this.x, this.y, this.width, this.height);
  };

// defines default position of player paddle on canvas
  function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
  }
// defines default position of computer(player) paddle on canvas
  function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
  }

// To render player and computer paddle on canvas. Using prototype so player and computer inherit properties from paddle object
  Player.prototype.render = function() {
    this.paddle.render();
  };

  Computer.prototype.render = function() {
    this.paddle.render();
  };

// defining ball object props. x and y are representing center of circle.
  function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 5;
  }

// Once again prototype to inherit above defined Ball props
  Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#29f709";
    context.fill();
  };

// constructing objects we need for our game
  var player = new Player();
  var computer = new Computer();
  var ball = new Ball(200, 300);

// ###################################
// ########### Animating #############
// ###################################

// adding update method to ball so it can move(animate) towards player
  Ball.prototype.update = function(paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;
// addig collison detection so when the ball hits the paddle shit happens!
    if(this.x - 5 < 0) { //ball hitting left wall
      this.x = 5;
      this.x_speed = -this.x_speed;
    } else if(this.x + 5 > 400) { //ball hitting right wall
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
      if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x){
      //hit player paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
      }
    } else {
      if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x){
      //hit computer paddle
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
      }
    }
  };

  // #########################################
  // ########### Player controls #############
  // #########################################

  var keysDown = {};
// adding keyDown object to track key input
  window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });

  Player.prototype.update = function() {
    for(var key in keysDown) {
      var value = Number(key);
      if(value == 37) {           //left arrow
        this.paddle.move(-4, 0);
      } else if (value == 39) {   //right arrow
        this.paddle.move(4, 0);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

  Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.x_speed = y;
    if(this.x < 0) { //all the way left
      this.x = 0;
      this.x_speed = 0;
    } else if (this.x + this.width > 400) { //all the way right
      this.x = 400 - this.width;
      this.x_speed = 0;
    }
  }
