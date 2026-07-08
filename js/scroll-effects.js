/*
=================================================================
  TOMORO COFFEE BANGKA - SCROLL EFFECTS JAVASCRIPT
  Version: 1.0.0
  Author: Professional Web Developer
  Description: Advanced Scroll-Based Animations & Effects
=================================================================
*/

/* =================================================================
   TABLE OF CONTENTS
   =================================================================
   1. Configuration
   2. Scroll Observer
   3. Scroll Progress
   4. Reveal Animations
   5. Parallax Scrolling
   6. Scroll Snap
   7. Sticky Elements
   8. Scroll Direction Detection
   9. Scroll Speed Detection
   10. Section Animations
   11. Image Sequence
   12. Horizontal Scroll
   13. Scroll Triggered Video
   14. Number Counter on Scroll
   15. Text Reveal on Scroll
   16. Color Change on Scroll
   17. Scale on Scroll
   18. Rotation on Scroll
   19. Blur on Scroll
   20. Initialize Scroll Effects
================================================================= */

'use strict';

/* =================================================================
   1. CONFIGURATION
================================================================= */

const ScrollConfig = {
    // Thresholds
    revealThreshold: 0.15,
    parallaxThreshold: 0,
    
    // Offsets
    revealOffset: 100,
    stickyOffset: 80,
    
    // Animation Defaults
    defaultDuration: 800,
    defaultEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Performance
    throttleDelay: 16, // ~60fps
    debounceDelay: 100,
    
    // Breakpoints
    mobileBreakpoint: 768,
    tabletBreakpoint: 992,
    
    // Feature flags
    enableParallax: true,
    enableSmooth: true,
    reduceMotion: false,
};

// Check for reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ScrollConfig.reduceMotion = true;
    ScrollConfig.enableParallax = false;
}

/* =================================================================
   2. SCROLL OBSERVER
================================================================= */

const ScrollObserver = {
    observers: new Map(),
    
    /**
     * Create a new intersection observer
     * @param {string} name - Observer identifier
     * @param {Function} callback - Callback function
     * @param {Object} options - Observer options
     * @returns {IntersectionObserver}
     */
    create(name, callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };
        
        const observer = new IntersectionObserver(callback, {
            ...defaultOptions,
            ...options,
        });
        
        this.observers.set(name, observer);
        return observer;
    },
    
    /**
     * Get existing observer
     * @param {string} name - Observer identifier
     * @returns {IntersectionObserver|undefined}
     */
    get(name) {
        return this.observers.get(name);
    },
    
    /**
     * Observe element(s)
     * @param {string} name - Observer identifier
     * @param {HTMLElement|NodeList} elements - Elements to observe
     */
    observe(name, elements) {
        const observer = this.observers.get(name);
        if (!observer) return;
        
        if (elements instanceof NodeList) {
            elements.forEach(el => observer.observe(el));
        } else if (elements instanceof HTMLElement) {
            observer.observe(elements);
        }
    },
    
    /**
     * Unobserve element(s)
     * @param {string} name - Observer identifier
     * @param {HTMLElement|NodeList} elements - Elements to unobserve
     */
    unobserve(name, elements) {
        const observer = this.observers.get(name);
        if (!observer) return;
        
        if (elements instanceof NodeList) {
            elements.forEach(el => observer.unobserve(el));
        } else if (elements instanceof HTMLElement) {
            observer.unobserve(elements);
        }
    },
    
    /**
     * Disconnect and remove observer
     * @param {string} name - Observer identifier
     */
    disconnect(name) {
        const observer = this.observers.get(name);
        if (observer) {
            observer.disconnect();
            this.observers.delete(name);
        }
    },
    
    /**
     * Disconnect all observers
     */
    disconnectAll() {
        this.observers.forEach((observer, name) => {
            observer.disconnect();
        });
        this.observers.clear();
    },
};

/* =================================================================
   3. SCROLL PROGRESS
================================================================= */

