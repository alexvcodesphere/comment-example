import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_PATH = process.env.BASE_PATH || '';

// Startup logging for debugging
console.log('='.repeat(50));
console.log('🎯 Target App - Environment Configuration');
console.log('='.repeat(50));
console.log(`PORT: ${PORT}`);
console.log(`BASE_PATH: ${BASE_PATH || '(root)'}`);
console.log(`process.env.BASE_PATH: ${process.env.BASE_PATH || '(not set)'}`);
console.log('='.repeat(50));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[Target App] ${req.method} ${req.url}`);
  next();
});

// Serve static files under the base path
if (BASE_PATH) {
  app.use(BASE_PATH, express.static(__dirname));
  app.get('/', (req, res) => {
    res.redirect(BASE_PATH);
  });
} else {
  app.use(express.static(__dirname));
}

app.listen(PORT, () => {
  console.log(`🎯 Target App running at http://localhost:${PORT}${BASE_PATH}`);
});
