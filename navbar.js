/*
 * Navigation bar animation functionality
 */

let lastScrollY = 0;
const header = document.querySelector('header');

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    
    /* Add scroll event listener for navbar animation on scroll */
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        /* Hide header when scrolling down, show when scrolling up */
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            /* Scrolling down */
            header.style.transform = 'translateY(-100%)';
        } else {
            /* Scrolling up */
            header.style.transform = 'translateY(0)';
        }

        /* Add scroll class for styling changes */
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });
    
    /* Add click animation for nav links */
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.forEach(function(otherLink) {
                otherLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});