const ScrollProgress = {
    progressBar: null,
    progressCircle: null,
    progressText: null,
    
    init() {
        this.createProgressBar();
        this.createProgressCircle();
        this.bindEvents();
        this.update();
    },
    
    createProgressBar() {
        // Check if progress bar element exists or create one
        this.progressBar = document.querySelector('.scroll-progress-bar');
        
        if (!this.progressBar) {
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress-bar';
            this.progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
            this.progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(139, 69, 19, 0.1);
                z-index: 9999;
                pointer-events: none;
            `;
            
            const fill = this.progressBar.querySelector('.scroll-progress-fill');
            fill.style.cssText = `
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #8B4513, #D4A574);
                transition: width 0.1s ease;
            `;
            
            document.body.appendChild(this.progressBar);
        }
    },
    
    createProgressCircle() {
        this.progressCircle = document.querySelector('.scroll-progress-circle');
        
        if (!this.progressCircle) {
            this.progressCircle = document.createElement('div');
            this.progressCircle.className = 'scroll-progress-circle';
            this.progressCircle.innerHTML = `
                <svg viewBox="0 0 100 100">
                    <circle class="bg" cx="50" cy="50" r="45" />
                    <circle class="progress" cx="50" cy="50" r="45" />
                </svg>
                <span class="percentage">0%</span>
            `;
            this.progressCircle.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 60px;
                height: 60px;
                z-index: 9998;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
                pointer-events: none;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .scroll-progress-circle svg {
                    transform: rotate(-90deg);
                    width: 100%;
                    height: 100%;
                }
                .scroll-progress-circle circle {
                    fill: none;
                    stroke-width: 8;
                    stroke-linecap: round;
                }
                .scroll-progress-circle .bg {
                    stroke: rgba(139, 69, 19, 0.1);
                }
                .scroll-progress-circle .progress {
                    stroke: #8B4513;
                    stroke-dasharray: 283;
                    stroke-dashoffset: 283;
                    transition: stroke-dashoffset 0.1s ease;
                }
                .scroll-progress-circle .percentage {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                    font-weight: 700;
                    color: #8B4513;
                }
                .scroll-progress-circle.visible {
                    opacity: 1;
                    visibility: visible;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(this.progressCircle);
            
            this.progressText = this.progressCircle.querySelector('.percentage');
        }
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.update();
        }, ScrollConfig.throttleDelay), { passive: true });
    },
    
    update() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // Update progress bar
        const fill = this.progressBar?.querySelector('.scroll-progress-fill');
        if (fill) {
            fill.style.width = `${progress}%`;
        }
        
        // Update progress circle
        if (this.progressCircle) {
            const circle = this.progressCircle.querySelector('.progress');
            const circumference = 283; // 2 * PI * 45
            const offset = circumference - (progress / 100) * circumference;
            
            if (circle) {
                circle.style.strokeDashoffset = offset;
            }
            
            if (this.progressText) {
                this.progressText.textContent = `${Math.round(progress)}%`;
            }
            
            // Show/hide circle based on scroll position
            if (scrollTop > 300) {
                this.progressCircle.classList.add('visible');
            } else {
                this.progressCircle.classList.remove('visible');
            }
        }
        
        return progress;
    },
    
    getProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return docHeight > 0 ? (scrollTop / docHeight) : 0;
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    destroy() {
        if (this.progressBar && this.progressBar.parentNode) {
            this.progressBar.parentNode.removeChild(this.progressBar);
        }
        if (this.progressCircle && this.progressCircle.parentNode) {
            this.progressCircle.parentNode.removeChild(this.progressCircle);
        }
    }
};

/* =================================================================
   4. REVEAL ANIMATIONS
================================================================= */

const RevealAnimations = {
    elements: [],
    observer: null,
    
    init() {
        if (ScrollConfig.reduceMotion) return;
        
        this.elements = document.querySelectorAll('[data-reveal]');
        if (!this.elements.length) return;
        
        this.prepareElements();
        this.createObserver();
    },
    
    prepareElements() {
        this.elements.forEach(el => {
            const animation = el.dataset.reveal || 'fade-up';
            const delay = parseInt(el.dataset.revealDelay) || 0;
            const duration = parseInt(el.dataset.revealDuration) || ScrollConfig.defaultDuration;
            
            // Set initial state
            el.style.opacity = '0';
            el.style.transition = `
                opacity ${duration}ms ${ScrollConfig.defaultEasing},
                transform ${duration}ms ${ScrollConfig.defaultEasing}
            `;
            el.style.transitionDelay = `${delay}ms`;
            
            // Set initial transform based on animation type
            this.setInitialTransform(el, animation);
        });
    },
    
    setInitialTransform(el, animation) {
        const transforms = {
            'fade-up': 'translateY(60px)',
            'fade-down': 'translateY(-60px)',
            'fade-left': 'translateX(60px)',
            'fade-right': 'translateX(-60px)',
            'fade': 'none',
            'zoom-in': 'scale(0.8)',
            'zoom-out': 'scale(1.2)',
            'flip-up': 'perspective(1000px) rotateX(45deg)',
            'flip-down': 'perspective(1000px) rotateX(-45deg)',
            'flip-left': 'perspective(1000px) rotateY(-45deg)',
            'flip-right': 'perspective(1000px) rotateY(45deg)',
            'slide-up': 'translateY(100%)',
            'slide-down': 'translateY(-100%)',
            'slide-left': 'translateX(100%)',
            'slide-right': 'translateX(-100%)',
            'rotate-left': 'rotate(-15deg)',
            'rotate-right': 'rotate(15deg)',
            'skew-up': 'skewY(10deg) translateY(60px)',
            'skew-down': 'skewY(-10deg) translateY(-60px)',
        };
        
        el.style.transform = transforms[animation] || transforms['fade-up'];
    },
    
    createObserver() {
        this.observer = ScrollObserver.create('reveal', (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.reveal(entry.target);
                    
                    // Unobserve if not repeating
                    if (entry.target.dataset.revealRepeat !== 'true') {
                        this.observer.unobserve(entry.target);
                    }
                } else {
                    // Reset if repeating
                    if (entry.target.dataset.revealRepeat === 'true') {
                        this.hide(entry.target);
                    }
                }
            });
        }, {
            threshold: ScrollConfig.revealThreshold,
            rootMargin: `-${ScrollConfig.revealOffset}px`,
        });
        
        this.elements.forEach(el => this.observer.observe(el));
    },
    
    reveal(el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0) skewY(0)';
        el.classList.add('revealed');
        
        // Trigger custom event
        el.dispatchEvent(new CustomEvent('revealed', { bubbles: true }));
    },
    
    hide(el) {
        const animation = el.dataset.reveal || 'fade-up';
        el.style.opacity = '0';
        this.setInitialTransform(el, animation);
        el.classList.remove('revealed');
    },
    
    refresh() {
        this.elements = document.querySelectorAll('[data-reveal]:not(.revealed)');
        this.elements.forEach(el => {
            this.prepareElements();
            this.observer?.observe(el);
        });
    },
    
    destroy() {
        ScrollObserver.disconnect('reveal');
        this.elements.forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
            el.classList.remove('revealed');
        });
    }
};

/* =================================================================
   5. PARALLAX SCROLLING
================================================================= */

const ParallaxScrolling = {
    elements: [],
    ticking: false,
    
    init() {
        if (ScrollConfig.reduceMotion || !ScrollConfig.enableParallax) return;
        if (this.isMobile()) return;
        
        this.elements = document.querySelectorAll('[data-parallax-scroll]');
        if (!this.elements.length) return;
        
        this.prepareElements();
        this.bindEvents();
        this.update();
    },
    
    isMobile() {
        return window.innerWidth < ScrollConfig.mobileBreakpoint || 
               'ontouchstart' in window;
    },
    
    prepareElements() {
        this.elements.forEach(el => {
            el.style.willChange = 'transform';
        });
    },
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
        
        window.addEventListener('resize', this.debounce(() => {
            if (this.isMobile()) {
                this.reset();
            }
        }, ScrollConfig.debounceDelay));
    },
    
    update() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            
            // Check if element is in viewport
            if (scrollTop + windowHeight > elementTop && 
                scrollTop < elementTop + elementHeight) {
                
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
                const direction = el.dataset.parallaxDirection || 'vertical';
                const reverse = el.dataset.parallaxReverse === 'true';
                
                // Calculate parallax offset
                const progress = (scrollTop + windowHeight - elementTop) / (windowHeight + elementHeight);
                let offset = (progress - 0.5) * elementHeight * speed;
                
                if (reverse) offset = -offset;
                
                // Apply transform based on direction
                switch (direction) {
                    case 'vertical':
                        el.style.transform = `translate3d(0, ${offset}px, 0)`;
                        break;
                    case 'horizontal':
                        el.style.transform = `translate3d(${offset}px, 0, 0)`;
                        break;
                    case 'both':
                        el.style.transform = `translate3d(${offset * 0.5}px, ${offset}px, 0)`;
                        break;
                    case 'rotate':
                        el.style.transform = `rotate(${offset * 0.1}deg)`;
                        break;
                    case 'scale':
                        const scale = 1 + (offset * 0.001);
                        el.style.transform = `scale(${Math.max(0.5, Math.min(1.5, scale))})`;
                        break;
                }
            }
        });
    },
    
    reset() {
        this.elements.forEach(el => {
            el.style.transform = 'none';
            el.style.willChange = 'auto';
        });
    },
    
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    destroy() {
        this.reset();
        this.elements = [];
    }
};

/* =================================================================
   6. SCROLL SNAP
================================================================= */

const ScrollSnap = {
    container: null,
    sections: [],
    currentIndex: 0,
    isScrolling: false,
    
    init() {
        this.container = document.querySelector('[data-scroll-snap]');
        if (!this.container) return;
        
        this.sections = this.container.querySelectorAll('[data-scroll-snap-section]');
        if (!this.sections.length) return;
        
        this.setup();
        this.bindEvents();
    },
    
    setup() {
        this.container.style.cssText = `
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            height: 100vh;
            scroll-behavior: smooth;
        `;
        
        this.sections.forEach(section => {
            section.style.cssText = `
                scroll-snap-align: start;
                scroll-snap-stop: always;
                height: 100vh;
            `;
        });
    },
    
    bindEvents() {
        // Update current index on scroll
        this.container.addEventListener('scroll', this.throttle(() => {
            this.updateCurrentIndex();
        }, 100), { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                this.next();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                this.prev();
            }
        });
        
        // Navigation dots
        this.createNavDots();
    },
    
    createNavDots() {
        if (document.querySelector('.scroll-snap-nav')) return;
        
        const nav = document.createElement('div');
        nav.className = 'scroll-snap-nav';
        nav.style.cssText = `
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 1000;
        `;
        
        this.sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = `snap-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to section ${index + 1}`);
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid #8B4513;
                background: ${index === 0 ? '#8B4513' : 'transparent'};
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0;
            `;
            
            dot.addEventListener('click', () => this.goTo(index));
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.3)';
            });
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'scale(1)';
            });
            
            nav.appendChild(dot);
        });
        
        document.body.appendChild(nav);
        this.navDots = nav.querySelectorAll('.snap-dot');
    },
    
    updateCurrentIndex() {
        const scrollTop = this.container.scrollTop;
        const sectionHeight = window.innerHeight;
        
        this.currentIndex = Math.round(scrollTop / sectionHeight);
        this.updateNavDots();
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('scrollSnapChange', {
            detail: { index: this.currentIndex }
        }));
    },
    
    updateNavDots() {
        if (!this.navDots) return;
        
        this.navDots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
                dot.style.background = '#8B4513';
            } else {
                dot.classList.remove('active');
                dot.style.background = 'transparent';
            }
        });
    },
    
    goTo(index) {
        if (index < 0 || index >= this.sections.length) return;
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        this.currentIndex = index;
        
        this.sections[index].scrollIntoView({ behavior: 'smooth' });
        this.updateNavDots();
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    },
    
    next() {
        this.goTo(this.currentIndex + 1);
    },
    
    prev() {
        this.goTo(this.currentIndex - 1);
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    destroy() {
        this.container.style.cssText = '';
        this.sections.forEach(section => {
            section.style.cssText = '';
        });
        
        const nav = document.querySelector('.scroll-snap-nav');
        if (nav) nav.remove();
    }
};

