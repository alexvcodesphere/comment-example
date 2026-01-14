import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3001';
const TOOLS_URL = process.env.TOOLS_URL || 'http://localhost:3002';
const COMMENTS_FILE = join(__dirname, 'comments.json');

// Startup logging for debugging
console.log('='.repeat(50));
console.log('🔀 Codesphere Proxy - Environment Configuration');
console.log('='.repeat(50));
console.log(`NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
console.log(`PORT: ${PORT}`);
console.log(`TARGET_URL: ${TARGET_URL}`);
console.log(`TOOLS_URL: ${TOOLS_URL}`);
console.log('='.repeat(50));

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// Comments API
// ============================================

// GET /api/comments - Fetch all comments
app.get('/api/comments', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(COMMENTS_FILE, 'utf-8'));
    res.json(data);
  } catch (error) {
    console.error('[Proxy] Error reading comments:', error);
    res.status(500).json({ error: 'Failed to read comments' });
  }
});

// POST /api/comments - Create a new comment
app.post('/api/comments', (req, res) => {
  try {
    const { selector, xPercentage, yPercentage, content, viewport } = req.body;

    if (!selector || xPercentage === undefined || yPercentage === undefined || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = JSON.parse(readFileSync(COMMENTS_FILE, 'utf-8'));

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      selector,
      xPercentage,
      yPercentage,
      content,
      author: {
        id: 'user_demo',
        name: 'Demo User',
        avatar: 'https://i.pravatar.cc/48?img=12'
      },
      createdAt: new Date().toISOString(),
      resolved: false,
      thread: [],
      viewport: viewport || null
    };

    data.comments.push(newComment);
    writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));

    console.log(`[Proxy] Created comment on: ${selector} (viewport: ${viewport?.width}x${viewport?.height})`);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('[Proxy] Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// DELETE /api/comments/:id - Delete a comment
app.delete('/api/comments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(readFileSync(COMMENTS_FILE, 'utf-8'));

    const index = data.comments.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    data.comments.splice(index, 1);
    writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));

    console.log(`[Proxy] Deleted comment: ${id}`);
    res.status(204).send();
  } catch (error) {
    console.error('[Proxy] Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// PATCH /api/comments/:id/resolve - Resolve a comment
app.patch('/api/comments/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(readFileSync(COMMENTS_FILE, 'utf-8'));

    const comment = data.comments.find(c => c.id === id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.resolved = true;
    writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));

    console.log(`[Proxy] Resolved comment: ${id}`);
    res.json(comment);
  } catch (error) {
    console.error('[Proxy] Error resolving comment:', error);
    res.status(500).json({ error: 'Failed to resolve comment' });
  }
});

// PATCH /api/comments/:id/position - Update comment position (after drag)
app.patch('/api/comments/:id/position', (req, res) => {
  try {
    const { id } = req.params;
    const { selector, xPercentage, yPercentage, viewport } = req.body;
    const data = JSON.parse(readFileSync(COMMENTS_FILE, 'utf-8'));

    const comment = data.comments.find(c => c.id === id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.selector = selector;
    comment.xPercentage = xPercentage;
    comment.yPercentage = yPercentage;
    comment.viewport = viewport;
    writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));

    console.log(`[Proxy] Updated position for: ${id}`);
    res.json(comment);
  } catch (error) {
    console.error('[Proxy] Error updating comment position:', error);
    res.status(500).json({ error: 'Failed to update comment position' });
  }
});


// ============================================
// HTML Proxy with Script Injection
// ============================================

app.use(async (req, res) => {
  try {
    // Fetch from target app (Next.js serves routes directly, not /index.html)
    const targetUrl = `${TARGET_URL}${req.path}`;
    console.log(`[Proxy] Fetching: ${targetUrl}`);

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).send(`Target returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';

    // Only inject into HTML
    if (contentType.includes('text/html')) {
      let html = await response.text();

      // Inject Codesphere tools script before </body>
      const injectScript = `
<!-- Codesphere Feedback Tools (Injected) -->
<script src="${TOOLS_URL}/codesphere-tools.js"></script>
`;
      html = html.replace('</body>', `${injectScript}</body>`);

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      console.log(`[Proxy] Injected script into: ${req.path}`);
    } else {
      // Pass through other assets
      res.setHeader('Content-Type', contentType);
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('[Proxy] Error:', error);
    res.status(502).send('Proxy error: Could not connect to target app');
  }
});

app.listen(PORT, () => {
  console.log(`🔀 Codesphere Proxy running at http://localhost:${PORT}`);
  console.log(`   → Proxying to Target App at ${TARGET_URL}`);
  console.log(`   → Injecting Tools from ${TOOLS_URL}`);
});
