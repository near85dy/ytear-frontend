import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthApi } from '../../../entities/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  isLoading = false;
  errorMessage = '';

  constructor(private authApi: AuthApi, private router: Router) {}

  onSubmit(form: NgForm) {
    this.errorMessage = '';

    if (!form.valid) {
      console.log('Form is not valid');
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    console.log('Sending login request:', form.value);
    this.isLoading = true;

    this.authApi.login(form.value).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.router.navigate(['/']);
        console.log(123);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
