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

---

## 🚀 Getting Started

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
npm install
npx expo start
```

- Press `w` to open web (`http://localhost:8081`)
- Or scan QR in Expo Go for iOS/Android

---

## 🔐 Create a Test Profile (recommended)

Use the provided seed command to create/update a reusable login account:

```bash
cd backend
npm run seed:test-user
```

Optional environment overrides:

- `TEST_USER_EMAIL` (default: `test@localexperience.app`)
- `TEST_USER_PASSWORD` (default: `TestPass123!`)
- `TEST_USER_NAME` (default: `Test Explorer`)

You can also tap **Use test profile** on the login screen to autofill the default credentials.

---

## 📈 Monitoring

- Crash Monitoring: Sentry integrated (frontend + backend)

## 📄 License

MIT License © Jagr Hofstedt

Built with ❤️ for outdoor adventurers everywhere.
