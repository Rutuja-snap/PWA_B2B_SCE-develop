import { LOAN__CONFIG, LOAN__CONSTRAINT, VARIANTS } from "../config/calculator.config";
import { PAYOUTVARIANTS, TENUREVARIANTS } from "../config/deposit.config";
import { MinMax, MinMaxGetter } from "./api.model";
import { CartConfig, CartMapp, OfferConfig, QueryHelper, RelationsConfig } from "./flow.model";
import { DepositTenure, InfoRender } from "../model/render.model";

export enum TEMPLATES {
    PLP = "PLP",
    PDP = "PDP"
  }

export type XEvent = {
    id: string;
    data?: any;
}
export type CTA = {
    id?: string;
    label: string;
    icon?: Asset;

    view?: boolean;

    appLink?: string;
    webLink?: string;

    action?: 'click' | 'scroll' | 'video' | 'address';
    address?: string;

    __disabled?: boolean;

}


export type Tenure = {
    value: number;
    disabled?: boolean

    initial?: Tenure[];
    default?: Tenure;
}

export type Progress = {
    label?: string;
    progress_value_type?: 'fraction' | 'percentage';

    total?: number;
    completed?: number;
    percentage?: number;

    // can be used with mat-progess-bar 
    __bar_type?: string;
}



export type XFAQ = {
    question: string;
    answer: string;
    list_points?: string[];
    disclaimer?: string;

    index?: number;
    is_cta?: boolean;
    cta_text?: string;
    cta_icon?: Asset;

    cta?: CTA;

    // if available
    video?: Asset;
}

export type bullet = {
    text?: string;
    numbered?: boolean;
    heading?: string;
}


export type Result = {
    id?: string;
    view?: boolean;
    index?: number;
    disabled?: boolean;

    // offers 
    render__from_offer?: boolean;

    // render info 
    // orientation?: 'landscape' | 'portrait';

    // render data 
    render__tag?: string;
    render__amount_prefix?: string;
    render__amount?: string;
    render__amount_suffix?: string;

    //render FD
    render__roi_prefix?:string
    render__roi?:string
    render__roi_suffix1?:string
    render__roi_suffix2?:string

    render__title?: string;
    render__subtitle_text?: string;
    render__subtitle_value?: string;
    render__text3?: string;
    render__text4?: string;
    render__additional_tag?: string;
    render__cta?: CTA;

    render__props?: string;

    render__is_horizontal?: boolean;
    render__is_header?: boolean;
    render__header_mode?: 'default' | 'center';
    render__header_text?: string;
    render__header_subtitle?: string;
    render__header_cta?: CTA;
    render__display_image?: Asset;
    render__action?: string;
    render__resume_footer_text?:string;
    tag?: string; // determines the badge on the result + banner color 
    amount?: string;
    amount_units?: string;

    title?: string;
    emi_text?: string;
    emi_amount?: string;
    // tenure?: string;
    additional_text?: string;

    cta_label?: string;

    is_additional_tag?: boolean;
    additional_tag?: string;

    // values 
    __tenure_value?: number;
    __tenure_units?: 'month' | 'year';
    //
    value_amount?: number;
    value_loantype?: string;
    value_tenure?: number;
    value_emi?: number;
    value_variant?: string;


    //from the API 
    skuId?: string;                  // "PL_01"
    category?: "Loans" | "Investment" | "Cards";               // "Loans"
    subCategory?: string;            // "Personal Loan"
    business?: string;               // "Personal Loan"
    productCode?: string;            // "GIN"


    productSkuLabel?: string;        // "Pre Approved Personal Loan for you"
    amountPrefix?: string;           // "₹"
    displayLoanAmount?: string;      // "40"
    loanAmountSuffix?: string;       // "Lakh"
    actualLoanAmount?: number;       // 4000000
    emiAmountText?: string;          // "EMI Starting from"
    emiAmount?: number;              // 45000
    tenure?: number;                 // 48
    tenureSuffix?: string;           // "Months"
    roi?: number;                    // 12.5
    uspText?: string;                // "Quick disbursal in 4 hours*"
    disbursalTime?: number;          // 240

    cta?: CTA;
    nudge1?: string;                 // "Recommended"
    nudge2?: string;                 // "Popular"
    employmentType?: string;         // "Salaried"
    loanType?: string;               // ""
    variant?: string;                // "Flexi Loan"
    businessSegment?: string;        // ""
    documentation?: string;          // "Minimal Documentation"
    productDetails?: SKU__ProductDetails;
    rating?: number;                 // 4.4

    relatedSkuIds?: string[];  // has related skuIds in the SKU_LIST response
    relatedSkuDetails?: Result[];  // Array of related results
    sequence?: number;               // 12
    clpSectionName?: string;         // "MSME World"
    plpSectionName?: string;         // ""

    subCategorySequence?: number;
    categorySequence?: number;
    offerType?: string;
    subOfferType?: string;
    subClpSectionName?: string;
    displayAmountPrefix1?:string;
    displayAmountPrefix2?: string;              // "₹",
    actualAmount?:number;
    usp2Text?:string;
    usp1Text?:string;
    skuImage?:string;

    // additional missing 
    // [key: string]: string;
    // [key: string]: number;

    // to store anything extra 
    data?: any;



    msmeWorld?: string;             // "yes",
    doctorWorld?: string;               // "yes",
    cardCode?: string;              // "CC28 ",
    displayAmount?: string;             // "3,849",
    displayAmountSuffix?: string;               // "",
    type?: string;              // "Credit Card",
    ccBenefit?: string;             // "Entertainment",
    ccBank?: string;                // "RBL",
    ccRewardsOnSpends?: string;             // "Welcome rewards",

    //FD
    investmentAmount?: number        // 15000 Category == Investment
    investmentType?:string           //FD \ SDP
    
    returnRatePrefix?:string
    returnRateSuffix1?:string;
    returnRateSuffix2?:string;
    returnRate?:number;
    usp1Prefix?:string;
    usp1?:string;
    usp1Suffix?:string;
    usp2?:string;
    usp3?:string;




}




