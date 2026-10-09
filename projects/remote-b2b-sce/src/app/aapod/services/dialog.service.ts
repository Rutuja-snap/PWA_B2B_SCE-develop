import { Injectable, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HorizontalVideoModel } from '../model/kpoint.model';
import { B2bHorizontalVideoComponent } from '../components/b2b-horizontal-video/b2b-horizontal-video.component';
import {ApiIntegartedService} from 'api-integarted'

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  stack: MatDialogRef<any, any>[] = []

  constructor(
    private matDialog: MatDialog,
    private ngZone: NgZone,
    private matSnackbar : MatSnackBar,
    private apiIntegratedService : ApiIntegartedService
  ) { }

  openHorizontalVideo(videoData: HorizontalVideoModel) {
    if (this.apiIntegratedService.checkInternetStatus()) {
    this.ngZone.run(() => {
      const dialog = this.matDialog.open(B2bHorizontalVideoComponent, {
        data: videoData,
        disableClose: false,
        panelClass: 'layout-dialog-video-player'
      });
      this.push(dialog)
      dialog.beforeClosed().subscribe(() => {
        this.pop()
      });
    });
    }
    else{
      this.matSnackbar.open("Please check your Internet Connection.", '', {
        duration: 2000,
        panelClass: 'clp-error-toast'
      });
    }
  }

  
  private push(ref: MatDialogRef<any, any>) {
    this.stack.push(ref)
  }

  private pop(): MatDialogRef<any, any> {
    return this.stack.pop()
  }

  private peek(): MatDialogRef<any, any> {
    if (this.stack.length === 0)
      return null
    return this.stack[this.stack.length - 1]
  }

}