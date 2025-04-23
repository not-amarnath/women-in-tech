// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init();
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            authButtons.classList.toggle('show');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            if (spans[0].classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Counter animation for stats
    const inViewport = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = document.querySelectorAll('.counter');
                counters.forEach(counter => {
                    // Extract the numeric part from the counter text (removing the '+' sign)
                    const targetText = counter.innerText;
                    const target = parseInt(targetText);
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
    
    if (statsSection) {
        observer.observe(statsSection);
    }
});