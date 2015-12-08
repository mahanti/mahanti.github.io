 window.requestAnimationFrame = (function(){
 return  window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     ||  
         function( callback ){window
            window.setTimeout(callback, 1000 / 60);
         };
      })();

  //initalize canvas
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  //set width and height
  var max_width = window.innerWidth;
  var max_height = window.innerHeight;

  canvas.width = max_width;
  canvas.height = max_height;

  //particle variables
  var numParticle = 100,
      particles = [],
      minDist = 50,
      distance;

  //make it gray
  function colorCanvas() {
    context.fillStyle = "rgba(0,0,0,1)";
    context.fillRect (0,0,max_width,max_height) 
  }

  function Particle() {
    //random position
    this.x = Math.random() * max_width;
    this.y = Math.random() * max_height;

    //random velocity
    this.vx = -1 + Math.random() * 2;
    this.vy = -1 + Math.random() * 4;

    //radius 1-10
    this.radius = Math.floor((Math.random()*15)+1);

    //drawing circles
    this.draw = function() {
      var hue = 'rgba(' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ',' + 1 + ')'; 
      context.fillStyle = "white"; 
      context.beginPath();
      //center point, radius, start degree, end degree, clockwise 
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      //fill circle
      context.fill();
    }
  }

  //particle array 
  for(var x = 0; x < numParticle; x++) {
    particles.push(new Particle());
  }

  //draw on the canvas
  function draw() {
    //recolor canvas each load
    colorCanvas(); 

    //loop through particles and draw
    for (var x = 0; x < particles.length; x++) {
     particle = particles[x];
     particle.draw();
    } 

    update();
  }

  //add movement
  function update(update) {
   //update particle with velocity
   for (var x = 0; x < particles.length; x ++) {
     particle = particles[x]; 
  
     //change velocity
     particle.x += particle.vx;
     particle.y += particle.vy;   

    if(particle.x + particle.radius > max_width) 
      particle.x = max_width - particle.radius;

    else if(particle.x - particle.radius < 0) {
      particle.x = 0 + particle.radius;
    }

    if(particle.y + particle.radius > max_height) 
      particle.y = max_height - particle.radius;

    else if(particle.y - particle.radius < 0) {
      particle.y = 0 + particle.radius;
    }

     //attraction
      for (var y = x +1; y < particles.length; y++) {
        particle_y = particles[y];
        distance(particle, particle_y);
      }
    }
  }

  function distance(p1,p2) {
    var distance,
        dist_x = p1.x - p2.x;
        dist_y = p1.x - p2.x;

    distance = Math.sqrt(dist_x*dist_x, dist_y*dist_y);

    //draw line if close 
    if (distance < minDist/8) {
      context.beginPath();
      context.strokeStyle = "rgba(255,255,255,.5)"; 
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
      context.closePath();
      
      //acceleration
      var acceleration_x = dist_x/3000,
          acceleration_y = dist_x/3000; 

      //set acceleration
      p1.vx -= acceleration_x;
      p1.vy -= acceleration_y;

      p2.vx += acceleration_x;
      p2.vy += acceleration_y;
    }
  }

  //magic

  function animloop() {
    draw();
    requestAnimationFrame(animloop);
  }


  animloop();
