import { LOAN__CONFIG, LOAN__CONSTRAINT } from '../config/calculator.config';
import { Result, Bounds, JOURNEY } from './helper.model';
import { StripBannerRender } from './render.model';


export type queryParams = {
    utms?: UTMs;
    broker?: BROKER;
    [key: string]: any;
  }


export type UTMs = {
    utmmedium?: string;
    utmsource?: string;
    utmcampaign?: string;
    utmcontent?: string;
}

export type BROKER = {
    brokerId?: string;
}

export interface CartItem {
    mobileNo?: string;              // "",
    appId?: string;               // "cecade92-86b5-479a-a91c-1e9b50b742de",
    prod?: string;              // "SAL_NO_Offer",
    prodDesc?: string;              // "salaried loan",
    appLink?: string;               // null,
    img?: string;               // null,
    channel?: string;               // "3in1",
    prodProps?: string;               // "&#x20B9;5555555 | 42 Months"
    resumeFlag?: boolean;              // true


    appVersion?: string;                // null,
    nudgeText?: string;             // null,
    recordTime?: number;                // 1707899422,
    schemeId?: string;              // null,
    id?: string;                // "0205f991-8aee-46c6-8fa7-3b84bbe75dd7",
    partnerCode?: string;               // null,
    associateCode?: string;             // null,
    loanApplicationNo?: string;             // null,
    customerName?: string;              // null,
    pan?: string;               // null,
    branch?: string;                // null,
    state?: string;             // null,
    companyName?: string;               // null,
    applicationDateTime?: string;               // null,
    variant?: string;               // null,
    emi?: string;               // null,
    roi?: string;               // null,
    amt?: string;               // "5555555",
    tenure?: any;                // null


    // internal 
    __config?: CartConfig;
    __render?: Result;

}




