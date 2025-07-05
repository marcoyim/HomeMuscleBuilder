# HomeMuscleBuilder - Progressive Web App

A lightweight, fast, and highly personalized PWA for home-based muscle building, delivering scientific and effective workout plans tailored to user age groups.

## 🎯 Project Overview

**Target Audience**: Men aged 20 to 45+ seeking muscle-building through home workouts  
**Platform**: Progressive Web App (PWA)  
**Architecture**: Azure Static Web Apps  

## 🚀 Features

### Phase 1 (MVP - v1.0) ✅
- **Offline-First**: Complete functionality without internet connection
- **User Profiles**: Personalized profiles with age-based categorization
- **Exercise Library**: Comprehensive home workout exercises with GIFs
- **Workout Logging**: Manual exercise tracking with calendar view
- **PWA Features**: Installable app with offline capability

### Phase 2 (v1.5) 🔄
- **Push Notifications**: Daily workout reminders
- **Backend Integration**: Azure Functions + Cosmos DB
- **Subscription Management**: Reliable notification delivery

### Phase 3 (v2.0) 📋
- **Smart Plans**: Age-based workout plan generation
  - 20-30: "Peak Builder" (High volume/frequency)
  - 31-39: "Smart Athlete" (Quality/recovery focused)  
  - 40+: "Health Guardian" (Joint-friendly/functional)
- **Advanced Analytics**: Progress tracking and insights

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Azure Functions (Node.js)
- **Database**: Azure Cosmos DB
- **Deployment**: Azure Static Web Apps
- **Development**: Visual Studio Code

## 📁 Project Structure

```
HomeMuscleBuilder/
├── src/                    # Frontend source code
│   ├── index.html         # Main app entry point
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   ├── images/            # App images and icons
│   └── data/              # Static exercise data
├── api/                   # Azure Functions backend
│   ├── subscribe/         # Push notification subscription
│   ├── send-push/         # Daily notification sender
│   └── generate-plan/     # Workout plan generator
├── .planning/             # Project documentation
└── staticwebapp.config.json
```

## 🔧 Development Setup

1. **Prerequisites**:
   - Node.js (v16+)
   - Azure Functions Core Tools
   - Git

2. **Installation**:
   ```bash
   npm install
   ```

3. **Local Development**:
   ```bash
   npm run dev
   ```

4. **Frontend Only**:
   ```bash
   npm start
   ```

## 🚀 Deployment

Automated deployment via GitHub Actions to Azure Static Web Apps:
- Push to `main` branch triggers build and deploy
- Frontend and backend deployed simultaneously
- Environment secrets managed via Azure Portal

## 🔒 Security

- No secrets in repository (local.settings.json ignored)
- HTTPS-only communication
- Input validation and sanitization
- Rate limiting on APIs

## 📱 PWA Features

- **Offline Support**: Service Worker caching
- **Installable**: Add to Home Screen
- **Responsive**: Mobile-first design
- **Performance**: <1.5s First Contentful Paint

## 🎨 Design System

- **Primary**: #FF6B35 (Energetic Orange)
- **Secondary**: #2C3E50 (Dark Navy)  
- **Accent**: #27AE60 (Success Green)
- **Typography**: System fonts for performance

## 📊 Age Categories

- **Peak Builder (20-30)**: High-volume, high-frequency plans
- **Smart Athlete (31-39)**: Quality and recovery focused plans
- **Health Guardian (40+)**: Joint-friendly, functional plans

## 🤝 Contributing

1. Review planning documents in `.planning/`
2. Follow coding standards in `ui-spec.md`
3. Test thoroughly before committing
4. Ensure security guidelines compliance

## 📄 License

MIT License - See LICENSE file for details

---

*Building strength, one workout at a time.* 💪
