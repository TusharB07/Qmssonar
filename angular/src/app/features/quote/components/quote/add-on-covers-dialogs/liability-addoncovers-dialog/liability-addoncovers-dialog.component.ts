import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov } from 'src/app/app.model';
import { IAddOnCover, LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { AllowedTaskStatus } from 'src/app/features/admin/earthquake-rate/earthquake-rate.model';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IQuoteSlip, liabiltyAddOnCovers } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-liability-addoncovers-dialog',
  templateUrl: './liability-addoncovers-dialog.component.html',
  styleUrls: ['./liability-addoncovers-dialog.component.scss']
})
export class LiabilityAddoncoversDialogComponent implements OnInit {
  covers: liabiltyAddOnCovers[] = [];
  listCover: any[] = [];
  searchedText: string = ''
  counter: number = Math.floor(Math.random() * 0xFFFFFF);
  quote: IQuoteSlip;
  quoteDandOOptions: any
  optionCovers: ILov[] = [];
  selectedCovers: number = 0;
  newAddon: any;

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private addoncoverService: AddonCoverService,
    private liabilityTemplateService: liabilityTemplateService, private messageService: MessageService
  ) {
    this.optionCovers = LIABILITY_COVERS_OPTIONS;
    this.covers = this.config.data?.covers;
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    this.listCover = this.covers;
    this.quote = this.config.data.quote;
    this.quoteDandOOptions = this.config.data.quoteDandOOptions
  }


  generateObjectId(): string {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const randomValue = this.getRandomHex(5);
    const counter = this.counter.toString(16).padStart(6, '0');
    this.counter = (this.counter + 1) % 0xFFFFFF;
    return `${timestamp}${randomValue}${counter}`;
  }

  getRandomHex(size: number): string {
    let result = '';
    for (let i = 0; i < size; i++) {
      result += Math.floor(Math.random() * 0xFF).toString(16).padStart(2, '0');
    }
    return result;
  }


  ngOnInit(): void {
  }
  closeModal() {
    this.quoteDandOOptions.liabiltyCovers = this.covers
    this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
      next: quote => {
        console.log("DANDO Covers saved Successfully");
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

  sendToMaster(rowData){
    
  }


  saveModal() {
    this.covers = this.covers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    let checkedData = this.covers.filter(x => x.isSelected == true)
    let checkedDuplicate = this.covers.filter((cover, index, array) =>
      array.filter(c => c.name === cover.name).length > 1
    );
    // if (checkedDuplicate.length > 1) {
    //   this.messageService.add({
    //     key: "error",
    //     severity: "error",
    //     summary: `Error: Duplicate name of covers are not allowed`,
    //     detail: ``
    //   });
    //   return
    // }
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
    this.quoteDandOOptions.liabiltyCovers = this.covers
    this.quoteDandOOptions.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers.filter(cover => !(cover.isExternal && (!cover.optionSelected || cover.optionSelected.trim() === '' || !cover.name || cover.name.trim() === '')));
    this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
      next: quote => {
        this.selectedCovers = this.covers.filter(x => x.isSelected == true).length
        this.ref.close(this.selectedCovers);
        console.log("DANDO Covers saved Successfully");
      },
      error: error => {
        console.log(error);
      }
    });

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
    const newId = this.generateObjectId();
    this.newAddon.push({
      // name: '',
      description: '',
      freeUpToText: '',
      calculatedIndicativePremium: 0,
      isChecked: false,
      partnerId: this.quote.partnerId['_id'],
      productId: this.quote.productId['_id'],
      quoteId: this.quote._id,
      // Old_Quote
      // quoteLocationOccupancyId: this.quote.locationBasedCovers.quoteLocationOccupancy['_id'],

      // New_Quote_Option
      quoteOptionId: this.quoteDandOOptions._id,
      quoteLocationOccupancyId: this.quoteDandOOptions.locationBasedCovers.quoteLocationOccupancy['_id'],
      sumInsured: 0,
      tenantId: `QuoteLocationAddonCovers-${this.quote.partnerId}`,
      __v: 0,
      _id: newId,
      isExternal: true
    })
    let addOnsDetails = new liabiltyAddOnCovers();
    addOnsDetails.isExternal = true;
    addOnsDetails.isApproved = false;
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

