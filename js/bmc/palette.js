function colorChange(color) {
      var tiny = tinycolor(color);

       var complements = $(".complements").toggleClass("invisible", !tiny.isValid());

       function colorArrayToHTML(arr) {
         return $.map(arr, function(e) {
           return '<span class="content" style="background:'+e.toHexString()+'"></span>'
          }).join('');
       }

       var triad = tiny.triad();
       complements.find("#triad").html(colorArrayToHTML(triad));
       console.log(triad.map(function(f) {return f.toHexString();}));

       var tetrad = tiny.tetrad();
       complements.find("#tetrad").html(colorArrayToHTML(tetrad));

       var mono = tiny.monochromatic();
       complements.find("#mono").html(colorArrayToHTML(mono));

       var analogous = tiny.analogous();
       complements.find("#analogous").html(colorArrayToHTML(analogous));

       var splitcomplement = tiny.splitcomplement();
       complements.find("#split_complement").html(colorArrayToHTML(splitcomplement));
    }

    $(function() {
      $("#bigmoneycolor").bind("keyup change", function() {
        colorChange($(this).val());
      });
      colorChange({r: 255, g: 255, b: 255});
            
      $(".content").click(function() {
        $("#bigmoneycolor").val($(this).text()).trigger("change");
        $("body").css("background-color", '#' + $(this).text());
        return false;
      });
    });
