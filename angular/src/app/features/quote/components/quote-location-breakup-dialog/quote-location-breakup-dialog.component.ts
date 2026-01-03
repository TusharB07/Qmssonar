import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, ReplaySubject } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IClientLocation } from '../../../admin/client-location/client-location.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from '../../../admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from '../../../admin/list-of-value-master/list-of-value-master.service';
import { IOccupancyRate } from '../../../admin/occupancy-rate/occupancy-rate.model';
import { IQuoteLocaitonBreakupMaster } from '../../../admin/quote-location-breakup-master/quote-location-breakup-master.model';
import { QuoteLocationBreakupMasterService } from '../../../admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteLocationOccupancy } from '../../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../../../admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from '../../../admin/quote/quote.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-quote-location-breakup-dialog',
    templateUrl: './quote-location-breakup-dialog.component.html',
    styleUrls: ['./quote-location-breakup-dialog.component.scss']
})
export class QuoteLocationBreakupDialogComponent implements OnInit {


    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['update'];

    uploadUrl: string;

    uploadHttpHeaders: HttpHeaders;

    currentUser$: Observable<IUser>;

    selectedLocation: any

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    isLockton: boolean = environment.isLokton

    // quoteLocationOccupancy = [];
    // quoteLocationName = [];
    // fireLov = [
    //     { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
    //     { description: '(A) Material Damage Section', isHeader: true, amounts: [] },
    //     { description: 'Building & Plinth', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE", "BMA"], isHeader: false, amounts: [] },
    //     { description: 'Stocks', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE", "FLOATER_ADDON_STOCKS"], isHeader: false, amounts: [] },
    //     { description: 'Other Items', lovKey: "row3", lovReferences: ["BSC_BURGLARY_AND_HOUSEBREAKING_OTHER_CONTENTS", "PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Personal Effects', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Valuables, Painting, Jewellery', lovKey: "row5", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Section II: Machinery (PD)', isHeader: true, amounts: [] },
    //     { description: '(B) Machinery/Electrical', isHeader: true, amounts: [] },
    //     { description: 'Sum Insured', lovKey: "row6", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    // ];

    // blusLov = [
    //     { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
    //     { description: '(A) Material Damage Section', isHeader: true, amounts: [] },
    //     { description: 'Building', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE", "BMA"], isHeader: false, amounts: [] },
    //     { description: 'Plinth & Foundation, roads and bridges, etc.', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Office Equipment, Furnitures & Fixtures, Electrical installantion and other contents', lovKey: "row3", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Furniture, Fixtures, Fittings', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Electrical installation & Domestic Appliances', lovKey: "row5", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Stocks', lovKey: "row6", lovReferences: ["PROPERTY_DAMAGE", "BSC_BURGLARY_AND_HOUSEBREAKING_STOCKS"], isHeader: false, amounts: [] },
    //     { description: 'Other Items', lovKey: "row7", lovReferences: ["PROPERTY_DAMAGE", "BSC_BURGLARY_AND_HOUSEBREAKING_OTHER_CONTENTS"], isHeader: false, amounts: [] },
    //     { description: 'Utensils', lovKey: "row8", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Personal Effects', lovKey: "row9", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Valuables, Painting, Jewellery, if any', lovKey: "row10", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Other Misc Items', lovKey: "row11", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: '(B) Machinery/Electrical', isHeader: true, amounts: [] },
    //     { description: 'Sum Insured', lovKey: "row12", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    // ];

    // iarLov = [
    //     { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
    //     { description: '(A) Material Damage Section', isHeader: true, amounts: [] },
    //     { description: 'Building including compound wall and plinth and foundation', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Plant & Machinary', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Other Assets', lovKey: "row3", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: 'Stocks of all kind', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    //     { description: '(B) Machinery/Electrical', isHeader: true, amounts: [] },
    //     { description: 'Machinary Breakdown', lovKey: "row5", lovReferences: ["MACHINERY_BREAKDOWN"], isHeader: false, amounts: [] },
    //     { description: 'Section II: Business Interruption (BI)', isHeader: true, amounts: [] },
    //     { description: 'Fire & Allied Perils', lovKey: "row6", isHeader: false, amounts: [] },
    //     { description: 'MLOP', lovKey: "row7", isHeader: false, amounts: [] },
    // ];

    // splitData: any[] = [];

