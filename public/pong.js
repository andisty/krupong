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
  };

// adding player object paddle so we can render it

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
