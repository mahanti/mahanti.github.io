$("document").ready(function() {
      function hexerator(rgb) {
        var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
          rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                 return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
                     }
                         return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
                            }   
    $(function() {
      $(".tile").each(function() {
        var hue = 'rgb(' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ')';
          $(this).css("background-color", hue);
        });
      });  
    $(".tile").click(function() {
      $(".screen")
        .animate({
          opacity: 0,
          left: -50 
        }, {
          duration:400,
          complete: function() {
           $(this)
            .css({ left: 100 })
            .animate({
              opacity: 1,
              left: 0
            }, {
              duration: 500
            })
            ; 
            $(".tile").each(function() {
             var hue = 'rgb(' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ')';
               $(this).css("background-color", hue);
            });
          }   
       }); 
     }); 
    $(".tile").click(function(){
      var color = $('.tile').css("background-color");
      alert(hexerator(color));   
    });
  });