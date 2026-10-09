import { HelperService } from './helper.service';

class DialogServiceStub { openHorizontalVideo = jest.fn(); }

describe('HelperService (pure jest)', () => {
  let service: HelperService;
  let dialog: DialogServiceStub;

  beforeEach(() => {
    dialog = new DialogServiceStub();
    service = new HelperService(dialog as any);
  });

  it('playVideo maps Asset to model and opens dialog (with package)', () => {
    const asset: any = { kpoint_id: 'k123', thumbnail: 't.png', title: 'Title', package_id: 'pkg' };
    service.playVideo(asset);
    expect(dialog.openHorizontalVideo).toHaveBeenCalledWith({
      kpointId: 'k123', thumbnailPath: 't.png', title: 'Title', packageId: 'pkg'
    });
  });

  it('playVideo sets empty packageId when missing', () => {
    const asset: any = { kpoint_id: 'k123', thumbnail: 't.png', title: 'Title' };
    service.playVideo(asset);
    expect(dialog.openHorizontalVideo).toHaveBeenCalledWith({
      kpointId: 'k123', thumbnailPath: 't.png', title: 'Title', packageId: ''
    });
  });

  it('addSubs$ pushes subscription', () => {
    const list: any[] = [];
    const sub: any = { closed: false, unsubscribe: jest.fn() };
    service.addSubs$(sub, list);
    expect(list[0]).toBe(sub);
  });

  it('closeSub$ unsubscribes active subs', () => {
    const a: any = { closed: false, unsubscribe: jest.fn() };
    const b: any = { closed: false, unsubscribe: jest.fn() };
    const c: any = { closed: true, unsubscribe: jest.fn() };
    service.closeSub$([a, b, c]);
    expect(a.unsubscribe).toHaveBeenCalled();
    expect(b.unsubscribe).toHaveBeenCalled();
    expect(c.unsubscribe).not.toHaveBeenCalled();
  });
});

describe('HelperService extra coverage', () => {
  let service: HelperService;
  let dialog: DialogServiceStub;
  beforeEach(()=>{ dialog = new DialogServiceStub(); service = new HelperService(dialog as any); });

  it('addSubs$ handles null list reference (local list not returned)', () => {
    const sub: any = { closed:false, unsubscribe: jest.fn() };
    // Passing null list; since function assigns new array locally it cannot be retrieved here, ensure no exception
    expect(()=>service.addSubs$(sub, null as any)).not.toThrow();
  });

  it('closeSub$ safely handles undefined and empty list', () => {
    expect(()=>service.closeSub$(undefined as any)).not.toThrow();
    expect(()=>service.closeSub$([])).not.toThrow();
  });
});
