import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
    selector: 'app-risk-cover-letter-dialog',
    templateUrl: './risk-cover-letter-dialog.component.html',
    styleUrls: ['./risk-cover-letter-dialog.component.scss']
})
export class 
RiskCoverLetterDialogComponent implements OnInit {

    id: string;
    @Input() quote: IQuoteSlip
    brokerQuote: any;
    fgiQueueStatus: string;
    fgiRetry: boolean = false;
    fgiInprogress: boolean = false;
    fgiCompleted: boolean = false
    isOfflinePaymentMode: boolean = false;
    displayModal: boolean = false

    constructor(
        private router: Router,
        private quoteService: QuoteService,
        // public config: DynamicDialogConfig,
        // private dialogService: DialogService,
        // private ref: DynamicDialogRef,
        protected http: HttpClient
    ) {
        // this.quote = this.config.data.quote;
        // console.log(this.config.data.quote)
        
        // this.quoteService.get(this.quote.originalQuoteId, { allCovers: true }).subscribe(
        //     response => {
        //         console.log(response)
        //         this.brokerQuote = response.data.entity
        //         if (response.data.entity.fgApiResponse) {

        //             this.fgiQueueStatus = response.data.entity.fgApiResponse.status
        //             if (response.data.entity.paymentMode == 'offline') {
        //                 this.isOfflinePaymentMode = true
        //             }
        //             if (this.fgiQueueStatus) {
        //                 if (this.fgiQueueStatus == 'failed') {
        //                     this.fgiRetry = true
        //                 } else if (this.fgiQueueStatus == 'inProgress') {
        //                     this.fgiInprogress = true
        //                 } else {
        //                     this.fgiCompleted = true
        //                 }
        //             }
        //             console.log(this.fgiQueueStatus)
        //         } else {
        //             console.log("old quote")
        //         }
        //     }
        // )

    }

    ngOnInit(): void {
        console.log(this.quote);
        this.quoteService.get(this.quote?.originalQuoteId ?? this.quote?._id, { allCovers: true }).subscribe(
            response => {
                console.log(response)
                this.brokerQuote = response.data.entity
                if (response.data.entity.fgApiResponse) {

                    this.fgiQueueStatus = response.data.entity.fgApiResponse.status
                    if (response.data.entity.paymentMode == 'offline') {
                        this.isOfflinePaymentMode = true
                    }
                    if (this.fgiQueueStatus) {
                        if (this.fgiQueueStatus == 'failed') {
                            this.fgiRetry = true
                        } else if (this.fgiQueueStatus == 'inProgress') {
                            this.fgiInprogress = true
                        } else {
                            this.fgiCompleted = true
                        }
                    }
                    console.log(this.fgiQueueStatus)
                } else {
                    console.log("old quote")
                }
            }
        )
    }

    goToDashBoard() {
        // this.ref.close()
        this.router.navigateByUrl(`/`);
    }

    retryFgiQueue() {
        this.fgiQueueStatus == 'inProgress'
        let payload = {}
        payload['quoteId'] = this.brokerQuote._id
        this.quoteService.retryFgiQueue(payload).subscribe(
            response => {
                console.log(response)
                // @ts-ignore
                this.fgiQueueStatus = response.data.entity.fgApiResponse.status
                this.fgiRetry = false;
                this.fgiInprogress = false;
                this.fgiCompleted = false
                if (this.fgiQueueStatus == 'failed') {
                    this.fgiRetry = true
                } else if (this.fgiQueueStatus == 'inProgress') {
                    this.fgiInprogress = true
                } else {
                    this.fgiCompleted = true
                }
            }
        )
    }

    download() {
        // this.displayModal = true;
        let payload: any = {}
        payload.quoteId = this.brokerQuote._id
        payload.policyNo = this.brokerQuote?.fgApiResponse?.policyNumber

        this.quoteService.downloadFGIPolicy(payload)
            .subscribe(response => {
                // Create a Blob from the response data
    
                const blob = new Blob([response['data']['entity']], { type: 'application/pdf' });

                // Generate a URL for the Blob
                const url = window.URL.createObjectURL(blob);

                // Open the URL in a new tab
                window.open(url, '_blank');

                // Release the URL when you're done
                // window.URL.revokeObjectURL(url);
            });

    }

}







// this.quoteService.sendQuoteForApproval(this.quote._id).subscribe({
//   next: (dto: IOneResponseDto<IQuoteSlip>) => {
//       this.quoteService.setQuote(dto.data.entity);

//       const ref = this.dialogService.open(RiskCoverLetterDialogComponent, {
//           header: '',
//           width: '55%',
//           height: '90%',
//           styleClass: 'flatPopup'
//       });

//       ref.onClose.subscribe(() => {
//           this.router.navigateByUrl(`/`);
//       })
//   },
//   error: error => {
//       console.log(error);
//   }
// });
