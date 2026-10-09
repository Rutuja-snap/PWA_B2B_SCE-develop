import { HorizontalVideoService } from './horizontal-video.service';

describe('HorizontalVideoService', () => {
  let service: HorizontalVideoService;

  beforeEach(() => {
    service = new HorizontalVideoService();
  });

  it('initial states before any setters', () => {
    expect(service.getKpointRef()).toBeUndefined();
    expect(service.getVideoModalStatus()).toBeUndefined();
    expect(service.playerRef).toBeNull();
    expect(service.reelsOpen).toBe(false);
  });

  it('should set and get kpoint ref', () => {
    service.setKpointRef();
    const ref1 = service.getKpointRef();
    expect(ref1).toMatch(/^kpoint/);
  });

  it('multiple setKpointRef calls overwrite ref', () => {
    const spy = jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(2000);
    service.setKpointRef();
    const first = service.getKpointRef();
    service.setKpointRef();
    const second = service.getKpointRef();
    expect(first).toBe('kpoint1000');
    expect(second).toBe('kpoint2000');
    expect(second).not.toBe(first);
    spy.mockRestore();
  });

  it('should set and get video modal status', () => {
    service.setVideoModalStatus('open');
    expect(service.getVideoModalStatus()).toBe('open');
  });

  it('should overwrite video modal status', () => {
    service.setVideoModalStatus('open');
    service.setVideoModalStatus('closed');
    expect(service.getVideoModalStatus()).toBe('closed');
  });

  it('should emit on videoClose and reelsClose', (done) => {
    let count = 0;
    service.videoClose.subscribe(v => { expect(v).toBe(1); count++; if(count===2) done(); });
    service.reelsClose.subscribe(() => { count++; if(count===2) done(); });
    service.videoClose.next(1);
    service.reelsClose.next();
  });

  it('reelsOpen flag can be toggled externally (public property)', () => {
    expect(service.reelsOpen).toBe(false);
    service.reelsOpen = true;
    expect(service.reelsOpen).toBe(true);
  });
});