/* =================================================================
   7. STICKY ELEMENTS
================================================================= */

const StickyElements = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-sticky]');
        if (!this.elements.length) return;
        
        this.setupElements();
        this.bindEvents();
    },
    
    setupElements() {
        this.elements.forEach(el => {
            const offset = parseInt(el.dataset.stickyOffset) || ScrollConfig.stickyOffset;
            const end = el.dataset.stickyEnd;
            
            // Store original position
            el._stickyData = {
                offset,
                end: end ? document.querySelector(end) : null,
                originalTop: el.offsetTop,
                originalPosition: getComputedStyle(el).position,
            };
            
            el.style.position = 'sticky';
            el.style.top = `${offset}px`;
            el.style.zIndex = '100';
        });
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.update();
        }, ScrollConfig.throttleDelay), { passive: true });
    },
    
    update() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(el => {
            const data = el._stickyData;
            if (!data) return;
            
            // Check if element should stop being sticky
            if (data.end) {
                const endRect = data.end.getBoundingClientRect();
                const elHeight = el.offsetHeight;
                
                if (endRect.top <= data.offset + elHeight) {
                    el.style.position = 'absolute';
                    el.style.top = `${data.end.offsetTop - elHeight}px`;
                    el.classList.add('sticky-ended');
                } else {
                    el.style.position = 'sticky';
                    el.style.top = `${data.offset}px`;
                    el.classList.remove('sticky-ended');
                }
            }
            
            // Add active class when stuck
            const rect = el.getBoundingClientRect();
            if (rect.top <= data.offset) {
                el.classList.add('is-sticky');
            } else {
                el.classList.remove('is-sticky');
            }
        });
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    destroy() {
        this.elements.forEach(el => {
            const data = el._stickyData;
            if (data) {
                el.style.position = data.originalPosition;
                el.style.top = '';
                el.style.zIndex = '';
                delete el._stickyData;
            }
            el.classList.remove('is-sticky', 'sticky-ended');
        });
    }
};

