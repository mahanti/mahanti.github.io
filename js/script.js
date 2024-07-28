
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
