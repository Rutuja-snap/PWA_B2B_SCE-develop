import { TestBed } from '@angular/core/testing';
import { AaApiService } from './aa-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { HttpClient } from '@angular/common/http';

class ParentDataStub {
  appVersion = '2.3.4';
  customerDetails: any = { mobileNumber: '9999999999' };
  userInfo: any = { CUSTOMER_MOB_NO: '9999999999', APP_TOKEN: 'APP_TOKEN_VAL' };
  commonData: any = {
    OcpApimSubscriptionKey_xaop: 'SUB_KEY',
    OcpApimSubscriptionKey_xaop_prod_aa: 'SUB_KEY_PROD',
    get3in1Xaop_AAChannelkey: 'CHAN_KEY'
  };
  navigationData: any[] = ['a', 'b'];
  deviceOS = 'android';
}

class ConnectionMgrV2Stub { syncGateWayApiCallingV4 = jest.fn(); }
class ConnectionMgrStub {
  gateWayApiCalling = jest.fn();
  otpGeneration = jest.fn();
  otpValidation = jest.fn();
}
class NodeServiceStub { KPIForSocket = () => 'NODE_KPI'; }
class ApiIntegratedStub {
  openNativeLoader = jest.fn();
  closeNativeLoader = jest.fn();
}
class LoaderStub { start = jest.fn(); stop = jest.fn(); }
class CacheServiceMock {
  getData = jest.fn().mockImplementation(r => Promise.resolve({ cache: true, url: r.url }));
}
class InjectorMock { constructor(private cache: any) { } get() { return this.cache; } }

