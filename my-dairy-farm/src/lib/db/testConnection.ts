import { connectToDatabase } from './mongodb';
import mongoose from 'mongoose';

/**
 * A utility script to test direct database operations.
 * To run this test:
 * 1. Navigate to the project directory
 * 2. Run: npx ts-node src/lib/db/testConnection.ts
 */
async function testDatabaseConnection() {
  try {
    // Connect to the database
    const connection = await connectToDatabase();
    console.log('Successfully connected to MongoDB');
    
    // Check if database connection is valid
    if (!mongoose.connection || !mongoose.connection.db) {
      throw new Error('Database connection is not properly established');
    }
    
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
      object_id: 'Direct Insert Test Location',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Direct insert result:', result);
    
    // Fetch back to verify
    const inserted = await animalsCollection.findOne({ _id: result.insertedId });
    console.log('Fetched document:', inserted);
    
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

// Only execute if this file is run directly
if (require.main === module) {
  testDatabaseConnection().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
}

export default testDatabaseConnection;