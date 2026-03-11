/* ============================================================
   CATALINA GARCIA — main.js
   Handles: nav scroll, mobile menu, active links,
            scroll animations, contact form AJAX
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       DOM references
    ---------------------------------------------------------- */
    const navbar     = document.getElementById('navbar');
    const navToggle  = document.getElementById('navToggle');
    const navLinks   = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formStatus  = document.getElementById('formStatus');
    const submitBtn   = document.getElementById('submitBtn');

    /* ----------------------------------------------------------
       Navbar: shadow on scroll
    ---------------------------------------------------------- */
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateActiveNavLink();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ----------------------------------------------------------
       Mobile menu toggle
    ---------------------------------------------------------- */
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // Close menu when a nav link is clicked
    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('open') &&
            !navbar.contains(e.target)) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ----------------------------------------------------------
       Active nav link highlighting
    ---------------------------------------------------------- */
    function updateActiveNavLink() {
        const sections   = document.querySelectorAll('section[id]');
        const scrollTop  = window.scrollY + 100;

        sections.forEach(function (section) {
            const top    = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id     = section.getAttribute('id');
            const link   = document.querySelector('.nav-link[href="#' + id + '"]');
            if (link) {
                link.classList.toggle('active', scrollTop >= top && scrollTop < bottom);
            }
        });
    }

    /* ----------------------------------------------------------
       Scroll-triggered fade-up animations (IntersectionObserver)
    ---------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold:  0.08,
            rootMargin: '0px 0px -32px 0px'
        });

        document.querySelectorAll('.fade-up').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything immediately
        document.querySelectorAll('.fade-up').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ----------------------------------------------------------
       Contact form: AJAX submit
    ---------------------------------------------------------- */
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic client-side check
            const name    = contactForm.querySelector('[name="name"]').value.trim();
            const email   = contactForm.querySelector('[name="email"]').value.trim();
            const subject = contactForm.querySelector('[name="subject"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();

            if (!name || !email || !subject || !message) {
                showStatus('error', 'Please fill in all required fields.');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showStatus('error', 'Please enter a valid email address.');
                return;
            }

            // Loading state
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
            submitBtn.disabled  = true;
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            const formData = new FormData(contactForm);

            fetch('contact.php', {
                method: 'POST',
                body:   formData
            })
            .then(function (res) {
                if (!res.ok) { throw new Error('Network response was not ok'); }
                return res.json();
            })
            .then(function (data) {
                if (data.success) {
                    showStatus('success', data.message);
                    contactForm.reset();
                } else {
                    showStatus('error', data.message);
                }
            })
            .catch(function () {
                showStatus('error',
                    'Something went wrong. Please email me directly at ' +
                    '<a href="mailto:4catalinagarcia@gmail.com">4catalinagarcia@gmail.com</a>.');
            })
            .finally(function () {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled  = false;
            });
        });
    }

    function showStatus(type, message) {
        formStatus.className     = 'form-status ' + type;
        formStatus.innerHTML     = message;
        formStatus.style.display = 'block';
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ----------------------------------------------------------
       Initial call
    ---------------------------------------------------------- */
    updateActiveNavLink();

}());
