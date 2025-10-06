import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginFormProp, SignupFormProp } from '../model/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private API_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  login(loginForm: LoginFormProp): Observable<any> {
    return this.http.post(`${this.API_URL}/api/auth/sign-in/email`, loginForm, {
      withCredentials: true,
    });
  }

  signup(signupForm: SignupFormProp): Observable<any> {
    return this.http.post(`${this.API_URL}/api/auth/sign-up/email`, signupForm, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/api/auth/sign-out`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
