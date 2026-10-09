import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';


export const b2bSceRoutes: Routes = [
  {
    path: '', component: LandingComponent, data: { title: 'Customer Eligibility' },
    children: [
      { path: 'landing', redirectTo: 'pdp', pathMatch: 'full' },
      { 
        path: 'personaldetails', 
        loadComponent: () => import('./components/personal-details/personal-details.component').then(m => m.PersonalDetailsComponent)
      },
      { 
        path: 'offer', 
        loadComponent: () => import('./components/aa-offer-details/aa-offer-details.component').then(m => m.AaOfferDetailsComponent)
      },
      { 
        path: 'success', 
        loadComponent: () => import('./components/success-page/success-page.component').then(m => m.SuccessPageComponent)
      },
      {
        path: 'spinner',
        loadComponent: () => import('./components/loader-spinner/loader-spinner.component').then(m => m.LoaderSpinnerComponent)
      },
      {
        path: 'pod/:podName',
        loadComponent: () => import('./components/b2b-common-pod/b2b-common-pod.component').then(m => m.B2bCommonPodComponent)
      },
      { 
        path: 'income', 
        loadComponent: () => import('./components/b2b-income-verification/b2b-income-verification.component').then(m => m.B2bIncomeVerificationComponent)
      },
      { 
        path: 'incomefail', 
        loadComponent: () => import('./components/b2b-income-fail/b2b-income-fail.component').then(m => m.B2bIncomeFailComponent)
      },
      { 
        path: 'pdp', 
        loadComponent: () => import('./components/aa-pdp/aa-pdp.component').then(m => m.AaPdpComponent) 
      },
    ]
  }
];

