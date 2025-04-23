// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init();
    
    // Counter animation for stats
    const inViewport = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = document.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.innerText);
                    let count = 0;
                    const speed = 2000 / target;
                    const updateCount = () => {
                        if (count < target) {
                            count++;
                            counter.innerText = count + '+';
                            setTimeout(updateCount, speed);
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const options = {
        threshold: 0.25
    };

    const observer = new IntersectionObserver(inViewport, options);
    const statsSection = document.querySelector('.impact');
    observer.observe(statsSection);
});