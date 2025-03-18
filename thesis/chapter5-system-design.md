# Chapter 5: System Design

## 5.1 System Architecture

The livestock management system follows a modern web application architecture based on the Next.js framework. This section describes the high-level architecture and the relationships between different components.

### 5.1.1 Overall Architecture

The application employs Next.js architecture, which integrates both frontend and backend functionality in a single codebase:

![System Architecture Diagram](./images/system_architecture.png)

1. **Client Layer**: React components rendered in the browser that provide the user interface and handle user interactions.

2. **Next.js Layer**: The core framework layer that manages routing, rendering, and API handling:
   - **Pages/App Router**: Handles routing and page structure
   - **Server Components**: React components rendered on the server
   - **Client Components**: React components that hydrate on the client with interactivity
   - **API Routes**: Serverless functions that handle data operations

3. **Data Access Layer**: Mongoose models and utility functions that interface with the database.

4. **Database Layer**: MongoDB database for persistent storage.

This unified architecture eliminates the need for a separate backend server, as Next.js API routes serve as backend endpoints while the Next.js server handles page rendering.

### 5.1.2 Next.js App Router Structure

The system leverages Next.js App Router's file-based routing and server components to organize the application:

```
src/
├── app/             # Routes and pages
│   ├── about/       # About page
│   ├── animals/     # Animal management pages
│   ├── calendar/    # Calendar view
│   ├── main-menu/   # Main menu page
│   ├── settings/    # System configuration
│   ├── statistics/  # Analytics page
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── components/      # Shared UI components
├── lib/             # Utilities and shared code
│   ├── db/          # Database models and connections
│   └── utils/       # Helper functions
```

This structure provides several advantages:

1. **Co-location**: Related components, styles, and logic are grouped together.
2. **Parallel Routes**: Different sections of the application can be developed independently.
3. **Incremental Adoption**: New features can be added as new routes without disrupting existing functionality.

### 5.1.3 API Endpoints

The application's backend functionality is implemented using Next.js API routes:

1. **/api/animals**: CRUD operations for animal management
2. **/api/events**: Event querying and filtering
3. **/api/animal-events**: Animal-specific events and workflow actions
4. **/api/custom-event-types**: Management of user-defined event types
5. **/api/custom-events**: Creation and management of custom event instances
6. **/api/statistics/conception-rate**: Conception rate data for visualization
7. **/api/statistics/pregnancy-distribution**: Current status distribution of females
8. **/api/statistics/calving-distribution**: Monthly distribution of calving events
9. **/api/settings**: System configuration management

These routes implement RESTful principles for consistency and predictability, with appropriate HTTP methods (GET, POST, PUT, DELETE) corresponding to different operations.

## 5.2 Database Design

### 5.2.1 MongoDB Schema Design

The application uses MongoDB as its database, leveraging the document-oriented nature of MongoDB for flexible schema development. The primary collections in the database are:

1. **animals**: Stores animal data
2. **events**: Stores all scheduled and completed events
3. **customEventTypes**: Stores user-defined event types
4. **defaultSettings**: Stores system-wide configuration parameters

Each collection has a corresponding Mongoose schema to enforce data validation and provide structured access patterns.

### 5.2.2 Animal Schema

The Animal schema is central to the application, storing comprehensive information about each animal:

```typescript
const AnimalSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['female', 'male'],
  },
  birthDate: {
    type: Date,
    required: true,
  },
  breed: {
    type: String,
    required: false,
  },
  acquisitionDate: {
    type: Date,
    required: false,
  },
  acquisitionType: {
    type: String,
    required: false,
    enum: ['born on farm', 'purchased'],
  },
  mothersTag: {
    type: String,
    required: false,
  },
  fathersTag: {
    type: String,
    required: false,
  },
  currentBCS: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
  },
  currentWeight: {
    type: Number,
    required: false,
  },
  lastHealthCheckDate: {
    type: Date,
    required: false,
  },
  lastHeatDay: {
    type: Date,
    required: false,
  },
  lastInseminationDate: {
    type: Date,
    required: false,
  },
  reproductiveStatus: {
    type: String,
    required: false,
    enum: ['not bred', 'bred', 'confirmed pregnant', 'open', 'dry'],
    default: 'not bred'
  },
  notes: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  category: {
    type: String,
    required: true,
    enum: ['adult', 'calf'],
    default: 'adult'
  },
}, {
  timestamps: true,
});
```

