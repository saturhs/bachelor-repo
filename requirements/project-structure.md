# Project structure
bachelor-degree/
├── my-dairy-farm/              # Main project directory
│   ├── public/
│   │   ├── icons/             # PWA icons
│   │   └── manifest.json      # PWA manifest
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home/Landing page
│   │   │   ├── about/         # About section
│   │   │   │   └── page.tsx
│   │   │   ├── statistics/    # Statistics section
│   │   │   │   └── page.tsx
│   │   │   └── main-menu/     # Main menu section
│   │   │       ├── page.tsx   # Main menu page
│   │   │       ├── animals/   # Animals section
│   │   │       │   └── page.tsx
│   │   │       ├── calendar/  # Calendar section
│   │   │       │   └── page.tsx
│   │   │       └── settings/  # Settings section
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   └── ui/           # Reusable UI components
│   │   │       ├── AnimalCard.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── CalendarView.tsx
│   │   │       ├── Goback.tsx
│   │   │       └── Navbar.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── db/           # Database utilities
│   │   │   │   ├── mongodb.ts
│   │   │   │   └── models/
│   │   │   │       ├── Animal.ts
│   │   │   │       └── Event.ts
│   │   │   │
│   │   │   └── utils/        # Helper functions
│   │   │       ├── dates.ts
│   │   │       └── offline-sync.ts
│   │   │
│   │   └── types/           # TypeScript type definitions
│   │       ├── animal.ts
│   │       └── event.ts
│   │
│   ├── .env                 # Environment variables
│   ├── next.config.js       # Next.js configuration
│   ├── package.json
│   └── tsconfig.json
│
├── requirements/            # Project requirements and documentation
│   ├── project-overview.md
│   ├── project-state.md
│   ├── project-structure.md  # New file
│   ├── mainp-prompt.md
│   └── instructions.txt