import { PdpxFlowService } from './pdpx-flow.service';

class MatDialogStub {
  open = jest.fn().mockImplementation(() => ({
    afterClosed: () => ({ subscribe: (fn: () => void) => setTimeout(() => fn(), 0) }),
    close: () => {}
  }));
}
class ParentDataStub { deviceOS='ios'; }

describe('PdpxFlowService (pure jest)', () => {
  let service: PdpxFlowService;
  let dialog: MatDialogStub;
  let parent: ParentDataStub;

  beforeEach(() => {
    dialog = new MatDialogStub();
    parent = new ParentDataStub();
    service = new PdpxFlowService(dialog as any, parent as any);
  });

  it('isOffered true when offer applied', () => {
    (service as any).cust = { isOffer: true, offer: { __is_applied: true } };
    expect(service.isOffered()).toBe(true);
  });

  it('isOffered false without offer', () => {
    (service as any).cust = { isOffer: false, offer: null };
    expect(service.isOffered()).toBe(false);
  });

  it('overrideBackPress adds and clearOverrideBackPress removes', () => {
    const sub = service.overrideBackPress(() => {});
    expect((service as any).cust.override__back_nav$.length).toBe(1);
    service.clearOverrideBackPress(sub.key);
    expect((service as any).cust.override__back_nav$.length).toBe(0);
  });

  it('overrideBackPress executes callback and unsubscribes', () => {
    const cb = jest.fn();
    const sub = service.overrideBackPress(cb);
    sub.subject.next('back');
    expect(cb).toHaveBeenCalled();
    expect((service as any).cust.override__back_nav$.length).toBe(0);
  });

  it('clearOverrideBackPress without key clears all', () => {
    service.overrideBackPress(() => {});
    service.overrideBackPress(() => {});
    service.clearOverrideBackPress();
    expect((service as any).cust.override__back_nav$.length).toBe(0);
  });

  it('clearOverrideBackPress with invalid key keeps array', () => {
    service.clearOverrideBackPress('x');
    expect((service as any).cust.override__back_nav$?.length || 0).toBe(0);
  });

  it('getUnqId returns prefixed string', () => {
    const id = (service as any).getUnqId('p_');
    expect(id.startsWith('p_')).toBe(true);
  });

  it('openDialog sets footer disabled and stores current ref', (done) => {
    const comp: any = function() {};
    service.openDialog(comp, { a:1 }, false, false);
    expect((service as any).footer_enabled).toBe(false);
    expect((service as any).currentDialogRef).toBeTruthy();
    setTimeout(() => { // no override so footer remains disabled
      expect((service as any).footer_enabled).toBe(false);
      done();
    }, 10);
  });

  it('openDialog with override sets panelClass and re-enables footer after close', (done) => {
    jest.spyOn<any, any>(service as any, 'clearOverrideBackPress');
    (parent as any).deviceOS = 'android';
    const comp: any = function() {};
    service.openDialog(comp, { b:2 }, false, true);
    const lastCallArgs = (dialog.open as jest.Mock).mock.calls.slice(-1)[0][1];
    expect(lastCallArgs.panelClass).toBe('pdpx_dialog_panel_class_android');
    setTimeout(() => {
      expect((service as any).footer_enabled).toBe(true);
      expect((service as any).currentDialogRef).toBeUndefined();
      expect((service as any).clearOverrideBackPress).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('openErrorPopup does not throw when no render passed', () => {
    expect(() => service.openErrorPopup()).not.toThrow();
  });
});
