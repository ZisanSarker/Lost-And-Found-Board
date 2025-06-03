// src/app/features/my-listings/my-listings.component.ts
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
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [
    CommonModule,
    ListingFilterComponent,
    ListingCardComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent
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
        <!-- Loading State -->
        <app-loading-state
          *ngIf="isLoading"
          [itemCount]="2">
        </app-loading-state>

        <!-- Error State -->
        <app-error-state
          *ngIf="errorMessage && !isLoading"
          [errorMessage]="errorMessage"
          [showRetryButton]="true"
          [retryButtonText]="'Retry'"
          (retry)="loadUserListings()">
        </app-error-state>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!isLoading && !errorMessage && filteredListings.length === 0"
          [title]="getEmptyStateTitle()"
          [message]="getEmptyStateMessage()"
          [showActionButton]="activeFilter === 'all' && !searchQuery"
          [actionButtonText]="'Create New Listing'"
          (action)="onCreateNewListing()">
        </app-empty-state>

        <!-- Listings -->
        <div *ngIf="!isLoading && !errorMessage && filteredListings.length > 0" class="space-y-4">
          <app-listing-card
            *ngFor="let listing of filteredListings"
            [listing]="listing"
            (view)="onViewListing($event)"
            (edit)="onEditListing($event)"
            (delete)="onDeleteListing($event)">
          </app-listing-card>
        </div>
      </div>
    </div>
  `
})
export class MyListingsComponent implements OnInit, OnDestroy {
  @Input() userId: string = '';

  activeFilter: ListingFilter = 'all';
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  myListings: Listing[] = [];
  filteredListings: Listing[] = [];

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
      }
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

    const subscription = this.listingService.getUserListings(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.myListings = response.data || [];
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Failed to load listings';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user listings:', error);
        this.handleError(error);
        this.isLoading = false;
      }
    });

    this.subscriptions.add(subscription);
  }

  onFilterChange(filter: ListingFilter): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredListings = ListingUtils.filterListings(
      this.myListings,
      this.activeFilter,
      this.searchQuery
    );
  }

  getEmptyStateTitle(): string {
    if (this.searchQuery) {
      return 'No search results';
    }
    
    switch (this.activeFilter) {
      case 'lost':
        return 'No lost item listings';
      case 'found':
        return 'No found item listings';
      default:
        return 'No listings yet';
    }
  }

  getEmptyStateMessage(): string {
    if (this.searchQuery) {
      return `No listings found matching "${this.searchQuery}". Try adjusting your search terms.`;
    }
    
    switch (this.activeFilter) {
      case 'lost':
        return 'You don\'t have any lost item listings at the moment.';
      case 'found':
        return 'You don\'t have any found item listings yet.';
      default:
        return 'Start by creating your first lost or found item listing!';
    }
  }

  onCreateNewListing(): void {
    this.router.navigate(['/post-item']);
  }

  onViewListing(listing: Listing): void {
    this.router.navigate(['/item-detail', listing.id], {
      queryParams: { from: 'my-listings' }
    });
  }

  onEditListing(listing: Listing): void {
    this.router.navigate(['/edit-item', listing.id]);
  }

  onDeleteListing(listing: Listing): void {
    if (!this.confirmDelete()) {
      return;
    }

    const subscription = this.listingService.deleteListing(listing.id, this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.myListings = this.myListings.filter(item => item.id !== listing.id);
          this.applyFilters();
        } else {
          alert('Failed to delete listing: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error deleting listing:', error);
        this.handleError(error);
        alert('Failed to delete listing. Please try again.');
      }
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
      this.errorMessage = 'Session expired. Please log in again.';
      this.authService.logout();
    } else {
      this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
    }
  }
}