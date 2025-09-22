import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostCreationProp, PostData } from '../model/post.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostApi {
  private API_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPostById(id: string): Observable<PostData> {
    return this.http.get<PostData>(`${this.API_URL}/api/posts/${id}`);
  }

  createPost(post: PostCreationProp): Observable<PostData> {
    return this.http.post<PostData>(`${this.API_URL}/api/posts`, post);
  }
}