export type SKU__Feature = {
    image?: string;
    label?: string;
    subText?: string;
    description?: string;
    drawerCtaText?: string;
};

export type SKU__ProductDetails = {
    label?: string;
    images?: string[];
    productFeatureVideo?: string;
    productFeatureVideoThumbnailImage?: string;
    productApplyVideo?: string;
    productApplyVideoThumbnailImage?: string;
    productDescription?: string;
    featureIcons?: SKU__Feature[];
};


export type Asset = {
    link: string;
    type?: 'image' | 'video',

    // link 
    thumbnail?: string;

    alt?: string;
    description?: string;

    //processed 
    height?: number;
    width?: number;
    id?: string;


    // video >
    title?: string;
    // video_id?: string; >> link
    kpoint_id?: string;

    index?: number;
    package_id?: string

}


export type Color = {

}


export type RatingRender = {
    rating?: number;
    count?: number;

    hide_rating?: boolean;
    hide_count?: boolean;
    title?:string;
}


export type LoanExtra = {
    icon?: Asset;
    title?: string;
    desc?: string;

    cta?: CTA;
    
    popup?: InfoRender;
}

export type TermsAndConditionsRender = {
    label?: string;
    content_link?: string;
    content?: any;
    title?:string;
    description?:string
}

export type IconFeature = {

    icon: Asset;
    text?: string;

    index?: number;
    clickable?: boolean;

    popup?: any;
    infopopup?: InfoRender;
}

export type Option = {
    display: string;

    // using bounds for now > results component 
    bounds?: Bounds;
    value?: any;
    checked?: boolean;

    dataColumn?: string;
    isAlldataColumns?: boolean;

    // helper 
    id?: string;
}

export type Bounds = {

    // no min or max implies no bound at that extreme
    max?: number;
    min?: number;
    inclusive?: boolean;
    units?: string;
    // display internal 
    display_max?: string;
    display_min?: string;
    display_connector?: string;

    // overall label 
    label?: string;

    // extra helper
    roi?: number; 
    value?: number;

}


export type Filterer = {
    // assume filtering list<data> by few methods 

    id: string;
    label: string;

    // not used yet 
    hide?: boolean;

    controlType: 'radio' | 'checkbox';
    funcType: FILTER_TYPES;

    options: Option[];

    // in case of single option 
    optionSelected?: number;

    // for filters 

    // filter by which column or ."key" in the list<data>
    filterby?: string;
    // filters the list by searching the entire 
    filterByAll?: boolean;

    __is_default?: boolean;
}

