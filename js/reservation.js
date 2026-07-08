/*
=================================================================
  TOMORO COFFEE BANGKA - PREMIUM RESERVATION PAGE JAVASCRIPT
  Version: 2.0.0
  Description: Handle reservation data, UI interactions & WhatsApp
=================================================================
*/

'use strict';

/* =================================================================
   CONFIGURATION
================================================================= */
const CONFIG = {
    branches: {
        pangkalpinang: {
            name: 'TOMORO COFFEE-City Hall Pangkalpinang',
            phone: '6281365433777',
            address: 'Jl. Soekarno Hatta No. 123, Pangkalpinang',
            openTime: '07:00',
            closeTime: '22:00'
        },
        sungailiat: {
            name: 'TOMORO COFFE-Alun Alun Taman Merdeka Pangkalpinang',
            phone: '6281365433777',
            address: 'Jl. Jenderal Sudirman No. 456, Sungailiat',
            openTime: '08:00',
            closeTime: '21:00'
        }
    },
    redirectDelay: 2500,
    toastDuration: 4000
};

/* =================================================================
   STATE
================================================================= */
const STATE = {
    reservationData: null,
    selectedBranch: null,
    isLoading: true
};

/* =================================================================
   DOM ELEMENTS
================================================================= */
const DOM = {
    // Will be populated on init
};

/* =================================================================
   INITIALIZATION
================================================================= */
function init() {
    console.log('🚀 Initializing Premium Reservation Page...');
    
    // Cache DOM elements
    cacheDOMElements();
    
    // Load reservation data
    loadReservationData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check branch status
    updateBranchStatus();
    
    // Hide loader
    setTimeout(hideLoader, 1000);
    
    console.log('✅ Reservation page initialized!');
}

function cacheDOMElements() {
    DOM.pageLoader = document.getElementById('pageLoader');
    DOM.mainContent = document.getElementById('mainContent');
    DOM.noDataState = document.getElementById('noDataState');
    DOM.summaryCard = document.getElementById('summaryCard');
    DOM.sendingModal = document.getElementById('sendingModal');
    DOM.helpModal = document.getElementById('helpModal');
    DOM.helpBtn = document.getElementById('helpBtn');
    DOM.toastContainer = document.getElementById('toastContainer');
    DOM.branchCards = document.querySelectorAll('.branch-card');
    DOM.faqItems = document.querySelectorAll('.faq-item');
    
    // Summary fields
    DOM.summaryName = document.getElementById('summaryName');
    DOM.summaryEmail = document.getElementById('summaryEmail');
    DOM.summaryPhone = document.getElementById('summaryPhone');
    DOM.summaryDate = document.getElementById('summaryDate');
    DOM.summaryDay = document.getElementById('summaryDay');
    DOM.summaryTime = document.getElementById('summaryTime');
    DOM.summaryGuests = document.getElementById('summaryGuests');
    DOM.summaryMessage = document.getElementById('summaryMessage');
    DOM.messageSection = document.getElementById('messageSection');
    
    // Modal elements
    DOM.modalBranchName = document.getElementById('modalBranchName');
}

function setupEventListeners() {
    // Help button
    if (DOM.helpBtn) {
        DOM.helpBtn.addEventListener('click', openHelpModal);
    }
    
    // Branch card keyboard navigation
    DOM.branchCards.forEach(card => {
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const branch = card.dataset.branch;
                selectBranch(branch);
            }
        });
    });
    
    // FAQ accordion
    DOM.faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFaq(item));
        }
    });
    
    // Close modals on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeHelpModal();
        }
    });
}

/* =================================================================
   LOADER
================================================================= */
function hideLoader() {
    if (DOM.pageLoader) {
        DOM.pageLoader.classList.add('hidden');
    }
    STATE.isLoading = false;
}

function showLoader() {
    if (DOM.pageLoader) {
        DOM.pageLoader.classList.remove('hidden');
    }
    STATE.isLoading = true;
}

/* =================================================================
   RESERVATION DATA
================================================================= */
function loadReservationData() {
    try {
        const storedData = sessionStorage.getItem('tomoroReservation');
        
        if (storedData) {
            STATE.reservationData = JSON.parse(storedData);
            console.log('📋 Reservation data loaded:', STATE.reservationData);
            renderSummary();
            showMainContent();
        } else {
            console.warn('⚠️ No reservation data found');
            showNoDataState();
        }
    } catch (error) {
        console.error('❌ Error loading reservation data:', error);
        showNoDataState();
    }
}

function renderSummary() {
    const data = STATE.reservationData;
    if (!data) return;
    
    // Guest info
    if (DOM.summaryName) DOM.summaryName.textContent = data.name || '-';
    if (DOM.summaryEmail) DOM.summaryEmail.textContent = data.email || '-';
    if (DOM.summaryPhone) DOM.summaryPhone.textContent = data.phone || '-';
    
    // Date & time
    if (DOM.summaryDate) {
        const formattedDate = formatDate(data.date);
        DOM.summaryDate.textContent = formattedDate.date;
        if (DOM.summaryDay) DOM.summaryDay.textContent = formattedDate.day;
    }
    
    if (DOM.summaryTime) DOM.summaryTime.textContent = formatTime(data.time);
    if (DOM.summaryGuests) DOM.summaryGuests.textContent = formatGuests(data.guests);
    
    // Special request
    if (data.message && data.message.trim()) {
        if (DOM.summaryMessage) DOM.summaryMessage.textContent = data.message;
        if (DOM.messageSection) DOM.messageSection.style.display = 'block';
    }
}

