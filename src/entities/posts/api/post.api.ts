import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommentCreationProp,
  CommentData,
  FeedType,
  PostCreationProp,
  PostData,
} from '../model/post.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostApi {
  private API_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCurrentUserPosts(): Observable<PostData[]> {
    return this.http.get<PostData[]>(`${this.API_URL}/api/users/me/posts`, {
      withCredentials: true,
    });
  }

  getPostById(id: string): Observable<PostData> {
    return this.http.get<PostData>(`${this.API_URL}/api/posts/${id}`);
  }

  createPost(post: PostCreationProp): Observable<PostData> {
    return this.http.post<PostData>(`${this.API_URL}/api/posts`, post);
  }

  getFeed(type: FeedType, page: number = 1, limit: number = 20): Observable<PostData[]> {
    const params = new HttpParams().set('type', type).set('page', page).set('limit', limit);
    return this.http.get<PostData[]>(`${this.API_URL}/api/posts/feed`, {
      params,
      withCredentials: true,
    });
  }

  likePost(postId: string): Observable<{ likes_count: number }> {
    return this.http.post<{ likes_count: number }>(
      `${this.API_URL}/api/posts/${postId}/likes`,
      {},
      { withCredentials: true }
    );
  }

  unlikePost(postId: string): Observable<{ likes_count: number }> {
    return this.http.delete<{ likes_count: number }>(`${this.API_URL}/api/posts/${postId}/likes`, {
      withCredentials: true,
    });
  }

  getComments(postId: string, page: number = 1, limit: number = 20): Observable<CommentData[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<CommentData[]>(`${this.API_URL}/api/posts/${postId}/comments`, {
      params,
      withCredentials: true,
    });
  }

  createComment(postId: string, comment: CommentCreationProp): Observable<CommentData> {
    return this.http.post<CommentData>(`${this.API_URL}/api/posts/${postId}/comments`, comment, {
      withCredentials: true,
    });
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/posts/${postId}`, {
      withCredentials: true,
    });
  }
}
