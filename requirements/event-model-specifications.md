# Event Model Specifications

This document outlines the agreed specifications for the Event model used throughout the dairy farm application.

## Core Fields

| Field | Type | Description | Validation | Example |
|-------|------|-------------|------------|---------|
| _id | ObjectId | MongoDB's auto-generated ID | Valid MongoDB ObjectId | `60d21b4667d0d8992e610c85` |
| eventType | String | Type of event | Enum: `HealthCheck`, `Insemination`, `HeatObserved`, etc. | `Insemination` |
| animalId | ObjectId | ID of the animal involved | Required, valid reference to Animal | `60d21b4667d0d8992e610c85` |
| title | String | Event title | Required | `Insemination for PL123456789012` |
| description | String | Detailed description | Optional | `Second insemination attempt` |
| scheduledDate | Date | Planned execution date | Required, valid date | `2023-06-15` |
| status | String | Current status | Enum: `Pending`, `Completed`, `Overdue`, `Cancelled` | `Pending` |
| priority | String | Importance level | Enum: `High`, `Medium`, `Low` | `High` |
| repeatPattern | String | Repetition pattern | Enum: `None`, `Daily`, `Weekly`, `Monthly`, `Custom` | `Weekly` |
| repeatInterval | Number | Repetition interval | Optional, positive integer | `3` |
| reminderTime | Object | When to send notification | Object with value and unit | `{ value: 1, unit: 'day' }` |
| notificationSent | Boolean | Whether notification sent | Default: false | `false` |
| createdBy | ObjectId | User who created event | Required, valid reference to User | `60d21b4667d0d8992e610c85` |
| location | String | Location where event occurs | Optional | `Barn A` |
| completedDate | Date | When event was completed | Optional | `2023-06-16` |
| completedBy | ObjectId | User who completed event | Optional, valid reference to User | `60d21b4667d0d8992e610c85` |
| notes | String | Additional information | Optional | `Check temperature before procedure` |
| associatedEvents | Array of ObjectIds | Related events | Optional | `[60d21b4667d0d8992e610c86]` |
| createdAt | Date | Record creation timestamp | Auto-generated | `2023-01-15T12:00:00Z` |
| updatedAt | Date | Record last update timestamp | Auto-generated | `2023-04-20T15:30:00Z` |

## Event Types and Automatic Rules

### Standard Event Types

1. **HealthCheck**
   - Default periodicity: Every 2 weeks
   - Priority: Medium
   - Associated with: All animals

2. **Insemination**
   - Auto-scheduled: 18-24 hours after HeatObserved event
   - Priority: High
   - Associated with: Female animals with reproductive status "open"

3. **HeatObserved**
   - Manually recorded
   - Auto-predicted: 21 days after last heat (for non-pregnant females)
   - Priority: High
   - Associated with: Female animals with reproductive status "open"

4. **PregnancyCheck**
   - Auto-scheduled: 30-45 days after Insemination event
   - Priority: High
   - Associated with: Female animals with reproductive status "bred"

5. **BCSExamination**
   - Default periodicity: Monthly
   - Priority: Medium
   - Associated with: All animals

6. **DryOff**
   - Auto-scheduled: 60 days before expected calving date
   - Priority: High
   - Associated with: Female animals with reproductive status "confirmed pregnant"

7. **ExpectedCalving**
   - Auto-scheduled: 280 days after successful Insemination
   - Priority: High
   - Associated with: Female animals with reproductive status "confirmed pregnant"

### Custom Event Types

The system should support custom event types created by users, with configurable:
- Default periodicity
- Priority
- Applicable animal categories

## Calendar Display

The calendar should display events in an intuitive, visual manner:

- **Month View**: Default view showing all days in current month
- **Color Coding**: Event counts per day with color indicators:
  - Green: 1-3 events
  - Yellow: 4-7 events
  - Red: 8+ events
- **Day View**: Detailed list of events when clicking on a specific day
- **Grouping**: Events grouped by location, then by animal
- **Filters**: Ability to filter by eventType, animal, location, and status

## Data Validation Rules

