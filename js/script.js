const navBtn = document.querySelector('.navlist-button');
const navList = document.querySelector('.navlist');
const navLink = document.querySelectorAll('.navlist-link');

//Initiating classes for open/close
navBtn.addEventListener('click', (e) => {  
  e.preventDefault();
  if(navList.classList.contains('navlist-active')){
    navBtn.classList.remove('navlist-button_close')
    navList.classList.remove('navlist-active');
  }
  else {
    navList.classList.add('navlist-active');
    navBtn.classList.add('navlist-button_close')
  }
});

//Close nav when nav link is tapped
navLink.forEach(function (link) {
  link.addEventListener('click', function() {
    navBtn.classList.remove('navlist-button_close')
    navList.classList.remove('navlist-active');
  });
});
