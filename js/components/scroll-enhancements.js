/*
=================================================================
  TOMORO COFFEE BANGKA - SCROLL ENHANCEMENTS
  Version: 1.0.0
  Author: Professional Web Developer
  Description: Advanced Scroll UI Components & Interactions
=================================================================
*/

'use strict';

/* =================================================================
   SCROLL ENHANCEMENTS MODULE
================================================================= */

const ScrollEnhancements = (function() {
    
    /* =================================================================
       CONFIGURATION
    ================================================================= */
    const CONFIG = {
        // Selectors
        sections: 'section[id]',
        navbarHeight: 80,
        
        // Thresholds
        showDotsAfter: 100,
        showProgressAfter: 50,
        hideHintAfter: 200,
        
        // Animation
        smoothScrollDuration: 800,
        updateThrottle: 16, // ~60fps
        
        // Reading time
        wordsPerMinute: 200,
        
        // Section icons (customize as needed)
        sectionIcons: {
            'home': 'fa-home',
            'about': 'fa-info-circle',
            'menu': 'fa-utensils',
            'gallery': 'fa-images',
            'download': 'fa-mobile-alt',
            'location': 'fa-map-marker-alt',
            'contact': 'fa-envelope',
            'default': 'fa-circle'
        },
        
        // Section names (customize as needed)
        sectionNames: {
            'home': 'Home',
            'about': 'About Us',
            'menu': 'Our Menu',
            'gallery': 'Gallery',
            'download': 'Download App',
            'location': 'Locations',
            'contact': 'Contact',
            'default': 'Section'
        }
    };
    
    /* =================================================================
       STATE
    ================================================================= */
    const STATE = {
        sections: [],
        currentSection: null,
        currentSectionIndex: 0,
        scrollProgress: 0,
        isScrolling: false,
        lastScrollTop: 0,
        scrollDirection: 'down',
        totalReadingTime: 0,
        remainingReadingTime: 0,
        initialized: false
    };
    
    /* =================================================================
       DOM ELEMENTS
    ================================================================= */
    let DOM = {};
    
    /* =================================================================
       UTILITY FUNCTIONS
    ================================================================= */
    const Utils = {
        // Throttle function
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
        
        // Debounce function
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        // Get scroll position
        getScrollTop() {
            return window.pageYOffset || document.documentElement.scrollTop;
        },
        
        // Get document height
        getDocumentHeight() {
            return Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
        },
        
        // Get viewport height
        getViewportHeight() {
            return window.innerHeight;
        },
        
        // Calculate scroll progress
        getScrollProgress() {
            const scrollTop = this.getScrollTop();
            const docHeight = this.getDocumentHeight();
            const viewHeight = this.getViewportHeight();
            const scrollable = docHeight - viewHeight;
            return scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
        },
        
        // Smooth scroll with easing
        smoothScrollTo(target, duration = CONFIG.smoothScrollDuration) {
            const targetPosition = target - CONFIG.navbarHeight;
            const startPosition = this.getScrollTop();
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            const easeInOutCubic = (t) => {
                return t < 0.5 
                    ? 4 * t * t * t 
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
            
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easing = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + (distance * easing));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };
            
            requestAnimationFrame(animation);
        },
        
        // Calculate reading time
        calculateReadingTime(element) {
            const text = element.textContent || element.innerText;
            const wordCount = text.trim().split(/\s+/).length;
            return Math.ceil(wordCount / CONFIG.wordsPerMinute);
        },
        
        // Format time
        formatTime(minutes) {
            if (minutes < 1) return '< 1 min';
            if (minutes === 1) return '1 min';
            return `${minutes} min`;
        }
    };
    
    /* =================================================================
       CREATE DOM ELEMENTS
    ================================================================= */
    function createElements() {
        // Create main container
        const container = document.createElement('div');
        container.id = 'scroll-enhancements';
        
        container.innerHTML = `
            <!-- Scroll Progress Bar -->
            <div class="scroll-progress-container">
                <div class="scroll-progress-bar" id="scrollProgressBar"></div>
            </div>
            
            <!-- Section Navigation Dots -->
            <nav class="section-nav-dots" id="sectionNavDots" aria-label="Section Navigation">
                <div class="nav-dots-line">
                    <div class="nav-dots-line-progress" id="dotsLineProgress"></div>
                </div>
                <div id="navDotsContainer"></div>
            </nav>
            
            <!-- Reading Progress Badge -->
            <div class="reading-progress-badge" id="readingProgressBadge">
                <div class="reading-progress-circle">
                    <svg viewBox="0 0 44 44">
                        <circle class="circle-bg" cx="22" cy="22" r="20"></circle>
                        <circle class="circle-progress" id="readingCircleProgress" cx="22" cy="22" r="20"></circle>
                    </svg>
                    <span class="reading-progress-percentage" id="readingPercentage">0%</span>
                </div>
                <div class="reading-info">
                    <span class="reading-info-label">Reading Time</span>
                    <span class="reading-info-time" id="readingTime">0 min left</span>
                </div>
            </div>
            
            <!-- Current Section Indicator -->
            <div class="current-section-indicator" id="currentSectionIndicator">
                <div class="section-indicator-icon" id="sectionIndicatorIcon">
                    <i class="fas fa-home"></i>
                </div>
                <div class="section-indicator-text">
                    <span class="section-indicator-label">Current Section</span>
                    <span class="section-indicator-title" id="sectionIndicatorTitle">Home</span>
                </div>
                <div class="section-indicator-progress">
                    <div class="section-indicator-progress-bar" id="sectionProgressBar"></div>
                </div>
            </div>
            
            <!-- Scroll Hint -->
            <div class="scroll-hint" id="scrollHint">
                <div class="scroll-hint-mouse">
                    <div class="scroll-hint-wheel"></div>
                </div>
                <span class="scroll-hint-text">Scroll</span>
                <div class="scroll-hint-arrows">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            
            <!-- Floating Section Label -->
            <div class="floating-section-label" id="floatingSectionLabel">
                <span class="section-label-line"></span>
                <span class="section-label-number" id="sectionLabelNumber">01</span>
                <span class="section-label-text" id="sectionLabelText">Home</span>
            </div>
            
            <!-- Scroll Percentage Badge -->
            <div class="scroll-percentage-badge" id="scrollPercentageBadge">
                <div class="percentage-icon">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <span class="percentage-value">
                    <span id="percentageValue">0</span>%
                </span>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Cache DOM references
        DOM = {
            container,
            progressBar: document.getElementById('scrollProgressBar'),
            navDots: document.getElementById('sectionNavDots'),
            navDotsContainer: document.getElementById('navDotsContainer'),
            dotsLineProgress: document.getElementById('dotsLineProgress'),
            readingBadge: document.getElementById('readingProgressBadge'),
            readingCircle: document.getElementById('readingCircleProgress'),
            readingPercentage: document.getElementById('readingPercentage'),
            readingTime: document.getElementById('readingTime'),
            sectionIndicator: document.getElementById('currentSectionIndicator'),
            sectionIndicatorIcon: document.getElementById('sectionIndicatorIcon'),
            sectionIndicatorTitle: document.getElementById('sectionIndicatorTitle'),
            sectionProgressBar: document.getElementById('sectionProgressBar'),
            scrollHint: document.getElementById('scrollHint'),
            floatingLabel: document.getElementById('floatingSectionLabel'),
            sectionLabelNumber: document.getElementById('sectionLabelNumber'),
            sectionLabelText: document.getElementById('sectionLabelText'),
            percentageBadge: document.getElementById('scrollPercentageBadge'),
            percentageValue: document.getElementById('percentageValue')
        };
    }
    
    /* =================================================================
       INITIALIZE SECTIONS
    ================================================================= */
    function initSections() {
        const sectionElements = document.querySelectorAll(CONFIG.sections);
        STATE.sections = [];
        
        sectionElements.forEach((section, index) => {
            const id = section.getAttribute('id');
            const name = CONFIG.sectionNames[id] || CONFIG.sectionNames.default;
            const icon = CONFIG.sectionIcons[id] || CONFIG.sectionIcons.default;
            
            STATE.sections.push({
                id,
                name,
                icon,
                element: section,
                index: index + 1,
                top: section.offsetTop,
                height: section.offsetHeight,
                readingTime: Utils.calculateReadingTime(section)
            });
        });
        
        // Calculate total reading time
        STATE.totalReadingTime = STATE.sections.reduce((total, section) => {
            return total + section.readingTime;
        }, 0);
        
        // Create navigation dots
        createNavigationDots();
    }
    
    /* =================================================================
       CREATE NAVIGATION DOTS
    ================================================================= */
    function createNavigationDots() {
        if (!DOM.navDotsContainer) return;
        
        DOM.navDotsContainer.innerHTML = '';
        
        STATE.sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.setAttribute('aria-label', `Navigate to ${section.name}`);
            dot.setAttribute('data-section', section.id);
            dot.setAttribute('data-index', index);
            
            dot.innerHTML = `
                <span class="nav-dot-tooltip">${section.name}</span>
            `;
            
            dot.addEventListener('click', () => {
                navigateToSection(section.id);
            });
            
            DOM.navDotsContainer.appendChild(dot);
        });
        
        // Store dot references
        DOM.dots = DOM.navDotsContainer.querySelectorAll('.nav-dot');
    }
    
    /* =================================================================
       NAVIGATE TO SECTION
    ================================================================= */
    function navigateToSection(sectionId) {
        const section = STATE.sections.find(s => s.id === sectionId);
        if (!section) return;
        
        STATE.isScrolling = true;
        
        Utils.smoothScrollTo(section.top);
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            STATE.isScrolling = false;
        }, CONFIG.smoothScrollDuration + 100);
    }
    
    /* =================================================================
       UPDATE SCROLL PROGRESS
    ================================================================= */
    function updateScrollProgress() {
        const progress = Utils.getScrollProgress();
        STATE.scrollProgress = progress;
        
        // Update progress bar
        if (DOM.progressBar) {
            DOM.progressBar.style.width = `${progress}%`;
            
            // Add glow effect when scrolling
            if (progress > 0 && progress < 100) {
                DOM.progressBar.classList.add('glowing');
            } else {
                DOM.progressBar.classList.remove('glowing');
            }
        }
        
        // Update percentage badge
        if (DOM.percentageValue) {
            DOM.percentageValue.textContent = Math.round(progress);
        }
        
        // Update reading progress circle
        if (DOM.readingCircle) {
            const circumference = 2 * Math.PI * 20; // r = 20
            const offset = circumference - (progress / 100) * circumference;
            DOM.readingCircle.style.strokeDashoffset = offset;
        }
        
        if (DOM.readingPercentage) {
            DOM.readingPercentage.textContent = `${Math.round(progress)}%`;
        }
    }
    
    /* =================================================================
       UPDATE CURRENT SECTION
    ================================================================= */
    function updateCurrentSection() {
        const scrollTop = Utils.getScrollTop();
        const viewportHeight = Utils.getViewportHeight();
        const scrollCenter = scrollTop + viewportHeight / 2;
        
        let currentSection = STATE.sections[0];
        let currentIndex = 0;
        
        STATE.sections.forEach((section, index) => {
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;
            
            if (scrollCenter >= sectionTop && scrollCenter < sectionTop + sectionHeight) {
                currentSection = section;
                currentIndex = index;
            }
        });
        
        // Only update if section changed
        if (STATE.currentSection !== currentSection.id) {
            STATE.currentSection = currentSection.id;
            STATE.currentSectionIndex = currentIndex;
            
            updateSectionUI(currentSection, currentIndex);
            updateNavigationDots(currentIndex);
        }
        
        // Update section progress
        updateSectionProgress(currentSection);
        
        // Update remaining reading time
        updateRemainingReadingTime(currentIndex);
    }
    
    /* =================================================================
       UPDATE SECTION UI
    ================================================================= */
    function updateSectionUI(section, index) {
        // Update section indicator
        if (DOM.sectionIndicatorIcon) {
            DOM.sectionIndicatorIcon.innerHTML = `<i class="fas ${section.icon}"></i>`;
        }
        
        if (DOM.sectionIndicatorTitle) {
            DOM.sectionIndicatorTitle.textContent = section.name;
        }
        
        // Update floating label
        if (DOM.sectionLabelNumber) {
            DOM.sectionLabelNumber.textContent = String(index + 1).padStart(2, '0');
        }
        
        if (DOM.sectionLabelText) {
            DOM.sectionLabelText.textContent = section.name;
        }
    }
    
    /* =================================================================
       UPDATE NAVIGATION DOTS
    ================================================================= */
    function updateNavigationDots(currentIndex) {
        if (!DOM.dots) return;
        
        DOM.dots.forEach((dot, index) => {
            dot.classList.remove('active', 'passed');
            
            if (index === currentIndex) {
                dot.classList.add('active');
            } else if (index < currentIndex) {
                dot.classList.add('passed');
            }
        });
        
        // Update dots line progress
        if (DOM.dotsLineProgress && STATE.sections.length > 1) {
            const progress = (currentIndex / (STATE.sections.length - 1)) * 100;
            DOM.dotsLineProgress.style.height = `${progress}%`;
        }
    }
    
    /* =================================================================
       UPDATE SECTION PROGRESS
    ================================================================= */
    function updateSectionProgress(section) {
        if (!DOM.sectionProgressBar || !section) return;
        
        const scrollTop = Utils.getScrollTop();
        const sectionTop = section.element.offsetTop - CONFIG.navbarHeight;
        const sectionHeight = section.element.offsetHeight;
        
        let progress = ((scrollTop - sectionTop) / sectionHeight) * 100;
        progress = Math.max(0, Math.min(100, progress));
        
        DOM.sectionProgressBar.style.width = `${progress}%`;
    }
    
    /* =================================================================
       UPDATE REMAINING READING TIME
    ================================================================= */
    function updateRemainingReadingTime(currentIndex) {
        if (!DOM.readingTime) return;
        
        // Calculate remaining reading time from current section
        let remaining = 0;
        for (let i = currentIndex; i < STATE.sections.length; i++) {
            remaining += STATE.sections[i].readingTime;
        }
        
        // Adjust based on section progress
        const currentSection = STATE.sections[currentIndex];
        if (currentSection) {
            const scrollTop = Utils.getScrollTop();
            const sectionTop = currentSection.element.offsetTop;
            const sectionHeight = currentSection.element.offsetHeight;
            const sectionProgress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / sectionHeight));
            
            remaining -= currentSection.readingTime * sectionProgress;
        }
        
        STATE.remainingReadingTime = Math.max(0, Math.ceil(remaining));
        DOM.readingTime.textContent = Utils.formatTime(STATE.remainingReadingTime) + ' left';
    }
    
    /* =================================================================
       UPDATE VISIBILITY
    ================================================================= */
    function updateVisibility() {
        const scrollTop = Utils.getScrollTop();
        
        // Scroll direction
        STATE.scrollDirection = scrollTop > STATE.lastScrollTop ? 'down' : 'up';
        STATE.lastScrollTop = scrollTop;
        
        // Navigation dots visibility
        if (DOM.navDots) {
            if (scrollTop > CONFIG.showDotsAfter) {
                DOM.navDots.classList.add('visible');
            } else {
                DOM.navDots.classList.remove('visible');
            }
        }
        
        // Reading progress badge visibility
        if (DOM.readingBadge) {
            if (scrollTop > CONFIG.showProgressAfter && scrollTop < Utils.getDocumentHeight() - Utils.getViewportHeight() - 100) {
                DOM.readingBadge.classList.add('visible');
            } else {
                DOM.readingBadge.classList.remove('visible');
            }
        }
        
        // Section indicator visibility (show briefly on section change)
        if (DOM.sectionIndicator) {
            if (scrollTop > CONFIG.showProgressAfter) {
                DOM.sectionIndicator.classList.add('visible');
            } else {
                DOM.sectionIndicator.classList.remove('visible');
            }
        }
        
        // Floating label visibility
        if (DOM.floatingLabel) {
            if (scrollTop > CONFIG.showDotsAfter) {
                DOM.floatingLabel.classList.add('visible');
            } else {
                DOM.floatingLabel.classList.remove('visible');
            }
        }
        
        // Scroll hint visibility
        if (DOM.scrollHint) {
            if (scrollTop > CONFIG.hideHintAfter) {
                DOM.scrollHint.classList.add('hidden');
            } else {
                DOM.scrollHint.classList.remove('hidden');
            }
        }
        
        // Percentage badge visibility
        if (DOM.percentageBadge) {
            if (scrollTop > CONFIG.showProgressAfter) {
                DOM.percentageBadge.classList.add('visible');
                
                // Update arrow direction
                const icon = DOM.percentageBadge.querySelector('.percentage-icon i');
                if (icon) {
                    icon.className = STATE.scrollDirection === 'down' 
                        ? 'fas fa-arrow-down' 
                        : 'fas fa-arrow-up';
                }
            } else {
                DOM.percentageBadge.classList.remove('visible');
            }
        }
    }
    
    /* =================================================================
       SCROLL HANDLER
    ================================================================= */
    const handleScroll = Utils.throttle(() => {
        if (STATE.isScrolling) return;
        
        updateScrollProgress();
        updateCurrentSection();
        updateVisibility();
    }, CONFIG.updateThrottle);
    
    /* =================================================================
       RESIZE HANDLER
    ================================================================= */
    const handleResize = Utils.debounce(() => {
        // Recalculate section positions
        STATE.sections.forEach(section => {
            section.top = section.element.offsetTop;
            section.height = section.element.offsetHeight;
        });
        
        // Update UI
        updateScrollProgress();
        updateCurrentSection();
    }, 250);
    
    /* =================================================================
       KEYBOARD NAVIGATION
    ================================================================= */
    function handleKeyboard(e) {
        // Only handle if no input is focused
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') return;
        
        const currentIndex = STATE.currentSectionIndex;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentIndex < STATE.sections.length - 1) {
                    navigateToSection(STATE.sections[currentIndex + 1].id);
                }
                break;
                
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    navigateToSection(STATE.sections[currentIndex - 1].id);
                }
                break;
                
            case 'Home':
                e.preventDefault();
                navigateToSection(STATE.sections[0].id);
                break;
                
            case 'End':
                e.preventDefault();
                navigateToSection(STATE.sections[STATE.sections.length - 1].id);
                break;
        }
    }
    
    /* =================================================================
       SCROLL HINT CLICK
    ================================================================= */
    function handleScrollHintClick() {
        if (STATE.sections.length > 1) {
            navigateToSection(STATE.sections[1].id);
        }
    }
    
    /* =================================================================
       BIND EVENTS
    ================================================================= */
    function bindEvents() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        document.addEventListener('keydown', handleKeyboard);
        
        if (DOM.scrollHint) {
            DOM.scrollHint.addEventListener('click', handleScrollHintClick);
        }
        
        // Handle visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                handleResize();
            }
        });
    }
    
    /* =================================================================
       INITIALIZE
    ================================================================= */
    function init() {
        if (STATE.initialized) return;
        
        console.log('%c📜 Scroll Enhancements', 'font-size: 16px; font-weight: bold; color: #8B4513;');
        
        // Create DOM elements
        createElements();
        
        // Initialize sections
        initSections();
        
        // Bind events
        bindEvents();
        
        // Initial updates
        updateScrollProgress();
        updateCurrentSection();
        updateVisibility();
        
        STATE.initialized = true;
        
        console.log('%c✅ Scroll Enhancements initialized!', 'color: #28a745;');
        console.log(`%c📊 Found ${STATE.sections.length} sections`, 'color: #17a2b8;');
        console.log(`%c⏱️ Total reading time: ${STATE.totalReadingTime} min`, 'color: #17a2b8;');
    }
    
    /* =================================================================
       DESTROY
    ================================================================= */
    function destroy() {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('keydown', handleKeyboard);
        
        if (DOM.container && DOM.container.parentNode) {
            DOM.container.parentNode.removeChild(DOM.container);
        }
        
        STATE.initialized = false;
        DOM = {};
    }
    
    /* =================================================================
       REFRESH
    ================================================================= */
    function refresh() {
        initSections();
        updateScrollProgress();
        updateCurrentSection();
    }
    
    /* =================================================================
       PUBLIC API
    ================================================================= */
    return {
        init,
        destroy,
        refresh,
        navigateToSection,
        getState: () => ({ ...STATE }),
        getConfig: () => ({ ...CONFIG }),
        
        // Allow custom configuration
        configure(options) {
            Object.assign(CONFIG, options);
        }
    };
    
})();

/* =================================================================
   AUTO INITIALIZE
================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to set up sections
    setTimeout(() => {
        ScrollEnhancements.init();
    }, 100);
});

/* =================================================================
   EXPORT FOR GLOBAL USE
================================================================= */
window.ScrollEnhancements = ScrollEnhancements;