
import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { CoBrokerFormDialogComponent } from '../co-broker-form-dialog/co-broker-form-dialog.component';
import { ProductService } from "../../../../admin/product/product.service";
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { CoInsuranceFormDialogComponent } from '../co-insurance-form-dialog/co-insurance-form-dialog.component';
import { IProduct } from 'src/app/features/admin/product/product.model';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};
@Component({
    selector: 'app-other-details-form-component',
    templateUrl: './other-details-form-component.component.html',
    styleUrls: ['./other-details-form-component.component.scss']
})

export class OtherDetailsFormComponentComponent implements OnInit {

    @Input() quote: IQuoteSlip
    otherDetailsForm: FormGroup;
    insurerOtherDetailsForm: FormGroup;
    today: string;
    targetPremiumChecked: any;
    quoteSubmissionDates: any;
    AllowedQuoteStates = AllowedQuoteStates;
    isEditable: boolean = true;
    articleType?: string;
    yearOfManufacturing?: string;
    invoiceNumber?: string;
    articleContentValue?: string;
    productData: [];

    private currentQuote: Subscription;
    currentUser$: Observable<IUser>;
    user: IUser;

    private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
    @Input() quoteOptionData: IQuoteOption                                 // New_Quote_Option

    productsList: ILov[] = []
    selectedProduct: ILov[] = []

