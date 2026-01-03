import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ChooseVerifierOtpDialogComponent } from '../choose-verifier-otp-dialog/choose-verifier-otp-dialog.component';
import { UploadProposalFormDialogComponent } from '../upload-proposal-form-dialog/upload-proposal-form-dialog.component';
import { MessageService } from 'primeng/api';
import { CkycVerifiedDialogComponent } from '../ckyc-verified-dialog/ckyc-verified-dialog.component';
import { ChoosePaymentModeDialogComponent } from '../quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';


export interface IUploadDocDetails {
    doc_type : string;
    base64url : string;
    proposal_id : string;
}

@Component({
    selector: 'app-choose-verification-mode-dialog',
    templateUrl: './choose-verification-mode-dialog.component.html',
    styleUrls: ['./choose-verification-mode-dialog.component.scss']
})
export class ChooseVerificationModeDialogComponent implements OnInit {

    uploadedFiles: any
    quote: IQuoteSlip
    kycFailed: boolean
    verificationMode: 'online' | 'offline' = 'online';
    accceptFileTypes: string
    proposal_id : string
    isCKYCTemplate: boolean = false;

    constructor(

        public ref: DynamicDialogRef,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private config: DynamicDialogConfig,
        private messageService: MessageService,
    ) {
        this.quote = this.config.data.quote
        this.isCKYCTemplate = this.config.data.isCKYCTemplate
        this.kycFailed = this.config.data.kycFailed
        if(this.kycFailed){
           this.proposal_id =  this.config.data.proposal_id
        }
    }

    ngOnInit(): void {
        this.accceptFileTypes = ".pdf, .jpg, .png, .jpeg"
        // this.messageService.add({
        //     severity: "success",
        //     summary: "KYC Verifcation Done",
        //     // detail: response?.['message'],
        //     life: 3000
        //   });
        if(!this.kycFailed){
            this.messageService.add({
                severity: "success",
                summary: "KYC Verifcation Done",
                // detail: response?.['message'],
                life: 3000
              });
        }
    }


    proceedWithOnlineVerification() {

        if (this.verificationMode == 'online') {
            const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
                header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
                // header: 'Enter Number & Choose Verifier',
                data: {
                    quote: this.quote,
                },
                width: '45%',
                // height: '40%',
                styleClass: "customPopup "
            })
            this.ref.close();
        }
    }
    proceedWithOfflineVerification() {
        if (this.verificationMode == 'offline') {
            const ref = this.dialogService.open(UploadProposalFormDialogComponent, {
                header: 'Client : ' + this.quote.clientId['name'] + ' - ' + 'Quote No : ' + this.quote.quoteNo,
                // header: 'Upload Proposal Form',
                data: {
                    quote: this.quote,
                    isCKYCTemplate: this.isCKYCTemplate
                },
                width: '45%',
                // height: '40%',
                styleClass: "customPopup "
            })
            this.ref.close();
        }
    }

    onUpload(event){
        this.uploadedFiles = event.files[0]
        console.log(this.uploadedFiles)
    }

        proceed() {
        
        // console.log(event)
        let selectedFileBase64;
        const filereader = new FileReader();
        filereader.readAsDataURL(this.uploadedFiles);
        filereader.onload = () => {
            let payload = {};
            selectedFileBase64 = filereader.result?.toString().split(',')[1]

            payload['base64url'] = selectedFileBase64;
            payload['quoteId'] = this.quote._id;

            if(this.uploadedFiles.type == "application/pdf") payload['doc_type'] = "pdf"
            else payload['doc_type'] = "image"
            payload['proposal_id']=this.proposal_id

            console.log(payload)

            this.quoteService.uploadCKYCDocument(payload).subscribe(
                response => {
                    console.log(response)
                    if(response['status']=='success'){
                        this.dialogService.dialogComponentRefMap.forEach(dialog => {
                            dialog.destroy();
                          });
                          const ref = this.dialogService.open( CkycVerifiedDialogComponent, {
                            header: ' ',
                            data: {
                              quote: this.quote,
                            //   kycFailed : kycFailed
                            },
                            width: '400px',
                            // height: '40%',
                            styleClass: "flatpopup"
                          })
                    }else{
                        this.ref.close()
                        this.messageService.add({
                            severity: "error",
                            summary: "Fail",
                            detail: response?.['message'],
                            life: 3000
                          });
                    }
                }
            )
        }

        // const reader = new FileReader();
        // reader.onload = async () => {
        //   const base64String = reader.result?.toString().split(',')[1];
    
        //   // Send the Base64 encoded string to the third-party API
        //   try {
        //     const apiResponse = await this.http.post('YOUR_API_ENDPOINT', {
        //       document: base64String,
        //     }).toPromise();
    
        //     // Handle the API response here
        //     console.log('API Response:', apiResponse);
        //   } catch (error) {
        //     // Handle API errors here
        //     console.error('API Error:', error);
        //   }
        // };
    
      }
    
        // for (let file of event.files) {
        //     this.uploadedFiles.push(file);
        // }
    // }

    // proceed() {
        
    //     // this.ref.close()
    //     const formData = new FormData();
        
    //     this.uploadedFiles.map(item => {
    //         console.log(item, item.name)
    //         formData.append('kycDocument', item, item.name)
    //         console.log(formData)
    //     })
       
    // }


}






