import { Validator } from '@angular/forms';
import { Asset, Bounds, CTA, FILTER_TYPES, FilterHelper, FilterQuery, Filterer, IconFeature, LoanExtra, MODULE, Option, Progress, RatingRender, Result, TermsAndConditionsRender, XConstraint, XEvent, XFAQ, bannersection } from './helper.model';
import { Subject } from 'rxjs';
import { LOAN__CONFIG, LOAN__CONSTRAINT, VARIANTS, XLoanCalculator } from '../config/calculator.config';
import { relation__card, relation__deposit, relation__insurance, relation__loan, relation__type } from './api.model';
import { PDPX_PAGES } from '../config/helper.config';
import { CartItem, OfferOption } from './flow.model';
import { PAYOUTVARIANTS } from '../config/deposit.config';


export type RenderOutput = {


    // event name 
    event?: string;

    // any id 
    id?: string;

    // params will be an object with keys > param names and values > param values 
    params?: any;
    source?: string;

}

export type RenderOutputParams = {
    source?: string;
    click?: CTA;
    data?: any;
}

export type NavHeaderRender = {
    id: string;
    title: string;
    icon?: string;  // mat-icon name
}

export type TabsHorizRender = {
    id: string;
    disabled?: boolean;

    tabs: string[];


    activeIndex: number;

    update$?: Subject<boolean>;

    // is tab change functional or just content 
    functional?: boolean;
    data?: TabData[];

    triggers?: {
        [key: string]: {
            // aem?: string;
            filter?: FilterQuery;

        }
    }
    // functionality of the tabs 

    __hide_indices?: number[];
    __disable_AEM?: boolean;

    mapp?: { [key: string]: TabsHorizRender }

}

export type TabData = {
    // tab id and index in the tabs
    id?: string;
    index?: number;

    // product 
    updateProductWith?: string;

    // will update the subproduct > incase this tab is made active 
    updateSubProductWith?: string;

    // will update the product > incase selected tab is made active 
    updateProductwith?: string

    // AEM 
    updateAem?: boolean;

    // FILTER 
    updateFilter?: boolean;
    // applies filter into results 
    filterQuery?: FilterQuery;


    navigateTo?: PDPX_PAGES;

    updateSections?: boolean;
    banner_data?:bannersection

    // better option 
    // changeModuleTo?: PDPX_MODULES;

}



export type TextRatingsRender = {
    id: string;
    tab?: string;
    title: string;
    subtitle: string;
    rating?: RatingRender;
}

// banners 
export interface CarouselRender {
    carousel_images: Asset[];
    indicators: boolean;
    controls: boolean;
    autoSlide: boolean;
    sliderInterval: number
}


export type BannersHorizRender = {
    id?: string;
    // type: ''
    title?: string;
    banners?: Asset[];


    indicators?: boolean;
    controls?: boolean;
    autoSlide?: boolean;
    sliderInterval?: number;

    footer_text?: string;
    banner_data?: bannersection
    showShareIcon?:boolean;
    // footer_text?: string;
    tabIds?: string[];
    __hide?: boolean;
    __hide_footer_image?:boolean

}
export type StripBannerRender = {
    id: string;
    view?: boolean;
    banner?: Asset;


    type?: 'render' | 'image';
    // render helper 
    text?: string;

    // label with units and all 
    amount?: string;
    cta?: CTA;
    overlay?: Asset;
}

export type CardBannerRender = {
    link?: string;

    // if texts to be rendered 
    // id?: string;
    // bgImage?: string;

    // title?: string; 
    // badgeText?: string; 
    // amountType?: string; 
    // amount?: string; 
    // emiText?: string; 
}
export type BannersCardRender = {
    id: string;
    title: string;
    banners: CardBannerRender[];
}


// results section 
export type ResultsRender = {
    id: string;
    view?: boolean;

    MODE?: 'PAGE' | 'SKU';

    is_radio: boolean;
    radio_title?: string;
    radio_filter?: Filterer;
    radioQuery?: FilterQuery;

    listerType: 'horizontal' | 'vertical'
    resultOrientation: 'landscape' | 'portrait'

    results: Result[];
    count?: number;
    max_count?: number;
    offset?: number;


    is_filter: boolean;
    filter_text?: string;
    filter_text_mapp?: { [key: string]: string };
    filterConfig?: FilterConfig;

    // page default query > will always be used as priority
    defaultQuery?: FilterQuery;

    filterChips?: FilterChip[];


    // depr 
    radio_options?: Option[];

    videos?: Asset[];

    __hide?: boolean;
}

export type FilterChip = {
    type: FILTER_TYPES;
    option: Option;
    source: 'default' | 'radio_filter' | 'filter_config';
}


export type FilterConfig = {
    id: string;
    view?: boolean;
    loaded?: boolean;

    // if we are using subject 
    emitter$?: Subject<XEvent>;

    // target component id > (in parent)
    target$?: string;

    appliedFilters?: FilterHelper;
    filterQuery?: FilterQuery;
    appliedFilterCount?: number;
    filters: Filterer[];
    defaultFilters?: Filterer[];

    clear_cta?: CTA;
    show_cta?: CTA;

    // component helpers 
    activeFilterIndex?: number;
}



export type FilterDialogData = {
    render: FilterConfig;
    config: MODULE;
    // additional stuff 

    parent?: ResultsRender;

}




// CTA 
export type CTARender = {
    id?: string;
    ctaText: string;

    is_icon?: boolean;
    icon?: string;


}





