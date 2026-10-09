import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';
import { ParentStorageService } from 'parent-storage';
import { ParentDataServices } from '../../services/parentData.service';
import { ConnectionMgrService } from 'lib-api';
import { LoaderSpinnerComponent } from '../loader-spinner/loader-spinner.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-b2b-common-pod',
  templateUrl: './b2b-common-pod.component.html',
  styleUrls: ['./b2b-common-pod.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    LoaderSpinnerComponent
  ]
})
export class B2bCommonPodComponent implements OnInit {

  parsedAggResp: any;
  isLoading: boolean = true;
  aggregatorPodResp: any;
  public MobileNumber:any;
  constructor(
    private aRoute: ActivatedRoute, 
    private router: Router, 
    private aaFlow: AaFlowService, 
    private aaApi: AaApiService, 
    private parentStorage: ParentStorageService,
    private parentData: ParentDataServices,
    private connectionMgr: ConnectionMgrService) {
    this.MobileNumber = JSON.parse(this.connectionMgr.getMobileNumber());
  }

  ngOnInit(){
    if(environment.CONNECTION_SOURCE === 'WEB') {
        this.aRoute.params.subscribe((params) => {
        console.log('params in common pod ',params);
        if(params.podName){
          this.redirFromAccountAggregator();
        }else{
          this.router.navigate(['/','b2b-sce','incomefail']);
        }
      });
    }
  }

    redirFromAccountAggregator() {

    if (environment.CONNECTION_SOURCE === "APP") {
      if (!this.aggregatorPodResp) {
        console.log("NO AGG RESP");
        this.aggregatorFailure();
      }
        this.getInsertRequest();
    } else {
      // Web Case
      this.aRoute.queryParams.subscribe(q => {
        sessionStorage.setItem("Account Aggregator Resposne", q['PODUrl'])
        console.log('podUrl in common pod ',q['PODUrl']);
        this.aggregatorPodResp = q['PODUrl'];
        if (!this.aggregatorPodResp) {
          // no response / failure case 
          console.log("SCE/REDIR/AGGREGATOR/NO_AGGREGATOR_RESP/2")
          this.aggregatorFailure();
        }
          this.getInsertRequest();
      });
    }
  }

  aggregatorFailure() {
    console.log("AGG FAIL");
    this.router.navigate(['/','b2b-sce', 'incomefail'])
    return
  }


