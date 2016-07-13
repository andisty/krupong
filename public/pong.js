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
