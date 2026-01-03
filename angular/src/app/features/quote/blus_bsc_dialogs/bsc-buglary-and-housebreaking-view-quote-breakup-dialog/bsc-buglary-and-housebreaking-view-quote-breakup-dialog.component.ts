import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto, PermissionType, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { BurglaryLocation } from 'src/app/burglarylocation';
import { BurglarylocationService } from 'src/app/burglarylocationservice';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { BscBurglaryAndHousebreakingService } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-bsc-buglary-and-housebreaking-view-quote-breakup-dialog',
    templateUrl: './bsc-buglary-and-housebreaking-view-quote-breakup-dialog.component.html',
    styleUrls: ['./bsc-buglary-and-housebreaking-view-quote-breakup-dialog.component.scss']
})
export class BscBuglaryAndHousebreakingViewQuoteBreakupDialogComponent implements OnInit {

    // bscBurglaryHousebreakingCovers: IBscBurglaryHousebreakingCover[];

    quote: IQuoteSlip;
    quoteLocationOccupacies: IQuoteLocationOccupancy[];
    bscBurglaryAndHousebreakingCovers: IBscBurglaryHousebreakingCover[] = [];

    uploadHttpHeaders: HttpHeaders;
    uploadUrl: string;
    currentUser$: Observable<IUser>;
    isMobile: boolean = false;
    permissions: PermissionType[] = [];

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private bscBurglaryAndHousebreakingService: BscBurglaryAndHousebreakingService,
        public config: DynamicDialogConfig,
        private appService: AppService,
        private messageService: MessageService,
        private accountService: AccountService,
        private quoteService: QuoteService,
        private ref: DynamicDialogRef,
        private deviceService: DeviceDetectorService
    ) {
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
        this.currentUser$ = this.accountService.currentUser$
        this.quote = this.config.data.quote;

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit() {
        this.isMobile = this.deviceService.isMobile();
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })


        this.uploadUrl = `${environment.apiUrl}/bsc-burglary-housebreaking-cover/import-data/${this.config.data.quoteId}`
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 20,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.config.data.quoteId,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }
        //         ]
        //     },
        //     globalFilter: null,
        //     multiSortMeta: null
        // };

        // New_Quote_option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.config.data.quoteOption._id,
                        matchMode: "equals",
                        operator: "and"
                    }

                ],
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.bscBurglaryAndHousebreakingService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: (response: IManyResponseDto<IBscBurglaryHousebreakingCover>) => {
                response.data.entities.map((cover: IBscBurglaryHousebreakingCover) => {
                    this.bscBurglaryAndHousebreakingCovers[cover.quoteLocationOccupancyId['_id']] = cover;
                })
            },
            error: e => { }
        });

        this.quoteLocationOccupancyService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: (response: IManyResponseDto<IQuoteLocationOccupancy>) => {
                this.quoteLocationOccupacies = response.data.entities;
            },
            error: e => { }
        });
    }

    // Upload Download Version 2 --------------------------------------------------------------------------------------------------- START
    get bulkImportProps(): PFileUploadGetterProps {
        // Old_Quote
        // return this.bscBurglaryAndHousebreakingService.getBulkImportProps(this.config.data.quoteId, (dto: IOneResponseDto<IBulkImportResponseDto>) => {

        // New_Quote_Option
        return this.bscBurglaryAndHousebreakingService.getBulkImportProps(this.config.data.quoteOption._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                this.quoteService.refresh(() => {
                    this.ref.close();
                })
            } else {
                this.messageService.add({
                    severity: 'fail',
                    summary: "Failed to Upload",
                    detail: `${dto.data.entity.errorMessage}`,
                })
                this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

            }


        })
    }

    bulkImportGenerateSample() {
        // Old_Quote
        // this.bscBurglaryAndHousebreakingService.bulkImportGenerateSample(this.config.data.quoteId).subscribe({

        // New_Quote_Option
            this.bscBurglaryAndHousebreakingService.bulkImportGenerateSample(this.config.data.quoteOption._id).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    errorHandler(e, uploader: FileUpload) {
        uploader.remove(e, 0)
    }

}
