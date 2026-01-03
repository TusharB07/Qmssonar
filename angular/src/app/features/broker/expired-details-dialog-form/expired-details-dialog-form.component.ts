import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { FormMode, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
// import { IQuoteDiscount } from './configure-discount-dialoge.model';
// import { ConfigureDiscountDialogeService } from './configure-discount-dialoge.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { ProductPartnerIcConfigurationService } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IExpiredDetails } from './expired-details-dialog-form.model';
import { ExpiredDetailsDialogFormService } from './expired-details-dialog-form.service';
import { QuoteOptionService } from '../../admin/quote/quoteOption.service';

@Component({
    selector: 'app-expired-details-dialog-form',
    templateUrl: './expired-details-dialog-form.component.html',
    styleUrls: ['./expired-details-dialog-form.component.scss']
})

export class ExpiredDetailsDialogForm implements OnInit {

    expiredDetailsForm!: FormGroup;
    quote: IQuoteSlip;
    quoteOptionId: string                                           // New_Quote_Option
    expiredDetailsData: IExpiredDetails

    constructor(
        private formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private accountService: AccountService,
        private messageService: MessageService,
        private expiredDetailsDialogFormService: ExpiredDetailsDialogFormService,
        public quoteService: QuoteService,
    ) {
        this.quote = this.config.data.quote
        this.quoteOptionId = this.config.data.quoteOptionId
    }

    ngOnInit(): void {
        this.getExpiredDetails()
        this.createForm()
    }

    createForm(item?: IExpiredDetails) {

        this.expiredDetailsForm = this.formBuilder.group({
            expiringIsurenceName: [item?.expiringIsurenceName, []],
            expiringIsurenceOffice: [item?.expiringIsurenceOffice, []],
            expiringPolicyNumber: [item?.expiringPolicyNumber, []],
            expiringPolicyPeriod: [item?.expiringPolicyPeriod, []],

        })
    }

    submitExpiredDetails() {

        if (this.expiredDetailsForm.valid) {
            if (this.expiredDetailsData != undefined) {
                const payload = { ...this.expiredDetailsForm.value }
                payload["quoteId"] = this.quote._id
                payload["quoteOptionId"] = this.quoteOptionId

                this.expiredDetailsDialogFormService.update(this.expiredDetailsData._id, payload).subscribe({
                    next: (response: IOneResponseDto<IExpiredDetails>) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: `Saved!`,
                            life: 3000
                        });
                        this.ref.close();
                    }, error: error => {
                    }
                });
            } else {
                const payload = { ...this.expiredDetailsForm.value }
                payload["quoteId"] = this.quote._id
                payload["quoteOptionId"] = this.quoteOptionId

                this.expiredDetailsDialogFormService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IExpiredDetails>) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: `Saved!`,
                            life: 3000
                        });
                        this.ref.close();
                    }, error: error => {
                    }
                });
            }
        }

    }

    getExpiredDetails() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.expiredDetailsDialogFormService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IOneResponseDto<IExpiredDetails>) => {
                if (dto.data?.entities[0]?._id) {
                    this.expiredDetailsData = dto.data?.entities[0]
                }
                this.createForm(dto.data.entities[0]);
            },
            error: e => {
                console.log(e);
            }
        });
    }

}