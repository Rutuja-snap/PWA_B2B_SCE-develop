import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-b2b-tooltips',
  templateUrl: './b2b-tooltips.component.html',
  styleUrls: ['./b2b-tooltips.component.scss'],
  standalone: true,
  imports: [
    NgIf
  ]
})
export class B2bTooltipsComponent implements OnInit {

  
  selectedFields: string[] = [];
  displayPopupDataObj: any;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) data: any, private _bottomSheetRef: MatBottomSheetRef) { 
    this.displayPopupDataObj = data;
    console.log("this.displayPopupDataObj==========================",this.displayPopupDataObj);
  }

  ngOnInit(): void {
    this.displayPopupDataObj.prevloanSelected?.forEach((field) => {
      this.selectedFields.push(field);
    });
  }
    

  gotIt_Clicked(value: string, CTA: string) {
    const finalData = {
      selectedValue: this.selectedFields
    };
    this._bottomSheetRef.dismiss(finalData);
    console.log("value, CTA==========================",value, CTA);
  }
}

