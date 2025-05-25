import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
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
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 class="text-3xl font-bold text-center text-orange-600">Sign Up</h2>

        <!-- Full Name -->
        <div>
          <label for="username" class="block text-sm font-semibold text-orange-800 mb-1">
            Full Name
          </label>
          <input
            id="username"
            type="text"
            formControlName="username"
            class="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Zisan Sarker"
          />
          <p *ngIf="username?.touched && username?.invalid" class="text-sm text-red-600 mt-1">
            Full name is required and must contain only letters.
          </p>
        </div>

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
          <p *ngIf="password?.touched && password?.errors?.['minlength']" class="text-sm text-red-600 mt-1">
            Password must be at least 8 characters long.
          </p>
          <p *ngIf="password?.touched && password?.errors?.['pattern']" class="text-sm text-red-600 mt-1">
            Must include uppercase, lowercase, number, and special character.
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-orange-800 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="••••••••"
          />
          <p *ngIf="confirmPassword?.touched && confirmPassword?.invalid" class="text-sm text-red-600 mt-1">
            Confirm password is required.
          </p>
          <p *ngIf="form.errors?.['passwordsMismatch'] && confirmPassword?.touched" class="text-sm text-red-600 mt-1">
            Passwords do not match.
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="form.invalid || isLoading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
        
        <!-- Sign In Link -->
        <div class="text-center">
          <p class="text-gray-600">Already have an account? 
            <a routerLink="/auth/sign-in" class="text-orange-600 hover:text-orange-700 font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  `,
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.matchPasswords,
      }
    );
  }

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    const { username, email, password } = this.form.value;

    this.http
      .post<{ accessToken: string; user: any }>(`${baseUrl}/api/auth/register`, {
        username,
        email,
        password
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.accessToken && res.user) {
            this.authService.login(res.accessToken, res.user);
            this.toast.success('Sign-up successful! Welcome to Lost & Found!');
          } else {
            this.toast.error('Registration successful but no access token received.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Sign-up error:', error);
          this.toast.error(
            error?.error?.message || 'Sign-up failed. Please try again.'
          );
        },
      });
  }

  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}