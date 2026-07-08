/*
=================================================================
  TOMORO COFFEE BANGKA - MAIN JAVASCRIPT
  Version: 1.0.0
  Author: Professional Web Developer
  Description: Core Functionality & Interactions
=================================================================
*/

/* =================================================================
   TABLE OF CONTENTS
   =================================================================
   1. Strict Mode & Constants
   2. DOM Elements
   3. Utility Functions
   4. Preloader
   5. Navigation
   6. Search Modal
   7. Scroll Effects
   8. Hero Section
   9. Menu Filter
   10. Gallery Filter
   11. Testimonials Slider
   12. Counter Animation
   13. Form Handling
   14. Smooth Scroll
   15. Scroll to Top
   16. WhatsApp Float
   17. Lazy Loading
   18. Dark Mode (Optional)
   19. LocalStorage Helpers
   20. Initialize App
================================================================= */

'use strict';

/* =================================================================
   1. STRICT MODE & CONSTANTS
================================================================= */

// Configuration Constants
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 100,
    navScrollThreshold: 50,
    lazyLoadOffset: 100,
    counterSpeed: 2000,
    sliderAutoplaySpeed: 5000,
    debounceDelay: 250,
    throttleDelay: 100,
    toastDuration: 3000,
    mobileBreakpoint: 992,
};

// API Endpoints (if needed)
const API = {
    contact: '/api/contact',
    reservation: '/api/reservation',
    newsletter: '/api/newsletter',
};

// State Management
const STATE = {
    isMenuOpen: false,
    isSearchOpen: false,
    isScrolled: false,
    currentSlide: 0,
    isLoading: true,
    cartItems: [],
    theme: 'light',
};

/* =================================================================
   2. DOM ELEMENTS
================================================================= */

