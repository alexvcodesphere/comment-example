// Overlay styles injected into Shadow DOM for complete isolation
export const overlayStyles = `
  /* Reset all styles to prevent inheritance */
  :host {
    all: initial;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  /* FAB Button */
  .cs-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    cursor: pointer;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    transition: all 0.2s ease;
    z-index: 10000;
  }

  .cs-fab:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5);
  }

  .cs-fab.active {
    background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
  }

  .cs-fab svg {
    width: 24px;
    height: 24px;
    color: white;
    fill: currentColor;
  }

  /* Element Inspector Highlight */
  .cs-inspector {
    position: fixed;
    pointer-events: none;
    background: rgba(99, 102, 241, 0.15);
    border: 2px solid #6366f1;
    border-radius: 4px;
    transition: all 0.1s ease;
    z-index: 9998;
  }

  .cs-inspector-label {
    position: absolute;
    bottom: 100%;
    left: 0;
    background: #6366f1;
    color: white;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 3px 3px 0 0;
    white-space: nowrap;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Click overlay when in comment mode */
  .cs-click-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    pointer-events: auto;
    z-index: 9997;
  }

  /* Comment Pin */
  .cs-pin {
    position: fixed;
    width: 32px;
    height: 32px;
    margin-left: -16px;
    margin-top: -32px;
    pointer-events: auto;
    cursor: pointer;
    transition: transform 0.15s ease;
    z-index: 9999;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
  }

  .cs-pin:hover {
    transform: scale(1.15);
    z-index: 10001;
  }

  .cs-pin svg {
    width: 100%;
    height: 100%;
  }

  .cs-pin-number {
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: 700;
    color: white;
  }

  /* Comment Tooltip */
  .cs-tooltip {
    position: absolute;
    top: 8px;
    left: 36px;
    min-width: 250px;
    max-width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    z-index: 10002;
    overflow: hidden;
  }

  .cs-tooltip-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
  }

  .cs-tooltip-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .cs-tooltip-author {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
  }

  .cs-tooltip-time {
    font-size: 11px;
    color: #94a3b8;
  }

  .cs-tooltip-content {
    padding: 14px 16px;
    font-size: 14px;
    line-height: 1.5;
    color: #334155;
  }

  .cs-tooltip-actions {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
  }

  .cs-tooltip-btn {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .cs-tooltip-btn-primary {
    background: #6366f1;
    color: white;
  }

  .cs-tooltip-btn-primary:hover {
    background: #4f46e5;
  }

  .cs-tooltip-btn-secondary {
    background: #e2e8f0;
    color: #475569;
  }

  .cs-tooltip-btn-secondary:hover {
    background: #cbd5e1;
  }

  /* Comment Input Modal */
  .cs-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10003;
  }

  .cs-modal {
    background: white;
    border-radius: 16px;
    width: 400px;
    max-width: 90vw;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .cs-modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .cs-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .cs-modal-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }

  .cs-modal-body {
    padding: 20px 24px;
  }

  .cs-textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.15s ease;
  }

  .cs-textarea:focus {
    outline: none;
    border-color: #6366f1;
  }

  .cs-modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 24px;
    background: #f8fafc;
    justify-content: flex-end;
  }

  .cs-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .cs-btn-primary {
    background: #6366f1;
    color: white;
  }

  .cs-btn-primary:hover {
    background: #4f46e5;
  }

  .cs-btn-secondary {
    background: transparent;
    color: #64748b;
  }

  .cs-btn-secondary:hover {
    background: #f1f5f9;
  }

  /* Mode indicator */
  .cs-mode-badge {
    position: fixed;
    top: 24px;
    right: 24px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    pointer-events: none;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Viewport warning badge */
  .cs-viewport-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #fef3c7;
    color: #92400e;
    font-size: 10px;
    font-weight: 500;
    border-radius: 4px;
    margin-top: 8px;
  }

  .cs-viewport-badge svg {
    width: 12px;
    height: 12px;
  }

  /* Draggable pin */
  .cs-pin.dragging {
    cursor: grabbing;
    transform: scale(1.2);
    z-index: 10010;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  }

  .cs-pin-drag-handle {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 8px;
    background: rgba(99, 102, 241, 0.8);
    border-radius: 4px 4px 0 0;
    cursor: grab;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .cs-pin:hover .cs-pin-drag-handle {
    opacity: 1;
  }

  .cs-pin.dragging .cs-pin-drag-handle {
    cursor: grabbing;
    opacity: 1;
  }
`;
