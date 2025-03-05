const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * A utility script to test direct database operations.
 */
async function testDatabaseConnection() {
  try {
    // Manually load environment variable from .env file
    let mongoUri = 'mongodb://localhost:27017/my-dairy-farm'; // Default fallback
    
    try {
      // Try to find and parse the .env file
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = envContent.split('\n');
        
        for (const line of envVars) {
          if (line.startsWith('MONGODB_URI=')) {
            mongoUri = line.substring('MONGODB_URI='.length).trim();
            break;
          }
        }
      }
    } catch (err) {
      console.log('No .env file found or error parsing it. Using default URI.');
    }
    
    console.log('Connecting to MongoDB using URI:', mongoUri);
    
    // Connect directly to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB');
    
    // Get direct access to the collection
    const db = mongoose.connection.db;
    const animalsCollection = db.collection('animals');

    // Directly insert a test animal with object_id
    const result = await animalsCollection.insertOne({
      name: 'Test Direct Insert',
      tag: `TEST-${Date.now()}`,
      gender: 'female',
      category: 'adult',
      birthDate: new Date(),
      status: 'healthy',
      object_id: 'Direct Insert Test Location', // Explicitly setting object_id
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Direct insert result:', result);
    
    // Fetch back to verify
    const inserted = await animalsCollection.findOne({ _id: result.insertedId });
    console.log('Fetched document:', inserted);
    console.log('object_id in fetched document:', inserted.object_id); // Check if object_id exists
    
    console.log('Test complete');
    
    // Clean up
    await animalsCollection.deleteOne({ _id: result.insertedId });
    console.log('Test document deleted');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

// Execute the test
testDatabaseConnection().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
