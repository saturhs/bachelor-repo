# LLM UI Implementation Prompt

## Overview
Create a clean, modern landing page for a Breeding App using Next.js and Shadcn UI components. The design should follow a minimalist approach with placeholder statistics for future database integration.

## Design Elements
- Logo location: `/src/assets/cow_400x400.png`
- Simple navigation
- Hero section with CTA
- Basic statistics placeholder section

## Implementation Steps

### 1. Navigation Component
Create components/nav/Navbar.tsx:
- Import logo from "@/assets/cow_400x400.png"
- Create responsive navbar with:
  - Logo (left-aligned)
  - Navigation links: Statistics, About (right-aligned)

### 2. Hero Section
Create components/hero/Hero.tsx:
- Main heading "Breeding App"
- CTA button "Go to main menu" using Shadcn Button component
- Phone mockup illustration (left side)
- Clipboard illustration (right side)

### 3. Statistics Section
Create components/stats/StatsContainer.tsx:
- Create a simple grid/flex container
- Add three placeholder stat boxes:
  - Box 1: "Stats 1"
  - Box 2: "Stats 2"
  - Box 3: "Stats 3"
- Style as minimal containers for future dynamic data

### 4. Layout Implementation

#### Page Structure
Create app/page.tsx with:
- Navbar
- Hero Section
- Stats Container

### 5. Styling Guidelines
- Colors:
  - Primary: Black (#000000)
  - Accent: Coral/red for CTA (#ff4f4f or similar)
  - Background: Off-white (#faf9f6)
- Typography:
  - Use system font stack or Inter (Shadcn default)
  - Clear hierarchy for headings

### 6. Component Properties
typescript
// Types for components
interface NavbarProps {
links: {
text: string;
href: string;
}[];
}
interface StatsContainerProps {
// Prepare for future data integration
stats?: {
id: string;
value: string;
label: string;
}[];
}
### 7. Technical Requirements
- Next.js 13+ with App Router
- Shadcn UI components
- Responsive design
- Simple placeholder containers for statistics
- Image optimization for logo

### 8. Implementation Notes
- Keep statistics section as simple containers with placeholder text
- Ensure logo is properly optimized using Next.js Image component
- Focus on clean, maintainable code structure
- Add comments for future data integration points

## Final Deliverable
- Responsive landing page
- Modular component structure
- Placeholder statistics containers
- Documentation for future data integration

**Note:** The statistics section should be built with future database integration in mind, using simple placeholder containers that can be easily updated later with real data.