    constructor(
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private productService: ProductService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private accountService: AccountService,
        private quoteOptionService: QuoteOptionService,

    ) {
        this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                // Old_Quote
                // this.quoteSubmissionDates = this.quote.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')
                // Old_Quote
                // this.targetPremiumChecked = this.quote.targetPremium ?? this.quote?.totalIndictiveQuoteAmt
                // this.createOtherDetailsForm(quote)
                // this.otherDetailsForm.patchValue({
                //     articleType: quote?.articleType,
                //     yearOfManufacturing: quote?.yearOfManufacturing,
                //     invoiceNumber: quote?.invoiceNumber,
                //     articleContentValue: quote?.articleContentValue,
                // });
            }
        })
        this.currentUser$ = this.accountService.currentUser$;

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteSubmissionDates = this.quoteOptionData?.quoteSubmissionDate ? String(dto?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')
                this.targetPremiumChecked = this.quoteOptionData?.targetPremium ?? this.quoteOptionData?.totalIndictiveQuoteAmt
                this.createOtherDetailsForm(dto)
                this.otherDetailsForm.patchValue({
                    articleType: dto?.articleType,
                    yearOfManufacturing: dto?.yearOfManufacturing,
                    invoiceNumber: dto?.invoiceNumber,
                    articleContentValue: dto?.articleContentValue,
                });
            }
        });
    }


    ngOnInit(): void {
        this.currentUser$.subscribe({
            next: user => {
                this.user = user
            }
        });
        if (this.quote.quoteState == AllowedQuoteStates.REJECTED) {
            this.isEditable = false;
        }
        // Old_Quote
        // this.createOtherDetailsForm(this.quote);

        // New_Quote_Option
        this.createOtherDetailsForm(this.quoteOptionData);
        this.createInsurerOtherDetailsForm(this.quoteOptionData);

        this.productService.getACategoryProductMaster().subscribe(
            (response: any) => {
                const data = response.data;
                if (Array.isArray(data.entities)) {
                    this.productData = data.entities.map(item => ({ label: item.shortName, value: item.name }));
                } else {
                    console.error('Invalid data received:', data);
                }
            },
            error => {
                console.error('Error fetching category names:', error);
            }
        );
        this.getAllProducts()
        this.insurerOtherDetailsForm.valueChanges.subscribe(() => {
        this.calculateValues();
        });
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    // Old_Quote
    // createOtherDetailsForm(quote?: IQuoteSlip) {

    //     this.otherDetailsForm = this.formBuilder.group({
    //         // deductiblesExcessPd: [quote?.deductiblesExcessPd, []],
    //         // deductiblesExcessFlop: [quote?.deductiblesExcessFlop, []],
    //         // deductiblesExcessMblop: [quote?.deductiblesExcessMblop, []],
    //         brokerage: [quote?.brokerage, []],
    //         rewards: [quote?.rewards, []],
    //         quoteSubmissionDate: [quote?.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')],
    //         isTargetPremium: [],
    //         targetPremium: [this.quoteOptionData?.targetPremium ?? this.quoteOptionData?.totalIndictiveQuoteAmt, []],
    //         // existingBrokerCurrentYear: [quote?.existingBrokerCurrentYear],
    //         // preferredInsurer: [quote?.preferredInsurer, []],
    //         // otherTerms: [quote?.otherTerms, []],
    //         // additionalInfo: [quote?.additionalInfo, []],
    //         // isCobroker: [quote?.isCobroker],
    //         articleType: [quote?.articleType, []],
    //         yearOfManufacturing: [quote?.yearOfManufacturing, []],
    //         invoiceNumber: [quote?.invoiceNumber, []],
    //         articleContentValue: [quote?.articleContentValue, []],
    //     })

    //     this.otherDetailsForm.controls['targetPremium'].disable()

    //     this.otherDetailsForm.controls['isTargetPremium'].valueChanges.subscribe((value) => {

    //         if (value) {
    //             this.otherDetailsForm.controls['targetPremium'].enable()

    //         } else {
    //             this.otherDetailsForm.controls['targetPremium'].disable()

    //         }
    //     })
    // }

    // New_Quote_Option
    createOtherDetailsForm(quoteOption?: IQuoteOption) {
        this.otherDetailsForm = this.formBuilder.group({
            additionalInformation: [quoteOption?.additionalInformation, []],
            // rewards: [quoteOption?.rewards, []],
            quoteSubmissionDate: [quoteOption?.quoteSubmissionDate ? String(quoteOption?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')],
            isTargetPremium: [],
            targetPremium: [quoteOption?.targetPremium ?? quoteOption?.totalIndictiveQuoteAmt, []],
            articleType: [quoteOption?.articleType, []],
            yearOfManufacturing: [quoteOption?.yearOfManufacturing, []],
            invoiceNumber: [quoteOption?.invoiceNumber, []],
            articleContentValue: [quoteOption?.articleContentValue, []],
            isCobroker: [quoteOption?.isCobroker],
            isCoInsurance: [quoteOption?.isCoInsurer],
            otherBusiness: [quoteOption?.otherBusiness, []],

        })

        this.selectedProduct = quoteOption?.otherBusiness
        this.otherDetailsForm.controls['targetPremium'].disable()

        this.otherDetailsForm.controls['isTargetPremium'].valueChanges.subscribe((value) => {

            if (value) {
                this.otherDetailsForm.controls['targetPremium'].enable()

            } else {
                this.otherDetailsForm.controls['targetPremium'].disable()

            }
        })
    }

    openCobrokerDialog() {
        const ref = this.dialogService.open(CoBrokerFormDialogComponent, {
            header: "Co-Broker Details",
            styleClass: 'customPopup',
            width: '450px',
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData
            }
        })

        ref.onClose.subscribe((data) => {
        });
    }

    openCoinsuranceDialog() {
        const ref = this.dialogService.open(CoInsuranceFormDialogComponent, {
            header: "Co-Insurance Details",
            styleClass: 'customPopup',
            width: '1000px',
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData
            }
        })

        ref.onClose.subscribe((data) => {
        });
    }

    submitOtherDetailsForm() {

        let payload = { ...this.otherDetailsForm.value, articleType: this.otherDetailsForm.value.articleType, yearOfManufacturing: this.otherDetailsForm.value.yearOfManufacturing, invoiceNumber: this.otherDetailsForm.value.invoiceNumber, articleContentValue: this.otherDetailsForm.value.articleContentValue };
        if (!this.otherDetailsForm.value.isCobroker) payload['coBrokers'] = []
        if (!this.otherDetailsForm.value.isCoInsurance) payload['CoInsurance'] = []

        // Old_Quote
        // this.quoteService.update(this.quote._id, payload).subscribe({
        //     next: (dto: IOneResponseDto<IQuoteSlip>) => {

        // New_Quote_Option
        this.quoteOptionService.update(this.quoteOptionData._id, payload).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: 'Saved!',
                    life: 3000
                });
                this.quoteService.refresh();
                this.quoteOptionService.refreshQuoteOption();

            },
            error: (e) => {
                console.log(e)
            }
        })

    }

    isMatchingProductId(): boolean {
        return this.quote.productId['shortName'] === 'BGRP';
    }

    validateInput(event: any) {
        const input = event.target;
        let value = input.value;

        // Allow only numbers and a single decimal point
        const regex = /^\d{0,2}(\.\d{0,2})?$/;

        // Ensure the value does not exceed 99.99
        if (!regex.test(value) || parseFloat(value) > 99.99) {
            value = value.slice(0, -1);
        }

        input.value = value;
        // this.otherDetailsForm.controls['additionalInformation'].setValue(value);
    }
    calculateValues() {
        const premium = this.insurerOtherDetailsForm.get('premium')?.value || 0;
        const premiumBrokerage = this.insurerOtherDetailsForm.get('premiumBrokerage')?.value || 0;
        const terrorismPremium = this.insurerOtherDetailsForm.get('terrorismPremium')?.value || 0;
        const terrorismBrokerage = this.insurerOtherDetailsForm.get('terrorismBrokerage')?.value || 0;
        const brokerageRewards = this.insurerOtherDetailsForm.get('brokerageRewards')?.value || 0;
        const terrorismRewards = this.insurerOtherDetailsForm.get('terrorismRewards')?.value || 0;
    
        // Calculate Brokerage Amount
        const brokerageAmt = (premium * premiumBrokerage) / 100;
        this.insurerOtherDetailsForm.get('brokerageAmt')?.setValue(brokerageAmt, { emitEvent: false });
    
        // Calculate Terrorism Brokerage Amount
        const terrorismBrokerageAmt = (terrorismPremium * terrorismBrokerage) / 100;
        this.insurerOtherDetailsForm.get('terrorismBrokerageAmt')?.setValue(terrorismBrokerageAmt, { emitEvent: false });
    
        // Calculate Total Brokerage
        const totalBrokerage = brokerageAmt + terrorismBrokerageAmt;
        this.insurerOtherDetailsForm.get('totalBrokerage')?.setValue(totalBrokerage, { emitEvent: false });
    
        // Calculate Brokerage Rewards Amount
        const brokerageRewardsAmt = (totalBrokerage * brokerageRewards) / 100;
        this.insurerOtherDetailsForm.get('brokerageRewardsAmt')?.setValue(brokerageRewardsAmt, { emitEvent: false });
    
        // Calculate Terrorism Rewards Amount
        const terrorismRewardsAmt = (terrorismBrokerageAmt * terrorismRewards) / 100;
        this.insurerOtherDetailsForm.get('terrorismRewardsAmt')?.setValue(terrorismRewardsAmt, { emitEvent: false });
    
        // Calculate Total Rewards
        const totalRewards = brokerageRewardsAmt + terrorismRewardsAmt;
        this.insurerOtherDetailsForm.get('totalRewards')?.setValue(totalRewards, { emitEvent: false });
    
        // Calculate Total Brokerage & Rewards
        const totalBrokerageRewards = totalBrokerage + brokerageRewardsAmt;
        this.insurerOtherDetailsForm.get('totalBrokerageRewards')?.setValue(totalBrokerageRewards, { emitEvent: false });
    }

    ngOnChanges() {
        // this.ngOnInit()
    }
    createInsurerOtherDetailsForm(quoteOption?: IQuoteOption) {
        this.insurerOtherDetailsForm = this.formBuilder.group({
            premium: [quoteOption?.premium ?? quoteOption?.premiumDetails?.premium, []],
            premiumBrokerage: [quoteOption?.premiumBrokerage ?? quoteOption?.premiumDetails?.premiumBrokerage, []],
            brokerageAmt: [quoteOption?.brokerageAmt ?? quoteOption?.premiumDetails?.brokerageAmt, []],
            terrorismPremium: [quoteOption?.terrorismPremium ?? quoteOption?.premiumDetails?.terrorismPremium, []],
            terrorismBrokerage: [quoteOption?.terrorismBrokerage ?? quoteOption?.premiumDetails?.terrorismBrokerage, []],
            terrorismBrokerageAmt: [quoteOption?.terrorismBrokerageAmt ?? quoteOption?.premiumDetails?.terrorismBrokerageAmt, []],
            totalBrokerage: [quoteOption?.totalBrokerage ?? quoteOption?.premiumDetails?.totalBrokerage, []],
            brokerageRewards: [quoteOption?.brokerageRewards ?? quoteOption?.premiumDetails?.brokerageRewards, []],
            brokerageRewardsAmt: [quoteOption?.brokerageRewardsAmt ?? quoteOption?.premiumDetails?.brokerageRewardsAmt, []],
            terrorismRewards: [quoteOption?.terrorismRewards ?? quoteOption?.premiumDetails?.terrorismRewards, []],
            terrorismRewardsAmt: [quoteOption?.terrorismRewardsAmt ?? quoteOption?.premiumDetails?.terrorismRewardsAmt, []],
            totalRewards: [quoteOption?.totalRewards ?? quoteOption?.premiumDetails?.totalRewards, []],
            totalBrokerageRewards: [quoteOption?.totalBrokerageRewards ?? quoteOption?.premiumDetails?.totalBrokerageRewards, []],
            isCobroker: [quoteOption?.isCobroker],
        })
    }
    submitInsurerDetailsForm(){
        let payload = {};
        payload['premiumDetails'] = this.insurerOtherDetailsForm.value
        if (!this.otherDetailsForm.value.isCobroker) payload['coBrokers'] = []


        // New_Quote_Option
        this.quoteOptionService.update(this.quoteOptionData._id, payload).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: 'Saved!',
                    life: 3000
                });
                this.quoteService.refresh();
                this.quoteOptionService.refreshQuoteOption()

            },
            error: (e) => {
                console.log(e)
            }
        })
    }

    getAllProducts() {
        this.productService.getMany(DEFAULT_RECORD_FILTER).subscribe({
            next: data => {
                this.productsList = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
            },
            error: e => { }
        });
    }

}

