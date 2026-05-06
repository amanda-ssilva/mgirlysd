document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // --- Theme Management ---
    const currentTheme = localStorage.getItem('mgirlysd-theme') || 'light';
    
    // Apply theme on load
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('sun');
    } else {
        body.removeAttribute('data-theme');
        updateThemeIcon('moon');
    }

    themeToggle.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            localStorage.setItem('mgirlysd-theme', 'light');
            updateThemeIcon('moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('mgirlysd-theme', 'dark');
            updateThemeIcon('sun');
        }
    });

    function updateThemeIcon(iconName) {
        // Since we are using Lucide, we need to replace the icon manually or re-run lucide.createIcons
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', iconName);
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    // --- Mobile Menu Management ---
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        sidebar.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (sidebar.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'visible';
        }
    });

    // --- Carousel Management ---
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
        resetInterval();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    // Start auto-play
    resetInterval();

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const status = document.getElementById('form-status');
            const data = new FormData(contactForm);
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span>';
            status.textContent = 'Enviando sua mensagem...';
            status.className = 'form-status';

            fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.textContent = 'E-mail enviado com sucesso! ✨';
                    status.className = 'form-status success';
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Enviar Mensagem</span>';
                } else {
                    // Se o AJAX falhar, tentamos o envio tradicional como backup
                    contactForm.submit();
                }
            }).catch(error => {
                // Em caso de erro de rede (comum em arquivos locais), usamos o envio tradicional
                contactForm.submit();
            });
        });
    }

    // --- Login Form Handling ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            alert(`Bem-vinda de volta! Acesso simulado para: ${email}`);
            loginForm.reset();
        });
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            sidebar.classList.remove('active');
            body.style.overflow = 'visible';
        });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            menuBtn.classList.remove('active');
            sidebar.classList.remove('active');
            body.style.overflow = 'visible';
        }
    });
});
