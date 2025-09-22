import { Routes } from '@angular/router';
import { LoginPage } from '../pages/auth/login-page/login-page';
import { SignupPage } from '../pages/auth/signup-page/signup-page';
import { HomePage } from '../pages/common/home-page/home-page';
import { SidebarWidget } from '../widgets/common/sidebar-widget/sidebar-widget';
import { LayoutComponent } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomePage,
      },
    ],
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
];
