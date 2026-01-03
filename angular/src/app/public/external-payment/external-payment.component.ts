import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { DialogService } from 'primeng/dynamicdialog';
import { TermAndConditionDialogComponent } from 'src/app/features/account/term-and-condition-dialog/term-and-condition-dialog.component';

declare var Razorpay: any;

@Component({
  selector: 'app-external-payment',
  templateUrl: './external-payment.component.html',
  styleUrls: ['./external-payment.component.scss']
})
export class ExternalPaymentComponent implements OnInit {

  quoteId: string;
  quote: IQuoteSlip;
  netPremium: number = 0
  sumInsured: number = 0
  gstPercentage = 0.18
  gst: number = 0
  queryParams: any;
  isLinkExpired: boolean = false;
  isPaymentDone: boolean;
  isPaymentFailed: boolean;
  decodedUrl: string
  razorPayOptions: any = {}
  rzp: any;
  order_id: any;
  orderidfailed: boolean = false;
  FGI_RAZOR_PAY_API_KEY = "rzp_live_XiwOaOFeU9raRs"
  FGI_RAZOR_PAY_KEY_SECRET = 'yQNzzOfbRJ3JKi6qaF2KRDP8'
  ismakePayment: boolean = false; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {
    // this.razorpayHandler = this.razorpayHandler.bind(this);
    // this.razorpayerrorHandler = this.razorpayerrorHandler.bind(this);
    this.isPaymentDone = false
    this.isPaymentFailed = false
  }

  ngOnInit(): void {
    // this.quoteId = this.activatedRoute.snapshot.paramMap.get("quoteId");

    this.queryParams = this.activatedRoute.snapshot.queryParams

    // if (this.queryParams.callbackQuote) {
    //   let payload = {};
    //   // @ts-ignore
    //   this.decodedUrl = decodeURIComponent(this.queryParams.callbackQuote).replaceAll(' ', '+')

    //   console.log(this.decodedUrl)

    //   payload['quoteId'] = this.decodedUrl
    //   console.log(payload)
    //   this.quoteService.updatePaymentStatus(payload).subscribe(response => {
    //     console.log(response)
    //     this.quote = response['data'].entity
    //     // @ts-ignore
    //     if (response.status == "fail") {
    //       this.isPaymentFailed = true
    //     } else {
    //       this.isPaymentDone = true
    //     }
    //   })
    // }
    console.log(this.queryParams.quoteId);
    
    if (this.queryParams.quoteId) {
      let payload = {};
      // @ts-ignore
      this.decodedUrl = decodeURIComponent(this.queryParams.quoteId).replaceAll(' ', '+')

      console.log(this.decodedUrl)

      payload['quoteId'] = this.decodedUrl
      console.log(payload)

      this.quoteService.quoteDataToExternalPaymentLink(payload).subscribe({
        next: (data: any) => {
          this.quote = data['data'].entity
          console.log(this.quote)
          if (this.quote.paymentStatus == 'success') {
            this.isPaymentDone = true
          } else {
            this.sumInsured = this.quote.totalSumAssured
            this.gst = this.quote.totalIndictiveQuoteAmt * this.gstPercentage
          }

        },
        error: e => {
          console.log(e.message);
          this.isLinkExpired = true;
        }
      })
    }

  }

  makePayment() {

     this.isLinkExpired = false;     
     this.ismakePayment = true;      
console.log(this.ismakePayment);

    let payload = {};
    payload['quoteId'] = this.decodedUrl
    payload['amount'] = Math.round(this.quote.totalIndictiveQuoteAmtWithGst) * 100
    payload['currency'] = 'INR'
    this.quoteService.getPaymentURL(payload).subscribe(response => {
      console.log(response)

      if (response['status'] == 'success') {
        // @ts-ignore
        this.order_id = response.data.entity.id
        // this.razorPayOptions = {
        //   key: this.FGI_RAZOR_PAY_API_KEY,
        //   currency: 'INR',
        //   name: 'FGI',
        //   description: 'Sample Payment',
        //   // @ts-ignore
        //   order_id: response.data.entity.id,
        //   handler: this.razorpayHandler,
        //   prefill: {
        //     name: this.quote.clientId['name'],
        //     email: this.quote.clientId['email'],
        //     contact: this.quote.clientId['contactNo']
        //   },
        //   retry: {
        //     enabled: false
        //   }
        // }

        // this.rzp = new Razorpay(this.razorPayOptions);

        // this.rzp.on('payment.failed', this.razorpayerrorHandler);

        // this.rzp.open()

      }
      if (response['status'] == 'fail') {
        this.isLinkExpired = true
      }
    })
  }

  // razorpayerrorHandler(response: any) {
  //   console.log(response)
  //   let payload = {}
  //   payload['response'] = response
  //   payload['order_id'] = this.order_id
  //   payload['quoteId'] = this.decodedUrl

  //   this.quoteService.savePaymentDetails(payload).subscribe(res => {
  //     console.log(res)
  //   })
  //   this.isPaymentFailed = true
  //   console.log(this.isPaymentFailed)
  //   this.cdr.detectChanges()
  // }

  // razorpayHandler(response: any) {
  //   const generated_signature = CryptoJS.HmacSHA256(this.order_id + "|" + response.razorpay_payment_id, this.FGI_RAZOR_PAY_KEY_SECRET).toString(CryptoJS.enc.Hex);

  //   console.log(generated_signature == response.razorpay_signature)
  //   if (generated_signature == response.razorpay_signature) {
  //     this.isPaymentDone = true
  //     this.cdr.detectChanges()
  //     let payload = {}
  //     payload['response'] = response
  //     payload['order_id'] = this.order_id
  //     payload['quoteId'] = this.decodedUrl

  //     this.quoteService.savePaymentDetails(payload).subscribe(res => {
  //       console.log(res)
  //     })

  //   }
  // }

  pay(){
    this.isPaymentDone = true
    this.isLinkExpired = false
    this.ismakePayment = false
    let payload = {}
        payload['response'] = {}
        payload['order_id'] = this.order_id
        payload['quoteId'] = this.decodedUrl
        this.quoteService.savePaymentDetails(payload).subscribe(res => {
          console.log(res)
          this.isPaymentDone = true
        })
  }

  cancel(){
    this.isPaymentFailed = true
    this.isLinkExpired = false
    this.ismakePayment = false
  }

}
