# Dalhousie-GCPS Psychiatry Programme Management System

A comprehensive web application for managing the Dalhousie University — Ghana College of Physicians and Surgeons (GCPS) Psychiatry fellowship programme.

## Features

- **Dashboard** — Overview with stat cards, activity feed, calendar, and quick actions
- **Membership Management** — Member directory with filtering by status/role
- **Fellowship Curriculum** — Module cards with progress tracking and category filters
- **Meetings & Minutes** — Timeline view of upcoming and past meetings
- **Progress Tracker** — Fellow progress bars, cohort filtering, completion stats
- **Faculty Directory** — Card-based directory with contact actions
- **Resources** — Document library with search, category filters, and upload zone

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, grid, flexbox, animations, dark/light theme
- **Vanilla JavaScript** — SPA router, modular architecture, no build step required

## Project Structure

```
├── index.html                  # Main entry point (SPA shell)
├── README.md
├── assets/
│   ├── css/
│   │   ├── variables.css       # Design tokens + dark theme
│   │   ├── base.css            # Reset, typography, utilities
│   │   ├── layout.css          # App shell, sidebar, header
│   │   ├── dashboard.css       # Stat cards, activity, notifications
│   │   ├── curriculum.css      # Module cards, competency checklists
│   │   ├── tables.css          # Data tables, pagination, filters
│   │   ├── timeline.css        # Timeline views
│   │   ├── forms.css           # Form cards, uploads, wizards
│   │   ├── animations.css      # Page transitions, micro-interactions
│   │   └── responsive.css      # Breakpoints 480px → 1280px
│   ├── js/
│   │   ├── app.js              # SPA router, page loader, utilities
│   │   ├── sidebar.js          # Navigation, collapse, mobile drawer
│   │   ├── theme.js            # Dark/light toggle + persistence
│   │   ├── search.js           # Global search with overlay
│   │   ├── notifications.js    # Toast messages + notif panel
│   │   ├── dashboard.js        # Dashboard page module
│   │   └── pages/
│   │       ├── membership.js
│   │       ├── fellowship.js
│   │       ├── meetings.js
│   │       ├── tracker.js
│   │       ├── faculty.js
│   │       └── resources.js
│   ├── images/
│   ├── icons/
│   └── fonts/
├── pages/                      # Standalone HTML pages (bookmarkable)
│   ├── membership.html
│   ├── fellowship.html
│   ├── meetings.html
│   ├── tracker.html
│   ├── faculty.html
│   └── resources.html
├── data/
│   ├── membership.json
│   ├── fellowship.json
│   └── meetings.json
└── uploads/
```

## Getting Started

Open `index.html` in any modern browser — no server, build step, or dependencies required.

For the standalone pages, open any file under `pages/` directly.

## Firebase Notes

- The app now uses Firebase Auth and Firestore for sign-in, sign-up, and teaching profile storage.
- Self-service sign-up creates faculty accounts only.
- Create the first admin account in Firebase Auth manually before using the user management screen.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus global search |
| `Escape` | Close search overlay / notification panel |

## Theme

Toggle between light and dark mode via the sidebar footer button. Preference persists in `localStorage`.

## Browser Support

Chrome, Firefox, Safari, Edge — latest two versions. Responsive down to 480px mobile screens.

---

**Dalhousie University — Ghana College of Physicians and Surgeons**  
Psychiatry Fellowship Programme
