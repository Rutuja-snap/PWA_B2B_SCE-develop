import { Component, ElementRef, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AaFlowService } from '../../services/aa-flow.service';
import { experianApiResponse, experianPayload, AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { ParentDataServices } from '../../services/parentData.service';
import { ConnectionMgrService } from 'lib-api';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputValidationDirective } from '../../directives/input-validation.directive';
import { NgIf, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-b2b-experian-popup',
  templateUrl: './b2b-experian-popup.component.html',
  styleUrls: ['./b2b-experian-popup.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    InputValidationDirective,
    NgClass,
    NgIf,
    TranslateModule
  ]
})
export class B2bExperianPopupComponent implements OnInit {
  expanded : 'open' | 'close' = 'close';
  seeMore : boolean = false;
  aemData: any;
  selectedValue: string;
  toggle_label: string;
  ctaErrormssg: string;
 
 
  fullname = new FormControl("",[Validators.required]);
  // focusTimeout: NodeJS.Timeout
  focusTimeout: ReturnType<typeof setTimeout>;
  public MobileNumber:any;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<B2bExperianPopupComponent>,
    private dialog: MatDialog,
    private parentStorage:ParentDataServices,
    private aaApi: AaApiService,
    private aaFlow:AaFlowService,    
    private elementRef: ElementRef,
    private connectionMgr:ConnectionMgrService
  ) { 
    this.MobileNumber = JSON.parse(this.connectionMgr.getMobileNumber())
  }
 
  ngOnInit(): void {
    this.getAemData()
    this.aaFlow.cleverTapInsert({eventName:'STANDALONE_ELIGIBILITY_VIEWED',props:{EP_FULL_NAME:this.fullname.value,EP_PAGE_NAME:'CONSENT PAGE'}})
  }
 
  onChange(value) {
    this.selectedValue = value;
    console.log('selected radio value ',this.selectedValue);
  }
 
  setExpanded (){
    try {
      console.log('method setexpanded for clevertapclick ',this.toggle_label.toUpperCase());
      this.cleverTapClick(this.toggle_label.toUpperCase())
      this.expanded = this.expanded === 'close' ? 'open' : 'close'
      this.seeMore = !this.seeMore;
      if (this.seeMore) {
        // this.toggle_label = this.aemData?.['select-an-option-wrapper']['fields'][4]['ctalabel2'];
        this.toggle_label = this.aemData?.['select-an-option-wrapper']['fields'][4]['event-prop-value-2'];
      } else {
        // this.toggle_label = this.aemData?.['select-an-option-wrapper']['fields'][4]['ctalabel1'];
        this.toggle_label = this.aemData?.['select-an-option-wrapper']['fields'][4]['event-prop-value-1'];
      }
    } catch (error) {
      console.log(error)
    }
  }
  closeExpansion(ep_cta:string){
    try {
      this.cleverTapClick(ep_cta)
      this._bottomSheetRef.dismiss({event:'close'});
    } catch (error) {
      console.log(error)
    }
  }
 
  getExperianRequest(){
    const nameParts = this.fullname.value?.trim().split(' ');
    const experianReq:experianPayload = {
      firstName:nameParts[0] || "",
      surName: nameParts.slice(1).join(' ') || "",
      mobilePhone: this.MobileNumber || this.parentStorage?.userInfo?.mobileNo,
      business:"AASTANDA",
      channel:environment.CONNECTION_SOURCE === 'APP' ? 'App' : 'Web'
    }
    console.log('experianReq', experianReq);
    return experianReq;
  }

  handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    this.setExpanded();
  }
}
 
  callApi(experianReq){
    this.aaFlow.sceFormData.customerName = [experianReq?.firstName, experianReq?.surName].join(' ') || '';
    this.aaApi.callExperianApi(experianReq).subscribe({
      next:(res:experianApiResponse)=>{
        console.log('experian api response ',res);
 
        if(res.statusCode === '7001'){
          // handle success case ,
          this._bottomSheetRef.dismiss({event:'success', data: res})
        }
        else{
          // handle fail case
          this._bottomSheetRef.dismiss({event:'notfound'})
        }
      },
      error:(err)=>{
        console.log(err)
        this._bottomSheetRef.dismiss({event:'notfound'})
        //  failure case
      }
    });
  }
  continueClicked(){
    try{
      // this.cleverTapClick('CONTINUE')
      this.cleverTapClick(this.aemData?.['continue-btn']['multi-cta-set'][0]['event-prop-value'])
      if(this.selectedValue){
        if(this.selectedValue === 'autofetch'){
          this.fullname.markAsTouched();
          this.fullname.updateValueAndValidity();
        }
        if((this.selectedValue === 'autofetch' && this.fullname.valid)){
          const experianRequest = this.getExperianRequest();
          this.callApi(experianRequest);
        }
        else if(this.selectedValue === "manually")  {
          this._bottomSheetRef.dismiss();
        }  
      }else{
        this.ctaErrormssg = 'b2b_sce.b2b_experian_popup.selectOptionErrMsg';
      }
  }
    catch(e){
      console.log(e)
    }
  }
 
  async getAemData() {
    try {
      const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.EXPERIAN);
      console.log('language-based aem url', aemUrl);
      const cacheResponse = await this.aaApi.aemCache(aemUrl);
      console.log('actual json', cacheResponse)
      const fjson = this.aaFlow.formatResponseData(cacheResponse);
      this.aemData = fjson['content']['experian'];
      // const fjson = this.aaFlow.formatResponseData(this.aem);
      // this.aemData = fjson?.['content']?.['experian'];
      console.log('screenContent',this.aemData);
      this.toggle_label = this.aemData?.['select-an-option-wrapper']['fields'][4]['ctalabel1'];
    }
    catch (e) {
      console.log(e)
    }
  }
 
  private cleverTapClick(ep_cta:string){
    try{
      this.aaFlow.cleverTapInsert({eventName:'STANDALONE_ELIGIBILITY_CLICKED',props:{EP_FULL_NAME:this.fullname.value,EP_PAGE_NAME:'CONSENT PAGE',EP_CTA:ep_cta}})
    }
    catch(e){
      console.log(e)
    }
  }
 
  eraseField(formcontrol:string,event:any){
    try{
      this.fullname.setValue('')
      const elem = event.target?.previousElementSibling as HTMLElement
        if(elem && elem?.tagName === 'INPUT'){
          clearTimeout(this.focusTimeout)
          this.focusTimeout = setTimeout(()=>{
            const x = this.elementRef.nativeElement.querySelector(`#${elem.id}`)
            x.focus()
          },0)
        }
    }
    catch(e){
      console.log(e)
    }
  }
}

