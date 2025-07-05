// Workout Page - Active workout session with timer and logging
class WorkoutPage {
  constructor() {
    this.currentWorkout = null;
    this.currentExerciseIndex = 0;
    this.currentSetIndex = 0;
    this.isActive = false;
    this.isPaused = false;
    this.timer = null;
    this.workoutStartTime = null;
    this.exerciseStartTime = null;
    this.restTimer = null;
    this.restTimeRemaining = 0;
    this.workoutData = {
      exercises: [],
      startTime: null,
      endTime: null,
      totalDuration: 0,
      notes: ''
    };
  }

  render() {
    if (!this.currentWorkout) {
      return this.renderWorkoutSelection();
    }

    if (!this.isActive) {
      return this.renderWorkoutPreview();
    }

    return this.renderActiveWorkout();
  }

  renderWorkoutSelection() {
    return `
      <div class="workout-page page">
        <div class="page-header">
          <h1>Start a Workout</h1>
          <p>Choose a workout to get started</p>
        </div>
        
        <div class="workout-options">
          <button class="workout-option-card" onclick="workoutPage.startQuickWorkout()">
            <div class="option-icon">⚡</div>
            <h3>Quick Workout</h3>
            <p>15-30 minute focused session</p>
          </button>
          
          <button class="workout-option-card" onclick="workoutPage.startCustomWorkout()">
            <div class="option-icon">🎯</div>
            <h3>Custom Workout</h3>
            <p>Build your own workout routine</p>
          </button>
          
          <button class="workout-option-card" onclick="workoutPage.continueLastWorkout()">
            <div class="option-icon">📋</div>
            <h3>Previous Workout</h3>
            <p>Repeat your last workout session</p>
          </button>
        </div>
        
        <div class="recent-workouts">
          <h2>Recent Workouts</h2>
          ${this.renderRecentWorkouts()}
        </div>
      </div>
    `;
  }

