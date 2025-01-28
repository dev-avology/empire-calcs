import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());

// Serve static files from multiple directories
app.use(express.static('public'));
app.use('/src', express.static('src'));
app.use('/assets', express.static('assets'));

// Serve test files from root
app.use(express.static(__dirname));

// Parse JSON payloads
app.use(express.json());

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
