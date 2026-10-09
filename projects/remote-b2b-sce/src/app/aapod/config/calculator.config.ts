import { Bounds, Tenure } from "../model/helper.model";
import { LoanCalcRender, LoanDetails, LoanOption, LoanVariant } from "../model/render.model";



export enum VARIANTS {
    TERM = 'TERM',
    FLEXI = 'FLEXI',
    HYBRID_FLEXI = 'HYBRID_FLEXI',

}
export type VARIANTS_MAPP = { [v in VARIANTS]: LoanVariant }

/**
 * methods are used to calculate the loan > and properties store config and constraint 
 */
export class XLoanCalculator {

    // CONSTANTS 
    // variants 
    public static VARIANTS: VARIANTS_MAPP = {
        [VARIANTS.FLEXI]: {
            id: VARIANTS.FLEXI,
            isDisabled: false,
            label: "FLEXI TERM",
            description: "Unlimited withdrawals",

            emi: {
                value: 0,
                description: "Fixed EMIs"
            }
        },
        [VARIANTS.HYBRID_FLEXI]: {
            id: VARIANTS.HYBRID_FLEXI,
            isDisabled: false,
            label: "FLEXI HYBRID",
            initial_emi: {
                value: 0,
                description: "Initial EMIs",
            },
            subsequent_emi: {
                value: 0,
                description: "Subsequent EMI"
            }
        },
        [VARIANTS.TERM]: {
            id: VARIANTS.TERM,
            isDisabled: false,
            label: "TERM LOAN",
            description: "Full amount disbursal",

            emi: {
                value: 0,
                description: "Fixed EMIs"
            }
        },
    }


    public static VARIANTS_PL: VARIANTS_MAPP = {
        [VARIANTS.FLEXI]: {
            id: VARIANTS.FLEXI,
            isDisabled: false,
            label: "FLEXI TERM",
            description: "",

            emi: {
                value: 0,
                description: "Fixed EMIs"
            }
        },
        [VARIANTS.HYBRID_FLEXI]: {
            id: VARIANTS.HYBRID_FLEXI,
            isDisabled: false,
            label: "FLEXI HYBRID",
            initial_emi: {
                value: 0,
                description: "Initial EMIs",
            },
            subsequent_emi: {
                value: 0,
                description: "Subsequent EMI"
            }
        },
        [VARIANTS.TERM]: {
            id: VARIANTS.TERM,
            isDisabled: false,
            label: "TERM LOAN",
            description: "",

            emi: {
                value: 0,
                description: "Fixed EMIs"
            }
        },
    }

    public static getVariants(list: VARIANTS[] = [VARIANTS.FLEXI, VARIANTS.HYBRID_FLEXI, VARIANTS.TERM]): LoanVariant[] {


        const variants: LoanVariant[] = []

        for(const v in XLoanCalculator.VARIANTS){
            if(list.includes(v as VARIANTS)){
                variants.push(XLoanCalculator.VARIANTS[v])
            }
        }

        return variants

    }

    // tenures 
    public static TENURES: Tenure[] = [
        { value: 12, disabled: true },
        { value: 24, disabled: true },
        { value: 36, disabled: false },
        { value: 48, disabled: false },
        { value: 60, disabled: false },
        { value: 72, disabled: false },
        { value: 84, disabled: false }
    ]

    public static INITIAL_TENURES: Tenure[] = [
        { value: 12, disabled: false },
        { value: 24, disabled: false },
        { value: 36, disabled: true },
    ]

