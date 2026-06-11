import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  fullName = '';
  readonly loading = signal(false);
  readonly error = signal('');

  submit(): void {
    if (!this.email.trim()) {
      this.error.set('Email is required.');
      return;
    }
    // Simple email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email.trim())) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    if (!this.fullName.trim()) {
      this.error.set('Full name is required.');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email.trim(), this.fullName.trim()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Login failed. Please try again.');
      },
    });
  }
}
