import { Component, OnInit } from '@angular/core';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { StepperComponent } from '../stepper/stepper.component';
import { TranslateModule } from '@ngx-translate/core';

// Added interfaces (moved outside class)
interface StepItem { numData: string; title: string; description: string; }
interface StepsRender { id: string; title: string; description: string; data: StepItem[]; }
interface CardItem { carddesc: string; show?: boolean; }

@Component({
  selector: 'app-aa-offer-details',
  templateUrl: './aa-offer-details.component.html',
  styleUrls: ['./aa-offer-details.component.scss'],
  standalone: true,
  imports: [
    OfferCardComponent,
    StepperComponent,
    TranslateModule
  ]
})
export class AaOfferDetailsComponent implements OnInit {

  stepsRender: StepsRender = {
    id: 'sce.pdp.steps',
    title: 'b2b_sce.stepper.title',
    description: 'b2b_sce.stepper.description',
    data: [{
      numData: 'b2b_sce.stepper.numData1',
      title: 'b2b_sce.stepper.title1',
      description: 'b2b_sce.stepper.description1',
    },
    {
      numData: 'b2b_sce.stepper.numData2',
      title: 'b2b_sce.stepper.title2',
      description: 'b2b_sce.stepper.description3',
    },
    {
      numData: 'b2b_sce.stepper.numData3',
      title: 'b2b_sce.stepper.title3',
      description: 'b2b_sce.stepper.description3',
    }]
  };

  cardsRender: CardItem[] = [{
    carddesc: 'b2b_sce.offer_card.on_new_car_finance',
  },
  {
    carddesc: 'b2b_sce.offer_card.on_new_car_finance',
  },
  {
    carddesc: 'b2b_sce.offer_card.on_new_car_finance',
  },
  {
    carddesc: 'b2b_sce.offer_card.on_new_car_finance'
  }
  ];

  ngOnInit() {
    this.cardsRender = this.cardsRender.map((item: CardItem) => ({ ...item, show: false }));
  }

}
