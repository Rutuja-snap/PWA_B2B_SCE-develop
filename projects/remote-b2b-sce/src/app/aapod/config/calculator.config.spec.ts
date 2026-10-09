import { XLoanCalculator, VARIANTS } from './calculator.config';

function deepClone<T>(o: T): T { return JSON.parse(JSON.stringify(o)); }

describe('XLoanCalculator', () => {
  function newCalc() {
    const constraint = deepClone(XLoanCalculator.CONSTRAINT_V1);
    const config = deepClone(XLoanCalculator.LOAN_CONFIG_V1);
    const calc = new XLoanCalculator(config as any, constraint as any);
    // initialize derived options
    calc.applyDefaultConfig();
    calc.updateLoanConfigOptions();
    return calc;
  }

  it('getVariants returns default variants in order', () => {
    const list = XLoanCalculator.getVariants([VARIANTS.FLEXI, VARIANTS.HYBRID_FLEXI, VARIANTS.TERM]);
    expect(list.map(v => v.id)).toEqual([VARIANTS.FLEXI, VARIANTS.HYBRID_FLEXI, VARIANTS.TERM]);
  });

  it('applyDefaultConfig sets defaults from constraint', () => {
    const calc = newCalc();
    // defaults are taken from constraint default_variant HYBRID_FLEXI and its default_tenure 96
    expect((calc as any).config.active__variant).toBe(VARIANTS.HYBRID_FLEXI);
    expect((calc as any).config.active__tenure).toBe((calc as any).constraint.mapp[VARIANTS.HYBRID_FLEXI].default_tenure);
    expect((calc as any).config.active_initial_tenure).toBe((calc as any).constraint.mapp[VARIANTS.HYBRID_FLEXI].tenures[(calc as any).config.active__tenure].default_initial);
  });

  it('isLoanValid respects initial tenure requirements', () => {
    const calc = newCalc();
    const loan: any = {
      variant: { id: VARIANTS.HYBRID_FLEXI },
      total_tenor: 96,
      initial_tenor: 24
    };
    // reflect config
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 96;
    (calc as any).config.active_initial_tenure = 24;
    expect(calc.isLoanValid(loan)).toBeTrue();

    // invalid when initial_tenor missing
    (calc as any).config.active_initial_tenure = undefined;
    expect(calc.isLoanValid(loan)).toBeFalse();
  });

  it('updateLoanObjByConfig updates subsequent_tenor', () => {
    const calc = newCalc();
    const loan: any = {};
    const render: any = { variants: { list: XLoanCalculator.getVariants() } };
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 60;
    (calc as any).config.active_initial_tenure = 12;
    calc.updateLoanObjByConfig(loan, render);
    expect(loan.variant.id).toBe(VARIANTS.HYBRID_FLEXI);
    expect(loan.total_tenor).toBe(60);
    expect(loan.initial_tenor).toBe(12);
    expect(loan.subsequent_tenor).toBe(48);
  });

  it('updateRenderByConfig disables variants and builds tenure lists', () => {
    const calc = newCalc();
    const render: any = {
      variants: { list: XLoanCalculator.getVariants() },
      tenure: { tenure_list: [], initial_tenure_list: [], displayUnit: 'month' },
      options: { enabled: false, list: [] }
    };
    (calc as any).constraint.variants_enabled = [VARIANTS.TERM, VARIANTS.FLEXI, VARIANTS.HYBRID_FLEXI];
    (calc as any).config.VARIANTS = [
      (calc as any).constraint.mapp[VARIANTS.HYBRID_FLEXI],
      (calc as any).constraint.mapp[VARIANTS.FLEXI]
    ];
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 96;
    (calc as any).config.active_initial_tenure = 24;
    calc.updateRenderByConfig(render);
    expect(render.variants.list.find((v: any) => v.id === VARIANTS.TERM).isDisabled).toBeTrue();
    expect(render.tenure.tenure_list.length).toBeGreaterThan(0);
  });

  it('updateLoanConfigValues reacts to variant change', () => {
    const calc = newCalc();
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 12; // 12 exists but initial 12 is valid only for >=36
    (calc as any).config.active_initial_tenure = 24; // invalid for tenure 12
    calc.updateLoanConfigValues({} as any, 'variant');
    expect((calc as any).config.active_initial_tenure).toBe((calc as any).constraint.mapp[VARIANTS.HYBRID_FLEXI].tenures[(calc as any).config.active__tenure].default_initial);
  });

  it('updateLoanConfigValues reacts to tenure change by finding valid variant and initial tenure', () => {
    const calc = newCalc();
    // choose a tenure not valid for TERM (72) so it should switch to HYBRID_FLEXI
    (calc as any).config.active__variant = VARIANTS.TERM;
    (calc as any).config.active__tenure = 72; // disabled for TERM
    (calc as any).config.active_initial_tenure = undefined;
    calc.updateLoanConfigValues({} as any, 'tenure');
    expect((calc as any).config.active__variant).not.toBe(VARIANTS.TERM);
    expect((calc as any).config.active__tenure).toBe(72);
    expect((calc as any).config.active_initial_tenure).toBeDefined();
  });

  it('setValidVariantAndTenure__Initial resolves to a consistent configuration', () => {
    const calc = newCalc();
    (calc as any).config.active__variant = VARIANTS.TERM; // TERM has no initial tenures
    (calc as any).config.active__tenure = 60;
    (calc as any).config.active_initial_tenure = 12; // incompatible with TERM

    calc.setValidVariantAndTenure__Initial();

    const V = (calc as any).config.active__variant as VARIANTS;
    const T = (calc as any).config.active__tenure as number;
    const IT = (calc as any).config.active_initial_tenure as number;

    // Tenure should remain a defined number
    expect(T).toBeDefined();

    // If the resulting variant supports initial tenures, ensure the selected initial tenure is valid for that tenure
    if (calc.variantHasInitialTenures(V)) {
      expect(calc.isInitialTenureAvailableInTenure(V, T, IT)).toBeTrue();
    } else {
      // Otherwise, at least the variant is defined and consistent with constraints
      expect(V).toBeDefined();
    }
  });

  it('helper methods compute availability and mapping', () => {
    const calc = newCalc();
    expect(calc.isTenureAvailableInVariant(VARIANTS.TERM, 60)).toBeTrue();
    expect(calc.isTenureAvailableInVariant(VARIANTS.TERM, 96)).toBeFalse();
    expect(calc.isTenureAvailableInAnyVariant(96)).toBeTrue();

    expect(calc.isInitialTenureAvailableInTenure(VARIANTS.HYBRID_FLEXI, 60, 12)).toBeTrue();
    expect(calc.isInitialTenureAvailableInAnyTenure(VARIANTS.HYBRID_FLEXI, 24)).toBeTrue();

    expect(calc.getValidVariantForTenure(84)).toBeDefined();
    expect(calc.getValidVariantForTenureAndInitialTenure(60, 12)).toBe(VARIANTS.HYBRID_FLEXI);
    expect(calc.getValidTenureForInitialTenure(VARIANTS.HYBRID_FLEXI, 24)).toBeDefined();
    const VT = calc.getValidVariantAndTenure__InitialTenure(12);
    expect(VT && VT.V).toBeDefined();
    expect(calc.variantHasInitialTenures(VARIANTS.HYBRID_FLEXI)).toBeTrue();
    expect(calc.getValidInitialTenureForTenure(60)).toBeDefined();
  });
});