// FAQ 
export type XFAQRender = {
    id: string;
    title: string;
    initial_show_count?: number;
    faqs: XFAQ[];

    // internal 
    showMore?: boolean;
    panelsOpenByDefault?: boolean;

    search$?: Subject<string>;
    update$?: Subject<boolean>;

    expansion_mode?: 'none' | 'all' | 'first';


    // height
    __overflow_threshold?: number;
    __overflow?: boolean;
    __expanded?: boolean;

}




// pdp elements 
export type PdpExistingRender = {
    id?: string;
    view?: boolean;
    title?: string;
    subtitle?: string;
    cta_left?: CTA;
    cta_right?: CTA;

    relation?: relation__type;

}




export type LoanExtrasRender = {
    id: string;

    desc?: string;

    title?: string;
    icon?: Asset;
    extras?: LoanExtra[];
    extras_view_mode?: 'full' | 'title';
    __hide?: boolean;

    
}








export type AddonsRender = {
    id: string;

    title?: string;
    subtitle?: string;

    addon_image?: Asset;
    addon_rating?: RatingRender;
    addon_name?: string;
    addon_display_price?: number;
    addon_actual_price?: number;
    addon_additional_text?: string;

    // no need 
    is_cta?: boolean;
}

export type IconFeaturesRender = {
    id?: string;
    sectionTitle?:string;
    features?: IconFeature[];
}


// CONTENT COLLECTIONS 
export type FeaturesRender = {
    title: string;
    paras?: ParaCollection;

}


export type EligibilityRender = {
    title: string;

    textParas?: ParagraphContent[];
    // bulletListParas?:

}

export type ContentCollectionRender = {
    id?: string;

    title?: string;

    mapp: ContentSection[];


    // extension 
    is_accordion?: boolean;
    is_accordion_open?: boolean;

    showMoreToggle?: boolean;
    showMoreHeight?: number;

    update$?: Subject<boolean>;
    __hide?: boolean;
}

export type ContentSection = {
    type: CONTENT_TYPES;
    template?: XAEM_CONTENT_TYPES;
    __make_p_bold?:boolean;
    // content
    content?: ParaCollection;

    // table 
    tabular?: TabularContent;

}

export enum CONTENT_TYPES {
    TEXT_PARA = 'TEXT_PARA',
    BULLET_PARA = 'BULLET_PARA',
    BULLET_LIST = 'BULLET_LIST',
    HTML = 'HTML',
    TABULAR = 'TABULAR',
    XAEM = 'XAEM',

}

export enum XAEM_CONTENT_TYPES {
    TEXT_PARA = 'TEXT_PARA',
    BULLET_PARA = 'BULLET_PARA',
    BULLET_LIST = 'BULLET_LIST',
    HTML = 'HTML',
    TABULAR = 'TABULAR',
    HEADING_PARA = 'HEADING_PARA'

}

// export enum CONTENT_SECTIONS {
// PARA_COLLECTION = ''
// }




export type ParaCollection = {
    // array of paragraphs > for bullet-list and bullet-para 
    html?: string;

    paragraphs?: ParagraphContent[];
    initial_show_count?: number;
    footerText?: string;

    is_listed?: boolean;
    paralisterType?: 'listed' | 'unlisted' | 'none';

    // internal 
    showAllByDefault?: boolean;

    // scrollable > used in table 
    scrollable?: boolean;

}


// CONTENT COMPONENTS 

// paragraph > textPara / a single bulletPara / a single bullet list as well  
export type ParagraphContent = {

    // heading (as in bullet para > bold )
    heading?: string;

    // parag. text 
    content?: string;
    color?: string;


    // bottom text CTA 
    is_cta?: boolean;
    cta?: CTA;


    // bullet-list 
    points?: LineContent[];
    points_list_type?: 'listed' | 'unlisted';
    points_list_icon?: Asset;
    footerText?: string;


    // internal 
    id?: string;
}

export type LineContent = {
    content?: string;

}



// CONTENT: TABULAR 


export type TabularContent = {
    id?: string;
    num_cols?: number;
    num_rows?: number;
    rows: TabularRow[];
    header?: ContentCollectionRender;
    footer?: ContentCollectionRender;
}

export type TabularRow = {
    isHeader?: boolean;

    isBold?: boolean;

    // for each column 
    columns?: TabularColumn[];


}

export type TabularColumn = {
    id?: string;
    content?: ContentCollectionRender;
    // extension > content will be bold
    isBold?: boolean;
}


// navigator render 
export type NavigatorRender = {
    id?: string;
    title?: string;
    path: NavLink[];
    disabled?: boolean;


    view?: boolean;
}

export type RedirectRender = {
}

export type NavLink = {
    label: string;
    type?: 'route' | 'url' | 'scroll';

    current?: boolean;

    // can be url or route url within the same application 
    address?: string;

    // if you want any query params during the nav.  
    query?: any;
    disabled?: boolean;

    __hide?: boolean;
}



export type WatchVideosRender = {
    id?: string;
    title?: string;
    videos?: Asset[];

    isPlayerInitiated?: boolean;
}


/**
 * used in > sign-in, ... feature-cards , brand-cards 
 */
export type CardRender = {
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;

    cta?: CTA;

    // additional 
    texts?: string[];
    ctas?: CTA[];

    icon?: Asset;
    background?: Asset;

    link?: string;
    view?: boolean;


    __flipped?: boolean;
    popup?: InfoRender;
}

