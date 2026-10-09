import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { B2bSceToolbarComponent } from './b2b-sce-toolbar.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AaFlowService } from '../../services/aa-flow.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('B2bSceToolbarComponent', () => {
  let component: B2bSceToolbarComponent;
  let fixture: ComponentFixture<B2bSceToolbarComponent>;
  let routerStub: { url: string; navigate: jest.Mock };
  let flowSpy: any;

  beforeEach(() => {
    routerStub = { url: '/b2b-sce/pdp', navigate: jest.fn() } as any;
    flowSpy = { onBack: jest.fn() };

    TestBed.configureTestingModule({
      imports: [
        B2bSceToolbarComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn(), dismiss: jest.fn() } },
        { provide: Router, useValue: routerStub },
        { provide: AaFlowService, useValue: flowSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(B2bSceToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onBack should call flow service', () => {
    component.onBack();
    expect(flowSpy.onBack).toHaveBeenCalledWith('APP BACK');
  });

  it('getToolBarTitle should return Offer details when url has /offer', () => {
    routerStub.url = '/b2b-sce/offer/123';
    expect(component.getToolBarTitle()).toBe('b2b_sce.b2b_sce_toolbar.offerDetails');
  });

  it('getToolBarTitle should default to Check Eligibility', () => {
    routerStub.url = '/b2b-sce/pdp';
    expect(component.getToolBarTitle()).toBe('b2b_sce.b2b_sce_toolbar.accountAggregator');
  });

  it('showBack should return false when url includes excluded paths', () => {
    routerStub.url = '/b2b-sce/incomefail';
    expect(component.showBack()).toBe(false);
  });

  it('showBack should return true otherwise', () => {
    routerStub.url = '/b2b-sce/pdp';
    expect(component.showBack()).toBe(true);
  });

  it('showCrossIcon should be true for success or income endings', () => {
    routerStub.url = '/b2b-sce/some/path/success';
    expect(component.showCrossIcon()).toBe(true);
    routerStub.url = '/b2b-sce/some/path/income';
    expect(component.showCrossIcon()).toBe(true);
  });

  it('showCrossIcon should be false otherwise', () => {
    routerStub.url = '/b2b-sce/pdp';
    expect(component.showCrossIcon()).toBe(false);
  });

  it('onRedirect should navigate to pdp', () => {
    component.onRedirect();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/', 'b2b-sce', 'pdp']);
  });

  describe('dynamic title/back/cross combinations', () => {
    it('should show Offer details title when /offer route and hide cross', () => {
      routerStub.url = '/b2b-sce/offer/xyz';
      expect(component.getToolBarTitle()).toBe('b2b_sce.b2b_sce_toolbar.offerDetails');
      expect(component.showCrossIcon()).toBe(false);
    });
    it('should show back and not cross for /pdp', () => {
      routerStub.url = '/b2b-sce/pdp';
      expect(component.showBack()).toBe(true);
      expect(component.showCrossIcon()).toBe(false);
    });
    it('should show cross icon for urls ending with /income and keep title default', () => {
      routerStub.url = '/b2b-sce/path/income';
      expect(component.getToolBarTitle()).toBe('b2b_sce.b2b_sce_toolbar.accountAggregator');
      expect(component.showCrossIcon()).toBe(true);
    });
  });
});
