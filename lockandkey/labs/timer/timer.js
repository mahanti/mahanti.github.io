var $start      = $('#start'),
    startText   = $start.text(),
    stopText    = $start.attr('alternate'),
    $split      = $('#split'),
    $clear      = $('#clear'),
    $timer      = $('#timer'),
    $splits     = $('#splits'),
    /*
      0 = start
      1 = end 
      2 = stopped/counting
      3 = time in ms
      4 = timer
      5 = epoch (January 1, 1970)
      6 = element (not used here, normally stores the DOM element to update with the time)
      7 = split count
     */
    t = [0, 0, 0, 0, 0, 0, 0, 0],
    format = function(ms) {
        var d = new Date(ms + t[5]).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
        var x = String(ms % 1000);
        while (x.length < 3) {
            x = '0' + x;
        }
        d += '.' + x;
        return d.substr(3, d.length - 4);
    },
    zero = function(num) {
        if (parseInt(num) < 0) var neg = true;
        if (Math.abs(parseInt(num)) < 10) {
            num = '0' + Math.abs(num);
        }
        if (neg) num = '-' + num;
        return num;
    },
    startStop = function() {
        t[t[2]] = (new Date()).valueOf();
        t[2] = 1 - t[2];
        if (t[2] == 0) {
            clearInterval(t[4]);
            t[3] += t[1] - t[0];
            $start.text(startText);

      //add splits      
            t[7]++;
            $splits.show();
            $('<li>' + format(t[3]) + '</li>').appendTo($splits).slideDown('fast');
            $splits.find('li').removeClass('first last');
            $splits.find('li:first').addClass('first').end().find('li:last').addClass('last');
            t[4] = t[1] = t[0] = 0;
            t[3] = 0; 
            display();
    }
        else {
            $start.text(stopText);
            t[4] = setInterval(display, 43);
    }
        return false;
    },

    clear = function() {
        if (t[2]) {
            startStop();
        }
        t[4] = t[3] = t[2] = t[1] = t[0] = 0;
        display();
    //clear splits  
        $start.text(startText);
        $splits.slideUp('fast', function() {
            $splits.empty();
        });
        t[7] = 0;
        return false;
    },
    display = function() {
        if (t[2]) {
            t[1] = (new Date()).valueOf();
        }
        $timer.text(format(t[3] + t[1] - t[0]));
    },
    load = function() {
        t[5] = new Date(1970, 1, 1, 0, 0, 0, 0).valueOf();

        display();
    };

$(function() {

    $splits.empty();
    load();
  Mousetrap.bind('space', startStop);   
  Mousetrap.bind('enter', clear); 
  $start.click(startStop);
    $clear.click(clear);
        return false;
    });
  $('#controls li:last').addClass('last');

  $('#start').mouseover(function() {
    $(this).html("Spacebar");
  }).mouseout(function() {
    $(this).html("Start");
  });

  $('#clear').mouseover(function() {
    $(this).html("Return");
  }).mouseout(function() {
    $(this).html("Clear");
  });

