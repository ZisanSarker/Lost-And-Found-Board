// item-grid.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-item-grid',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  template: `
    <!-- Loading state -->
    <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="h-48 bg-orange-100 animate-pulse"></div>
        <div class="p-4">
          <div class="h-4 bg-orange-100 rounded animate-pulse mb-2"></div>
          <div class="h-3 bg-orange-100 rounded animate-pulse mb-2"></div>
          <div class="h-3 bg-orange-100 rounded animate-pulse mb-4"></div>
          <div class="flex gap-2">
            <div class="flex-1 h-8 bg-orange-100 rounded animate-pulse"></div>
            <div class="flex-1 h-8 bg-orange-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div *ngIf="!loading && items.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">{{ emptyMessage }}</h3>
      <p class="text-gray-500">Try adjusting your search criteria</p>
    </div>

    <!-- Items grid -->
    <div *ngIf="!loading && items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <app-item-card
        *ngFor="let item of items; trackBy: trackByItemId"
        [id]="item.id"
        [title]="item.title"
        [description]="item.description"
        [location]="item.location"
        [date]="item.date"
        [type]="item.type"
        [image]="item.image"
      ></app-item-card>
    </div>
  `
})
export class ItemGridComponent {
  @Input() items: any[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No items found';

  trackByItemId(index: number, item: any): string {
    return item.id;
  }
}