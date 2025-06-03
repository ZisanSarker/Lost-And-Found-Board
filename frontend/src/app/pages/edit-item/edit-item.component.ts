import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

interface Item {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  contactInfo: string;
  type: 'lost' | 'found';
  userId: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 lg:p-8">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 sm:px-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 class="text-2xl sm:text-3xl font-bold text-white">Edit Item</h1>
            <button 
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 w-fit"
              (click)="goBack()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
              </svg>
              Back
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoadingItem" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading item...</p>
          </div>
        </div>

        <!-- Form -->
        <form *ngIf="!isLoadingItem" class="p-6 sm:p-8" (ngSubmit)="onSubmit()" #itemForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Item Title -->
            <div class="space-y-2">
              <label for="title" class="block text-sm font-semibold text-gray-700">
                Item Title <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="title" 
                name="title"
                [(ngModel)]="item.title" 
                required
                placeholder="Enter item title"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900"
              >
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label for="category" class="block text-sm font-semibold text-gray-700">
                Category <span class="text-red-500">*</span>
              </label>
              <select 
                id="category" 
                name="category"
                [(ngModel)]="item.category" 
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900"
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="documents">Documents</option>
                <option value="keys">Keys</option>
                <option value="bags">Bags</option>
                <option value="jewelry">Jewelry</option>
                <option value="books">Books</option>
                <option value="sports">Sports Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Type -->
            <div class="space-y-2">
              <label for="type" class="block text-sm font-semibold text-gray-700">
                Type <span class="text-red-500">*</span>
              </label>
              <select 
                id="type" 
                name="type"
                [(ngModel)]="item.type" 
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900"
              >
                <option value="">Select type</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <!-- Last Seen Location -->
            <div class="space-y-2">
              <label for="location" class="block text-sm font-semibold text-gray-700">
                Last Seen Location <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="location" 
                name="location"
                [(ngModel)]="item.location" 
                required
                placeholder="Enter location where item was last seen"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900"
              >
            </div>

            <!-- Date -->
            <div class="space-y-2">
              <label for="date" class="block text-sm font-semibold text-gray-700">
                Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="date" 
                name="date"
                [(ngModel)]="item.date" 
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900"
              >
            </div>

            <!-- Contact Information -->
            <div class="space-y-2">
              <label for="contactInfo" class="block text-sm font-semibold text-gray-700">
                Contact Information <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="contactInfo" 
                name="contactInfo"
                [(ngModel)]="item.contactInfo" 
                required
                placeholder="Phone number or email"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900"
              >
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2 mb-8">
            <label for="description" class="block text-sm font-semibold text-gray-700">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="item.description" 
              required
              rows="4"
              placeholder="Provide detailed description of the item"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-gray-900 resize-vertical"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <button 
              type="button" 
              class="px-6 py-3 bg-white border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              (click)="resetForm()"
              [disabled]="isLoading"
            >
              Reset
            </button>
            <button 
              type="submit" 
              class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-w-[140px]"
              [disabled]="!itemForm.valid || isLoading"
            >
              <div *ngIf="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {{ isLoading ? 'Updating...' : 'Update Item' }}
            </button>
          </div>
        </form>

        <!-- Loading Overlay -->
        <div *ngIf="isLoading" class="absolute inset-0 bg-white/95 flex items-center justify-center z-10">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p class="text-gray-600 font-medium">Updating item...</p>
          </div>
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="mx-6 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium">{{ successMessage }}</span>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  `
})
export class EditItemComponent implements OnInit {
  item: Item = {
    id: '',
    title: '',
    category: '',
    description: '',
    location: '',
    date: '',
    contactInfo: '',
    type: 'lost',
    userId: ''
  };

  originalItem: Item = { ...this.item };
  isLoading = false;
  isLoadingItem = false;
  successMessage = '';
  errorMessage = '';
  itemId!: string;
  currentUser: any = null;

  private readonly baseUrl = `${environment.apiBaseUrl}/api/item`;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.getUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Get item ID from route params
    this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
    
    if (!this.itemId) {
      this.errorMessage = 'Item ID not found';
      return;
    }

    this.loadItem();
  }

  loadItem() {
    this.isLoadingItem = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.baseUrl}/${this.itemId}`)
      .subscribe({
        next: (response) => {
          this.isLoadingItem = false;
          
          if (response.success && response.data) {
            // Check if current user owns this item
            if (response.data.userId !== this.currentUser.id) {
              this.errorMessage = 'You can only edit your own items';
              return;
            }

            this.item = {
              id: response.data.id,
              title: response.data.title,
              category: response.data.category,
              description: response.data.description,
              location: response.data.location,
              date: response.data.date,
              contactInfo: response.data.contactInfo,
              type: response.data.type,
              userId: response.data.userId,
              imageUrl: response.data.imageUrl,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt
            };
            
            this.originalItem = { ...this.item };
          } else {
            this.errorMessage = 'Failed to load item data';
          }
        },
        error: (error) => {
          this.isLoadingItem = false;
          console.error('Load item error:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'Item not found';
          } else if (error.status === 403) {
            this.errorMessage = 'You do not have permission to edit this item';
          } else {
            this.errorMessage = 'Failed to load item. Please try again.';
          }
        }
      });
  }

  onSubmit() {
    if (this.isLoading || !this.currentUser) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updateData = {
      title: this.item.title,
      category: this.item.category,
      description: this.item.description,
      location: this.item.location,
      date: this.item.date,
      contactInfo: this.item.contactInfo,
      type: this.item.type,
      userId: this.currentUser.id
    };

    this.http.patch(`${this.baseUrl}/${this.item.id}`, updateData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response.success) {
            this.successMessage = 'Item updated successfully!';
            this.originalItem = { ...this.item };
            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate(['/dashboard']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to update item';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Update error:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'Item not found';
          } else if (error.status === 403) {
            this.errorMessage = 'You can only update your own items';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Invalid data provided';
          } else {
            this.errorMessage = 'Failed to update item. Please try again.';
          }
        }
      });
  }

  resetForm() {
    this.item = { ...this.originalItem };
    this.successMessage = '';
    this.errorMessage = '';
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}