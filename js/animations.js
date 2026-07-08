/*
=================================================================
  TOMORO COFFEE BANGKA - ANIMATIONS JAVASCRIPT
  Version: 1.0.0
  Author: Professional Web Developer
  Description: Advanced Animation Effects & Interactions
=================================================================
*/

/* =================================================================
   TABLE OF CONTENTS
   =================================================================
   1. Animation Configuration
   2. Scroll Reveal Animations
   3. Parallax Effects
   4. Mouse Interactions
   5. Text Animations
   6. Image Animations
   7. Card Animations
   8. Button Animations
   9. Loading Animations
   10. Page Transitions
   11. Counter Animations
   12. Stagger Animations
   13. Hover Effects
   14. Magnetic Effect
   15. Cursor Effects
   16. Particle System
   17. Coffee Animations
   18. GSAP-like Tweening
   19. Animation Queue
   20. Initialize Animations
================================================================= */

'use strict';

/* =================================================================
   1. ANIMATION CONFIGURATION
================================================================= */

const AnimationConfig = {
    // Durations (ms)
    duration: {
        fast: 200,
        normal: 400,
        slow: 800,
        slower: 1200,
    },
    
    // Easing functions
    easing: {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: t => t * t * t * t * t,
        easeOutQuint: t => 1 + (--t) * t * t * t * t,
        easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
        easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
        easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        easeInOutExpo: t => {
            if (t === 0 || t === 1) return t;
            if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
            return 1 - 0.5 * Math.pow(2, -20 * t + 10);
        },
        easeOutElastic: t => {
            const p = 0.3;
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        },
        easeOutBounce: t => {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        },
        easeInBack: t => {
            const s = 1.70158;
            return t * t * ((s + 1) * t - s);
        },
        easeOutBack: t => {
            const s = 1.70158;
            return --t * t * ((s + 1) * t + s) + 1;
        },
        easeInOutBack: t => {
            const s = 1.70158 * 1.525;
            if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
            return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
        },
    },
    
    // Scroll reveal settings
    scrollReveal: {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
    },
    
    // Parallax settings
    parallax: {
        speed: 0.5,
        direction: 'vertical',
    },
};

/* =================================================================
   2. SCROLL REVEAL ANIMATIONS
================================================================= */

const ScrollReveal = {
    elements: [],
    observer: null,
    
    init() {
        this.elements = document.querySelectorAll('[data-aos], .reveal-on-scroll');
        if (!this.elements.length) return;
        
        this.createObserver();
        this.observeElements();
    },
    
    createObserver() {
        const options = {
            root: null,
            threshold: AnimationConfig.scrollReveal.threshold,
            rootMargin: AnimationConfig.scrollReveal.rootMargin,
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    
                    // Unobserve if animation should only play once
                    if (!entry.target.dataset.aosOnce || entry.target.dataset.aosOnce !== 'false') {
                        this.observer.unobserve(entry.target);
                    }
                } else {
                    // Reset if animation should repeat
                    if (entry.target.dataset.aosOnce === 'false') {
                        this.resetElement(entry.target);
                    }
                }
            });
        }, options);
    },
    
    observeElements() {
        this.elements.forEach(el => {
            this.prepareElement(el);
            this.observer.observe(el);
        });
    },
    
    prepareElement(el) {
        const animation = el.dataset.aos || 'fade-up';
        const delay = el.dataset.aosDelay || 0;
        const duration = el.dataset.aosDuration || 800;
        
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        el.style.transitionDelay = `${delay}ms`;
        
        // Set initial transform based on animation type
        const transforms = {
            'fade-up': 'translateY(50px)',
            'fade-down': 'translateY(-50px)',
            'fade-left': 'translateX(50px)',
            'fade-right': 'translateX(-50px)',
            'fade': 'translateY(0)',
            'zoom-in': 'scale(0.8)',
            'zoom-out': 'scale(1.2)',
            'flip-up': 'perspective(1000px) rotateX(45deg)',
            'flip-down': 'perspective(1000px) rotateX(-45deg)',
            'flip-left': 'perspective(1000px) rotateY(45deg)',
            'flip-right': 'perspective(1000px) rotateY(-45deg)',
            'slide-up': 'translateY(100px)',
            'slide-down': 'translateY(-100px)',
            'slide-left': 'translateX(100px)',
            'slide-right': 'translateX(-100px)',
        };
        
        el.style.transform = transforms[animation] || transforms['fade-up'];
    },
    
    animateElement(el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) translateX(0) scale(1) rotateX(0) rotateY(0)';
        el.classList.add('aos-animate');
    },
    
    resetElement(el) {
        el.style.opacity = '0';
        this.prepareElement(el);
        el.classList.remove('aos-animate');
    },
    
    refresh() {
        this.elements.forEach(el => {
            this.observer.unobserve(el);
            this.observer.observe(el);
        });
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
};

/* =================================================================
   3. PARALLAX EFFECTS
================================================================= */

