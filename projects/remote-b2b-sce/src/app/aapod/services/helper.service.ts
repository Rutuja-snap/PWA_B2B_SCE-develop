import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { Asset } from '../model/helper.model';
import { HorizontalVideoModel } from '../model/kpoint.model';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor( private _dialogService: DialogService
  ){}

  playVideo(video : Asset){
    const videoDetails: HorizontalVideoModel={
      kpointId : video['kpoint_id'],
      thumbnailPath : video['thumbnail'],
      title : video['title'],
      packageId: video?.['package_id'] || ''
      }
      this._dialogService.openHorizontalVideo(videoDetails)
    
  }
  
  addSubs$(sub: Subscription, list: Subscription[]) {
    if (!list) {
      list = []
    }
    list.push(sub)

  }

  closeSub$(list: Subscription[]) {
    if (list) {
      list.forEach(sub => {
        if (sub && !sub.closed) {
          sub.unsubscribe()
        }
      })
    }
  }

}
