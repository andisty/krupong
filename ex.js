
// USER PLAYER
  if(this.y < 0 ) {  // a point was scored
    counterPlayer += 1;
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    console.log(counterPlayer)
    alert("shits and giggles2");
    return counterPlayer;
    document.getElementById('counterPlayer').HTML(counterPlayer);
  }
// the COMPUTER player
  if(this.y > 600) {  // a point was scored
    counterComputer += 1;
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    console.log(counterComputer)
    alert("locatz");
    return counterComputer;
    document.getElementById('counterComputer').HTML(counterComputer);
  }


  var balloon = $( ".balloon" );
  var counter = 0;

  for(var i = 0; i < 5; i++){
    var balloon_copy = balloon.clone();
    balloon_copy.css({ left: (200*i)});
    balloon_copy.appendTo( "body" );

    balloon_copy.click(function(){
      $(this).remove();

      counter = counter + 1;
      $('.counter').html(counter);
    });
  };
