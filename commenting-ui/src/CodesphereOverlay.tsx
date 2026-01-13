import { useState, useEffect, useRef, useCallback } from 'react';
import type { Comment } from './types';
import { usePinPositions } from './hooks/usePinPositions';
import { getSelector } from './utils/getSelector';
import { getRelativePosition, getElementBounds } from './utils/positionUtils';
import { fetchComments, createComment, deleteComment, resolveComment, updateCommentPosition } from './api';

// SVG Icons
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PinIcon = ({ color = '#6366f1' }: { color?: string }) => (
  <svg viewBox="0 0 24 32" fill="none">
    <path
      d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
      fill={color}
    />
    <circle cx="12" cy="12" r="5" fill="white" />
  </svg>
);

interface ElementHighlight {
  rect: DOMRect;
  selector: string;
}

interface PendingComment {
  selector: string;
  xPercentage: number;
  yPercentage: number;
  clickX: number;
  clickY: number;
}

interface DragState {
  commentId: string;
  currentX: number;
  currentY: number;
}

export default function CodesphereOverlay() {
  const [commentMode, setCommentMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [highlight, setHighlight] = useState<ElementHighlight | null>(null);
  const [pendingComment, setPendingComment] = useState<PendingComment | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const positionedComments = usePinPositions(comments);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments().then(setComments);
  }, []);

  // Handle mouse move for element highlighting
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!commentMode) return;

    const overlayRoot = document.getElementById('codesphere-feedback-root');
    if (overlayRoot) {
      overlayRoot.style.pointerEvents = 'none';
      overlayRoot.style.visibility = 'hidden';
    }

    const element = document.elementFromPoint(e.clientX, e.clientY);

    if (overlayRoot) {
      overlayRoot.style.pointerEvents = '';
      overlayRoot.style.visibility = '';
    }

    if (!element || element === document.body || element === document.documentElement) {
      setHighlight(null);
      return;
    }

    const rect = getElementBounds(element);
    const selector = getSelector(element);
    setHighlight({ rect, selector });
  }, [commentMode]);

  // Handle click for placing comment
  const handleClick = useCallback((e: MouseEvent) => {
    if (!commentMode) return;
    
    e.preventDefault();
    e.stopPropagation();

    const overlayRoot = document.getElementById('codesphere-feedback-root');
    if (overlayRoot) {
      overlayRoot.style.pointerEvents = 'none';
      overlayRoot.style.visibility = 'hidden';
    }

    const element = document.elementFromPoint(e.clientX, e.clientY);

    if (overlayRoot) {
      overlayRoot.style.pointerEvents = '';
      overlayRoot.style.visibility = '';
    }

    if (!element || element === document.body || element === document.documentElement) return;
    if (element.id === 'codesphere-feedback-root' || element.closest('#codesphere-feedback-root')) return;

    const selector = getSelector(element);
    const { xPercentage, yPercentage } = getRelativePosition(element, e.clientX, e.clientY);

    setPendingComment({
      selector,
      xPercentage,
      yPercentage,
      clickX: e.clientX,
      clickY: e.clientY
    });
    setCommentMode(false);
    setHighlight(null);
  }, [commentMode]);

  // Add/remove global listeners for comment mode
  useEffect(() => {
    if (commentMode) {
      document.addEventListener('mousemove', handleMouseMove, true);
      document.addEventListener('click', handleClick, true);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [commentMode, handleMouseMove, handleClick]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent, commentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTooltip(null);
    setDragState({
      commentId,
      currentX: e.clientX,
      currentY: e.clientY
    });
  }, []);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragState) return;
    // Update drag position to follow cursor
    setDragState(prev => prev ? {
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY
    } : null);
  }, [dragState]);

  const handleDragEnd = useCallback(async (e: MouseEvent) => {
    if (!dragState) return;

    // Find element under cursor
    const overlayRoot = document.getElementById('codesphere-feedback-root');
    if (overlayRoot) {
      overlayRoot.style.pointerEvents = 'none';
      overlayRoot.style.visibility = 'hidden';
    }

    const element = document.elementFromPoint(e.clientX, e.clientY);

    if (overlayRoot) {
      overlayRoot.style.pointerEvents = '';
      overlayRoot.style.visibility = '';
    }

    if (element && element !== document.body && element !== document.documentElement) {
      const selector = getSelector(element);
      const { xPercentage, yPercentage } = getRelativePosition(element, e.clientX, e.clientY);
      const viewport = { width: window.innerWidth, height: window.innerHeight };

      // Update local state immediately
      setComments(prev => prev.map(c => 
        c.id === dragState.commentId 
          ? { ...c, selector, xPercentage, yPercentage, viewport }
          : c
      ));

      // Persist to server
      await updateCommentPosition(dragState.commentId, selector, xPercentage, yPercentage, viewport);
    }

    setDragState(null);
  }, [dragState]);

  useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragState, handleDragMove, handleDragEnd]);

  // Submit comment
  const handleSubmitComment = async () => {
    if (!pendingComment || !commentText.trim()) return;

    const newComment = await createComment(
      pendingComment.selector,
      pendingComment.xPercentage,
      pendingComment.yPercentage,
      commentText.trim(),
      { width: window.innerWidth, height: window.innerHeight }
    );

    if (newComment) {
      setComments(prev => [...prev, newComment]);
    }

    setPendingComment(null);
    setCommentText('');
  };

  // Delete comment
  const handleDeleteComment = async (id: string) => {
    const success = await deleteComment(id);
    if (success) {
      setComments(prev => prev.filter(c => c.id !== id));
      setActiveTooltip(null);
    }
  };

  // Resolve comment
  const handleResolveComment = async (id: string) => {
    const success = await resolveComment(id);
    if (success) {
      setComments(prev =>
        prev.map(c => (c.id === id ? { ...c, resolved: true } : c))
      );
      setActiveTooltip(null);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div ref={containerRef} data-codesphere-overlay>
      {/* Mode indicator */}
      {commentMode && (
        <div className="cs-mode-badge">
          💬 Click anywhere to add a comment
        </div>
      )}

      {/* FAB Button */}
      <button
        className={`cs-fab ${commentMode ? 'active' : ''}`}
        onClick={() => {
          setCommentMode(!commentMode);
          setHighlight(null);
          setActiveTooltip(null);
        }}
        title={commentMode ? 'Cancel' : 'Add Comment'}
      >
        {commentMode ? <CloseIcon /> : <CommentIcon />}
      </button>

      {/* Element Inspector */}
      {commentMode && highlight && (
        <div
          className="cs-inspector"
          style={{
            top: highlight.rect.top,
            left: highlight.rect.left,
            width: highlight.rect.width,
            height: highlight.rect.height
          }}
        >
          <div className="cs-inspector-label">{highlight.selector}</div>
        </div>
      )}

      {/* Click overlay for capturing clicks */}
      {commentMode && (
        <div className="cs-click-overlay" />
      )}

      {/* Comment Pins */}
      {positionedComments.map((comment, index) => {
        const isDragging = dragState?.commentId === comment.id;
        // Use drag position if dragging, otherwise use calculated position
        const pinX = isDragging ? dragState.currentX : comment.absoluteX;
        const pinY = isDragging ? dragState.currentY : comment.absoluteY;
        
        return comment.visible && (
          <div
            key={comment.id}
            className={`cs-pin ${isDragging ? 'dragging' : ''}`}
            style={{
              left: pinX,
              top: pinY,
              opacity: comment.resolved ? 0.5 : 1,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={(e) => handleDragStart(e, comment.id)}
            onClick={(e) => {
              // Only show tooltip if not dragging
              if (!dragState) {
                e.stopPropagation();
                setActiveTooltip(activeTooltip === comment.id ? null : comment.id);
              }
            }}
          >
            <PinIcon color={comment.resolved ? '#94a3b8' : '#6366f1'} />
            <span className="cs-pin-number">{index + 1}</span>

            {/* Tooltip - only show when not dragging */}
            {activeTooltip === comment.id && !dragState && (
              <div className="cs-tooltip">
                <div className="cs-tooltip-header">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="cs-tooltip-avatar"
                  />
                  <div>
                    <div className="cs-tooltip-author">{comment.author.name}</div>
                    <div className="cs-tooltip-time">{formatTime(comment.createdAt)}</div>
                  </div>
                </div>
                <div className="cs-tooltip-content">{comment.content}</div>
                <div className="cs-tooltip-actions">
                  {!comment.resolved && (
                    <button
                      className="cs-tooltip-btn cs-tooltip-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolveComment(comment.id);
                      }}
                    >
                      ✓ Resolve
                    </button>
                  )}
                  <button
                    className="cs-tooltip-btn cs-tooltip-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteComment(comment.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Comment Input Modal */}
      {pendingComment && (
        <div className="cs-modal-backdrop" onClick={() => setPendingComment(null)}>
          <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <h3 className="cs-modal-title">Add Comment</h3>
              <p className="cs-modal-subtitle">
                Target: <code style={{ fontSize: '11px', color: '#6366f1' }}>{pendingComment.selector}</code>
              </p>
            </div>
            <div className="cs-modal-body">
              <textarea
                className="cs-textarea"
                placeholder="Write your feedback..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                autoFocus
              />
            </div>
            <div className="cs-modal-footer">
              <button
                className="cs-btn cs-btn-secondary"
                onClick={() => {
                  setPendingComment(null);
                  setCommentText('');
                }}
              >
                Cancel
              </button>
              <button
                className="cs-btn cs-btn-primary"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
