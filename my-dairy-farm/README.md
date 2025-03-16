# My Dairy Farm - Livestock Management Application

## Overview
This application is designed to help zootechnics manage livestock placed in different buildings of a dairy farm. It focuses on tracking animal reproductive cycles, health status, and scheduling important events related to livestock management.

## Problem Statement
Dairy farm livestock management faces several challenges:

- Tracking reproductive status of numerous animals across multiple locations
- Manually scheduling and remembering critical events like health checks, inseminations, and pregnancy checks
- Monitoring body condition scores (BCS)
- Visualizing farm performance metrics to inform decision-making

## Solution
My Dairy Farm application provides a centralized digital platform that:

- Tracks individual animals with comprehensive health and reproductive data
- Automatically schedules and reminds about critical events based on animal status
- Provides calendar visualization of upcoming tasks organized by location
- Enables custom event type creation for farm-specific management needs
- Delivers analytical insights through statistical visualizations

## Key Features

### Animal Management
- Individual animal profiles with complete health and reproductive data
- Tracking of key parameters like BCS (Body Condition Score)
- Support for different animal categories (adult/calf, male/female)
- Location tracking for animals housed in different buildings
- Tab view for easy filtering between females, males, and calves
- Location-based filtering of animals

### Reproductive Cycle Management
- Complete tracking of reproductive statuses: not bred, open, bred, confirmed pregnant, dry
- Automated event scheduling based on reproductive cycle:
  - Heat observation → Insemination → Pregnancy check → Dry-off → Calving
- Status-based visualization for quick assessment of herd reproductive health

### Event Scheduling System
- Automated scheduling of critical events based on animal reproductive status
- Priority-based events (High/Medium/Low) for visual differentiation
- Location-based event grouping for efficient task management
- Custom event types with configurable parameters:
  - Customizable name and description
  - Default priority level
  - Default reminder interval
  - Applicable animal categories

### Calendar View
- Monthly calendar displaying all scheduled events
- Navigation controls (Previous, Today, Next) for easy date browsing
- Color-coding based on percentage of animals with scheduled events
- Grouping by location and animal for organized viewing
- Filtering capabilities for specific event types
- Detailed view of events per day with location-based grouping

### Settings
- Custom event type creation and management
- Data management with JSON export functionality
- Configurable default timings for breeding cycles and health checks

### Analytics and Reporting
- Statistical visualizations:
  - Conception Rate: Percentage of successful pregnancy confirmations by month
  - Pregnancy Distribution: Current distribution of female animals by reproductive status
  - Calving Distribution: Monthly distribution of calving events throughout the year

## Technologies Used

### Frontend
- **Next.js 14 with App Router**: React framework for server-rendered applications
- **React**: UI component library
- **TypeScript**: Strongly-typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: UI component library built on Radix UI

### Backend & Data
- **Next.js API Routes**: Server-side logic and API endpoints
- **MongoDB**: NoSQL database for data storage
- **Recharts**: Library for data visualization

## Data Models

### Animal Model
Tracks comprehensive information about each animal including:
- **tag**: Earring number (e.g., PL123456789012)
- **gender**: Female or male
- **birthDate**: Date of birth
- **breed**: Cow's breed
- **acquisitionType**: "born on farm" or "purchased"
- **mothersTag**: Earring number of mother
- **fathersTag**: Earring number of father
- **currentBCS**: Body Condition Score (1-5)
- **currentWeight**: Weight of the animal
- **lastHealthCheckDate**: Date of last health examination
- **lastHeatDay**: Date when heat/estrus was observed
- **lastInseminationDate**: Date of last insemination
- **reproductiveStatus**: "not bred", "bred", "confirmed pregnant", "open", "dry"
- **notes**: Additional information
- **location**: Building where the animal is kept
- **tags**: Special tags if needed
- **category**: "adult" or "calf"

### Event System
The application manages several types of events with specific workflows:

1. **HealthCheck**: Regular health examinations
   - Auto-scheduled every 14 days (configurable)
   - Priority: Medium (High for post-calving)

2. **HeatObserved**: Recording of estrus/heat symptoms
   - Manually recorded
   - Updates animal status to "open"
   - Triggers insemination scheduling

3. **Insemination**: Artificial insemination procedure
   - Scheduled 12 hours after heat observation
   - Can include semen details
   - Updates animal status to "bred"
   - Triggers pregnancy check scheduling

4. **PregnancyCheck**: Verification of pregnancy
   - Scheduled 30 days after insemination
   - Outcomes: "confirmed pregnant" or "not pregnant"
   - Triggers dry-off and calving scheduling when confirmed

5. **DryOff**: Stop milking before calving
   - Scheduled 60 days before expected calving
   - Updates animal status to "dry"

6. **ExpectedCalving**: Anticipated birth date
   - Scheduled 280 days after successful insemination

7. **Calving**: Recording of actual birth
   - Manually recorded
   - Updates animal status to "not bred"
   - Triggers post-calving health check

8. **Custom Events**: User-defined events with configurable parameters

## Application Structure

### Animals Subpage
- Tab view (females, males, calves)
- Location filtering
- "Add new animal" button
- Animal cards showing key information:
  - Tag, Age, Breed, BCS, Last health check date
  - Edit and Delete buttons
  - Detailed popup on click with actions:
    - "Health check done"
    - "Note heat symptoms" (females only)
    - "Insemination done" (females with "open" status)
    - "Pregnancy confirmed"/"Not pregnant" (females with "bred" status)
    - "Record custom event"

### Calendar Subpage
- Monthly view with navigation controls
- Event type filtering
- Color-coded days based on workload percentage
- Detailed view on day click showing events by location and animal

### Settings Subpage
- Custom Events tab for creating and managing custom events
- Data Management tab for exporting animal data
- Default Settings tab for configuring reproductive cycle timings

### Statistics Subpage
- Conception Rate graph
- Pregnancy Distribution graph
- Calving Distribution graph

## Getting Started

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn
- MongoDB instance

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-dairy-farm.git
cd my-dairy-farm
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit the `.env.local` file with your MongoDB connection string.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Future Enhancements
- Mobile application for on-the-go farm management
- Integration with IoT devices for automated data collection
- Advanced analytics with predictive modeling for reproductive success rates
- Multi-farm support for larger operations
- Integration with feed management systems

## Contributors
- saturhs - Developer

## License
This project is licensed under the MIT License - see the LICENSE file for details.