const DOM = {
    // Main Elements
    body: document.body,
    html: document.documentElement,

    // Preloader
    preloader: document.getElementById('preloader'),

    // Navigation
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('navMenu'),
    navToggle: document.getElementById('navToggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    navOverlay: document.getElementById('navOverlay'),

    // Search
    searchModal: document.getElementById('searchModal'),
    searchBtn: document.querySelector('.search-btn'),
    searchClose: document.getElementById('searchClose'),
    searchInput: document.querySelector('.search-input'),

    // Cart
    cartBtn: document.querySelector('.cart-btn'),
    cartCount: document.querySelector('.cart-count'),

    // Hero
    heroSection: document.getElementById('home'),
    heroBg: document.querySelector('.hero-bg'),

    // Menu
    menuFilterBtns: document.querySelectorAll('.filter-btn'),
    menuItems: document.querySelectorAll('.menu-item'),
    menuGrid: document.querySelector('.menu-grid'),

    // Gallery
    galleryFilterBtns: document.querySelectorAll('.gallery-filter-btn'),
    galleryItems: document.querySelectorAll('.gallery-item'),
    galleryGrid: document.querySelector('.gallery-grid'),

    // Testimonials
    testimonialTrack: document.querySelector('.testimonial-track'),
    testimonialCards: document.querySelectorAll('.testimonial-card'),
    sliderPrevBtn: document.querySelector('.prev-btn'),
    sliderNextBtn: document.querySelector('.next-btn'),
    sliderDots: document.querySelector('.slider-dots'),

    // Stats Counter
    statNumbers: document.querySelectorAll('.stat-number'),

    // Forms
    contactForm: document.getElementById('contactForm'),

    // Scroll Elements
    scrollToTopBtn: document.getElementById('scrollToTop'),
    whatsappFloat: document.querySelector('.whatsapp-float'),

    // Sections
    sections: document.querySelectorAll('section[id]'),
};

/* =================================================================
   3. UTILITY FUNCTIONS
================================================================= */

const Utils = {
    /**
     * Debounce function - limits rate of function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait = CONFIG.debounceDelay) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function - ensures function called at most once per interval
     * @param {Function} func - Function to throttle
     * @param {number} limit - Minimum time between calls
     * @returns {Function} Throttled function
     */
    throttle(func, limit = CONFIG.throttleDelay) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} offset - Offset from viewport edge
     * @returns {boolean}
     */
    isInViewport(element, offset = 0) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= offset
        );
    },

    /**
     * Get scroll position
     * @returns {number} Current scroll position
     */
    getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    },

    /**
     * Smooth scroll to element
     * @param {string} target - Selector or element ID
     * @param {number} offset - Offset from top
     */
    scrollTo(target, offset = CONFIG.scrollOffset) {
        const element = document.querySelector(target);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Add class to element
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class to add
     */
    addClass(element, className) {
        if (element) element.classList.add(className);
    },

    /**
     * Remove class from element
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class to remove
     */
    removeClass(element, className) {
        if (element) element.classList.remove(className);
    },

    /**
     * Toggle class on element
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class to toggle
     */
    toggleClass(element, className) {
        if (element) element.classList.toggle(className);
    },

    /**
     * Check if element has class
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class to check
     * @returns {boolean}
     */
    hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    },

    /**
     * Generate random ID
     * @param {number} length - Length of ID
     * @returns {string}
     */
    generateId(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
    },

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} locale - Locale string
     * @param {string} currency - Currency code
     * @returns {string}
     */
    formatCurrency(amount, locale = 'id-ID', currency = 'IDR') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount);
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate phone number
     * @param {string} phone - Phone to validate
     * @returns {boolean}
     */
    isValidPhone(phone) {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return regex.test(phone);
    },

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Type of toast (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${this.getToastColor(type)};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            animation: toastSlideIn 0.4s ease-out;
        `;

        // Append to body
        document.body.appendChild(toast);

        // Close button event
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, CONFIG.toastDuration);
    },

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    getToastColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    },

    /**
     * Check if device is mobile
     * @returns {boolean}
     */
    isMobile() {
        return window.innerWidth < CONFIG.mobileBreakpoint;
    },

    /**
     * Check if device supports touch
     * @returns {boolean}
     */
    isTouchDevice() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
    },

    /**
     * Animate number counter
     * @param {HTMLElement} element - Element to animate
     * @param {number} start - Start number
     * @param {number} end - End number
     * @param {number} duration - Animation duration
     */
    animateCounter(element, start, end, duration = CONFIG.counterSpeed) {
        if (!element) return;

        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuad = progress * (2 - progress);

            const current = Math.round(start + (difference * easeOutQuad));
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = end.toLocaleString() + '+';
            }
        };

        requestAnimationFrame(step);
    },

    /**
     * Load image with promise
     * @param {string} src - Image source
     * @returns {Promise}
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Get query parameter from URL
     * @param {string} param - Parameter name
     * @returns {string|null}
     */
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },
};

/* =================================================================
   4. PRELOADER
================================================================= */

const Preloader = {
    init() {
        this.preloader = DOM.preloader;
        if (!this.preloader) return;

        // Wait for page load
        window.addEventListener('load', () => {
            this.hide();
        });

        // Fallback - hide after 5 seconds max
        setTimeout(() => {
            this.hide();
        }, 5000);
    },

    hide() {
        if (!this.preloader) return;

        setTimeout(() => {
            Utils.addClass(this.preloader, 'hidden');
            STATE.isLoading = false;

            // Enable scroll
            Utils.removeClass(DOM.body, 'no-scroll');

            // Remove preloader from DOM after animation
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.parentNode.removeChild(this.preloader);
                }
            }, 500);

            // Initialize animations after preloader
            this.onComplete();
        }, 500);
    },

    onComplete() {
        // Trigger entrance animations
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
    },

    show() {
        if (!this.preloader) return;
        Utils.removeClass(this.preloader, 'hidden');
        STATE.isLoading = true;
    }
};

/* =================================================================
   5. NAVIGATION
================================================================= */

const Navigation = {
    init() {
        this.navbar = DOM.navbar;
        this.navMenu = DOM.navMenu;
        this.navToggle = DOM.navToggle;
        this.navLinks = DOM.navLinks;
        this.navOverlay = DOM.navOverlay;

        if (!this.navbar) return;

        this.bindEvents();
        this.checkScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (STATE.isMenuOpen &&
                !this.navMenu.contains(e.target) &&
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu when overlay is clicked (explicit handler)
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeMenu());
        }

        // Scroll event for navbar
        window.addEventListener('scroll', Utils.throttle(() => {
            this.checkScroll();
            this.updateActiveLink();
        }));

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth >= CONFIG.mobileBreakpoint && STATE.isMenuOpen) {
                this.closeMenu();
            }
        }));
    },

    toggleMenu() {
        STATE.isMenuOpen = !STATE.isMenuOpen;

        Utils.toggleClass(this.navMenu, 'active');
        Utils.toggleClass(this.navToggle, 'active');
        Utils.toggleClass(DOM.body, 'menu-open');
        Utils.toggleClass(this.navOverlay, 'active');

        // Toggle aria-expanded
        this.navToggle.setAttribute('aria-expanded', STATE.isMenuOpen);

        // Animate menu items
        if (STATE.isMenuOpen) {
            this.animateMenuItems();
        }
    },

    openMenu() {
        STATE.isMenuOpen = true;
        Utils.addClass(this.navMenu, 'active');
        Utils.addClass(this.navToggle, 'active');
        Utils.addClass(DOM.body, 'menu-open');
        if (this.navOverlay) Utils.addClass(this.navOverlay, 'active');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.animateMenuItems();
    },

    closeMenu() {
        STATE.isMenuOpen = false;
        Utils.removeClass(this.navMenu, 'active');
        Utils.removeClass(this.navToggle, 'active');
        Utils.removeClass(DOM.body, 'menu-open');
        if (this.navOverlay) Utils.removeClass(this.navOverlay, 'active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    },


    openMenu() {
        STATE.isMenuOpen = true;
        Utils.addClass(this.navMenu, 'active');
        Utils.addClass(this.navToggle, 'active');
        Utils.addClass(DOM.body, 'menu-open');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.animateMenuItems();
    },

    closeMenu() {
        STATE.isMenuOpen = false;
        Utils.removeClass(this.navMenu, 'active');
        Utils.removeClass(this.navToggle, 'active');
        Utils.removeClass(DOM.body, 'menu-open');
        this.navToggle.setAttribute('aria-expanded', 'false');
    },

    animateMenuItems() {
        const items = this.navMenu.querySelectorAll('.nav-item');
        items.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = `fadeInRight 0.3s ease forwards ${index * 0.05}s`;
        });
    },

    handleNavClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');

        // If it's an anchor link
        if (href.startsWith('#')) {
            e.preventDefault();

            // Close mobile menu
            if (STATE.isMenuOpen) {
                this.closeMenu();
            }

            // Scroll to section
            setTimeout(() => {
                Utils.scrollTo(href);
            }, STATE.isMenuOpen ? 300 : 0);
        }
    },

    checkScroll() {
        const scrollPosition = Utils.getScrollPosition();

        if (scrollPosition > CONFIG.navScrollThreshold) {
            if (!STATE.isScrolled) {
                STATE.isScrolled = true;
                Utils.addClass(this.navbar, 'scrolled');
            }
        } else {
            if (STATE.isScrolled) {
                STATE.isScrolled = false;
                Utils.removeClass(this.navbar, 'scrolled');
            }
        }
    },

    updateActiveLink() {
        const scrollPosition = Utils.getScrollPosition();

        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset - 50;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight) {
                // Remove active from all links
                this.navLinks.forEach(link => {
                    Utils.removeClass(link, 'active');
                });

                // Add active to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    Utils.addClass(activeLink, 'active');
                }
            }
        });
    }
};

/* =================================================================
   6. SEARCH MODAL
================================================================= */

const SearchModal = {
    init() {
        this.modal = DOM.searchModal;
        this.openBtn = DOM.searchBtn;
        this.closeBtn = DOM.searchClose;
        this.input = DOM.searchInput;

        if (!this.modal) return;

        this.bindEvents();
    },

    bindEvents() {
        // Open search
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.open());
        }

        // Close search
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.isSearchOpen) {
                this.close();
            }
        });

        // Search form submit
        const searchForm = this.modal.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }
    },

    open() {
        STATE.isSearchOpen = true;
        Utils.addClass(this.modal, 'active');
        Utils.addClass(DOM.body, 'modal-open');

        // Focus input
        setTimeout(() => {
            if (this.input) this.input.focus();
        }, 300);
    },

    close() {
        STATE.isSearchOpen = false;
        Utils.removeClass(this.modal, 'active');
        Utils.removeClass(DOM.body, 'modal-open');

        // Clear input
        if (this.input) this.input.value = '';
    },

    handleSearch(e) {
        e.preventDefault();
        const query = this.input.value.trim();

        if (query.length < 2) {
            Utils.showToast('Please enter at least 2 characters', 'warning');
            return;
        }

        // Here you would implement actual search
        console.log('Searching for:', query);
        Utils.showToast(`Searching for "${query}"...`, 'info');

        // Close modal
        this.close();
    }
};

/* =================================================================
   7. SCROLL EFFECTS
================================================================= */

const ScrollEffects = {
    init() {
        this.bindEvents();
        this.initParallax();
    },

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }));
    },

    handleScroll() {
        const scrollPosition = Utils.getScrollPosition();

        // Parallax effect for hero
        if (DOM.heroBg && !Utils.isMobile()) {
            const speed = 0.5;
            DOM.heroBg.style.transform = `translateY(${scrollPosition * speed}px)`;
        }

        // Reveal animations
        this.revealElements();
    },

    initParallax() {
        // Disable parallax on mobile
        if (Utils.isMobile() || Utils.isTouchDevice()) {
            document.querySelectorAll('.parallax-bg').forEach(el => {
                el.style.backgroundAttachment = 'scroll';
            });
        }
    },

    revealElements() {
        const reveals = document.querySelectorAll('.scroll-reveal:not(.revealed)');

        reveals.forEach(element => {
            if (Utils.isInViewport(element, 100)) {
                Utils.addClass(element, 'revealed');
            }
        });
    }
};

/* =================================================================
   8. HERO SECTION
================================================================= */

const HeroSection = {
    init() {
        this.hero = DOM.heroSection;
        if (!this.hero) return;

        this.initFloatingElements();
        this.initTypingEffect();
    },

    initFloatingElements() {
        // Add random movement to floating coffee beans
        const beans = document.querySelectorAll('.coffee-bean');

        beans.forEach((bean, index) => {
            const randomDelay = Math.random() * 5;
            const randomDuration = 15 + Math.random() * 10;

            bean.style.animationDelay = `${randomDelay}s`;
            bean.style.animationDuration = `${randomDuration}s`;
        });
    },

    initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const text = typingElement.textContent;
        typingElement.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start typing after preloader
        document.addEventListener('preloaderComplete', () => {
            setTimeout(typeWriter, 500);
        });
    }
};

/* =================================================================
   9. MENU FILTER
================================================================= */

const MenuFilter = {
    init() {
        this.filterBtns = DOM.menuFilterBtns;
        this.menuItems = DOM.menuItems;
        this.menuGrid = DOM.menuGrid;

        if (!this.filterBtns.length || !this.menuItems.length) return;

        this.currentFilter = 'all';
        this.bindEvents();
    },

    bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveButton(btn);
                this.filterItems(filter);
            });
        });
    },

    setActiveButton(activeBtn) {
        this.filterBtns.forEach(btn => {
            Utils.removeClass(btn, 'active');
        });
        Utils.addClass(activeBtn, 'active');
    },

    filterItems(filter) {
        this.currentFilter = filter;

        // Add fade out animation
        this.menuItems.forEach(item => {
            item.style.animation = 'fadeOut 0.3s ease forwards';
        });

        // After fade out, filter and fade in
        setTimeout(() => {
            this.menuItems.forEach((item, index) => {
                const categories = item.dataset.category;

                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                } else {
                    item.style.display = 'none';
                }
            });
        }, 300);
    },

    // Reset filter to show all items
    reset() {
        this.filterItems('all');
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) {
            this.setActiveButton(allBtn);
        }
    }
};

/* =================================================================
   10. GALLERY FILTER
================================================================= */

const GalleryFilter = {
    init() {
        this.filterBtns = DOM.galleryFilterBtns;
        this.galleryItems = DOM.galleryItems;
        this.galleryGrid = DOM.galleryGrid;

        if (!this.filterBtns.length || !this.galleryItems.length) return;

        this.currentFilter = 'all';
        this.bindEvents();
        this.initLightbox();
    },

    bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveButton(btn);
                this.filterItems(filter);
            });
        });

        // Gallery item click for lightbox
        this.galleryItems.forEach(item => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    if (img) this.openLightbox(img.src, img.alt);
                });
            }
        });
    },

    setActiveButton(activeBtn) {
        this.filterBtns.forEach(btn => {
            Utils.removeClass(btn, 'active');
        });
        Utils.addClass(activeBtn, 'active');
    },

    filterItems(filter) {
        this.currentFilter = filter;

        this.galleryItems.forEach((item, index) => {
            const category = item.dataset.category;

            item.style.animation = 'fadeOut 0.3s ease forwards';

            setTimeout(() => {
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = `zoomIn 0.5s ease forwards ${index * 0.1}s`;
                } else {
                    item.style.display = 'none';
                }
            }, 300);
        });
    },

    initLightbox() {
        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">
                    <i class="fas fa-times"></i>
                </button>
                <img src="" alt="" class="lightbox-image">
                <p class="lightbox-caption"></p>
            </div>
        `;

        // Add styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(lightbox);
        this.lightbox = lightbox;

        // Close events
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox();
        });
    },

    openLightbox(src, alt) {
        const img = this.lightbox.querySelector('.lightbox-image');
        const caption = this.lightbox.querySelector('.lightbox-caption');

        img.src = src;
        img.alt = alt;
        caption.textContent = alt;

        this.lightbox.style.opacity = '1';
        this.lightbox.style.visibility = 'visible';
        Utils.addClass(DOM.body, 'modal-open');
    },

    closeLightbox() {
        this.lightbox.style.opacity = '0';
        this.lightbox.style.visibility = 'hidden';
        Utils.removeClass(DOM.body, 'modal-open');
    }
};

