import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IBscMoneySafeTillCover } from 'src/app/features/admin/bsc-money-safe-till/bsc-money-safe-till.model';
import { BscMoneySafeTillService } from 'src/app/features/admin/bsc-money-safe-till/bsc-money-safe-till.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IOccupancyRate } from 'src/app/features/admin/occupancy-rate/occupancy-rate.model';
import { OccupancyRateService } from 'src/app/features/admin/occupancy-rate/occupancy-rate.service';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-bsc-money-in-safe-till-form-dialog',
    templateUrl: './bsc-money-in-safe-till-form-dialog.component.html',
    styleUrls: ['./bsc-money-in-safe-till-form-dialog.component.scss']
})
export class BscMoneyInSafeTillFormDialogComponent implements OnInit {
    moneyInSafeTillForm: FormGroup;

    submitted: boolean = false;

    selectedQuoteLocationOccpancy;
    optionsQuoteLocationOccupancies: ILov[];

    bscMoneySafeTillCover: IBscMoneySafeTillCover;

    optionsOccpanies: ILov[];
    selectedOccupancy;
    quote: IQuoteSlip;

    toWords = new ToWords();
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = []
    optionsEquipmentType: any[] = [];
    max: any = 0;
    min: any = 0;
    maxNSTP: any = 0;
    minNSTP: any = 0;

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private bscMoneySafeTillService: BscMoneySafeTillService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private occpancyService: OccupancyRateService,
        private accountService: AccountService,
        private bscCoverService: BscCoverService,
        private messageService: MessageService
    ) {
        this.bscMoneySafeTillCover = this.config.data.bscMoneySafeTillCover;
        this.quote = this.config.data.quote;
        /* this.cities = [
          {name: 'New York', code: 'NY'},
          {name: 'Rome', code: 'RM'},
          {name: 'London', code: 'LDN'},
          {name: 'Istanbul', code: 'IST'},
          {name: 'Paris', code: 'PRS'}
      ]; */
        this.currentUser$ = this.accountService.currentUser$

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.searchOptionsEquipmentTypes();
        this.createFrom(this.bscMoneySafeTillCover);
        this.searchOptionsQuoteLocationOccpancies();
        this.searchOptionsOccpancies();

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

    searchOptionsQuoteLocationOccpancies() {

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

        this.quoteLocationOccupancyService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: data => {
                // console.log(data)
                this.optionsQuoteLocationOccupancies = data.data.entities.map((entity: IQuoteLocationOccupancy) => {
                    let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation
                    let occupancy: IOccupancyRate = entity.occupancyId as IOccupancyRate;
                    let pincode: IPincode = entity.pincodeId as IPincode

                    // return { label: `${clientLocation?.locationName} - ${occupancy.occupancyType}`, value: clientLocation._id }
                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id }

                });
                // this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.clientLocationId)[0];
                this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.quoteLocationOccupancyId)[0];
            },
            error: e => { }
        });

    }

    searchOptionsOccpancies() {
        this.occpancyService.getManyAsLovs({}).subscribe({
            next: data => {
                this.optionsOccpanies = data.data.entities.map((entity: IOccupancyRate) => ({ label: entity.occupancyType, value: entity._id }));
                // this.selectedOccupancy = this.optionsOccpanies.filter(occupancy => occupancy.value === this.config.data.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId)[0];         // Old_Quote
                this.selectedOccupancy = this.optionsOccpanies.filter(occupancy => occupancy.value === this.config.data.quoteOption?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId)[0];         // New_Quote_option
            },
            error: e => { }
        });
    }

    createFrom(item: IBscMoneySafeTillCover) {

        const occupancy = item?.occupancyId as IOccupancyRate;

        this.moneyInSafeTillForm = this.fb.group({
            _id: [item?._id],
            // occupancyId: [{ label: this.config.data.occupancy.occupancyType, value: this.config.data.occupancy?._id }],
            moneySafe: [item?.moneySafe ?? 0, []],
            moneyTillCounter: [item?.moneyTillCounter ?? 0, []],
            fileInput: [item?.filePath]
        })
    }

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscMoneySafeTillCover?.filePath).subscribe(res => {

            let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';

            const a = document.createElement('a')
            const blob = new Blob([res.body], { type: res.headers.get('content-type') });
            const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
            const objectUrl = window.URL.createObjectURL(file);

            a.href = objectUrl
            a.download = fileName;
            a.click();

            // window.open(objectUrl, '_blank');
            URL.revokeObjectURL(objectUrl);

        })
    }

    submitMoneyInSafeForm() {
        if (this.moneyInSafeTillForm.valid) {
            if (this.moneyInSafeTillForm.value.moneySafe || this.moneyInSafeTillForm.value.moneyTillCounter) {
                const payload = { ...this.moneyInSafeTillForm.value }
                let bscFormData = new FormData();
                bscFormData.append("moneySafe", payload['moneySafe'] ?? 0);
                bscFormData.append("moneyTillCounter", payload['moneyTillCounter'] ?? 0);
                bscFormData.append("quoteId", this.config.data.quoteId)
                bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
                bscFormData.append("quoteLocationOccupancyId", this.config.data.quoteLocationOccupancyId)
                bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
                bscFormData.append("file", payload['fileInput']);

                /* this.bscMoneySafeTillService.create(bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscMoneySafeTillCover>) => {
                        // success code
                        this.bscMoneySafeTillCover = response.data.entity
                        this.ref.close(this.bscMoneySafeTillCover);
                    },
                    error: error => {
                        console.log(error);
                    }
                }); */
                if (this.bscMoneySafeTillCover?._id) {
                    const payload = { ...this.moneyInSafeTillForm.value };

                    // console.log(payload);

                    // delete (payload['occupancyId'])

                    this.bscMoneySafeTillService.update(this.bscMoneySafeTillCover?._id, bscFormData).subscribe({
                        next: (response: IOneResponseDto<IBscMoneySafeTillCover>) => {
                            // success code
                            this.bscMoneySafeTillCover = response.data.entity
                            this.ref.close(this.bscMoneySafeTillCover);
                        },
                        error: error => {
                            console.log(error);
                        }
                    });

                } else {
                    let payload = { ...this.moneyInSafeTillForm.value };

                    payload['quoteId'] = this.config.data.quoteId;
                    payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
                    // payload['clientLocationId'] = this.config.data.clientLocationId;
                    payload['quoteLocationOccupancyId'] = this.config.data.quoteLocationOccupancyId;
                    // payload['occupancyId'] = this.config.data.occupancy?._id;


                    this.bscMoneySafeTillService.create(bscFormData).subscribe({
                        next: (response: IOneResponseDto<IBscMoneySafeTillCover>) => {
                            // success code
                            this.bscMoneySafeTillCover = response.data.entity
                            this.ref.close(this.bscMoneySafeTillCover);
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
            }
            else {
                this.messageService.add({
                    key: "error",
                    severity: "error",
                    detail: "Money in Safe or Money in Till/Counter should have value"
                })
            }
        }
    }

    deletefile(e) {

        if (this.bscMoneySafeTillCover._id) {
            let payload = {}
            payload['filePath'] = this.bscMoneySafeTillCover.filePath
            payload['_id'] = this.bscMoneySafeTillCover._id
            this.bscMoneySafeTillService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscMoneySafeTillCover)
                }
            })
        }
    }

    cancel() {
        this.ref.close();
    }

    isFile(val): boolean {
        return typeof val === 'object';
    }

    onBasicUpload(e) {
        this.moneyInSafeTillForm.value.fileInput = e.currentFiles[0]
    }
    searchOptionsEquipmentTypes() {
        this.bscCoverService.getAllCover().subscribe({
            next: data => {
                data.data.entities.map((ele) => {
                    if (ele.productId == this.quote.productId['_id']) {
                        if (ele.bscType == 'money_in_safe_till') {
                            this.max = ele.toSI
                            this.min = ele.fromSI
                            this.maxNSTP = ele.maxNstp
                        }
                    }
                })
            },
            error: e => {
                console.log(e);
            }
        });
    }
}

