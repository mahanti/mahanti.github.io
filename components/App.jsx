import React from 'react';
import { createRoot } from 'react-dom/client';
import Carousel from './Carousel.jsx';

const carouselImages = [
  '/img/carousel/01.jpg',
  '/img/carousel/02.jpg',
  '/img/carousel/03.jpg',
  '/img/carousel/04.jpg',
  '/img/carousel/07.jpg',
  '/img/carousel/05.jpg',
  '/img/carousel/06.jpg'
];

const App = () => {
  console.log('App component rendering');
  return <Carousel images={carouselImages} />;
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  const carouselContainer = document.getElementById('image-carousel');
  console.log('Carousel container found:', carouselContainer);
  
  if (carouselContainer) {
    console.log('Creating React root and mounting App');
    const root = createRoot(carouselContainer);
    root.render(<App />);
  } else {
    console.error('Carousel container not found!');
  }
});

export default App; 