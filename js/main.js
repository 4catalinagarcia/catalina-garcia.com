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

    /* ----------------------------------------------------------
       Card Media Sliders
    ---------------------------------------------------------- */
    document.querySelectorAll('.card-media-slider').forEach(function (slider) {
        var track = slider.querySelector('.card-media-track');
        var tabs  = slider.querySelectorAll('.slide-tab');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var showVideo = tab.dataset.slide === '1';
                track.classList.toggle('at-video', showVideo);
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                if (!showVideo) {
                    var vid = slider.querySelector('video');
                    if (vid) { vid.pause(); }
                }
            });
        });
    });

    /* ----------------------------------------------------------
       Lightbox
    ---------------------------------------------------------- */
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.lightbox-trigger').forEach(function (img) {
        img.addEventListener('click', function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) { closeLightbox(); }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeLightbox(); }
    });

}());