The schema includes fields for:
- Identification (tag)
- Demographics (gender, birthDate, breed)
- Acquisition information (acquisitionDate, acquisitionType)
- Parentage (mothersTag, fathersTag)
- Physical metrics (currentBCS, currentWeight)
- Reproductive tracking (lastHealthCheckDate, lastHeatDay, lastInseminationDate, reproductiveStatus)
- Management details (notes, location, tags, category)

Timestamps are automatically tracked for record creation and updates.

### 5.2.3 Event Schema

The Event schema stores all scheduled and completed events in the system:

```typescript
const semenDetailsSchema = new mongoose.Schema({
  bullTag: {
    type: String,
    required: false,
  },
  serialNumber: {
    type: String,
    required: false,
  },
  producer: {
    type: String,
    required: false,
  }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Overdue', 'Cancelled'],
    default: 'Pending',
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  location: {
    type: String,
    required: false,
  },
  completedDate: {
    type: Date,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  associatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  semenDetails: {
    type: semenDetailsSchema,
    required: false,
  },
  result: {
    type: String,
    enum: ['positive', 'negative', null],
    default: null
  },
}, {
  timestamps: true,
});
```

The Event schema includes:
- Basic event information (eventType, title, description)
- Scheduling details (scheduledDate, status, priority)
- Relationship to animals (animalId, location)
- Completion tracking (completedDate, notes, result)
- Relationships between events (associatedEvents)
- Special fields for insemination events (semenDetails)

### 5.2.4 Custom Event Type Schema

The Custom Event Type schema allows users to define their own event types:

```typescript
const reminderTimeSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['hour', 'day', 'week', 'month'], 
  }
}, { _id: false });

const CustomEventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
    trim: true,
  },
  defaultPriority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  reminderTime: {
    type: reminderTimeSchema,
    required: true,
  },
  animalCategories: {
    type: [{
      type: String,
      enum: ['adult female', 'adult male', 'calf'],
    }],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0;
      },
      message: 'At least one animal category must be selected',
    }
  },
}, {
  timestamps: true,
});
```

This schema defines:
- Basic information (name, description)
- Display and behavior parameters (defaultPriority)
- Scheduling logic (reminderTime with value and unit)
- Applicability criteria (animalCategories)

### 5.2.5 Default Settings Schema

The Default Settings schema stores configurable system parameters:

```typescript
const DefaultSettingsSchema = new mongoose.Schema({
  pregnancyLengthDays: { 
    type: Number, 
    default: 280, 
    min: 200, 
    max: 400 
  },
  dryOffDaysBeforeCalving: { 
    type: Number, 
    default: 60, 
    min: 30, 
    max: 120 
  },
  inseminationToPregnancyCheckDays: { 
    type: Number, 
    default: 30, 
    min: 14, 
    max: 60 
  },
  healthCheckIntervalDays: { 
    type: Number, 
    default: 14, 
    min: 7, 
    max: 90 
  }
}, { 
  timestamps: true 
});
```

This schema stores key timing parameters that control the reproductive cycle workflow.

### 5.2.6 Data Relationships

The relationships between these schemas form the foundation of the application's functionality:

- An **Animal** can have many **Events**
- **Events** can be associated with other **Events** (e.g., an insemination event leads to a pregnancy check event)
- A **Custom Event Type** defines a template that can be used to create multiple **Events**
- The **Default Settings** affect the timing of automatically scheduled **Events**

