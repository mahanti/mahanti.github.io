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

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.carousel-container');
  let startX;
  let scrollLeft;
  let isDown;

  container.addEventListener('mousedown', e => mouseIsDown(e));  
  container.addEventListener('mouseup', e => mouseUp(e));
  container.addEventListener('mouseleave', e => mouseLeave(e));
  container.addEventListener('mousemove', e => mouseMove(e));

  function mouseIsDown(e) {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  }

  function mouseUp(e) {
    isDown = false;
    container.style.cursor = 'grab';
  }

  function mouseLeave(e) {
    isDown = false;
    container.style.cursor = 'grab';
  }

  function mouseMove(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // You can adjust the scrolling speed by changing this multiplier
    container.scrollLeft = scrollLeft - walk;
  }

  console.log('Carousel script loaded', container);
});