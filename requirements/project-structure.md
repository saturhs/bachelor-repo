# Project structure
bachelor-degree/
├── my-dairy-farm/              # Main project directory
│   ├── public/                  # Static assets
│   │   ├── icons/              # PWA icons
│   │   ├── file.svg            # Generic SVG file
│   │   ├── globe.svg           # Globe icon SVG
│   │   ├── next.svg            # Next.js logo SVG
│   │   ├── vercel.svg          # Vercel logo SVG
│   │   └── window.svg          # Window icon SVG
│   │   └── manifest.json       # PWA manifest
│   │
│   ├── src/                    # Source code
│   │   ├── app/                # Application pages
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home/Landing page
│   │   │   ├── about/          # About section
│   │   │   │   └── page.tsx
│   │   │   ├── statistics/     # Statistics section
│   │   │   │   └── page.tsx
│   │   │   └── main-menu/      # Main menu section
│   │   │       ├── page.tsx    # Main menu page
│   │   │       ├── animals/    # Animals section
│   │   │       │   └── page.tsx
│   │   │       ├── calendar/   # Calendar section
│   │   │       │   └── page.tsx
│   │   │       └── settings/   # Settings section
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/
│   │   │       ├── AnimalCard.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── CalendarView.tsx
│   │   │       ├── Goback.tsx
│   │   │       └── Navbar.tsx
│   │   │
│   │   ├── lib/                # Library utilities
│   │   │   ├── db/             # Database utilities
│   │   │   │   ├── mongodb.ts
│   │   │   │   └── models/
│   │   │   │       ├── Animal.ts
│   │   │   │       └── Event.ts
│   │   │   │
│   │   │   └── utils/          # Helper functions
│   │   │       ├── dates.ts
│   │   │       └── offline-sync.ts
│   │   │
│   │   └── types/              # TypeScript type definitions
│   │       ├── animal.ts
│   │       └── event.ts
│   │
│   ├── .env                    # Environment variables
│   ├── next.config.js          # Next.js configuration
│   ├── package.json            # Project dependencies
│   └── tsconfig.json           # TypeScript configuration
│
├── requirements/               # Project requirements and documentation
│   ├── project-overview.md
│   ├── project-state.md
│   ├── project-structure.md     # Updated file
│   ├── mainp-prompt.md
│   └── instructions.txt