/* =================================================================
   11. TESTIMONIALS SLIDER
================================================================= */

const TestimonialsSlider = {
    init() {
        this.track = DOM.testimonialTrack;
        this.cards = DOM.testimonialCards;
        this.prevBtn = DOM.sliderPrevBtn;
        this.nextBtn = DOM.sliderNextBtn;
        this.dotsContainer = DOM.sliderDots;

        if (!this.track || !this.cards.length) return;

        this.currentSlide = 0;
        this.totalSlides = this.cards.length;
        this.isAutoplay = true;
        this.autoplayInterval = null;

        this.bindEvents();
        this.createDots();
        this.startAutoplay();
    },

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });

        // Pause autoplay on hover
        this.track.addEventListener('mouseenter', () => {
            this.pauseAutoplay();
        });

        this.track.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    },

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoplay();
            });
            this.dotsContainer.appendChild(dot);
        }

        this.dots = this.dotsContainer.querySelectorAll('.slider-dot');
    },

    updateDots() {
        if (!this.dots) return;

        this.dots.forEach((dot, index) => {
            Utils.removeClass(dot, 'active');
            if (index === this.currentSlide) {
                Utils.addClass(dot, 'active');
            }
        });
    },

    goToSlide(index) {
        if (index < 0) {
            this.currentSlide = this.totalSlides - 1;
        } else if (index >= this.totalSlides) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = index;
        }

        this.updateSlider();
        this.updateDots();
    },

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },

    updateSlider() {
        // For grid layout, we'll highlight current card
        this.cards.forEach((card, index) => {
            Utils.removeClass(card, 'active');
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });

        const activeCard = this.cards[this.currentSlide];
        if (activeCard) {
            Utils.addClass(activeCard, 'active');
            activeCard.style.transform = 'scale(1.02)';
        }
    },

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.resetAutoplay();
        }
    },

    startAutoplay() {
        if (!this.isAutoplay) return;

        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, CONFIG.sliderAutoplaySpeed);
    },

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    },

    resetAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }
};

