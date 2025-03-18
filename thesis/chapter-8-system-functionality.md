# Chapter 8: System Functionality

This chapter details the key functional components of the dairy farm management system, demonstrating how the implementation fulfills the requirements established in the problem analysis phase. Each section examines a specific aspect of the system's functionality, with code examples from the actual implementation.

## 8.1 Animal Management Features

### 8.1.1 Registration and Tracking

The system provides comprehensive tools for registering and tracking animals in the dairy farm. Each animal is assigned a unique identifier and stored in the MongoDB database using the Animal model.

```typescript
// From /my-dairy-farm/src/lib/db/models/Animal.ts
const AnimalSchema = new mongoose.Schema({
  tagNumber: { type: String, required: true, unique: true },
  name: { type: String },
  birthDate: { type: Date, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Female', 'Male'], 
  },
  reproductiveStatus: {
    type: String,
    enum: ['Open', 'Inseminated', 'Pregnant', 'Fresh', 'Dry', 'Not Applicable'],
    default: 'Open'
  },
  location: { type: String },
  // Additional fields...
});
```

The registration interface allows farm managers to input essential data about each animal, including identification tags, birth dates, gender, and current location within the farm.

### 8.1.2 Filtering and Categorization

The system implements advanced filtering capabilities to help users manage large herds efficiently. Filters can be applied based on various parameters including:

- Reproductive status
- Location
- Age group
- Health status
- Upcoming events

```typescript
// Example filtering implementation from animal listing component
const filterAnimals = (animals: Animal[], filters: FilterCriteria) => {
  return animals.filter(animal => {
    // Filter by reproductive status
    if (filters.reproductiveStatus && 
        animal.reproductiveStatus !== filters.reproductiveStatus) {
      return false;
    }
    
    // Filter by location
    if (filters.location && animal.location !== filters.location) {
      return false;
    }
    
    // Additional filter conditions...
    
    return true;
  });
};
```

### 8.1.3 Action Buttons and Status Management

Each animal record features contextual action buttons that dynamically adjust based on the animal's current reproductive status. This implementation follows the state machine pattern described in previous chapters.

```typescript
// Example of dynamic action button rendering
const getAvailableActions = (animal: Animal) => {
  switch (animal.reproductiveStatus) {
    case 'Open':
      return ['Record Heat', 'Schedule Insemination'];
    case 'Inseminated':
      return ['Pregnancy Check', 'Record Heat'];
    case 'Pregnant':
      return ['Dry Off', 'Record Calving'];
    case 'Fresh':
      return ['Record Heat'];
    default:
      return [];
  }
};
```

Status changes are tracked and recorded as events in the system, maintaining a comprehensive history of each animal's reproductive cycle.

## 8.2 Calendar View Implementation

### 8.2.1 Monthly View Design

The calendar view provides an intuitive interface for visualizing scheduled events across the farm. The implementation uses a custom calendar component built with React and Tailwind CSS.

```typescript
// From /my-dairy-farm/src/components/ui/CalendarView.tsx
const CalendarView = ({ events, onDateSelect, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Calendar generation logic
  const generateCalendarDays = (month: Date) => {
    // Logic to generate days for the calendar
    // Including previous month, current month and next month days
  };
  
  // Event rendering for each calendar day
  const renderEventsForDay = (day: Date) => {
    const dayEvents = events.filter(event => 
      isSameDay(parseISO(event.date), day)
    );
    
    return dayEvents.map(event => (
      <EventIndicator 
        key={event.id} 
        event={event} 
        onClick={() => onEventClick(event)} 
      />
    ));
  };
  
  // Component rendering with month navigation, weekday headers, and day cells
};
```

### 8.2.2 Event Filtering and Display

The calendar allows filtering events by type, status, and location to help users focus on relevant information:

```typescript
// Event filtering functionality
const filterEvents = (events: Event[], filters: EventFilters) => {
  return events.filter(event => {
    if (filters.eventType && event.eventType !== filters.eventType) {
      return false;
    }
    
    if (filters.status && event.status !== filters.status) {
      return false;
    }
    
    if (filters.location) {
      // Get animal associated with event
      const animal = getAnimal(event.animalId);
      if (animal.location !== filters.location) {
        return false;
      }
    }
    
    return true;
  });
};
```