function showMainContent() {
    if (DOM.mainContent) DOM.mainContent.style.display = 'block';
    if (DOM.noDataState) DOM.noDataState.style.display = 'none';
}

function showNoDataState() {
    if (DOM.mainContent) DOM.mainContent.style.display = 'none';
    if (DOM.noDataState) DOM.noDataState.style.display = 'flex';
}

/* =================================================================
   FORMATTING HELPERS
================================================================= */
function formatDate(dateStr) {
    if (!dateStr) return { date: '-', day: '' };
    
    try {
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const dayOptions = { weekday: 'long' };
        
        return {
            date: date.toLocaleDateString('id-ID', options),
            day: date.toLocaleDateString('id-ID', dayOptions)
        };
    } catch {
        return { date: dateStr, day: '' };
    }
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    
    try {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    } catch {
        return timeStr;
    }
}

function formatGuests(guests) {
    if (!guests) return '-';
    return guests === '5+' ? '5+ Orang' : `${guests} Orang`;
}

/* =================================================================
   BRANCH SELECTION
================================================================= */
function selectBranch(branchId) {
    const branchInfo = CONFIG.branches[branchId];
    if (!branchInfo) {
        showToast('error', 'Error', 'Cabang tidak ditemukan');
        return;
    }
    
    if (!STATE.reservationData) {
        showToast('error', 'Error', 'Data reservasi tidak ditemukan');
        return;
    }
    
    STATE.selectedBranch = branchId;
    
    // Update UI
    DOM.branchCards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.branch === branchId) {
            card.classList.add('selected');
        }
    });
    
    // Show sending modal
    showSendingModal(branchInfo);
    
    // Generate WhatsApp URL
    const whatsappURL = generateWhatsAppURL(branchId);
    
    // Redirect after animation
    setTimeout(() => {
        // Clear session data
        sessionStorage.removeItem('tomoroReservation');
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Redirect back
        setTimeout(() => {
            window.location.href = 'index.html#contact';
        }, 500);
    }, CONFIG.redirectDelay);
}

function generateWhatsAppURL(branchId) {
    const branch = CONFIG.branches[branchId];
    const data = STATE.reservationData;
    
    // Build message
    let message = `☕ *RESERVASI TOMORO COFFEE*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📍 *Cabang:*\n${branch.name}\n\n`;
    
    message += `👤 *Data Pemesan:*\n`;
    message += `• Nama: ${data.name}\n`;
    message += `• Email: ${data.email}\n`;
    message += `• Telepon: ${data.phone}\n\n`;
    
    message += `📅 *Detail Reservasi:*\n`;
    message += `• Tanggal: ${formatDate(data.date).date}\n`;
    message += `• Hari: ${formatDate(data.date).day}\n`;
    message += `• Waktu: ${formatTime(data.time)}\n`;
    message += `• Jumlah Tamu: ${formatGuests(data.guests)}\n`;
    
    if (data.message && data.message.trim()) {
        message += `\n💬 *Permintaan Khusus:*\n${data.message}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Mohon konfirmasi ketersediaan meja.\n`;
    message += `Terima kasih! 🙏`;
    
    return `https://wa.me/${branch.phone}?text=${encodeURIComponent(message)}`;
}

/* =================================================================
   BRANCH STATUS
================================================================= */
function updateBranchStatus() {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    DOM.branchCards.forEach(card => {
        const branchId = card.dataset.branch;
        const branch = CONFIG.branches[branchId];
        
        if (branch) {
            const [openH, openM] = branch.openTime.split(':').map(Number);
            const [closeH, closeM] = branch.closeTime.split(':').map(Number);
            const openTime = openH * 100 + openM;
            const closeTime = closeH * 100 + closeM;
            
            const isOpen = currentTime >= openTime && currentTime < closeTime;
            const statusEl = card.querySelector('.branch-status');
            
            if (statusEl) {
                statusEl.classList.remove('open', 'closed');
                statusEl.classList.add(isOpen ? 'open' : 'closed');
                statusEl.querySelector('span:last-child').textContent = 
                    isOpen ? 'Buka Sekarang' : 'Tutup';
            }
        }
    });
}

/* =================================================================
   MODALS
================================================================= */
function showSendingModal(branchInfo) {
    if (DOM.modalBranchName) {
        DOM.modalBranchName.textContent = branchInfo.name;
    }
    
    if (DOM.sendingModal) {
        DOM.sendingModal.classList.add('active');
    }
}

function hideSendingModal() {
    if (DOM.sendingModal) {
        DOM.sendingModal.classList.remove('active');
    }
}

function openHelpModal() {
    if (DOM.helpModal) {
        DOM.helpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeHelpModal() {
    if (DOM.helpModal) {
        DOM.helpModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* =================================================================
   FAQ ACCORDION
================================================================= */
function toggleFaq(item) {
    const isActive = item.classList.contains('active');
    
    // Close all
    DOM.faqItems.forEach(faq => faq.classList.remove('active'));
    
    // Toggle current
    if (!isActive) {
        item.classList.add('active');
    }
}

/* =================================================================
   TOAST NOTIFICATIONS
================================================================= */
function showToast(type, title, message) {
    if (!DOM.toastContainer) return;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.toastDuration);
}

/* =================================================================
   NAVIGATION
================================================================= */
function goBack() {
    window.location.href = 'index.html#contact';
}

/* =================================================================
   EXPOSE GLOBAL FUNCTIONS
================================================================= */
window.selectBranch = selectBranch;
window.goBack = goBack;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;
window.showToast = showToast;

/* =================================================================
   INITIALIZE ON DOM READY
================================================================= */
document.addEventListener('DOMContentLoaded', init);