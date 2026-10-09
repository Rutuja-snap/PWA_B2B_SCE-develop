import { Component,Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-steps-component',
  templateUrl: './steps-component.component.html',
  styleUrls: ['./steps-component.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf
  ]
})
export class StepsComponentComponent {
  @Input()
  render: any = {
    id:'pdp.steps',
    title: 'Steps',
    data : [{
      numData: '1',
      title: '',
      description: '',
    },
    {
      numData: '2',
      title: '',
      description: '',
    }]
  }
}
