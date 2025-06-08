import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5500;

// Correct relative path to frontend/public from backend/API
const staticPath = join(__dirname, '../frontend/public');
app.use(express.static(staticPath));

// API route
app.post('/API/populate-users', (_req, res) => {
    console.log('POST /API/populate-users hit');
    res.send('Hello world');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
