document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // ==========================================================================
    // Mobile Navigation Drawer Toggle
    // ==========================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Toggle body scroll locking when mobile menu is active
            if (isOpen) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close drawer when any nav link is selected
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // Header Scroll & Section-Aware Transparency Coloring
    // ==========================================================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    const handleHeaderTheme = () => {
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Check if section encompasses the header's sticky area (top 48px)
            if (rect.top <= 48 && rect.bottom >= 48) {
                currentSection = section;
            }
        });

        if (currentSection) {
            if (currentSection.classList.contains('dark-scene')) {
                header.classList.add('dark-nav');
            } else {
                header.classList.remove('dark-nav');
            }
        }
    };
    
    window.addEventListener('scroll', handleHeaderTheme);
    window.addEventListener('resize', handleHeaderTheme);
    handleHeaderTheme(); // Run initially

    // ==========================================================================
    // Active Link Tracking (Scroll Spy)
    // ==========================================================================
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25, // Active when at least 25% of section is visible
        rootMargin: '-48px 0px -25% 0px' // Offset by sticky header height
    });

    sections.forEach(section => {
        spyObserver.observe(section);
    });

    // ==========================================================================
    // Project Category Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class on filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategories = card.getAttribute('data-categories').split(' ');

                if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                    card.classList.remove('filtered-out');
                    // Small delay to trigger fade animation smoothly
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    // Match CSS transition length before hiding from layout
                    setTimeout(() => {
                        card.classList.add('filtered-out');
                    }, 400);
                }
            });
        });
    });

    // ==========================================================================
    // Contact Form Submission (FormSubmit API integration)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm ? contactForm.querySelector('.btn-submit') : null;

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            const submitBtnSpan = submitBtn.querySelector('span');
            if (submitBtnSpan) submitBtnSpan.textContent = 'Sending...';
            
            formStatus.className = 'form-status-msg';
            formStatus.textContent = '';

            // Post to Web3Forms JSON endpoint
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "56caa3ed-7e0a-43bc-9a0d-bc6474043f78",
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Web3Forms response was not ok");
            })
            .then(data => {
                showStatus('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                showStatus('Oops! Something went wrong. Please try again.', 'error');
                console.error("Error submitting form:", error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                if (submitBtnSpan) submitBtnSpan.textContent = 'Send Message';
            });
        });
    }

    const showStatus = (message, type) => {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status-msg ${type}`;
        }
    };

    // ==========================================================================
    // Reveal on Scroll
    // ==========================================================================
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // Hero reveals immediately
    document.querySelectorAll('#hero .reveal').forEach((el) => {
        requestAnimationFrame(() => el.classList.add('is-visible'));
    });

    // ==========================================================================
    // Dynamic Footer Year
    // ==========================================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