export type CrossProductsRender = {
    id?: string;

    loaded?: boolean;

    // moving this to 
    addons?: AddonProduct[];

    card_icon__VAS?: Asset;
    card_icon__insurance?: Asset;

    prod_image__VAS?: Asset;
    prod_image__insurance?: Asset;

    cta_text__ADD?: string;
    cta_text__REMOVE?: string;

    popups?: { [key: string]: DetailsPopupRender; }

    // store aem dump here > to patch into groups 
    assets?: {
        [key: string]: AddonProdType;
    }

    // will be used to iterate
    groups?: AddonProdType[];

    update$?: Subject<RenderOutput>;
}

export type AddonProdType = {
    type?: 'VAS' | 'insurance';

    // true > if count > 0
    view?: boolean

    card_icon?: Asset;
    card_title?: string;
    card_subtitle?: string;
    prod_image?: Asset

    count?: number;
}

export interface AddonProduct {

    id?: string;
    is_added?: boolean;

    type?: 'VAS' | 'insurance';


    card_title?: string;
    card_icon?: Asset;

    product_image?: Asset;
    product_description?: string;
    product_name?: string;
    product_type?: string;

    offer_price?: number;
    actual_price?: number;
    price_description?: string;

    popup?: DetailsPopupRender;



    // internal > will be used 



    // from Addon response 
    premiumAmt?: string;        // "2800",
    insuranceProduct?: string;        // "HDFC GROUP TERM INSURANCE",
    coverageAmt?: string;       // "165242",
    policyTenure?: string;        // "1",
    insuranceType?: string;       // "Life Insurance",
    externalId?: string;        // "Insurance_006",
    CMSBenefitsExclusions?: string;       // "https://cms-api.bajajfinserv.in/content/bajajfinserv/bajaj-super-app/in/en/global-information/bundled-cross-sell-3-dots/life-insurance/v1/hdfc-group-term-insurance/product-info",
    CMSFAQs?: string;       // "https://cms-api.bajajfinserv.in/content/bajajfinserv/bajaj-super-app/in/en/global-information/bundled-cross-sell-3-dots/life-insurance/v1/hdfc-group-term-insurance/faq",
    CMSHealthDeclaration?: string;        // "https://dynamicbanners.bajajfinserv.in/TnC/HDFCGoodHealthGTI",
    CMSTermsConditions?: string;        // "https://dynbanners.bajajfinserv.in/TnC/HDFCGroupTermInsuranceTnC",
    CMSUntickBottomDrawer?: string;       // "{\"popuptext\":[{\"text\":\"Provide Life cover at a nominal cost\"},{\"text\":\"Lump sum payout to nominee in case of sudden death\"},{\"text\":\"Hassle-free issuance without any medicals\"}]}"

    // ui end (UI processing)
    selected?: boolean;
    deselectData?: AddonProductInfo;
    disp_policyTenure?: string;


    prodType?: string;               // "Life Insurance",
    prodName?: string;               // "HDFC GROUP TERM INSURANCE",
    premium?: string;              // "2800",
    coverage?: string;               // "165242",
    tenure?: string;               // "1",
    insType?: string;              // "Life Insurance",
    insProd?: string;              // "HDFC GROUP TERM INSURANCE",
    insComp?: string;              // "HDFC",
    sumInsured?: string;               // "165242",
    declanOfGoodHealth?: string;               // "Y",
    cppType?: string;              // "Single",
    chargeCollectionMethod?: string;               // "Deduct from disbursement",
    isSelected?: boolean;               // true,
    criticalIllness?: string;              // "N",
    pennantFeeCode?: string;               // "HDFCGTI",
    insuranceUniqueId?: string;              // null,
    typeOfCharge?: string;
    mobileNumber?: string;               // "8087999562",
    loanAmount?: number;               // 236000,
    dob?: string;              // "02/10/1988",
    offerId?: string;              // "D5E98EF3-C7E1-4317-9861-2AFB08FC3E44"


    prodDescription?: string;   // "CPP DOCTOR SHIELD",
    // prodName?: string;   // "General Insurance",
    oneTimePremium?: string;   // "5999",
    // coverage?: string;   // "2000000",
    // tenure?: stri;   // "72",
    key?: string;   // "CPP_DOCTOR_SHIELD_24",
    // prodType?: string;   // "Insurance"

}

export interface AddonProductInfo {
    popuptext: { text?: string; bullet?: string; }[];
}




// templates 


