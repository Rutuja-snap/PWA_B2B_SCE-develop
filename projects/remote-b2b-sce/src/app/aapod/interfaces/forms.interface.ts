import { FormControl } from '@angular/forms';

export interface PersonalDetailsFormsModel {
    fullName: FormControl<string | null>;
    dob: FormControl<string | null>;
    pan: FormControl<string | null>;
    empType: FormControl<string | null>;
    // loanType: FormControl<string | null>;
    customerConsent: FormControl<boolean | null>;
}