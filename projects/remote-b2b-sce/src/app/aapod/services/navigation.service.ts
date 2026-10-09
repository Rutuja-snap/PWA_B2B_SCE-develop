import { Injectable, NgZone, EventEmitter, Injector } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ParentDataServices } from './parentData.service';
import { ApiIntegartedService } from 'api-integarted';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';




declare function subscribeBackButton(item: any, handler: any): any;


@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  currenturl: any = "";
  matchedURLArray: any;
  sideNavRef: any;
  clpL2screenFrame = [];
  setAllCLPapicall: any = "Y";
  backListner = new EventEmitter();
  public apiIntegartedService: ApiIntegartedService;
  private matDialog: MatDialog;
  private _bottomSheet: MatBottomSheet;
  private parentStorage: ParentDataServices;
  private router: Router;
  private ngZone: NgZone;




  constructor(injector: Injector) {
    this.apiIntegartedService = injector.get<ApiIntegartedService>(ApiIntegartedService);
    this.matDialog = injector.get<MatDialog>(MatDialog);
    this._bottomSheet = injector.get<MatBottomSheet>(MatBottomSheet);
    this.parentStorage = injector.get<ParentDataServices>(ParentDataServices);
    this.router = injector.get<Router>(Router);
    this.ngZone = injector.get<NgZone>(NgZone);
    this.matchedURLArray = [
      "/",
      "/rar",
      "/onboardingRar",
      "/professional-loan",
      "/professionalLoan",
      "/sampleComponent",
      "/emiCardServices",
      "/emiCardServices/landingPage",
      "/rar/rarAck",
      "/rar/rarReqHisRequestEscAck",
      "/emiCard",
      "/emiCard/landingPage",
      "/offersModule/",
      "/professionalLoan/offerType",
      "/creditCard/stpRejectionDueTo",
      "/creditCard/stpPermission",
      "/creditCard/landingPage",
      "/b2c/b2cLanding",
      "/plcard/plcardcreateLanding",
      "/plcard/plcardusageLanding",
      // "/plcard/plcardLanding",
      "/businessLoan/entryPage",
      "/mDServices/mdServicesLanding",
      "/ucf/ucfEntryPage",
      "/ucf/ucfFailure",
      "/medicalEqpFinance/mefLanding",
      "/ruralGoldLoan/landingPage",
      "/serviceGoldLoan",
      "/serviceGoldLoan/glLanding",
      "/professional-loan/landing-page",
      "/Calculator/calculators",
      "/offersModule/offersTwoMainLanding",
      "/las/lasLanding",
      "/loan-against-mutual-funds-application-form/lamfLanding",
      "/commonScreen/thankyou",
      "/lasServices",
      "/lasServices/LasServicesLanding",
      "/payment-services/landing",
      "/store-locator/landing",
      //"/b2c/panmismatch",
      "/b2c/retrybankdetail",
      "/b2c/unabletoprocess",
      "Deposit/congratulations",
      "/commonScreen/redirect",
      "/pdpx/entry",
      "/payment-services-xaop/landing",
      "/sce/consentfail",
      "/sce/offers"
    ]

    // Navigation event
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.currenturl = event.url;
        // Show loading indicator
        if (environment.PLATFORM_NAME === 'WEB' && event.navigationTrigger === 'popstate') {
          this.ngZone.run(() => {
            this._bottomSheet.dismiss();
            this.matDialog.closeAll();
          })
        }
      }
      if (event instanceof NavigationEnd) {

        const isMatchedFound = this.isMatchedFoundFun(event.url);
        if (isMatchedFound || event.url.match(/\/sampleComponent\?mobile_number=(\d{10})/)
        ||  event.url.match(/\/index.html\?mobile_number=(\d{10})/)) {
          // no need to push
        } else  if (this.parentStorage.navigationData.length > 0 && this.parentStorage.navigationData[this.parentStorage.navigationData.length - 1] === event.url) {
          // no need to push
        } else {
          this.parentStorage.navigationData.push(event.url);
        }

        // Hide loading indicator
      }
      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user

      }
    });

    subscribeBackButton('backbtn', () => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.popoutNavigationUrlFun();
        })
      });
    });
  }

  subscribeBackFunction(){
    subscribeBackButton('backbtn', () => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.popoutNavigationUrlFun();
        })
      });
    });
  }

  isMatchedFoundFun(url: string) {
    const isMatchedUrl = this.matchedURLArray.includes(url);
    return isMatchedUrl;
    // if (isMatchedUrl) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
popoutLastPage(){
  this.parentStorage.navigationData.pop();
}
  popoutNavigationUrlFun() {
  
    this.ngZone.run(() => {
      if (this.currenturl === "") {
        this.currenturl = this.router.url;
      }
      // Added 10-02-2023 for Back From SampleComponent
      if (this.currenturl.includes('/sampleComponent')) {
        this.apiIntegartedService.commonPromptCall('GoToDashboard', 0);
        return;
      }
  
      prompt('gotoNativePage')

     
     
    })
  }

  customPopoutNavigationUrlFun(backCount: number) {
    const navigationDetails = this.parentStorage.navigationData;

    if (navigationDetails.length > 0) {

      this.parentStorage.navigationData.splice(-(backCount), (backCount));
      if (this.parentStorage.navigationData.length > 0) {

        this.router.navigateByUrl(this.parentStorage.navigationData[this.parentStorage.navigationData.length - 1]);

      } else {
        // after popout if no URL then navigate to Native screen
        this.apiIntegartedService.commonPromptCall("gotoNativePage", 0);
      }
    } else {
      // navigate to Native Screen
      this.apiIntegartedService.commonPromptCall("gotoNativePage", 0);
    }

  }



  //EMI CARD Module (Health card) navigation..
  healthCardNavigation(index) {

    const urls = [
      "emiCard/emihealth",
      "emiCard/otp",
      "emiCard/healthCardActive",
      "emiCard/addNominee"

    ]
    if (index === 0) {
      this.apiIntegartedService.commonPromptCall("gotoNativePage", 0);
    } else {
      this.router.navigateByUrl(urls[index - 1])
    }
  }

}
