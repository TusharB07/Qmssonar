import { Component, ElementRef, OnChanges, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QuoteSlipSentForPlacementDialogComponent } from '../../quote-slip-sent-for-placement-dialog/quote-slip-sent-for-placement-dialog.component';
import { ProceedWithOfflinePaymentDialogComponent } from '../proceed-with-offline-payment-dialog/proceed-with-offline-payment-dialog.component';
import { MessageService } from 'primeng/api';
import * as html2pdf from 'html2pdf.js';

@Component({
    selector: 'app-choose-payment-mode-dialog',
    templateUrl: './choose-payment-mode-dialog.component.html',
    styleUrls: ['./choose-payment-mode-dialog.component.scss']
})
export class ChoosePaymentModeDialogComponent implements OnInit {
    @ViewChild('QuoteSlipPDFPreview') quoteSlipPDFPreview: ElementRef;


    email: string;
    error: boolean = false
    quote: IQuoteSlip
    paymentMode: 'online' | 'offline' = 'online';
    role: IRole;
    user: IUser;
    isLinkSent: boolean = false;
    currentuserName:string='';
    constructor(
        public ref: DynamicDialogRef,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private config: DynamicDialogConfig,
        private router: Router,
        private accountService: AccountService,
        private messageService: MessageService,private renderer: Renderer2
    ) {
        this.quote = this.config.data.quote
            console.log(this.config.data.quote)
            // this.email = this.quote.clientId['email']
            let ms = Date.parse(this.quote.paymentEmailLinkTimestamp)
            if(new Date().getTime() - ms < 1*60*1000) {
                this.isLinkSent = true;
            }
            else {
                this.isLinkSent = false;
            }
            if(this.quote.paymentStatus=="FAILED"){
                 this.isLinkSent = false; 
            }
        // this.email = this.quote.clientId['email']
        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                this.role = user.roleId as IRole;
                this.currentuserName=user.name;
            }
        })
    }

    ngOnInit(): void {

        // console.log('this.quote', this.quote)
        // this.paymentMode = this.quote.paymentMode ?? 'online'

        // if (this.quote.paymentMode == 'offline') {
        //     this.openOfflinePaymentDialog()
        // }
    }

    errorCheck() {
       
        const emailregex =   /^(?!.{100})[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/

        if (!this.email.match(emailregex)) {
            this.error = true
        } else {
            this.error = false
        }
    }

    // generatePDF(): Promise<Blob> {
    //     return new Promise((resolve, reject) => {
    //       const elementToPrint = this.quoteSlipPDFPreview.nativeElement.cloneNode(true);
    //       const isHidden = elementToPrint.hasAttribute('hidden');
    //       if (isHidden) {
    //           this.renderer.removeAttribute(elementToPrint, 'hidden');
    //        }
    //       this.renderer.setStyle(elementToPrint, 'margin-top', '0');
    //       const tempDiv = this.renderer.createElement('div');
    //       this.renderer.appendChild(tempDiv, elementToPrint);
    
    //     //   html2pdf()
    //     //   .from(tempDiv)
    //     //   .save();


    //       html2pdf()
    //         .from(tempDiv)
    //         .output('blob')
    //         .then((pdfBlob) => {
    //           resolve(pdfBlob);
    //         })
    //         .catch((error) => {
    //           reject(error);
    //         });
    //     });
    // }

    // proceedWithOnlinePayment() {
    //     console.log(this.email)
    //     this.generatePDF().then((pdfBlob) => {
    //         // Convert the PDF Blob to base64
    //         // const reader = new FileReader();
    //         // reader.onloadend = () => {
    //         //   const base64Data = reader.result as string;
      
    //         if (this.paymentMode == 'online') {

    //             if (!this.error && this.email) {
    //                 //  let payload = {};
    //                 //  payload['email'] = this.email
    //                 //  payload['quoteId'] = this.quote._id,
    //                 //  payload['pdfFile'] = base64Data
    //                 const formData = new FormData();
    //                 formData.append('Pdf_upload', pdfBlob, 'QuoteSlip_'+this.quote.quoteNo+'.pdf');
    //                 formData.append('email', this.email);
    //                 formData.append('quoteId', this.quote._id);
    //                 formData.append("currentUserName",this.currentuserName);
    //                 this.quoteService.sendpaymentLinkWithQuoteSlip(formData).subscribe(response => {
    //                     console.log(response)
    //                     // @ts-ignore
    //                     if(response.status == 'success'){
    //                         this.messageService.add({
    //                             severity: "success",
    //                             summary: "Successful",
    //                             detail: `Email Send Sucessfully`,
    //                             life: 3000
    //                           });
    //                         // @ts-ignore
    //                         let time = response.data.entity.quote.paymentEmailLinkTimestamp;
    //                         let ms = Date.parse(time)
                            
    //                         if(new Date().getTime() - ms < 10*60*1000) {
    //                             this.isLinkSent = true;
    //                         }
    //                         else {
    //                             this.isLinkSent = false;
    //                         }
    //                     }else{
    //                         this.messageService.add({
    //                             severity: "error",
    //                             summary: "Failed",
    //                             //@ts-ignore
    //                             detail: response.message ,
    //                             life: 3000
    //                           });
    //                     }
    //                 })
    //             }
    
    
    //             // this.quoteService.update(this.quote._id, { paymentMode: 'online' }).subscribe({
    //             //     next: (dto) => {
    //             // this.ref.close();
    //             //     }
    //             // })
    //             // const ref = this.dialogService.open(ChooseVerifierOtpDialogComponent, {
    //             //     header: 'Enter Number & Choose Verifier',
    //             //     data: {
    //             //         quote: this.quote,
    //             //     },
    //             //     width: '350px',
    //             //     // height: '40%',
    //             //     styleClass: "flatPopup "
    //             // })
    //             // this.ref.close();
    //         }
    //         //};
      
    //         // Read the PDF Blob as base64
    //         //reader.readAsDataURL(pdfBlob);
    //       }).catch((error) => {
    //         console.error('Error generating PDF:', error);
    //       });
    // }
    

    proceedWithOnlinePayment() {
        console.log(this.email)
      
            if (this.paymentMode == 'online') {

                if (!this.error && this.email) {
                     let payload = {};
                     payload['email'] = this.email
                     payload['quoteId'] = this.quote._id,
                    // payload['pdfFile'] = base64Data
                    // const formData = new FormData();
                    // formData.append('email', this.email);
                    // formData.append('quoteId', this.quote._id);
                    // formData.append("currentUserName",this.currentuserName);
                    this.quoteService.sendpaymentLinkWithQuoteSlip(payload).subscribe(response => {
                        console.log(response)
                        // @ts-ignore
                        if(response.status == 'success'){
                            this.messageService.add({
                                severity: "success",
                                summary: "Successful",
                                detail: `Email Send Sucessfully`,
                                life: 3000
                              });
                            // @ts-ignore
                            let time = response.data.entity.quote.paymentEmailLinkTimestamp;
                            let ms = Date.parse(time)
                            
                            if(new Date().getTime() - ms < 1*60*1000) {
                                this.isLinkSent = true;
                            }
                            else {
                                this.isLinkSent = false;
                            }
                        }else{
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                //@ts-ignore
                                detail: response.message ,
                                life: 3000
                              });
                        }
                    })
                }
                // this.quoteService.update(this.quote._id, { paymentMode: 'online' }).subscribe({
                //     next: (dto) => {
                // this.ref.close();
                //     }
                // })
                // const ref = this.dialogService.open(ChooseVerifierOtpDialogComponent, {
                //     header: 'Enter Number & Choose Verifier',
                //     data: {
                //         quote: this.quote,
                //     },
                //     width: '350px',
                //     // height: '40%',
                //     styleClass: "flatPopup "
                // })
                // this.ref.close();
            }
            
    }

    proceedWithOfflinePayment() {

        if (this.paymentMode == 'offline') {
            this.openOfflinePaymentDialog()
            // this.quoteService.update(this.quote._id, { paymentMode: 'offline' }).subscribe({
            //     next: (dto) => {

            //     }
            // })
        }
    }

    openOfflinePaymentDialog() {
        this.ref.close();

        const ref = this.dialogService.open(ProceedWithOfflinePaymentDialogComponent, {
            header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,

            data: {
                quote: this.quote,
            },
            width: '45%',
            // height: '40%',
            styleClass: "customPopup "
        })

        // if (this.role.name == AllowedRoles.OPERATIONS) {
        //     this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/offline-payment`)
        // } else {
        // }

    }

    // openPaymentDialog() {
    //     if (this.paymentMode == "offline") {
    //         const ref = this.dialogService.open(ProceedWithOfflinePaymentDialogComponent, {
    //             data: {
    //                 quote: this.quote,
    //             },
    //             width: '650px',
    //             // height: '40%',
    //             styleClass: "flatPopup "
    //         })
    //         // this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition/review`); // need to change path
    //         this.ref.close();
    //     } if (this.paymentMode == "online") {
    //         const ref = this.dialogService.open(QuoteSlipSentForPlacementDialogComponent, {
    //             data: {
    //                 quote: this.quote,
    //             },
    //             width: '500px',
    //             styleClass: "flatPopup "
    //         })
    //         this.ref.close();

    //     }
    // }




}