/* =================================================================
   12. COUNTER ANIMATION
================================================================= */

const CounterAnimation = {
    init() {
        this.counters = DOM.statNumbers;
        if (!this.counters.length) return;

        this.animated = false;
        this.bindEvents();
    },

    bindEvents() {
        // Check on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.checkVisibility();
        }));

        // Check on load
        this.checkVisibility();
    },

    checkVisibility() {
        if (this.animated) return;

        const firstCounter = this.counters[0];
        if (firstCounter && Utils.isInViewport(firstCounter, 100)) {
            this.animate();
            this.animated = true;
        }
    },

    animate() {
        this.counters.forEach(counter => {
            const text = counter.textContent;
            const value = parseFloat(text.replace(/[^0-9.]/g, ''));

            if (!isNaN(value)) {
                Utils.animateCounter(counter, 0, value, CONFIG.counterSpeed);
            }
        });
    }
};

/* =================================================================
   13. FORM HANDLING
================================================================= */

const FormHandler = {
    init() {
        this.contactForm = DOM.contactForm;
        if (!this.contactForm) return;

        this.bindEvents();
        this.initValidation();
    },

    bindEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    initValidation() {
        // Add novalidate to use custom validation
        this.contactForm.setAttribute('novalidate', true);
    },

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let message = '';

        // Required check
        if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        else if (type === 'email' && value && !Utils.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }

        // Phone validation
        else if (type === 'tel' && value && !Utils.isValidPhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        // Minimum length
        else if (field.minLength > 0 && value.length < field.minLength) {
            isValid = false;
            message = `Minimum ${field.minLength} characters required`;
        }

        // Show/hide error
        if (!isValid) {
            this.showError(field, message);
        } else {
            this.clearError(field);
        }

        return isValid;
    },

    showError(field, message) {
        Utils.addClass(field, 'error');

        // Create or update error message
        let errorEl = field.parentNode.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.cssText = `
                color: #dc3545;
                font-size: 0.75rem;
                margin-top: 0.25rem;
                display: block;
            `;
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    },

    clearError(field) {
        Utils.removeClass(field, 'error');
        const errorEl = field.parentNode.querySelector('.error-message');
        if (errorEl) errorEl.remove();
    },

    validateForm() {
        const fields = this.contactForm.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            Utils.showToast('Please fix the errors in the form', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateSubmit(data);

            // Success
            Utils.showToast('Reservation submitted successfully! We will contact you soon.', 'success');
            this.contactForm.reset();

        } catch (error) {
            // Error
            Utils.showToast('Something went wrong. Please try again.', 'error');
            console.error('Form submission error:', error);

        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    simulateSubmit(data) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('Form submitted:', data);
                // Simulate success (90% chance)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }
};

/* =================================================================
   14. SMOOTH SCROLL
================================================================= */

const SmoothScroll = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // All anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if just # or special anchors
                if (href === '#' || href === '#!') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    Utils.scrollTo(href);
                }
            });
        });
    }
};

