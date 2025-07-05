// Exercises Page - Browse and search exercise library
class ExercisesPage {
  constructor() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.exercises = [];
    this.filteredExercises = [];
    this.selectedDifficulty = 'all';
    this.selectedMuscleGroup = 'all';
    this.init();
  }

  async init() {
    this.exercises = await window.exerciseLibrary.getAllExercises();
    this.filteredExercises = [...this.exercises];
  }

  render() {
    return `
      <div class="exercises-page page">
        <div class="page-header">
          <h1>Exercise Library</h1>
          <p>Discover new exercises and build your perfect workout</p>
        </div>
        
        <div class="exercises-filters">
          <div class="search-bar">
            <input type="text" 
                   class="search-input" 
                   placeholder="Search exercises..." 
                   value="${this.searchQuery}"
                   oninput="exercisesPage.handleSearch(this.value)">
            <button class="search-btn">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z"/>
              </svg>
            </button>
          </div>
          
          <div class="filter-chips">
            ${this.renderCategoryChips()}
            ${this.renderMuscleGroupFilter()}
            ${this.renderDifficultyFilter()}
          </div>
        </div>
        
        <div class="exercises-content">
          ${this.renderExerciseGrid()}
        </div>
        
        ${this.renderExerciseModal()}
      </div>
    `;
  }

  renderCategoryChips() {
    const categories = [
      { value: 'all', label: 'All' },
      { value: 'strength', label: 'Strength' },
      { value: 'cardio', label: 'Cardio' },
      { value: 'flexibility', label: 'Flexibility' },
      { value: 'balance', label: 'Balance' }
    ];

    return `
      <div class="filter-group">
        <label class="filter-label">Category:</label>
        <div class="chip-group">
          ${categories.map(category => `
            <button class="chip ${this.currentCategory === category.value ? 'active' : ''}"
                    onclick="exercisesPage.filterByCategory('${category.value}')">
              ${category.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderMuscleGroupFilter() {
    const muscleGroups = [
      { value: 'all', label: 'All Muscles' },
      { value: 'chest', label: 'Chest' },
      { value: 'back', label: 'Back' },
      { value: 'shoulders', label: 'Shoulders' },
      { value: 'arms', label: 'Arms' },
      { value: 'legs', label: 'Legs' },
      { value: 'core', label: 'Core' },
      { value: 'glutes', label: 'Glutes' }
    ];

    return `
      <div class="filter-group">
        <label class="filter-label">Muscle Group:</label>
        <select class="filter-select" onchange="exercisesPage.filterByMuscleGroup(this.value)">
          ${muscleGroups.map(group => `
            <option value="${group.value}" ${this.selectedMuscleGroup === group.value ? 'selected' : ''}>
              ${group.label}
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }

  renderDifficultyFilter() {
    const difficulties = [
      { value: 'all', label: 'All Levels' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ];

    return `
      <div class="filter-group">
        <label class="filter-label">Difficulty:</label>
        <select class="filter-select" onchange="exercisesPage.filterByDifficulty(this.value)">
          ${difficulties.map(difficulty => `
            <option value="${difficulty.value}" ${this.selectedDifficulty === difficulty.value ? 'selected' : ''}>
              ${difficulty.label}
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }

  renderExerciseGrid() {
    if (this.filteredExercises.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No exercises found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button class="btn btn-primary" onclick="exercisesPage.clearFilters()">
            Clear Filters
          </button>
        </div>
      `;
    }

    return `
      <div class="exercise-grid stagger-children">
        ${this.filteredExercises.map(exercise => this.renderExerciseCard(exercise)).join('')}
      </div>
    `;
  }

  renderExerciseCard(exercise) {
    const difficultyColors = {
      beginner: 'var(--success-color)',
      intermediate: 'var(--warning-color)',
      advanced: 'var(--error-color)'
    };

    return `
      <div class="exercise-card clickable" onclick="exercisesPage.showExerciseDetails('${exercise.id}')">
        <div class="exercise-image">
          <img src="${exercise.image || '/assets/images/exercise-placeholder.jpg'}" 
               alt="${exercise.name}" 
               loading="lazy">
          <div class="exercise-difficulty" style="background: ${difficultyColors[exercise.difficulty]}">
            ${exercise.difficulty}
          </div>
        </div>
        
        <div class="exercise-info">
          <h3 class="exercise-name">${exercise.name}</h3>
          <p class="exercise-target">${exercise.primaryMuscles.join(', ')}</p>
          
          <div class="exercise-meta">
            <span class="exercise-duration">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
              ${exercise.duration || '30s'}
            </span>
            
            <span class="exercise-equipment">
              ${exercise.equipment === 'bodyweight' ? '💪' : '🏋️'} 
              ${exercise.equipment}
            </span>
          </div>
          
          <div class="exercise-actions">
            <button class="btn btn-sm btn-secondary" 
                    onclick="event.stopPropagation(); exercisesPage.addToFavorites('${exercise.id}')">
              ❤️ Favorite
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderExerciseModal() {
    return `
      <div id="exerciseModal" class="modal-backdrop" onclick="exercisesPage.closeModal(event)">
        <div class="modal modal-lg" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title" id="modalExerciseName">Exercise Details</h2>
            <button class="modal-close" onclick="exercisesPage.closeModal()">×</button>
          </div>
          
          <div class="modal-body" id="modalExerciseContent">
            <!-- Exercise details will be populated here -->
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="exercisesPage.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="exercisesPage.addToWorkout()">Add to Workout</button>
          </div>
        </div>
      </div>
    `;
  }

  handleSearch(query) {
    this.searchQuery = query;
    this.applyFilters();
  }

  filterByCategory(category) {
    this.currentCategory = category;
    this.applyFilters();
  }

  filterByMuscleGroup(muscleGroup) {
    this.selectedMuscleGroup = muscleGroup;
    this.applyFilters();
  }

  filterByDifficulty(difficulty) {
    this.selectedDifficulty = difficulty;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.exercises];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(query)) ||
        exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === this.currentCategory);
    }

    // Muscle group filter
    if (this.selectedMuscleGroup !== 'all') {
      filtered = filtered.filter(exercise => 
        exercise.primaryMuscles.includes(this.selectedMuscleGroup) ||
        exercise.secondaryMuscles.includes(this.selectedMuscleGroup)
      );
    }

    // Difficulty filter
    if (this.selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty === this.selectedDifficulty);
    }

    this.filteredExercises = filtered;
    this.updateView();
  }

  clearFilters() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.selectedDifficulty = 'all';
    this.selectedMuscleGroup = 'all';
    this.filteredExercises = [...this.exercises];
    this.updateView();
  }

  async showExerciseDetails(exerciseId) {
    const exercise = await window.exerciseLibrary.getExercise(exerciseId);
    if (!exercise) return;

    const modal = document.getElementById('exerciseModal');
    const nameElement = document.getElementById('modalExerciseName');
    const contentElement = document.getElementById('modalExerciseContent');

    nameElement.textContent = exercise.name;
    contentElement.innerHTML = this.renderExerciseDetails(exercise);

    modal.classList.add('show');
    this.currentExercise = exercise;
  }

  renderExerciseDetails(exercise) {
    return `
      <div class="exercise-details">
        <div class="exercise-media">
          <img src="${exercise.image || '/assets/images/exercise-placeholder.jpg'}" 
               alt="${exercise.name}" class="exercise-detail-image">
          ${exercise.video ? `
            <video controls class="exercise-video" poster="${exercise.image}">
              <source src="${exercise.video}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          ` : ''}
        </div>
        
        <div class="exercise-info-detailed">
          <div class="exercise-badges">
            <span class="badge badge-${exercise.difficulty}">${exercise.difficulty}</span>
            <span class="badge badge-category">${exercise.category}</span>
            <span class="badge badge-equipment">${exercise.equipment}</span>
          </div>
          
          <p class="exercise-description">${exercise.description}</p>
          
          <div class="muscle-groups">
            <div class="muscle-group-section">
              <h4>Primary Muscles</h4>
              <div class="muscle-tags">
                ${exercise.primaryMuscles.map(muscle => `<span class="muscle-tag primary">${muscle}</span>`).join('')}
              </div>
            </div>
            
            ${exercise.secondaryMuscles.length > 0 ? `
              <div class="muscle-group-section">
                <h4>Secondary Muscles</h4>
                <div class="muscle-tags">
                  ${exercise.secondaryMuscles.map(muscle => `<span class="muscle-tag secondary">${muscle}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="exercise-instructions">
            <h4>Instructions</h4>
            <ol class="instruction-list">
              ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
          
          ${exercise.tips && exercise.tips.length > 0 ? `
            <div class="exercise-tips">
              <h4>Tips</h4>
              <ul class="tips-list">
                ${exercise.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${exercise.variations && exercise.variations.length > 0 ? `
            <div class="exercise-variations">
              <h4>Variations</h4>
              <div class="variation-cards">
                ${exercise.variations.map(variation => `
                  <div class="variation-card">
                    <h5>${variation.name}</h5>
                    <p>${variation.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.getElementById('exerciseModal');
    modal.classList.remove('show');
    this.currentExercise = null;
  }

  async addToFavorites(exerciseId) {
    try {
      await window.userProfile.addFavoriteExercise(exerciseId);
      window.ui.showToast('Exercise added to favorites!', 'success');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      window.ui.showToast('Error adding to favorites', 'error');
    }
  }

  addToWorkout() {
    if (!this.currentExercise) return;
    
    // For now, we'll just show a success message
    // In a full implementation, this would add to a workout being created
    window.ui.showToast(`${this.currentExercise.name} added to workout!`, 'success');
    this.closeModal();
  }

  updateView() {
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = this.render();
    }
  }

  // Initialize the page
  async mount() {
    await this.init();
    this.updateView();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      } else if (e.key === '/' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
    });
  }
}

// Export for global use
window.exercisesPage = new ExercisesPage();
