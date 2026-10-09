import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputValidation]',
  standalone: true
})
export class InputValidationDirective {

  oldValue: any;
  initialValue: any;
 
  @Input('appInputValidation') validationType: string = '';
 
  // Regex patterns
  alphaPattern: RegExp = /[^a-zA-Z ]*/g;
  alphaNumericPattern: RegExp = /[^a-zA-Z0-9]*/g;
  numbersOnlyPattern: RegExp = /[^0-9]*/g;
  alphaNumericSpacePattern: RegExp = /[^a-zA-Z0-9\s]*/g;
  alphaNumericSpecialPattern: RegExp = /[^a-zA-Z0-9()\\/\\-]/g; // /[^a-zA-Z0-9()\/\\-]/g;
 
  constructor(private elementRef: ElementRef) { }
 
  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    if (!this.validationType) return;
 
    const inputElement = this.elementRef.nativeElement;
    this.initialValue = inputElement.value;
 
    // Handle each validation type with a separate block
    switch (this.validationType) {
      case 'alpha':
        this.applyBasicValidation(event, this.alphaPattern);
        break;
      case 'alphaNumeric':
        this.applyBasicValidation(event, this.alphaNumericPattern);
        break;
      case 'numbersOnly':
        this.applyBasicValidation(event, this.numbersOnlyPattern);
        break;
      case 'appAlphaNumericSpace':
        this.applyAdvancedValidation(event, this.alphaNumericSpacePattern, true);
        break;
      case 'appAlphaNumericSpecial':
        this.applyAdvancedValidation(event, this.alphaNumericSpecialPattern, false);
        break;
      default:
        console.error('Invalid validation type:', this.validationType);
    }
  }
 
  private applyBasicValidation(event: any, pattern: RegExp): void {
    // Handle space at first position
    if (this.initialValue.length === 1 && this.initialValue === ' ') {
      this.elementRef.nativeElement.value = '';
      return;
    }
 
    // Handle multiple spaces in string
    if (!this.initialValue.replace(/\s/g, '').length) {
      this.elementRef.nativeElement.value = '';
      return;
    }
 
    // Apply regex pattern
    this.elementRef.nativeElement.value = this.initialValue.replace(pattern, '');
    if (this.initialValue !== this.elementRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
 
  private applyAdvancedValidation(
    event: any,
    pattern: RegExp,
    trimLeftSpaces: boolean
  ): void {
    const inputElement = this.elementRef.nativeElement;
   
    // Apply pattern
    this.oldValue = this.initialValue.replace(pattern, '');
   
    // Apply additional transformations if needed
    if (trimLeftSpaces) {
      this.oldValue = this.oldValue.trimLeft();
    }
    inputElement.value = this.oldValue;
   
    // If value changed, stop propagation
    if (this.initialValue !== this.oldValue) {
      event.stopPropagation();
    }
  }

}