These relationships are managed through MongoDB references rather than embedded documents to allow for efficient querying and updating.

## 5.3 UI Design

### 5.3.1 Design System

The application's UI is built using a consistent design system based on the following principles:

1. **Simplicity**: Clean, straightforward interfaces that prioritize clarity over complexity
2. **Consistency**: Uniform patterns for interaction, navigation, and visualization
3. **Feedback**: Immediate visual feedback for user actions
4. **Accessibility**: Designs that accommodate diverse users and different levels of technical proficiency

### 5.3.2 Key UI Components

The application UI is composed of several core components:

1. **Layout Components**:
   - Main Layout (navigation, header, content area)
   - Page Containers (consistent padding and structure)
   - Card Components (for displaying animal information)
   - Modal and Dialog components (for forms and detailed views)

2. **Navigation Components**:
   - Main Navigation (primary sections)
   - Tab Navigation (within sections)
   - Breadcrumbs (for hierarchical navigation)

3. **Form Components**:
   - Input fields with validation
   - Radio and checkbox controls
   - Dropdown selects
   - Date pickers

4. **Data Display Components**:
   - Tables with sorting and filtering
   - Lists with grouping capabilities
   - Cards for summarized information
   - Badges for status indication

5. **Calendar Components**:
   - Month view with day cells
   - Day detail view
   - Event indicators

6. **Visualization Components**:
   - Bar charts for distribution analysis
   - Pie charts for proportion visualization
   - Line charts for trend analysis

### 5.3.3 Page Layouts

The main pages of the application follow specific layouts optimized for their function:

1. **Animals Page**:
   - Tab navigation at the top (Female/Male/Calves)
   - Filter controls for location and search
   - Grid of animal cards
   - Add button in consistent location
   - Modal overlay for detailed view and actions

2. **Calendar Page**:
   - Month navigation and controls at the top
   - Filter dropdown for event types
   - Month grid with color-coded days
   - Popup for day details with location grouping
   - Event details expandable within day view

3. **Settings Page**:
   - Tab navigation for different setting categories
   - Form-based interfaces for configuration
   - Clear save/cancel actions
   - Immediate feedback on changes

4. **Statistics Page**:
   - Selectable chart types
   - Clear visual separation between different metrics
   - Consistent color scheme for data representation

### 5.3.4 Responsive Design Considerations

While the application is primarily designed for desktop use, responsive design principles are applied to ensure usability on various screen sizes:

1. **Layout Flexibility**: Components adjust to available screen width
2. **Prioritized Content**: Most critical information remains visible on smaller screens
4. **Touch-Friendly**: Interactive elements sized appropriately for touch interactions

## 5.4 Business Logic and Workflows

### 5.4.1 Reproductive Cycle Management

The core business logic of the application revolves around managing the reproductive cycle of dairy cattle. This process is modeled as a state machine with the following states and transitions:

1. **Not Bred** → Initial state for females that haven't been inseminated
   - Transition to **Open**: Heat/estrus symptoms observed

2. **Open** → Female showing heat symptoms, ready for insemination
   - Transition to **Bred**: Insemination performed

3. **Bred** → Female inseminated, awaiting pregnancy confirmation
   - Transition to **Confirmed Pregnant**: Positive pregnancy check
   - Transition to **Not Bred**: Negative pregnancy check

4. **Confirmed Pregnant** → Pregnancy verified
   - Transition to **Dry**: Dry-off procedure completed

5. **Dry** → Late-stage pregnancy, milk production stopped
   - Transition to **Not Bred**: Calving completed

This state machine drives the automated scheduling of events and determines which actions are available for each animal based on its current reproductive status.

### 5.4.2 Event Scheduling Logic

The event scheduling system follows these rules:

1. **Health Check Scheduling**:
   ```
   When: Health check is completed
   Action: Schedule next health check
   Timing: Health check interval days from current date
   Parameters: Default is 14 days, configurable in settings
   ```

