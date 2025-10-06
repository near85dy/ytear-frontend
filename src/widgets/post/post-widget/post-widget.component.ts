import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostApi, PostData } from '../../../entities/posts';

@Component({
  selector: 'app-post-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-widget.component.html',
})
export class PostWidget {
  @Input() post!: PostData;
  @Input() canDelete: boolean = false;
  @Output() deleted = new EventEmitter<string>();
  @Output() liked = new EventEmitter<{ id: string; likes_count: number }>();

  isLiking = false;
  isDeleting = false;

  constructor(private postApi: PostApi) {}

  onLike() {
    if (this.isLiking) return;
    this.isLiking = true;
    this.postApi.likePost(this.post.id).subscribe({
      next: ({ likes_count }) => {
        this.liked.emit({ id: this.post.id, likes_count });
        this.post = { ...this.post, likes_count };
        this.isLiking = false;
      },
      error: () => {
        this.isLiking = false;
      },
    });
  }

  onDelete() {
    if (!this.canDelete || this.isDeleting) return;
    this.isDeleting = true;
    this.postApi.deletePost(this.post.id).subscribe({
      next: () => {
        this.deleted.emit(this.post.id);
        this.isDeleting = false;
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }
}