    // totals: number[] = [];

    constructor(
        private config: DynamicDialogConfig,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
        private appService: AppService,
        private accountService: AccountService,
        private quoteService: QuoteService,
        private ref: DynamicDialogRef,
        private quoteOptionService: QuoteOptionService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private messageService: MessageService,

    ) {

        this.quote = this.config.data.quote

        this.quoteOptionData = this.config.data.quoteOptionData                      // New_Quote_Option

        this.selectedLocation = this.config.data.selectedLocation

        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

        this.currentUser$ = this.accountService.currentUser$

    }

    ngOnInit(): void {
        // Old_Quote
        // this.uploadUrl = this.quoteLocationBreakupService.uploadQuoteLocationBreakupExcelUrl(this.quote?._id)

        // New_Quote_Option
        this.uploadUrl = this.quoteLocationBreakupService.uploadQuoteLocationBreakupExcelUrl(this.quoteOptionData?._id)
        // this.prepare()
    }


    downloadSampleFile() {
        // this.quoteLocationBreakupService.downloadQuoteLocationBreakupExcel(this.quote?._id).subscribe({
        //     next: (response: any) => this.appService.downloadSampleExcel(response),
        //     error: e => {
        //         console.log(e)
        //     }
        // })

        // Old_Quote
        // this.quoteLocationBreakupService.bulkImportGenerateSample(this.quote._id).subscribe({

        // New_Quote_Option
        this.quoteLocationBreakupService.bulkImportGenerateSample(this.quoteOptionData._id).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    onSaved() {
        // this.quoteService.refresh()
        // this.quoteOptionService.refreshQuoteOption()
        this.ref.close()
    }


    fileUploaded($event: any) {
        this.quoteService.refresh()
        this.quoteOptionService.refreshQuoteOption()
    }

    // async prepare() {
    //     const quoteLocationOccupancies = await this.getQuoteLocationOccupancies()
    //     this.quoteLocationOccupancy = quoteLocationOccupancies
    //     const quoteLocationBreakups = await this.getQuoteLocationBreakup()


    //     if (quoteLocationBreakups.length != 0) {
    //         //@ts-ignore
    //         this.splitData = this.buildSplitDataHierarchy(quoteLocationBreakups);
    //     } else {
    //         this.splitData = this.quote?.productId["productTemplate"] == "FIRE" ? this.fireLov :
    //             this.quote?.productId["productTemplate"] == "BLUS" ? this.blusLov :
    //                 this.quote?.productId["productTemplate"] == "IAR" ? this.iarLov :
    //                     this.fireLov
    //     }
    //     this.updateTotals();
    // }

    // buildSplitDataHierarchy(breakups: any[]) {
    //     const hierarchy: any[] = [];
    //     let currentHeader = null;
    //     let currentSubheader = null;

    //     breakups.forEach((breakup) => {
    //         if (breakup.heading && breakup.children) {
    //             if (!currentHeader || currentHeader.description !== breakup.heading) {
    //                 currentHeader = { description: breakup.heading, isHeader: true, amounts: [] };
    //                 hierarchy.push(currentHeader);
    //                 currentSubheader = null;
    //             }
    //             if (!currentSubheader || currentSubheader.description !== breakup.subHeading) {
    //                 currentSubheader = { description: breakup.subHeading, isHeader: true, amounts: [] };
    //                 hierarchy.push(currentSubheader);
    //             }

    //             const row = hierarchy.find(
    //                 (item) =>
    //                     item.description === breakup.children &&
    //                     !item.isHeader &&
    //                     item.heading === breakup.heading &&
    //                     item.subHeading === breakup.subHeading
    //             );

    //             if (!row) {
    //                 hierarchy.push({
    //                     description: breakup.children,
    //                     isHeader: false,
    //                     amounts: Array(this.quoteLocationOccupancy.length).fill(breakup.value),
    //                     heading: breakup.heading,
    //                     subHeading: breakup.subHeading,
    //                     lovKey: breakup.lovKey,
    //                     lovReferences: breakup.lovReferences
    //                 });
    //             }

    //             const locationIndex = this.quoteLocationOccupancy.findIndex(
    //                 (location) => location._id === breakup.quoteLocationOccupancyId._id
    //             );
    //             if (locationIndex !== -1) {
    //                 const dataRow = hierarchy.find(
    //                     (item) =>
    //                         item.description === breakup.children &&
    //                         !item.isHeader &&
    //                         item.heading === breakup.heading &&
    //                         item.subHeading === breakup.subHeading
    //                 );
    //                 dataRow.amounts[locationIndex] = breakup.value;
    //             }
    //         }
    //     });
    //     return hierarchy;
    // }

    // async getQuoteLocationOccupancies() {
    //     let event: LazyLoadEvent = {
    //         first: 0,
    //         rows: 20,
    //         sortField: null,
    //         sortOrder: 1,
    //         filters: {
    //             // @ts-ignore
    //             quoteOptionId: [
    //                 {
    //                     value: this.quoteOptionData._id,
    //                     matchMode: "equals",
    //                     operator: "and"
    //                 }

    //             ],
    //         },
    //     }

    //     let response = await this.quoteLocationOccupancyService.getMany(event).toPromise()

    //     return response.data.entities

    // }

    // async getQuoteLocationBreakup() {
    //     let event: LazyLoadEvent = {
    //         first: 0,
    //         rows: 50,
    //         sortField: null,
    //         sortOrder: 1,
    //         filters: {
    //             // @ts-ignore
    //             quoteOptionId: [
    //                 {
    //                     value: this.quoteOptionData._id,
    //                     matchMode: "equals",
    //                     operator: "and"
    //                 }

    //             ],
    //         },
    //     }

    //     let response = await this.quoteLocationBreakupService.getMany(event).toPromise()
    //     return response.data.entities

    // }

    // updateTotals() {
    //     this.totals = this.quoteLocationOccupancy.map((_, locIndex) => {
    //         const columnTotal = this.splitData.reduce((sum, item) => {
    //             const amount = item.amounts[locIndex] || 0;
    //             return sum + amount;
    //         }, 0);
    //         return columnTotal;
    //     });
    // }

    // saveData() {
    //     let currentHeader = '';
    //     let currentSubheader = '';

    //     for (let i = 0; i < this.quoteLocationOccupancy.length; i++) {
    //         const totalForLocation = this.splitData
    //             .filter((item) => !item.isHeader)
    //             .reduce((sum, item) => sum + (item.amounts[i] || 0), 0);
    //         if (totalForLocation != this.quoteLocationOccupancy[i].sumAssured) {

    //             this.messageService.add({
    //                 summary: 'Error',
    //                 detail: `Sum Insured for ${this.quoteLocationOccupancy[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancy[i].pincodeId['name']} should be equal to ${this.quoteLocationOccupancy[i].sumAssured.toLocaleString('en-IN')}`,
    //                 severity: 'error'
    //             })

    //             return
    //         }

    //     }

    //     const payload: any[] = [];
    //     this.splitData.forEach((item) => {
    //         if (item.isHeader) {
    //             if (!currentHeader) {
    //                 currentHeader = item.description;
    //             } else if (!currentSubheader) {
    //                 currentSubheader = item.description;
    //             } else {
    //                 currentHeader = item.description;
    //                 currentSubheader = '';
    //             }

    //         } else {
    //             this.quoteLocationOccupancy.forEach((location, locIndex) => {
    //                 payload.push({
    //                     quoteId: this.quote?._id,
    //                     quoteOptionId: this.quoteOptionData?._id,
    //                     quoteLocationOccupancyId: location?._id,
    //                     lovKey: item.lovKey,
    //                     children: item.description,
    //                     value: item.amounts[locIndex] || 0,
    //                     heading: currentHeader,
    //                     subHeading: currentSubheader || null,
    //                     lovReferences: item.lovReferences,
    //                     __v: 0,
    //                 });
    //             });
    //         }
    //     });
    //     this.quoteLocationBreakupService.quoteOptionBatchUpsert(this.quoteOptionData?._id, {
    //         quoteLocationBreakups: payload
    //     }).subscribe({
    //         next: () => {
    //             this.messageService.add({
    //                 summary: 'Success',
    //                 detail: 'Data saved successfully!',
    //                 severity: 'success',
    //             });
    //             this.ref.close()
    //         },
    //         error: (err) => {
    //             ``
    //             this.messageService.add({
    //                 summary: 'Error',
    //                 detail: 'Failed to save data. Please try again.',
    //                 severity: 'error',
    //             });
    //         },
    //     })

    // }

}
