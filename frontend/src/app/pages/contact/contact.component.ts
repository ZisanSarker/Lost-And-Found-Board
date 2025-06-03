import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const baseUrl = environment.apiBaseUrl;

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: string;
  contactInfo: string;
  userId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-contact-listing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">Contact Item Owner</h1>
              <p class="text-gray-600">Send a message about this item</p>
            </div>
            <button 
              (click)="goBack()"
              class="flex items-center px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Item
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoadingItem" class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div class="flex items-center space-x-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p class="text-gray-600">Loading item details...</p>
          </div>
        </div>

        <!-- Item Info Card -->
        <div *ngIf="item && !isLoadingItem" class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div class="flex items-start space-x-4">
            <div class="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-800">{{ item.title }}</h3>
              <p class="text-gray-600 mb-2">{{ item.type | titlecase }} • {{ item.category | titlecase }}</p>
              <p class="text-gray-700 text-sm">{{ item.description }}</p>
              <p class="text-gray-600 text-sm mt-2">
                <span class="font-medium">Location:</span> {{ item.location }} • 
                <span class="font-medium">Date:</span> {{ item.date | date:'mediumDate' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Item Load Error -->
        <div *ngIf="itemLoadError" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-red-800 font-medium">Unable to Load Item</h3>
              <p class="text-red-700 text-sm">{{ itemLoadError }}</p>
            </div>
          </div>
        </div>

        <!-- Authentication Check -->
        <div *ngIf="!isLoggedIn" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h3 class="text-yellow-800 font-medium">Login Required</h3>
              <p class="text-yellow-700 text-sm">You need to be logged in to send messages.</p>
            </div>
          </div>
        </div>

        <!-- Own Item Check -->
        <div *ngIf="isOwnItem" class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-blue-800 font-medium">This is Your Item</h3>
              <p class="text-blue-700 text-sm">You cannot send a message to yourself about your own item.</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-xl shadow-lg p-6" *ngIf="isLoggedIn && !isOwnItem && item && !isLoadingItem">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Send Message</h2>
            <p class="text-gray-600">Your message will be sent to the item owner via email.</p>
          </div>

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Current User Info Display -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Sending as:</h3>
              <p class="text-gray-800">{{ currentUser?.username || currentUser?.email }}</p>
              <p class="text-gray-600 text-sm">{{ currentUser?.email }}</p>
            </div>

            <!-- Recipient Info -->
            <div class="bg-blue-50 rounded-lg p-4" *ngIf="item?.contactInfo">
              <h3 class="text-sm font-medium text-blue-700 mb-2">Message will be sent to:</h3>
              <p class="text-blue-800">{{ item.contactInfo }}</p>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                id="message"
                formControlName="message"
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                placeholder="Type your message here..."
                [class.border-red-500]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"></textarea>
              <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" 
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="contactForm.get('message')?.errors?.['required']">Message is required</span>
                <span *ngIf="contactForm.get('message')?.errors?.['maxlength']">Message cannot exceed 500 characters</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ contactForm.get('message')?.value?.length || 0 }}/500 characters
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                (click)="resetForm()"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Clear Message
              </button>
              <button
                type="submit"
                [disabled]="contactForm.invalid || isSubmitting"
                class="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                <span *ngIf="!isSubmitting" class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Send Message
                </span>
                <span *ngIf="isSubmitting" class="flex items-center">
                  <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              </button>
            </div>
          </form>

          <!-- Success Message -->
          <div *ngIf="showSuccessMessage" 
               class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="text-green-800 font-medium">Message Sent Successfully!</h3>
                <p class="text-green-700 text-sm">Your message has been sent to the item owner. Both you and the recipient will receive email confirmations.</p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="showErrorMessage" 
               class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="text-red-800 font-medium">Failed to Send Message</h3>
                <p class="text-red-700 text-sm">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Manual Contact Modal/Info -->
        <div *ngIf="showManualContactInfo" class="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-orange-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <h3 class="text-orange-800 font-medium mb-2">Direct Contact Required</h3>
              <p class="text-orange-700 text-sm mb-3">
                The item owner has provided the following contact information. Please reach out to them directly:
              </p>
              <div class="bg-white rounded-lg p-4 border border-orange-200">
                <p class="text-gray-800 font-medium">Contact Info:</p>
                <p class="text-gray-700">{{ item?.contactInfo }}</p>
              </div>
              <p class="text-orange-600 text-xs mt-2">
                Note: This contact information was provided by the item owner and may include phone numbers, social media, or other contact methods.
              </p>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-orange-50 rounded-xl p-6 mt-6 border border-orange-200">
          <h3 class="text-lg font-semibold text-orange-800 mb-3">Need Help?</h3>
          <p class="text-orange-700 text-sm mb-4">
            If you're having trouble sending your message or need immediate assistance, you can contact our support team.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="mailto:support@example.com" 
               class="inline-flex items-center px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-lg transition-colors text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Email Support
            </a>
            <a href="tel:+1234567890" 
               class="inline-flex items-center px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-lg transition-colors text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              Call Support
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  itemId!: string;
  item: Item | null = null;
  isSubmitting = false;
  isLoadingItem = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  showManualContactInfo = false;
  errorMessage = '';
  itemLoadError = '';
  currentUser: any = null;
  isLoggedIn = false;
  isOwnItem = false;

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get item ID from route
    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    
    // Check authentication
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getUser();

    // Initialize form
    this.contactForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]],
    });

    // Load item details
    if (this.itemId) {
      this.loadItemDetails();
    } else {
      this.itemLoadError = 'No item ID provided';
    }
  }

  loadItemDetails(): void {
    this.isLoadingItem = true;
    this.itemLoadError = '';
    const apiUrl = `${baseUrl}/api/item/${this.itemId}`;
    
    this.http.get<{success: boolean, data: Item}>(apiUrl).subscribe({
      next: (response) => {
        this.isLoadingItem = false;
        if (response.success && response.data) {
          this.item = response.data;
          this.checkContactMethod();
          this.checkIfOwnItem();
        } else {
          this.itemLoadError = 'Item not found';
        }
      },
      error: (error) => {
        this.isLoadingItem = false;
        this.itemLoadError = error.error?.message || 'Failed to load item details';
      }
    });
  }

  checkContactMethod(): void {
    if (!this.item) return;

    // Check if contactInfo is an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(this.item.contactInfo.trim());

    if (!isEmail) {
      // Show manual contact info instead of message form
      this.showManualContactInfo = true;
    }
  }

  checkIfOwnItem(): void {
    if (!this.item || !this.currentUser) return;
    
    // Check if current user is the owner of this item
    this.isOwnItem = this.item.userId === this.currentUser.id || this.item.userId === this.currentUser._id;
  }

  goBack(): void {
    this.router.navigate(['/item', this.itemId]);
  }

  resetForm(): void {
    this.contactForm.reset();
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.contactForm.invalid || !this.isLoggedIn || !this.item) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Check if contact method is email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(this.item.contactInfo.trim());
    
    if (!isEmail) {
      this.showErrorMessage = true;
      this.errorMessage = 'This item requires direct contact. Please use the contact information provided.';
      return;
    }

    this.isSubmitting = true;
    this.showErrorMessage = false;
    this.showSuccessMessage = false;

    const messageData = {
      senderEmail: this.currentUser.email,
      receiverEmail: this.item.contactInfo.trim(),
      message: this.contactForm.get('message')?.value
    };

    this.sendMessage(messageData);
  }

  private sendMessage(messageData: any): void {
    const apiUrl = `${baseUrl}/api/email/send-email`;
    
    this.http.post<{success: boolean, message: string}>(apiUrl, messageData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.showSuccessMessage = true;
          this.contactForm.reset();
          this.errorMessage = '';
        } else {
          this.showErrorMessage = true;
          this.errorMessage = response.message || 'Failed to send message. Please try again.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.showErrorMessage = true;
        this.errorMessage = error.error?.error || error.error?.message || 'Failed to send message. Please try again.';
        console.error('Error sending message:', error);
      }
    });
  }
}