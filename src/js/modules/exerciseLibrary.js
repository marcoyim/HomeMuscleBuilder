// Exercise Library Management Module
class ExerciseLibrary {
    constructor() {
        this.exercises = [];
        this.muscleGroups = [];
        this.isLoaded = false;
    }

    async init() {
        await this.loadExerciseData();
        this.isLoaded = true;
    }

    async loadExerciseData() {
        try {
            // In a real app, this could load from a JSON file or API
            // For now, we'll use hardcoded exercise data
            this.exercises = this.getStaticExerciseData();
            this.muscleGroups = this.extractMuscleGroups();
            
            console.log('✅ Exercise library loaded:', this.exercises.length, 'exercises');
        } catch (error) {
            console.error('Error loading exercise data:', error);
            // Fallback to basic exercises if loading fails
            this.exercises = this.getFallbackExercises();
            this.muscleGroups = this.extractMuscleGroups();
        }
    }

    getStaticExerciseData() {
        return [
            // Chest Exercises
            {
                id: 'push-up-001',
                name: 'Standard Push-Up',
                muscleGroup: 'chest',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Classic upper body exercise targeting chest, shoulders, and triceps.',
                instructions: [
                    'Start in a plank position with hands slightly wider than shoulder-width',
                    'Keep your body in a straight line from head to heels',
                    'Lower your chest toward the ground by bending your elbows',
                    'Push back up to the starting position',
                    'Maintain core engagement throughout the movement'
                ],
                tips: [
                    'Keep your elbows at a 45-degree angle to your body',
                    'Don\'t let your hips sag or pike up',
                    'Focus on controlled movement, not speed'
                ],
                variations: [
                    'Knee Push-Ups (easier)',
                    'Incline Push-Ups (easier)',
                    'Diamond Push-Ups (harder)',
                    'Decline Push-Ups (harder)'
                ],
                image: 'images/exercises/push-up.gif',
                thumbnail: 'images/exercises/thumbs/push-up.jpg',
                targetMuscles: ['chest', 'triceps', 'shoulders', 'core'],
                calories: 8 // per minute estimate
            },
            {
                id: 'push-up-002',
                name: 'Diamond Push-Up',
                muscleGroup: 'chest',
                difficulty: 'intermediate',
                equipment: 'bodyweight',
                description: 'Advanced push-up variation focusing more on triceps and inner chest.',
                instructions: [
                    'Form a diamond shape with your hands by touching thumbs and index fingers',
                    'Position hands directly under your chest',
                    'Perform push-up movement keeping elbows close to body',
                    'Lower until chest nearly touches hands',
                    'Push back up maintaining diamond hand position'
                ],
                tips: [
                    'Keep elbows tight to your sides',
                    'This variation is more challenging than standard push-ups',
                    'Start with fewer reps and build up gradually'
                ],
                variations: [
                    'Knee Diamond Push-Ups (easier)',
                    'Elevated Diamond Push-Ups (harder)'
                ],
                image: 'images/exercises/diamond-push-up.gif',
                thumbnail: 'images/exercises/thumbs/diamond-push-up.jpg',
                targetMuscles: ['triceps', 'chest', 'shoulders'],
                calories: 10
            },

            // Back Exercises
            {
                id: 'pull-up-001',
                name: 'Pull-Up',
                muscleGroup: 'back',
                difficulty: 'intermediate',
                equipment: 'pull-up-bar',
                description: 'Fundamental pulling exercise for building back and arm strength.',
                instructions: [
                    'Hang from a pull-up bar with palms facing away',
                    'Grip slightly wider than shoulder-width',
                    'Pull your body up until chin clears the bar',
                    'Lower yourself with control to full arm extension',
                    'Maintain slight shoulder blade engagement at bottom'
                ],
                tips: [
                    'Focus on pulling with your back muscles, not just arms',
                    'Keep core engaged to prevent swinging',
                    'Use full range of motion for maximum benefit'
                ],
                variations: [
                    'Assisted Pull-Ups (easier)',
                    'Chin-Ups (slightly easier)',
                    'Wide-Grip Pull-Ups (harder)',
                    'Weighted Pull-Ups (harder)'
                ],
                image: 'images/exercises/pull-up.gif',
                thumbnail: 'images/exercises/thumbs/pull-up.jpg',
                targetMuscles: ['lats', 'biceps', 'rear-delts', 'rhomboids'],
                calories: 12
            },

            // Leg Exercises
            {
                id: 'squat-001',
                name: 'Bodyweight Squat',
                muscleGroup: 'legs',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings.',
                instructions: [
                    'Stand with feet shoulder-width apart',
                    'Lower your body by sitting back and down',
                    'Keep chest up and knees tracking over toes',
                    'Descend until thighs are parallel to ground',
                    'Drive through heels to return to standing'
                ],
                tips: [
                    'Keep weight in your heels, not toes',
                    'Don\'t let knees cave inward',
                    'Maintain natural arch in your lower back'
                ],
                variations: [
                    'Chair Squats (easier)',
                    'Jump Squats (harder)',
                    'Single-Leg Squats (harder)',
                    'Sumo Squats (different emphasis)'
                ],
                image: 'images/exercises/squat.gif',
                thumbnail: 'images/exercises/thumbs/squat.jpg',
                targetMuscles: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
                calories: 8
            },
            {
                id: 'lunge-001',
                name: 'Forward Lunge',
                muscleGroup: 'legs',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Unilateral leg exercise that improves balance and leg strength.',
                instructions: [
                    'Stand upright with feet hip-width apart',
                    'Step forward with one leg into a lunge position',
                    'Lower hips until both knees are bent at 90 degrees',
                    'Push back to starting position',
                    'Repeat on opposite leg'
                ],
                tips: [
                    'Keep front knee over ankle, not pushed forward',
                    'Keep torso upright throughout movement',
                    'Control the descent, don\'t drop down'
                ],
                variations: [
                    'Reverse Lunges (easier)',
                    'Walking Lunges (harder)',
                    'Jump Lunges (harder)',
                    'Lateral Lunges (different plane)'
                ],
                image: 'images/exercises/lunge.gif',
                thumbnail: 'images/exercises/thumbs/lunge.jpg',
                targetMuscles: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
                calories: 7
            },

            // Core Exercises
            {
                id: 'plank-001',
                name: 'Plank',
                muscleGroup: 'core',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Isometric core exercise that builds stability and endurance.',
                instructions: [
                    'Start in a push-up position',
                    'Lower to forearms, keeping elbows under shoulders',
                    'Keep body in straight line from head to heels',
                    'Engage core and hold position',
                    'Breathe normally while maintaining position'
                ],
                tips: [
                    'Don\'t let hips sag or pike up',
                    'Keep head in neutral position',
                    'Start with shorter holds and build up time'
                ],
                variations: [
                    'Knee Plank (easier)',
                    'Side Plank (different emphasis)',
                    'Plank with Leg Lifts (harder)',
                    'Plank Jacks (harder)'
                ],
                image: 'images/exercises/plank.gif',
                thumbnail: 'images/exercises/thumbs/plank.jpg',
                targetMuscles: ['core', 'shoulders', 'glutes'],
                calories: 5
            },

            // Shoulder Exercises
            {
                id: 'pike-push-up-001',
                name: 'Pike Push-Up',
                muscleGroup: 'shoulders',
                difficulty: 'intermediate',
                equipment: 'bodyweight',
                description: 'Bodyweight exercise targeting shoulders and preparing for handstand push-ups.',
                instructions: [
                    'Start in downward dog position',
                    'Walk feet closer to hands to increase angle',
                    'Lower head toward ground by bending elbows',
                    'Push back up to starting position',
                    'Keep hips high throughout movement'
                ],
                tips: [
                    'Keep more weight on your hands than feet',
                    'Focus on shoulder mobility and strength',
                    'Progress gradually to avoid shoulder strain'
                ],
                variations: [
                    'Elevated Pike Push-Ups (harder)',
                    'Wall Walks (progression)',
                    'Handstand Push-Ups (advanced)'
                ],
                image: 'images/exercises/pike-push-up.gif',
                thumbnail: 'images/exercises/thumbs/pike-push-up.jpg',
                targetMuscles: ['shoulders', 'triceps', 'upper-chest'],
                calories: 9
            },

            // Arms Exercises
            {
                id: 'tricep-dips-001',
                name: 'Tricep Dips',
                muscleGroup: 'arms',
                difficulty: 'beginner',
                equipment: 'chair',
                description: 'Bodyweight exercise focusing on tricep strength using a chair or bench.',
                instructions: [
                    'Sit on edge of chair with hands beside hips',
                    'Slide forward off chair, supporting weight with arms',
                    'Lower body by bending elbows backward',
                    'Push back up to starting position',
                    'Keep elbows close to body'
                ],
                tips: [
                    'Don\'t go too low to avoid shoulder strain',
                    'Keep shoulders down and back',
                    'Use legs to assist if too difficult'
                ],
                variations: [
                    'Bent-Knee Dips (easier)',
                    'Straight-Leg Dips (harder)',
                    'Elevated Dips (harder)'
                ],
                image: 'images/exercises/tricep-dips.gif',
                thumbnail: 'images/exercises/thumbs/tricep-dips.jpg',
                targetMuscles: ['triceps', 'shoulders', 'chest'],
                calories: 6
            },

            // Cardio Exercises
            {
                id: 'burpee-001',
                name: 'Burpee',
                muscleGroup: 'cardio',
                difficulty: 'intermediate',
                equipment: 'bodyweight',
                description: 'Full-body cardio exercise that combines strength and endurance.',
                instructions: [
                    'Start standing, then squat down placing hands on floor',
                    'Jump feet back into plank position',
                    'Perform push-up (optional)',
                    'Jump feet back toward hands',
                    'Explode up with arms overhead'
                ],
                tips: [
                    'Land softly to protect joints',
                    'Pace yourself - this is very demanding',
                    'Focus on form over speed'
                ],
                variations: [
                    'Step-Back Burpees (easier)',
                    'Burpee Box Jumps (harder)',
                    'Single-Arm Burpees (harder)'
                ],
                image: 'images/exercises/burpee.gif',
                thumbnail: 'images/exercises/thumbs/burpee.jpg',
                targetMuscles: ['full-body', 'cardiovascular'],
                calories: 15
            },
            {
                id: 'jumping-jacks-001',
                name: 'Jumping Jacks',
                muscleGroup: 'cardio',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Classic cardio exercise that raises heart rate and warms up the body.',
                instructions: [
                    'Start standing with feet together, arms at sides',
                    'Jump while spreading feet wide and raising arms overhead',
                    'Jump back to starting position',
                    'Maintain steady rhythm',
                    'Land softly on balls of feet'
                ],
                tips: [
                    'Keep core engaged throughout',
                    'Land softly to protect joints',
                    'Breathe rhythmically with movement'
                ],
                variations: [
                    'Step Jacks (easier)',
                    'Star Jumps (same movement)',
                    'Cross Jacks (harder)'
                ],
                image: 'images/exercises/jumping-jacks.gif',
                thumbnail: 'images/exercises/thumbs/jumping-jacks.jpg',
                targetMuscles: ['cardiovascular', 'legs', 'shoulders'],
                calories: 8
            }
        ];
    }

