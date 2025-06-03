import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4">
      <label class="block text-sm font-semibold text-orange-800 mb-1">
        {{ label }}
      </label>
      <input
        [type]="type"
        [formControl]="control"
        [placeholder]="placeholder"
        class="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <p
        *ngIf="control?.touched && control?.invalid"
        class="text-sm text-red-600 mt-1"
      >
        {{ errorMessage }}
      </p>
    </div>
  `,
})
export class FormInputComponent {
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
}
