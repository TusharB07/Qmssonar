import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IBscMoneyTransitCover } from 'src/app/features/admin/bsc-money-transit/bsc-money-transit.model';
import { BscMoneyTransitService } from 'src/app/features/admin/bsc-money-transit/bsc-money-transit.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-bsc-money-in-transit-form-dialog',
    templateUrl: './bsc-money-in-transit-form-dialog.component.html',
    styleUrls: ['./bsc-money-in-transit-form-dialog.component.scss']
})
export class BscMoneyInTransitFormDialogComponent implements OnInit {
    moneyInTransitForm: FormGroup;
    submitted: boolean = false;
    totalPremium: number = 50000;
    bscMoneyInTransit: IBscMoneyTransitCover;
    quote: IQuoteSlip;

    toWords = new ToWords();
    currentUser$: Observable<IUser>;

    permissions: PermissionType[] = [];
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
        private bscMoneyTransitService: BscMoneyTransitService,
        private accountService: AccountService,
        private bscCoverService: BscCoverService
    ) {
        this.bscMoneyInTransit = this.config.data.bscMoneyTransitCover;
        this.quote = this.config.data.quote;
        this.currentUser$ = this.accountService.currentUser$

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.searchOptionsEquipmentTypes();
        this.createForm(this.bscMoneyInTransit);

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
    createForm(item?: IBscMoneyTransitCover) {
        this.moneyInTransitForm = this.fb.group({
            _id: [item?._id],
            transitFrom: [item?.transitFrom ? item?.transitFrom : 'Anywhere in India', [Validators.required]],
            transitTo: [item?.transitTo ? item?.transitTo : 'Anywhere in India', [Validators.required]],
            singleCarryingLimit: [item?.singleCarryingLimit ?? 0, [Validators.required, Validators.min(1)]],
            // annualTurnover: [item?.annualTurnover ?? 0, [Validators.required, Validators.min(1),]]
            fileInput: [item?.filePath]
        })
    }

    submitMoneyInTransitForm() {
        if (this.moneyInTransitForm.valid) {
            const payload = { ...this.moneyInTransitForm.value }
            let bscFormData = new FormData();
            bscFormData.append("transitFrom", payload['transitFrom']);
            bscFormData.append("transitTo", payload['transitTo']);
            bscFormData.append("singleCarryingLimit", payload['singleCarryingLimit']);
            // bscFormData.append("annualTurnover", payload['annualTurnover']);
            bscFormData.append("quoteId", this.config.data.quoteId)
            bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
            bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
            bscFormData.append("file", payload['fileInput']);

            /*  this.bscMoneyTransitService.create(bscFormData).subscribe({
                 next: (response: IOneResponseDto<IBscMoneyTransitCover>) => {
                     this.bscMoneyInTransit = response.data.entity;
                     this.ref.close(this.bscMoneyInTransit);
                 },
                 error: error => {
                     console.log(error);
                 }
             }); */
            if (this.bscMoneyInTransit) {
                const payload = { ...this.moneyInTransitForm.value }

                this.bscMoneyTransitService.update(this.bscMoneyInTransit?._id, bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscMoneyTransitCover>) => {
                        this.bscMoneyInTransit = response.data.entity
                        this.ref.close(this.bscMoneyInTransit);
                    },
                    error: error => {
                        console.log(error);
                    }
                });

            } else {
                let payload = { ...this.moneyInTransitForm.value }

                payload['quoteId'] = this.config.data.quoteId;
                payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
                this.bscMoneyTransitService.create(bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscMoneyTransitCover>) => {
                        this.bscMoneyInTransit = response.data.entity;
                        this.ref.close(this.bscMoneyInTransit);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

    downloadFile() {
        this.bscCoverService.downloadExcel(this.bscMoneyInTransit?.filePath).subscribe(res => {

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

    deletefile(e) {

        if (this.bscMoneyInTransit._id) {
            let payload = {}
            payload['filePath'] = this.bscMoneyInTransit.filePath
            payload['_id'] = this.bscMoneyInTransit._id
            this.bscMoneyTransitService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscMoneyInTransit)
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
        this.moneyInTransitForm.value.fileInput = e.currentFiles[0]
    }
    searchOptionsEquipmentTypes() {
        this.bscCoverService.getAllCover().subscribe({
            next: data => {
                data.data.entities.map((ele) => {
                    if (ele.productId == this.quote.productId['_id']) {
                        if (ele.bscType == 'money_in_transit') {
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
