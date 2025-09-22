import { PublicUserData } from '../../users';

export interface PostData {
  id: string;
  user: PublicUserData;
  content: string;
  likesCount: string;
  commentsCount: string;
}

export interface PostCreationProp {
  content: string;
  
}