/* =================================================================
   8. SCROLL DIRECTION DETECTION
================================================================= */

const ScrollDirection = {
    lastScrollTop: 0,
    direction: 'none',
    callbacks: [],
    
    init() {
        this.lastScrollTop = window.pageYOffset;
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.detect();
        }, ScrollConfig.throttleDelay), { passive: true });
    },
    
    detect() {
        const scrollTop = window.pageYOffset;
        const diff = scrollTop - this.lastScrollTop;
        
        // Minimum threshold to detect direction change
        if (Math.abs(diff) < 5) return;
        
        const newDirection = diff > 0 ? 'down' : 'up';
        
        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.triggerCallbacks();
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('scrollDirectionChange', {
                detail: {
                    direction: this.direction,
                    scrollTop,
                }
            }));
            
            // Update body class
            document.body.classList.remove('scrolling-up', 'scrolling-down');
            document.body.classList.add(`scrolling-${this.direction}`);
        }
        
        this.lastScrollTop = scrollTop;
    },
    
    getDirection() {
        return this.direction;
    },
    
    onChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
    },
    
    triggerCallbacks() {
        this.callbacks.forEach(cb => cb(this.direction));
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   9. SCROLL SPEED DETECTION
================================================================= */

const ScrollSpeed = {
    lastScrollTop: 0,
    lastTime: Date.now(),
    speed: 0,
    callbacks: [],
    
    init() {
        this.lastScrollTop = window.pageYOffset;
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            this.calculate();
        }, { passive: true });
    },
    
    calculate() {
        const currentTime = Date.now();
        const currentScrollTop = window.pageYOffset;
        
        const timeDiff = currentTime - this.lastTime;
        const scrollDiff = Math.abs(currentScrollTop - this.lastScrollTop);
        
        // Calculate speed (pixels per millisecond)
        this.speed = timeDiff > 0 ? scrollDiff / timeDiff : 0;
        
        // Normalize speed (0-1 range, where 1 is very fast)
        const normalizedSpeed = Math.min(this.speed / 5, 1);
        
        // Trigger callbacks
        this.triggerCallbacks(normalizedSpeed);
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('scrollSpeedChange', {
            detail: {
                speed: this.speed,
                normalized: normalizedSpeed,
            }
        }));
        
        // Update for next calculation
        this.lastScrollTop = currentScrollTop;
        this.lastTime = currentTime;
    },
    
    getSpeed() {
        return this.speed;
    },
    
    onChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
    },
    
    triggerCallbacks(speed) {
        this.callbacks.forEach(cb => cb(speed));
    }
};

