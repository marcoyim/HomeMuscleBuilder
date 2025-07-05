// Main Application Entry Point
class App {
    constructor() {
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🚀 Initializing HomeMuscleBuilder...');
            
            // Initialize global instances references
            this.router = window.router;
            this.userProfile = window.userProfile;
            this.exerciseLibrary = window.exerciseLibrary;
            this.workoutLog = window.workoutLog;
            this.pwaManager = window.pwaManager;
            this.notificationManager = window.notificationManager;
            this.uiManager = window.ui;
            
            // Verify all required modules are loaded
            if (!this.router) throw new Error('Router module not loaded');
            if (!this.userProfile) throw new Error('UserProfile module not loaded');
            if (!this.exerciseLibrary) throw new Error('ExerciseLibrary module not loaded');
            if (!this.workoutLog) throw new Error('WorkoutLog module not loaded');
            if (!this.pwaManager) throw new Error('PWAManager module not loaded');
            if (!this.notificationManager) throw new Error('NotificationManager module not loaded');
            if (!this.uiManager) throw new Error('UIManager module not loaded');
            
            console.log('✅ All modules loaded successfully');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup routing
            this.setupRouting();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize PWA features
            await this.pwaManager.init();
            
            // Check if user profile exists
            const hasProfile = this.userProfile.hasProfile();
            
            if (!hasProfile) {
                // Show onboarding for first-time users
                this.router.navigate('/onboarding');
            } else {
                // Navigate to home screen
                this.router.navigate('/');
            }
            
            // Hide loading screen and show app
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ HomeMuscleBuilder initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showErrorScreen(error);
        }
    }

    async initializeModules() {
        // Initialize exercise library with static data
        await this.exerciseLibrary.init();
        
        // Initialize user profile
        this.userProfile.init();
        
        // Initialize workout log
        this.workoutLog.init();
        
        // Initialize notification manager
        await this.notificationManager.init();
        
        // Initialize UI manager
        this.uiManager.init();
    }

    setupRouting() {
        // Define routes and their handlers
        this.router.addRoute('/', () => this.renderHome());
        this.router.addRoute('/onboarding', () => this.renderOnboarding());
        this.router.addRoute('/exercises', () => this.renderExercises());
        this.router.addRoute('/exercise/:id', (params) => this.renderExerciseDetail(params.id));
        this.router.addRoute('/workout', () => this.renderWorkout());
        this.router.addRoute('/workout/active', () => this.renderActiveWorkout());
        this.router.addRoute('/history', () => this.renderHistory());
        this.router.addRoute('/profile', () => this.renderProfile());
        this.router.addRoute('/settings', () => this.renderSettings());
        
        // Start router
        this.router.start();
    }

    setupEventListeners() {
        // Bottom navigation
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) {
            bottomNav.addEventListener('click', this.handleBottomNavigation.bind(this));
        }

        // Network status
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));

        // App visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Update available
        window.addEventListener('sw-update-available', this.handleUpdateAvailable.bind(this));

        // Install prompt
        window.addEventListener('beforeinstallprompt', this.handleInstallPrompt.bind(this));
    }

    handleBottomNavigation(event) {
        const target = event.target.closest('.nav-item');
        if (!target) return;

        const route = target.dataset.route;
        if (route) {
            // Update active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            target.classList.add('active');

            // Navigate to route
            this.router.navigate(route);
        }
    }

    handleOnline() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        console.log('📶 App is back online');
    }

    handleOffline() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.display = 'block';
        }
        console.log('📵 App is offline');
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('📱 App backgrounded');
        } else {
            console.log('📱 App foregrounded');
            // Refresh data if needed
            this.refreshAppData();
        }
    }

    handleUpdateAvailable() {
        const banner = document.getElementById('update-banner');
        if (banner) {
            banner.style.display = 'block';
            
            const updateBtn = document.getElementById('update-btn');
            if (updateBtn) {
                updateBtn.addEventListener('click', () => {
                    window.location.reload();
                });
            }
        }
    }

    handleInstallPrompt(event) {
        event.preventDefault();
        this.pwaManager.setInstallPrompt(event);
        
        // Show install prompt after user completes workouts
        const workoutCount = this.workoutLog.getTotalWorkouts();
        if (workoutCount >= 3) {
            this.showInstallPrompt();
        }
    }

    showInstallPrompt() {
        const prompt = document.getElementById('install-prompt');
        if (prompt) {
            prompt.style.display = 'block';
            
            const installBtn = document.getElementById('install-btn');
            const dismissBtn = document.getElementById('install-dismiss');
            
            if (installBtn) {
                installBtn.addEventListener('click', () => {
                    this.pwaManager.installApp();
                    prompt.style.display = 'none';
                });
            }
            
            if (dismissBtn) {
                dismissBtn.addEventListener('click', () => {
                    prompt.style.display = 'none';
                });
            }
        }
    }

    async refreshAppData() {
        // Refresh any data that might have changed
        // This is where we'd sync with backend in Phase 2
        console.log('🔄 Refreshing app data...');
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        const bottomNav = document.getElementById('bottom-nav');
        
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
        if (bottomNav) bottomNav.style.display = 'none';
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        const bottomNav = document.getElementById('bottom-nav');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
        
        if (mainContent) mainContent.style.display = 'block';
        if (bottomNav) bottomNav.style.display = 'flex';
    }

    showErrorScreen(error) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-screen">
                    <div class="error-content">
                        <h2>Something went wrong</h2>
                        <p>We're sorry, but something unexpected happened.</p>
                        <p class="error-details">${error.message}</p>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
            mainContent.style.display = 'block';
        }
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }

    // Route handlers
    renderHome() {
        console.log('🏠 Rendering Home screen');
        if (window.homePage) {
            window.homePage.render();
        }
    }

    renderOnboarding() {
        console.log('👋 Rendering Onboarding screen');
        if (window.onboarding) {
            window.onboarding.init();
        }
    }

    renderExercises() {
        console.log('💪 Rendering Exercises screen');
        if (window.exercisesPage) {
            window.exercisesPage.render();
        }
    }

    renderExerciseDetail(exerciseId) {
        console.log('📖 Rendering Exercise detail:', exerciseId);
        if (window.exercisesPage) {
            window.exercisesPage.showExerciseDetails(exerciseId);
        }
    }

    renderWorkout() {
        console.log('🏋️ Rendering Workout screen');
        if (window.workoutPage) {
            window.workoutPage.render();
        }
    }

    renderActiveWorkout() {
        console.log('⏱️ Rendering Active Workout screen');
        // For now, redirect to workout page
        this.renderWorkout();
    }

    renderHistory() {
        console.log('📅 Rendering History screen');
        // For now, redirect to profile page which has workout history
        this.renderProfile();
    }

    renderProfile() {
        console.log('👤 Rendering Profile screen');
        if (window.profilePage) {
            window.profilePage.render();
        }
    }

    renderSettings() {
        console.log('⚙️ Rendering Settings screen');
        // For now, redirect to profile page
        this.renderProfile();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.homeMuscleBuilderApp = new App();
    window.homeMuscleBuilderApp.init();
});
