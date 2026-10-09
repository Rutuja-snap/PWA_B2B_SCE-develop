// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';
// import { ApiIntegartedService } from 'api-integarted';
import config_PROD from '../assets/configurations/config-prod.json';
import config_UAT from '../assets/configurations/config-uat.json';
import config_WEBPROD from '../assets/configurations/config-web-prod.json';
import config_WEBUAT from '../assets/configurations/config-web-uat.json';
export let environment: any;
declare let environmentAllData: any;

let env = environmentAllData ? environmentAllData.ENVIRONMENT_NAME : '';

env = env.toUpperCase();
if (env === 'UAT') {
  environment = config_UAT;
} else if (env === 'PROD') {
  environment = config_PROD;
} else if (env === 'WEB_PROD') {
  environment = config_WEBPROD;
} else {
  environment = config_WEBUAT;
}
console.log('PWA Load changes 10' + environment);

console.log('PWA Load changes 1');

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config: any;
  static config: any;

  // constructor() {}

  setConfig(data): any {
    if (data) {
      environment = data;
    }
  }

  private getFileName(enviro: string): string {
    switch (enviro.toUpperCase()) {
      case 'PROD':
        return 'config-prod.json';
      case 'UAT':
        return 'config-uat.json';
      case 'WEB_PROD':
        return 'config-web-prod.json';
      case 'WEB_UAT':
        return 'config-web-uat.json';
      default:
        return 'config-prod.json';
    }
  }

  async getConfigData(): Promise<void> {
    // 1. Load runtime config to get environment name
    console.log('Load actual environment-specific config First Call loadConfig');
    // const runtimeConfigUrl = `${window.location.origin}/config.json`;
    if (!environment) {
      let enviro = environmentAllData ? environmentAllData.ENVIRONMENT_NAME : '';
      if (enviro) {
        const configFileName = this.getFileName(enviro);
        const configFilePath = `assets/configurations/${configFileName}`;

        // // 3. Load actual environment-specific config
        //   this.config = await firstValueFrom(this.http.get(configFilePath));
        //   environment = this.config;
        //   console.log('PWA Load changes 3');
        //   ConfigService.config =  this.config;
        //   console.log("Environment Data for laip", this.config );
        fetch(configFilePath)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not OK');
            }
            return response.json(); // parses JSON
          })
          .then((data) => {
            console.log('JSON Data:New data environmentAllData New', data);
            environment = data;
            //getENVALLdata();
          })
          .catch((error) => {
            console.error('Error fetching JSON:', error);
          });
      }
    }
  }

  static getConfigNew(): any {
    return this.config ? this.config : environmentAllData;
  }
  static setConfigNew(data): any {
    environment = data;
  }
}