import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownDialogComponent } from './dropdown-dialog.component';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DropdownDialogComponent', () => {
  let component: DropdownDialogComponent;
  let fixture: ComponentFixture<DropdownDialogComponent>;
  let dialogRefSpy: { close: jest.Mock };

  beforeEach(() => {
    dialogRefSpy = { close: jest.fn() } as any;

    TestBed.configureTestingModule({
      imports: [DropdownDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { foo: 'bar' } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DropdownDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(()=>{
    document.body.classList.remove('hide-mat-error');
  })

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.dialogdata).toEqual({ foo: 'bar' });
  });

  it('ngOnInit adds hide-mat-error class on body', () => {
    expect(document.body.classList.contains('hide-mat-error')).toBe(false);
    component.ngOnInit();
    expect(document.body.classList.contains('hide-mat-error')).toBe(true);
  });

  it('closeDialog sets selectedCity and closes dialog with finalData', () => {
    component.closeDialog('Mumbai');
    expect(component.selectedCity).toBe('Mumbai');
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ selectedValue: 'Mumbai' });
  });

  it('closeDialog handles undefined gracefully', () => {
    dialogRefSpy.close.mockClear();
    component.closeDialog(undefined);
    expect(component.selectedCity).toBeUndefined();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ selectedValue: undefined });
  });

  it('ngOnDestroy removes hide-mat-error class from body', () => {
    component.ngOnInit();
    expect(document.body.classList.contains('hide-mat-error')).toBe(true);
    component.ngOnDestroy();
    expect(document.body.classList.contains('hide-mat-error')).toBe(false);
  });
});
