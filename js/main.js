/* ============================================================
   CATALINA GARCIA — main.js
   Handles: nav scroll, mobile menu, active links,
            scroll animations
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
       Initial call
    ---------------------------------------------------------- */
    updateActiveNavLink();

}());
