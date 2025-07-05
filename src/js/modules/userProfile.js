// User Profile Management Module
class UserProfile {
    constructor() {
        this.STORAGE_KEY = 'hmb_user_profile';
        this.profile = null;
    }

    init() {
        this.loadProfile();
    }

    hasProfile() {
        return this.profile !== null;
    }

    loadProfile() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.profile = JSON.parse(stored);
                return this.profile;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        return null;
    }

    createProfile(nickname, yearOfBirth) {
        const profile = {
            nickname: nickname.trim(),
            yearOfBirth: parseInt(yearOfBirth),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ageCategory: this.calculateAgeCategory(yearOfBirth),
            preferences: {
                notifications: false,
                reminderTime: '08:00',
                reminderDays: [1, 2, 3, 4, 5] // Monday to Friday
            },
            stats: {
                totalWorkouts: 0,
                currentStreak: 0,
                bestStreak: 0,
                totalHours: 0
            }
        };

        this.profile = profile;
        this.saveProfile();
        
        console.log('✅ User profile created:', profile);
        return profile;
    }

    updateProfile(updates) {
        if (!this.profile) {
            throw new Error('No profile exists to update');
        }

        this.profile = {
            ...this.profile,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveProfile();
        return this.profile;
    }

    saveProfile() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.profile));
        } catch (error) {
            console.error('Error saving user profile:', error);
            throw new Error('Failed to save profile');
        }
    }

    getProfile() {
        return this.profile;
    }

    getNickname() {
        return this.profile?.nickname || 'User';
    }

    getAge() {
        if (!this.profile?.yearOfBirth) return null;
        return new Date().getFullYear() - this.profile.yearOfBirth;
    }

    getAgeCategory() {
        return this.profile?.ageCategory || this.calculateAgeCategory(this.profile?.yearOfBirth);
    }

    calculateAgeCategory(yearOfBirth) {
        const age = new Date().getFullYear() - yearOfBirth;
        
        if (age >= 20 && age <= 30) {
            return {
                id: 'peak-builder',
                name: 'Peak Builder',
                description: 'High-volume, high-frequency training',
                color: '#FF6B35',
                icon: '🔥'
            };
        } else if (age >= 31 && age <= 39) {
            return {
                id: 'smart-athlete',
                name: 'Smart Athlete',
                description: 'Quality and recovery focused',
                color: '#3498DB',
                icon: '🎯'
            };
        } else if (age >= 40) {
            return {
                id: 'health-guardian',
                name: 'Health Guardian',
                description: 'Joint-friendly, functional training',
                color: '#27AE60',
                icon: '🛡️'
            };
        } else {
            return {
                id: 'peak-builder',
                name: 'Peak Builder',
                description: 'High-volume, high-frequency training',
                color: '#FF6B35',
                icon: '🔥'
            };
        }
    }

    updateStats(statUpdates) {
        if (!this.profile) return;

        this.profile.stats = {
            ...this.profile.stats,
            ...statUpdates
        };

        this.saveProfile();
    }

    incrementWorkoutCount() {
        if (!this.profile) return;

        this.profile.stats.totalWorkouts += 1;
        
        // Update streak logic would go here
        // For now, just increment current streak
        this.profile.stats.currentStreak += 1;
        
        if (this.profile.stats.currentStreak > this.profile.stats.bestStreak) {
            this.profile.stats.bestStreak = this.profile.stats.currentStreak;
        }

        this.saveProfile();
    }

    addWorkoutTime(minutes) {
        if (!this.profile) return;

        this.profile.stats.totalHours += minutes / 60;
        this.saveProfile();
    }

    getGreeting() {
        const hour = new Date().getHours();
        const nickname = this.getNickname();
        
        if (hour < 12) {
            return `Good morning, ${nickname}!`;
        } else if (hour < 17) {
            return `Good afternoon, ${nickname}!`;
        } else {
            return `Good evening, ${nickname}!`;
        }
    }

    getNotificationPreferences() {
        return this.profile?.preferences || {
            notifications: false,
            reminderTime: '08:00',
            reminderDays: [1, 2, 3, 4, 5]
        };
    }

    updateNotificationPreferences(preferences) {
        if (!this.profile) return;

        this.profile.preferences = {
            ...this.profile.preferences,
            ...preferences
        };

        this.saveProfile();
    }

    deleteProfile() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            this.profile = null;
            console.log('✅ User profile deleted');
        } catch (error) {
            console.error('Error deleting user profile:', error);
            throw new Error('Failed to delete profile');
        }
    }

    validateProfileData(nickname, yearOfBirth) {
        const errors = [];
        
        // Validate nickname
        if (!nickname || nickname.trim().length < 2) {
            errors.push('Nickname must be at least 2 characters long');
        }
        if (nickname && nickname.trim().length > 20) {
            errors.push('Nickname must be less than 20 characters');
        }
        
        // Validate year of birth
        const currentYear = new Date().getFullYear();
        const year = parseInt(yearOfBirth);
        
        if (!year || isNaN(year)) {
            errors.push('Please enter a valid birth year');
        }
        if (year < 1950 || year > 2005) {
            errors.push('Birth year must be between 1950 and 2005');
        }
        if (year > currentYear - 18) {
            errors.push('You must be at least 18 years old');
        }
        
        return errors;
    }

    exportData() {
        return {
            profile: this.profile,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    importData(data) {
        try {
            if (data.profile) {
                this.profile = data.profile;
                this.saveProfile();
                return true;
            }
        } catch (error) {
            console.error('Error importing profile data:', error);
        }
        return false;
    }

    setOnboardingComplete(complete = true) {
        if (!this.profile) {
            throw new Error('No profile exists to update');
        }
        
        this.profile.onboardingComplete = complete;
        this.profile.updatedAt = new Date().toISOString();
        this.saveProfile();
        return this.profile;
    }

    isOnboardingComplete() {
        return this.profile && this.profile.onboardingComplete === true;
    }
}

// Initialize global instance
window.userProfile = new UserProfile();