const ParallaxEffects = {
    elements: [],
    ticking: false,
    
    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        if (!this.elements.length || this.isMobile()) return;
        
        this.bindEvents();
        this.update();
    },
    
    isMobile() {
        return window.innerWidth < 992 || 'ontouchstart' in window;
    },
    
    bindEvents() {
        window.addEventListener('scroll', () => this.requestUpdate(), { passive: true });
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
    },
    
    requestUpdate() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.update();
                this.ticking = false;
            });
            this.ticking = true;
        }
    },
    
    update() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            
            // Check if element is in view
            if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
                const speed = parseFloat(el.dataset.parallaxSpeed) || AnimationConfig.parallax.speed;
                const direction = el.dataset.parallaxDirection || 'vertical';
                
                const progress = (scrollTop + windowHeight - elementTop) / (windowHeight + elementHeight);
                const offset = (progress - 0.5) * elementHeight * speed;
                
                if (direction === 'vertical') {
                    el.style.transform = `translate3d(0, ${offset}px, 0)`;
                } else if (direction === 'horizontal') {
                    el.style.transform = `translate3d(${offset}px, 0, 0)`;
                } else if (direction === 'both') {
                    el.style.transform = `translate3d(${offset}px, ${offset}px, 0)`;
                }
            }
        });
    },
    
    handleResize() {
        if (this.isMobile()) {
            this.elements.forEach(el => {
                el.style.transform = 'none';
            });
        }
    }
};

/* =================================================================
   4. MOUSE INTERACTIONS
================================================================= */

const MouseInteractions = {
    mouseX: 0,
    mouseY: 0,
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-mouse-move]');
        if (!this.elements.length) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.update();
        });
    },
    
    update() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.mouseSpeed) || 0.05;
            const invert = el.dataset.mouseInvert === 'true';
            
            let moveX = (this.mouseX - centerX) * speed;
            let moveY = (this.mouseY - centerY) * speed;
            
            if (invert) {
                moveX = -moveX;
                moveY = -moveY;
            }
            
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
};

/* =================================================================
   5. TEXT ANIMATIONS
================================================================= */

