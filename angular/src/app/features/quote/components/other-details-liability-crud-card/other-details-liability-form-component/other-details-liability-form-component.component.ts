
import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import {ProductService} from "../../../../admin/product/product.service";
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { CoBrokerLiabilityFormDialogComponent } from '../co-broker-liability-form-dialog/co-broker-liability-form-dialog.component';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
  selector: 'app-other-details-liability-form-component',
  templateUrl: './other-details-liability-form-component.component.html',
  styleUrls: ['./other-details-liability-form-component.component.scss']
})
export class OtherDetailsLiabilityFormComponent implements OnInit {
  @Input() quote: IQuoteSlip
    otherDetailsForm: FormGroup;
    today: string;
    targetPremiumChecked: any;
    quoteSubmissionDates: any;
    AllowedQuoteStates = AllowedQuoteStates;
    isEditable: boolean = true;
    articleType?: string;
    yearOfManufacturing?: string;
    invoiceNumber?: string;
    articleContentValue?: string;
    productData:[];

    private currentQuote: Subscription;
    currentUser$: Observable<IUser>;
    user : IUser;
        constructor(
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private productService : ProductService,
        private messageService : MessageService,
        private dialogService: DialogService,
        private accountService: AccountService,
    ) {
        this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                this.quoteSubmissionDates = this.quote.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')
                this.targetPremiumChecked =this.quote.targetPremium?? this.getPremiumValue();
                this.createOtherDetailsForm(quote)
                this.otherDetailsForm.patchValue({
                    articleType: quote?.articleType,
                    yearOfManufacturing: quote?.yearOfManufacturing,
                    invoiceNumber: quote?.invoiceNumber,
                    articleContentValue: quote?.articleContentValue,
                });
            }
        })
        this.currentUser$ = this.accountService.currentUser$;
    }

    getPremiumValue(): number {
        switch (this.quote.productId?.['productTemplate']) {
          case AllowedProductTemplate.WORKMENSCOMPENSATION:
            return this.quote.wcTemplateDataId?.['indicativePremium'] ?? 0;
          case AllowedProductTemplate.LIABILITY:
          case AllowedProductTemplate.LIABILITY_CRIME:
            return this.quote.liabilityTemplateDataId?.['totalPremiumAmt'] ?? 0;
          case AllowedProductTemplate.LIABILITY_EANDO:
            return this.quote.liabilityEandOTemplateDataId?.['totalPremiumAmt'] ?? 0;
          case AllowedProductTemplate.LIABILITY_CGL:
          case AllowedProductTemplate.LIABILITY_PUBLIC:
            return this.quote.liabilityCGLTemplateDataId?.['totalPremiumAmt'] ?? 0;
          case AllowedProductTemplate.LIABILITY_PRODUCT:
          case AllowedProductTemplate.LIABILITY_CYBER:
            return this.quote.liabilityProductTemplateDataId?.['totalPremiumAmt'] ?? 0;
          default:
            return 0;
        }
    }

    ngOnInit(): void {
        this.currentUser$.subscribe({
            next: user => {
                this.user = user
        }});
        if(this.quote.quoteState == AllowedQuoteStates.REJECTED) {
            this.isEditable = false;
        }
        this.createOtherDetailsForm(this.quote);
        console.log("From Form",this.quote)

        this.productService.getACategoryProductMaster().subscribe(
            (response: any) => {
                const data = response.data;
                if (Array.isArray(data.entities)) {
                    this.productData = data.entities.map(item => ({ label: item.shortName, value: item.name }));
                    console.log(this.productData, 'opy')
                } else {
                    console.error('Invalid data received:', data);
                }
            },
            error => {
                console.error('Error fetching category names:', error);
            }
        );

    }

    ngOnDestroy(): void {
       this.currentQuote.unsubscribe();
    }

    createOtherDetailsForm(quote?: IQuoteSlip) {

        this.otherDetailsForm = this.formBuilder.group({
            deductiblesExcessPd: [quote?.deductiblesExcessPd, []],
            deductiblesExcessFlop: [quote?.deductiblesExcessFlop, []],
            deductiblesExcessMblop: [quote?.deductiblesExcessMblop, []],
            brokerage: [quote?.brokerage, []],
            rewards: [quote?.rewards, []],
            quoteSubmissionDate: [quote?.quoteSubmissionDate ? String(quote?.quoteSubmissionDate).split('T')[0] : formatDate(new Date(), 'yyyy-MM-dd', 'en')],
            isTargetPremium: [],
            targetPremium: [this.quote.targetPremium??this.getPremiumValue(), []],
            existingBrokerCurrentYear: [quote?.existingBrokerCurrentYear],
            preferredInsurer: [quote?.preferredInsurer, []],
            otherTerms: [quote?.otherTerms, []],
            additionalInfo: [quote?.additionalInfo, []],
            isCobroker: [quote?.isCobroker],
            articleType: [quote?.articleType, []],
            yearOfManufacturing: [quote?.yearOfManufacturing, []],
            invoiceNumber: [quote?.invoiceNumber, []],
            articleContentValue: [quote?.articleContentValue, []],
        })

        this.otherDetailsForm.controls['targetPremium'].disable()

        this.otherDetailsForm.controls['isTargetPremium'].valueChanges.subscribe((value) => {

            if(value) {
                this.otherDetailsForm.controls['targetPremium'].enable()

            } else {
                this.otherDetailsForm.controls['targetPremium'].disable()

            }
        })
    }

    openCobrokerDialog() {
        const ref = this.dialogService.open(CoBrokerLiabilityFormDialogComponent,{
            header:"Co-Broker Details",
            styleClass :  'customPopup',
            width : '450px',
            data: {
                quote: this.quote
            }
        })

        ref.onClose.subscribe((data) => {
            // console.log("Hello",data)
        });
    }

    submitOtherDetailsForm() {
        // console.log(this.otherDetailsForm)

        let payload = { ...this.otherDetailsForm.value, articleType: this.otherDetailsForm.value.articleType, yearOfManufacturing: this.otherDetailsForm.value.yearOfManufacturing, invoiceNumber: this.otherDetailsForm.value.invoiceNumber, articleContentValue: this.otherDetailsForm.value.articleContentValue };
        if(!this.otherDetailsForm.value.isCobroker) payload['coBrokers'] = []

        this.quoteService.update(this.quote._id, payload).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                // console.log(dto)
                // this.quoteService.setQuote(dto.data.entity);
                // this.quoteService.setQuote(this.quote);
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail:'Data Saved!',
                    life: 3000
                    });
                    this.quoteService.refresh();

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
        this.otherDetailsForm.controls['brokerage'].setValue(value);
      }

}

