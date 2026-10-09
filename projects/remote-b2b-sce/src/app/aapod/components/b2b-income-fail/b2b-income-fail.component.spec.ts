import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bIncomeFailComponent } from './b2b-income-fail.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AaApiService } from '../../services/aa-api.service';
import { AaFlowService } from '../../services/aa-flow.service';
import { Router } from '@angular/router';

// Create mock services
const mockAaFlowService = {
  SCE_AEM: { ERROR: 'error' },
  getLanguageBasedAemUrl: jest.fn().mockReturnValue('http://mock-aem-url/error'),
  formatResponseData: jest.fn().mockReturnValue({
    content: {
      'error-screen': { title: 'Test Error Screen' }
    }
  })
};

const mockAaApiService = {
  aemCache: jest.fn().mockReturnValue(Promise.resolve({ mock: 'data' }))
};

const mockRouter = { navigate: jest.fn().mockReturnValue(Promise.resolve(true)) } as any;

describe('B2bIncomeFailComponent', () => {
  let component: B2bIncomeFailComponent;
  let fixture: ComponentFixture<B2bIncomeFailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        B2bIncomeFailComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn(), dismiss: jest.fn() }},
        { provide: AaFlowService, useValue: mockAaFlowService },
        { provide: AaApiService, useValue: mockAaApiService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(B2bIncomeFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAem on init', async () => {
    await component.ngOnInit();
    // assert that aemCache called implying getAem executed
    expect(mockAaApiService.aemCache).toHaveBeenCalled();
  });

  it('should set aemData on successful API call', async () => {
    const mockCacheResponse = { mock: 'data' } as any;
    mockAaApiService.aemCache.mockResolvedValue(mockCacheResponse);
    mockAaFlowService.formatResponseData.mockReturnValue({
      content: { 'error-screen': { title: 'Test Error Screen' } }
    });

    await component.getAem();

    expect(mockAaApiService.aemCache).toHaveBeenCalled();
    expect(typeof mockAaApiService.aemCache.mock.calls[0][0]).toBe('string');
    expect(mockAaFlowService.formatResponseData).toHaveBeenCalledWith(mockCacheResponse);
    expect(component.aemData).toEqual({ title: 'Test Error Screen' });
  });

  it('should handle API errors gracefully', async () => {
    mockAaApiService.aemCache.mockRejectedValue('API error');
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await component.getAem();
    expect(logSpy).toHaveBeenCalledWith(
      'Error fetching error aem ',
      'API error'
    );
    logSpy.mockRestore();
  });

  it('should log actual and formatted json on success', async () => {
    const clog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockAaApiService.aemCache.mockResolvedValue({ ok: true });
    mockAaFlowService.formatResponseData.mockReturnValue({
      content: { 'error-screen': { title: 'Logged Screen' } }
    });
    await component.getAem();
    expect(clog).toHaveBeenCalledWith('actual json', { ok: true });
    expect(clog).toHaveBeenCalledWith('formatted json', { title: 'Logged Screen' });
    expect(component.aemData).toEqual({ title: 'Logged Screen' });
    clog.mockRestore();
  });

  it('onRetry should navigate to pdp route', () => {
    component.onRetry();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'b2b-sce', 'pdp']);
  });

  it('should catch synchronous formatResponseData error', async () => {
    component.aemData = undefined;
    mockAaApiService.aemCache.mockResolvedValue({ some: 'data' });
    mockAaFlowService.formatResponseData.mockImplementation(() => { throw new Error('format fail'); });
    const clog = jest.spyOn(console, 'log').mockImplementation(() => {});
    await component.getAem();
    const errorLogged = clog.mock.calls.some(args => args[0] === 'Error fetching error aem ' && /format fail/.test(String(args[1])));
    expect(errorLogged).toBe(true);
    expect(component.aemData).toBeUndefined();
    clog.mockRestore();
  });

  it('should handle malformed formatted response object (missing keys) gracefully', async () => {
    mockAaApiService.aemCache.mockResolvedValue({ some: 'data' });
    mockAaFlowService.formatResponseData.mockReturnValue({});
    const clog = jest.spyOn(console, 'log').mockImplementation(() => {});
    await component.getAem();
    const malformedLogged = clog.mock.calls.some(args => args[0] === 'Error fetching error aem ');
    expect(malformedLogged).toBe(true);
    expect(component.aemData).toBeUndefined();
    clog.mockRestore();
  });
});
