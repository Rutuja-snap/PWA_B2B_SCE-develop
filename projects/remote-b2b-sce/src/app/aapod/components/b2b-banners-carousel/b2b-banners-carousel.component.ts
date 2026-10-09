import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BannersHorizRender, RenderOutput } from '../../model/render.model';
import { transition, trigger, style, animate } from '@angular/animations';
import { XuiElement } from '../../Xui/element.xui';
import { Asset } from '../../model/helper.model';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-b2b-banners-carousel',
  templateUrl: './b2b-banners-carousel.component.html',
  styleUrls: ['./b2b-banners-carousel.component.scss'],
  animations: [
    trigger('slide', [
      transition(':increment', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
    ])
  ],
  standalone: true,
  imports: [
    NgIf,
    NgFor
  ]
})
export class B2bBannersCarouselComponent implements XuiElement, OnInit{

   // attributes 
   loaded: boolean = false;
   @Output() emitter: EventEmitter<RenderOutput> = new EventEmitter<RenderOutput>();
   @Input() render : BannersHorizRender;
   isMobile : boolean = false;
   // default values 
   carouselConfig: BannersHorizRender = {
     id: 'banners.carousel',
     banners: [
       {link: ''}
     ],
 
     indicators: true,
     controls: true,
     autoSlide: false,
     showShareIcon: true,
     sliderInterval: 3000, // default auto slide interval
 
     footer_text: "Trusted by 3 lakh+ customers",
 
   }
   
   selectedIndex : number = 0 ;
   private touchStartX: number = 0
   private touchEndX: number = 0;
   private autoSlideInterval: any;
   @ViewChild('vxPlayerContainer', { static: true }) vxPlayerContainer!: ElementRef;
   @ViewChild('scrollingImages') scrollingImages : ElementRef;
  
   @HostListener('window:resize', ['$event'])
   onResize(event) {
      this.isMobile = event.target.innerWidth <= 768;
   }
   ngOnInit(): void {
     
     if(this.render){
       if(this.render.autoSlide === undefined){
         this.render.autoSlide = this.carouselConfig.autoSlide
       }
       if(this.render.controls === undefined){
         this.render.controls = this.carouselConfig.controls
       }
 
       if(this.render.indicators === undefined){
         this.render.indicators = this.carouselConfig.indicators
       }
 
       if(this.render.sliderInterval === undefined){
         this.render.sliderInterval = this.carouselConfig.sliderInterval
       }
 
       if(this.render.showShareIcon === undefined){
         this.render.showShareIcon = this.carouselConfig.showShareIcon
       }
 
       // if(this.render.autoSlide){
       //   this.autoSlideImages()
       // }
       if (this.render.autoSlide) {
         this.startAutoSlide();
       }
     }
 
     this.renderElement()
 
   }
 
   renderElement() {
     this.loaded = true
 
     console.log("pdpx/banners-carousel/render", this.render)
   };
 
   emitt(event: RenderOutput) {
     this.emitter.emit(event);
   }
 
   // share 
   onShare(){
   
     // what has to be shared
     // if(this.render.banners?.[this.selectedIndex]){
     //   this.helper.share({
     //     link: this.render.banners[this.selectedIndex].link,
     //     title: this.render.title,
     //     text: this.render.title,
     //   })
     // }
 
     this.emitt({event: 'share', params: {image: this.render.banners[this.selectedIndex], source: this.render.id}})
   }
 
 
   // playVideo(kpoint_id='',title='',render=this.render){
   playVideo(video: Asset){ 
 
     void video; 

     const videos: Asset[] = []
     this.render.banners.forEach(a => {
       if(a.type === 'video'){
         videos.push(a)
       }
     })
 
    //  const container = this.vxPlayerContainer.nativeElement
 
    //  if(video.type == 'video' && video.kpoint_id){
    //    this.flow.overrideBackPress(() => {
    //      this.helper.closeVideo()
    //    })
    //    let vx = this.helper.openReelsPopUp(video, videos, container, this.flow.getOverrideBackPressClearer())
       
     
    //  }
    //  else{
    //    this.flow.openErrorPopup({title: 'Error', description: 'Video not found!'});
    //  }
 
     // debugger
     // #pdpx_video
     
     // if not initPlayer
     // init the player with all the videos in the banners
     
 
     // >active video should be > asset 
 
     this.emitt({
       event: 'ct.track',
       params: {
         ct: {
           type: 'section_click',
           section: "PDP BANNER COMPONENT",
           section_cta: "PLAY",
           event_name: "",
           props: {}
         }
       }
     })
     
   }
 
 
 /* 
   autoSlideImages(){
     setInterval(() => {
       this.nextClick();
     }, this.render.sliderInterval);
   }
 */
 
