import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureCardsComponent } from './feature-cards.component';

describe('FeatureCardsComponent', () => {
  let component: FeatureCardsComponent;
  let fixture: ComponentFixture<FeatureCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCardsComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(FeatureCardsComponent);
    component = fixture.componentInstance;
    // mock minimal render object
    component.render = { title: 'Features', cards: [
      { title: 'Card1', subtitle: 'Sub1', description: 'Desc1', __flipped: false },
      { title: 'Card2', subtitle: 'Sub2', description: 'Desc2', __flipped: true }
    ] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renderElement should set loaded true', () => {
    component.loaded = false;
    component.renderElement();
    expect(component.loaded).toBe(true);
  });

  it('emitt should emit provided event', () => {
    const spy = jest.spyOn(component.emitter, 'emit');
    const payload: any = { event: 'test.event', params: { a: 1 } };
    component.emitt(payload);
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('toggleCard should flip card and emit tracking event', () => {
    const spy = jest.spyOn(component.emitter, 'emit');
    const card: any = { title: 'T', subtitle: 'S', description: 'D', __flipped: false };
    component.render = { title: 'Features', cards: [card] } as any;
    component.toggleCard(card);
    expect(card.__flipped).toBe(true);
    expect(spy).toHaveBeenCalled();
    const emittedArg = (spy.mock.calls[0] || [])[0];
    expect(emittedArg.event).toBe('ct.track');
  });

  it('toggleAllCards should flip all cards', () => {
    const c1: any = { __flipped: false };
    const c2: any = { __flipped: true };
    component.render = { cards: [c1, c2] } as any;
    component.toggleAllCards();
    expect(c1.__flipped).toBe(true);
    expect(c2.__flipped).toBe(false);
    // toggle again should revert
    component.toggleAllCards();
    expect(c1.__flipped).toBe(false);
    expect(c2.__flipped).toBe(true);
  });

  it('toggleAllCards should not throw when no cards', () => {
    component.render = { title: 'Only title' } as any;
    expect(() => component.toggleAllCards()).not.toThrow();
  });
});
