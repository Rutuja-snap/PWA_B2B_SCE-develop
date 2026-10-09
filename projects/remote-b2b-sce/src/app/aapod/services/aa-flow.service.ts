import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropdownDialogComponent } from '../sections/dropdown-dialog/dropdown-dialog.component';
import { Asset } from '../model/helper.model';
import { HorizontalVideoModel } from '../model/kpoint.model';
import { DialogService } from './dialog.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { NavigationService } from './navigation.service';
import { ParentDataServices } from './parentData.service';
import { ApiIntegartedService } from 'api-integarted';
import { LanguageSelectionService } from 'language-selection'

@Injectable({
  providedIn: 'root'
})
export class AaFlowService {


  sceFormData: SCEFormData = new SCEFormData();
  mobileDeviceProps: appDevicePropertiesType = {};
  toolBarEvent: EventEmitter<any> = new EventEmitter();
  
  iosPanelClass : any  = this.parentStorage.deviceOS === 'ios' ? ['dialog_panel_no_animation'] : []

  constructor( 
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
    private http:HttpClient,
    private router:Router,
    private navigationService:NavigationService,
    private parentStorage:ParentDataServices, 
    private _dialogService: DialogService,
    private _apiIntegrated:ApiIntegartedService,
    private langService: LanguageSelectionService
  ) { }
  

