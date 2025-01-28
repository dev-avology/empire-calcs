import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function testConnection() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        
        // Get database information
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('\nAvailable collections:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        console.log('\nConnection test complete!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoose.connection.close();
    }
}

// Run the test
testConnection();
