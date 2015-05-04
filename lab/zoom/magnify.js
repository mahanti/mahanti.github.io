$(document).ready(function(){

  var x_width, y_height = 0;
  $(".magnify").mousemove(function(e) {
    if(!x_width && !y_height) {
      var new_image = new Image();
      new_image.src = $(".small").attr("src");
      
      x_width = new_image.width;
      y_height = new_image.height;
    }
    else {
     var offset_magnify = $(this).offset();

     var mx = e.pageX - offset_magnify.left;
     var my = e.pageY - offset_magnify.top; 
    
     if (mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0) {
       $(".large").fadeIn(100);
     }
     else {
       $(".large").fadeOut(50);
     }
     if ($(".large").is(":visible")) {
       var radius_x = Math.round(mx/$(".small").width()*x_width - $(".large").width()/2)*-1;
       var radius_y = Math.round(my/$(".small").height()*y_height - $(".large").height()/2)*-1;
       var bgp = radius_x + "px " + radius_y + "px";

       var px = mx - $(".large").width()/2;
       var py = my - $(".large").height()/2;

       $(".large").css({left: px, top: py, backgroundPosition: bgp});
       }
     }
   })
});

