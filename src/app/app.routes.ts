import { Routes } from '@angular/router';
import { LoginPage } from '../pages/auth/login-page/login-page';
import { SignupPage } from '../pages/auth/signup-page/signup-page';
import { HomePage } from '../pages/common/home-page/home-page';
import { HomeLayoutComponent } from './layouts/homeLayout';
import { PostsPage } from '../pages/studio/posts-page/posts-page';
import { StudioLayoutComponent } from './layouts/studioLayout';
import { ComposePage } from '../pages/studio/compose-page/compose-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomePage,
      },
    ],
  },
  {
    path: 'studio',
    component: StudioLayoutComponent,
    children: [
      {
        path: 'posts',
        component: PostsPage,
      },
      {
        path: 'compose',
        component: ComposePage,
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
