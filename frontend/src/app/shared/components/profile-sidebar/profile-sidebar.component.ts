import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

const baseUrl = environment.apiBaseUrl;

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  joinDate: Date;
  avatar: string;
  bio: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApiResponse {
  message: string;
  user: UserProfile;
}

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-br from-orange-300 to-orange-100 rounded-lg shadow-lg p-6 mb-6">
      <h3 class="text-2xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
        Profile
      </h3>
      
      <!-- Loading State -->
      <div *ngIf="loading()" class="flex flex-col items-center text-center">
        <div class="w-40 h-40 bg-orange-200 rounded-full flex items-center justify-center mb-4 border-4 border-orange-200 animate-pulse">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
        <div class="h-6 bg-orange-200 rounded w-32 mb-2 animate-pulse"></div>
        <div class="h-4 bg-orange-200 rounded w-48 mb-4 animate-pulse"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error() && !loading()" class="flex flex-col items-center text-center">
        <div class="w-40 h-40 bg-red-100 rounded-full flex items-center justify-center text-red-400 text-xl font-bold mb-4 border-4 border-red-200">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p class="text-red-600 text-sm mb-4">{{ error() }}</p>
        <button 
          (click)="loadProfile()" 
          class="text-orange-600 hover:text-orange-800 underline text-sm"
        >
          Try Again
        </button>
      </div>

      <!-- Profile Content -->
      <div *ngIf="!loading() && !error() && userProfile()" class="flex flex-col items-center text-center">
        <div class="relative">
          <!-- Avatar with fallback to initials -->
          <div *ngIf="userProfile()!.avatar; else initialsAvatar" 
               class="w-40 h-40 rounded-full mb-4 border-4 border-orange-200 overflow-hidden">
            <img 
              [src]="userProfile()!.avatar" 
              [alt]="userProfile()!.username"
              class="w-full h-full object-cover"
              (error)="onImageError($event)"
            />
          </div>
          
          <ng-template #initialsAvatar>
            <div class="w-40 h-40 bg-orange-900 rounded-full flex items-center justify-center text-orange-400 text-xl font-bold mb-4 border-4 border-orange-200">
              {{ getInitials(userProfile()!.username) }}
            </div>
          </ng-template>

          <!-- Verification Badge -->
          <div *ngIf="userProfile()!.verified" 
               class="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>

        <h4 class="font-medium text-xl text-gray-800">{{ userProfile()!.username }}</h4>
        <p class="text-md text-gray-700">{{ userProfile()!.email }}</p>
        
        <button 
          (click)="navigateToProfile()"
          class="mt-4 w-full border-2 border-orange-500 text-gray-700 px-4 py-2 rounded-lg border-b-1 hover:border-orange-900 hover:text-white hover:bg-orange-600 transition-all duration-300 flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Go To Profile
        </button>
      </div>
    </div>
  `,
})
export class ProfileSidebarComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Signals for state management
  loading = signal(false);
  error = signal('');
  userProfile = signal<UserProfile | null>(null);

  ngOnInit() {
    this.loadProfile();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  loadProfile() {
    this.loading.set(true);
    this.error.set('');

    this.http
      .get<ApiResponse>(`${baseUrl}/api/profile`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          const userWithDate = {
            ...response.user,
            joinDate: new Date(response.user.joinDate),
          };
          this.userProfile.set(userWithDate);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          let errorMessage = 'Failed to load profile';

          if (err.status === 401) {
            errorMessage = 'Session expired';
            this.handleAuthError();
          } else if (err.status === 404) {
            errorMessage = 'Profile not found';
          } else if (err.status === 0) {
            errorMessage = 'Server unavailable';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }

          this.error.set(errorMessage);
          this.loading.set(false);
        },
      });
  }

  getInitials(username: string): string {
    if (!username) return 'U';
    
    const words = username.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  onImageError(event: any) {
    // Hide the broken image and show initials instead
    event.target.style.display = 'none';
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  private handleAuthError() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}