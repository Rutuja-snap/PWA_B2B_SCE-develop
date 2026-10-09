import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PersonalDetailsFormsModel } from '../interfaces/forms.interface';
import { parse } from 'date-fns/parse';
import { differenceInYears } from 'date-fns/differenceInYears';
import { isValid } from 'date-fns/isValid';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  private defaultPersonalDetails = {
    fullName: '',
    dob: '',
    pan: '',
    empType: '',
    // loanType: '',
    customerConsent: false,
  };



  savedPersonalDetailsFormData: any = { ...this.defaultPersonalDetails };

  errors = {
    requiredErrMsg: 'This field cannot be left blank',
    multipleErrMsg: 'There are multiple errors on this screen',
    singleErrMsg: 'There is an error on this screen'
  };
  isTopupJourney: boolean = false;

  constructor(private fb: FormBuilder) { }

  resetSavedFormsData() {
    this.savedPersonalDetailsFormData = { ...this.defaultPersonalDetails };
  }

  // Common validation rules
  private minLengthValidator(length: number) {
    return Validators.minLength(length);
  }

  // Common method to create required validator
  requiredValidator() {
    return Validators.required;
  }

  // Common method to create a pattern validator
  patternValidator(pattern: string | RegExp) {
    return Validators.pattern(pattern);
  }

  // Centralized form control creation method with strict typing
  createFormControl<T>(value: T, validators: any[] = []): FormControl<T | null> {
    return this.fb.control(value, { validators }) as FormControl<T | null>;
  }

  // Custom validator for future-dated DOB in dd/MM/yyyy format
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const dobString = control.value;

    // Check if the date is in the valid format dd/MM/yyyy
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;
    if (!dateRegex.test(dobString)) {
      return { invalid: true };  // Invalid date format
    }

    // Split the date string into day, month, year
    const [day, month, year] = dobString.split('/').map(Number);
    const dob = new Date(year, month - 1, day);

    // Check if the date is in the future
    if (dob > today) {
      return { invalid: true };  // Date is in the future
    }

    return null;  // Date is valid
  }

  // Custom validator to check if the year is in the future
  futureYearValidator(control: AbstractControl): ValidationErrors | null {
    const inputYear = control.value;
    const currentYear = new Date().getFullYear();

    if (inputYear && inputYear > currentYear) {
      return { invalid: true };  // Return an error object if the year is in the future
    }
    return null;  // Return null if the year is valid
  }

  netMonthlyIncomeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && (value.length < 4)) {
        return { 'netMonthlyIncome': true };
      }
      return null;
    };
  }


  // Personal Details Forms creation with strict typing
  createPersonalDetailsForm(): FormGroup<PersonalDetailsFormsModel> {
    const form = this.fb.group({
      fullName: this.createFormControl(this.savedPersonalDetailsFormData.fullName, [this.requiredValidator(), this.patternValidator('^[a-zA-Z]+(?: [a-zA-Z]+)* *$')]),
      dob: this.createFormControl(this.savedPersonalDetailsFormData.dob, [this.requiredValidator(), this.futureDateValidator, this.eligibleAgeCheck()]),
      pan: this.createFormControl(this.savedPersonalDetailsFormData.pan, [this.requiredValidator(), this.patternValidator('^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$')]),
      empType: this.createFormControl(this.savedPersonalDetailsFormData.empType, [this.requiredValidator()]),
      // loanType: this.createFormControl(this.savedPersonalDetailsFormData.empType, [this.requiredValidator()]),
      customerConsent: this.createFormControl(this.savedPersonalDetailsFormData.customerConsent, [Validators.requiredTrue]),
    }) as FormGroup<PersonalDetailsFormsModel>;

    // if (this.isTopupJourney) {
    //   this.clearTopupJourneyValidators(form);
    // }
    // Re-run the validation after updating validators
    // form.updateValueAndValidity();
    return form;
  }

  clearTopupJourneyValidators(form: FormGroup<PersonalDetailsFormsModel>): void {
    // Clearing validators only for non-essential fields in topup journey
    const controlsToClear = ['fullName', 'gender', 'dob', 'pan', 'empType', 'pincode', 'city'];

    controlsToClear.forEach(controlName => {
      const control = form.get(controlName);
      if (control) {
        control.clearValidators();
      }
    });
  }



  focusOnFirstInvalidControl(formInfo: { details: FormGroup; directfields; commonInputs }) {
    // Main function to focus on the first invalid control in the form
    const firstInvalidControlName = this.findFirstInvalidControl(formInfo?.details);
    if (firstInvalidControlName) {
      const targetElement = this.getErrorFieldElement(formInfo, firstInvalidControlName);
      this.scrollAndFocus(targetElement);
    }
  }

  findFirstInvalidControl(formDetails): string | undefined {
    if (Object.keys(formDetails).length > 0) {
      // Returns the name of the first invalid control, or undefined if none are invalid
      return Object.keys(formDetails?.controls).find(
        key => formDetails?.controls[key]?.invalid
      );
    }
  }

  getErrorFieldElement(formInfo, controlName: string): HTMLElement | null {
    const commonField = this.findCommonErrorField(controlName, formInfo);
    const directField = this.findDirectErrorField(controlName, formInfo);
    // Return the found element, or null if neither is found
    return directField || commonField || null;
  }

  findCommonErrorField(controlName, formInfo) {
    // Attempt to locate the field as a common input fields
    const commonInputs = formInfo?.commonInputs;
    let fieldData = null;
    if (commonInputs && controlName) {
      fieldData = commonInputs.find(comp => comp?.formControl === formInfo?.details.get(controlName))?.nativeElement;
    }
    return fieldData;
  }

  findDirectErrorField(controlName, formInfo) {
    // If not a common input field, check within direct field
    const formFields = formInfo?.directfields;
    let fieldData = null;
    if (formFields) {
      fieldData = formFields.find(el => el.nativeElement.getAttribute('formControlName') === controlName)?.nativeElement;
    }
    return fieldData;
  }

  scrollAndFocus(element: HTMLElement | null): void {
    // To smoothly scroll and focus on a given HTML element
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  }

  eligibleAgeCheck() {
    try {
      return (control: AbstractControl): { [key: string]: boolean } | null => {

        console.log(typeof control.value, "typeof control.value")
        console.log(control.value, "control.value")

        if (!control.parent) {
          return null; // Control is not yet associated with a parent.
        }
        const date = control.value
        console.log(date, "date");

        const date2 = new Date();
        console.log(date2, "date2");
        // Parse the date string in DD/MM/YYYY format
        const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
        console.log(parsedDate, "parsedDate");
        
        // Check if the parsed date is valid
        if (!isValid(parsedDate)) {
          console.log('Invalid date')
          return {
            'dateValidator': true
          }
        }

        // Calculate age difference
        const mdiff = differenceInYears(date2, parsedDate);

        console.log("Age Check Validator :" + mdiff)

        if (mdiff < 18 || mdiff > 65) {
          if (mdiff < 0) {
            return {
              'dateValidator': true
            }
          }
          else {
            return {
              'isNotEligible': true
            }
          }
        }

        return null
      };
    } catch (error) {
      console.log(error)
    }
  }
}
