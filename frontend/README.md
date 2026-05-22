# Endline Frontend (Next.js)

Modern, responsive web application for focused learning. Provides a custom YouTube player, Pomodoro timer, note‑taking, search, and a personal library – all with a clean, distraction‑free interface.

## Features

- User authentication (login / register) with JWT (access token in memory, refresh token in HTTP‑only cookie)
- Custom YouTube player – no branding, no related videos, full controls (play, pause, seek, volume, fullscreen)
- Pomodoro timer – work/break cycles, editable durations, full‑screen focus mode, persistent state (IndexedDB)
- Background sounds – select from a large collection of YouTube recitations (shuffled order), hidden player, progress bar, volume control
- Note taking – save, view, delete notes per video / session (IndexedDB)
- Video library – save favourite videos to your personal collection (backend + local)
- Search – full‑text search over a built‑in catalogue (`videos.json`) with random result order
- Responsive, RTL layout – full Arabic support
- Dark / light theme – via `next‑themes`

## Tech Stack

| Category          | Technology                                      |
|-------------------|-------------------------------------------------|
| Framework         | Next.js 16 (App Router, Turbopack)              |
| Language          | TypeScript                                      |
| Styling           | Tailwind CSS, shadcn/ui components              |
| Animation         | Framer Motion                                   |
| YouTube player    | react‑youtube (custom wrapper)                  |
| Icons             | Hugeicons React                                 |
| State & storage   | React Context (auth), IndexedDB (local data)    |
| HTTP client       | Fetch API with automatic token refresh          |
| Authentication    | JWT (access + refresh)                          |

## Project Structure

```
.
├── app
│   ├── app
│   │   ├── dashboard          # main dashboard page
│   │   ├── lessons
│   │   │   ├── search         # search page
│   │   │   ├── watch          # video player page
│   │   │   └── library        # user's saved videos
│   │   └── pomodoro           # pomodoro timer page
│   ├── auth                   # login / register page
│   └── layout.tsx             # root layout (RTL, theme provider)
├── components
│   ├── ui                     # shadcn/ui components
│   ├── auth                   # login / register forms
│   ├── dashboard
│   │   ├── dashboard-header.tsx
│   │   └── tools-menu.tsx
│   ├── pomodoro
│   │   ├── pomodoro-timer.tsx
│   │   ├── sound-player.tsx
│   │   ├── notes.tsx
│   │   └── sounds.ts          # list of YouTube recitations
│   └── video
│       ├── custom-youtube-player.tsx
│       └── video-controls.tsx
├── contexts
│   └── AuthContext.tsx        # global auth state
├── lib
│   ├── api.ts                 # authenticated API client
│   ├── indexeddb.ts           # IndexedDB helpers
│   └── youtube.ts             # extract YouTube ID
├── hooks
│   ├── useVideoPlayer.ts
│   └── usePomodoro.ts
├── public                     # static assets
├── .env.local
├── tailwind.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation



2. **Install dependencies**

```bash
npm install
```

3. **Environment variables**

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

If you use Next.js rewrites to proxy API requests (avoiding CORS), you can set `NEXT_PUBLIC_API_URL=/api` and configure `next.config.js`:

```js
import type { NextConfig } from "next";

const nextConfig  : NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
    ];
  },
};
export default nextConfig;

```

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key Implementation Details

### Authentication

- Access token stored in `localStorage` (persists across reloads) and in memory.
- Refresh token stored in HTTP‑only cookie (automatically sent by browser).
- API client (`lib/api.ts`) automatically refreshes the access token when a 401 response is received.
- Auth context provides `user`, `login`, `register`, `logout`.

### Custom YouTube Player

- Hides all YouTube branding via `playerVars` (`controls=0`, `modestbranding=1`, `showinfo=0`) and CSS scaling (`transform: scale(1.8)` on the iframe container).
- Custom controls: play/pause, progress slider, volume, mute, fullscreen, skip ±5 seconds.
- Reports current time via `onTimeUpdate` callback for progress saving.

### Pomodoro Timer

- Work / break phases with editable durations (saved to IndexedDB).
- Full‑screen focus mode when timer is active – only large timer and stop button.
- Smooth animations with Framer Motion (scale, fade, spring).
- Timer state persists across page reloads.

### Background Sound Player

- List of YouTube videos (recitations) stored in `sounds.ts`.
- Randomised order each time the selection dialog opens.
- Hidden YouTube iframe plays only audio.
- Play/pause, seek, volume control, mute, skip ±10 seconds.
- Current time and duration displayed with a progress bar.
- Blurred thumbnail background when a sound is selected.

### Notes

- Saved in IndexedDB per user session.
- Simple text notes with creation timestamp.
- Delete functionality.

### Video Library

- User can save a video from search results to their personal library (backend endpoint `/protected/user/videos`).
- Library page displays all saved videos with thumbnails and direct watch link.

### Search

- Performs a full‑text search on `videos.json` via backend endpoint `/protected/videos/search`.
- Results are returned in random order.
- Each result card opens a dialog with a preview player and a “Save & Watch” button.

## Environment Variables

| Variable               | Description                         | Default                      |
|------------------------|-------------------------------------|------------------------------|
| NEXT_PUBLIC_API_URL    | Backend API base URL                | http://localhost:8080/api    |

## Building for Production

```bash
npm run build
npm start
```

## Deployment

- Recommended: Vercel, Netlify, or any Node.js hosting.
- Ensure `NEXT_PUBLIC_API_URL` points to your production backend.
- For CORS, either configure the backend to allow your frontend origin or use Next.js rewrites.
