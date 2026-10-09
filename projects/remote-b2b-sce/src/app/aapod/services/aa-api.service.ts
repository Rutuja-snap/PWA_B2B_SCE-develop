import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConnectionMgrService, ConnectionMgrV2Service } from 'lib-api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NodeService } from './node.service';
import { ApiIntegartedService } from 'api-integarted';
import { ParentDataServices } from './parentData.service';
import { CacheService } from 'cache-lib';


@Injectable({
  providedIn: 'root'
})
export class AaApiService {
  config = {
    hostedURL: environment.HOST_URL
  }
  public POD_BASE_URL: string = environment.POD_BASE_URL;

  private BASE_URL: string = environment.SA_API_BASE_URL
  private CUST_DEMOG_DETAILS = {
    url: this.BASE_URL + "/apis/custdemogdetails",
    encKey: '',
    operationId: 'custdemogdetails',
    isConMngr: true,
    kpiSubprocess: "SCE_CustDemog"
  }


  public EXPERIAN_INIT ={
    url: this.BASE_URL + '/apis/softpull',
    encKey: '',
    operationId: 'softpull',
    isConMngr: true,
  }

  public AA_INSERT_WEB = {
    url: this.BASE_URL + '/apis/aainsert',
    encKey: '',
    operationId: 'aainsert',
    isConMngr: true,
  }

  public AGGREGATOR_POD_INIT_SCE = environment.production ? {
    //PROD 
    url: "https://prodapitm.bajajfinserv.in/aggregatorpodapi/ConsentRequest",
    node_url: "",
    "Ocp-Apim-Subscription-Key": this.parentStorage.commonData.OcpApimSubscriptionKey_xaop_prod_aa, //'',
    authorization: '',
    subscription_key: "",
    channel_key: "",
    channel_name: "3in1_Web_Exp",
    operationId: "ConsentRequest",
    'Content-Type': 'application/json',
    ui_mode: "consent_ui",

    EncryptKey: "",
    EncryptIV :"",
  } : {

    // UAT
    url: environment.AGGREGATOR_POD_BASE_URL + "aggregatorpodapi/ConsentRequest",
    node_url: "",
    "Ocp-Apim-Subscription-Key": this.parentStorage.commonData.OcpApimSubscriptionKey_xaop,//'',
    authorization: '',
    subscription_key: "",
    channel_key: "",
    channel_name: "3in1_Web_Exp",

    operationId: "ConsentRequest",
    'Content-Type': 'application/json',
    ui_mode: "consent_ui",

    EncryptKey: "",
    EncryptIV :"",
  }

  public AGGREGATOR_POD_GET_PROFILE = environment.production ? {
    //PROD 
    url: "https://prodapitm.bajajfinserv.in/aggregatorpodapi/ProfileDataRequest",
    node_url: "",
    "Ocp-Apim-Subscription-Key": '',
    authorization: '',
    subscription_key: "",
    channel_key: "",
    channel_name: "3in1_Web_Exp",
    operationId: "ProfileDataRequest",
    'Content-Type': 'application/json',
    ui_mode: "consent_ui",

    EncryptKey: "",
    EncryptIV :"",
  } : {

    url: environment.AGGREGATOR_POD_BASE_URL + "aggregatorpodapi/ProfileDataRequest",
    node_url: "",
    "Ocp-Apim-Subscription-Key": '',
    authorization: '',
    subscription_key: "",
    channel_key: "",
    channel_name: "3in1_Web_Exp",

    operationId: "ProfileDataRequest",
    'Content-Type': 'application/json',
    ui_mode: "consent_ui",

    EncryptKey: "",
    EncryptIV :"",
  }

  cacheService: CacheService;
  constructor(
    private conMngr: ConnectionMgrService,
    private conMngrv2: ConnectionMgrV2Service,
    private node: NodeService,
    private parentStorage: ParentDataServices,
    private router: Router,
    private _snackBar: MatSnackBar,
    private http:HttpClient,
    private apiIntegratedservice:ApiIntegartedService,
    public loader: NgxUiLoaderService,
    injector: Injector,
  ) { this.cacheService = injector.get<CacheService>(CacheService); }


  async aemCache(url) {
    const requestBody = {
      requestBody: '',
      endPoint: '',
      additionalHeaders: [],
      url: url,
      tobeCached: true,
      cacheDurationInHours: 4,
      cacheReferenceKey: '',
      isAEM: true
    }
    return await this.cacheService.getData(requestBody);
  }