export type FilterHelper = {
    // helps a method to apply the filter 
    [key in FILTER_TYPES]?: Option[];

    // [key in FILTER_TYPES]?: { [id: string]: Array<Option>};

}

export type FilterQuery = {
    [key in string]?: any;
    // Array<any> | number[][] | {key: string; order: 'asc' | 'desc'};
}

export enum FILTER_TYPES {
    sort = 'sort',
    bounds = 'bounds',
    filter = 'filter'
}

// CONSTRIANTS 

export type XConstraint = {
    id?: string;
    disabled?: boolean;
    // what property 
    type?: 'view';

    // ids 
    elements?: string[];

    // relation > 
    // only_one make sures that there's only one element in view 
    relation?: 'only_one' | 'trigger';

    // trigger 
    // when triggerer in view > show target  
    triggerer?: string;
    target?: string;
    onlyOneTrigger?: boolean;

}



// CONFIG MODELS 

export type MODULE = {
    id: string;
    category: string;
    subCategory?: string;
    business?: string;

    // for internal configurations 
    // product?: string;
    // subProduct?: string;
    J_CONF?: JOURNEY;
    JOURNEYS?: JOURNEY__MAPP;
    PRODUCTS?: {[key: string]: OfferConfig};
    SUB_PRODUCTS?: {[key: string]: OfferConfig};

    
    PRODUCT?: OfferConfig;
    // INTERNALS 

    routeConfig?: {
        // from where the routes are to be created
        params: string[];
        prefix: {
            pdp: string;
            plp: string;
        }
    }

    urls?: {
        [key: string]: PAGE;
    }

    LOADERS?: {
        [t in TEMPLATES]: string[];
    }

    PRODUCT_TYPE?: PRODUCT_TYPE;
    BUSINESS?: string;

    PDP_EVENT_CODE?: string;
    ADDONS_API_OPERATION?: string;
    OFFERS_SOURCE_ID?: string;

    CART_MAPP_depr?: CartMapp;


    //functional
    LOAN?: LOAN;
    DEPOSIT?:DEPOSIT;
    OFFERS?: OfferConfig[];
    CART_MAPP?: CartConfig[];
    INTEGRATION?: MODULE_INTEGRATOR;

    RELATIONS_GETTER?: RelationsConfig;

    SKU_LIST_VERSION?:string;

    other?: {
        FORCE_REST_CALL?: boolean;
        PLP_MODULE_SPEC_INIT?: boolean;
        PDP_MODULE_SPEC_INIT?: boolean;
        GET_PRODUCT_FROM_PARAMS?: boolean;
        LOAD_DEFAULT_SKU_FROM_SUBPRODUCT?: boolean;
        DO_NOT_LOAD_OFFER_SKU?: boolean;
        INSERT_API_RESP_ID_KEY?: string;

        PLP__UPDATE_ACTIVE_TAB_BY_CONFIG?: boolean;

        PDP_LOAD_CUSTOMER_TAGS?: {
            enabled?: boolean;
            getter?: 'journey' | 'offer' | 'query';

            // when getter == query
            query?: {tagName?: QueryHelper}

            // getter != query | store whatever you want in data and use it in the component 
            data?: {[key: string]: any}

        };

        LOAD_PRODUCT_CONFIG_FROM_API?: {
            enabled?: boolean;
            getter?: 'static' | 'sku';

            __data?: any;
            fetched?: boolean;
        };
        DO_NOT_APPLY_OFFER_BY_DEFAULT?: boolean;
        CHANGE_PRODUCT_ON_SKU?: {
            enabled: boolean;
            mapp?: {
                [key: string]: {find?: {[key: string]: QueryHelper}}
            }
            value__field?: any;
            method?: 'mapp' | 'value';
        };
        CHANGE_MODULE_ON_SKU?: {
            enabled: boolean;
            // mapp: {
            //     [m in PDPX_MODULES]?: {find?: {[key: string]: QueryHelper}}
            // }
            mapp?: {
                [key: string]: {find?: {[key: string]: QueryHelper}}
            }
            value__field?: any;
            method?: 'mapp' | 'value';
        };

        CHANGE_SUBPRODUCT_ON_SKU?: {
            enabled: boolean;
            mapp?: {
                [key: string]: {find?: {[key: string]: QueryHelper}}
            }
            value__field?: any;
            method?: 'mapp' | 'value';
        };

        FILTER_OFFERS_ON_PRODUCT_IFF_SELECTED?: boolean;

        data?: any;

        // loads journey object whenever journey is getting changed 
        LOAD_JOURNEY_CONFIG?: boolean;
        
        // ADDONS_CUST_TYPE?: string;
        // PARAM_MAPP?: MODULE_CONFIG_MAPP'

        ONLY_RESUME__MODE?: {
            enabled?: boolean;
            basedOn?: 'event' | 'mode_specc';

            
            event_field?: string;
            events?: string[];
        }

        ADDONS_GETTER?: {
            dob_type?: 'age' | 'date';
            age?: number;
            dob?: string;
        }
        aem_forced_stage?:boolean;

        RELATIONS__PAYMENT_CTA?: boolean;
        //Disable any render based on Product :[id of render]
        DISABLE_RENDER?:{
            [key in string]:string[]
        };

        XHIMMER_MODE_ON?: boolean;

    };

    AEM?: {
        enabled?: boolean;
        // to create the AEM URL key > nothing : default
        getter?: string[];
        getter__PDP?: string[];
        getter__PLP?: string[];

        PDP?: {
            getter?: string;


            //default 
            default: string;
            // journeyName / whatever
            [key: string]: string;
        }

        PLP?: {
            getter?: string;

            //default 
            default: string;
            // journeyName / whatever
            [key: string]: string;
        },

        //url which is currently loaded 
        __current_loaded__PLP?: string;
        __current_loaded__PDP?: string;



    }

    banners?:{
        module?:string;

        moduleMapp?: {[key: string]: string};
    }

    cleverTap?: {
        enabled?: boolean; 
        PROPS?: any; 

        MAPP?: any;
        journeys?:any;
        journeyTypes?:any;
    }

    // tabs_mapp?:any


}

