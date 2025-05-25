import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 class="text-3xl font-bold text-center text-orange-600">Sign In</h2>
        <!-- Email and Password inputs here (same as before) -->
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

        <button
          type="submit"
          [disabled]="form.invalid"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign In
        </button>
      </form>
    </div>
  `,
})
export class SignInComponent {
  form: FormGroup;
  private apiUrl = 'http://localhost:5000/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
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
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.http.post(this.apiUrl, this.form.value, { withCredentials: true }).subscribe({
        next: (response) => {
          console.log('Login success:', response);
          this.router.navigate(['/dashboard']); // Navigate on success
        },
        error: (error) => {
          console.error('Login failed:', error.error?.message || error.message);
          // Optionally, display error to user here
        },
      });
    }
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
}
