import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth.service';

const baseUrl = environment.apiBaseUrl;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 class="text-3xl font-bold text-center text-orange-600">Sign In</h2>
        
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-orange-800 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="you@example.com"
          />
          <p *ngIf="email?.invalid && email?.touched" class="text-sm text-red-600 mt-1">
            A valid email is required.
          </p>
        </div>
        
        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-semibold text-orange-800 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="••••••••"
          />
          <p *ngIf="password?.touched && password?.errors?.['required']" class="text-sm text-red-600 mt-1">
            Password is required.
          </p>
        </div>
        
        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="form.invalid || isLoading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
        
        <!-- Sign Up Link -->
        <div class="text-center">
          <p class="text-gray-600">Don't have an account? 
            <a routerLink="/auth/sign-up" class="text-orange-600 hover:text-orange-700 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  `,
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    
    this.http
      .post<{ accessToken: string; user: any }>(
        `${baseUrl}/api/auth/login`,
        this.form.value
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.accessToken && res.user) {
            this.authService.login(res.accessToken, res.user);
            this.toast.success('Sign-in successful!');
          } else {
            this.toast.error('Invalid response from server.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Sign-in error:', error);
          this.toast.error(
            error?.error?.message || 'Sign-in failed. Please try again.'
          );
        },
      });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}