/* =================================================================
   10. SECTION ANIMATIONS
================================================================= */

const SectionAnimations = {
    sections: [],
    observer: null,
    
    init() {
        this.sections = document.querySelectorAll('[data-section-animation]');
        if (!this.sections.length) return;
        
        this.createObserver();
        this.bindCustomAnimations();
    },
    
    createObserver() {
        this.observer = ScrollObserver.create('sections', (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const animation = section.dataset.sectionAnimation;
                
                if (entry.isIntersecting) {
                    this.animateIn(section, animation);
                    section.classList.add('section-visible');
                } else if (section.dataset.sectionRepeat === 'true') {
                    this.animateOut(section, animation);
                    section.classList.remove('section-visible');
                }
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '-10% 0px',
        });
        
        this.sections.forEach(section => this.observer.observe(section));
    },
    
    animateIn(section, animation) {
        switch (animation) {
            case 'fade':
                section.style.opacity = '1';
                break;
            case 'slide-up':
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                break;
            case 'zoom':
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
                break;
            case 'stagger':
                this.staggerChildren(section);
                break;
            default:
                section.style.opacity = '1';
        }
        
        // Dispatch event
        section.dispatchEvent(new CustomEvent('sectionEnter', { bubbles: true }));
    },
    
    animateOut(section, animation) {
        switch (animation) {
            case 'fade':
                section.style.opacity = '0';
                break;
            case 'slide-up':
                section.style.opacity = '0';
                section.style.transform = 'translateY(50px)';
                break;
            case 'zoom':
                section.style.opacity = '0';
                section.style.transform = 'scale(0.9)';
                break;
            default:
                section.style.opacity = '0';
        }
        
        // Dispatch event
        section.dispatchEvent(new CustomEvent('sectionLeave', { bubbles: true }));
    },
    
    staggerChildren(section) {
        const children = section.querySelectorAll('[data-stagger-item]');
        const delay = parseFloat(section.dataset.staggerDelay) || 0.1;
        
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = `opacity 0.5s ease ${index * delay}s, transform 0.5s ease ${index * delay}s`;
            
            requestAnimationFrame(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            });
        });
    },
    
    bindCustomAnimations() {
        // Custom animation handlers can be added here
        document.addEventListener('sectionEnter', (e) => {
            const section = e.target;
            
            // Initialize counters
            const counters = section.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                if (!counter._counted) {
                    this.animateCounter(counter);
                    counter._counted = true;
                }
            });
            
            // Initialize progress bars
            const progressBars = section.querySelectorAll('[data-progress-bar]');
            progressBars.forEach(bar => {
                if (!bar._animated) {
                    this.animateProgressBar(bar);
                    bar._animated = true;
                }
            });
        });
    },
    
    animateCounter(el) {
        const target = parseInt(el.dataset.count) || 0;
        const duration = parseInt(el.dataset.countDuration) || 2000;
        const start = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutQuart(progress);
            
            el.textContent = Math.round(target * eased).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    },
    
    animateProgressBar(bar) {
        const target = parseInt(bar.dataset.progressBar) || 0;
        const fill = bar.querySelector('.progress-fill') || bar;
        
        fill.style.width = '0%';
        fill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            fill.style.width = `${target}%`;
        });
    },
    
    easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    },
    
    destroy() {
        ScrollObserver.disconnect('sections');
    }
};

/* =================================================================
   11. IMAGE SEQUENCE
================================================================= */

