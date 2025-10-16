// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuToggle.addEventListener('click', () => {
    const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true' || false;
    mobileMenuToggle.setAttribute('aria-expanded', !expanded);
    mobileMenu.style.display = expanded ? 'none' : 'block';
});

// Contact form validation and submission
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

const showError = (input, message) => {
    const errorSpan = document.getElementById(`${input.id}-error`);
    errorSpan.textContent = message;
    input.setAttribute('aria-invalid', 'true');
};

const clearError = (input) => {
    const errorSpan = document.getElementById(`${input.id}-error`);
    errorSpan.textContent = '';
    input.removeAttribute('aria-invalid');
};

const validateForm = () => {
    let valid = true;

    // Validate required fields
    ['name', 'email', 'subject', 'message', 'privacy-consent'].forEach(id => {
        const input = document.getElementById(id);
        clearError(input);
        if (!input.value || (input.type === 'checkbox' && !input.checked)) {
            showError(input, 'This field is required.');
            valid = false;
        }
        // Additional email format validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address.');
                valid = false;
            }
        }
    });

    return valid;
};

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm()) {
        // Simulate form submission
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 8000);
    }
});
