import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AaOfferDetailsComponent } from './aa-offer-details.component';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { StepperComponent } from '../stepper/stepper.component';

// Added interfaces to eliminate explicit any usage in tests
interface StepItem {
  numData: string;
  title: string;
  description: string;
}
interface CardItem {
  carddesc: string;
  show?: boolean;
}

describe('AaOfferDetailsComponent', () => {
  let component: AaOfferDetailsComponent;
  let fixture: ComponentFixture<AaOfferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AaOfferDetailsComponent, OfferCardComponent, StepperComponent, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(AaOfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 step items with expected titles', () => {
    expect(component.stepsRender.data.length).toBe(3);
    const titles = component.stepsRender.data.map((s: StepItem) => s.title);
    expect(titles).toEqual([
      'b2b_sce.stepper.title1',
      'b2b_sce.stepper.title2',
      'b2b_sce.stepper.title3'
    ]);
  });

  it('ngOnInit should add show:false to each card', () => {
    // Recreate a fresh instance to explicitly test transformation
    const inst = new AaOfferDetailsComponent();
    // Pre-condition: show key not present
    expect(inst.cardsRender.every((c: CardItem) => c.show === undefined)).toBe(true);
    inst.ngOnInit();
    expect(inst.cardsRender.length).toBe(4);
    inst.cardsRender.forEach((c: CardItem) => expect(c.show).toBe(false));
  });

  it('ngOnInit should not mutate original objects (each card reference replaced)', () => {
    const inst = new AaOfferDetailsComponent();
    const originalRefs = [...inst.cardsRender];
    inst.ngOnInit();
    inst.cardsRender.forEach((card: CardItem, idx: number) => {
      expect(card).not.toBe(originalRefs[idx]);
    });
  });

  it('ngOnInit should leave stepsRender unchanged', () => {
    const before = JSON.stringify(component.stepsRender);
    component.ngOnInit();
    expect(JSON.stringify(component.stepsRender)).toBe(before);
  });

  it('ngOnInit on empty cardsRender should keep it empty', () => {
    const inst = new AaOfferDetailsComponent();
    inst.cardsRender = [];
    inst.ngOnInit();
    expect(inst.cardsRender.length).toBe(0);
  });

  it('ngOnInit should overwrite pre-existing show property to false', () => {
    const inst = new AaOfferDetailsComponent();
    inst.cardsRender = inst.cardsRender.map((c: CardItem, i: number) => ({ ...c, show: i % 2 === 0 }));
    inst.ngOnInit();
    inst.cardsRender.forEach((c: CardItem) => expect(c.show).toBe(false));
  });
});