// has all the elements > just for a collection preview 
export type Elements = {
    // plp 
    navHeader?: NavHeaderRender;
    tabs?: TabsHorizRender;
    textRatings?: TextRatingsRender;
    preAppBanners?: BannersHorizRender;
    preAppBannersMapp?: BannersHorizRender[];
    results?: ResultsRender;
    adBanners?: BannersHorizRender[];
    bestSellers?: BannersHorizRender[];
    exclusiveBanners?: BannersHorizRender;
    stripBanner?: StripBannerRender;
    stripBanner_2?: StripBannerRender;
    checkCibil?: CTA;
    faqs?: XFAQRender;

    rating?: RatingRender;

    // pdp
    relations?: RelationsRender;
    carts?:CartsRender;
    existing?: PdpExistingRender
    // textRatings?: TextRatingsRender;
    // preAppBanners?: BannersHorizRender;
    loanCalc?: LoanCalcRender;
    loanExtras?: LoanExtrasRender;
    addons_CHP?: AddonsRender;
    addons_VAS?: AddonsRender;
    loanSummary?: LoanSummaryRender;
    featureIcons?: IconFeaturesRender;

    // features above card summary
    cardSummary?: CardSummaryRender;
    mainFeatures?: WrapCards;
    featureCards?: WrapCards;
    brandCards?: WrapCards;
    cardCalc?: any;
    cardStatus?: CardRender;
    cardAction?: CardRender;

    featuresAndBenefits?: FeaturesRender;
    eligibility?: any;
    howToApply?: any;
    // adBanners?: BannersHorizRender;
    tabularCharges?: any;
    tabularVariants?: any;
    search?: any;
    // faqs?: XFAQRender;
    // stripBanner?: StripBannerRender;
    // results?: ResultsRender;
    videos?: any;
    disclaimer?: ParagraphContent;


    // elements 
    paragraph?: ParagraphContent;
    paragraphCollection?: ParaCollection;
    bulletList?: ParaCollection;
    bulletParas?: ParaCollection;
    textPara?: ParaCollection;

    chargesTabular?: TabularContent;
    variantsTabular?: TabularContent;
    variantsTabularDesktop?: TabularContent;

    navigator?: NavigatorRender;
    redirect?: NavigatorRender;
    watchVideos?: WatchVideosRender;

    signIn?: CardRender;
    cartResume?: CardRender;

    crossProducts?: CrossProductsRender;
    stickyCTA?: CTA;

    constriants?: XConstraint[];

    offerBanner?: StripBannerRender;
    infoPopup?: InfoRender;
    dialogCTA?: DialogCTARender;
    navScroll?: NavScrollRender;
    t_and_c_popup?: TermsAndConditionsRender;


    // helper elements > not direct renders 
    loanCalcNudge?: ValidationError;
    emicalculator?: emicalc;

    video_list?: Asset[];
    ExitPageScenario?:{
        header_1?:string,
        header_2?:string,
        summary_1?:string,
        summary_2?:string
    };

}

export type PLPTemplate = {
    id?: string;
    offerBanner?: StripBannerRender;
    existing?: PdpExistingRender,

    navHeader?: NavHeaderRender;
    tabs?: TabsHorizRender;
    signIn?: CardRender;
    cartResume?: CardRender;
    relations?: RelationsRender;
    carts?:CartsRender;
    textRatings?: TextRatingsRender[];
    textRatingsMapp?: { [key: string]: TextRatingsRender[] };

    preAppBanners?: BannersHorizRender;
    preAppBannersMapp?: BannersHorizRender[];
    stripBanner_1?: StripBannerRender;
    results?: ResultsRender;
    adBanners?: BannersHorizRender[];
    bestSellers?: BannersHorizRender[];
    exclusiveBanners?: BannersHorizRender;
    TrendingBanners?: BannersHorizRender;
    TopBrandsBanners?: BannersHorizRender;
    stripBanner_2?: StripBannerRender;
    checkCibil?: CTA;
    faqs?: XFAQRender;

    // additional > from other modules can be added here 



    // HL 
    OfferBanners?: BannersHorizRender;
    navigator?: NavigatorRender;
    redirect?: NavigatorRender;
    watchVideos?: WatchVideosRender;

    crossProducts?: CrossProductsRender;
    constriants?: XConstraint[];
    disclaimer?: DisclaimerRender;

}


export type PDPTemplate = {
    id?: string;

    offerBanner?: StripBannerRender;
    stripsMapp?: { [key: string]: StripBannerRender };
    cart?: Result;
    relations?: RelationsRender;
    carts?:CartsRender;
    stripBanner_1?: StripBannerRender;

    existing?: PdpExistingRender
    textRatings?: TextRatingsRender;
    preAppBanners?: BannersHorizRender;
    loanCalc?: LoanCalcRender;
    depositCalc?: DepositCalcRender;
    loanExtras?: LoanExtrasRender;
    crossProducts?: CrossProductsRender;

    loanSummary?: LoanSummaryRender;
    depositSummary?: DepositSummaryRender;
    featureIcons?: IconFeaturesRender;

    // fd interest 

    roiTable?:RoiTable;
    RoiTableMapp?:{[key:string] : RoiTable}
    
    // features above card summary

    mainFeatures?: WrapCards;
    cardSummary?: CardSummaryRender;
    cardSummaryMapp?: { [key: string]: CardSummaryRender };
    featureCards?: WrapCards;
    brandCards?: WrapCards;
    cardStatus?: CardRender;
    cardStatusMapp?: { [key: string]: CardRender };
    cardAction?: CardRender;
    cardActionMapp?: { [key: string]: CardRender };

    cardCalc?: cardscalculator;

    featuresAndBenefits?: FeaturesRender;
    eligibility?: any;
    howToApply?: any;

    adBanners?: BannersHorizRender[];

    tabularCharges?: TabularContent;
    tabularVariants?: TabularContent;

    search?: any;
    faqs?: XFAQRender;

    stripBanner_2?: StripBannerRender;
    results?: ResultsRender;
    watchVideos?: WatchVideosRender;
    disclaimer?: DisclaimerRender;


    // content collection implementations 

    featuresContent?: ContentCollectionRender;
    eligibityContent?: ContentCollectionRender;
    howToContent?: ContentCollectionRender;
    chargesTabularContent?: ContentCollectionRender;
    comparisionTabularContent?: ContentCollectionRender;

    // all these can be in an array > in PDP template 
    contents?: ContentCollectionRender[];
    tabulars?: ContentCollectionRender[];

    navigator?: NavigatorRender;
    redirect?: NavigatorRender;

    // sticky action 
    stickyCTA?: CTA;
    stickyCTAMapp?: { [key: string]: CTA };
    constriants?: XConstraint[];
    tmp?: GenericRender[];

    signIn?: CardRender;
    callback?: DialogCTARender

    navScroll?: NavScrollRender;
    navScroll__mapp?: { [key: string]: NavScrollRender }
    emicalculator?: emicalc;

    checkCibil?: CTA;

    loaders?: {
        [key: string]: CardRender;
    }

    tabs_radio?: tabradiorender;
    gold_loan_details?: goldloandetails;
     ExitPageScenario?:{
        header_1?:string,
        header_2?:string,
        summary_1?:string,
        summary_2?:string
    };
    proceedCTA?: ProceedCTARender;
    customer_reviews?:CustomerReviewsRender




}


