import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QuotePlacementSlipGeneratedDialogComponent } from '../../components/quote-placement-slip-generated-dialog/quote-placement-slip-generated-dialog.component';
import { NonOtcQuotePlacementSlipGeneratedDialogComponent } from '../../status_dialogs/non-otc-quote-placement-slip-generated-dialog/non-otc-quote-placement-slip-generated-dialog.component';
import * as html2pdf from 'html2pdf.js';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { QuoteSentForApprovalDialogComponent } from '../../status_dialogs/quote-sent-for-approval-dialog/quote-sent-for-approval-dialog.component';
import { AllowedProductTemplate, AllowedPushbacks } from 'src/app/features/admin/product/product.model';
import { IndicativePremiumCalcService } from '../../components/quote/quote-requisition-tabs/workmen-coverages-tab/indicativepremiumcalc.service';
import { QuoteSentForPlacementCheckerMakerComponent } from '../../status_dialogs/quote-sent-for-placement-checker-maker/quote-sent-for-placement-checker-maker.component';
import { QuoteSentPlacementSlipIsApprovedDialogComponent } from '../../status_dialogs/quote-sent-placement-slip-is-approved-dialog/quote-sent-placement-slip-is-approved-dialog.component';
import { QuoteSentForPostPlacementDialogComponent } from '../../status_dialogs/quote-sent-for-post-placement-dialog/quote-sent-for-post-placement-dialog.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-quote-placement-slip-review-page',
    templateUrl: './quote-placement-slip-review-page.component.html',
    styleUrls: ['./quote-placement-slip-review-page.component.scss']
})
export class QuotePlacementSlipReviewPageComponent implements OnInit {
    @ViewChild('QuoteSlipPDFPreview') quoteSlipPDFPreview: ElementRef;
    id: string;
    selectedQuoteId: string;
    quote: IQuoteSlip
    private currentQuote: Subscription;
    selectedInsurerQuote: IQuoteSlip;

    previous_url: string

    user: IUser;

    // New_Quote_option
    private currentPropertyQuoteOption: Subscription;
    quoteOptionData: IQuoteOption
    selectedInsurerQuoteOption: IQuoteOption;
    quoteId: any


