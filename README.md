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

/frontend # React Native app (Expo) /backend # Express API server /assets # Global assets (favicon, splash screen, logos) /docs # Documentation and API references /nginx # Nginx configs (optional for production) /scripts # Deployment & build scripts /tests # Unit and integration tests /workflows # GitHub Actions (CI/CD workflows)

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
Server runs at http://localhost:5000

Connects to MongoDB Atlas and Redis Cloud

2. Start Frontend App
bash
Copy
Edit
cd frontend
npm install
npx expo start
Opens Expo Go (scan QR to test on Android/iOS)

Or press w to open Web version on http://localhost:8081

🔧 Environment Variables
Create a .env file at the root and backend:

bash
Copy
Edit
# Global
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
SENTRY_DSN=your_sentry_project_dsn
🖼 Assets
App Icon, Splash Screen, Adaptive Icons → /frontend/src/assets/

Web Favicon → /assets/favicon.jpeg

📈 Monitoring
Crash Monitoring: Sentry integrated (frontend + backend)

Caching/Performance: Redis used for public land and trail caching

🧪 Testing
Run all unit/integration tests:

bash
Copy
Edit
npm run test
Test files are inside __tests__/

🏗 Deployment
Mobile Builds:

Use EAS Build:

bash
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






