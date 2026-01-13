import { useState, useEffect, useCallback, useRef } from 'react';
import type { Comment, PositionedComment } from '../types';
import { getAbsolutePosition } from '../utils/positionUtils';

/**
 * Hook that manages pin positions with automatic recalculation
 * on scroll, resize, and DOM mutations
 */
export function usePinPositions(comments: Comment[]): PositionedComment[] {
  const [positions, setPositions] = useState<PositionedComment[]>([]);
  const rafId = useRef<number>(0);

  const recalculatePositions = useCallback(() => {
    const updated = comments.map(comment => {
      const pos = getAbsolutePosition(
        comment.selector,
        comment.xPercentage,
        comment.yPercentage
      );

      return {
        ...comment,
        absoluteX: pos?.x ?? 0,
        absoluteY: pos?.y ?? 0,
        visible: pos?.visible ?? false
      };
    });

    setPositions(updated);
  }, [comments]);

  useEffect(() => {
    // Initial calculation
    recalculatePositions();

    // Throttled update handler
    const handleUpdate = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(recalculatePositions);
    };

    // Listen for scroll on both window and document (captures all scroll events)
    window.addEventListener('scroll', handleUpdate, { passive: true, capture: true });
    document.addEventListener('scroll', handleUpdate, { passive: true, capture: true });
    window.addEventListener('resize', handleUpdate, { passive: true });

    // MutationObserver for dynamic DOM changes
    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', handleUpdate, { capture: true });
      document.removeEventListener('scroll', handleUpdate, { capture: true });
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
    };
  }, [recalculatePositions]);

  return positions;
}
