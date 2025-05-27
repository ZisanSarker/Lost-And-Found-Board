import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/auth.service';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  contactInfo: string;
  userId: string;
  imageUrl?: string;
  image?: string;
  status?: 'active' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container mx-auto px-4 py-8">
        <!-- Back Button -->
        <div class="mb-6">
          <button
            (click)="goBack()"
            class="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Listings
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="bg-white rounded-xl shadow-lg p-8">
          <div class="animate-pulse">
            <div class="flex flex-col lg:flex-row gap-8">
              <div class="w-full lg:w-1/2 h-96 bg-gray-300 rounded-lg"></div>
              <div class="w-full lg:w-1/2 space-y-4">
                <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                <div class="h-8 bg-gray-300 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded w-full"></div>
                <div class="h-4 bg-gray-300 rounded w-5/6"></div>
                <div class="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-white rounded-xl shadow-lg p-8 text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-lg font-semibold">{{ errorMessage }}</p>
          </div>
          <button
            (click)="loadItemDetails()"
            class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Item Details -->
        <div *ngIf="item && !isLoading && !errorMessage" class="bg-white rounded-xl shadow-xl overflow-hidden">
          <!-- Header with Status and Type -->
          <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span
                    [class]="getTypeBadgeClass(item.type)"
                    class="px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {{ item.type === 'lost' ? 'LOST ITEM' : 'FOUND ITEM' }}
                  </span>
                  <span
                    *ngIf="item.status === 'resolved'"
                    class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    RESOLVED
                  </span>
                </div>
                <h1 class="text-3xl font-bold">{{ item.title }}</h1>
                <p class="text-orange-100 mt-1">Posted on {{ formatDate(item.createdAt) }}</p>
              </div>
              <div *ngIf="showOwnerActions && isOwner" class="flex gap-2">
                <button
                  (click)="editItem()"
                  class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  (click)="confirmDelete()"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="p-6">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- Image Section -->
              <div class="w-full lg:w-1/2">
                <div class="relative group">
                  <img
                    [src]="item.imageUrl || item.image || 'assets/package_placeholder.jpg'"
                    [alt]="item.title"
                    class="w-full h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>

              <!-- Details Section -->
              <div class="w-full lg:w-1/2 space-y-6">
                <!-- Description -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                    </svg>
                    Description
                  </h2>
                  <p class="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Item Information -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
                    <div class="flex items-center mb-2">
                      <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="font-semibold text-gray-800">Location</span>
                    </div>
                    <p class="text-gray-700">{{ item.location }}</p>
                  </div>

                  <div class="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
                    <div class="flex items-center mb-2">
                      <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"></path>
                      </svg>
                      <span class="font-semibold text-gray-800">Category</span>
                    </div>
                    <p class="text-gray-700">{{ item.category }}</p>
                  </div>

                  <div class="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
                    <div class="flex items-center mb-2">
                      <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"></path>
                      </svg>
                      <span class="font-semibold text-gray-800">Date {{ item.type === 'lost' ? 'Lost' : 'Found' }}</span>
                    </div>
                    <p class="text-gray-700">{{ item.date }}</p>
                  </div>

                  <div class="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
                    <div class="flex items-center mb-2">
                      <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="font-semibold text-gray-800">Status</span>
                    </div>
                    <p class="text-gray-700 capitalize">{{ item.status || 'Active' }}</p>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-lg text-white">
                  <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Contact Information
                  </h3>
                  <p class="bg-white bg-opacity-20 p-3 rounded text-white">
                    {{ item.contactInfo }}
                  </p>
                  
                  <div class="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      (click)="copyContact()"
                      class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      Copy Contact
                    </button>
                    <a
                      [href]="'mailto:' + item.contactInfo"
                      class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center text-decoration-none"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Send Email
                    </a>
                  </div>
                </div>

                <!-- Additional Actions -->
                <div *ngIf="!isOwner" class="flex flex-col sm:flex-row gap-3">
                  <button
                    (click)="reportItem()"
                    class="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Report Item
                  </button>
                  <button
                    (click)="shareItem()"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                    </svg>
                    Share Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div class="p-6">
              <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Listing
              </h3>
              
              <p class="text-gray-600 text-center mb-6">
                Are you sure you want to delete "<strong>{{ item?.title }}</strong>"? This action cannot be undone.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  (click)="cancelDelete()"
                  class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  (click)="deleteItem()"
                  class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  item: Listing | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  isOwner: boolean = false;
  currentUserId: string = '';
  showOwnerActions: boolean = false;
  showDeleteModal: boolean = false;
  private subscriptions: Subscription = new Subscription();

  private readonly API_BASE_URL = environment.apiBaseUrl;
  private readonly ITEMS_ENDPOINT = `${this.API_BASE_URL}/api/item`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user
    const userSubscription = this.authService.user$.subscribe({
      next: (user) => {
        if (user && user.id) {
          this.currentUserId = user.id;
          this.checkOwnership();
        } else {
          const currentUser = this.authService.getUser();
          if (currentUser && currentUser.id) {
            this.currentUserId = currentUser.id;
            this.checkOwnership();
          }
        }
      }
    });

    this.subscriptions.add(userSubscription);

    // Get item ID from route parameters and check source
    const routeSubscription = this.route.params.subscribe(params => {
      const itemId = params['id'];
      if (itemId) {
        this.loadItemDetails(itemId);
      } else {
        this.errorMessage = 'Invalid item ID';
      }
    });

    // Check query parameters to determine if coming from my-listings
    const querySubscription = this.route.queryParams.subscribe(queryParams => {
      this.showOwnerActions = queryParams['from'] === 'my-listings';
    });

    this.subscriptions.add(routeSubscription);
    this.subscriptions.add(querySubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadItemDetails(itemId?: string): void {
    const id = itemId || this.route.snapshot.params['id'];
    if (!id) {
      this.errorMessage = 'Item ID is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const token = this.authService.getToken();
    const headers: any = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const subscription = this.http.get<{
      success: boolean;
      data: Listing;
      message?: string;
    }>(`${this.ITEMS_ENDPOINT}/${id}`, { headers }).subscribe({
      next: (response) => {
        if (response.success) {
          this.item = response.data;
          this.checkOwnership();
        } else {
          this.errorMessage = response.message || 'Failed to load item details';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading item details:', error);
        if (error.status === 404) {
          this.errorMessage = 'Item not found';
        } else if (error.status === 401) {
          this.errorMessage = 'Session expired. Please log in again.';
          this.authService.logout();
        } else {
          this.errorMessage = error.error?.message || 'Failed to load item details. Please try again.';
        }
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  checkOwnership(): void {
    if (this.item && this.currentUserId) {
      this.isOwner = this.item.userId === this.currentUserId;
    }
  }

  goBack(): void {
    if (this.showOwnerActions) {
      this.router.navigate(['/my-listings']);
    } else {
      // Go back to previous page or home
      window.history.back();
    }
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  editItem(): void {
    if (this.item) {
      this.router.navigate(['/edit-item', this.item.id]);
    }
  }

  deleteItem(): void {
    if (!this.item) return;

    this.showDeleteModal = false;

    const deleteData = {
      userId: this.currentUserId
    };

    const token = this.authService.getToken();
    const headers: any = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const subscription = this.http.request<{
      success: boolean;
      message: string;
    }>('DELETE', `${this.ITEMS_ENDPOINT}/${this.item.id}`, {
      body: deleteData,
      headers
    }).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Item deleted successfully');
          if (this.showOwnerActions) {
            this.router.navigate(['/my-listings']);
          } else {
            this.goBack();
          }
        } else {
          alert('Failed to delete item: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        if (error.status === 401) {
          this.authService.logout();
        } else {
          alert('Failed to delete item. Please try again.');
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  copyContact(): void {
    if (this.item?.contactInfo) {
      navigator.clipboard.writeText(this.item.contactInfo).then(() => {
        alert('Contact information copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = this.item!.contactInfo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Contact information copied to clipboard!');
      });
    }
  }

  shareItem(): void {
    if (this.item) {
      const shareData = {
        title: this.item.title,
        text: `${this.item.type === 'lost' ? 'Lost' : 'Found'}: ${this.item.title}`,
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(console.error);
      } else {
        // Fallback - copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Item URL copied to clipboard!');
        });
      }
    }
  }

  reportItem(): void {
    alert('Report functionality would be implemented here. This would typically open a modal or redirect to a report form.');
  }

  getTypeBadgeClass(type: string): string {
    if (type === 'lost') {
      return 'bg-red-600 bg-opacity-80';
    }
    return 'bg-green-600 bg-opacity-80';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}