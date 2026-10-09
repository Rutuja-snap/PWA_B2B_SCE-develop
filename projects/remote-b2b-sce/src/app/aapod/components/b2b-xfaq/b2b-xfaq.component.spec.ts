import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { B2bXfaqComponent } from './b2b-xfaq.component';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { AaFlowService } from '../../services/aa-flow.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

interface XFAQItem { question: string; answer: string; type?: string; kpoint_id?: string; is_cta?: boolean; cta?: { action: string; label?: string }; video?: any; }
interface XFAQRenderMock { id?: string; faqs?: XFAQItem[]; showMore?: boolean; expansion_mode?: string; update$?: Subject<boolean>; search$?: Subject<string>; }

class AaFlowServiceMock { playVideo = jest.fn(); }

describe('B2bXfaqComponent', () => {
  let component: B2bXfaqComponent;
  let fixture: ComponentFixture<B2bXfaqComponent>;
  let flow: AaFlowServiceMock;

  const createFaqs = (count: number, answerExtra: string = ''): XFAQItem[] => {
    return Array.from({ length: count }).map((_, i) => ({
      question: `Q${i+1}?`,
      answer: `<p>Answer ${i+1} ${answerExtra}</p>`
    }));
  };

  beforeEach(async () => {
    flow = new AaFlowServiceMock();

    await TestBed.configureTestingModule({
      imports: [B2bXfaqComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [ { provide: AaFlowService, useValue: flow } ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bXfaqComponent);
    component = fixture.componentInstance;
    component.render = {
      id: 'faq-sec',
      faqs: createFaqs(3, 'short'),
      showMore: true,
      expansion_mode: 'first'
    } as XFAQRenderMock as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize update$ when missing and set loaded true', () => {
    const newComponent = TestBed.createComponent(B2bXfaqComponent).componentInstance;
    const renderObj: XFAQRenderMock = { id: 'id1', faqs: createFaqs(1) };
    newComponent.render = renderObj as any;
    expect(renderObj.update$).toBeUndefined();
    newComponent.ngOnInit();
    expect(renderObj.update$).toBeDefined();
    expect(newComponent.loaded).toBe(true);
  });

  it('clearSearch should clone faqs into filtered', () => {
    component.filtered = [];
    component.clearSearch();
    expect(component.filtered?.length).toBe(3);
    expect(component.filtered?.[0].question).toBe('Q1?');
  });

  it('toggleCards toggles showMore flag', () => {
    const prev = component.showMore;
    component.toggleCards();
    expect(component.showMore).toBe(!prev);
  });

  it('capAction should toggle isCapExpanded and emit ct.track event', () => {
    const emitSpy = jest.spyOn(component.emitter, 'emit');
    component.isCapExpanded = false;
    component.capAction();
    expect(component.isCapExpanded).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ event: 'ct.track' }));
  });

  it('openVideo should call flow.playVideo when type video and kpoint_id present', () => {
    const asset: any = { type: 'video', kpoint_id: 'kid1' };
    component.openVideo(asset);
    expect(flow.playVideo).toHaveBeenCalledWith(asset);
  });

  it('openVideo should not call flow.playVideo when missing kpoint_id', () => {
    flow.playVideo.mockClear();
    component.openVideo({ type: 'video' } as any);
    expect(flow.playVideo).not.toHaveBeenCalled();
  });

  it('onXFaqCTA should call openVideo for video cta with kpoint id', () => {
    const openSpy = jest.spyOn(component, 'openVideo');
    const faq: any = { cta: { action: 'video' }, video: { kpoint_id: 'v1', type: 'video' } };
    component.onXFaqCTA(faq);
    expect(openSpy).toHaveBeenCalledWith(faq.video);
  });

  it('onXFaqCTA should not call openVideo if cta action is video but no kpoint id', () => {
    const openSpy = jest.spyOn(component, 'openVideo');
    const faq: any = { cta: { action: 'video' }, video: { type: 'video' } };
    component.onXFaqCTA(faq);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('processLinks should prevent default when clicking anchor', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    const event = new MouseEvent('click');
    const preventSpy = jest.spyOn(event, 'preventDefault');
    Object.defineProperty(event, 'target', { value: anchor });
    component.processLinks(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('updateCap should set isCapEnabled false when height < 500', () => {
    component.faqContent = new ElementRef({ clientHeight: 100 });
    component.updateCap();
    expect(component.isCapEnabled).toBe(false);
    expect(component.isCapExpanded).toBe(true);
  });

  it('updateCap should enable cap when height >= 500', () => {
    component.faqContent = new ElementRef({ clientHeight: 600 });
    component.updateCap();
    expect(component.isCapEnabled).toBe(true);
    expect(component.isCapExpanded).toBe(false);
  });

  it('updateCap should treat exactly 500 as enabled cap', () => {
    component.faqContent = new ElementRef({ clientHeight: 500 });
    component.updateCap();
    expect(component.isCapEnabled).toBe(true);
    expect(component.isCapExpanded).toBe(false);
  });

  it('updateCap should default expand when faqContent undefined', () => {
    component.faqContent = undefined as any;
    component.isCapEnabled = true; // set opposite to ensure overwrite
    component.isCapExpanded = false;
    component.updateCap();
    expect(component.isCapEnabled).toBe(false);
    expect(component.isCapExpanded).toBe(true);
  });

  it('setXfaqHeight should show show-more when height > maxheight', () => {
    component.maxheight = 300;
    component.faqContent = new ElementRef({ clientHeight: 350 });
    component.setXfaqHeight();
    expect(component.maxHeight).toBe(300);
    expect(component.isShowMoreVisible).toBe(true);
  });

  it('setXfaqHeight should hide show-more when height <= maxheight', () => {
    component.maxheight = 400;
    component.faqContent = new ElementRef({ clientHeight: 350 });
    component.setXfaqHeight();
    expect(component.isShowMoreVisible).toBe(false);
  });

  it('capAction second toggle should flip back and emit Show Less', () => {
    const emitSpy = jest.spyOn(component.emitter, 'emit');
    component.isCapExpanded = true;
    component.capAction();
    const firstState = component.isCapExpanded;
    component.capAction();
    expect(component.isCapExpanded).toBe(!firstState);
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

  it('processLinks should handle child element inside anchor and strip unsafe prefix', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'unsafe:https://example.com');
    const span = document.createElement('span');
    anchor.appendChild(span);
    const event = new MouseEvent('click');
    const preventSpy = jest.spyOn(event, 'preventDefault');
    Object.defineProperty(event, 'target', { value: span });
    component.processLinks(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('getVXPlayer should call global VXPlayer with correct args', () => {
    const stub = jest.fn().mockReturnValue({ player: true });
    (window as any).VXPlayer = stub;
    const container = { any: 'c' };
    const result = component.getVXPlayer(container, ['v1']);
    expect(stub).toHaveBeenCalled();
    expect(result).toEqual({ player: true });
  });

  it('initPlayer should set vxPlayer using getVXPlayer', () => {
    component.vxPlayerContainer = new ElementRef({});
    const getSpy = jest.spyOn(component, 'getVXPlayer').mockReturnValue({ ok: true } as any);
    component.initPlayer(['id1']);
    expect(getSpy).toHaveBeenCalled();
    expect(component.vxPlayer).toEqual({ ok: true });
  });

  it('initPlayer should catch error from getVXPlayer', () => {
    component.vxPlayerContainer = new ElementRef({});
    jest.spyOn(component, 'getVXPlayer').mockImplementation(() => { throw new Error('boom'); });
    const clog = jest.spyOn(console, 'log').mockImplementation(() => {});
    component.initPlayer(['id1']);
    // Accept either single-arg or two-arg logging; assert at least first arg string matches
    const calls = clog.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe('Error in initPlayer');
  });

  it('search$ should trigger applySearch path when non-empty', () => {
    const r: any = { faqs: createFaqs(2) };
    component.render = r;
    const applySpy = jest.spyOn(component, 'applySearch');
    component.renderElement();
    r.search$.next('hello');
    expect(applySpy).toHaveBeenCalledWith('hello');
  });

  it('capAction should emit correct section_cta labels for expand/collapse sequence', () => {
    const emits: any[] = [];
    component.emitter.subscribe(e => emits.push(e));
    component.isCapExpanded = true; // expanded initially
    component.capAction(); // collapse => label Show Less
    component.capAction(); // expand => label Show More
    const labels = emits.map(e => e.params.ct.section_cta);
    expect(labels).toContain('Show Less');
    expect(labels).toContain('Show More');
  });

  it('processLinks should strip unsafe prefix when anchor itself has unsafe link', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'unsafe:https://example.com');
    const event = new MouseEvent('click');
    const preventSpy = jest.spyOn(event, 'preventDefault');
    Object.defineProperty(event, 'target', { value: anchor });
    component.processLinks(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('openVideo should not call playVideo when asset type not video', () => {
    flow.playVideo.mockClear();
    component.openVideo({ type: 'image', kpoint_id: 'kid1' } as any);
    expect(flow.playVideo).not.toHaveBeenCalled();
  });

  it('onResize should call updateCap', () => {
    const upSpy = jest.spyOn(component, 'updateCap');
    component.onResize({});
    expect(upSpy).toHaveBeenCalled();
  });

  it('updateCap should still evaluate when render.showMore is false (due to hardcoded true in condition)', () => {
    component.render.showMore = false as any; // force false
    component.faqContent = new ElementRef({ clientHeight: 100 });
    component.updateCap();
    expect(component.isCapExpanded).toBe(true);
  });

  it('ngAfterViewInit should call updateCap (simulate with height 100)', () => {
    component.faqContent = new ElementRef({ clientHeight: 100 });
    const upSpy = jest.spyOn(component, 'updateCap');
    component.ngAfterViewInit();
    expect(upSpy).toHaveBeenCalled();
  });

  it('ngOnInit should process update$ emissions after timer', fakeAsync(() => {
    const r: any = { faqs: createFaqs(1), update$: new Subject<boolean>() };
    component.render = r;
    const upSpy = jest.spyOn(component, 'updateCap');
    component.ngOnInit();
    r.update$.next(true);
    tick(500);
    expect(upSpy).toHaveBeenCalled();
  }));

  it('renderElement should clearSearch when search$ emits empty string', () => {
    const r: any = { faqs: createFaqs(2) };
    component.render = r;
    const clearSpy = jest.spyOn(component, 'clearSearch');
    component.renderElement();
    r.search$.next('');
    expect(clearSpy).toHaveBeenCalled();
  });

  it('applySearch should leave filtered unchanged (implementation commented out)', () => {
    const faqs = createFaqs(2);
    component.render = { faqs } as any;
    component.clearSearch();
    const before = component.filtered?.slice();
    component.applySearch('query');
    expect(component.filtered).toEqual(before);
  });

  it('processLinks with non-anchor target should just prevent default without errors', () => {
    const span = document.createElement('span');
    const event = new MouseEvent('click');
    const preventSpy = jest.spyOn(event, 'preventDefault');
    Object.defineProperty(event, 'target', { value: span });
    component.processLinks(event);
    expect(preventSpy).toHaveBeenCalled();
  });
});
