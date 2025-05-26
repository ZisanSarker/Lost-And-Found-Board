import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { CloudinaryService, CloudinaryResponse } from './cloudinary.service';
import { firstValueFrom } from 'rxjs';

const baseUrl = environment.apiBaseUrl;

// Form Data Interface - Updated to include imageUrl
export interface ItemFormData {
  type: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contactInfo: string;
  userId: string;
  imageUrl?: string;
}

// API Response Interface
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

// Custom validator for contact info (email or phone)
function contactInfoValidator(control: any) {
  const value = control.value;
  if (!value) return { required: true };
  
  // Email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone pattern (basic - digits, spaces, dashes, parentheses, plus sign)
  const phonePattern = /^[\+]?[\d\s\-\(\)]{10,}$/;
  
  if (emailPattern.test(value) || phonePattern.test(value)) {
    return null; // Valid
  }
  
  return { invalidContact: true };
}

@Component({
  selector: 'app-repost',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-orange-50 py-8">
      <div class="w-full max-w-none px-4">
        <!-- Header -->
        <div class="mb-8 text-center">
          <button
            (click)="goBack()"
            class="mb-6 inline-flex items-center px-4 py-2 text-orange-700 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 12H5m0 0l7 7m-7-7l7-7"
              />
            </svg>
            Back
          </button>

          <h1 class="text-4xl font-bold text-orange-900 mb-4">
            {{ getPageTitle() }}
          </h1>
          <p class="text-lg text-orange-700 max-w-2xl mx-auto">
            {{ getPageDescription() }}
          </p>
        </div>

        <!-- Main Form Container -->
        <div class="w-full flex justify-center">
          <div class="w-full max-w-4xl" style="width: 70%;">
            <div class="bg-white rounded-lg shadow-lg border border-orange-200">
              <!-- Form Header -->
              <div
                class="bg-orange-100 px-8 py-6 border-b border-orange-200 rounded-t-lg"
              >
                <h2 class="text-2xl font-semibold text-orange-900">
                  {{ getFormTitle() }}
                </h2>
                <p class="text-orange-700 mt-2">
                  {{ getFormDescription() }}
                </p>
              </div>

              <!-- Form Content -->
              <div class="p-8">
                <form
                  [formGroup]="itemForm"
                  (ngSubmit)="onSubmitForm()"
                  class="space-y-6"
                >
                  <!-- Title and Category Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        for="title"
                        class="block text-sm font-medium text-orange-800"
                      >
                        Item Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        formControlName="title"
                        [placeholder]="
                          itemType === 'lost'
                            ? 'What did you lose?'
                            : 'What did you find?'
                        "
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="
                          itemForm.get('title')?.invalid &&
                          itemForm.get('title')?.touched
                        "
                        [class.border-orange-200]="
                          !itemForm.get('title')?.invalid ||
                          !itemForm.get('title')?.touched
                        "
                      />
                      <div
                        *ngIf="
                          itemForm.get('title')?.invalid &&
                          itemForm.get('title')?.touched
                        "
                        class="text-sm text-red-600"
                      >
                        <span
                          *ngIf="itemForm.get('title')?.errors?.['required']"
                          >Item title is required</span
                        >
                        <span
                          *ngIf="itemForm.get('title')?.errors?.['minlength']"
                          >Title must be at least 3 characters</span
                        >
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="category"
                        class="block text-sm font-medium text-orange-800"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        formControlName="category"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="
                          itemForm.get('category')?.invalid &&
                          itemForm.get('category')?.touched
                        "
                        [class.border-orange-200]="
                          !itemForm.get('category')?.invalid ||
                          !itemForm.get('category')?.touched
                        "
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">📱 Electronics</option>
                        <option value="clothing">👕 Clothing</option>
                        <option value="accessories">👜 Accessories</option>
                        <option value="documents">📄 Documents</option>
                        <option value="keys">🔑 Keys</option>
                        <option value="jewelry">💍 Jewelry</option>
                        <option value="bags">🎒 Bags & Wallets</option>
                        <option value="sports">⚽ Sports Equipment</option>
                        <option value="books">📚 Books</option>
                        <option value="tools">🔧 Tools</option>
                        <option value="toys">🧸 Toys</option>
                        <option value="other">❓ Other</option>
                      </select>
                      <div
                        *ngIf="
                          itemForm.get('category')?.invalid &&
                          itemForm.get('category')?.touched
                        "
                        class="text-sm text-red-600"
                      >
                        Please select a category
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="space-y-2">
                    <label
                      for="description"
                      class="block text-sm font-medium text-orange-800"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      formControlName="description"
                      [placeholder]="
                        itemType === 'lost'
                          ? 'Describe your item in detail (color, brand, size, distinctive features, etc.)'
                          : 'Describe the found item in detail (color, brand, size, distinctive features, etc.)'
                      "
                      rows="4"
                      class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-vertical"
                      [class.border-red-400]="
                        itemForm.get('description')?.invalid &&
                        itemForm.get('description')?.touched
                      "
                      [class.border-orange-200]="
                        !itemForm.get('description')?.invalid ||
                        !itemForm.get('description')?.touched
                      "
                    ></textarea>
                    <div
                      *ngIf="
                        itemForm.get('description')?.invalid &&
                        itemForm.get('description')?.touched
                      "
                      class="text-sm text-red-600"
                    >
                      <span
                        *ngIf="itemForm.get('description')?.errors?.['required']"
                        >Description is required</span
                      >
                      <span
                        *ngIf="itemForm.get('description')?.errors?.['minlength']"
                        >Description must be at least 10 characters</span
                      >
                    </div>
                  </div>

                  <!-- Image Upload Section -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-orange-800">
                      Item Image (Optional)
                    </label>
                    <div class="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                      <!-- Upload Area -->
                      <div *ngIf="!selectedImage && !uploadedImageUrl" class="space-y-3">
                        <svg class="mx-auto h-12 w-12 text-orange-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            (change)="onImageSelected($event)"
                            class="hidden"
                            #fileInput
                          />
                          <button
                            type="button"
                            (click)="fileInput.click()"
                            class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Choose Image
                          </button>
                          <p class="text-sm text-orange-600 mt-2">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>

                      <!-- Selected Image Preview -->
                      <div *ngIf="selectedImage && !isUploading() && !uploadedImageUrl" class="space-y-3">
                        <img [src]="selectedImage.preview" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded-lg">
                        <p class="text-sm text-orange-700">{{ selectedImage.file.name }}</p>
                        <p class="text-xs text-orange-600">{{ getFileSize(selectedImage.file.size) }}</p>
                        <div class="flex justify-center space-x-2">
                          <button
                            type="button"
                            (click)="removeImage()"
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded transition-colors"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            (click)="fileInput.click()"
                            class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-sm rounded transition-colors"
                          >
                            Change
                          </button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          (change)="onImageSelected($event)"
                          class="hidden"
                          #fileInput
                        />
                      </div>

                      <!-- Uploading State -->
                      <div *ngIf="isUploading()" class="space-y-3">
                        <svg class="animate-spin mx-auto h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-orange-600">Uploading image...</p>
                      </div>

                      <!-- Uploaded Image -->
                      <div *ngIf="uploadedImageUrl" class="space-y-3">
                        <img [src]="uploadedImageUrl" alt="Uploaded" class="mx-auto h-32 w-32 object-cover rounded-lg">
                        <p class="text-sm text-green-600 font-medium">✓ Image uploaded successfully</p>
                        <button
                          type="button"
                          (click)="removeUploadedImage()"
                          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Location and Date Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        for="location"
                        class="block text-sm font-medium text-orange-800"
                      >
                        {{ getLocationLabel() }} *
                      </label>
                      <input
                        id="location"
                        type="text"
                        formControlName="location"
                        [placeholder]="getLocationPlaceholder()"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="
                          itemForm.get('location')?.invalid &&
                          itemForm.get('location')?.touched
                        "
                        [class.border-orange-200]="
                          !itemForm.get('location')?.invalid ||
                          !itemForm.get('location')?.touched
                        "
                      />
                      <div
                        *ngIf="
                          itemForm.get('location')?.invalid &&
                          itemForm.get('location')?.touched
                        "
                        class="text-sm text-red-600"
                      >
                        <span
                          *ngIf="itemForm.get('location')?.errors?.['required']"
                          >Location is required</span
                        >
                        <span
                          *ngIf="itemForm.get('location')?.errors?.['minlength']"
                          >Location must be at least 3 characters</span
                        >
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="date"
                        class="block text-sm font-medium text-orange-800"
                      >
                        {{ getDateLabel() }} *
                      </label>
                      <input
                        id="date"
                        type="date"
                        formControlName="date"
                        [max]="maxDate"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="
                          itemForm.get('date')?.invalid &&
                          itemForm.get('date')?.touched
                        "
                        [class.border-orange-200]="
                          !itemForm.get('date')?.invalid ||
                          !itemForm.get('date')?.touched
                        "
                      />
                      <div
                        *ngIf="
                          itemForm.get('date')?.invalid &&
                          itemForm.get('date')?.touched
                        "
                        class="text-sm text-red-600"
                      >
                        <span *ngIf="itemForm.get('date')?.errors?.['required']"
                          >Date is required</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="space-y-2">
                    <label
                      for="contactInfo"
                      class="block text-sm font-medium text-orange-800"
                    >
                      Contact Information *
                    </label>
                    <input
                      id="contactInfo"
                      type="text"
                      formControlName="contactInfo"
                      placeholder="Your email address or phone number"
                      class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      [class.border-red-400]="
                        itemForm.get('contactInfo')?.invalid &&
                        itemForm.get('contactInfo')?.touched
                      "
                      [class.border-orange-200]="
                        !itemForm.get('contactInfo')?.invalid ||
                        !itemForm.get('contactInfo')?.touched
                      "
                    />
                    <div
                      *ngIf="
                        itemForm.get('contactInfo')?.invalid &&
                        itemForm.get('contactInfo')?.touched
                      "
                      class="text-sm text-red-600"
                    >
                      <span
                        *ngIf="itemForm.get('contactInfo')?.errors?.['required']"
                        >Contact information is required</span
                      >
                      <span
                        *ngIf="itemForm.get('contactInfo')?.errors?.['invalidContact']"
                        >Please enter a valid email address or phone number</span
                      >
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="pt-6">
                    <button
                      type="submit"
                      [disabled]="itemForm.invalid || isSubmitting() || isUploading()"
                      class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      <span
                        *ngIf="!isSubmitting()"
                        class="flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        {{ getSubmitButtonText() }}
                      </span>
                      <span
                        *ngIf="isSubmitting()"
                        class="flex items-center justify-center"
                      >
                        <svg
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RepostPageComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cloudinaryService = inject(CloudinaryService);

  itemForm!: FormGroup;
  maxDate = new Date().toISOString().split('T')[0];
  isSubmitting = signal(false);
  isUploading = signal(false);
  itemType: string = '';

  // Image handling
  selectedImage: { file: File; preview: string } | null = null;
  uploadedImageUrl: string = '';

  currentUserId: string | null = null;

  private readonly ITEMS_ENDPOINT = `${baseUrl}/api/item`;

  ngOnInit(): void {
    this.initializeUserId();

    this.route.params.subscribe((params) => {
      this.itemType = params['type'];
      if (this.itemType && ['lost', 'found'].includes(this.itemType)) {
        console.log('Item type set to:', this.itemType);
      } else {
        this.router.navigate(['/']);
        return;
      }
    });

    this.initializeForm();
  }

  private initializeUserId(): void {
    try {
      const user = this.authService.getUser();
      this.currentUserId = user?._id || user?.id || null;
      
      if (!this.currentUserId) {
        console.warn('No user ID found, redirecting to login');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
      this.router.navigate(['/login']);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private initializeForm(): void {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      contactInfo: ['', [Validators.required, contactInfoValidator]],
    });
  }

  // Image handling methods
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!this.cloudinaryService.isValidImageFile(file)) {
      this.toastr.error('Please select a valid image file (JPEG, PNG, GIF) under 5MB', 'Invalid File');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = {
        file: file,
        preview: e.target.result
      };
      // Upload immediately after selection
      this.uploadImage();
    };
    reader.readAsDataURL(file);
  }

  private async uploadImage(): Promise<void> {
    if (!this.selectedImage) return;

    this.isUploading.set(true);
    
    try {
      const response = await firstValueFrom(
        this.cloudinaryService.uploadImage(this.selectedImage.file)
      );
      
      this.uploadedImageUrl = response.secure_url;
      this.toastr.success('Image uploaded successfully!', 'Success');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      this.toastr.error('Failed to upload image. Please try again.', 'Upload Error');
      this.removeImage();
    } finally {
      this.isUploading.set(false);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.uploadedImageUrl = '';
  }

  removeUploadedImage(): void {
    this.uploadedImageUrl = '';
    this.selectedImage = null;
  }

  getFileSize(bytes: number): string {
    return this.cloudinaryService.getReadableFileSize(bytes);
  }

  // Dynamic text methods
  getPageTitle(): string {
    return this.itemType === 'lost'
      ? 'Report a Lost Item'
      : 'Report a Found Item';
  }

  getPageDescription(): string {
    return this.itemType === 'lost'
      ? 'Fill out the form below with detailed information about your lost item. The more details you provide, the better chance of recovery.'
      : 'Fill out the form below with detailed information about the item you found. Help reunite it with its owner.';
  }

  getFormTitle(): string {
    return this.itemType === 'lost'
      ? 'Lost Item Details'
      : 'Found Item Details';
  }

  getFormDescription(): string {
    return this.itemType === 'lost'
      ? 'Please provide detailed information about your lost item to help others identify it.'
      : 'Please provide detailed information about the item you found to help identify the owner.';
  }

  getLocationLabel(): string {
    return this.itemType === 'lost' ? 'Last Seen Location' : 'Found Location';
  }

  getLocationPlaceholder(): string {
    return this.itemType === 'lost'
      ? 'Where did you last see it?'
      : 'Where did you find it?';
  }

  getDateLabel(): string {
    return this.itemType === 'lost' ? 'Date Lost' : 'Date Found';
  }

  getSubmitButtonText(): string {
    return this.itemType === 'lost' ? 'Report Lost Item' : 'Report Found Item';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  async onSubmitForm(): Promise<void> {
    if (this.itemForm.valid && this.currentUserId) {
      this.isSubmitting.set(true);

      try {
        const formData: ItemFormData = {
          type: this.itemType,
          ...this.itemForm.value,
          userId: this.currentUserId,
          imageUrl: this.uploadedImageUrl || undefined,
        };

        await this.handleFormSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      if (!this.currentUserId) {
        this.toastr.error('User authentication required. Please log in again.', 'Authentication Error');
        this.router.navigate(['/login']);
        return;
      }

      // Mark all fields as touched to show validation errors
      Object.keys(this.itemForm.controls).forEach((key) => {
        this.itemForm.get(key)?.markAsTouched();
      });
    }
  }

  private async handleFormSubmit(data: ItemFormData): Promise<void> {
    try {
      // Show loading toastr
      const loadingToast = this.toastr.info(
        `Submitting your ${this.itemType} item report...`,
        'Processing',
        {
          timeOut: 0,
          extendedTimeOut: 0,
          closeButton: true,
          progressBar: true,
        }
      );

      // Prepare the payload to match your backend exactly
      const payload = {
        type: data.type, // 'lost' or 'found'
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        date: data.date,
        contactInfo: data.contactInfo,
        userId: data.userId,
        imageUrl: data.imageUrl,
      };

      // Make the POST request to your backend using firstValueFrom for better async handling
      const response = await firstValueFrom(
        this.http.post<ApiResponse>(this.ITEMS_ENDPOINT, payload, {
          headers: this.getAuthHeaders(),
        })
      );

      // Clear any existing toastr notifications
      this.toastr.clear();

      if (response?.success) {
        // Show success message
        const successMessage =
          this.itemType === 'lost'
            ? "Your lost item has been reported and added to our database. We'll notify you if someone finds it!"
            : "Your found item has been reported and added to our database. We'll help connect you with the owner!";

        this.toastr.success(successMessage, 'Item Reported Successfully!', {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });

        console.log(`${this.itemType} item submitted successfully:`, response);

        // Reset form after successful submission
        this.itemForm.reset();
        this.removeUploadedImage();

        // Optionally redirect to dashboard or items list after a delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      } else {
        throw new Error(response?.message || 'Unknown error occurred');
      }
    } catch (error: any) {
      // Clear loading toastr
      this.toastr.clear();

      console.error(`Error submitting ${this.itemType} item:`, error);

      // Handle different error formats from your backend
      let errorMessage = `Failed to submit your ${this.itemType} item report. Please try again.`;

      // Handle HTTP error responses
      if (error?.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
          if (error.error.errors && Array.isArray(error.error.errors)) {
            errorMessage += ': ' + error.error.errors.join(', ');
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Handle specific HTTP status codes
      if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        this.router.navigate(['/login']);
      } else if (error?.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error?.status === 400) {
        errorMessage = 'Invalid form data. Please check your inputs and try again.';
      } else if (error?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      this.toastr.error(errorMessage, 'Submission Failed', {
        timeOut: 7000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
      });

      // Re-throw error to be handled by the calling method
      throw error;
    }
  }
}

// Export the main component
export default RepostPageComponent;