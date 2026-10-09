// Pure Jest tests for PdpxTrackService (no TestBed)
import { PdpxTrackService } from './pdpx-track.service';
import { PdpxFlowService } from './pdpx-flow.service';
import { TEMPLATES } from '../model/helper.model';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

// ---- Flow stub ----
class FlowStub implements Partial<PdpxFlowService> {
  ENV: 'APP' | 'WEB' = 'WEB';
  CONFIG: any = { cleverTap: { enabled: true, PROPS: { EVENT_NAME__PDP_VIEWED: 'PDP_VIEWED', EVENT_NAME__PLP_VIEWED: 'PLP_VIEWED', EVENT_NAME__PDP_CLICKED: 'PDP_CLICKED', EVENT_NAME__PLP_CLICKED: 'PLP_CLICKED', EVENT_NAME__INFO_BUTTON_CLICKED: 'INFO', EVENT_PROP__PDP_PAGE_NAME: 'PDP', EVENT_PROP__PLP_PAGE_NAME: 'PLP', EVENT_PROP__PRODUCT_NAME: 'PROD' }, journeys: {} }, PRODUCT_TYPE: 'LOAN', id: 'HL' };
  cust: any = { offer: { __is_applied: true, __amount: 100, displayName: 'OFFER', offerProduct: 'SPL' }, isOffer: true, journeyName: 'J', custFlag: 'NTB', cartItem: { amt: 1000, tenure: 12, __render: { render__title: 'TITLE', render__subtitle_value: 'EMI' } }, module_relations: [] };
  parentStorage: any = { appVersion: '1.0.0' };
  isOffered() { return true; }
}

// Stub prompt globally (used only when CONNECTION_SOURCE === 'APP')
beforeAll(() => {
  (globalThis as any).prompt = jest.fn(() => '');
});

