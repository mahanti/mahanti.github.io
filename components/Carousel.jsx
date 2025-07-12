import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const Carousel = ({ images }) => {
  console.log('Carousel component rendering with images:', images);
  
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  
  // Motion values for smooth animations
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 300 });
  
  // Calculate bounds
  const maxTranslate = 0;
  const minTranslate = -(contentWidth - containerWidth);
  
  // Update dimensions on mount and resize
  useEffect(() => {
    console.log('Carousel useEffect running');
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerPadding = parseInt(getComputedStyle(container).paddingLeft) + parseInt(getComputedStyle(container).paddingRight);
        setContainerWidth(container.offsetWidth - containerPadding);
        
        // Calculate content width (all images + margins)
        const imageWidth = 600; // From your CSS
        const imageMargin = 8; // From your CSS
        const totalWidth = images.length * (imageWidth + imageMargin) + 20; // +20 for padding
        setContentWidth(totalWidth);
        console.log('Dimensions updated:', { containerWidth: container.offsetWidth, totalWidth });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [images.length]);
  
  // Handle drag end with bounds snapping
  const handleDragEnd = (event, info) => {
    const currentX = x.get();
    let targetX = currentX;
    
    // Snap to bounds
    if (currentX > maxTranslate) {
      targetX = maxTranslate;
    } else if (currentX < minTranslate) {
      targetX = minTranslate;
    }
    
    // Apply momentum if within bounds
    if (targetX === currentX && Math.abs(info.velocity.x) > 100) {
      const momentum = info.velocity.x * 0.3;
      targetX = Math.max(minTranslate, Math.min(maxTranslate, currentX + momentum));
    }
    
    x.set(targetX);
  };
  
  // Handle wheel scrolling
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      const scrollAmount = e.deltaX * 0.5;
      const newX = Math.max(minTranslate, Math.min(maxTranslate, x.get() - scrollAmount));
      x.set(newX);
    }
  };
  
  console.log('Carousel rendering with', images.length, 'images');
  
  return (
    <div className="carousel-wrapper mb-24">
      <motion.div
        ref={containerRef}
        className="carousel-container"
        onWheel={handleWheel}
        style={{ cursor: 'grab' }}
        whileHover={{ cursor: 'grab' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        <motion.div
          className="carousel-slide"
          drag="x"
          dragConstraints={{ left: minTranslate, right: maxTranslate }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          onDragEnd={handleDragEnd}
          style={{ x: springX }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          {images.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'inline-block',
                width: '600px',
                height: '400px',
                marginRight: '8px',
                objectFit: 'cover',
                borderRadius: '40px'
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Carousel; 