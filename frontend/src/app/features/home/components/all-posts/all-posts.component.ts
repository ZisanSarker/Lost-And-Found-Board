import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemGridComponent } from '../../../../shared/components/item-grid/item-grid.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { Item, ItemType } from '../../../../shared/models/item.model';
import { ItemService } from '../../../../core/services/item.service';
import { ItemFilterService } from '../../../../core/services/item-filter.service';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, ItemGridComponent, SearchBarComponent],
  template: `
    <div class="min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-5xl font-bold text-orange-800 mb-4 animate-bounce">
            Find What Matters Most
          </h1>
          <p class="text-orange-600 text-xl">
            Search through our database of lost and found items to find what
            you're looking for.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
          <app-search-bar (search)="onSearch($event)"></app-search-bar>
        </div>

        <!-- Tab Switcher -->
        <div class="flex justify-center mb-8">
          <div class="bg-white rounded-lg p-1 shadow-md">
            <button
              (click)="setActiveTab('lost')"
              [class]="activeTab === 'lost' ? 'bg-orange-500 text-white' : 'text-orange-500'"
              class="px-6 py-2 rounded-md font-medium transition-all duration-200"
            >
              Lost Items ({{ filteredLostItems.length }})
            </button>
            <button
              (click)="setActiveTab('found')"
              [class]="activeTab === 'found' ? 'bg-orange-500 text-white' : 'text-orange-500'"
              class="px-6 py-2 rounded-md font-medium transition-all duration-200"
            >
              Found Items ({{ filteredFoundItems.length }})
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p class="text-orange-600 mt-2">Loading items...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !isLoading" class="text-center py-8">
          <p class="text-red-600">{{ error }}</p>
          <button 
            (click)="loadData()" 
            class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Items Grid -->
        <app-item-grid
          *ngIf="!isLoading && !error"
          [items]="visibleItems"
          [loading]="isLoading"
          [emptyMessage]="getEmptyMessage()"
        ></app-item-grid>

        <!-- See All / Show Less Button -->
        <div class="text-center mt-6" *ngIf="showToggleButton && !isLoading && !error">
          <button
            (click)="toggleShowAll()"
            class="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200"
          >
            {{ showAll ? 'Show Less' : 'See All ' + activeTab + ' Items' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AllPostsComponent implements OnInit {
  activeTab: ItemType = 'lost';
  isLoading = true;
  showAll = false;
  error: string = '';

  searchQuery = '';
  searchCategory = 'all';
  searchLocation = 'all';

  lostItems: Item[] = [];
  foundItems: Item[] = [];

  private itemService = inject(ItemService);
  private itemFilterService = inject(ItemFilterService);

  ngOnInit() {
    this.loadData();
  }

  setActiveTab(tab: ItemType) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.showAll = false;
      this.error = '';

      if ((tab === 'lost' && this.lostItems.length === 0) ||
          (tab === 'found' && this.foundItems.length === 0)) {
        this.loadItemsByType(tab);
      }
    }
  }

  loadData() {
    this.error = '';
    this.isLoading = true;
    
    this.itemService.getAllItems().subscribe({
      next: (responses) => {
        if (responses.lost.success) {
          this.lostItems = responses.lost.data;
        }
        if (responses.found.success) {
          this.foundItems = responses.found.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load items:', err);
        this.error = 'Failed to load items. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadItemsByType(type: ItemType) {
    this.isLoading = true;
    this.error = '';

    this.itemService.getItemsByType(type).subscribe({
      next: (response) => {
        if (response.success) {
          if (type === 'lost') {
            this.lostItems = response.data;
          } else {
            this.foundItems = response.data;
          }
        } else {
          this.error = response.message || `Failed to load ${type} items`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Failed to load ${type} items:`, err);
        this.error = `Failed to load ${type} items. Please try again.`;
        this.isLoading = false;
      }
    });
  }

  get filteredLostItems(): Item[] {
    return this.itemFilterService.filterItems(
      this.lostItems,
      this.searchQuery,
      this.searchCategory,
      this.searchLocation
    );
  }

  get filteredFoundItems(): Item[] {
    return this.itemFilterService.filterItems(
      this.foundItems,
      this.searchQuery,
      this.searchCategory,
      this.searchLocation
    );
  }

  get visibleItems(): Item[] {
    const items = this.activeTab === 'lost' 
      ? this.filteredLostItems 
      : this.filteredFoundItems;
    return this.showAll ? items : items.slice(0, 3);
  }

  get showToggleButton(): boolean {
    const items = this.activeTab === 'lost' 
      ? this.filteredLostItems 
      : this.filteredFoundItems;
    return items.length > 3;
  }

  getEmptyMessage(): string {
    const hasFilters = this.searchQuery || 
                      this.searchCategory !== 'all' || 
                      this.searchLocation !== 'all';
    return this.itemFilterService.getEmptyMessage(this.activeTab, hasFilters as boolean);
  }

  onSearch(searchData: { query: string; category: string; location: string }) {
    this.searchQuery = searchData.query;
    this.searchCategory = searchData.category;
    this.searchLocation = searchData.location;
    this.showAll = false;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}