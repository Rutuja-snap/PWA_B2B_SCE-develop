import { FILTER_TYPES } from "../model/helper.model";
import { CONTENT_TYPES, ContentCollectionRender, Elements, PDPTemplate, PLPTemplate } from "../model/render.model";

// no-dd-sa:typescript-best-practices/no-unnecessary-class
export class DEFAULT {
    public static ELEMENTS: Elements = {
        navScroll: {
            id: 'pdp.navScroll',
            view: false,

            viewBy: 'scroll',
            viewScrollValue: 350,

            showAt: ['pdp.features'],
            hideAt: ['texts', 'banners.pre_approved'],

            // cta: 
            cta: {
                id: 'cta.sticky.apply',
                label: "Apply",
                view: true,
            },

            tabs: {
                id: 'tabs.navScroll',
                activeIndex: 0,
                tabs: [
                    'Features and benefits',
                    'Eligibility Criteria',
                    'How to apply',
                    'Fees and Charges',
                    'Compare',
                    'FAQs'
                ],
            },

            links: [
                {
                    type: 'scroll',
                    label: 'Features and benefits',
                    address: 'pdp.features'
                },
                {
                    type: 'scroll',
                    label: 'Eligibility Criteria',
                    address: 'pdp.eligibility'
                },
                {
                    type: 'scroll',
                    label: 'How to apply',
                    address: 'pdp.how_to_apply'
                },
                {
                    type: 'scroll',
                    label: 'Fees and Charges',
                    address: 'pdp.tabular.charges'
                },
                {
                    type: 'scroll',
                    label: 'Compare',
                    address: 'pdp.tabular.variants'
                },
                {
                    type: 'scroll',
                    label: 'FAQs',
                    address: 'pdp.faqs'
                }
            ]
        },


        navHeader: {
            id: "nav_header",
            title: "Loans",
            icon: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/arrow.svg",
        },

        relations: {
            id: 'relations',
            header_text: "Your relations",
            list: [],
        },

        carts: {
            id: 'carts',
            header_text: "In your cart",
            list: [],
        },

        offerBanner: {
            id: 'pdp.offerbanner',
            banner: { link: "" },
            overlay: { link: "" },

            text: "You have a pre-approved offer of",
            cta: {
                id: "offerbanner.apply",
                label: "Apply Now",
                view: true
            },

            // with rupee symbol
            amount: "8,00,000"
        },


        rating: {
            count: 1765,
            rating: 4.4,
            hide_rating: true,
            hide_count: true
        },

        featureIcons: {
            id: "pdp.icon_features",
            features: []
        },

        paragraph: {
            heading: 'No part-prepayment charge on Flexi Loans',
            content: 'Repay a part of your loan in advance, at no extra cost. You can part-pay as many times as you want.',
            color: "#333333",

            is_cta: true,
            cta: {
                id: '',
                label: 'Read about our Flexi Hybrid Loan',
                view: true
            }
        },

        paragraphCollection: {
            paragraphs: [],
            initial_show_count: 1
        },

        bulletList: {
            paragraphs: [],
        },
        bulletParas: {
            paragraphs: [
                {
                    heading: "Paragraph Heading",
                    content: "Paragraph content "
                }
            ],
        },

        textPara: {
            paragraphs: [],
        },

        faqs: {
            id: 'pdp.faqs',
            title: "Frequently asked questions",
            initial_show_count: 4,
            panelsOpenByDefault: false,
            expansion_mode:'first',
            faqs: []


        },

        chargesTabular: {
            num_cols: 2,
            id: 'pdp.tabular.charges',

            footer: {
                id: "tabular.footer",
                mapp: []
            },

            rows: []
        },
        variantsTabular: {
            id: 'pdp.tabular.compare',
            num_cols: 8,
            rows: []
        },
        variantsTabularDesktop: {
            id: "pdp.tablular.compare.desktop",
            num_cols: 8,
            rows: []
        },

        navigator: {
            id: 'pdp.navigator',
            view: false,

            title: "You are here",
            path: [
                {
                    label: 'Home',
                    type: 'url',
                    address: ''
                },
                {
                    label: 'Loans',
                    type: 'url',
                    address: ''
                },
                {
                    label: 'Doctor Loan',
                    type: 'route',
                    address: 'pdpx/dl-plp'
                },
                {
                    label: 'Flexi Hybrid Doctor Loan',
                    type: 'route',
                    address: 'pdpx/dl-pdp',
                    current: true
                },
            ]
        },

        redirect: {
            id: 'pdp.redirect',
            view: false,

            title: "Related Links",
            path: [
                {
                    label: 'Features and benefits',
                    type: 'scroll',
                    //element id
                    address: 'pdp.features'
                },
                {
                    label: 'Eligibility Criteria and Documents',
                    type: 'scroll',
                    address: 'pdp.eligibility'
                },
                {
                    label: 'Fees and Charges',
                    type: 'scroll',
                    address: 'pdp.tabular.charges'
                },
                {
                    label: 'How to apply',
                    type: 'scroll',
                    address: 'pdp.how_to_apply'
                }


            ]
        },
        watchVideos: {
            id: "pdp.watch_videos",
            title: "Watch our videos",
            videos: []
        },

        signIn: {
            id: 'sign_in',
            title: "Sign-in to Bajaj Finserv",
            subtitle: "Resume your application, get exclusive offers, and more",
            cta: {
                id: 'sign_in',
                label: "sign-in",
            }
        },
        cartResume: {
            id: 'plp.cart',
            title: "Resume your application",
            subtitle: "You already have an application in progress. Click on 'Resume' to continue.",
            cta: {
                id: 'cart.resume',
                label: "RESUME",
            },

            view: true
        },

        crossProducts: {
            id: "crossproducts",
            addons: [],
            assets: {},

            groups: [
                {
                    type: 'VAS',
                    card_title: "Value Added Services",
                    // card_subtitle: "",
                    // card_icon:""
                    // prod_image: ""
                },
                {
                    type: 'insurance',
                    card_title: "Insurance",
                    
                    // card_icon:""
                    // card_subtitle: "",
                    // prod_image: ""
                },
            ]

        },

        search: {
            id: 'search',
            title: "Looking for something specific?",
            placeHolder: "Search in FAQs"
        },
        stickyCTA: {
            id: 'cta.sticky.apply',
            label: "Apply",
            view: false,
        },


        dialogCTA: {
            id: 'loan.summary.callback',
            title: "Talk to our loan specialist",
            description: "Find answers to all your loan-related queries",
            cta: {
                id: "callback.cta",
                label: "GET A CALLBACK",
                view: true,
            },


            is_after: false,
            after_version: {
                title: "Our Loan Specialist will call you back in 1 business day",
                description: "Meanwhile explore more about our ",
                CTAs: [
                    { id: 'callback.reviews', label: 'Reviews' },
                    { id: 'callback.faqs', label: 'FAQs' },
                    { id: 'callback.guide', label: 'Buying Guide' }
                ],
            }
        },
        t_and_c_popup:{

        },


        loanCalc: {

            id: "",
            principal_amount_text: "",
            Total_intrest_text: "",
            Total_amount_Text: "",


            amount: {
                validationNudge: {
                    id: "validation.amount",
                    type: 'soft',
                    enabled: false,
                    view: false,
                    // viewType: 'once',
                    viewType: 'invalid',

                    soft: {
                        title: "",
                        icon: {
                            link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/bulb.png"
                        },

                        cta: {
                            label: "know more"
                        }
                    },

                    hard: {
                        title: "",
                        icon: {
                            link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/icon_warning_red.svg"
                        },

                        cta: {
                            label: "know more"
                        }
                    },
                    // error_text: "",
                    // cta: {
                    //     label: 'know more',
                    // }
                }
            },
            tenure: {},

            variants: {},



        },
        infoPopup:{
            
        },
        loanExtras: {
            id: 'loan.extras',
            // title:"Exclusive rewards",
            // desc:"worth up to ₹1,000 with this credit card",

            icon: {
                link: "",
            },


            extras:[
                // {
                //     icon:{
                //         link:""
                //     },
                //     title:"Up to ₹800",
                //     desc:"Cashback vouchers on bill payments and recharges",
                //     popup:{
                //         description:"T&C apply"
                //     }
                // }
            ]
        },
        emicalculator:{
            Title:"",
            Subtitle:"",
            icon:{
                link:"",
                alt:""
            }
        },

        video_list: []


    }