    public static LAMF_TENURES: Tenure[] = [
        { value: 12, disabled: false },
        { value: 24, disabled: false },
        { value: 36, disabled: false },
    ]
    public static LAS_TENURES: Tenure[] = [
        { value: 12, disabled: false },
        { value: 24, disabled: false },
        { value: 36, disabled: false },
    ]
    public static MFI_TENURES: Tenure[] = [
        { value: 12, disabled: false },
        { value: 18, disabled: false },
        { value: 24, disabled: false },
        { value: 36, disabled: false },
    ]
    public static LOAN_OPTIONS: LoanOption[] = [
        {
            id: 'option_1',
            selected: true,
            label: "Express Plan",

            amount: {
                title: "",
                subtitle: "Amount"
            },

            tenure: {
                title: "Only 12 Months",
                subtitle: "Tenure"
            },

            description: "Disbursal in 30 mins*"
        },
        {
            id: 'option_2',
            selected: false,
            label: "Semi-Exp Plan",

            amount: {
                title: "",
                subtitle: "Amount"
            },

            tenure: {
                title: "Only 24 Months",
                subtitle: "Tenure"
            },

            description: "Disbursal in 4 hours*"
        },
        {
            id: 'option_3',
            selected: false,
            label: "Normal Plan",

            amount: {
                title: "",
                subtitle: "Amount"
            },

            tenure: {
                title: "",
                subtitle: "Tenure"
            },

            description: "Disbursal in 20 hour*",

            __load_tenure_range: true,
        },

    ]

    // reference 
    public static EMPTY_CONSTRAINT_PLCS_V1: LOAN__CONSTRAINT = {
        id: 'PL_CONSTRAINT_HOLDER',
        enabled: true,
        variants_enabled: [VARIANTS.TERM],
        mapp: {
            [VARIANTS.TERM]: {
                variant: VARIANTS.TERM,
                tenures: {},
            }
        },
        default_variant: VARIANTS.TERM
    }

    public static CONSTRAINT_V1: LOAN__CONSTRAINT = {
        enabled: true,
        mapp: {
            [VARIANTS.HYBRID_FLEXI]: {
                variant: VARIANTS.HYBRID_FLEXI,
                is_initial_tenure: true,
                default_tenure: 96,
                content__disabled: "(applicable from 36 months)",
                tenures: {
                    12: {
                        value: 12,
                        disabled: true,
                        initial: {
                            12: { value: 12, disabled: true },
                        },
                        default_initial: 12,
                    },
                    24: {
                        value: 24,
                        disabled: true,
                        initial: {
                            12: { value: 12, disabled: true },
                        },
                        default_initial: 12,

                    },
                    36: {
                        value: 36,
                        disabled: false,
                        initial: {
                            12: { value: 12, disabled: false },
                            24: { value: 24, disabled: true }
                        },
                        default_initial: 12,

                    },
                    48: {
                        value: 48,
                        disabled: false,
                        initial: {
                            12: { value: 12, disabled: false },
                            24: { value: 24, disabled: true }
                        },
                        default_initial: 12,

                    },
                    60: {
                        value: 60,
                        disabled: false,
                        initial: {
                            12: { value: 12, disabled: false },
                            24: { value: 24, disabled: false }
                        },
                        default_initial: 24,

                    },
                    72: {
                        value: 72,
                        disabled: false,
                        initial: {
                            12: { value: 12, disabled: false },
                            24: { value: 24, disabled: false }
                        },
                        default_initial: 24,

                    },
                    84: {
                        value: 84,
                        disabled: false,
                        initial: {
                            12: { value: 12, disabled: false },
                            24: { value: 24, disabled: false }
                        },
                        default_initial: 24,

                    },
                    96: {
                        value: 96,
                        disabled: false,
                        initial: {
                            12: { value: 12, disabled: false },
                            24: { value: 24, disabled: false }
                        },
                        default_initial: 24,

                    }
                }
            },


            [VARIANTS.FLEXI]: {
                variant: VARIANTS.FLEXI,
                is_initial_tenure: false,
                tenures: {
                    12: { value: 12 },
                    24: { value: 24 },
                    36: { value: 36 },
                    48: { value: 48 },
                    60: { value: 60 },
                    72: { value: 72, disabled: true },
                    84: { value: 84, disabled: true },
                    96: { value: 96, disabled: true }
                },

                default_tenure: 60,
                content__disabled: "(applicable upto 60 months)",


            },

            [VARIANTS.TERM]: {
                variant: VARIANTS.TERM,
                is_initial_tenure: false,
                tenures: {
                    12: { value: 12 },
                    24: { value: 24 },
                    36: { value: 36 },
                    48: { value: 48 },
                    60: { value: 60 },
                    72: { value: 72, disabled: true },
                    84: { value: 84, disabled: true },
                    96: { value: 96, disabled: true }
                },

                default_tenure: 60,
                content__disabled: "(applicable upto 60 months)",

            },
        },

        default_variant: VARIANTS.HYBRID_FLEXI,
    }


