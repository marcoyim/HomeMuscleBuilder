// Workout Log Management Module
class WorkoutLog {
    constructor() {
        this.STORAGE_KEY = 'hmb_workout_log';
        this.workouts = [];
    }

    init() {
        this.loadWorkouts();
    }

    loadWorkouts() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.workouts = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading workout log:', error);
            this.workouts = [];
        }
    }

    saveWorkouts() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.workouts));
        } catch (error) {
            console.error('Error saving workout log:', error);
        }
    }

    logWorkout(workoutData) {
        const workout = {
            id: this.generateId(),
            name: workoutData.name || 'Workout',
            date: workoutData.date || new Date().toISOString(),
            duration: workoutData.duration || 0,
            exercises: workoutData.exercises || [],
            notes: workoutData.notes || '',
            calories: workoutData.calories || 0,
            completed: true,
            createdAt: new Date().toISOString()
        };

        this.workouts.unshift(workout); // Add to beginning
        this.saveWorkouts();
        
        console.log('✅ Workout logged:', workout);
        return workout;
    }

    getWorkouts() {
        return [...this.workouts];
    }

    getWorkoutById(id) {
        return this.workouts.find(workout => workout.id === id);
    }

    getWorkoutByDate(date) {
        const targetDate = new Date(date).toDateString();
        return this.workouts.filter(workout => 
            new Date(workout.date).toDateString() === targetDate
        );
    }

    getWorkoutHistory(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= start && workoutDate <= end;
        });
    }

    getRecentWorkouts(count = 5) {
        return this.workouts.slice(0, count);
    }

    getTotalWorkouts() {
        return this.workouts.length;
    }

    getTotalHours() {
        return this.workouts.reduce((total, workout) => total + (workout.duration / 60), 0);
    }

    getWorkoutStreak() {
        // Calculate current workout streak
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) { // Check last 30 days
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            
            const hasWorkout = this.workouts.some(workout => 
                new Date(workout.date).toDateString() === checkDate.toDateString()
            );
            
            if (hasWorkout) {
                streak++;
            } else if (i > 0) { // Allow today to be skipped
                break;
            }
        }
        
        return streak;
    }

    generateId() {
        return 'workout_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    deleteWorkout(id) {
        this.workouts = this.workouts.filter(workout => workout.id !== id);
        this.saveWorkouts();
    }

    updateWorkout(id, updates) {
        const index = this.workouts.findIndex(workout => workout.id === id);
        if (index !== -1) {
            this.workouts[index] = { ...this.workouts[index], ...updates };
            this.saveWorkouts();
            return this.workouts[index];
        }
        return null;
    }

    getCalendarData(year, month) {
        const workoutDays = new Set();
        
        this.workouts.forEach(workout => {
            const date = new Date(workout.date);
            if (date.getFullYear() === year && date.getMonth() === month) {
                workoutDays.add(date.getDate());
            }
        });
        
        return workoutDays;
    }

    exportData() {
        return {
            workouts: this.workouts,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    importData(data) {
        try {
            if (data.workouts && Array.isArray(data.workouts)) {
                this.workouts = data.workouts;
                this.saveWorkouts();
                return true;
            }
        } catch (error) {
            console.error('Error importing workout data:', error);
        }
        return false;
    }
}

// Initialize global instance
window.workoutLog = new WorkoutLog();
