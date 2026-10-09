import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from '../app/app.routes'
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';


export const appConfig: ApplicationConfig = {
    providers: [importProvidersFrom(
        BrowserModule,
        TranslateModule
    ), provideRouter(appRoutes)]
};