const TextAnimations = {
    init() {
        this.initSplitText();
        this.initTypingEffect();
        this.initCountUp();
    },
    
    // Split text into individual characters/words
    initSplitText() {
        const elements = document.querySelectorAll('[data-split-text]');
        
        elements.forEach(el => {
            const type = el.dataset.splitText || 'chars'; // chars, words, lines
            const text = el.textContent;
            const delay = parseFloat(el.dataset.splitDelay) || 0.05;
            
            el.innerHTML = '';
            el.style.display = 'inline-block';
            
            if (type === 'chars') {
                text.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.cssText = `
                        display: inline-block;
                        opacity: 0;
                        transform: translateY(50px);
                        animation: splitCharReveal 0.5s ease forwards ${i * delay}s;
                    `;
                    el.appendChild(span);
                });
            } else if (type === 'words') {
                text.split(' ').forEach((word, i) => {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.style.cssText = `
                        display: inline-block;
                        opacity: 0;
                        transform: translateY(30px);
                        animation: splitWordReveal 0.6s ease forwards ${i * delay * 2}s;
                        margin-right: 0.25em;
                    `;
                    el.appendChild(span);
                });
            }
        });
        
        // Add keyframes
        if (!document.getElementById('split-text-styles')) {
            const style = document.createElement('style');
            style.id = 'split-text-styles';
            style.textContent = `
                @keyframes splitCharReveal {
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes splitWordReveal {
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Typing effect
    initTypingEffect() {
        const elements = document.querySelectorAll('[data-typing]');
        
        elements.forEach(el => {
            const text = el.dataset.typing || el.textContent;
            const speed = parseInt(el.dataset.typingSpeed) || 100;
            const cursor = el.dataset.typingCursor !== 'false';
            const loop = el.dataset.typingLoop === 'true';
            
            el.textContent = '';
            el.style.borderRight = cursor ? '2px solid #8B4513' : 'none';
            el.style.animation = cursor ? 'blink-caret 0.75s step-end infinite' : 'none';
            
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else if (loop) {
                    setTimeout(() => {
                        el.textContent = '';
                        i = 0;
                        type();
                    }, 2000);
                }
            };
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        type();
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
        });
    },
    
    // Count up animation
    initCountUp() {
        const elements = document.querySelectorAll('[data-count-up]');
        
        elements.forEach(el => {
            const target = parseFloat(el.dataset.countUp) || parseFloat(el.textContent) || 0;
            const duration = parseInt(el.dataset.countDuration) || 2000;
            const suffix = el.dataset.countSuffix || '';
            const prefix = el.dataset.countPrefix || '';
            const decimals = parseInt(el.dataset.countDecimals) || 0;
            
            el.textContent = prefix + '0' + suffix;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.countUp(el, 0, target, duration, decimals, prefix, suffix);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
        });
    },
    
    countUp(el, start, end, duration, decimals, prefix, suffix) {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = AnimationConfig.easing.easeOutQuart(progress);
            const current = start + (end - start) * eased;
            
            el.textContent = prefix + current.toFixed(decimals) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
};

/* =================================================================
   6. IMAGE ANIMATIONS
================================================================= */

const ImageAnimations = {
    init() {
        this.initImageReveal();
        this.initImageParallax();
        this.initImageHover();
    },
    
    // Image reveal with clip-path
    initImageReveal() {
        const images = document.querySelectorAll('[data-image-reveal]');
        
        images.forEach(img => {
            const direction = img.dataset.imageReveal || 'left';
            const parent = img.parentElement;
            
            // Create wrapper if not exists
            if (!parent.classList.contains('image-reveal-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'image-reveal-wrapper';
                wrapper.style.cssText = `
                    position: relative;
                    overflow: hidden;
                    display: inline-block;
                `;
                parent.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }
            
            // Set initial clip-path
            const clipPaths = {
                left: 'inset(0 100% 0 0)',
                right: 'inset(0 0 0 100%)',
                top: 'inset(100% 0 0 0)',
                bottom: 'inset(0 0 100% 0)',
                center: 'inset(50% 50% 50% 50%)',
            };
            
            img.style.clipPath = clipPaths[direction] || clipPaths.left;
            img.style.transition = 'clip-path 1s cubic-bezier(0.77, 0, 0.175, 1)';
            
            // Observe and animate
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        img.style.clipPath = 'inset(0 0 0 0)';
                        observer.unobserve(img);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(img);
        });
    },
    
    // Image parallax on scroll
    initImageParallax() {
        const images = document.querySelectorAll('[data-image-parallax]');
        
        images.forEach(img => {
            const speed = parseFloat(img.dataset.imageParallax) || 0.3;
            
            // Ensure parent has overflow hidden
            const parent = img.parentElement;
            parent.style.overflow = 'hidden';
            
            // Scale image to prevent gaps
            img.style.transform = 'scale(1.2)';
            img.style.willChange = 'transform';
            
            const updateParallax = () => {
                const rect = parent.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const offset = (progress - 0.5) * rect.height * speed;
                    
                    img.style.transform = `scale(1.2) translateY(${offset}px)`;
                }
            };
            
            window.addEventListener('scroll', () => {
                requestAnimationFrame(updateParallax);
            }, { passive: true });
            
            updateParallax();
        });
    },
    
    // Image hover effects
    initImageHover() {
        const images = document.querySelectorAll('[data-image-hover]');
        
        images.forEach(img => {
            const effect = img.dataset.imageHover || 'zoom';
            
            img.style.transition = 'transform 0.5s ease, filter 0.5s ease';
            
            const effects = {
                zoom: () => {
                    img.style.transform = 'scale(1.1)';
                },
                'zoom-rotate': () => {
                    img.style.transform = 'scale(1.1) rotate(3deg)';
                },
                blur: () => {
                    img.style.filter = 'blur(2px)';
                },
                grayscale: () => {
                    img.style.filter = 'grayscale(100%)';
                },
                brightness: () => {
                    img.style.filter = 'brightness(1.2)';
                },
            };
            
            const reset = () => {
                img.style.transform = 'scale(1) rotate(0)';
                img.style.filter = 'none';
            };
            
            img.addEventListener('mouseenter', () => {
                if (effects[effect]) effects[effect]();
            });
            
            img.addEventListener('mouseleave', reset);
        });
    }
};

/* =================================================================
   7. CARD ANIMATIONS
================================================================= */

const CardAnimations = {
    init() {
        this.initTiltEffect();
        this.initFlipCards();
        this.initHoverLift();
    },
    
    // 3D Tilt effect on hover
    initTiltEffect() {
        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            const maxTilt = parseFloat(card.dataset.tiltMax) || 15;
            const perspective = card.dataset.tiltPerspective || 1000;
            const scale = parseFloat(card.dataset.tiltScale) || 1.05;
            const speed = parseInt(card.dataset.tiltSpeed) || 300;
            const glare = card.dataset.tiltGlare === 'true';
            
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = `transform ${speed}ms ease`;
            
            // Add glare effect
            if (glare) {
                const glareEl = document.createElement('div');
                glareEl.className = 'tilt-glare';
                glareEl.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.4) 0%,
                        rgba(255,255,255,0) 80%
                    );
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity ${speed}ms ease;
                `;
                card.appendChild(glareEl);
            }
            
            const handleMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;
                
                card.style.transform = `
                    perspective(${perspective}px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                `;
                
                if (glare) {
                    const glareEl = card.querySelector('.tilt-glare');
                    if (glareEl) {
                        glareEl.style.opacity = '1';
                        const glareX = (x / rect.width) * 100;
                        const glareY = (y / rect.height) * 100;
                        glareEl.style.background = `
                            radial-gradient(
                                circle at ${glareX}% ${glareY}%,
                                rgba(255,255,255,0.4) 0%,
                                rgba(255,255,255,0) 80%
                            )
                        `;
                    }
                }
            };
            
            const handleLeave = () => {
                card.style.transform = `
                    perspective(${perspective}px)
                    rotateX(0)
                    rotateY(0)
                    scale(1)
                `;
                
                if (glare) {
                    const glareEl = card.querySelector('.tilt-glare');
                    if (glareEl) glareEl.style.opacity = '0';
                }
            };
            
            card.addEventListener('mousemove', handleMove);
            card.addEventListener('mouseleave', handleLeave);
        });
    },
    
    // Flip cards
    initFlipCards() {
        const cards = document.querySelectorAll('[data-flip-card]');
        
        cards.forEach(card => {
            const trigger = card.dataset.flipTrigger || 'hover'; // hover, click
            const direction = card.dataset.flipDirection || 'horizontal'; // horizontal, vertical
            
            card.style.cssText = `
                perspective: 1000px;
                transform-style: preserve-3d;
            `;
            
            const inner = card.querySelector('.flip-card-inner');
            if (inner) {
                inner.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s ease;
                    transform-style: preserve-3d;
                `;
            }
            
            const doFlip = () => {
                if (inner) {
                    const rotation = direction === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)';
                    inner.style.transform = rotation;
                }
            };
            
            const unFlip = () => {
                if (inner) {
                    inner.style.transform = 'rotateY(0) rotateX(0)';
                }
            };
            
            if (trigger === 'hover') {
                card.addEventListener('mouseenter', doFlip);
                card.addEventListener('mouseleave', unFlip);
            } else if (trigger === 'click') {
                let flipped = false;
                card.addEventListener('click', () => {
                    flipped = !flipped;
                    flipped ? doFlip() : unFlip();
                });
            }
        });
    },
    
    // Hover lift effect
    initHoverLift() {
        const cards = document.querySelectorAll('[data-hover-lift]');
        
        cards.forEach(card => {
            const liftAmount = card.dataset.hoverLift || 10;
            const shadow = card.dataset.hoverShadow !== 'false';
            
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = `translateY(-${liftAmount}px)`;
                if (shadow) {
                    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                if (shadow) {
                    card.style.boxShadow = '';
                }
            });
        });
    }
};

/* =================================================================
   8. BUTTON ANIMATIONS
================================================================= */

const ButtonAnimations = {
    init() {
        this.initRippleEffect();
        this.initMagneticButtons();
        this.initShineEffect();
    },
    
    // Material ripple effect
    initRippleEffect() {
        const buttons = document.querySelectorAll('[data-ripple], .btn');
        
        buttons.forEach(btn => {
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                    width: 10px;
                    height: 10px;
                    margin-left: -5px;
                    margin-top: -5px;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple keyframes
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(50);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Magnetic button effect
    initMagneticButtons() {
        const buttons = document.querySelectorAll('[data-magnetic]');
        
        buttons.forEach(btn => {
            const strength = parseFloat(btn.dataset.magnetic) || 0.3;
            
            btn.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0)';
            });
        });
    },
    
    // Shine effect on hover
    initShineEffect() {
        const buttons = document.querySelectorAll('[data-shine]');
        
        buttons.forEach(btn => {
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            
            const shine = document.createElement('span');
            shine.className = 'shine-effect';
            shine.style.cssText = `
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    to right,
                    rgba(255,255,255,0) 0%,
                    rgba(255,255,255,0.3) 50%,
                    rgba(255,255,255,0) 100%
                );
                transform: rotate(45deg) translateX(-100%);
                transition: transform 0.6s ease;
                pointer-events: none;
            `;
            btn.appendChild(shine);
            
            btn.addEventListener('mouseenter', () => {
                shine.style.transform = 'rotate(45deg) translateX(100%)';
            });
            
            btn.addEventListener('mouseleave', () => {
                shine.style.transform = 'rotate(45deg) translateX(-100%)';
            });
        });
    }
};

/* =================================================================
   9. LOADING ANIMATIONS
================================================================= */

const LoadingAnimations = {
    init() {
        this.initSkeletonLoaders();
        this.initProgressBars();
    },
    
    // Skeleton loading placeholders
    initSkeletonLoaders() {
        const skeletons = document.querySelectorAll('[data-skeleton]');
        
        skeletons.forEach(el => {
            el.classList.add('skeleton-loading');
            el.style.cssText = `
                background: linear-gradient(
                    90deg,
                    #f0f0f0 25%,
                    #e0e0e0 50%,
                    #f0f0f0 75%
                );
                background-size: 200% 100%;
                animation: skeleton-shimmer 1.5s infinite;
            `;
        });
        
        // Add skeleton keyframes
        if (!document.getElementById('skeleton-styles')) {
            const style = document.createElement('style');
            style.id = 'skeleton-styles';
            style.textContent = `
                @keyframes skeleton-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Animated progress bars
    initProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        progressBars.forEach(bar => {
            const value = parseInt(bar.dataset.progress) || 0;
            const duration = parseInt(bar.dataset.progressDuration) || 1000;
            const showLabel = bar.dataset.progressLabel !== 'false';
            
            const fill = bar.querySelector('.progress-fill') || bar;
            fill.style.width = '0%';
            fill.style.transition = `width ${duration}ms ease-out`;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            fill.style.width = `${value}%`;
                            
                            if (showLabel) {
                                this.animateProgressLabel(bar, value, duration);
                            }
                        }, 100);
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    },
    
    animateProgressLabel(bar, target, duration) {
        const label = bar.querySelector('.progress-label');
        if (!label) return;
        
        const start = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(target * AnimationConfig.easing.easeOutQuart(progress));
            
            label.textContent = `${current}%`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },
    
    // Show loading spinner
    showSpinner(container, options = {}) {
        const {
            size = 40,
            color = '#8B4513',
            type = 'circle'
        } = options;
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const spinnerHTML = {
            circle: `
                <svg width="${size}" height="${size}" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="80 40" stroke-linecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            `,
            dots: `
                <div style="display: flex; gap: 8px;">
                    ${[0, 1, 2].map(i => `
                        <div style="
                            width: ${size / 4}px;
                            height: ${size / 4}px;
                            background: ${color};
                            border-radius: 50%;
                            animation: dot-bounce 1.4s infinite ease-in-out ${i * 0.16}s;
                        "></div>
                    `).join('')}
                </div>
            `,
            bars: `
                <div style="display: flex; gap: 4px; align-items: end; height: ${size}px;">
                    ${[0, 1, 2, 3, 4].map(i => `
                        <div style="
                            width: ${size / 8}px;
                            height: 100%;
                            background: ${color};
                            animation: bar-scale 1.2s infinite ease-in-out ${i * 0.1}s;
                        "></div>
                    `).join('')}
                </div>
            `,
        };
        
        spinner.innerHTML = spinnerHTML[type] || spinnerHTML.circle;
        spinner.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        `;
        
        if (container) {
            container.appendChild(spinner);
        }
        
        return spinner;
    },
    
    hideSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.remove();
        }
    }
};

/* =================================================================
   10. PAGE TRANSITIONS
================================================================= */

const PageTransitions = {
    overlay: null,
    
    init() {
        this.createOverlay();
        this.bindEvents();
    },
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #8B4513 0%, #5D2F0E 100%);
            z-index: 99999;
            transform: translateY(100%);
            transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
            pointer-events: none;
        `;
        document.body.appendChild(this.overlay);
    },
    
    bindEvents() {
        // Intercept internal links
        document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href^="./"]:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if same page anchor
                if (href.startsWith('#')) return;
                
                e.preventDefault();
                this.navigateTo(href);
            });
        });
    },
    
    async navigateTo(url) {
        // Show overlay
        this.overlay.style.transform = 'translateY(0)';
        
        // Wait for animation
        await this.wait(500);
        
        // Navigate
        window.location.href = url;
    },
    
    // Play exit animation
    async exit() {
        this.overlay.style.transform = 'translateY(0)';
        await this.wait(500);
    },
    
    // Play enter animation
    async enter() {
        await this.wait(100);
        this.overlay.style.transform = 'translateY(-100%)';
    },
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

