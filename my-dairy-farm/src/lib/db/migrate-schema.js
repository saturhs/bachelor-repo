const mongoose = require('mongoose');

// Connect to MongoDB
async function migrateSchema() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/my-dairy-farm');
    console.log('Connected to MongoDB');
    
    // Get the animals collection directly
    const db = mongoose.connection.db;
    const animalsCollection = db.collection('animals');
    
    // First, verify the current schema
    const sampleAnimal = await animalsCollection.findOne({});
    console.log('Current animal document structure:', sampleAnimal);
    
    // Update all documents to rename object_id to location
    const updateResult = await animalsCollection.updateMany(
      {},  // match all documents
      [
        { 
          $addFields: { 
            // Copy object_id to location if it exists, otherwise use an empty string
            location: { $ifNull: ['$object_id', ''] } 
          } 
        },
        { 
          $unset: ['object_id'] // Remove the old field
        }
      ]
    );
    
    console.log(`Updated ${updateResult.modifiedCount} documents`);
    
    // Verify the changes
    const updatedSample = await animalsCollection.findOne({});
    console.log('Updated animal document structure:', updatedSample);
    
    console.log('Migration complete');
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateSchema().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
