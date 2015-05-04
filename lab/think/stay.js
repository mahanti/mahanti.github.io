var luminari = document.getElementsByClassName('invert action')[0];
var brainwave = document.write.brainwave;
var root = document.getElementsByTagName('html')[0];
var rootClass;
 
if(localStorage.getItem('color') == 'inverted') {
		rootClass = new Array('inverted', 'ready inverted');
} else {
		rootClass = new Array('', 'ready');
}

root.className = rootClass[0]; 

window.addEventListener('load', function () {
		root.className = rootClass[1]; 
		brainwave.value = localStorage.getItem('brainwave'); 

		window.addEventListener('keydown', function() {															
			localStorage.setItem('brainwave', brainwave.value); //store it
		});
		
		luminari.addEventListener('mouseup', function(e) {
				invert();
		});
		
	
	$(".scope").click(function() {
			if ($('.thoughts').hasClass('focused'))
			{
				var text = $('.thinking').val();
				$('.thoughts').removeClass('focused'); 
				brainwave.value = text +  brainwave.value;
				$('.thinking').val("");					
				$('.center').removeClass('center').addClass('center-none');
			}
			else {		
				$('.center-none').removeClass('center-none').addClass('center');
				$('.thinking').val(brainwave.value + " ");
				$('.thoughts').addClass('focused');
				brainwave.value = "";
				$('.thoughts').focus();
			}
		});
			
	function invert() { //invert color
		if (root.className == 'ready') {
					root.className = 'ready inverted';
					localStorage.setItem('color', 'inverted'); //store color
			} else {
					root.className = 'ready';
					localStorage.setItem('color', '');
			}
	}
		
});
