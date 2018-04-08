$("document").ready(function() {
    var swatch_mode = 0;

   /* function clear_mode() {
       $(".swatch_mode").animate({color: "#ddd"}, "fast");
       $(this).animate({ color: "#4287FF" }, "slow"); 
    };*/

    Mousetrap.bind('command+shift', function() {
      $(".buttons").animate({opacity:0}, "fast");
    });

    Mousetrap.bind('shift+command', function() {
      $(".buttons").animate({opacity:1}, "fast");
    });

    $(".swatch_mode").click(function() {
       $(".swatch_mode").animate({color: "#ddd"}, "fast");
       $(this).animate({ color: "#4287FF" }, "slow"); 
    });

    Mousetrap.bind('r', function() {
      swatch_mode = 0;
      $(".swatch_mode").animate({color: "#ddd"}, "fast");
      $("#r2d2").animate({ color: "#4287FF" }, "slow");
    });
    
    $("#r2d2").click(function() {
      swatch_mode = 0;
    });

    Mousetrap.bind('m', function() {
      swatch_mode = 1;
      $(".swatch_mode").animate({color: "#ddd"}, "fast");
      $("#darth_maul").animate({ color: "#4287ff" }, "slow");
    });

    $("#darth_maul").click(function() {
      swatch_mode = 1;
    });


   Mousetrap.bind('c', function() {
     swatch_mode = 2;
     $(".swatch_mode").animate({color: "#ddd"}, "fast"); 
     $("#chewbacca").animate({ color: "#4287ff" }, "slow");
   }); 
     
   $("#chewbacca").click(function() {
      swatch_mode=2;
   });

   Mousetrap.bind('a', function() {
     swatch_mode = 3;
     $(".swatch_mode").animate({color: "#ddd"}, "fast"); 
     $("#amidala").animate({ color: "#4287ff" }, "slow");
   });

   $("#amidala").click(function() {
     swatch_mode = 3;
   }); 

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
      console.log(swatch_mode); 
      var color = $(this).css("background-color");
      var colorArray = new Array(); 
      var x = 0;
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
              
              if (swatch_mode === 0) {
                var hue = 'rgb(' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ',' + (Math.floor(Math.random()*256)) + ')';
                $(this).css("background-color", hue);
                console.log("random"); 
              }

              if (swatch_mode === 1) {
                colorArray = $.xcolor.monochromatic(color,25);
                $(this).css("background-color", colorArray[x+1]); 
              }

              if (swatch_mode === 2) {
                colorArray = $.xcolor.tetrad(color);
                $(this).css("background-color", colorArray[x]); 
              }

              if (swatch_mode === 3) {
                colorArray= $.xcolor.analogous(color, 25);
                $(this).css("background-color", colorArray[x+1]); 
              }

              x = x+1; 
           })   
         } 
       }); 
     }); 
  });