/* =================================================================
   15. SCROLL TO TOP
================================================================= */

const ScrollToTop = {
    init() {
        this.button = DOM.scrollToTopBtn;
        if (!this.button) return;

        this.bindEvents();
    },

    bindEvents() {
        // Show/hide button based on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.toggleVisibility();
        }));

        // Click to scroll
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    toggleVisibility() {
        const scrollPosition = Utils.getScrollPosition();

        if (scrollPosition > 500) {
            Utils.addClass(this.button, 'show');
        } else {
            Utils.removeClass(this.button, 'show');
        }
    }
};

/* =================================================================
   16. WHATSAPP FLOAT
================================================================= */

const WhatsAppFloat = {
    init() {
        this.button = DOM.whatsappFloat;
        if (!this.button) return;

        this.bindEvents();
    },

    bindEvents() {
        // Hide on scroll down, show on scroll up
        let lastScroll = 0;

        window.addEventListener('scroll', Utils.throttle(() => {
            const currentScroll = Utils.getScrollPosition();

            if (currentScroll > lastScroll && currentScroll > 500) {
                // Scrolling down
                this.button.style.transform = 'translateX(100px)';
            } else {
                // Scrolling up
                this.button.style.transform = 'translateX(0)';
            }

            lastScroll = currentScroll;
        }));
    }
};

