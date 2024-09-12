const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase'; 
let db;

const connectToMongoDB = async () => {
  if (db) return db; 

  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); 
  }
};

module.exports = connectToMongoDB;