/* =================================================================
   11. COUNTER ANIMATIONS
================================================================= */

const AdvancedCounters = {
    init() {
        this.initCounters();
        this.initTimers();
    },
    
    initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.counter);
            const duration = parseInt(counter.dataset.counterDuration) || 2000;
            const decimals = parseInt(counter.dataset.counterDecimals) || 0;
            const prefix = counter.dataset.counterPrefix || '';
            const suffix = counter.dataset.counterSuffix || '';
            const separator = counter.dataset.counterSeparator !== 'false';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate(counter, 0, target, duration, decimals, prefix, suffix, separator);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    },
    
    animate(el, start, end, duration, decimals, prefix, suffix, useSeparator) {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = AnimationConfig.easing.easeOutExpo(progress);
            
            let current = start + (end - start) * eased;
            current = parseFloat(current.toFixed(decimals));
            
            if (useSeparator) {
                current = current.toLocaleString();
            }
            
            el.textContent = prefix + current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },
    
    // Countdown timer
    initTimers() {
        const timers = document.querySelectorAll('[data-countdown]');
        
        timers.forEach(timer => {
            const targetDate = new Date(timer.dataset.countdown).getTime();
            
            const updateTimer = () => {
                const now = Date.now();
                const distance = targetDate - now;
                
                if (distance < 0) {
                    timer.innerHTML = 'Event Started!';
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                timer.innerHTML = `
                    <div class="countdown-item"><span>${days}</span><small>Days</small></div>
                    <div class="countdown-item"><span>${hours}</span><small>Hours</small></div>
                    <div class="countdown-item"><span>${minutes}</span><small>Minutes</small></div>
                    <div class="countdown-item"><span>${seconds}</span><small>Seconds</small></div>
                `;
            };
            
            updateTimer();
            setInterval(updateTimer, 1000);
        });
    }
};

