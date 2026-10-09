import { NgModule, APP_INITIALIZER } from '@angular/core';
import { loadRemoteStyles } from './remote-styles';
import { ConfigService } from 'projects/remote-b2b-sce/src/environments/environment';
import { provideRouter } from '@angular/router';
import { b2bSceRoutes } from './b2b-sce.routes';
import { LanguageSelectionService } from 'language-selection';

@NgModule({
  imports: [],

   providers : [
    ConfigService,
        {
          provide: APP_INITIALIZER,
          // useFactory: initConfig,
          useFactory: (configService: ConfigService) => () => configService.getConfigData(),
          deps: [ConfigService],
          multi: true
        },
        provideRouter(b2bSceRoutes)
      
  ],
})
export class B2bSceModule {
  constructor(
    public configService:ConfigService, 
    private langService:LanguageSelectionService
  ) {
    this.configService.getConfigData();
    loadRemoteStyles();
    const langJsonUrl = (window as any).langJsonUrl;
    console.log(langJsonUrl, 'langJsonUrl in B2bSceModule');
    this.langService.fetchVernacJson(langJsonUrl);
  }
  
}