    getFallbackExercises() {
        return [
            {
                id: 'basic-push-up',
                name: 'Push-Up',
                muscleGroup: 'chest',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Basic push-up exercise',
                instructions: ['Perform standard push-up movement'],
                tips: ['Keep form strict'],
                variations: [],
                image: '',
                thumbnail: '',
                targetMuscles: ['chest'],
                calories: 8
            },
            {
                id: 'basic-squat',
                name: 'Squat',
                muscleGroup: 'legs',
                difficulty: 'beginner',
                equipment: 'bodyweight',
                description: 'Basic squat exercise',
                instructions: ['Perform standard squat movement'],
                tips: ['Keep knees aligned'],
                variations: [],
                image: '',
                thumbnail: '',
                targetMuscles: ['legs'],
                calories: 8
            }
        ];
    }

    extractMuscleGroups() {
        const groups = [...new Set(this.exercises.map(ex => ex.muscleGroup))];
        return groups.map(group => ({
            id: group,
            name: this.formatMuscleGroupName(group),
            count: this.exercises.filter(ex => ex.muscleGroup === group).length
        }));
    }

    formatMuscleGroupName(group) {
        const names = {
            'chest': 'Chest',
            'back': 'Back',
            'legs': 'Legs',
            'shoulders': 'Shoulders',
            'arms': 'Arms',
            'core': 'Core',
            'cardio': 'Cardio'
        };
        return names[group] || group.charAt(0).toUpperCase() + group.slice(1);
    }

