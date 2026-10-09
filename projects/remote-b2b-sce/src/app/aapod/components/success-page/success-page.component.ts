import { Component, OnInit } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss'],
  standalone: true,
  imports: []
})
export class SuccessPageComponent implements OnInit {

  aemData: any;
  constructor(
    private aaFlow: AaFlowService, 
    private aaApi: AaApiService
  ) { }
  
  ngOnInit(){
    this.getAem();
  }

  async getAem(){
    try{
      const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.SUCCESS);
      console.log('language-based aem url', aemUrl);
      const cacheResponse = await this.aaApi.aemCache(aemUrl);
      console.log('actual json', cacheResponse)
      const fjson = this.aaFlow.formatResponseData(cacheResponse);
      this.aemData = fjson['content']['success-screen'];
      console.log('formatted json', this.aemData);
    } catch(error){
      console.log("Error fetching personal details aem ",error);
    }
  }

}
