/**
 * MewX Homepage v4 - Modern Design
 * Created: 2026
 */

// Auto-scroll to content on paginated pages
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a paginated page (not the first page)
    const currentPath = window.location.pathname;
    
    // Check if URL contains /page2/, /page3/, etc. (without slash between 'page' and number)
    const isPaginatedPage = /\/page\d+\//.test(currentPath);
    
    if (isPaginatedPage) {
        // Wait a bit for the page to fully render
        setTimeout(() => {
            const contentSection = document.querySelector('.content-section');
            if (contentSection) {
                const offset = 80; // Account for fixed navbar
                const elementPosition = contentSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// SVG Logo Animation
const lineDrawing = anime({
    targets: '.lines path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: (el, i) => i * 250,
    direction: 'alternate',
    loop: false,
    complete: () => {
        // Fill animation
        anime({
            targets: ['#svg-m', '#svg-e', '#svg-w', '#svg-x'],
            fill: ['rgba(255,255,255,0)', '#FFFFFF'],
            duration: 800,
            easing: 'easeInOutQuad',
            delay: (el, i) => i * 100
        });
    }
});

// Hero Subtitle Animation
const subtitleElement = document.getElementById('heroSubtitle');
if (subtitleElement) {
    const text = subtitleElement.textContent;
    subtitleElement.innerHTML = text
        .split('')
        .map(char => `<span class="letter">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');

    anime.timeline({ loop: false })
        .add({
            targets: '#heroSubtitle',
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeInOutExpo',
            delay: 500
        })
        .add({
            targets: '#heroSubtitle .letter',
            opacity: [0, 1],
            translateY: [40, 0],
            translateZ: 0,
            easing: 'easeOutExpo',
            duration: 1200,
            delay: (el, i) => 50 * i,
            offset: '-=800'
        });
}

// Scroll Indicator
const scrollIndicator = document.getElementById('scrollIndicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.8';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// Animate cards on scroll
const observerOptions = {
    threshold: 0,
    rootMargin: '0px 0px 200px 0px' // Trigger 200px before the element enters viewport
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all post cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => observer.observe(card));
});

// Card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.post-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this.querySelector('.post-title'),
                scale: [1, 1.02, 1],
                duration: 400,
                easing: 'easeInOutQuad'
            });
        });
    });
});

// Pagination button animations
document.addEventListener('DOMContentLoaded', () => {
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(:disabled)');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                anime({
                    targets: icon,
                    translateX: [
                        { value: this.classList.contains('btn-prev') ? -5 : 5 },
                        { value: 0 }
                    ],
                    duration: 600,
                    easing: 'easeInOutQuad',
                    loop: true
                });
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                anime.remove(icon);
                icon.style.transform = 'translateX(0)';
            }
        });
    });
});

// Mobile menu toggle (placeholder for future implementation)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        // TODO: Implement mobile menu
        console.log('Mobile menu clicked');
    });
}

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