    public static LOAN_CONFIG_V1: LOAN__CONFIG = {

        active__variant: VARIANTS.HYBRID_FLEXI,
        active__tenure: 96,
        active_initial_tenure: 24,

        // TENURES: Object.values(XLoanCalculator.CONSTRAINT_V1.mapp.HYBRID_FLEXI.tenures),
        // INITIAL_TENURES: [{ value: 12, disabled: false },{ value: 24, disabled: false }],
        // VARIANTS: [VARIANTS.HYBRID_FLEXI, VARIANTS.FLEXI, VARIANTS.TERM]    

    }





    constraint: LOAN__CONSTRAINT;
    config: LOAN__CONFIG;
    VARIANT_LIST: VARIANTS[] = [
        VARIANTS.FLEXI,
        VARIANTS.HYBRID_FLEXI,
        VARIANTS.TERM
    ]

    constructor(config: LOAN__CONFIG = null, constraint: LOAN__CONSTRAINT = null) {
        if (constraint) {
            this.constraint = constraint
        }

        if(constraint?.variants_enabled){
            this.VARIANT_LIST = constraint?.variants_enabled
        }

        if (config) {
            this.config = config

            if (!this.config.VARIANTS || !this.config.TENURES || !this.config.INITIAL_TENURES) {
                this.applyDefaultConfig()
                this.updateLoanConfigOptions()
            }
        }


    }
    public setConstraint(constraint: LOAN__CONSTRAINT){
        this.constraint = constraint
    }


    public update$(loan: LoanDetails, changeIn: LOAN_PARAMETER = 'tenure') {

        this.config.active__tenure = loan.total_tenor
        this.config.active__variant = loan.variant.id
        this.config.active_initial_tenure = loan.initial_tenor


        // based on constraints 
        //check if the config and constraints are correct 

        // assume change in tenure if nothing passed 


        if (this.isLoanValid(loan)) {
            // no updates required in config or loan 

            // but let it update even though the values are valid > it leads us correct options 
            // return 

        }


        // invalid loan against cosntraints > update loan 
        this.updateLoanConfigValues(loan, changeIn)

        this.updateLoanConfigOptions()





    }

    /**
     * updates loan with the values in the config > and as variant takes LoanVariant > sending up render 
     * @param loan 
     * @param render 
     */
    updateLoanObjByConfig(loan: LoanDetails, render: LoanCalcRender) {
        loan.variant = render.variants.list.find(v => { return v.id === this.config.active__variant })
        loan.total_tenor = this.config.active__tenure
        loan.initial_tenor = this.config.active_initial_tenure

        //loan.variant.id == VARIANTS.HYBRID_FLEXI || true
        if (loan.variant.id === VARIANTS.HYBRID_FLEXI ) {
            if (loan.total_tenor && loan.initial_tenor) {
                loan.subsequent_tenor = loan.total_tenor - loan.initial_tenor
            }
        }
        // else{
        //     // get the valid initial for current tenor and set 
            
        //     const variant = this.constraint.mapp[VARIANTS.HYBRID_FLEXI]
        //     if(variant 
        //         && variant.default_tenure 
        //         && variant.tenures?.[variant.default_tenure]?.default_initial)
        //     {
        //         loan.initial_tenor = variant.tenures[variant.default_tenure].default_initial
        //         loan.subsequent_tenor = loan.total_tenor - loan.initial_tenor    
        //     }
        // }
    }

