# Event Scheduling System Documentation

This document details how the event scheduling system works in the Dairy Farm Management application.

## Core Event Types

The application tracks several types of events with specific behaviors:

1. **HealthCheck** - Regular health examinations
   - Default scheduling: Every 14 days
   - Default priority: Medium or High in case of automatically scheduled health check after calving

2. **HeatObserved** - Recording of estrus/heat symptoms
   - Manually entered when observed
   - Not scheduled automatically
   - Updates animal status to "open"
   - Triggers insemination event scheduling

3. **Insemination** - Artificial insemination procedure
   - Auto-scheduled: 12 hours after heat observation
   - Priority: High
   - Can include semen details (bull tag, serial number, producer)
   - Updates animal status to "bred"
   - Triggers pregnancy check scheduling

4. **PregnancyCheck** - Verification of pregnancy
   - Auto-scheduled: 30 days after insemination
   - Priority: High
   - Possible outcomes: "confirmed pregnant" or "not bred"
   - Triggers dry-off and expected calving scheduling when confirmed

5. **DryOff** - Stop milking before calving
   - Auto-scheduled: 60 days before expected calving
   - Priority: High
   - Updates animal status to "dry"

6. **ExpectedCalving** - Anticipated birth date
   - Auto-scheduled: 280 days after successful insemination
   - Priority: High

7. **Calving** - Recording of actual birth
   - Manually entered when it occurs
   - Updates animal status to "not bred"
   - Triggers post-calving health check

## Reproductive Cycle Workflow

The reproductive management follows this sequence:

1. **Not Bred** → Initial status for females that haven't been inseminated yet
   - May transition to "open" when heat is observed

2. **Open** → Female showing heat/estrus symptoms, ready for insemination
   - Transition trigger: Recording heat symptoms
   - Next step: Insemination (typically 12 hours after)

3. **Bred** → Female that has been inseminated, awaiting pregnancy confirmation
   - Transition trigger: Completing insemination
   - Next step: Pregnancy check (30 days later)

4. **Confirmed Pregnant** → Pregnancy verified
   - Transition trigger: Positive pregnancy check
   - Next steps: 
     - Dry off (60 days before expected calving)
     - Expected calving (280 days after insemination)

5. **Dry** → Late-stage pregnancy, milk production stopped
   - Transition trigger: Dry-off procedure completed
   - Next step: Calving

6. After calving, status returns to **Open** to restart the cycle

## Automatic Event Scheduling Rules

Each action in the system can trigger the automatic scheduling of future events:

| Action Performed | Auto-schedules | Timeframe | Animal Status Change |
|------------------|---------------|-----------|---------------------|
| Health check completed | Next health check | 14 days later | No change |
| Heat symptoms recorded | Insemination | 12 hours later | Not bred → Open |
| Insemination completed | Pregnancy check | 30 days later | Open → Bred |
| Pregnancy confirmed | Dry-off + Expected calving | 220 days later + 280 days later | Bred → Confirmed pregnant |
| Not pregnant | None | N/A | Bred → Not bred |
| Dry-off completed | None | N/A | Confirmed pregnant → Dry |
| Calving completed | Post-calving health check | 14 days later | Dry/Confirmed pregnant → Open |

## Event Status Flow

Events follow this status progression:

1. **Pending** - Initial status when event is created/scheduled
2. **Completed** - Event has been performed and recorded
3. **Overdue** - Event date has passed without completion [NOT IMPLEMENTED]
4. **Cancelled** - Event has been manually cancelled [NOT IMPLEMENTED]

## Priority Levels

The system uses three priority levels which affect UI presentation:

- **High** - Critical events that shouldn't be missed (red indicators)
- **Medium** - Standard priority events (yellow indicators)
- **Low** - Optional or informational events (green indicators)

## Calendar Display

The calendar shows upcoming events with these features:

- Day cells are color-coded based on percentage of animals with events:
  - Green: 0-15% of animals need attention
  - Yellow: 15-30% of animals need attention
  - Red: Over 30% of animals need attention
- Events are grouped by location
- Within locations, events are grouped by animal
- Filter options allow displaying specific event types

## Location Handling

- Events inherit the location of the animal they are associated with
- If no location is assigned, they default to "Farm" location
- Calendar view allows filtering and viewing by location

## API Implementation Details

Each event workflow is implemented in the `animal-events` API route with specific handler functions:

- `handleHealthCheck`: Marks current check complete, schedules next one
- `handleHeatSymptoms`: Updates status to "open", schedules insemination
- `handleInsemination`: Updates status to "bred", schedules pregnancy check
- `handlePregnancyConfirmed`: Updates status, schedules dry-off and expected calving
- `handleNotPregnant`: Updates status to "not bred"
- `handleDryOff`: Updates status to "dry"
- `handleCalving`: Updates status to "open", schedules post-calving check
