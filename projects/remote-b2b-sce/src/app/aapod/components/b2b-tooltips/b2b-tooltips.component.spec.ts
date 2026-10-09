import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { B2bTooltipsComponent } from './b2b-tooltips.component';

describe('B2bTooltipsComponent', () => {
  let component: B2bTooltipsComponent;
  let fixture: ComponentFixture<B2bTooltipsComponent>;
  let dismissSpy: jest.Mock;

  beforeEach(async () => {
    dismissSpy = jest.fn();
    await TestBed.configureTestingModule({
      imports: [B2bTooltipsComponent],
      providers: [
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: { prevloanSelected: ['f1','f2'] } },
        { provide: MatBottomSheetRef, useValue: { dismiss: dismissSpy } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(B2bTooltipsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit should populate selectedFields from data.prevloanSelected', () => {
    component.ngOnInit();
    expect(component.selectedFields).toEqual(['f1','f2']);
  });

  it('ngOnInit should handle missing prevloanSelected gracefully', () => {
    const cmp = new B2bTooltipsComponent({} as any, { dismiss: jest.fn() } as any);
    expect(() => cmp.ngOnInit()).not.toThrow();
    expect(cmp.selectedFields.length).toBe(0);
  });

  it('gotIt_Clicked should dismiss bottom sheet with selected values', () => {
    component.selectedFields = ['x','y'];
    component.gotIt_Clicked('val','CTA');
    expect(dismissSpy).toHaveBeenCalledWith({ selectedValue: ['x','y'] });
  });
});
