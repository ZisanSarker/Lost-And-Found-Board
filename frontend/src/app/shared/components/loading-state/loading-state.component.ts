import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div *ngFor="let i of skeletonItems" class="bg-white rounded-lg p-6 animate-pulse">
        <div class="flex space-x-4">
          <div class="w-48 h-32 bg-gray-300 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-1/4"></div>
            <div class="h-6 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoadingStateComponent {
  @Input() itemCount: number = 2;

  get skeletonItems(): number[] {
    return Array.from({ length: this.itemCount }, (_, i) => i + 1);
  }
}