/* =================================================================
   12. STAGGER ANIMATIONS
================================================================= */

const StaggerAnimations = {
    init() {
        this.initStaggerGroups();
    },
    
    initStaggerGroups() {
        const groups = document.querySelectorAll('[data-stagger]');
        
        groups.forEach(group => {
            const children = group.children;
            const delay = parseFloat(group.dataset.staggerDelay) || 0.1;
            const animation = group.dataset.staggerAnimation || 'fadeInUp';
            const duration = parseFloat(group.dataset.staggerDuration) || 0.5;
            
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.animation = 'none';
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(children).forEach((child, index) => {
                            child.style.animation = `${animation} ${duration}s ease forwards ${index * delay}s`;
                        });
                        observer.unobserve(group);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(group);
        });
    },
    
    // Manually trigger stagger animation
    trigger(container, options = {}) {
        const {
            delay = 0.1,
            animation = 'fadeInUp',
            duration = 0.5,
            selector = ':scope > *'
        } = options;
        
        const children = container.querySelectorAll(selector);
        
        children.forEach((child, index) => {
            child.style.opacity = '0';
            setTimeout(() => {
                child.style.animation = `${animation} ${duration}s ease forwards`;
            }, index * delay * 1000);
        });
    }
};

/* =================================================================
   13. HOVER EFFECTS
================================================================= */