// Additional branch / edge coverage
describe('XLoanCalculator additional coverage', () => {
  function base() {
    const constraint = deepClone(XLoanCalculator.CONSTRAINT_V1);
    const config = deepClone(XLoanCalculator.LOAN_CONFIG_V1);
    return new XLoanCalculator(config as any, constraint as any);
  }

  it('constructor respects variants_enabled overriding default VARIANT_LIST', () => {
    const constraint = deepClone(XLoanCalculator.CONSTRAINT_V1);
    constraint.variants_enabled = [VARIANTS.TERM, VARIANTS.FLEXI];
    const config = deepClone(XLoanCalculator.LOAN_CONFIG_V1);
    const calc = new XLoanCalculator(config as any, constraint as any);
    expect((calc as any).VARIANT_LIST).toEqual([VARIANTS.TERM, VARIANTS.FLEXI]);
  });

  it('updateRenderByConfig sets notApplicable when variants_enabled present', () => {
    const constraint = deepClone(XLoanCalculator.CONSTRAINT_V1);
    constraint.variants_enabled = [VARIANTS.HYBRID_FLEXI];
    const config = deepClone(XLoanCalculator.LOAN_CONFIG_V1);
    const calc = new XLoanCalculator(config as any, constraint as any);
    (calc as any).applyDefaultConfig();
    (calc as any).updateLoanConfigOptions();
    const render: any = { variants: { list: XLoanCalculator.getVariants() }, tenure: { tenure_list: [], initial_tenure_list: [], displayUnit: 'month' } };
    calc.updateRenderByConfig(render);
    expect(render.variants.list.find((v: any) => v.id === VARIANTS.FLEXI).notApplicable).toBeTrue();
  });

  it('updateLoanConfigValues handles missing variant (applyDefaultConfig path)', () => {
    const calc = base();
    (calc as any).config.active__variant = undefined;
    (calc as any).config.active__tenure = undefined;
    calc.updateLoanConfigValues({} as any, 'variant');
    expect((calc as any).config.active__variant).toBeDefined();
  });

  it('updateLoanConfigValues handles missing tenure path', () => {
    const calc = base();
    (calc as any).config.active__tenure = undefined;
    calc.updateLoanConfigValues({} as any, 'variant');
    expect((calc as any).config.active__tenure).toBeDefined();
  });

  it('initial_tenure change branch setValidVariantAndTenure__Initial invoked', () => {
    const calc = base();
    (calc as any).config.active__variant = VARIANTS.TERM; // TERM has no initials
    (calc as any).config.active__tenure = 60;
    (calc as any).config.active_initial_tenure = 12; // incompatible
    calc.updateLoanConfigValues({} as any, 'initial_tenure');
    expect((calc as any).config.active__variant).toBeDefined();
  });

  it('setValidVariant__Tenure returns false when no variant has tenure', () => {
    const calc = base();
    (calc as any).config.active__tenure = 999; // impossible
    const res = (calc as any).setValidVariant__Tenure();
    expect(res).toBeFalse();
  });

  it('setValidInitialTenure__Tenure assigns initial tenure from another variant when current lacks initials', () => {
    const calc = base();
    (calc as any).config.active__variant = VARIANTS.FLEXI; // no initials
    (calc as any).config.active__tenure = 60;
    (calc as any).config.active_initial_tenure = undefined;
    (calc as any).setValidInitialTenure__Tenure();
    expect((calc as any).config.active_initial_tenure).toBeDefined();
  });

  it('setValidInitialTenure__Tenure resets invalid initial tenure to default', () => {
    const calc = base();
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 60;
    (calc as any).config.active_initial_tenure = 999; // invalid
    (calc as any).setValidInitialTenure__Tenure();
    expect((calc as any).config.active_initial_tenure).toBe(24); // default_initial for 60
  });

  it('isLoanValid returns false for undefined variant', () => {
    const calc = base();
    (calc as any).config.active__variant = undefined;
    expect(calc.isLoanValid({} as any)).toBeFalse();
  });

  it('isLoanValid returns false when variant constraint missing', () => {
    const calc = base();
    delete (calc as any).constraint.mapp[VARIANTS.HYBRID_FLEXI];
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    expect(calc.isLoanValid({} as any)).toBeFalse();
  });

  it('isTenureAvailableInAnyVariant false branch', () => {
    const calc = base();
    expect(calc.isTenureAvailableInAnyVariant(1000)).toBeFalse();
  });

  it('isInitialTenureAvailableInAnyTenure false branch for non-initial variant', () => {
    const calc = base();
    expect(calc.isInitialTenureAvailableInAnyTenure(VARIANTS.FLEXI, 12)).toBeFalse();
  });

  it('getValidVariantForTenure returns undefined for impossible tenure', () => {
    const calc = base();
    expect((calc as any).getValidVariantForTenure(1000)).toBeUndefined();
  });

  it('getValidVariantForTenureAndInitialTenure returns undefined for impossible combo', () => {
    const calc = base();
    expect((calc as any).getValidVariantForTenureAndInitialTenure(999, 12)).toBeUndefined();
  });

  it('getValidTenureForInitialTenure returns undefined for unmatched initial tenure', () => {
    const calc = base();
    expect((calc as any).getValidTenureForInitialTenure(VARIANTS.HYBRID_FLEXI, 999)).toBeUndefined();
  });

  it('getValidVariantAndTenure__InitialTenure returns null for invalid IT', () => {
    const calc = base();
    expect((calc as any).getValidVariantAndTenure__InitialTenure(999)).toBeNull();
  });

  it('variantHasInitialTenures false for FLEXI', () => {
    const calc = base();
    expect(calc.variantHasInitialTenures(VARIANTS.FLEXI)).toBeFalse();
  });

  it('getValidInitialTenureForTenure returns undefined when tenure absent in any initial variant', () => {
    const calc = base();
    expect((calc as any).getValidInitialTenureForTenure(999)).toBeUndefined();
  });

  it('applyDefaultConfig catch branch does not throw with malformed constraint', () => {
    const calc = base();
    (calc as any).constraint.default_variant = 'NON_EXISTENT';
    expect(() => calc.applyDefaultConfig()).not.toThrow();
  });
});

