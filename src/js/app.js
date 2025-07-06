// Home Muscle Builder - Main Application
class HomeMuscleBuilderApp {
    constructor() {
        this.currentView = 'dashboard';
        this.userProfile = null;
        this.userPlan = null;
        this.exercises = [];
        this.workouts = [];
        this.workoutStreak = 0;
        this.onboardingStep = 0;
        this.onboardingData = {};
        
        this.init();
    }

    async init() {
        console.log('Initializing Home Muscle Builder App...');
        
        // Load data from localStorage
        this.loadUserData();
        
        // Check if user needs onboarding
        if (!this.userProfile || !this.userProfile.onboardingCompleted) {
            this.showOnboarding();
            return;
        }
        
        // Initialize exercise library
        await this.initializeExerciseLibrary();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateDashboard();
        this.renderExercises();
        this.renderUserPlan();
        
        // Check for install prompt
        this.setupInstallPrompt();
        
        // Setup offline detection
        this.setupOfflineDetection();
        
        // Handle URL parameters (for shortcuts)
        this.handleURLParams();
        
        console.log('App initialized successfully');
    }

    // Data Management
    loadUserData() {
        // Load user profile
        const savedProfile = localStorage.getItem('hmb-user-profile');
        if (savedProfile) {
            this.userProfile = JSON.parse(savedProfile);
        }

        // Load user plan
        const savedPlan = localStorage.getItem('hmb-user-plan');
        if (savedPlan) {
            this.userPlan = JSON.parse(savedPlan);
        }

        // Load workouts
        const savedWorkouts = localStorage.getItem('hmb-workouts');
        if (savedWorkouts) {
            this.workouts = JSON.parse(savedWorkouts);
        }

        // Calculate workout streak
        this.calculateWorkoutStreak();
    }

    saveUserProfile(profileData) {
        this.userProfile = profileData;
        localStorage.setItem('hmb-user-profile', JSON.stringify(profileData));
        this.showProfileInfo();
        this.updateDashboard();
    }

    saveUserPlan(planData) {
        this.userPlan = planData;
        localStorage.setItem('hmb-user-plan', JSON.stringify(planData));
    }

    // Onboarding Management
    showOnboarding() {
        document.getElementById('onboarding-screen').style.display = 'block';
        document.querySelector('.app-header').style.display = 'none';
        document.querySelector('.app-main').style.display = 'none';
        document.querySelector('.app-footer').style.display = 'none';
        this.onboardingStep = 0;
        this.showOnboardingStep(0);
    }

    hideOnboarding() {
        document.getElementById('onboarding-screen').style.display = 'none';
        document.querySelector('.app-header').style.display = 'block';
        document.querySelector('.app-main').style.display = 'block';
        document.querySelector('.app-footer').style.display = 'block';
    }

