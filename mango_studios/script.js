document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.getElementById('logoContainer');
    const letters = document.querySelectorAll('.letter');
    const logoColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFDA33'];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomDegree(max) {
        return Math.random() * max * (Math.random() > 0.5 ? 1 : -1);
    }

    function getRandomScale() {
        return Math.random() * 0.7 + 0.5;
    }

    function applyRandomEffects() {
        letters.forEach(letter => {
            const randomDegree = getRandomDegree(40);
            const randomScale = getRandomScale();
            const randomColor = getRandomElement(logoColors);

            // Check if the SVG is already loaded
            if (letter.contentDocument) {
                const svg = letter.contentDocument.querySelector('svg');
                if (svg) {
                    svg.style.fill = randomColor;
                }
            } else {
                // Add an event listener for the SVG to load
                letter.addEventListener('load', () => {
                    const svg = letter.contentDocument.querySelector('svg');
                    if (svg) {
                        svg.style.fill = randomColor;
                    }
                });
            }

            letter.style.setProperty('--rotate-start', '0deg');
            letter.style.setProperty('--scale-start', '1');
            letter.style.setProperty('--fill-start', 'rgba(0, 0, 0, 0.2)');

            letter.style.setProperty('--rotate-end', `${randomDegree}deg`);
            letter.style.setProperty('--scale-end', randomScale);
            letter.style.setProperty('--fill-end', randomColor);

            letter.classList.add('spring-animation');

            // Remove the animation class after it ends to allow re-triggering
            letter.addEventListener('animationend', () => {
                letter.classList.remove('spring-animation');
            }, { once: true });
        });
    }

    function resetEffects() {
        letters.forEach(letter => {
            // Check if the SVG is already loaded
            if (letter.contentDocument) {
                const svg = letter.contentDocument.querySelector('svg');
                if (svg) {
                    svg.style.fill = 'rgba(0, 0, 0, 0.2)';
                }
            } else {
                // Add an event listener for the SVG to load
                letter.addEventListener('load', () => {
                    const svg = letter.contentDocument.querySelector('svg');
                    if (svg) {
                        svg.style.fill = 'rgba(0, 0, 0, 0.2)';
                    }
                });
            }

            letter.style.setProperty('--rotate-start', '0deg');
            letter.style.setProperty('--scale-start', '1');
            letter.style.setProperty('--fill-start', 'rgba(0, 0, 0, 0.2)');

            letter.style.setProperty('--rotate-end', '0deg');
            letter.style.setProperty('--scale-end', '1');
            letter.style.setProperty('--fill-end', 'rgba(0, 0, 0, 0.2)');
        });
    }

    logoContainer.addEventListener('mouseenter', applyRandomEffects);
    logoContainer.addEventListener('mouseleave', resetEffects);
});

