import { Component } from '@angular/core';
import { AuthApi } from '../../../entities/auth';

@Component({
  selector: 'app-logout-button',
  imports: [],
  templateUrl: './logout-button.component.html',
})
export class LogoutButtonComponent {
  constructor(private authApi: AuthApi) {}
  onClick = () => {
    this.authApi.logout();
  };
}
