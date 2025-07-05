// Home Page Component
class HomePage {
    constructor() {
        // Access global instances directly
    }

    render() {
        const mainContent = document.getElementById('main-content');
        const userProfile = window.userProfile.getProfile();
        
        if (!userProfile) {
            // Redirect to onboarding if no profile
            window.router.navigate('/onboarding');
            return;
        }

        const ageCategory = userProfile.ageCategory;
        const stats = userProfile.stats;

        mainContent.innerHTML = `
            <div class="home-page">
                <!-- Header Section -->
                <div class="home-header">
                    <div class="container">
                        <div class="greeting-section">
                            <h1 class="greeting">${window.userProfile.getGreeting()}</h1>
                            <div class="age-category-badge badge badge-primary">
                                <span class="badge-icon">${ageCategory.icon}</span>
                                <span class="badge-text">${ageCategory.name}</span>
                            </div>
                            <div class="streak-display">
                                <span class="streak-icon">🔥</span>
                                <span class="streak-text">${stats.currentStreak} day streak</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Grid -->
                <div class="container">
                    <div class="quick-actions-grid">
                        <div class="action-card card-clickable" data-route="/workout">
                            <div class="action-icon">▶️</div>
                            <div class="action-label">Quick Workout</div>
                        </div>
                        <div class="action-card card-clickable" data-route="/exercises">
                            <div class="action-icon">💪</div>
                            <div class="action-label">Browse Exercises</div>
                        </div>
                        <div class="action-card card-clickable" data-route="/history">
                            <div class="action-icon">📅</div>
                            <div class="action-label">View History</div>
                        </div>
                        <div class="action-card card-clickable" data-route="/profile">
                            <div class="action-icon">🎯</div>
                            <div class="action-label">Today's Plan</div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity Section -->
                <div class="container">
                    <div class="recent-activity-section">
                        <h2 class="section-title">Recent Workouts</h2>
                        <div class="recent-workouts-list" id="recent-workouts">
                            <!-- Recent workouts will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Recommended Exercises Section -->
                <div class="container">
                    <div class="recommended-section">
                        <h2 class="section-title">Recommended for You</h2>
                        <div class="exercise-grid" id="recommended-exercises">
                            <!-- Recommended exercises will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadRecentWorkouts();
        this.loadRecommendedExercises();
        this.setupEventListeners();
    }

    loadRecentWorkouts() {
        const container = document.getElementById('recent-workouts');
        const recentWorkouts = window.workoutLog.getRecentWorkouts(5);

        if (recentWorkouts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏋️‍♂️</div>
                    <p>No workouts yet. Start your fitness journey!</p>
                    <button class="btn btn-primary" data-route="/workout">Start First Workout</button>
                </div>
            `;
        } else {
            container.innerHTML = recentWorkouts.map(workout => `
                <div class="workout-card card">
                    <div class="workout-date">${this.formatDate(workout.date)}</div>
                    <div class="workout-name">${workout.name}</div>
                    <div class="workout-stats">
                        <span class="stat">
                            <span class="stat-icon">⏱️</span>
                            <span class="stat-value">${workout.duration}min</span>
                        </span>
                        <span class="stat">
                            <span class="stat-icon">💪</span>
                            <span class="stat-value">${workout.exercises?.length || 0} exercises</span>
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }

    loadRecommendedExercises() {
        const container = document.getElementById('recommended-exercises');
        const userProfile = window.userProfile.getProfile();
        const recommendedExercises = window.exerciseLibrary.getRecommendedExercises(
            userProfile.ageCategory, 
            4
        );

        container.innerHTML = recommendedExercises.map(exercise => `
            <div class="exercise-card card card-clickable" data-exercise-id="${exercise.id}">
                <div class="exercise-thumbnail">
                    <img src="${exercise.thumbnail || 'images/exercise-placeholder.jpg'}" 
                         alt="${exercise.name}" 
                         loading="lazy"
                         onerror="this.src='images/exercise-placeholder.jpg'">
                </div>
                <div class="exercise-info">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-muscle">${window.exerciseLibrary.formatMuscleGroupName(exercise.muscleGroup)}</div>
                    <div class="exercise-difficulty badge badge-${exercise.difficulty}">
                        ${exercise.difficulty}
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        const mainContent = document.getElementById('main-content');

        // Quick action cards
        mainContent.addEventListener('click', (event) => {
            const actionCard = event.target.closest('.action-card[data-route]');
            if (actionCard) {
                const route = actionCard.dataset.route;
                window.router.navigate(route);
            }

            // Exercise cards
            const exerciseCard = event.target.closest('.exercise-card[data-exercise-id]');
            if (exerciseCard) {
                const exerciseId = exerciseCard.dataset.exerciseId;
                window.router.navigate(`/exercise/${exerciseId}`);
            }

            // Start workout button in empty state
            const startWorkoutBtn = event.target.closest('button[data-route]');
            if (startWorkoutBtn) {
                const route = startWorkoutBtn.dataset.route;
                window.router.navigate(route);
            }
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }
}

// Initialize global instance
window.homePage = new HomePage();