1. **Event Type**: Must be one of the predefined values or custom types
2. **Scheduled Date**: Must be a valid date
3. **Status**: Must be one of the predefined values
4. **Priority**: Must be one of the predefined values
5. **Repeat Pattern**: Must be one of the predefined values
6. **Repeat Interval**: Must be a positive integer
7. **Reminder Time**: Must contain valid value and unit

## Reminder System Logic

The reminder system operates on several layers:

1. **Automatic Event Creation**:
   - System checks animal data daily to generate appropriate events
   - When one event is completed, related follow-up events are created
   - Recurring events are generated based on repeatPattern and repeatInterval

2. **Notification Triggers**:
   - Upcoming events (based on reminderTime)
   - Overdue events
   - Critical events (high priority)

3. **Notification Display**:
   - Dedicated "Notifications" tab showing prioritized events
   - Calendar visual indicators
   - Optional: Email or mobile push notifications

## Workflow Implementation

Based on the zootechnician workflow, the following event workflows will be implemented initially:

### 1. Health Check Workflow

1. **Initial Setup**: When an animal is added to the system, a HealthCheck event is automatically scheduled for 2 weeks from the creation date.

2. **Completion Flow**:
   - Zootechnician views upcoming health checks in the calendar
   - After examining the animal, they select the animal and click "Health check done" button
   - System updates:
     - The current event is marked as "Completed"
     - The `lastHealthCheckDate` field is updated on the animal record
     - A new HealthCheck event is automatically scheduled for 2 weeks later

3. **UI Components**:
   - Button on AnimalCard: "Health check done"
   - Confirmation dialog with optional notes field
   - Success notification confirming next check is scheduled

### 2. Heat/Estrus to Insemination Workflow

1. **Initial Setup**: No automatic setup; this workflow starts when heat signs are observed.

2. **Heat Observation Flow**:
   - Zootechnician observes heat signs in an animal
   - They select the animal and click "Note heat symptoms" button
   - System updates:
     - Creates a HeatObserved event (marked as "Completed")
     - Updates the `lastHeatDay` field on the animal record
     - Updates the animal's `reproductiveStatus` to "open"
     - Automatically schedules an Insemination event for 1 day later

3. **Insemination Flow**:
   - Zootechnician is notified when it's time for insemination
   - After performing insemination, they click "Insemination done" button
   - System updates:
     - Marks the Insemination event as "Completed"
     - Updates the animal's `reproductiveStatus` to "bred"
     - Updates the `lastInseminationDate` field on the animal record
     - Automatically schedules a PregnancyCheck event for 30 days later

4. **UI Components**:
   - Button on AnimalCard: "Note heat symptoms" 
   - Button on AnimalCard or AnimalDetails: "Insemination done"
   - Forms with optional fields for details of semen(tag, breed, serial number, name of company)

### 3. Pregnancy Check Workflow

1. **Initial Setup**: Automatically scheduled 30 days after an insemination is recorded.

2. **Completion Flow**:
   - Zootechnician is notified when it's time for pregnancy check
   - After performing the check, they select the animal and click either:
     - "Pregnancy confirmed" button
     - "Not pregnant" button
   - System updates based on result:
     - If pregnant:
       - Marks the PregnancyCheck event as "Completed"
       - Updates animal's `reproductiveStatus` to "confirmed pregnant"
       - Automatically schedules a DryOff event for later in pregnancy
     - If not pregnant:
       - Marks the PregnancyCheck event as "Completed"
       - Updates animal's `reproductiveStatus` to "open"
       - No automatic event is created (will wait for next heat observation)

3. **UI Components**:
   - Two buttons on AnimalCard or AnimalDetails: "Pregnancy confirmed" and "Not pregnant"
   - Form with optional fields for pregnancy check details (notes)

## Implementation Notes (Updated)

1. **Button-Based Event Completion**:
   - AnimalCard and AnimalDetails components need context-aware action buttons
   - Buttons should only appear when relevant (based on animal status and gender)

2. **Automated Event Generation**:
   - Event service needs to handle automatic event creation based on completed events
   - Event service should update animal fields when events are completed

3. **Calendar Integration**:
   - Calendar should clearly distinguish different event types with color coding
   - Calendar should allow filtering by event type and location
   - Day view should group events by location

4. **Phase 1 Priorities**:
   - Implement the three workflows described above
   - Create the minimal UI components needed for these workflows
   - Ensure proper animal status tracking