    updateRenderByConfig(render: LoanCalcRender) {
        // removing the not applicable variants from the view
        if(this.constraint.variants_enabled){
            render.variants.list.forEach(v => {
                if(this.constraint.variants_enabled?.includes(v.id)){
                    v.notApplicable = false
                }
                else{
                    v.notApplicable = true
                }
            })
        }
        const valid_variants = this.config.VARIANTS.map(v => { return v.variant })
        render.variants.list.forEach(v => {
            if (valid_variants.includes(v.id)) {
                v.isDisabled = false
            }
            else {
                v.isDisabled = true
                if(this.constraint.mapp?.[v.id]?.content__disabled)
                v.disabled_text = this.constraint.mapp?.[v.id]?.content__disabled
            }
        })

        render.tenure.tenure_list = this.config.TENURES.map(t => {
            return {
                value: t.value,
                disabled: t.disabled
            }
        })

        render.tenure.initial_tenure_list = this.config.INITIAL_TENURES?.map(t => {
            return {
                value: t.value,
                disabled: t.disabled
            }
        }) || []

        // if (render.tenure && render.tenure.tenure_list) {
        //     let tenure_min = Math.min(...render.tenure.tenure_list.map(x => x.value))
        //     let tenure_max = Math.max(...render.tenure.tenure_list.map(x => x.value))

        //     if (tenure_min != tenure_max) {
        //         render.tenure.__range_text = (tenure_min.toString() + " - " + tenure_max.toString()) + (render.tenure.displayUnit == 'year' ? ' Years' : ' Months')
        //     }
        //     else {
        //         render.tenure.__range_text = (tenure_min.toString()) + (render.tenure.displayUnit == 'year' ? ' Years' : ' Months')
        //     }


        //     if (render.options?.enabled && render.options.list) {
        //         render.options.list.forEach(x => {
        //             if (x.__load_tenure_range) {
        //                 x.tenure.title = render.tenure.__range_text
        //             }
        //         })
        //     }
        // }

        console.log("pdpx/calculator/render/update", render)
    }

    updateLoanConfigValues(loan: LoanDetails, changeIn: LOAN_PARAMETER = 'tenure') {
        const V = this.config.active__variant
        const T = this.config.active__tenure
        const IT = this.config.active_initial_tenure

        if (!V || !this.constraint.mapp[V]) {
            // update V T and IT (defaults)
            this.applyDefaultConfig()

            return
        }

        if (!T) {
            // update T and IT (V)
            const variant = this.constraint.mapp[V]
            this.config.active__tenure = variant.default_tenure

            this.config.active__tenure = variant.default_tenure
            if (variant.is_initial_tenure) {
                this.config.active_initial_tenure = variant.tenures[this.config.active__tenure]?.default_initial
            }
            return
        }

        // if(this.constraint.mapp[V].is_initial_tenure && !IT){
        //     // update IT (V and T) | if applicable > and no need to return > as it is not mandatory
        //     this.config.active_initial_tenure = this.constraint.mapp[V].tenures[this.config.active__tenure].default_initial.value
        // }





        if (changeIn === 'variant') {
            const variant = this.constraint.mapp[V]

            if (this.isTenureAvailableInVariant(V, T)) {
                // valid tenure 

                // check for valid initial_tenure 
                if (variant.is_initial_tenure) {
                    if (this.isInitialTenureAvailableInTenure(V, T, IT)) {
                        // valid initial tenure 
                    }
                    else {
                        this.config.active_initial_tenure = variant.tenures[this.config.active__tenure].default_initial
                    }
                }
            }
            else {
                // invalid tenure 
                this.config.active__tenure = variant.default_tenure
                if (variant.is_initial_tenure) {
                    this.config.active_initial_tenure = variant.tenures[this.config.active__tenure].default_initial
                }
            }

            // setting up default values by default > removed 
            // this.config.active__tenure = variant.default_tenure
            // if (variant.is_initial_tenure) {
            //     this.config.active_initial_tenure = variant.tenures[this.config.active__tenure].default_initial
            // }

            return
        }

        if (changeIn === 'tenure') {
            // tenure changed > tenure perspective 
            // T is the updated one
            // check if active variant has the tenure | update the variant if not 
            const variant_set = this.setValidVariant__Tenure()
            if (!variant_set) {
                // update defaults 
                this.applyDefaultConfig()
                return
            }

            // check if initial tenure > is valid or not > and set accordingly 
            this.setValidInitialTenure__Tenure()
            return
        }

        if (changeIn === 'initial_tenure') {

            // check if current V and T has this applied_initital_tenure or not 

            // set valid tenure against valid initial tenure 
            this.setValidVariantAndTenure__Initial()



        }
    }