  SCE_Gateway_API_call(operation: apiOperation,payload: any,connectionFrom: string = 'WEB',source: any = 'Upgrade-ws',kpiHelper: any | KpiHelper = null): Observable<any> {

  return from((async () => {
    try {
      const op = operation;
      console.log("Payload : " + JSON.stringify(payload));

      if (environment.IS_CONNECTION_MNGR && op.isConMngr) {
        if (kpiHelper && environment.CONNECTION_SOURCE === 'APP') {
          payload['logData'] = this.node.KPIForSocket(kpiHelper.module,kpiHelper.process,kpiHelper.subprocess,op?.operationId,kpiHelper?.apiVersion);
          console.log('PAYLOAD_WITH_KPI/ ', payload);
        }

        // const startTime = new Date();

        const resp = await this.conMngrv2.syncGateWayApiCallingV4(op.operationId, payload, connectionFrom, {}, source, localStorage.getItem('access_token'));

        setTimeout(() => {
          try {
            const finalstatuscode = (environment.CONNECTION_SOURCE === 'APP')
              ? resp['statusCode']
              : resp['STATUS_CODE'];
            console.log('Log Service', finalstatuscode);
          } catch (e) {
            console.log(e);
          }
        });

        if (environment.CONNECTION_SOURCE === 'APP') {
          let res: any;
          try {
            res = typeof resp === 'string' ? JSON.parse(resp) : resp;
          } catch (e) {
            console.log("ERROR parsing JSON response | ", operation, resp, e);
            res = resp;
          }
          console.log(res);
          return res;
        } else if(resp['API_RESPONSE']['STATUS'] !== 'E') {
          console.log(resp['API_RESPONSE']);
          return resp['API_RESPONSE'];
        } else {
          throw new HttpErrorResponse({
            status: parseInt(resp['API_RESPONSE']['STATUS_CODE'], 10),
            statusText: resp['API_RESPONSE']['STATUS']
          });
        }
      } else {
        console.log('API call without con manager');
        return {}; // or throw if this case shouldn't happen
      }
    } catch (e) {
      console.error("Error in API call:", e);
      throw e;
    }
  })()).pipe(
    catchError(err => {
      return throwError(() => err);
    }),
    map(res_data => res_data)
  );
}


  APKVersion() {
    let apkVersionValue;
    apkVersionValue = this.parentStorage.appVersion;
    return apkVersionValue;
  }

  customerDemog(payload: any, kpiHelper: any = null): Observable<any> {
      this.toggleLoading(true)
      return this.SCE_Gateway_API_call(this.CUST_DEMOG_DETAILS, payload, 'Upgrade-ws', 'WEB', kpiHelper)
        .pipe(
          catchError((err) => {
            this.toggleLoading(false)


            console.error(err);
            return throwError(err);
          }),
          map(data => {
            this.toggleLoading(false)
            return data;
          }))
  }


  callExperianApi(payload:experianPayload, kpiHelper = null): Observable<any> {
    try{
      console.log( 'Payload',JSON.stringify(payload))
      this.toggleLoading(true)

      return this.SCE_Gateway_API_call(this.EXPERIAN_INIT, payload, 'rest', 'WEB', kpiHelper).pipe(
          catchError((err) => {
            
            this.toggleLoading(false);
            console.error(err);
            return throwError(err);
          }),
          map((data) => {
            this.toggleLoading(false);
            return data;
          })
        );
    }
    catch(e){
      this.toggleLoading(false);
      console.log(e)
    }
  }

  callAaInsertApi(payload:personalDetail, kpiHelper = null): Observable<any> {
    try{
      console.log( 'Payload',JSON.stringify(payload))
      if(!payload.aaConsentResponse){
        this.toggleLoading(true)
      }

      return this.SCE_Gateway_API_call(this.AA_INSERT_WEB, payload, 'upgrade-ws', 'WEB', kpiHelper).pipe(
          catchError((err) => {
            if(!payload.aaConsentResponse){
              this.toggleLoading(false);
            }
            console.error(err);
            return throwError(err);
          }),
          map((data) => {
            if(!payload.aaConsentResponse){
              this.toggleLoading(false);
            }
            return data;
          })
        );
    }
    catch(e){
      this.toggleLoading(false);
      console.log(e)
    }
  }

  toggleLoading(loading: boolean = true) {
    console.log("SCE/toggle_load/", loading)
    if (environment.CONNECTION_SOURCE === "APP") {
      if (loading) {
        this.apiIntegratedservice.openNativeLoader()

      } else {

        this.apiIntegratedservice.closeNativeLoader()
      }
    } else if(loading) {
      this.loader.start() 
    } else {
      this.loader.stop();
    }
    // debugger
    // this.loading$.next(loading)
  }

