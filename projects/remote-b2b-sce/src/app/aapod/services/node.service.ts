import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ParentDataServices } from './parentData.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private parentStorage : ParentDataServices,private router: Router,
  ){

  }

  KPIForSocket(module:string, process:string, subProcess: string, operationId: string, apiVersion: string ="NA") {
    try{
      if(environment.CONNECTION_SOURCE === 'APP'){
        const dynKPI=  this.getDynamicKPIdata(module, process, operationId, subProcess);
        module = dynKPI.module
        process = dynKPI.process
        subProcess = dynKPI.subProcess
        const logdata = JSON.stringify({
          "channel": this.kpiConstants[module]?.channel || "NA",
          "product": this.kpiConstants[module]?.productName || "NA",
          "process": process,
          "subProcess": subProcess,
          "processType": "fetch",
          "user_id": this.parentStorage.customerDetails.mobileNumber,
          "apiName": operationId,
          "apiVersion": apiVersion,
          "APKVersion": this.APKVersion(),
        })
        console.log("KpiSocketJson->", JSON.stringify(logdata))
        return logdata;
      }
      else{
        console.log('KPIForSocket web')
      }
    }
    catch(e){
      console.log(e)
    }
  }

  APKVersion() {
    let apkVersionValue;
    apkVersionValue = this.parentStorage.appVersion;
    return apkVersionValue;
  }

  getDynamicKPIdata(module: any, process: any, operationId: any, subProcess: any) {
    try{
    let kpiModule
   if (this.router.url.includes('/emicard/') || this.parentStorage.emicard_store.cardType === 'EC') {
      kpiModule = "EMIPWA";
    } else if (this.router.url.includes('/salpl/')) {
      kpiModule = "SALPL"
    }
    else if (this.router.url.includes('/fixed-deposit/')){
      kpiModule = "FD_v2"
    } else if (this.router.url.includes('/pharma/')){
      kpiModule = "RPR_Pharma"
    }
    else if (this.router.url.includes('/icl/')){
      kpiModule = "PRO_ICL"
    }
    else if (this.router.url.includes('/slv/')){
      kpiModule = "PRO_SLV"
    }

    else{
      kpiModule = module
    }
    switch(kpiModule){
      case "HEMIPWA":
          module = "HEMIPWA";
          process = "HEMIPWA";
          if (operationId === 'oauth-otp'  || operationId === 'oauth-otp-web') {
            if(this.router.url.includes('activate-now') || this.router.url.includes('thank-you') || this.router.url.includes('otppage/H8') || this.router.url.includes('otppage/H9')){
              subProcess = "HEMI-8_ViewCardOTPgen"
            }
            else{
              subProcess = "HEMI-1_" + subProcess;
            }
          } else if (operationId === 'oauth-otp-validate') {
            if(this.router.url.includes('activate-now') || this.router.url.includes('thank-you') || this.router.url.includes('otppage/H8') || this.router.url.includes('otppage/H9')){
              subProcess = "HEMI-9_ViewcardOTPvalidate"
            }
            else{
              subProcess = "HEMI-2_" + subProcess;
            }
          }
          else if (operationId.startsWith('emipod/')) {
            subProcess = "H" + subProcess;
          }
        break;
      case "EMIPWA":
          module = "EMIPWA";
          process = "EMIPWA";
          if (operationId === 'oauth-otp' || operationId === 'oauth-otp-web') {
            if(this.router.url.includes('activate-now') || this.router.url.includes('thank-you') || this.router.url.includes('otppage/E8') || this.router.url.includes('otppage/E9')){
              subProcess = "EMI-8_ViewCardOTPgen"
            }
            else{
              subProcess = "EMI-1_" + subProcess;
            }
          } else if (operationId === 'oauth-otp-validate') {
            if(this.router.url.includes('activate-now') || this.router.url.includes('thank-you') || this.router.url.includes('otppage/E8') || this.router.url.includes('otppage/E9')){
              subProcess = "EMI-9_ViewcardOTPvalidate"
            }
            else{
              subProcess = "EMI-2_" + subProcess;
            }
          }
        break;
      default:
                                  //arti
        // module = module
        // process = process
        // subProcess = subProcess
        break;

    }
    return { "module": module, "process":process || "NA" ,"subProcess": subProcess || "NA" };
    }
    catch(err){
      console.log(err)
      return { "module": module || "NA", "process":process || "NA","subProcess": subProcess || "NA"}
    }
  }


  kpiConstants = {
    "EMIPWA":{
      channel: "3in1",
      productName: "EMIPWA"
    },
    "HEMIPWA":{
      channel: "3in1",
      productName: "HEMIPWA"
    },
    "SALPL": {
      channel: "3in1",
      productName: "SALPL"
    },
    "FD_v2" : {
      channel: "3in1",
      productName: "FD_v2"
    },
    "RPR_Pharma": {
      channel: "3in1",
      productName: "RPR_Pharma"
    },
    "PRO_ICL":{
      channel: '3in1',
      productName: "PRO_ICL"
    },
    "PRO_SLV":{
      channel: '3in1',
      productName: "PRO_SLV"
    }
  }
}