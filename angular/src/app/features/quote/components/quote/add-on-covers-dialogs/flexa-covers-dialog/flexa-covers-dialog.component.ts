import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { IAddOnCover } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { QuoteLocationAddonService } from 'src/app/features/admin/quote-location-addon/quote-location-addon.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-flexa-covers-dialog',
  templateUrl: './flexa-covers-dialog.component.html',
  styleUrls: ['./flexa-covers-dialog.component.scss']
})
export class FlexaCoversDialogComponent implements OnInit {

  covers: any[] = [];
  listCover: any[] = [];
  searchedText: string = ''
  quote: IQuoteSlip
  addOnCovers: IAddOnCover;
  quoteOptionData: IQuoteOption
  propertyDamageAddon: any;
  isChecked: boolean = false;
  flexaText: string;
  counter: number = Math.floor(Math.random() * 0xFFFFFF);

  displayDialog: boolean = false;
  selectedRowData: any = null;
  selectedDescription: string
  selectedAddons: any[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private addonCoverService: AddonCoverService,
    private quoteLocationAddonService: QuoteLocationAddonService,
    private quoteOptionService: QuoteOptionService,
    private messageService: MessageService,
  ) {
    this.covers = this.config.data?.covers;
    this.listCover = this.covers;
    this.quote = this.config.data?.quote;
    this.quoteOptionData = this.config.data?.quoteOptionData;
  }

  ngOnInit(): void {
    this.prepare()
  }

  searchCover(e) {
    this.listCover = this.covers.filter(item => item.addOnCoverId.name.toLowerCase().includes(e.toLowerCase()));
  }

  downloadCovers() {
    if (this.listCover.length > 0) {
      const csv = this.listCover.map((item) => {
        return item.addOnCoverId.name;
      });
      this.downloadBlob(csv.join("\n"), 'flexa_covers' + ".csv", "text/csv");
    }
  }

  downloadBlob(content, filename, contentType) {
    // Create a blob
    const blob = new Blob(["\uFEFF" + content], {
      type: contentType + "; charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    // Create a link to download it
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    a.click();
  };

  prepare() {
    this.quoteOptionService.get(this.quoteOptionData._id, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
      next: (value) => {
        this.quoteOptionData = value.data.entity

        this.addonCoverService.getAddOnCoversByProductId(this.quote?.productId["_id"]).subscribe({
          next: async (dto: IOneResponseDto<IAddOnCover>) => {
            this.addOnCovers = await dto.data.entities
              ?.filter((item) => item?.partnerId == this.quote?.partnerId)
              ?.filter((item) => item?.category == "Property Damage")
              ?.filter(item => item?.addonTypeFlag == 'Free')
              ?.filter(item => item?.sectorId == this.quote?.sectorId["_id"]);

            this.propertyDamageAddon = this.addOnCovers
              .filter(val => val.category === "Property Damage")
              .map(obj => {
                const match = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.find(o => o.addOnCoverId?._id === obj?._id);
                return match ? { ...match } : obj;
              });
            const externalMatch = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.filter(o => o.isExternal === true && o.addonType == "FlexaCover");
            this.propertyDamageAddon = [...this.propertyDamageAddon, ...externalMatch];
          }
        })
      }
    })
  }

  // creatQuoteLoctionAddon(val: any, check: any) {
  //   const payload = {};
  //   payload['quoteId'] = this.quote._id;
  //   payload['quoteOptionId'] = this.quoteOptionData._id;
  //   payload['quoteLocationOccupancyId'] = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id;
  //   payload['productId'] = val.productId;
  //   payload['sumInsured'] = 0;
  //   payload['isChecked'] = check.checked;
  //   payload['addOnCoverId'] = val._id;
  //   payload['addonType'] = "FlexaCover";

  //   if (check.checked) {
  //     if (val.isExternal == true) {
  //       payload['isExternal'] = true;
  //     }
  //     // @ts-ignore
  //     this.quoteLocationAddonService.create(payload).subscribe({
  //       next: (res) => {
  //         this.prepare()
  //       }
  //     })
  //   } else {
  //     this.quoteLocationAddonService.delete(val._id).subscribe((res) => {
  //       this.quoteOptionService.refreshQuoteOption();
  //     })
  //   }
  // }

  updateQuoteLocationAddon(cover, e) {
    if (cover.isExternal && e == "Pending") {
      cover.addonStatus = "Pending"
    }
    else if (cover.isExternal) {
      cover.name = cover.flexaText;
    }
    cover.description = e?.description ? e?.description : cover?.description
    this.quoteLocationAddonService.update(cover._id, cover).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        cover.sumInsured = dto.data.entity.sumInsured;
        this.quoteOptionService.refreshQuoteOption()
        this.closeDialog()
        if (dto.data.entity.addonStatus == "Pending") {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Addon Updated Successful`,
            life: 3000
          });
        }
      }
    })
  }

  addmoreAddOns() {
    const newId = this.generateObjectId();
    this.propertyDamageAddon.push({
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
      quoteOptionId: this.quoteOptionData._id,
      quoteLocationOccupancyId: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy['_id'],
      sumInsured: 0,
      tenantId: `QuoteLocationAddonCovers-${this.quote.partnerId}`,
      __v: 0,
      _id: newId,
      isExternal: true
    })
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

  isDisabled(rowData: any): boolean {
    const disabledStatuses = ['Pending', 'Approved', 'Reject'];
    return rowData.isClicked || disabledStatuses.includes(rowData.addonStatus);
  }

  openEditDialog(rowData: any) {
    if (rowData.isChecked) {
      this.selectedRowData = rowData;
      this.selectedDescription = rowData.description;
      this.displayDialog = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: `Select Checkbox `,
        life: 3000
      });
    }
  }

  closeDialog() {
    this.displayDialog = false;
    this.selectedRowData = null;
  }

  toggleSelection(rowData: any, event: any) {
    if (event.checked) {
      this.selectedAddons.push(rowData);
    } else {
      this.selectedAddons = this.selectedAddons.filter(item => item !== rowData);
    }
  }

  saveSelectedAddons() {
    if (this.selectedAddons.length > 0) {
      const payload = this.selectedAddons.map(addon => {
        let addonPayload = {
          quoteId: addon.quoteId || this.quote._id,
          quoteOptionId: addon.quoteOptionId || this.quoteOptionData._id,
          quoteLocationOccupancyId: addon.quoteLocationOccupancyId || this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id,
          productId: addon.productId || this.quote.productId["_id"],
          sumInsured: 0,
          isChecked: addon.isChecked,
          addOnCoverId: addon.addOnCoverId || addon._id,
          addonType: "FlexaCover"
        };

        if (addon.isExternal) {
          addonPayload["isExternal"] = true;
          addonPayload["name"] = addon.flexaText;
        }

        return addonPayload;
      });
      this.quoteLocationAddonService.saveAddons(payload).subscribe({
        next: (res) => {
          this.prepare()
        }
      })
    }
  }
}
