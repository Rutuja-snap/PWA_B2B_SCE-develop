import { Component, OnInit } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { SuccessPageComponent } from '../success-page/success-page.component';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-b2b-income-verification',
  templateUrl: './b2b-income-verification.component.html',
  styleUrls: ['./b2b-income-verification.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor, 
    NgClass,
    SuccessPageComponent
  ]
})
export class B2bIncomeVerificationComponent implements OnInit{

  aemData: any;
  successPage: boolean = true;
  constructor(private aaFlow: AaFlowService, private aaApi: AaApiService){
  
  }
  
  ngOnInit(){
     this.getAem();
     setTimeout(()=>{
        this.successPage = false;
     },3000);
  }

  
  async getAem() {
    try {
      const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.INCOME);
      console.log('language-based aem url', aemUrl);
      const cacheResponse = await this.aaApi.aemCache(aemUrl);
      console.log('actual json', cacheResponse)
      const fjson = this.aaFlow.formatResponseData(cacheResponse);
      this.aemData = fjson['content']['income-verification-completed'];
      console.log('formatted json', this.aemData);
    } catch (error) {
      console.log("Error fetching income aem ", error);
    }
  }
}
