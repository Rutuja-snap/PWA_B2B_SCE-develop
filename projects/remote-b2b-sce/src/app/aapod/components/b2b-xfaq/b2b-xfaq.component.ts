import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { RenderOutput, XFAQRender } from '../../model/render.model';
import { DEFAULT } from '../../contents/default.content';
import { XuiElement } from '../../Xui/element.xui';
import { Asset, XFAQ } from '../../model/helper.model';
import { AaFlowService } from '../../services/aa-flow.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-b2b-xfaq',
  templateUrl: './b2b-xfaq.component.html',
  styleUrls: ['./b2b-xfaq.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatExpansionModule,
    TranslateModule
  ]
})
export class B2bXfaqComponent implements XuiElement, OnInit, AfterViewInit{


  // attributes 
  id: string = '';
  loaded: boolean = false;

  @Input()
  render: XFAQRender = DEFAULT.ELEMENTS.faqs;
  @Output() emitter: EventEmitter<RenderOutput> = new EventEmitter<RenderOutput>();

  // internal 
  faq_Layout: any[];
  showMore: boolean = false;
  panelOpenState = true;

  filtered?: XFAQ[] = []
  @ViewChild('faqContent') faqContent: ElementRef;
  isShowMoreVisible: boolean = false;
  @Input() maxheight: number = 500; // Default max height
  maxHeight: number
  // isExpanded = false;

  @ViewChild('vxPlayerContainer', { static: true }) vxPlayerContainer!: ElementRef;
  vxPlayer: any;
  
  constructor(
    private aaFlow: AaFlowService
  ) { }

  ngOnInit(): void {
    console.log("FAQ render ", this.render)

    // sub to update$
    if(!this.render.update$){
      this.render.update$ = new Subject<boolean>();
    }
    const _s = this.render.update$?.subscribe(x => {
      console.log("pdpx/xfaq/update$", x, this.render.faqs?.length, _s)
      // this.renderElement()
      timer(500).subscribe(z => {
        // this.setXfaqHeight();
        console.log("XFAQ OnInit Called ", z);

        this.updateCap()

      })
    })

    this.renderElement()
  }

  ngAfterViewInit() {
    // this.setXfaqHeight();
    this.updateCap()

    // console.log("XFAQ After view Init Called ")

  }

  setXfaqHeight() {
    // Check if content exceeds maxHeight
    if (this.faqContent.nativeElement.clientHeight > this.maxheight) {
      this.maxHeight = this.maxheight;
      this.isShowMoreVisible = true;
    } else {
      this.isShowMoreVisible = false;
    }
    console.log("pdpx/xfaq/setXfaqHeight", this.faqContent.nativeElement.clientHeight)
    // console.log("this.ccontent.nativeElement?.clientHeight ", this.faqContent.nativeElement?.clientHeight)
  }

  // by default false 
  
  // bottom section | element should be visible based on this 
  isCapEnabled: boolean = false

  // showMore/showLess > value to be decided by this
  isCapExpanded: boolean = true
  
  updateCap(){

     if(this.faqContent?.nativeElement){
      if(this.faqContent.nativeElement.clientHeight >= 500){
        this.isCapEnabled = true;
        this.isCapExpanded = false;
      } else {
        this.isCapEnabled = false;
        this.isCapExpanded = true;
      }
      console.log(`pdpx/xfaq/capp/${this.render.id}/height ${this.faqContent?.nativeElement?.clientHeight}|enabled ${this.isCapEnabled}|expanded ${this.isCapExpanded}`)
    } else {
      this.isCapEnabled = false;
      this.isCapExpanded = true;
    }
  }

  capAction(){
    this.isCapExpanded = !this.isCapExpanded
    this.emitt({
      
      event: 'ct.track',
      params: {
        ct: {
          type: 'section_click',
          section: this.render.id,
          section_cta: this.isCapExpanded ? 'Show More' : 'Show Less',
          event_name: "",
          props: {__section_mapp: true}
        }
      }
    })
  }


  renderElement() {

    this.clearSearch()
    if (!this.render.search$) {
      this.render.search$ = new Subject<string>();
    }
    this.render.search$.subscribe(x => {

      //!x || !x?.length
      if (!x?.length) {
        this.clearSearch()
      }
      else {
        this.applySearch(x)
      }
    })

    this.loaded = true
  };

  emitt(event: RenderOutput) {
    this.emitter.emit(event);
  }


  clearSearch() {
    this.filtered = this.render.faqs?.slice()

  }

  applySearch(search: string){
    // const list = this.render.faqs?.slice()
    this.render.faqs?.slice()
    // list = this.helper.filterBySearch(list, search, null)

    // if (list) {
    //   this.filtered = list
    // }
    console.log("pdpx/xfaq/applySearch", search)
  }

  toggleCards() {
    this.showMore = !this.showMore;
  }

  getVXPlayer(container: any, ids: any[]) {

    // no-dd-sa:typescript-best-practices/no-unsafe-assignment
    return (window as any).VXPlayer(container, {
      hostname: 'videos.bajajfinserv.in',
      type: 'reels',
      videoIds: ids,
      mode: 'popup',
      autoScroll: true,
      fullscreen: true,
      scalable: true,
      platform:""
    });
  }

  initPlayer(ids: any[]): void {
    try {
      // debugger

      const container = this.vxPlayerContainer.nativeElement;
      this.vxPlayer = this.getVXPlayer(container, ids)
      console.log(this.vxPlayer);

    } catch (error) {
      console.log("Error in initPlayer", error);
    }

  }


  openVideo(video: Asset){
    // const container = this.vxPlayerContainer.nativeElement
    this.vxPlayerContainer.nativeElement
    if(video.type === 'video' && video.kpoint_id){
      this.aaFlow.playVideo(video)
    }
    else{
      // this.flow.openErrorPopup({title: 'Error', description: 'Video not found!'});
    }
  }


  onXFaqCTA(xf: XFAQ) {

    if (xf.cta?.action === 'video') {
      if (xf.video?.kpoint_id) {
        this.openVideo(xf.video)
      }
    }
  }

  onResize(e){
    console.log("XFAQ resize event triggeed ", e)
    this.updateCap();
  }

  processLinks(e: any) {
    const element: HTMLElement = e.target;
    const parent: HTMLElement = element.parentElement
    e.preventDefault();
    if (element.nodeName === 'A' || parent?.nodeName === 'A') {
      const is_anchor_child = parent?.nodeName === 'A' && element.nodeName !== 'A'

      
      let link = is_anchor_child ?  parent.getAttribute('href') : element.getAttribute('href')
      if (link.includes("unsafe")) {
        link = link.replace('unsafe:', '')
      }
     
    }
  }


}
