import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AllowedQuoteStates, IQuoteOption, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { IBulkImportResponseDto, IOneResponseDto } from 'src/app/app.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { DialogService } from 'primeng/dynamicdialog';
import { QuoteSentForPostPlacementDialogComponent } from '../../status_dialogs/quote-sent-for-post-placement-dialog/quote-sent-for-post-placement-dialog.component';
import { AppService } from 'src/app/app.service';


@Component({
    selector: 'app-quote-discussion-page',
    templateUrl: './quote-discussion-page.component.html',
    styleUrls: ['./quote-discussion-page.component.scss']
})
export class QuoteDiscussionPageComponent implements OnInit, OnDestroy {
    quoteOptionData: IQuoteOption
    quote: IQuoteSlip;
    currentUser$: any;
    uploadPolicycopyReportUrl: string;
    uploadRiskcoverheadReportUrl: string;
    AllowedQuoteStates = AllowedQuoteStates

    private currentUser: Subscription;
    id: any;
    uploadHttpHeaders: any;
    // selectedQuoteId:any;
    constructor(
        private accountService: AccountService,
        public messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,
        private router: Router,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private dialogService: DialogService,
        private appService: AppService,
    ) {
        // this.quote = this.config.data.quote;
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        // this.selectedQuoteId = this.activatedRoute.snapshot.paramMap.get("selected_quote_id");
        // console.log(this.selectedQuoteId);

        console.log(this.id);
        this.quoteService.get(this.id, {
            allCovers: true
        }).subscribe({
            next: (dto) => {
                this.quote = dto.data.entity
                console.log(this.quote);

                if (this.quote?.productId['productTemplate'] == AllowedProductTemplate.GMC) {
                    this.quoteService.getAllQuoteOptions(this.quote?.placedIcQuoteId.toString()).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {

                            this.loadOptionsData(dto.data.entity);
                            let selectedOption = dto.data.entity.filter(x => x.isQuoteOptionPlaced == true)[0]
                            this.loadSelectedOption(selectedOption);
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else
                {
                    //Liability
                    if(this.isAllowedProductLiability(this.quote))
                    {
                        this.quoteService.getAllLiabilityQuoteOptions(this.quote?.placedIcQuoteId.toString()).subscribe({
                            next: (dtoLiability: IOneResponseDto<any[]>) => {
    
                                this.loadOptionsData(dtoLiability.data.entity);
                                let selectedOption = dtoLiability.data.entity.filter(x => x.isQuoteOptionPlaced == true)[0]
                                this.loadSelectedOption(selectedOption);
                            },
                            error: e => {
                                console.log(e);
                            }
                        }); 
                    }
                }

            }
        })


        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
                this.currentUser$ = user;
            }
        });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.uploadPolicycopyReportUrl = this.quoteService.policyupload(this.quote?._id);
            this.uploadRiskcoverheadReportUrl = this.quoteService.Riskcoverupload(this.quote?._id);
        }, 3000);
        this.getQuoteOptions();

    }

    ngOnDestroy(): void {
        this.currentUser.unsubscribe();
    }
    loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }
    loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
        this.quoteService.setSelectedOptions(quoteOption)
    }

    proceesedQuote(quote: IQuoteSlip) {
        const payload = {
            quoteState: "POST_PLACEMENT"
        };
        // this.messageService.add({
        //     key: "success",
        //     severity: "Successful",
        //     summary: "",
        //     detail: `Your Quote is in Post Placement`,
        //     life: 3000
        //   });
        //   this.router.navigateByUrl(`/backend/quotes`).then(() => {
        //     window.location.reload();
        console.log(this.quote._id);

        this.quoteService.proceedquote(this.quote._id, payload).subscribe({
            next: v => {
                const ref = this.dialogService.open(QuoteSentForPostPlacementDialogComponent, {
                    header: '',
                    width: '700px',
                    styleClass: 'flatPopup',
                    data: {
                        quote: quote
                    }
                });
                setTimeout(() => {
                    this.router.navigateByUrl(`/backend/quotes`).then(() => {
                        window.location.reload();
                    });
                }, 3000);
                // this.messageService.add({
                //     key: "success",
                //     severity: "Successful",
                //     summary: "",
                //     detail: `Your Quote is in Post Placement`,
                //     life: 3000
                //   });
                //   setTimeout(() => {
                //     this.router.navigateByUrl(`/backend/quotes`).then(() => {
                //         window.location.reload();
                //       });
                //   }, 3000);


                // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)


            },
            error: e => {
                // console.log(e);
                this.messageService.add({
                    severity: "error",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000
                });
            }
        });
    }


    onUploadPolicyCopyUpload() {
        this.quoteOptionService.get(`${this.quote}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onUploadRiskCoverLetterUpload() {
        this.quoteOptionService.get(`${this.quote}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    getQuoteOptions() {
        console.log(this.activatedRoute.snapshot.queryParams.quoteOptionId);
        this.quoteOptionService.get(this.activatedRoute.snapshot.queryParams.quoteOptionId, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                this.quoteOptionData = dto.data.entity;
            },
            error: e => {
                console.log(e);
            }
        });
    }

    async downloadDocument({ fileFormatToGenerate }: { fileFormatToGenerate: string }): Promise<void> {
        try {
            const payload = { quoteId: this.quote?._id, fileFormatToGenerate: fileFormatToGenerate };
            // Get the PDF as a Blob
            //#region 'Liability'
            let productTemplate = this.quote?.productId['productTemplate']
            if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) {
                productTemplate = 'LIABILITY_DNO_CRIME'
            }
            else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC) {
                productTemplate = 'LIABILITY_CGL_PUBLIC'
            }
            else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CYBER) {
                productTemplate = 'LIABILITY_PRODUCT_CYBER'
            }
            //#endregion

            const data = await this.quoteOptionService.downloadDocumentForQuoteSlip(payload, productTemplate).toPromise();
            // Check if the data is a Blob
            if (data instanceof Blob) {
                // Generate a timestamp-based filename with quoteId
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                // let fileName = `quoteslip_${this.quote?._id}_${timestamp}.pdf`;
                // if (fileFormatToGenerate === "DOCX") {
                //     fileName = `quoteslip_${this.quote?._id}_${timestamp}.docx`; 
                // }
                let fileName = this.quote.quoteState == AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE ? `RFP_Slip_${this.quote?.quoteNo}.pdf` :
                    this.quote.quoteState == AllowedQuoteStates.WAITING_FOR_APPROVAL ? `RFQ_Slip_${this.quote?.quoteNo}.pdf` :
                        `Placement_Slip_${this.quote?.quoteNo}.pdf`;
                if (fileFormatToGenerate === "DOCX") {
                    fileName = this.quote.quoteState == AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE ? `RFP_Slip_${this.quote?.quoteNo}.docx` :
                        this.quote.quoteState == AllowedQuoteStates.WAITING_FOR_APPROVAL ? `RFQ_Slip_${this.quote?.quoteNo}.docx` :
                            `Placement_Slip_${this.quote?.quoteNo}.docx`;
                }

                // Create a temporary URL for the Blob
                const fileURL = window.URL.createObjectURL(data);

                // Create a temporary <a> element to trigger the download
                const a = document.createElement('a');
                a.href = fileURL;
                a.download = fileName; // Set the filename for the PDF
                a.target = '_blank'; // Open in a new tab

                // Trigger the download
                a.click();

                // Cleanup the object URL after it's no longer needed
                window.URL.revokeObjectURL(fileURL);

                console.log('PDF downloaded and opened successfully.');
            } else {
                throw new Error('The response is not a Blob');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    }

    downloadExcel(): void {
        // Use this.quote.id instead of this.quoteId
        this.quoteOptionService.downloadQCRExcel(this.quoteOptionData._id, this.quote.quoteNo).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    isAllowedProductLiability(quote) {
        const isTemplateAllowed = [
            AllowedProductTemplate.LIABILITY_CGL,
            AllowedProductTemplate.LIABILITY_PUBLIC,
            AllowedProductTemplate.LIABILITY,
            AllowedProductTemplate.LIABILITY_EANDO,
            AllowedProductTemplate.LIABILITY_CRIME,
            AllowedProductTemplate.LIABILITY_PRODUCT,
            AllowedProductTemplate.WORKMENSCOMPENSATION,
            AllowedProductTemplate.LIABILITY_CYBER].includes(quote.productId['productTemplate'])
        return isTemplateAllowed;
    }


}











