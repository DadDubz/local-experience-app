# 🌎 Local Experience App

A mobile-first outdoor exploration app — discover public lands, trails, fishing spots, weather, guides, and local outdoor shops — all in one platform.

Built with:

- **Frontend**: React Native (Expo SDK 52)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Caching**: Redis Cloud
- **Hosting**: Web + Mobile ready (Android/iOS)
- **Monitoring**: Sentry

---

## 📂 Project Structure

/frontend # React Native app (Expo)
/backend # Express API server
/assets # Global assets (favicon, splash screen, logos)
/docs # Documentation and API references
/nginx # Nginx configs (optional for production)
/scripts # Deployment & build scripts
/tests # Unit and integration tests
/workflows # GitHub Actions (CI/CD workflows)

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```bash

Server runs at <http://localhost:5000>

```bash

Connects to MongoDB Atlas and Redis Cloud

```bash
cd frontend
npm install
npx expo start

Opens Expo Go (scan QR to test on Android/iOS)

Or press w to open Web version on [http://localhost:8081](http://localhost:8081)

🔧 Environment Variables

Connects to MongoDB Atlas and Redis Cloud
Opens Expo Go (scan QR to test on Android/iOS)

Or press w to open Web version on <http://localhost:8081>
App Icon, Splash Screen, Adaptive Icons → /frontend/src/assets/

Web Favicon → /assets/favicon.jpeg
Copy
Edit
eas build --platform android
eas build --platform ios
Web Deployment:

Opens Expo Go (scan QR to test on Android/iOS)

Or press w to open Web version on <http://localhost:8081>

          ```

App Icon, Splash Screen, Adaptive Icons → /frontend/src/assets/

Web Favicon → /assets/favicon.jpeg

📈 Monitoring
Crash Monitoring: Sentry integrated (frontend + backend)

```

App Icon, Splash Screen, Adaptive Icons → /frontend/src/assets/

Web Favicon → /assets/favicon.jpeg
Copy
Edit
eas build --platform android
eas build --platform ios
Web Deployment:

Deploy Expo Web to Vercel, Netlify, or your hosting provider.

📄 License
MIT License © Jagr Hofstedt

Built with ❤️ for outdoor adventurers everywhere.

yaml
Copy
Edit

---

Built with ❤️ for outdoor adventurers everywhere.
