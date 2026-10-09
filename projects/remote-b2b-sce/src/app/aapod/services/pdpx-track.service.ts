import { Injectable } from '@angular/core';
import { PdpxFlowService } from './pdpx-flow.service'
import { LoanDetails, PDPTemplate, PLPTemplate } from '../model/render.model';
import { VARIANTS } from '../config/calculator.config';
import { TEMPLATES } from '../model/helper.model';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdpxTrackService {
  PDPX_CT_ENABLED: boolean = true
  cc_props: any = {}
  las_props: any = {}
  pl_props: any = {}
  LOAN_VARIANT_MAPP = {
    [VARIANTS.HYBRID_FLEXI]: 'FLEXI HYBRID',
    [VARIANTS.FLEXI]: 'FLEXI TERM LOAN',
    [VARIANTS.TERM]: 'TERM LOAN',
  }

  constructor(
    private flow: PdpxFlowService,

  ) { }


  appViewed__CT(page: TEMPLATES = TEMPLATES.PDP, render: any, loan: LoanDetails = {}, data: any = {}, __props: any = {}) {
    setTimeout(() => {
      console.log("pdpx/cttrack/appViewed__CT");

      try {
        let event_name ="";
        let props: any = {}

        const ct = this.flow.CONFIG?.cleverTap

        if (!ct?.enabled) {
          return
        }


        if (page === TEMPLATES.PDP) {
          render = render as PDPTemplate
          event_name = ct.PROPS.EVENT_NAME__PDP_VIEWED
          props = this.getCommonProps__CT(page, render, loan, data)
        }

        if (page === TEMPLATES.PLP) {
          render = render as PLPTemplate
          event_name = ct.PROPS.EVENT_NAME__PLP_VIEWED
          props = this.getCommonProps__CT(page, render, loan, data)
        }

        if (__props) {
          props = { ...props, ...__props }
        }

        this.triggerCT(event_name, props, "appViewed__CT")
      }

      catch (e) {
        console.log("pdpx/track/appViewed__CT/ex", e)
      }
    }, 0);
  }

  appClicked__CT(section: string, section_cta: string, props: any = {},
    page: TEMPLATES = TEMPLATES.PDP, render: any, loan: LoanDetails = {}, data: any = {}
  ) {

    setTimeout(() => {
      try {

        console.log("pdpx/cttrack/appClicked__CT", section, section_cta);
        if (!props) {
          props = {}
        }
        else {
          props = { ...props }
        }


        let event_name = "";

        const ct = this.flow.CONFIG?.cleverTap
        const is_offered = this.flow.isOffered()
        const offer = this.flow.cust.offer || {}
        const cart = this.flow.cust.cartItem

        if (!ct?.enabled) {
          return
        }


        if (props.__section_mapp) {
          section = ct.MAPP[section].SECTION_NAME
          delete props.__section_mapp
        }

        if (page === TEMPLATES.PDP) {
          render = render as PDPTemplate
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'LOAN') {
            event_name = ct.PROPS.EVENT_NAME__PDP_CLICKED
            props = {
              ...props,
              "EP_PAGE_NAME": props['EP_PAGE_NAME'] ? props['EP_PAGE_NAME'] : ct.PROPS.EVENT_PROP__PLP_PAGE_NAME,
              "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,
              "EP_SECTION": section,
              "EP_SECTION_CTA": section_cta,


              "EP_SOURCE": "Home Page",
              "EP_CUSTOMER_TYPE": this.flow.cust.custFlag,
              "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",

              // constant 
              "EP_PWA_VERSION": environment.PWA_APP_VERSION,
              "EP_APP_VERSION": this.flow.parentStorage.appVersion,
              "EP_OFFER_AMOUNT": is_offered ? offer.__amount : "",

              "EP_USER_TYPE": this.flow.cust.custFlag,
              "EP_WISHLIST": "",
              "EP_SCROLLED": "",
              "EP_BANNER_SEQUENCE": "",
              "EP_NUDGE": "",
              "EP_REWARDS_MAPPING": "",
              "EP_DEVICE_NAME": "",
              "EP_ICORS_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",
              "EP_BUSINESS_TYPE": "",
              "EP_EXISTING_LOAN": "",
              "EP_SECTION_SEQUENCE": "",
              "EP_ICON_SEQUENCE": "",
              "EP_USER_OFFER": "",
              "EP_CART_AMOUNT": cart ? cart.amt : "",
              "EP_CART_EMI": cart ? cart.__render?.render__subtitle_value : "",
              "EP_CART_TENURE": cart ? cart.tenure : "",
              "EP_CART_PRODUCT": cart ? cart.__render?.render__title : "",
              "EP_APPLIED_AMOUNT": "",
              "EP_ACTIVITY_TIMELOG": ""
            }
            if (this.flow.CONFIG.id === 'HL') {
              props["EP_ACTIVITY_TIMELOG"] = data?.toString() ? data?.toString() : ""
            }

            if ((this.flow.CONFIG.id === "LAS" || this.flow.CONFIG.id === "HTS_LAMF") && section_cta === "SHARE" || section_cta === "APPLY") {
              props["EP_CTA"] = section_cta;
            }
            if (this.flow.CONFIG.id === "GL") {
              Object.keys(props).forEach(([Key]) => {
                delete props[Key]
                props = {
                  "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,

                  "EP_SECTION": section,
                  "EP_SECTION_CTA": section_cta,


                  "EP_SOURCE": "Home Page",
                  "EP_CUSTOMER_TYPE": this.flow.cust.custFlag,
                  "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",

                  // constant 
                  "EP_PWA_VERSION": environment.PWA_APP_VERSION,
                  "EP_APP_VERSION": this.flow.parentStorage.appVersion,
                  "EP_OFFER_AMOUNT": is_offered ? offer.__amount : "",

                  "EP_USER_TYPE": this.flow.cust.custFlag,
                  "EP_WISHLIST": "",
                  "EP_SCROLLED": "",
                  "EP_BANNER_SEQUENCE": "",
                  "EP_NUDGE": "",
                  "EP_REWARDS_MAPPING": "",
                  "EP_DEVICE_NAME": "",
                  "EP_ICORS_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",
                  "EP_BUSINESS_TYPE": "",
                  "EP_EXISTING_LOAN": "",
                  "EP_SECTION_SEQUENCE": "",
                  "EP_ICON_SEQUENCE": "",
                  "EP_USER_OFFER": "",
                  "EP_APPLIED_AMOUNT": "",
                  "EP_ACTIVITY_TIMELOG": "",
                  "EP_LOAN_AMOUNT": render.gold_loan_details.loan_amount.loan_amount,
                  "EP_GOLD_WEIGHT": render.gold_loan_details.gold_weight.gold_weight,
                  "EP_ENTER_GOLD_WEIGHT": render.gold_loan_details.gold_mode ? "YES" : "NO",
                  "EP_ENTER_LOAN_AMOUNT": render.gold_loan_details.loan_mode ? "YES" : "NO",
                  "EP_ERROR_MESSAGE": render.gold_loan_details.valid ? render.gold_loan_details.error_text : "",
                  "EP_LIVE_RATE":render.gold_loan_details.gold_loan_rate



                }
              })
              // this.triggerCT(event_name, props, "info_Clicked__CT")



            }

            if(this.flow.CONFIG.id === 'MFI'){
              delete props["EP_CHARGES"]
              delete props["EP_PROCESSING_FEE"]
            }
          }
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'CARD') {

            event_name = ct.PROPS.EVENT_NAME__PDP_CLICKED
            props = {
              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
              "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,

              "EP_SECTION": section,
              "EP_SECTION_CTA": section_cta,


              "EP_SOURCE": "Home Page",
              // "EP_CUSTOMER_TYPE": this.flow.cust.custFlag,
              // "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",

              // constant 
              "EP_PWA_VERSION": environment.PWA_APP_VERSION,
              "EP_APP_VERSION": this.flow.parentStorage.appVersion,
              // "EP_OFFER_AMOUNT": is_offered ? offer.__amount : "",

              "EP_USER_TYPE": this.flow.cust.custFlag,
              "EP_WISHLIST": "",
              "EP_SCROLLED": "",
              "EP_BANNER_SEQUENCE": "",
              "EP_NUDGE": "",
              "EP_REWARDS_MAPPING": "",
              "EP_DEVICE_NAME": "",
              "EP_ICORS_OFFER_TYPE": this.flow.cust.isOffer ? "PRE-APPROVED OFFER" : "NO OFFER",
              "EP_BUSINESS_TYPE": "",
              "EP_EXISTING_LOAN": "",
              "EP_SECTION_SEQUENCE": "",
              "EP_ICON_SEQUENCE": "",
              "EP_USER_OFFER": "",
              "EP_CART_AMOUNT": cart ? cart.amt : "",
              "EP_CART_EMI": cart ? cart.__render?.render__subtitle_value : "",
              "EP_CART_TENURE": cart ? cart.tenure : "",
              "EP_CART_PRODUCT": cart ? cart.__render?.render__title : "",
              "EP_APPLIED_AMOUNT": "",
              "EP_ACTIVITY_TIMELOG": "",
              "EP_CTA": section_cta,
              // "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,
              // "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
            }

          }
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'DEPOSIT') {
            event_name = ct.PROPS.EVENT_NAME__PDP_CLICKED
            props = {
              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
              "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,

              "EP_SECTION": section,
              "EP_SECTION_CTA": section_cta,


              "EP_SOURCE": "Home Page",
              "EP_CUSTOMER_TYPE": this.flow.cust.custFlag,
              "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",

              // constant 
              "EP_PWA_VERSION": environment.PWA_APP_VERSION,
              "EP_APP_VERSION": this.flow.parentStorage.appVersion,
              "EP_OFFER_AMOUNT": is_offered ? offer.__amount : "",

              "EP_USER_TYPE": this.flow.cust.custFlag,
              "EP_WISHLIST": "",
              "EP_SCROLLED": "",
              "EP_BANNER_SEQUENCE": "",
              "EP_NUDGE": "",
              "EP_REWARDS_MAPPING": "",
              "EP_DEVICE_NAME": "",
              "EP_ICORS_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",
              "EP_BUSINESS_TYPE": "",
              "EP_EXISTING_LOAN": "",
              "EP_SECTION_SEQUENCE": "",
              "EP_ICON_SEQUENCE": "",
              "EP_USER_OFFER": "",
              "EP_CART_AMOUNT": cart ? cart.amt : "",
              "EP_CART_EMI": cart ? cart.__render?.render__subtitle_value : "",
              "EP_CART_TENURE": cart ? cart.tenure : "",
              "EP_CART_PRODUCT": cart ? cart.__render?.render__title : "",
              "EP_APPLIED_AMOUNT": "",
              "EP_ACTIVITY_TIMELOG": ""
            }
            if (this.flow.CONFIG.id === 'HL') {
              props["EP_ACTIVITY_TIMELOG"] = data?.toString() ? data?.toString() : ""
            }

          }

          const common_props = this.getCommonProps__CT(page, render, loan, data)
          props = { ...props, ...common_props }
        }

        if (page === TEMPLATES.PLP) {
          render = render as PLPTemplate
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'LOAN') {

            event_name = ct.PROPS.EVENT_NAME__PLP_CLICKED

            let common: any = {}
            common = {
              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PLP_PAGE_NAME,
              "EP_SECTION": section,
              "EP_CTA": section_cta,

              "EP_TAB": render.tabs?.tabs?.[render.tabs?.activeIndex],
              "EP_SOURCE": "NOTIFICATION",
              "EP_PWA_VERSION": environment.PWA_APP_VERSION,
              "EP_CT_ID": "",
              "EP_GA_ID": "",
              "EP_STACK_SEQUENCE": "",
              "EP_ITEM_SEQUENCE": "",
              "EP_PRODUCT_NAME": ct?.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : ct.PROPS.EVENT_PROP__PRODUCT_NAME
            }
            props = { ...common, ...props }

          }
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'CARD') {
            event_name = ct.PROPS.EVENT_NAME__PLP_CLICKED
          // if (Object.keys(this.cc_props).length) {
          //   return this.cc_props
          // }

          const additional_props = {
            "EP_CATEGORY": props?.["EP_CATEGORY"] ? props["EP_CATEGORY"]:"",
            "EP_CARD_NAME": props?.["EP_CARD_NAME"] ? props["EP_CARD_NAME"] : "",
            "EP_APPROX_SAVINGS": props?.["EP_APPROX_SAVINGS"] ? props["EP_APPROX_SAVINGS"] : "",
            "EP_CC_FEATURE": props?.["EP_CC_FEATURE"] ? props["EP_CC_FEATURE"] : "",
            "EP_BANK_NAME": props?.["EP_BANK_NAME"] ? props["EP_BANK_NAME"] : "",
          }

          const common_props = {
            // "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,
            // "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
            // "EP_CARD_CODE": this.flow?.CONFIG?.PRODUCT?.subProduct,
            // "EP_CARD_NAME": this.flow?.cust?.current_sku?.productDetails?.label,
            // "EP_CARD_CATEGORY": this.flow?.cust?.current_sku?.ccBenefit,
            // "EP_SOURCE": "",
            // "EP_OFFER_TYPE": this.flow.cust.isOffer ? "offer" : "No offer",
            // "EP_OFFER_AMOUNT": this.flow.cust.isOffer ? render.cardSummary.amount : "",
            // "EP_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
            // "EP_CC_CARDED": this.flow?.cust?.module_relations?.length ? "YES" : "NO",
            // "EP_PAGE_LOAD_TIME": data?.duration?.toString(),
            // "EP_CARD_FEATURES": render?.textRatings?.subtitle,
            // "EP_LIMIT": this.flow.cust.isOffer ? render.cardSummary.amount : "200000",
            // "EP_PDP_TYPE": data?.mode,
            // "EP_OFFER_STRIP": render.offerBanner.view ? render.offerBanner.text : ""

            "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PLP_PAGE_NAME,
            // "EP_CARD_CODE": this.flow?.CONFIG?.PRODUCT?.subProduct,
            // "EP_CARD_NAME": this.flow?.cust?.current_sku?.productDetails?.label,
            // "EP_CARD_CATEGORY": this.flow?.cust?.current_sku?.ccBenefit,
            "EP_SOURCE": "Home Page",
            "EP_CC_OFFER": this.flow.cust.isOffer ? "offer" : "No offer",
            "EP_CC_BANK_OFFER":this.flow.cust.isOffer ? this.flow.cust?.offer?.displayName : "",
            // "EP_OFFER_AMOUNT": this.flow.cust.isOffer ? render.cardSummary.amount : "",

            "EP_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
            "EP_CC_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
            "EP_CC_CARDED": this.flow?.cust?.module_relations?.length ? "YES" : "NO",
            "EP_PAGE_LOAD_TIME": data?.duration?.toString(),
            "EP_PWA_VERSION": environment.PWA_APP_VERSION,
            "EP_TAB":render.tabs?.tabs?.[render.tabs?.activeIndex],
            "EP_LOAD_TIME": data?.duration?.toString(),
            "EP_SECTION": section,
            "EP_CTA": props?.["EP_CTA"] ? props["EP_CTA"] : section_cta,

          }
          // this.cc_props = props
          props = {...props, ...additional_props, ...common_props}

        }


        }
        // console.log(props, "pdpx/clciked/props");



        this.triggerCT(event_name, props, "appClicked__CT")
      }
      catch (e) {
        console.log("pdpx/track/appViewed__CT/ex", e)
      }
    }, 0);





  }

  info_Clicked__CT(section: string, section_cta: string, render: any, loan: LoanDetails = {}, page: TEMPLATES = TEMPLATES.PDP) {

    setTimeout(() => {
      try {
        console.log("pdpx/cttrack service/info_clicked_ct", section, section_cta);
        // let event_name: string = "";
        let event_name = "";
        let props: any = {}

        const ct = this.flow.CONFIG?.cleverTap
        const is_offered = this.flow.isOffered()
        const offer = this.flow.cust.offer || {}

        //!ct || !ct?.enabled
        if (!ct?.enabled) {
          return
        }


        if (page === TEMPLATES.PDP) {
          render = render as PDPTemplate
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'LOAN') {

            event_name = ct.PROPS.EVENT_NAME__INFO_BUTTON_CLICKED
            props = {
              "EP_ARTICLE_NAME": section,
              "EP_CTA": section_cta,

              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,

              "EP_PRODUCT_NAME": ct?.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : ct.PROPS.EVENT_PROP__PRODUCT_NAME,
              "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,

            }
            if (this.flow.CONFIG.id === 'GL') {
              Object.keys(props).forEach(([key]) => {
                delete props[key]
              })
              props = {
                "EP_PAGE_NAME": section,
                "EP_CTA": section_cta,
                "EP_LOAN_VARIANT": this.flow.CONFIG.PRODUCT.product === "GL_FRESH" ? "FRESH" : "BALANCE TRANSFER"

              }
              // this.triggerCT(event_name, props, "info_Clicked__CT")


            }


          }
          if (this.flow.CONFIG?.PRODUCT_TYPE === 'CARD') {

            event_name = ct.PROPS.EVENT_NAME__PDP_CLICKED
            props = {
              // "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
              // "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,

              "EP_SECTION": section,
              "EP_SECTION_CTA": section_cta,


              "EP_SOURCE": "Home Page",
              // "EP_CUSTOMER_TYPE": this.flow.cust.custFlag,
              // "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",

              // constant 
              "EP_PWA_VERSION": environment.PWA_APP_VERSION,
              "EP_APP_VERSION": this.flow.parentStorage.appVersion,
              // "EP_OFFER_AMOUNT": is_offered ? offer.__amount : "",

              "EP_USER_TYPE": this.flow.cust.custFlag,
              "EP_WISHLIST": "",
              "EP_SCROLLED": "",
              "EP_BANNER_SEQUENCE": "",
              "EP_NUDGE": "",
              "EP_REWARDS_MAPPING": "",
              "EP_DEVICE_NAME": "",
              "EP_ICORS_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",
              "EP_BUSINESS_TYPE": "",
              "EP_EXISTING_LOAN": "",
              "EP_SECTION_SEQUENCE": "",
              "EP_ICON_SEQUENCE": "",
              "EP_USER_OFFER": "",
              "EP_APPLIED_AMOUNT": "",
              "EP_ACTIVITY_TIMELOG": "",
              "EP_CTA": section_cta,
              "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,
              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
              "EP_CARD_CODE": this.flow.CONFIG.PRODUCT.subProduct,
              "EP_CARD_NAME": this.flow?.cust?.current_sku?.productDetails?.label,
              "EP_CARD_CATEGORY": this.flow?.cust?.current_sku?.ccBenefit,
              // "EP_SOURCE": "",
              "EP_OFFER_TYPE": this.flow.cust?.offer?.segment ? "offered" : "No offer",
              "EP_OFFER_AMOUNT": this.flow?.cust?.offer?.segment ? offer.__amount : "",
              "EP_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
              "EP_CC_CARDED": this.flow?.cust?.module_relations?.length ? "YES" : "NO",
              // "EP_PAGE_LOAD_TIME": data?.duration?.toString(),
              "EP_CARD_FEATURES": render?.textRatings?.subtitle,
              "EP_LIMIT": this.flow?.cust?.offer?.segment ? offer.__amount : "",


            }

          }

          if (this.flow.CONFIG?.PRODUCT_TYPE === 'DEPOSIT') {

            event_name = ct.PROPS.EVENT_NAME__INFO_BUTTON_CLICKED
            props = {
              "EP_ARTICLE_NAME": section,
              "EP_CTA": section_cta,

              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,

              "EP_PRODUCT_NAME": ct?.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : ct.PROPS.EVENT_PROP__PRODUCT_NAME,
              "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,

            }


          }

          const common_props = this.getCommonProps__CT(page, render, loan, {})
          props = { ...props, ...common_props }
        }


        this.triggerCT(event_name, props, "info_Clicked__CT")
      }

      catch (e) {
        console.log("pdpx/track/appViewed__CT/ex", e)
      }
    }, 0);



  }




  getCommonProps__CT(page: TEMPLATES = TEMPLATES.PDP, render: any, loan: LoanDetails = {}, data: any = {}) {
    let props: any = {}
    try {

      const ct = this.flow.CONFIG?.cleverTap
      const is_offered = this.flow.isOffered()
      const offer = this.flow.cust.offer || {}
      const cart = this.flow.cust.cartItem
      if ((this.flow.CONFIG.id === "LAS" || this.flow.CONFIG.id === "HTS_LAMF") && cart) {
        this.las_props = cart;
      } else if ((this.flow.CONFIG.id === "LAS" || this.flow.CONFIG.id === "HTS_LAMF") && !cart) {
        this.las_props = {
          "__render": {
            "render__title": "CART - EMPTY"
          }
        }
      }
      //!ct || !ct?.enabled
      if (!ct?.enabled) {
        return props
      }


      if (page === TEMPLATES.PDP) {
        render = render as PDPTemplate
        if (this.flow.CONFIG?.PRODUCT_TYPE === 'LOAN') {

          if (Object.keys(this.pl_props)?.length && this.flow.CONFIG.id === 'PL') {
            this.pl_props["EP_ERROR_MESSAGE"]=loan.inValid ? "PLEASE ENTER A VALID LOAN AMOUNT" : ""
            return this.pl_props
          }

          props = {
            // config 
            "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
            "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,

            //flow 
            "EP_SOURCE": "Home Page",
            "EP_CUSTOMER_TYPE": this.flow.cust.custFlag || "NTB",
            "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",

            // constant 
            "EP_PWA_VERSION": environment.PWA_APP_VERSION,
            "EP_APP_VERSION": this.flow.parentStorage.appVersion,

            // loan 
            "EP_OFFER_AMOUNT": is_offered ? offer.__amount : "",
            "EP_ENTER_LOAN_AMOUNT": loan.amount,
            "EP_LOAN_RANGE": loan.limits?.label,
            "EP_LOAN_VARIENT": this.LOAN_VARIANT_MAPP[loan.variant?.id as VARIANTS] || "",
            "EP_SELECTED_LOAN_TENURE": loan.total_tenor?.toString(),
            "EP_INITIAL_LOAN_TENURE": loan.initial_tenor?.toString(),
            "EP_EMI": loan.total_emi?.toString(),
            "EP_TOTAL_LOAN_AMOUNT": loan.totalLoanAmount?.toString(),
            "EP_INTEREST": loan.interest?.toString(),
            "EP_INITIAL_EMI": loan.initial_emi?.toString(),
            "EP_SUBSEQUENT_EMI": loan.subsequent_emi?.toString(),


            "EP_PROCESSING_FEE": loan.chargesMapp?.['processing_fee']?.toString(),
            "EP_DOC_CHARGES": loan.chargesMapp?.['documentation_charges']?.toString(),
            "EP_FLEXI_FEE": loan.chargesMapp?.['flexi_fees']?.toString(),
            "EP_CROSSSELL_1": loan.chargesMapp?.['addons_1']?.toString() || "",
            "EP_CROSSELL_2": loan.chargesMapp?.['addons_2']?.toString() || "",
            "EP_STAMP_DUTY": loan.chargesMapp?.['stamp_duty']?.toString(),
            "EP_BPI": loan.chargesMapp?.['bpi']?.toString(),
            "EP_CHARGES": loan.total_deductions,

            "EP_PRINCIPLE": loan.totalLoanAmount?.toString(),
            "EP_AMOUNT_CREDIT": loan.netDisbAmt?.toString(),
            "EP_APPROVED_LOAN_AMOUNT": is_offered ? offer.__amount : "",

            // page 
            "EP_LOAD_TIME": data?.duration?.toString(),
            "EP_PAGE_LOAD_TIME": data?.duration?.toString(),

            // unknown
            "EP_WISHLIST": "",
            "EP_CART_AMOUNT": cart ? cart.amt : "",
            "EP_CART_EMI": cart ? cart.__render?.render__subtitle_value : "",
            "EP_CART_TENURE": cart ? cart.tenure : "",
            "EP_CART_PRODUCT": cart ? cart.__render?.render__title : "",
            "EP_YOUR_LOAN_WITH_US": this.flow.cust.module_relations?.length ? "YES" : "NO",
            "EP_PRODUCT_NAME": ct?.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : ct.PROPS.EVENT_PROP__PRODUCT_NAME,
            "EP_ERROR_MESSAGE": loan.inValid ? "PLEASE ENTER A VALID LOAN AMOUNT" : ""


          }
          if (this.flow.CONFIG.id === 'BLSE') {
            props['EP_BUSINESS'] = "BLSE LANDING PAGE"
            props['EP_CROSSELL_3'] = loan.chargesMapp?.['addons_3']?.toString() || ""
          }
          if (this.flow.CONFIG.id === 'PL') {
            const mod_spec_prop = {
              "EP_ICORS_OFFER_TYPE": offer.displayName || "NO OFFER",
              "EP_CUSTOMER_TYPE": this.flow.cust.custFlag,
              "EP_BUSINESS": offer.offerProduct || "SPL",
              // "EP_SECTION_LOAN_AMOUNT":loan.totalLoanAmount.toString(),
              "EP_OFFER_TYPE": is_offered ? offer.displayName : "NO OFFER",
              "EP_SECTION_EMI_AMOUNT": cart ? cart.__render?.render__subtitle_value : "",
              "EP_SECTION_TENURE": cart ? cart.tenure : "",
              "EP_PROCESSING_FEE": loan.chargesMapp['processing_fee'] || "",

              "EP_CART_PRODUCT": cart ? cart.__render?.render__title : "",
              "EP_SEGMENT": "EXCLUSIVE REWARDS"


            }

            delete props['EP_CHARGES'];
            if (loan.variant?.id !== VARIANTS.HYBRID_FLEXI) {
              delete props['EP_SUBSEQUENT_EMI']
              delete props['EP_INITIAL_EMI']
              delete props['EP_INITIAL_LOAN_TENURE']
            }

            if (props['EP_SECTION'] === "YOU HAVE AN ONGOING APPLICATION") {
              // props['EP_PAGE_NAME'] == "RESUME POP UP"
              props['EP_PAGE_NAME'] = "RESUME POP UP"
            }


            props = { ...props, ...mod_spec_prop }

            // sub emi, initial emi > tenors 

          }
          if (this.flow.CONFIG.id === "LAS" || this.flow.CONFIG.id === "HTS_LAMF") {
            delete props['EP_APPROVED_LOAN_AMOUNT'];
            delete props['EP_CROSSSELL_1'];
            delete props['EP_CROSSELL_2'];
            props['EP_LOAN_VARIANT'] = "PURE FLEXI LOAN";
            props['EP_CART_PRODUCT'] = Object.keys(this.las_props).length ? this.las_props?.__render?.render__title : "CART - EMPTY";
            props['EP_REWARD_SHOWN'] = this.flow.__reward_shown ? "YES" : "NO";
            props["EP_ACTIVITY_TIMELOG"] = data.duration ? data.duration : ""
            delete props['EP_LOAD_TIME'];
            delete props['EP_LOAN_VARIENT'];
          }
          if (this.flow.CONFIG.id === 'GL') {
            Object.keys(props).forEach(([key]) => {
              delete props[key]

            })
            props = {
              "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
              "EP_OFFER_TYPE": is_offered ? "PRE-APPROVED OFFER" : "NO OFFER",
              "EP_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
              "EP_PWA_VERSION": environment.PWA_APP_VERSION,
              "EP_OFFER_AMOUNT": render.gold_loan_details.loan_amount.loan_amount,
              "EP_LOAN_VARIANT": this.flow.CONFIG.PRODUCT.product === 'GL_FRESH' ? "FRESH" : "BALANCE TRANSFER",
              "EP_LIVE_RATE":render.gold_loan_details.gold_loan_rate

            }


          } 
          if (this.flow.CONFIG.id === 'PL') {
            this.pl_props = props

          }
          if(this.flow.CONFIG.id === 'MEF'){
            props['EP_PAGE_NAME'] = this.flow.CONFIG.PRODUCT.journeyType ? this.flow.CONFIG.cleverTap.journeyTypes[this.flow.CONFIG.PRODUCT.journeyType] : "MEF PDP"
          }


        }
        if (this.flow.CONFIG?.PRODUCT_TYPE === 'CARD') {
          // if (Object.keys(this.cc_props).length) {
          //   return this.cc_props
          // }

          props = {
            "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,
            "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PDP_PAGE_NAME,
            "EP_CARD_CODE": this.flow?.CONFIG?.PRODUCT?.subProduct,
            "EP_CARD_NAME": this.flow?.cust?.current_sku?.productDetails?.label,
            "EP_CARD_CATEGORY": this.flow?.cust?.current_sku?.ccBenefit,
            "EP_SOURCE": "",
            "EP_OFFER_TYPE": this.flow.cust.isOffer ? "offer" : "No offer",
            "EP_OFFER_AMOUNT": this.flow.cust.isOffer ? render.cardSummary.amount : "",
            "EP_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
            "EP_CC_CARDED": this.flow?.cust?.module_relations?.length ? "YES" : "NO",
            "EP_PAGE_LOAD_TIME": data?.duration?.toString(),
            "EP_CARD_FEATURES": render?.textRatings?.subtitle,
            "EP_LIMIT": this.flow.cust.isOffer ? render.cardSummary.amount : "200000",
            "EP_PDP_TYPE": data?.mode,
            "EP_OFFER_STRIP": render.offerBanner.view ? render.offerBanner.text : ""

          }
          this.cc_props = props

        }
        // if (this.flow.CONFIG.id == "PLCARD" ) {  }
        if (this.flow.CONFIG.id === "PLCARD_ACQ" ) {
          delete props['EP_ICORS_OFFER_TYPE'];
          props['EP_ICORS_OFFER_TYPE'] = "plCard";
          props['EP_BUSINESS']="PL EMI CARD";
          props['EP_BANNER_DESCRIPTION']='GET THIS PERSONAL LOAN EMI CARD WITH LOAN LIMIT UP TO 10 LAKHS',
          props['EP_OFFER_TYPE']='PL EMI CARD AQUISITION PDP',
          props['EP_BANNER_MODULE_NAME']='PL PDP'
        }
      }

      if (page === TEMPLATES.PLP) {
        render = render as PLPTemplate
        if (this.flow.CONFIG?.PRODUCT_TYPE === 'LOAN') {

          props = {
            "EP_SOURCE": "Home Page",
            "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PLP_PAGE_NAME,
            "EP_PWA_VERSION": environment.PWA_APP_VERSION,
            "EP_PAGE_LOAD_TIME": data?.duration?.toString(),
            "EP_EXISTING_RELATION": this.flow.cust.module_relations?.length ? "YES" : "NO",
            "EP_TAB": render.tabs?.tabs?.[render.tabs?.activeIndex]
          }

        }
        if (this.flow.CONFIG?.PRODUCT_TYPE === 'CARD') {
          // if (Object.keys(this.cc_props).length) {
          //   return this.cc_props
          // }

          props = {
            // "EP_JOURNEY_NAME": ct.journeys?.[this.flow.cust.journeyName] ? ct.journeys[this.flow.cust.journeyName] : this.flow.cust.journeyName,
            "EP_PAGE_NAME": ct.PROPS.EVENT_PROP__PLP_PAGE_NAME,
            // "EP_CARD_CODE": this.flow?.CONFIG?.PRODUCT?.subProduct,
            // "EP_CARD_NAME": this.flow?.cust?.current_sku?.productDetails?.label,
            // "EP_CARD_CATEGORY": this.flow?.cust?.current_sku?.ccBenefit,
            "EP_SOURCE": "Home Page",
            "EP_CC_OFFER": this.flow.cust.isOffer ? "offer" : "No offer",
            "EP_CC_BANK_OFFER":this.flow.cust.isOffer ? this.flow.cust?.offer?.displayName : "",
            // "EP_OFFER_AMOUNT": this.flow.cust.isOffer ? render.cardSummary.amount : "",

            "EP_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
            "EP_CC_CUSTOMER_TYPE": this.flow?.cust?.custFlag || "NTB",
            "EP_CC_CARDED": this.flow?.cust?.module_relations?.length ? "YES" : "NO",
            "EP_PAGE_LOAD_TIME": data?.duration?.toString(),
            "EP_PWA_VERSION": environment.PWA_APP_VERSION,
            "EP_TAB":render.tabs?.tabs?.[render.tabs?.activeIndex],
            "EP_LOAD_TIME": data?.duration?.toString(),
            // "EP_CARD_FEATURES": render?.textRatings?.subtitle,
            // "EP_LIMIT": this.flow.cust.isOffer ? render.cardSummary.amount : "200000",
            // "EP_PDP_TYPE": data?.mode,
            // "EP_OFFER_STRIP": render.offerBanner.view ? render.offerBanner.text : ""

          }
          this.cc_props = props

        }

      }

      return props
    }

    catch (e) {
      console.log("pdpx/track/appViewed__CT/ex", e)
      return props
    }
  }


  triggerCT(eventName: string, props: any, tag: string = "") {


    if (props && this.flow.ENV === 'APP') {
      // const epSource = { "action": "read", "type": "string", "key": "EP_SOURCE_PARENT", "value": "" };
      // var ep_source = prompt('SharedPref://' + JSON.stringify(epSource));
      // props['EP_SOURCE'] = ep_source === 'cart' ? "" : ep_source;
    }
    const data: EVENT__CT = {
      "eventName": eventName,
      "props": props
    }
    console.log("pdpx/cttrack/trigger", tag, data)
    if (environment.CONNECTION_SOURCE === 'APP' && this.PDPX_CT_ENABLED) {
      prompt("triggerCTEvent://" + JSON.stringify(data));
    }
    else {
      // disabled for now
    }
  }
}


export type EVENT__CT = {
  eventName: string;
  props: any;
}
