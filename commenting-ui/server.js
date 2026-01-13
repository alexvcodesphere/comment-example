import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3002;

// Enable CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

// Serve the built script
app.use(express.static(join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`📦 Commenting UI serving at http://localhost:${PORT}`);
  console.log(`   → Script: http://localhost:${PORT}/codesphere-tools.js`);
});
