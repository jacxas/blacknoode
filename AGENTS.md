# Base44 Development Notes

## Project Overview
BLACKNODE — an "Autonomous AI Browser Platform" built with Vite + React 19 + TypeScript.
Features: VPN server management, AI assistant (Gemini), crypto-mining dashboard, admin panel.

## Stack
- **Frontend**: Vite 6 (dev server on port 3000, root: `src/`), React 19, Tailwind CSS v4, Motion (framer-motion)
- **Backend**: Firebase (Firestore + Google Auth) — config is hardcoded in `firebase-applet-config.json`, no server-side backend
- **AI**: Google Gemini via `@google/genai` — requires `GEMINI_API_KEY` env var (injected at build time via Vite `define`)
- **Desktop**: Electron wrapper in `electron/` (not used in web preview)

## Running the app
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Vite dev server with HMR, bind-mounted source at `/app`
- `npm ci` runs on container start; deps cached in a named volume
- Healthcheck: `GET /` via node fetch

## Environment / Secrets
- `GEMINI_API_KEY` — Google Gemini API key. Required for AI features (summarization, insights). The app boots without it but AI calls will fail. Obtain from https://aistudio.google.com/apikey
- Firebase config (apiKey, projectId, etc.) is hardcoded in `firebase-applet-config.json` — no env var needed
- `APP_URL` is referenced in `.env.example` but not used in code

## Key files
- `src/App.tsx` — main app with auth gate (Google sign-in), tab routing, VPN/AI/mining dashboards
- `src/lib/firebase.ts` — Firebase init (uses hardcoded config from `firebase-applet-config.json`)
- `src/services/geminiService.ts` — Gemini AI calls (summarize, insights)
- `vite.config.ts` — Vite config; `define` injects `GEMINI_API_KEY` into client code at build time
- `firebase-blueprint.json` — Firestore schema definitions (BrowsingSession, VPNServer, AIPreference)

## Notes
- The app requires Google sign-in (Firebase Auth popup) to access the dashboard
- Firestore rules in `firestore.rules` control access
- VPN server data is seeded to Firestore on first login
