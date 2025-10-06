import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostApi, PostCreationProp } from '../../../entities/posts';

@Component({
  selector: 'app-studio-compose-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compose-page.html',
})
export class ComposePage {
  content: string = '';
  isSubmitting = false;

  constructor(private postApi: PostApi, private router: Router) {}

  submit() {
    if (!this.content.trim() || this.isSubmitting) return;
    this.isSubmitting = true;
    const payload: PostCreationProp = { content: this.content.trim() };
    this.postApi.createPost(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.content = '';
        this.router.navigate(['/']);
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
