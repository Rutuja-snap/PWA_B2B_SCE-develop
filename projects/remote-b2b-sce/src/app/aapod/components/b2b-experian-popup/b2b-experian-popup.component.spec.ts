import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { B2bExperianPopupComponent } from './b2b-experian-popup.component';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConnectionMgrService } from 'lib-api';
import { AaFlowService } from '../../services/aa-flow.service';
import { AaApiService } from '../../services/aa-api.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';
import { ParentDataServices } from '../../services/parentData.service';
import { ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';


const mockBottomSheetRef = {
  dismiss: jest.fn()
};

const mockDialog = {};
const mockParentStorage = {
  userInfo: { mobileNo: '9999999999' }
};

const mockAaApiService = {
  callExperianApi: jest.fn(),
  aemCache: jest.fn().mockResolvedValue({})
};

const mockAaFlowService = {
  sceFormData: {},
  cleverTapInsert: jest.fn(),
  getAemData: jest.fn().mockReturnValue(of({})),
  getLanguageBasedAemUrl: jest.fn().mockReturnValue('mocked-experian-url'),
  formatResponseData: jest.fn().mockReturnValue({
    content: [
      {
        screenIdentifier: 'experian',
        screenContent: [
          {
            'select-an-option-wrapper':{
              fields: [
                {},
                { title: 'Full Name on PAN Card' }, 
                {},
                {},
                {
                  key: 'button-section',
                  ctalabel1: "Show more",
                  ctalabel2: "Show less",
                  'event-prop-value-1': 'Show more',
                  'event-prop-value-2': 'Show less'
                }
              ]
          }
          }
        ]
      }
    ]
  })
};

const mockConnectionMgrService = {
  getMobileNumber: () => JSON.stringify('9999999999')
};


describe('B2bExperianPopupComponent', () => {
  let component: B2bExperianPopupComponent;
  let fixture: ComponentFixture<B2bExperianPopupComponent>;
  let originalFormatResponseData: any;

  beforeEach(() => {
    originalFormatResponseData = mockAaFlowService.formatResponseData();
    TestBed.configureTestingModule({
      imports: [
        B2bExperianPopupComponent,
        ReactiveFormsModule, 
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ParentDataServices, useValue: mockParentStorage },
        { provide: AaApiService, useValue: mockAaApiService },
        { provide: AaFlowService, useValue: mockAaFlowService },
        { provide: ConnectionMgrService, useValue: mockConnectionMgrService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(B2bExperianPopupComponent);
    component = fixture.componentInstance;
    
    // Initialize aemData with proper structure before detectChanges
    component.aemData = {
      'select-an-option-wrapper': {
        'form-heading': 'Verify Your Identity',
        fields: [
          { 'field-label-main': '', 'field-description': '' },
          { title: 'Full Name on PAN Card' },
          { title: '', description: '' },
          { 'iconimage-android': '', icontitle: '' },
          {
            key: 'button-section',
            ctalabel1: 'Show more',
            ctalabel2: 'Show less',
            'event-prop-value-1': 'Show more',
            'event-prop-value-2': 'Show less'
          },
          { title: 'Enter details manually' }
        ]
      },
      'continue-btn': {
        'multi-cta-set': [
          { ctaLabel: 'Continue', 'event-prop-value': 'CONTINUE' }
        ]
      }
    };

    fixture.detectChanges();
  });

  afterEach(() => {
    // Restore mock to original value to prevent tests from affecting each other
    (mockAaFlowService.formatResponseData as jest.Mock).mockReturnValue(originalFormatResponseData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cleverTapInsert on init', () => {
    component.ngOnInit();
    expect(mockAaFlowService.cleverTapInsert).toHaveBeenCalled();
  });

  it('should set selected value on radio change', () => {
    component.onChange('autofetch');
    expect(component.selectedValue).toBe('autofetch');
  });

  it('should toggle expanded section on setExpanded', () => {  
    const mockData = mockAaFlowService.formatResponseData();
    component.aemData = mockData.content.find(c => c.screenIdentifier === 'experian').screenContent[0];
    // Ensure the test data matches the component's expected values
    component.aemData['select-an-option-wrapper']['fields'][4]['ctalabel1'] = 'Show more';
    component.aemData['select-an-option-wrapper']['fields'][4]['ctalabel2'] = 'Show less';
    component.expanded = 'close';
    component.seeMore = false; 
    // component.aemData = mockAaFlowService.formatResponseData().content.experian;
    // component.toggle_label = 'Show more';
    component.toggle_label = component.aemData['select-an-option-wrapper']['fields'][4]['ctalabel1'];
    component.setExpanded();
    expect(component.expanded).toBe('open');
    expect(component.toggle_label).toBe('Show less');
  });

  it('should generate experianRequest correctly', () => {
    component.fullname.setValue('John Doe');
    const result = component.getExperianRequest();
    expect(result.firstName).toBe('John');
    expect(result.surName).toBe('Doe');
    expect(result.mobilePhone).toBe('9999999999');
  });

  it('should call API and handle success response', () => {
    const mockRes = { statusCode: '7001' };
    mockAaApiService.callExperianApi.mockReturnValue(of(mockRes));
    const req = component.getExperianRequest();
    component.callApi(req);
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({ event: 'success', data: mockRes });
  });

  it('should handle API error response', () => {
    mockAaApiService.callExperianApi.mockReturnValue(throwError(() => new Error('error')));
    const req = component.getExperianRequest();
    component.callApi(req);
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({ event: 'notfound' });
  });

  it('should continue with autofetch and valid full name', () => {
    component.selectedValue = 'autofetch';
    component.fullname.setValue('John Doe');
    mockAaApiService.callExperianApi.mockReturnValue(of({ statusCode: '7001' }));
    component.continueClicked();
    expect(mockAaApiService.callExperianApi).toHaveBeenCalled();
  });

  it('should show error if no radio is selected', () => {
    component.aemData = mockAaFlowService.formatResponseData().content.experian; 
    component.selectedValue = '';
    fixture.detectChanges();
    component.continueClicked();
    expect(component.ctaErrormssg).toBe('b2b_sce.b2b_experian_popup.selectOptionErrMsg');
  });

  it('should erase field and focus', fakeAsync(() => {
    const input = document.createElement('input');
    input.id = 'test-input';
    const event = { target: { previousElementSibling: input } };
    input.setAttribute('id', 'test-input');
    (component as any).elementRef.nativeElement.appendChild(input);
    component.eraseField('fullname', event);
    tick();
    expect(component.fullname.value).toBe('');
  }));

  it('should toggle expanded section to close', () => {
    const mockData = mockAaFlowService.formatResponseData();
    component.aemData = mockData.content.find(c => c.screenIdentifier === 'experian').screenContent[0];
    component.aemData['select-an-option-wrapper']['fields'][4]['ctalabel1'] = 'Show more';
    component.aemData['select-an-option-wrapper']['fields'][4]['ctalabel2'] = 'Show less';
    component.expanded = 'open';
    component.seeMore = true;
    // component.toggle_label = 'Show less';
    component.toggle_label = component.aemData['select-an-option-wrapper']['fields'][4]['ctalabel2'];

    
    // component.aemData = mockAaFlowService.formatResponseData().content.experian;
    

    component.setExpanded();
    expect(component.expanded).toBe('close');
    expect(component.toggle_label).toBe('Show more');
  });

  it('setExpanded should handle error when toggle_label undefined (catch path)', () => {
    component.toggle_label = undefined as any;
    component.expanded = 'close';
    component.setExpanded();
    expect(component.expanded).toBe('close'); // unchanged due to error
  });

  it('closeExpansion should dismiss with close event', () => {
    mockBottomSheetRef.dismiss.mockClear();
    component.closeExpansion('CLOSE');
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({event:'close'});
  });

  it('closeExpansion should handle error from cleverTapClick', () => {
    mockBottomSheetRef.dismiss.mockClear();
    const original = (component as any).cleverTapClick;
    (component as any).cleverTapClick = () => { throw new Error('boom'); };
    expect(() => component.closeExpansion('ERR')).not.toThrow();
    expect(mockBottomSheetRef.dismiss).not.toHaveBeenCalled();
    ;(component as any).cleverTapClick = original;
  });

  it('getExperianRequest should handle single name and APP channel', () => {
    const prev = environment.CONNECTION_SOURCE;
    environment.CONNECTION_SOURCE = 'APP';
    component.fullname.setValue('Prince');
    const req = component.getExperianRequest();
    expect(req.firstName).toBe('Prince');
    expect(req.surName).toBe('');
    expect(req.channel).toBe('App');
    environment.CONNECTION_SOURCE = prev;
  });

  it('handleKeydown should trigger setExpanded on Enter and Space', () => {
    const spy = jest.spyOn(component, 'setExpanded');
    component.handleKeydown({ key: 'Enter' } as any);
    component.handleKeydown({ key: ' ' } as any);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('callApi should dismiss notfound on non 7001 status code', () => {
    mockBottomSheetRef.dismiss.mockClear();
    mockAaApiService.callExperianApi.mockReturnValue(of({ statusCode: '1234' }));
    const req = { firstName: 'A', surName: 'B' } as any;
    component.callApi(req);
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalledWith({event:'notfound'});
  });

  it('callApi should set sceFormData.customerName even when names empty', () => {
    mockAaApiService.callExperianApi.mockReturnValue(of({ statusCode: '7001' }));
    const req = { firstName: '', surName: '' } as any;
    mockBottomSheetRef.dismiss.mockClear();
    component.callApi(req);
    const nameVal = (mockAaFlowService.sceFormData as any).customerName;
    expect(nameVal).toBeDefined();
  });

  it('continueClicked manually path should dismiss bottom sheet', () => {
    mockBottomSheetRef.dismiss.mockClear();
    component.selectedValue = 'manually';
    component.continueClicked();
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
  });

  it('continueClicked autofetch invalid should not call API', () => {
    component.selectedValue = 'autofetch';
    component.fullname.setValue('');
    mockAaApiService.callExperianApi.mockClear();
    component.continueClicked();
    expect(component.fullname.touched).toBeTrue();
    expect(mockAaApiService.callExperianApi).not.toHaveBeenCalled();
  });

  it('continueClicked should catch errors from cleverTapClick', () => {
    const original = (component as any).cleverTapClick;
    (component as any).cleverTapClick = () => { throw new Error('tap fail'); };
    component.selectedValue = 'manually';
    expect(() => component.continueClicked()).not.toThrow();
    (component as any).cleverTapClick = original;
  });

  it('getAemData should populate toggle_label on success', async () => {
    // stub to return structure expected by component implementation
    const spy = mockAaFlowService.formatResponseData as jest.Mock;
    const originalVal = spy();
    spy.mockReturnValue({
      content: {
        experian: {
          'select-an-option-wrapper': {
            fields: [ {}, {}, {}, {}, { ctalabel1: 'Show more', ctalabel2: 'Show less' } ]
          }
        }
      }
    });
    component.aemData = undefined;
    component.toggle_label = undefined as any;
    await component.getAemData();
    expect(component.toggle_label).toBe('Show more');
    // restore
    spy.mockReturnValue(originalVal);
  });

  it('getAemData should handle error thrown by formatResponseData', () => {
    const spy = mockAaFlowService.formatResponseData as jest.Mock;
    const originalReturn = spy(); // capture original structured value
    spy.mockImplementation(() => { throw new Error('format fail'); });
    expect(() => component.getAemData()).not.toThrow();
    // restore
    spy.mockReturnValue(originalReturn);
  });

  it('cleverTapClick should send correct event (private method)', () => {
    mockAaFlowService.cleverTapInsert.mockClear();
    (component as any).cleverTapClick('TESTCTA');
    const callArg = mockAaFlowService.cleverTapInsert.mock.calls.at(-1)[0];
    expect(callArg.eventName).toBe('STANDALONE_ELIGIBILITY_CLICKED');
    expect(callArg.props.EP_CTA).toBe('TESTCTA');
  });

  it('handleKeydown should NOT trigger setExpanded for other keys', () => {
    const spy = jest.spyOn(component, 'setExpanded');
    component.handleKeydown({ key: 'Escape' } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('eraseField should safely handle non-input previous sibling', fakeAsync(() => {
    const div = document.createElement('div');
    const event = { target: { previousElementSibling: div } };
    component.fullname.setValue('Some Name');
    component.eraseField('fullname', event);
    tick();
    expect(component.fullname.value).toBe('');
  }));

  it('getExperianRequest should trim multiple spaces in full name', () => {
    component.fullname.setValue('  John   Middle   Doe  ');
    const req = component.getExperianRequest();
    expect(req.firstName).toBe('John');
    expect(req.surName.replace(/\s+/g,' ').trim()).toBe('Middle Doe');
  });

  it('cleverTapClick should handle error thrown by cleverTapInsert gracefully', () => {
    const original = mockAaFlowService.cleverTapInsert;
    (mockAaFlowService as any).cleverTapInsert = jest.fn(() => { throw new Error('ct fail'); });
    expect(()=> (component as any).cleverTapClick('ERRCTA')).not.toThrow();
    mockAaFlowService.cleverTapInsert = original;
  });

});