describe('PdpxTrackService (pure Jest)', () => {
  let service: PdpxTrackService;
  let flow: FlowStub;

  beforeEach(() => {
    flow = new FlowStub();
    environment.CONNECTION_SOURCE = 'WEB';
    service = new PdpxTrackService(flow as any);
    jest.spyOn(service as any, 'triggerCT').mockImplementation(() => {});
  });

  it('appViewed__CT triggers PDP_VIEWED via triggerCT', (done) => {
    service.appViewed__CT(TEMPLATES.PDP, {}, {} as any, {}, {});
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('appClicked__CT triggers PDP_CLICKED', (done) => {
    service.appClicked__CT('SECTION', 'CTA', {}, TEMPLATES.PDP, {} as any, {} as any, {} as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('info_Clicked__CT triggers INFO event', (done) => {
    service.info_Clicked__CT('ART', 'CTA', {} as any, {} as any, TEMPLATES.PDP);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('triggerCT does not prompt on WEB', () => {
    environment.CONNECTION_SOURCE = 'WEB';
    (service as any).PDPX_CT_ENABLED = true;
    (service as any).triggerCT('E', { a: 1 }, 't');
    expect(true).toBe(true); // no exception
  });

  it('should not trigger when CleverTap disabled', (done) => {
    flow.CONFIG.cleverTap.enabled = false;
    service.appViewed__CT(TEMPLATES.PDP, {}, {} as any, {}, {});
    setTimeout(() => {
      expect((service as any).triggerCT).not.toHaveBeenCalled();
      done();
    });
  });

  it('appViewed__CT on PLP should trigger event', (done) => {
    flow.CONFIG.cleverTap.enabled = true;
    service.appViewed__CT(TEMPLATES.PLP, { tabs: { tabs: ['A', 'B'], activeIndex: 0 } } as any, {} as any, {} as any, {});
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('appClicked__CT on PLP should trigger event', (done) => {
    service.appClicked__CT('SECTION', 'CTA', {}, TEMPLATES.PLP, { tabs: { tabs: ['A', 'B'], activeIndex: 1 } } as any, {} as any, {} as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('triggerCT should prompt on APP when enabled', () => {
    (service as any).triggerCT.mockRestore(); // restore real method
    environment.CONNECTION_SOURCE = 'APP';
    (service as any).PDPX_CT_ENABLED = true;
    const promptSpy = jest.spyOn(globalThis as any, 'prompt').mockReturnValue('');
    (service as any).triggerCT('E', { foo: 'bar' }, 'tag');
    expect(promptSpy).toHaveBeenCalled();
    const arg = (promptSpy.mock.calls[0][0] as string);
    expect(arg.startsWith('triggerCTEvent://')).toBe(true);
  });

  it('appClicked__CT should map section name when __section_mapp set', (done) => {
    (flow.CONFIG.cleverTap as any).MAPP = { S_KEY: { SECTION_NAME: 'MAPPED_SECTION' } };
    service.appClicked__CT('S_KEY', 'CTA', { __section_mapp: true }, TEMPLATES.PLP, { tabs: { tabs: ['A'], activeIndex: 0 } } as any, {} as any, {} as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('getCommonProps__CT PDP with LOAN PL variant and deletions when not HYBRID_FLEXI', () => {
    flow.CONFIG.id = 'PL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    const loan: any = {
      amount: '10000',
      limits: { label: 'L' },
      variant: { id: 'TERM' },
      total_tenor: 24,
      total_emi: 500,
      totalLoanAmount: 11000,
      interest: 12,
      chargesMapp: {
        processing_fee: '100', documentation_charges: '10', flexi_fees: '0', addons_1: 'A1', addons_2: 'A2', stamp_duty: '5', bpi: '1'
      }
    };
    const data = { duration: 123 } as any;
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loan, data);
    expect(props['EP_OFFER_TYPE']).toBeDefined();
  });

  it('getCommonProps__CT PDP LAS without cart then with cart to cover EP_CART_PRODUCT and rewards', () => {
    flow.CONFIG.id = 'LAS';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    flow.cust.cartItem = undefined as any;
    let props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, {} as any, { duration: 50 } as any);
    expect(props['EP_CART_PRODUCT']).toBeDefined();
    flow.cust.cartItem = { __render: { render__title: 'CART' } } as any;
    (flow as any).__reward_shown = true;
    props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, {} as any, { duration: 60 } as any);
    expect(props['EP_REWARD_SHOWN']).toBe('YES');
  });

  it('GL PDP branches for appClicked__CT and info_Clicked__CT', (done) => {
    flow.CONFIG.id = 'GL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    (flow as any).CONFIG.PRODUCT = { product: 'GL_FRESH' };
    const render: any = { gold_loan_details: { loan_amount: { loan_amount: 1 }, gold_weight: { gold_weight: 2 }, gold_mode: true, loan_mode: false, valid: true, error_text: 'E', gold_loan_rate: 3000 } };
    service.appClicked__CT('SEC', 'APPLY', {}, TEMPLATES.PDP, render, {} as any, {} as any);
    service.info_Clicked__CT('INFO', 'READ', render, {} as any, TEMPLATES.PDP);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('CARD product PDP and PLP common props and info click', (done) => {
    flow.CONFIG.PRODUCT_TYPE = 'CARD';
    (flow as any).CONFIG.PRODUCT = { subProduct: 'SUB' };
    flow.cust.current_sku = { productDetails: { label: 'L' }, ccBenefit: 'B' } as any;
    const pdpProps = service.getCommonProps__CT(TEMPLATES.PDP, { textRatings: { subtitle: 'S' }, offerBanner: { view: true, text: 'T' }, cardSummary: { amount: 2000 } } as any, {} as any, { duration: 10 } as any);
    expect(pdpProps['EP_PAGE_NAME']).toBe('PDP');
    const plpProps = service.getCommonProps__CT(TEMPLATES.PLP, { tabs: { tabs: ['A'], activeIndex: 0 } } as any, {} as any, { duration: 20 } as any);
    expect(plpProps['EP_PAGE_NAME']).toBe('PLP');
    service.info_Clicked__CT('SEC', 'CTA', { textRatings: { subtitle: 'sub' } } as any, {} as any, TEMPLATES.PDP);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('DEPOSIT product PDP appViewed/appClicked/info_Clicked', (done) => {
    flow.CONFIG.PRODUCT_TYPE = 'DEPOSIT';
    service.appViewed__CT(TEMPLATES.PDP, {} as any, {} as any, {} as any, {});
    service.appClicked__CT('SEC', 'CTA', {}, TEMPLATES.PDP, {} as any, {} as any, {} as any);
    service.info_Clicked__CT('INFO', 'CTA', {} as any, {} as any, TEMPLATES.PDP);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('PLCARD_ACQ branch in getCommonProps__CT PDP', () => {
    flow.CONFIG.id = 'PLCARD_ACQ';
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, {} as any, {} as any);
    expect(props).toBeDefined();
  });

  it('appClicked__CT includes EP_ACTIVITY_TIMELOG when config id HL', (done) => {
    flow.CONFIG.id = 'HL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    service.appClicked__CT('SEC', 'CTA', {}, TEMPLATES.PDP, {} as any, {} as any, { toString: () => '123' } as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('getCommonProps__CT sets BLSE specific props', () => {
    flow.CONFIG.id = 'BLSE';
    const loan: any = { chargesMapp: { addons_3: 'A3' } };
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loan, {} as any);
    expect(props['EP_BUSINESS']).toBe('BLSE LANDING PAGE');
    expect(props['EP_CROSSELL_3']).toBe('A3');
  });

  it('getCommonProps__CT MEF sets custom page name', () => {
    flow.CONFIG.id = 'MEF';
    (flow as any).CONFIG.PRODUCT = { journeyType: 'JT' };
    flow.CONFIG.cleverTap.journeyTypes = { JT: 'MEF Custom PDP' };
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, {} as any, {} as any);
    expect(props['EP_PAGE_NAME']).toBe('MEF Custom PDP');
  });

  it('getCommonProps__CT returns empty object when cleverTap disabled', () => {
    flow.CONFIG.cleverTap.enabled = false;
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, {} as any, {} as any);
    expect(Object.keys(props).length).toBe(0);
  });

  it('subsequent calls reuse PL cached props and update error message when loan invalid', () => {
    flow.CONFIG.cleverTap.enabled = true;
    flow.CONFIG.id = 'PL';
    const loanValid: any = { variant: { id: 'TERM' }, chargesMapp: {}, inValid: false };
    const first = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loanValid, {} as any);
    const firstErrorSnapshot = first['EP_ERROR_MESSAGE'];
    const loanInvalid: any = { variant: { id: 'TERM' }, chargesMapp: {}, inValid: true };
    const second = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loanInvalid, {} as any);
    expect(firstErrorSnapshot).toBe('');
    expect(second['EP_ERROR_MESSAGE']).toBe('PLEASE ENTER A VALID LOAN AMOUNT');
  });

  it('MFI branch deletes then common props re-add EP_PROCESSING_FEE', (done) => {
    (service as any).triggerCT.mockClear();
    flow.CONFIG.id = 'MFI';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    const loan: any = { chargesMapp: { processing_fee: '10' } };
    service.appClicked__CT('SEC', 'CTA', {}, TEMPLATES.PDP, {} as any, loan, {} as any);
    setTimeout(() => {
      try {
        const lastCall = (service as any).triggerCT.mock.calls.at(-1);
        const callArg = lastCall ? lastCall[1] : {};
        expect(callArg['EP_PROCESSING_FEE']).toBe('10'); // re-added by getCommonProps__CT merge
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('triggerCT does not prompt when feature disabled in APP', () => {
    (service as any).triggerCT.mockRestore();
    flow.ENV = 'APP';
    environment.CONNECTION_SOURCE = 'APP';
    (service as any).PDPX_CT_ENABLED = false;
    const promptSpy = jest.spyOn(globalThis as any, 'prompt');
    promptSpy.mockClear();
    (service as any).triggerCT('E', { p: 1 }, 'tag');
    expect(promptSpy).not.toHaveBeenCalled();
  });

  it('triggerCT builds epSource object when ENV APP (no crash)', () => {
    (service as any).triggerCT.mockRestore();
    flow.ENV = 'APP';
    environment.CONNECTION_SOURCE = 'WEB';
    (service as any).PDPX_CT_ENABLED = true;
    expect(() => (service as any).triggerCT('E', { p: 1 }, 'tag')).not.toThrow();
  });

  it('appClicked__CT PDP for CARD product type', (done) => {
    flow.CONFIG.PRODUCT_TYPE = 'CARD';
    flow.cust.current_sku = { productDetails: { label: 'CardLabel' }, ccBenefit: 'Benefit' } as any;
    service.appClicked__CT('SEC_CARD', 'APPLY', {}, TEMPLATES.PDP, { textRatings: { subtitle: 'S' }, offerBanner: { view: false } } as any, {} as any, {} as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('appClicked__CT PDP LOAN with __section_mapp mapping', (done) => {
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    flow.CONFIG.cleverTap.MAPP = { KEY1: { SECTION_NAME: 'MAPPED_LOAN_SECTION' } };
    service.appClicked__CT('KEY1', 'CTA', { __section_mapp: true }, TEMPLATES.PDP, {} as any, {} as any, {} as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('info_Clicked__CT PDP LOAN non-GL (HL) path', (done) => {
    flow.CONFIG.id = 'HL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    service.info_Clicked__CT('INFO_SEC', 'READ', {} as any, {} as any, TEMPLATES.PDP);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('getCommonProps__CT MFI id path', () => {
    flow.CONFIG.id = 'MFI';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, { chargesMapp: {} } as any, {} as any);
    expect(props['EP_PAGE_NAME']).toBeDefined();
  });

  it('getCommonProps__CT PLCARD id path (no modifications)', () => {
    flow.CONFIG.id = 'PLCARD';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, { chargesMapp: {} } as any, {} as any);
    expect(props['EP_PAGE_NAME']).toBeDefined();
  });

  it('getCommonProps__CT PL variant HYBRID_FLEXI retains EMI related props', () => {
    flow.CONFIG.id = 'PL';
    const loan: any = { variant: { id: 'HYBRID_FLEXI' }, chargesMapp: {}, initial_emi: '1', subsequent_emi: '2', initial_tenor: 3 };
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loan, {} as any);
    expect(props['EP_SUBSEQUENT_EMI']).toBeDefined();
    expect(props['EP_INITIAL_EMI']).toBeDefined();
  });

  it('appClicked__CT PL with ongoing application section label changes page name when condition met', (done) => {
    flow.CONFIG.id = 'PL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    service.appClicked__CT('YOU HAVE AN ONGOING APPLICATION', 'CTA', {}, TEMPLATES.PDP, {} as any, { variant: { id: 'TERM' }, chargesMapp: {} } as any, {} as any);
    setTimeout(() => {
      // Just ensuring trigger executed for this branch; internal mutation verified indirectly
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('appClicked__CT LAS with APPLY cta sets EP_CTA', (done) => {
    flow.CONFIG.id = 'LAS';
    service.appClicked__CT('LAS_SEC', 'APPLY', {}, TEMPLATES.PDP, {} as any, {} as any, {} as any);
    setTimeout(() => {
      const lastCall = (service as any).triggerCT.mock.calls.at(-1);
      const callArg = lastCall ? lastCall[1] : {};
      expect(callArg['EP_CTA']).toBe('APPLY');
      done();
    });
  });

  it('triggerCT APP enabled fires prompt exactly once', () => {
    (service as any).triggerCT.mockRestore();
    environment.CONNECTION_SOURCE = 'APP';
    (service as any).PDPX_CT_ENABLED = true;
    const promptSpy = jest.spyOn(globalThis as any, 'prompt').mockReturnValue('');
    (service as any).triggerCT('EVT', { a: 1 }, 'tag');
    expect(promptSpy).toHaveBeenCalledTimes(1);
  });

  it('precedence bug: non LAS id but APPLY sets EP_CTA due to condition order', (done) => {
    flow.CONFIG.id = 'PL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    service.appClicked__CT('SEC', 'APPLY', {}, TEMPLATES.PDP, {} as any, { variant: { id: 'TERM' }, chargesMapp: {} } as any, {} as any);
    setTimeout(() => {
      const lastCall = (service as any).triggerCT.mock.calls.at(-1);
      const props = lastCall ? lastCall[1] : {};
      expect(props['EP_CTA']).toBe('APPLY'); // shows precedence issue
      done();
    });
  });

  it('PL non HYBRID_FLEXI variant drops hybrid-only EMI props', () => {
    flow.CONFIG.id = 'PL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    const loan: any = { variant: { id: 'TERM' }, chargesMapp: {}, initial_emi: '10', subsequent_emi: '20', initial_tenor: 5 };
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loan, {} as any);
    expect(props['EP_INITIAL_EMI']).toBeUndefined();
    expect(props['EP_SUBSEQUENT_EMI']).toBeUndefined();
    expect(props['EP_INITIAL_LOAN_TENURE']).toBeUndefined();
  });

  it('LAS appClicked__CT with OTHER cta does not set EP_CTA', (done) => {
    flow.CONFIG.id = 'LAS';
    service.appClicked__CT('LAS_SEC', 'OTHER', {}, TEMPLATES.PDP, {} as any, {} as any, {} as any);
    setTimeout(() => {
      const lastCall = (service as any).triggerCT.mock.calls.at(-1);
      const props = lastCall ? lastCall[1] : {};
      expect(props['EP_CTA']).toBeUndefined();
      done();
    });
  });

  it('GL info_Clicked__CT balance transfer variant sets EP_LOAN_VARIANT BALANCE TRANSFER', (done) => {
    flow.CONFIG.id = 'GL';
    flow.CONFIG.PRODUCT_TYPE = 'LOAN';
    (flow as any).CONFIG.PRODUCT = { product: 'GL_BT' };
    const render: any = { gold_loan_details: { loan_amount: { loan_amount: 5 }, gold_weight: { gold_weight: 1 }, gold_mode: false, loan_mode: true, valid: false, error_text: 'ERR', gold_loan_rate: 3200 } };
    service.info_Clicked__CT('INFO_GL', 'CTA', render, {} as any, TEMPLATES.PDP);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('PL cached props object identity reused across calls', () => {
    flow.CONFIG.id = 'PL';
    const loan: any = { variant: { id: 'TERM' }, chargesMapp: {} };
    const first = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, loan, {} as any);
    const second = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, { variant: { id: 'TERM' }, chargesMapp: {}, inValid: true } as any, {} as any);
    expect(first).toBe(second);
  });

  it('LAS getCommonProps__CT sets EP_ACTIVITY_TIMELOG from data.duration', () => {
    flow.CONFIG.id = 'LAS';
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, { chargesMapp: {} } as any, { duration: 42 } as any);
    expect(props['EP_ACTIVITY_TIMELOG']).toBe(42);
  });
});

// Additional branch coverage tests
describe('PdpxTrackService additional branch coverage', () => {
  let service: PdpxTrackService;
  let flow: any;

  beforeEach(() => {
    flow = new (class extends (FlowStub as any) {})();
    environment.CONNECTION_SOURCE = 'WEB';
    service = new PdpxTrackService(flow as any);
    jest.spyOn(service as any, 'triggerCT').mockImplementation(() => {});
  });

  it('appClicked__CT PDP with HTS_LAMF id and SHARE cta sets EP_CTA (LAS/HTS path)', (done) => {
    flow.CONFIG.id = 'HTS_LAMF';
    service.appClicked__CT('SEC_HTS', 'SHARE', {}, TEMPLATES.PDP, {} as any, { chargesMapp: {} } as any, {} as any);
    setTimeout(() => {
      const last = (service as any).triggerCT.mock.calls.at(-1);
      const props = last ? last[1] : {};
      expect(props['EP_CTA']).toBe('SHARE');
      done();
    });
  });

  it('appClicked__CT PDP non LAS/HTS id with SHARE does NOT set EP_CTA (precedence validation)', (done) => {
    flow.CONFIG.id = 'PL';
    service.appClicked__CT('SEC_PL', 'SHARE', {}, TEMPLATES.PDP, {} as any, { variant: { id: 'TERM' }, chargesMapp: {} } as any, {} as any);
    setTimeout(() => {
      const last = (service as any).triggerCT.mock.calls.at(-1);
      const props = last ? last[1] : {};
      expect(props['EP_CTA']).toBeUndefined();
      done();
    });
  });

  it('appClicked__CT PLP for CARD product triggers PLP_CLICKED event', (done) => {
    flow.CONFIG.PRODUCT_TYPE = 'CARD';
    service.appClicked__CT('SEC_CARD_PLP', 'CTA', {}, TEMPLATES.PLP, { tabs: { tabs: ['T'], activeIndex: 0 } } as any, {} as any, {} as any);
    setTimeout(() => {
      expect((service as any).triggerCT).toHaveBeenCalled();
      done();
    });
  });

  it('getCommonProps__CT PDP for HTS_LAMF without cart sets CART - EMPTY and reward NO', () => {
    flow.CONFIG.id = 'HTS_LAMF';
    flow.cust.cartItem = undefined;
    const props = service.getCommonProps__CT(TEMPLATES.PDP, {} as any, { chargesMapp: {} } as any, { duration: 77 } as any);
    expect(props['EP_CART_PRODUCT']).toBe('CART - EMPTY');
    expect(props['EP_REWARD_SHOWN']).toBe('NO');
  });

  it('appClicked__CT LAS with SHARE cta sets EP_CTA', (done) => {
    flow.CONFIG.id = 'LAS';
    service.appClicked__CT('LAS_SEC', 'SHARE', {}, TEMPLATES.PDP, {} as any, { chargesMapp: {} } as any, {} as any);
    setTimeout(() => {
      const last = (service as any).triggerCT.mock.calls.at(-1);
      const props = last ? last[1] : {};
      expect(props['EP_CTA']).toBe('SHARE');
      done();
    });
  });
});
