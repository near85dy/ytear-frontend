import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarWidget } from '../../widgets/common/sidebar-widget/sidebar-widget.component';
import { StudioWidget } from '../../widgets/studio/layout-widget/layout-widget.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, StudioWidget],
  template: `
    <div class="flex flex-row w-max">
      <app-studio-widget />
      <router-outlet></router-outlet>
    </div>
  `,
})
export class StudioLayoutComponent {}
