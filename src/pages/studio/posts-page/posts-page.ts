import { Component } from '@angular/core';
import { PostsWidget } from '../../../widgets/studio/posts-widget/posts-widget.component';

@Component({
  selector: 'app-posts-page',
  imports: [PostsWidget],
  templateUrl: './posts-page.html',
})
export class PostsPage {}
