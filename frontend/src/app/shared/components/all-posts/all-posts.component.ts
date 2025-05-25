// all-posts.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ItemGridComponent } from '../item-grid/item-grid.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  image?: string;
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
          <h1 class="text-5xl font-bold text-orange-800 mb-4 animate-bounce">Find What Matters Most</h1>
          <p class="text-orange-600 text-xl">Search through our database of lost and found items to find what you're looking for.</p>
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

        <!-- Items Grid -->
        <app-item-grid
          [items]="visibleItems"
          [loading]="isLoading"
          [emptyMessage]="'No ' + activeTab + ' items found'"
        ></app-item-grid>

        <!-- See All / Show Less Button -->
        <div class="text-center mt-6" *ngIf="showToggleButton">
          <button
            (click)="toggleShowAll()"
            class="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200"
          >
            {{ showAll ? 'Show Less' : 'See All ' + activeTab + ' Items' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AllPostsComponent implements OnInit {
  activeTab: 'lost' | 'found' = 'lost';
  isLoading = true;
  showAll = false;

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
      this.showAll = false; // Reset showAll when tab changes
    }
  }

  loadData() {
    this.isLoading = true;

    const lostItems$ = this.http.get<Item[]>('http://localhost:3000/lostItems');
    const foundItems$ = this.http.get<Item[]>('http://localhost:3000/foundItems');

    forkJoin([lostItems$, foundItems$]).subscribe({
      next: ([lost, found]) => {
        this.lostItems = lost || [];
        this.foundItems = found || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load data from server:', err);
        this.setFallbackData();
        this.isLoading = false;
      }
    });
  }

  setFallbackData() {
    this.lostItems = [
      {
        id: 'lost-1',
        title: 'Lost Wallet',
        description: 'Brown leather wallet with ID and credit cards',
        location: 'Downtown',
        date: 'May 20, 2025',
        type: 'lost'
      },
      {
        id: 'lost-2',
        title: 'Missing iPhone',
        description: 'Blue iPhone 15 with cracked screen protector',
        location: 'Coffee Shop',
        date: 'May 21, 2025',
        type: 'lost'
      }
    ];

    this.foundItems = [
      {
        id: 'found-1',
        title: 'Found Keys',
        description: 'Set of house keys with red keychain',
        location: 'Central Park',
        date: 'May 22, 2025',
        type: 'found'
      },
      {
        id: 'found-2',
        title: 'Found Watch',
        description: 'Silver watch with black leather strap',
        location: 'Bus Station',
        date: 'May 23, 2025',
        type: 'found'
      }
    ];
  }

  get filteredLostItems(): Item[] {
    return this.filterItems(this.lostItems);
  }

  get filteredFoundItems(): Item[] {
    return this.filterItems(this.foundItems);
  }

  get visibleItems(): Item[] {
    const items = this.activeTab === 'lost' ? this.filteredLostItems : this.filteredFoundItems;
    return this.showAll ? items : items.slice(0, 3); // show 3 items by default
  }

  get showToggleButton(): boolean {
    const items = this.activeTab === 'lost' ? this.filteredLostItems : this.filteredFoundItems;
    return items.length > 3; // Show toggle button only if more than 3 items
  }

  private filterItems(items: Item[]): Item[] {
    return items.filter(item => {
      const matchesQuery = !this.searchQuery ||
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.searchCategory === 'all' ||
        this.getItemCategory(item) === this.searchCategory;

      const matchesLocation = this.searchLocation === 'all' ||
        item.location.toLowerCase().includes(this.searchLocation.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }

  private getItemCategory(item: Item): string {
    const text = (item.title + ' ' + item.description).toLowerCase();

    if (text.includes('phone') || text.includes('laptop') || text.includes('watch')) {
      return 'electronics';
    }
    if (text.includes('wallet') || text.includes('keys') || text.includes('ring')) {
      return 'personal';
    }
    if (text.includes('document') || text.includes('book') || text.includes('card')) {
      return 'documents';
    }
    return 'other';
  }

  onSearch(searchData: { query: string; category: string; location: string }) {
    this.searchQuery = searchData.query;
    this.searchCategory = searchData.category;
    this.searchLocation = searchData.location;
    this.showAll = false; // Reset showAll on new search
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}
