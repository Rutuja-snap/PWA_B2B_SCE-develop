import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { Component } from '@angular/core';

import { B2bIncomeVerificationComponent } from './b2b-income-verification.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AaApiService } from '../../services/aa-api.service';
import { AaFlowService } from '../../services/aa-flow.service';

// Stub for child component used in template
@Component({selector: 'app-success-page', template: '', standalone: true})
class SuccessPageComponent {}

// Create mock services
const mockAaFlowService = {
  SCE_AEM: { INCOME: 'income' },
  getLanguageBasedAemUrl: jest.fn().mockReturnValue('http://mock-aem-url/income'),
  formatResponseData: jest.fn().mockReturnValue({
    content: {
      'income-verification-completed': {
        'income-verification-title': { title: 'Test Income Screen', 'iconimage-android': 'test.png' },
        'what-next': { title: 'Next Steps' },
        'what-next-wrapper': { group: [ { title: 'Step1', description: 'Desc1' }, { title: 'Step2', description: 'Desc2' } ] }
      }
    }
  })
};

const mockAaApiService = {
  aemCache: jest.fn().mockReturnValue(Promise.resolve({ mock: 'data' }))
};

describe('B2bIncomeVerificationComponent', () => {
  let component: B2bIncomeVerificationComponent;
  let fixture: ComponentFixture<B2bIncomeVerificationComponent>;

  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(true)
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
         B2bIncomeVerificationComponent, 
         SuccessPageComponent,
         HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatSnackBar, useValue: { open: jest.fn(), dismiss: jest.fn() } },
        { provide: AaFlowService, useValue: mockAaFlowService },
        { provide: AaApiService, useValue: mockAaApiService }
      ]
    }).compileComponents();
    
    // Clear mocks before creating each fixture to ensure clean state
    mockAaApiService.aemCache.mockClear();
    mockAaFlowService.formatResponseData.mockClear();
    
    fixture = TestBed.createComponent(B2bIncomeVerificationComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockAaApiService.aemCache.mockReturnValue(Promise.resolve({ mock: 'data' }));
    mockAaApiService.aemCache.mockClear();
    mockAaFlowService.formatResponseData.mockReturnValue({
      content: {
        'income-verification-completed': {
          'income-verification-title': { title: 'Test Income Screen', 'iconimage-android': 'test.png' },
          'what-next': { title: 'Next Steps' },
          'what-next-wrapper': { group: [ { title: 'Step1', description: 'Desc1' }, { title: 'Step2', description: 'Desc2' } ] }
        }
      }
    });
    mockAaFlowService.formatResponseData.mockClear();
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    // Flush the 3s timeout scheduled in ngOnInit
    tick(3000);
    expect(component).toBeTruthy();
  }));

  it('should call getAem on init', fakeAsync(() => {
    const originalGetAem = component.getAem.bind(component);
    const spy = jest.spyOn(component, 'getAem').mockImplementation(() => originalGetAem());
    jest.spyOn(console, 'log').mockImplementation(() => {});
    fixture.detectChanges();
    flushMicrotasks();
    tick(3000);
    expect(spy).toHaveBeenCalled();
  }));

  it('should set aemData on successful API call', async () => {
    const mockCacheResponse = { data: 'mock' };
    const mockFormattedResponse = { content: { 'income-verification-completed': { 'income-verification-title': { title: 'Test Income Screen' } } } };
    mockAaApiService.aemCache.mockResolvedValue(mockCacheResponse);
    mockAaFlowService.formatResponseData.mockReturnValue(mockFormattedResponse);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await component.getAem();
    expect(mockAaApiService.aemCache).toHaveBeenCalled();
    expect(typeof mockAaApiService.aemCache.mock.calls[0][0]).toBe('string');
    expect(component.aemData).toBeDefined();
    expect(component.aemData['income-verification-title'].title).toEqual('Test Income Screen');
  });

  it('should handle API errors gracefully', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockAaApiService.aemCache.mockRejectedValue('API error');
    await component.getAem();
    expect(logSpy).toHaveBeenCalledWith('Error fetching income aem ', 'API error');
    logSpy.mockRestore();
  });

  it('should toggle successPage to false after 3 seconds', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    expect(component.successPage).toBe(true);
    tick(2999);
    expect(component.successPage).toBe(true);
    tick(1);
    expect(component.successPage).toBe(false);
  }));

  it('should call formatResponseData with API response', async () => {
    const apiPayload = { custom: 'resp' } as any;
    const mockFormattedResponse = { content: { 'income-verification-completed': {} } };
    mockAaApiService.aemCache.mockResolvedValue(apiPayload);
    mockAaFlowService.formatResponseData.mockReturnValue(mockFormattedResponse);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await component.getAem();
    expect(mockAaFlowService.formatResponseData).toHaveBeenCalledWith(apiPayload);
  });

  it('should handle exception thrown during formatting', async () => {
    const mockError = new Error('formatting failed');
    mockAaApiService.aemCache.mockResolvedValue({ data: 'test' });
    mockAaFlowService.formatResponseData.mockImplementation(() => { throw mockError; });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await component.getAem();
    expect(logSpy).toHaveBeenCalledWith('Error fetching income aem ', mockError);
    expect(component.aemData).toBeUndefined();
    logSpy.mockRestore();
  });
});