    public static PLP: PLPTemplate = {
        id: "DEFAULT.PLP",
        navHeader: {
            id: "nav_header",
            title: "Loans",
            icon: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/arrow.svg",
        },

        tabs: {
            id: "tabs",
            tabs: ['All', 'Doctor Loan', 'Medical Equipment Finance'],
            activeIndex: 0
        },

        textRatings: [
            {
                id: "texts",
                tab: 'All',
                title: "Loans for Doctors",
                subtitle: "Quick Disbursal | Minimal Documentation | Flexible Tenure",
                rating: {
                    count: 1765,
                    rating: 4.4,
                    hide_rating: true,
                    hide_count: true
                }
            },

            {
                id: "texts",
                tab: 'Doctor Loan',
                title: "Doctor Loan",
                subtitle: "3 unique variants | Up to Rs. 55 lakh | Tenure up to 96 months",
                rating: {
                    count: 1765,
                    rating: 4.4,
                    hide_rating: true,
                    hide_count: true
                }
            },

            {
                id: "texts",
                tab: 'Medical Equipment Finance Finance',
                title: "Medical Equipment Finance",
                subtitle: "2 unique variants | Up to Rs. 6 crore lakh | Tenure up to 84 months",
                rating: {
                    count: 1765,
                    rating: 4.4,
                    hide_rating: true,
                    hide_count: true
                }
            },

        ],

        preAppBanners: {
            id: "banners.pre_approved",
            title: "Pre-approved offers for you",
            banners: [
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"

                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                }
            ],
        },
        stripBanner_1: {
            id: "banners.strip.1",
            banner: {
                link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/strip__sample.png"
            }
        },