export type NavScrollRender = {
    id?: string;
    tabs?: TabsHorizRender;

    // project of tabs > but with addresses 
    links?: NavLink[];


    cta?: CTA;

    // to scroll to the top of the page 
    iconCTA?: CTA;

    view?: boolean;
    viewBy?: 'scroll' | 'element_in_view';
    viewScrollValue?: number;
    // id of the element in view > to trigger the nav 
    // shows up at in_view of some element
    showAt?: string[];

    // hides at in_view of some element
    hideAt?: string[];

    update$?: Subject<boolean>;
    preventDefault?: boolean;

    refresh$?: Subject<boolean>;

    // stack
    __stack_in_view?: string[];
}

export type SignInRender = {
    id?: string;
    mob?: string;
    otp?: string;

    // other > if any 
    [key: string]: string;
}

export type GenericRender = {
    id?: string;
    _in_view?: boolean;
    view?: boolean;
}

export type CONTENT = {
    ELEMENTS?: Elements;
    PLP?: PLPTemplate;
    PDP?: PDPTemplate;
}



// FUNCTIONAL 
export type LoanCalcRender = {
    id: string;
    // content persp 
    amount: {
        amount_input_label?: string;
        limits_text?: string;

        error_text?: string;


        // functionality 
        default_value?: number;
        validations?: Validator[];

        validationNudge?: ValidationError;
        max_digits?: number
    },

    tenure: {
        // content 
        selection_text?: string;
        selection_subtext?: string;

        initial_selection_text?: string;
        initial_selection_subtext?: string;

        // functionality 
        tenure_list?: Tenure[];
        initial_tenure_list?: Tenure[];

        // not using the value but placing it 
        default?: number;

        displayUnit?: 'month' | 'year';

        hide_tooltip?: boolean;

        __range_text?: string;
    },

    variants: {
        disabled?: boolean;
        selection_text?: string;

        list?: LoanVariant[];
        hide_tooltip?: boolean;
    }

    options?: {
        enabled?: boolean;
        selection_text?: string;
        bottom_text?: string;
        list?: LoanOption[];
        __hide_options?: boolean;
    }

    disclaimer?: DisclaimerRender;

    principal_amount_text:string;
    Total_intrest_text:string;
    Total_amount_Text:string;
    Emi_cal_pretext?:string;
    
    
    popups?:{
        tenure?:InfoRender;
        initialTenure?:InfoRender;
        variants?:InfoRender;
        options?:InfoRender;
    }
    IconFeatures?:IconFeaturesRender

}

export type LoanSummaryRender = {
    id?: string;
    title?: string;
    subtitle?: string;

    // aem link or something else 
    t_and_c_label?: string;
    t_and_c_content?: TermsAndConditionsRender;
    cta?: CTA;
    t_and_c_islink?:boolean;
    callback?: DialogCTARender;
    requested_loan_amount?: string;
    text_A?: string;
    chargestext_B?: string;
    amountcredited?: string;
    tooltips?: InfoRender[];
    t_and_c_link?:string;
    disclaimer?: DisclaimerRender;

    popups?: { [key: string]: InfoRender };

    // use these for the labels and correct few spells 
    is_revised_summary?: boolean;
    revised_loansummary?: {
        title?: string;
        loan_Variant?: string;
        loan_amount?: number;
        lnnualised_roi?: number;
        Tenure?: number;
        emi_amount?: number;
        annualise_roi_text?:string;
    }
    cardLimitText?:string;
    __hideloansummary?:boolean
    // goes directly to the element 
    // loan?: LoanDetails;
    // deposit?: any;
    // cardLimitText?: string;

}

export type RoiTable = {
    id?:string;
    view?:boolean;
    heading?:string;
    subheading?:string;
    downloadLink?:string;
    list?:InterestTable[]

}

export type InterestTable = {
    tableContent?: string;
    features?: InterestTableFeatures[];
    footer?: string;
}

export type InterestTableFeatures = {
    displayIcon?: string;
    icon?: string;
    text?: string
}

export type DepositCalcRender = {
    id: string;
    // content persp 
    amount: {
        amount_input_label?: string;
        limits_text?: string;

        error_text?: string;


        // functionality 
        default_value?: number;
        validations?: Validator[];

        validationNudge?: ValidationError;
        max_digits?: number
    },

    category?: {
        disabled?: boolean;
        selection_text?: string;
        default?: CustCategory
        list?: CustCategory[];
        hide_tooltip?: boolean;
    },

    ageGroup?: {
        disable?: boolean;
        selection_text?: string;
        default?: AgeGroup;
        list?: AgeGroup[];
        hide_tooltip?: boolean;

    },

    tenure: {
        // content 
        selection_text?: string;
        selection_subtext?: string;
        special_subtext?:string;
        special_subtext_cta?:string;
        special_subtext_icon?:string;

        // functionality 
        tenure_list?: DepositTenure[];

        // not using the value but placing it 
        default?: number;

        displayUnit?: 'month' | 'year';

        hide_tooltip?: boolean;

        __range_text?: string;
    },

    variants: {
        disabled?: boolean;
        selection_text?: string;

        list?: PayoutVariant[];
        hide_tooltip?: boolean;
    }

    options?: {
        enabled?: boolean;
        selection_text?: string;
        bottom_text?: string;

        list?: LoanOption[];
    }

    deposit_options?: {
        // content 
        selection_text?: string;
        selection_subtext?: string;

        // functionality 
        date_list?: DepositDay[];

        // not using the value but placing it 
        default?: DepositDay;

        displayUnit?: 'month';

        hide_tooltip?: boolean;

    }



    disclaimer?: DisclaimerRender;

    principal_amount_text?: string;
    Total_intrest_text?: string;
    Total_amount_Text?: string;
    Minor_Option_1?: string;
    Minor_Option_2?: string,


    popups?: {
        tenure?: InfoRender;
        // initialTenure?:InfoRender;
        variants?: InfoRender;
        deposit_options?: InfoRender;
        roiTabel?: InfoRender;

    }

}