    updateLoanConfigOptions() {

        // updates the options based on current values

        // this.config.VARIANTS = 

        const current_variant = this.constraint.mapp[this.config.active__variant]
        const current_tenure = current_variant.tenures[this.config.active__tenure]

        this.config.TENURES = Object.values(current_variant.tenures);
        if (current_variant.is_initial_tenure) {
            this.config.INITIAL_TENURES = Object.values(current_tenure.initial)
        }

        // for list of variants > based on tenor 
        const V_LIST: VARIANTS[] = this.VARIANT_LIST.slice()
        const valid_variants: VARIANTS[] = []
        V_LIST.forEach(v => {
            // is current tenure avaiable in this v 
            const variant = this.constraint.mapp[v]
            if (
                variant.tenures?.[current_tenure?.value]
                && !(variant.tenures[current_tenure?.value]?.disabled === true)
            ) {
                valid_variants.push(v)
            }
        })

        this.config.VARIANTS = valid_variants.map(v => {
            return this.constraint.mapp[v]
        })


    }




    setValidVariantAndTenure__Initial() {

        // update tenure first > if not valid 
        const V = this.config.active__variant
        const T = this.config.active__tenure
        const IT = this.config.active_initial_tenure

        // let variant = this.constraint.mapp[V]
        // if (variant.tenures?.[T]?.initial?.[IT] && !variant.tenures?.[T]?.initial?.[IT]?.disabled === true) {
        if (this.isInitialTenureAvailableInTenure(V, T, IT)) {
            // valid configuration already 

        }
        else {
            // find a valid variant for the same tenure + initial tenure 
            // let variant_set = false
            // this.VARIANT_LIST.forEach(vx => {
            //     if (!variant_set) {
            //         let variantx = this.constraint.mapp[vx]
            //         if(variantx.is_initial_tenure){
            //             if (
            //                 variantx.tenures[T]
            //                 && !(variantx?.tenures?.[T]?.disabled === true)
            //                 && variantx?.tenures?.[T]?.initial?.[IT]
            //                 && !(variantx?.tenures?.[T]?.initial?.[IT]?.disabled === true)
            //             ) {
            //                 this.config.active__variant = vx
            //                 variant_set = true
            //             }
            //         }
            //     }
            // })
            
            let variant_set = false
            const valid_variant = this.getValidVariantForTenureAndInitialTenure(T, IT)
            // variant_set = valid_variant ? true : false
            variant_set = !!valid_variant;

            // incase not able to find the variant for same tenure and IT 
            // search across all the tenures in the same variant 
            if (!variant_set) {

                // lets find a variant and tenure > fresh for the initial tenure
                // this.VARIANT_LIST.forEach(vx => {
                //     if (!variant_set) {
                //         let variantx = this.constraint.mapp[vx]

                //         let tenuresx = variantx.tenures
                //         for (var tx in tenuresx) {
                //             if (!variant_set) {
                //                 if (
                //                     tenuresx[tx]?.initial
                //                     && tenuresx?.[tx]?.initial?.[IT]
                //                     && !(tenuresx[tx]?.initial?.[IT]?.disabled === true)
                //                 ) {
                //                     // variant and tenure found
                //                     this.config.active__variant = vx
                //                     this.config.active__tenure = tenuresx[tx].value
                //                     variant_set = true
                //                 }
                //             }
                //         }

                //     }
                // })

                const V_T = this.getValidVariantAndTenure__InitialTenure(IT)
                
                if(V_T){
                    this.config.active__variant = V_T.V
                    this.config.active__tenure = V_T.T
                    variant_set = true
                }
                else{
                    // nothing found > so dont change anything > let it be as it is
                }
            
            }
        }


    }

