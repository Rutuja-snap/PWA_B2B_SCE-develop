import { Component, Inject, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-dropdown-dialog',
  templateUrl: './dropdown-dialog.component.html',
  styleUrls: ['./dropdown-dialog.component.scss'],
  standalone: true,
  imports: [
    NgClass, 
    NgFor
  ]
})
export class DropdownDialogComponent implements OnInit, OnDestroy {
  dialogdata: any;
  items: any[] = [];
  status = false;
  selectedValue: any;
  highlightOption = '';
  selectedCity: any;
  info: any;

  constructor(private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2) {
    this.dialogdata = data;
    console.log("--------this.dialog data-------------", this.dialogdata)
  }

  ngOnInit(): void {
    // Add class to hide mat error of input field if dropdown popup is open and value is not selected
    this.renderer.addClass(document.body, 'hide-mat-error');
  }

  closeDialog(selectedData) {
    this.selectedCity = selectedData
    const finalData = {
      selectedValue: selectedData
    };
    this.dialogRef.close(finalData);
  }

  ngOnDestroy(): void {
    // Remove class to show mat error for input field if dropdown popup is closed and value is not selected
    this.renderer.removeClass(document.body, 'hide-mat-error');
  }


}
