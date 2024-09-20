import { AbstractControl } from '@angular/forms';
export function ValidateInt(
  control: AbstractControl
): { notInt: boolean } | null {
  const INT_REGEX = /^\d+$/;
  return !INT_REGEX.test(control.value) ? { notInt: true } : null;
} // ValidatePhone
