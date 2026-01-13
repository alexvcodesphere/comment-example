import type { Comment } from './types';

const API_BASE = 'http://localhost:3000/api';

export async function fetchComments(): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE}/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error('[Codesphere] Failed to fetch comments:', error);
    return [];
  }
}

export async function createComment(
  selector: string,
  xPercentage: number,
  yPercentage: number,
  content: string,
  viewport: { width: number; height: number }
): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selector,
        xPercentage,
        yPercentage,
        content,
        viewport
      })
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return await response.json();
  } catch (error) {
    console.error('[Codesphere] Failed to create comment:', error);
    return null;
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('[Codesphere] Failed to delete comment:', error);
    return false;
  }
}

export async function resolveComment(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/comments/${id}/resolve`, {
      method: 'PATCH'
    });
    return response.ok;
  } catch (error) {
    console.error('[Codesphere] Failed to resolve comment:', error);
    return false;
  }
}

export async function updateCommentPosition(
  id: string,
  selector: string,
  xPercentage: number,
  yPercentage: number,
  viewport: { width: number; height: number }
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/comments/${id}/position`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selector, xPercentage, yPercentage, viewport })
    });
    return response.ok;
  } catch (error) {
    console.error('[Codesphere] Failed to update comment position:', error);
    return false;
  }
}
