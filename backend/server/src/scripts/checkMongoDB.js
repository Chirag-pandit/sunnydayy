import mongoose from 'mongoose';

async function checkMongoDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sunnydayy';
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Existing collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure MongoDB is installed on your system');
    console.log('2. Start MongoDB service:');
    console.log('   - Windows: net start MongoDB');
    console.log('   - Mac: brew services start mongodb-community');
    console.log('   - Linux: sudo systemctl start mongod');
    console.log('3. Check if MongoDB is running on port 27017');
    console.log('4. If using MongoDB Atlas, update your .env file with the Atlas connection string');
    
    process.exit(1);
  }
}

checkMongoDB();