2. **Heat Observation** → **Insemination**:
   ```
   When: Heat symptoms are recorded
   Action: Schedule insemination
   Timing: 12 hours after heat observation
   Status Change: Animal status changes to "open"
   ```

3. **Insemination** → **Pregnancy Check**:
   ```
   When: Insemination is completed
   Action: Schedule pregnancy check
   Timing: Configurable days after insemination (default 30)
   Status Change: Animal status changes to "bred"
   ```

4. **Pregnancy Check** → **Dry-Off** + **Expected Calving**:
   ```
   When: Pregnancy is confirmed positive
   Action: Schedule dry-off and expected calving
   Timing:
     - Dry-off: Configured days before expected calving (default 60)
     - Expected calving: Pregnancy length days from insemination (default 280)
   Status Change: Animal status changes to "confirmed pregnant"
   ```

5. **Pregnancy Check** → **No Scheduled Events**:
   ```
   When: Pregnancy check is negative
   Action: No events automatically scheduled
   Status Change: Animal status changes to "not bred"
   ```

6. **Dry-Off** → **No Scheduled Events**:
   ```
   When: Dry-off is completed
   Action: No events automatically scheduled
   Status Change: Animal status changes to "dry"
   ```

7. **Calving** → **Health Check**:
   ```
   When: Calving is recorded
   Action: Schedule post-calving health check
   Timing: 14 days after calving
   Status Change: Animal status changes to "not bred"
   ```

This logic is implemented in the API routes that handle event creation and status updates.

### 5.4.3 Custom Event Workflow

The custom event system follows a different workflow:

1. **Creation Phase**:
   - User defines a custom event type with name, description, priority, and reminder interval
   - System stores the custom event type in the database

2. **Scheduling Phase**:
   - User assigns a custom event to a specific animal
   - System creates an event record with the scheduled date
   - If the event has a reminder interval, a follow-up event is automatically scheduled

3. **Execution Phase**:
   - User marks the event as completed
   - If the event has a reminder interval, the next occurrence is scheduled based on the defined interval
   - No automatic status changes are applied to the animal

This workflow allows users to extend the system with farm-specific events while maintaining the rigorous reproductive cycle management.

## 5.5 Data Flow

### 5.5.1 Animal Management Data Flow

The animal management functionality follows these data flow patterns:

1. **Viewing Animals**:
   - Client requests animal data through React Query fetch calls
   - Server processes the request through the `/api/animals` endpoint
   - MongoDB queries filter animals based on specified criteria (gender, category and location)
   - Filtered animal data is returned to the client
   - React components (AnimalCard) render the animal information

2. **Adding New Animals**:
   - User fills out the animal registration form in a modal dialog
   - Client-side validation ensures data integrity
   - Form submission sends a POST request to `/api/animals` endpoint
   - Server validates the incoming data against the Animal schema
   - New animal document is created in the MongoDB database
   - Success response triggers UI update through React Query invalidation
   - The animal list refreshes to show the new animal

3. **Updating Animals**:
   - User modifies animal data through the edit dialog in AnimalCard
   - Form submission sends a PATCH request to `/api/animals` with animal ID
   - Server updates the specified fields in the animal document
   - On successful update, the page refreshes to show updated information

4. **Deleting Animals**:
   - User confirms deletion in the confirmation dialog
   - Client sends a DELETE request to `/api/animals` with animal ID
   - Server removes the animal document from the database
   - After successful deletion, the page refreshes to update the animal list

### 5.5.2 Event Recording Flow

When reproductive events are recorded through the animal card interface:

1. User selects an action from the animal detail view (e.g., "Heat observed")
2. Client sends a POST request to `/api/animal-events` with the animal ID and action type
3. The server processes the request through specialized handler functions:
   - `handleHealthCheck`, `handleHeatSymptoms`, `handleInsemination`, etc.
