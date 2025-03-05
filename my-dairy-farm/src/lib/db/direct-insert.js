const mongoose = require('mongoose');

async function directInsert() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/my-dairy-farm');
    console.log('Connected to MongoDB');
    
    // Access the collection directly
    const db = mongoose.connection.db;
    const animalsCollection = db.collection('animals');
    
    // Generate a unique tag
    const tag = `DIRECT-${Date.now()}`;
    
    // Create a document with location field
    const animal = {
      name: "Direct Insert Test",
      tag: tag,
      gender: "female",
      category: "adult",
      birthDate: new Date(),
      status: "healthy",
      location: "Direct Insert Location Test",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Inserting animal with location:", animal.location);
    
    // Insert the document
    const result = await animalsCollection.insertOne(animal);
    console.log("Insert result:", result);
    
    // Verify the document was inserted correctly
    const inserted = await animalsCollection.findOne({ _id: result.insertedId });
    console.log("Inserted document:", inserted);
    console.log("Location field in inserted document:", inserted.location);
    
    // Test fetch API to see how it transforms the data
    console.log("\nNow testing API...");
    const apiResponse = await fetch(`http://localhost:3000/api/animals?id=${result.insertedId.toString()}`);
    const apiData = await apiResponse.json();
    console.log("API response:", apiData);
    console.log("Location via API:", apiData.location);
    
    // Clean up
    await animalsCollection.deleteOne({ _id: result.insertedId });
    console.log("\nTest document deleted");
    
    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed");
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

directInsert().then(() => {
  console.log("\nTest completed");
  process.exit(0);
}).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
