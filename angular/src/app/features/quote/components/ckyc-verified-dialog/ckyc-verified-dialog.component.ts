import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ChooseVerificationModeDialogComponent } from '../choose-verification-mode-dialog/choose-verification-mode-dialog.component';
import { ChoosePaymentModeDialogComponent } from '../quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { IOneResponseDto } from 'src/app/app.model';

@Component({
  selector: 'app-ckyc-verified-dialog',
  templateUrl: './ckyc-verified-dialog.component.html',
  styleUrls: ['./ckyc-verified-dialog.component.scss']
})
export class CkycVerifiedDialogComponent implements OnInit {

  quote : IQuoteSlip
  kycFailed : boolean
  isCKYCTemplate: boolean = false;

  constructor(
        public ref: DynamicDialogRef,
        private dialogService: DialogService,
        private config: DynamicDialogConfig,
        private quoteService: QuoteService
  ) { 
    this.isCKYCTemplate = this.config.data.isCKYCTemplate
  }

  ngOnInit(): void {
    this.quote = this.config.data.quote
    this.kycFailed = this.config.data.kycFailed
  }

  close() {
    this.quoteService.get(this.quote._id, { allCovers: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
          this.quote = dto.data.entity;
          this.quoteService.setQuote(dto.data.entity)
          this.ref.close();
      
          const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
            // header: 'Choose Payment Method',
            header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
            data: {
                quote: this.quote,
            },
            width: '45%',
            // height: '40%',
            styleClass: "customPopup "
        })
      }
  })




    // const ref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
    //   header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
    //   data: {
    //     quote: this.quote,
    //     kycFailed : this.kycFailed,
    //     isCKYCTemplate: this.isCKYCTemplate
    //   },
    //   width: '45%',
    //   // height: '40%',
    //   styleClass:  "customPopup"
    // })

    // ref.onClose.subscribe({
    //   next: () => {
    //     // this.quoteService.refresh()
    //   }
    // })
   
}

}
