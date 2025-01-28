import mongoose from 'mongoose';
import { FileService } from '../services/FileService.js';
import Agent from '../models/Agent.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/empire-calculators', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if Missy's record already exists
        const existingAgent = await Agent.findOne({ email: 'missy@empiretitle.com' });
        if (existingAgent) {
            console.log('Missy\'s record already exists');
            return;
        }

        // Initialize FileService
        const fileService = new FileService();

        // Read Missy's photo
        const photoPath = path.join(__dirname, '..', '..', 'public', 'images', 'missy.horner.jpg');
        const photoBuffer = fs.readFileSync(photoPath);

        // Upload photo to GridFS
        console.log('Uploading photo to GridFS...');
        const uploadResult = await fileService.uploadFile(
            photoBuffer,
            'missy.horner.jpg',
            'image/jpeg'
        );

        // Create agent record
        console.log('Creating agent record...');
        const agent = new Agent({
            name: 'Missy Horner',
            email: 'missy@empiretitle.com',
            title: 'Director of Business Development',
            phone: '614-600-6833',
            photoId: uploadResult.fileId,
            photoUrl: '/api/files/' + uploadResult.fileId
        });

        await agent.save();
        console.log('Successfully initialized database with Missy\'s information');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
    }
}

// Run the initialization
initializeDatabase();
