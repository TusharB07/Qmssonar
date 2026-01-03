import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov } from 'src/app/app.model';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { IQuoteSlip, liabiltyEandOAddOnCovers } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-liability-eando-addoncovers-dialog',
  templateUrl: './liability-eando-addoncovers-dialog.component.html',
  styleUrls: ['./liability-eando-addoncovers-dialog.component.scss']
})
export class LiabilityEandOAddoncoversDialogComponent implements OnInit {
  covers: any[] = [];
  listCover: any[] = [];
  searchedText: string = ''
  quote: IQuoteSlip;
  quoteEandOOptions: any
  optionCovers: ILov[] = [];
  selectedCovers: number = 0
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef, private liabilityEandOTemplateService: liabilityEandOTemplateService, private messageService: MessageService
  ) {
    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.covers = this.config.data?.covers;
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));

    this.listCover = this.covers;
    this.quote = this.config.data.quote;
    this.quoteEandOOptions = this.config.data.quoteEandOOptions
  }


  ngOnInit(): void {
  }
  closeModal() {
    this.quoteEandOOptions.liabiltyCovers = this.covers
    this.liabilityEandOTemplateService.updateArray(this.quoteEandOOptions._id, this.quoteEandOOptions).subscribe({
      next: quote => {
        console.log("E&O Covers saved Successfully");
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

    this.quoteEandOOptions.liabiltyCovers = this.covers
    this.quoteEandOOptions.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));

    this.liabilityEandOTemplateService.updateArray(this.quoteEandOOptions._id, this.quoteEandOOptions).subscribe({
      next: quote => {
        this.selectedCovers = this.covers.filter(x => x.isSelected == true).length

        this.ref.close(this.selectedCovers);
        console.log("DANDO Covers saved Successfully");
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
  onDropdownChange(rowData: any): void {
    rowData.isSelected = true;
  }
  
  addmoreAddOns() {
    let addOnsDetails = new liabiltyEandOAddOnCovers();
    addOnsDetails.isExternal = true;

    const externalCovers = this.covers.filter(cover => cover.isExternal);
    const lastRecord = externalCovers.pop();
    let externalAddonsId = 0;
    if (lastRecord) {
      externalAddonsId = (+lastRecord.id) + 1;
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