    showOnboardingStep(stepIndex) {
        // Hide all steps
        document.querySelectorAll('.onboarding-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const steps = ['welcome', 'personal', 'body', 'goals', 'plan'];
        if (stepIndex < steps.length) {
            document.getElementById(`onboarding-${steps[stepIndex]}`).classList.add('active');
            this.onboardingStep = stepIndex;
        }
    }

    nextOnboardingStep() {
        if (this.onboardingStep < 4) {
            this.showOnboardingStep(this.onboardingStep + 1);
        }
    }

    previousOnboardingStep() {
        if (this.onboardingStep > 0) {
            this.showOnboardingStep(this.onboardingStep - 1);
        }
    }

    generatePersonalizedPlan() {
        const { age, gender, height, weight, fitnessLevel, primaryGoal, weeklyAvailability } = this.onboardingData;
        
        // Calculate BMI for additional insights
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        
        // Determine age category
        let ageCategory = 'young';
        if (age >= 20 && age <= 30) ageCategory = 'peak';
        else if (age >= 31 && age <= 39) ageCategory = 'smart';
        else if (age >= 40) ageCategory = 'guardian';

        // Generate plan based on user data
        const planTemplate = this.getWorkoutPlanTemplate(ageCategory, fitnessLevel, primaryGoal, weeklyAvailability);
        
        // Customize plan
        const plan = {
            id: `plan_${Date.now()}`,
            name: planTemplate.name,
            description: planTemplate.description,
            duration: planTemplate.duration,
            weeklySchedule: planTemplate.schedule,
            exercises: planTemplate.exercises,
            targetGoal: primaryGoal,
            difficulty: fitnessLevel,
            ageCategory: ageCategory,
            workoutsPerWeek: parseInt(weeklyAvailability),
            createdAt: new Date().toISOString(),
            stats: {
                totalWorkouts: 0,
                completedWorkouts: 0,
                currentWeek: 1
            }
        };

        return plan;
    }

    getWorkoutPlanTemplate(ageCategory, fitnessLevel, goal, frequency) {
        const templates = {
            'muscle-gain': {
                peak: {
                    beginner: {
                        name: "Peak Builder Starter",
                        description: "High-volume muscle building for beginners in their prime",
                        duration: 12,
                        schedule: this.generateSchedule(frequency, ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']),
                        exercises: this.getExercisesByGoal('muscle-gain', 'beginner')
                    },
                    intermediate: {
                        name: "Peak Builder Advanced",
                        description: "Intensive muscle building with increased volume",
                        duration: 16,
                        schedule: this.generateSchedule(frequency, ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']),
                        exercises: this.getExercisesByGoal('muscle-gain', 'intermediate')
                    }
                },
                smart: {
                    beginner: {
                        name: "Smart Athlete Foundation",
                        description: "Quality-focused muscle building with recovery emphasis",
                        duration: 12,
                        schedule: this.generateSchedule(frequency, ['Upper', 'Lower', 'Upper', 'Lower']),
                        exercises: this.getExercisesByGoal('muscle-gain', 'beginner')
                    }
                },
                guardian: {
                    beginner: {
                        name: "Health Guardian Strength",
                        description: "Joint-friendly muscle building for long-term health",
                        duration: 12,
                        schedule: this.generateSchedule(frequency, ['Full Body', 'Full Body', 'Full Body']),
                        exercises: this.getExercisesByGoal('muscle-gain', 'beginner')
                    }
                }
            },
            'fat-loss': {
                peak: {
                    beginner: {
                        name: "Peak Fat Burner",
                        description: "High-intensity fat burning with muscle preservation",
                        duration: 8,
                        schedule: this.generateSchedule(frequency, ['HIIT', 'Strength', 'HIIT', 'Strength', 'HIIT']),
                        exercises: this.getExercisesByGoal('fat-loss', 'beginner')
                    }
                }
            },
            'general-fitness': {
                peak: {
                    beginner: {
                        name: "Peak Fitness Foundation",
                        description: "Well-rounded fitness development",
                        duration: 10,
                        schedule: this.generateSchedule(frequency, ['Full Body', 'Cardio', 'Full Body', 'Cardio']),
                        exercises: this.getExercisesByGoal('general-fitness', 'beginner')
                    }
                }
            },
            'strength': {
                peak: {
                    beginner: {
                        name: "Peak Strength Builder",
                        description: "Progressive strength development",
                        duration: 12,
                        schedule: this.generateSchedule(frequency, ['Upper', 'Lower', 'Upper', 'Lower']),
                        exercises: this.getExercisesByGoal('strength', 'beginner')
                    }
                }
            }
        };

        // Get the specific template or fall back to a default
        const goalTemplates = templates[goal] || templates['general-fitness'];
        const ageTemplates = goalTemplates[ageCategory] || goalTemplates['peak'];
        const template = ageTemplates[fitnessLevel] || ageTemplates['beginner'];

        return template;
    }

    generateSchedule(frequency, workoutTypes) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const schedule = {};
        
        for (let i = 0; i < 7; i++) {
            if (i < frequency) {
                schedule[days[i]] = {
                    type: 'workout',
                    name: workoutTypes[i % workoutTypes.length]
                };
            } else {
                schedule[days[i]] = {
                    type: 'rest',
                    name: 'Rest'
                };
            }
        }
        
        return schedule;
    }

    getExercisesByGoal(goal, level) {
        // This would return exercise IDs based on goal and level
        // For now, return a sample set
        const exerciseSets = {
            'muscle-gain': {
                'beginner': [1, 2, 4, 6], // Push-ups, Squats, Plank, Lunges
                'intermediate': [1, 2, 3, 4, 6, 7], // Add Pull-ups, Pike Push-ups
                'advanced': [1, 2, 3, 4, 5, 6, 7, 8] // All exercises
            },
            'fat-loss': {
                'beginner': [2, 4, 5, 8], // Squats, Plank, Burpees, Mountain Climbers
                'intermediate': [1, 2, 4, 5, 6, 8],
                'advanced': [1, 2, 3, 4, 5, 6, 7, 8]
            },
            'general-fitness': {
                'beginner': [1, 2, 4, 6], // Balanced selection
                'intermediate': [1, 2, 3, 4, 6, 8],
                'advanced': [1, 2, 3, 4, 5, 6, 7, 8]
            },
            'strength': {
                'beginner': [1, 2, 3, 6], // Focus on compound movements
                'intermediate': [1, 2, 3, 6, 7],
                'advanced': [1, 2, 3, 5, 6, 7, 8]
            }
        };

        return exerciseSets[goal]?.[level] || exerciseSets['general-fitness']['beginner'];
    }

    renderPlanRecommendation() {
        const plan = this.generatePersonalizedPlan();
        const container = document.getElementById('recommended-plan-content');
        
        // Get sample workout for preview
        const sampleDay = Object.keys(plan.weeklySchedule).find(day => 
            plan.weeklySchedule[day].type === 'workout'
        );
        const sampleWorkout = plan.weeklySchedule[sampleDay];
        const sampleExercises = plan.exercises.slice(0, 4).map(id => 
            this.exercises.find(ex => ex.id === id)
        ).filter(Boolean);

        container.innerHTML = `
            <div class="plan-header">
                <h3 class="plan-title">${plan.name}</h3>
                <p class="plan-description">${plan.description}</p>
            </div>
            
            <div class="plan-stats">
                <div class="plan-stat">
                    <span class="plan-stat-value">${plan.duration}</span>
                    <span class="plan-stat-label">Weeks</span>
                </div>
                <div class="plan-stat">
                    <span class="plan-stat-value">${plan.workoutsPerWeek}</span>
                    <span class="plan-stat-label">Days/Week</span>
                </div>
                <div class="plan-stat">
                    <span class="plan-stat-value">${plan.difficulty}</span>
                    <span class="plan-stat-label">Level</span>
                </div>
            </div>
            
            <div class="plan-preview">
                <h4>Your Weekly Schedule</h4>
                <div class="week-schedule">
                    ${Object.entries(plan.weeklySchedule).map(([day, workout]) => `
                        <div class="day-indicator ${workout.type === 'workout' ? 'workout-day' : 'rest-day'}">
                            <div style="font-weight: 600; margin-bottom: 4px;">${day}</div>
                            <div style="font-size: 0.75rem;">${workout.name}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="sample-workout">
                    <h5>Sample ${sampleWorkout.name} Workout:</h5>
                    <ul class="exercise-list">
                        ${sampleExercises.map(ex => `
                            <li>• ${ex.name}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Store the plan for completion
        this.generatedPlan = plan;
    }

    completeOnboarding() {
        // Save user profile with onboarding data
        const profile = {
            ...this.onboardingData,
            onboardingCompleted: true,
            createdAt: new Date().toISOString()
        };
        
        this.userProfile = profile;
        localStorage.setItem('hmb-user-profile', JSON.stringify(profile));
        
        // Save the generated plan
        this.saveUserPlan(this.generatedPlan);
        
        // Hide onboarding and initialize app
        this.hideOnboarding();
        this.init();
        
        // Show success message
        this.showMessage('Welcome to your fitness journey! Your personalized plan is ready.', 'success');
    }

    saveWorkout(workoutData) {
        workoutData.id = Date.now(); // Simple ID generation
        this.workouts.push(workoutData);
        localStorage.setItem('hmb-workouts', JSON.stringify(this.workouts));
        this.calculateWorkoutStreak();
        this.updateDashboard();
    }

    // Exercise Library
    async initializeExerciseLibrary() {
        // Sample exercise data - in a real app, this might come from an API
        this.exercises = [
            {
                id: 1,
                name: "Push-ups",
                description: "Classic upper body exercise targeting chest, shoulders, and triceps",
                muscleGroups: ["chest", "shoulders", "arms"],
                difficulty: "beginner",
                instructions: "Start in plank position, lower body to ground, push back up"
            },
            {
                id: 2,
                name: "Bodyweight Squats",
                description: "Fundamental lower body exercise for legs and glutes",
                muscleGroups: ["legs"],
                difficulty: "beginner",
                instructions: "Stand with feet shoulder-width apart, lower as if sitting in chair, return to standing"
            },
            {
                id: 3,
                name: "Pull-ups",
                description: "Upper body pulling exercise for back and biceps",
                muscleGroups: ["back", "arms"],
                difficulty: "intermediate",
                instructions: "Hang from bar, pull body up until chin clears bar, lower with control"
            },
            {
                id: 4,
                name: "Plank",
                description: "Core stabilization exercise",
                muscleGroups: ["core"],
                difficulty: "beginner",
                instructions: "Hold body in straight line from head to heels, engage core muscles"
            },
            {
                id: 5,
                name: "Burpees",
                description: "Full-body explosive exercise",
                muscleGroups: ["chest", "legs", "core"],
                difficulty: "advanced",
                instructions: "Squat down, jump back to plank, push-up, jump feet to hands, jump up"
            },
            {
                id: 6,
                name: "Lunges",
                description: "Single-leg lower body exercise",
                muscleGroups: ["legs"],
                difficulty: "beginner",
                instructions: "Step forward into lunge position, lower back knee toward ground, return to start"
            },
            {
                id: 7,
                name: "Pike Push-ups",
                description: "Shoulder-focused push-up variation",
                muscleGroups: ["shoulders", "arms"],
                difficulty: "intermediate",
                instructions: "Start in downward dog position, lower head toward ground, push back up"
            },
            {
                id: 8,
                name: "Mountain Climbers",
                description: "Dynamic core and cardio exercise",
                muscleGroups: ["core", "legs"],
                difficulty: "intermediate",
                instructions: "Start in plank, alternate bringing knees to chest rapidly"
            }
        ];
    }

    // UI Management
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected view
        document.getElementById(`${viewName}-view`).classList.add('active');
        
        // Activate corresponding nav button
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        this.currentView = viewName;
    }

    updateDashboard() {
        // Update today's workout based on plan
        const today = new Date();
        const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
        
        let todayWorkoutText = 'No workout planned';
        if (this.userPlan && this.userPlan.weeklySchedule) {
            const todaySchedule = this.userPlan.weeklySchedule[dayName];
            if (todaySchedule && todaySchedule.type === 'workout') {
                todayWorkoutText = `${todaySchedule.name} workout`;
                
                // Check if already completed today
                const todayDate = today.toISOString().split('T')[0];
                const todayWorkout = this.workouts.find(w => w.date === todayDate);
                if (todayWorkout) {
                    todayWorkoutText += ' ✓ Completed';
                }
            } else {
                todayWorkoutText = 'Rest day 😌';
            }
        }
        
        document.getElementById('today-workout').textContent = todayWorkoutText;

        // Update streak
        document.getElementById('workout-streak').textContent = `${this.workoutStreak} days`;

        // Update total workouts
        document.getElementById('total-workouts').textContent = this.workouts.length;
    }

    // User Plan Management
    renderUserPlan() {
        const container = document.getElementById('user-plan-content');
        
        if (!this.userPlan) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>No Plan Available</h3>
                    <p>Complete your profile to get a personalized workout plan.</p>
                    <button class="btn btn-primary" onclick="app.showView('profile')">Update Profile</button>
                </div>
            `;
            return;
        }

        const plan = this.userPlan;
        const currentWeek = plan.stats.currentWeek;
        const progress = (plan.stats.completedWorkouts / (plan.workoutsPerWeek * plan.duration)) * 100;

        container.innerHTML = `
            <div class="user-plan-header">
                <h2>${plan.name}</h2>
                <p>${plan.description}</p>
                <div style="margin-top: 1rem;">
                    <strong>Week ${currentWeek} of ${plan.duration}</strong>
                </div>
            </div>

            <div class="plan-progress">
                <div class="progress-card">
                    <h4>Overall Progress</h4>
                    <div style="font-size: 2rem; color: #1a73e8; font-weight: bold;">
                        ${Math.round(progress)}%
                    </div>
                    <p>${plan.stats.completedWorkouts} / ${plan.workoutsPerWeek * plan.duration} workouts</p>
                </div>
                <div class="progress-card">
                    <h4>This Week</h4>
                    <div style="font-size: 2rem; color: #4caf50; font-weight: bold;">
                        ${this.getWeeklyProgress()}/${plan.workoutsPerWeek}
                    </div>
                    <p>Workouts completed</p>
                </div>
                <div class="progress-card">
                    <h4>Streak</h4>
                    <div style="font-size: 2rem; color: #ff9800; font-weight: bold;">
                        ${this.workoutStreak}
                    </div>
                    <p>Days in a row</p>
                </div>
            </div>

            <div class="current-week">
                <div class="week-header">
                    <h3>Week ${currentWeek} Schedule</h3>
                    <button class="btn btn-outline btn-small" onclick="app.nextWeek()">Next Week →</button>
                </div>
                <div class="week-days">
                    ${this.renderWeekDays()}
                </div>
            </div>

            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn btn-secondary" onclick="app.resetPlan()">Reset Plan</button>
                <button class="btn btn-primary" onclick="app.showView('workouts'); app.startNewWorkout()">Start Today's Workout</button>
            </div>
        `;
    }

    renderWeekDays() {
        if (!this.userPlan) return '';
        
        const today = new Date();
        const currentDay = today.toLocaleDateString('en-US', { weekday: 'short' });
        
        return Object.entries(this.userPlan.weeklySchedule).map(([day, workout]) => {
            const isToday = day === currentDay;
            const isCompleted = this.isWorkoutCompletedToday(day);
            
            let classes = 'week-day';
            if (isToday) classes += ' today';
            if (isCompleted) classes += ' completed';
            if (workout.type === 'workout') classes += ' workout-day';
            
            return `
                <div class="${classes}" onclick="${workout.type === 'workout' && isToday ? 'app.startTodayWorkout()' : ''}">
                    <div class="day-name">${day}</div>
                    <div class="day-workout">${workout.name}</div>
                    ${isCompleted ? '<div style="color: #4caf50; font-weight: bold;">✓</div>' : ''}
                </div>
            `;
        }).join('');
    }

    getWeeklyProgress() {
        // Get workouts from this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        
        const thisWeekWorkouts = this.workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= startOfWeek;
        });
        
        return thisWeekWorkouts.length;
    }

    isWorkoutCompletedToday(dayName) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayDayName = today.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (dayName === todayDayName) {
            return this.workouts.some(w => w.date === todayStr);
        }
        
        return false; // For simplicity, only check today
    }

