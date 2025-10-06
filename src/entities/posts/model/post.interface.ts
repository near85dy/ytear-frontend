import { PublicUserData } from '../../users';

export interface PostData {
  id: string;
  userId: string;
  content: string;
  views_count: number | null;
  likes_count: number | null;
  comments_count: number | null;
  createdAt: string;
}

export interface PostCreationProp {
  content: string;
}

export type FeedType = 'recommendations' | 'following' | 'self';

export interface CommentData {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface CommentCreationProp {
  content: string;
}