### 8.2.3 Day Detail View with Location Grouping

When a specific day is selected, the system displays a detailed view of all events scheduled for that day, grouped by location to facilitate work planning:

```typescript
// Example of location-based grouping from CalendarView.tsx
const getDayDetailView = (selectedDate: Date, events: Event[]) => {
  // Filter events for the selected date
  const dateEvents = events.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );
  
  // Group events by location
  const eventsByLocation = dateEvents.reduce((groups, event) => {
    const animal = getAnimal(event.animalId);
    const location = animal.location || 'Unassigned';
    
    if (!groups[location]) {
      groups[location] = [];
    }
    
    groups[location].push(event);
    return groups;
  }, {} as Record<string, Event[]>);
  
  // Return structured location-grouped events
  return Object.entries(eventsByLocation).map(([location, locationEvents]) => ({
    location,
    events: locationEvents,
    animalCount: getAnimalIdsForLocation(location).length
  }));
};
```

### 8.2.4 Workload Visualization

The calendar includes visual indicators for daily workload, helping farm managers allocate resources effectively:

```typescript
// Workload calculation and visualization
const calculateDailyWorkload = (day: Date, events: Event[]) => {
  const dayEvents = events.filter(event => 
    isSameDay(parseISO(event.date), day)
  );
  
  // Determine workload category based on event count and types
  if (dayEvents.length > 10) return 'high';
  if (dayEvents.length > 5) return 'medium';
  if (dayEvents.length > 0) return 'low';
  return 'none';
};

const WorkloadIndicator = ({ level }) => {
  const colorClass = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
    none: 'bg-gray-200'
  }[level];
  
  return (
    <div className={`h-1.5 w-full rounded-full ${colorClass}`} 
         title={`${level} workload`} />
  );
};
```

## 8.3 Settings and Configuration Options

### 8.3.1 Custom Event Type Management

The system allows users to define custom event types suited to their farm's specific needs:

```typescript
// From /my-dairy-farm/src/lib/db/models/CustomEventType.ts
const CustomEventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true, default: '#3B82F6' },
  icon: { type: String },
  defaultDuration: { type: Number, default: 60 }, // minutes
  category: {
    type: String,
    enum: ['Reproductive', 'Health', 'Management', 'Other'],
    default: 'Other'
  },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
});
```

The interface allows farm managers to create, edit, and delete custom event types, with options for color-coding and categorization.

### 8.3.2 System Parameter Configuration

Reproductive cycle parameters can be configured to match the specific needs of different herds and breeding programs:

```typescript
// Example of configurable reproductive parameters
const reproductiveParameters = {
  voluntaryWaitingPeriod: 60, // days after calving before insemination
  heatCycleLength: 21, // average days between heat cycles
  pregnancyCheckDelay: 30, // days after insemination for pregnancy check
  dryOffBeforeCalving: 60, // days before expected calving to dry off
  // Other configurable parameters
};
```

These parameters directly influence the scheduling algorithms described in Chapter 7.

### 8.3.3 Data Export Capabilities

The system provides functionality to export farm data in various formats for reporting and analysis:

