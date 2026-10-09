import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TranslateModule
  ],
})
export class StepperComponent {

  @Input() render: any;
  // render: any = {
    // id: 'pdp.steps',
    // title: 'Steps',
    // description: '',

    // data: [{
    //   numData: '1',
    //   title: '',
    //   description: '',
    // },
    // {
    //   numData: '2',
    //   title: '',
    //   description: '',
    // }]
  // }

  // ngAfterViewInit() {
  //   console.log("steps-component", this.render);
  // }

}