export type DepositSummaryRender = {
    id?: string;
    title?: string;
    subtitle?: string;

    // aem link or something else 
    t_and_c_label?: string;
    t_and_c_content?: InfoRender;
    cta?: CTA;

    callback?: DialogCTARender;
    requested_loan_amount?: string;
    text_A?: string;
    text_B?: string;
    total_Sum?: string;
    tooltips?: InfoRender[];

    disclaimer?: DisclaimerRender;

    popups?: { [key: string]: InfoRender };

    // use these for the labels and correct few spells 
    is_revised_summary?: boolean;
    revised_loansummary?: {
        title?: string;
        loan_Variant?: string;
        loan_amount?: number;
        lnnualised_roi?: number;
        Tenure?: number;
        emi_amount?: number;
    }
    // goes directly to the element 
    // loan?: LoanDetails;
    // deposit?: any;
}

export type DialogCTARender = {
    id?: string;
    title?: string;
    description?: string;
    cta?: CTA;

    is_after?: boolean;
    is_after_disabled?: boolean;
    after_version?: {
        title?: string;
        description?: string;
        CTAs?: CTA[];
    }
    hide?: boolean;
    phoneNo?: string;
}

export type ProceedCTARender = {
    id?: string;
    title?: string;
    subtitle?: string;

    // aem link or something else 
    t_and_c_label?: string;
    t_and_c_content?: TermsAndConditionsRender;
    cta?: CTA;
    clicked?:boolean;
}
// to be move into helpers / flow 
export type LoanDetails = {
    inValid?: boolean;
    // LOAN DETAILS 
    amount?: number;
    // currency
    amount_form_value?: string;
    roi?: number;
    variant?: LoanVariant;

    total_tenor?: number;
    initial_tenor?: number;
    subsequent_tenor?: number;

    total_emi?: number;
    initial_emi?: number;
    subsequent_emi?: number;

    revised_total_emi?: number;
    revised_initial_emi?: number;
    revised_subsequent_emi?: number;

    interest?: number;
    interest_by_total?: number;
    total_amount?: number;


    loan_type?: string;
    loan_variant_label?: string;

    // for loan summary page as well 
    totalLoanAmount?: number;
    addOns?: AddonProduct[];
    charges?: LoanCharges[];
    addCharges?: LoanCharges[];
    deductCharges?: LoanCharges[];

    // used only for displaying > will not be included in calc.
    displayCharges?: LoanCharges[];

    // charges 
    total_deductions?: number;

    processing_fee?: number;
    flexi_fee?: number;
    stamp_duty?: number;
    bpi?: number;
    doc_charges?: number;

    chargesMapp?: any;


    interestType?: string;
    emiDueDate?: string; // from read 
    methodOfInterestCalc?: string; // ?
    netDisbAmt?: number;

    // amount selected for disbursement
    seltdDisbAmt?: number;

    // the remaining after disbursal 
    furtherDisbAmt?: string;

    isHybrid?: boolean;
    isFlexi?: boolean;

    // internal 
    lan?: string;


    // helpers
    // reload__skip_options > will reload the loan config but will not reload the options ocnfig
    $update?: Subject<'init' | 'option' | 'reload' | 'reload__soft' | 'reload__hard' | 'update' | 'show_amount' | 'reload__skip_options'>;

    xcalc?: XLoanCalculator;
    constraint?: LOAN__CONSTRAINT;
    config?: LOAN__CONFIG;

    is_multiple_constraints?: boolean;
    constraints?: LOAN__CONSTRAINT[];

    // store of option.journeyType >> constraints 
    constraints__mapp?: { [key: string]: LOAN__CONSTRAINT[] };

    option?: LoanOption;

    // option to be loaded from parent
    __option?: LoanOption;

    // LIMITS and VALIDATIONS 
    limits?: Bounds;

    __addons_within_charges?: boolean;


    // helpers 
    __in_focus?: boolean;
    __amount_focused_in?: number;
    __amount_focused_out?: number;

    // initial load > after page init v2 
    __loaded?: boolean;
    
    charges_req?: {amount: number; tenure: number; variant?: VARIANTS};
    addons_req?: {amount: number; tenure: number; variant?: VARIANTS};
    __offer_amount_for_card?:string;
}

//Deposit Related Renders