/* =================================================================
   17. LAZY LOADING
================================================================= */

const LazyLoad = {
    init() {
        this.images = document.querySelectorAll('img[data-src]');
        if (!this.images.length) return;

        if ('IntersectionObserver' in window) {
            this.initObserver();
        } else {
            this.loadAll();
        }
    },

    initObserver() {
        const options = {
            root: null,
            rootMargin: `${CONFIG.lazyLoadOffset}px`,
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => {
            this.observer.observe(img);
        });
    },

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Add loading class
        Utils.addClass(img, 'loading');

        // Load image
        Utils.loadImage(src)
            .then(() => {
                img.src = src;
                Utils.removeClass(img, 'loading');
                Utils.addClass(img, 'loaded');
                img.removeAttribute('data-src');
            })
            .catch(() => {
                console.error('Failed to load image:', src);
                Utils.removeClass(img, 'loading');
            });
    },

    loadAll() {
        this.images.forEach(img => this.loadImage(img));
    }
};

/* =================================================================
   18. DARK MODE (Optional)
================================================================= */

const DarkMode = {
    init() {
        this.toggle = document.querySelector('.dark-mode-toggle');
        this.storageKey = 'tomoro_theme';

        // Check saved preference
        this.checkSavedPreference();

        // Check system preference
        this.checkSystemPreference();

        if (this.toggle) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleTheme());
    },

    checkSavedPreference() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            STATE.theme = saved;
            this.applyTheme(saved);
        }
    },

    checkSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!localStorage.getItem(this.storageKey)) {
                STATE.theme = 'dark';
                this.applyTheme('dark');
            }
        }

        // Listen for changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(this.storageKey)) {
                const theme = e.matches ? 'dark' : 'light';
                STATE.theme = theme;
                this.applyTheme(theme);
            }
        });
    },

    toggleTheme() {
        STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(STATE.theme);
        localStorage.setItem(this.storageKey, STATE.theme);
    },

    applyTheme(theme) {
        if (theme === 'dark') {
            Utils.addClass(DOM.body, 'dark-mode');
        } else {
            Utils.removeClass(DOM.body, 'dark-mode');
        }

        // Update toggle icon if exists
        if (this.toggle) {
            const icon = this.toggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
};

/* =================================================================
   19. LOCALSTORAGE HELPERS
================================================================= */

const Storage = {
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage set error:', e);
        }
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*}
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage remove error:', e);
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Storage clear error:', e);
        }
    }
};

