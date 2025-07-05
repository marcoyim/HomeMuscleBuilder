// Notification Manager - Handles Push Notifications
class NotificationManager {
    constructor() {
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
        this.permission = Notification.permission;
        this.subscription = null;
    }

    async init() {
        if (!this.isSupported) {
            console.log('❌ Push notifications not supported');
            return;
        }

        await this.checkExistingSubscription();
    }

    async checkExistingSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready;
            this.subscription = await registration.pushManager.getSubscription();
            
            if (this.subscription) {
                console.log('✅ Existing push subscription found');
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }

    async requestPermission() {
        if (!this.isSupported) {
            return 'not-supported';
        }

        if (this.permission === 'granted') {
            return 'granted';
        }

        try {
            this.permission = await Notification.requestPermission();
            console.log('📱 Notification permission:', this.permission);
            return this.permission;
        } catch (error) {
            console.error('Error requesting permission:', error);
            return 'denied';
        }
    }

    async subscribe() {
        if (!this.isSupported || this.permission !== 'granted') {
            console.log('❌ Cannot subscribe - not supported or permission denied');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            
            // In a real app, you'd get this from your backend
            const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
            
            this.subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            });

            console.log('✅ Push subscription created');
            
            // Send subscription to backend (Phase 2)
            await this.sendSubscriptionToBackend();
            
            return this.subscription;
        } catch (error) {
            console.error('Error creating subscription:', error);
            return null;
        }
    }

    async sendSubscriptionToBackend() {
        if (!this.subscription) return;

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription: this.subscription.toJSON(),
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Subscription sent to backend');
                localStorage.setItem('hmb_subscription_id', result.subscriptionId);
            } else {
                console.error('❌ Failed to save subscription:', result.error);
            }
        } catch (error) {
            console.error('❌ Error sending subscription to backend:', error);
            // In Phase 1, we'll just store locally for later sync
            this.storeSubscriptionLocally();
        }
    }

    storeSubscriptionLocally() {
        if (this.subscription) {
            localStorage.setItem('hmb_pending_subscription', JSON.stringify({
                subscription: this.subscription.toJSON(),
                timestamp: new Date().toISOString()
            }));
        }
    }

    async unsubscribe() {
        if (!this.subscription) return true;

        try {
            await this.subscription.unsubscribe();
            this.subscription = null;
            
            // Remove from backend (Phase 2)
            await this.removeSubscriptionFromBackend();
            
            console.log('✅ Push subscription removed');
            return true;
        } catch (error) {
            console.error('Error unsubscribing:', error);
            return false;
        }
    }

    async removeSubscriptionFromBackend() {
        const subscriptionId = localStorage.getItem('hmb_subscription_id');
        if (!subscriptionId) return;

        try {
            await fetch('/api/unsubscribe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriptionId })
            });

            localStorage.removeItem('hmb_subscription_id');
        } catch (error) {
            console.error('Error removing subscription from backend:', error);
        }
    }

    showLocalNotification(title, options = {}) {
        if (this.permission !== 'granted') return;

        const notification = new Notification(title, {
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/badge-icon.png',
            ...options
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
    }

    async sendTestNotification() {
        if (!this.isSubscribed()) {
            console.log('❌ Not subscribed to push notifications');
            return;
        }

        try {
            const response = await fetch('/api/test-push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscriptionId: localStorage.getItem('hmb_subscription_id')
                })
            });

            if (response.ok) {
                console.log('✅ Test notification sent');
            } else {
                console.error('❌ Failed to send test notification');
            }
        } catch (error) {
            console.error('❌ Error sending test notification:', error);
            // Fallback to local notification
            this.showLocalNotification('Test Notification', {
                body: 'This is a test notification from HomeMuscleBuilder!',
                tag: 'test-notification'
            });
        }
    }

    isSupported() {
        return this.isSupported;
    }

    hasPermission() {
        return this.permission === 'granted';
    }

    isSubscribed() {
        return this.subscription !== null;
    }

    getSubscription() {
        return this.subscription;
    }

    getPermissionStatus() {
        return this.permission;
    }
}

// Initialize global instance
window.notificationManager = new NotificationManager();
