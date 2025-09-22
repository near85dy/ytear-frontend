import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrivateUserData, PublicUserData } from '../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private API_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<PrivateUserData> {
    return this.http.get<PrivateUserData>(`${this.API_URL}/api/users/me`, {
      withCredentials: true,
    });
  }

  getUserById(id: string): Observable<PublicUserData> {
    return this.http.get<PublicUserData>(`${this.API_URL}/api/users/${id}`);
  }

  findUser() {}
}
