import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import Inputmask from 'inputmask';
import { AaFlowService } from '../../services/aa-flow.service';
import { PersonalDetailsFormsModel } from '../../interfaces/forms.interface';
import { FormsService } from '../../services/forms.service';
import { B2bExperianPopupComponent } from '../b2b-experian-popup/b2b-experian-popup.component';
import { AaApiService, experianApiResponse, custETBdetailsType, PersonalDetailResponse } from '../../services/aa-api.service';
import { B2bTooltipsComponent } from '../b2b-tooltips/b2b-tooltips.component';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { ParentDataServices } from '../../services/parentData.service';
import { ConnectionMgrService } from 'lib-api';
import { ApiIntegartedService } from 'api-integarted';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputValidationDirective } from '../../directives/input-validation.directive';
import { NgIf, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectionService, PodNamKeys, PodNamValues  } from 'language-selection';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    InputValidationDirective,
    NgIf,
    NgClass,
    TranslateModule
  ],
})
export class PersonalDetailsComponent {
  @ViewChild('aa_field_pdDOB') dobInputElementRef: ElementRef;

  aemData: any;
  empTypeErrorMssg: string;
  personalDetailsForm!: FormGroup<PersonalDetailsFormsModel>;
  @ViewChild('dropdownVal', { static: false }) dropdownVal!: ElementRef;
  udf: any;

  errors = {
    fullName: {
      required: 'b2b_sce.personal_details.personal_details_form_errors.fullNameReqErrMsg',
      pattern: 'b2b_sce.personal_details.personal_details_form_errors.fullNamePatternErrMsg'
    },
    dob: {
      required: 'b2b_sce.personal_details.personal_details_form_errors.dobReqErrMsg',
      invalid: 'b2b_sce.personal_details.personal_details_form_errors.dobInvalidErrMsg',
      pattern: 'b2b_sce.personal_details.personal_details_form_errors.dobPatternErrMsg',
      isNotEligible: 'b2b_sce.personal_details.personal_details_form_errors.dobNotEligibleErrMsg'
    },
    pan: {
      required: 'b2b_sce.personal_details.personal_details_form_errors.panReqErrMsg',
      pattern: 'b2b_sce.personal_details.personal_details_form_errors.panPatternErrMsg'
    },
    empType: {
      required: 'b2b_sce.personal_details.selectEmpErrMsg',
    },
    customerConsent: {
      required: 'b2b_sce.personal_details.t&cErrMsg'
    }
  };
  aem = {
  "screenCoverage": "single",
  "moduleIdentifier": "account-aggregator",
  "lastModified": "2025-03-18T10:02:26.394",
  "content": [
    {
      "screenIdentifier": "personal-details",
      "screenContent": [
        {
          "event-prop-value": "Check your loan eligibility",
          "description": "Provide details to check your eligibility and get curated offers on your loan.",
          "title": "Check your loan eligibility",
          "key": "check-your-loan"
        },
        {
          "event-prop-value": "Personal details",
          "description": "Enter your personal details and start with loan eligibility check.",
          "title": "Personal details",
          "key": "personal-details"
        },
        {
          "event-prop-value": "Full Name on PAN Card",
          "title": "Full Name on PAN Card",
          "key": "full-name-pan"
        },
        {
          "event-prop-value": "Date of Birth (DD/MM/YYYY)",
          "title": "Date of Birth (DD/MM/YYYY)",
          "key": "date-of-birth"
        },
        {
          "group": [
            {
              "title": "PAN Card Number",
              "iconimage-ios": "https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/info-icon-116?scl=1&fmt=png-alpha",
              "iconimage-android": "https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/info-icon-116?scl=1&fmt=png-alpha",
              "key": "pan-card-number",
              "event-prop-value": "PAN Card Number"
            },
            {
              "title": "PAN card number",
              "description": "Enter your 10-character alphanumeric PAN.",
              "image-ios": "https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/pan-card-number?scl=1&fmt=png-alpha",
              "image-android": "https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/pan-card-number?scl=1&fmt=png-alpha",
              "multi-cta-set": [
                {
                  "ctaLabel": "GOT IT",
                  "event-prop-value": "GOT IT",
                  "appCtaLink": "#",
                  "webCtaLink": "#"
                }
              ],
              "key": "pan-drawer",
              "event-prop-value": "PAN card number"
            }
          ],
          "section": "none",
          "key": "pan-wrapper"
        },
        {
          "field-type": "dropdown",
          "field-label-main": "Employment Type (Salaried or Self-employed)",
          "field-subheading": "Select employment type",
          "dropdown-text-box": [
            {
              "dropdown-values": "Salaried",
              "event-prop-value": "Salaried"
            },
            {
              "dropdown-values": "Self-employed",
              "event-prop-value": "Self-employed"
            }
          ],
          "key": "employment-type",
          "event-prop-value": "Employment Type (Salaried or Self-employed)"
        },
        {
          "field-type": "checkbox",
          "field-label-main": "Loan Type",
          "field-subheading": "Select loan type",
          "checkbox-group": [
            {
              "field-item-key": "personal-loan",
              "field-item-text": "Personal Loan",
              "field-selected": "false",
              "event-prop-value": "Personal Loan"
            },
            {
              "field-item-key": "business-loan",
              "field-item-text": "Business Loan",
              "field-selected": "false",
              "event-prop-value": "Business Loan"
            },
            {
              "field-item-key": "ca-loan",
              "field-item-text": "CA Loan",
              "field-selected": "false",
              "event-prop-value": "CA Loan"
            },
            {
              "field-item-key": "doctor-loan",
              "field-item-text": "Doctor Loan",
              "field-selected": "false",
              "event-prop-value": "Doctor Loan"
            },
            {
              "field-item-key": "used-car-finance",
              "field-item-text": "Used Car Finance",
              "field-selected": "false",
              "event-prop-value": "Used Car Finance"
            },
            {
              "field-item-key": "new-car-finance",
              "field-item-text": "New Car Finance",
              "field-selected": "false",
              "event-prop-value": "New Car Finance"
            },
            {
              "field-item-key": "others",
              "field-item-text": "Others",
              "field-selected": "false",
              "event-prop-value": "Others"
            }
          ],
          "key": "loan-type",
          "event-prop-value": "Loan Type"
        },
        {
          "description": "<p>I verify the information provided above. I have read, understood, and thereby consent to sharing my information with Account Aggregator.</p>",
          "key": "verify-the-information"
        },
        {
          "multi-cta-set": [
            {
              "ctaLabel": "CONTINUE",
              "event-prop-value": "CONTINUE",
              "appCtaLink": "#",
              "webCtaLink": "#"
            }
          ],
          "key": "button-section"
        }
      ]
    }
  ]
  };
 
