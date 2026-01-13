# Codesphere Feedback Overlay - Injection PoC

A proof-of-concept demonstrating **Figma-style commenting tools** that can be injected into any web application without modifying its source code. This simulates how Codesphere could overlay feedback tools onto customer deployments.

![Architecture](https://img.shields.io/badge/Architecture-Three--Tier%20Injection-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Shadow DOM](https://img.shields.io/badge/Isolation-Shadow%20DOM-green)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Browser       │────▶│  Proxy (:3000)  │────▶│ Target (:3001)  │
│   localhost:3000│     │  Injects script │     │ Black-box site  │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ UI Server(:3002)│
                        │ codesphere-     │
                        │ tools.js (IIFE) │
                        └─────────────────┘
```

| Server            | Port | Purpose                                                                            |
| ----------------- | ---- | ---------------------------------------------------------------------------------- |
| **Proxy**         | 3000 | Entry point. Fetches HTML from target, injects `<script>` tag, serves comments API |
| **Target App**    | 3001 | Simulated customer site with zero knowledge of commenting system                   |
| **Commenting UI** | 3002 | React overlay bundled as standalone IIFE, mounted in Shadow DOM                    |

## ✨ Features

- **Zero-Config Injection** - Commenting tools appear on any site passing through the proxy
- **Shadow DOM Isolation** - Overlay CSS is completely isolated from target site styles
- **Robust Selector Engine** - Generates unique CSS selectors (ID → class → nth-of-type fallback)
- **Relative Anchoring** - Pins stored as `selector + x/yPercentage` for resize-safe positioning
- **Draggable Pins** - Click and drag any pin to reposition; changes persist to JSON
- **Scroll/Resize Sync** - Pins follow their target elements via `MutationObserver` + event listeners
- **Viewport Metadata** - Each comment stores the viewport dimensions when created

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/alexvcodesphere/comment-example.git
cd comment-example

# Install all dependencies
cd target-app && npm install && cd ..
cd commenting-ui && npm install && cd ..
cd proxy && npm install && cd ..

# Build the commenting UI bundle
cd commenting-ui && npm run build && cd ..

# Start all three servers (in separate terminals)
cd target-app && npm start      # Terminal 1: Port 3001
cd commenting-ui && npm run serve  # Terminal 2: Port 3002
cd proxy && npm start           # Terminal 3: Port 3000

# Open browser
open http://localhost:3000
```

## 📁 Project Structure

```
comments-test/
├── target-app/           # Port 3001 - Simulated customer site
│   ├── index.html        # Rich HTML with aggressive CSS
│   ├── styles.css        # Uses !important to test isolation
│   └── server.js         # Express static server
│
├── commenting-ui/        # Port 3002 - React overlay (IIFE bundle)
│   ├── src/
│   │   ├── main.tsx              # Shadow DOM mounting
│   │   ├── CodesphereOverlay.tsx # Main React component
│   │   ├── styles.ts             # Isolated CSS-in-JS
│   │   ├── api.ts                # REST client
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── hooks/
│   │   │   └── usePinPositions.ts  # Scroll/resize/mutation sync
│   │   └── utils/
│   │       ├── getSelector.ts      # CSS selector generator
│   │       └── positionUtils.ts    # Relative anchoring math
│   ├── vite.config.ts    # IIFE bundle config
│   └── server.js         # Static file server for dist/
│
└── proxy/                # Port 3000 - Injection proxy + API
    ├── server.js         # HTML injection + /api/comments CRUD
    └── comments.json     # JSON file persistence
```

## 🔧 How It Works

### 1. Script Injection

The proxy intercepts HTML responses and injects:

```html
<script src="http://localhost:3002/codesphere-tools.js"></script>
```

### 2. Shadow DOM Mounting

The injected script creates an isolated container:

```javascript
const container = document.createElement("div");
const shadowRoot = container.attachShadow({ mode: "open" });
// All overlay UI renders inside shadowRoot
```

### 3. Element Detection

When placing a comment, the overlay temporarily hides itself to detect the underlying element:

```javascript
overlayRoot.style.visibility = "hidden";
const element = document.elementFromPoint(x, y);
overlayRoot.style.visibility = "";
```

### 4. Selector Generation

Unique selectors are generated with priority:

1. **ID**: `#main-nav`
2. **Unique class combo**: `.hero-title`
3. **nth-of-type**: `article.feature-card:nth-of-type(2)`

### 5. Relative Positioning

Pins are stored as percentages of the target element:

```json
{
  "selector": ".hero-title",
  "xPercentage": 66.88,
  "yPercentage": 81.25
}
```

## 🛠️ API Endpoints

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/comments`              | Fetch all comments           |
| POST   | `/api/comments`              | Create new comment           |
| DELETE | `/api/comments/:id`          | Delete comment               |
| PATCH  | `/api/comments/:id/resolve`  | Mark as resolved             |
| PATCH  | `/api/comments/:id/position` | Update position (after drag) |

## 📋 Comment Data Model

```typescript
interface Comment {
  id: string;
  selector: string; // CSS selector of target element
  xPercentage: number; // 0-100, relative to element width
  yPercentage: number; // 0-100, relative to element height
  content: string;
  author: { id; name; avatar };
  createdAt: string;
  resolved: boolean;
  viewport?: { width; height }; // Screen size when comment was made
}
```

## 🎯 Use Cases

- **Staging review** - Get feedback on deployments before production
- **Design QA** - Designers can annotate specific UI elements
- **Bug reporting** - Pin comments to exact problem areas
- **Client feedback** - Non-technical stakeholders can comment visually

## ☁️ Codesphere Deployment

Deploy as **3 separate services** with path-based routing:

### Environment Variables

| Service           | Env Variable | Value                                              | Description                   |
| ----------------- | ------------ | -------------------------------------------------- | ----------------------------- |
| **Target App**    | `BASE_PATH`  | `/target`                                          | Path where service is mounted |
| **Commenting UI** | `BASE_PATH`  | `/commenting-ui`                                   | Path where service is mounted |
| **Proxy**         | `TARGET_URL` | `https://<workspace>.codesphere.com/target`        | Full URL to Target App        |
| **Proxy**         | `TOOLS_URL`  | `https://<workspace>.codesphere.com/commenting-ui` | Full URL to Commenting UI     |

### Service Configuration

#### Target App (`/target`)

```bash
# CI Pipeline
cd target-app && npm install

# Run Command
cd target-app && node server.js

# Environment Variables
BASE_PATH=/target
```

#### Commenting UI (`/commenting-ui`)

```bash
# CI Pipeline
cd commenting-ui && npm install && npm run build

# Run Command
cd commenting-ui && node server.js

# Environment Variables
BASE_PATH=/commenting-ui
```

#### Proxy (`/` - Entry Point)

```bash
# CI Pipeline
cd proxy && npm install

# Run Command
cd proxy && node server.js

# Environment Variables
TARGET_URL=https://77015-3000.2.codesphere.com/target
TOOLS_URL=https://77015-3000.2.codesphere.com/commenting-ui
```

> **Note:** Replace `77015-3000.2.codesphere.com` with your actual Codesphere workspace URL.

## 📄 License

MIT
