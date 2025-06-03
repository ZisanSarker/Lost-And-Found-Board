import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component'; // import FormInputComponent

const baseUrl = environment.apiBaseUrl;

@Component({
  selector: 'app-sign-up',
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
        <h2 class="text-3xl font-bold text-center text-orange-600">Sign Up</h2>

        <app-form-input
          label="Full Name"
          [control]="username"
          type="text"
          placeholder="Zisan Sarker"
          errorMessage="Full name is required and must contain only letters."
        ></app-form-input>

        <app-form-input
          label="Email"
          [control]="email"
          type="email"
          placeholder="you@example.com"
          errorMessage="A valid email is required."
        ></app-form-input>

        <app-form-input
          label="Password"
          [control]="password"
          type="password"
          placeholder="••••••••"
          errorMessage="
            Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
          "
        ></app-form-input>

        <app-form-input
          label="Confirm Password"
          [control]="confirmPassword"
          type="password"
          placeholder="••••••••"
          errorMessage="Passwords do not match."
        ></app-form-input>

        <button
          type="submit"
          [disabled]="form.invalid || isLoading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>

        <div class="text-center">
          <p class="text-gray-600">
            Already have an account?
            <a
              routerLink="/auth/sign-in"
              class="text-orange-600 hover:text-orange-700 font-semibold"
            >
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
        username: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?\\\\|`~])[A-Za-z\\d!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?\\\\|`~]{8,}$'
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
      .post<{ accessToken: string; user: any }>(
        `${baseUrl}/api/auth/register`,
        {
          username,
          email,
          password,
        }
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.accessToken && res.user) {
            this.authService.login(res.accessToken, res.user);
            this.toast.success('Sign-up successful! Welcome to Lost & Found!');
          } else {
            this.toast.error(
              'Registration successful but no access token received.'
            );
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
    return this.form.get('username')! as FormControl;
  }

  get email() {
    return this.form.get('email')! as FormControl;
  }

  get password() {
    return this.form.get('password')! as FormControl;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')! as FormControl;
  }
}
