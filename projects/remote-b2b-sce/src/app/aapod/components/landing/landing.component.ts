import { Component, NgZone, OnInit } from '@angular/core';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { AaFlowService } from '../../services/aa-flow.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { B2bSceToolbarComponent } from '../b2b-sce-toolbar/b2b-sce-toolbar.component';
import { RouterOutlet } from '@angular/router';

declare function subscribeBackButton(item: any, handler: any): any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports : [
    RouterOutlet,
    NgxUiLoaderModule,
    B2bSceToolbarComponent
  ]
})
export class LandingComponent implements OnInit {

  constructor(private ngZone:NgZone,private aaFlow:AaFlowService) {
    if(environment.CONNECTION_SOURCE === 'APP'){
      subscribeBackButton('backbtn', (response) => {
        console.log(JSON.stringify(response) + 'backPress');
        this.ngZone.run(() => {
          console.log('Back button ', response);
          this.aaFlow.onBack('DEVICE BACK')
        });
      }); 

    }
   }

  ngOnInit(): void {
    /* empty */
  }

}
