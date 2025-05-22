function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const menuBar = document.getElementById('menu-bar');
    if (menuBar) {
        menuBar.addEventListener('click', toggleMenu);
        menuBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleMenu();
            }
        });
    }

    // Smooth scrolling for nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                // Optionally close menu on mobile after click
                const menu = document.getElementById('menu');
                if (menu && menu.classList.contains('open')) {
                    menu.classList.remove('open');
                }
            }
        });
    });

    const filterContainer = document.getElementById('project-filters');
    if (filterContainer) {
        filterContainer.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
                e.target.click();
            }
        });
    }

    // Lightbox for project images
    document.querySelectorAll('.project-image').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
        img.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openLightbox(this.src, this.alt);
            }
        });
    });

    const closeBtn = document.getElementById('lightbox-close');
    const modal = document.getElementById('lightbox-modal');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeLightbox);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeLightbox();
        });
        document.addEventListener('keydown', function(e) {
            if (modal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
                closeLightbox();
            }
        });
    }

    // Contact form validation and feedback
    const contactForm = document.querySelector('form[role="form"]');
    if (contactForm) {
        // Add feedback elements after each input
        const nameField = contactForm.querySelector('#name');
        const emailField = contactForm.querySelector('#email');
        const messageField = contactForm.querySelector('#message');

        let nameFeedback = document.createElement('div');
        nameFeedback.id = 'name-feedback';
        nameFeedback.style.color = 'red';
        nameFeedback.style.fontSize = '0.95em';
        nameFeedback.style.marginTop = '0.2em';
        nameFeedback.style.display = 'none';
        nameField.insertAdjacentElement('afterend', nameFeedback);

        let emailFeedback = document.createElement('div');
        emailFeedback.id = 'email-feedback';
        emailFeedback.style.color = 'red';
        emailFeedback.style.fontSize = '0.95em';
        emailFeedback.style.marginTop = '0.2em';
        emailFeedback.style.display = 'none';
        emailField.insertAdjacentElement('afterend', emailFeedback);

        let messageFeedback = document.createElement('div');
        messageFeedback.id = 'message-feedback';
        messageFeedback.style.color = 'red';
        messageFeedback.style.fontSize = '0.95em';
        messageFeedback.style.marginTop = '0.2em';
        messageFeedback.style.display = 'none';
        messageField.insertAdjacentElement('afterend', messageFeedback);

        function validateField(field, feedback, type) {
            let value = field.value.trim();
            let valid = true;
            let error = '';

            if (type === 'name') {
                if (!value) {
                    valid = false;
                    error = 'Please enter your name.';
                } else if (value.length < 2) {
                    valid = false;
                    error = 'Name must be at least 2 characters.';
                }
            } else if (type === 'email') {
                if (!value) {
                    valid = false;
                    error = 'Please enter your email address.';
                } else if (!value.includes('@')) {
                    valid = false;
                    error = 'Email must contain "@" symbol.';
                } else if (!value.includes('.')) {
                    valid = false;
                    error = 'Email must contain a period (".") after "@".';
                } else {
                    // Split email into parts for more detailed feedback
                    const [local, domain] = value.split('@');
                    if (!domain || domain.indexOf('.') === -1) {
                        valid = false;
                        error = 'Email must contain a period (".") after "@".';
                    } else {
                        const domainParts = domain.split('.');
                        const tld = domainParts[domainParts.length - 1];
                        if (tld.length < 2) {
                            valid = false;
                            error = 'Domain extension must be at least 2 characters.';
                        } else if (!/^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(value)) {
                            valid = false;
                            error = 'Please enter a valid email address (e.g., name@example.com).';
                        }
                    }
                }
            } else if (type === 'message') {
                if (!value) {
                    valid = false;
                    error = 'Please enter your message.';
                } else if (value.length < 10) {
                    valid = false;
                    error = 'Message must be at least 10 characters.';
                }
            }

            if (!valid) {
                feedback.textContent = error;
                feedback.style.display = 'block';
            } else {
                feedback.textContent = '';
                feedback.style.display = 'none';
            }
            return valid;
        }

        // Show feedback only on blur (when leaving the field)
        nameField.addEventListener('blur', function() {
            validateField(nameField, nameFeedback, 'name');
        });
        emailField.addEventListener('blur', function() {
            validateField(emailField, emailFeedback, 'email');
        });
        messageField.addEventListener('blur', function() {
            validateField(messageField, messageFeedback, 'message');
        });

        // Hide feedback on input (while typing)
        nameField.addEventListener('input', function() {
            nameFeedback.textContent = '';
            nameFeedback.style.display = 'none';
        });
        emailField.addEventListener('input', function() {
            emailFeedback.textContent = '';
            emailFeedback.style.display = 'none';
        });
        messageField.addEventListener('input', function() {
            messageFeedback.textContent = '';
            messageFeedback.style.display = 'none';
        });

        // Validate all fields and show feedback on submit
        contactForm.addEventListener('submit', function(e) {
            let valid = true;
            if (!validateField(nameField, nameFeedback, 'name')) valid = false;
            if (!validateField(emailField, emailFeedback, 'email')) valid = false;
            if (!validateField(messageField, messageFeedback, 'message')) valid = false;
            if (!valid) {
                e.preventDefault();
            } else {
                // Only allow actual submit if triggered by the button (not Enter in a field)
                if (
                    document.activeElement === contactForm.querySelector('button[type="submit"]')
                ) {
                    // Let the form submit (or show a success message if desired)
                    // e.preventDefault(); // Uncomment if you want to prevent actual submission
                    contactForm.reset();
                    nameFeedback.style.display = 'none';
                    emailFeedback.style.display = 'none';
                    messageFeedback.style.display = 'none';
                } else {
                    // Prevent submit if not from the button (e.g., Enter in a field)
                    e.preventDefault();
                    // Optionally move focus to the submit button
                    contactForm.querySelector('button[type="submit"]').focus();
                }
            }
        });

        // Validate on pressing Enter in any input except textarea
        [nameField, emailField].forEach(field => {
            field.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    // Move focus to next field, do not submit
                    e.preventDefault();
                    if (field === nameField) {
                        emailField.focus();
                    } else if (field === emailField) {
                        messageField.focus();
                    }
                }
            });
        });
    }
});

function filterProjects(category) {
    const articles = document.querySelectorAll('#projects article');
    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = '';
        } else {
            article.style.display = 'none';
        }
    });
}

function openLightbox(src, alt) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img) {
        img.src = src;
        img.alt = alt || '';
        modal.classList.add('active');
        modal.style.display = 'flex';
        img.focus();
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        img.src = '';
    }
}
