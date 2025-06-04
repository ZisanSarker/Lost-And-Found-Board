import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ListingService } from '../../core/services/listing.service';
import { Listing, ListingFilter } from '../../shared/models/listing.model';
import { ListingUtils } from './utils/listing.utils';
import { ListingFilterComponent } from './components/listing-filter/listing-filter.component';
import { ListingCardComponent } from './components/listing-card/listing-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent, EmptyStateVariant } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [
    CommonModule,
    ListingFilterComponent,
    ListingCardComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="bg-gradient-to-br from-orange-100 to-orange-300 rounded-lg shadow-lg drop-shadow-lg border-2 border-orange-500">
      <app-listing-filter
        [activeFilter]="activeFilter"
        [searchQuery]="searchQuery"
        (filterChange)="onFilterChange($event)"
        (searchChange)="onSearchChange($event)"
        (search)="onSearch()"
      ></app-listing-filter>

      <div class="px-6 pb-6">
        <app-loading-state
          *ngIf="isLoading"
          [style]="'skeleton'"
          [itemCount]="3"
          [showImage]="true"
          [variant]="'primary'"
          [text]="getLoadingText()"
          [overlay]="isInitialLoad"
        />

        <app-error-state
          *ngIf="errorMessage && !isLoading"
          [title]="getErrorTitle()"
          [errorMessage]="errorMessage"
          [variant]="getErrorVariant()"
          [layout]="isInitialLoad ? 'centered' : 'inline'"
          size="md"
          [showRetryButton]="showRetryButton"
          [retryButtonText]="getRetryButtonText()"
          [showDismissButton]="getErrorVariant() === 'warning'"
          [dismissButtonText]="'Log In'"
          (retry)="onErrorRetry()"
          (dismiss)="onErrorDismiss()"
        ></app-error-state>

        <app-empty-state
          *ngIf="!isLoading && !errorMessage && filteredListings.length === 0"
          [title]="getEmptyStateTitle()"
          [message]="getEmptyStateMessage()"
          [variant]="getEmptyStateVariant()"
          [size]="'md'"
          [layout]="'centered'"
          [showActionButton]="shouldShowActionButton()"
          [actionButtonText]="getActionButtonText()"
          [showSecondaryButton]="shouldShowSecondaryButton()"
          [secondaryButtonText]="getSecondaryButtonText()"
          [timestamp]="currentTimestamp"
          [username]="currentUsername"
          (action)="onEmptyStateAction()"
          (secondaryAction)="onEmptyStateSecondaryAction()"
        >
          <ng-container *ngIf="searchQuery" message-suffix>
            <span class="block mt-2 text-sm text-gray-400">
              Try using different keywords or removing filters
            </span>
          </ng-container>
        </app-empty-state>

        <div
          *ngIf="!isLoading && !errorMessage && filteredListings.length > 0"
          class="space-y-4"
        >
          <app-listing-card
            *ngFor="let listing of filteredListings"
            [listing]="listing"
            (view)="onViewListing($event)"
            (edit)="onEditListing($event)"
            (delete)="onDeleteListing($event)"
          >
          </app-listing-card>
        </div>
      </div>
    </div>
  `,
})
export class MyListingsComponent implements OnInit, OnDestroy {
  @Input() userId: string = '';

  isInitialLoad = true;
  activeFilter: ListingFilter = 'all';
  searchQuery = '';
  isLoading = false;
  errorMessage = '';
  myListings: Listing[] = [];
  filteredListings: Listing[] = [];
  currentTimestamp = '2025-06-04 06:12:32';
  currentUsername = 'ZisanSarker';
  
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    this.initializeUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeUser(): void {
    const userSubscription = this.authService.user$.subscribe({
      next: (user) => {
        if (user?.id) {
          this.userId = user.id;
          this.loadUserListings();
        } else if (!this.userId) {
          const currentUser = this.authService.getUser();
          if (currentUser?.id) {
            this.userId = currentUser.id;
            this.loadUserListings();
          } else {
            this.errorMessage = 'User not authenticated. Please log in.';
          }
        }
      },
      error: (error) => {
        console.error('Error getting user information:', error);
        this.errorMessage = 'Failed to get user information.';
      },
    });

    this.subscriptions.add(userSubscription);

    if (this.userId) {
      this.loadUserListings();
    }
  }

  loadUserListings(): void {
    if (!this.userId) {
      this.errorMessage = 'User ID is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const subscription = this.listingService
      .getUserListings(this.userId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.myListings = response.data || [];
            this.applyFilters();
            
            if (this.searchQuery && this.filteredListings.length === 0) {
              this.searchQuery = '';
              this.applyFilters();
            }
          } else {
            this.errorMessage = response.message || 'Failed to load listings';
          }
          this.isLoading = false;
          this.isInitialLoad = false;
        },
        error: (error) => {
          console.error('Error loading user listings:', error);
          this.handleError(error);
          this.isLoading = false;
          this.isInitialLoad = false;
        },
      });

    this.subscriptions.add(subscription);
  }

  onFilterChange(filter: ListingFilter): void {
    if (this.activeFilter !== filter) {
      this.activeFilter = filter;
      this.applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSearchChange(query: string): void {
    if (this.searchQuery !== query) {
      this.searchQuery = query;
      this.applyFilters();
    }
  }

  onSearch(): void {
    this.applyFilters();
    if (this.searchQuery) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private applyFilters(): void {
    this.filteredListings = ListingUtils.filterListings(
      this.myListings,
      this.activeFilter,
      this.searchQuery
    );
  }

  getLoadingText(): string {
    if (this.isInitialLoad) return 'Loading your listings...';
    if (this.searchQuery) return `Searching for "${this.searchQuery}"...`;
    
    switch (this.activeFilter) {
      case 'lost': return 'Loading lost items...';
      case 'found': return 'Loading found items...';
      default: return 'Loading listings...';
    }
  }

  get showRetryButton(): boolean {
    return this.errorMessage !== 'User not authenticated. Please log in.';
  }

  getErrorTitle(): string {
    if (this.errorMessage.includes('User not authenticated')) return 'Authentication Required';
    if (this.errorMessage.includes('Session expired')) return 'Session Expired';
    if (!this.userId) return 'Missing Information';
    if (this.searchQuery) return 'Search Error';
    return 'Error Loading Listings';
  }

  getErrorVariant(): 'danger' | 'warning' | 'info' {
    if (this.errorMessage.includes('User not authenticated') || 
        this.errorMessage.includes('Session expired')) return 'warning';
    if (this.errorMessage.includes('User ID is required')) return 'info';
    return 'danger';
  }

  getRetryButtonText(): string {
    if (this.searchQuery) return 'Try Different Search';
    switch (this.activeFilter) {
      case 'lost': return 'Reload Lost Items';
      case 'found': return 'Reload Found Items';
      default: return 'Try Again';
    }
  }

  onErrorRetry(): void {
    if (this.searchQuery) this.searchQuery = '';
    this.loadUserListings();
  }

  onErrorDismiss(): void {
    if (this.errorMessage.includes('User not authenticated') || 
        this.errorMessage.includes('Session expired')) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: '/my-listings',
          message: this.errorMessage,
        },
      });
    }
  }

  getEmptyStateVariant(): EmptyStateVariant {
    if (this.searchQuery) return 'search';
    if (this.activeFilter !== 'all') return 'filter';
    return 'default';
  }

  shouldShowActionButton(): boolean {
    return this.activeFilter === 'all' && !this.searchQuery;
  }

  shouldShowSecondaryButton(): boolean {
    return Boolean(this.searchQuery) || this.activeFilter !== 'all';
  }

  getActionButtonText(): string {
    return 'Create New Listing';
  }

  getSecondaryButtonText(): string {
    if (this.searchQuery) return 'Clear Search';
    if (this.activeFilter !== 'all') return 'View All Listings';
    return 'Clear Filters';
  }

  getEmptyStateTitle(): string {
    if (this.searchQuery) return `No Results for "${this.searchQuery}"`;
    
    switch (this.activeFilter) {
      case 'lost': return 'No Lost Item Listings';
      case 'found': return 'No Found Item Listings';
      default: return 'Start Your First Listing';
    }
  }

  getEmptyStateMessage(): string {
    if (this.searchQuery) {
      return `We couldn't find any listings matching "${this.searchQuery}"${
        this.activeFilter !== 'all' ? ` in your ${this.activeFilter} items` : ''
      }. Try different keywords or adjust your filters.`;
    }
    
    switch (this.activeFilter) {
      case 'lost':
        return "You haven't posted any lost item listings yet. Create one to start searching for your lost items.";
      case 'found':
        return "You haven't posted any found item listings yet. Help others by posting items you've found.";
      default:
        return "Ready to post your first listing? Whether you've lost or found something, creating a listing is the first step to making a connection.";
    }
  }

  onEmptyStateAction(): void {
    if (this.shouldShowActionButton()) {
      this.onCreateNewListing();
    }
  }

  onEmptyStateSecondaryAction(): void {
    if (this.searchQuery) {
      this.searchQuery = '';
      this.onSearchChange('');
    } else if (this.activeFilter !== 'all') {
      this.activeFilter = 'all';
      this.onFilterChange('all');
    }
  }

  onCreateNewListing(): void {
    this.router.navigate(['/post-item']);
  }

  onViewListing(listing: Listing): void {
    this.router.navigate(['/item-detail', listing.id], {
      queryParams: { from: 'my-listings' },
    });
  }

  onEditListing(listing: Listing): void {
    this.router.navigate(['/edit-item', listing.id]);
  }

  onDeleteListing(listing: Listing): void {
    if (!this.confirmDelete()) return;

    const subscription = this.listingService
      .deleteListing(listing.id, this.userId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.myListings = this.myListings.filter(
              (item) => item.id !== listing.id
            );
            this.applyFilters();
          } else {
            alert('Failed to delete listing: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error deleting listing:', error);
          this.handleError(error);
          alert('Failed to delete listing. Please try again.');
        },
      });

    this.subscriptions.add(subscription);
  }

  private confirmDelete(): boolean {
    return confirm(
      'Are you sure you want to delete this listing? This action cannot be undone.'
    );
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.errorMessage = 'Session expired. Please log in again to continue.';
      this.authService.logout();
    } else if (error.status === 403) {
      this.errorMessage = "You don't have permission to access these listings.";
    } else if (error.status === 404) {
      this.errorMessage = 'The requested listings could not be found.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      this.errorMessage = error.error?.message || 'An unexpected error occurred while loading listings. Please try again.';
    }
  }
}