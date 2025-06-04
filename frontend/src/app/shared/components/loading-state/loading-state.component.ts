import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingStyle = 'spinner' | 'skeleton' | 'progress';
export type LoadingSize = 'sm' | 'md' | 'lg';
export type LoadingVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Container with optional fullscreen -->
    <div
      [class]="containerClass"
      [ngStyle]="fullscreen ? { position: 'fixed', inset: '0', zIndex: '50' } : {}"
    >
      <!-- Spinner Type -->
      <div *ngIf="style === 'spinner'" class="flex flex-col items-center justify-center">
        <div
          [class]="spinnerClass"
          role="status"
          [attr.aria-label]="text || 'Loading'"
        ></div>
        <span
          *ngIf="text"
          [class]="textClass"
          >{{ text }}</span
        >
      </div>

      <!-- Skeleton Type -->
      <div
        *ngIf="style === 'skeleton'"
        class="space-y-4 w-full"
        [class.opacity-75]="overlay"
      >
        <div
          *ngFor="let i of skeletonItems"
          class="bg-white rounded-lg p-6 animate-pulse shadow-sm"
        >
          <div class="flex space-x-4">
            <div
              *ngIf="showImage"
              class="w-48 h-32 bg-gray-300 rounded-lg"
            ></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 rounded w-1/4"></div>
              <div class="h-6 bg-gray-300 rounded w-3/4"></div>
              <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Type -->
      <div
        *ngIf="style === 'progress'"
        class="w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden"
      >
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          [class]="progressClass"
          [style.width.%]="progress"
        ></div>
      </div>
    </div>
  `,
})
export class LoadingStateComponent {
  @Input() style: LoadingStyle = 'spinner';
  @Input() size: LoadingSize = 'md';
  @Input() variant: LoadingVariant = 'primary';
  @Input() text?: string;
  @Input() itemCount: number = 2;
  @Input() showImage: boolean = true;
  @Input() fullscreen: boolean = false;
  @Input() overlay: boolean = false;
  @Input() progress: number = 0;

  get skeletonItems(): number[] {
    return Array.from({ length: this.itemCount }, (_, i) => i + 1);
  }

  get containerClass(): string {
    const baseClass = 'flex items-center justify-center';
    const overlayClass = this.overlay ? 'bg-white/80 backdrop-blur-sm' : '';
    const spacingClass = this.fullscreen ? 'p-4' : '';

    return `${baseClass} ${overlayClass} ${spacingClass}`;
  }

  get spinnerClass(): string {
    const baseClass = 'inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]';
    
    // Size classes
    const sizeClasses = {
      sm: 'w-6 h-6 border-2',
      md: 'w-10 h-10 border-3',
      lg: 'w-16 h-16 border-4',
    };

    // Color classes
    const colorClasses = {
      primary: 'text-orange-500',
      secondary: 'text-gray-500',
      success: 'text-green-500',
      danger: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
    };

    return `${baseClass} ${sizeClasses[this.size]} ${colorClasses[this.variant]}`;
  }

  get textClass(): string {
    const baseClass = 'mt-4 font-medium';
    
    // Size classes
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    // Color classes
    const colorClasses = {
      primary: 'text-orange-700',
      secondary: 'text-gray-700',
      success: 'text-green-700',
      danger: 'text-red-700',
      warning: 'text-yellow-700',
      info: 'text-blue-700',
    };

    return `${baseClass} ${sizeClasses[this.size]} ${colorClasses[this.variant]}`;
  }

  get progressClass(): string {
    const baseClass = '';
    
    // Color classes
    const colorClasses = {
      primary: 'bg-orange-500',
      secondary: 'bg-gray-500',
      success: 'bg-green-500',
      danger: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    };

    return `${baseClass} ${colorClasses[this.variant]}`;
  }
}