const HoverEffects = {
    init() {
        this.initUnderlineEffects();
        this.initBackgroundSlide();
        this.initBorderAnimation();
    },
    
    // Animated underlines
    initUnderlineEffects() {
        const elements = document.querySelectorAll('[data-underline]');
        
        elements.forEach(el => {
            const style = el.dataset.underline || 'left'; // left, right, center, expand
            const color = el.dataset.underlineColor || '#8B4513';
            const height = el.dataset.underlineHeight || '2px';
            
            el.style.position = 'relative';
            el.style.display = 'inline-block';
            
            const underline = document.createElement('span');
            underline.className = 'animated-underline';
            
            const baseStyles = `
                position: absolute;
                bottom: 0;
                height: ${height};
                background: ${color};
                transition: all 0.3s ease;
            `;
            
            const styles = {
                left: `${baseStyles} left: 0; width: 0;`,
                right: `${baseStyles} right: 0; width: 0;`,
                center: `${baseStyles} left: 50%; width: 0; transform: translateX(-50%);`,
                expand: `${baseStyles} left: 50%; width: 0; transform: translateX(-50%);`,
            };
            
            underline.style.cssText = styles[style] || styles.left;
            el.appendChild(underline);
            
            el.addEventListener('mouseenter', () => {
                underline.style.width = '100%';
            });
            
            el.addEventListener('mouseleave', () => {
                underline.style.width = '0';
            });
        });
    },
    
    // Background slide effect
    initBackgroundSlide() {
        const elements = document.querySelectorAll('[data-bg-slide]');
        
        elements.forEach(el => {
            const direction = el.dataset.bgSlide || 'left'; // left, right, top, bottom
            const color = el.dataset.bgSlideColor || '#8B4513';
            
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.style.zIndex = '1';
            
            const bg = document.createElement('span');
            bg.className = 'slide-bg';
            
            const positions = {
                left: 'left: -100%; top: 0; width: 100%; height: 100%;',
                right: 'right: -100%; top: 0; width: 100%; height: 100%;',
                top: 'top: -100%; left: 0; width: 100%; height: 100%;',
                bottom: 'bottom: -100%; left: 0; width: 100%; height: 100%;',
            };
            
            bg.style.cssText = `
                position: absolute;
                ${positions[direction] || positions.left}
                background: ${color};
                transition: all 0.4s ease;
                z-index: -1;
            `;
            
            el.insertBefore(bg, el.firstChild);
            
            const transforms = {
                left: ['translateX(100%)', 'translateX(0)'],
                right: ['translateX(-100%)', 'translateX(0)'],
                top: ['translateY(100%)', 'translateY(0)'],
                bottom: ['translateY(-100%)', 'translateY(0)'],
            };
            
            el.addEventListener('mouseenter', () => {
                bg.style.transform = transforms[direction][1];
            });
            
            el.addEventListener('mouseleave', () => {
                bg.style.transform = transforms[direction][0];
            });
        });
    },
    
    // Animated borders
    initBorderAnimation() {
        const elements = document.querySelectorAll('[data-border-animate]');
        
        elements.forEach(el => {
            const color = el.dataset.borderColor || '#8B4513';
            const width = el.dataset.borderWidth || '2px';
            
            el.style.position = 'relative';
            
            // Create 4 border spans
            ['top', 'right', 'bottom', 'left'].forEach((pos, i) => {
                const border = document.createElement('span');
                border.className = `animated-border border-${pos}`;
                
                const isHorizontal = pos === 'top' || pos === 'bottom';
                
                border.style.cssText = `
                    position: absolute;
                    background: ${color};
                    transition: all 0.3s ease ${i * 0.1}s;
                    ${isHorizontal ? `
                        height: ${width};
                        width: 0;
                        ${pos}: 0;
                        ${pos === 'top' ? 'left' : 'right'}: 0;
                    ` : `
                        width: ${width};
                        height: 0;
                        ${pos}: 0;
                        ${pos === 'left' ? 'top' : 'bottom'}: 0;
                    `}
                `;
                
                el.appendChild(border);
            });
            
            el.addEventListener('mouseenter', () => {
                el.querySelectorAll('.animated-border').forEach(border => {
                    if (border.classList.contains('border-top') || border.classList.contains('border-bottom')) {
                        border.style.width = '100%';
                    } else {
                        border.style.height = '100%';
                    }
                });
            });
            
            el.addEventListener('mouseleave', () => {
                el.querySelectorAll('.animated-border').forEach(border => {
                    if (border.classList.contains('border-top') || border.classList.contains('border-bottom')) {
                        border.style.width = '0';
                    } else {
                        border.style.height = '0';
                    }
                });
            });
        });
    }
};

/* =================================================================
   14. MAGNETIC EFFECT
================================================================= */

const MagneticEffect = {
    elements: [],
    
    init() {
        this.elements = document.querySelectorAll('[data-magnetic]');
        if (!this.elements.length || this.isTouchDevice()) return;
        
        this.bindEvents();
    },
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    bindEvents() {
        this.elements.forEach(el => {
            const strength = parseFloat(el.dataset.magneticStrength) || 0.5;
            const ease = parseFloat(el.dataset.magneticEase) || 0.1;
            
            let bounds;
            let mouseX = 0;
            let mouseY = 0;
            let currentX = 0;
            let currentY = 0;
            let rafId = null;
            
            const lerp = (start, end, factor) => start + (end - start) * factor;
            
            const animate = () => {
                currentX = lerp(currentX, mouseX, ease);
                currentY = lerp(currentY, mouseY, ease);
                
                el.style.transform = `translate(${currentX}px, ${currentY}px)`;
                
                if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
                    rafId = requestAnimationFrame(animate);
                }
            };
            
            el.addEventListener('mouseenter', () => {
                bounds = el.getBoundingClientRect();
            });
            
            el.addEventListener('mousemove', (e) => {
                const x = e.clientX - bounds.left - bounds.width / 2;
                const y = e.clientY - bounds.top - bounds.height / 2;
                
                mouseX = x * strength;
                mouseY = y * strength;
                
                if (!rafId) {
                    rafId = requestAnimationFrame(animate);
                }
            });
            
            el.addEventListener('mouseleave', () => {
                mouseX = 0;
                mouseY = 0;
                
                if (!rafId) {
                    rafId = requestAnimationFrame(animate);
                }
            });
        });
    }
};

/* =================================================================
   15. CURSOR EFFECTS
================================================================= */

