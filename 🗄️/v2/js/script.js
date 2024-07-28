const navBtn = document.querySelector('.navlist-button');
const navList = document.querySelector('.navlist');
const navLink = document.querySelectorAll('.navlist-link');
const row = document.querySelectorAll('.row');

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

const currentHour = new Date().getHours();
let links = document.getElementsByTagName("a");
if (currentHour >= 7 && currentHour < 18) {
    document.body.className = "day";
    for(let i=0; i < links.length; i++) {
        links[i].classList.remove("night");
        links[i].classList.add("day");
    }
} else {
    document.body.className = "night";
    for(let i=0; i < links.length; i++) {
        links[i].classList.remove("day");
        links[i].classList.add("night");
    }
}