    startTodayWorkout() {
        this.showView('workouts');
        setTimeout(() => this.startNewWorkout(), 100);
    }

    nextWeek() {
        if (this.userPlan) {
            this.userPlan.stats.currentWeek = Math.min(
                this.userPlan.stats.currentWeek + 1,
                this.userPlan.duration
            );
            this.saveUserPlan(this.userPlan);
            this.renderUserPlan();
        }
    }

    resetPlan() {
        if (confirm('Are you sure you want to reset your plan? This will clear all progress.')) {
            this.userPlan.stats = {
                totalWorkouts: 0,
                completedWorkouts: 0,
                currentWeek: 1
            };
            this.saveUserPlan(this.userPlan);
            this.renderUserPlan();
            this.showMessage('Plan reset successfully!', 'success');
        }
    }

    calculateWorkoutStreak() {
        if (this.workouts.length === 0) {
            this.workoutStreak = 0;
            return;
        }

        // Sort workouts by date
        const sortedWorkouts = this.workouts
            .map(w => new Date(w.date))
            .sort((a, b) => b - a);

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let workoutDate of sortedWorkouts) {
            workoutDate.setHours(0, 0, 0, 0);
            
            if (workoutDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (workoutDate.getTime() === currentDate.getTime() + 24 * 60 * 60 * 1000) {
                // Allow for yesterday if today wasn't completed
                if (streak === 0) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                }
            } else {
                break;
            }
        }

