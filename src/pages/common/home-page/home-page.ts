import { Component, OnInit } from '@angular/core';
import { TapeWidget } from '../../../widgets/common/tape-widget/tape-widget';
import { UserApi } from '../../../entities/users';
import { PrivateUserData } from '../../../entities/users';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [TapeWidget],
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  user: PrivateUserData | null = null;

  constructor(private userApi: UserApi) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userApi.getCurrentUser().subscribe({
      next: (userData: PrivateUserData) => {
        this.user = userData;
        console.log('Current user:', userData);
      },
      error: (error) => {
        console.error('Failed to get current user:', error);
      },
    });
  }
}
