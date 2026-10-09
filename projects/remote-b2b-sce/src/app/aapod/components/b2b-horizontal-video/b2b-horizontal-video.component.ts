import { Component, OnInit, ViewChild, ElementRef, Inject, Injector } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { ParentDataServices } from '../../services/parentData.service';
import { HorizontalVideoService } from '../../services/horizontal-video.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { ApiIntegartedService } from 'api-integarted';

declare global {
  interface Window {
    closeKpointPopupModal(playerRef: string): void
  }
}
@Component({
  selector: 'app-b2b-horizontal-video',
  templateUrl: './b2b-horizontal-video.component.html',
  styleUrls: ['./b2b-horizontal-video.component.scss'],
  standalone: true,
  imports: []
})
export class B2bHorizontalVideoComponent implements OnInit  {

  _containerRef: ElementRef
  @ViewChild('container')
  get containerRef(): ElementRef { return this._containerRef }
  set containerRef(_containerRef: ElementRef) {
    this._containerRef = _containerRef
    this.loadScript(this._containerRef.nativeElement)
  }
  kpointId: string
  thumbnail: string
  packageId: string
  scriptUrl = environment.URL.offersTwo.getHorizontalVideoScript;
  cdkElement
  cdkZindex
  videoCloseSub : Subscription
  constructor(public injector: Injector,
    public horizontalVideoService: HorizontalVideoService,
    public dialogRef: MatDialog,
    public apiIntegratedService: ApiIntegartedService,
    private parentStorageService: ParentDataServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.kpointId = data?.kpointId;
    this.thumbnail = data?.thumbnailPath || ''
    this.packageId = data?.packageId || ''
    this.horizontalVideoService.setKpointRef()

    this.handleCTAClick = this.handleCTAClick.bind(this)
  }
  ngOnInit() {
    const html = document.querySelector("html")
    html.classList.remove("cdk-global-scrollblock")
    html.removeAttribute("style")
    if (environment.CONNECTION_SOURCE === 'APP' && this.parentStorageService.deviceOS !== 'ios') {
      prompt('controlorientationforvideo://true')
    }
    this.horizontalVideoService.setVideoModalStatus('open')
    this.videoCloseSub = this.horizontalVideoService.videoClose.subscribe(
      () => {
        window.closeKpointPopupModal(this.horizontalVideoService.getKpointRef())
        this.onCloseClick()
      }
    )
  }
  ngAfterViewInit() {
    const body = document.querySelector("body")
    this.cdkElement = document.getElementsByClassName('cdk-overlay-container')?.[0];
    this.cdkZindex = this.cdkElement?.style?.zIndex
    this.cdkElement ? this.cdkElement.style.zIndex=9999999 : null;
    const observer = new MutationObserver(() => {
      if (document.querySelector(`#${this.horizontalVideoService.getKpointRef()} #closeModal`)) {
        document.querySelector(`#${this.horizontalVideoService.getKpointRef()} #closeModal`).addEventListener('click', () => {
          this.onCloseClick()
        })
        document.addEventListener("on-video-popup-state-change", (event: CustomEvent) => {
          const { state } = event.detail
          this.horizontalVideoService.setVideoModalStatus(state)
        })
        document.addEventListener("kpw-onclick-button", this.handleCTAClick)
        observer.disconnect()
      }
    })
    observer.observe(body, { subtree: true, childList: true })
  }
  ngOnDestroy(): void {
    this.cdkElement ? this.cdkElement.style.zIndex=this.cdkZindex : null;
    this.videoCloseSub.unsubscribe()
  }
  loadScript(body: HTMLDivElement) {
    const script = document.createElement('script')
    script.innerHTML = ''
    script.src = this.scriptUrl
    script.async = false
    script.defer = true
    body.appendChild(script)
  }
  onCloseClick() {
    this.dialogRef.closeAll()
    if (environment.CONNECTION_SOURCE === 'APP' && this.parentStorageService.deviceOS !== 'ios') {
      prompt('controlorientationforvideo://false')
    }
    this.horizontalVideoService.setVideoModalStatus(null)
    document.removeEventListener("kpw-onclick-button", this.handleCTAClick)
    document.getElementById(this.horizontalVideoService.getKpointRef())?.remove()
  }
  handleCTAClick(event) {
    const detail = event?.detail
    for (const key in detail) {
      if (typeof detail[key] === "string" && detail[key].startsWith("bajajsuperapp")) {
        this.apiIntegratedService.inAppDeeplinkCall(detail[key])
        this.onCloseClick()
        break
      }
    }
  }
}
