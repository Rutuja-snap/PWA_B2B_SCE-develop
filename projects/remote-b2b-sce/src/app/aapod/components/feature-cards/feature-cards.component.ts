import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardRender, RenderOutput, WrapCards} from '../../model/render.model';
import { XuiElement } from '../../Xui/element.xui';
import { NgIf, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-feature-cards',
  templateUrl: './feature-cards.component.html',
  styleUrls: ['./feature-cards.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgStyle
  ]
})
export class FeatureCardsComponent implements XuiElement, OnInit {

  // attributes 
  loaded: boolean = false;
  @Input()
  render: WrapCards;
  @Output() emitter: EventEmitter<RenderOutput> = new EventEmitter<RenderOutput>();

  // constructor() { }
  ngOnInit(): void {
    /* empty */
  }

  renderElement() {
    this.loaded = true
  };

  emitt(event: RenderOutput) {
    this.emitter.emit(event);
  }


  // for single card flip
  toggleCard(card: CardRender) {
    this.emitt({
      event: 'ct.track',
      params: {
        ct: {
          type: 'section_click',
          section: "Features and Benifits",
          section_cta: card.title + card.subtitle,
          event_name: "",
          props: {}
        }
      }
    })
    console.log("card flipping")
    card.__flipped = !card.__flipped;
  }

  // for all card flip
  toggleAllCards() {

    this.render.cards?.forEach(card => {
      card.__flipped = !card.__flipped;
    });
  }
}
