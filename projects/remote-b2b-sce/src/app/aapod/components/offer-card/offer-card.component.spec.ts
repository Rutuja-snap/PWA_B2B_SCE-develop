import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { OfferCardComponent } from './offer-card.component';

describe('OfferCardComponent', () => {
  let component: OfferCardComponent;
  let fixture: ComponentFixture<OfferCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OfferCardComponent, TranslateModule.forRoot()]
    });
    fixture = TestBed.createComponent(OfferCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit without error', () => {
    component.render = [];
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should render cards equal to input length', () => {
    component.render = [ { show:false }, { show:false }, { show:true } ];
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.aa_offer_card'));
    expect(cards.length).toBe(3);
  });

  it('should display details section only when card.show true', () => {
    component.render = [ { show:false }, { show:true } ];
    fixture.detectChanges();
    const detailSections = fixture.debugElement.queryAll(By.css('.aa_offer_more_detail_section'));
    expect(detailSections.length).toBe(1);
  });

  it('toggleViewDetails should flip specific card.show flag', () => {
    component.render = [ { show:false }, { show:false } ];
    fixture.detectChanges();
    component.toggleViewDetails(1);
    expect(component.render[1].show).toBe(true);
    expect(component.render[0].show).toBe(false);
  });

  it('clicking View details should show More details section', () => {
    component.render = [ { show:false } ];
    fixture.detectChanges();
    const viewBtn = fixture.debugElement.query(By.css('.aa_offer_view_detail_arrow span'));
    viewBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    const more = fixture.debugElement.queryAll(By.css('.aa_offer_more_detail_section'));
    expect(more.length).toBe(1);
  });

  it('clicking Hide details should hide the details section again', () => {
    component.render = [ { show:true } ];
    fixture.detectChanges();
    const hideBtn = fixture.debugElement.query(By.css('.aa_offer_more_detail_section .aa_offer_view_detail_arrow span'));
    hideBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    const more = fixture.debugElement.queryAll(By.css('.aa_offer_more_detail_section'));
    expect(more.length).toBe(0);
  });

  it('should safely handle undefined render (no cards)', () => {
    component.render = undefined as any;
    expect(() => fixture.detectChanges()).not.toThrow();
    const cards = fixture.debugElement.queryAll(By.css('.aa_offer_card'));
    expect(cards.length).toBe(0);
  });

  it('should not change array length when toggling', () => {
    component.render = [ { show:false }, { show:true } ];
    const originalLength = component.render.length;
    fixture.detectChanges();
    component.toggleViewDetails(0);
    component.toggleViewDetails(1);
    expect(component.render.length).toBe(originalLength);
  });

  it('toggleViewDetails twice should restore original visibility', () => {
    component.render = [ { show:false } ];
    fixture.detectChanges();
    component.toggleViewDetails(0); // false -> true
    expect(component.render[0].show).toBe(true);
    component.toggleViewDetails(0); // true -> false
    expect(component.render[0].show).toBe(false);
  });

  it('toggleViewDetails with out-of-range index should throw a generic error', () => {
    component.render = [ { show:false }, { show:true } ];
    fixture.detectChanges();
    expect(() => component.toggleViewDetails(5)).toThrow(); // generic TypeError expected
  });

  it('toggleViewDetails should throw when render is undefined (no safety checks in component)', () => {
    component.render = undefined as any;
    expect(() => component.toggleViewDetails(0)).toThrow(); // generic error
  });

  it('toggleViewDetails normalises non-boolean show value (string becomes boolean after toggle)', () => {
    component.render = [ { show: 'yes' as any } ]; // truthy
    fixture.detectChanges();
    component.toggleViewDetails(0); // !'yes' -> false
    expect(component.render[0].show).toBe(false);
  });

  it('toggleViewDetails normalises falsy numeric show value (0 -> true)', () => {
    component.render = [ { show: 0 as any } ]; // falsy
    fixture.detectChanges();
    component.toggleViewDetails(0); // !0 -> true
    expect(component.render[0].show).toBe(true);
  });

  it('toggleViewDetails adds show=true when property absent', () => {
    component.render = [ { title: 'No show initially' } as any ];
    fixture.detectChanges();
    component.toggleViewDetails(0); // !undefined -> true
    expect(component.render[0].show).toBe(true);
  });
});