export type DepositDetails = {
    inValid?: boolean; //
    // LOAN DETAILS 
    amount?: number;
    // currency
    amount_form_value?: string;
    roi?: number; //Calculator Output
    interestAmt?: number; //Calculator Output
    interest_by_total?: number; // Calculate Manually | Needed for bar representation
    maturityAmt?: number;//Calculator Output

    total_tenor?: number;//User Selected Tenor Number Value

    cust_category?:CustCategory;
    age_group?:AgeGroup;
    selectedTenor?:DepositTenure
    variant?: PayoutVariant;
    _age?:string;
    payoutsMapp?:PayoutVariant[];//Not Used


    // SDP
    deposit_day?:DepositDay;
    no_of_deposit?:number; // No of Deposits
    start_date?:string; // Start Date of SDP Month Year
    maturity_date?:string; // Maturity Date Of SDP/FD Date

    //Helper Flags and String
    maturityDateDisplay?:string
    _checkbox__focusout?:boolean;
    invest_yourself?:boolean; // Are you investing yourself Flag > Need to set Open FD || Schedule a Call
    schedule?:boolean; // Schedule Call Flag > Passed in FDInsert
    appState?:string;

    //Broker Data
    oldBrokerData?:BrokerData;
    BrokerData?:BrokerData;
    isBrokerEditable?:boolean;
    isBroker?:boolean;
    inValidBrokerOption?:boolean;
    mainCTAtouched?:boolean;




    // Need to check if Below variables are need for Deposit Summary > Remove During Code Cleanup
    loan_type?: string;
    loan_variant_label?: string;

    // for loan summary page as well 
    totalLoanAmount?: number;
    addOns?: AddonProduct[];
    charges?: LoanCharges[];
    addCharges?: LoanCharges[];
    deductCharges?: LoanCharges[];

    // used only for displaying > will not be included in calc.
    displayCharges?: LoanCharges[];

    // charges 
    total_deductions?: number;

    processing_fee?: number;
    flexi_fee?: number;
    stamp_duty?: number;
    bpi?: number;
    doc_charges?: number; 

    chargesMapp?: any;


    // interestType?: string;
    // emiDueDate?: string; // from read 
    // methodOfInterestCalc?: string; // ?
    // netDisbAmt?: number;

    // amount selected for disbursement
    // seltdDisbAmt?: number;

    // the remaining after disbursal 
    // furtherDisbAmt?: string;

    isHybrid?: boolean;
    isFlexi?: boolean;

    // internal 
    // lan?: string;


    // helpers
    $update?: Subject<'init' | 'reload' | 'update' | 'show_amount' | 'flag' | 'patch' | 'show_checkbox' | 'patch_hard' | 'patch_soft' |'invalidBroker'| 'patchBroker' | 'patchResumeBroker'>;

    xcalc?: XLoanCalculator;
    constraint?: LOAN__CONSTRAINT;
    config?: LOAN__CONFIG;

    is_multiple_constraints?: boolean;
    constraints?: LOAN__CONSTRAINT[];
    
    option?: LoanOption;

    // LIMITS and VALIDATIONS 
    limits?: Bounds; //

    __addons_within_charges?: boolean;


    // helpers 
    __in_focus?: boolean;//
    __amount_focused_in?: number;
    __amount_focused_out?: number;

    // initial load > after page init v2 
    __loaded?: boolean;
    
    charges_req?: {amount: number; tenure: number; variant?: VARIANTS};
    addons_req?: {amount: number; tenure: number; variant?: VARIANTS};
}

export type PayoutVariant = {
    // internal name 
    id: PAYOUTVARIANTS;
    isDisabled: boolean;

    label?: string;
    roi?: number;
    interestAmt?: number;
    maturityAmt?: number;
    description?: string;
    maturityMonth?: string

    notApplicable?: boolean;

    disabled_text?: string;
}



export type LoanCharges = {
    id?: 'documentation_charges' | 'processing_fee' | 'flexi_fees' | 'stamp_duty' | 'bpi' | 'govt_charges';
    chargeCollectionMethod?: "Add to loan amount" | "Deduct from disbursement";          // "Deduct from disbursement",
    chargeName?: string;          // "Insurance",
    chargeCalType?: string;         // "HDFC GROUP TERM INSURANCE",
    chargeAmt?: number;         // "2800"

    chargeRate?: string;    // null,
    typeOfCharge?: string;  // "I",
    pennantFeeCode?: string;    // "MAXBHI"

    // __internal 
    __disabled?: boolean;
    __asLabel?: boolean;
    __label?: string;
    __show_info_incharges?: boolean;
}

export type Tenure = {
    // mostly the same as value > value will be used 
    display?: string;
    value: number;
    disabled?: boolean;
    checked?: boolean;
}

export type DepositTenure = {
    // mostly the same as value > value will be used 
    display?: string;
    value: number;
    disabled?: boolean;
    checked?: boolean;
    nudge?:boolean;
    nudgeText?:string;
    roi?:number;
    ON_MATURITY ?:string,
    YEARLY ?:string,
    HALF_YEARLY ?:string,
    QUATERLY ?:string,
    MONTHLY ?:string,
    isDefault ?:boolean
}

export type DepositDay = {
    //Used for SDP Monthly payment
    display?: string;
    value: number;
    disabled?: boolean;
    checked?: boolean;
}

export type CustCategory = {
    display?: string;
    value: string;
    disabled?: boolean;
}

export type AgeGroup = {
    display?: string;
    value: string;
    disabled?: boolean;
    checked?: boolean;
}

export type LoanVariant = {
    // internal name 
    id: VARIANTS;
    isDisabled: boolean;

    label?: string;
    emi?: EMI;

    subsequent_emi?: EMI;
    initial_emi?: EMI;
    description?: string;

    notApplicable?: boolean;

    disabled_text?: string;
}

