import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { XuiElement } from '../../Xui/element.xui';
import { TextRatingsRender, RenderOutput} from '../../model/render.model';

@Component({
  selector: 'app-b2b-text-ratings',
  templateUrl: './b2b-text-ratings.component.html',
  styleUrls: ['./b2b-text-ratings.component.scss'],
  standalone: true,
  imports: [

  ]
})
export class B2bTextRatingsComponent implements XuiElement, OnInit{

  id: string;
  
  @Input() render: TextRatingsRender 



  emitter: EventEmitter<RenderOutput> = new EventEmitter<RenderOutput>();
  loaded: boolean;


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


}
