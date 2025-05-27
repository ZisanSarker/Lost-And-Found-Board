import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { CloudinaryService } from '../report/cloudinary.service';

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
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-6 lg:p-8"
    >
      <!-- Loading State -->
      <div
        *ngIf="loading()"
        class="flex items-center justify-center min-h-screen"
      >
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"
          ></div>
          <p class="text-lg font-medium text-gray-600">Loading profile...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        *ngIf="error()"
        class="flex items-center justify-center min-h-screen"
      >
        <div class="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h3>
          <p class="text-gray-600 mb-4">{{ error() }}</p>
          <button
            (click)="loadProfile()"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Profile Content -->
      <div
        *ngIf="!loading() && !error() && userProfile()"
        class="max-w-6xl mx-auto space-y-8"
      >
        <!-- Header Section -->
        <div
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 shadow-2xl shadow-orange-500/25 transition-all duration-500 hover:shadow-3xl hover:shadow-orange-500/30"
          [class.transform]="isEditing()"
          [class.scale-[1.02]]="isEditing()"
        >
          <!-- Animated Background -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"
          ></div>
          <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"
          ></div>

          <div class="relative p-8 md:p-12">
            <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <!-- Avatar Section (Static - No Upload Functionality) -->
              <!-- Avatar Section with Upload -->
              <div class="relative group">
                <div class="relative">
                  <div
                    class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 p-1 backdrop-blur-sm"
                  >
                    <img
                      [src]="
                        selectedAvatar?.preview ||
                        editForm.avatar ||
                        userProfile()!.avatar
                      "
                      [alt]="userProfile()!.username"
                      class="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl"
                    />
                  </div>

                  <!-- Upload overlay when editing -->
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
                        ></path>
                      </svg>
                      <span class="text-white text-sm font-medium"
                        >Change Avatar</span
                      >
                    </div>
                    <div
                      *ngIf="isUploadingAvatar()"
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"
                    ></div>
                  </div>
                </div>

                <!-- Hidden file input -->
                <input
                  #fileInput
                  type="file"
                  class="hidden"
                  accept="image/*"
                  (change)="onAvatarSelected($event)"
                />

                <!-- Verification Badge -->
                <div
                  *ngIf="userProfile()!.verified"
                  class="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 text-center lg:text-left text-white">
                <!-- Name -->
                <div class="mb-4">
                  <h1
                    *ngIf="!isEditing()"
                    class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent"
                  >
                    {{ userProfile()!.username }}
                  </h1>
                  <input
                    *ngIf="isEditing()"
                    [(ngModel)]="editForm.username"
                    class="text-4xl md:text-5xl font-bold bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl px-6 py-3 text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300 w-full max-w-lg"
                    placeholder="Enter your username"
                  />
                </div>

                <!-- Meta Info -->
                <div
                  class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8 text-white/90"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V11a4 4 0 118 0v4"
                      ></path>
                    </svg>
                    <span class="font-medium"
                      >Joined {{ formatDate(userProfile()!.joinDate) }}</span
                    >
                  </div>

                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <span *ngIf="!isEditing()" class="font-medium">{{
                      userProfile()!.location || 'Location not set'
                    }}</span>
                    <input
                      *ngIf="isEditing()"
                      [(ngModel)]="editForm.location"
                      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex flex-wrap items-center justify-center lg:justify-start gap-3"
                >
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
                      ></path>
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
                        ></path>
                      </svg>
                      <div
                        *ngIf="saving()"
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                      ></div>
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
                        ></path>
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Contact Information -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500"
          >
            <h3
              class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center"
              >
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
              </div>
              Contact Information
            </h3>

            <div class="space-y-4">
              <div
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-red-50 transition-all duration-300"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <span
                    *ngIf="!isEditing()"
                    class="text-gray-700 font-medium"
                    >{{ userProfile()!.email }}</span
                  >
                  <input
                    *ngIf="isEditing()"
                    [(ngModel)]="editForm.email"
                    type="email"
                    disabled
                    class="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:border-orange-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-red-50 transition-all duration-300"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <span
                    *ngIf="!isEditing()"
                    class="text-gray-700 font-medium"
                    >{{ userProfile()!.phone || 'Phone not set' }}</span
                  >
                  <input
                    *ngIf="isEditing()"
                    [(ngModel)]="editForm.phone"
                    type="tel"
                    class="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:border-orange-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter phone"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bio Section -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500"
          >
            <h3
              class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center"
              >
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              About Me
            </h3>

            <div class="relative">
              <p
                *ngIf="!isEditing()"
                class="text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl"
              >
                {{
                  userProfile()!.bio ||
                    'No bio available yet. Click edit to add one!'
                }}
              </p>
              <textarea
                *ngIf="isEditing()"
                [(ngModel)]="editForm.bio"
                class="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Tell us about yourself..."
                rows="6"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h3
            class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center"
            >
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
                ></path>
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
                ></path>
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <!-- Delete Account Confirmation Modal -->
      <div
        *ngIf="showDeleteModal()"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
        (click)="cancelDeleteAccount()"
      >
        <div
          class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-300"
          (click)="$event.stopPropagation()"
        >
          <!-- Warning Icon -->
          <div
            class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full"
          >
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
              ></path>
            </svg>
          </div>

          <!-- Modal Content -->
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Delete Account
            </h3>
            <p class="text-gray-600 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <p class="text-red-600 font-semibold">
              This will permanently delete all your data.
            </p>
          </div>

          <!-- Action Buttons -->
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
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private cloudinaryService = inject(CloudinaryService);

  // Signals for state management
  loading = signal(false);
  error = signal('');
  saving = signal(false);
  isEditing = signal(false);
  userProfile = signal<UserProfile | null>(null);
  showDeleteModal = signal(false);
  selectedAvatar: { file: File; preview: string } | null = null;
  isUploadingAvatar = signal(false);

  editForm: Partial<UserProfile & { avatar?: string }> = {};

  ngOnInit() {
    this.loadProfile();
  }

  onAvatarSelected(event: any): void {
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

      // Update the edit form with new avatar URL
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
          let errorMessage = 'Failed to load profile data.';

          if (err.status === 401) {
            errorMessage = 'Session expired. Please login again.';
            this.handleAuthError();
          } else if (err.status === 404) {
            errorMessage = 'Profile not found.';
          } else if (err.status === 0) {
            errorMessage =
              'Cannot connect to server. Please check if the backend is running.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }

          this.error.set(errorMessage);
          this.loading.set(false);
        },
      });
  }

  startEditing() {
    if (this.userProfile()) {
      // Copy current profile data to edit form
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
    // Client-side validation
    if (!this.editForm.username?.trim()) {
      this.toastr.error('Username is required');
      return;
    }

    this.saving.set(true);

    // Prepare update data
    const updateData = {
      username: this.editForm.username.trim(),
      phone: this.editForm.phone?.trim() || '',
      location: this.editForm.location?.trim() || '',
      bio: this.editForm.bio?.trim() || '',
      avatar: this.editForm.avatar || this.userProfile()!.avatar,
    };

    this.http
      .patch<ApiResponse>(`${baseUrl}/api/profile`, updateData, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          const updatedUser = {
            ...response.user,
            joinDate: new Date(response.user.joinDate),
          };
          this.userProfile.set(updatedUser);
          this.isEditing.set(false);
          this.saving.set(false);
          this.editForm = {};
          this.toastr.success('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          let errorMessage = 'Failed to update profile.';

          if (err.status === 401) {
            errorMessage = 'Session expired. Please login again.';
            this.handleAuthError();
          } else if (err.status === 400) {
            errorMessage = err.error?.message || 'Invalid data provided.';
          } else if (err.status === 409) {
            errorMessage = 'Username or email already exists.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }

          this.toastr.error(errorMessage);
          this.saving.set(false);
        },
      });
  }

  deleteAccount() {
    this.showDeleteModal.set(true);
  }
  confirmDeleteAccount() {
    this.showDeleteModal.set(false);

    this.http
      .delete(`${baseUrl}/api/profile`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: () => {
          this.toastr.success('Account deleted successfully');
          setTimeout(() => {
            this.logout();
          }, 2000);
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          let errorMessage = 'Failed to delete account.';

          if (err.status === 401) {
            errorMessage = 'Session expired. Please login again.';
            this.handleAuthError();
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }

          this.toastr.error(errorMessage);
        },
      });
  }
  cancelDeleteAccount() {
    this.showDeleteModal.set(false);
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully');
  }

  private handleAuthError() {
    this.authService.logout();
  }

  formatDate(date: Date): string {
    if (!date) return 'Unknown';

    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date));
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  }
}
