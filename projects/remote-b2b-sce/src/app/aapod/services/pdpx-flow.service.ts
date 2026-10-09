import { Injectable } from '@angular/core';
import { BROKER, CartConfig, CartItem, DemogDetails, OfferConfig, OfferJson, UTMs } from '../model/flow.model';
import { IdentifiedSubject } from '../model/identified.subject';
import { CustomerTag, ParsedMinMax, relation__card, relation__deposit, relation__insurance, relation__loan, relations__collection, Segment } from '../model/api.model';
import { Filterer, MODULE, Result } from '../model/helper.model';
import { AddonProduct, InfoRender } from '../model/render.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParentDataServices } from './parentData.service';
import { environment } from 'projects/remote-b2b-sce/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdpxFlowService {
  // flow stores the  current data and config of the user
  currentDialogRef:any;
  footer_enabled: boolean = true
  ENV: 'APP' | 'WEB';
  __reward_shown: boolean = false;

  CONFIG: MODULE;


  cust: PdpxCust = {

    AUTH: false,

    // all the application data > specific to the module 
    appdata: {},
    appState: "SKU",

    _csrf: "",
    sku_list: [],

    // routeStack: [],
    routeStack: [],
    override__back_nav$: []
  }

  constructor(
    private dialog: MatDialog,
    public parentStorage: ParentDataServices,
   
  ) {
    this.ENV = environment.CONNECTION_SOURCE === 'APP' ? 'APP' : 'WEB';
  }

  isOffered() {
    if (
      this.cust.isOffer
      && this.cust.offer
      && this.cust.offer?.__is_applied
    ) {

      // cannot base this on STATE > as it can be offered in CART case as well
      return true
    }
    else {
      return false
    }

  }

  openErrorPopup(render: InfoRender = null) {
    // we need to create one 
    if (render === null) {
      render = {
        title: "Error",
        description: "please try again!",
        cta: {
          label: "Okay"
        },
        background:{
          link:"https://ip-dynbanners.bajajfinserv.in/3in1Mobile/assets/images/err_fail.png"
        },

      }
    }
    // return this.openDialog(InfoPopupComponent, render)
  }

  openDialog(component: any, dialog_data?: any, disableclose: boolean = false, __override_back: boolean = true): MatDialogRef<any> {

    this.footer_enabled = false


    const dialog$ = this.dialog.open(component, {
      disableClose: disableclose,
      data: dialog_data,
      panelClass: this.parentStorage.deviceOS === 'ios' ? 'pdpx_dialog_panel_class_ios' : 'pdpx_dialog_panel_class_android',
    });

    if (__override_back) {
      const back$ = this.overrideBackPress(() => {
        dialog$.close()
        console.log("pdpx/openDialog/__override_back/>close")
      })

      dialog$.afterClosed().subscribe(() => {
        this.clearOverrideBackPress(back$.key)
        this.footer_enabled = true
        this.currentDialogRef = undefined
      })

      // test click backBtn 
      // timer(2000).subscribe(x => {
      //   this.onBack()
      // })
    }

    this.currentDialogRef = dialog$
    return dialog$
  }


  overrideBackPress(cb: any = null, key: string = null, source: string = "") {
    if (!this.cust.override__back_nav$) {
      this.cust.override__back_nav$ = []
    }

    if (!key) {
      key = this.getUnqId("override__back__")
    }

    // override the back press and event will be sent to this 
    const new$ = new IdentifiedSubject<string>(key, source);
    this.cust.override__back_nav$.push(new$);

    if (cb) {
      const _s = new$.subject.subscribe(() => {
        this.clearOverrideBackPress(key)
        cb()
        _s.unsubscribe()
      })
    }
    console.log("pdpx/flow/onBack/override")
    return new$;
  }

  getUnqId(prefix: string = "") {
    return prefix + (new Date().getTime().toString())
  }

  clearOverrideBackPress(key: string = null) {
    if (!key) {
      // clear all 
      if (this.cust.override__back_nav$?.length) {
        this.cust.override__back_nav$.forEach(x => {
          x?.subject?.complete();
        })

        this.cust.override__back_nav$ = []
      }
    }
    else {
      const found = this.cust.override__back_nav$.findIndex(x => x.key === key)
      if (found !== -1) {
        const overr = this.cust.override__back_nav$[found]
        overr?.subject?.complete();
        //remove it from the array 
        this.cust.override__back_nav$.splice(found, 1);
      }
    }

    console.log("pdpx/flow/onBack/clear_override", key, this.cust.override__back_nav$)
  }
  


}



export type PdpxCust = {

  // INFO 
  mobileNumber?: string;
  custFlag?: "NTB" | "ETB" | "PTB";
  custType?: string;
  custId?: string;
  cust_prospect_id?: string;
  rekyc?:string;

  moduleCode?: string;
  productCode?: string;
  subProductCode?: string;

  productCode__is_selected?: boolean;
  subProductCode__is_selected?: boolean;

  journeyCode?: string;
  journeyName?: string;



  gcdData?: DemogDetails;

  is_customertags_loaded?: boolean;
  customerTags?: CustomerTag[];
  moduleCustomerTags?: CustomerTag[];

  isOffer?: boolean;
  offer?: OfferJson;

  isSegment?: boolean;
  matchedSegment?: Segment;
  segment?: Segment;

  isFromCart?: boolean;
  cartItem?: CartItem;
  moduleCartItems?: CartItem[];
  allCartItems?: CartItem[];

  isRelation?: boolean;
  all_relations?: relations__collection;
  module_relations?: (relation__loan | relation__card | relation__deposit | relation__insurance)[];


  // APPLICATION DATA 
  appdata?: appData;
  __callback_requested?: boolean;


  appState?: 'CART' | 'OFFER' | 'SKU';


  // STATES 
  AUTH?: boolean;

  is_sku_list_loaded?: boolean;
  is_filters_loaded?: boolean;

  is_demog_loaded?: boolean;

  // if offers loaded + filtered offered 
  is_offers_loaded?: boolean;
  is_segments_loaded?: boolean;

  // if offers api is called and list loaded 
  is_offers_list_loaded?: boolean;

  is_cart_loaded?: boolean;
  is_relation_loaded?: boolean;
  is_addons_loaded?: boolean;

  // API RESPONSES

  // offers 
  offers?: OfferJson[];
  module_offers?: OfferJson[];
  segments?: Segment[];
  // addons > from addonProduct api  
  addons?: AddonProduct[];

  offer_sku?: Result;
  sku_list?: Result[];
  icors_sku_list?: Result[];
  sku_count?: number;
  max_sku_count?: number;
  // selected SKU > SKU selected in PLP (only)
  selected_sku?: Result;

  // current_sku > based on this > pdp will load  
  current_sku?: Result;
  saved_sku?: Result;
  is_current_sku_loaded?: boolean;
  is_default_sku?: boolean;

  filters?: Filterer[];
  // filters__is_default_filters_included?: boolean;

  // INPUTS 


  // HELPERS
  _csrf?: string;

  // store 
  store?: {
    minmax?: ParsedMinMax;

    [key: string]: any;
  }

  // helpers 
  routeStack: string[];
  // override__back_nav$?: { [key: string]: Subject<string> };
  override__back_nav$?: IdentifiedSubject<string>[];


  // modes 
  MODE__ONLY_RESUME?: boolean;

  nativeQueryParams?: any;
  utms?: UTMs;
  broker?:BROKER;

}


export type appData = {
  id?: string;

  __use_id_for_insert?: boolean;

  cart__config?: CartConfig;
  offer__config?: OfferConfig;

  // depends upon the module 
  [key: string]: any;
}