const CursorEffects = {
    cursor: null,
    follower: null,
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    followerX: 0,
    followerY: 0,
    
    init() {
        if (this.isTouchDevice() || !document.body.dataset.customCursor) return;
        
        this.createCursor();
        this.bindEvents();
        this.animate();
    },
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 8px;
            height: 8px;
            background: #8B4513;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, background 0.2s ease;
            mix-blend-mode: difference;
        `;
        
        // Follower
        this.follower = document.createElement('div');
        this.follower.className = 'cursor-follower';
        this.follower.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border: 1px solid #8B4513;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99998;
            transform: translate(-50%, -50%);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0.5;
        `;
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.follower);
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    },
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Interactive elements
        const interactives = document.querySelectorAll('a, button, [data-cursor-hover]');
        
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                this.follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.follower.style.opacity = '0.3';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.follower.style.transform = 'translate(-50%, -50%) scale(1)';
                this.follower.style.opacity = '0.5';
            });
        });
        
        // Click effect
        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    },
    
    animate() {
        // Smooth follow
        this.cursorX += (this.mouseX - this.cursorX) * 0.2;
        this.cursorY += (this.mouseY - this.cursorY) * 0.2;
        
        this.followerX += (this.mouseX - this.followerX) * 0.1;
        this.followerY += (this.mouseY - this.followerY) * 0.1;
        
        this.cursor.style.left = `${this.cursorX}px`;
        this.cursor.style.top = `${this.cursorY}px`;
        
        this.follower.style.left = `${this.followerX}px`;
        this.follower.style.top = `${this.followerY}px`;
        
        requestAnimationFrame(() => this.animate());
    }
};

/* =================================================================
   16. PARTICLE SYSTEM
================================================================= */

const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    
    init(container = document.body, options = {}) {
        const {
            count = 50,
            color = '#8B4513',
            minSize = 2,
            maxSize = 5,
            speed = 1,
            connect = true,
            connectDistance = 150,
        } = options;
        
        this.options = { count, color, minSize, maxSize, speed, connect, connectDistance };
        
        this.createCanvas(container);
        this.createParticles();
        this.animate();
        this.bindEvents();
    },
    
    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.style.position = 'relative';
        container.insertBefore(this.canvas, container.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    },
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    },
    
    createParticles() {
        const { count, minSize, maxSize, speed, color } = this.options;
        
        this.particles = [];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (maxSize - minSize) + minSize,
                speedX: (Math.random() - 0.5) * speed,
                speedY: (Math.random() - 0.5) * speed,
                color: color,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around
            if (p.x > this.canvas.width) p.x = 0;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.y > this.canvas.height) p.y = 0;
            if (p.y < 0) p.y = this.canvas.height;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
            
            // Connect particles
            if (this.options.connect) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.options.connectDistance) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = p.color;
                        this.ctx.globalAlpha = (1 - distance / this.options.connectDistance) * 0.2;
                        this.ctx.stroke();
                    }
                }
            }
        });
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    },
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
};

/* =================================================================
   17. COFFEE ANIMATIONS
================================================================= */

