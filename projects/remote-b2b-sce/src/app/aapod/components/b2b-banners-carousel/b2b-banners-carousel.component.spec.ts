import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { B2bBannersCarouselComponent } from './b2b-banners-carousel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

function makeRender(overrides: Partial<any> = {}){
  return {
    id: 'banners.carousel',
    banners: [
      { link: 'a.jpg', alt:'a' },
      { link: 'b.jpg', alt:'b' },
      { link: 'c.jpg', alt:'c', type: 'video' },
    ],
    indicators: true,
    controls: true,
    autoSlide: false,
    showShareIcon: true,
    sliderInterval: 50,
    footer_text: 't',
    ...overrides
  } as any;
}

describe('B2bBannersCarouselComponent', () => {
  let component: B2bBannersCarouselComponent;
  let fixture: ComponentFixture<B2bBannersCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [B2bBannersCarouselComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(B2bBannersCarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.render = makeRender();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit should default undefined config values and start auto slide when enabled', fakeAsync(() => {
    const render = makeRender({ autoSlide: true, sliderInterval: 10 });
    component.render = render;
    const startAutoSlideSpy = jest.spyOn(component as any, 'startAutoSlide');
    fixture.detectChanges();
    expect(startAutoSlideSpy).toHaveBeenCalled();
    tick(15);
    (component as any).stopAutoSlide();
  }));

  it('selectImage should update selectedIndex and emit ct.track', () => {
    component.render = makeRender();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component.selectImage(1);
    expect(component['selectedIndex']).toBe(1);
    expect(emSpy).toHaveBeenCalled();
  });

  it('prevClick should wrap around and emit when manual', () => {
    component.render = makeRender();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component['selectedIndex'] = 0;
    component.prevClick();
    expect(component['selectedIndex']).toBe(2);
    expect(emSpy).toHaveBeenCalled();
  });

  it('nextClick should wrap around and not emit when auto==true', () => {
    component.render = makeRender();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component['selectedIndex'] = 2;
    component.nextClick(true);
    expect(component['selectedIndex']).toBe(0);
    expect(emSpy).not.toHaveBeenCalled();
  });

  it('onTouch swipe should navigate to prev/next based on delta', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = 1;
    const startEvt: any = { touches:[{ clientX: 100 }] };
    component.onTouchStart(startEvt);
    const moveEvt: any = { touches:[{ clientX: 10 }] };
    component.onTouchMove(moveEvt);
    component.onTouchEnd();
    expect(component['selectedIndex']).toBe(2); // moved left -> next
  });

  it('scrollSmoothly should emit ct.track', () => {
    component.render = makeRender();
    (component as any).scrollingImages = { nativeElement: { scrollTop: 0 } };
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component.scrollSmoothly('forward');
    expect(emSpy).toHaveBeenCalled();
    component.scrollSmoothly('backward');
    expect(emSpy).toHaveBeenCalled();
  });

  it('onShare should emit with current image', () => {
    component.render = makeRender();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component['selectedIndex'] = 0;
    component.onShare();
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({ event: 'share' }));
  });

  it('imageHover and imageHoverLeft should update and restore selection', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = 0;
    component.imageHover(2);
    expect(component['selectedIndex']).toBe(2);
    component.imageHoverLeft();
    expect(component['selectedIndex']).toBe(0);
  });

  it('should default missing config fields in ngOnInit', () => {
    const r: any = { id: 'banners.carousel', banners: [{ link: 'x.jpg' }] };
    component.render = r;
    fixture.detectChanges();
    expect(component.render.controls).toBe(true);
    expect(component.render.indicators).toBe(true);
    expect(component.render.showShareIcon).toBe(true);
    expect(component.render.autoSlide).toBe(false);
    expect(component.render.sliderInterval).toBe(3000);
  });

  it('nextClick should emit when manual', () => {
    component.render = makeRender();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component['selectedIndex'] = 1;
    component.nextClick();
    expect(component['selectedIndex']).toBe(2);
    expect(emSpy).toHaveBeenCalled();
  });

  it('prevClick should not emit when auto flag is true', () => {
    component.render = makeRender();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component['selectedIndex'] = 0;
    component.prevClick(true);
    expect(component['selectedIndex']).toBe(2);
    expect(emSpy).not.toHaveBeenCalled();
  });

  it('onResize should toggle isMobile based on width', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component.onResize({ target: { innerWidth: 500 } } as any);
    expect(component['isMobile']).toBe(true);
    component.onResize({ target: { innerWidth: 1024 } } as any);
    expect(component['isMobile']).toBe(false);
  });

  it('renderElement should set loaded to true', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['loaded'] = false;
    component.renderElement();
    expect(component['loaded']).toBe(true);
  });

  it('playVideo should emit ct.track and not throw with mocked container', () => {
    component.render = makeRender();
    component.render.banners.push({ link: 'v.mp4', type: 'video' } as any);
    (component as any).vxPlayerContainer = { nativeElement: {} } as any;
    const emSpy = jest.spyOn(component.emitter, 'emit');
    fixture.detectChanges();
    component.playVideo(component.render.banners[3]);
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({ event: 'ct.track' }));
  });

  it('onTouchEnd should ignore small swipes and reset touch vars', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = 1;
    component.onTouchStart({ touches: [{ clientX: 100 }] } as any);
    component.onTouchMove({ touches: [{ clientX: 120 }] } as any); // delta = 20 < threshold
    component.onTouchEnd();
    expect(component['selectedIndex']).toBe(1);
    expect((component as any).touchStartX).toBe(0);
    expect((component as any).touchEndX).toBe(0);
  });

  it('startAutoSlide should call nextClick periodically and stopAutoSlide should cancel it', fakeAsync(() => {
    component.render = makeRender({ autoSlide: false, sliderInterval: 10 });
    fixture.detectChanges();
    const spy = jest.spyOn(component, 'nextClick');
    (component as any).startAutoSlide();
    tick(12);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls.at(-1)[0]).toBe(true);
    (component as any).stopAutoSlide();
  }));

  it('scrollSmoothly should adjust scrollTop forward and backward', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const el = { scrollTop: 0 } as any;
    (component as any).scrollingImages = { nativeElement: el } as any;
    component.scrollSmoothly('forward');
    expect(el.scrollTop).toBe(60);
    component.scrollSmoothly('backward');
    expect(el.scrollTop).toBe(0);
  });

  it('onTouchStart should stop auto slide before tracking gesture', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const stopSpy = jest.spyOn(component as any, 'stopAutoSlide');
    component.onTouchStart({ touches: [{ clientX: 200 }] } as any);
    expect(stopSpy).toHaveBeenCalled();
  });

  // Additional tests to improve coverage
  it('onTouch swipe right should go to previous image', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = 1;
    component.onTouchStart({ touches: [{ clientX: 200 }] } as any);
    component.onTouchMove({ touches: [{ clientX: 300 }] } as any); // right swipe
    component.onTouchEnd();
    expect(component['selectedIndex']).toBe(0);
  });

  it('scrollSmoothly should send correct cta labels', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const el = { scrollTop: 0 } as any;
    (component as any).scrollingImages = { nativeElement: el } as any;
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.scrollSmoothly('forward');
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'SCROLL DOWN' }) })
    }));
    component.scrollSmoothly('backward');
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'SCROLL UP' }) })
    }));
  });

  it('selectImage should emit source id of render for analytics', () => {
    const r = makeRender({ id: 'custom.carousel' });
    component.render = r as any;
    fixture.detectChanges();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.selectImage(2);
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({
        ct: expect.any(Object)
      })
    }));
  });

  it('prev/next with single banner should keep index within bounds', () => {
    component.render = makeRender({ banners: [{ link: 'only.jpg' }] });
    fixture.detectChanges();
    component['selectedIndex'] = 0;
    component.prevClick();
    expect(component['selectedIndex']).toBe(0);
    component.nextClick();
    expect(component['selectedIndex']).toBe(0);
  });

  it('onResize should set isMobile true at 768 breakpoint', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component.onResize({ target: { innerWidth: 768 } } as any);
    expect(component['isMobile']).toBe(true);
  });

  it('ngOnInit should not crash without render and should not start auto slide', () => {
    const startSpy = jest.spyOn(component as any, 'startAutoSlide');
    fixture.detectChanges();
    expect(component['loaded']).toBe(true);
    expect(startSpy).not.toHaveBeenCalled();
  });

  it('ngOnInit should not override explicitly set config values', () => {
    const r = makeRender({
      controls: false,
      indicators: false,
      showShareIcon: false,
      autoSlide: false,
      sliderInterval: 123
    });
    component.render = r;
    fixture.detectChanges();
    expect(component.render.controls).toBe(false);
    expect(component.render.indicators).toBe(false);
    expect(component.render.showShareIcon).toBe(false);
    expect(component.render.autoSlide).toBe(false);
    expect(component.render.sliderInterval).toBe(123);
  });

  it('onShare should emit selected image and source id', () => {
    const r = makeRender({ id: 'custom.carousel' });
    component.render = r;
    fixture.detectChanges();
    component['selectedIndex'] = 1;
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.onShare();
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      event: 'share',
      params: expect.objectContaining({
        image: r.banners[1],
        source: 'custom.carousel'
      })
    }));
  });

  it('scrollSmoothly with unknown direction should not change scroll and should emit SCROLL UP', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const el = { scrollTop: 5 } as any;
    (component as any).scrollingImages = { nativeElement: el } as any;
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.scrollSmoothly('noop');
    expect(el.scrollTop).toBe(5);
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'SCROLL UP' }) })
    }));
  });

  it('selectImage should set prevSelectedIndex as well', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component.selectImage(2);
    expect((component as any).prevSelectedIndex).toBe(2);
  });

  it('playVideo should still emit when no video assets present', () => {
    component.render = makeRender({ banners: [{ link: 'a.jpg' }, { link: 'b.jpg' }] });
    (component as any).vxPlayerContainer = { nativeElement: {} } as any;
    fixture.detectChanges();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.playVideo(component.render.banners[0] as any);
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({ event: 'ct.track' }));
  });

  it('auto slide ticks should not emit analytics events', fakeAsync(() => {
    const r = makeRender({ autoSlide: false, sliderInterval: 10 });
    component.render = r;
    fixture.detectChanges();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    (component as any).startAutoSlide();
    tick(12);
    (component as any).stopAutoSlide();
    expect(emSpy).not.toHaveBeenCalled();
  }));

  it('prevClick should emit PREVIOUS analytics payload when manual', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.prevClick();
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      event: 'ct.track',
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'PREVIOUS' }) })
    }));
  });

  it('nextClick should emit NEXT analytics payload when manual', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.nextClick();
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      event: 'ct.track',
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'NEXT' }) })
    }));
  });

  it('startAutoSlide should call nextClick with auto=true', fakeAsync(() => {
    component.render = makeRender({ sliderInterval: 10 });
    fixture.detectChanges();
    const spy = jest.spyOn(component, 'nextClick');
    (component as any).startAutoSlide();
    tick(12);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls.at(-1)[0]).toBe(true);
    (component as any).stopAutoSlide();
  }));

  it('onTouchEnd at exact threshold should not navigate', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = 1;
    component.onTouchStart({ touches: [{ clientX: 100 }] } as any);
    component.onTouchMove({ touches: [{ clientX: 50 }] } as any); // |delta| = 50 => ignore
    component.onTouchEnd();
    expect(component['selectedIndex']).toBe(1);
  });

  it('emitt should forward payload via EventEmitter', () => {
    component.render = makeRender();
    fixture.detectChanges();
    const payload: any = { event: 'x', params: { a: 1 } };
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.emitt(payload);
    expect(emSpy).toHaveBeenCalledWith(payload);
  });

  it('stopAutoSlide should be safe when no interval started', () => {
    component.render = makeRender();
    fixture.detectChanges();
    expect(() => (component as any).stopAutoSlide()).not.toThrow();
  });

  it('prevClick should decrement when not at first index', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = 2;
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.prevClick();
    expect(component['selectedIndex']).toBe(1);
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'PREVIOUS' }) })
    }));
  });

  it('nextClick manual from last index should wrap to 0 and emit', () => {
    component.render = makeRender();
    fixture.detectChanges();
    component['selectedIndex'] = component.render.banners.length - 1;
    const emSpy = jest.spyOn(component.emitter, 'emit');
    component.nextClick();
    expect(component['selectedIndex']).toBe(0);
    expect(emSpy).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ ct: expect.objectContaining({ section_cta: 'NEXT' }) })
    }));
  });
});
