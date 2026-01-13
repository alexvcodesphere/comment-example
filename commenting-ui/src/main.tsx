import React from 'react';
import ReactDOM from 'react-dom/client';
import CodesphereOverlay from './CodesphereOverlay';
import { overlayStyles } from './styles';

/**
 * Codesphere Tools - Injected Feedback Overlay
 * 
 * This script creates an isolated Shadow DOM container and mounts
 * the React commenting overlay into it, ensuring complete style isolation
 * from the host application.
 */

function initCodesphereTools() {
  console.log('[Codesphere] Initializing feedback tools...');

  // Create container element
  const container = document.createElement('div');
  container.id = 'codesphere-feedback-root';
  document.body.appendChild(container);

  // Attach Shadow DOM for style isolation
  const shadowRoot = container.attachShadow({ mode: 'open' });

  // Inject styles into shadow root
  const styleSheet = document.createElement('style');
  styleSheet.textContent = overlayStyles;
  shadowRoot.appendChild(styleSheet);

  // Create mount point inside shadow root
  const mountPoint = document.createElement('div');
  mountPoint.id = 'codesphere-mount';
  shadowRoot.appendChild(mountPoint);

  // Mount React app
  const root = ReactDOM.createRoot(mountPoint);
  root.render(
    <React.StrictMode>
      <CodesphereOverlay />
    </React.StrictMode>
  );

  console.log('[Codesphere] Feedback tools initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initCodesphereTools);
} else {
  initCodesphereTools();
}
