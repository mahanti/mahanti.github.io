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

/*
const imageLinks = document.querySelectorAll(".image-link");
  const imageContainer = document.querySelector(".image-container");
  const defaultContent = document.querySelector(".default-content");

  imageLinks.forEach((link) => {
    const image = link.querySelector(".hover-image");

    link.addEventListener("mouseover", () => {
      defaultContent.style.opacity = "0";
      imageContainer.appendChild(image);
      image.style.display = "block";

      // Delay the opacity change to ensure the image is in the document flow
      setTimeout(() => {
        image.style.opacity = "1";
      }, 0);
    });

    link.addEventListener("mouseout", () => {
      image.style.opacity = "0";
      // Delay the display change to allow the transition to complete
      setTimeout(() => {
        image.style.display = "none";
        defaultContent.style.opacity = "1";
      }, 500); // Match this to the length of your transition
    });
  });
*/
