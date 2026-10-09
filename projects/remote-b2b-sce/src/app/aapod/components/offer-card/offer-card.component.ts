import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TranslateModule
  ]
})
export class OfferCardComponent {

  showDetails: boolean = false;
  @Input() render: any;

  ngOnInit() {
    console.log(this.render, 'rendering in offer card');
  }

  toggleViewDetails(index: number) {
    const card = this.render[index];
    card.show = !card.show;
  }

}
