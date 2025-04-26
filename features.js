document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        // Optimize for mobile by disabling on small screens if performance is an issue
        disable: window.innerWidth < 768 && 'phone',
        once: true, // Whether animation should happen only once - while scrolling down
        duration: 800 // Values from 0 to 3000, with step 50ms
    });
    
    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
        });
    });
    
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Feature card animations
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotateY(180deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // Make comparison table responsive with horizontal scrolling indicator
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        // Add scroll indicator if table is wider than container
        const checkTableScroll = () => {
            if (tableContainer.scrollWidth > tableContainer.clientWidth) {
                tableContainer.classList.add('scrollable');
            } else {
                tableContainer.classList.remove('scrollable');
            }
        };

        // Check on load and resize
        checkTableScroll();
        window.addEventListener('resize', checkTableScroll);
        
        // Remove indicator when scrolled to end
        tableContainer.addEventListener('scroll', function() {
            if (Math.ceil(this.scrollLeft + this.clientWidth) >= this.scrollWidth) {
                this.classList.add('scrolled-end');
            } else {
                this.classList.remove('scrolled-end');
            }
        });
    }
});