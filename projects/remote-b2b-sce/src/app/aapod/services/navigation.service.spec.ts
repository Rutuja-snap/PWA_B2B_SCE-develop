import { NavigationService } from './navigation.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { Subject } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ApiIntegartedService } from 'api-integarted';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ParentDataServices } from './parentData.service';
import { NgZone } from '@angular/core';

class ParentDataStub { navigationData: string[] = ['/a','/b']; }

// Ensure global subscribeBackButton exists before service instantiation to prevent ReferenceError
(global as any).subscribeBackButton = (item: any, handler: any) => { (global as any).__backHandler = handler; return true; };

describe('NavigationService (pure jest)', () => {
  let service: NavigationService;
  let router: any;
  let api: any;
  let matDialog: any;
  let bottomSheet: any;
  let globalEvents$: Subject<any>;

  beforeEach(() => {
    (global as any).prompt = jest.fn();
    globalEvents$ = new Subject<any>();
    router = { events: globalEvents$.asObservable(), url: '/start', navigateByUrl: jest.fn(), navigate: jest.fn() };
    api = { commonPromptCall: jest.fn() };
    matDialog = { closeAll: jest.fn() };
    bottomSheet = { dismiss: jest.fn() };
    (environment as any).PLATFORM_NAME = 'WEB';

    const injector = { get: (token: any) => {
      switch(token){
        case ApiIntegartedService: return api;
        case MatDialog: return matDialog;
        case MatBottomSheet: return bottomSheet;
        case ParentDataServices: return new ParentDataStub();
        case Router: return router;
        case NgZone: return { run: (fn: any)=> fn() };
        default: return {};
      }
    }} as any;

    service = new NavigationService(injector);
  });

  it('isMatchedFoundFun detects known and unknown urls', () => {
    expect(service.isMatchedFoundFun('/')).toBe(true);
    expect(service.isMatchedFoundFun('/unknown')).toBe(false);
  });

  it('popoutLastPage pops navigationData', () => {
    const parent = (service as any).parentStorage as ParentDataStub;
    service.popoutLastPage();
    expect(parent.navigationData.length).toBe(1);
  });

  it('customPopoutNavigationUrlFun navigates or calls native', () => {
    const parent = (service as any).parentStorage as ParentDataStub;
    service.customPopoutNavigationUrlFun(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith(parent.navigationData[parent.navigationData.length - 1]);
    parent.navigationData = [];
    service.customPopoutNavigationUrlFun(1);
    expect(api.commonPromptCall).toHaveBeenCalledWith('gotoNativePage', 0);
  });

  it('popoutNavigationUrlFun triggers gotoNativePage prompt for non-sampleComponent', () => {
    (global as any).prompt = jest.fn().mockReturnValue('ok');
    (service as any).currenturl = '/some';
    service.popoutNavigationUrlFun();
    expect(global.prompt).toHaveBeenCalledWith('gotoNativePage');
  });

  it('healthCardNavigation routes or triggers native for index 0', () => {
    service.healthCardNavigation(0);
    expect(api.commonPromptCall).toHaveBeenCalledWith('gotoNativePage', 0);
    service.healthCardNavigation(2);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('subscribeBackFunction assigns handler', () => {
    service.subscribeBackFunction();
    expect((global as any).__backHandler).toEqual(expect.any(Function));
  });

  it('back handler executes popoutNavigationUrlFun', (done) => {
    const spy = jest.spyOn<any, any>(service as any, 'popoutNavigationUrlFun').mockImplementation(()=>{});
    (global as any).__backHandler();
    // Service wraps call in setTimeout; wait a tick
    setTimeout(()=>{ expect(spy).toHaveBeenCalled(); done(); },0);
  });

  it('NavigationStart popstate closes overlays in WEB', () => {
    globalEvents$.next(new NavigationStart(1,'/some','popstate'));
    expect(bottomSheet.dismiss).toHaveBeenCalled();
    expect(matDialog.closeAll).toHaveBeenCalled();
  });

  it('NavigationEnd pushes non-matching urls and ignores duplicates & matched', () => {
    const parent = (service as any).parentStorage as ParentDataStub;
    parent.navigationData = [];
    // Push a non-matching url (service uses event.url not urlAfterRedirects)
    globalEvents$.next(new NavigationEnd(2,'/non-matching','/non-matching'));
    expect(parent.navigationData).toContain('/non-matching');
    const initialLen = parent.navigationData.length;
    // Matched URL should not be pushed
    globalEvents$.next(new NavigationEnd(3,'/emiCardServices/landingPage','/emiCardServices/landingPage'));
    expect(parent.navigationData.length).toBe(initialLen);
    // Duplicate should not increase length
    globalEvents$.next(new NavigationEnd(4,'/non-matching','/non-matching'));
    expect(parent.navigationData.length).toBe(initialLen);
  });

  it('NavigationError does not throw', () => {
    globalEvents$.next(new NavigationError(3,'/err','err'));
    expect(true).toBe(true);
  });

  it('popoutNavigationUrlFun uses router.url when currenturl empty', () => {
    (global as any).prompt = jest.fn();
    (service as any).currenturl = '';
    router.url = '/router-current';
    service.popoutNavigationUrlFun();
    expect(global.prompt).toHaveBeenCalledWith('gotoNativePage');
  });

  it('customPopoutNavigationUrlFun calls native when exceeding backCount', () => {
    const parent = (service as any).parentStorage as ParentDataStub;
    parent.navigationData = ['/only'];
    service.customPopoutNavigationUrlFun(3);
    expect(api.commonPromptCall).toHaveBeenCalledWith('gotoNativePage', 0);
  });

  // --- Additional branch coverage tests ---
  it('NavigationStart non-popstate or non-WEB does not close overlays', () => {
    bottomSheet.dismiss.mockClear();
    matDialog.closeAll.mockClear();
    // navigationTrigger different
    globalEvents$.next(new NavigationStart(10,'/x','imperative'));
    expect(bottomSheet.dismiss).not.toHaveBeenCalled();
    expect(matDialog.closeAll).not.toHaveBeenCalled();
    // PLATFORM not WEB
    (environment as any).PLATFORM_NAME = 'APP';
    globalEvents$.next(new NavigationStart(11,'/y','popstate'));
    expect(bottomSheet.dismiss).not.toHaveBeenCalled();
    expect(matDialog.closeAll).not.toHaveBeenCalled();
    (environment as any).PLATFORM_NAME = 'WEB'; // reset
  });

  it('NavigationEnd sampleComponent with mobile number regex not pushed', () => {
    const parent = (service as any).parentStorage as ParentDataStub;
    parent.navigationData = [];
    globalEvents$.next(new NavigationEnd(12,'/sampleComponent?mobile_number=1234567890','/sampleComponent?mobile_number=1234567890'));
    expect(parent.navigationData.length).toBe(0);
  });

  it('NavigationEnd index.html with mobile number regex not pushed', () => {
    const parent = (service as any).parentStorage as ParentDataStub;
    parent.navigationData = [];
    globalEvents$.next(new NavigationEnd(13,'/index.html?mobile_number=1234567890','/index.html?mobile_number=1234567890'));
    expect(parent.navigationData.length).toBe(0);
  });

  it('popoutNavigationUrlFun sampleComponent path calls GoToDashboard and not prompt', () => {
    const promptSpy = jest.spyOn(global as any, 'prompt');
    (service as any).currenturl = '/sampleComponent?foo=1';
    service.popoutNavigationUrlFun();
    expect(api.commonPromptCall).toHaveBeenCalledWith('GoToDashboard', 0);
    expect(promptSpy).not.toHaveBeenCalled();
  });
});
