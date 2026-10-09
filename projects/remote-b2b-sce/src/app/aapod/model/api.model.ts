import { DemogDetails, OfferJson } from "./flow.model";
import { LoanExtra } from "./helper.model"
import { CustRelationRender } from "./render.model";


// helpers 

export type FilterOption = {
    key: string | number | number[]; // The key can be a string, number, or an array of numbers
    displayLabel: string;
    count?: number;
}


export type Sort = {
    key: string;
    order: 'asc' | 'desc';
}


export type ParsedMinMax = {
    [product: string]: { [subProduct: string]: MinMax };
}

export type MinMax = {
    minloan?: string;               // "200000",
    maxloan?: string;               // "8000000",
    interestrate?: string;              // "7.20%"
}

export type MinMaxGetter = {
    product: string;
    subProduct: string;
}



export type OfferResponse = {
    offerList: OfferJson[];
    description: string;
    statusCode: string;
};


export type DemogPayload = {
    mobileNumber: string;
    flag: string;
}

export type DemogResponse = {
    statuscode?: string;
    custType: 'NTB' | 'PTB' | 'ETB';
    prospectID?: string;
    custDemogDetails: DemogDetails[];
}


// CustRelationsReq
export type CustRelationsReq = {
    customerId?: number;
    mobileNumber?: string;
    type?: string;
}

// CustRelationsResp
export type CustRelationsResp = {
    custRelationshipDetails?: relations__collection;
    custRelationshipDetailsList?: any;
    description?: string;
    statusCode?: string;
}

export type relations__collection = {
    customerId?: number;
    Cards?: relation__card[];
    insurance?: relation__insurance[];
    deposits?: relation__deposit[];
    loan?: relation__loan[];
    mutualFunds?: boolean;
    creditCards?: 'rbl' | 'dbs'[];
}

export type relation__type = relation__loan | relation__deposit | relation__card | relation__insurance

export type relation__loan = {
    type?: 'LOAN';
    agreementNo?: string;
    prodId?: string;
    prodCategory?: string;
    prodDesc?: string;
    relAmount?: number;
    relStatus?: string;
    nextEMIAmount?: number;
    missedEmi?: number;
    amcCharges?: string;
    totalOverDue?: number;
    closureDate?: string;
    flexiFlag?: string;
    netTenure?: number;
    balanceTenure?: number;
    isMilesFlag?: string;
    grossTenure?: number;
    nextEmiDate?: string;
    pos?: number;
    sourceSysId?: string;
    disbDate?: string;
    loanExpiryDate?: string;
    applId?: string;
    crmDealId?: string;
    opportunityId?: string;
    listofAgreementNos?: any[]; // This could be a more specific type
    amountDrawnLimit?: number;
    roi?: number;


    __render?: CustRelationRender;
}

export type relation__card = {
    type?: 'CARD';

    credit_card?: 'rbl' | 'dbs';

    cardNumber?: string;
    customerName?: string;
    relStatus?: string;
    availableLimit?: number;
    accCreditLimit?: number;
    missedEmi?: number;
    cardExpiryDate?: string;
    prodId?: string;
    prodDesc?: string;
    prodCategory?: string;
    annualMaintenanceFee?: string;
    paymentDueFlag?: string;
    validFrom?: string;
    primaryAddonIdentifier?: string;


    __render?: CustRelationRender;
}

export type relation__insurance = {
    type?: 'INSURANCE';

    premiumAmount?: number;
    policyNo?: string;
    nomineeName?: string;
    insuranceType?: string;
    insuranceStatus?: string;
    issuanceStatus?: string;
    agreementNo?: string;
    insuranceCompanyProduct?: string;
    prodId?: string;
    prodDesc?: string;
    prodCategory?: string;
    policyStartDate?: string;
    policyEndDate?: string;
    partnerId?: number;
    insuranceId?: string;

    __render?: CustRelationRender;

}

export type relation__deposit = {
    type?: 'DEPOSIT';
    interestRate?: number;
    relAmount?: number;
    depositId?: string;
    maturityDate?: string;
    interestStartDate?: string;
    relStatus?: string;
    prodId?: string;
    prodDesc?: string;
    prodCategory?: string;
    tdsWaveOffFlag?: string;
    daysToMature?: number;
    hstFlag?: boolean;
    applId?: string;
    maturityAmount?: number;
    srlNum?: string;
    interestAmount?: number;

    __render?: CustRelationRender;
}


export type Segment = {
    fees?: string;              // "500",
    cardcode?: string;              // "CC28",
    pricingcode?: string;               // "C12",
    logo?: string;              // "115",
    cardtype?: string;              // "Platinum Choice",
    blkcode?: string;               // "",
    firstYearFees?: string;             // "499",
    subsequentYearFeeWaived?: string;               // "50000",
    subsequentyearFee?: string;             // "499",
    annualFee?: string;             // "499",
    priority?: string;              // "1",
    cardCodeId?: string;                // "a0TBg000000eIkiMAE",
    approvalPageFeature1?: string;              // "get points worth up to ₹ 1000 on fee payment",
    approvalPageFeature2?: string;              // "waived Off on spends over ₹1,00,000 in the previous year"

    __id?: string;
    __source?: 'offer' | 'default';
}


export type CustomerTag = {
    module?: string;
    submodule?: string;
    section?: string;
    tagName?: string;
    tagValue?: string | null;
    tagType?: string;
    tagSubType?: string;
    icon?: string;
    height?: string;
    width?: string;
    position?: string;
    backgroundColor?: string;
    xCoordinate?: string;
    yCoordinate?: string;
    CTA?: string;
    text?: {
        fontSize?: string;
        fontColor?: string;
        Title?: string;
    };
    versions?: string[];
    priority?: number;
    isProd?: boolean;
    isStatic?: boolean;
    displayId?: string | null;
    nudgeDisplayType?: string;
    jsonFile?: string | null;

    __render?: LoanExtra;
}

