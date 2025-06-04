import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ItemService } from '../../core/services/item.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { UiTextService } from '../../core/services/ui-text.service';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ItemFormData, ItemType, ImageFile, ApiResponse } from '../../shared/models/item.model';
import { contactInfoValidator } from '../../shared/utils/validators';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-repost',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageUploadComponent
  ],
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
            {{ uiText.getPageTitle(itemType) }}
          </h1>
          <p class="text-lg text-orange-700 max-w-2xl mx-auto">
            {{ uiText.getPageDescription(itemType) }}
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
                  {{ uiText.getFormTitle(itemType) }}
                </h2>
                <p class="text-orange-700 mt-2">
                  {{ uiText.getFormDescription(itemType) }}
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
                        [placeholder]="itemType === 'lost' ? 'What did you lose?' : 'What did you find?'"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="isFieldInvalid('title')"
                        [class.border-orange-200]="!isFieldInvalid('title')"
                      />
                      <div
                        *ngIf="isFieldInvalid('title')"
                        class="text-sm text-red-600"
                      >
                        <span *ngIf="getFieldError('title', 'required')">
                          Item title is required
                        </span>
                        <span *ngIf="getFieldError('title', 'minlength')">
                          Title must be at least 3 characters
                        </span>
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
                        [class.border-red-400]="isFieldInvalid('category')"
                        [class.border-orange-200]="!isFieldInvalid('category')"
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
                        *ngIf="isFieldInvalid('category')"
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
                      [placeholder]="getDescriptionPlaceholder()"
                      rows="4"
                      class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-vertical"
                      [class.border-red-400]="isFieldInvalid('description')"
                      [class.border-orange-200]="!isFieldInvalid('description')"
                    ></textarea>
                    <div
                      *ngIf="isFieldInvalid('description')"
                      class="text-sm text-red-600"
                    >
                      <span *ngIf="getFieldError('description', 'required')">
                        Description is required
                      </span>
                      <span *ngIf="getFieldError('description', 'minlength')">
                        Description must be at least 10 characters
                      </span>
                    </div>
                  </div>

                  <!-- Image Upload -->
                  <app-image-upload
                    [selectedImage]="selectedImage"
                    [uploadedImageUrl]="uploadedImageUrl"
                    [isUploading]="isUploading()"
                    (imageSelected)="onImageSelected($event)"
                    (imageRemoved)="removeImage()"
                    (uploadedImageRemoved)="removeUploadedImage()"
                  ></app-image-upload>

                  <!-- Location and Date Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        for="location"
                        class="block text-sm font-medium text-orange-800"
                      >
                        {{ uiText.getLocationLabel(itemType) }} *
                      </label>
                      <input
                        id="location"
                        type="text"
                        formControlName="location"
                        [placeholder]="uiText.getLocationPlaceholder(itemType)"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="isFieldInvalid('location')"
                        [class.border-orange-200]="!isFieldInvalid('location')"
                      />
                      <div
                        *ngIf="isFieldInvalid('location')"
                        class="text-sm text-red-600"
                      >
                        <span *ngIf="getFieldError('location', 'required')">
                          Location is required
                        </span>
                        <span *ngIf="getFieldError('location', 'minlength')">
                          Location must be at least 3 characters
                        </span>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="date"
                        class="block text-sm font-medium text-orange-800"
                      >
                        {{ uiText.getDateLabel(itemType) }} *
                      </label>
                      <input
                        id="date"
                        type="date"
                        formControlName="date"
                        [max]="maxDate"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="isFieldInvalid('date')"
                        [class.border-orange-200]="!isFieldInvalid('date')"
                      />
                      <div
                        *ngIf="isFieldInvalid('date')"
                        class="text-sm text-red-600"
                      >
                        Date is required
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
                      [class.border-red-400]="isFieldInvalid('contactInfo')"
                      [class.border-orange-200]="!isFieldInvalid('contactInfo')"
                    />
                    <div
                      *ngIf="isFieldInvalid('contactInfo')"
                      class="text-sm text-red-600"
                    >
                      <span *ngIf="getFieldError('contactInfo', 'required')">
                        Contact information is required
                      </span>
                      <span *ngIf="getFieldError('contactInfo', 'invalidContact')">
                        Please enter a valid email address or phone number
                      </span>
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
                        {{ uiText.getSubmitButtonText(itemType) }}
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
  `
})
export class ReportPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private itemService = inject(ItemService);
  private cloudinaryService = inject(CloudinaryService);
  protected uiText = inject(UiTextService);

  itemForm!: FormGroup;
  maxDate = new Date().toISOString().split('T')[0];
  isSubmitting = signal(false);
  isUploading = signal(false);
  itemType: ItemType = 'lost';
  selectedImage: ImageFile | null = null;
  uploadedImageUrl: string = '';
  currentUserId: string | null = null;

  ngOnInit(): void {
    this.initializeUserId();
    this.initializeItemType();
    this.initializeForm();
  }

  private initializeUserId(): void {
    try {
      const user = this.authService.getUser();
      this.currentUserId = user?._id || user?.id || null;
      
      if (!this.currentUserId) {
        this.handleAuthError();
      }
    } catch (error) {
      this.handleAuthError();
    }
  }

  private handleAuthError(): void {
    console.warn('No user ID found, redirecting to login');
    this.toastr.error('Please log in to continue', 'Authentication Required');
    this.router.navigate(['/login']);
  }

  private initializeItemType(): void {
    this.route.params.subscribe((params) => {
      const type = params['type'] as ItemType;
      if (type && ['lost', 'found'].includes(type)) {
        this.itemType = type;
        console.log('Item type set to:', type);
      } else {
        this.router.navigate(['/']);
      }
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

  // Form Validation Helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.itemForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.itemForm.get(fieldName);
    return field ? field.errors?.[errorType] : false;
  }

  // Image Handling
  async onImageSelected(imageFile: ImageFile): Promise<void> {
    this.selectedImage = imageFile;
    await this.uploadImage();
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

  // Helper Methods
  getDescriptionPlaceholder(): string {
    return this.itemType === 'lost'
      ? 'Describe your item in detail (color, brand, size, distinctive features, etc.)'
      : 'Describe the found item in detail (color, brand, size, distinctive features, etc.)';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Form Submission
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
      this.handleInvalidForm();
    }
  }

  private async handleFormSubmit(data: ItemFormData): Promise<void> {
    try {
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

      const response = await firstValueFrom(
        this.itemService.submitItem(data)
      );

      this.toastr.clear();

      if (response?.success) {
        this.handleSuccessfulSubmission();
      } else {
        throw new Error(response?.message || 'Unknown error occurred');
      }
    } catch (error: any) {
      this.handleSubmissionError(error);
    }
  }

  private handleSuccessfulSubmission(): void {
    const successMessage = this.itemType === 'lost'
      ? "Your lost item has been reported and added to our database. We'll notify you if someone finds it!"
      : "Your found item has been reported and added to our database. We'll help connect you with the owner!";

    this.toastr.success(successMessage, 'Item Reported Successfully!', {
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
    });

    this.resetForm();
    
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  private handleSubmissionError(error: any): void {
    this.toastr.clear();

    let errorMessage = `Failed to submit your ${this.itemType} item report. Please try again.`;

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

    throw error;
  }

  private handleInvalidForm(): void {
    if (!this.currentUserId) {
      this.toastr.error('User authentication required. Please log in again.', 'Authentication Error');
      this.router.navigate(['/login']);
      return;
    }

    Object.keys(this.itemForm.controls).forEach((key) => {
      this.itemForm.get(key)?.markAsTouched();
    });
  }

  private resetForm(): void {
    this.itemForm.reset();
    this.removeUploadedImage();
  }
}