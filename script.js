/**
 * Bella's Gift Boutique - Main JavaScript File
 * Author: [Your Name] - Web Development Project
 * Features: Mobile menu, form validation, smooth scrolling, accessibility
 */

// Global variables
let mobileMenuOpen = false;
let formSubmitting = false;

// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bella\'s Gift Boutique website loaded');
    
    // Initialize all features
    initMobileMenu();
    initContactForm();
    initSmoothScrolling();
    initAccessibilityFeatures();
    setActiveNavigation();
    
    console.log('All features initialized successfully');
});

/**
 * Mobile Menu Functionality
 * Handles hamburger menu toggle and mobile navigation
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!menuToggle || !mobileMenu) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu when hamburger is clicked
    menuToggle.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Close menu when any link is clicked
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenuOpen && 
            !menuToggle.contains(event.target) && 
            !mobileMenu.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        // Open menu
        mobileMenu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        // Animate hamburger to X
        hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburgerLines[1].style.opacity = '0';
        hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        
        // Focus first menu item for accessibility
        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(function() {
                firstLink.focus();
            }, 300);
        }
    } else {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenuOpen) return;
    
    mobileMenuOpen = false;
    mobileMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Reset hamburger animation
    hamburgerLines.forEach(function(line) {
        line.style.transform = '';
        line.style.opacity = '';
    });
}

/**
 * Contact Form Validation and Handling
 * Provides real-time validation and form submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.log('Contact form not found on this page');
        return;
    }
    
    // Add event listeners for form validation
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(function(input) {
        // Validate on blur (when user leaves field)
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        // Clear errors on input
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmit(contactForm);
    });
}

function validateField(field) {
    const fieldValue = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    const isRequired = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    if (isRequired && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Validate email format
    else if (fieldType === 'email' && fieldValue) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    // Validate phone number
    else if (fieldType === 'tel' && fieldValue) {
        const phonePattern = /^[\+\-\s\(\)\d]{10,}$/;
        if (!phonePattern.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    // Validate name length
    else if (fieldName === 'name' && fieldValue && fieldValue.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long.';
    }
    // Validate message length
    else if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long.';
    }
    // Validate select fields
    else if (field.tagName === 'SELECT' && isRequired && !fieldValue) {
        isValid = false;
        errorMessage = 'Please select an option.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Find or create error message element
    const errorId = field.id + '-error';
    let errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function handleFormSubmit(form) {
    if (formSubmitting) {
        console.log('Form already being submitted');
        return;
    }
    
    // Validate all fields
    const formInputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
    let isFormValid = true;
    
    formInputs.forEach(function(input) {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check privacy consent checkbox
    const privacyCheckbox = form.querySelector('#privacy-consent');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        isFormValid = false;
        showFieldError(privacyCheckbox, 'You must agree to the privacy policy to submit this form.');
    }
    
    if (!isFormValid) {
        console.log('Form validation failed');
        // Focus first error field
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        return;
    }
    
    // Simulate form submission (in real implementation, this would send to server)
    formSubmitting = true;
    const submitButton = form.querySelector('.form-button');
    const originalButtonText = submitButton.textContent;
    
    // Update button state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate server processing time
    setTimeout(function() {
        // Show success message
        const successMessage = document.getElementById('form-success');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        formSubmitting = false;
        
        console.log('Form submitted successfully');
    }, 2000);
}

/**
 * Smooth Scrolling for Internal Links
 * Provides smooth scrolling animation for anchor links
 */
function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return; // Skip empty anchors
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenuOpen) {
                    closeMobileMenu();
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus target for accessibility (if it's focusable)
                if (targetElement.tabIndex >= 0) {
                    targetElement.focus();
                }
            }
        });
    });
}

/**
 * Set Active Navigation Link
 * Highlights the current page in navigation
 */
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(function(link) {
        const linkHref = link.getAttribute('href');
        
        // Remove existing active classes
        link.classList.remove('active');
        
        // Add active class to current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Accessibility Features
 * Additional features to improve website accessibility
 */
function initAccessibilityFeatures() {
    // Skip to main content link (for screen readers)
    createSkipLink();
    
    // Improve focus management
    improveFocusManagement();
    
    // Add keyboard navigation for custom elements
    initKeyboardNavigation();
}

function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.background = '#0a1d40';
    skipLink.style.color = 'white';
    skipLink.style.padding = '8px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.zIndex = '10000';
    
    // Show on focus
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function improveFocusManagement() {
    // Ensure all interactive elements are focusable
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach(function(element) {
        // Add focus styles if not present
        element.addEventListener('focus', function() {
            if (!this.matches(':focus-visible')) {
                this.style.outline = '2px solid #d4af37';
                this.style.outlineOffset = '2px';
            }
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

function initKeyboardNavigation() {
    // Arrow key navigation for card grids
    const cardGrids = document.querySelectorAll('.card-grid');
    
    cardGrids.forEach(function(grid) {
        const cards = grid.querySelectorAll('.card');
        
        cards.forEach(function(card, index) {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', function(event) {
                let nextIndex;
                
                switch(event.key) {
                    case 'ArrowRight':
                        nextIndex = (index + 1) % cards.length;
                        cards[nextIndex].focus();
                        event.preventDefault();
                        break;
                    case 'ArrowLeft':
                        nextIndex = (index - 1 + cards.length) % cards.length;
                        cards[nextIndex].focus();
                        event.preventDefault();
                        break;
                }
            });
        });
    });
}

/**
 * Utility Functions
 * Helper functions used throughout the application
 */

// Sanitize input text (basic security measure)
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .trim(); // Remove whitespace
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Log errors for debugging
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log('Bella\'s Gift Boutique JavaScript loaded successfully');
