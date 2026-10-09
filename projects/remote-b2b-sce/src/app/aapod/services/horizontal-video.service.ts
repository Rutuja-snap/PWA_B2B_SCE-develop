import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorizontalVideoService {
  videoClose: Subject<number> = new Subject<number>()
  playerRef: string = null
  private kpointRef;
  private videoModalStatus;
  public reelsOpen = false
  reelsClose: Subject<void> = new Subject<void>()  

  // constructor() { }

  setKpointRef(){
    this.kpointRef = `kpoint${Date.now()}`;
  }
  getKpointRef(){
    return this.kpointRef
  }
  setVideoModalStatus(status: string){
    this.videoModalStatus = status
  }
  getVideoModalStatus(){
    return this.videoModalStatus
  }
}