    getAllExercises() {
        return [...this.exercises];
    }

    getExerciseById(id) {
        return this.exercises.find(exercise => exercise.id === id);
    }

    getExercisesByMuscleGroup(muscleGroup) {
        if (muscleGroup === 'all' || !muscleGroup) {
            return this.getAllExercises();
        }
        return this.exercises.filter(exercise => exercise.muscleGroup === muscleGroup);
    }

    getExercisesByDifficulty(difficulty) {
        return this.exercises.filter(exercise => exercise.difficulty === difficulty);
    }

    getExercisesByEquipment(equipment) {
        return this.exercises.filter(exercise => exercise.equipment === equipment);
    }

    searchExercises(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return this.getAllExercises();

        return this.exercises.filter(exercise => {
            return (
                exercise.name.toLowerCase().includes(searchTerm) ||
                exercise.description.toLowerCase().includes(searchTerm) ||
                exercise.muscleGroup.toLowerCase().includes(searchTerm) ||
                exercise.targetMuscles.some(muscle => 
                    muscle.toLowerCase().includes(searchTerm)
                )
            );
        });
    }

    filterExercises(filters) {
        let results = this.getAllExercises();

        if (filters.muscleGroup && filters.muscleGroup !== 'all') {
            results = results.filter(ex => ex.muscleGroup === filters.muscleGroup);
        }

        if (filters.difficulty) {
            results = results.filter(ex => ex.difficulty === filters.difficulty);
        }

        if (filters.equipment) {
            results = results.filter(ex => ex.equipment === filters.equipment);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            results = results.filter(ex => 
                ex.name.toLowerCase().includes(searchTerm) ||
                ex.description.toLowerCase().includes(searchTerm)
            );
        }

        return results;
    }