4. The appropriate event document is created or updated in the database
5. Related animal data is updated (e.g., reproductive status, last insemination date)
6. Follow-up events are scheduled according to the reproductive cycle rules
7. The server returns a success response with details of the actions taken
8. The UI displays a success message and closes the dialog after a delay
9. The page refreshes to show the updated animal status

### 5.5.3 Calendar Data Flow

The calendar visualization process works as follows:

1. **Initial Calendar Loading**:
   - When user navigates to the calendar page, the CalendarView component initializes
   - The component makes three parallel fetch requests through React hooks:
     - Events from `/api/events`
     - Custom event types from `/api/custom-event-types`
     - Animal count from `/api/animals`
   - The component processes the received data:
     - Filters pending events (status: 'Pending')
     - Extracts custom event type names
     - Combines standard and custom event types for filtering options

2. **Calendar Interaction**:
   - User can navigate between months using navigation buttons
   - User can filter events by type using the dropdown selector
   - Events are processed client-side to show correct distribution by day
   - Days are color-coded based on workload percentage (events relative to animal count)
   - Clicking a day opens a dialog showing detailed events
   - Events are grouped by location first, then by animal

3. **Day Detail View**:
   - When a day is selected, the component:
     - Filters events for the selected day
     - Extracts unique locations from these events
     - Displays location options to the user
     - When a location is selected, events are filtered and grouped by animal
     - Each animal's events are displayed with their details and priority indicators

### 5.5.4 Statistics Generation Flow

The statistics functionality follows these data flow patterns:

1. **Conception Rate Statistics**:
   - User navigates to the statistics page
   - Client fetches data from `/api/statistics/conception-rate`
   - Server executes the following process:
     - Queries completed pregnancy check events for the past 12 months
     - Analyzes 'result' field to determine positive vs. negative outcomes
     - Groups results by month and calculates success percentages
     - Returns formatted data for visualization
   - Client renders a bar chart showing conception rate trends

2. **Pregnancy Distribution Statistics**:
   - Client requests data from `/api/statistics/pregnancy-distribution`
   - Server performs these operations:
     - Queries female animals from the database
     - Groups them by reproductive status
     - Calculates counts and percentages for each status
     - Returns structured data with appropriate color coding
   - Client renders a pie chart showing the current distribution

3. **Calving Distribution Statistics**:
   - Client fetches data from `/api/statistics/calving-distribution`
   - Server process includes:
     - Querying completed calving events
     - Aggregating events by month
     - Preparing monthly distribution data
     - Creating additional heatmap data grouped by year and month
   - Client visualizes the distribution across months and years

## 5.6 Security Considerations

The current implementation includes basic security measures while leaving room for future enhancements:

1. **Input Validation**: All user inputs are validated both on client and server side to prevent injection attacks and data corruption. This includes schema validation through Mongoose and form validation on the client.

2. **Error Handling**: The application implements structured error handling to prevent leaking sensitive information through error messages.

3. **Environment Variables**: Database connection strings are stored in environment variables rather than hardcoded in the application.

While comprehensive authentication and authorization systems are beyond the scope of the current implementation, the application design provides hooks for future integration through:

1. **Model Structure**: Event and animal schemas include creator and modifier fields that can be populated when authentication is added.

2. **API Route Structure**: The API routes are designed to allow middleware integration for authentication checks.

These considerations provide a foundation for adding more robust security features in future versions of the application.

## 5.7 Summary

The system design of the livestock management application combines modern web architecture with domain-specific workflows to create a solution tailored to the needs of dairy farm reproductive management. Key aspects include:

1. A layered architecture based on Next.js that effectively combines frontend and backend functionality

2. A flexible MongoDB database design with comprehensive schemas for animals, events, and configuration

3. A consistent UI design system that prioritizes simplicity and usability

4. Well-defined business logic that models the complex reproductive cycle of dairy cattle

5. Clear data flows that support the core operations of the application

This design provides a solid foundation for the implementation phase, ensuring that the resulting application will meet the requirements identified in the problem analysis phase.
