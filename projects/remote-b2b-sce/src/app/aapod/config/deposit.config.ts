import { AgeGroup, CustCategory, DepositDay, DepositTenure, PayoutVariant } from "../model/render.model";



export enum PAYOUTVARIANTS {
    ON_MATURITY = 'ON_MATURITY',
    YEARLY = 'YEARLY',
    HALF_YEARLY = 'HALF_YEARLY',
    QUATERLY = 'QUATERLY',
    MONTHLY = 'MONTHLY',
}

export enum TENUREVARIANTS {
    ADULT = 'ADULT',
    SENIOR = 'SENIOR',
    NRI = 'NRI',
    SENIORNRI = 'SENIORNRI'
}
export type VARIANTS_MAPP = { [v in PAYOUTVARIANTS]: PayoutVariant }

/**
 * methods are used to calculate the loan > and properties store config and constraint 
 */
export class XDepositCalculator {

    // CONSTANTS 
    // variants 
    public static PAYOUTVARIANTS: VARIANTS_MAPP = {
        [PAYOUTVARIANTS.ON_MATURITY]: {
            id: PAYOUTVARIANTS.ON_MATURITY,
            isDisabled: false,
            label: "ON MATURITY",
            description: "Highest returns",
            roi:0,
            interestAmt:0,
            maturityAmt:0

        },
        [PAYOUTVARIANTS.YEARLY]: {
            id: PAYOUTVARIANTS.YEARLY,
            isDisabled: false,
            label: "YEARLY",
            description: "",
            roi:0,
            interestAmt:0,
            maturityAmt:0
        },
        [PAYOUTVARIANTS.HALF_YEARLY]: {
            id: PAYOUTVARIANTS.HALF_YEARLY,
            isDisabled: false,
            label: "HALF-YEARLY",
            description: "",
            roi:0,
            interestAmt:0,
            maturityAmt:0
        },
        [PAYOUTVARIANTS.QUATERLY]: {
            id: PAYOUTVARIANTS.QUATERLY,
            isDisabled: false,
            label: "QUATERLY",
            description: "",
            roi:0,
            interestAmt:0,
            maturityAmt:0
        },
        [PAYOUTVARIANTS.MONTHLY]: {
            id: PAYOUTVARIANTS.MONTHLY,
            isDisabled: false,
            label: "MONTHLY",
            description: "",
            roi:0,
            interestAmt:0,
            maturityAmt:0
        },
    }



    public static getVariants(list: PAYOUTVARIANTS[] = [PAYOUTVARIANTS.ON_MATURITY, PAYOUTVARIANTS.YEARLY, PAYOUTVARIANTS.HALF_YEARLY,PAYOUTVARIANTS.QUATERLY, PAYOUTVARIANTS.MONTHLY]): PayoutVariant[] {


        const variants: PayoutVariant[] = []

        for(const v in XDepositCalculator.PAYOUTVARIANTS){
            if(list.includes(v as PAYOUTVARIANTS)){
                variants.push(XDepositCalculator.PAYOUTVARIANTS[v])
            }
        }

        return variants

    }

