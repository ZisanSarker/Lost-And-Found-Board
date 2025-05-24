import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-orange-600 overflow-hidden">
      <!-- Image block with fallback -->
      <div class="h-48 bg-orange-100 flex items-center justify-center relative">
        <img
          [src]="image || 'assets/package_placeholder.jpg'"
          [alt]="title"
          class="w-full h-full object-contain"
          (error)="onImageError($event)"
        />

        <!-- Status badge -->
        <span
          class="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded-full"
          [class]="isLost ? 'bg-red-500' : 'bg-green-500'"
        >
          {{ isLost ? 'Lost' : 'Found' }}
        </span>
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ description }}</p>
        
        <!-- Location and date -->
        <div class="flex items-center text-sm text-gray-500 mb-2">
          <span class="mr-2">📍</span>
          <span>{{ location }}</span>
        </div>
        
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <span class="mr-2">📅</span>
          <span>{{ date }}</span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            (click)="onViewDetails()"
            class="flex-1 px-3 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </button>
          <button
            (click)="onContact()"
            class="flex-1 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  `
})
export class ItemCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() location!: string;
  @Input() date!: string;
  @Input() type!: 'lost' | 'found';
  @Input() image?: string;

  get isLost(): boolean {
    return this.type === 'lost';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/package_placeholder.jpg';
  }

  onViewDetails() {
    alert(`Viewing details for: ${this.title}`);
  }

  onContact() {
    alert(`Contact for: ${this.title}`);
  }
}
