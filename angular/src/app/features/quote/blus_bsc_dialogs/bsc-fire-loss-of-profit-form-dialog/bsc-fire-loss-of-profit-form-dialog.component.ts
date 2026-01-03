import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { ToWords } from 'to-words';
import { AccountService } from '../../../account/account.service';
import { IBscFireLossOfProfitCover } from '../../../admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { BscFireLossOfProfitService } from '../../../admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.service';
import { IQuoteLocationOccupancy } from '../../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from '../../../admin/quote/quote.model';
import { IRole, AllowedRoles } from '../../../admin/role/role.model';
import { IUser } from '../../../admin/user/user.model';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'app-bsc-fire-loss-of-profit-form-dialog',
    templateUrl: './bsc-fire-loss-of-profit-form-dialog.component.html',
    styleUrls: ['./bsc-fire-loss-of-profit-form-dialog.component.scss']
})
export class BscFireLossOfProfitFormDialogComponent implements OnInit {
    fireLossOfProfitForm: FormGroup;
    selectedIndmenityPeriod: string = '';
    selectedTerrorism: string = '';

    toWords = new ToWords;

    optionsTerrorism: any[];
    optionsIndmenityPeriod: ILov[];

    bscFireLossOfProfit: IBscFireLossOfProfitCover;

    submitted: boolean = false;

    quote: IQuoteSlip;
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];
    optionsEquipmentType: any[] = [];
    max: any = 0;
    min: any = 0;
    maxNSTP: any = 0;
    minNSTP: any = 0;
    // @Input() permissions: PermissionType[] = []

    @ViewChild('fileUpload') fileUpload!: FileUpload;

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private bscFireLossOfProfitService: BscFireLossOfProfitService,
        private accountService: AccountService,
        private bscCoverService: BscCoverService
    ) {
        this.optionsIndmenityPeriod = [
            { label: '03 Months', value: '03 Months' },
            { label: '06 Months', value: '06 Months' },
            { label: '09 Months', value: '09 Months' },
            { label: '12 Months', value: '12 Months' },
            { label: '18 Months', value: '18 Months' },
        ];
        this.optionsTerrorism = [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
        ];

        this.bscFireLossOfProfit = this.config.data.bscFireLossOfProfitCover;
        this.quote = this.config.data.quote;
        this.currentUser$ = this.accountService.currentUser$

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.searchOptionsEquipmentTypes();
        this.createForm(this.bscFireLossOfProfit);

        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM || this.quote?.quoteState == AllowedQuoteStates.REJECTED) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })
    }


    deletefile(e) {
        if (this.bscFireLossOfProfit._id) {
            let payload = {}
            payload['filePath'] = this.bscFireLossOfProfit.filePath
            payload['_id'] = this.bscFireLossOfProfit._id
            this.bscFireLossOfProfitService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscFireLossOfProfit)
                }
            })
        }
    }

    createForm(item?: IBscFireLossOfProfitCover) {

        this.fireLossOfProfitForm = this.formBuilder.group({
            _id: [item?._id],
            grossProfit: [item?.grossProfit ?? 0, [Validators.required, Validators.min(1)]],
            indmenityPeriod: [item?.indmenityPeriod ?? '12 Months', [Validators.required]],
            terrorism: [true, [Validators.required]],
            // auditorsFees: [item?.auditorsFees ?? 0, [Validators.required, Validators.min(1)]],          
            fileInput: [item?.filePath]

        })
    }

    submitFireLossOfProfit() {
        if (this.fireLossOfProfitForm.valid) {

            const payload = { ...this.fireLossOfProfitForm.value }
            let bscFormData = new FormData();
            bscFormData.append("grossProfit", payload['grossProfit']);
            bscFormData.append("indmenityPeriod", payload['indmenityPeriod']);
            bscFormData.append("terrorism", payload['terrorism']);
            // bscFormData.append("auditorsFees", payload['auditorsFees']);
            bscFormData.append("quoteId", this.config.data.quoteId)
            bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                   // New_Quote_option
            bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
            bscFormData.append("file", payload['fileInput']);

            // this.bscFireLossOfProfitService.create(bscFormData).subscribe({
            //     next: (response: IOneResponseDto<IBscFireLossOfProfitCover>) => {

            //         this.bscFireLossOfProfit = response.data.entity
            //         this.ref.close(this.bscFireLossOfProfit);
            //     },
            //     error: error => {
            //         console.log(error);
            //     }
            // });

            if (this.bscFireLossOfProfit?._id) {
                const payload = { ...this.fireLossOfProfitForm.value }

                this.bscFireLossOfProfitService.update(payload._id, bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscFireLossOfProfitCover>) => {

                        this.bscFireLossOfProfit = response.data.entity
                        this.ref.close(this.bscFireLossOfProfit);
                    },
                    error: error => {
                        console.log(error);
                    }
                });


            } else {
                const payload = { ...this.fireLossOfProfitForm.value }

                payload['quoteId'] = this.config.data.quoteId;
                payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option

                this.bscFireLossOfProfitService.create(bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscFireLossOfProfitCover>) => {

                        this.bscFireLossOfProfit = response.data.entity
                        this.ref.close(this.bscFireLossOfProfit);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

    cancel() {
        this.ref.close();
    }

    isFile(val): boolean {
        return typeof val === 'object';
    }

    onBasicUpload(e) {
        this.fireLossOfProfitForm.value.fileInput = e.currentFiles[0]
    }

    isUrl(val): boolean { return typeof val === 'string'; }

    downloadFile() {
        this.bscCoverService.downloadExcel(this.bscFireLossOfProfit?.filePath).subscribe(res => {

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
    searchOptionsEquipmentTypes() {
        this.bscCoverService.getAllCover().subscribe({
            next: data => {
                data.data.entities.map((ele) => {
                    if (ele.productId == this.quote.productId['_id']) {
                        if (ele.bscType == 'fire_loss_of_profit') {
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


