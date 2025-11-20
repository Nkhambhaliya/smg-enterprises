// Enhanced Single Page Website JS
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const toggle = document.querySelector('.nav-toggle');
    const navLinks_items = document.querySelectorAll('.nav-links a');
    
    // Smooth scrolling and mobile nav close
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeNav();
            }
        });
    });

    // Mobile navigation toggle
    function openNav() {
        navLinks.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.querySelector('i')?.classList.remove('fa-bars');
        toggle.querySelector('i')?.classList.add('fa-times');
    }
    
    function closeNav() {
        navLinks.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('i')?.classList.remove('fa-times');
        toggle.querySelector('i')?.classList.add('fa-bars');
    }

    // Toggle button click
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            if (expanded) closeNav();
            else openNav();
        });
    }

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            closeNav();
        }
    });

    // Close nav when clicking on a nav item
    navLinks_items.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Update active nav link based on current section
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks_items.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Skip link focus handling
    const skip = document.querySelector('.skip-link');
    if (skip) {
        skip.addEventListener('focus', () => {
            skip.style.position = 'fixed';
            skip.style.left = '1rem';
            skip.style.top = '1rem';
            skip.style.width = 'auto';
            skip.style.height = 'auto';
            skip.style.overflow = 'visible';
            skip.style.zIndex = '10000';
        });
        skip.addEventListener('blur', () => {
            skip.style.position = 'absolute';
            skip.style.left = '-9999px';
            skip.style.width = '1px';
            skip.style.height = '1px';
            skip.style.overflow = 'hidden';
        });
    }

    // Scroll animation for elements
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const observeAnimatedElements = (elements = document.querySelectorAll('.card, .feature-card, .service-card')) => {
        elements.forEach((el) => observer.observe(el));
    };

    observeAnimatedElements();

    // Form submission - mailto handler like original
    const form = document.querySelector('#contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim() || 'Contact Form Submission';
            const message = document.getElementById('message').value.trim();

            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
            );

            // Open the user's mail client as a fallback
            const mailto = `mailto:smgenterprises03@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            window.location.href = mailto;

            // Update status message
            const status = document.getElementById('form-status');
            status.textContent = 'Opening your email client to send this message — if nothing happens, please email smgenterprises03@gmail.com directly.';
            status.style.color = 'green';
            setTimeout(() => status.textContent = '', 8000);
        });
    }

    // Render product catalogue from inline data to support file:// usage
    const productsSection = document.querySelector('[data-products-json]');
    if (productsSection) {
        const createProductCard = (product) => {
            const card = document.createElement('div');
            card.className = 'product-card card';

            if (product.image) {
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.imageAlt || product.name;
                img.className = 'product-image';
                card.appendChild(img);
            }

            const title = document.createElement('h3');
            title.textContent = product.name;
            card.appendChild(title);

            if (product.description) {
                const p = document.createElement('p');
                p.textContent = product.description;
                card.appendChild(p);
            }

            if (Array.isArray(product.features) && product.features.length) {
                const ul = document.createElement('ul');
                ul.className = 'product-list';
                product.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    ul.appendChild(li);
                });
                card.appendChild(ul);
            }

            return card;
        };

        const renderError = () => {
            productsSection.innerHTML = `
                <div class="product-card card error-card">
                    <h3>Unable to load products</h3>
                    <p>Please refresh the page or visit our dedicated <a href="products.html">Products</a> page.</p>
                </div>
            `;
        };

        const productsData = Array.isArray(window.__SMG_PRODUCTS__) ? window.__SMG_PRODUCTS__ : null;
        if (!productsData || !productsData.length) {
            renderError();
            return;
        }

        productsSection.innerHTML = '';
        productsData.forEach(product => {
            const card = createProductCard(product);
            productsSection.appendChild(card);
        });

        observeAnimatedElements(productsSection.querySelectorAll('.card'));
    }
});