```typescript
// Example data export handler from API endpoint
const exportAnimalData = async (req: NextRequest) => {
  try {
    // Get filter criteria from request
    const { format, filters } = await req.json();
    
    // Fetch filtered animal data
    const animals = await getFilteredAnimals(filters);
    
    // Format data according to requested export format
    let exportData;
    switch (format) {
      case 'csv':
        exportData = convertToCSV(animals);
        break;
      case 'excel':
        exportData = await generateExcelFile(animals);
        break;
      case 'pdf':
        exportData = await generatePDFReport(animals);
        break;
      default:
        exportData = JSON.stringify(animals);
    }
    
    return new NextResponse(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="animal-data.${format}"`,
        'Content-Type': getContentType(format)
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to export data' }),
      { status: 500 }
    );
  }
};
```

## 8.4 Statistical Analysis and Reporting Features

### 8.4.1 Conception Rate Visualization

The system tracks and visualizes conception rates over time, providing valuable insights into herd fertility:

```typescript
// From /my-dairy-farm/src/app/api/statistics/conception-rate/route.ts
const getConceptionRateData = async () => {
  // Get all insemination events with subsequent pregnancy checks
  const inseminationEvents = await Event.find({ 
    eventType: 'Insemination',
    status: 'Completed'
  }).sort({ date: 1 });
  
  // Group by month and calculate success rates
  const monthlyData = inseminationEvents.reduce((acc, event) => {
    // Find corresponding pregnancy check event
    const pregnancyCheck = await Event.findOne({
      animalId: event.animalId,
      eventType: 'Pregnancy Check',
      relatedEventId: event._id
    });
    
    // Extract month/year and update stats
    const date = parseISO(event.date);
    const monthKey = format(date, 'yyyy-MM');
    
    if (!acc[monthKey]) {
      acc[monthKey] = { total: 0, successful: 0 };
    }
    
    acc[monthKey].total += 1;
    if (pregnancyCheck?.result === 'Positive') {
      acc[monthKey].successful += 1;
    }
    
    return acc;
  }, {});
  
  // Calculate percentages and format for visualization
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    rate: (data.successful / data.total) * 100,
    total: data.total
  }));
};
```

### 8.4.2 Pregnancy Distribution Analysis

The system analyzes and visualizes the distribution of pregnancies across the herd:

```typescript
// Pregnancy distribution analysis implementation
const getPregnancyDistributionData = async () => {
  // Find all pregnant animals
  const pregnantAnimals = await Animal.find({
    reproductiveStatus: 'Pregnant'
  });
  
  // Calculate days pregnant for each animal
  const pregnancyData = await Promise.all(
    pregnantAnimals.map(async animal => {
      // Find the successful insemination event
      const inseminationEvent = await Event.findOne({
        animalId: animal._id,
        eventType: 'Insemination',
        status: 'Completed',
        result: 'Successful'
      }).sort({ date: -1 });
      
      if (!inseminationEvent) return null;
      
      const daysPregnant = differenceInDays(
        new Date(),
        parseISO(inseminationEvent.date)
      );
      
      return {
        animalId: animal._id,
        tagNumber: animal.tagNumber,
        daysPregnant,
        expectedCalvingDate: addDays(
          parseISO(inseminationEvent.date), 
          280 // Average gestation period
        )
      };
    })
  );
  
  // Group into trimester distribution
  const distribution = pregnancyData.filter(Boolean).reduce((acc, data) => {
    if (data.daysPregnant <= 90) acc.firstTrimester++;
    else if (data.daysPregnant <= 180) acc.secondTrimester++;
    else acc.thirdTrimester++;
    return acc;
  }, { firstTrimester: 0, secondTrimester: 0, thirdTrimester: 0 });
  
  return distribution;
};
```

### 8.4.3 Calving Distribution Throughout the Year

The system provides visualization of calving events throughout the year to help with resource planning:

```typescript
// Calving distribution analysis
const getCalvingDistributionData = async (year = new Date().getFullYear()) => {
  // Get all calving events for the specified year
  const startDate = new Date(year, 0, 1); // January 1st
  const endDate = new Date(year, 11, 31); // December 31st
  
  const calvingEvents = await Event.find({
    eventType: 'Calving',
    status: 'Completed',
    date: {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  // Group by month
  const monthlyDistribution = Array(12).fill(0);
  
  calvingEvents.forEach(event => {
    const date = parseISO(event.date);
    const month = date.getMonth(); // 0-indexed month
    monthlyDistribution[month]++;
  });
  
  // Format for visualization
  return monthlyDistribution.map((count, index) => ({
    month: format(new Date(year, index, 1), 'MMM'),
    count
  }));
};
```

## 8.5 Summary

This chapter presented the key functional components of the dairy farm management system. The animal management features provide comprehensive tools for tracking and managing individual animals, while the calendar view offers an intuitive interface for event visualization and planning. The system's configurability allows it to be tailored to specific farm needs, and the statistical analysis tools provide valuable insights into herd performance.

The implementation demonstrates how the theoretical concepts discussed in earlier chapters have been translated into practical features that address the requirements identified during problem analysis. Each component has been designed with user needs in mind, ensuring that the system remains both powerful and accessible to farm managers regardless of their technical expertise.
