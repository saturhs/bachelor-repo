1. Custom Event Types:
Lets use fields for:
a) name
b) description (with some rational character limit)
c) default priority (high/medium/low)
d) default reminder interval
e) animal categories (multiple choice available)
Store them as customEvent document in customEvents collection.

In settings page just add a button "Add custom event type" that opens a form window, same as while adding an animal or adding info about semen. Under this button display a list of added events with possibility to delete them. Update calendarView to add names of them in filter option. Display reminders in calendar accordingly to set values of reminder interval.

User flow: a) user creates a new event type with specific parameters b) user can schedule the event by pressing "+" button on animal card and then picking right one from the list of custom events. That includes implementation of "+" button in #file:AnimalCard.tsx c) event of this type follow the specified default settings