const ImageSequence = {
    containers: [],
    
    init() {
        this.containers = document.querySelectorAll('[data-image-sequence]');
        if (!this.containers.length) return;
        
        this.containers.forEach(container => {
            this.setupSequence(container);
        });
    },
    
    setupSequence(container) {
        const images = JSON.parse(container.dataset.imageSequence || '[]');
        const start = parseInt(container.dataset.sequenceStart) || 0;
        const end = parseInt(container.dataset.sequenceEnd) || images.length - 1;
        
        if (!images.length) return;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.className = 'sequence-canvas';
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        container.appendChild(canvas);
        
        // Preload images
        const loadedImages = [];
        let loaded = 0;
        
        images.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                loadedImages[index] = img;
                loaded++;
                
                if (loaded === images.length) {
                    this.setupScrollHandler(container, canvas, ctx, loadedImages, start, end);
                    // Draw first frame
                    this.drawFrame(ctx, canvas, loadedImages[0]);
                }
            };
            img.src = src;
        });
    },
    
    setupScrollHandler(container, canvas, ctx, images, start, end) {
        const handleScroll = this.throttle(() => {
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate scroll progress within the container
            const containerTop = rect.top;
            const containerHeight = rect.height;
            
            // Progress from 0 to 1
            let progress = (windowHeight - containerTop) / (windowHeight + containerHeight);
            progress = Math.max(0, Math.min(1, progress));
            
            // Map progress to frame index
            const frameRange = end - start;
            const frameIndex = Math.round(start + (progress * frameRange));
            const clampedIndex = Math.max(start, Math.min(end, frameIndex));
            
            // Draw frame
            if (images[clampedIndex]) {
                this.drawFrame(ctx, canvas, images[clampedIndex]);
            }
        }, 16);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial update
        handleScroll();
    },
    
    drawFrame(ctx, canvas, image) {
        // Set canvas size to match container
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Draw image covering the canvas
        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const x = (canvas.width - image.width * scale) / 2;
        const y = (canvas.height - image.height * scale) / 2;
        
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   12. HORIZONTAL SCROLL
================================================================= */

const HorizontalScroll = {
    containers: [],
    
    init() {
        this.containers = document.querySelectorAll('[data-horizontal-scroll]');
        if (!this.containers.length) return;
        
        this.containers.forEach(container => {
            this.setupHorizontalScroll(container);
        });
    },
    
    setupHorizontalScroll(container) {
        const wrapper = container.querySelector('[data-horizontal-wrapper]');
        if (!wrapper) return;
        
        const items = wrapper.children;
        const itemWidth = items[0]?.offsetWidth || 0;
        const totalWidth = itemWidth * items.length;
        
        // Set container height to allow scrolling
        container.style.height = `${totalWidth}px`;
        container.style.position = 'relative';
        
        // Fixed wrapper
        wrapper.style.cssText = `
            position: sticky;
            top: 0;
            display: flex;
            height: 100vh;
            align-items: center;
            overflow: hidden;
            will-change: transform;
        `;
        
        // Scroll handler
        const handleScroll = this.throttle(() => {
            const rect = container.getBoundingClientRect();
            const scrollProgress = -rect.top / (container.offsetHeight - window.innerHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
            
            const translateX = clampedProgress * (totalWidth - window.innerWidth);
            wrapper.style.transform = `translateX(-${translateX}px)`;
            
            // Animate individual items
            Array.from(items).forEach((item, index) => {
                const itemProgress = (clampedProgress * items.length) - index;
                const itemOpacity = Math.max(0, Math.min(1, 1 - Math.abs(itemProgress - 0.5)));
                const itemScale = 0.8 + (itemOpacity * 0.2);
                
                item.style.opacity = itemOpacity;
                item.style.transform = `scale(${itemScale})`;
            });
        }, 16);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   13. SCROLL TRIGGERED VIDEO
================================================================= */

const ScrollVideo = {
    videos: [],
    
    init() {
        this.videos = document.querySelectorAll('[data-scroll-video]');
        if (!this.videos.length) return;
        
        this.createObserver();
    },
    
    createObserver() {
        const observer = ScrollObserver.create('videos', (entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                const action = video.dataset.scrollVideo || 'play';
                
                if (entry.isIntersecting) {
                    switch (action) {
                        case 'play':
                            this.playVideo(video);
                            break;
                        case 'scrub':
                            this.setupScrubbing(video);
                            break;
                    }
                } else {
                    video.pause();
                    
                    if (action === 'scrub') {
                        this.removeScrubbing(video);
                    }
                }
            });
        }, {
            threshold: 0.5,
        });
        
        this.videos.forEach(video => observer.observe(video));
    },
    
    playVideo(video) {
        video.muted = true;
        video.play().catch(e => {
            console.log('Video autoplay prevented:', e);
        });
    },
    
    setupScrubbing(video) {
        if (video._scrubHandler) return;
        
        video.pause();
        video.currentTime = 0;
        
        const handleScroll = this.throttle(() => {
            const rect = video.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress
            let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            progress = Math.max(0, Math.min(1, progress));
            
            // Set video time
            if (video.duration) {
                video.currentTime = progress * video.duration;
            }
        }, 16);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        video._scrubHandler = handleScroll;
    },
    
    removeScrubbing(video) {
        if (video._scrubHandler) {
            window.removeEventListener('scroll', video._scrubHandler);
            delete video._scrubHandler;
        }
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   14. NUMBER COUNTER ON SCROLL
================================================================= */

const ScrollCounter = {
    counters: [],
    observer: null,
    
    init() {
        this.counters = document.querySelectorAll('[data-scroll-counter]');
        if (!this.counters.length) return;
        
        this.createObserver();
    },
    
    createObserver() {
        this.observer = ScrollObserver.create('counters', (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target._counted) {
                    this.animateCounter(entry.target);
                    entry.target._counted = true;
                }
            });
        }, {
            threshold: 0.5,
        });
        
        this.counters.forEach(counter => this.observer.observe(counter));
    },
    
    animateCounter(el) {
        const target = parseFloat(el.dataset.scrollCounter) || 0;
        const duration = parseInt(el.dataset.counterDuration) || 2000;
        const decimals = parseInt(el.dataset.counterDecimals) || 0;
        const prefix = el.dataset.counterPrefix || '';
        const suffix = el.dataset.counterSuffix || '';
        const separator = el.dataset.counterSeparator !== 'false';
        
        const start = performance.now();
        
        const format = (num) => {
            let formatted = num.toFixed(decimals);
            if (separator) {
                formatted = parseFloat(formatted).toLocaleString();
            }
            return prefix + formatted + suffix;
        };
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutExpo(progress);
            
            const current = eased * target;
            el.textContent = format(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                el.textContent = format(target);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },
    
    reset() {
        this.counters.forEach(counter => {
            counter._counted = false;
            counter.textContent = '0';
        });
    }
};

/* =================================================================
   15. TEXT REVEAL ON SCROLL
================================================================= */

const ScrollTextReveal = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-scroll-text]');
        if (!this.elements.length) return;
        
        this.prepareElements();
        this.createObserver();
    },
    
    prepareElements() {
        this.elements.forEach(el => {
            const type = el.dataset.scrollText || 'words'; // chars, words, lines
            const text = el.textContent.trim();
            
            el.innerHTML = '';
            el.setAttribute('aria-label', text);
            
            if (type === 'chars') {
                this.splitToChars(el, text);
            } else if (type === 'words') {
                this.splitToWords(el, text);
            } else if (type === 'lines') {
                this.splitToLines(el, text);
            }
        });
    },
    
    splitToChars(el, text) {
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'scroll-char';
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(100%);
                transition: opacity 0.3s ease, transform 0.3s ease;
                transition-delay: ${i * 0.02}s;
            `;
            el.appendChild(span);
        });
    },
    
    splitToWords(el, text) {
        text.split(' ').forEach((word, i) => {
            const wrapper = document.createElement('span');
            wrapper.className = 'scroll-word-wrapper';
            wrapper.style.cssText = `
                display: inline-block;
                overflow: hidden;
                margin-right: 0.25em;
            `;
            
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'scroll-word';
            span.style.cssText = `
                display: inline-block;
                transform: translateY(100%);
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                transition-delay: ${i * 0.05}s;
            `;
            
            wrapper.appendChild(span);
            el.appendChild(wrapper);
        });
    },
    
    splitToLines(el, text) {
        const words = text.split(' ');
        const lineLength = parseInt(el.dataset.lineLength) || 6;
        
        for (let i = 0; i < words.length; i += lineLength) {
            const lineWords = words.slice(i, i + lineLength).join(' ');
            
            const wrapper = document.createElement('span');
            wrapper.className = 'scroll-line-wrapper';
            wrapper.style.cssText = `
                display: block;
                overflow: hidden;
            `;
            
            const span = document.createElement('span');
            span.textContent = lineWords;
            span.className = 'scroll-line';
            span.style.cssText = `
                display: block;
                transform: translateY(100%);
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                transition-delay: ${(i / lineLength) * 0.1}s;
            `;
            
            wrapper.appendChild(span);
            el.appendChild(wrapper);
        }
    },
    
    createObserver() {
        const observer = ScrollObserver.create('textReveal', (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.reveal(entry.target);
                } else if (entry.target.dataset.scrollTextRepeat === 'true') {
                    this.hide(entry.target);
                }
            });
        }, {
            threshold: 0.2,
        });
        
        this.elements.forEach(el => observer.observe(el));
    },
    
    reveal(el) {
        const items = el.querySelectorAll('.scroll-char, .scroll-word, .scroll-line');
        items.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    },
    
    hide(el) {
        const items = el.querySelectorAll('.scroll-char, .scroll-word, .scroll-line');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(100%)';
        });
    }
};

/* =================================================================
   16. COLOR CHANGE ON SCROLL
================================================================= */

const ScrollColorChange = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-scroll-color]');
        if (!this.elements.length) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.update();
        }, 16), { passive: true });
    },
    
    update() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const colors = JSON.parse(el.dataset.scrollColor || '{}');
            
            // Calculate progress through element
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            // Interpolate colors
            if (colors.from && colors.to) {
                const color = this.interpolateColor(colors.from, colors.to, clampedProgress);
                
                if (colors.property === 'background') {
                    el.style.backgroundColor = color;
                } else if (colors.property === 'text') {
                    el.style.color = color;
                } else {
                    el.style.backgroundColor = color;
                }
            }
        });
    },
    
    interpolateColor(color1, color2, progress) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;
        
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);
        
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   17. SCALE ON SCROLL
================================================================= */

const ScrollScale = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-scroll-scale]');
        if (!this.elements.length) return;
        
        this.elements.forEach(el => {
            el.style.willChange = 'transform';
        });
        
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.update();
        }, 16), { passive: true });
    },
    
    update() {
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const scaleData = el.dataset.scrollScale.split(',').map(Number);
            const scaleFrom = scaleData[0] || 0.8;
            const scaleTo = scaleData[1] || 1;
            
            // Calculate progress
            let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            progress = Math.max(0, Math.min(1, progress));
            
            // Calculate scale
            const scale = scaleFrom + (scaleTo - scaleFrom) * this.easeOutQuad(progress);
            
            el.style.transform = `scale(${scale})`;
        });
    },
    
    easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   18. ROTATION ON SCROLL
================================================================= */

const ScrollRotation = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-scroll-rotate]');
        if (!this.elements.length) return;
        
        this.elements.forEach(el => {
            el.style.willChange = 'transform';
        });
        
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.update();
        }, 16), { passive: true });
    },
    
    update() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const speed = parseFloat(el.dataset.scrollRotate) || 0.5;
            const axis = el.dataset.rotateAxis || 'z'; // x, y, z
            
            // Calculate progress
            let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            
            // Calculate rotation (full 360 degrees based on progress)
            const rotation = progress * 360 * speed;
            
            // Apply rotation
            switch (axis) {
                case 'x':
                    el.style.transform = `rotateX(${rotation}deg)`;
                    break;
                case 'y':
                    el.style.transform = `rotateY(${rotation}deg)`;
                    break;
                case 'z':
                default:
                    el.style.transform = `rotate(${rotation}deg)`;
            }
        });
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   19. BLUR ON SCROLL
================================================================= */

const ScrollBlur = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-scroll-blur]');
        if (!this.elements.length) return;
        
        this.elements.forEach(el => {
            el.style.willChange = 'filter';
        });
        
        this.bindEvents();
    },
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.update();
        }, 16), { passive: true });
    },
    
    update() {
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const blurData = el.dataset.scrollBlur.split(',').map(Number);
            const blurFrom = blurData[0] || 0;
            const blurTo = blurData[1] || 10;
            
            // Calculate progress
            let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            progress = Math.max(0, Math.min(1, progress));
            
            // Calculate blur
            const blur = blurFrom + (blurTo - blurFrom) * progress;
            
            el.style.filter = `blur(${blur}px)`;
        });
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* =================================================================
   20. INITIALIZE SCROLL EFFECTS
================================================================= */

const ScrollEffectsApp = {
    initialized: false,
    
    init() {
        if (this.initialized) return;
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },
    
    start() {
        console.log('%c📜 Scroll Effects Module', 'font-size: 16px; font-weight: bold; color: #8B4513;');
        
        // Core scroll effects
        ScrollProgress.init();
        ScrollDirection.init();
        ScrollSpeed.init();
        
        // Reveal animations
        RevealAnimations.init();
        
        // Parallax (if not reduced motion)
        if (!ScrollConfig.reduceMotion) {
            ParallaxScrolling.init();
        }
        
        // Sticky elements
        StickyElements.init();
        
        // Section animations
        SectionAnimations.init();
        
        // Text reveal
        ScrollTextReveal.init();
        
        // Counters
        ScrollCounter.init();
        
        // Transform effects
        ScrollScale.init();
        ScrollRotation.init();
        ScrollBlur.init();
        
        // Color changes
        ScrollColorChange.init();
        
        // Advanced features (optional - uncomment if needed)
        // ScrollSnap.init();
        // HorizontalScroll.init();
        // ImageSequence.init();
        // ScrollVideo.init();
        
        // Bind global events
        this.bindGlobalEvents();
        
        this.initialized = true;
        console.log('%c✅ Scroll effects initialized!', 'color: #28a745;');
    },
    
    bindGlobalEvents() {
        // Handle reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            ScrollConfig.reduceMotion = e.matches;
            
            if (e.matches) {
                ParallaxScrolling.destroy();
            } else {
                ParallaxScrolling.init();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, ScrollConfig.debounceDelay));
        
        // Expose scroll direction globally
        ScrollDirection.onChange((direction) => {
            // Can be used by other modules
            window.scrollingDirection = direction;
        });
    },
    
    handleResize() {
        // Refresh animations on resize
        RevealAnimations.refresh?.();
    },
    
    /**
     * Refresh all scroll effects
     */
    refresh() {
        RevealAnimations.refresh?.();
        StickyElements.init?.();
    },
    
    /**
     * Destroy all scroll effects
     */
    destroy() {
        ScrollObserver.disconnectAll();
        ScrollProgress.destroy();
        RevealAnimations.destroy();
        ParallaxScrolling.destroy();
        StickyElements.destroy();
        ScrollSnap.destroy?.();
        
        this.initialized = false;
    },
    
    /**
     * Get scroll progress (0-1)
     */
    getProgress() {
        return ScrollProgress.getProgress();
    },
    
    /**
     * Get scroll direction
     */
    getDirection() {
        return ScrollDirection.getDirection();
    },
    
    /**
     * Get scroll speed
     */
    getSpeed() {
        return ScrollSpeed.getSpeed();
    },
    
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};

// Initialize
ScrollEffectsApp.init();

// Export for external use
window.TomoroScrollEffects = {
    // Core modules
    ScrollProgress,
    ScrollDirection,
    ScrollSpeed,
    ScrollObserver,
    
    // Animation modules
    RevealAnimations,
    ParallaxScrolling,
    StickyElements,
    SectionAnimations,
    ScrollTextReveal,
    ScrollCounter,
    
    // Transform modules
    ScrollScale,
    ScrollRotation,
    ScrollBlur,
    ScrollColorChange,
    
    // Advanced modules
    ScrollSnap,
    HorizontalScroll,
    ImageSequence,
    ScrollVideo,
    
    // App controls
    refresh: () => ScrollEffectsApp.refresh(),
    destroy: () => ScrollEffectsApp.destroy(),
    getProgress: () => ScrollEffectsApp.getProgress(),
    getDirection: () => ScrollEffectsApp.getDirection(),
    getSpeed: () => ScrollEffectsApp.getSpeed(),
    
    // Configuration
    config: ScrollConfig,
};

/* =================================================================
   END OF SCROLL-EFFECTS.JS
================================================================= */