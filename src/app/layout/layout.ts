import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarWidget } from '../../widgets/common/sidebar-widget/sidebar-widget';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarWidget],
  template: `
    <div class="flex flex-row">
      <app-sidebar-widget />
      <router-outlet></router-outlet>
    </div>
  `,
})
export class LayoutComponent {}
