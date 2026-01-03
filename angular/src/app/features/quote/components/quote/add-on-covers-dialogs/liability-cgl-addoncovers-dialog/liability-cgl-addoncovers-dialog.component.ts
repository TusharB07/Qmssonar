import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov } from 'src/app/app.model';
import { LIABILITY_COVERS_OPTIONS, LIABILITY_PERIOD_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { IQuoteSlip, liabiltyCGLAddOnCovers } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-liability-cgl-addoncovers-dialog',
  templateUrl: './liability-cgl-addoncovers-dialog.component.html',
  styleUrls: ['./liability-cgl-addoncovers-dialog.component.scss']
})
export class LiabilityCGLAddoncoversDialogComponent implements OnInit {
  covers: any[] = [];
  listCover: any[] = [];
  searchedText: string = ''
  quote: IQuoteSlip;
  quoteCGLOptions: any
  optionCovers: ILov[] = [];
  optionPeriodCovers: ILov[] = [];
  selectedCovers: number = 0
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef, private liabilityCGLTemplateService: liabilityCGLTemplateService, private messageService: MessageService
  ) {
    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.optionPeriodCovers = LIABILITY_PERIOD_COVERS_OPTIONS;
    this.covers = this.config.data?.covers;
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));

    this.listCover = this.covers;
    this.quote = this.config.data.quote;
    this.quoteCGLOptions = this.config.data.quoteCGLOptions
  }


  ngOnInit(): void {
  }
  closeModal() {
    this.quoteCGLOptions.liabiltyCovers = this.covers
    this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
      next: quote => {
        console.log("CGL Covers saved Successfully");
      },
      error: error => {
        console.log(error);
      }
    });
    this.selectedCovers = this.covers.filter(x => x.isSelected == true).length

    this.ref.close(this.selectedCovers);
  }
  cancel() {
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    this.selectedCovers = this.covers.filter(x => x.isSelected == true).length
    this.covers.forEach(cover => {
      if (cover.optionSelected === "") {
        cover.isSelected = false;
      }
    });
    this.covers = [...this.covers]
    this.ref.close(this.selectedCovers);
  }

  onDropdownChange(rowData: any): void {
    rowData.isSelected = true;
  }

  saveModal() {
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    let checkedData = this.covers.filter(x => x.isSelected == true)
    let checkedDuplicate = this.covers.filter((cover, index, array) =>
      array.filter(c => c.name === cover.name).length > 1
    );
    if (checkedDuplicate.length > 1) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Duplicate name of covers are not allowed`,
        detail: ``
      });
      return
    }
    if (checkedData.some(x => x.optionSelected == "" || x.name == "")) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Select all options of checked covers`,
        detail: `Select all options of checked covers`
      });
      this.covers.forEach(cover => {
        if (cover.optionSelected === "") {
          cover.isSelected = false;
        }
      });
      this.covers = [...this.covers]
      return;     
    }

    this.quoteCGLOptions.liabiltyCovers = this.covers
    this.quoteCGLOptions.liabiltyCovers = this.quoteCGLOptions.liabiltyCovers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));

    this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
      next: quote => {
        this.selectedCovers = this.covers.filter(x => x.isSelected == true).length

        this.ref.close(this.selectedCovers);
        console.log("CGL Covers saved Successfully");
      },
      error: error => {
        console.log(error);
      }
    });
    this.selectedCovers = this.covers.filter(x => x.isSelected == true).length

    this.ref.close(this.selectedCovers);
  }
  onCheckboxChange(data, event) {
    data.optionSelected = ""
    data.description = ""
  }

  // onOptionChange(data) {
  //   if (data.optionSelected != 'Covered') {
  //     data.description = ""
  //   }
  // }

  addmoreAddOns() {
    let addOnsDetails = new liabiltyCGLAddOnCovers();
    addOnsDetails.isExternal = true;

    const externalCovers = this.covers.filter(cover => cover.isExternal);
    const lastRecord = externalCovers.pop();

    let externalAddonsId = 0;
    if (lastRecord) {
      externalAddonsId = (+lastRecord.id) + 1;;
    }
    else {
      externalAddonsId = 1;
    }
    addOnsDetails.id = externalAddonsId.toString();
    this.covers.push(addOnsDetails)
  }

  deleteAddOnsCovers(id) {
    this.covers = this.covers.filter(cover => cover.id != id);
  }
}