    setValidVariant__Tenure(): boolean {

        const V = this.config.active__variant
        const T = this.config.active__tenure
        // const IT = this.config.active_initial_tenure


        // const variant = this.constraint.mapp[V]
        if (this.isTenureAvailableInVariant(V, T)) {
            // valid variant already
            return true

        }
        else {
            // set the correct variant 


            // let set = false

            // this.VARIANT_LIST.forEach(V => {
            //     if (!set) {
            //         let variant = this.constraint.mapp[V]
            //         if (this.isTenureAvailableInVariant(V, T)){
            //             this.config.active__variant = V
            //             set = true
            //         }
            //     }
            // })

            // // set: false / T is not valid or not available in any variant 
            // return set
            
            
            // set: false / T is not valid or not available in any variant 
            const set = this.getValidVariantForTenure(T)
            if(set){
                this.config.active__variant = set
                return true
            }
            else{
                return false
            }

        }

    }

    setValidInitialTenure__Tenure() {

        const V = this.config.active__variant
        const T = this.config.active__tenure
        const IT = this.config.active_initial_tenure

        const variant = this.constraint.mapp[V]


        if (variant.is_initial_tenure) {
            if (
                this.isInitialTenureAvailableInTenure(V, T, IT)
            ) {
                // valid initital tenure > already valid

            }
            else {
                this.config.active_initial_tenure = variant?.tenures[T]?.default_initial
            }
        }
        else{
            // find a valid initial tenure for the tenure > from a variant enabled with initial tenure
            const valid_initial_tenure = this.getValidInitialTenureForTenure(T)
            if(valid_initial_tenure){
                this.config.active_initial_tenure = valid_initial_tenure
            }
        }

    }

    applyDefaultConfig() {
        try{
            this.config.active__variant = this.constraint.default_variant

            const variant = this.constraint.mapp[this.constraint.default_variant]
            this.config.active__tenure = variant.default_tenure
            if (variant.is_initial_tenure) {
                this.config.active_initial_tenure = variant?.tenures?.[this.config.active__tenure]?.default_initial
            }
        }
        catch(e){
            console.log("pdpx/calculator/applyDefaultConfig/ex", e)
        }



    }

    // setValidTenureForInitialTenure(){

    // }

    // setValid

    /**
     * checks if the config is valid or not
     */
    isLoanValid(loan: LoanDetails) {
        void loan
        const V = this.config.active__variant
        const T = this.config.active__tenure
        const IT = this.config.active_initial_tenure

        // checking if any empty values > 
        if (!V || !this.constraint.mapp[V] || !T) {
            return false
        }
        else if (this.constraint.mapp[V]?.is_initial_tenure && !IT) {
            return false
        }

        let is_tenure_valid = false
        let is_initial_tenure_valid = false

        // configuration 
        const variant = this.constraint.mapp[V]
        if(!variant){
            // variant constraint doesnt exist 
            return false
        }

        // is tenure valid ? 
        // if (variant.tenures[T] && !(variant.tenures?.[T]?.disabled === true)) {
        if (this.isTenureAvailableInVariant(V, T)) {
            is_tenure_valid = true

            const tenure = variant.tenures[T]

            if (variant.is_initial_tenure) {
                if (!tenure.initial) {
                    is_tenure_valid = false
                } else if (this.isInitialTenureAvailableInTenure(V, T, IT)) {
                    // if (tenure.initial[IT] && !(tenure.initial?.[IT]?.disabled === true)) {
                   is_initial_tenure_valid = true
                }
            }
            else {
                is_initial_tenure_valid = true
            }
        }

        let valid = false
        if (is_tenure_valid && is_initial_tenure_valid) {
            valid = true
        }

        return valid
    }


