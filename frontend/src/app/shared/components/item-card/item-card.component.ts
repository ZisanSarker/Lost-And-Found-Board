import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <!-- Image Container with Fixed Size -->
      <div class="relative h-48 w-full overflow-hidden bg-gray-200">
        <img 
          [src]="image || 'assets/package_placeholder.jpg'" 
          [alt]="title"
          (error)="onImageError($event)"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        <!-- Status Badge -->
        <div class="absolute top-3 right-3">
          <span 
            [class]="isLost ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
            class="px-3 py-1 rounded-full text-sm font-semibold shadow-md"
          >
            {{ isLost ? 'Lost' : 'Found' }}
          </span>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {{ title }}
        </h3>
        
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">
          {{ description }}
        </p>
        
        <!-- Location and Date -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center text-sm text-gray-500">
            <span class="mr-2">📍</span>
            <span class="truncate">{{ location }}</span>
          </div>
          
          <div class="flex items-center text-sm text-gray-500">
            <span class="mr-2">📅</span>
            <span>{{ date }}</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button 
            (click)="onViewDetails()"
            class="flex-1 bg-white hover:bg-orange-50 text-orange-500 border-2 border-orange-500 text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            View Details
          </button>
          
          <button 
            (click)="onContact()"
            [class]="isLost ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
            class="flex-1 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
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