describe('AaApiService', () => {
  let service: AaApiService;
  let httpMock: HttpTestingController;
  let parent: ParentDataStub;
  let conMngr: ConnectionMgrStub;
  let conMngrV2: ConnectionMgrV2Stub;
  let snack: any;
  let loader: LoaderStub;
  let apiInt: ApiIntegratedStub;
  let cache: CacheServiceMock;
  let promptSpy: jest.Mock<(m?: string) => string | null> | any;

  beforeAll(() => {
    const w: any = window as any;
    try { promptSpy = jest.spyOn(w, 'prompt').mockReturnValue(null); }
    catch {
      // fallback: if already mocked just wrap
      if (typeof w.prompt === 'function') {
        try { promptSpy = jest.spyOn(w, 'prompt').mockReturnValue(null); } catch { promptSpy = w.prompt as any; }
      } else {
        w.prompt = () => null;
        promptSpy = jest.fn().mockReturnValue(null);
      }
    }
  });

  beforeEach(() => {
    conMngr = new ConnectionMgrStub();
    conMngrV2 = new ConnectionMgrV2Stub();
    parent = new ParentDataStub();
    snack = { open: jest.fn() };
    loader = new LoaderStub();
    apiInt = new ApiIntegratedStub();
    cache = new CacheServiceMock();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AaApiService,
        { provide: MatSnackBar, useValue: snack },
        { provide: NgxUiLoaderService, useValue: loader },
        {
          provide: Router,
            useValue: {
              navigateByUrl: jest.fn(),
              navigate: jest.fn()
            }
        }
      ]
    });

    const router = TestBed.inject(Router) as any;
    const injector = new InjectorMock(cache) as any;
    const httpClient = TestBed.inject(HttpClient);

    environment.IS_CONNECTION_MNGR = true;
    environment.CONNECTION_SOURCE = 'WEB';
    environment.production = false;

    service = new AaApiService(
      conMngr as any,
      conMngrV2 as any,
      new NodeServiceStub() as any,
      parent as any,
      router,
      snack,
      httpClient,
      apiInt as any,
      loader as any,
      injector
    );

    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('access_token', 'TOKEN');
    promptSpy.mockClear && promptSpy.mockClear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('aemCache uses cache service', async () => {
    const res = await service.aemCache('/x');
    expect(res.cache).toBeTrue();
  });

  it('APKVersion returns value', () => {
    expect(service.APKVersion()).toBe('2.3.4');
  });

  describe('SCE_Gateway_API_call', () => {
    it('APP path parses string', done => {
      environment.CONNECTION_SOURCE = 'APP';
      conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve('{"statusCode":200,"data":{"ok":true}}'));
      service.SCE_Gateway_API_call({ operationId: 'op', url: '', encKey: '', isConMngr: true }, {})
        .subscribe(r => { expect(r.statusCode).toBe(200); done(); });
    });

    it('WEB success returns API_RESPONSE', done => {
      environment.CONNECTION_SOURCE = 'WEB';
      conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'S', STATUS_CODE: '200', value: 1 } }));
      service.SCE_Gateway_API_call({ operationId: 'op', url: '', encKey: '', isConMngr: true }, {})
        .subscribe(r => { expect(r.value).toBe(1); done(); });
    });

    it('WEB error throws', done => {
      environment.CONNECTION_SOURCE = 'WEB';
      conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'E', STATUS_CODE: '500' } }));
      service.SCE_Gateway_API_call({ operationId: 'op', url: '', encKey: '', isConMngr: true }, {})
        .subscribe({ error: e => { expect(e.status).toBe(500); done(); } });
    });
  });

  it('customerDemog returns data', done => {
    environment.CONNECTION_SOURCE = 'WEB';
    conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'S', STATUS_CODE: '200', d: 2 } }));
    service.customerDemog({}).subscribe(r => { expect(r.d).toBe(2); done(); });
  });

  it('callExperianApi returns data', done => {
    environment.CONNECTION_SOURCE = 'WEB';
    conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'S', STATUS_CODE: '200', exp: true } }));
    service.callExperianApi({ firstName: 'a', surName: 'b', mobilePhone: '9', business: 'b', channel: 'c' } as any)
      .subscribe(r => { expect(r.exp).toBeTrue(); done(); });
  });

  it('callAaInsertApi returns data', done => {
    environment.CONNECTION_SOURCE = 'WEB';
    conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'S', STATUS_CODE: '200', aa: true } }));
    service.callAaInsertApi({ aaConsentResponse: '' } as any)
      .subscribe(r => { expect(r.aa).toBeTrue(); done(); });
  });

  describe('toggleLoading', () => {
    it('WEB uses ngx loader', () => {
      environment.CONNECTION_SOURCE = 'WEB';
      service.toggleLoading(true);
      service.toggleLoading(false);
      expect(loader.start).toHaveBeenCalled();
      expect(loader.stop).toHaveBeenCalled();
    });

    it('APP uses native loader', () => {
      environment.CONNECTION_SOURCE = 'APP';
      service.toggleLoading(true);
      service.toggleLoading(false);
      expect(apiInt.openNativeLoader).toHaveBeenCalled();
      expect(apiInt.closeNativeLoader).toHaveBeenCalled();
    });
  });

  it('aggregatorInitSCE posts and returns text', done => {
    service.aggregatorInitSCE({}).subscribe(r => { expect(r).toBe('RESP'); done(); });
    const req = httpMock.expectOne(r => r.url.includes('aggregatorpodapi/ConsentRequest'));
    req.flush('RESP');
  });

  it('aggregatorPodGetProfile returns body', done => {
    service.aggregatorPodGetProfile({}).subscribe(r => { expect(r.ok).toBeTrue(); done(); });
    const req = httpMock.expectOne(r => r.url.includes('aggregatorpodapi/ProfileDataRequest'));
    req.flush({ ok: true });
  });


  it('clearNavigationStack empties navigationData', () => {
    expect(parent.navigationData.length).toBeGreaterThan(0);
    service.clearNavigationStack();
    expect(parent.navigationData.length).toBe(0);
  });

  // Additional edge / branch coverage tests
  describe('Additional branch coverage', () => {

    it('SCE_Gateway_API_call returns empty object when IS_CONNECTION_MNGR is false', done => {
      environment.IS_CONNECTION_MNGR = false;
      service.SCE_Gateway_API_call({ operationId: 'op', url: '', encKey: '', isConMngr: true }, {})
        .subscribe(res => { expect(res).toEqual({}); environment.IS_CONNECTION_MNGR = true; done(); });
    });

    it('SCE_Gateway_API_call APP path with invalid JSON returns raw response', done => {
      environment.CONNECTION_SOURCE = 'APP';
      conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve('NOT_JSON'));
      service.SCE_Gateway_API_call({ operationId: 'op', url: '', encKey: '', isConMngr: true }, {})
        .subscribe(res => { expect(res).toBe('NOT_JSON'); done(); });
    });

    it('callAaInsertApi without aaConsentResponse toggles loader; with aaConsentResponse does not', done => {
      environment.CONNECTION_SOURCE = 'WEB';
      conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'S', STATUS_CODE: '200', ok: true } }));
      service.callAaInsertApi({ aaConsentResponse: '' } as any).subscribe(r => {
        expect(r.ok).toBeTrue();
        const startCalls = loader.start.mock.calls.length;
        const stopCalls = loader.stop.mock.calls.length;
        conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'S', STATUS_CODE: '200', ok: true } }));
        service.callAaInsertApi({ aaConsentResponse: 'HAS' } as any).subscribe(() => {
          expect(loader.start.mock.calls.length).toBe(startCalls); // no new starts
          expect(loader.stop.mock.calls.length).toBe(stopCalls);   // no new stops
          done();
        });
      });
    });

    it('aggregatorInitSCE error path propagates error', done => {
      service.aggregatorInitSCE({}).subscribe({
        next: () => {},
        error: err => { expect(err.status).toBe(500); done(); }
      });
      const req = httpMock.expectOne(r => r.url.includes('aggregatorpodapi/ConsentRequest'));
      req.flush({ msg: 'fail' }, { status: 500, statusText: 'Server Error' });
    });

    it('aggregatorPodGetProfile error path propagates error', done => {
      service.aggregatorPodGetProfile({}).subscribe({
        next: () => {},
        error: err => { expect(err.status).toBe(500); done(); }
      });
      const req = httpMock.expectOne(r => r.url.includes('aggregatorpodapi/ProfileDataRequest'));
      req.flush({ msg: 'fail' }, { status: 500, statusText: 'Server Error' });
    });

  });

  describe('Extended branch coverage', () => {
    it('SCE_Gateway_API_call returns empty object when op.isConMngr is false', done => {
      environment.IS_CONNECTION_MNGR = true;
      service.SCE_Gateway_API_call({ operationId: 'op', url: '', encKey: '', isConMngr: false }, {})
        .subscribe(res => { expect(res).toEqual({}); done(); });
    });

    it('customerDemog error path stops loader', done => {
      environment.CONNECTION_SOURCE = 'WEB';
      conMngrV2.syncGateWayApiCallingV4.mockReturnValue(Promise.resolve({ API_RESPONSE: { STATUS: 'E', STATUS_CODE: '500' } }));
      service.customerDemog({}).subscribe({ error: () => { expect(loader.stop).toHaveBeenCalled(); done(); } });
    });

   
  });
});
