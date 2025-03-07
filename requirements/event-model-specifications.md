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

## Implementation Notes

1. The Event interface in TypeScript will need to be created
2. The MongoDB schema will need validation rules added
3. A recurring job service will be required to:
   - Check for events requiring notifications
   - Generate recurring events
   - Update overdue statuses
4. The calendar component will need to be implemented with:
   - Month/week/day views
   - Color-coded event indicators
   - Filtering capabilities
5. API routes will need to be created for CRUD operations
6. Integration with the Animal model will be required to access animal data for event generation