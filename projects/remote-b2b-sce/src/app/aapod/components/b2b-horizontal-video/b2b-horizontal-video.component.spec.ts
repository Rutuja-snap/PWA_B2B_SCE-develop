import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bHorizontalVideoComponent } from './b2b-horizontal-video.component';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { ParentDataServices } from '../../services/parentData.service';
import { HorizontalVideoService } from '../../services/horizontal-video.service';
import { ApiIntegartedService } from 'api-integarted';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

// Simple, lightweight stubs to isolate the component under test
class ParentDataServicesStub { deviceOS = 'android'; }
// Replace class stub with spy-able object for richer assertions
const horizontalSvcMock = (() => {
  const videoClose = new Subject<void>();
  return {
    videoClose,
    setKpointRef: jest.fn(),
    getKpointRef: jest.fn().mockReturnValue('k123'),
    setVideoModalStatus: jest.fn()
  };
})();

describe('B2bHorizontalVideoComponent', () => {
  let component: B2bHorizontalVideoComponent;
  let fixture: ComponentFixture<B2bHorizontalVideoComponent>;
  let promptSpy: jest.SpiedFunction<typeof window.prompt>;

  beforeEach(() => {
    // Prevent native prompt from blocking the headless browser
    promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('');
    // Provide a no-op global used by the component when closing the player
    (window as any).closeKpointPopupModal = jest.fn();
    // Mock environment to simulate APP connection
    environment.CONNECTION_SOURCE = 'APP';

    TestBed.configureTestingModule({
      imports: [ B2bHorizontalVideoComponent, HttpClientTestingModule ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn(), closeAll: jest.fn() } },
        { provide: ParentDataServices, useClass: ParentDataServicesStub },
        { provide: HorizontalVideoService, useValue: horizontalSvcMock },
        { provide: ApiIntegartedService, useValue: { inAppDeeplinkCall: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { kpointId: 'k', thumbnailPath: '', packageId: '' } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(B2bHorizontalVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set video modal status to open on init (non-ios)', () => {
    expect(horizontalSvcMock.setVideoModalStatus).toHaveBeenCalledWith('open');
    expect(window.prompt).toHaveBeenCalledWith('controlorientationforvideo://true');
  });

  it('ios device should not invoke orientation prompt', () => {
    promptSpy.mockClear();
    const parent = TestBed.inject(ParentDataServices);
    (parent as any).deviceOS = 'ios';
    component.ngOnInit();
    expect(promptSpy).not.toHaveBeenCalled();
  });

  it('should close on videoClose observable emit and call global close', () => {
    const dialog = TestBed.inject(MatDialog) as any;
    horizontalSvcMock.videoClose.next();
    expect(dialog.closeAll).toHaveBeenCalled();
    expect((window as any).closeKpointPopupModal).toHaveBeenCalled();
  });

  it('handleCTAClick should trigger deeplink and close', () => {
    const api = TestBed.inject(ApiIntegartedService) as any;
    const dialog = TestBed.inject(MatDialog) as any;
    api.inAppDeeplinkCall.mockClear();
    dialog.closeAll.mockClear();
    component.handleCTAClick({ detail: { link: 'bajajsuperapp://x' }} as any);
    expect(api.inAppDeeplinkCall).toHaveBeenCalled();
    expect(dialog.closeAll).toHaveBeenCalled();
  });

  it('handleCTAClick with non-matching detail should not trigger deeplink', () => {
    const api = TestBed.inject(ApiIntegartedService) as any;
    api.inAppDeeplinkCall.mockClear();
    component.handleCTAClick({ detail: { link: 'http://example.com' }} as any);
    expect(api.inAppDeeplinkCall).not.toHaveBeenCalled();
  });

  it('containerRef setter should append script element', () => {
    const host = document.createElement('div');
    expect(host.querySelector('script')).toBeNull();
    // invoke setter
    (component as any).containerRef = { nativeElement: host };
    const script = host.querySelector('script');
    expect(script).toBeTruthy();
  });

  it('ngAfterViewInit should set high zIndex and restore on destroy', () => {
    const overlay = document.createElement('div');
    overlay.className = 'cdk-overlay-container';
    overlay.style.zIndex = '123';
    document.body.appendChild(overlay);

    // Mock MutationObserver to immediately wire listeners
    const observers: any[] = [];
    class MockMutationObserver {
      cb: any; disconnected = false;
      constructor(cb) { this.cb = cb; observers.push(this); }
      observe() { /* no-op */ }
      disconnect() { this.disconnected = true; }
    }
    (window as any).MutationObserver = MockMutationObserver as any;

    component.ngAfterViewInit();
    expect((component as any).cdkElement).toBe(overlay);
    expect(overlay.style.zIndex).toBe('9999999');

    // Simulate DOM insertion that triggers observer callback
    const container = document.createElement('div');
    container.id = horizontalSvcMock.getKpointRef();
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeModal';
    container.appendChild(closeBtn);
    document.body.appendChild(container);
    observers.forEach(o => o.cb());

    // Dispatch custom events to test listeners
    document.dispatchEvent(new CustomEvent('on-video-popup-state-change', { detail: { state: 'minimized', playerRef: horizontalSvcMock.getKpointRef() } }));
    expect(horizontalSvcMock.setVideoModalStatus).toHaveBeenCalledWith('minimized');

    // Click close to trigger onCloseClick path
    const dialog = TestBed.inject(MatDialog) as any;
    dialog.closeAll.mockClear();
    closeBtn.click();
    expect(dialog.closeAll).toHaveBeenCalled();

    // onDestroy restores original zIndex
    component.ngOnDestroy();
    expect(overlay.style.zIndex).toBe('123');
  });

  it('onCloseClick should remove player element and null video status', () => {
    // Prepare element
    const el = document.createElement('div');
    el.id = horizontalSvcMock.getKpointRef();
    document.body.appendChild(el);
    const dialog = TestBed.inject(MatDialog) as any;
    dialog.closeAll.mockClear();
    component.onCloseClick();
    expect(dialog.closeAll).toHaveBeenCalled();
    expect(document.getElementById(horizontalSvcMock.getKpointRef())).toBeNull();
    expect(horizontalSvcMock.setVideoModalStatus).toHaveBeenCalledWith(null);
  });

  it('should remove html scrollblock class and style on init', () => {
    const html = document.querySelector('html');
    html.classList.add('cdk-global-scrollblock');
    html.setAttribute('style', 'overflow:hidden');
    component.ngOnInit();
    expect(html.classList.contains('cdk-global-scrollblock')).toBeFalse();
    expect(html.getAttribute('style')).toBeNull();
  });

  it('should unsubscribe from videoClose on destroy (no duplicate close)', () => {
    const dialog = TestBed.inject(MatDialog) as any;
    dialog.closeAll.mockClear();
    horizontalSvcMock.videoClose.next();
    expect(dialog.closeAll).toHaveBeenCalledTimes(1);
    component.ngOnDestroy();
    horizontalSvcMock.videoClose.next();
    expect(dialog.closeAll).toHaveBeenCalledTimes(1);
  });

  it('ngAfterViewInit with no overlay container should not throw and cdkElement stay undefined', () => {
    Array.from(document.getElementsByClassName('cdk-overlay-container')).forEach(el => el.remove());
    const fixture2 = TestBed.createComponent(B2bHorizontalVideoComponent);
    const comp2 = fixture2.componentInstance;
    promptSpy.mockClear();
    // Call ngOnInit to establish videoCloseSub so ngOnDestroy unsubscribe is safe
    comp2.ngOnInit();
    expect(() => comp2.ngAfterViewInit()).not.toThrow();
    expect((comp2 as any).cdkElement).toBeUndefined();
    comp2.ngOnDestroy();
  });

  it('onCloseClick for ios device should not call orientation prompt', () => {
    const parent = TestBed.inject(ParentDataServices) as ParentDataServices;
    (parent as any).deviceOS = 'ios';
    promptSpy.mockClear();
    component.onCloseClick();
    expect(promptSpy).not.toHaveBeenCalledWith('controlorientationforvideo://false');
  });

  it('handleCTAClick with multiple matching keys triggers deeplink only once', () => {
    const api = TestBed.inject(ApiIntegartedService) as any;
    api.inAppDeeplinkCall.mockClear();
    const detail = { first: 'bajajsuperapp://one', second: 'bajajsuperapp://two' };
    component.handleCTAClick({ detail } as any);
    expect(api.inAppDeeplinkCall).toHaveBeenCalledTimes(1);
  });

  it('event listener for kpw-onclick-button removed after onCloseClick', () => {
    // Set up overlay & MutationObserver to attach listener
    const overlay = document.createElement('div');
    overlay.className = 'cdk-overlay-container';
    document.body.appendChild(overlay);
    const observers: any[] = [];
    class MockMutationObserver { cb: any; constructor(cb){ this.cb=cb; observers.push(this);} observe(){} disconnect(){} }
    (window as any).MutationObserver = MockMutationObserver as any;

    const player = document.createElement('div');
    player.id = horizontalSvcMock.getKpointRef();
    const closeBtn = document.createElement('button'); closeBtn.id='closeModal';
    player.appendChild(closeBtn);
    document.body.appendChild(player);

    const handleSpy = jest.spyOn(component, 'handleCTAClick');
    component.ngAfterViewInit();
    observers.forEach(o=>o.cb()); // simulate detection

    // Ensure listener active before close
    document.dispatchEvent(new CustomEvent('kpw-onclick-button', { detail: { link: 'http://no' } }));
    const preCalls = handleSpy.mock.calls.length;

    component.onCloseClick();

    // Dispatch again; count should not increase
    document.dispatchEvent(new CustomEvent('kpw-onclick-button', { detail: { link: 'http://no' } }));
    expect(handleSpy.mock.calls.length).toBe(preCalls);
  });

  it('loadScript sets expected script attributes', () => {
    const host = document.createElement('div');
    (component as any).loadScript(host as any);
    const script = host.querySelector('script');
    expect(script).toBeTruthy();
    expect(script.defer).toBe(true);
    expect(script.async).toBe(false);
    expect(script.src).toBe(component.scriptUrl);
  });
});
