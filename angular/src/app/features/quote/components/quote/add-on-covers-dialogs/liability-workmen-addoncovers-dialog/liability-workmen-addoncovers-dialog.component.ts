import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov } from 'src/app/app.model';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IQuoteSlip, liabiltyProductAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { BscWorkmenCompensationService } from 'src/app/features/quote/blus_bsc_dialogs/bsc-workmen-compensation-form-dialog/bsc-workmen-compensation.service';

@Component({
  selector: 'app-liability-workmen-addoncovers-dialog',
  templateUrl: './liability-workmen-addoncovers-dialog.component.html',
  styleUrls: ['./liability-workmen-addoncovers-dialog.component.scss']
})
export class LiabilityWorkmenAdOnCoverComponent implements OnInit {

  covers: any[] = [];
  listCover: any[] = [];
  searchedText: string = ''
  quote: IQuoteSlip;
  quoteWCoption: any
  optionCovers: ILov[] = [];
  selectedCovers: number = 0
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef, private wctemplateService: QuoteWcTemplateService, private messageService: MessageService
  ) {
    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.covers = this.config.data?.covers;
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    this.listCover = this.covers;
    this.quote = this.config.data.quote;
    this.quoteWCoption = this.config.data.quoteWCoption
  }


  ngOnInit(): void {

  }

  closeModal() {
    this.quoteWCoption.liabiltyCovers = this.covers
    this.wctemplateService.updateArray(this.quoteWCoption._id, this.quoteWCoption).subscribe({
      next: quote => {
        console.log("Product Liability Covers saved Successfully");
      },
      error: error => {
        console.log(error);
      }
    });
    this.selectedCovers = this.covers.filter(x => x.isSelected == true).length
    this.ref.close(this.selectedCovers);
  }

  onDropdownChange(rowData: any): void {
    rowData.isSelected = true;
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

    this.quoteWCoption.liabiltyCovers = this.covers
    this.quoteWCoption.liabiltyCovers = this.quoteWCoption.liabiltyCovers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    this.wctemplateService.updateArray(this.quoteWCoption._id, this.quoteWCoption).subscribe({
      next: quote => {
        this.selectedCovers = this.covers.filter(x => x.isSelected == true).length

        this.ref.close(this.selectedCovers);
        console.log("Product Liability Covers saved Successfully");
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
    let addOnsDetails = new liabiltyProductAddOnCovers();
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
