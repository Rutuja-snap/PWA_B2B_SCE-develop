// Rewritten without TestBed: plain Jest unit tests for DialogService
import { DialogService } from './dialog.service';
import { Subject, Observable } from 'rxjs';
import { B2bHorizontalVideoComponent } from '../components/b2b-horizontal-video/b2b-horizontal-video.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HorizontalVideoModel } from '../model/kpoint.model';
import { ApiIntegartedService } from 'api-integarted';

// Centralised mock dialog ref interface & factory so it is used and not duplicated
interface MockDialogRef {
  beforeClosed(): Observable<void>;
  triggerClose(): void;
}

const createDialogRef = (): MockDialogRef => {
  const subj = new Subject<void>();
  return {
    beforeClosed: () => subj.asObservable(),
    triggerClose: () => {
      subj.next();
      subj.complete();
    }
  };
};

describe('DialogService (no TestBed)', () => {
  let openMock: jest.Mock;
  let snackOpenMock: jest.Mock;
  let zoneRunMock: jest.Mock;
  let apiMock: { checkInternetStatus: jest.Mock };
  let service: DialogService;

  const buildService = (online = true) => {
    openMock = jest.fn().mockImplementation(() => createDialogRef());
    snackOpenMock = jest.fn();
    zoneRunMock = jest.fn((fn: () => void) => fn());
    apiMock = { checkInternetStatus: jest.fn().mockReturnValue(online) };
    // Provide typed stand-ins instead of casting to any
    const matDialogStub: Partial<MatDialog> = { open: openMock };
    const zoneStub: Partial<NgZone> = { run: zoneRunMock };
    const snackStub: Partial<MatSnackBar> = { open: snackOpenMock };
    const apiStub: Partial<ApiIntegartedService> = apiMock;
    service = new DialogService(
      matDialogStub as MatDialog,
      zoneStub as NgZone,
      snackStub as MatSnackBar,
      apiStub as ApiIntegartedService
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens dialog when online, pushes and pops stack on close', () => {
    buildService(true);
    const videoData: HorizontalVideoModel = { kpointId: 'id', thumbnailPath: 'thumb', title: 'Title', packageId: 'pkg' };
    const initialLen = service.stack.length;

    service.openHorizontalVideo(videoData);

    expect(apiMock.checkInternetStatus).toHaveBeenCalled();
    expect(zoneRunMock).toHaveBeenCalled();
    expect(openMock).toHaveBeenCalledTimes(1);
    const [comp, config] = openMock.mock.calls[0];
    expect(comp).toBe(B2bHorizontalVideoComponent);
    expect(config).toMatchObject({
      data: videoData,
      disableClose: false,
      panelClass: 'layout-dialog-video-player'
    });
    expect(service.stack.length).toBe(initialLen + 1);
    const ref = openMock.mock.results[0].value as MockDialogRef;
    ref.triggerClose();
    expect(service.stack.length).toBe(initialLen);
  });

  it('stacks multiple dialogs and pops in LIFO order', () => {
    buildService(true);
    const refOrder: MockDialogRef[] = [];
    openMock.mockImplementation(() => {
      const r = createDialogRef();
      refOrder.push(r);
      return r;
    });
    service.openHorizontalVideo({ kpointId: '1', thumbnailPath: 't1' });
    service.openHorizontalVideo({ kpointId: '2', thumbnailPath: 't2' });
    expect(service.stack.length).toBe(2);
    refOrder[1].triggerClose();
    expect(service.stack.length).toBe(1);
    refOrder[0].triggerClose();
    expect(service.stack.length).toBe(0);
  });

  it('shows snackbar and does not open dialog when offline', () => {
    buildService(false);
    service.openHorizontalVideo({ kpointId: '0', thumbnailPath: 'thumb' });
    expect(apiMock.checkInternetStatus).toHaveBeenCalled();
    expect(openMock).not.toHaveBeenCalled();
    expect(zoneRunMock).not.toHaveBeenCalled();
    expect(snackOpenMock).toHaveBeenCalledWith(
      'Please check your Internet Connection.',
      '',
      expect.objectContaining({ duration: 2000, panelClass: 'clp-error-toast' })
    );
  });

  it('does not pop stack if beforeClosed never emits', () => {
    buildService(true);
    service.openHorizontalVideo({ kpointId: 'x', thumbnailPath: 'tx' });
    expect(service.stack.length).toBe(1);
    expect(service.stack.length).toBe(1);
  });
});

describe('DialogService internals peek/pop coverage', () => {
  // Access helper for private methods without using any
  interface DialogServiceTestAccess {
    peek(): MatDialogRef<unknown, unknown> | null;
    pop(): MatDialogRef<unknown, unknown> | undefined;
  }
  let service: DialogService;
  let openMock: jest.Mock;
  let apiMock: { checkInternetStatus: jest.Mock };
  let zoneRunMock: jest.Mock;
  beforeEach(() => {
    openMock = jest.fn().mockImplementation(() => createDialogRef());
    zoneRunMock = jest.fn((fn: () => void) => fn());
    apiMock = { checkInternetStatus: jest.fn().mockReturnValue(true) };
    const matDialogStub: Partial<MatDialog> = { open: openMock };
    const zoneStub: Partial<NgZone> = { run: zoneRunMock };
    const snackStub: Partial<MatSnackBar> = { open: jest.fn() };
    service = new DialogService(
      matDialogStub as MatDialog,
      zoneStub as NgZone,
      snackStub as MatSnackBar,
      apiMock as unknown as ApiIntegartedService
    );
  });

  it('peek returns null when stack empty then dialog ref when present then null after close', () => {
    const svc = service as unknown as DialogServiceTestAccess;
    expect(svc.peek()).toBeNull();
    service.openHorizontalVideo({ kpointId: 'p', thumbnailPath: 'tp' });
    const ref = openMock.mock.results[0].value as MockDialogRef;
    expect(svc.peek()).toBe(ref as unknown as MatDialogRef<unknown, unknown>);
    ref.triggerClose();
    expect(svc.peek()).toBeNull();
  });

  it('pop returns undefined when empty and returns ref when element present', () => {
    const svc = service as unknown as DialogServiceTestAccess;
    expect(svc.pop()).toBeUndefined();
    service.openHorizontalVideo({ kpointId: 'p2', thumbnailPath: 'tp2' });
    const ref = openMock.mock.results[0].value as MockDialogRef;
    const popped = svc.pop();
    expect(popped).toBe(ref as unknown as MatDialogRef<unknown, unknown>);
    expect(svc.pop()).toBeUndefined();
  });
});
