import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { ChoosePaymentModeDialogComponent } from '../../components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { ClientCKYCDialogComponent } from '../../components/quote/client-ckycdialog/client-ckycdialog.component';
import { LazyLoadEvent } from 'primeng/api';
import { ApiTemplateService } from 'src/app/features/admin/api-template/api-template.service';
import { ChooseVerificationModeDialogComponent } from '../../components/choose-verification-mode-dialog/choose-verification-mode-dialog.component';

@Component({
    selector: 'app-otc-quote-placement-slip-generated-dialog',
    templateUrl: './otc-quote-placement-slip-generated-dialog.component.html',
    styleUrls: ['./otc-quote-placement-slip-generated-dialog.component.scss']
})
export class OtcQuotePlacementSlipGeneratedDialogComponent implements OnInit {
    quote: IQuoteSlip

    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private config: DynamicDialogConfig,
        private apiTemplateService: ApiTemplateService
    ) {
        this.quote = this.config.data.quote;
    }

    ngOnInit(): void {
    }


    goToDashboard() {
        this.ref.close();
    }

    makePayment() {
        // const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
        //     // header: "Breakup of Total Indicative Pricing",
        //     data: {
        //         quote: this.quote,

        //     },
        //     width: '18%',
        //     height: '27%',
        //     // styleClass: "customPopup"
        //     styleClass: "flatPopup "
        // })

        // this.ref.close(false);
        let isCKYCTemplate = false;

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                partnerId: [
                    {
                        value: this.quote?.placedIcQuoteId?.partnerId,
                        matchMode: "equals",
                        operator: "or"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.apiTemplateService.getMany(lazyLoadEvent).subscribe(templates => {
            console.log(templates);
            
            isCKYCTemplate = templates.data.entities.filter(item => item.sequenceNumber == 8).length == 1
            console.log(isCKYCTemplate);
            
            const quote = this.quote
            const ckycDetails = quote.clientId['apiDetails']
            const ckycRecord = ckycDetails.filter(item => item['partnerId']['_id'] == quote.partnerId['_id'] && item['quoteNo'] == quote.quoteNo)
            console.log(ckycRecord);
            if (isCKYCTemplate) {
                const ref = this.dialogService.open(ClientCKYCDialogComponent, {
                    width: '80%',
                    height : '100%',
                    header: 'Quote No : ' + this.quote.quoteNo,
                    styleClass:'customPopup',
                    data: {
                        quote: this.quote,
                        isCKYCTemplate: isCKYCTemplate
                    }
                })
            }
            else {
                const verificationModeDialogref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
                    header: 'Client : ' + quote.clientId['name'] + ' - ' + 'Quote No : ' + quote.quoteNo,
                    data: {
                        quote: quote,
                        isCKYCTemplate: isCKYCTemplate
                    },
                    width: '45%',
                    // height: '40%',
                    styleClass: "customPopup"
                })
            }
        })
        // const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
        //     // header: "Breakup of Total Indicative Pricing",
        //     data: {
        //         quote: this.quote,

        //     },
        //     width: '400px',
        //     header: 'Choose Payment Method',
        //     // width: '18%',
        //     // height: '27%',
        //     // styleClass: "customPopup"
        //     styleClass: "flatPopup "
        // })

        /* ref.onClose.subscribe(() => {
            // this.router.navigateByUrl(`/`);
        }) */

        this.ref.close(false);
    }
}
