import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PermissionType, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { BurglaryLocation } from 'src/app/burglarylocation';
import { BurglarylocationService } from 'src/app/burglarylocationservice';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';
import { AllowedRoles, IRole } from '../../admin/role/role.model';
import { IUser } from '../../admin/user/user.model';

@Component({
    selector: 'app-bsc-risk-inspection-status-view-all-loactions-dialog',
    templateUrl: './risk-inspection-status-view-all-loactions-dialog.component.html',
    styleUrls: ['./risk-inspection-status-view-all-loactions-dialog.component.scss']
})
export class RiskInspectionStatusViewAllLoactionsDialogComponent implements OnInit {

    quoteLocationOccupacies: IQuoteLocationOccupancy[];
    uploadHttpHeaders: HttpHeaders;
    uploadUrl: string;
    quote: IQuoteSlip;
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];

    quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private burglarylocationservice: BurglarylocationService,
        public config: DynamicDialogConfig,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private appService: AppService,
        private accountService: AccountService,
        private messageService: MessageService,
        private quoteService: QuoteService,
        private ref: DynamicDialogRef
    ) {
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
        this.quote = this.config.data.quote
        this.quoteOptionData = this.config.data.quoteOptionData               // New_Quote_Option
        this.currentUser$ = this.accountService.currentUser$
    }

    ngOnInit(): void {
        // Not in use
        // this.uploadUrl = this.quoteLocationOccupancyService.uploadQuoteLocationOccupanciesRiskInspectionStatusExcelUrl(this.config.data.quoteId)

        // this.burglarylocationservice.getRiskInspectionStatus().then(data => this.burglaryLocation = data);

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

        // New_Quote_Option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.config.data.quoteOptionData._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.quoteLocationOccupancyService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: (response: IManyResponseDto<IQuoteLocationOccupancy>) => {
                this.quoteLocationOccupacies = response.data.entities;
                // this.bscBurglaryAndHousebreakingCovers = response.data.entities;
            },
            error: e => { }
        });

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
    }


    get riskInspectionBulkImportProps(): PFileUploadGetterProps {
        // Old_Quote
        // return this.quoteLocationOccupancyService.getBulkImportRiskInscpectionProps(this.config.data.quoteId, (dto: IOneResponseDto<IBulkImportResponseDto>) => {

        // New_Quote_Option
        return this.quoteLocationOccupancyService.getBulkImportRiskInscpectionPropsQuoteOptionWise(this.quoteOptionData._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {

            if (dto.status == 'success') {
                this.quoteService.refresh(() => {
                    this.ref.close()
                })
            } else {
                this.messageService.add({
                    severity: 'fail',
                    summary: "Failed to Upload",
                    detail: `${dto.data.entity.errorMessage}`,
                })
                this.appService.downloadFileFromUrl('Risk Inspection Sample Sheet', dto.data.entity.downloadablePath)
            }
        })
    }

    bulkImportGenerateRiskInscpectionSample() {
        // Old_Quote
        // this.quoteLocationOccupancyService.bulkImportGenerateRiskInscpectionSample(this.config.data.quoteId).subscribe({

        // New_Quote_Option
                this.quoteLocationOccupancyService.downloadRiskInscpectionSample(this.quoteOptionData._id).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                console.log(dto)
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl('Risk Inspection Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

}
