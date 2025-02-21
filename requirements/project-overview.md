# Project overview
Use this guide to build a web app where users, basically zootechnicians can manage the breeding cycle of dairy cows using simple UI/UX to create/delete/edit records in a database, update informations about each cow and as a result see which animals needs an examination or control.

# Feature requirements
- We will use Next.js, shadcn and MongoDB database.
- App will be PWA so we will use next-pwa library. 
- UI should allow to swap between pages from main menu, be responsive and present data from MongoDB database.
- Database should support CRUD operations. It's records will contain various data types, that can be used to filter the data displayed to the user.
- We will provide an option to analize database object's attributes like date of last examination, so app can remind the user of an up coming appointment. A list or other type of data should contain objects that has date, cow_id and description attribute. Then this list will be mapped into a calendar dates.
- CRUD should work offline as well, so can be easily synchronized later after reconnection to internet.
- A button that synchronizes all data stored locally on a device with data in main database.
- Analized data will be displayed on a calendar subpage, as a reminder of important appointments.
- The user can delete all stored data in database by confirming and clicking reset button.

# App workflow
- After opening the app we on Main Screen with buttons that redirects to specific pages
- First button "Animals" redirects to animals.tsx that is basically displaying database tables, accordingly to set up filters. Showing each cow as a Card component. Main screen is a tab selector like in example google chrome browser, three tabs: females, males, babies.
- Second button "Calendar" redirects to calendar.tsx that shows basic calendar but on each date should display every planned task for the user. App's logic is preparing a list of tasks for every day. The user can change displayed months.
- Each page has button on the left up corner to go back to main menu.

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
│   ├── mainp-prompt.md
│   └── instructions.txt

# Rules
- All new components should go in /components and be named example-component.tsx unless otherwise specified  
- All new pages should go in /app

# Components styleguide in XML format.
<?xml version="1.0" encoding="UTF-8"?>
<styleGuide>
    <components>
        <buttons>
            <primaryCTA>
                <className>h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white</className>
                <example>
                    <Button className="h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white">
                        Click me
                    </Button>
                </example>
            </primaryCTA>
            
            <secondary>
                <className>h-12 px-8 text-lg hover:bg-gray-100</className>
                <example>
                    <Button variant="outline" className="h-12 px-8 text-lg hover:bg-gray-100">
                        Click me
                    </Button>
                </example>
            </secondary>
        </buttons>

        <cards>
            <standardCard>
                <className>bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg</className>
                <example>
                    <div className="bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg">
                        Content here
                    </div>
                </example>
            </standardCard>

            <interactiveCard>
                <className>bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg hover:bg-gray-50 transition-colors</className>
                <example>
                    <div className="bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg hover:bg-gray-50 transition-colors">
                        Content here
                    </div>
                </example>
            </interactiveCard>
        </cards>

        <backgrounds>
            <main>
                <className>bg-[#faf9f6]</className>
                <example>
                    <div className="bg-[#faf9f6]">
                        Content here
                    </div>
                </example>
            </main>

            <overlay>
                <className>bg-white/80 backdrop-blur-sm</className>
                <example>
                    <div className="bg-white/80 backdrop-blur-sm">
                        Content here
                    </div>
                </example>
            </overlay>
        </backgrounds>

        <typography>
            <mainHeading>
                <className>text-5xl font-bold mb-12</className>
                <example>
                    <h1 className="text-5xl font-bold mb-12">Heading</h1>
                </example>
            </mainHeading>

            <subHeading>
                <className>text-4xl font-bold mb-2</className>
                <example>
                    <h2 className="text-4xl font-bold mb-2">Subheading</h2>
                </example>
            </subHeading>

            <bodyText>
                <className>text-gray-600</className>
                <example>
                    <p className="text-gray-600">Regular text</p>
                </example>
            </bodyText>
        </typography>

        <layout>
            <mainContainer>
                <className>min-h-screen bg-[#faf9f6] relative</className>
                <example>
                    <main className="min-h-screen bg-[#faf9f6] relative">
                        Content here
                    </main>
                </example>
            </mainContainer>

            <sectionContainer>
                <className>max-w-6xl mx-auto py-16</className>
                <example>
                    <section className="max-w-6xl mx-auto py-16">
                        Content here
                    </section>
                </example>
            </sectionContainer>

            <gridContainer>
                <className>grid grid-cols-3 gap-8</className>
                <example>
                    <div className="grid grid-cols-3 gap-8">
                        Content here
                    </div>
                </example>
            </gridContainer>
        </layout>

        <navigation>
            <navbar>
                <className>w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm</className>
                <example>
                    <nav className="w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm">
                        Content here
                    </nav>
                </example>
            </navbar>

            <navLink>
                <className>hover:opacity-80</className>
                <example>
                    <Link href="/path" className="hover:opacity-80">
                        Link text
                    </Link>
                </example>
            </navLink>
        </navigation>

        <effects>
            <blur>backdrop-blur-sm</blur>
            <shadow>shadow-sm</shadow>
            <hoverTransition>transition-colors</hoverTransition>
            <hoverBackground>hover:bg-gray-50</hoverBackground>
            <hoverOpacity>hover:opacity-80</hoverOpacity>
        </effects>

        <spacing>
            <verticalSection>py-16</verticalSection>
            <componentGap>gap-8</componentGap>
            <buttonPadding>px-8</buttonPadding>
            <contentMarginLarge>mb-12</contentMarginLarge>
            <contentMarginSmall>mb-2</contentMarginSmall>
        </spacing>
    </components>
</styleGuide>
