import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from './models/user-profile.model';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { BioComponent } from './components/bio/bio.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileHeaderComponent,
    ContactInfoComponent,
    BioComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-6 lg:p-8">
      <app-loading-state
        *ngIf="loading()"
        [style]="'spinner'"
        [size]="'lg'"
        [variant]="'primary'"
        [text]="'Loading your profile...'"
        [fullscreen]="true"
        [overlay]="true"
      />

      <app-error-state
        *ngIf="error()"
        [title]="getErrorTitle()"
        [errorMessage]="error()"
        [variant]="getErrorVariant()"
        [layout]="'centered'"
        [size]="'lg'"
        [showRetryButton]="true"
        [retryButtonText]="'Try Again'"
        [showDismissButton]="shouldShowDismissButton()"
        [dismissButtonText]="'Log In'"
        (retry)="loadProfile()"
        (dismiss)="handleAuthError()"
      />

      <app-empty-state
        *ngIf="!loading() && !error() && !userProfile()"
        [title]="'Profile Not Found'"
        [message]="'Unable to load your profile information'"
        [variant]="'error'"
        [size]="'lg'"
        [layout]="'centered'"
        [showActionButton]="true"
        [actionButtonText]="'Try Again'"
        [timestamp]="currentTimestamp"
        [username]="currentUsername"
        (action)="loadProfile()"
      >
        <span message-suffix class="block mt-2 text-sm text-gray-400">
          Try refreshing the page or contact support if the issue persists.
        </span>
      </app-empty-state>

      <div
        *ngIf="!loading() && !error() && userProfile()"
        class="max-w-6xl mx-auto space-y-8"
      >
        <app-profile-header
          [profile]="userProfile()!"
          [isEditing]="isEditing()"
          [editForm]="editForm"
        >
          <ng-container avatarSection>
            <div class="relative">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 p-1 backdrop-blur-sm">
                <img
                  [src]="selectedAvatar?.preview || editForm.avatar || userProfile()!.avatar"
                  [alt]="userProfile()!.username"
                  class="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl"
                />
              </div>

              <div
                *ngIf="isEditing()"
                class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                (click)="fileInput.click()"
              >
                <div *ngIf="!isUploadingAvatar()" class="text-center">
                  <svg
                    class="w-8 h-8 text-white mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span class="text-white text-sm font-medium">Change Avatar</span>
                </div>
                <div
                  *ngIf="isUploadingAvatar()"
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
                >
                </div>
              </div>
            </div>

            <input
              #fileInput
              type="file"
              class="hidden"
              accept="image/*"
              (change)="onAvatarSelected($event)"
            />
          </ng-container>

          <ng-container actionButtons>
            <button
              *ngIf="!isEditing()"
              (click)="startEditing()"
              class="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>

            <div *ngIf="isEditing()" class="flex gap-3">
              <button
                (click)="saveProfile()"
                [disabled]="saving()"
                class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <svg
                  *ngIf="!saving()"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div
                  *ngIf="saving()"
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                >
                </div>
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button
                (click)="cancelEditing()"
                [disabled]="saving()"
                class="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </ng-container>
        </app-profile-header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <app-contact-info
            [profile]="userProfile()!"
            [isEditing]="isEditing()"
            [editForm]="editForm"
          />

          <app-bio
            [profile]="userProfile()!"
            [isEditing]="isEditing()"
            [editForm]="editForm"
          />
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            Account Actions
          </h3>

          <div class="flex flex-wrap gap-4">
            <button
              (click)="deleteAccount()"
              class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <div
        *ngIf="showDeleteModal()"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
        (click)="cancelDeleteAccount()"
      >
        <div
          class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-300"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
            <svg
              class="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Delete Account</h3>
            <p class="text-gray-600 mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <p class="text-red-600 font-semibold">
              This will permanently delete all your data.
            </p>
          </div>

          <div class="flex gap-4">
            <button
              (click)="cancelDeleteAccount()"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              (click)="confirmDeleteAccount()"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private toastr = inject(ToastrService);
  private cloudinaryService = inject(CloudinaryService);

  loading = signal(false);
  error = signal('');
  saving = signal(false);
  isEditing = signal(false);
  userProfile = signal<UserProfile | null>(null);
  showDeleteModal = signal(false);
  selectedAvatar: { file: File; preview: string } | null = null;
  isUploadingAvatar = signal(false);
  currentTimestamp = '2025-06-04 06:35:09';
  currentUsername = 'ZisanSarker';

  editForm: Partial<UserProfile & { avatar?: string }> = {};

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.error.set('');

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.handleError(err);
        this.loading.set(false);
      }
    });
  }

  getErrorTitle(): string {
    if (!this.error()) return '';
    
    if (this.error().includes('not authenticated')) {
      return 'Authentication Required';
    }
    if (this.error().includes('not found')) {
      return 'Profile Not Found';
    }
    if (this.error().includes('permission')) {
      return 'Access Denied';
    }
    return 'Error Loading Profile';
  }

  getErrorVariant(): 'danger' | 'warning' | 'info' {
    if (!this.error()) return 'danger';
    
    if (this.error().includes('not authenticated')) {
      return 'warning';
    }
    if (this.error().includes('permission')) {
      return 'danger';
    }
    return 'info';
  }

  shouldShowDismissButton(): boolean {
    return this.error().includes('not authenticated') || 
           this.error().includes('session expired');
  }

  async onAvatarSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.cloudinaryService.isValidImageFile(file)) {
      this.toastr.error(
        'Please select a valid image file (JPEG, PNG, GIF) under 5MB',
        'Invalid File'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedAvatar = {
        file: file,
        preview: e.target.result,
      };
      this.uploadAvatar();
    };
    reader.readAsDataURL(file);
  }

  private async uploadAvatar(): Promise<void> {
    if (!this.selectedAvatar) return;

    this.isUploadingAvatar.set(true);

    try {
      const response = await firstValueFrom(
        this.cloudinaryService.uploadImage(this.selectedAvatar.file)
      );

      this.editForm.avatar = response.secure_url;
      this.toastr.success('Avatar uploaded successfully!', 'Success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      this.toastr.error(
        'Failed to upload avatar. Please try again.',
        'Upload Error'
      );
      this.removeAvatar();
    } finally {
      this.isUploadingAvatar.set(false);
    }
  }

  removeAvatar(): void {
    this.selectedAvatar = null;
    if (this.editForm.avatar) {
      delete this.editForm.avatar;
    }
  }

  startEditing() {
    if (this.userProfile()) {
      const profile = this.userProfile()!;
      this.editForm = {
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar,
      };
      this.isEditing.set(true);
    }
  }

  cancelEditing() {
    this.isEditing.set(false);
    this.editForm = {};
    this.selectedAvatar = null;
  }

  saveProfile() {
    if (!this.editForm.username?.trim()) {
      this.toastr.error('Username is required');
      return;
    }

    this.saving.set(true);

    const updateData = {
      username: this.editForm.username.trim(),
      phone: this.editForm.phone?.trim() || '',
      location: this.editForm.location?.trim() || '',
      bio: this.editForm.bio?.trim() || '',
      avatar: this.editForm.avatar || this.userProfile()!.avatar,
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.isEditing.set(false);
        this.saving.set(false);
        this.editForm = {};
        this.toastr.success('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.handleError(err);
        this.saving.set(false);
      }
    });
  }

  deleteAccount() {
    this.showDeleteModal.set(true);
  }

  confirmDeleteAccount() {
    this.showDeleteModal.set(false);

    this.profileService.deleteAccount().subscribe({
      next: () => {
        this.toastr.success('Account deleted successfully');
        setTimeout(() => {
          this.logout();
        }, 2000);
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        this.handleError(err);
      }
    });
  }

  cancelDeleteAccount() {
    this.showDeleteModal.set(false);
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully');
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.error.set('You are not authenticated. Please log in to continue.');
      this.handleAuthError();
    } else if (error.status === 403) {
      this.error.set('You do not have permission to access this profile.');
    } else if (error.status === 404) {
      this.error.set('Profile not found. The requested profile does not exist.');
    } else if (error.status === 0) {
      this.error.set('Unable to connect to the server. Please check your internet connection.');
    } else {
      this.error.set(error.message || 'An unexpected error occurred while loading your profile.');
    }
  }

  handleAuthError() {
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: '/profile',
        message: this.error()
      }
    });
  }
}