/* =================================================================
   BRANCH TABS FUNCTIONALITY
================================================================= */

const BranchTabs = {
    tabs: null,
    contents: null,

    init() {
        this.tabs = document.querySelectorAll('.branch-tab');
        this.contents = document.querySelectorAll('.branch-content');

        if (!this.tabs.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const branch = tab.dataset.branch;
                this.switchBranch(branch);
            });
        });
    },

    switchBranch(branch) {
        // Update tabs
        this.tabs.forEach(tab => {
            if (tab.dataset.branch === branch) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update content
        this.contents.forEach(content => {
            if (content.id === `branch-${branch}`) {
                content.classList.add('active');
                // Trigger AOS refresh for new content
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            } else {
                content.classList.remove('active');
            }
        });

        // Scroll to location section
        const locationSection = document.getElementById('location');
        if (locationSection) {
            const offset = 100;
            const elementPosition = locationSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Global function for onclick
function switchBranch(branch) {
    BranchTabs.switchBranch(branch);
}

/* =================================================================
   RESERVATION FORM HANDLER (UPDATED)
================================================================= */

/**
 * Handle reservation form submission
 * @param {Event} event - Form submit event
 * @returns {boolean}
 */
function handleReservationSubmit(event) {
    event.preventDefault();

    const form = event.target;

    // Validate form
    if (!validateReservationForm(form)) {
        return false;
    }

    // Collect form data
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        date: form.date.value,
        time: form.time.value,
        guests: form.guests.value,
        message: form.message.value.trim(),
        timestamp: new Date().toISOString()
    };

    // Store in sessionStorage
    try {
        sessionStorage.setItem('tomoroReservation', JSON.stringify(formData));
        console.log('Reservation data saved:', formData);
    } catch (error) {
        console.error('Error saving reservation data:', error);
        showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
        return false;
    }

    // Show loading state
    const submitBtn = form.querySelector('#submitBtn');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Memproses...</span>';
    submitBtn.disabled = true;

    // Redirect to reservation page
    setTimeout(() => {
        window.location.href = 'reservation.html';
    }, 800);

    return false;
}

/**
 * Validate reservation form
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean}
 */
function validateReservationForm(form) {
    let isValid = true;
    const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'guests'];

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    // Validate each field
    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        const value = field.value.trim();
        const group = field.closest('.form-group');
        const errorText = group.querySelector('.error-text');

        // Required check
        if (!value) {
            isValid = false;
            group.classList.add('error');
            if (errorText) errorText.textContent = 'Field ini wajib diisi';
            return;
        }

        // Specific validations
        if (fieldName === 'email' && !isValidEmail(value)) {
            isValid = false;
            group.classList.add('error');
            if (errorText) errorText.textContent = 'Format email tidak valid';
        }

        if (fieldName === 'phone' && !isValidPhone(value)) {
            isValid = false;
            group.classList.add('error');
            if (errorText) errorText.textContent = 'Format nomor telepon tidak valid';
        }

        if (fieldName === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                isValid = false;
                group.classList.add('error');
                if (errorText) errorText.textContent = 'Tanggal tidak boleh kurang dari hari ini';
            }
        }

        if (fieldName === 'name' && value.length < 3) {
            isValid = false;
            group.classList.add('error');
            if (errorText) errorText.textContent = 'Nama minimal 3 karakter';
        }
    });

    if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        showToast('Mohon lengkapi semua field yang wajib diisi', 'error');
    }

    return isValid;
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate phone format
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
    // Indonesian phone number format
    const regex = /^(\+62|62|0)[0-9]{9,13}$/;
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return regex.test(cleaned);
}

