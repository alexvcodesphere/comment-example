/**
 * Convert a click event's coordinates to percentages relative to an element
 */
export function getRelativePosition(
  element: Element,
  clientX: number,
  clientY: number
): { xPercentage: number; yPercentage: number } {
  const rect = element.getBoundingClientRect();
  
  const xPercentage = ((clientX - rect.left) / rect.width) * 100;
  const yPercentage = ((clientY - rect.top) / rect.height) * 100;
  
  return {
    xPercentage: Math.max(0, Math.min(100, xPercentage)),
    yPercentage: Math.max(0, Math.min(100, yPercentage))
  };
}

/**
 * Calculate absolute viewport position from stored selector and percentages
 */
export function getAbsolutePosition(
  selector: string,
  xPercentage: number,
  yPercentage: number
): { x: number; y: number; visible: boolean } | null {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      return null;
    }

    const rect = element.getBoundingClientRect();
    
    // Check if element is in viewport
    const visible = (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );

    return {
      x: rect.left + (xPercentage / 100) * rect.width,
      y: rect.top + (yPercentage / 100) * rect.height,
      visible
    };
  } catch {
    return null;
  }
}

/**
 * Get the bounding rect of an element for highlighting
 */
export function getElementBounds(element: Element): DOMRect {
  return element.getBoundingClientRect();
}
