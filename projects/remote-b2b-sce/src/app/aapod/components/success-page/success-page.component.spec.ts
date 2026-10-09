import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { SuccessPageComponent } from './success-page.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';

describe('SuccessPageComponent', () => {
  let component: SuccessPageComponent;
  let fixture: ComponentFixture<SuccessPageComponent>;
  let aaApiServiceMock: any;
  let aaFlowServiceMock: any;

  beforeEach(async () => {
    aaApiServiceMock = { aemCache: jest.fn() };
    aaFlowServiceMock = {
      formatResponseData: jest.fn(),
      getLanguageBasedAemUrl: jest.fn().mockReturnValue('http://mock-aem-url/success'),
      SCE_AEM: { SUCCESS: 'success' }
    };

    await TestBed.configureTestingModule({
      imports: [SuccessPageComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn(), dismiss: jest.fn() } },
        { provide: AaFlowService, useValue: aaFlowServiceMock },
        { provide: AaApiService, useValue: aaApiServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessPageComponent);
    component = fixture.componentInstance;
    // Note: do not call detectChanges here to avoid auto ngOnInit triggering; tests control it.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAem on init', () => {
    const spy = jest.spyOn(component, 'getAem').mockImplementation();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set aemData on successful API call', async () => {
    const mockCacheResponse = { data: 'mock-data' } as any;
    const formattedResponse = { content: { 'success-screen': { title: 'Test Success Screen' } } } as any;
    jest.spyOn(console, 'log').mockImplementation();

    aaApiServiceMock.aemCache.mockResolvedValue(mockCacheResponse);
    aaFlowServiceMock.formatResponseData.mockReturnValue(formattedResponse);

    await component.getAem();

    expect(aaApiServiceMock.aemCache).toHaveBeenCalled();
    expect(typeof aaApiServiceMock.aemCache.mock.calls[0][0]).toBe('string');
    expect(aaFlowServiceMock.formatResponseData).toHaveBeenCalledWith(mockCacheResponse);
    expect(component.aemData).toEqual({ title: 'Test Success Screen' });
  });

  it('should log error and keep aemData undefined when formatter returns falsy', async () => {
    const raw = { content: { 'success-screen': { title: 'Raw' } } } as any;
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    aaApiServiceMock.aemCache.mockResolvedValue(raw);
    aaFlowServiceMock.formatResponseData.mockReturnValue(undefined as any);

    await component.getAem();

    expect(logSpy).toHaveBeenCalledWith('Error fetching personal details aem ', expect.anything());
    expect(component.aemData).toBeUndefined();
    logSpy.mockRestore();
  });

  it('should handle API errors gracefully', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    aaApiServiceMock.aemCache.mockRejectedValue('API error');

    await component.getAem();

    expect(logSpy).toHaveBeenCalledWith('Error fetching personal details aem ', 'API error');
    logSpy.mockRestore();
  });

  it('should log error and leave aemData undefined when content or success-screen missing', async () => {
    const mockCacheResponse = { foo: 'bar' } as any;
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    aaApiServiceMock.aemCache.mockResolvedValue(mockCacheResponse);
    aaFlowServiceMock.formatResponseData.mockReturnValue({} as any);

    await component.getAem();

    expect(logSpy).toHaveBeenCalledWith('Error fetching personal details aem ', expect.anything());
    expect(component.aemData).toBeUndefined();
    logSpy.mockRestore();
  });

  it('detectChanges should trigger ngOnInit and call getAem', fakeAsync(() => {
    const spy = jest.spyOn(component, 'getAem').mockImplementation();
    // prepare successful path to avoid unhandled promise
    aaApiServiceMock.aemCache.mockReturnValue(Promise.resolve({ content: { 'success-screen': {} } } as any));
    aaFlowServiceMock.formatResponseData.mockReturnValue({ content: { 'success-screen': {} } } as any);

    fixture.detectChanges(); // triggers ngOnInit
    flushMicrotasks();

    expect(spy).toHaveBeenCalled();
  }));
});
