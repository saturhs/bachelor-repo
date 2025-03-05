const mongoose = require('mongoose');

async function testInsert() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/my-dairy-farm');
    console.log('Connected to MongoDB');
    
    // Get the animals collection directly
    const db = mongoose.connection.db;
    const animalsCollection = db.collection('animals');
    
    // Insert test animal with location field
    const result = await animalsCollection.insertOne({
      name: 'Test Location Field',
      tag: `TEST-LOC-${Date.now()}`,
      gender: 'male',
      category: 'adult',
      birthDate: new Date(),
      status: 'healthy',
      location: 'Test Location Value', // Using location field
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Insert result:', result);
    
    // Fetch back the document
    const insertedDoc = await animalsCollection.findOne({ _id: result.insertedId });
    console.log('Inserted document:', insertedDoc);
    
    // Clean up
    await animalsCollection.deleteOne({ _id: result.insertedId });
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Test insert failed:', error);
  }
}

testInsert().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
