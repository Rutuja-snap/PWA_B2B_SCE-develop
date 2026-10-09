import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { StepperComponent } from './stepper.component';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperComponent, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    component.render = {
      id: 'pdp.steps',
      title: 'Steps',
      description: '',
      data: [
        { numData: '1', title: 'Step 1', description: 'Desc 1' },
        { numData: '2', title: 'Step 2', description: 'Desc 2' }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render description paragraph when description empty', () => {
    const descEl = fixture.nativeElement.querySelector('p');
    expect(descEl).toBeNull();
  });

  it('should render description when provided', () => {
    component.render.description = 'Process steps description';
    fixture.detectChanges();
    const descEl = fixture.nativeElement.querySelector('p');
    expect(descEl.textContent).toContain('Process steps description');
  });

  it('should render correct number of step points and connecting dots', () => {
    // default has 2 data items -> 1 connecting dot (for i != last)
    const points = fixture.nativeElement.querySelectorAll('.aa_det_data_point');
    const dots = fixture.nativeElement.querySelectorAll('.aa_det_dot');
    expect(points.length).toBe(2);
    expect(dots.length).toBe(1);
  });

  it('should render zero dots when only one step present', () => {
    component.render.data = [ { numData:'1', title:'Only', description:'Single step' } ];
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll('.aa_det_dot');
    expect(dots.length).toBe(0);
  });

  it('should hide step description div when description missing per step', () => {
    component.render.data = [
      { numData:'1', title:'T1', description:'Has desc' },
      { numData:'2', title:'T2', description:'' },
      { numData:'3', title:'T3' } as any
    ];
    fixture.detectChanges();
    const descDivs = fixture.nativeElement.querySelectorAll('.aa_det_desc');
    expect(descDivs.length).toBe(1); // only first has description
  });

  it('should update connecting dots count when steps list grows', () => {
    component.render.data = [
      { numData:'1', title:'A', description:'d1' },
      { numData:'2', title:'B', description:'d2' }
    ];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.aa_det_dot').length).toBe(1);
    // push a new step
    component.render.data.push({ numData:'3', title:'C', description:'d3' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.aa_det_dot').length).toBe(2);
  });

  it('should render zero data points when data undefined', () => {
    (component.render as any).data = undefined;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.aa_det_data_point').length).toBe(0);
  });

  it('should render numeric description value', () => {
    component.render.description = 123 as any;
    fixture.detectChanges();
    const descEl = fixture.nativeElement.querySelector('p');
    expect(descEl.textContent.trim()).toBe('123');
  });

  it('should list step numbers and titles in order', () => {
    component.render.data = [
      { numData:'5', title:'Fifth', description:'' },
      { numData:'6', title:'Sixth', description:'' },
      { numData:'7', title:'Seventh', description:'' },
    ];
    fixture.detectChanges();
    const nums = Array.from(fixture.nativeElement.querySelectorAll('.aa_det_numDatafont')).map((el: any)=>el.textContent.trim());
    expect(nums).toEqual(['5','6','7']);
    const titles = Array.from(fixture.nativeElement.querySelectorAll('.aa_det_title')).map((el: any)=>el.textContent.trim());
    expect(titles).toEqual(['Fifth','Sixth','Seventh']);
  });
});