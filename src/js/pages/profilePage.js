// Profile Page - User profile, settings, and workout history
class ProfilePage {
  constructor() {
    this.userProfile = null;
    this.workoutHistory = [];
    this.currentView = 'overview'; // overview, history, settings, achievements
    this.workoutSummary = null; // For showing workout completion summary
  }

  async init() {
    this.userProfile = await window.userProfile.getProfile();
    this.workoutHistory = await window.workoutLog.getWorkoutHistory();
  }

  render() {
    if (this.workoutSummary) {
      return this.renderWorkoutSummary();
    }

    return `
      <div class="profile-page page">
        ${this.renderProfileHeader()}
        ${this.renderProfileTabs()}
        ${this.renderCurrentView()}
      </div>
    `;
  }

  renderProfileHeader() {
    const profile = this.userProfile || {};
    const totalWorkouts = this.workoutHistory.length;
    const totalDuration = this.workoutHistory.reduce((total, workout) => total + (workout.totalDuration || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts / 1000 / 60) : 0;

    return `
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-placeholder">
            ${(profile.name || 'User')[0].toUpperCase()}
          </div>
        </div>
        
        <div class="profile-info">
          <h1>${profile.name || 'Your Profile'}</h1>
          <p class="profile-subtitle">${profile.fitnessLevel || 'Fitness Enthusiast'}</p>
        </div>
        
        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-value">${totalWorkouts}</div>
            <div class="stat-label">Workouts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${Math.round(totalDuration / 1000 / 3600)}h</div>
            <div class="stat-label">Total Time</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${avgDuration}m</div>
            <div class="stat-label">Avg Duration</div>
          </div>
        </div>
      </div>
    `;
  }

  renderProfileTabs() {
    const tabs = [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'history', label: 'History', icon: '📅' },
      { id: 'achievements', label: 'Achievements', icon: '🏆' },
      { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return `
      <div class="profile-tabs">
        ${tabs.map(tab => `
          <button class="profile-tab ${this.currentView === tab.id ? 'active' : ''}"
                  onclick="profilePage.switchView('${tab.id}')">
            <span class="tab-icon">${tab.icon}</span>
            <span class="tab-label">${tab.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'overview':
        return this.renderOverview();
      case 'history':
        return this.renderHistory();
      case 'achievements':
        return this.renderAchievements();
      case 'settings':
        return this.renderSettings();
      default:
        return this.renderOverview();
    }
  }

  renderOverview() {
    const profile = this.userProfile || {};
    const recentWorkouts = this.workoutHistory.slice(0, 5);
    
    return `
      <div class="profile-content">
        <div class="overview-section">
          <h2>Recent Activity</h2>
          ${recentWorkouts.length > 0 ? `
            <div class="recent-workouts">
              ${recentWorkouts.map(workout => this.renderWorkoutCard(workout)).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-icon">💪</div>
              <h3>No workouts yet</h3>
              <p>Start your first workout to see your progress here</p>
              <button class="btn btn-primary" onclick="window.router.navigate('/workout')">
                Start Workout
              </button>
            </div>
          `}
        </div>
        
        <div class="overview-section">
          <h2>Weekly Progress</h2>
          ${this.renderWeeklyProgress()}
        </div>
        
        <div class="overview-section">
          <h2>Goals Progress</h2>
          ${this.renderGoalsProgress()}
        </div>
        
        <div class="overview-section">
          <h2>Favorite Exercises</h2>
          ${this.renderFavoriteExercises()}
        </div>
      </div>
    `;
  }

  renderHistory() {
    return `
      <div class="profile-content">
        <div class="history-header">
          <h2>Workout History</h2>
          <div class="history-filters">
            <select class="filter-select" onchange="profilePage.filterHistory(this.value)">
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        
        ${this.renderCalendarView()}
        
        <div class="workout-history-list">
          ${this.workoutHistory.length > 0 ? 
            this.workoutHistory.map(workout => this.renderWorkoutHistoryItem(workout)).join('') :
            '<div class="empty-state"><p>No workout history found</p></div>'
          }
        </div>
      </div>
    `;
  }

  renderCalendarView() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const workoutDates = new Set(
      this.workoutHistory.map(w => new Date(w.startTime).toDateString())
    );

    let calendarHtml = `
      <div class="calendar-view">
        <div class="calendar-header">
          <button class="btn btn-ghost" onclick="profilePage.previousMonth()">‹</button>
          <h3>${firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button class="btn btn-ghost" onclick="profilePage.nextMonth()">›</button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>
    `;

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = currentDate.toDateString() === today.toDateString();
      const hasWorkout = workoutDates.has(currentDate.toDateString());
      
      calendarHtml += `
        <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''}"
             onclick="profilePage.showDayWorkouts('${currentDate.toISOString()}')">
          <span class="day-number">${currentDate.getDate()}</span>
          ${hasWorkout ? '<div class="workout-indicator"></div>' : ''}
        </div>
      `;
    }

    calendarHtml += `
        </div>
      </div>
    `;

    return calendarHtml;
  }

  renderAchievements() {
    const achievements = this.calculateAchievements();
    
    return `
      <div class="profile-content">
        <div class="achievements-section">
          <h2>Your Achievements</h2>
          <div class="achievements-grid">
            ${achievements.map(achievement => `
              <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? 
                  `<div class="achievement-date">Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}</div>` :
                  `<div class="achievement-progress">${achievement.progress}/${achievement.target}</div>`
                }
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="streaks-section">
          <h2>Streaks</h2>
          ${this.renderStreaks()}
        </div>
      </div>
    `;
  }

  renderSettings() {
    const profile = this.userProfile || {};
    
    return `
      <div class="profile-content">
        <div class="settings-section">
          <h2>Profile Settings</h2>
          <div class="settings-group">
            <div class="form-group">
              <label for="profile-name">Name</label>
              <input type="text" id="profile-name" class="form-input" 
                     value="${profile.name || ''}" 
                     onchange="profilePage.updateProfile('name', this.value)">
            </div>
            
            <div class="form-group">
              <label for="profile-age">Age</label>
              <input type="number" id="profile-age" class="form-input" 
                     value="${profile.age || ''}" 
                     onchange="profilePage.updateProfile('age', this.value)">
            </div>
            
            <div class="form-group">
              <label for="fitness-level">Fitness Level</label>
              <select id="fitness-level" class="form-select" 
                      onchange="profilePage.updateProfile('fitnessLevel', this.value)">
                <option value="beginner" ${profile.fitnessLevel === 'beginner' ? 'selected' : ''}>Beginner</option>
                <option value="intermediate" ${profile.fitnessLevel === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="advanced" ${profile.fitnessLevel === 'advanced' ? 'selected' : ''}>Advanced</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h2>App Settings</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Notifications</h3>
                <p>Receive workout reminders and motivation</p>
              </div>
              <label class="switch">
                <input type="checkbox" ${profile.notificationsEnabled ? 'checked' : ''} 
                       onchange="profilePage.updateProfile('notificationsEnabled', this.checked)">
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Sound Effects</h3>
                <p>Play sounds during workouts</p>
              </div>
              <label class="switch">
                <input type="checkbox" ${profile.soundEnabled !== false ? 'checked' : ''} 
                       onchange="profilePage.updateProfile('soundEnabled', this.checked)">
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Dark Mode</h3>
                <p>Use dark theme</p>
              </div>
              <label class="switch">
                <input type="checkbox" ${profile.darkMode ? 'checked' : ''} 
                       onchange="profilePage.toggleDarkMode(this.checked)">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h2>Data & Privacy</h2>
          <div class="settings-group">
            <button class="btn btn-secondary" onclick="profilePage.exportData()">
              📄 Export My Data
            </button>
            <button class="btn btn-secondary" onclick="profilePage.clearData()">
              🗑️ Clear All Data
            </button>
            <button class="btn btn-secondary" onclick="profilePage.resetOnboarding()">
              🔄 Reset Onboarding
            </button>
          </div>
        </div>
        
        <div class="settings-section">
          <h2>About</h2>
          <div class="about-info">
            <p><strong>HomeMuscleBuilder</strong></p>
            <p>Version 1.0.0</p>
            <p>Your personal fitness companion</p>
            <button class="btn btn-ghost" onclick="profilePage.showAbout()">
              View Credits & Licenses
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderWorkoutSummary() {
    const workout = this.workoutSummary;
    const duration = Math.round(workout.totalDuration / 1000 / 60);
    const completedSets = workout.exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );
    const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);

    return `
      <div class="workout-summary-page">
        <div class="summary-header">
          <div class="completion-badge">
            <div class="badge-icon">🏆</div>
            <h1>Workout Complete!</h1>
            <p>Great job finishing your workout</p>
          </div>
        </div>
        
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="stat-value">${duration}</div>
            <div class="stat-label">Minutes</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">${completedSets}</div>
            <div class="stat-label">Sets Completed</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">${workout.exercises.length}</div>
            <div class="stat-label">Exercises</div>
          </div>
        </div>
        
        <div class="summary-exercises">
          <h2>Exercises Completed</h2>
          ${workout.exercises.map(exercise => `
            <div class="summary-exercise">
              <h3>${exercise.name}</h3>
              <div class="exercise-sets">
                ${exercise.sets.map((set, index) => `
                  <div class="set-summary ${set.completed ? 'completed' : 'skipped'}">
                    Set ${index + 1}: ${set.reps ? `${set.reps} reps` : exercise.duration}
                    ${set.weight ? ` @ ${set.weight} lbs` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="summary-actions">
          <button class="btn btn-secondary" onclick="profilePage.saveWorkoutNote()">
            📝 Add Note
          </button>
          <button class="btn btn-primary" onclick="profilePage.finishSummary()">
            View Profile
          </button>
        </div>
      </div>
    `;
  }

  // Helper render methods
  renderWorkoutCard(workout) {
    const date = new Date(workout.startTime);
    const duration = Math.round(workout.totalDuration / 1000 / 60);
    
    return `
      <div class="workout-card" onclick="profilePage.showWorkoutDetails('${workout.id}')">
        <div class="workout-date">
          <div class="date-day">${date.getDate()}</div>
          <div class="date-month">${date.toLocaleDateString('en-US', { month: 'short' })}</div>
        </div>
        <div class="workout-info">
          <h3>${workout.name}</h3>
          <p>${workout.exercises.length} exercises • ${duration} min</p>
        </div>
        <div class="workout-status">
          ✅
        </div>
      </div>
    `;
  }

  renderWorkoutHistoryItem(workout) {
    const date = new Date(workout.startTime);
    const duration = Math.round(workout.totalDuration / 1000 / 60);
    
    return `
      <div class="history-item" onclick="profilePage.showWorkoutDetails('${workout.id}')">
        <div class="history-date">
          ${date.toLocaleDateString()}
        </div>
        <div class="history-workout">
          <h3>${workout.name}</h3>
          <p>${workout.exercises.length} exercises • ${duration} minutes</p>
        </div>
        <div class="history-stats">
          <span class="sets-completed">
            ${workout.exercises.reduce((total, ex) => total + ex.sets.filter(s => s.completed).length, 0)} sets
          </span>
        </div>
      </div>
    `;
  }

  renderWeeklyProgress() {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const thisWeek = this.getThisWeekWorkouts();
    
    return `
      <div class="weekly-progress">
        ${weekDays.map((day, index) => {
          const hasWorkout = thisWeek[index];
          return `
            <div class="progress-day ${hasWorkout ? 'completed' : ''}">
              <div class="day-label">${day}</div>
              <div class="day-indicator">${hasWorkout ? '✅' : '⭕'}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderGoalsProgress() {
    const profile = this.userProfile || {};
    const goals = profile.goals || [];
    
    if (goals.length === 0) {
      return '<p>No goals set. Update your profile to add fitness goals.</p>';
    }
    
    return `
      <div class="goals-progress">
        ${goals.map(goal => `
          <div class="goal-progress-item">
            <div class="goal-info">
              <h4>${this.getGoalLabel(goal)}</h4>
              <p>Keep working towards your goal!</p>
            </div>
            <div class="goal-indicator">🎯</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderFavoriteExercises() {
    // In a real app, this would get from user's favorites
    return `
      <div class="favorite-exercises">
        <p>Start favoriting exercises to see them here!</p>
      </div>
    `;
  }

  renderStreaks() {
    const currentStreak = this.calculateCurrentStreak();
    const longestStreak = this.calculateLongestStreak();
    
    return `
      <div class="streaks-display">
        <div class="streak-card">
          <div class="streak-icon">🔥</div>
          <div class="streak-info">
            <div class="streak-value">${currentStreak}</div>
            <div class="streak-label">Current Streak</div>
          </div>
        </div>
        
        <div class="streak-card">
          <div class="streak-icon">📈</div>
          <div class="streak-info">
            <div class="streak-value">${longestStreak}</div>
            <div class="streak-label">Longest Streak</div>
          </div>
        </div>
      </div>
    `;
  }

  // Data methods
  calculateAchievements() {
    const totalWorkouts = this.workoutHistory.length;
    const totalDuration = this.workoutHistory.reduce((sum, w) => sum + w.totalDuration, 0);
    const totalHours = Math.floor(totalDuration / 1000 / 3600);
    
    return [
      {
        id: 'first_workout',
        name: 'First Steps',
        description: 'Complete your first workout',
        icon: '🥾',
        target: 1,
        progress: Math.min(totalWorkouts, 1),
        unlocked: totalWorkouts >= 1,
        unlockedAt: this.workoutHistory[0]?.startTime
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Complete 7 workouts',
        icon: '⚔️',
        target: 7,
        progress: Math.min(totalWorkouts, 7),
        unlocked: totalWorkouts >= 7,
        unlockedAt: this.workoutHistory[6]?.startTime
      },
      {
        id: 'hour_power',
        name: 'Hour Power',
        description: 'Complete 1 hour of total exercise',
        icon: '⏰',
        target: 1,
        progress: Math.min(totalHours, 1),
        unlocked: totalHours >= 1,
        unlockedAt: null // Would need to calculate when hour was reached
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Work out 3 days in a row',
        icon: '👑',
        target: 3,
        progress: Math.min(this.calculateCurrentStreak(), 3),
        unlocked: this.calculateCurrentStreak() >= 3,
        unlockedAt: null
      }
    ];
  }

  calculateCurrentStreak() {
    if (this.workoutHistory.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const hasWorkout = this.workoutHistory.some(workout => {
        const workoutDate = new Date(workout.startTime);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === currentDate.getTime();
      });
      
      if (hasWorkout) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  calculateLongestStreak() {
    if (this.workoutHistory.length === 0) return 0;
    
    // Simple implementation - in reality would need more sophisticated date checking
    return Math.max(this.calculateCurrentStreak(), 0);
  }

  getThisWeekWorkouts() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekWorkouts = Array(7).fill(false);
    
    this.workoutHistory.forEach(workout => {
      const workoutDate = new Date(workout.startTime);
      const dayDiff = Math.floor((workoutDate - startOfWeek) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 0 && dayDiff < 7) {
        weekWorkouts[dayDiff] = true;
      }
    });
    
    return weekWorkouts;
  }

  getGoalLabel(goal) {
    const labels = {
      weight_loss: 'Lose Weight',
      muscle_gain: 'Build Muscle',
      strength: 'Get Stronger',
      endurance: 'Improve Endurance',
      flexibility: 'Increase Flexibility',
      general_fitness: 'General Fitness'
    };
    return labels[goal] || goal;
  }

  // Event handlers
  switchView(view) {
    this.currentView = view;
    this.updateView();
  }

  async updateProfile(field, value) {
    try {
      await window.userProfile.updateProfile({ [field]: value });
      this.userProfile = await window.userProfile.getProfile();
      window.ui.showToast('Profile updated', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      window.ui.showToast('Error updating profile', 'error');
    }
  }

  toggleDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    this.updateProfile('darkMode', enabled);
  }

  exportData() {
    const data = {
      profile: this.userProfile,
      workouts: this.workoutHistory,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homemusclebuilder-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.clear();
      window.ui.showToast('All data cleared', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  resetOnboarding() {
    if (confirm('This will reset your onboarding and you\'ll need to set up your profile again.')) {
      window.userProfile.setOnboardingComplete(false);
      window.router.navigate('/onboarding');
    }
  }

  saveWorkoutNote() {
    const note = prompt('Add a note about this workout:');
    if (note) {
      this.workoutSummary.notes = note;
      window.ui.showToast('Note saved', 'success');
    }
  }

  finishSummary() {
    this.workoutSummary = null;
    this.currentView = 'overview';
    this.updateView();
  }

  showWorkoutDetails(workoutId) {
    // In a real app, this would show detailed workout information
    window.ui.showToast('Workout details would be shown here', 'info');
  }

  showDayWorkouts(dateString) {
    const date = new Date(dateString);
    const dayWorkouts = this.workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      return workoutDate.toDateString() === date.toDateString();
    });
    
    if (dayWorkouts.length > 0) {
      window.ui.showToast(`${dayWorkouts.length} workout(s) on ${date.toLocaleDateString()}`, 'info');
    }
  }

  showAbout() {
    window.ui.showToast('About information would be shown here', 'info');
  }

  previousMonth() {
    // Calendar navigation - would need to implement month state
    window.ui.showToast('Previous month', 'info');
  }

  nextMonth() {
    // Calendar navigation - would need to implement month state
    window.ui.showToast('Next month', 'info');
  }

  filterHistory(period) {
    // Filter workout history by time period
    window.ui.showToast(`Filtering by ${period}`, 'info');
  }

  updateView() {
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = this.render();
    }
  }

  // Initialize the page
  async mount(params = {}) {
    // Check if we're showing a workout summary
    if (params.workoutSummary) {
      this.workoutSummary = params.workoutSummary;
    }
    
    await this.init();
    this.updateView();
  }
}

// Export for global use
window.profilePage = new ProfilePage();
