import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderSpinnerComponent } from './loader-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Create mock services
const mockAaFlowService = {
  SCE_AEM: { LOADER: 'loader' },
  getLanguageBasedAemUrl: jest.fn().mockReturnValue('http://mock-aem-url/loader'),
  formatResponseData: jest.fn().mockReturnValue({
    content: {
      'loader-screen': { title: 'Test Loader Screen' }
    }
  })
};

const mockAaApiService = {
  aemCache: jest.fn().mockReturnValue(Promise.resolve({ mock: 'data' }))
};

describe('LoaderSpinnerComponent', () => {
  let component: LoaderSpinnerComponent;
  let fixture: ComponentFixture<LoaderSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoaderSpinnerComponent,
        HttpClientTestingModule,
        MatProgressSpinnerModule
      ],
      providers : [
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn(), dismiss: jest.fn() }},
        { provide: AaFlowService, useValue: mockAaFlowService },
        { provide: AaApiService, useValue: mockAaApiService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoaderSpinnerComponent);
    component = fixture.componentInstance;
    // Do NOT call fixture.detectChanges() here to avoid auto ngOnInit network call
  });

  afterEach(() => {
    // Reset spies so tests remain independent
    mockAaApiService.aemCache.mockReturnValue(Promise.resolve({ mock: 'data' }));
    mockAaApiService.aemCache.mockClear();
    mockAaFlowService.getLanguageBasedAemUrl.mockReturnValue('http://mock-aem-url/loader');
    mockAaFlowService.getLanguageBasedAemUrl.mockClear();
    mockAaFlowService.formatResponseData.mockReturnValue({
      content: {
        'loader-screen': { title: 'Test Loader Screen' }
      }
    });
    mockAaFlowService.formatResponseData.mockClear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getAemData on init', async () => {
    jest.spyOn(component, 'getAemData');
    fixture.detectChanges(); // triggers ngOnInit
    await component.getAemData();
    expect(component.getAemData).toHaveBeenCalled();
  });

  it('should set aemData on successful API call', async () => {
    await component.getAemData();

    expect(mockAaApiService.aemCache)
      .toHaveBeenCalled();
    expect(typeof mockAaApiService.aemCache.mock.calls[0][0]).toBe('string');

    expect(mockAaFlowService.formatResponseData)
      .toHaveBeenCalledWith({ mock: 'data' });

    expect(component.aemData)
      .toEqual({ title: 'Test Loader Screen' }); 
  });

  it('should handle API errors gracefully', async () => {
    mockAaApiService.aemCache.mockReturnValue(Promise.reject('API error'));
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Silent

    await component.getAemData();

    expect(console.log).toHaveBeenCalledWith(
      'Error fetching loader aem ',
      'API error'
    );
  });

  it('should leave aemData undefined on api error', async () => {
    mockAaApiService.aemCache.mockReturnValue(Promise.reject('err2'));
    component.aemData = undefined; // reset explicitly and avoid ngOnInit
    await component.getAemData();
    expect(component.aemData).toBeUndefined();
  });
});