  aggregatorInitSCE(payload: any): Observable<string> {
    try {
      // headers 
      const enc_payload = payload
      console.log("AGGRERATOR/POD_REQ/ENC", enc_payload)
 
      const aggre_headers: HttpHeaders = new HttpHeaders()
        .set('Content-Type', this.AGGREGATOR_POD_INIT_SCE['Content-Type'])
        .set('channelkey', this.parentStorage.commonData.get3in1Xaop_AAChannelkey) //"3IN1WEBEXP_4bf5138c865581e935d7c572ea95aebf"
        .set('Ocp-Apim-Subscription-Key', this.AGGREGATOR_POD_INIT_SCE['Ocp-Apim-Subscription-Key']) // this.AGGREGATOR_POD_INIT['Ocp-Apim-Subscription-Key'] //this.parentStorage.commonData.OcpApimSubscriptionKey_xaop, this.parentStorage.commonData.OcpApimSubscriptionKey_xaop_prod_aa
      
      return this.http.post(
        this.AGGREGATOR_POD_INIT_SCE.url,
        enc_payload,
        { headers: aggre_headers, responseType: 'text' as 'json' }).pipe(
          catchError((err) => {

            console.error(err);
            return throwError(err);
          }),
          map((response: string) => {
            console.log('api response in map',response);
            return response;
          }))
    }
    catch (e) {
      console.log(e)
    }
  }

  aggregatorPodGetProfile(payload: any): Observable<any> {
    try {

      const enc_payload = payload
      console.log("AGGRERATOR/PROFILE_REQ/ENC", enc_payload)
 
      const aggre_headers: HttpHeaders = new HttpHeaders()
        .set('Content-Type', this.AGGREGATOR_POD_GET_PROFILE['Content-Type'])
        .set('MOAuthorization', this.parentStorage.userInfo.APP_TOKEN)
        .set('Ocp-Apim-Subscription-Key', this.parentStorage.commonData.OcpApimSubscriptionKey_xaop_prod_aa) 
      
      return this.http.post(
        this.AGGREGATOR_POD_GET_PROFILE.url,
        enc_payload,
        { headers: aggre_headers }).pipe(
          catchError((err) => {

            console.error(err);
            return throwError(err);
          }),
          map((response: any) => {

            return response;
          }))
    }
    catch (e) {
      console.log(e)
    }
  }

  clearNavigationStack(){
    try{
      this.parentStorage.navigationData = []
    }
    catch(e){
      console.log(e)
    }
  }

}

export type apiOperation = {
  url: string;
  encKey: string;
  operationId: string;
  isConMngr: boolean;
  kpiSubprocess?: string;
}

export interface KpiHelper {
  process?: string;
  subprocess?: string;
  module?: string;
  operationId?: string;
  statuscode?: any;
  apiVersion?: string;
}


export type experianPayload = {
  firstName:string;
  surName:string;
  mobilePhone:string;
  business:string;
  channel:string;
}

export type personalDetail = {
  id: "",
  mobileNo: string,
  journeyName: string,
  eventCode: string,
  pan: string,
  fullName: string,
  dateOfBirth: string,
  employmentType: string,
  custType: string,
  custId: string,
  aaConsent: string,
  aaProfile: string,
  aaSummary: string,
  handlerid: string,
  infosec_params: string,
  subscription_key: string,
  offerId: string,
  emailId: string,
  aaConsentRequest: string,
  aaConsentResponse: string
        
}

export type custETBdetailsType = {
  id?: string| null;
  cname?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  cityName?: string | null;
  stateName?: string | null;
  pinCode?: string | null;
  dob?: string | null;
  panNo?: string | null,
  gender?: string | null,
}

export interface experianApiResponse {
  description?: string,
  statusCode?: string,
  genericResponse?: {
    statusCode?: string,
    statusDesc?: string,
    expRequestTimestamp?: string,
    expResponseTimestamp?: string,
    expResponseTime: number,
    business?: string,
    channel?: string,
    ApplicantDetails?: {
      id?: string,
      mobile?: string,
      source?: string,
      bureauCustomerId?: string,
      lastName?: string,
      firstName?: string,
      middleName1?: string,
      middleName2?: string,
      middleName3?: string,
      gender?: number,
      pan?: string,
      dob?: string,
      income?: string,
      employmentStatus?: string,
      address?: string,
      city?: string,
      state?: string,
      pincode?: string,
      email?: string,
      reportNumber?: string
    }
  }
}

export interface PersonalDetailResponse{
  id: string,
  description: string,
  statusCode: string,
  dbResponse: string | null,
  eventCode: string | null
}

export interface AggregatorInitResp{
  status?: string;          // "SUCCESS",
  statusCode?: 200 | 400 | 503 | 404;          // 200,
  timestamp?: string;         // "2023-05-31T15:13:49.7965062+05:30",
  message?: string;         // "URL Generated Successfully",
  poduniqueid?: string;         // "",
  url?: string;         //
  param?: string;
  response?: string;          // ""
}
