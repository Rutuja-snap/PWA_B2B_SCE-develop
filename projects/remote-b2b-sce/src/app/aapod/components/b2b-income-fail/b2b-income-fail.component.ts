import { Component, OnInit } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';
import { Router } from '@angular/router';
import { AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

@Component({
  selector: 'app-b2b-income-fail',
  templateUrl: './b2b-income-fail.component.html',
  styleUrls: ['./b2b-income-fail.component.scss'],
  standalone: true,
  imports: []
})
export class B2bIncomeFailComponent implements OnInit{

  aemData: any;
  constructor(private aaFlow: AaFlowService, private router: Router, private aaApi: AaApiService){

  }

  ngOnInit(){
    this.getAem()
  }

  async getAem(){
    try {
      const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.ERROR);
      console.log('language-based aem url', aemUrl);
      const cacheResponse = await this.aaApi.aemCache(aemUrl);
      console.log('actual json', cacheResponse)
      const fjson = this.aaFlow.formatResponseData(cacheResponse);
      this.aemData = fjson['content']['error-screen'];
      console.log('formatted json', this.aemData);
    } catch (error) {
      console.log("Error fetching error aem ", error);
    }
  }
  
  onRetry() {
    this.router.navigate(['/','b2b-sce','pdp']);
  }
}
