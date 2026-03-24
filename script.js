'use strict';

// Elements
const loader = document.getElementById('loader');
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
const navToggler = document.querySelector('[data-nav-toggler]');
const navbar = document.querySelector('[data-navbar]');
const header = document.querySelector('[data-header]');
const backTopBtn = document.querySelector('[data-back-top-btn]');
const themeBtn = document.querySelector('[data-theme-btn]');
const htmlElement = document.documentElement;
const typingText = document.querySelector('.typing-text');
const revealElements = document.querySelectorAll('[data-reveal]');
const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');

// Loader
window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 1000));

// Cursor
if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Navigation
if (navToggler && navbar) {
    navToggler.addEventListener('click', () => navbar.classList.toggle('active'));
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navbar.classList.remove('active'));
    });
}

// Header & Back to top
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header?.classList.add('active');
        backTopBtn?.classList.add('active');
    } else {
        header?.classList.remove('active');
        backTopBtn?.classList.remove('active');
    }
});

// Theme
const themeDots = document.querySelectorAll('[data-theme-set]');
if (themeDots.length > 0) {
    let currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    
    const updateActiveDot = () => {
        themeDots.forEach(dot => {
            if(dot.getAttribute('data-theme-set') === currentTheme) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    updateActiveDot();
    
    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentTheme = dot.getAttribute('data-theme-set');
            htmlElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateActiveDot();
        });
    });
}

// Typing Flow
if (typingText) {
    const roles = ['Software Engineer', 'Full-Stack Developer', 'Tech Enthusiast'];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    const type = () => {
        const text = roles[roleIdx];
        typingText.textContent = text.substring(0, isDeleting ? charIdx - 1 : charIdx + 1);
        charIdx += isDeleting ? -1 : 1;

        let delay = isDeleting ? 40 : 100;
        if (!isDeleting && charIdx === text.length) {
            isDeleting = true;
            delay = 2000;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            delay = 500;
        }
        setTimeout(type, delay);
    };
    setTimeout(type, 1500);
}

// Reveal Animation
const scrollReveal = () => {
    revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight / 1.15) {
            const delay = el.getAttribute('data-reveal-delay');
            if (delay) setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            else el.classList.add('revealed');
        }
    });
};
window.addEventListener('scroll', scrollReveal);
window.addEventListener('load', scrollReveal);

// Copy Email
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('email-text').textContent)
            .then(() => {
                toast?.classList.add('active');
                setTimeout(() => toast?.classList.remove('active'), 3000);
            });
    });
}

// Year
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Contact Form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Show success state on button
            btn.innerHTML = '<span>Sent Successfully!</span> <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = '#10b981';
            btn.style.borderColor = '#10b981';
            
            // Show Toast
            if (toast) {
                const originalToastText = toast.textContent;
                toast.textContent = 'Message sent successfully!';
                toast.classList.add('active');
                
                setTimeout(() => {
                    toast.classList.remove('active');
                    setTimeout(() => {
                        toast.textContent = originalToastText;
                    }, 400); 
                }, 3000);
            }
            
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
            }, 3000);
        })
        .catch(error => {
            console.error(error);
            btn.innerHTML = '<span>Error Sending</span> <i class="fa-solid fa-xmark"></i>';
            btn.style.backgroundColor = '#ef4444';
            btn.style.borderColor = '#ef4444';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
            }, 3000);
        });
    });
}
