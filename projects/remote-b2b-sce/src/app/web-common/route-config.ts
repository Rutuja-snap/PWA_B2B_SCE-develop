// enum SALPL_ROUTE_URL {
//   PDP = 'pdp',
//   PERSONALLOAN = 'personal-loan',
//   PERSONALDETAIL = 'personaldetail',
//   SELFEMPLOYEETHANKYOU = 'selfempthankyou',
//   LOANAPPLICATION = 'loanapplication',
//   KYCDETAIL = 'kycdetail',
//   VERIFYINCOME = 'verifyincome',
//   BANKCUSTDETAIL = 'bankcustdetail',
//   BANKDETAIL = 'bankdetail',
//   KYCMETHOD = 'kycmethod',
//   UPLOAD = 'upload',
//   SUBMITTED = 'submitted',
//   RESUME = 'resume',
//   BOOK = 'book',
//   VERIFYEMAIL = 'verifyemail',
//   TERMSANDCONDITION = 'terms-condition',
//   FAQ = 'faq',
//   STFAQ = 'stfaq',
//   CANCELCHEQUE = 'cancel-cheque',
//   CONGRATS2 = 'congrats2',
//   RESUMEDETAILS = 'resume-details',
//   RESUMEMANDATE = 'resume-mandate',
//   PRECONGRATS = 'pre-congrats',
//   GININSURANCE = 'gin-insurance',
//   CONGRATS1 = 'congrats1',
//   TRACKER = 'tracker',
//   SALPLCART = 'salplcart',
//   RSLREQ = 'rsl-req',
//   RSLTHANKS = 'rsl-thank-you',
//   UNDERPROCESS = 'under-process',
//   LOANSUMMARY = 'loansummary',
//   LOADER = 'loader',
//   ERROR = 'error'
// }
// enum EMI_ROUTE_URL {
//   PDP = 'login',
//   APLF = 'application-form',
//   UVC = 'approved',
//   UPDATEADDRESS = 'kyc-update',
//   PAYNOW = 'pay-now',
//   INPROGRESS = 'payment-success',
//   ISSUED = 'activate-now',
//   ACTIVATED = 'thank-you',
//   TNC = 'tnc',
//   FAQ = 'faq',
//   KYCPOD = 'uai',
//   PROD_INFO = 'prod-info',
//   ERROR_INTERNAL = 'emierror/internalpolicy',
//   ERROR_TECHNICAL = 'emierror/technical',
//   ERROR_KYC = 'emierror/kyc',
//   ERROR_KYCRETRY = 'emierror/kycretry',
//   ERROR_MANDATE = 'emierror/mandate',
//   ERROR_PAYMENT = 'emierror/payment',
//   ERROR_RETRY = 'retry',
//   HEALTH_PARTNER_STORE = 'partner-stores',
//   HEALTH_TREATMENTS = 'available-treatments',
//   PNF = 'pnf',
//   ADDONPAYSUCCESS = 'pay-success',
//   ADDONERROR = 'emierror'
// }
// enum FD_ROUTE_URL {
//   ADDITIONALDETAILS = 'sp-additional-details',
//  SPADDNOMINEE ='sp-addnominee',
// BANKDETAI ='minor-bankdetails',
// MINORADDNOMINEE ='minor-addnominee',
// MINORADDITIONALDETAIL ='minor-additional-details',
// HUFPAYMENT ='huf-payment',
// HUFADDITIONALDETAIL ='huf-additionaldetails',
// }
const SALPL_ROUTE = 'salpl';
const EMI_ROUTE = 'emicard';
const HEALTH_ROUTE = 'health';
// const SP_ROUTE='';

