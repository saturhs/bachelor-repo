# Event Types in My Dairy Farm Application

## Built-in System Events

These events are built into the system and have specific workflows and automations:

### Reproductive Management Events

1. **HeatObserved**
   - Manually recorded when heat symptoms are observed
   - Updates animal status to "open"
   - Automatically schedules an Insemination event 12 hours later
   - Priority: High

2. **Insemination**
   - Can be auto-scheduled (12 hours after heat observation) or manually created
   - Can include semen details (bullTag, serialNumber, producer)
   - Updates animal status to "bred"
   - Automatically schedules a PregnancyCheck event 30 days later (configurable)
   - Priority: High

3. **PregnancyCheck**
   - Scheduled automatically 30 days after insemination (configurable)
   - Has two possible outcomes: "confirmed pregnant" or "not pregnant"
   - When positive, updates animal status to "confirmed pregnant"
   - When negative, updates animal status to "not bred"
   - When positive, schedules DryOff and ExpectedCalving events
   - Priority: High

4. **DryOff**
   - Scheduled automatically 60 days before expected calving (configurable)
   - When completed, updates animal status to "dry"
   - Priority: High

5. **ExpectedCalving**
   - Scheduled automatically 280 days after successful insemination (configurable)
   - Used as a reminder for the expected birth
   - Priority: High

6. **Calving**
   - Manually recorded when calving occurs
   - Updates animal status to "not bred"
   - Automatically schedules a post-calving health check
   - Priority: High

### Health Management Events

7. **HealthCheck**
   - Regular health examinations
   - Can be scheduled automatically (every 14 days, configurable)
   - Special case: Post-calving health check (automatically scheduled 14 days after calving)
   - Default priority: Medium (High for post-calving checks)

## Custom Event Types

Users can create their own custom event types with the following configurable parameters:

- **Name**: User-defined name for the event type
- **Description**: Details about the event (with character limit)
- **Default Priority**: High, Medium, or Low
- **Reminder Time**: 
  - Value: Numeric value
  - Unit: hour, day, week, or month
- **Animal Categories**: Which types of animals this event applies to:
  - adult female
  - adult male
  - calf

## Event Status Values

All events can have one of the following status values:

1. **Pending**: Default status when an event is created/scheduled
2. **Completed**: Event has been performed and recorded
3. **Overdue**: Event date has passed without completion (not fully implemented)
4. **Cancelled**: Event has been manually cancelled (not fully implemented)

## Priority Levels

The system uses three priority levels that affect UI presentation:

- **High**: Critical events that shouldn't be missed (red indicators)
- **Medium**: Standard priority events (yellow indicators)
- **Low**: Optional or informational events (green indicators)

## Event Results

Some events can store result values:

- **PregnancyCheck**: Can have results "positive" or "negative"
- Other events: No specific result values, but can have notes
