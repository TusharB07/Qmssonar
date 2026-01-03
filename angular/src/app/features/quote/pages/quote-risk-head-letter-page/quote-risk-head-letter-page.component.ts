import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaymentDetailsPopupComponent } from '../../components/quote/payment-details-popup/payment-details-popup.component';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { HttpHeaders } from '@angular/common/http';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';


@Component({
  selector: 'app-quote-risk-head-letter-page',
  templateUrl: './quote-risk-head-letter-page.component.html',
  styleUrls: ['./quote-risk-head-letter-page.component.scss'],
  providers: [DialogService]
})
export class QuoteRiskHeadLetterPageComponent implements OnInit, OnDestroy {

  quote: IQuoteSlip;
  currentUser$: any;

  AllowedQuoteStates = AllowedQuoteStates

  private currentUser: Subscription;
  id: any;
  htmlOutput: string = ""
  uploadHttpHeaders: HttpHeaders;
  brokerQuote: any;
  fgiQueueStatus: string;
  fgiRetry: boolean = false;
  fgiInprogress: boolean = false;
  fgiCompleted: boolean = false
  isOfflinePaymentMode: boolean = false;
  displayModal: boolean = false
  uploadAIDocUrl: string = "";
  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
    private dialogService: DialogService, public messageService: MessageService, private gmcQuoteTemplateService: QoutegmctemplateserviceService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    console.log(this.id);



    // this.currentUser = this.accountService.currentUser$.subscribe({
    //     next: user => {
    //         this.currentUser$ = user;
    //     }
    // });
  }

  ngOnInit(): void {
    this.uploadAIDocUrl = this.quoteService.docforAIUploadUrl(this.id);

    this.quoteService.get(this.id).subscribe({
      next: (dto) => {
        this.quote = dto.data.entity
        console.log(this.quote)
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
    })

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
  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }
  downloadaiDoc() {
    this.quoteService.aiDocDownload(this.quote._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        // a.href = objectUrl
        // a.download = fileName;
        // a.click();

        window.open(objectUrl, '_blank');

        URL.revokeObjectURL(objectUrl);

      }
    })
  }
  onUploadSAIDocFile() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {

        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `File Upoladed Successfully`,
          life: 3000
        });
        this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });
  }
  clearOp() {
    this.htmlOutput = "";
  }
  compareDoc() {
    this.gmcQuoteTemplateService.getAIPolicyScrunity(this.quote._id).subscribe({
      next: partner => {
        console.log(partner.data.entity.response)
        const cleanedString = partner.data.entity.response
          .replace(/^```html\n/, '')  // Remove starting markdown syntax
          .replace(/\n```$/, '')      // Remove ending markdown syntax
          .trim();                    // Remove any extra whitespace
        this.htmlOutput = cleanedString
      },
      error: error => {
        console.log(error);
      }
    });
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


  ngOnDestroy(): void {
    // this.currentUser.unsubscribe();
  }

  openChoosePaymentMethodDialogComponent(quote: IQuoteSlip) {

    this.quoteService.get(this.quote._id, { allCovers: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        if (dto.data.entity) {
          const ref = this.dialogService.open(PaymentDetailsPopupComponent, {
            // width: '500px',
            header: 'Payment Details Confirmed',
            styleClass: 'flatPopup',
            data: {
              quote: dto.data.entity.placedIcQuoteId,
            }
          })

        }
      }
    })
  }

}
