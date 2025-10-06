import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

interface MenuItem {
  name: string;
  path: string;
}

@Component({
  selector: 'app-sidebar-widget',
  imports: [],
  templateUrl: './sidebar-widget.html',
})
export class SidebarWidget {
  private router = inject(Router);

  constructor() {}
  activeItem: string = 'Home';

  onClick = (item: MenuItem) => {
    if (this.activeItem == item.name) return;
    this.activeItem = item.name;
    this.router.navigate([item.path]);
  };

  menuItems: MenuItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Post', path: '/studio/posts' },
  ];
}