        this.workoutStreak = streak;
    }

    // Profile Management
    showProfileInfo() {
        if (!this.userProfile) return;

        const ageGroup = this.getAgeGroup(this.userProfile.birthYear);
        const recommendedPlan = this.getRecommendedPlan(ageGroup);

        document.getElementById('age-group').textContent = ageGroup;
        document.getElementById('recommended-plan').textContent = recommendedPlan;
        
        // Hide form and show info
        document.getElementById('profile-form').style.display = 'none';
        document.getElementById('profile-info').style.display = 'block';
    }

    getAgeGroup(birthYear) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        
        if (age >= 20 && age <= 30) return "Peak Builder (20-30)";
        if (age >= 31 && age <= 39) return "Smart Athlete (31-39)";
        if (age >= 40) return "Health Guardian (40+)";
        return "Young Athlete (Under 20)";
    }

    getRecommendedPlan(ageGroup) {
        if (ageGroup.includes("Peak Builder")) return "High-volume, high-frequency training";
        if (ageGroup.includes("Smart Athlete")) return "Quality-focused with recovery emphasis";
        if (ageGroup.includes("Health Guardian")) return "Joint-friendly, functional movements";
        return "Progressive beginner program";
    }

    // Exercise Management
    renderExercises() {
        const exercisesList = document.getElementById('exercises-list');
        const searchTerm = document.getElementById('exercise-search').value.toLowerCase();
        const muscleFilter = document.getElementById('muscle-filter').value;
        
        let filteredExercises = this.exercises;
        
        // Apply search filter
        if (searchTerm) {
            filteredExercises = filteredExercises.filter(exercise =>
                exercise.name.toLowerCase().includes(searchTerm) ||
                exercise.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply muscle group filter
        if (muscleFilter) {
            filteredExercises = filteredExercises.filter(exercise =>
                exercise.muscleGroups.includes(muscleFilter)
            );
        }
        
        exercisesList.innerHTML = filteredExercises.map(exercise => `
            <div class="exercise-card">
                <h3>${exercise.name}</h3>
                <div class="exercise-meta">
                    ${exercise.muscleGroups.map(muscle => 
                        `<span class="muscle-group">${muscle}</span>`
                    ).join('')}
                    <span class="difficulty ${exercise.difficulty}">${exercise.difficulty}</span>
                </div>
                <p>${exercise.description}</p>
                <details>
                    <summary>Instructions</summary>
                    <p>${exercise.instructions}</p>
                </details>
            </div>
        `).join('');
    }

    // Workout Management
    startNewWorkout() {
        document.getElementById('new-workout').style.display = 'block';
        document.getElementById('workout-history').style.display = 'none';
        
        // Set today's date
        document.getElementById('workout-date').value = new Date().toISOString().split('T')[0];
        
        // Clear any existing entries
        document.getElementById('exercise-entries').innerHTML = '';
        
        // Add first exercise entry
        this.addExerciseEntry();
    }

    addExerciseEntry() {
        const entriesContainer = document.getElementById('exercise-entries');
        const entryId = Date.now();
        
        const entryHTML = `
            <div class="exercise-entry" data-entry-id="${entryId}">
                <div class="exercise-entry-header">
                    <select class="exercise-select" required>
                        <option value="">Select an exercise...</option>
                        ${this.exercises.map(ex => 
                            `<option value="${ex.id}">${ex.name}</option>`
                        ).join('')}
                    </select>
                    <button type="button" class="btn btn-outline btn-small" onclick="app.removeExerciseEntry(${entryId})">Remove</button>
                </div>
                <div class="sets-reps">
                    <div class="form-group">
                        <label>Sets</label>
                        <input type="number" class="sets-input" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label>Reps</label>
                        <input type="number" class="reps-input" min="1" max="100" required>
                    </div>
                </div>
            </div>
        `;
        
        entriesContainer.insertAdjacentHTML('beforeend', entryHTML);
    }

    removeExerciseEntry(entryId) {
        const entry = document.querySelector(`[data-entry-id="${entryId}"]`);
        if (entry) {
            entry.remove();
        }
    }

    cancelWorkout() {
        document.getElementById('new-workout').style.display = 'none';
        document.getElementById('workout-history').style.display = 'block';
    }

    showWorkoutHistory() {
        document.getElementById('new-workout').style.display = 'none';
        document.getElementById('workout-history').style.display = 'block';
        this.renderWorkoutHistory();
    }

    renderWorkoutHistory() {
        const historyContainer = document.getElementById('workout-calendar');
        
        if (this.workouts.length === 0) {
            historyContainer.innerHTML = '<p>No workouts recorded yet. Start your first workout!</p>';
            return;
        }
        
        const workoutsByDate = this.workouts.reduce((acc, workout) => {
            acc[workout.date] = workout;
            return acc;
        }, {});
        
        const sortedDates = Object.keys(workoutsByDate).sort((a, b) => new Date(b) - new Date(a));
        
        historyContainer.innerHTML = `
            <h3>Workout History (${this.workouts.length} total)</h3>
            <div class="workout-list">
                ${sortedDates.map(date => {
                    const workout = workoutsByDate[date];
                    return `
                        <div class="workout-summary" onclick="app.showWorkoutDetails('${date}')">
                            <div class="workout-date">${new Date(date).toLocaleDateString()}</div>
                            <div class="workout-info">${workout.exercises.length} exercises</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    showWorkoutDetails(date) {
        const workout = this.workouts.find(w => w.date === date);
        const detailsContainer = document.getElementById('workout-details');
        
        if (workout) {
            detailsContainer.innerHTML = `
                <h4>Workout - ${new Date(date).toLocaleDateString()}</h4>
                <div class="workout-exercises">
                    ${workout.exercises.map(ex => {
                        const exercise = this.exercises.find(e => e.id == ex.exerciseId);
                        return `
                            <div class="workout-exercise">
                                <strong>${exercise ? exercise.name : 'Unknown Exercise'}</strong>
                                <span>${ex.sets} sets × ${ex.reps} reps</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showView(e.target.dataset.view);
            });
        });

        // Onboarding forms
        this.setupOnboardingListeners();

        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const profileData = {
                nickname: formData.get('nickname'),
                birthYear: parseInt(formData.get('birthYear')),
                fitnessLevel: formData.get('fitnessLevel'),
                createdAt: new Date().toISOString()
            };
            this.saveUserProfile(profileData);
        });

        // Exercise search and filter
        document.getElementById('exercise-search').addEventListener('input', () => {
            this.renderExercises();
        });
        
        document.getElementById('muscle-filter').addEventListener('change', () => {
            this.renderExercises();
        });

        // Workout form
        document.getElementById('workout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCurrentWorkout();
        });
    }

    setupOnboardingListeners() {
        // Personal info form
        document.getElementById('onboarding-personal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.onboardingData.name = formData.get('name');
            this.onboardingData.age = parseInt(formData.get('age'));
            this.onboardingData.gender = formData.get('gender');
            this.nextOnboardingStep();
        });

        // Body info form
        document.getElementById('onboarding-body-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.onboardingData.height = parseInt(formData.get('height'));
            this.onboardingData.weight = parseInt(formData.get('weight'));
            this.onboardingData.fitnessLevel = formData.get('fitnessLevel');
            this.nextOnboardingStep();
        });

        // Goals form
        document.getElementById('onboarding-goals-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.onboardingData.primaryGoal = formData.get('primaryGoal');
            this.onboardingData.weeklyAvailability = formData.get('weeklyAvailability');
            
            // Generate and show plan recommendation
            this.renderPlanRecommendation();
            this.nextOnboardingStep();
        });

        // Goal selection
        document.querySelectorAll('.goal-card').forEach(card => {
            card.addEventListener('click', () => {
                // Remove selection from other cards
                document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
                // Select this card
                card.classList.add('selected');
                // Update hidden input
                document.getElementById('selected-goal').value = card.dataset.goal;
            });
        });
    }

    saveCurrentWorkout() {
        const date = document.getElementById('workout-date').value;
        const exercises = [];
        
        document.querySelectorAll('.exercise-entry').forEach(entry => {
            const exerciseId = entry.querySelector('.exercise-select').value;
            const sets = parseInt(entry.querySelector('.sets-input').value);
            const reps = parseInt(entry.querySelector('.reps-input').value);
            
            if (exerciseId && sets && reps) {
                exercises.push({ exerciseId: parseInt(exerciseId), sets, reps });
            }
        });
        
        if (exercises.length > 0) {
            const workoutData = {
                date,
                exercises,
                createdAt: new Date().toISOString()
            };
            
            this.saveWorkout(workoutData);
            
            // Update plan stats if user has a plan
            if (this.userPlan) {
                this.userPlan.stats.completedWorkouts++;
                this.userPlan.stats.totalWorkouts++;
                this.saveUserPlan(this.userPlan);
            }
            
            this.cancelWorkout();
            this.renderUserPlan(); // Update plan view
            this.showMessage('Workout saved successfully!', 'success');
        } else {
            this.showMessage('Please add at least one exercise to save the workout.', 'error');
        }
    }

    // PWA Features
    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('install-prompt').style.display = 'flex';
        });

        window.installApp = () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                    document.getElementById('install-prompt').style.display = 'none';
                });
            }
        };

        window.dismissInstallPrompt = () => {
            document.getElementById('install-prompt').style.display = 'none';
        };
    }

    setupOfflineDetection() {
        const updateOnlineStatus = () => {
            const offlineIndicator = document.getElementById('offline-indicator');
            if (navigator.onLine) {
                offlineIndicator.style.display = 'none';
            } else {
                offlineIndicator.style.display = 'block';
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        
        if (action) {
            switch (action) {
                case 'workout':
                    this.showView('workouts');
                    setTimeout(() => this.startNewWorkout(), 100);
                    break;
                case 'exercises':
                    this.showView('exercises');
                    break;
                default:
                    this.showView('dashboard');
            }
        }
    }

    // Utility Methods
    showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
window.showView = (view) => app.showView(view);
window.startNewWorkout = () => app.startNewWorkout();
window.addExerciseEntry = () => app.addExerciseEntry();
window.cancelWorkout = () => app.cancelWorkout();
window.showWorkoutHistory = () => app.showWorkoutHistory();
window.editProfile = () => {
    document.getElementById('profile-form').style.display = 'block';
    document.getElementById('profile-info').style.display = 'none';
};

// Make app instance globally accessible for onboarding
window.app = null;

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new HomeMuscleBuilderApp();
    window.app = app; // Make globally accessible
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeMuscleBuilderApp;
}
