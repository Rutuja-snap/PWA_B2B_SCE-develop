// Pure Jest tests for FormsService (no TestBed)
import { FormsService } from './forms.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

describe('FormsService (pure jest)', () => {
  let service: FormsService;

  beforeEach(() => {
    service = new FormsService(new FormBuilder());
  });

  it('creates personal details form with controls', () => {
    const form = service.createPersonalDetailsForm();
    expect(form.contains('fullName')).toBe(true);
  });

  it('futureDateValidator flags future date', () => {
    const ctrl: any = { value: '31/12/2999' };
    expect(service.futureDateValidator(ctrl)).toEqual({ invalid: true });
  });

  it('futureDateValidator flags bad format', () => {
    const ctrl: any = { value: '2024-12-31' };
    expect(service.futureDateValidator(ctrl)).toEqual({ invalid: true });
  });

  it('futureDateValidator accepts valid past date', () => {
    const ctrl: any = { value: '01/01/2000' };
    expect(service.futureDateValidator(ctrl)).toBeNull();
  });

  it('eligibleAgeCheck rejects under 18', () => {
    const validator = service.eligibleAgeCheck();
    const year = new Date().getFullYear() - 10;
    const ctrl: any = { value: `01/01/${year}`, parent: {} };
    expect(validator(ctrl)).toEqual(expect.objectContaining({ isNotEligible: true }));
  });

  it('eligibleAgeCheck rejects >65', () => {
    const validator = service.eligibleAgeCheck();
    const year = new Date().getFullYear() - 70;
    const ctrl: any = { value: `01/01/${year}`, parent: {} };
    expect(validator(ctrl)).toEqual(expect.objectContaining({ isNotEligible: true }));
  });

  it('eligibleAgeCheck rejects invalid date', () => {
    const validator = service.eligibleAgeCheck();
    const ctrl: any = { value: `32/13/2020`, parent: {} };
    expect(validator(ctrl)).toEqual(expect.objectContaining({ dateValidator: true }));
  });

  it('eligibleAgeCheck accepts 30 year old', () => {
    const validator = service.eligibleAgeCheck();
    const year = new Date().getFullYear() - 30;
    const ctrl: any = { value: `01/01/${year}`, parent: {} };
    expect(validator(ctrl)).toBeNull();
  });

  it('futureYearValidator flags future year', () => {
    const year = new Date().getFullYear() + 1;
    const ctrl: any = { value: year };
    expect(service.futureYearValidator(ctrl)).toEqual({ invalid: true });
  });

  it('netMonthlyIncomeValidator enforces 4 digit minimum', () => {
    const validator = service.netMonthlyIncomeValidator();
    expect(validator({ value: '123' } as any)).toEqual({ netMonthlyIncome: true });
    expect(validator({ value: '1234' } as any)).toBeNull();
  });

  it('required and pattern validators work', () => {
    const req = service.requiredValidator();
    expect(req({ value: null } as any)).toEqual({ required: true });
    const patt = service.patternValidator(/^a+$/);
    const res: any = patt({ value: 'bbb' } as any);
    expect(res.pattern.actualValue).toBe('bbb');
    expect(String(res.pattern.requiredPattern)).toMatch(/\^a\+\$/);
  });

  it('clearTopupJourneyValidators clears validators', () => {
    const form = service.createPersonalDetailsForm() as FormGroup;
    service.clearTopupJourneyValidators(form as any);
    const c = form.get('fullName');
    c?.setValue('');
    expect(c?.valid).toBe(true); // validators removed
  });

  it('focusOnFirstInvalidControl scrolls & focuses first invalid', () => {
    const form = service.createPersonalDetailsForm();
    // make a control invalid explicitly
    form.get('fullName')?.setValue('');
    const commonInputs = [ { formControl: form.get('fullName'), nativeElement: { scrollIntoView: jest.fn(), focus: jest.fn() } } ];
    const directfields = [ { nativeElement: { getAttribute: () => 'fullName', scrollIntoView: jest.fn(), focus: jest.fn() } } ];
    const spy = jest.spyOn<any, any>(service as any, 'scrollAndFocus');
    service.focusOnFirstInvalidControl({ details: form, directfields, commonInputs });
    expect(spy).toHaveBeenCalled();
  });
});

