import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsComponentComponent } from './steps-component.component';

describe('StepsComponentComponent', () => {
  let component: StepsComponentComponent;
  let fixture: ComponentFixture<StepsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsComponentComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(StepsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