    constructor(
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private router: Router,
        private accountService: AccountService,
        private dialogService: DialogService,
        public messageService: MessageService,
        private appservice: AppService,
        private renderer: Renderer2,
        private quoteOptionService: QuoteOptionService,                                // New_Quote_option
        private location: Location

    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        this.selectedQuoteId = this.activatedRoute.snapshot.paramMap.get("selected_quote_id");
        this.previous_url = this.activatedRoute.snapshot.queryParamMap.get('prev')
        this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user;
            }
        });

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
                this.onQuoteSet(quote);

                this.checkAndNavigate(quote);

            }
        })
    }



    onQuoteSet(quote: IQuoteSlip) {
        this.selectedInsurerQuote = quote?.insurerProcessedQuotes.find((quote: IQuoteSlip) => quote._id == this.selectedQuoteId)

        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
        //     this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
        //         next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //             this.quoteService.setQuote(dto.data.entity)
        //         },
        //         error: e => {
        //             console.log(e);
        //         }
        //     });
        // }
    }

    checkAndNavigate(quote: IQuoteSlip) {

        if (quote) {

            const role = this.user.roleId as IRole

            switch (role.name) {
                case AllowedRoles.BROKER_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER,
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.AGENT_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER,
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BANCA_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BANCA_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.SALES_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.SALES_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER,
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.QCR_FROM_UNDERWRITTER,
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
            }

        }
    }


    ngOnInit(): void {

        this.quoteService.get(`${this.id}`, { qcr: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quote = dto.data.entity
                console.log('main_quote', dto.data.entity)
                this.quoteId = dto.data.entity
                //  this.quoteService.setQuote(dto.data.entity)
            },
            error: e => {
                console.log(e);
            }
        });

        if (this.quote?.productId["productTemplate"] == AllowedProductTemplate.GMC) {

        }
        else {
            // New_Quote_option
            if (!this.isAllowedProductLiability()) {
                this.quoteOptionService.get(`${this.selectedQuoteId}`, { qcr: true, allCovers: true }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.selectedInsurerQuoteOption = dto.data.entity
                    },
                    error: e => {
                        console.log(e);
                    }
                })
            }
        }
    }

    isAllowedProductLiability() {
        const isTemplateAllowed = [
            AllowedProductTemplate.LIABILITY_CGL,
            AllowedProductTemplate.LIABILITY_PUBLIC,
            AllowedProductTemplate.LIABILITY,
            AllowedProductTemplate.LIABILITY_EANDO,
            AllowedProductTemplate.LIABILITY_CRIME,
            AllowedProductTemplate.LIABILITY_PRODUCT,
            AllowedProductTemplate.WORKMENSCOMPENSATION,
            AllowedProductTemplate.LIABILITY_CYBER
        ].includes(this.quote?.productId['productTemplate'])
        // checking if quote option have qcr version object

        return isTemplateAllowed;
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    generatePDF(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const elementToPrint = this.quoteSlipPDFPreview.nativeElement.cloneNode(true);
            const isHidden = elementToPrint.hasAttribute('hidden');
            if (isHidden) {
                this.renderer.removeAttribute(elementToPrint, 'hidden');
            }
            this.renderer.setStyle(elementToPrint, 'margin-top', '0');
            const tempDiv = this.renderer.createElement('div');
            this.renderer.appendChild(tempDiv, elementToPrint);

            html2pdf().set()
                .from(tempDiv)
                .output('blob')
                .then((pdfBlob) => {
                    resolve(pdfBlob);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


    generatePlacementSlip() {
        this.quoteService.generatePlacementSlip(this.quoteId._id, this.selectedQuoteId).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                const ref = this.dialogService.open(QuoteSentForPostPlacementDialogComponent, {
                    header: 'Quote Placement Slip',
                    width: '700px',
                    styleClass: 'flatPopup',
                    data: {
                        quote: this.quote
                    }
                });

                ref.onClose.subscribe(() => {
                    this.router.navigateByUrl(`/backend/quotes`);
                });
            },
            error: (error) => {
                console.error('Error generating placement slip:', error);
            }
        });
    }


    sendQuoteForApproval() {
        console.log(this.quoteId._id);
        this.quoteService.sendForQCRApproval(this.quoteId._id, { quoteSlipApprovalRequested: true, qcrApprovalRequested: false }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // this.messageService.add({
                //     summary: 'Success',
                //     detail: 'Quote Slip Approval Sent Successfully!',
                //     severity: 'success',
                //     life:50000
                // });
                // this.quoteService.refresh((quote) => {
                //     this.router.navigateByUrl(`/backend/quotes`);
                // })
                this.quoteService.refresh((quote) => {
                    const ref = this.dialogService.open(QuoteSentForPlacementCheckerMakerComponent, {
                        header: '',
                        width: '700px',
                        styleClass: 'flatPopup',
                        data: {
                            quote: quote
                        }

                    });

                    ref.onClose.subscribe((isNavigate = true) => {

                        if (isNavigate) this.router.navigateByUrl(`/`);
                    })

                })
            },
            error: error => {
                console.log(error);
            }
        });
    }

    QuoteIsApproval() {
        console.log(this.quoteId._id);

        this.quoteService.sendForQCRApproval(this.quoteId._id, { quoteSlipApprovalRequested: true, qcrApprovalRequested: false }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // this.messageService.add({
                //     summary: 'Success',
                //     detail: 'Quote Slip Approval Sent Successfully!',
                //     severity: 'success',
                //     life:50000
                // });
                // this.quoteService.refresh((quote) => {
                //     this.router.navigateByUrl(`/backend/quotes`);
                // })
                this.quoteService.refresh((quote) => {
                    const ref = this.dialogService.open(QuoteSentPlacementSlipIsApprovedDialogComponent, {
                        header: '',
                        width: '700px',
                        styleClass: 'flatPopup',
                        data: {
                            quote: quote
                        }

                    });

                    ref.onClose.subscribe((isNavigate = true) => {

                        if (isNavigate) this.router.navigateByUrl(`/backend/quotes`);
                    })

                })
            },
            error: error => {
                console.log(error);
            }
        });
    }

    sendQuoteForApprovalplacementslip() {
        console.log(this.quoteId._id);
        this.quoteService.sendForQCRApproval(this.quoteId._id, { quoteSlipApprovalRequested: true, qcrApprovalRequested: false }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quoteService.refresh((quote) => {
                    const ref = this.dialogService.open(NonOtcQuotePlacementSlipGeneratedDialogComponent, {
                        header: '',
                        width: '700px',
                        styleClass: 'flatPopup',
                        data: {
                            quote: quote
                        }

                    });

                    ref.onClose.subscribe((isNavigate = true) => {
                        if (isNavigate) this.router.navigateByUrl(`/backend/quotes`);
                    })

                })
            },
            error: error => {
                console.log(error);
            }
        });
    }
    pushBackTo() {
        const payload = {};
        payload["pushBackFrom"] = AllowedPushbacks.QUOTE_SLIP_GENERATION;
        payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
        this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
            this.router.navigateByUrl('/backend/quotes')
        })
    }

    navigateBack() {
        this.location.back();
    }
}
