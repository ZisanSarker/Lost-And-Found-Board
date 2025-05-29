// all-posts.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ItemGridComponent } from '../item-grid/item-grid.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { environment } from '../../../../environments/environment';
const baseUrl = environment.apiBaseUrl;

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  contactInfo: string;
  userId: string;
  image?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: Item[];
  count: number;
  message: string;
}

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
              [class]="
                activeTab === 'lost'
                  ? 'bg-orange-500 text-white'
                  : 'text-orange-500'
              "
              class="px-6 py-2 rounded-md font-medium transition-all duration-200"
            >
              Lost Items ({{ filteredLostItems.length }})
            </button>
            <button
              (click)="setActiveTab('found')"
              [class]="
                activeTab === 'found'
                  ? 'bg-orange-500 text-white'
                  : 'text-orange-500'
              "
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
  activeTab: 'lost' | 'found' = 'lost';
  isLoading = true;
  showAll = false;
  error: string = '';

  searchQuery = '';
  searchCategory = 'all';
  searchLocation = 'all';

  lostItems: Item[] = [];
  foundItems: Item[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  setActiveTab(tab: 'lost' | 'found') {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.showAll = false;
      this.error = '';

      if (tab === 'lost' && this.lostItems.length === 0) {
        this.loadItemsByType('lost');
      } else if (tab === 'found' && this.foundItems.length === 0) {
        this.loadItemsByType('found');
      }
    }
  }

  loadData() {
    this.error = '';
    this.isLoading = true;
    
    forkJoin({
      lost: this.http.get<ApiResponse>(`${baseUrl}/api/item/type/lost`),
      found: this.http.get<ApiResponse>(`${baseUrl}/api/item/type/found`)
    }).subscribe({
      next: (responses) => {
        if (responses.lost.success) {
          this.lostItems = responses.lost.data;
        } else {
          console.error('Failed to load lost items:', responses.lost.message);
        }

        if (responses.found.success) {
          this.foundItems = responses.found.data;
        } else {
          console.error('Failed to load found items:', responses.found.message);
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

  loadItemsByType(type: 'lost' | 'found') {
    this.isLoading = true;
    this.error = '';

    this.http.get<ApiResponse>(`${baseUrl}/api/item/type/${type}`)
      .subscribe({
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
    return this.filterItems(this.lostItems);
  }

  get filteredFoundItems(): Item[] {
    return this.filterItems(this.foundItems);
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

  private filterItems(items: Item[]): Item[] {
    return items.filter((item) => {
      const matchesQuery = !this.searchQuery ||
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.searchCategory === 'all' ||
        item.category === this.searchCategory ||
        this.getItemCategory(item) === this.searchCategory;

      const matchesLocation = this.searchLocation === 'all' ||
        item.location.toLowerCase().includes(this.searchLocation.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }

  private getItemCategory(item: Item): string {
    if (item.category && item.category !== 'other') {
      return item.category;
    }
    const text = (item.title + ' ' + item.description).toLowerCase();

    if (text.includes('phone') || text.includes('laptop') || text.includes('watch') || 
        text.includes('tablet') || text.includes('headphones') || text.includes('charger')) {
      return 'electronics';
    }
    if (text.includes('wallet') || text.includes('keys') || text.includes('ring') ||
        text.includes('jewelry') || text.includes('necklace') || text.includes('bracelet')) {
      return 'accessories';
    }
    if (text.includes('document') || text.includes('book') || text.includes('card') ||
        text.includes('passport') || text.includes('license') || text.includes('certificate')) {
      return 'documents';
    }
    if (text.includes('shirt') || text.includes('jacket') || text.includes('pants') ||
        text.includes('dress') || text.includes('shoes') || text.includes('clothing')) {
      return 'clothing';
    }
    if (text.includes('bag') || text.includes('backpack') || text.includes('purse') ||
        text.includes('suitcase') || text.includes('briefcase')) {
      return 'bags';
    }
    
    return 'other';
  }

  getEmptyMessage(): string {
    if (this.searchQuery || this.searchCategory !== 'all' || this.searchLocation !== 'all') {
      return `No ${this.activeTab} items found matching your search criteria`;
    }
    return `No ${this.activeTab} items found`;
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