import 'jest-preset-angular/setup-jest';

// Provide default global config used by environment.ts and other modules
// so tests do not throw ReferenceError when accessing environmentAllData.
// no-dd-sa:typescript-best-practices/no-unsafe-assignment
const g: any = globalThis as any;
g.environmentAllData = g.environmentAllData || {
  ENVIRONMENT_NAME: 'WEB_UAT',
  apiBaseUrl: 'http://localhost:4200',
  URL: {
    offersTwo: {
      getHorizontalVideoScript: 'https://example.com/video.js'
    }
  },
  CONFIG: {}
};

// Mock getData function used by ParentDataServices
g.getData = g.getData || function() {
  return {
    // Add any default data structure that your app expects
    // You can customize this based on what getData() should return
  };
};

// jsdom does not implement matchMedia; required by inputmask and other libs
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false
    } as unknown as MediaQueryList;
  };
}

// Keep only minimal custom helpers if still referenced
expect.extend({
  toBeTrue(received: any) {
    const pass = received === true;
    return { pass, message: () => `expected ${received} to be true` };
  },
  toBeFalse(received: any) {
    const pass = received === false;
    return { pass, message: () => `expected ${received} to be false` };
  }
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  // no-dd-sa:typescript-best-practices/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeTrue(): R;
      toBeFalse(): R;
    }
  }
}