const CoffeeAnimations = {
    init() {
        this.initSteamEffect();
        this.initPourEffect();
        this.initBeanFloat();
    },
    
    // Steam rising effect
    initSteamEffect() {
        const steamContainers = document.querySelectorAll('[data-steam]');
        
        steamContainers.forEach(container => {
            const count = parseInt(container.dataset.steamCount) || 3;
            
            for (let i = 0; i < count; i++) {
                const steam = document.createElement('div');
                steam.className = 'steam-particle';
                steam.style.cssText = `
                    position: absolute;
                    width: ${8 + Math.random() * 4}px;
                    height: ${20 + Math.random() * 20}px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    bottom: 100%;
                    left: ${20 + i * 30}%;
                    animation: steam-rise ${2 + Math.random()}s ease-in-out infinite;
                    animation-delay: ${i * 0.3}s;
                `;
                container.appendChild(steam);
            }
        });
        
        // Add keyframes
        if (!document.getElementById('steam-styles')) {
            const style = document.createElement('style');
            style.id = 'steam-styles';
            style.textContent = `
                @keyframes steam-rise {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(-50px) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Coffee pouring effect
    initPourEffect() {
        const pourElements = document.querySelectorAll('[data-pour]');
        
        pourElements.forEach(el => {
            el.style.cssText = `
                background: linear-gradient(180deg, #5D2F0E 0%, #8B4513 100%);
                clip-path: polygon(40% 0, 60% 0, 70% 100%, 30% 100%);
                animation: coffee-pour 2s ease-in-out;
            `;
        });
    },
    
    // Floating coffee beans
    initBeanFloat() {
        const beanContainers = document.querySelectorAll('[data-coffee-beans]');
        
        beanContainers.forEach(container => {
            const count = parseInt(container.dataset.coffeeBeans) || 5;
            
            for (let i = 0; i < count; i++) {
                const bean = document.createElement('div');
                bean.className = 'floating-bean';
                bean.innerHTML = '☕'; // Or use SVG
                bean.style.cssText = `
                    position: absolute;
                    font-size: ${20 + Math.random() * 20}px;
                    opacity: 0.3;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: bean-float ${5 + Math.random() * 5}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                container.appendChild(bean);
            }
        });
        
        // Add keyframes
        if (!document.getElementById('bean-styles')) {
            const style = document.createElement('style');
            style.id = 'bean-styles';
            style.textContent = `
                @keyframes bean-float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-30px) rotate(180deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

/* =================================================================
   18. GSAP-LIKE TWEENING
================================================================= */

const Tween = {
    animations: new Map(),
    
    to(element, duration, props, options = {}) {
        const {
            delay = 0,
            ease = 'easeOutQuad',
            onStart,
            onUpdate,
            onComplete,
        } = options;
        
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return null;
        
        const id = Symbol('tween');
        const startTime = performance.now() + delay * 1000;
        const durationMs = duration * 1000;
        
        // Get initial values
        const computed = getComputedStyle(el);
        const startValues = {};
        const endValues = {};
        
        for (const prop in props) {
            if (prop === 'x' || prop === 'y' || prop === 'rotation' || prop === 'scale') {
                startValues[prop] = 0;
                endValues[prop] = props[prop];
            } else {
                startValues[prop] = parseFloat(computed[prop]) || 0;
                endValues[prop] = props[prop];
            }
        }
        
        const easeFn = AnimationConfig.easing[ease] || AnimationConfig.easing.easeOutQuad;
        
        let called = false;
        
        const animate = (currentTime) => {
            if (currentTime < startTime) {
                requestAnimationFrame(animate);
                return;
            }
            
            if (!called && onStart) {
                onStart();
                called = true;
            }
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = easeFn(progress);
            
            // Apply transforms
            let transform = '';
            let styles = {};
            
            for (const prop in startValues) {
                const start = startValues[prop];
                const end = endValues[prop];
                const current = start + (end - start) * eased;
                
                if (prop === 'x') {
                    transform += `translateX(${current}px) `;
                } else if (prop === 'y') {
                    transform += `translateY(${current}px) `;
                } else if (prop === 'rotation') {
                    transform += `rotate(${current}deg) `;
                } else if (prop === 'scale') {
                    transform += `scale(${current}) `;
                } else if (prop === 'opacity') {
                    styles.opacity = current;
                } else {
                    styles[prop] = current + (typeof end === 'number' && prop !== 'opacity' ? 'px' : '');
                }
            }
            
            if (transform) {
                el.style.transform = transform.trim();
            }
            
            for (const style in styles) {
                el.style[style] = styles[style];
            }
            
            if (onUpdate) onUpdate(progress);
            
            if (progress < 1) {
                this.animations.set(id, requestAnimationFrame(animate));
            } else {
                this.animations.delete(id);
                if (onComplete) onComplete();
            }
        };
        
        this.animations.set(id, requestAnimationFrame(animate));
        
        return {
            id,
            kill: () => {
                const rafId = this.animations.get(id);
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    this.animations.delete(id);
                }
            }
        };
    },
    
    from(element, duration, props, options = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return null;
        
        // Set initial state
        for (const prop in props) {
            if (prop === 'x') {
                el.style.transform = `translateX(${props[prop]}px)`;
            } else if (prop === 'y') {
                el.style.transform = `translateY(${props[prop]}px)`;
            } else if (prop === 'opacity') {
                el.style.opacity = props[prop];
            }
        }
        
        // Animate to original
        const endProps = {};
        for (const prop in props) {
            endProps[prop] = 0;
            if (prop === 'opacity') endProps[prop] = 1;
        }
        
        return this.to(element, duration, endProps, options);
    },
    
    killAll() {
        this.animations.forEach((rafId, id) => {
            cancelAnimationFrame(rafId);
        });
        this.animations.clear();
    }
};

/* =================================================================
   19. ANIMATION QUEUE
================================================================= */

const AnimationQueue = {
    queue: [],
    isPlaying: false,
    
    add(animation) {
        this.queue.push(animation);
        return this;
    },
    
    async play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        while (this.queue.length > 0) {
            const animation = this.queue.shift();
            await this.runAnimation(animation);
        }
        
        this.isPlaying = false;
    },
    
    runAnimation(animation) {
        return new Promise((resolve) => {
            const { element, type, duration = 500, props = {}, delay = 0 } = animation;
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            
            if (!el) {
                resolve();
                return;
            }
            
            setTimeout(() => {
                el.style.transition = `all ${duration}ms ease`;
                
                for (const prop in props) {
                    el.style[prop] = props[prop];
                }
                
                setTimeout(resolve, duration);
            }, delay);
        });
    },
    
    clear() {
        this.queue = [];
        this.isPlaying = false;
    }
};

/* =================================================================
   20. INITIALIZE ANIMATIONS
================================================================= */

const AnimationsApp = {
    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },
    
    start() {
        console.log('%c🎬 Animations Module', 'font-size: 16px; font-weight: bold; color: #8B4513;');
        
        // Core animations
        ScrollReveal.init();
        ParallaxEffects.init();
        
        // Text & Image
        TextAnimations.init();
        ImageAnimations.init();
        
        // Interactive elements
        CardAnimations.init();
        ButtonAnimations.init();
        HoverEffects.init();
        
        // Advanced effects
        MagneticEffect.init();
        MouseInteractions.init();
        // CursorEffects.init(); // Uncomment for custom cursor
        
        // Theme specific
        CoffeeAnimations.init();
        
        // Counters & Loading
        AdvancedCounters.init();
        LoadingAnimations.init();
        
        // Stagger
        StaggerAnimations.init();
        
        // Page transitions
        PageTransitions.init();
        
        console.log('%c✅ Animations initialized!', 'color: #28a745;');
    },
    
    // Refresh animations (useful after dynamic content load)
    refresh() {
        ScrollReveal.refresh();
    },
    
    // Destroy all animations
    destroy() {
        ScrollReveal.destroy();
        ParticleSystem.destroy();
        Tween.killAll();
        AnimationQueue.clear();
    }
};

// Initialize
AnimationsApp.init();

// Export for external use
window.TomoroAnimations = {
    ScrollReveal,
    ParallaxEffects,
    TextAnimations,
    ImageAnimations,
    CardAnimations,
    ButtonAnimations,
    LoadingAnimations,
    ParticleSystem,
    Tween,
    AnimationQueue,
    AnimationConfig,
    refresh: () => AnimationsApp.refresh(),
    destroy: () => AnimationsApp.destroy(),
};

/* =================================================================
   END OF ANIMATIONS.JS
================================================================= */