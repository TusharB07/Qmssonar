import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PermissionType, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IFloaterCoverAddOn } from 'src/app/features/admin/floater-cover-addon/floater-cover-addon.model';
import { FloaterCoverAddonService } from 'src/app/features/admin/floater-cover-addon/floater-cover-addon.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-floater-cover-addon-dialog',
    templateUrl: './floater-cover-addon-dialog.component.html',
    styleUrls: ['./floater-cover-addon-dialog.component.scss']
})
export class FloaterCoverAddonDialogComponent implements OnInit {
    id: string
    records = [];

    quote: IQuoteSlip;

    covers: IFloaterCoverAddOn[];

    selectedCovers: string[] = [];

    coverForm: FormGroup;

    uploadUrl: string;

    submitted: boolean = false;

    maxSumInsured = 0;
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];
    uploadHttpHeaders: HttpHeaders;
    bscBurglaryAndHousebreakingService: any;


    constructor(
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private activatedRoute: ActivatedRoute,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private floaterAddonService: FloaterCoverAddonService,
        private appService: AppService,
        private messageService: MessageService,
        private accountService: AccountService,
        private quoteService: QuoteService,
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id")
        this.quote = this.config.data.quote;
        console.log(this.quote);

        this.covers = this.config.data.covers
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

        this.currentUser$ = this.accountService.currentUser$
    }


    createFormGroup(items?) {

        console.log(items)

        this.coverForm = this.fb.group({
            formArray: this.fb.array(items ? items?.map((item) => this.createForm(item)) : [])
        })
    }

    createForm(item?): FormGroup {

        if (item?.stockValue && item?.stockValue > this.maxSumInsured) {
            this.maxSumInsured = item?.stockValue;
        }

        let form = this.fb.group({
            floaterId: [item.floaterId],
            selected: [item?.selected],
            quoteLocationOccupancyId: [item?.quoteLocationOccupancyId],
            locationName: [item?.locationName],
            whetherStockStoredInOpen: [item?.whetherStockStoredInOpen == 'Yes' ? 'Yes' : 'No'],
            stockValue: [item?.stockValue],
            sumInsured: [item?.sumInsured],
        })

        // form.controls['selected'].valueChanges.subscribe((value) => {
        //     form.controls['sumInsured'].setValue(value ? this.maxSumInsured : null);

        // })

        return form
    }

    get formArray(): FormArray {
        return this.coverForm.get("formArray") as FormArray;
    }

    ngOnInit(): void {
        this.uploadUrl = `${environment.apiUrl}/bsc-burglary-housebreaking-cover/import-data/${this.config.data.quoteId}`

        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })



        this.uploadUrl = this.floaterAddonService.uploadFloaterExcelUrl(this.quote._id);

        this.floaterAddonService.getAllFloater({
            quoteId: this.quote._id
        }).subscribe({
            next: (dto: IManyResponseDto<any>) => {
                console.log(dto)
                this.createFormGroup(dto.data.entities);

            }
        })

        this.createFormGroup();


        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.config.data.quote._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };


        this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {

                // console.log('data', dto.data.entities)
                // dto.data.entities.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {

                //     // this.selectedCovers[quoteLocationOccupancy._id] = true
                // })
                // console.log(this.selectedCovers)

                // let records = [];

                // dto.data.entities.map((quotelocationOccupancy: IQuoteLocationOccupancy) => {


                //     let cover = this.covers.find((cover: IFloaterCoverAddOn) => cover.quoteLocationOccupancyId == quotelocationOccupancy._id)

                //     // if (cover?.quoteLocationOccupancyId == quotelocationOccupancy?._id) {
                //     //     this.selectedCovers.push(quotelocationOccupancy._id)
                //     // }

                //     const record = {
                //         quoteLocationOccupancyId: quotelocationOccupancy._id,
                //         selected: cover?.quoteLocationOccupancyId == quotelocationOccupancy?._id,
                //         locationName: `${quotelocationOccupancy.clientLocationId['locationName']} - ${quotelocationOccupancy.pincodeId['name']}`,
                //         stockStoredInOpen: cover?.whetherStockStoredInOpen == 'Yes' ? 'Yes' : 'No',
                //         stockValue: cover?.stockValue,
                //         sumInsured: cover?.sumInsured,
                //     }

                //     // this.formArray.push(this.createForm());

                //     records.push(record);
                // })

                // this.createFormGroup(records);
            }
        })
    }
    submit() {
        console.log(this.formArray.value)
        const payload = {
            quoteId: this.config.data.quote._id,
            covers: [...this.formArray.value]
        }

        // const payload = {
        //     quoteLocationOccupancyIdArray: this.selectedCovers,
        //     quoteId: this.config.data.quote._id
        // }

        this.floaterAddonService.setAllFloater(payload).subscribe({
            next: (dto) => {
                console.log(dto)
                this.quoteService.refresh()
                this.ref.close(dto.data.entity);
            }
        })
    }

    downloadSampleFile() {
        this.floaterAddonService.downloadFloaterExcel(this.quote._id).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }


    fileUploaded($event: any) {

        let response = $event.originalEvent.body;
        this.covers = response.data.entities;
    }





    get bulkImportProps(): PFileUploadGetterProps {
        return this.floaterAddonService.getBulkImportProps(this.config.data.quote._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                this.quoteService.refresh()
                this.ref.close(dto.data.entity)
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
        this.floaterAddonService.bulkImportGenerateSample(this.config.data.quote._id).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                console.log('quoteid>>>>', dto)
                if (dto.status == 'success') {

                    // Download the sample file
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }




    cancel() {
        this.ref.close();
    }

    submitForm() {

    }
}
