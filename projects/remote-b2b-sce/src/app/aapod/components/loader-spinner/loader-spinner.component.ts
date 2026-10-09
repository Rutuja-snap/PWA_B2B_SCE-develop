import { Component } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader-spinner',
  templateUrl: './loader-spinner.component.html',
  styleUrls: ['./loader-spinner.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
  ]
})
export class LoaderSpinnerComponent {

  aemData: any;
  constructor( private aaFlow: AaFlowService,  private aaApi: AaApiService) { }

  ngOnInit(): void {
    this.getAemData();
  }

  async getAemData(){
    try{
      const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.LOADER);
      console.log('language-based aem url', aemUrl);
      const cacheResponse = await this.aaApi.aemCache(aemUrl);
      console.log('actual json', cacheResponse)
      const fjson = this.aaFlow.formatResponseData(cacheResponse);
      this.aemData = fjson['content']['loader-screen'];
      console.log('formatted json', this.aemData);
    }catch(error){
      console.log("Error fetching loader aem ",error);
    }
  }
}