export type JOURNEY__MAPP ={
    [key: string]: JOURNEY;
}
export type JOURNEY = {
    // will be loaded from offerConfig > into flow > no need to load into config
    // module?: string;
    // product?: string; 
    // load?: ['constraint'];

    journeyName: string;
    journeyType?: string;

    constraint?: {
        getter: 'static' | 'api';
        api?: string;                //operation

        static?: LOAN__CONSTRAINT;

        // if getter > api
        is_fetched?: boolean;
        fetched?: LOAN__CONSTRAINT[];
        
        tenure_data?: {range: Bounds}

        

        // api: GETTER > something 
    }
    config?: LOAN__CONFIG;

    roi?: RoiHelper;
    roiMapp?: {[key: string]: RoiHelper};
    limits?: Bounds;

    isSubJourneys?: boolean;
    subJourneys?: JOURNEY__MAPP;
    defaultSubJourney?: string;


    // other aspects 
    extras?: {
        hide_callback?: boolean; 
        hide_related_skus?: boolean;
        hide_tabular_variants?: boolean;

        UPSERT_ON_APPLY_AND_RESUME?: boolean;
        
        ROI_AGAINST_SUB_JOURNEY?: boolean;
        CALC_AGAINST_OPTION?: boolean;
    };

    __data?: any;
    PATCH_APPLN_FROM_CART?: boolean;


}

export type PRODUCT = {
    id: string; 

    // route part (not complete part)
    route?: string;
    routeKey?: string; 

}

export type PRODUCT_TYPE = 'LOAN' | 'DEPOSIT' | 'CARD' | 'INSURANCE';

