// PWA Manager - Handles Service Worker and App Installation
class PWAManager {
    constructor() {
        this.installPrompt = null;
        this.isInstalled = false;
        this.updateAvailable = false;
    }

    async init() {
        await this.checkInstallStatus();
        this.setupServiceWorker();
        this.setupInstallPrompt();
    }

    async checkInstallStatus() {
        // Check if app is installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('📱 App is installed');
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Service Worker updated');
                this.notifyUpdateAvailable();
            });

            navigator.serviceWorker.ready.then(registration => {
                console.log('✅ Service Worker ready');
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Service Worker update found');
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.notifyUpdateAvailable();
                        }
                    });
                });
            });
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.installPrompt = event;
            console.log('📱 Install prompt available');
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.installPrompt = null;
            console.log('✅ App installed successfully');
        });
    }

    async installApp() {
        if (!this.installPrompt) {
            console.log('❌ Install prompt not available');
            return false;
        }

        try {
            const result = await this.installPrompt.prompt();
            console.log('📱 Install prompt result:', result.outcome);
            
            if (result.outcome === 'accepted') {
                this.installPrompt = null;
                return true;
            }
        } catch (error) {
            console.error('❌ Install error:', error);
        }
        
        return false;
    }

    setInstallPrompt(prompt) {
        this.installPrompt = prompt;
    }

    notifyUpdateAvailable() {
        this.updateAvailable = true;
        
        // Dispatch custom event
        const event = new CustomEvent('sw-update-available');
        window.dispatchEvent(event);
    }

    async skipWaiting() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        }
    }

    isAppInstalled() {
        return this.isInstalled;
    }

    canInstall() {
        return this.installPrompt !== null;
    }

    hasUpdateAvailable() {
        return this.updateAvailable;
    }
}

// Initialize global instance
window.pwaManager = new PWAManager();
