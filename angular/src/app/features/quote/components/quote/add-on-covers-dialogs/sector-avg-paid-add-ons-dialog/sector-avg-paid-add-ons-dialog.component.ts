import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedAddonCoverCategory, IAddOnCover } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { QuoteLocationAddonService } from 'src/app/features/admin/quote-location-addon/quote-location-addon.service';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-sector-avg-paid-add-ons-dialog',
  templateUrl: './sector-avg-paid-add-ons-dialog.component.html',
  styleUrls: ['./sector-avg-paid-add-ons-dialog.component.scss']
})
export class SectorAvgPaidAddOnsDialogComponent implements OnInit {


  droppedItems = [];
  // paidAddons = [];
  currentUser$: Observable<IUser>;
  sectorConditionalPermissions:boolean;
  permissions: PermissionType[] =[];
  quoteOptionData: IQuoteOption;
  quote: any;
  addOnCovers: any;
  propertyDamage: any;
  businessInterruption: any;
  machieryBreakdown: any;
  propertyDamageAddon: any;
  businessInterruptionAddon: any;
  machieryBreakdownAddon: any;
  newAddon: any;
  

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private quoteLocationAddonService: QuoteLocationAddonService,
    private quoteService: QuoteService,
    private accountService: AccountService,
    private quoteOptionService: QuoteOptionService,
    private addonCoverService: AddonCoverService,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private cdr: ChangeDetectorRef
  ) {
    // this.paidAddons = this.config.data?.covers;
    this.droppedItems = this.config.data?.selectedCovers;
    this.currentUser$ = this.accountService.currentUser$
    this.quoteOptionData = this.config.data?.quoteOptionData;                                 
    this.quote = this.config.data?.quote;

    
  }

  ngOnInit(): void {
    this.currentUser$.subscribe({
      next: user => {
        let role: IRole = user?.roleId as IRole;
        if (role?.name === AllowedRoles.INSURER_RM) {

          this.sectorConditionalPermissions = true
          this.permissions = ['read'];
        } else {

          this.permissions = ['read', 'update'];
        }
        this.prepare();
      }
    })
  }


  // onItemDrop(e: any) {
  //   e.dragData.isChecked = true;
  //   this.quoteLocationAddonService.update(e.dragData._id, e.dragData).subscribe({
  //     next: (dto: IOneResponseDto<any>) => {
  //     }
  //   })
  //   // Get the dropped data here
  //   this.droppedItems.push(e.dragData);
  //   this.paidAddons = this.paidAddons.filter(item => item.name != e.dragData.name);
  // }

  onItemDrop(e: any) {
    console.log(e.dragData, "e data on item drop");
    e.dragData.isChecked = true
    const payload = {
      quoteId: this.quoteOptionData.quoteId?.["_id"],
      quoteOptionId: this.quoteOptionData?.["_id"],
      quoteLocationOccupancyId: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy?.["_id"],
      productId: this.quoteOptionData.quoteId?.["productId"]?.["_id"],
      sumInsured: 0,
      isChecked: e.dragData.isChecked,
      addOnCoverId: e.dragData._id,
      addonType: e.dragData.addonType,
      description: e.dragData.description,
    }
    e.dragData = payload
    this.quoteLocationAddonService.create(e.dragData).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.droppedItems = [...this.droppedItems, dto.data.entity];
        this.quoteOptionService.refreshQuoteOption()
      }
    })
    // this.cdr.detectChanges();
    // this.droppedItems.push(e.dragData);
    // this.paidAddons = this.paidAddons.filter(item => item.name != e.dragData.name);
  }

  // removeDroppedItems(e) {
  //   e.isChecked = false;
  //   e.sumInsured = 0;
  //   e.calculatedIndicativePremium = 0;
  //   this.quoteLocationAddonService.update(e._id, e).subscribe({
  //     next: (dto: IOneResponseDto<any>) => {
  //     }
  //   })
  //   this.droppedItems = this.droppedItems.filter(item => item.name != e.name);
  //   this.paidAddons.push(e);
  // }

  removeDroppedItems(e) {
    console.log(e, "got id on remoteItem");
    this.quoteLocationAddonService.delete(e._id).subscribe((res) => {
      this.droppedItems = this.droppedItems.filter(item => item._id != e._id);
      this.quoteOptionService.refreshQuoteOption()
    })
    // this.paidAddons.push(e);
  }

  closeModal() {
    this.quoteOptionService.refreshQuoteOption();
    this.ref.close(this.droppedItems);
  }

  updateQuoteLocationAddon(cover, e) {
    if (e.checked.includes(cover?.addOnCoverId?.name)) {
      cover.isChecked = true;
    }
    else {
      cover.isChecked = false;
    }
    this.quoteLocationAddonService.update(cover._id, cover).subscribe({
      next: (dto: IOneResponseDto<any>) => {
      }
    })
  }

  calculateSumInsured(data: any) {
    let temp = {
      quoteLocationAddonCoverId: '',
      sumInsured: ''
    }
    temp.quoteLocationAddonCoverId = data._id;
    temp.sumInsured = data.sumInsured;

    this.quoteService.getComputeAddons(temp).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.droppedItems.forEach(item => {
          if (item._id == dto.data.entity._id) {
            item.calculatedIndicativePremium = dto.data.entity.calculatedIndicativePremium;
          }
        })
        // console.log(this.droppedItems);
      },
      error: e => {
        console.log(e);
      }
    });
  }

  async prepare() {
    this.quoteOptionService.get(this.quoteOptionData._id, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
      next: (value) => {
        this.quoteOptionData = value.data.entity

        this.addonCoverService.getAddOnCoversByProductId(this.quote?.productId?._id).subscribe({
          next: async (dto: IOneResponseDto<IAddOnCover>) => {
            this.addOnCovers = await dto.data.entities
              ?.filter((item) => item?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
              ?.filter(item => item?.addonTypeFlag == 'Paid')
              ?.filter(item => item?.sectorId == this.quote?.sectorId?._id)
              ?.filter(item => item?.partnerId == this.quote?.partnerId)

            // let quoteLocationBreakup = await this.getQuoteLocationBreakup();

            // var propertyDamageLovRef
            // var businessInterruptionLovRef
            // quoteLocationBreakup.map(val => {
            //   if (val.lovReferences[0] == "PROPERTY_DAMAGE") {
            //     propertyDamageLovRef = val.lovReferences[0]
            //       .replace("_", " ")
            //       .toLowerCase()
            //       .split(' ')
            //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            //       .join(' ')
            //   }
            //   if (val.lovReferences[0] == "BUSINESS_INTERRUPTION") {
            //     businessInterruptionLovRef = val.lovReferences[0]
            //       .replace("_", " ")
            //       .toLowerCase()
            //       .split(' ')
            //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            //       .join(' ')
            //   }
            // })

            // this.propertyDamageAddon = this.addOnCovers
            //   .filter(val => val.category === propertyDamageLovRef)
            //   .map(obj => {
            //     const match = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.find(o => o.addOnCoverId?._id === obj?._id);
            //     return match ? { ...match } : obj;
            //   });

            // this.businessInterruptionAddon = this.addOnCovers
            //   .filter(val => val.category === businessInterruptionLovRef)
            //   .map(obj => {
            //     const match = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.find(o => o.addOnCoverId?._id === obj?._id);
            //     return match ? { ...match } : obj;

            //   });
            // this.newAddon = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.filter(o => o.isExternal == true && o.addonType == "conditionalCover");
          }
        })
      },
    })
  }

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

}
