import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ErrorStateVariant = 'danger' | 'warning' | 'info';
export type ErrorStateSize = 'sm' | 'md' | 'lg';
export type ErrorStateLayout = 'inline' | 'centered' | 'fullscreen';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="containerClass"
      [ngStyle]="layout === 'fullscreen' ? { position: 'fixed', inset: '0', zIndex: '50' } : {}"
    >
      <div
        [class]="contentClass"
        (click)="layout === 'fullscreen' ? $event.stopPropagation() : null"
      >
        <!-- Icon -->
        <div [class]="iconContainerClass">
          <svg
            [class]="iconClass"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              *ngIf="variant === 'danger'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
            <path
              *ngIf="variant === 'warning'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              *ngIf="variant === 'info'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Title and Message -->
        <div [class]="textContainerClass">
          <h3 
            *ngIf="title"
            [class]="titleClass"
          >
            {{ title }}
          </h3>
          <p [class]="messageClass">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div 
          *ngIf="showRetryButton || showDismissButton"
          class="flex gap-3 justify-center mt-4"
        >
          <button
            *ngIf="showRetryButton"
            (click)="onRetry()"
            [class]="retryButtonClass"
          >
            {{ retryButtonText }}
          </button>
          <button
            *ngIf="showDismissButton"
            (click)="onDismiss()"
            [class]="dismissButtonClass"
          >
            {{ dismissButtonText }}
          </button>
        </div>

        <!-- Optional Details -->
        <div 
          *ngIf="showDetails && errorDetails"
          class="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-left"
        >
          <pre class="whitespace-pre-wrap font-mono">{{ errorDetails }}</pre>
        </div>
      </div>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() errorMessage: string = 'An error occurred';
  @Input() title?: string;
  @Input() errorDetails?: string;
  @Input() variant: ErrorStateVariant = 'danger';
  @Input() size: ErrorStateSize = 'md';
  @Input() layout: ErrorStateLayout = 'inline';
  
  @Input() showRetryButton: boolean = true;
  @Input() retryButtonText: string = 'Retry';
  @Input() showDismissButton: boolean = false;
  @Input() dismissButtonText: string = 'Dismiss';
  @Input() showDetails: boolean = false;
  
  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  get containerClass(): string {
    const baseClass = 'flex items-center justify-center';
    const layoutClasses = {
      inline: 'w-full py-4',
      centered: 'min-h-[200px] p-4',
      fullscreen: 'min-h-screen bg-gray-900/50 backdrop-blur-sm p-4'
    };
    
    return `${baseClass} ${layoutClasses[this.layout]}`;
  }

  get contentClass(): string {
    const baseClass = 'text-center';
    const layoutClasses = {
      inline: 'w-full',
      centered: 'bg-white rounded-2xl p-8 shadow-lg max-w-md',
      fullscreen: 'bg-white rounded-2xl p-8 shadow-2xl max-w-md animate-in zoom-in-95 duration-300'
    };
    
    return `${baseClass} ${layoutClasses[this.layout]}`;
  }

  get iconContainerClass(): string {
    const baseClass = 'mx-auto flex items-center justify-center rounded-full';
    const sizeClasses = {
      sm: 'w-10 h-10 mb-3',
      md: 'w-12 h-12 mb-4',
      lg: 'w-16 h-16 mb-6'
    };
    const variantClasses = {
      danger: 'bg-red-100',
      warning: 'bg-yellow-100',
      info: 'bg-blue-100'
    };
    
    return `${baseClass} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  get iconClass(): string {
    const baseClass = '';
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    const variantClasses = {
      danger: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    };
    
    return `${baseClass} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  get textContainerClass(): string {
    return 'space-y-1';
  }

  get titleClass(): string {
    const baseClass = 'font-semibold';
    const sizeClasses = {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl'
    };
    const variantClasses = {
      danger: 'text-red-800',
      warning: 'text-yellow-800',
      info: 'text-blue-800'
    };
    
    return `${baseClass} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  get messageClass(): string {
    const baseClass = '';
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    
    return `${baseClass} ${sizeClasses[this.size]} text-gray-600`;
  }

  get retryButtonClass(): string {
    const baseClass = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeClasses = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg'
    };
    const variantClasses = {
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
    };
    
    return `${baseClass} ${sizeClasses[this.size]} ${variantClasses[this.variant]} rounded-lg`;
  }

  get dismissButtonClass(): string {
    const baseClass = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeClasses = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg'
    };
    
    return `${baseClass} ${sizeClasses[this.size]} bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500 rounded-lg`;
  }

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}