  getDeviceProperties(key: 'appversion' | 'ep_serialNo' | 'ep_serrionId' | 'ep_imei' | 'ep_deviceId' | 'ep_gaid' | 'ep_NetworkCarrier' | 'ep_lat' | 'ep_long' | 'ep_Networktype' | 'ep_Usertype' | 'device_id' | 'handset') {
    try {
      let deviceProps: appDevicePropertiesType = {
        appversion: "",
        ep_serialNo: "",
        ep_serrionId: "",
        ep_imei: "",
        ep_deviceId: "",
        ep_gaid: "",
        ep_NetworkCarrier: "",
        ep_lat: "",
        ep_long: "",
        ep_Networktype: "",
        ep_Usertype: "",
        device_id: "",
        handset: ""
      }

      if (Object.keys(this.mobileDeviceProps)?.length > 0) {
        console.log('mobileDeviceProps exist', this.mobileDeviceProps)
        deviceProps = this.mobileDeviceProps
        return deviceProps[key]
      }
      if (environment.CONNECTION_SOURCE === 'APP') {
        //'{"appversion":"P.12.0.2","ep_serialNo": "da01cd665cb38463","ep_serrionId": "533","ep_imei": "da01cd665cb38463","ep_deviceId": "da01cd665cb38463","ep_gaid": "874c34ce-aa5f-4af6-8656-886461bc9c16","ep_NetworkCarrier": "AIRTEL","ep_lat": "","ep_long": "","ep_Networktype": "","ep_Usertype": "ETB","device_id": "null","handset": "null"}'
        const dProps = prompt('getDeviceproperties://');
        deviceProps = JSON.parse(dProps)
      } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
          deviceProps.ep_lat = position.coords.latitude?.toString() || ""
          deviceProps.ep_long = position.coords.longitude?.toString() || ""
        });
      }
      this.mobileDeviceProps = deviceProps
      console.log(deviceProps)
      return deviceProps[key]
    } catch (e) {
      console.log(e)
    }
  }
  
  openSnackBar(message: string, action: string, type:'red'| 'green' = 'green') {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass:(type === 'red') ? 'sce-not-found-snack-bar' : ''
    });
  }

    openDropdownListDialog(dropDownData): MatDialogRef<DropdownDialogComponent> {
      console.log('dropedown data : ', dropDownData);
    return this.dialog.open(DropdownDialogComponent, {
      width: '280px',
      panelClass: 'dropList',
      data: dropDownData,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms'
    })
  }

  getAemData(pageName:'EMPTYPE' | 'EXPERIAN' | 'PDP' | 'LOADER' |'OFFER'| 'INCOME'| 'SUCCESS'| 'ERROR'):Observable<any>{
    try{
      // let url = this.SCE_AEM[pageName]
      let url = environment.URL.B2B_SCE_AEM[pageName];
      // if(!environment.production){
      //   url = url.replace('cms', 'stage-aem')
      // }
      return this.http.get(url)
    }
    catch(e){
      console.log(e)
    }
  }
  formatResponseData(ud: any) {
    const udf = {};
    if (ud === null || undefined) {
      return {};
    }
    else {
      let contentKey
      for (const i in ud) {
        if (i !== 'content') {
          udf[i] = ud[i]
        } else {
          udf[i] = {};
          for (const j in ud[i]) {
            for (const k in ud[i][j]) {
              if (k === 'screenIdentifier') {
                // var contentKey = ud[i][j][k];//es-lint fix
                 contentKey = ud[i][j][k];
                udf[i][ud[i][j][k]] = {}
              }
              else if (k === 'screenContent') {
                for (const l in ud[i][j][k]) {
                  let contentKeyKey = '';
                  if(ud[i][j][k][l]['key'] === undefined && ud[i][j][k][l]['field-key']){
                      contentKeyKey = ud[i][j][k][l]['field-key'];
                  }
                  else{
                    contentKeyKey = ud[i][j][k][l]['key']
                    console.log('contentKeyKey', contentKeyKey)
                    if (contentKeyKey === 'none') {
                      contentKeyKey = ud[i][j][k][l]['section']
                      if (contentKeyKey === 'none') {
                        contentKeyKey = l;
                      }
                    }
                  }
                  if (contentKeyKey in udf[i][contentKey]) {
                    contentKeyKey = ud[i][j][k][l]['section'];
                  }
                  udf[i][contentKey][contentKeyKey] = {};
                  for (const q in ud[i][j][k][l]) {

                    udf[i][contentKey][contentKeyKey][q] = ud[i][j][k][l][q];

                  }
                }
              }
            }
          }
        }
      }

      return udf;


    }
  }

    getEncryptedRequest(keyName: string, podType: string, request: any) {
    const encryptedkeys = this.getEncryptionKey();
    const encryptedRequest = this._apiIntegrated.payLoadEncryption(request, encryptedkeys?.encryptionKeys?.EncryptIV, encryptedkeys?.encryptionKeys?.EncryptKey, podType);
    return encryptedRequest;
    }
 
    getDecryptedResponse(podName: string, response: any) {
    const encryptedkeys = this.getEncryptionKey();
   const res = response.replace(/~/g, '+').replace(/_/g, '/');
    const decryptedResponse = this._apiIntegrated.AESDecryption(res, encryptedkeys.encryptionKeys.EncryptIV, encryptedkeys.encryptionKeys.EncryptKey);
    return JSON.parse(decryptedResponse);
  }

  getEncryptionKey(): { encryptionKeys: { EncryptKey: string; EncryptIV: string } } | undefined {
    const encryptionKeys = {
     EncryptKey: this.parentStorage.commonData.podEncryptKey, //this.parentStorage.commonData.aggregator_encryptKey
    EncryptIV: this.parentStorage.commonData.podEncryptIV //this.parentStorage.commonData.aggregator_encryptIV
 
    };
    console.log("encrptkey from commondta",this.parentStorage?.commonData?.podEncryptKey,);
    console.log("encrptIv from commondta",this.parentStorage?.commonData?.podEncryptIV,);

    
    return { encryptionKeys };
    }
  // this CT function is for APP only
  cleverTapInsert(ctObject: CleverTapObjectType) {
    try {
      const incomingProps = ctObject.props
      ctObject = {
        eventName: ctObject.eventName,
       props:{
        EP_PAGE_NAME: incomingProps.EP_PAGE_NAME,
        EP_BUSINESS: incomingProps.EP_BUSINESS || "Standalone Account Aggregator",
        EP_CHANNEL: incomingProps.EP_CHANNEL || environment.CONNECTION_SOURCE === 'APP' ? '3IN1_APP':'3IN1_WEB',
        EP_USER_TYPE: incomingProps.EP_USER_TYPE || this.sceFormData.customerType || "NTB",
        EP_AGGREGATOR: incomingProps.EP_AGGREGATOR || "ONEMONEYY",
        EP_CTA:incomingProps.EP_CTA,
        
        EP_FULL_NAME: incomingProps.EP_FULL_NAME,
        EP_DOB: incomingProps.EP_DOB,
        EP_EMPLOYMENT_TYPE: incomingProps.EP_EMPLOYMENT_TYPE,
        EP_CHECKBOX: incomingProps.EP_CHECKBOX,
        EP_ERROR_MESSAGE: incomingProps.EP_ERROR_MESSAGE,
        EP_PAN: incomingProps.EP_PAN,
        EP_LOAN_TYPE: incomingProps.EP_LOAN_TYPE,
        EP_SECTION: incomingProps.EP_SECTION,
        EP_SOURCE:incomingProps.EP_SOURCE,
        EP_AMOUNT: incomingProps.EP_AMOUNT,
        EP_Platform: environment.CONNECTION_SOURCE,
       }
      }

      Object.keys(ctObject.props).forEach(key => {
        if (ctObject.props[key] === undefined) {
          delete ctObject.props[key];
        }
      });

      if (environment.CONNECTION_SOURCE === 'APP') {
        console.log('clevertap string -> ', JSON.stringify(ctObject))
        console.log('clevertap obj -> ',ctObject)
        prompt("triggerCTEvent://" + JSON.stringify(ctObject));
      }
      else {
        console.log('CT disabled')
        console.log('clevertap disabled string-> ', JSON.stringify(ctObject))
        console.log('clevertap disabled obj -> ', ctObject)

        // clevertap.event.push(ctObject.eventName, ctObject.props)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  onBack(type:'DEVICE BACK' | 'APP BACK' = 'APP BACK'){
    try{
      console.log('back button url ',this.router.url);
      console.log(type)
      this.toolBarEvent.emit('BACK')
      // to PDP
      if(this.router.url.includes('b2b-sce/personaldetails')){
        this.parentStorage.navigationData.pop()
        this.router.navigateByUrl('b2b-sce/pdp');
        return
      }
      if(this.router.url.includes('b2b-sce/income')){
         this.parentStorage.navigationData.pop();
         window.location.href = '/';
        return
      }
      if(environment.CONNECTION_SOURCE === 'APP'){
        if(this.parentStorage.deviceOS === 'ios' && type === 'DEVICE BACK'){
          return
        }else{
          this.navigationService.popoutNavigationUrlFun()
        }
        // prompt('GoToDashboard')
      }else{
        // window.location.href = '/' ///vernac
        window.location.href = this.langService.backfunctionVernacular(this.router.url); 
      }
    }catch(e){
      console.log(e)
    }
  }

  goToOffers(){
    try{
      if(environment.CONNECTION_SOURCE === 'APP'){
        const t = prompt('inAppDeepLink://bajajsuperapp://cardoffers')
        console.log(t)
      }
      else{
      this.router.navigate(['/','offersModulenew','offer'])
      }
    }
    catch(e){
      console.log(e)
    }
  }

  formatDate(d){
    try{
      if(d.includes('-')){
        console.log('old date',d )
        const nd = d.split('-').reverse().join('/')
        return nd
      }
      else{
        return d
      }
    }
    catch(e){
      console.log(e)
      return d
    }
  }

  ApplyNowRedirect(type:'salaried' | "selfemployed" | ""){
    try{
      if(type === 'salaried'){
        console.log('redirect to salaried')
        if(environment.CONNECTION_SOURCE === 'APP'){
           // PL
          prompt("inAppDeepLink://bajajsuperapp://pdpx/PL__PDP")
        }else{
          window.location.href  = '/personal-loan'
        }
      }
      else{
        console.log('redirect to Self employed')
        if(environment.CONNECTION_SOURCE === 'APP'){
          // BL
          prompt("inAppDeepLink://bajajsuperapp://pdpx/PSBL__PDP")
        }else{
          window.location.href  = '/business-loan'
        }
      }
    }
    catch(e){
      console.log(e)
    }
  }

  getEP_Source() {
    try {
      if(environment.PLATFORM_NAME !== 'WEB'){
        const epSource = { "action": "read", "type": "string", "key": "EP_SOURCE_PARENT", "value": "" };
        const ep_source = prompt('SharedPref://' + JSON.stringify(epSource));
        return ep_source || "";    
      } else {
        return '';
      }
    } catch(err) {
      console.log(err);
      return '';
    }
  }

  scrollToTop(behavior: any  = 'smooth') {
    window.scrollTo({ top: 0, behavior: behavior });
  }

  playVideo(video : Asset){
    const videoDetails: HorizontalVideoModel={
    kpointId : video['kpoint_id'],
    thumbnailPath : video['thumbnail'],
    title : video['title'],
    packageId: video?.['package_id'] || ''
    }
    this._dialogService.openHorizontalVideo(videoDetails)
  }

  getReturnUrl() {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const basePath = pathSegments.length > 0 ? pathSegments[0] : '';
    return `${window.location.origin}/${basePath}/`;
  }

  getLanguageBasedAemUrl(url: string) {
    return this.langService.getContentAPI(url, 'B2B_SCE');
  } 
  
}
// "language_code":"aa_pod"
// [PodNamKeys.AA_POD]: this.langService.getPodLangCode(PodNamValues.AA_POD),
export class SCEFormData {
  customerName: string | null = null;
  customerType: string | null = null;
  customerPAN: string | null = null;
  customerDOB: string | null = null;
  mobileNumber: string | null = null;
  podName: string = 'b2b-aa';
  demogData: any = null;
  customerEmploymentType:'self employed' | 'salaried' | "" = "";
  applicationId: string = "";
  transactionId: string = "";
  poduniqueid: string = "";
  drawingPower: string = "";
  customer_eligibilty: string = "" ;
  podData: any;
}

export type appDevicePropertiesType = {
  appversion?: any;
  ep_serialNo?: any;
  ep_serrionId?: any;
  ep_imei?: any;
  ep_deviceId?: any;
  ep_gaid?: any;
  ep_NetworkCarrier?: any;
  ep_lat?: any;
  ep_long?: any;
  ep_Networktype?: any;
  ep_Usertype?: any;
  device_id?: any;
  handset?: any;
}

export type CleverTapObjectType = {
  eventName: 'STANDALONE_ELIGIBILITY_CLICKED' | 'STANDALONE_ELIGIBILITY_VIEWED';
  props: CTPropsType
}

export type CTPropsType = {
  EP_PAGE_NAME?: string,
  EP_BUSINESS?: string,
  EP_CHANNEL?: string,
  EP_USER_TYPE?: string,
  EP_AGGREGATOR?: string,
  EP_CTA?:string,

  EP_FULL_NAME?: string,
  EP_DOB?: string,
  EP_EMPLOYMENT_TYPE?: string,
  EP_CHECKBOX?: string,
  EP_ERROR_MESSAGE?: string,

  EP_SECTION?: string;
  EP_SOURCE?:string;

  EP_AMOUNT?:string;

  EP_PAN?: any,
  EP_LOAN_TYPE?: any,
  EP_Platform?: any,

}