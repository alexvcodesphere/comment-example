import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_PATH = process.env.BASE_PATH || '';

// Serve static files under the base path
app.use(BASE_PATH, express.static(__dirname));

// Also handle root for when BASE_PATH is set
if (BASE_PATH) {
  app.get('/', (req, res) => {
    res.redirect(BASE_PATH);
  });
}

app.listen(PORT, () => {
  console.log(`🎯 Target App running at http://localhost:${PORT}${BASE_PATH}`);
});