    // helpers

    isTenureAvailableInVariant(V: VARIANTS, T: number) {
        const variant = this.constraint.mapp[V]
        // if(!variant){
        //     return false
        // }
        // if (variant?.tenures?.[T] && !(variant?.tenures?.[T]?.disabled === true)) {
        //     return true
        // }
        // else {
        //     return false
        // }
        return !!variant?.tenures?.[T] && variant.tenures[T].disabled !== true;

    }

    isTenureAvailableInAnyVariant(T: number) {
        let valid = false
        this.VARIANT_LIST.forEach(V => {
            if (!valid) {
                valid = this.isTenureAvailableInVariant(V, T)
            }
        })

        return valid
    }

    isInitialTenureAvailableInTenure(V: VARIANTS, T: number, IT: number) {
        const variant = this.constraint.mapp[V]

        // if(!variant.is_initial_tenure){
        //     return false
        // }
        // if (
        //     variant.tenures[T]?.initial?.[IT]
        //      && !(variant.tenures?.[T]?.initial?.[IT]?.disabled === true)) {
        //     return true
        // }
        // else {
        //     return false
        // }
        return (
            variant.tenures[T]?.initial?.[IT] &&
            variant.tenures[T]?.initial?.[IT]?.disabled !== true
        );
    }

    isInitialTenureAvailableInAnyTenure(V: VARIANTS, IT: number) {
        let valid = false
        const variant = this.constraint.mapp[V]

        if(!variant.is_initial_tenure){
            return false
        }

        for (const T in variant.tenures) {
            const tx = variant.tenures[T]
            if (!valid) {
                valid = this.isInitialTenureAvailableInTenure(V, tx.value, IT)
            }
        }

        return valid
    }


    getValidVariantForTenure(T: number): VARIANTS{
        let valid_variant: VARIANTS;
        this.VARIANT_LIST.forEach(V => {
            if (!valid_variant) {
                if (this.isTenureAvailableInVariant(V, T)) {
                    valid_variant = V
                }
            }
        })

        return valid_variant
    }

    getValidVariantForTenureAndInitialTenure(T: number, IT: number): VARIANTS{
        let valid_variant: VARIANTS;
        this.VARIANT_LIST.forEach(V => {
            if (!valid_variant) {
                if(this.variantHasInitialTenures(V)){
                    if (this.isTenureAvailableInVariant(V, T) && this.isInitialTenureAvailableInTenure(V, T, IT)) {
                        valid_variant = V
                    }
                }
            }
        })

        return valid_variant
    }

    getValidTenureForInitialTenure(V: VARIANTS, IT: number): number{
        let valid_tenure: number;
        const variant = this.constraint.mapp[V]

        for (const T in variant.tenures) {
            const tx = variant.tenures[T]
            if (!valid_tenure) {
                if (this.isInitialTenureAvailableInTenure(V, tx.value, IT)) {
                    valid_tenure = tx.value
                }
            }
        }

        return valid_tenure
    }

    getValidVariantAndTenure__InitialTenure(IT: number){
        let valid_variant: VARIANTS;
        let valid_tenure: number;
        this.VARIANT_LIST.forEach(V => {
            if (!valid_variant) {
                if(this.variantHasInitialTenures(V)){
                    const variant = this.constraint.mapp[V]
                    for (const T in variant.tenures) {
                        const tx = variant.tenures[T]
                        if (!valid_tenure) {
                            if (this.isInitialTenureAvailableInTenure(V, tx.value, IT)) {
                                valid_variant = V
                                valid_tenure = tx.value
                            }
                        }
                    }
                }
            }
        })
        if(valid_variant && valid_tenure){
            return {V: valid_variant, T: valid_tenure}
        }
        else{
            return null
        }
    }

    
    
