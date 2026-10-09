import { Component, HostListener, OnInit } from '@angular/core';
import { BannersHorizRender, TextRatingsRender, WatchVideosRender, WrapCards, XFAQRender } from '../../model/render.model'
import { AaFlowService } from '../../services/aa-flow.service';
import { Router } from '@angular/router';
import { B2bBannersCarouselComponent } from '../b2b-banners-carousel/b2b-banners-carousel.component';
import { B2bTextRatingsComponent } from '../b2b-text-ratings/b2b-text-ratings.component';
import { FeatureCardsComponent } from '../feature-cards/feature-cards.component';
import { StepsComponentComponent } from '../steps-component/steps-component.component';
import { B2bXfaqComponent } from '../b2b-xfaq/b2b-xfaq.component';
import { B2bWatchVideosComponent } from '../b2b-watch-videos/b2b-watch-videos.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

@Component({
  selector: 'app-aa-pdp',
  templateUrl: './aa-pdp.component.html',
  styleUrls: ['./aa-pdp.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    B2bBannersCarouselComponent,
    B2bTextRatingsComponent,
    FeatureCardsComponent,
    StepsComponentComponent,
    B2bXfaqComponent,
    B2bWatchVideosComponent,
    TranslateModule
  ]
})
export class AaPdpComponent implements OnInit {

  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 768 ? true : false
  }

  textRatings: TextRatingsRender = {
    id: "texts",
    tab: 'default',
    title: "Account Aggregator",
    subtitle: "Hassle-free eligibility check | 3-step process | Exclusive loan offers.",
    rating: {
      count: 1765,
      rating: 4.4,
      hide_rating: true,
      hide_count: true
    }
  }

  carouselConfig: BannersHorizRender = {
    id: 'banners.carousel',
    banners: [
      { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/financial-pluse?scl=1&fmt=png-alpha' },
      { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/financial-pluse?scl=1&fmt=png-alpha' },
      { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/financial-pluse?scl=1&fmt=png-alpha' },
      { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/financial-pluse?scl=1&fmt=png-alpha' },
      { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/financial-pluse?scl=1&fmt=png-alpha' }
    ],

    indicators: true,
    controls: true,
    autoSlide: false,
    showShareIcon: false,
    sliderInterval: 3000, // default auto slide interval

    footer_text: "Trusted by 10 lakh+ customers.",

  }

 
  faqs: XFAQRender = {
    id: 'pdp.faqs',
    title: "Frequently asked questions",
    initial_show_count: 2,
    panelsOpenByDefault: false,
    expansion_mode: 'first',
    showMore: true,
    faqs: [
      {
        question: "What is an Account Aggregator (AA) and why is it important for verifying bank statements?",
        answer: "An Account Aggregator (AA) is crucial for verifying bank statements as it securely retrieves and consolidates financial data from multiple institutions. This streamlined process eliminates manual efforts, ensuring accuracy and efficiency in verifying income, assets, and liabilities required for various financial transactions like loans or investments."
      }
    ]
  }

  benefitsCards: WrapCards = {
    id: 'pdp.feature_cards',
    title: "Key features",
    cards: [
      {
        icon: { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/gold-bag-insurance-secure-6?scl=1&fmt=png-alpha' },
        title: "Simplified Loan Process",
        description: "Securely share your financial details and get loans faster",
      },
      {
        icon: { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/digilocker-cloud-secure?scl=1&fmt=png-alpha' },
        title: "Secure Data Sharing",
        description: "Your data is shared securely, only with your consent."
      },
      {
        icon: { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/bank-store-value-personal-account-1?scl=1&fmt=png-alpha' },
        title: "Personalised Financial Services",
        description: "Understanding your financial needs allows us to offer Personalised services."
      },
      {
        icon: { link: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/rupee-money-shield?scl=1&fmt=png-alpha' },
        title: "Free of Cost",
        description: "Using the Account Aggregator (AA) framework is free of charge for customers."
      }
    ]
  }

  watchVideos: WatchVideosRender = {
    id: "pdp.watch_videos",
    title: "Watch videos",
    videos: [
      {
        thumbnail: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/gcc-36298648-ae40-4de3-94d6-0a580c0ffd77?scl=1&fmt=webp',
        type: 'video',
        link: '',
        description: 'Six reasons to take Personal Loan Bajaj Finserv',
        kpoint_id: 'gcc-36298648-ae40-4de3-94d6-0a580c0ffd77'
      },
      {
        thumbnail: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/gcc-3404df27-fd92-4abe-83e4-f81c772b8f96-2?scl=1&fmt=webp',
        type: 'video',
        link: '',
        description: '2 What is Flexi Loan and its process',
        kpoint_id: 'gcc-3404df27-fd92-4abe-83e4-f81c772b8f96'
      }
    ]
  }

  textDesc: string = 'b2b_sce.aa_pdp.textDesc'

  
  stepsRender: any = {
    id: 'sce.pdp.steps',
    title: 'Steps to check loan eligibility',
    data: [{
      numData: '1',
      title: 'Share personal details',
      description: 'Provide your basic details, including full name, PAN, date of birth, and PIN code',
    },
    {
      numData: '2',
      title: 'Eligibility Check',
      description: 'We will check your loan eligibility',
    },
    {
      numData: '3',
      title: 'Loan offer for you',
      description: 'Based on your profile, we will present you with a tailored loan offer.',
    }]
  }

  aemData: any;
  ctaLabel: string = ''
  constructor(
    private aaFlow: AaFlowService, 
    private router: Router,
    private aaApi: AaApiService
  ) { }

  ngOnInit(): void {
    try{
      console.log('this.faqs before', this.faqs);
      this.isMobile = window.innerWidth < 768 ? true : false
      this.getAemData();
      console.log('this.faqs after', this.faqs);
    } catch(e) {
      console.log(e)
    }
  }

  CTAreceiver(e: any) {
    try {
      console.log(e)
    }
    catch (e) {
      console.log(e)
    }
  }

  onProceed() {
    try {
      this.router.navigate(['/', 'b2b-sce', 'personaldetails'])
    }
    catch (e) {
      console.log(e)
    }
  }

  processAEMarray(type: "card-image" | "steps" | "videos" | "benefits", data: any[]) {
    try {
      if (!Array.isArray(data)) {
        return
      }
      if (type === 'card-image') {
        this.carouselConfig.banners = data.map(item => {
          return { link: item["iconimage-android"] };
        })
      } else if (type === 'benefits') {
        this.benefitsCards.cards = data.map(item => {
          return { icon: { link: item["iconimage-android"] }, title: item.icontitle, description: item.icondescription };
        })
      } else if (type === 'videos') {
        this.watchVideos.videos = data.map(item => {
          return {
            thumbnail: item['image-android'],
            type: 'video',
            link: '',
            description: item['title'],
            kpoint_id: item['kpoint-id']
          }
        })
      } else if (type === 'steps') {
        this.stepsRender.data = data.map((item, index) => {
          return {
            numData: (index + 1).toString(),
            title: item['icontitle'],
            description: item['icondescription'],
          }
        })
      }
      console.log(this.stepsRender.data, 'this.stepsRender.data');
    }
    catch (e) {
      console.log(e)
    }
  }

  async getAemData() {
    const aemUrl = this.aaFlow.getLanguageBasedAemUrl(environment.URL.B2B_SCE_AEM.PDP);
    console.log('language-based aem url', aemUrl);
    const cacheResponse = await this.aaApi.aemCache(aemUrl);
    console.log('actual json', cacheResponse)
    const fjson = this.aaFlow.formatResponseData(cacheResponse);
    const screenContent = fjson?.['content']?.['aa-landing-screen']
    this.faqs.faqs = screenContent.faqs.group || []
    this.textRatings.title = screenContent.title.title || ""
    this.textRatings.subtitle = screenContent.title.description || ""
    this.carouselConfig.footer_text = screenContent['trusted-by'].icontitle || ""
    this.faqs.title = screenContent['faq-section'].title || ""
    this.benefitsCards.title = screenContent['benefits-of-aa'].title || ""
    this.stepsRender.title = screenContent['step'].title || ""
    this.watchVideos.title = screenContent['video'].title || ""
    this.ctaLabel = screenContent['continue-button'].ctalabel1 || this.ctaLabel
    this.processAEMarray("card-image", screenContent['card-image'].group)
    this.processAEMarray("benefits", screenContent['benefits-of-aa-wrapper'].group)
    this.processAEMarray("videos", screenContent['video'].group)
    this.processAEMarray("steps", screenContent['steps-wrapper'].group)
  }
}
