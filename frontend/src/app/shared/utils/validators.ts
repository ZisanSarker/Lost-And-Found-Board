import { AbstractControl, ValidationErrors } from '@angular/forms';

export function contactInfoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return { required: true };
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[\+]?[\d\s\-\(\)]{10,}$/;
  
  if (emailPattern.test(value) || phonePattern.test(value)) {
    return null;
  }
  
  return { invalidContact: true };
}