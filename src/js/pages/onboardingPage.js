class OnboardingPage {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.userData = {
      name: '',
      age: '',
      gender: '',
      fitnessLevel: '',
      goals: [],
      equipment: [],
      schedule: {
        daysPerWeek: 3,
        sessionLength: 30,
        preferredTime: 'morning'
      }
    };
  }

  render() {
    return `
      <div class="onboarding-page page">
        <div class="onboarding-header">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
          </div>
          <div class="step-indicator">
            <span class="step-current">${this.currentStep}</span>
            <span class="step-separator">of</span>
            <span class="step-total">${this.totalSteps}</span>
          </div>
        </div>
        
        <div class="onboarding-content">
          ${this.renderCurrentStep()}
        </div>
        
        <div class="onboarding-footer">
          ${this.currentStep > 1 ? '<button class="btn btn-secondary" onclick="onboarding.previousStep()">Back</button>' : ''}
          <button class="btn btn-primary" onclick="onboarding.nextStep()" ${this.isStepValid() ? '' : 'disabled'}>
            ${this.currentStep === this.totalSteps ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    `;
  }

  renderCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.renderBasicInfo();
      case 2:
        return this.renderFitnessLevel();
      case 3:
        return this.renderGoals();
      case 4:
        return this.renderSchedule();
      default:
        return '';
    }
  }

  renderBasicInfo() {
    return `
      <div class="step-content animate-fadeIn">
        <div class="step-header">
          <h2>Let's get to know you</h2>
          <p>Tell us a bit about yourself to personalize your experience</p>
        </div>
        
        <div class="form-group">
          <label for="name">What's your name?</label>
          <input type="text" id="name" class="form-input" placeholder="Enter your name" 
                 value="${this.userData.name}" onchange="onboarding.updateUserData('name', this.value)">
        </div>
        
        <div class="form-group">
          <label for="age">How old are you?</label>
          <input type="number" id="age" class="form-input" placeholder="Enter your age" min="13" max="99"
                 value="${this.userData.age}" onchange="onboarding.updateUserData('age', this.value)">
        </div>
        
        <div class="form-group">
          <label>Gender</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" name="gender" value="male" ${this.userData.gender === 'male' ? 'checked' : ''}
                     onchange="onboarding.updateUserData('gender', this.value)">
              <span class="radio-label">Male</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="gender" value="female" ${this.userData.gender === 'female' ? 'checked' : ''}
                     onchange="onboarding.updateUserData('gender', this.value)">
              <span class="radio-label">Female</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="gender" value="other" ${this.userData.gender === 'other' ? 'checked' : ''}
                     onchange="onboarding.updateUserData('gender', this.value)">
              <span class="radio-label">Other</span>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  renderFitnessLevel() {
    const levels = [
      {
        value: 'beginner',
        title: 'Beginner',
        description: 'New to working out or getting back into it',
        icon: '🌱'
      },
      {
        value: 'intermediate',
        title: 'Intermediate',
        description: 'Have some experience with regular workouts',
        icon: '💪'
      },
      {
        value: 'advanced',
        title: 'Advanced',
        description: 'Experienced with consistent training',
        icon: '🏆'
      }
    ];

    return `
      <div class="step-content animate-fadeIn">
        <div class="step-header">
          <h2>What's your fitness level?</h2>
          <p>This helps us create the right workout intensity for you</p>
        </div>
        
        <div class="fitness-levels">
          ${levels.map(level => `
            <div class="fitness-level-card ${this.userData.fitnessLevel === level.value ? 'selected' : ''}"
                 onclick="onboarding.updateUserData('fitnessLevel', '${level.value}')">
              <div class="level-icon">${level.icon}</div>
              <h3>${level.title}</h3>
              <p>${level.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderGoals() {
    const goals = [
      { value: 'weight_loss', label: 'Lose Weight', icon: '⚖️' },
      { value: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
      { value: 'strength', label: 'Get Stronger', icon: '🏋️' },
      { value: 'endurance', label: 'Improve Endurance', icon: '🏃' },
      { value: 'flexibility', label: 'Increase Flexibility', icon: '🧘' },
      { value: 'general_fitness', label: 'General Fitness', icon: '✨' }
    ];

    return `
      <div class="step-content animate-fadeIn">
        <div class="step-header">
          <h2>What are your goals?</h2>
          <p>Select all that apply - we'll tailor your workouts accordingly</p>
        </div>
        
        <div class="goals-grid">
          ${goals.map(goal => `
            <div class="goal-card ${this.userData.goals.includes(goal.value) ? 'selected' : ''}"
                 onclick="onboarding.toggleGoal('${goal.value}')">
              <div class="goal-icon">${goal.icon}</div>
              <span class="goal-label">${goal.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderSchedule() {
    return `
      <div class="step-content animate-fadeIn">
        <div class="step-header">
          <h2>Let's plan your schedule</h2>
          <p>We'll create a workout plan that fits your lifestyle</p>
        </div>
        
        <div class="schedule-options">
          <div class="form-group">
            <label>How many days per week can you work out?</label>
            <div class="days-selector">
              ${[2, 3, 4, 5, 6, 7].map(days => `
                <button class="day-option ${this.userData.schedule.daysPerWeek === days ? 'selected' : ''}"
                        onclick="onboarding.updateSchedule('daysPerWeek', ${days})">
                  ${days}
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="form-group">
            <label>How long are your typical sessions?</label>
            <div class="duration-selector">
              ${[15, 20, 30, 45, 60].map(minutes => `
                <button class="duration-option ${this.userData.schedule.sessionLength === minutes ? 'selected' : ''}"
                        onclick="onboarding.updateSchedule('sessionLength', ${minutes})">
                  ${minutes} min
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="form-group">
            <label>When do you prefer to work out?</label>
            <div class="time-selector">
              ${[
                { value: 'morning', label: 'Morning (6-10 AM)', icon: '🌅' },
                { value: 'afternoon', label: 'Afternoon (12-5 PM)', icon: '☀️' },
                { value: 'evening', label: 'Evening (6-9 PM)', icon: '🌆' }
              ].map(time => `
                <div class="time-option ${this.userData.schedule.preferredTime === time.value ? 'selected' : ''}"
                     onclick="onboarding.updateSchedule('preferredTime', '${time.value}')">
                  <span class="time-icon">${time.icon}</span>
                  <span class="time-label">${time.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateUserData(field, value) {
    this.userData[field] = value;
    this.updateView();
  }

  updateSchedule(field, value) {
    this.userData.schedule[field] = value;
    this.updateView();
  }

  toggleGoal(goal) {
    const index = this.userData.goals.indexOf(goal);
    if (index > -1) {
      this.userData.goals.splice(index, 1);
    } else {
      this.userData.goals.push(goal);
    }
    this.updateView();
  }

  isStepValid() {
    switch (this.currentStep) {
      case 1:
        return this.userData.name.trim() && this.userData.age && this.userData.gender;
      case 2:
        return this.userData.fitnessLevel;
      case 3:
        return this.userData.goals.length > 0;
      case 4:
        return true; // All schedule fields have defaults
      default:
        return false;
    }
  }

  nextStep() {
    if (!this.isStepValid()) return;
    
    if (this.currentStep === this.totalSteps) {
      this.completeOnboarding();
    } else {
      this.currentStep++;
      this.updateView();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateView();
    }
  }

  async completeOnboarding() {
    try {
      // Create user profile with onboarding data
      const currentYear = new Date().getFullYear();
      const yearOfBirth = currentYear - parseInt(this.userData.age);
      
      // Create basic profile first
      await window.userProfile.createProfile(this.userData.name, yearOfBirth);
      
      // Then update with additional onboarding data
      const additionalData = {
        gender: this.userData.gender,
        fitnessLevel: this.userData.fitnessLevel,
        goals: this.userData.goals,
        equipment: this.userData.equipment,
        schedule: this.userData.schedule
      };
      
      await window.userProfile.updateProfile(additionalData);
      
      // Mark onboarding as complete
      await window.userProfile.setOnboardingComplete(true);
      
      // Show success message
      window.ui.showToast('Welcome to HomeMuscleBuilder! Your profile has been created.', 'success');
      
      // Navigate to home
      setTimeout(() => {
        window.router.navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      window.ui.showToast('Error saving your profile. Please try again.', 'error');
    }
  }

  updateView() {
    const content = document.getElementById('main-content');
    if (content) {
      content.innerHTML = this.render();
    }
  }

  // Initialize the page
  init() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = this.render();
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.isStepValid()) {
        this.nextStep();
      } else if (e.key === 'Escape' && this.currentStep > 1) {
        this.previousStep();
      }
    });
  }
}

// Export for global use
window.onboarding = new OnboardingPage();
