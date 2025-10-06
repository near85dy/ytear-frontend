import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostApi, PostData } from '../../../entities/posts';
import { PostWidget } from '../../post/post-widget/post-widget.component';

enum TapeType {
  RECOMMENDATION,
  FOLLOW,
  SELF,
}

interface TapeData {
  type: TapeType;
}

@Component({
  selector: 'app-tape-widget',
  standalone: true,
  imports: [CommonModule, PostWidget],
  templateUrl: './tape-widget.html',
})
export class TapeWidget implements OnInit, OnDestroy {
  protected readonly TapeType = TapeType;

  activeType = signal<TapeType>(TapeType.RECOMMENDATION);
  isLoading = signal<boolean>(false);
  page = signal<number>(1);
  posts = signal<PostData[]>([]);
  endReached = signal<boolean>(false);

  constructor(private postApi: PostApi) {}

  ngOnInit(): void {
    this.loadFirstPage();
  }

  ngOnDestroy(): void {}

  switchType(type: TapeType) {
    if (this.activeType() === type) return;
    this.activeType.set(type);
    this.loadFirstPage();
  }

  private getFeedKey(): 'recommendations' | 'following' | 'self' {
    switch (this.activeType()) {
      case TapeType.RECOMMENDATION:
        return 'recommendations';
      case TapeType.FOLLOW:
        return 'following';
      case TapeType.SELF:
        return 'self';
    }
  }

  loadFirstPage() {
    this.page.set(1);
    this.posts.set([]);
    this.endReached.set(false);
    this.fetchPage();
  }

  loadMore() {
    if (this.isLoading() || this.endReached()) return;
    this.page.update((p) => p + 1);
    this.fetchPage(true);
  }

  private fetchPage(append: boolean = false) {
    this.isLoading.set(true);
    const type = this.getFeedKey();
    const page = this.page();
    this.postApi.getFeed(type, page, 20).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.endReached.set(true);
        }
        this.posts.update((prev) => (append ? [...prev, ...data] : data));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