  renderWorkoutPreview() {
    const totalExercises = this.currentWorkout.exercises.length;
    const estimatedDuration = this.calculateEstimatedDuration();

    return `
      <div class="workout-page page">
        <div class="workout-header">
          <button class="btn btn-ghost" onclick="workoutPage.cancelWorkout()">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
            Back
          </button>
          <h1>${this.currentWorkout.name}</h1>
        </div>
        
        <div class="workout-preview">
          <div class="workout-stats">
            <div class="stat">
              <span class="stat-label">Exercises</span>
              <span class="stat-value">${totalExercises}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Estimated Time</span>
              <span class="stat-value">${estimatedDuration} min</span>
            </div>
            <div class="stat">
              <span class="stat-label">Difficulty</span>
              <span class="stat-value">${this.currentWorkout.difficulty}</span>
            </div>
          </div>
          
          <div class="exercise-preview-list">
            <h3>Exercises</h3>
            ${this.currentWorkout.exercises.map((exercise, index) => `
              <div class="exercise-preview-item">
                <div class="exercise-number">${index + 1}</div>
                <div class="exercise-info">
                  <h4>${exercise.name}</h4>
                  <p>${exercise.sets} sets × ${exercise.reps || exercise.duration}</p>
                </div>
                <div class="exercise-target">
                  ${exercise.primaryMuscles[0]}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="workout-actions">
            <button class="btn btn-primary btn-large" onclick="workoutPage.startWorkout()">
              Start Workout
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderActiveWorkout() {
    const currentExercise = this.currentWorkout.exercises[this.currentExerciseIndex];
    const currentSet = this.currentSetIndex + 1;
    const totalSets = currentExercise.sets;
    const progress = ((this.currentExerciseIndex * totalSets + currentSet) / this.getTotalSets()) * 100;

    return `
      <div class="workout-page page active-workout">
        <div class="workout-progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        
        <div class="workout-header">
          <div class="workout-controls">
            <button class="btn btn-ghost" onclick="workoutPage.pauseWorkout()">
              ${this.isPaused ? '▶️' : '⏸️'}
            </button>
            <div class="workout-timer">
              ${this.formatTime(this.getWorkoutDuration())}
            </div>
            <button class="btn btn-ghost" onclick="workoutPage.showWorkoutMenu()">
              ⋮
            </button>
          </div>
        </div>
        
        <div class="current-exercise">
          <div class="exercise-info">
            <div class="exercise-counter">
              Exercise ${this.currentExerciseIndex + 1} of ${this.currentWorkout.exercises.length}
            </div>
            <h1 class="exercise-name">${currentExercise.name}</h1>
            <p class="exercise-target">${currentExercise.primaryMuscles.join(', ')}</p>
          </div>
          
          <div class="exercise-image">
            <img src="${currentExercise.image || '/assets/images/exercise-placeholder.jpg'}" 
                 alt="${currentExercise.name}">
          </div>
          
          <div class="set-info">
            <div class="set-counter">
              Set ${currentSet} of ${totalSets}
            </div>
            <div class="set-target">
              ${currentExercise.reps ? `${currentExercise.reps} reps` : currentExercise.duration}
            </div>
          </div>
          
          ${this.renderSetControls(currentExercise)}
        </div>
        
        ${this.renderRestTimer()}
        ${this.renderWorkoutMenu()}
      </div>
    `;
  }

  renderSetControls(exercise) {
    if (this.restTimeRemaining > 0) {
      return `
        <div class="set-controls resting">
          <div class="rest-message">
            <h3>Rest Time</h3>
            <div class="rest-timer timer-countdown ${this.restTimeRemaining <= 10 ? 'danger' : this.restTimeRemaining <= 30 ? 'warning' : ''}">
              ${this.formatTime(this.restTimeRemaining)}
            </div>
          </div>
          <button class="btn btn-secondary" onclick="workoutPage.skipRest()">
            Skip Rest
          </button>
        </div>
      `;
    }

    return `
      <div class="set-controls">
        ${exercise.reps ? `
          <div class="rep-tracker">
            <label for="reps-completed">Reps Completed:</label>
            <div class="rep-input-group">
              <button class="btn btn-round" onclick="workoutPage.decrementReps()">-</button>
              <input type="number" 
                     id="reps-completed" 
                     value="${exercise.reps}" 
                     min="0" 
                     max="999"
                     onchange="workoutPage.updateReps(this.value)">
              <button class="btn btn-round" onclick="workoutPage.incrementReps()">+</button>
            </div>
          </div>
          
          <div class="weight-tracker">
            <label for="weight-used">Weight (lbs):</label>
            <div class="weight-input-group">
              <button class="btn btn-round" onclick="workoutPage.decrementWeight()">-</button>
              <input type="number" 
                     id="weight-used" 
                     value="${exercise.weight || 0}" 
                     min="0" 
                     step="5"
                     onchange="workoutPage.updateWeight(this.value)">
              <button class="btn btn-round" onclick="workoutPage.incrementWeight()">+</button>
            </div>
          </div>
        ` : `
          <div class="duration-timer">
            <div class="exercise-timer">
              ${this.formatTime(this.getExerciseDuration())}
            </div>
            <p>Hold this position or perform the movement</p>
          </div>
        `}
        
        <div class="set-actions">
          <button class="btn btn-secondary" onclick="workoutPage.skipSet()">
            Skip Set
          </button>
          <button class="btn btn-primary btn-large set-complete-btn" 
                  onclick="workoutPage.completeSet()">
            Complete Set
          </button>
        </div>
      </div>
    `;
  }

  renderRestTimer() {
    return `
      <div id="restTimerModal" class="modal-backdrop rest-timer-modal">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3>Rest Time</h3>
          </div>
          <div class="modal-body">
            <div class="rest-timer-display">
              <div class="rest-time">${this.formatTime(this.restTimeRemaining)}</div>
              <div class="rest-progress">
                <div class="rest-progress-fill" style="width: ${(1 - this.restTimeRemaining / 60) * 100}%"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="workoutPage.skipRest()">Skip</button>
            <button class="btn btn-primary" onclick="workoutPage.addRestTime(30)">+30s</button>
          </div>
        </div>
      </div>
    `;
  }

  renderWorkoutMenu() {
    return `
      <div id="workoutMenu" class="modal-backdrop">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h3>Workout Options</h3>
            <button class="modal-close" onclick="workoutPage.hideWorkoutMenu()">×</button>
          </div>
          <div class="modal-body">
            <div class="menu-options">
              <button class="menu-option" onclick="workoutPage.pauseWorkout()">
                ${this.isPaused ? '▶️ Resume' : '⏸️ Pause'} Workout
              </button>
              <button class="menu-option" onclick="workoutPage.showExerciseInstructions()">
                📖 Exercise Instructions
              </button>
              <button class="menu-option" onclick="workoutPage.skipExercise()">
                ⏭️ Skip Exercise
              </button>
              <button class="menu-option" onclick="workoutPage.addWorkoutNote()">
                📝 Add Note
              </button>
              <button class="menu-option danger" onclick="workoutPage.endWorkout()">
                🏁 End Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRecentWorkouts() {
    // In a real app, this would fetch from storage
    return `
      <div class="recent-workouts-list">
        <p class="empty-state-text">No recent workouts found. Start your first workout above!</p>
      </div>
    `;
  }

  // Workout Control Methods
  async startQuickWorkout() {
    const quickWorkouts = await window.exerciseLibrary.getQuickWorkouts();
    if (quickWorkouts.length > 0) {
      this.currentWorkout = quickWorkouts[0]; // Get the first quick workout
      this.updateView();
    }
  }

  startCustomWorkout() {
    window.router.navigate('/exercises');
  }

  async continueLastWorkout() {
    const lastWorkout = await window.workoutLog.getLastWorkout();
    if (lastWorkout) {
      this.currentWorkout = lastWorkout;
      this.updateView();
    } else {
      window.ui.showToast('No previous workout found', 'info');
    }
  }

  startWorkout() {
    this.isActive = true;
    this.workoutStartTime = Date.now();
    this.exerciseStartTime = Date.now();
    this.currentExerciseIndex = 0;
    this.currentSetIndex = 0;
    
    // Initialize workout data
    this.workoutData = {
      workoutId: this.currentWorkout.id,
      name: this.currentWorkout.name,
      exercises: this.currentWorkout.exercises.map(ex => ({
        ...ex,
        sets: Array(ex.sets).fill(null).map(() => ({
          reps: ex.reps || null,
          weight: ex.weight || 0,
          duration: ex.duration || null,
          completed: false
        }))
      })),
      startTime: this.workoutStartTime,
      endTime: null,
      totalDuration: 0,
      notes: ''
    };
    
    this.updateView();
  }

  pauseWorkout() {
    this.isPaused = !this.isPaused;
    this.updateView();
  }

  completeSet() {
    const currentExercise = this.workoutData.exercises[this.currentExerciseIndex];
    const currentSet = currentExercise.sets[this.currentSetIndex];
    
    // Mark set as completed
    currentSet.completed = true;
    currentSet.completedAt = Date.now();
    
    // Get current values from inputs
    const repsInput = document.getElementById('reps-completed');
    const weightInput = document.getElementById('weight-used');
    
    if (repsInput) currentSet.reps = parseInt(repsInput.value) || 0;
    if (weightInput) currentSet.weight = parseFloat(weightInput.value) || 0;
    
    // Add animation
    document.querySelector('.set-complete-btn')?.classList.add('set-complete');
    
    // Move to next set or exercise
    if (this.currentSetIndex < currentExercise.sets.length - 1) {
      this.currentSetIndex++;
      this.startRestPeriod();
    } else {
      this.moveToNextExercise();
    }
  }

  startRestPeriod() {
    const restDuration = this.currentWorkout.exercises[this.currentExerciseIndex].restTime || 60;
    this.restTimeRemaining = restDuration;
    
    this.restTimer = setInterval(() => {
      this.restTimeRemaining--;
      this.updateRestTimer();
      
      if (this.restTimeRemaining <= 0) {
        this.skipRest();
      }
    }, 1000);
    
    this.updateView();
  }

  skipRest() {
    if (this.restTimer) {
      clearInterval(this.restTimer);
      this.restTimer = null;
    }
    this.restTimeRemaining = 0;
    this.updateView();
  }

  moveToNextExercise() {
    if (this.currentExerciseIndex < this.currentWorkout.exercises.length - 1) {
      this.currentExerciseIndex++;
      this.currentSetIndex = 0;
      this.exerciseStartTime = Date.now();
      this.updateView();
    } else {
      this.completeWorkout();
    }
  }

  skipSet() {
    if (this.currentSetIndex < this.currentWorkout.exercises[this.currentExerciseIndex].sets - 1) {
      this.currentSetIndex++;
    } else {
      this.moveToNextExercise();
    }
    this.updateView();
  }

  skipExercise() {
    this.moveToNextExercise();
  }

  async completeWorkout() {
    this.workoutData.endTime = Date.now();
    this.workoutData.totalDuration = this.workoutData.endTime - this.workoutData.startTime;
    
    try {
      // Save workout to log
      await window.workoutLog.saveWorkout(this.workoutData);
      
      // Show completion animation and message
      document.body.classList.add('workout-complete');
      window.ui.showToast('Workout completed! Great job!', 'success');
      
      // Navigate to workout summary after delay
      setTimeout(() => {
        this.showWorkoutSummary();
      }, 2000);
      
    } catch (error) {
      console.error('Error saving workout:', error);
      window.ui.showToast('Error saving workout', 'error');
    }
  }

  endWorkout() {
    if (confirm('Are you sure you want to end this workout? Your progress will be saved.')) {
      this.completeWorkout();
    }
  }

  cancelWorkout() {
    this.currentWorkout = null;
    this.isActive = false;
    this.updateView();
  }

  // Helper Methods
  calculateEstimatedDuration() {
    if (!this.currentWorkout) return 0;
    
    let totalTime = 0;
    this.currentWorkout.exercises.forEach(exercise => {
      if (exercise.duration) {
        totalTime += parseInt(exercise.duration) * exercise.sets;
      } else {
        totalTime += 45 * exercise.sets; // Assume 45 seconds per set for rep-based exercises
      }
      totalTime += (exercise.restTime || 60) * (exercise.sets - 1); // Rest between sets
    });
    
    return Math.ceil(totalTime / 60); // Convert to minutes
  }

  getTotalSets() {
    return this.currentWorkout.exercises.reduce((total, exercise) => total + exercise.sets, 0);
  }

  getWorkoutDuration() {
    if (!this.workoutStartTime) return 0;
    return Math.floor((Date.now() - this.workoutStartTime) / 1000);
  }

  getExerciseDuration() {
    if (!this.exerciseStartTime) return 0;
    return Math.floor((Date.now() - this.exerciseStartTime) / 1000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Input Handlers
  updateReps(value) {
    // Update is handled by the input onchange event
  }

  updateWeight(value) {
    // Update is handled by the input onchange event
  }

  incrementReps() {
    const input = document.getElementById('reps-completed');
    if (input) {
      input.value = parseInt(input.value) + 1;
    }
  }

  decrementReps() {
    const input = document.getElementById('reps-completed');
    if (input && parseInt(input.value) > 0) {
      input.value = parseInt(input.value) - 1;
    }
  }

  incrementWeight() {
    const input = document.getElementById('weight-used');
    if (input) {
      input.value = parseFloat(input.value) + 5;
    }
  }

  decrementWeight() {
    const input = document.getElementById('weight-used');
    if (input && parseFloat(input.value) > 0) {
      input.value = Math.max(0, parseFloat(input.value) - 5);
    }
  }

  updateRestTimer() {
    const timerDisplay = document.querySelector('.rest-timer-display .rest-time');
    if (timerDisplay) {
      timerDisplay.textContent = this.formatTime(this.restTimeRemaining);
    }
  }

  addRestTime(seconds) {
    this.restTimeRemaining += seconds;
    this.updateRestTimer();
  }

  // UI Helpers
  showWorkoutMenu() {
    document.getElementById('workoutMenu').classList.add('show');
  }

  hideWorkoutMenu() {
    document.getElementById('workoutMenu').classList.remove('show');
  }

  showExerciseInstructions() {
    const exercise = this.currentWorkout.exercises[this.currentExerciseIndex];
    window.exercisesPage.showExerciseDetails(exercise.id);
    this.hideWorkoutMenu();
  }

  addWorkoutNote() {
    const note = prompt('Add a note about this workout:');
    if (note) {
      this.workoutData.notes = note;
      window.ui.showToast('Note added to workout', 'success');
    }
    this.hideWorkoutMenu();
  }

  showWorkoutSummary() {
    window.router.navigate('/profile', { workoutSummary: this.workoutData });
  }

  updateView() {
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = this.render();
    }
  }

  // Initialize the page
  mount() {
    this.updateView();
  }
}

// Export for global use
window.workoutPage = new WorkoutPage();
