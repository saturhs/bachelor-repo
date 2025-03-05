const mongoose = require('mongoose');

async function fixSchema() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/my-dairy-farm');
    console.log('Connected to MongoDB');
    
    // Get direct access to the collection
    const db = mongoose.connection.db;
    const animalsCollection = db.collection('animals');
    
    console.log('Examining current documents...');
    const sample = await animalsCollection.find({}).limit(3).toArray();
    console.log('Sample documents:', JSON.stringify(sample, null, 2));
    
    // Step 1: Rename object_id to location for all documents that have object_id
    console.log('Migrating object_id to location...');
    const renameResult = await animalsCollection.updateMany(
      { object_id: { $exists: true } }, // Find documents with object_id
      [
        { 
          $set: { 
            location: "$object_id" // Copy object_id to location
          } 
        },
      ]
    );
    console.log(`Updated ${renameResult.modifiedCount} documents with object_id field`);
    
    // Step 2: Remove object_id from all documents
    console.log('Removing old object_id field...');
    const removeResult = await animalsCollection.updateMany(
      {}, // All documents
      { $unset: { object_id: "" } }
    );
    console.log(`Removed object_id from ${removeResult.modifiedCount} documents`);
    
    // Step 3: Make sure location exists in all documents
    console.log('Ensuring location field exists on all documents...');
    const setDefaultResult = await animalsCollection.updateMany(
      { location: { $exists: false } }, // Find documents without location
      { $set: { location: "" } }
    );
    console.log(`Added location field to ${setDefaultResult.modifiedCount} documents`);
    
    // Step 4: Update the schema in a way that forces the changes to take effect
    // First find an animal to update
    const animalToUpdate = await animalsCollection.findOne({});
    if (animalToUpdate) {
      // Update it to trigger schema verification
      await animalsCollection.updateOne(
        { _id: animalToUpdate._id },
        { $set: { updatedAt: new Date() } }
      );
      console.log(`Updated one document to refresh schema: ${animalToUpdate._id}`);
    }
    
    // Verify changes
    console.log('\nVerifying changes...');
    const verificationSample = await animalsCollection.find({}).limit(3).toArray();
    console.log('After migration sample:', JSON.stringify(verificationSample, null, 2));
    
    // Clean connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    console.log('\n✅ Migration complete! All animals should now have location field instead of object_id');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
fixSchema().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