export type LOAN = {
    // constraints 
    // config 

    //limits > against each product + default 

    charges?: {
        enabled?: boolean;
        method?: 'api' | 'calc';

        // only this for now 
        api?: 'b2cchargecalculation';

        // charges > mapp 
        mapp?: any;
    }

    isMinMax?: boolean;
    minMaxGetter?: {
        default: MinMaxGetter;
        [product: string]: MinMaxGetter;
    };
    minmax?: MinMax;
    
    limitsGetter?: {
        mapp?: {
            // ['product', 'subproduct']
            constructor: string[];
            mapping?: {
                [key: string]: RoiHelper;
            }
        }
    }
    limits?: {
        default: Bounds;
        // [key: string]: Bounds;

        calculate?: 'default'|'mapp';

        mapp?: {
            // ['product', 'subproduct']
            constructor: string[];
            mapping?: {
                [key: string]: Bounds;
            }
        }
    }

    flexi_fee?: {
        applicable?: boolean; 
        
        // applicable variants 
        variants?: VARIANTS[];
        
        calculate?: 'constant' | 'slabs';
        default?: number;
        slabs?: { [key in VARIANTS]?: Bounds[] };
        values?: string[];
    }
    
    processing_fee?: ChargeCalcHelper;
    
    roi?: RoiHelper;

    variant_mapp?: {
        [v in VARIANTS]?: string;
    }

}
export type DEPOSIT = {
    // constraints 
    // config 

    //limits > against each product + default 

    charges?: {
        enabled?: boolean;
        method?: 'api' | 'calc';

        // only this for now 
        api?: 'b2cchargecalculation';

        // charges > mapp 
        mapp?: any;
    }

    isMinMax?: boolean;
    minMaxGetter?: {
        default: MinMaxGetter;
        [product: string]: MinMaxGetter;
    };
    minmax?: MinMax;
    
    limitsGetter?: {
        mapp?: {
            // ['product', 'subproduct']
            constructor: string[];
            mapping?: {
                [key: string]: RoiHelper;
            }
        }
    }
    limits?: {
        default: Bounds;
        // [key: string]: Bounds;

        calculate?: 'default'|'mapp';

        mapp?: {
            // ['product', 'subproduct']
            constructor: string[];
            mapping?: {
                [key: string]: Bounds;
            }
        }
    }

    flexi_fee?: {
        applicable?: boolean; 
        
        // applicable variants 
        variants?: VARIANTS[];
        
        calculate?: 'constant' | 'slabs';
        default?: number;
        slabs?: { [key in VARIANTS]?: Bounds[] };
        values?: string[];
    }
    
    processing_fee?: ChargeCalcHelper;
    
    roi?: RoiHelper;

    variant_mapp?: {
        [v in PAYOUTVARIANTS]?: string;
    };

    tenure_mapp?:{
        [t in TENUREVARIANTS]?:DepositTenure[]
    }


}

// export type CARD = {
    
// }

export type ChargeCalcHelper = {
    applicable?: boolean; 
    calculate?: 'constant' | 'coefficient' | 'mapp';
    default?: number;

    coefficient?: number;
    values?: string[];

    formula_id?: 'SME' | 'B2C'; 
    alpha?: number;
    beta?: number;

    overrideFromOffer?: boolean;
    field__PROCFEE_coefficient?: string;

    // mapp 
    mapp?: {
        // ['product', 'subproduct']
        constructor: string[];
        mapping?: {
            [key: string]: ChargeCalcHelper;
        }
    }
}

export type RoiHelper = {
    enabled?: boolean;

    // once fetched from api > marked as true
    fetched?: boolean;
    getter?: 'aem' | 'api' | 'none';

    
    calculate?: 'constant' | 'slabs' | 'matrix' | 'mapp' | 'minmax';
    
    // constant 
    default?: number;
    
    //slabs 
    slabs?: Bounds[];
    
    
    // mention > product, subproducts
    levels?: string[];
    // matrix
    matrix?: {
        getter?: string[];
        default?: number;
        mapp?: {
            [product: string]: RoiHelper;
        }
    }

    mapp?: {
        // ['product', 'subproduct']
        constructor: string[];
        mapping?: {
            [key: string]: RoiHelper;
        }
    }

    // // if roi not to be calculated but to be taken from offer json > as it will be already patched from offer json 
    // true > implies (will be taken from offer) | false > offer roi is not considered
    disabledForOffered?: boolean;
}

export type PAGE = {
    name: string;
    route: string;
}

export type MODULE_INTEGRATOR = {
    DELETE_FROM_CART_BEFORE_INSERT?: boolean;
    DEMOG_WITH_FLAG?: boolean;
    SKIP_OFFERS_FROM_NATIVE?: boolean;
    CART__PATCH_APPLN?: boolean;

    key__APP_LOAD_MODULE?: string;

    is_entry_condtional?: boolean;
    entry?: {
        default?: string;
        [key: string]: string;
    }
    USE_INAPPLINK?:{
        enabled?:boolean;
        inAppLink?:string
    }
    USE_STATUS_CODE?:{
        [key:string]:string
    }
}



export type bannersection = {
    section?: string;
    title?: string
}


