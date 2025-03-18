# Chapter 7: Event Scheduling System

## 7.1 System Overview

The event scheduling system forms the core functionality of the dairy farm management application. It implements domain-specific workflows for reproductive management while providing flexibility for custom farm needs. The system handles two primary categories of events:

1. **Reproductive Cycle Events**: Predefined events that follow strict workflows
2. **Custom Events**: User-defined events for tracking farm-specific activities

## 7.2 Event Model

### 7.2.1 Event Data Structure

The Event data model captures all necessary information for effective scheduling and tracking:

//Event model code

### 7.2.2 Event Status Lifecycle

Events follow a defined lifecycle through four status values:

1. **Pending**: Initial state when an event is scheduled
2. **Completed**: Terminal state when an event has been performed
3. **Overdue**: Automatic state transition when an event date has passed
4. **Cancelled**: Terminal state for events that are no longer needed

## 7.3 Reproductive Cycle Events

### 7.3.1 Core Reproductive Event Types

Seven primary event types form the backbone of the reproductive management workflow:

1. **HealthCheck**: Regular health examinations
2. **HeatObserved**: Recording of estrus/heat symptoms
3. **Insemination**: Artificial insemination procedure
4. **PregnancyCheck**: Confirmation of pregnancy status
5. **DryOff**: Cessation of milking before calving
6. **ExpectedCalving**: Anticipated birth date reminder
7. **Calving**: Recording of actual birth

### 7.3.2 State Machine Implementation

The reproductive cycle follows a state machine pattern, where each animal maintains a reproductive status that determines available actions:

```typescript
type ReproductiveStatus = 'not bred' | 'open' | 'bred' | 'confirmed pregnant' | 'dry';

// Allowed transitions between states
const validTransitions = {
  'not bred': ['open'],
  'open': ['bred'],
  // Other valid transitions...
};

// Events that trigger transitions
const transitionEvents = {
  'HeatObserved': { from: 'not bred', to: 'open' },
  'Insemination': { from: 'open', to: 'bred' },
  // Other transition events...
};
```

### 7.3.3 Scheduling Algorithms

The system implements automated event scheduling based on reproductive events. For example, after a positive pregnancy confirmation:

```typescript
async function schedulePregnancyEvents(animalId: string, animal: any, inseminationDate: Date) {
  // Get configurable timing parameters
  const settings = await getSettings();
  
  // Calculate expected dates based on settings
  const expectedCalvingDate = addDays(inseminationDate, settings.pregnancyLengthDays);
  const dryOffDate = addDays(expectedCalvingDate, -settings.dryOffDaysBeforeCalving);
  
  // Create required events...
}
```

### 7.3.4 Event Handlers Implementation

Specialized handler functions encapsulate the business logic for each event type:

```typescript
// From /my-dairy-farm/src/app/api/animal-events/route.ts
async function handleHeatSymptoms(animalId: string, animal: any, notes?: string) {
  try {
    // 1. Validate conditions
    // 2. Record heat observation event
    // 3. Update animal's reproductive status
    // 4. Schedule an insemination event
    
    return { success: true, message: "Heat symptoms recorded" };
  } catch (error) {
    console.error("Error in handleHeatSymptoms:", error);
    throw error;
  }
}
```

## 7.4 Custom Event System

### 7.4.1 Custom Event Type Model

Users can define their own event types with configurable parameters:

```typescript
interface CustomEventType {
  id: string;
  name: string;
  defaultPriority: "High" | "Medium" | "Low";
  reminderTime: {
    value: number;
    unit: "hour" | "day" | "week" | "month";
  };
  animalCategories: string[];
  // Other properties...
}
```

### 7.4.2 Custom Event Workflow

The custom event workflow consists of three phases:

1. **Definition Phase**: User creates a custom event type with specific parameters
2. **Assignment Phase**: User schedules a custom event for a specific animal
3. **Execution Phase**: User marks the custom event as completed and next occurrence is scheduled

### 7.4.3 Recurrence Handling

Custom events can have recurrence patterns defined by their reminder time parameter:

```typescript
// From /my-dairy-farm/src/app/api/custom-events/route.ts
async function scheduleNextCustomEvent(customEventType, animal) {
  // Calculate next date based on reminder time unit
  let nextDate;
  switch (customEventType.reminderTime.unit) {
    case 'hour': nextDate = addHours(new Date(), customEventType.reminderTime.value); break;
    case 'day': nextDate = addDays(new Date(), customEventType.reminderTime.value); break;
    // Other time units...
  }
  
  // Create the next scheduled event...
}
```

## 7.5 Calendar Integration

### 7.5.1 Event Aggregation

The calendar view aggregates both reproductive and custom events into a unified display with color coding based on priority.

### 7.5.2 Workload Calculation

The calendar implements a workload calculation algorithm to visually indicate busy days:

```typescript
function calculateWorkloadPercentage(eventCount: number, totalAnimals: number): number {
  if (totalAnimals === 0) return 0;
  return (eventCount / totalAnimals) * 100;
}
```

### 7.5.3 Location-Based Grouping

For effective daily planning, events are grouped by location, allowing farm workers to efficiently plan their day by addressing all tasks in one location before moving to another.

## 7.6 Event Notification System

The application uses visual indicators to draw attention to important events:

1. **Priority Colors**: Red (High), Yellow (Medium), Green (Low)
2. **Calendar Day Highlighting**: Based on event workload percentage
3. **Status Badges**: Visual differentiation between statuses
4. **Overdue Handling**: Automatic identification of missed events

## 7.7 Implementation Challenges

Key challenges included:

1. **Date Calculation**: Time zone handling, duration calculations, and date comparisons
2. **Event Association**: Maintaining relationships between related events
3. **Workflow Complexity**: Handling edge cases and ensuring valid state transitions

## 7.8 Summary

The event scheduling system forms the core functionality of the livestock management application, implementing both predefined reproductive workflows and flexible custom events. Key achievements include:

1. **State Machine Implementation**: Modeling the biological reproductive cycle computationally
2. **Automated Scheduling**: Configurable scheduling rules based on best practices
3. **Custom Event Support**: Flexible system for farm-specific management tasks
4. **Visual Planning Tools**: Calendar visualization with workload indicators
5. **Location-Based Organization**: Practical grouping of events by physical location

By combining rigorous reproductive management with flexible custom events, the system provides a comprehensive solution that balances structure with adaptability.
