import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type EmptyStateVariant = 'default' | 'search' | 'filter' | 'error' | 'success';
export type EmptyStateSize = 'sm' | 'md' | 'lg';
export type EmptyStateLayout = 'compact' | 'centered' | 'expanded';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="containerClass"
      [attr.data-testid]="'empty-state'"
    >
      <!-- Icon Section -->
      <div [class]="iconWrapperClass">
        <!-- Default Empty Icon -->
        <svg 
          *ngIf="variant === 'default'"
          class="mx-auto"
          [class]="iconClass"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>

        <!-- Search Empty Icon -->
        <svg 
          *ngIf="variant === 'search'"
          class="mx-auto"
          [class]="iconClass"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>

        <!-- Filter Empty Icon -->
        <svg 
          *ngIf="variant === 'filter'"
          class="mx-auto"
          [class]="iconClass"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
          />
        </svg>

        <!-- Success Empty Icon -->
        <svg 
          *ngIf="variant === 'success'"
          class="mx-auto"
          [class]="iconClass"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>

        <!-- Error Empty Icon -->
        <svg 
          *ngIf="variant === 'error'"
          class="mx-auto"
          [class]="iconClass"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>

        <!-- Custom Icon Slot -->
        <ng-content select="[icon]"></ng-content>
      </div>

      <!-- Content Section -->
      <div [class]="contentClass">
        <h3 [class]="titleClass">
          {{ title }}
          <ng-content select="[title-suffix]"></ng-content>
        </h3>
        <p [class]="messageClass">
          {{ message }}
          <ng-content select="[message-suffix]"></ng-content>
        </p>
        
        <!-- Action Buttons -->
        <div 
          *ngIf="showActionButton || showSecondaryButton"
          [class]="actionsClass"
        >
          <button
            *ngIf="showActionButton"
            (click)="onPrimaryAction()"
            [class]="primaryButtonClass"
            [attr.data-testid]="'primary-action'"
          >
            <ng-container *ngIf="actionButtonIcon">
              <svg 
                class="w-5 h-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  [attr.d]="actionButtonIcon"
                />
              </svg>
            </ng-container>
            {{ actionButtonText }}
          </button>

          <button
            *ngIf="showSecondaryButton"
            (click)="onSecondaryAction()"
            [class]="secondaryButtonClass"
            [attr.data-testid]="'secondary-action'"
          >
            {{ secondaryButtonText }}
          </button>
        </div>

        <!-- Extra Content Slot -->
        <div [class]="extraContentClass">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title: string = 'No items found';
  @Input() message: string = 'No items found matching your criteria.';
  @Input() variant: EmptyStateVariant = 'default';
  @Input() size: EmptyStateSize = 'md';
  @Input() layout: EmptyStateLayout = 'centered';
  
  @Input() showActionButton: boolean = false;
  @Input() actionButtonText: string = 'Create New';
  @Input() actionButtonIcon?: string;
  
  @Input() showSecondaryButton: boolean = false;
  @Input() secondaryButtonText: string = 'Clear Filters';
  
  @Input() timestamp?: string = '2025-06-04 05:59:47';
  @Input() username?: string = 'ZisanSarker';

  @Output() action = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  get containerClass(): string {
    const baseClass = 'text-center';
    const layoutClasses = {
      compact: 'py-6',
      centered: 'py-12',
      expanded: 'py-16'
    };
    return `${baseClass} ${layoutClasses[this.layout]}`;
  }

  get iconWrapperClass(): string {
    return 'mb-4';
  }

  get iconClass(): string {
    const sizeClasses = {
      sm: 'h-12 w-12',
      md: 'h-16 w-16',
      lg: 'h-20 w-20'
    };
    const variantClasses = {
      default: 'text-gray-400',
      search: 'text-blue-400',
      filter: 'text-yellow-400',
      error: 'text-red-400',
      success: 'text-green-400'
    };
    return `${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  get contentClass(): string {
    const sizeClasses = {
      sm: 'max-w-xs',
      md: 'max-w-sm',
      lg: 'max-w-md'
    };
    return `mx-auto ${sizeClasses[this.size]}`;
  }

  get titleClass(): string {
    const sizeClasses = {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl'
    };
    return `font-medium text-gray-900 mb-2 ${sizeClasses[this.size]}`;
  }

  get messageClass(): string {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    return `text-gray-500 mb-6 ${sizeClasses[this.size]}`;
  }

  get actionsClass(): string {
    return 'flex justify-center gap-4';
  }

  get primaryButtonClass(): string {
    const baseClass = 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeClasses = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg'
    };
    const variantClasses = {
      default: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500',
      search: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      filter: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      error: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
    };
    return `${baseClass} ${sizeClasses[this.size]} ${variantClasses[this.variant]} rounded-lg`;
  }

  get secondaryButtonClass(): string {
    const baseClass = 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeClasses = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2 text-base',
      lg: 'px-8 py-3 text-lg'
    };
    return `${baseClass} ${sizeClasses[this.size]} bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500 rounded-lg`;
  }

  get extraContentClass(): string {
    return 'mt-6';
  }

  onPrimaryAction(): void {
    this.action.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}