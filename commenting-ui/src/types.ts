export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

export interface Comment {
  id: string;
  selector: string;
  xPercentage: number;
  yPercentage: number;
  content: string;
  author: Author;
  createdAt: string;
  resolved: boolean;
  thread: Reply[];
  // Viewport metadata for responsive handling
  viewport?: {
    width: number;
    height: number;
  };
}

export interface FeedbackAPIResponse {
  success: boolean;
  data: {
    projectId: string;
    pageUrl: string;
    comments: Comment[];
  };
}

export interface PositionedComment extends Comment {
  absoluteX: number;
  absoluteY: number;
  visible: boolean;
}
