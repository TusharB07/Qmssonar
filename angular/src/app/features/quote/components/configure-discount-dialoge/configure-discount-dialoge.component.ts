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
import { IQuoteDiscount } from './configure-discount-dialoge.model';
import { ConfigureDiscountDialogeService } from './configure-discount-dialoge.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { ProductPartnerIcConfigurationService } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-configure-discount-dialoge',
    templateUrl: './configure-discount-dialoge.component.html',
    styleUrls: ['./configure-discount-dialoge.component.scss']
})
export class ConfigureDiscountDialogeComponent implements OnInit, OnDestroy {
    id: string;

    configureDiscountForm: FormGroup;
    quote: IQuoteSlip;
    private currentQuote: Subscription;
    discountId: string;
    discountPercentage = 0;
    discountFrom = 0;
    discountTo = 100;

    totalIndictiveQuoteAmt = 0;

    afterDiscountAmount = 0
    discountCover;

    permissions: PermissionType[] = [];

    quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private formBuilder: FormBuilder,
        // private quoteService: QuoteService,
        public ref: DynamicDialogRef,
        public quoteService: QuoteService,
        public config: DynamicDialogConfig,
        private configureDiscountDialogeService: ConfigureDiscountDialogeService,
        private bscCoverService: ProductPartnerIcConfigurationService,
        private accountService: AccountService,
        private messageService: MessageService
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote;

            }
        })
        // this.quote = this.config.data.quote;
        this.quoteOptionData = this.config.data.quoteOptionData;


    }
    ngOnInit(): void {
        this.createForm();
        let disRules = this.quote.productPartnerIcConfigurations[0].productPartnerIcConfigurationId.discountRules;
        this.discountFrom = disRules.discountFrom as number;
        this.discountTo = disRules.discountTo as number;

        this.configureDiscountDialogeService.getQuoteDiscounts({ quoteOptionId: this.config.data.quoteOptionId}).subscribe({
            next: (dto: IOneResponseDto<any>) => {
                if (dto.data?.entity?._id) {
                    this.discountId = dto.data?.entity?._id
                }
                this.createForm(dto.data.entity);
            },
            error: e => {
                console.log(e);
            }
        });


        this.accountService.currentUser$.subscribe({
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

    createForm(item?: IQuoteDiscount) {

        this.discountPercentage = item?.discountPercentage ?? 0
        this.totalIndictiveQuoteAmt = item?.totalIndictiveQuoteAmt;
        // this.discountFrom = this.quote.otcType == AllowedOtcTypes.NONOTC ? 0 :(item?.discountFrom ?? 20)
        // this.discountTo = this.quote.otcType == AllowedOtcTypes.NONOTC ? 100 : (item?.discountTo ?? 50)
        this.discountFrom = item?.discountFrom ?? 0;
        this.discountTo = item?.discountTo ?? 100;

        this.configureDiscountForm = this.formBuilder.group({
            discountedAmount: [item?.discountedAmount ?? 0, []],
            totalIndictiveQuoteAmt: [item?.totalIndictiveQuoteAmt ?? 0, []],
            afterDiscountAmount: [item?.afterDiscountAmount ?? 0, []],

        })
    }


    discountPercentageUpdated($value) {
        this.configureDiscountForm.controls['discountedAmount'].setValue((this.configureDiscountForm.controls['totalIndictiveQuoteAmt'].value * $value) / 100)
        this.configureDiscountForm.controls['afterDiscountAmount'].setValue((this.configureDiscountForm.controls['totalIndictiveQuoteAmt'].value) - (this.configureDiscountForm.controls['discountedAmount'].value))
    }

    submitConfigueDiscount() {
        if (this.configureDiscountForm?.valid) {
            if (this.discountId) {
                const payload = { ...this.configureDiscountForm.value };
                payload["discountPercentage"] = this.discountPercentage;
                payload["discountFrom"] = this.discountFrom;
                payload["discountTo"] = this.discountTo;
                // payload["discountedAmount"] = `${payload["discountedAmount"]}`;
                payload['quoteId'] = this.quote._id;
                payload['quoteOptionId'] = this.config.data.quoteOptionId;                          // New_Quote_Option

                this.configureDiscountDialogeService.update(this.discountId, payload).subscribe({
                    next: (response: IOneResponseDto<IQuoteDiscount>) => {
                        console.log(response.data.entity)
                        this.quoteService.refresh()
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
                const payload = { ...this.configureDiscountForm.value };
                payload["discountPercentage"] = this.discountPercentage;
                payload["discountFrom"] = this.discountFrom;
                payload["discountTo"] = this.discountTo;
                // payload["discountedAmount"] = `${payload["discountedAmount"]}`;
                payload['quoteId'] = this.quote._id;
                payload['quoteOptionId'] = this.config.data.quoteOptionId;                           // New_Quote_Option
                this.configureDiscountDialogeService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IQuoteDiscount>) => {
                        console.log(response.data.entity)
                        this.quoteService.refresh()
                        this.messageService.add({
                            severity: "success",
                            summary: "Successful",
                            detail: `Saved!`,
                            life: 3000
                        });
                        this.ref.close();
                    },
                    error: error => {
                        //   console.log(error);
                    }
                });
            }
        }
    }

    removeDiscount() {
        this.configureDiscountDialogeService.delete(this.discountId).subscribe(data => {
            console.log(data)
            this.quoteService.refresh()
            this.ref.close()
        })
    }

    ngOnDestroy() {
    }

}



