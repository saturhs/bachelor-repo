# Project structure
```
└─ .
   ├─ copilot-instructions.json
   ├─ database
   │  ├─data
   │  │  └─ database files
   │  └─backups
   │     └─ database backup files
   ├─ my-dairy-farm
   │  ├─ components.json
   │  ├─ eslint.config.mjs
   │  ├─ package-lock.json
   │  ├─ package.json
   │  ├─ postcss.config.mjs
   │  ├─ public
   │  │  ├─ file.svg
   │  │  ├─ globe.svg
   │  │  ├─ vercel.svg
   │  │  └─ window.svg
   │  ├─ README.md
   │  ├─ src
   │  │  ├─ app
   │  │  │  ├─ about
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ animals
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ api
   │  │  │  │  ├─ animals
   │  │  │  │  │  └─ route.ts
   │  │  │  │  └─ events
   │  │  │  │     └─ route.ts
   │  │  │  ├─ calendar
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ favicon.ico
   │  │  │  ├─ globals.css
   │  │  │  ├─ layout.tsx
   │  │  │  ├─ main-menu
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ page.tsx
   │  │  │  ├─ settings
   │  │  │  │  └─ page.tsx
   │  │  │  ├─ statistics
   │  │  │  │  └─ page.tsx
   │  │  │  └─ test.tsx
   │  │  ├─ assets
   │  │  │  ├─ cow_400x400.png
   │  │  │  └─ krowa.jpg
   │  │  ├─ components
   │  │  │  └─ ui
   │  │  │     ├─ AnimalCard.tsx
   │  │  │     ├─ badge.tsx
   │  │  │     ├─ button.tsx
   │  │  │     ├─ calendar.tsx
   │  │  │     ├─ CalendarView.tsx
   │  │  │     ├─ card.tsx
   │  │  │     ├─ Goback.tsx
   │  │  │     ├─ Hero.tsx
   │  │  │     ├─ Navbar.tsx
   │  │  │     └─ StatsContainer.tsx
   │  │  ├─ lib
   │  │  │  ├─ db
   │  │  │  │  ├─ models
   │  │  │  │  │  ├─ Animal.ts
   │  │  │  │  │  └─ Event.ts
   │  │  │  │  ├─ mongodb.ts
   │  │  │  │  └─ testConnection.ts
   │  │  │  ├─ utils
   │  │  │  │  ├─ dates.ts
   │  │  │  │  └─ offline-sync.ts
   │  │  │  └─ utils.ts
   │  │  └─ types
   │  │     ├─ animal.ts
   │  │     └─ event.ts
   │  ├─ tailwind.config.ts
   │  └─ tsconfig.json
   ├─ README.md
   └─ requirements
      ├─ mainp-prompt.md
      ├─ project-overview.md
      ├─ project-state.md
      └─ project-structure.md

```