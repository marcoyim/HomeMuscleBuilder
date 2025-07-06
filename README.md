# Home Muscle Builder

A progressive web application (PWA) for personalized home-based muscle building workouts.

## 🎯 Project Overview

Home Muscle Builder is designed to provide scientific, safe, and effective workout plans tailored to users' age groups, with reliable push notifications to ensure workout consistency. The app works completely offline after the initial load and can be installed on any device.

## 🚀 Features

### Phase 1 (MVP - Current)
- ✅ **User Profile Management**: Nickname and birth year input for personalization
- ✅ **Exercise Library**: Comprehensive collection of home-based exercises with descriptions
- ✅ **Workout Logging**: Manual logging of daily exercises with sets and reps tracking
- ✅ **PWA Core Features**: Offline-first functionality, installable app, service worker caching
- ✅ **Responsive Design**: Works on all device sizes

### Phase 2 (Planned)
- 🔔 **Push Notifications**: Daily workout reminders
- ☁️ **Azure Backend**: API integration for data synchronization
- 💾 **Cloud Storage**: Azure Cosmos DB for user data backup

### Phase 3 (Planned)
- 🧠 **Smart Personalization**: Age-based workout plan generation
- 📊 **Progress Tracking**: Advanced analytics and achievement system
- 🏆 **Motivation Features**: Streak tracking and badges

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA**: Service Workers, Web App Manifest
- **Backend**: Azure Functions (Node.js) - *Phase 2*
- **Database**: Azure Cosmos DB - *Phase 2*
- **Hosting**: Azure Static Web Apps
- **Version Control**: Git & GitHub

## 🏗️ Project Structure

```
HomeMuscleBuilder/
├── src/                    # Frontend source files
│   ├── index.html         # Main HTML file
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker
│   ├── css/
│   │   └── main.css      # Main stylesheet
│   ├── js/
│   │   └── app.js        # Main application logic
│   ├── images/           # App images and screenshots
│   └── icons/            # PWA icons (various sizes)
├── api/                   # Azure Functions (Phase 2)
├── .planning/            # Project documentation
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Web browser with service worker support
- Local web server for development (e.g., Live Server VS Code extension)

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/marcoyim/HomeMuscleBuilder.git
   cd HomeMuscleBuilder
   ```

2. Open in VS Code and install recommended extensions:
   - Live Server
   - Azure Functions (for Phase 2)

3. Start development server:
   - Right-click on `src/index.html`
   - Select "Open with Live Server"

4. Open your browser and navigate to the provided local server URL

### Building for Production
The app is designed for Azure Static Web Apps deployment. Simply push to the main branch to trigger automatic deployment.

## 📱 PWA Installation

The app can be installed on any device:
1. Visit the app in a supported browser
2. Look for the "Install" prompt or use browser's install option
3. The app will be added to your home screen/app list

## 🎮 Usage

### Creating Your Profile
1. Navigate to the "Profile" tab
2. Enter your nickname and year of birth
3. Select your fitness level
4. Save your profile

### Logging Workouts
1. Go to the "Workouts" tab
2. Click "Start New Workout"
3. Add exercises, sets, and reps
4. Save your workout

### Browsing Exercises
1. Visit the "Exercises" tab
2. Browse by muscle group or search by name
3. View exercise descriptions and instructions

## 🔄 Offline Functionality

The app works completely offline after the first visit:
- All core functionality available offline
- Exercise library cached for offline access
- User data stored locally
- Workout logs maintained locally

## 🧪 Age-Based Recommendations (Phase 3)

The app will provide personalized workout plans based on age groups:
- **Ages 20-30 ("Peak Builder")**: High-volume, high-frequency plans
- **Ages 31-39 ("Smart Athlete")**: Quality-focused with recovery emphasis  
- **Ages 40+ ("Health Guardian")**: Joint-friendly, functional movements

## 🔒 Security & Privacy

- No user data is transmitted (Phase 1)
- All data stored locally in browser
- HTTPS enforced for all connections
- No tracking or analytics

## 🤝 Contributing

This is currently a personal project, but contributions and feedback are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📋 Development Checklist

See [Development Checklist](.planning/development-checklist.md) for detailed development progress and tasks.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues, please create a GitHub issue or contact the development team.

## 🚀 Roadmap

- [x] **Phase 1**: MVP with offline PWA functionality
- [ ] **Phase 2**: Backend integration and push notifications
- [ ] **Phase 3**: Smart personalization and advanced features
- [ ] **Phase 4**: Social features and community integration

---

**Built with ❤️ for home fitness enthusiasts**
