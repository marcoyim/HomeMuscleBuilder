// UI Manager - Handles common UI interactions and utilities
class UIManager {
    constructor() {
        this.activeModals = [];
        this.toasts = [];
    }

    init() {
        this.setupGlobalEventListeners();
    }

    setupGlobalEventListeners() {
        // Handle escape key for modals
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.activeModals.length > 0) {
                this.closeTopModal();
            }
        });

        // Handle click outside modals
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-backdrop')) {
                this.closeTopModal();
            }
        });
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = this.createToastElement(message, type);
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        this.toasts.push(toast);
        return toast;
    }

    createToastElement(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        return toast;
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    showModal(content, options = {}) {
        const modal = this.createModalElement(content, options);
        document.body.appendChild(modal);
        
        // Trigger animation
        setTimeout(() => modal.classList.add('show'), 100);
        
        this.activeModals.push(modal);
        
        // Prevent body scroll
        document.body.classList.add('modal-open');
        
        return modal;
    }

    createModalElement(content, options) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal ${options.size || 'modal-md'}">
                <div class="modal-header">
                    <h3 class="modal-title">${options.title || ''}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
            </div>
        `;
        return modal;
    }

    closeTopModal() {
        if (this.activeModals.length === 0) return;
        
        const modal = this.activeModals.pop();
        modal.classList.remove('show');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            
            // Re-enable body scroll if no more modals
            if (this.activeModals.length === 0) {
                document.body.classList.remove('modal-open');
            }
        }, 300);
    }

    closeAllModals() {
        while (this.activeModals.length > 0) {
            this.closeTopModal();
        }
    }

    showConfirmDialog(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const content = `
                <p>${message}</p>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-backdrop').remove(); window.confirmDialogResult(false);">Cancel</button>
                    <button class="btn btn-primary" onclick="this.closest('.modal-backdrop').remove(); window.confirmDialogResult(true);">Confirm</button>
                </div>
            `;
            
            // Temporary global handler
            window.confirmDialogResult = resolve;
            
            this.showModal(content, { title, size: 'modal-sm' });
        });
    }

    showLoadingSpinner(message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'loading-overlay';
        spinner.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-text">${message}</p>
            </div>
        `;
        
        document.body.appendChild(spinner);
        setTimeout(() => spinner.classList.add('show'), 100);
        
        return {
            remove: () => {
                spinner.classList.remove('show');
                setTimeout(() => {
                    if (spinner.parentNode) {
                        spinner.parentNode.removeChild(spinner);
                    }
                }, 300);
            }
        };
    }

    smoothScrollTo(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;
        
        const targetPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatDate(date, options = {}) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }

    animateValue(element, start, end, duration) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;
        
        const startTime = performance.now();
        const difference = end - start;
        
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (difference * easeOut));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };
        
        requestAnimationFrame(updateValue);
    }

    isElementInViewport(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            return new Promise((resolve, reject) => {
                document.execCommand('copy') ? resolve() : reject();
                textArea.remove();
            });
        }
    }
}

// Initialize global instance
window.ui = new UIManager();