    // tenures 
    public static TENURES: DepositTenure[] = [
        {"display":"60","value":60,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"44","value":44,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"42","value":42,"disabled":false,"nudge":true,"nudgeText":"Highest Rate","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"33","value":33,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"24","value":24,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"12","value":12,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.40%","YEARLY":"7.40%","HALF_YEARLY":"7.27%","QUATERLY":"7.20%","MONTHLY":"7.16%"},
        {"display":"13","value":13,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.40%","YEARLY":"7.40%","HALF_YEARLY":"7.27%","QUATERLY":"7.20%","MONTHLY":"7.16%"},
        {"display":"14","value":14,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.40%","YEARLY":"7.40%","HALF_YEARLY":"7.27%","QUATERLY":"7.20%","MONTHLY":"7.16%"},
        {"display":"15","value":15,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"16","value":16,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"17","value":17,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"18","value":18,"disabled":false,"nudge":true,"nudgeText":"Special Period","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"19","value":19,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"20","value":20,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"21","value":21,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"22","value":22,"disabled":false,"nudge":true,"nudgeText":"Special Period","ON_MATURITY":"7.90%","YEARLY":"7.90%","HALF_YEARLY":"7.75%","QUATERLY":"7.68%","MONTHLY":"7.63%"},
        {"display":"23","value":23,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.50%","YEARLY":"7.50%","HALF_YEARLY":"7.36%","QUATERLY":"7.30%","MONTHLY":"7.25%"},
        {"display":"24","value":24,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"25","value":25,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"26","value":26,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"27","value":27,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"28","value":28,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"29","value":29,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"30","value":30,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"31","value":31,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"32","value":32,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"33","value":33,"disabled":false,"nudge":true,"nudgeText":"Special Period","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"34","value":34,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"35","value":35,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"7.80%","YEARLY":"7.80%","HALF_YEARLY":"7.65%","QUATERLY":"7.58%","MONTHLY":"7.53%"},
        {"display":"36","value":36,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"37","value":37,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"38","value":38,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"39","value":39,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"40","value":40,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"41","value":41,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"42","value":42,"disabled":false,"nudge":true,"nudgeText":"Highest Rate","ON_MATURITY":"8.60%","YEARLY":"8.60%","HALF_YEARLY":"8.42%","QUATERLY":"8.34%","MONTHLY":"8.28%"},
        {"display":"43","value":43,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"44","value":44,"disabled":false,"nudge":true,"nudgeText":"Special Period","ON_MATURITY":"8.25%","YEARLY":"8.25%","HALF_YEARLY":"8.09%","QUATERLY":"8.01%","MONTHLY":"7.95%"},
        {"display":"45","value":45,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"46","value":46,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"47","value":47,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"48","value":48,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"49","value":49,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"50","value":50,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"51","value":51,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"52","value":52,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"53","value":53,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"54","value":54,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"55","value":55,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"56","value":56,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"57","value":57,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"58","value":58,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"59","value":59,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"},
        {"display":"60","value":60,"disabled":false,"nudge":false,"nudgeText":"","ON_MATURITY":"8.10%","YEARLY":"8.10%","HALF_YEARLY":"7.94%","QUATERLY":"7.87%","MONTHLY":"7.81%"}
    ]
    public static CATEGORY : CustCategory[] = [
        {
            display:"Individual",
            value:"Individual",
            disabled:false
        },
        {
            display:"HUF",
            value:"HUF",
            disabled:false
        },
        {
            display:"Sole Proprietorship",
            value:"Sole Proprietorship",
            disabled:false
        },
        {
            display:"Corporate",
            value:"Corporate",
            disabled:false
        },
        {
            display:"NRI",
            value:"NRI",
            disabled:false
        },
        {
            display:"Others",
            value:"Others",
            disabled:false
        },
    ]
    
    public static AGE_GROUP: AgeGroup[] = [
        {
            display: "18- 60 yrs",
            value: "Adult (18 - 60 yrs)",
            disabled:false
        },
        {
            display: "Above 60 yrs",
            value: "Senior Citizen (above 60 yrs)",
            disabled:false
        },
        {
            display: "Under 18 yrs",
            value: "Minor (under 18 yrs)",
            disabled:false
        },

    ]

    public static DEPOSIT_OPTIONS:DepositDay[] = [
        {
            display: '3rd',
            value: 3,
            disabled: false
        },
        {
            display: '7th',
            value: 7,
            disabled: false
        },
        {
            display: '12th',
            value: 12,
            disabled: false
        }
    ]

    public static JOURNEY_MAP_FD:object = {
        FD:{
            NTB:{
                Individual:'FDNTB',
                'Sole Proprietorship':'SPNTB',
                HUF:'HUFNTB',
                Corporate:'FDNTB',
                NRI:'FDNTB',
                Others:'FDNTB'
            },
            ETB:{
                Individual:'FDETB',
                'Sole Proprietorship':'SPETB',
                HUF:'HUFETB',
                Corporate:'FDETB',
                NRI:'FDETB',
                Others:'FDETB'
            },
            PTB:{
                Individual:'FDNTB',
                'Sole Proprietorship':'SPNTB',
                HUF:'HUFNTB',
                Corporate:'FDNTB',
                NRI:'FDNTB',
                Others:'FDNTB'
            }

        },
        SDP:{
            NTB:{
                Individual:'SDPNTB',
                'Sole Proprietorship':'SDPNTB',
                HUF:'SDPNTB',
                Corporate:'SDPNTB',
                NRI:'SDPNTB',
                Others:'SDPNTB'
            },
            ETB:{
                Individual:'SDPETB',
                'Sole Proprietorship':'SDPETB',
                HUF:'SDPETB',
                Corporate:'SDPETB',
                NRI:'SDPETB',
                Others:'SDPETB'
            },
            PTB:{
                Individual:'SDPNTB',
                'Sole Proprietorship':'SDPNTB',
                HUF:'SDPNTB',
                Corporate:'SDPNTB',
                NRI:'SDPNTB',
                Others:'SDPNTB'
            }

        }
    }

    public static CATEGORY_TENURE_MAPPING:object = {
        ADULT : ['Individual.Adult', 'Individual.Minor', 'HUF', 'Others', 'Sole Proprietorship', 'Corporate'],
        SENIOR : ['Individual.Senior'],
        NRI : ['NRI.Adult', 'NRI.Minor'],
        SENIORNRI : ['NRI.Senior'],
    }

    public static JOURNEY_CATEGORY_MAP:object = {
        FD:{
            Individual:'Individual',
            'Sole Proprietorship':'Non Individual',
            HUF:'Non Individual',
            Corporate:'Non Individual',
            NRI:'Individual',
            Others:'Non Individual'
        },
        SDP:{
            Individual:'Individual',
            'Sole Proprietorship':'Non Individual',
            HUF:'Non Individual',
            Corporate:'Non Individual',
            NRI:'Individual',
            Others:'Non Individual'
        }
    }

    public static JOURNEY_RESISTATUS_MAP:object = {
        FD:{
            Individual:'Resident Indian',
            'Sole Proprietorship':'Non-Individuals - SP',
            HUF:'Non-Individuals - HUF',
            Corporate:'Non-Individuals - Corporate',
            NRI:'Non Resident Indian (NRI)',
            Others:'Non-Individuals - Others'
        },
        SDP:{
            Individual:'Resident Indian',
            'Sole Proprietorship':'Non-Individuals - SP',
            HUF:'Non-Individuals - HUF',
            Corporate:'Non-Individuals - Corporate',
            NRI:'Non Resident Indian (NRI)',
            Others:'Non-Individuals - Others'
        }
    }

    public static RESISTATUS_CATEGORY_MAP:object = {
        'Resident Indian':'Individual',
        'Non-Individuals - SP':'Sole Proprietorship',
        'Non-Individuals - HUF':'HUF',
        'Non-Individuals - Corporate':'Corporate',
        'Non Resident Indian (NRI)':'NRI',
        'Non-Individuals - Others':'Others'
    }

    public static PAYOUT_INTPAYOUT_MAP:object = {
        'ON_MATURITY':'Annual',
        'YEARLY':'Annual',
        'HALF_YEARLY':'Half Yearly',
        'QUATERLY':'Quarterly',
        'MONTHLY':'Monthly',
    }

    public static INTPAYOUT_PAYOUT_MAP:object = {
        'Annual':'YEARLY',
        'Half Yearly':'HALF_YEARLY',
        'Quarterly':'QUATERLY',
        'Monthly':'MONTHLY',
    }






    VARIANT_LIST: PAYOUTVARIANTS[] = [
        PAYOUTVARIANTS.ON_MATURITY,
        PAYOUTVARIANTS.YEARLY,
        PAYOUTVARIANTS.HALF_YEARLY,
        PAYOUTVARIANTS.QUATERLY,
        PAYOUTVARIANTS.MONTHLY,
    ]

    // constructor() {
    // }

}

export type DEPOSIT_PARAMETER = 'category' | 'age' | 'tenure' | 'variant' | 'deposit_day' | 'flag' | 'patch' | 'patch_hard' | 'patch_soft';