        results: {
            id: "results",
            is_radio: true,
            radio_title: "Select loan by amount",


            radio_filter: {
                hide: true,
                id: 'actualLoanAmount',
                label: 'Select loan by amount',
                controlType: 'radio',
                funcType: FILTER_TYPES.bounds,

                optionSelected: null,
                options: [
                    {
                        display: "₹2 lakh to ₹10 lakh",
                        dataColumn: 'value_amount',
                        bounds: {
                            min: 200000,
                            max: 1000000,
                            inclusive: true,
                            display_min: "2 lakh",
                            display_max: "10 lakh"
                        },
                        checked: false,
                    },
                    {
                        display: "₹10 lakh to ₹25 lakh",
                        dataColumn: 'value_amount',
                        bounds: {
                            min: 1000000,
                            max: 2500000,
                            inclusive: true,
                            display_min: "10 lakh",
                            display_max: "25 lakh"
                        },
                        checked: false,
                    },
                    {
                        display: "₹25 lakh to ₹50 lakh",
                        dataColumn: 'value_amount',
                        bounds: {
                            min: 2500000,
                            max: 5000000,
                            inclusive: true,
                            display_min: "25 lakh",
                            display_max: "50 lakh"
                        },
                        checked: false,
                    },
                    {
                        display: "Above ₹50 lakh",
                        dataColumn: 'value_amount',
                        bounds: {
                            min: undefined,
                            max: 5000000,
                            inclusive: true,
                            display_min: undefined,
                            display_max: "50 lakh"
                        },
                        checked: false,
                    },
                ]
            },

            listerType: 'vertical',
            resultOrientation: 'landscape',

            results: [
                {}, {}, {}, {}
            ],

            is_filter: true,

            //depr 
            filter_text: "Loans in Doctor",

            filterConfig: {
                id: 'filter',
                activeFilterIndex: 0,

                // put any by default filters 
                appliedFilters: {},
                appliedFilterCount: 0,
                filters: [

                    {
                        id: 'sort',
                        label: 'Sort By',
                        controlType: 'radio',
                        funcType: FILTER_TYPES.sort,

                        options: [
                            {
                                display: "Amount - High to Low",
                                dataColumn: 'value_amount',
                                value: 'desc',
                                checked: false,
                            },
                            {
                                display: "Amount - Low to High",
                                dataColumn: 'value_amount',
                                value: 'asc',
                                checked: false,
                            },

                            {
                                display: "EMI - High to Low",
                                dataColumn: 'value_emi',
                                value: 'desc',
                                checked: false,
                            },
                            {
                                display: "EMI - Low to High",
                                dataColumn: 'value_emi',
                                value: 'asc',
                                checked: false,
                            },

                            {
                                display: "Tenure - High to Low",
                                dataColumn: 'value_tenure',
                                value: 'desc',
                                checked: false,
                            },
                            {
                                display: "Tenure - Low to High",
                                dataColumn: 'value_tenure',
                                value: 'asc',
                                checked: false,
                            }
                        ]
                    },

                    {
                        id: 'loan_type',
                        label: 'Loan Type',
                        controlType: 'checkbox',
                        funcType: FILTER_TYPES.filter,

                        // by default > checkbox has selectAll
                        options: [
                            {
                                display: "Doctor Loan",
                                dataColumn: 'value_loantype',
                                value: 'Doctor Loan',
                                checked: false,
                            },
                            {
                                display: "Medical Equipment Finance",
                                dataColumn: 'value_loantype',
                                value: 'Medical Equipment Finance',
                                checked: false,
                            },
                        ],
                    },

                    {
                        id: 'amount_bounds',
                        label: 'Loan Amount',
                        controlType: 'checkbox',
                        funcType: FILTER_TYPES.bounds,
                        options: [
                            {
                                display: "Less than ₹5 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: undefined,
                                    max: 500000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹5 lakh to ₹10 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 500000,
                                    max: 1000000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹10 lakh to ₹15 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 1000000,
                                    max: 1500000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹10 lakh to ₹15 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 1000000,
                                    max: 1500000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹15 lakh to ₹20 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 1500000,
                                    max: 2000000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹20 lakh to ₹30 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 2000000,
                                    max: 3000000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹30 lakh to ₹50 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 3000000,
                                    max: 5000000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "Above ₹50 lakh",
                                dataColumn: 'value_amount',
                                bounds: {
                                    min: 5000000,
                                    max: undefined,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                        ]
                    },
                    {
                        id: 'tenure',
                        label: 'Tenure',
                        controlType: 'checkbox',
                        funcType: FILTER_TYPES.filter,

                        // by default > checkbox has selectAll
                        options: [
                            {
                                display: "12 months",
                                dataColumn: 'value_tenure',
                                value: 12,
                                checked: false,
                            },
                            {
                                display: "24 months",
                                dataColumn: 'value_tenure',
                                value: 24,
                                checked: false,
                            },
                            {
                                display: "36 months",
                                dataColumn: 'value_tenure',
                                value: 36,
                                checked: false,
                            },
                            {
                                display: "48 months",
                                dataColumn: 'value_tenure',
                                value: 48,
                                checked: false,
                            },
                            {
                                display: "60 months",
                                dataColumn: 'value_tenure',
                                value: 60,
                                checked: false,
                            },
                            {
                                display: "72 months",
                                dataColumn: 'value_tenure',
                                value: 72,
                                checked: false,
                            },
                            {
                                display: "84 months",
                                dataColumn: 'value_tenure',
                                value: 84,
                                checked: false,
                            },
                            {
                                display: "96 months",
                                dataColumn: 'value_tenure',
                                value: 96,
                                checked: false,
                            },
                        ],
                    },


                    {
                        id: 'emi_bounds',
                        label: 'EMI',
                        controlType: 'checkbox',
                        funcType: FILTER_TYPES.bounds,
                        options: [
                            {
                                display: "Less than ₹3,000",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 0,
                                    max: 3000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹3,000 to ₹5,000",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 3000,
                                    max: 5000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹5000 to ₹10,000",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 5000,
                                    max: 10000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹10000 to ₹15000",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 10000,
                                    max: 15000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹15000 to ₹25,000",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 1500000,
                                    max: 2000000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹25,000 to ₹50,000",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 25000,
                                    max: 50000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "₹50,000 to ₹1 Lakh",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 50000,
                                    max: 100000,
                                    inclusive: true,
                                },
                                checked: false,
                            },
                            {
                                display: "Above 1 Lakh",
                                dataColumn: 'value_emi',
                                bounds: {
                                    min: 100000,
                                    max: 0,
                                    inclusive: true,
                                },
                                checked: false,
                            },

                        ]
                    },

                    {
                        id: 'loan_variant',
                        label: 'Variant',
                        controlType: 'checkbox',
                        funcType: FILTER_TYPES.filter,

                        // by default > checkbox has selectAll
                        options: [
                            {
                                display: "Flexi Hybrid",
                                dataColumn: 'loan_variant',
                                value: 'Flexi Hybrid',
                                checked: false,
                            },
                            {
                                display: "Flexi Term",
                                dataColumn: 'loan_variant',
                                value: 'Flexi Term',
                                checked: false,
                            },
                            {
                                display: "Term",
                                dataColumn: 'loan_variant',
                                value: 'Term',
                                checked: false,
                            },
                        ],
                    },
                ]
            }
        },

        adBanners: [],
        bestSellers: [
            {
                id: "banners.best_sellers.1",
                title: "Pre-approved offers for you",
                banners: [
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_overlay__sample.png"
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_bg__sample.png"
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_bg__sample.png"
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_bg__sample.png",
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"

                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                    }
                ],
            },
            {
                id: "banners.best_sellers.2",
                title: "Pre-approved offers for you",
                banners: [
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_overlay__sample.png"
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_bg__sample.png"
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_bg__sample.png"
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/card_banner_bg__sample.png",
                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"

                    },
                    {
                        link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/pre_app_banner__sample.png"
                    }
                ],
            }

        ],

        exclusiveBanners: {
            id: "banners.exclusive",
            title: "Exclusive offers for you",
            banners: [
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/exclusive_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/exclusive_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/exclusive_banner__sample.png"
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/exclusive_banner__sample.png",
                },
                {
                    link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/exclusive_banner__sample.png"

                },
            ],
        },
        stripBanner_2: {
            id: "banners.strip.2",
            banner: {
                link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/strip__sample.png"
            }
        },

        checkCibil: {
            id: "cta.check_cibil",
            label: "Check your CIBIL Score",
            icon: {link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/right_arow.svg"}
        },








    }

    public static PDP: PDPTemplate = {
        id: 'DEFAULT.PDP',
        loanSummary: {
            id: 'loan.summary',
            title: "Loan Summary",
            subtitle: "Based on the amount selected, here is an indicative summary of your loan. Read our",
            t_and_c_label: "T&C",

            cta: {
                id: "cta.apply",
                label: "Apply"
            },
            is_revised_summary: false,

            t_and_c_content:{
                label:"Terms and conditions",
                content:"<p>Bajaj Finance Limited has the sole and absolute discretion, without assigning any reason to accept or reject any application. Terms and conditions apply*.</p>\r\n"

            }
        },

        depositSummary: {
            id: 'loan.summary',
            title: "Loan Summary",
            subtitle: "Based on the amount selected, here is an indicative summary of your loan. Read our",
            t_and_c_label: "T&C",

            cta: {
                id: "cta.apply",
                label: "Apply"
            },
            is_revised_summary: false,

            t_and_c_content:{
                title:"Terms and conditions",
                description:"<p>Bajaj Finance Limited has the sole and absolute discretion, without assigning any reason to accept or reject any application. Terms and conditions apply*.</p>\r\n"

            }
        },

        contents: [
            {
                id: "pdp.features",
                title: "Features and benefits",
                is_accordion: true,
                is_accordion_open:true, 
                showMoreToggle: true,
                mapp: [
                    {
                        // bullet paras 
                        type: CONTENT_TYPES.BULLET_PARA,
                        content: {
                            paragraphs: [
                                {
                                    heading: '2 Flexi variants',
                                    content: 'Pick the loan variant that suits you best: Flexi Term Loan, and Flexi Hybrid Loan.',
                                },
                                {
                                    heading: 'No part-prepayment charge on Flexi Loans',
                                    content: 'Repay a part of your loan in advance, at no extra cost. You can part-pay as many times as you want.',
                                    is_cta: true,
                                    cta: {
                                        id: '',
                                        label: 'Read about our Flexi Hybrid Loan',
                                        view: true
                                    }
                                },
                                {
                                    heading: 'Loan of up to Rs. 40 lakh',
                                    content: 'Manage your small or large expenses with loans ranging from Rs. 20,000 to Rs. 40 lakh.',
                                },
                                {
                                    heading: 'Convenient tenures',
                                    content: 'Manage your loan easily with repayment options ranging from 6 months to 96 months.',
                                },
                                {
                                    heading: 'Approval in just 5 minutes*',
                                    content: 'Complete your entire application online from the comfort of your home or wherever you are and get instant approval.',
                                },
                                {
                                    heading: 'Money in your account in 24 hours*',
                                    content: 'Your bank account will be credited with your loan amount within 24 hours* or, in some cases, on the same day of approval.',
                                },
                                {
                                    heading: 'No hidden charges',
                                    content: 'Our fees and charges are mentioned clearly on this page itself and also on our loan documents. We advise you to read these in detail before applying.',
                                    is_cta: true,
                                    cta: {
                                        id: '',
                                        label: 'Know about our fees and charges',
                                        view: true
                                    }
                                }
                            ],
                            initial_show_count: 4,
                            footerText: "*Terms and conditions apply.<br>Still haven’t found what you’re looking for? Click on any of the links at the top of this page."

                        }
                    },
                ],
            },

            {
                id: 'pdp.eligibility',
                title: "Eligibility criteria and documents required",
                is_accordion: true,
                is_accordion_open:true, 
                showMoreToggle: true,
                mapp: [
                    {
                        // text para 
                        type: CONTENT_TYPES.TEXT_PARA,
                        content: {
                            paragraphs: [
                                { content: "Any doctor can apply for our doctor loan, as long as you meet four basic criteria mentioned below. You will also need a set of documents to complete the application process" }
                            ],
                            initial_show_count: 1
                        }
                    },
                    {
                        // bullet list 
                        type: CONTENT_TYPES.BULLET_LIST,
                        content: {
                            paragraphs: [
                                {
                                    heading: "Eligibility criteria",
                                    points: [
                                        { content: "Nationality: Indian" },
                                        { content: "Age: 22 years to 73 years* (Age should be 73 years or less at the end of your tenure)" },
                                        { content: "CIBIL Score: 685 or higher" },
                                        { content: "Medical registration: Degree to be registered with the medical council" }
                                    ],
                                    footerText: "*Age should be 73 years or less at the end of your tenure"
                                },
                                {
                                    heading: "Documents",
                                    points: [
                                        { content: "KYC documents - Aadhaar/ passport/ voter’s ID/ driving license/ letter from NPR/ NREGA job card" },
                                        { content: "PAN card" },
                                        { content: "Medical registration certificate" }
                                    ],
                                    footerText: "*Additional documents required, if any, will be communicated during the application process"
                                }
                            ],

                        },

                    }
                ],
            },

            {
                id: "pdp.how_to_apply",
                title: "How to apply for a Doctor Loan",
                is_accordion: true,
                is_accordion_open:true, 
                showMoreToggle: true,
                mapp: [
                    {
                        // bullet list 
                        type: CONTENT_TYPES.BULLET_LIST,
                        content: {
                            paragraphs: [
                                {
                                    heading: "Step-by-step guide to apply for a doctor loan",
                                    points: [
                                        { content: "Click on the ‘APPLY’ button on this page." },
                                        { content: "Enter your 10-digit mobile number and OTP." },
                                        { content: "Fill in the application form with your basic Doctor and professional details." },
                                        { content: "Once you fill out the form, click on ‘PROCEED’." },
                                        { content: "Update the KYC details." },
                                        { content: "Schedule an appointment for document verification." }
                                    ],
                                    footerText: "*Note: Keep your medical registration certificate handy to finish the KYC process."
                                }
                            ]
                        }
                    }
                ],
            }


        ],

        tabulars: [
            {
                id: "pdp.tabular.charges",
                title: "Interest rates, fees and charges",
                is_accordion: true,
                mapp: [{
                    type: CONTENT_TYPES.TABULAR,
                    tabular: DEFAULT.ELEMENTS.chargesTabular
                }]
            },

            {
                id: "pdp.tabular.variants",
                title: "Compare loan variants",
                is_accordion: true,
                mapp: [{
                    type: CONTENT_TYPES.TABULAR,
                    tabular: DEFAULT.ELEMENTS.variantsTabular
                }]
            },
        ],

        faqs: DEFAULT.ELEMENTS.faqs,


        stripBanner_2: {
            id: "banners.strip.2",
            banner: {
                link: "https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/pdpx/strip__sample.png"
            }
        },

        loanExtras: {
            id: 'loan.extras',
            title:"Exclusive rewards",
            desc:"worth up to ₹1,000 with this credit card",

            icon: {
                link: "",
            },


            extras:[
                {
                    icon:{
                        link:""
                    },
                    title:"Up to ₹800",
                    desc:"Cashback vouchers on bill payments and recharges",
                    popup:{
                        description:"T&C apply"
                    }
                }
            ]


        },
        disclaimer: {
            id: 'loan.calc.disclaimer',
            view: true, 
            title: "Please note:",
            content: "*Subject to change basis final eligibility.<br>**Rate of interest may vary based on RBI and/or BHFL policies/ guidelines. For detailed FRR, ",
            cta: {
                id: 'loan.calc.disclaimer.cta',
                label: "click here.",
            },
            background: "#FFF3F3",
        },


    }


    public static CONTENT_COLLECTION: ContentCollectionRender = {
        id: "default.content_collection",
        title: "content collection",
        is_accordion: true,
        showMoreToggle : true,
        mapp: [
            // features 
            {
                // bullet paras 
                type: CONTENT_TYPES.BULLET_PARA,
                content: DEFAULT.ELEMENTS.paragraphCollection
            },

            // eligibility
            {
                // text para 
                type: CONTENT_TYPES.TEXT_PARA,
                content: DEFAULT.ELEMENTS.textPara
            },
            {
                // bullet list 
                type: CONTENT_TYPES.BULLET_LIST,
                content: DEFAULT.ELEMENTS.bulletList
            }
        ],
    }
}