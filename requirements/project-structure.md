# Project structure
```
└─ .
   ├─ copilot-instructions.json
   ├─ database
   │  └─ data
   │     ├─ collection-0-6706779809950612491.wt
   │     ├─ collection-10-6706779809950612491.wt
   │     ├─ collection-2-6706779809950612491.wt
   │     ├─ collection-4-6706779809950612491.wt
   │     ├─ collection-7-6706779809950612491.wt
   │     ├─ diagnostic.data
   │     │  ├─ metrics.2025-02-23T14-39-55Z-00000
   │     │  └─ metrics.2025-02-24T16-21-42Z-00000
   │     ├─ index-1-6706779809950612491.wt
   │     ├─ index-11-6706779809950612491.wt
   │     ├─ index-3-6706779809950612491.wt
   │     ├─ index-5-6706779809950612491.wt
   │     ├─ index-6-6706779809950612491.wt
   │     ├─ index-8-6706779809950612491.wt
   │     ├─ index-9-6706779809950612491.wt
   │     ├─ journal
   │     │  ├─ WiredTigerLog.0000000002
   │     │  ├─ WiredTigerPreplog.0000000001
   │     │  └─ WiredTigerPreplog.0000000002
   │     ├─ mongod.lock
   │     ├─ sizeStorer.wt
   │     ├─ storage.bson
   │     ├─ WiredTiger
   │     ├─ WiredTiger.lock
   │     ├─ WiredTiger.turtle
   │     ├─ WiredTiger.wt
   │     ├─ WiredTigerHS.wt
   │     └─ _mdb_catalog.wt
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