export interface OfferJson {
    mobile?: string;
    id?: string;
    icorsOfferType?: string;
    icorsDate?: string;
    systemModstamp?: string;
    amount?: string;
    flag?: string;
    poName?: string;
    pinCode?: string;
    prospectId?: string;
    product?: string;
    processSegmentation?: string;
    offerIrr?: string;
    PQofferIrr?: string;
    paEmi?: string;
    pqEmi?: string;
    offerBatchId?: string;
    customerBatchId?: string;
    emailId?: string;
    email?: string;
    offerId?: string;
    customerId?: string;
    emicardNumber?: string;
    cardGroup?: string;
    bvCode?: string;
    loanType?: string;
    bt?: string;
    displayName?: string;
    twoYearPremium?: string;
    threeYearPremium?: string;
    oneYearPremium?: string;
    partnerName?: string;
    offerStatus?: string;
    createdDate?: string;
    dealId?: string;
    lan?: string;
    emiAmount?: string;
    nextEmiDueDate?: string;
    productCategory?: string;
    model?: string;
    manufacturer?: string;
    invoiceNo?: string;
    invoiceDate?: string;
    invoiceAmount?: string;
    serialNo?: string;
    insuranceProductSelection?: string;
    expiryDate?: string;
    offerDisplayMedium?: string;
    customerName?: string;
    offerAmt?: string;
    offerType?: string;
    schemeCode?: string;
    tenure?: string;
    IntegererestCharge?: string;
    processingFee?: string;
    roi?: string;
    offerRoi?: string;
    offerRoiAnnual?: string;
    emi?: string;
    productId?: string;
    supplierId?: string;
    offerPriority?: string;
    ivrFlag?: string;
    displayPriority?: number;
    maxTenure?: string;
    irr?: string;
    maxEmiLimitPerMonth?: string;
    stampDuty?: string;
    personalEmailAddress?: string;
    dateOfBirth?: string;
    panNumber?: string;
    bankName?: string;
    bankAccountNumber?: string;
    employerName?: string;
    officialEmailId?: string;
    officeCity?: string;
    officePinCode?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    city?: string;
    state?: string;
    employmentType?: string;
    ffrChargesForPltb?: string;
    cppChargesForPltb?: string;
    customerId1?: string;
    cardSubType?: string;
    cmsCardType?: string;
    custRiskClassification?: string;
    customerBranchid?: string;
    sourceDealer?: string;
    residenceAddress1?: string;
    dob?: string;
    cibilScore?: string;
    cibilDate?: string;
    empName?: string;
    gender?: string;
    vcNum?: string;
    sourceId?: string;
    oldSourceId?: string;
    sourceName?: string;
    orAdditionalFilter?: string;
    andAdditionalFilter?: string;
    preApprovedAmount?: string;
    preQualifiedAmount?: string;
    grId?: string;
    preferredLanguage?: string;
    currentResidencePincode?: string;
    currentResidenceCity?: string;
    currentResidenceState?: string;
    offerValidity?: string;
    offerDisposition?: string;
    offerStage?: string;
    riskHoldReason?: string;
    offerProduct?: string;
    sourcingBranch?: string;
    businessHoldReason?: string;
    pan?: string;
    banner?: string;
    cta?: boolean;
    mainStatusCodeTc?: string;
    pinCodeC?: string;
    activeFlag?: string;
    segment?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    panCardNumber?: string;
    offerExpiryDate?: string;
    lastLoanAmount?: string;
    loanDisbursedDate?: string;
    baseProduct?: string;
    isCreditCardHolder?: string;
    processSegmentationPltb?: string;
    monthOfOffer?: string;
    programType?: string;
    financedAmount?: string;
    sourceOfData?: string;
    campaignLot?: string;
    ownerId?: string;
    noOfCreditCardsBureau?: string;
    cibilNotes?: string;
    companyCategory?: string;
    fraudCustomersFlag?: number;
    subProfession?: string;
    maxLoanVariant?: string;
    maxLoanTenor?: string;
    origBus?: string;
    interestCharge?: string;
    fddTelebinding?: string;
    productMake?: string;
    emiCardLimit?: string;
    emiCard?: string;
    baseType?: string;
    groupCode?: string;
    dealerCode?: string;
    custType?: string;
    offerView?: number;
    offerCall?: number;
    personalizedOfferText?: string;
    offerName?: string;
    channelFlag?: string;
    offerFlag?: string;
    startDate?: string;
    end_date?: string;
    minLoanAmount?: string;
    maxLoanAmount?: string;
    brand?: string;
    assetCategoryId?: string;
    skuId?: string;
    tncSummary?: string;
    detailedTncLink?: string;
    chargeApplicationByDefault?: string;
    cashback_byAmount?: string;
    freeTextField?: string;
    cashbackByPercentage?: string;
    freebiename?: string;
    type?: string;
    promoVisibility?: string;
    promoSequencing?: string;
    primaryOfferText?: string;
    secondaryOfferText?: string;
    shortOfferText?: string;
    shortTnc?: string;
    idNum?: string;
    marketplaceTagsBrand?: string;
    marketplaceTagsProduct?: string;
    marketplaceTagsPrice?: string;
    rblApplicationRequired?: string;
    sms?: string;
    instaIdentifier?: string;
    customerSegmentType?: string;
    prodMastCode?: string;
    prodCategoryCode?: string;
    pocketProductCode?: string;
    enquiryDate?: string;
    enquirySource?: string;
    programName?: string;



    // UI helpers 
    __is_applied?: boolean;
    __render?: StripBannerRender;
    __amount?: string;
    __roi?: number;
    __emi?: number;
    __tenure?: number;
    __emp_type?: 'Salaried' | 'Self Employed';
    __config?: OfferConfig;
    __SKU_ID?: string;

    __limits?: Bounds;
}



export interface DemogDetails {
    id?: string;
    firstName?: string;
    lastName?: string;
    dob?: string;
    panNo?: string;
    gender?: string;
    indivCorpFlag?: string;
    contactPersonName?: string;
    employmentType?: string;
    annualIncome?: string;
    compName?: string;
    mobile?: string;
    phone1?: string;
    email?: string;
    stdisd?: string;
    phone2?: string;
    area?: string;
    addressId?: number;
    cityName?: string;
    addressLine1?: string;
    addressLine2?: string;
    stateName?: string;
    pinCode?: string;
    addressType?: string;
    landMark?: string;
    addressLine3?: string;
    constitution?: string;
    mstConstId?: string;
    mstAddressTypeCode?: string;
    mstGenderCode?: string;
    mstCityId?: string;
    kycFlag?: string;
    gstnNumber?: string;
    dateOfIncorporation?: string;
    ckycnumber?: any;
    cname?: string;
    rekycflag?: string;
    age?: string;