export const envConfig = {
    // SALPL_ROUTE_URL : SALPL_ROUTE_URL,
    // EMI_ROUTE_URL: EMI_ROUTE_URL,

    enableGA:false,
    // CONFIG 
    HOST_URL: "",
    // HOST_URL: "http://localhost:4200/",
    writeLogtoDB: false,
  
    SALPL_ROUTE: SALPL_ROUTE,
    SALPL_BASE_URL:"/" + SALPL_ROUTE + "/",
    EMI_ROUTE: EMI_ROUTE,
    EMI_BASE_URL:  "/" + EMI_ROUTE + "/",
    HEALTH_ROUTE: HEALTH_ROUTE,
    HEALTH_BASE_URL:  "/" + EMI_ROUTE + "/" + HEALTH_ROUTE + "/",
    // emicard: {
    //   xaop_channel:true,
    //   navigationOptions:{skipLocationChange:true},
    //   enable_single_url: true,
    //   emi_s_url_path : 'login',
    //   health_emi_s_url_path : 'health/login',
    //   appFlyer: true,
    //   aem: true,
    //   cleverTap_web : true,
    //   cleverTabEnabled: ['APP','WEB'],
    //   GAEnabled: ['WEB'],
    //   ROUTES_URLS: EMI_ROUTE_URL,
    //   cleverTap : true,
    //   experian:true,
    //   static_stitch: false,
    //   //please DON'T change this emi_redirection_url
    //   emi_redirection_url_uat :"http://127.0.0.1/webform/",
    //   emi_redirection_url :"http://127.0.0.1/webform/",
    //   authHeaders : {
    //     DEV:{
    //       "emi-application" :"",
    //       "emi-viewcard" : ""
    //     },
    //     UAT:{
    //       "emi-application" :"",
    //       "emi-viewcard" : ""
    //     },
    //     PROD:{
    //       "emi-application" :"",
    //       "emi-viewcard" : ""
    //     }
    //   },
    //   otpText:{
    //     application :{
    //       channelId :"45",
    //       purpose:"EMICARDACQ"
    //     },
    //     viewCard:{
    //       channelId:"46",
    //       purpose:"EMICARDACQ"
    //     }
    //   },
    //   TncURL:{
    //     "emi-pdp":"https://dynbanners.bajajfinserv.in/TnC/POD_BFL_INSTA_EMI",
    //     "emi-aplf":"https://dynbanners.bajajfinserv.in/TnC/POD_BFL_INSTA_EMI_Network",
    //     "hemi-bfl":"https://dynbanners.bajajfinserv.in/TnC/BFL_Health_Card_TnC",
    //     "hemi-bfhl":"https://dynbanners.bajajfinserv.in/BajajHealth/Health_EMI_TnC"
    //   },
    //   WebPDPLinks : {
    //     DEV:{
    //       EMI: sessionStorage.getItem('forms_emiclp_xaop') || "/webform/v1/emicard/login",
    //       HEMI:"/health-emi-network-card"
    //     },
    //     UAT:{
    //       EMI: sessionStorage.getItem('forms_emiclp_xaop') || "/webform/v1/emicard/login",
    //       HEMI:"/health-emi-network-card"
    //     },
    //     PROD:{
    //       EMI: sessionStorage.getItem('forms_emiclp_xaop') || "/webform/v1/emicard/login",
    //       HEMI:"/health-emi-network-card"
    //     }
    //   },
    //   phase2_emi_auth : true,
    //   mobMap: {
    //     91: "NTB",
    //     92: "ETB"
    //   },
    //   ScreenUrls: {
    //     1: ['/',  EMI_ROUTE, EMI_ROUTE_URL.PDP],
    //     2: ['/',  EMI_ROUTE, EMI_ROUTE_URL.TNC],
    //     3: ['/',  EMI_ROUTE, EMI_ROUTE_URL.APLF],
    //     4: ['/',  EMI_ROUTE, EMI_ROUTE_URL.UVC],
    //     5: ['/',  EMI_ROUTE, EMI_ROUTE_URL.UPDATEADDRESS],
    //     6: ['/',  EMI_ROUTE, EMI_ROUTE_URL.PAYNOW],
    //     7: ['/',  EMI_ROUTE, EMI_ROUTE_URL.INPROGRESS],
    //     8: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ISSUED],
    //     9: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ACTIVATED],
    //     10: ['/',  EMI_ROUTE, EMI_ROUTE_URL.FAQ],
    //     11: ['/',  EMI_ROUTE, EMI_ROUTE_URL.KYCPOD],
    //     12: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ERROR_INTERNAL],
    //     13: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ERROR_TECHNICAL],
    //     14: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ERROR_KYC],
    //     15: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ERROR_KYCRETRY],
    //     16: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ERROR_MANDATE],
    //     17: ['/',  EMI_ROUTE, EMI_ROUTE_URL.ERROR_PAYMENT],
    //     18: ['/',  EMI_ROUTE, EMI_ROUTE_URL.PROD_INFO],
  
  
    //   },
    //   NTB: {
    //     flowMap: {
    //       1: 3,
    //       3: 4,
    //       4: 11,
    //       11: 6,
    //       6: 7,
    //       7: 8,
    //       8: 9
    //     }
    //   },
    //   ETB: {
    //     flowMap: {
    //       1: 4,
    //       4: 6,
    //       6: 9
    //     }
    //   }
    // },
    // salpl: {
    //   aem: true,
    //   cleverTap : true,
    //   cleverTap_web: false,
    //   ROUTES_URLS: SALPL_ROUTE_URL,
    //   static_stitch: true,
    //   is_api: true,
    //   is_cart_check: true,
    //   mobMap: {
    //     91: "NO",
    //     92: "PO",
    //     93: "RESUME",
    //     94: "GIN",
    //     // 95 : "GINTP",
    //     96: "RSLL",
    //   },
    //   ScreenUrls: {
    //     1: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.PDP],
    //     2: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.PERSONALDETAIL],
    //     3: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.SELFEMPLOYEETHANKYOU],
    //     4: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.LOANAPPLICATION],
    //     5: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.KYCDETAIL],
    //     6: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.BANKCUSTDETAIL],
    //     7: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.BANKDETAIL],
    //     8: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.KYCMETHOD],
    //     9: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.VERIFYINCOME],
    //     10: ['/',  SALPL_ROUTE, ''],
    //     11: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.SUBMITTED],
    //     12: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.BOOK],
    //     13: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.VERIFYEMAIL],
    //     14: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.TRACKER],
    //     15: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.TERMSANDCONDITION],
    //     16: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.FAQ],
    //     17: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.UPLOAD],
    //     18: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.RESUME],
    //     19: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.RESUMEDETAILS],
    //     20: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.CONGRATS1],
    //     21: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.RESUMEMANDATE],
    //     22: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.CONGRATS2],
    //     23: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.CANCELCHEQUE],
    //     24: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.GININSURANCE],
    //     25: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.RSLREQ],
    //     26: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.RSLTHANKS],
    //     27: ['/',  SALPL_ROUTE, SALPL_ROUTE_URL.UNDERPROCESS],
    //   },
    //   NO: {
    //     // currentUrl : nextUrl
    //     flowMap: {
    //       1: 2,
    //       2: 4,
    //       4: 5,
    //       5: 6,
    //       6: 9,
    //       7: 9,
    //       8: 9,
    //       9: 11,
    //       11: 13,
    //       13: 12,
    //       17: 11,
    //       12: 1
    //     }
    //   },
    //   PO: {
    //     flowMap: {
    //       1: 4,
    //       4: 2,
    //       2: 5,
    //       5: 6,
    //       6: 9,
    //       7: 9,
    //       8: 6,
    //       9: 11,
    //       11: 13,
    //       13: 12,
    //       17: 11
    //     }
  
    //   },
    //   // POTP:{
    //   //   flowMap :{
    //   //     1 : 4,
    //   //     4 : 2,
    //   //     2 : 5,
    //   //     5 : 6,
    //   //     6 : 9,
    //   //     9 : 11,
    //   //     11 : 13,
    //   //     13 : 12
    //   //   }
    //   // },
    //   GIN: {
    //     flowMap: {
    //       1: 4,
    //       4: 2,
    //       2: 5,
    //       5: 6,
    //       8: 6,
    //       6: 23,
    //       7: 23,
    //       23: 21,
    //       21: 24,
    //       24: 18,
    //       18: 20,
    //       20: 1
    //     }
    //   },
    //   // GINTP :{
    //   //   flowMap :{
    //   //     1 : 4,
    //   //     4 : 2,
    //   //     2 : 5,
    //   //     5 : 6,
    //   //     6 : 9,
    //   //     9 : 11,
    //   //     11 : 13,
    //   //     13 : 12
    //   //   }
    //   // },
    //   RSLL: {
    //     flowMap: {
    //       1: 4,
    //       4: 24,
    //       24: 5,
    //       5: 8,
    //       8: 6,
    //       6: 7,
    //       7: 12,
    //       12: 25,
    //       25: 26,
    //       26: 27,
    //       27: 1,
    //     }
    //   },
    //   RESUME: {
    //     flowMap: {
    //       1: 18,
    //       18: 19,
    //       19: 21,
    //       21: 20,
    //       20: 22,
    //       22: 1
    //     }
    //   }
    // },
    // healthEmicard: {
    //   aem: true,
    //   ROUTES_URLS:EMI_ROUTE_URL,
    //   static_stitch: false,
    //   mobMap: {
    //     91: "NTB",
    //     92: "ETB"
    //   },
    //   ScreenUrls: {
    //     1: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.PDP],
    //     2: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.TNC],
    //     3: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.APLF],
    //     4: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.UVC],
    //     5: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.UPDATEADDRESS],
    //     6: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.PAYNOW],
    //     7: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.INPROGRESS],
    //     8: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ISSUED],
    //     9: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ACTIVATED],
    //     10: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.FAQ],
    //     11: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.KYCPOD],
    //     12: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ERROR_INTERNAL],
    //     13: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ERROR_TECHNICAL],
    //     14: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ERROR_KYC],
    //     15: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ERROR_KYCRETRY],
    //     16: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ERROR_MANDATE],
    //     17: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.ERROR_PAYMENT],
    //     18: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.HEALTH_PARTNER_STORE],
    //     19: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.HEALTH_TREATMENTS],
    //     20: ['/',  EMI_ROUTE, HEALTH_ROUTE, EMI_ROUTE_URL.PROD_INFO],
    //   },
    //   NTB: {
    //     flowMap: {
    //       1: 3,
    //       3: 4,
    //       4: 6,
    //       5: 6,
    //       6: 7,
    //       7: 8,
    //       8: 9,
    //       9: 18,
    //       18: 19,
    //       19: 1
    //     }
    //   },
    //   ETB: {
    //     flowMap: {
    //       1: 4,
    //       4: 6,
    //       6: 9,
    //       9: 18,
    //       18: 19,
    //       19: 1
    //     }
    //   }
    // },
    // fd :{
    //   aem:true,
    //   static_stitch: true,
    //    ScreenUrls :{
    //     1 : ['/',SP_ROUTE,FD_ROUTE_URL.ADDITIONALDETAILS],
    //     2 : ['/',SP_ROUTE,FD_ROUTE_URL.SPADDNOMINEE],
    //     3 : ['/',SP_ROUTE,FD_ROUTE_URL.BANKDETAI],
    //     4 : ['/',SP_ROUTE,FD_ROUTE_URL.MINORADDNOMINEE],
    //     5 : ['/',SP_ROUTE,FD_ROUTE_URL.MINORADDITIONALDETAIL],
    //     6 : ['/',SP_ROUTE,FD_ROUTE_URL.HUFPAYMENT],
    //     7 : ['/',SP_ROUTE,FD_ROUTE_URL.HUFADDITIONALDETAIL],
    //    },
    //    SP:{
    //     flowMap :{
    //      1 : 2,
    //      2 : 3
    //     }
    //    },
    //    HUF:{
    //     flowMap :{
    //      1 : 4,
    //      4 : 2
    //     }
    //    },
    //   MINOR:{
    //     flowMap :{
    //      1 : 4,
    //      4 : 2
    //     }
    //    },
    //   PHARMA:{
    //     flowMap :{
    //      1 : 4,
    //      4 : 2
    //     }
    //    }  
    //  }
}
    