    getMuscleGroups() {
        return [...this.muscleGroups];
    }

    getDifficultyLevels() {
        return [
            { id: 'beginner', name: 'Beginner', description: 'New to exercise' },
            { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
            { id: 'advanced', name: 'Advanced', description: 'Very experienced' }
        ];
    }

    getEquipmentTypes() {
        const equipment = [...new Set(this.exercises.map(ex => ex.equipment))];
        return equipment.map(eq => ({
            id: eq,
            name: this.formatEquipmentName(eq)
        }));
    }

    formatEquipmentName(equipment) {
        const names = {
            'bodyweight': 'Bodyweight Only',
            'dumbbells': 'Dumbbells',
            'resistance-bands': 'Resistance Bands',
            'pull-up-bar': 'Pull-up Bar',
            'chair': 'Chair/Bench'
        };
        return names[equipment] || equipment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getRandomExercises(count = 5, filters = {}) {
        const filtered = this.filterExercises(filters);
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getRecommendedExercises(ageCategory, count = 6) {
        // Recommend exercises based on age category
        let recommendations = [];

        switch (ageCategory?.id) {
            case 'peak-builder':
                // High-intensity, compound movements
                recommendations = this.exercises.filter(ex => 
                    ['intermediate', 'advanced'].includes(ex.difficulty) ||
                    ex.muscleGroup === 'cardio'
                );
                break;
                
            case 'smart-athlete':
                // Balanced approach, focus on quality
                recommendations = this.exercises.filter(ex => 
                    ex.difficulty !== 'advanced' && 
                    ex.muscleGroup !== 'cardio'
                );
                break;
                
            case 'health-guardian':
                // Joint-friendly, functional movements
                recommendations = this.exercises.filter(ex => 
                    ex.difficulty === 'beginner' || 
                    ['core', 'back'].includes(ex.muscleGroup)
                );
                break;
                
            default:
                recommendations = this.getAllExercises();
        }

        // Shuffle and return requested count
        const shuffled = [...recommendations].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    addFavoriteExercise(exerciseId) {
        // This would typically sync with backend in Phase 2
        const favorites = this.getFavoriteExercises();
        if (!favorites.includes(exerciseId)) {
            favorites.push(exerciseId);
            localStorage.setItem('hmb_favorite_exercises', JSON.stringify(favorites));
        }
    }

    removeFavoriteExercise(exerciseId) {
        const favorites = this.getFavoriteExercises();
        const updated = favorites.filter(id => id !== exerciseId);
        localStorage.setItem('hmb_favorite_exercises', JSON.stringify(updated));
    }

    getFavoriteExercises() {
        try {
            const stored = localStorage.getItem('hmb_favorite_exercises');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    isFavorite(exerciseId) {
        return this.getFavoriteExercises().includes(exerciseId);
    }

    getStats() {
        return {
            totalExercises: this.exercises.length,
            muscleGroups: this.muscleGroups.length,
            difficulties: this.getDifficultyLevels().length,
            equipment: this.getEquipmentTypes().length
        };
    }
}

// Initialize global instance
window.exerciseLibrary = new ExerciseLibrary();
