import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteLocationAddonService } from 'src/app/features/admin/quote-location-addon/quote-location-addon.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { DropdownModule } from 'primeng/dropdown';
import { IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { IAddOnCover } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { OPTIONS_ADDON_COVER_CATEGORIES } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { LazyLoadEvent } from 'primeng/api';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-conditional-free-add-ons-dialog',
  templateUrl: './conditional-free-add-ons-dialog.component.html',
  styleUrls: ['./conditional-free-add-ons-dialog.component.scss']
})
export class ConditionalFreeAddOnsDialogComponent implements OnInit {

  covers: any[] = [];
  selectedConditionalFreeCovers: any[] = []
  selectedRateLimits: any[] = []
  currentUser$: Observable<IUser>;
  sectorConditionalPermissions: boolean;
  permissions: PermissionType[] = [];
  isMobile: boolean = false;
  product: any;
  quote: any;
  counter: number = Math.floor(Math.random() * 0xFFFFFF);
  addOnCoverName: any
  addOnCoverFreeUpToText: any
  isConditionAddon: boolean = true
  quoteOptionData: IQuoteOption                                                    // New_Quote_Option
  addOnCovers: any;
  isChecked: boolean = false;
  optionsAddonCoverCategories: any;
  propertyDamage: any;
  businessInterruption: any;
  machieryBreakdown: any;
  propertyDamageAddon: any;
  businessInterruptionAddon: any;
  machieryBreakdownAddon: any;
  newAddon: any;

  displayDialog: boolean = false;
  selectedRowData: any = null;
  selectedDescription: string
  selectedAddons: any[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private quoteService: QuoteService,
    private quoteLocationAddonService: QuoteLocationAddonService,
    private accountService: AccountService,
    private addonCoverService: AddonCoverService,
    private quoteOptionService: QuoteOptionService,
    private deviceService: DeviceDetectorService,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private messageService: MessageService,
  ) {
    this.covers = this.config.data?.covers;
    this.quote = this.config.data?.quote;
    this.quoteOptionData = this.config.data?.quoteOptionData;                                 // New_Quote_Option
    this.product = this.config.data?.quote.productId.shortName
    this.selectedConditionalFreeCovers = this.config.data?.selectedCovers;
    this.currentUser$ = this.accountService.currentUser$
  }


  ngOnInit(): void {
    this.optionsAddonCoverCategories = OPTIONS_ADDON_COVER_CATEGORIES
    this.isMobile = this.deviceService.isMobile();
    this.currentUser$.subscribe({
      next: user => {
        let role: IRole = user?.roleId as IRole;
        if (role?.name === AllowedRoles.INSURER_RM) {
          this.sectorConditionalPermissions = true
          this.permissions = ['read'];
        } else {
          this.permissions = ['read', 'update'];
        }
      }
    })

    this.prepare();
  }
  addOnCoverIdName(val) {
    this.addOnCoverName = val;
  }
  addOnCoverIdfreeUpToText(val) {
    this.addOnCoverFreeUpToText = val;
  }