   selectImage(index: number){
     this.selectedIndex = index;
     this.prevSelectedIndex = index;
     this.emitt({
       event: 'ct.track',
       params: {
         ct: {
           type: 'section_click',
           section: "PDP BANNER COMPONENT",
           section_cta: "",
           event_name: "",
           props: {}
         }
       }
     })
   }
 
   prevClick(auto: boolean = false){
     if(this.selectedIndex === 0){
       this.selectedIndex = this.render.banners?.length - 1;
     }else{
       this.selectedIndex--;
     }
 
     if(!auto){
       this.emitt({
         event: 'ct.track',
         params: {
           ct: {
             type: 'section_click',
             section: "PDP BANNER COMPONENT",
             section_cta: "PREVIOUS",
             event_name: "",
             props: {}
           }
         }
       })
     }
   }
 
   nextClick(auto: boolean = false){
     if(this.selectedIndex === this.render.banners?.length - 1){
       this.selectedIndex = 0;
     }else{
       this.selectedIndex++;
     }
 
     if(!auto){
       this.emitt({
         event: 'ct.track',
         params: {
           ct: {
             type: 'section_click',
             section: "PDP BANNER COMPONENT",
             section_cta: "NEXT",
             event_name: "",
             props: {}
           }
         }
       })
     }
   }
 
 
   onTouchStart(event: TouchEvent) {
     this.stopAutoSlide();
     this.touchStartX = event.touches[0].clientX;
   }
   onTouchMove(event: TouchEvent) {
     this.touchEndX = event.touches[0].clientX;
   }
 
   onTouchEnd() {
     const deltaX = this.touchEndX - this.touchStartX;
     const threshold = 50;
 
     if (Math.abs(deltaX) > threshold) {
       if (deltaX > 0) {
         this.prevClick();
       } else {
         this.nextClick();
       }
     }
 
     // this.startAutoSlide();
     this.touchStartX = 0;
     this.touchEndX = 0;
   }
 
   startAutoSlide() {
     this.autoSlideInterval = setInterval(() => {
       this.nextClick(true);
     }, this.render.sliderInterval);
   }
 
   stopAutoSlide() {
     clearInterval(this.autoSlideInterval);
   }
 
   scrollSmoothly(direction: string) {
     const container = this.scrollingImages.nativeElement;
     const scrollAmount = 60; // Adjust this value as needed
     if (direction === 'forward') {
       container.scrollTop += scrollAmount;
     } else if (direction === 'backward') {
       container.scrollTop -= scrollAmount;
     }
     this.emitt({
       event: 'ct.track',
       params: {
         ct: {
           type: 'section_click',
           section: "PDP BANNER COMPONENT",
           section_cta: direction === 'forward' ? "SCROLL DOWN" : "SCROLL UP",
           event_name: "",
           props: {}
         }
       }
     })
   }
   prevSelectedIndex : number
   imageHover(index : number){
     this.prevSelectedIndex = this.selectedIndex;
     this.selectedIndex = index;
   }
 
   imageHoverLeft(){
     this.selectedIndex = this.prevSelectedIndex;
   }
}
