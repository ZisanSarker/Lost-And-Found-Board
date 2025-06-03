import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component'; // Update path as needed

const baseUrl = environment.apiBaseUrl;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormInputComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 class="text-3xl font-bold text-center text-orange-600">Sign In</h2>

        <app-form-input
          label="Email"
          [control]="email"
          type="email"
          placeholder="you@example.com"
          errorMessage="A valid email is required."
        />

        <app-form-input
          label="Password"
          [control]="password"
          type="password"
          placeholder="••••••••"
          errorMessage="Password is required."
        />

        <button
          type="submit"
          [disabled]="form.invalid || isLoading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>

        <div class="text-center">
          <p class="text-gray-600">
            Don't have an account?
            <a
              routerLink="/auth/sign-up"
              class="text-orange-600 hover:text-orange-700 font-semibold"
            >
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
            this.router.navigate(['/home']);
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
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }
}
