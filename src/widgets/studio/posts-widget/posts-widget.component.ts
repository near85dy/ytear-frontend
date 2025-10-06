import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { PostApi, PostData } from '../../../entities/posts';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-studio-widget-posts',
  templateUrl: './posts-widget.html',
})
export class PostsWidget implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private postApi: PostApi) {}

  postsData: PostData[] = []; // Signal автоматически обновляет UI

  ngOnInit(): void {
    this.postApi
      .getCurrentUserPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (postsData: PostData[]) => {
          this.postsData = postsData;
          console.log(postsData);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
