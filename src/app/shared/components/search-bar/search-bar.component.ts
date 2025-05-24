// search-bar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-4 w-4/6 mx-auto">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search input -->
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">🔍</span>
          <input
            type="text"
            [(ngModel)]="query"
            (input)="handleSearch()"
            (keydown.enter)="handleSearch()"
            placeholder="Search for items..."
            class="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <!-- Filters (desktop) -->
        <div class="hidden md:flex gap-2">
          <select 
            [(ngModel)]="category" 
            (change)="handleSearch()"
            class="px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="personal">Personal Items</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>

          <select 
            [(ngModel)]="location" 
            (change)="handleSearch()"
            class="px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="all">All Locations</option>
            <option value="downtown">Downtown</option>
            <option value="coffee shop">Coffee Shop</option>
            <option value="central park">Central Park</option>
            <option value="bus station">Bus Station</option>
            <option value="library">Library</option>
            <option value="park">Park</option>
          </select>
        </div>

        <!-- Filter toggle (mobile) -->
        <button
          class="md:hidden bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
          (click)="showFilters = !showFilters"
        >
          Filters
        </button>
      </div>

      <!-- Mobile filters -->
      <div *ngIf="showFilters" class="mt-4 flex flex-col gap-2 md:hidden">
        <select 
          [(ngModel)]="category" 
          (change)="handleSearch()"
          class="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="personal">Personal Items</option>
          <option value="documents">Documents</option>
          <option value="other">Other</option>
        </select>

        <select 
          [(ngModel)]="location" 
          (change)="handleSearch()"
          class="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Locations</option>
          <option value="downtown">Downtown</option>
          <option value="coffee shop">Coffee Shop</option>
          <option value="central park">Central Park</option>
          <option value="bus station">Bus Station</option>
          <option value="library">Library</option>
          <option value="park">Park</option>
        </select>
      </div>
    </div>
  `
})
export class SearchBarComponent {
  query = '';
  category = 'all';
  location = 'all';
  showFilters = false;

  @Output() search = new EventEmitter<{ query: string; category: string; location: string }>();

  handleSearch() {
    this.search.emit({
      query: this.query.trim(),
      category: this.category,
      location: this.location
    });
  }
}