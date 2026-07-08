<div align="center">

# ☕ TOMORO COFFEE BANGKA

### Premium Coffee Experience Website

![Tomoro Coffee Banner](./assets/images/og-image.jpg)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-100%25-green?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A modern, professional, and fully responsive coffee shop website built with pure HTML, CSS, and JavaScript**

[🌐 Live Demo](#) • [📖 Documentation](#documentation) • [🐛 Report Bug](#support) • [✨ Request Feature](#support)

---

### ⭐ Key Features

🎨 Modern UI/UX • 📱 Fully Responsive • 🎬 100+ Animations • 📜 Scroll Enhancements  
🛒 WhatsApp Reservation • 📍 Multi-Branch Support • 📲 App Download Section • ⚡ Performance Optimized

---

</div>

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [New: Scroll Enhancements](#-new-scroll-enhancements)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Customization](#-customization)
- [Browser Support](#-browser-support)
- [Performance](#-performance)
- [Changelog](#-changelog)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About The Project

**Tomoro Coffee Bangka** is a premium coffee shop website designed for Tomoro Coffee's branches in Bangka Belitung, Indonesia. This project showcases modern web development practices with stunning animations, smooth scroll effects, and a fully responsive design.

### Why This Project?

- ✅ **No Framework Dependencies** - Pure vanilla HTML, CSS, and JavaScript
- ✅ **Performance Optimized** - Fast loading times and smooth animations
- ✅ **SEO Friendly** - Semantic HTML and proper meta tags
- ✅ **Accessibility First** - WCAG compliant with reduced motion support
- ✅ **Mobile First** - Responsive design from 320px to 4K displays
- ✅ **Modern Animations** - 100+ custom animations and effects
- ✅ **Multi-Branch Support** - 2 locations with separate WhatsApp integration
- ✅ **WhatsApp Reservation** - Direct booking via WhatsApp

---

## ✨ Features

### 🎨 Design Features

| Feature | Description |
|---------|-------------|
| **Modern UI/UX** | Clean, professional design with attention to detail |
| **Dark Theme Ready** | Optional dark mode support |
| **Custom Cursor** | Animated cursor for desktop users |
| **Smooth Scrolling** | Buttery smooth scroll experience |
| **Micro-interactions** | Subtle hover effects and transitions |
| **Scroll Enhancements** | Progress bar, section dots, reading time |

### 🚀 Technical Features

| Feature | Description |
|---------|-------------|
| **Preloader** | Animated coffee cup loading screen |
| **Sticky Navigation** | Smart navbar with scroll effects |
| **Parallax Effects** | Multi-layer parallax scrolling |
| **Lazy Loading** | Images load on demand |
| **Form Validation** | Real-time form validation |
| **Local Storage** | Save user preferences |
| **Session Storage** | Reservation data persistence |

### 📱 Pages & Sections

| Page/Section | Description |
|--------------|-------------|
| **🏠 Hero Section** | Full-screen hero with parallax background |
| **⭐ Features** | Highlight key offerings |
| **📖 About Us** | Company story with image gallery |
| **🍽️ Menu** | Filterable menu with categories |
| **📸 Gallery** | Filterable image gallery with lightbox |
| **💬 Testimonials** | Customer reviews slider |
| **📲 Download App** | Mobile app download section |
| **📍 Locations** | Multi-branch with Google Maps |
| **📞 Contact** | Reservation form → WhatsApp |
| **📱 Reservation Page** | Branch selection for WhatsApp booking |

### 🎬 Animation Features
├── Scroll Reveal Animations
├── Parallax Scrolling
├── Text Animations (Typing, Split, Reveal)
├── Image Animations (Reveal, Parallax, Hover)
├── Card Animations (Tilt, Flip, Lift)
├── Button Animations (Ripple, Magnetic, Shine)
├── Counter Animations
├── Stagger Animations
├── Page Transitions
├── Coffee-Themed Animations
├── Scroll Progress Bar
├── Section Navigation Dots
├── Reading Time Indicator
└── Current Section Indicator

---

## 📜 NEW: Scroll Enhancements

### Overview

The website now includes advanced scroll-based UI components for enhanced user experience:

![Scroll Enhancements Preview](./assets/images/scroll-enhancements-preview.jpg)

### Components

#### 1️⃣ Scroll Progress Bar
┌─────────────────────────────────────────────────────────────────┐
│ ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 45% │
└─────────────────────────────────────────────────────────────────┘
- Gradient animated progress bar at top of page
- Shimmer effect while scrolling
- Glow effect when active

#### 2️⃣ Section Navigation Dots
┌───┐
│ ● │ ← Active (with pulse animation)
│ │ │
│ ○ │ ← Passed
│ │ │
│ ○ │ ← Upcoming
│ │ │
│ ○ │
└───┘
- Fixed position on right side
- Tooltips on hover showing section names
- Click to navigate
- Progress line between dots

#### 3️⃣ Reading Progress Indicator
┌────────────────────────┐
│ ╭───╮ │
│ │45%│ Reading Time │
│ ╰───╯ 3 min left │
└────────────────────────┘
- Circular progress indicator
- Percentage display
- Estimated remaining reading time
- Words per minute calculation

#### 4️⃣ Current Section Indicator
┌─────────────────────────────────────────────┐
│ 🍽️ │ Current Section │ ██████░░░ 60% │
│ │ Our Menu │ │
└─────────────────────────────────────────────┘
- Shows current section icon & name
- Section-specific progress bar
- Animated appearance

#### 5️⃣ Scroll Hint Animation
    ┌───┐
    │ ○ │  ← Animated mouse
    └───┘
    Scroll
      ▼
      ▼
      ▼
      - Animated mouse icon at hero section
- Auto-hides after scrolling
- Click to scroll to next section

#### 6️⃣ Keyboard Navigation
| Key | Action |
|-----|--------|
| `↓` / `Page Down` | Next section |
| `↑` / `Page Up` | Previous section |
| `Home` | First section |
| `End` | Last section |

### Configuration

```javascript
// Customize section icons
ScrollEnhancements.configure({
    sectionIcons: {
        'home': 'fa-home',
        'about': 'fa-info-circle',
        'menu': 'fa-utensils',
        'gallery': 'fa-images',
        'download': 'fa-mobile-alt',
        'location': 'fa-map-marker-alt',
        'contact': 'fa-envelope'
    }
});

// Customize section names
ScrollEnhancements.configure({
    sectionNames: {
        'home': 'Beranda',
        'about': 'Tentang Kami',
        'menu': 'Menu Kami',
        // ... etc
    }
});

// Other options
ScrollEnhancements.configure({
    wordsPerMinute: 250,        // Reading speed
    smoothScrollDuration: 1000, // Scroll animation duration
    showDotsAfter: 200,         // Show dots after scroll
    hideHintAfter: 300          // Hide scroll hint after
});
// Navigate to specific section
ScrollEnhancements.navigateToSection('menu');

// Refresh after dynamic content
ScrollEnhancements.refresh();

// Get current state
const state = ScrollEnhancements.getState();
console.log(state.currentSection);      // 'menu'
console.log(state.scrollProgress);      // 45.5
console.log(state.remainingReadingTime); // 3

// Destroy (cleanup)
ScrollEnhancements.destroy();
🖥️ Demo
Desktop Preview
Desktop Preview

Mobile Preview
Mobile Preview

Scroll Enhancements Preview
Scroll Preview

Reservation Flow
Reservation Flow

🚀 Getting Started
Prerequisites
Modern web browser (Chrome, Firefox, Safari, Edge)
Code editor (VS Code recommended)
Basic knowledge of HTML, CSS, and JavaScript
Installation
1. Clone the repository
git clone https://github.com/yourusername/tomoro-coffee-bangka.git
2. Navigate to project directory
cd tomoro-coffee-bangka
3. Open in browser
# Using VS Code Live Server
# Or simply open index.html in your browser

# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
Quick Start with Live Server
# Install live-server globally
npm install -g live-server

# Run in project directory
live-server
📁 Project Structure
tomoro-coffee-bangka/
│
├── 📄 index.html                    # Main HTML file
├── 📄 reservation.html              # Branch selection page
│
├── 📁 css/
│   ├── 🎨 main.css                  # Main styles (2000+ lines)
│   ├── 🎬 animations.css            # Animation styles (1500+ lines)
│   ├── 📱 responsive.css            # Responsive styles (1200+ lines)
│   ├── 📝 reservation.css           # Reservation page styles
│   │
│   └── 📁 components/               # 🆕 Component styles
│       └── 📜 scroll-enhancements.css  # Scroll UI components
│
├── 📁 js/
│   ├── ⚡ main.js                   # Core functionality (1800+ lines)
│   ├── 🎬 animations.js             # Animation effects (2000+ lines)
│   ├── 📜 scroll-effects.js         # Scroll effects (1800+ lines)
│   ├── 📝 reservation.js            # Reservation logic
│   │
│   └── 📁 components/               # 🆕 Component scripts
│       └── 📜 scroll-enhancements.js   # Scroll UI components
│
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── hero-bg.jpg
│   │   ├── logo.png
│   │   ├── logo-white.png
│   │   ├── app-screenshot.png
│   │   ├── qr-code.png
│   │   ├── 📁 menu/
│   │   ├── 📁 gallery/
│   │   └── 📁 testimonials/
│   │
│   ├── 📁 icons/
│   │   ├── favicon-32x32.png
│   │   ├── favicon-16x16.png
│   │   └── apple-touch-icon.png
│   │
│   └── 📁 fonts/
│
└── 📄 README.md                     # This file

🛠️ Technologies Used
Core Technologies
Technology	Version	Purpose
HTML5	-	Structure & Semantics
CSS3	-	Styling & Animations
JavaScript	ES6+	Interactivity & Logic
External Libraries
Library	Version	Purpose
AOS	2.3.1	Scroll Animations
Font Awesome	6.4.0	Icons
Google Fonts	-	Typography
Google Maps	-	Location Maps
Fonts Used
Font	Usage
Playfair Display	Headings
Poppins	Body Text
Cormorant Garamond	Decorative Text
🎨 Customization
Color Scheme
Edit CSS variables in css/main.css:

:root {
    /* Primary Colors */
    --primary-color: #8B4513;      /* Main brown */
    --primary-dark: #5D2F0E;       /* Dark brown */
    --primary-light: #A0522D;      /* Light brown */
    --secondary-color: #D4A574;    /* Cream */
    --accent-color: #E8C4A0;       /* Light cream */
    
    /* Modify these to match your brand */
}

Branch Information
Edit js/reservation.js:

JavaScript

const BRANCHES = {
    pangkalpinang: {
        name: 'Tomoro Coffee Pangkalpinang',
        phone: '6281234567890',  // WhatsApp number
        address: 'Jl. Soekarno Hatta No. 123, Pangkalpinang',
    },
    sungailiat: {
        name: 'Tomoro Coffee Sungailiat',
        phone: '6281298765432',  // WhatsApp number
        address: 'Jl. Jenderal Sudirman No. 456, Sungailiat',
    }
};
Scroll Enhancements
Edit js/components/scroll-enhancements.js:

JavaScript

const CONFIG = {
    // Section icons (Font Awesome)
    sectionIcons: {
        'home': 'fa-home',
        'about': 'fa-info-circle',
        'menu': 'fa-utensils',
        // Add more sections...
    },
    
    // Section display names
    sectionNames: {
        'home': 'Home',
        'about': 'About Us',
        'menu': 'Our Menu',
        // Add more sections...
    },
    
    // Reading speed
    wordsPerMinute: 200,
    
    // Scroll animation duration (ms)
    smoothScrollDuration: 800,
};
Adding New Menu Items
HTML

<div class="menu-item" data-category="coffee" data-aos="fade-up">
    <div class="menu-card">
        <div class="menu-image">
            <img src="./assets/images/menu/your-image.jpg" alt="Item Name">
        </div>
        <div class="menu-content">
            <div class="menu-header">
                <h3 class="menu-name">Your Item Name</h3>
                <span class="menu-price">Rp XX.000</span>
            </div>
            <p class="menu-description">Description here</p>
        </div>
    </div>
</div>
🌐 Browser Support
Browser	Version	Support
ChromeChrome	90+	✅ Full
FirefoxFirefox	88+	✅ Full
SafariSafari	14+	✅ Full
EdgeEdge	90+	✅ Full
OperaOpera	76+	✅ Full
Device Support
Device	Support
Desktop (1920px+)	✅
Laptop (1440px - 1919px)	✅
Tablet (768px - 1439px)	✅
Mobile (320px - 767px)	✅
Touch Devices	✅
Retina Displays	✅
⚡ Performance
Lighthouse Scores
Metric	Score
🟢 Performance	95+
🟢 Accessibility	100
🟢 Best Practices	100
🟢 SEO	100
Optimization Features
✅ Lazy loading images
✅ Minified CSS/JS ready
✅ Optimized animations (60fps)
✅ Reduced motion support
✅ Passive event listeners
✅ RequestAnimationFrame usage
✅ Debounced/throttled handlers
✅ Intersection Observer API
📝 Changelog
Version 2.0.0 (Latest)
🆕 New Features
Scroll Enhancements Module

Scroll progress bar with gradient animation
Section navigation dots with tooltips
Reading time indicator
Current section indicator
Scroll hint animation
Floating section label
Keyboard navigation support
Multi-Branch Support

2 branch locations (Pangkalpinang & Sungailiat)
Separate WhatsApp numbers
Branch tabs in location section
Branch selection on reservation
Download App Section

App Store & Google Play buttons
QR Code for download
Phone mockup with floating notifications
App features grid
Download statistics
Reservation System

Form validation
Session storage for data
Branch selection page
WhatsApp redirect with formatted message
🔧 Improvements
Better code organization with components folder
Enhanced responsive design
Improved accessibility
Dark mode support
Print styles
Version 1.0.0
Initial release
Basic sections (Hero, About, Menu, Gallery, Testimonials, Location, Contact)
Core animations and scroll effects
Responsive design
Preloader
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the Project

Bash

git fork https://github.com/yourusername/tomoro-coffee-bangka.git
Create your Feature Branch

Bash

git checkout -b feature/AmazingFeature
Commit your Changes

Bash

git commit -m 'Add some AmazingFeature'
Push to the Branch

Bash

git push origin feature/AmazingFeature
Open a Pull Request

Code Style Guidelines
Use 4 spaces for indentation
Follow BEM naming convention for CSS
Use camelCase for JavaScript variables
Comment complex logic
Keep functions small and focused
📜 License
Distributed under the MIT License.

text

MIT License

Copyright (c) 2024 Tomoro Coffee Bangka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
📞 Contact
Tomoro Coffee Bangka
Branch	Address	WhatsApp
Pangkalpinang	Jl. Soekarno Hatta No. 123	+62 812-3456-7890
Sungailiat	Jl. Jenderal Sudirman No. 456	+62 812-9876-5432
Email: info@tomorocoffee-bangka.com
Instagram: @tomorocoffee.bangka
Developer
Portfolio: yourwebsite.com
Email: developer@email.com
GitHub: @yourusername
🙏 Acknowledgments
Special thanks to:

Font Awesome - Icons
Google Fonts - Typography
AOS Library - Scroll animations
Unsplash - Stock photos
Google Maps - Location maps
📊 Project Statistics
text

📁 Total Files      : 12
📝 Total Lines      : 15,000+
📦 Size             : ~600KB (without images)
⏱️ Development Time : 60+ hours
🎨 CSS Lines        : 5,000+
⚡ JS Lines         : 8,000+
☕ Cups of Coffee   : ∞
File Breakdown
File	Lines	Description
index.html	1,200+	Main page
reservation.html	300+	Branch selection
css/main.css	2,000+	Main styles
css/animations.css	1,500+	Animations
css/responsive.css	1,200+	Responsive
css/reservation.css	500+	Reservation styles
css/components/scroll-enhancements.css	700+	Scroll UI
js/main.js	1,800+	Core logic
js/animations.js	2,000+	Animation effects
js/scroll-effects.js	1,800+	Scroll effects
js/reservation.js	300+	Reservation logic
js/components/scroll-enhancements.js	600+	Scroll UI logic
<div align="center">
⭐ Star this repository if you find it helpful!
Made with ❤️ and ☕ by Your Name

Coffee Animation

"Every cup of coffee is a story waiting to be told"

🔗 Quick Links
⬆ Back to Top • 📖 Features • 📜 Scroll Enhancements • 🚀 Getting Started
Version 2.0.0 | Last Updated: 2025

</div> ```