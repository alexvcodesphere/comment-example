import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const BASE_PATH = process.env.BASE_PATH || '';

// Startup logging for debugging
console.log('='.repeat(50));
console.log('📦 Commenting UI - Environment Configuration');
console.log('='.repeat(50));
console.log(`PORT: ${PORT}`);
console.log(`BASE_PATH: ${BASE_PATH || '(root)'}`);
console.log(`process.env.BASE_PATH: ${process.env.BASE_PATH || '(not set)'}`);
console.log('='.repeat(50));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[Commenting UI] ${req.method} ${req.url}`);
  next();
});

// Enable CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

// Serve the built script under the base path
if (BASE_PATH) {
  app.use(BASE_PATH, express.static(join(__dirname, 'dist')));
  app.get('/', (req, res) => {
    res.redirect(BASE_PATH);
  });
} else {
  app.use(express.static(join(__dirname, 'dist')));
}

app.listen(PORT, () => {
  console.log(`📦 Commenting UI serving at http://localhost:${PORT}${BASE_PATH}`);
  console.log(`   → Script: http://localhost:${PORT}${BASE_PATH}/codesphere-tools.js`);
});
