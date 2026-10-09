import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTextRatingsComponent } from './b2b-text-ratings.component';

describe('B2bTextRatingsComponent', () => {
  let component: B2bTextRatingsComponent;
  let fixture: ComponentFixture<B2bTextRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [B2bTextRatingsComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(B2bTextRatingsComponent);
    component = fixture.componentInstance;
    component.render = {
      id: 'text-ratings',
      title: 'TITLE',
      subtitle: 'SUBTITLE',
      rating: { count: 1765, rating: 4.5 }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default render values', () => {
    expect(component.render.title).toBe('TITLE');
    expect(component.render.rating.count).toBe(1765);
  });

  it('renderElement should set loaded true', () => {
    component.loaded = false as any;
    component.renderElement();
    expect(component.loaded).toBe(true);
  });

  it('emitt should emit event payload', () => {
    const spy = jest.spyOn(component.emitter, 'emit');
    const payload: any = { event: 'rating.click', params: { id: 'x' } };
    component.emitt(payload);
    expect(spy).toHaveBeenCalledWith(payload);
  });
});
