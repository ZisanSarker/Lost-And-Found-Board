import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

// Form Data Interface
export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contactInfo: string;
  userId: string;
}

// API Response Interface
export interface ApiResponse {
  success: boolean;
  message: string;
  itemId?: string;
}

@Component({
  selector: 'app-lost-page',
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
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
            Back
          </button>
          
          <h1 class="text-4xl font-bold text-orange-900 mb-4">
            Report a Lost Item
          </h1>
          <p class="text-lg text-orange-700 max-w-2xl mx-auto">
            Fill out the form below with detailed information about your lost item. 
            The more details you provide, the better chance of recovery.
          </p>
        </div>

        <!-- Main Form Container -->
        <div class="w-full flex justify-center">
          <div class="w-full max-w-4xl" style="width: 70%;">
            <div class="bg-white rounded-lg shadow-lg border border-orange-200">
              <!-- Form Header -->
              <div class="bg-orange-100 px-8 py-6 border-b border-orange-200 rounded-t-lg">
                <h2 class="text-2xl font-semibold text-orange-900">Lost Item Details</h2>
                <p class="text-orange-700 mt-2">
                  Please provide detailed information about your lost item to help others identify it.
                </p>
              </div>
              
              <!-- Form Content -->
              <div class="p-8">
                <form [formGroup]="itemForm" (ngSubmit)="onSubmitForm()" class="space-y-6">
                  <!-- Title and Category Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <label for="title" class="block text-sm font-medium text-orange-800">
                        Item Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        formControlName="title"
                        placeholder="What did you lose?"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="itemForm.get('title')?.invalid && itemForm.get('title')?.touched"
                        [class.border-orange-200]="!itemForm.get('title')?.invalid || !itemForm.get('title')?.touched"
                      />
                      <div *ngIf="itemForm.get('title')?.invalid && itemForm.get('title')?.touched" 
                           class="text-sm text-red-600">
                        <span *ngIf="itemForm.get('title')?.errors?.['required']">Item title is required</span>
                        <span *ngIf="itemForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters</span>
                      </div>
                    </div>
                    
                    <div class="space-y-2">
                      <label for="category" class="block text-sm font-medium text-orange-800">
                        Category *
                      </label>
                      <select
                        id="category"
                        formControlName="category"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="itemForm.get('category')?.invalid && itemForm.get('category')?.touched"
                        [class.border-orange-200]="!itemForm.get('category')?.invalid || !itemForm.get('category')?.touched"
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
                      <div *ngIf="itemForm.get('category')?.invalid && itemForm.get('category')?.touched" 
                           class="text-sm text-red-600">
                        Please select a category
                      </div>
                    </div>
                  </div>
                  
                  <!-- Description -->
                  <div class="space-y-2">
                    <label for="description" class="block text-sm font-medium text-orange-800">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      formControlName="description"
                      placeholder="Describe your item in detail (color, brand, size, distinctive features, etc.)"
                      rows="4"
                      class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-vertical"
                      [class.border-red-400]="itemForm.get('description')?.invalid && itemForm.get('description')?.touched"
                      [class.border-orange-200]="!itemForm.get('description')?.invalid || !itemForm.get('description')?.touched"
                    ></textarea>
                    <div *ngIf="itemForm.get('description')?.invalid && itemForm.get('description')?.touched" 
                         class="text-sm text-red-600">
                      <span *ngIf="itemForm.get('description')?.errors?.['required']">Description is required</span>
                      <span *ngIf="itemForm.get('description')?.errors?.['minlength']">Description must be at least 10 characters</span>
                    </div>
                  </div>
                  
                  <!-- Location and Date Row -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <label for="location" class="block text-sm font-medium text-orange-800">
                        Last Seen Location *
                      </label>
                      <input
                        id="location"
                        type="text"
                        formControlName="location"
                        placeholder="Where did you last see it?"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="itemForm.get('location')?.invalid && itemForm.get('location')?.touched"
                        [class.border-orange-200]="!itemForm.get('location')?.invalid || !itemForm.get('location')?.touched"
                      />
                      <div *ngIf="itemForm.get('location')?.invalid && itemForm.get('location')?.touched" 
                           class="text-sm text-red-600">
                        <span *ngIf="itemForm.get('location')?.errors?.['required']">Location is required</span>
                        <span *ngIf="itemForm.get('location')?.errors?.['minlength']">Location must be at least 3 characters</span>
                      </div>
                    </div>
                    
                    <div class="space-y-2">
                      <label for="date" class="block text-sm font-medium text-orange-800">
                        Date Lost *
                      </label>
                      <input
                        id="date"
                        type="date"
                        formControlName="date"
                        [max]="maxDate"
                        class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        [class.border-red-400]="itemForm.get('date')?.invalid && itemForm.get('date')?.touched"
                        [class.border-orange-200]="!itemForm.get('date')?.invalid || !itemForm.get('date')?.touched"
                      />
                      <div *ngIf="itemForm.get('date')?.invalid && itemForm.get('date')?.touched" 
                           class="text-sm text-red-600">
                        <span *ngIf="itemForm.get('date')?.errors?.['required']">Date is required</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Contact Information -->
                  <div class="space-y-2">
                    <label for="contactInfo" class="block text-sm font-medium text-orange-800">
                      Contact Information *
                    </label>
                    <input
                      id="contactInfo"
                      type="email"
                      formControlName="contactInfo"
                      placeholder="Your email or phone number for contact"
                      class="w-full px-4 py-3 border rounded-lg bg-white text-orange-900 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      [class.border-red-400]="itemForm.get('contactInfo')?.invalid && itemForm.get('contactInfo')?.touched"
                      [class.border-orange-200]="!itemForm.get('contactInfo')?.invalid || !itemForm.get('contactInfo')?.touched"
                    />
                    <div *ngIf="itemForm.get('contactInfo')?.invalid && itemForm.get('contactInfo')?.touched" 
                         class="text-sm text-red-600">
                      <span *ngIf="itemForm.get('contactInfo')?.errors?.['required']">Contact information is required</span>
                      <span *ngIf="itemForm.get('contactInfo')?.errors?.['email']">Please enter a valid email address</span>
                    </div>
                  </div>
                  
                  <!-- Submit Button -->
                  <div class="pt-6">
                    <button 
                      type="submit" 
                      [disabled]="itemForm.invalid || isSubmitting()"
                      class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      <span *ngIf="!isSubmitting()" class="flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Report Lost Item
                      </span>
                      <span *ngIf="isSubmitting()" class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
export class LostPageComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  itemForm!: FormGroup;
  maxDate = new Date().toISOString().split('T')[0];
  isSubmitting = signal(false);
  
  // You should get this from your auth service or user context
  currentUserId: string = 'user123'; // Replace with actual user ID from your auth service
  
  // API endpoint configuration
  private readonly API_BASE_URL = 'https://your-api-domain.com/api'; // Replace with your actual API URL
  private readonly LOST_ITEMS_ENDPOINT = `${this.API_BASE_URL}/lost-items`;

  ngOnInit() {
    this.initializeForm();
  }
  
  private initializeForm() {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      contactInfo: ['', [Validators.required, Validators.email]]
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  async onSubmitForm() {
    if (this.itemForm.valid) {
      this.isSubmitting.set(true);
      
      try {
        const formData: ItemFormData = {
          ...this.itemForm.value,
          userId: this.currentUserId
        };
        
        await this.handleFormSubmit(formData);
        
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.itemForm.controls).forEach(key => {
        this.itemForm.get(key)?.markAsTouched();
      });
    }
  }

  private async handleFormSubmit(data: ItemFormData): Promise<void> {
    try {
      // Show loading toastr
      this.toastr.info('Submitting your lost item report...', 'Processing', {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true,
        progressBar: true
      });

      // Prepare the payload for the API
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        dateLost: data.date,
        contactInfo: data.contactInfo,
        userId: data.userId,
        status: 'active',
        reportedAt: new Date().toISOString()
      };

      // Make the POST request to your backend
      const response = await this.http.post<ApiResponse>(
        this.LOST_ITEMS_ENDPOINT, 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add any authorization headers if needed
            // 'Authorization': `Bearer ${this.authService.getToken()}`
          }
        }
      ).toPromise();

      // Clear any existing toastr notifications
      this.toastr.clear();

      if (response?.success) {
        // Show success message
        this.toastr.success(
          'Your lost item has been reported and added to our database. We\'ll notify you if someone finds it!',
          'Item Reported Successfully!',
          {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right'
          }
        );

        console.log('Lost item submitted successfully:', response);
        
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
      
      console.error('Error submitting lost item:', error);
      
      // Show error message
      const errorMessage = error?.error?.message || error?.message || 'Failed to submit your lost item report. Please try again.';
      
      this.toastr.error(
        errorMessage,
        'Submission Failed',
        {
          timeOut: 7000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right'
        }
      );
      
      // Re-throw error to be handled by the form component
      throw error;
    }
  }
}

// Export the main component
export default LostPageComponent;