    // "ETB" | "PTB" | "NTB";
    // custType?: string;
}


export interface KpiHelper {
    process?: string;
    subprocess?: string;
    module?: string;
    operationId?: string;
    statuscode?: any;
    apiVersion?: string;
}


export type CartMapp = {
    prod?: string[];
    resumeFlag?: boolean;
    journeyMapp?: {
        [key: string]: string;
    };
};


export type OfferConfig = {
    // identifer 
    id?: string;
    find?: OfferFilter;
    displayPriority?: number;

    // amount field 
    field__amount?: string;
    field__roi?: string;
    field__emi?: string;
    field__tenure?: string;

    
    // additional only (apart from offer)
    load?: {
        [key: string]: string;
    }
    
    //nudgetype 
    __nudgeType?: 'soft' | 'hard';
    __hideNudge?: boolean;

    // whether user can unapply offer > once it is applied
    // if irreversible ? cannot unapply offer > once applied 
    irreversible?: boolean;

    // for > 3PL type offers 
    options?: OfferOption[];
    // patches values into insert > whatever is found 
    // insertPatch?: any;
    journeyType?: string;
    __limits?: Bounds;

    __loan_roi?: Bounds[];
    __loan_constraint?: LOAN__CONSTRAINT;
    __loan_config?: LOAN__CONFIG;



    // PRODUCT RELATED 
    // module > PLCS / SALPL
    module?: string;
    journeyName?: string;

    // mapped SKU ID 
    SKU_ID?: string;
    sku?: Result;
    is_sku_loaded?: boolean;

    product?: string;
    subProduct?: string; 
    subCategory?: string;

    route?: string;
    routeKey?: string; 

    ADDONPROD_GETTER?: string;

    segment?: string;

    data?: any;

}

export type OfferOption = {
    loaded?: boolean;
    isDefault?: boolean;
    config: OfferConfig;
    
    journey?: JOURNEY;
    loan_constraint?: LOAN__CONSTRAINT;
    loan_config?: LOAN__CONFIG;

    limits?: Bounds;
    display_limits?: Bounds;
    option_limits?: Bounds;

    limits_getter?: {
        // predefined > default / static
        max?: string;
        min?: string;
        min_included?: boolean;
        max_included?: boolean; 
    }
    
    // for the label (in the option-card)
    display_limits_getter?: {
        max?: string;
        min?: string;
        min_included?: boolean;
        max_included?: boolean;
        __static_amount?:string 
    }
    
    // to be used for the option range for amount
    option_limits_getter?: {
        max?: string;
        min?: string;
        min_included?: boolean;
        max_included?: boolean; 
    }

    // additional mapping to that option
    __data?: any;

    // __invalid_option_on?: any;

}

export type CartConfig = {
    prod?: string;
    journeyName?: string;

    // to filter by product 
    product?: string;
    
    module?: string;
    // mapping this to a product > not to be used for filter 
    __product?: string;
}

export type OfferFilter = {
    offerProduct?: string;
    icorsOfferType?: string;
    displayName?: string;

    [key: string]: string | QueryHelper;


}

export type RelationsConfig = {
    find?: {
        prodCategory?: QueryHelper;
        prodId?: QueryHelper;
        prodDesc?: QueryHelper;
    }

    title?: string;
    ref_id?: string;
    
    
    type?: string;
    
    getter?: 'mapp' | 'find';
    
    mapp?: {
        [key: string]: RelationsConfig;
    }
    
    // based on the product 
    product?: string;
}


export type QueryHelper = {
    // e: equals, ne: not_equals, exists: non empty values 
    __operator?: 'e' | 'ne' | 'exists' | 'contains' | 'not_contains' | 'includes';
    value?: any;
    list?: any[];
}