  closeModal() {
    this.ref.close(this.selectedConditionalFreeCovers);
  }
  async prepare() {
    this.quoteOptionService.get(this.quoteOptionData._id, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
      next: (value) => {
        this.quoteOptionData = value.data.entity

        this.addonCoverService.getAddOnCoversByProductId(this.quote?.productId?._id).subscribe({
          next: async (dto: IOneResponseDto<IAddOnCover>) => {
            this.addOnCovers = await dto.data.entities
              ?.filter((item) => item?.partnerId == this.quote?.partnerId)
              ?.filter(item => item?.addonTypeFlag != 'Free' && item?.addonTypeFlag != 'Paid')
              ?.filter(item => item?.sectorId == this.quote?.sectorId._id);

            let quoteLocationBreakup = await this.getQuoteLocationBreakup();

            var propertyDamageLovRef
            var businessInterruptionLovRef
            quoteLocationBreakup.map(val => {
              if (val.lovReferences[0] == "PROPERTY_DAMAGE") {
                propertyDamageLovRef = val.lovReferences[0]
                  .replace("_", " ")
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              }
              if (val.lovReferences[0] == "BUSINESS_INTERRUPTION") {
                businessInterruptionLovRef = val.lovReferences[0]
                  .replace("_", " ")
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              }
            })

            this.propertyDamageAddon = this.addOnCovers
              .filter(val => val.category === propertyDamageLovRef)
              .map(obj => {
                const match = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.find(o => o.addOnCoverId?._id === obj?._id);
                return match ? { ...match } : obj;
              });

            this.businessInterruptionAddon = this.addOnCovers
              .filter(val => val.category === businessInterruptionLovRef)
              .map(obj => {
                const match = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.find(o => o.addOnCoverId?._id === obj?._id);
                return match ? { ...match } : obj;

              });
            this.newAddon = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.filter(o => o.isExternal == true && o.addonType == "conditionalCover");
          }
        })
      },
    })
  }

  calculateSumInsured(data: any) {
    if (this.product === 'CAR') {
      let temp = {
        quoteLocationAddonCoverId: '',
        sumInsured: '',
        limits: ''
      }
      temp.quoteLocationAddonCoverId = data.quoteaddonId;
      temp.sumInsured = data.sumInsured;
      temp.limits = data.selectedRateLimit.limits;

      this.quoteService.getComputeAddons(temp).subscribe({
        next: (dto: IOneResponseDto<any>) => {
          this.covers.forEach(item => {
            if (item._id == dto.data.entity._id) {
              item.calculatedIndicativePremium = dto.data.entity.calculatedIndicativePremium;
            }
          })
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else {
      let temp = {
        quoteLocationAddonCoverId: '',
        sumInsured: '',
        isExternal: "",
        name: this.addOnCoverName,
        freeUpToText: this.addOnCoverFreeUpToText
      }
      temp.quoteLocationAddonCoverId = data.quoteaddonId ? data.quoteaddonId : data._id;
      temp.isExternal = data?.isExternal;
      temp.sumInsured = data.sumInsured;
      this.quoteService.getComputeAddons(temp).subscribe({
        next: (dto: IOneResponseDto<any>) => {
          this.covers.forEach(item => {
            if (item._id == dto.data.entity._id) {
              item.calculatedIndicativePremium = dto.data.entity.calculatedIndicativePremium;
            }
          })
        },
        error: e => {
          console.log(e);
        }
      });
    }



  }

  updateQuoteLocationAddon(cover, e) {
    if (cover.isExternal && e == "Pending") {
      cover.addonStatus = "Pending"
    }
    else if (cover.isExternal) {
      cover.name = this.addOnCoverName;
    }
    // else if (e.description || e.description == "") {
    cover.description = e?.description ? e?.description : cover?.description
    // }
    this.quoteLocationAddonService.update(cover._id, cover).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        cover.sumInsured = dto.data.entity.sumInsured;
        this.quoteOptionService.refreshQuoteOption()
        this.closeDialog()
        if (dto.data.entity.addonStatus == "Pending") {
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Addon Send For Approvel`,
            life: 3000
          });
        }
      }
    })
  }
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

  deleteAddOnsCovers(id) {
    this.propertyDamageAddon[0].value = this.propertyDamageAddon[0].value.filter(cover => cover._id != id);
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
  //   payload['addonType'] = "conditionalCover";
  //   payload['description'] = val.description;

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

  async getQuoteLocationBreakup() {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 50,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteOptionId: [
          {
            value: this.quoteOptionData._id,
            matchMode: "equals",
            operator: "and"
          }

        ],
      },
    }

    let response = await this.quoteLocationBreakupService.getMany(event).toPromise()

    return response.data.entities

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

  // toggleSelection(rowData: any, event: any) {
  //   if (event.checked) {
  //     this.selectedAddons.push(rowData);
  //   } else {
  //     this.selectedAddons = this.selectedAddons.filter(item => item !== rowData);
  //   }
  // }


  toggleSelection(rowData: any, event: any) {
    if (event.checked) {
      // const existingIndex = this.selectedAddons.findIndex(addon => addon.addOnCoverId === rowData.addOnCoverId);
      // if (existingIndex !== -1) {
      //   this.selectedAddons[existingIndex].isChecked = true;
      // } else {
      this.selectedAddons.push(rowData);
      // }
    } else {
      const existingIndex = this.selectedAddons.findIndex(addon => addon.addOnCoverId === rowData.addOnCoverId);
      if (existingIndex !== -1) {
        this.selectedAddons[existingIndex].isChecked = false;
      } else {
        this.selectedAddons.push({ ...rowData, isChecked: false });
      }
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
          sumInsured: addon.sumInsured || 0,
          isChecked: addon.isChecked,
          addOnCoverId: addon.addOnCoverId || addon._id,
          addonType: "conditionalCover",
          description: addon.description
        };

        if (addon.isExternal) {
          addonPayload["isExternal"] = true;
          addonPayload["name"] = addon.name;
        }

        return addonPayload;
      });
      console.log(payload, "kkkkk")
      this.quoteLocationAddonService.saveAddons(payload).subscribe({
        next: (res) => {
          this, this.selectedAddons = []
          this.prepare()
        }
      })
    }
  }

  updateExistingAddonsSumInsured() {
    if (this.selectedAddons.length == 0) {
      let allAddons = [...this.propertyDamageAddon, ...this.businessInterruptionAddon, ...this.newAddon];

      const existingAddons = allAddons.filter(addon => addon.isChecked);
      if (existingAddons.length === 0) {
        console.log("No existing add-ons to update.");
        return;
      }

      existingAddons.forEach(existingAddon => {
        let updatePayload = {
          sumInsured: existingAddon.sumInsured
        };
        //@ts-ignore
        this.quoteLocationAddonService.update(existingAddon._id, updatePayload).subscribe({
          next: (res) => {
            this.prepare();
          },
          error: (err) => {
            console.error(`Error updating sumInsured for add-on ${existingAddon._id}:`, err);
          }
        });
      });
    }
  }
}