  passDataToPod: PassData;
  expData: experianApiResponse;
  mandatePodUrl: string = "";
  pdFormData = {};
  editedFields: boolean[] = [];
  // removeTimeoutId: NodeJS.Timeout;
  removeTimeoutId: ReturnType<typeof setTimeout>;
  ctaStackErrMsg: string = ''
  // focusTimeout: NodeJS.Timeout;
  focusTimeout: ReturnType<typeof setTimeout>;
  public MobileNumber:any;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private parentStorage: ParentDataServices,
    private aaApi: AaApiService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private aaFlow: AaFlowService,
    private formsService: FormsService,
    private connectionMgr: ConnectionMgrService,
    private _apiIntegartedService:ApiIntegartedService,
    private langService: LanguageSelectionService) {
    this.MobileNumber = JSON.parse(this.connectionMgr.getMobileNumber());
  }

  ngOnInit(): void {
    if (environment.CONNECTION_SOURCE === 'APP') {
      prompt("showWebview");
    }
    this.getAemData();
    this.personalDetailsForm = this.formsService.createPersonalDetailsForm();
    console.log('check personal form', this.personalDetailsForm);
    const custDemogReq = {
      mobileNumber: this.MobileNumber || this.parentStorage?.userInfo?.mobileNo,
      flag: "Y"
    }
    let demogApi
    demogApi = this.aaApi.customerDemog(custDemogReq)
    demogApi.subscribe({
      next: (res) => {
        console.log('demogApi', res)
        this.aaFlow.sceFormData.demogData = res || null
        this.aaFlow.sceFormData.customerType = res?.custType || this.aaFlow.sceFormData.customerType 
        const statuscode = res?.statusCode || res?.statuscode
        console.log(res)
        if (statuscode === "7001" && res?.custDemogDetails) {
          if (res?.custDemogDetails && res?.custDemogDetails?.length > 0 && res?.custType === 'ETB') {
            // set customer data 
            this.setCustomerData(res?.custDemogDetails[0])
          }
          else {
            this.openExperian()
          }
        }
        else {
          this.openExperian()
        }
      },
      error: (err) => {
        console.log(err)
        this.openExperian()
      }
    })

    this.aaFlow.toolBarEvent.subscribe((res) => {
      console.log(res)
      this.cleverTapClick(res)
    })
  }

  setCustomerData(demogData) {
    try {
      this.aaFlow.sceFormData.customerName = [demogData?.firstName, demogData?.lastName].join(' ') || this.aaFlow.sceFormData.customerName
      this.aaFlow.sceFormData.customerDOB = demogData?.dob || this.aaFlow.sceFormData.customerDOB
      this.aaFlow.sceFormData.customerPAN = ((demogData?.panNo || this.aaFlow.sceFormData.customerPAN) || '').toUpperCase(); //(demogData?.panNo).toUpperCase() || (this.aaFlow.sceFormData.customerPAN).toUpperCase()
      this.personalDetailsForm.patchValue({
        fullName: this.aaFlow.sceFormData.customerName,
        dob: this.aaFlow.formatDate(this.aaFlow.sceFormData.customerDOB),
        pan: this.aaFlow.sceFormData.customerPAN
      });

      this.aaFlow.cleverTapInsert({
        eventName: 'STANDALONE_ELIGIBILITY_VIEWED', props: {
          EP_FULL_NAME: this.getFormControl('fullName').value,
          EP_DOB: this.getFormControl('dob').value,
          EP_PAN: (this.getFormControl('pan').value).toUpperCase(),
          EP_EMPLOYMENT_TYPE: this.getFormControl('empType').value,
          EP_CHECKBOX: this.getFormControl('customerConsent').value ? 'YES' : 'NO',
          EP_ERROR_MESSAGE: this.ctaStackErrMsg,
          EP_PAGE_NAME: 'PERSONAL DETAILS PAGE'
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }

  onProceed() {
    try {
      console.log('CONTINUE CLICKED ',this.personalDetailsForm);
      console.log('mandatePodUrl --', this.mandatePodUrl)
      this.aaFlow.sceFormData.customerName = this.getFormControl('fullName').value,
      this.aaFlow.sceFormData.customerDOB = this.getFormControl('dob').value
      this.aaFlow.sceFormData.customerPAN = (this.getFormControl('pan').value).toUpperCase()
      this.aaFlow.sceFormData.customerEmploymentType = (this.getFormControl('empType').value).toLowerCase() === 'salaried' ? 'salaried': 'self employed'
      if (this.personalDetailsForm.valid && (this.getFormControl('customerConsent').value === true)) {
        if (this.mandatePodUrl?.length > 0) {
          if (environment.CONNECTION_SOURCE === 'APP') {
            this.openPodinApp('b2b-aa', this.mandatePodUrl, this.aaApi.config.hostedURL + 'sce/catch/aa').subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                this.router.navigate(['/','b2b-sce','incomefail']);
                console.log(err);
              }
            )
          }
          else {
            this.aaFlow.sceFormData.podName = 'b2b-aa';
            window.location.href = this.mandatePodUrl
          }
        }
        else {
          console.log('no mandate pod url found, call api')
          this.ctaStackErrMsg = ''
          this.checkAndCallPersonalForm()
        }
      }
      else {
        console.log('Invalid Form or Url')
        this.personalDetailsForm.markAllAsTouched()
        this.empTypeErrorMssg = 'b2b_sce.personal_details.selectEmpErrMsg';
        this.personalDetailsForm.updateValueAndValidity()
        this.checkAndSetErrorMsg(this.personalDetailsForm)
      }
      // this.cleverTapClick('CONTINUE')
      this.cleverTapClick(this.aemData?.['button-section']['multi-cta-set'][0]['event-prop-value'])
    }
    catch (e) {
      console.log(e)
    }
  }

  async getAemData() {
    try{
      const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.EMPTYPE);
      console.log('language-based aem url', aemUrl);
      const cacheResponse = await this.aaApi.aemCache(aemUrl);
      // let cacheResponse = this.aem;
      console.log('actual json', cacheResponse)
      const fjson = this.aaFlow.formatResponseData(cacheResponse);
      this.aemData = fjson?.['content']?.['personal-details'];
      console.log('formatted json', this.aemData);
      if (this.aemData?.['verify-the-information']) {
        this.aemData['verify-the-information']['description'] = this.aemData?.['verify-the-information'].description.replace(/<\/?p>/g, '');
      }
    }catch(error){
      console.log("Error fetching personal details aem ",error);
    }
  }

  openAccountAggregator(AccountAggRequest) {
    try {
      console.log('Account aggregator request', AccountAggRequest);
      // this.aaApi.toggleLoading(true)
      let statusCode: string;
      let poduniqueid: string;
      if (environment.CONNECTION_SOURCE === 'APP') {
        statusCode = AccountAggRequest.rawResponse.statusCode;
        poduniqueid = AccountAggRequest.rawResponse.response.poduniqueid;
      } else {
        statusCode = AccountAggRequest.rawResponse.API_RESPONSE.statusCode;
        poduniqueid = AccountAggRequest.rawResponse.API_RESPONSE.response.poduniqueid;
      }
      if(statusCode === '7001' && AccountAggRequest.success === true) {
        this.aaFlow.sceFormData.poduniqueid = poduniqueid || "";
        this.mandatePodUrl = AccountAggRequest.podUrl;
        this.aaFlow.sceFormData.podData = environment.CONNECTION_SOURCE === 'APP' ? AccountAggRequest.rawResponse.response : AccountAggRequest.rawResponse.API_RESPONSE.response;

        const EncryptedReq= this.aaFlow.getEncryptedRequest("","accountaggregator",this.aaFlow.sceFormData);
        console.log("encrypted request from getencryption",EncryptedReq);

        sessionStorage.setItem('EncryptedReq', JSON.stringify(EncryptedReq));

        if (environment.CONNECTION_SOURCE === 'APP') {
          this.router.navigate(['/', 'b2b-sce', 'pod', 'aa']);
        }

      }
      else {
        this.router.navigate(['/','b2b-sce','incomefail']);
        return;
      }

    } catch (e) {
      console.log(e);
    }
  }

  getFormRequest(){
      const requestPayload ={
        id: "",
        mobileNo: this.MobileNumber || this.parentStorage?.userInfo?.mobileNo,
        journeyName: "B2BAA",
        eventCode: "AA_INITIATED",
        pan: this.aaFlow.sceFormData.customerPAN,
        fullName: this.aaFlow.sceFormData.customerName,
        dateOfBirth: this.convertDobFormat(this.aaFlow.sceFormData.customerDOB),
        employmentType: this.aaFlow.sceFormData.customerEmploymentType,
        custType: null,
        custId: null,
        aaConsent: this.getFormControl('customerConsent') ? "yes" : "pflowno",
        aaProfile: null,
        aaSummary: null,
        handlerid: null,
        infosec_params: null,
        subscription_key: null,
        offerId: null,
        emailId: null,
        aaConsentRequest: null,
        aaConsentResponse: null
      }

      return requestPayload;
}

  getPodRequest(){
    const podRequest = {
      mode: "consent_ui",
      consenttype:"bank",
      occupation_type: this.aaFlow.sceFormData.customerEmploymentType,
      channel_key: this.parentStorage.commonData.get3in1Xaop_AAChannelkey,
      channel_name: environment.CONNECTION_SOURCE === "APP" ? "3in1_App_Exp" : "3in1_Web_Exp",//"DP_APP_XAOP2",
      subscription_key: this.parentStorage.commonData.get3in1SubscriptionKeyXaop_AA,
      application_id: this.aaFlow.sceFormData.applicationId, //(this.aaFlow.sceFormData.applicationId)?.replace(/-/g,''),
      transaction_id: (this.aaFlow.sceFormData.transactionId)?.replace(/-/g,''),
      email_id: "",
      return_url: this.aaFlow.getReturnUrl() + 'b2b-sce/pod/aa', //"http://localhost:4200/b2b-sce/pod/aa",
      product_code: environment.CONNECTION_SOURCE === "APP" ? "AA_BANNER_ALL_XAOP_APP" : "AA_BANNER_ALL_XAOP_WEB",//"AA_SA_B2B_XAOP2",
      mobile: this.MobileNumber || this.parentStorage?.userInfo?.mobileNo,
      source_timestamp: "2025-05-24T04:03:21.742Z",
      customer_name: this.aaFlow.sceFormData.customerName,
      pan: this.aaFlow.sceFormData.customerPAN,
      date_of_birth: this.aaFlow.sceFormData.customerDOB,
      forceconsentflag: "0",
      isWeb : environment.PLATFORM_NAME === 'WEB' ? "WEB" : "APP",
      podType : "AAINIT",
      encryptionFlag: true,
      [PodNamKeys.AA_POD]: this.langService.getPodLangCode(PodNamValues.AA_POD),
      infosec_params: {
        app_version: environment.CONNECTION_SOURCE === 'APP' ? this.parentStorage.appVersion : "",
        device_id: this.parentStorage.userInfo?.deviceId || "",
        source_ip: this.parentStorage.userInfo?.customerDeviceIp || "",
        imei: "",
        latitude: "",
        longitude: "",
        handset: "null",
        source_url: environment.CONNECTION_SOURCE === 'WEB' ? window.location.origin+window.location.pathname : "", //"https://uat-oneweb.bajajfinserv.in/webform/v1/b2b-sce/personaldetails",
      },
      CLEVERTAP_CONFIG: {
        EP_LAT: this.aaFlow.getDeviceProperties('ep_lat'),
        EP_GAID: this.aaFlow.getDeviceProperties('ep_gaid'),
        EP_IMEI: this.aaFlow.getDeviceProperties('ep_imei'),
        EP_LONG: this.aaFlow.getDeviceProperties('ep_long'),
        EP_SOURCE:  environment.CONNECTION_SOURCE,
        EP_CHANNEL: environment.CONNECTION_SOURCE === "APP" ? "3in1" : "3in1web",
        EP_INSTALL: "",
        EP_BUSINESS: "Standalone Customer Eligibilty",
        EP_DEVICE_ID: this.aaFlow.getDeviceProperties('device_id'),
        EP_SERIAL_NO: this.aaFlow.getDeviceProperties('ep_serialNo'),
        EP_USER_TYPE: this.aaFlow.getDeviceProperties('ep_Usertype'),
        EP_SCREEN_NAME: "Account Aggregator",
        EP_NETWORK_TYPE: this.aaFlow.getDeviceProperties('ep_Networktype'),
        EP_CT_SESSION_ID:  this.aaFlow.getDeviceProperties('ep_serrionId'),
        EP_APPLICATION_NO:this.aaFlow.sceFormData.applicationId,
        EP_NETWORK_CARRIER: this.aaFlow.getDeviceProperties('ep_NetworkCarrier'),
        EVENT_PROP_EMP_TYPE: this.aaFlow.sceFormData.customerEmploymentType,
      }
    }
    return podRequest;
  }

  callInsertApi(payload){
    try{
      this.aaApi.toggleLoading(true);
      this.aaApi.callAaInsertApi(payload).subscribe({
        next:async (response: PersonalDetailResponse)=>{
          this.aaApi.toggleLoading(false);
          console.log("personal detail insert api response ",response);
          if(response.id !== null){
            this.aaFlow.sceFormData.applicationId = response.id;
            this.aaFlow.sceFormData.transactionId = response.id + '_t';
            // const podRequest = this.getPodRequest();
            // const EncryReq = this._apiIntegartedService.getEncryptedRequest("accountaggregator",podRequest);
            // console.log("encrypted req apiintegrated",EncryReq);
            // this.openAccountAggregator(EncryReq);
            // console.log('Pod Request : ',podRequest);

            const commonPodResponse = await this.commonPodData()
            this.openAccountAggregator(commonPodResponse);
          }
          else{
            this.router.navigate(['/','b2b-sce','incomefail']);
          }
        },
        error: (err) =>{
          this.aaApi.toggleLoading(false);
          console.log('error in personal detail response', err);
          this.router.navigate(['/','b2b-sce','incomefail']);
        }
      });

    }catch(e){
      console.log(e);
    }
    
  }

  async commonPodData() {
    const consentResponse = await this._apiIntegartedService.commonPodCall("B2b_Sce", "LasAggregatorPOD",this.getPodRequest(), "AAINIT", true, "Check Eligibility", "", "");
    console.log('Consent Response:', consentResponse);
    return consentResponse;
  }

  openPodinApp(podname: 'b2b-aa', redirectionUrl: string, returnUrl: string): Observable<any> {
    try {
      this.aaFlow.sceFormData.podName = podname
      let data = {}
      data = {
        redirectionUrl: redirectionUrl,
        returnUrl: returnUrl,
        podName: 'LasAggregatorPOD', // 'P2Salpl'
        moduleName: 'LasAggregatorPOD'
      };
      console.log('pod data', data)
      return of(prompt('openinappbrowserforpod://' + JSON.stringify(data)))
    }
    catch (e) {
      console.log(e)
      throw (e)
    }
  }

  checkAndCallPersonalForm() {
    try {
      if ((this.getFormControl('customerConsent').value === true) && this.personalDetailsForm.valid) {
          const request = this.getFormRequest();
          this.callInsertApi(request);
      }
      else {
        console.log('No consent or invalid form')
      }
    } catch (e) {
      console.log(e)
    }
  }

  onConsentChange() {
    try {
      this.getFormControl('customerConsent').markAllAsTouched();
    }
    catch (e) {
      console.log(e)
    }
  }


  getFormControl(controlName: string) {
    return this.personalDetailsForm?.get(controlName) as FormControl | null;
  }

  getErrorMessage(formControl: string) {
  const control = this.getFormControl(formControl); // Get the form control

  //control && control.invalid && (control.dirty || control.touched
  if (control?.invalid && (control.dirty || control.touched)) {
    if (control.dirty) {
      control.markAllAsTouched(); // Ensure all fields trigger error state
    }

    // Get the first validation error from the control
    const errorKeys = Object.keys(control.errors || {});
    for (let i = 0; i < errorKeys.length; i++) {
      const errorKey = errorKeys[i];
      if (this.errors[formControl]?.[errorKey]) {
        return this.errors[formControl][errorKey]; // Return the corresponding error message
      }
    }
  }

  if(this.personalDetailsForm.valid){
    this.ctaStackErrMsg = '';
  }
  
  return ''; // Return empty string if no errors are found
}

  eraseField(i: any, isStatic: boolean = false, event: any) {
    try {
      if (!isStatic) {
        const frCtrlName = this.getFormControl(i);
        frCtrlName.setValue('')
        frCtrlName.updateValueAndValidity()
        const elem = event.target?.previousElementSibling as HTMLElement
        console.log('checkimg elem ',elem);
        if (elem && elem?.tagName === 'INPUT') {
          clearTimeout(this.focusTimeout)
          this.focusTimeout = setTimeout(() => {
            const x = this.elementRef.nativeElement.querySelector(`#${elem.id}`)
            x.focus()
          }, 0)
        }
      }
      else {
        this.getFormControl(i).setValue('')
        this.getFormControl(i).updateValueAndValidity()
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  openExperian() {
    try {
      const expDrawer = this.bottomSheet.open(B2bExperianPopupComponent, {
        data: {},
        disableClose: true,
        panelClass: 'xaop_v1_experian_panel_class'
      })
      expDrawer.afterDismissed().subscribe((res) => {
        if (res?.event === 'success') {
          this.updateValue('fullName', this.aaFlow.sceFormData.customerName);
          console.log(res)
          this.expData = res?.data;
          if(this.expData?.genericResponse?.statusDesc === 'Success') {
            const custDemogtype: custETBdetailsType = {
            firstName: this.expData?.genericResponse?.ApplicantDetails?.firstName || "",
            lastName: this.expData?.genericResponse?.ApplicantDetails?.lastName || "",
            pinCode: this.expData?.genericResponse?.ApplicantDetails?.pincode || "",
            panNo: this.expData?.genericResponse?.ApplicantDetails?.pan || "",
            dob: this.expData?.genericResponse?.ApplicantDetails?.dob?.slice(6, 8) + '/' + this.expData?.genericResponse?.ApplicantDetails?.dob?.slice(4, 6) + '/' + this.expData?.genericResponse?.ApplicantDetails?.dob?.slice(0, 4) || ""
          }
          // patch fields
          this.setCustomerData(custDemogtype)
          }
        }
        else if (res?.event === 'notfound') {
          // CASE : api hit but no details found
          this.updateValue(this.getFormControl('fullName'), this.aaFlow.sceFormData.customerName);
          this.aaFlow.openSnackBar('Details Not Found', '', 'red')
          this.aaFlow.cleverTapInsert({
            eventName: 'STANDALONE_ELIGIBILITY_VIEWED', props: {
              EP_FULL_NAME: this.getFormControl('fullName').value,
              EP_DOB: this.getFormControl('dob').value,
              EP_PAN:(this.getFormControl('pan').value).toUpperCase(),
              EP_EMPLOYMENT_TYPE: this.getFormControl('empType').value,
              EP_CHECKBOX: this.getFormControl('customerConsent').value ? 'YES' : 'NO',
              EP_ERROR_MESSAGE: this.ctaStackErrMsg,
              EP_PAGE_NAME: 'PERSONAL DETAILS PAGE'
            }
          })
        }
        else if (res?.event === 'infoicon_name') {
          const ExpNamedialogRef = this.dialog.open(B2bTooltipsComponent, {
            width: '640px',
            disableClose: true,
            data: {
              type: 'personalData',
              fname: "Full Name",
              desc: "Enter your full name as it appears on your PAN card.",
              img: "https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/full-name-personal-4?scl=1&fmt=png-alpha",
              cta: "GOT IT"
            },
            panelClass: 'sce_mat_dialog_container'

          });
          ExpNamedialogRef.afterClosed().subscribe((res) => {
            console.log(res);
            // this.openExperian()
          })
        }
        else {
          this.aaFlow.cleverTapInsert({
            eventName: 'STANDALONE_ELIGIBILITY_VIEWED', props: {
              EP_FULL_NAME: this.getFormControl('fullName').value,
              EP_DOB: this.getFormControl('dob').value,
              EP_PAN:(this.getFormControl('pan').value).toUpperCase(),
              EP_EMPLOYMENT_TYPE: this.getFormControl('empType').value,
              EP_CHECKBOX: this.getFormControl('customerConsent') ? 'YES' : 'NO',
              EP_ERROR_MESSAGE: this.ctaStackErrMsg,
              EP_PAGE_NAME: 'PERSONAL DETAILS PAGE'
            }
          })
          // do nothing
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  } 

  openDialog(type: string) {
    const employment = this.aemData?.['employment-type'];
    const finalData = {
      title: employment?.['field-subheading'],
      dropDownList: employment?.['dropdown-text-box'],
      selectedValue: "" // Pass the current selected value
    };
    console.log(finalData);
    const dialogRef = this.aaFlow.openDropdownListDialog(finalData);
    dialogRef.afterClosed().subscribe(result => {
      this.empTypeErrorMssg = 'b2b_sce.personal_details.selectEmpErrMsg';
      console.log('result', result);
      if (result?.selectedValue) {
        this.updateValue(type, result.selectedValue);
      } else if (this.dropdownVal) {
        this.dropdownVal.nativeElement.blur();
      }
    });
  }

  updateValue(controlName, value) {
    this.getFormControl(controlName)?.patchValue(value);// Update the form control to an selcted value
  }

  infoBtnClickCT(type: any) {
    const tooltipConfigMap: { [key: string]: any } = {
      pancard: {
        type: 'infoIconData',
        fname: this.aemData?.['pan-wrapper']['group'][1]['title'],
        desc: this.aemData?.['pan-wrapper']['group'][1]['description'],
        img: this.aemData?.['pan-wrapper']['group'][1]['image-android'],
        cta: this.aemData?.['pan-wrapper']['group'][1]['multi-cta-set'][0].ctaLabel,
      }
    };
    try {
      const expDrawer =  this.bottomSheet.open(B2bTooltipsComponent,{
        data: tooltipConfigMap[type],
        disableClose:true,
        panelClass: 'info_btn_drawer'
      });
      expDrawer.backdropClick().subscribe(()=>{
        expDrawer.dismiss();
      })
    }
    catch (e) {
      console.log(e)
    }

  }

  checkAndSetErrorMsg(fGroup: UntypedFormGroup) {
    try {
      function getErrorCount(container: UntypedFormGroup): number {
        let errorCount = 0;
        for (const controlKey in container.controls) {
          if (container.controls.hasOwnProperty(controlKey)) {
            if (container.controls[controlKey].errors) {
              errorCount += 1
              console.log(errorCount);
            }
          }
        }
        return errorCount;
      }

      const c = getErrorCount(fGroup)
      if (c > 1) {
        this.ctaStackErrMsg = 'b2b_sce.personal_details.multipleErrMsg';
        console.log(this.ctaStackErrMsg, 'b2b_sce.personal_details.multipleErrMsg');
        return;
      } else if(c === 1 && this.personalDetailsForm.controls['customerConsent'].errors){
        this.ctaStackErrMsg = 'b2b_sce.personal_details.t&cErrMsg';
        console.log(this.ctaStackErrMsg, 'b2b_sce.personal_details.t&cErrMsg');
        return;
      }else {
        this.ctaStackErrMsg = 'b2b_sce.personal_details.singleErrMsg'
        console.log(this.ctaStackErrMsg, 'b2b_sce.personal_details.singleErrMsg');
        return;
      }

    }
    catch (e) {
      console.log(e)
    }
  }

  public AllowDobNumeric(e) {
    try {
      if (e.charCode >= 47 && e.charCode <= 57) {
        return true;
      } else {
        e.preventDefault();
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  convertDobFormat(dob: string){
    const [day, month, year] = dob.split('/');
    return `${year}-${month}-${day}`;
  }

  inputMask() {
    try {
      Inputmask('datetime', {
        inputFormat: 'dd/mm/yyyy',
        placeholder: 'DD/MM/YYYY',
        prefillYear: false,
        clearMaskOnLostFocus: true,
        isComplete: function isComplete(buffer, opts) {
          console.log('Data', buffer, opts);
        }
      }).mask(this.dobInputElementRef.nativeElement);
    }
    catch (e) {
      console.log(e)
    }
  }

  panModifier = (event: InputEvent) => {
      if (event.type === 'selectionchange') {
        const inputElement = event.target as HTMLInputElement;
        const cEnd = inputElement.selectionEnd ?? 0
        inputElement.inputMode = cEnd >= 5 && cEnd <= 8 ? 'numeric' : 'text'
        return
      }
      const maxlength = 10
      const inputElement = event.target as HTMLInputElement;
      const emojiRegex = /[\uD800-\uDBFF]|[\u2702-\u27B0]|[\uF680-\uF6C0]|[\u24C2-\uF251]/g
      const newValue = inputElement.value.toUpperCase().replace(emojiRegex, '').replace(/[^A-Z0-9]/g, '')
      inputElement.value = newValue.length > maxlength ? newValue.substring(0, maxlength) : newValue;
  }

  private cleverTapClick(ep_cta: string) {
    try {
      this.aaFlow.cleverTapInsert({
        eventName: 'STANDALONE_ELIGIBILITY_CLICKED', props: {
          EP_FULL_NAME: this.getFormControl('fullName').value,
          EP_DOB: this.getFormControl('dob').value,
          EP_PAN:(this.getFormControl('pan').value).toUpperCase(),
          EP_EMPLOYMENT_TYPE: this.getFormControl('empType').value,
          EP_CHECKBOX: this.getFormControl('customerConsent').value ? 'YES' : 'NO',
          EP_ERROR_MESSAGE: this.ctaStackErrMsg,
          EP_PAGE_NAME: 'PERSONAL DETAILS PAGE',
          EP_CTA: ep_cta
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }

}

export interface PassData {
  appversion?: string,
  ep_serialNo?: string,
  ep_serrionId?: string,
  ep_imei?: string,
  ep_deviceId?: string,
  ep_gaid?: string,
  ep_NetworkCarrier?: string,
  ep_lat?: string,
  ep_long?: string,
  ep_Networktype?: string,
  ep_Usertype?: string
}