export type LoanOptionInfo = {
    // info about
    id?: string;

    title?: string;
    subtitle?: string;

}


export type EMI = {
    value: number;
    description?: string;
    tenor?: number;
}

export type ValidationError = {

    // name of the error 
    id?: string;
    type?: 'soft' | 'hard';

    enabled?: boolean;
    view?: boolean;


    validation?: Bounds;


    ctasEnabled?: boolean;

    // icon, title, cta
    soft?: CardRender;
    hard?: CardRender;

    // default is once > will show up once it is invalid > and then stays up 
    viewType?: 'invalid' | 'once';
}

export type LoanOption = {
    // internal value
    id: string;
    selected?: boolean;
    disabled?: boolean;

    label?: string;
    amount?: LoanOptionInfo;
    tenure?: LoanOptionInfo;

    // additional 
    description?: string;


    offer?: OfferOption;

    __load_tenure_range?: boolean;
    __invalid_option?:boolean
}



export type RelationsRender = {
    id?: string;
    view?: boolean;
    header_text?: string;

    list?: relation__loan | relation__card | relation__deposit | relation__insurance[];
    // list: Array<CustRelationRender>;

}
export type CartsRender = {
    id?: string;
    view?: boolean;
    header_text?: string;
    count?:number;
    list?: CartItem[];
    // list: Array<CustRelationRender>;

}

export type CustRelationRender = {
    title?: string;
    icon?: string;

    ref_id?: string;
    amount?: string;
    emi?: string;
    progress?: Progress;

    ctas?: CTA[];
}


// POPUPS 

export type InfoRender = {
    id?: string;

    title_img?: string;
    title?: string;
    description?: string;
    cta?: CTA;

    icon?: Asset;
    background?: Asset;
    // background?: Asset;
    // overlay?: Asset;


    type?: 'info' | 'cc' | 'roi';
    cc_render?: ContentCollectionRender;
    roi_render?:RoiTable;

}


export type DetailsPopupRender = {
    id?: string;

    title?: string;
    description?: string;

    icons?: IconFeaturesRender;

    content__title?: string;
    content__cc?: ContentCollectionRender;

    is_download_section?: boolean;
    download__icon?: Asset;
    download__text?: string;
    download__ref?: string;

    download__CTA?: CTA;

    cta?: CTA;

}

export type SnackBarRender = {
    title?: string;
    action?: string;
    duration?: number;
}

export interface Data {
    [key: string]: any;
}

export type DisclaimerRender = {
    id?: string;
    view?: boolean;
    title?: string;
    content?: string;
    background?: string;

    cta?: CTA;
    // background?: Pixel;
}

export type vedio = {
    videos: Asset[]
}

export type emicalc = {
    Title?: string;
    Subtitle?: string;
    icon?: Asset
}



// CC related element renders > can be re-used 
export type CardSummaryRender = {
    id?: string;
    view?: boolean;
    displayText?: string;
    subtitle?: string;
    amount?: number;
    cta?: CTA;
    tncText?: string
}

export type WrapCards = {
    id?: string;
    view?: boolean;

    title?: string;
    cards?: CardRender[];
}

export type cardscalculator = {
    id?: string
    Title?: string
    Description?: string
    Calculator_data?: Calcdata[]
    ann_saving_title?: string
    ann_saving_amt?: number
    cta_desc?: string
    cta?: string
    view?: boolean
}
export type Calcdata = {
    heading?: string
    subheading?: string
    savedamt?: number
    min_saving?: number
    max_saving?: number;
    popup?: InfoRender;
}

export type ResultsWrap = {
    id?: string
    title?: string;
    description?: string;
    footerText?: string;

    list?: Result[];
}

export type tabradiorender = {
    is_loan_selected?: boolean
    is_gold_selected?: boolean
    loan_label?: string
    gold_label?: string

}

export type goldloandetails = {
    id?: string
    loan_mode?: boolean
    gold_mode?: boolean
    loan_amount?: goldLoanCalcRender
    gold_loan_rate?:number;


    gold_weight?: goldweightCalcRender
    cta?: CTA
    error_text?: string
    valid?: boolean
    Know_more?:knowmorepopup
    $update?: Subject<'init'|'reload'>;

}
export type goldLoanCalcRender = {
    id: string;
    // content persp 
    loan_amount?: number;
    loan_focusout_amount?: number
    display_amount?: string

    amount: {
        amount_input_label?: string;
        limits_text?: string;

        error_text?: string;


        // functionality 
        validations?: Validator[];

        validationNudge?: ValidationError;
        max_digits?: number;
        limits?: Bounds
    }
}
export type goldweightCalcRender = {
    id: string;
    // content persp 
    gold_weight?: number;
    gold_focusout_amount?: number
    display_weight?: string

    weight: {
        weight_input_label?: string;
        limits_text?: string;

        error_text?: string;


        // functionality 
        validations?: Validator[];

        validationNudge?: ValidationError;
        max_digits?: number;
        limits?: Bounds
    }
}
export type knowmorepopup={
    title?:string
    desc?:string
    img?:Asset
}

export type BrokerData = {
    code?:string
    name?:string
}
export type CustomerReviewsRender={
    id:string
    heading?:string;
    customers?:{
        customer_count?:string
        label?:string
    }
    playstore_rating?:{
        rating?:any
        label?:string
    }
    reviews?:{
        review_count?:string
        label?:string
    }
    review_content?:reviewcontrender[]
    hide?:boolean

}
export type reviewcontrender={
    cust_name?:string
    review_date?:string
    rating?:any
    review_description?:string
}
