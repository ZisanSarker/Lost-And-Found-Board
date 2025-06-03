import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterTab, ListingFilter } from '../../../../shared/models/listing.model';

@Component({
  selector: 'app-listing-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 border-b border-orange-500">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 class="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            My Listings
          </h3>
          <p class="text-gray-700">
            Manage your lost and found item listings
          </p>
        </div>
        
        <div class="flex w-full sm:w-auto">
          <div class="relative flex-1 sm:w-64">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search listings..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              (keyup.enter)="onSearch()"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
            />
          </div>
          
          <button
            (click)="onSearch()"
            class="ml-2 p-2 border border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Filter Tabs -->
      <div class="flex bg-orange-50 rounded-lg p-1 mb-6">
        <button
          *ngFor="let tab of filterTabs"
          [class]="getFilterTabClass(tab.value)"
          (click)="onFilterChange(tab.value)"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  `
})
export class ListingFilterComponent {
  @Input() activeFilter: ListingFilter = 'all';
  @Input() searchQuery: string = '';
  @Output() filterChange = new EventEmitter<ListingFilter>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  filterTabs: FilterTab[] = [
    { label: 'All', value: 'all' },
    { label: 'Lost', value: 'lost' },
    { label: 'Found', value: 'found' },
  ];

  onFilterChange(filter: ListingFilter): void {
    this.filterChange.emit(filter);
  }

  onSearchChange(query: string): void {
    this.searchChange.emit(query);
  }

  onSearch(): void {
    this.search.emit();
  }

  getFilterTabClass(filter: ListingFilter): string {
    const baseClass = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200';
    if (this.activeFilter === filter) {
      return `${baseClass} bg-white text-orange-700 shadow-sm`;
    }
    return `${baseClass} text-gray-600 hover:text-orange-700`;
  }
}