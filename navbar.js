/* GS Flooring — Navigation */

const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

// Sticky shadow on scroll
window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile hamburger toggle
if (navToggle) {
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('#navLinks a').forEach(function (link) {
    link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close menu on outside click
document.addEventListener('click', function (e) {
    if (navLinks && navLinks.classList.contains('open') &&
        !navbar.contains(e.target)) {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    }
});

