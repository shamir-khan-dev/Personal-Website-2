document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.getElementById('header');
    const nav = document.getElementById('site-nav');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.scene');
    const segments = document.querySelectorAll('.segment');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const yearSpan = document.getElementById('current-year');

    const WEB3FORMS_KEY = '56caa3ed-7e0a-43bc-9a0d-bc6474043f78';

    // ——— Mobile nav ———
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            menuToggle.classList.toggle('is-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            body.style.overflow = open ? 'hidden' : '';
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', closeMenu);
        });
    }

    function closeMenu() {
        if (!nav || !menuToggle) return;
        nav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        body.style.overflow = '';
    }

    // ——— Nav theme: light vs dark frosted bar ———
    function updateNavTheme() {
        if (!header) return;
        let overDark = false;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 44 && rect.bottom >= 44) {
                overDark = section.classList.contains('scene-dark');
            }
        });

        header.classList.toggle('is-dark', overDark);
    }

    window.addEventListener('scroll', updateNavTheme, { passive: true });
    window.addEventListener('resize', updateNavTheme);
    updateNavTheme();

    // ——— Scroll spy ———
    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    const match = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('is-active', match);
                    if (match) link.setAttribute('aria-current', 'page');
                    else link.removeAttribute('aria-current');
                });
            });
        },
        { threshold: 0.2, rootMargin: '-44px 0px -30% 0px' }
    );

    sections.forEach((s) => {
        if (s.id) spy.observe(s);
    });

    // ——— Reveal on scroll ———
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

    // ——— Project filters ———
    segments.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            segments.forEach((b) => {
                const active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', String(active));
            });

            projectCards.forEach((card) => {
                const cats = (card.getAttribute('data-categories') || '').split(' ');
                const show = filter === 'all' || cats.includes(filter);
                card.classList.toggle('is-hidden', !show);
            });
        });
    });

    // ——— Contact form ———
    if (contactForm && formStatus) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const submitLabel = submitBtn?.querySelector('span');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim() ?? '';
            const email = document.getElementById('email')?.value.trim() ?? '';
            const message = document.getElementById('message')?.value.trim() ?? '';

            formStatus.textContent = '';
            formStatus.className = 'form-status';

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.classList.add('error');
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            if (submitLabel) submitLabel.textContent = 'Sending…';

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_KEY,
                        name,
                        email,
                        message,
                    }),
                });

                if (!res.ok) throw new Error('Submit failed');

                formStatus.textContent = 'Thank you! Your message has been sent.';
                formStatus.classList.add('success');
                contactForm.reset();
            } catch (err) {
                console.error(err);
                formStatus.textContent = 'Something went wrong. Please try again.';
                formStatus.classList.add('error');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitLabel) submitLabel.textContent = 'Send Message';
            }
        });
    }

    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }
});
