import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bWatchVideosComponent } from './b2b-watch-videos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';

class AaFlowServiceMock { playVideo = jest.fn(); }

describe('B2bWatchVideosComponent', () => {
  let component: B2bWatchVideosComponent;
  let fixture: ComponentFixture<B2bWatchVideosComponent>;
  let flow: AaFlowServiceMock;

  beforeEach(async () => {
    flow = new AaFlowServiceMock();

    await TestBed.configureTestingModule({
      imports: [B2bWatchVideosComponent],
      providers: [ { provide: AaFlowService, useValue: flow } ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bWatchVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace render.videos with single input video when MODE=VIDEO and video provided', () => {
    const singleVideo: any = { type: 'video', kpoint_id: 'kid1', title: 'Vid1' };
    component.MODE = 'VIDEO';
    component.video = singleVideo;
    component.ngOnInit();
    expect(component.render.videos.length).toBe(1);
    expect(component.render.videos[0]).toBe(singleVideo);
  });

  it('should not replace videos when MODE undefined even if video provided', () => {
    const inst = new B2bWatchVideosComponent(flow as any);
    inst.render.videos = [{ type: 'video', kpoint_id: 'orig' } as any];
    inst.MODE = undefined as any; // falsy path
    inst.video = { type: 'video', kpoint_id: 'new1' } as any;
    inst.ngOnInit();
    expect(inst.render.videos.length).toBe(1);
    expect(inst.render.videos[0].kpoint_id).toBe('orig');
  });

  it('should replace videos when MODE=LIST and video provided (condition uses truthy MODE string)', () => {
    const inst = new B2bWatchVideosComponent(flow as any);
    inst.render.videos = [{ type: 'video', kpoint_id: 'orig' } as any];
    inst.MODE = 'LIST';
    const v = { type: 'video', kpoint_id: 'listVid' } as any;
    inst.video = v;
    inst.ngOnInit();
    expect(inst.render.videos.length).toBe(1);
    expect(inst.render.videos[0]).toBe(v);
  });

  it('renderElement should set loaded true', () => {
    component.loaded = false;
    component.renderElement();
    expect(component.loaded).toBeTrue();
  });

  it('openVideo should call playVideo for valid video asset and emit ct.track', () => {
    jest.spyOn(component.emitter, 'emit');
    const video: any = { type: 'video', kpoint_id: 'k123' };
    component.openVideo(video);
    expect(flow.playVideo).toHaveBeenCalledWith(video);
    expect(component.emitter.emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'ct.track' }));
  });

  it('openVideo should still emit ct.track even if asset invalid', () => {
    flow.playVideo.mockClear();
    jest.spyOn(component.emitter, 'emit');
    const invalid: any = { type: 'image', kpoint_id: null };
    component.openVideo(invalid);
    expect(flow.playVideo).not.toHaveBeenCalled();
    expect(component.emitter.emit).toHaveBeenCalled();
  });

  it('openVideo should not call playVideo when type video but missing kpoint_id', () => {
    flow.playVideo.mockClear();
    const v: any = { type: 'video' }; // missing kpoint_id
    component.openVideo(v);
    expect(flow.playVideo).not.toHaveBeenCalled();
  });

  it('openVideo emits ct.track with expected section and cta text', () => {
    const emits: any[] = [];
    component.emitter.subscribe(e => emits.push(e));
    component.openVideo({ type: 'image' } as any);
    expect(emits.length).toBe(1);
    const evt = emits[0];
    expect(evt.event).toBe('ct.track');
    expect(evt.params.ct.section).toBe('WATCH VEDIO');
    expect(evt.params.ct.section_cta).toBe('WATCH VEDIO');
  });

  it('multiple openVideo calls should emit for each invocation', () => {
    jest.spyOn(component.emitter, 'emit');
    component.openVideo({ type: 'image' } as any);
    component.openVideo({ type: 'video', kpoint_id: 'v2' } as any);
    expect((component.emitter.emit as any).mock.calls.length).toBe(2);
    expect(flow.playVideo).toHaveBeenCalledTimes(1); // only second valid
  });
});
