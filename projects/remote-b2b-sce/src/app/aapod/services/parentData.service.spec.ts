// Pure Jest unit test (no TestBed) for ParentDataServices
import { ParentDataServices } from './parentData.service';

// Provide global getData used by the service constructor
// The service returns the value of getData() directly from its constructor.
describe('ParentDataServices (pure Jest)', () => {
  beforeEach(() => {
    (globalThis as any).getData = jest.fn(() => ({ foo: 'bar', nested: { a: 1 } }));
  });

  it('returns the plain data object from constructor', () => {
    const returned = new ParentDataServices({} as any); // since constructor returns data object
    expect(returned).toEqual({ foo: 'bar', nested: { a: 1 } });
    expect((globalThis as any).getData).toHaveBeenCalled();
  });
});
