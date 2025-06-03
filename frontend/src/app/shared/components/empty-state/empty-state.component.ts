import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-12">
      <div class="mb-4">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-500 mb-6 max-w-sm mx-auto">{{ message }}</p>
      
      <button
        *ngIf="showActionButton"
        (click)="onAction()"
        class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {{ actionButtonText }}
      </button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title: string = 'No items found';
  @Input() message: string = 'No items found matching your criteria.';
  @Input() showActionButton: boolean = false;
  @Input() actionButtonText: string = 'Create New';
  
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}