// Extended branch coverage
describe('XLoanCalculator extended branch coverage', () => {
  function clone() {
    const constraint = JSON.parse(JSON.stringify(XLoanCalculator.CONSTRAINT_V1));
    const config = JSON.parse(JSON.stringify(XLoanCalculator.LOAN_CONFIG_V1));
    const calc = new XLoanCalculator(config as any, constraint as any);
    (calc as any).applyDefaultConfig();
    (calc as any).updateLoanConfigOptions();
    return calc;
  }

  it('updateLoanConfigValues tenure change invalid -> applyDefaultConfig path', () => {
    const calc = clone();
    (calc as any).config.active__tenure = 999; // impossible tenure
    (calc as any).config.active__variant = VARIANTS.TERM; // ensure setValidVariant__Tenure fails
    calc.updateLoanConfigValues({} as any, 'tenure');
    // Should reset variant to default (HYBRID_FLEXI)
    expect((calc as any).config.active__variant).toBe(VARIANTS.HYBRID_FLEXI);
  });

  it('updateLoanConfigValues variant path with invalid initial tenure resets to default_initial', () => {
    const calc = clone();
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 60;
    (calc as any).config.active_initial_tenure = 999; // invalid
    calc.updateLoanConfigValues({} as any, 'variant');
    expect((calc as any).config.active_initial_tenure).toBe(24); // default_initial for tenure 60
  });

  it('updateLoanConfigValues variant path with invalid tenure sets variant default_tenure', () => {
    const calc = clone();
    (calc as any).config.active__variant = VARIANTS.FLEXI;
    (calc as any).config.active__tenure = 999; // invalid tenure
    calc.updateLoanConfigValues({} as any, 'variant');
    expect((calc as any).config.active__tenure).toBe((calc as any).constraint.mapp[VARIANTS.FLEXI].default_tenure);
  });

  it('update$ adjusts invalid configuration (initial tenure removed) and updates loan', () => {
    const calc = clone();
    const loan: any = { variant: { id: VARIANTS.HYBRID_FLEXI }, total_tenor: 96, initial_tenor: 24 };
    (calc as any).config.active__variant = VARIANTS.HYBRID_FLEXI;
    (calc as any).config.active__tenure = 96;
    (calc as any).config.active_initial_tenure = 24;
    // make config invalid
    (calc as any).config.active_initial_tenure = undefined;
    calc.update$(loan, 'initial_tenure');
    expect((calc as any).config.active_initial_tenure).toBeDefined();
  });

  it('setConstraint updates internal reference', () => {
    const calc = clone();
    const newConstraint = JSON.parse(JSON.stringify(XLoanCalculator.CONSTRAINT_V1));
    newConstraint.default_variant = VARIANTS.TERM;
    calc.setConstraint(newConstraint as any);
    (calc as any).applyDefaultConfig();
    expect((calc as any).config.active__variant).toBe(VARIANTS.TERM);
  });

  it('updateRenderByConfig without variants_enabled leaves notApplicable unchanged (previous flags cleared manually)', () => {
    const calc = clone();
    delete (calc as any).constraint.variants_enabled;
    const baseVariants = XLoanCalculator.getVariants().map(v => ({ ...v, notApplicable: undefined }));
    const render: any = { variants: { list: baseVariants }, tenure: { tenure_list: [], initial_tenure_list: [], displayUnit: 'month' } };
    calc.updateRenderByConfig(render);
    // After update none should be newly marked true since branch not executed
    const anyTrue = render.variants.list.some((v: any) => v.notApplicable === true);
    expect(anyTrue).toBeFalse();
  });

  it('applyDefaultConfig when default variant lacks initials retains previous initial_tenure but does not compute new one', () => {
    const calc = clone();
    // seed a prior initial tenure
    (calc as any).config.active_initial_tenure = 24;
    (calc as any).constraint.default_variant = VARIANTS.TERM; // TERM has no initials
    (calc as any).applyDefaultConfig();
    expect((calc as any).config.active__variant).toBe(VARIANTS.TERM);
    expect(calc.variantHasInitialTenures(VARIANTS.TERM)).toBeFalse();
    // active_initial_tenure should remain whatever was there (implementation does not clear it)
    expect((calc as any).config.active_initial_tenure).toBe(24);
  });

  it('static PLEMICARDLOAN_OPTIONS and PLEMICARDTENURES integrity', () => {
    expect(XLoanCalculator.PLEMICARDLOAN_OPTIONS.length).toBeGreaterThan(0);
    expect(XLoanCalculator.PLEMICARDTENURES.find(t => t.value === 24)).toBeDefined();
  });
});
