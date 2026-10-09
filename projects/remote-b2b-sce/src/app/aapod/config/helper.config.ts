
export enum PDPX_PAGES {
    PL__PLP = 'PL__PLP',
    PL__PDP = 'PL__PDP',

    PSBL__PLP = 'PSBL__PLP',
    PSBL__PDP = 'PSBL__PDP',

    BLSE__PLP = 'BLSE__PLP',
    BLSE__PDP = 'BLSE__PDP',


    HL__PLP = 'HL__PLP',

    HL_FRESH__PLP = 'HL_FRESH__PLP',
    HL_FRESH_DEFAULT__PLP = 'HL_FRESH_DEFAULT__PLP',
    HL_FRESH_SALARIED__PLP = 'HL_FRESH_SALARIED__PLP',
    HL_FRESH_SELFEMPLOYED__PLP = 'HL_FRESH_SELFEMPLOYED__PLP',

    HL_BT__PLP = 'HL_BT__PLP',
    HL_BT_DEFAULT__PLP = 'HL_BT_DEFAULT__PLP',
    HL_BT_SALARIED__PLP = 'HL_BT_SALARIED__PLP',
    HL_BT_SELFEMPLOYED__PLP = 'HL_BT_SELFEMPLOYED__PLP',
    
    HL__PDP = 'HL__PDP',

    HL_BT__PDP = 'HL_BT__PDP',
    HL_BT_DEFAULT__PDP = 'HL_BT_DEFAULT__PDP',
    HL_BT_SALARIED__PDP = 'HL_BT_SALARIED__PDP',
    HL_BT_SELFEMPLOYED__PDP = 'HL_BT_SELFEMPLOYED__PDP',

    HL_FRESH__PDP = 'HL_FRESH__PDP',
    HL_FRESH_DEFAULT__PDP = 'HL_FRESH_DEFAULT__PDP',
    HL_FRESH_SALARIED__PDP = 'HL_FRESH_SALARIED__PDP',
    HL_FRESH_SELFEMPLOYED__PDP = 'HL_FRESH_SELFEMPLOYED__PDP',
    
    DL__PLP = 'DL__PLP',
    DL__PDP = 'DL__PDP',

    LFL__PLP = 'LFL__PLP',
    LFL__PDP = 'LFL__PDP',

    CA__PLP = 'CA__PLP',
    CA__PDP = 'CA__PDP',

    UCF_ZCUC__PLP = 'UCF_ZCUC__PLP',
    UCF_ZBT__PLP = 'UCF_ZBT__PLP',
    UCF_ZLC__PLP = 'UCF_ZLC__PLP',

    UCF_ZCUC__PDP = 'UCF_ZCUC__PDP',
    UCF_ZBT__PDP = 'UCF_ZBT__PDP',
    UCF_ZLC__PDP = 'UCF_ZLC__PDP',

    CC__PLP = 'CC__PLP',
    CC__PDP = 'CC__PDP',

    CC_DBS__PLP = 'CC_DBS__PLP',
    CC_RBL__PLP = 'CC_RBL__PLP',
    CC_DBS__PDP = 'CC_DBS__PDP',
    CC_RBL__PDP = 'CC_RBL__PDP',
    LAP_PDP='LAP_PDP',

    PLEMICARD_ACQ__PDP='PLEMICARD_ACQ__PDP',
    PLEMICARD_USAGE__PDP='PLEMICARD_USAGE__PDP',
    PLEMICARD_EXIT_SCENARIO='PLEMICARD_EXIT_SCENARIO',

    FD_FD__PDP = 'FD_FD__PDP',
    FD_SDP__PDP = 'FD_SDP__PDP',


    GL__PDP='GL__PDP',

    GL_BT__PDP = 'GL_BT__PDP',
    GL_FRESH__PDP = 'GL_FRESH__PDP',
    LAP_FRESH__PDP='LAP_FRESH__PDP',
    LAP_BT__PDP='LAP_BT__PDP',

    LAMF__PDP='LAMF__PDP',
    LAS__PDP = 'LAS__PDP',

    MEF__PDP='MEF__PDP',
    MEF_DEFAULT__PDP='MEF_DEFAULT__PDP',
    MEF_RF__PDP='MEF_RF__PDP',
    MEF_BT__PDP='MEF_BT__PDP',
    MFI__PDP='MFI__PDP',




    PDPX_ENTRY = 'PDPX_ENTRY',
    PWA_HOME = 'PWA_HOME',

}

export type PDPX_ROUTES = {
    [page in PDPX_PAGES]?: string;
}

// export class PDPX_CONSTANTS {
//     public static VERSION: string = "30.10.x1202"


//     public static ICORS_TAG: string = "<<ICORS>>"
//     public static INR_CHAR: string = "₹"

//     public static ADDONS_FETCH_DEFAULT_DOB = "1988-12-04"
//     public static DEFAULT_PLP_SKU_COUNT = 20

//     public static APP_DEEPLINK_BASE = "https://c2gx.app.link/PDPX"
    
//     public static PDPX_TEST_LOGIN_ENABLED = true;
//     public static MODE_CART_ENABLED = false;

//     public static CONTENT_DEFAULTS = {
//         RESUME_CTA_TEXT: "Resume",
//         CONTINUE_CTA_TEXT:'Continue',

//         CPP_ADDON_IDS: ['CPP_DOCTOR_SHIELD_24', 'CPP_CREDIT_HEALTH_PLUS_1']
//     }

//     public static FLAGS = {
//         XHIMMER_MODE: false,
//         COMP_MODE_LOADER_ENABLED: false,

//         CLEAN_BEFORE_DUMP_CONFIG: true,
//         FABRICATE_OFFERED_SKU_IF_NOT_FOUND: true,
//         TEST_OFFERS_ENABLED: true,
//         AEM_CACHE: true, 
//         SKU_DETAILS_CACHE: true,
//     }

//     public static CONFIG = {
//         // to be moved to env
//         IN_APP_LINKS: {
//             VIEW_RELATION__LOAN: "bajajsuperapp://relations/loan",
//             VIEW_RELATION__CARDS: "bajajsuperapp://relations/cards",
//             VIEW_RELATION__DEPOSITS: "bajajsuperapp://relations/deposits",
//             VIEW_RELATION__INSURANCE: "bajajsuperapp://relations/insurance",
//             VIEW_RELATION__MUTUALFUND: "bajajsuperapp://relations/mutualfund",
//             MAKE_PAYMENT__LOAN:"bajajsuperapp://relations/loan",
//             RENEW_NOW: "bajajsuperapp://relations/deposits",
//             INVEST_MORE:"bajajsuperapp://fd"
            

//         },
        
//         WEB_LINKS: {
//             VIEW_RELATION__LOAN: "bajajsuperapp://relations/loan",
//             VIEW_RELATION__CARDS: "bajajsuperapp://relations/cards",
//             VIEW_RELATION__DEPOSITS: "bajajsuperapp://relations/deposits",
//             VIEW_RELATION__INSURANCE: "bajajsuperapp://relations/insurance",
//             VIEW_RELATION__MUTUALFUND: "bajajsuperapp://relations/mutualfund",
//             MAKE_PAYMENT__LOAN:"bajajsuperapp://relations/loan"
//         },

//         WEB_BASE_URL: "https://bajajfinserv.in"
//     }



// }