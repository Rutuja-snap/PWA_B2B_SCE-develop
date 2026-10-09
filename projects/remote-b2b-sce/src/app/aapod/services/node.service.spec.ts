import { NodeService } from './node.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

class ParentDataStub { appVersion='1.2.3'; customerDetails:any={ mobileNumber:'9999999999' }; emicard_store:any={ cardType:'EC' } }

describe('NodeService (pure jest)', () => {
  let service: NodeService;
  let router: any;
  let parent: ParentDataStub;

  beforeEach(() => {
    router = { url:'/emicard/landing' };
    parent = new ParentDataStub();
    service = new NodeService(parent as any, router as any);
  });

  it('APKVersion returns parent appVersion', () => {
    expect(service.APKVersion()).toBe('1.2.3');
  });

  it('getDynamicKPIdata maps to EMIPWA based on URL', () => {
    const res = service.getDynamicKPIdata('X','Y','oauth-otp','SUB');
    expect(res.module).toBe('EMIPWA');
    expect(res.process).toBe('EMIPWA');
  });

  it('getDynamicKPIdata leaves module unchanged for SALPL URL (no override implemented)', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/salpl/start';
    service = new NodeService(parent as any, router as any);
    const res = service.getDynamicKPIdata('X','Y','oauth-otp','SUB');
    expect(res.module).toBe('X'); // remains original
  });

  it('getDynamicKPIdata leaves module unchanged for FD_v2 URL', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/fixed-deposit/app';
    service = new NodeService(parent as any, router as any);
    const res = service.getDynamicKPIdata('X','Y','other-op','SUB');
    expect(res.module).toBe('X');
  });

  it('getDynamicKPIdata leaves module unchanged for RPR_Pharma URL', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/pharma/app';
    service = new NodeService(parent as any, router as any);
    const res = service.getDynamicKPIdata('X','Y','oauth-otp-validate','SUB');
    expect(res.module).toBe('X');
  });

  it('getDynamicKPIdata leaves module unchanged for PRO_ICL URL', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/icl/track';
    service = new NodeService(parent as any, router as any);
    const res = service.getDynamicKPIdata('X','Y','oauth-otp','SUB');
    expect(res.module).toBe('X');
  });

  it('getDynamicKPIdata leaves module unchanged for PRO_SLV URL', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/slv/flow';
    service = new NodeService(parent as any, router as any);
    const res = service.getDynamicKPIdata('X','Y','oauth-otp-validate','SUB');
    expect(res.module).toBe('X');
  });

  it('getDynamicKPIdata respects cardType EC even if url not emicard', () => {
    router.url = '/random/path';
    parent.emicard_store.cardType = 'EC';
    const res = service.getDynamicKPIdata('X','Y','oauth-otp','SUB');
    expect(res.module).toBe('EMIPWA');
  });

  it('getDynamicKPIdata HEMIPWA otp gen normal vs activate-now branch', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/some/route';
    // normal path
    let res = service.getDynamicKPIdata('HEMIPWA','PROC','oauth-otp','SubX');
    expect(res.subProcess).toBe('HEMI-1_SubX');
    // activate-now branch
    router.url = '/activate-now/';
    res = service.getDynamicKPIdata('HEMIPWA','PROC','oauth-otp','SubY');
    expect(res.subProcess).toBe('HEMI-8_ViewCardOTPgen');
  });

  it('getDynamicKPIdata HEMIPWA otp validate normal vs thank-you branch', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/another/route';
    let res = service.getDynamicKPIdata('HEMIPWA','PROC','oauth-otp-validate','SubZ');
    expect(res.subProcess).toBe('HEMI-2_SubZ');
    router.url = '/thank-you/screen';
    res = service.getDynamicKPIdata('HEMIPWA','PROC','oauth-otp-validate','SubZ');
    expect(res.subProcess).toBe('HEMI-9_ViewcardOTPvalidate');
  });

  it('getDynamicKPIdata HEMIPWA emipod path prefixes H', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/plain';
    const res = service.getDynamicKPIdata('HEMIPWA','PROC','emipod/process','123');
    expect(res.subProcess).toBe('H123');
  });

  it('getDynamicKPIdata default branch leaves values unchanged', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/no/match';
    const res = service.getDynamicKPIdata('CUSTOM','PROC','opX','SUBX');
    expect(res.module).toBe('CUSTOM');
    expect(res.process).toBe('PROC');
  });

  it('KPIForSocket channel/product fallbacks to NA for unknown module', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/other/path';
    service = new NodeService(parent as any, router as any);
    environment.CONNECTION_SOURCE = 'APP' as any;
    const out = service.KPIForSocket('UNKNOWN','PROC','SUB','op','v');
    const obj = JSON.parse(out as string);
    expect(obj.channel).toBe('NA');
    expect(obj.product).toBe('NA');
  });

  it('KPIForSocket catch path handled when getDynamicKPIdata throws', () => {
    environment.CONNECTION_SOURCE = 'APP' as any;
    jest.spyOn(service,'getDynamicKPIdata').mockImplementation(()=>{ throw new Error('dyn fail'); });
    expect(()=>service.KPIForSocket('M','P','S','op','v')).not.toThrow();
  });

  // --- Additional branch tests added ---
  it('KPIForSocket does nothing on WEB source (returns undefined)', () => {
    environment.CONNECTION_SOURCE = 'WEB' as any;
    const result = service.KPIForSocket('EMIPWA','PROC','SUB','op','1');
    expect(result).toBeUndefined();
  });

  it('KPIForSocket happy path with known module EMIPWA', () => {
    environment.CONNECTION_SOURCE = 'APP' as any;
    const json = service.KPIForSocket('EMIPWA','PROC','SUB','op','2') as string;
    const obj = JSON.parse(json);
    expect(obj.channel).toBe('3in1');
    expect(obj.product).toBe('EMIPWA');
  });

  it('KPIForSocket dynamic remap not applied for SALPL when passing unknown module', () => {
    environment.CONNECTION_SOURCE = 'APP' as any;
    parent.emicard_store.cardType = 'XX';
    router.url = '/salpl/path';
    service = new NodeService(parent as any, router as any);
    const json = service.KPIForSocket('X','PROC','SUB','op','2') as string; // module X remains X
    const obj = JSON.parse(json);
    expect(obj.product).toBe('NA');
  });

  it('KPIForSocket with explicit SALPL module uses SALPL constants', () => {
    environment.CONNECTION_SOURCE = 'APP' as any;
    parent.emicard_store.cardType = 'XX';
    router.url = '/anything';
    service = new NodeService(parent as any, router as any);
    const json = service.KPIForSocket('SALPL','PROC','SUB','op','2') as string;
    const obj = JSON.parse(json);
    expect(obj.product).toBe('SALPL');
    expect(obj.channel).toBe('3in1');
  });

  it('KPIForSocket default apiVersion NA when omitted', () => {
    environment.CONNECTION_SOURCE = 'APP' as any;
    const json = service.KPIForSocket('EMIPWA','PROC','SUB','op') as string; // apiVersion omitted
    const obj = JSON.parse(json);
    expect(obj.apiVersion).toBe('NA');
  });

  it('getDynamicKPIdata EMIPWA otp gen activate branch with otppage/E8', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/emicard/otppage/E8';
    const res = service.getDynamicKPIdata('ANY','PROC','oauth-otp','ABC');
    expect(res.subProcess).toBe('EMI-8_ViewCardOTPgen');
  });

  it('getDynamicKPIdata EMIPWA otp validate activate branch with otppage/E9', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/emicard/otppage/E9';
    const res = service.getDynamicKPIdata('ANY','PROC','oauth-otp-validate','ABC');
    expect(res.subProcess).toBe('EMI-9_ViewcardOTPvalidate');
  });

  it('getDynamicKPIdata catch path when router.url undefined', () => {
    const badRouter: any = {}; // url missing triggers exception
    const newService = new NodeService(parent as any, badRouter);
    const res = newService.getDynamicKPIdata(undefined, undefined, 'op', undefined);
    expect(res.module).toBe('NA');
    expect(res.process).toBe('NA');
    expect(res.subProcess).toBe('NA');
  });

  it('getDynamicKPIdata HEMIPWA operationId unrelated leaves subProcess untouched', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/random';
    const res = service.getDynamicKPIdata('HEMIPWA','PROC','some-op','MySub');
    expect(res.subProcess).toBe('MySub');
  });

  it('getDynamicKPIdata EMIPWA oauth-otp-validate normal path formats EMI-2_', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/emicard/standard';
    const res = service.getDynamicKPIdata('X','PROC','oauth-otp-validate','ABC');
    expect(res.subProcess).toBe('EMI-2_ABC');
  });

  it('getDynamicKPIdata EMIPWA non-special operationId keeps original subProcess', () => {
    parent.emicard_store.cardType = 'XX';
    router.url = '/emicard/standard';
    const res = service.getDynamicKPIdata('X','PROC','some-other-op','Orig');
    expect(res.subProcess).toBe('Orig');
  });

  afterEach(() => {
    environment.CONNECTION_SOURCE = 'WEB' as any; // reset default assumption
    jest.restoreAllMocks();
  });
});