    variantHasInitialTenures(V: VARIANTS): boolean {
        return this.constraint.mapp[V]?.is_initial_tenure
    }
    
    /**
     * 
     * @param T > will search across all the variants | > FH 
     * @returns 
     */
    getValidInitialTenureForTenure(T: number){
        let variant_with_initials: VARIANTS;
        let valid_initial_tenure: number;

        this.VARIANT_LIST.forEach(V => {
            if (!variant_with_initials) {
                if(this.variantHasInitialTenures(V)){
                    const variant = this.constraint.mapp[V]
                    if(variant?.tenures?.[T]?.default_initial){
                        valid_initial_tenure = variant.tenures[T].default_initial
                        variant_with_initials = V
                    }
                }
            }
        })

        return valid_initial_tenure


    }


    public static PLEMICARDLOAN_OPTIONS: LoanOption[] = [
        {
            id: 'option_1',
            selected: false,
            label: "XPRESS PERSONAL LOAN",

            amount: {
                title: "₹25,000 to ₹75,000",
                subtitle: "Amount"
            },

            tenure: {
                title: "No call verification",
                subtitle: ""
            },

            description: "Quick disbursal",
      
           
        },
        {
            id: 'option_2',
            selected: true,
            label: "PERSONAL LOAN",

            amount: {
                title: "₹75,001 - 3 Lakh",
                subtitle: "Amount"
            },

            tenure: {
                title: "Call verification required",
                subtitle: ""
            },

            description: "Disbursal in few hrs",
        
        },
        
       

    ]
    public static PLEMICARDTENURES: Tenure[] = [
        { value: 15, disabled: false },
        { value: 18, disabled: false },
        { value: 21, disabled: false },
        { value: 24, disabled: false },
        // { value: 60, disabled: false },
        // { value: 72, disabled: false },
        // { value: 84, disabled: false }
    ]

}

export type LOAN_PARAMETER = 'tenure' | 'initial_tenure' | 'variant';


export type LOAN__VARIANT = {
    variant: VARIANTS;
    tenures: { [t: number]: LOAN__TENURE }

    default_tenure?: number;
    is_initial_tenure?: boolean;

    content__disabled?: string;

};

export type LOAN__TENURE = {
    value: number;
    disabled?: boolean;

    initial?: { [t: number]: LOAN__TENURE }

    default_initial?: number;
}




/**
 * this will not be used in the html >rather > loan/render will be used as usual
 * this is a helper object to update the render/loan 
 */
export type LOAN__CONFIG = {
    // current valid configuration > which has to be applied (based on user input)
    VARIANTS?: LOAN__VARIANT[];
    TENURES?: LOAN__TENURE[];
    INITIAL_TENURES?: LOAN__TENURE[];

    amount?: number;
    active__variant?: VARIANTS;
    active__tenure?: number;
    active_initial_tenure?: number;
}


/**
 * this will not be used in render > just used to build up the LOAN__CONFIG > 
 * for the active selected parameters of the loan 
 * 
 */
export type LOAN__CONSTRAINT = {
    id?: string;
    enabled?: boolean;
    // VARIANT {disabled/enabled} > TENOR { value, disabled } > INITIAL_TENOR { value, disabled}
    mapp: { [key in VARIANTS]?: LOAN__VARIANT };

    default_variant: VARIANTS;


    variants_enabled?: VARIANTS[];

    constraint_label?: string;

    // MULTIPLE 
    // if there are multiple constraints > like in PLCS (which change by bounds )
    is_default?: boolean;
    bound?: Bounds;


    // multiple constraints > selection based on key > variation_constructor
    variations_enabled?: boolean;
    variations?: {
        [key: string]: { [key in VARIANTS]?: LOAN__VARIANT }
    }
    // variation_constructor?: Array<'module' | 'product' | 'subproduct'>;
    variation_constructor?: string[];
};





