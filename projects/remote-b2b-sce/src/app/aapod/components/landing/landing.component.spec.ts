import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LandingComponent } from './landing.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let flowSvc: { onBack: jest.Mock };
  let originalConnectionSource: any;
  let zone: NgZone;

  beforeEach(async () => {
    originalConnectionSource = environment.CONNECTION_SOURCE;
    flowSvc = { onBack: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, LandingComponent, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn(), dismiss: jest.fn() } },
        { provide: AaFlowService, useValue: flowSvc }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  afterEach(() => {
    environment.CONNECTION_SOURCE = originalConnectionSource; // restore
    (window as any).subscribeBackButton = undefined;
  });

  function createComponent() {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    zone = TestBed.inject(NgZone);
    fixture.detectChanges();
  }

  it('should create (CONNECTION_SOURCE != APP) and not attach back button listener', () => {
    environment.CONNECTION_SOURCE = 'WEB';
    (window as any).subscribeBackButton = jest.fn();
    createComponent();
    expect(component).toBeTruthy();
    expect((window as any).subscribeBackButton).not.toHaveBeenCalled();
    expect(flowSvc.onBack).not.toHaveBeenCalled();
  });

  it('should subscribe to back button when CONNECTION_SOURCE == APP and invoke onBack on callback', () => {
    environment.CONNECTION_SOURCE = 'APP';
    interface HandlerHolder { handler?: (ev?: unknown) => void }
    const handlerHolder: HandlerHolder = {};
    (window as any).subscribeBackButton = jest.fn((id: string, handler: (ev?: unknown) => void) => {
      handlerHolder.handler = handler;
    });

    createComponent();

    expect((window as any).subscribeBackButton).toHaveBeenCalledWith('backbtn', expect.any(Function));

    const zoneRunSpy = jest.spyOn(zone, 'run').mockImplementation((fn: () => void) => { fn(); return undefined as any; });

    if (handlerHolder.handler) {
      handlerHolder.handler({ some: 'payload' });
    }
    expect(zoneRunSpy).toHaveBeenCalled();
    expect(flowSvc.onBack).toHaveBeenCalledWith('DEVICE BACK');
  });
});
