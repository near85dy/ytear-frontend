import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

interface MenuItem {
  name: string;
  path: string;
}

@Component({
  selector: 'app-studio-widget',
  imports: [],
  templateUrl: './layout-widget.html',
})
export class StudioWidget {
  private router = inject(Router);

  constructor() {}
  activeItem: string = 'Post';

  onClick = (item: MenuItem) => {
    if (this.activeItem == item.name) return;
    this.activeItem = item.name;
    this.router.navigate([item.path]);
  };

  menuItems: MenuItem[] = [
    { name: 'Posts', path: '/studio/posts' },
    { name: 'New post', path: '/studio/compose' },
  ];
}
