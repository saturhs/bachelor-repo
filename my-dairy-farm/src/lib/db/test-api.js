// This version uses the built-in fetch API in modern Node.js

async function testAnimalsAPI() {
  try {
    console.log('Testing Animals API...');
    
    // 1. Create a new animal with location field
    const newAnimal = {
      name: 'API Test Cow',
      tag: `API-TEST-${Date.now()}`,
      gender: 'female',
      category: 'adult',
      birthDate: new Date().toISOString().split('T')[0],
      status: 'healthy',
      location: 'API Test Location',
    };
    
    console.log('\nPOSTing new animal with data:', JSON.stringify(newAnimal, null, 2));
    
    // Make the POST request
    const createResponse = await fetch('http://localhost:3000/api/animals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAnimal),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create animal: ${createResponse.status} ${createResponse.statusText}`);
    }
    
    const createdAnimal = await createResponse.json();
    console.log('\nCreated animal:', JSON.stringify(createdAnimal, null, 2));
    
    // 2. Get the animal by ID to verify it has the location field
    console.log(`\nGetting animal with ID: ${createdAnimal.id}`);
    
    const getResponse = await fetch(`http://localhost:3000/api/animals?id=${createdAnimal.id}`);
    
    if (!getResponse.ok) {
      throw new Error(`Failed to get animal: ${getResponse.status} ${getResponse.statusText}`);
    }
    
    const retrievedAnimal = await getResponse.json();
    console.log('\nRetrieved animal:', JSON.stringify(retrievedAnimal, null, 2));
    
    // 3. Verify the location field exists and has the correct value
    if (retrievedAnimal.location === 'API Test Location') {
      console.log('\n✅ SUCCESS: Location field was correctly saved and retrieved!');
    } else {
      console.log('\n❌ ERROR: Location field issue:');
      console.log(`- Expected: 'API Test Location'`);
      console.log(`- Actual: '${retrievedAnimal.location}'`);
      
      // Debug information
      console.log('\nDocument fields:');
      for (const [key, value] of Object.entries(retrievedAnimal)) {
        console.log(`- ${key}: ${value}`);
      }
    }
    
    // 4. Clean up - delete the test animal
    console.log(`\nCleaning up: Deleting test animal with ID: ${createdAnimal.id}`);
    
    const deleteResponse = await fetch(`http://localhost:3000/api/animals?id=${createdAnimal.id}`, {
      method: 'DELETE',
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete animal: ${deleteResponse.status} ${deleteResponse.statusText}`);
    }
    
    const deleteResult = await deleteResponse.json();
    console.log('\nDelete result:', JSON.stringify(deleteResult, null, 2));
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Execute the test
testAnimalsAPI().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
