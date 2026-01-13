/**
 * Generates a unique CSS selector for a given DOM element.
 * Priority: ID > unique class combination > nth-of-type with parent context
 */
export function getSelector(element: Element): string {
  // Don't select body or html
  if (element === document.body || element === document.documentElement) {
    return 'body';
  }

  // 1. Check for ID (most unique)
  if (element.id) {
    // Make sure ID is unique in document
    const id = CSS.escape(element.id);
    if (document.querySelectorAll(`#${id}`).length === 1) {
      return `#${id}`;
    }
  }

  // 2. Try unique class combination
  if (element.classList.length > 0) {
    const classSelector = Array.from(element.classList)
      .map(c => `.${CSS.escape(c)}`)
      .join('');
    
    // Check if this class combination is unique
    if (document.querySelectorAll(classSelector).length === 1) {
      return classSelector;
    }
  }

  // 3. Build path with nth-of-type
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    // Add ID if present
    if (current.id) {
      selector = `#${CSS.escape(current.id)}`;
      path.unshift(selector);
      break; // ID is unique, stop here
    }

    // Add classes if present
    if (current.classList.length > 0) {
      const classStr = Array.from(current.classList)
        .slice(0, 2) // Limit to first 2 classes for readability
        .map(c => `.${CSS.escape(c)}`)
        .join('');
      selector += classStr;
    }

    // Calculate nth-of-type for disambiguation
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  const fullSelector = path.join(' > ');
  
  // Verify selector works
  try {
    const found = document.querySelector(fullSelector);
    if (found === element) {
      return fullSelector;
    }
  } catch {
    // Invalid selector, fall back
  }

  // Ultimate fallback: full path from body
  return getFullPath(element);
}

/**
 * Fallback: generate full path from body
 */
function getFullPath(element: Element): string {
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body) {
    const parent: Element | null = current.parentElement;
    if (!parent) break;

    const siblings = Array.from(parent.children);
    const index = siblings.indexOf(current) + 1;
    const tag = current.tagName.toLowerCase();
    
    path.unshift(`${tag}:nth-child(${index})`);
    current = parent;
  }

  return `body > ${path.join(' > ')}`;
}

/**
 * Validate that a selector still matches an element in the DOM
 */
export function validateSelector(selector: string): boolean {
  try {
    return document.querySelector(selector) !== null;
  } catch {
    return false;
  }
}
