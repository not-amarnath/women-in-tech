document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library with responsive settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            delay: 100,
            disable: window.innerWidth < 768 ? true : false,
            easing: 'ease-in-out'
        });
    }
    
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open'); // Prevent scrolling when menu is open
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
    
    // Enhanced FAQ Accordion functionality with improved animations
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Hide all answers initially
        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0px';
                    otherAnswer.style.opacity = '0';
                }
            });
            
            // Toggle current item with improved animation
            if (isActive) {
                // Close this FAQ
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
            } else {
                // Open this FAQ with animation sequence
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Slight delay before fading in the content
                setTimeout(() => {
                    answer.style.opacity = '1';
                }, 150);
                
                // Scroll into view on mobile with a slight delay for animation
                if (window.innerWidth < 768) {
                    setTimeout(() => {
                        const headerOffset = 80;
                        const itemPosition = item.getBoundingClientRect().top;
                        const offsetPosition = itemPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Recalculate heights on window resize for smooth animations
    window.addEventListener('resize', function() {
        faqItems.forEach(item => {
            if (item.classList.contains('active')) {
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
        
       
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
    
    // Enhanced Form submission handling with comprehensive validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Focus states for better accessibility
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Initialize fields that already have value
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });
        
        // Form validation and submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            let firstInvalidField = null;
            
            // Get form values
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Clear previous validation messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
            
            // Validate name (required)
            if (name.value.trim() === '') {
                showError(name, 'Please enter your name');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = name;
            }
            
            // Validate email (required and format)
            if (email.value.trim() === '') {
                showError(email, 'Please enter your email address');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = email;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = email;
            }
            
            // Validate message (required)
            if (message.value.trim() === '') {
                showError(message, 'Please enter your message');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = message;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Your message is too short (minimum 10 characters)');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = message;
            }
            
            // If the form is valid, submit it
            if (isValid) {
                // Show success message with animation
                const formContainer = contactForm.closest('.contact-form-container');
                formContainer.classList.add('success');
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for reaching out, ${name.value}! We'll get back to you shortly.</p>
                    <button class="new-message-btn">Send Another Message</button>
                `;
                
                // Hide form and show success message
                contactForm.style.display = 'none';
                formContainer.appendChild(successMessage);
                
                // Add button functionality to send another message
                const newMessageBtn = successMessage.querySelector('.new-message-btn');
                newMessageBtn.addEventListener('click', function() {
                    // Remove success message and show form again
                    successMessage.remove();
                    contactForm.style.display = 'flex';
                    formContainer.classList.remove('success');
                    contactForm.reset();
                });
                
                // In a real application, here's where you would send the data to your server
                console.log('Form submitted successfully with data:', {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim()
                });
            } else if (firstInvalidField) {
                // Focus the first invalid field
                firstInvalidField.focus();
            }
        });
        
        // Helper function to show error messages
        function showError(field, message) {
            const formGroup = field.closest('.form-group');
            formGroup.classList.add('error');
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = message;
            
            formGroup.appendChild(errorMessage);
        }
        
        // Helper function to validate email format
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
    
    // Add CSS variables for responsive heights (for mobile browsers)
    function setResponsiveHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setResponsiveHeight();
    window.addEventListener('resize', setResponsiveHeight);
});