/**
 * Show toast notification
 * @param {string} message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    // Icons for different types
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    // Colors for different types
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: toastSlideIn 0.4s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-width: 400px;
    `;

    document.body.appendChild(toast);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });

    // Auto remove
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

/**
 * Set minimum date for date input
 */
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setMinDate();

    // Real-time validation
    const form = document.getElementById('contactForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            // Remove error on input
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) {
                    group.classList.remove('error');
                    const errorText = group.querySelector('.error-text');
                    if (errorText) errorText.textContent = '';
                }
            });

            // Validate on blur
            input.addEventListener('blur', () => {
                if (input.required && !input.value.trim()) {
                    const group = input.closest('.form-group');
                    if (group) {
                        group.classList.add('error');
                        const errorText = group.querySelector('.error-text');
                        if (errorText) errorText.textContent = 'Field ini wajib diisi';
                    }
                }
            });
        });
    }
});

// Initialize in App.start()
// Add this line: BranchTabs.init();

/* =================================================================
   20. INITIALIZE APP
================================================================= */

const App = {
    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },

    start() {
        console.log('%c🚀 Tomoro Coffee Bangka', 'font-size: 24px; font-weight: bold; color: #8B4513;');
        console.log('%cInitializing application...', 'color: #666;');

        // Core modules
        Preloader.init();
        Navigation.init();
        SearchModal.init();
        SmoothScroll.init();
        ScrollToTop.init();

        // Feature modules
        ScrollEffects.init();
        HeroSection.init();
        MenuFilter.init();
        GalleryFilter.init();
        TestimonialsSlider.init();
        CounterAnimation.init();
        FormHandler.init();
        WhatsAppFloat.init();
        LazyLoad.init();
        DarkMode.init();

        // Branch Tabs (NEW)
        BranchTabs.init();

        // Performance optimizations
        this.optimizePerformance();

        // Event listeners
        this.bindGlobalEvents();

        console.log('%c✅ Application initialized successfully!', 'color: #28a745;');
    },

    optimizePerformance() {
        // Preload critical images
        const criticalImages = [
            './assets/images/hero-bg.jpg',
            './assets/images/logo.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Add passive listeners for better scroll performance
        const passiveSupported = (() => {
            let supported = false;
            try {
                const options = {
                    get passive() {
                        supported = true;
                        return false;
                    }
                };
                window.addEventListener('test', null, options);
                window.removeEventListener('test', null, options);
            } catch (e) {
                supported = false;
            }
            return supported;
        })();

        // Store for use in other modules
        window.passiveSupported = passiveSupported;
    },

    bindGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            // Recalculate layouts if needed
            this.handleResize();
        }));

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when tab is hidden
                TestimonialsSlider.pauseAutoplay?.();
            } else {
                // Resume when visible
                TestimonialsSlider.startAutoplay?.();
            }
        });

        // Handle network status
        window.addEventListener('online', () => {
            Utils.showToast('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showToast('You are offline. Some features may not work.', 'warning');
        });

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            // Save any important state
            this.saveState();
        });
    },

    handleResize() {
        // Update mobile detection
        const wasMobile = Utils.isMobile();
        const isMobile = window.innerWidth < CONFIG.mobileBreakpoint;

        if (wasMobile !== isMobile) {
            // Screen type changed
            if (isMobile) {
                // Switched to mobile
                this.initMobileFeatures();
            } else {
                // Switched to desktop
                this.initDesktopFeatures();
            }
        }
    },

    initMobileFeatures() {
        // Disable parallax
        ScrollEffects.initParallax();
    },

    initDesktopFeatures() {
        // Enable full features
    },

    saveState() {
        // Save cart, preferences, etc.
        Storage.set('tomoro_cart', STATE.cartItems);
        Storage.set('tomoro_theme', STATE.theme);
    },

    loadState() {
        // Load saved state
        STATE.cartItems = Storage.get('tomoro_cart', []);
        STATE.theme = Storage.get('tomoro_theme', 'light');
    }
};

// Initialize the application
App.init();

/* =================================================================
   EXPORTS (for module usage if needed)
================================================================= */

// Export modules for potential external use
window.TomoroCoffee = {
    Utils,
    Navigation,
    MenuFilter,
    GalleryFilter,
    FormHandler,
    Storage,
    CONFIG,
    STATE
};

/* =================================================================
   END OF MAIN.JS
================================================================= */