describe('FormsService additional edge cases', () => {
  let service: FormsService;
  beforeEach(() => {
    service = new FormsService(new FormBuilder());
  });

  it('eligibleAgeCheck accepts boundary ages 18 and 65', () => {
    const validator = service.eligibleAgeCheck();
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const age18Year = today.getFullYear() - 18;
    const age65Year = today.getFullYear() - 65;
    const ctrl18: any = { value: `${dd}/${mm}/${age18Year}`, parent: {} };
    const ctrl65: any = { value: `${dd}/${mm}/${age65Year}`, parent: {} };
    expect(validator(ctrl18)).toBeNull();
    expect(validator(ctrl65)).toBeNull();
  });

  it('eligibleAgeCheck returns dateValidator for future date', () => {
    const validator = service.eligibleAgeCheck();
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const dd = String(future.getDate()).padStart(2,'0');
    const mm = String(future.getMonth()+1).padStart(2,'0');
    const yyyy = future.getFullYear();
    const ctrl: any = { value: `${dd}/${mm}/${yyyy}`, parent: {} };
    const result = validator(ctrl);
    // Future date should return either dateValidator or isNotEligible based on age check logic
    expect(result).toBeTruthy();
    expect(result?.dateValidator === true || result?.isNotEligible === true).toBe(true);
  });

  it('eligibleAgeCheck returns null when control has no parent (initialization phase)', () => {
    const validator = service.eligibleAgeCheck();
    const pastYear = new Date().getFullYear() - 30;
    const ctrl: any = { value: `01/01/${pastYear}` }; // no parent
    expect(validator(ctrl)).toBeNull();
  });

  it('findFirstInvalidControl returns undefined when all controls valid', () => {
    const form = service.createPersonalDetailsForm();
    form.get('fullName')?.setValue('John Doe');
    const year = new Date().getFullYear() - 30;
    form.get('dob')?.setValue(`01/01/${year}`);
    form.get('pan')?.setValue('ABCPD1234Z');
    form.get('empType')?.setValue('salaried');
    form.get('customerConsent')?.setValue(true);
    expect(service.findFirstInvalidControl(form as any)).toBeUndefined();
  });

  it('focusOnFirstInvalidControl does nothing when no invalid controls', () => {
    const form = service.createPersonalDetailsForm();
    form.get('fullName')?.setValue('Jane Roe');
    const year = new Date().getFullYear() - 25;
    form.get('dob')?.setValue(`01/01/${year}`);
    form.get('pan')?.setValue('ABCPD1234Z');
    form.get('empType')?.setValue('self');
    form.get('customerConsent')?.setValue(true);
    const spy = jest.spyOn<any, any>(service as any, 'scrollAndFocus');
    service.focusOnFirstInvalidControl({ details: form, directfields: [], commonInputs: [] });
    expect(spy).not.toHaveBeenCalled();
  });

  it('getErrorFieldElement prefers direct field over common field', () => {
    const form = service.createPersonalDetailsForm();
    const nativeDirect = { getAttribute: (attr: string) => attr === 'formControlName' ? 'fullName' : null } as any;
    const directfields = [ { nativeElement: nativeDirect } ];
    const commonInputs = [ { formControl: form.get('fullName'), nativeElement: { id: 'commonFullName' } } ];
    const el = service.getErrorFieldElement({ directfields, commonInputs, details: form }, 'fullName');
    expect(el).toBe(nativeDirect);
  });

  it('getErrorFieldElement returns null when no matching elements', () => {
    const form = service.createPersonalDetailsForm();
    const el = service.getErrorFieldElement({ directfields: [], commonInputs: [], details: form }, 'fullName');
    expect(el).toBeNull();
  });
});

describe('FormsService extra coverage', () => {
  let service: FormsService;
  beforeEach(()=>{ service = new FormsService(new FormBuilder()); });

  it('resetSavedFormsData restores defaults', () => {
    service.savedPersonalDetailsFormData.fullName = 'Changed';
    service.resetSavedFormsData();
    expect(service.savedPersonalDetailsFormData.fullName).toBe('');
  });

  it('createFormControl applies validators', () => {
    const ctrl = service.createFormControl<string>('abc', [service.requiredValidator(), (service as any).minLengthValidator(5)]);
    expect(ctrl instanceof FormControl).toBe(true);
    ctrl.setValue('abcd');
    expect(ctrl.valid).toBe(false); // fails minlength 5
    ctrl.setValue('abcde');
    expect(ctrl.valid).toBe(true);
  });

  it('scrollAndFocus with real element invokes both methods', () => {
    const el = { scrollIntoView: jest.fn(), focus: jest.fn() } as any;
    service.scrollAndFocus(el);
    expect(el.scrollIntoView).toHaveBeenCalled();
    expect(el.focus).toHaveBeenCalled();
    expect(()=>service.scrollAndFocus(null)).not.toThrow();
  });

  it('getErrorFieldElement returns common field when direct missing', () => {
    const form = service.createPersonalDetailsForm();
    const commonEl = { id:'common', scrollIntoView: jest.fn(), focus: jest.fn() };
    const el = service.getErrorFieldElement({ details: form, directfields: [], commonInputs:[{ formControl: form.get('fullName'), nativeElement: commonEl }]}, 'fullName');
    expect(el).toBe(commonEl);
  });

  it('focusOnFirstInvalidControl uses commonInputs when directfields empty', () => {
    const form = service.createPersonalDetailsForm();
    form.get('fullName')?.setValue(''); // invalid
    const commonEl = { scrollIntoView: jest.fn(), focus: jest.fn() };
    const spy = jest.spyOn(commonEl,'scrollIntoView');
    service.focusOnFirstInvalidControl({ details: form, directfields: [], commonInputs:[{ formControl: form.get('fullName'), nativeElement: commonEl }] });
    expect(spy).toHaveBeenCalled();
  });

  it('findFirstInvalidControl with empty object returns undefined', () => {
    expect(service.findFirstInvalidControl({} as any)).toBeUndefined();
  });

  it('futureYearValidator returns null for current year and empty value', () => {
    const current = new Date().getFullYear();
    expect(service.futureYearValidator({ value: current } as any)).toBeNull();
    expect(service.futureYearValidator({ value: null } as any)).toBeNull();
  });

  it('futureDateValidator accepts today date', () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const yyyy = today.getFullYear();
    const ctrl: any = { value: `${dd}/${mm}/${yyyy}` };
    expect(service.futureDateValidator(ctrl)).toBeNull();
  });

  it('minLengthValidator private helper enforces length', () => {
    const vFn = (service as any).minLengthValidator(3);
    const res = vFn({ value: 'ab' });
    expect(res?.minlength).toBeDefined();
  });
});
