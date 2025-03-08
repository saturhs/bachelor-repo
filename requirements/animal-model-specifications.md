# Animal Model Specifications

This document outlines the agreed specifications for the Animal model used throughout the dairy farm application.

## Core Fields

| Field | Type | Description | Validation | Example |
|-------|------|-------------|------------|---------|
| _id | ObjectId | MongoDB's auto-generated ID | Valid MongoDB ObjectId | `60d21b4667d0d8992e610c85` |
| tag | String | Cow's eartag number | Format: 2 uppercase letters followed by 12 digits | `PL123456789012` |
| gender | String | Animal's sex | Enum: `female`, `male` | `female` |
| birthDate | Date | Birth date of the animal | Required, valid date | `2020-01-15` |
| breed | String | Animal's breed | Optional | `Holstein` |
| acquisitionDate | Date | When the animal was acquired | Optional | `2020-03-20` |
| acquisitionType | String | How the animal was acquired | Enum: `born on farm`, `purchased` | `born on farm` |
| mothersTag | String | Tag ID of the animal's mother | Optional | `PL987654321098` |
| fathersTag | String | Tag ID of the animal's father | Optional | `PL876543210987` |
| currentBCS | Number | Body Condition Score | Scale 1-5 | `3.5` |
| currentWeight | Number | Weight in kg | Optional | `650` |
| lastHealthCheckDate | Date | Date of last veterinary examination | Optional | `2023-06-10` |
| lastHeatDay | Date | Date of the animal's last heat period | Optional | `2023-05-28` |
| lastInseminationDate | Date | Date of the animal's last insemination | Optional | `2023-05-29` |
| reproductiveStatus | String | Current breeding status | Enum: `not bred`, `bred`, `confirmed pregnant`, `open`, `dry` | `bred` |
| lactationStatus | String | Current lactation status | Enum: `lactating`, `dry`, `not applicable` | `lactating` |
| notes | String | Additional information | Optional | `Needs special diet` |
| location | String | Building or pen where animal is housed | Optional | `Barn A` |
| tags | Array of Strings | Additional categorization tags | Optional | `["special attention", "show quality"]` |
| category | String | Age category | Enum: `adult`, `calf` | `adult` |
| createdAt | Date | Record creation timestamp | Auto-generated | `2023-01-15T12:00:00Z` |
| updatedAt | Date | Record last update timestamp | Auto-generated | `2023-04-20T15:30:00Z` |

## AnimalCard Display

The AnimalCard component should be updated to display only the most important information:

- **Tag**: Unique identifier
- **Age**: Calculated from birthDate
- **Breed**: Animal's breed
- **BCS**: Body Condition Score
- **Last Health Check Date**: Most recent examination
- **Reproductive Status**: Current breeding status

All other details should be accessible through a popover/modal when clicking on the animal card.

## Data Validation Rules

1. **Tag Format**: Must be 2 uppercase letters followed by 12 digits (e.g., PL123456789012)
2. **BCS Range**: Must be between 1 and 5, can include decimal points
3. **Gender**: Must be either "female" or "male"
4. **Reproductive Status**: One of the predefined values
5. **Lactation Status**: One of the predefined values
6. **Acquisition Type**: One of the predefined values

## Implementation Notes

1. The Animal interface in TypeScript will need to be updated to reflect these changes
2. The MongoDB schema will need validation rules added
3. The AnimalCard component will need to be redesigned to show fewer fields and implement a popover for details
4. API routes will need to be updated to handle the new fields