  getInsertRequest(){
    const getFromSession = JSON.parse(sessionStorage.getItem('EncryptedReq') || '{}');
    const encryptedRequestValue = getFromSession.EncryptedRequest;
    const decryptResponse = this.aaFlow.getDecryptedResponse('accountaggregator',encryptedRequestValue);
    console.log("Decrypted response from session storage",decryptResponse);

    this.aggregatorPodResp = decodeURIComponent(this.aggregatorPodResp);
    this.aggregatorPodResp = this.aggregatorPodResp.replace(/~/g, "+").replace(/_/g, '/');
    const decrypt_resp = this.aaFlow.getDecryptedResponse('accountaggregator', this.aggregatorPodResp);
    console.log('decrypt_resp',decrypt_resp);
    // this.parsedAggResp = JSON.parse(decrypt_resp);

    if(['0300'].includes(decrypt_resp?.result?.statuscode)){

      const request = {
      id: decryptResponse.applicationId, //(decryptResponse.applicationId)?.replace(/-/g,'') || "",
      mobileNo: this.MobileNumber || this.parentData?.userInfo?.mobileNo,
      eventCode: "AA_COMPLETED",
      journeyName: "B2BAA",
      fullName: decryptResponse.customerName || "",
      aaConsentRequest: {
          mode: "consent_ui",
          consenttype: "bank",
          occupation_type: decryptResponse.customerEmploymentType || "",
          channel_key: this.parentStorage.commonData.get3in1Xaop_AAChannelkey,
          channel_name: environment.CONNECTION_SOURCE === "APP" ? "3in1_App_Exp" : "3in1_Web_Exp",//"DP_APP_XAOP2",
          subscription_key: this.parentStorage.commonData.get3in1SubscriptionKeyXaop_AA,
          application_id: decryptResponse.applicationId, //(decryptResponse.applicationId)?.replace(/-/g,'') || "",
          transaction_id: (decryptResponse.transactionId)?.replace(/-/g,'') || "",
          email_id: "",
          return_url: this.aaApi.config.hostedURL + 'b2b-sce/pod/aa', //"https://uat-oneweb.bajajfinserv.in/webform/v1/sce/pod/aa",
          product_code: environment.CONNECTION_SOURCE === "APP" ? "AA_BANNER_ALL_XAOP_APP" : "AA_BANNER_ALL_XAOP_WEB",//"AA_SA_B2B_XAOP2",
          mobile: this.MobileNumber || this.parentData?.userInfo?.mobileNo,
          source_timestamp: "2025-05-24T04:03:21.742Z",
          customer_name: decryptResponse.customerName || "",
          pan: decryptResponse.customerPAN || "",
          date_of_birth: decryptResponse.customerDOB || "",
          forceconsentflag: "0",
          infosec_params: {
              app_version: environment.CONNECTION_SOURCE === 'APP' ? this.parentStorage.appVersion : "",
              device_id: this.parentStorage.userInfo?.deviceId || "",
              source_ip: this.parentStorage.userInfo?.customerDeviceIp || "",
              imei: "",
              latitude: "",
              longitude: "",
              handset: "null",
              source_url: environment.CONNECTION_SOURCE === 'WEB' ? window.location.origin +window.location.pathname : "",
          },
          CLEVERTAP_CONFIG: {
              EP_LAT: this.aaFlow.getDeviceProperties('ep_lat'),
              EP_GAID: this.aaFlow.getDeviceProperties('ep_gaid'),
              EP_IMEI: this.aaFlow.getDeviceProperties('ep_imei'),
              EP_LONG: this.aaFlow.getDeviceProperties('ep_long'),
              EP_SOURCE: environment.CONNECTION_SOURCE,
              EP_CHANNEL: environment.CONNECTION_SOURCE === "APP" ? "3in1" : "3in1web",
              EP_INSTALL: "",
              EP_BUSINESS: "Standalone Customer Eligibilty",
              EP_DEVICE_ID: this.aaFlow.getDeviceProperties('device_id'),
              EP_SERIAL_NO: this.aaFlow.getDeviceProperties('ep_serialNo'),
              EP_USER_TYPE: this.aaFlow.getDeviceProperties('ep_Usertype'),
              EP_SCREEN_NAME: "Account Aggregator",
              EP_NETWORK_TYPE: this.aaFlow.getDeviceProperties('ep_Networktype'),
              EP_CT_SESSION_ID: this.aaFlow.getDeviceProperties('ep_serrionId'),
              EP_APPLICATION_NO: decryptResponse.applicationId,
              EP_NETWORK_CARRIER:this.aaFlow.getDeviceProperties('ep_NetworkCarrier'),
              EVENT_PROP_EMP_TYPE: decryptResponse.customerEmploymentType,
          }
      },
      aaConsentResponse: decryptResponse.podData || {},
      }

      this.callInsertApi(request);
    }
    else{
        this.router.navigate(['/','b2b-sce', 'incomefail'])
    }
  }

  callInsertApi(requestPayload){
    try{
      this.aaApi.callAaInsertApi(requestPayload).subscribe({
        next: (response)=>{
          this.isLoading = false;
          console.log('insert2 api response :: ',response);
          if(response.statusCode === "7001"){
            this.router.navigate(['/','b2b-sce','income'])
          }else{
            this.router.navigate(['/','b2b-sce','incomefail']);
          }
        },
        error: (err)=>{
          console.log('error in insert2 api :: ', err);
          this.router.navigate(['/','b2b-sce','incomefail']);
        }
      })
    }
    catch(e){
      console.log(e);
      this.router.navigate(['/','b2b-sce','incomefail']);
    }
  }
}


 