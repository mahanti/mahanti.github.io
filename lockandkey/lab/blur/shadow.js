$(function(){

    $("html").mousemove(function(e){

			var docW = $(window).width();
			var docH = $(window).height();

			var diffX = (docW/2) - e.pageX;
			var diffY = (docH/2) - e.pageY;

			var posDiffX = Math.abs(diffX) / 2;
			var posDiffY = Math.abs(diffY) / 2;
      
      // THE BLUR AMOOUNT CAN BE TWEAKED BY UNCOMMENTING THESE LINES & COMMENTING THE LINES ABOVE
			// var posDiffX = Math.abs(diffX / 4) > 40 ? 40 : Math.abs(diffX / 4);
			// var posDiffY = Math.abs(diffY / 4) > 40 ? 40 : Math.abs(diffY / 4);

			var blurDiff = posDiffX > posDiffY ? posDiffX : posDiffY;

			$('.content').css({
				'box-shadow': (diffX) + 'px ' + (diffY) + 'px ' + blurDiff + 'px #000'
			});
			$('.content.deux').css({
				'box-shadow': (diffX) + 'px ' + (diffY) + 'px ' + blurDiff + 'px #000'
			});

		});

});