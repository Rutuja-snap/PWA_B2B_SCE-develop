import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RenderOutput, WatchVideosRender } from '../../model/render.model';
import { Asset } from '../../model/helper.model';
import { AaFlowService } from '../../services/aa-flow.service';
import { NgIf, NgFor } from '@angular/common';


@Component({
  selector: 'app-b2b-watch-videos',
  templateUrl: './b2b-watch-videos.component.html',
  styleUrls: ['./b2b-watch-videos.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor
  ]
})
export class B2bWatchVideosComponent {

   title: string = '';

  // attributes 
  id: string = '';
  loaded: boolean = false;

  @Input()
  render: WatchVideosRender = {
    "id": "plp.results.watch_videos",
    "title": "",
    "videos": [
      // {
      //   "type": "video",
      //   "title": "What types of collateral can you use for our secured business loan",
      //   "description": "Watch this video to know the different types of collateral you can pledge for our secured business loan. ",
      //   "thumbnail": "https://cms-assets.bajajfinserv.in/is/image/bajajfinancestage/gcc-a648398c-4861-4c9f-9749-0593ffd5d433?scl=1",
      //   "kpoint_id": "gcc-a648398c-4861-4c9f-9749-0593ffd5d433",
      //   link: "",
      // }
    ],
    "isPlayerInitiated": false
  }

  // to fix width in filtered result
  // additional input > for single video mode 
  @Input() MODE: 'LIST' | 'VIDEO' = 'LIST'
  @Input() video: Asset;

  @Output() emitter: EventEmitter<RenderOutput> = new EventEmitter<RenderOutput>();
  // @ViewChild('vxPlayerContainer', { static: true }) vxPlayerContainer!: ElementRef;
  // vxPlayer: any;

  constructor(
    private aaFlow: AaFlowService
  ){}



  ngOnInit(): void {
    if (this.MODE && this.video) {
      this.render.videos = [this.video]
    }
  }

  renderElement() {
    this.loaded = true
  };

  emitt(event: RenderOutput) {
    this.emitter.emit(event);
  }


  openVideo(video: Asset){

    if(video.type === 'video' && video.kpoint_id){
      console.log('opening video',video.kpoint_id);
      this.aaFlow.playVideo(video);
    }

    this.emitt({
      event: 'ct.track',
      params: {
        ct: {
          type: 'section_click',
          section: "WATCH VEDIO",
          section_cta: "WATCH VEDIO",
          event_name: "",
          props: {}
        }
      }
    })

  }


}
