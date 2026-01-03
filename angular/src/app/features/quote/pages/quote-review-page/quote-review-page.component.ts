import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AllowedQuoteStates, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Quote } from '@angular/compiler';
import { QuoteSentForApprovalDialogComponent } from '../../status_dialogs/quote-sent-for-approval-dialog/quote-sent-for-approval-dialog.component';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { IMappedICName, IMappedRmEmailICName } from 'src/app/features/admin/partner/partner.model';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IProduct } from 'src/app/features/admin/product/product.model';
import { ChooseVerificationModeDialogComponent } from '../../components/choose-verification-mode-dialog/choose-verification-mode-dialog.component';
import { ChooseVerifierOtpDialogComponent } from '../../components/choose-verifier-otp-dialog/choose-verifier-otp-dialog.component';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { NonOtcQuoteSentToInsurerDialogComponent } from '../../status_dialogs/non-otc-quote-sent-to-insurer-dialog/non-otc-quote-sent-to-insurer-dialog.component';
import { OtcQuotePlacementSlipGeneratedDialogComponent } from '../../status_dialogs/otc-quote-placement-slip-generated-dialog/otc-quote-placement-slip-generated-dialog.component';
import { AppService } from 'src/app/app.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import * as html2pdf from 'html2pdf.js';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import * as XLSX from 'xlsx';
import { GmcQuoteOnscreenCompareDialogComponent } from '../../components/gmc-quote-onscreen-compare-dialog/gmc-quote-onscreen-compare-dialog.component';
import { OtcProductLimitExceededConfirmationDialogComponent } from '../../confirmation_dialogs/otc-product-limit-exceeded-confirmation-dialog/otc-product-limit-exceeded-confirmation-dialog.component';
import { LiabilityQuoteOnscreenCompareDialogComponent } from '../../components/liability-quote-onscreen-compare-dialog/liability-quote-onscreen-compare-dialog.component';


interface Premium {
    sectionOrCover: string,
    sumInsured: Number,
    netPremium: Number,
    gst: Number,
    totalPremium: Number,
}


@Component({
    selector: 'app-quote-review-page',
    templateUrl: './quote-review-page.component.html',
    styleUrls: ['./quote-review-page.component.scss'],
    providers: [DialogService, MessageService]


})
export class QuoteReviewPageComponent implements OnInit, OnDestroy {
    @ViewChild('QuoteSlipPDFPreview') quoteSlipPDFPreview: ElementRef;

    progress;
    id: string;
    quote: IQuoteSlip;
    isDisable: boolean = false;
    premiums: Premium[] = [];
    products: any[] = []
    toWord = new ToWords();
    display: boolean = false;
    isSendForApproval: boolean = false;
    isSendToInsurer: boolean = false;
    isOtc: boolean = false;
    AllowedProductTemplate = AllowedProductTemplate
    currentUser$: any;
    quoteLocationOccupancies: IQuoteLocationOccupancy[]
    private currentQuote: Subscription;
    private currentUser: Subscription;
    isQuoteslipAllowedUser: boolean = false;
    user: any
    role: any;
    isProposalVerified: boolean
    isMobile: boolean = false
    mappedIcNames: IMappedRmEmailICName[]

    // New_Quote_option
    onLoadQuoteOption: string
    quoteOption: IQuoteOption
    selectedQuoteOptionOfProperty: ILov
    private currentPropertyQuoteOption: Subscription;
    private currentSelectedOption: Subscription;
    private currentQuoteOptions: Subscription;
    allQuoteOptionDropdown: ILov[]
    optionsQuoteOptions: any
    allQuoteOptions: any
    selectedQuoteOption: any
    selectedQuoteOptionName: any
    selectedOptions: ILov[]
    showDDls: boolean = false;
    selectedOptionEventId: string
    quoteOptionsLst: any[]
    constructor(

        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private router: Router,
        private accountService: AccountService,
        private dialogService: DialogService,
        public messageService: MessageService,
        private appservice: AppService,
        private renderer: Renderer2,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,

    ) {

        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user;
                this.role = user.roleId['name'];
                if ([
                    AllowedRoles.BROKER_CREATOR,
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                    AllowedRoles.BROKER_APPROVER,
                    AllowedRoles.AGENT_CREATOR,
                    AllowedRoles.AGENT_CREATOR_AND_APPROVER,
                    AllowedRoles.BANCA_APPROVER,
                    AllowedRoles.BANCA_CREATOR,
                    AllowedRoles.BANCA_CREATOR_AND_APPROVER,
                    AllowedRoles.SALES_CREATOR,
                    AllowedRoles.SALES_APPROVER,
                    AllowedRoles.SALES_CREATOR_AND_APPROVER,
                    AllowedRoles.PLACEMENT_CREATOR,
                    AllowedRoles.PLACEMENT_APPROVER,
                    AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
                ].includes(this.role)) {
                    this.isQuoteslipAllowedUser = true;
                }
                else {
                    this.isQuoteslipAllowedUser = false;
                }
            }
        });

        this.activatedRoute.params.subscribe({
            next: (params) => {
                this.loadQuote(params.quote_id)
                // if (this.activatedRoute.snapshot?.queryParams?.quoteOptionId) {
                //     this.loadQuoteOption(this.activatedRoute.snapshot?.queryParams?.quoteOptionId)
                // }

            }
        })

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
                if (this.quote?.productId['productTemplate'] == AllowedProductTemplate.GMC) {
                    //this.quoteService.setQuote(this.quote)
                    this.showDDls = true
                }
                this.checkAndNavigate(quote);

                this.onQuoteSet(quote)

            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOption = dto
                this.onQuoteOptionSet(dto)
            }
        });

        this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                const temp = template;
                this.selectedQuoteOption = template
                this.selectedQuoteOptionName = template?._id

            }
        })
        this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
            next: (template) => {
                const temp = template;
                this.allQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion);
                this.optionsQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion).map(entity => ({ label: entity.optionName, value: entity._id }));
                const opt = this.optionsQuoteOptions.filter(x => x.label == this.selectedQuoteOptionName)[0]
                this.selectedQuoteOptionName = opt?._id
                //this.loadOptionsData(template)
            }
        })

        this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
            next: (allOptions) => {
                this.allQuoteOptions = allOptions;
                this.optionsQuoteOptions = allOptions?.filter(x => x.version == this.quote?.qcrVersion).map(entity => ({ label: entity.optionName, value: entity._id }));
            }
        })

    }

    onQuoteSet(quote: IQuoteSlip) {
        // Check Proposal Is Verified or Not

        if (quote) {

            this.isProposalVerified = this.quote?.otpVerifiedAt != null || this.quote?.offlineVerificationFormUrl != null


            const role = this.user.roleId as IRole

            if (quote?.otcType == AllowedOtcTypes.OTC) {
                this.isOtc = true;
            }
            switch (role.name) {
                case AllowedRoles.AGENT_CREATOR:
                    this.isSendForApproval = true
                    break;
                case AllowedRoles.BROKER_CREATOR:
                    this.isSendForApproval = true;
                    break;
                case AllowedRoles.BANCA_CREATOR:
                    this.isSendForApproval = true
                    break;
                case AllowedRoles.BROKER_APPROVER:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.BANCA_APPROVER:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.AGENT_CREATOR_AND_APPROVER:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.BANCA_CREATOR_AND_APPROVER:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.SALES_CREATOR:
                    this.isSendForApproval = true;
                    break;
                case AllowedRoles.SALES_APPROVER:
                    this.isSendForApproval = true;
                    break;
                case AllowedRoles.SALES_CREATOR_AND_APPROVER:
                    this.isSendForApproval = true;
                    break;
                case AllowedRoles.PLACEMENT_CREATOR:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                    this.isSendToInsurer = true;
                    break;
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    this.isSendToInsurer = true;
                    break;
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
        ].includes(this.quote.productId['productTemplate'])
        // checking if quote option have qcr version object

        return isTemplateAllowed;
    }

    checkAndNavigate(quote: IQuoteSlip) {

        if (quote) {

            const role = this.user.roleId as IRole

            switch (role.name) {
                case AllowedRoles.AGENT_CREATOR:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BROKER_CREATOR:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BANCA_CREATOR:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BROKER_APPROVER:
                    if (![
                        AllowedQuoteStates.WAITING_FOR_APPROVAL
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.WAITING_FOR_APPROVAL,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.AGENT_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.WAITING_FOR_APPROVAL,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BANCA_APPROVER:
                    if (![
                        AllowedQuoteStates.WAITING_FOR_APPROVAL
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.BANCA_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.WAITING_FOR_APPROVAL,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.SALES_CREATOR:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.SALES_APPROVER:
                    if (![
                        AllowedQuoteStates.WAITING_FOR_APPROVAL
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.SALES_CREATOR_AND_APPROVER:
                    if (![
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.WAITING_FOR_APPROVAL,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.PLACEMENT_CREATOR:
                    if (![
                        AllowedQuoteStates.WAITING_FOR_APPROVAL,
                        AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                        AllowedQuoteStates.DRAFT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                    if (![
                        AllowedQuoteStates.WAITING_FOR_APPROVAL
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appservice.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    if (this.user?.partnerId["brokerModeStatus"] == true) {
                        if (![
                            AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                            AllowedQuoteStates.WAITING_FOR_APPROVAL,
                            AllowedQuoteStates.DRAFT,
                            AllowedQuoteStates.SENT_TO_INSURER_RM,
                            AllowedQuoteStates.UNDERWRITTER_REVIEW,
                            AllowedQuoteStates.QCR_FROM_UNDERWRITTER,
                            AllowedQuoteStates.PLACEMENT
                        ].includes(quote.quoteState)) {
                            this.router.navigateByUrl(this.appservice.routes.quotes.list())
                        }
                    } else {
                        if (![
                            AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
                            AllowedQuoteStates.WAITING_FOR_APPROVAL,
                            AllowedQuoteStates.DRAFT,
                        ].includes(quote.quoteState)) {
                            this.router.navigateByUrl(this.appservice.routes.quotes.list())
                        }
                    }
                    break;
            }

        }
    }

    loadQuote(quoteId) {

        this.quoteService.get(quoteId, { allCovers: true }).subscribe({
            next: (dto) => {
                const quote = dto.data.entity

                this.quoteService.setQuote(quote)
            }
        })
    }

    compareLiabilityQuoteOptionsDialog() {
        if (this.optionsQuoteOptions.length > 1) {
            const ref = this.dialogService
                .open(LiabilityQuoteOnscreenCompareDialogComponent, {
                    header: "Quote Option Comparasion",
                    data: {
                        quote: this.quote
                    },
                    width: "60vw",
                    styleClass: "customPopup"
                })
                .onClose.subscribe(() => {
                });
        } else {
            this.messageService.add({
                summary: 'Error',
                detail: `There must be at least 2 options ready for comparision`,
                severity: 'error'
            })
        }
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        //this.getOptionsLiability()
        this.loadSelectedOption(this.selectedQuoteOption)
        this.getAllOptionsByQuoteId()
        this.loadQuoteOption(this.activatedRoute.snapshot?.queryParams?.quoteOptionId)
    }

    getOptionsLiability() {
        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<any[]>) => {
                this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                this.optionsQuoteOptions = this.quoteOptionsLst.map(entity => ({ label: entity.optionName, value: entity._id }));
                this.loadSelectedOption(this.quoteOptionsLst.filter(x => x.optionName == 'Option 1')[0]);
                this.loadOptionsData(this.quoteOptionsLst);

            },
            error: e => {
                console.log(e);
            }
        });
    }


    ngOnDestroy(): void {
        // this.currentQuote.unsubscribe();
        // this.currentUser.unsubscribe();
    }

    ref: DynamicDialogRef

    sendQuoteForApproval() {
        this.quoteService.sendQuoteForApproval(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quoteService.refresh((quote) => {
                    const ref = this.dialogService.open(QuoteSentForApprovalDialogComponent, {
                        header: '',
                        width: '700px',
                        styleClass: 'flatPopup',
                        data: {
                            quote: quote
                        }
                    });

                    ref.onClose.subscribe(() => {
                        this.router.navigateByUrl(`/backend/quotes`);
                    })
                })

            },
            error: error => {
                console.log(error);
            }
        });
    }

    sendQuoteForPlacement() {
        this.quoteService.sendQuoteForApproval(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quoteService.refresh(() => {



                    const ref = this.dialogService.open(QuoteSentForApprovalDialogComponent, {
                        header: '',
                        width: '700px',
                        styleClass: 'flatPopup'
                    });

                    ref.onClose.subscribe(() => {
                        this.router.navigateByUrl(`/`);
                    })
                })

            },
            error: error => {
                console.log(error);
            }
        });
    }

    openVerificatioModeDialog() {
        const ref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
            header: 'Choose Verification Mode:',
            data: {
                quote: this.quote,
            },
            width: '320px',
            // height: '40%',
            styleClass: "flatPopup "
        })

        ref.onClose.subscribe({
            next: () => {
                // this.quoteService.refresh()
            }
        })
        // this.ref?.close();
    }
    navigateToReqPage() {
        if (!this.isAllowedProductLiability()) {
            this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                    this.loadOptionsData(dto.data.entity);
                    this.loadSelectedOption(dto.data.entity[0])
                    if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/requisition`);
                },
                error: e => {
                    console.log(e);
                }
            });
        }
        else {
            this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                next: (dto: IOneResponseDto<any[]>) => {
                    this.loadOptionsData(dto.data.entity);
                    this.loadSelectedOption(dto.data.entity[0])
                    if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/requisition`);
                },
                error: e => {
                    console.log(e);
                }
            });
        }

    }
    loadOptionsData(quoteOption: any[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }

    loadSelectedOption(quoteOption: any) {
        this.quoteService.setSelectedOptions(quoteOption)
    }

    handleQuoteOptionChange(event) {
        console.log('Selected option:', event.value);
        const template = this.allQuoteOptions.filter(x => x._id == event.value)[0]
        this.selectedQuoteOptionName = template?._id
        this.loadSelectedOption(template)
    }

    mappedIcNamesChange(payload) {
        this.mappedIcNames = payload;
    }

    isClickChange(val) {
        this.isDisable = val;
    }

    sendQuoteToInsuranceCompanyRm() {

        if (this.mappedIcNames.length > 0) {
            let payload = {}

            payload['mappedIcNames'] = this.mappedIcNames

            this.quoteService.sendQuoteToInsuranceCompanyRm(this.quote._id, payload).subscribe({
                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                    // this.quoteService.setQuote(dto.data.entity);
                    // this.messageService.add({ severity: 'success', detail: 'Successfully Sent to Insurer' });
                    this.quoteService.refresh((quote) => {

                        // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)
                        const ref = this.dialogService.open(QuoteSentForApprovalDialogComponent, {
                            header: '',
                            width: '700px',
                            styleClass: 'flatPopup',
                            data: {
                                quote: quote
                            }

                        });

                        ref.onClose.subscribe((isNavigate = true) => {
                            // If nothings comes then go to dashboard
                            if (isNavigate) this.router.navigateByUrl(`/backend/quotes`);
                        })

                    })
                    // setTimeout(() => {
                    //     this.quoteService.refresh((quote) => {
                    //         // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });    
                    //         //Commented
                    //         // this.mappedIcNames.forEach(element => {
                    //         //     if (element.isAutoAssignActive) {
                    //         //         this.quoteService.sendQuoteToInsuranceCompanyAutoAssign(this.quote._id, payload).subscribe({
                    //         //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
                    //         //                 // this.quoteService.setQuote(dto.data.entity);
                    //         //                 // NON OTC QUOTE SENT TO INSURER (From Requistion)
                    //         //                 const ref = this.dialogService.open(NonOtcQuoteSentToInsurerDialogComponent, {
                    //         //                     header: '',
                    //         //                     width: '700px',
                    //         //                     styleClass: 'flatPopup'
                    //         //                 });

                    //         //                 ref.onClose.subscribe(() => {
                    //         //                     this.router.navigateByUrl(`/`);
                    //         //                 })
                    //         //             },
                    //         //             error: error => {
                    //         //                 console.log(error);
                    //         //             }
                    //         //         });
                    //         //     }
                    //         // });
                    //     })
                    // }, 3000);
                },
                error: error => {
                    console.log(error);
                }
            });
        } else {
            // alert('Please select atleast 1 Insurer');
        }

    }



    generateEmployeeExl(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            try {
                // Accessing employee data
                const employeeData = this.quote.employeeDataId["employeeData"];

                // Check if employeeData exists and is an array
                if (!Array.isArray(employeeData) || employeeData.length === 0) {
                    return reject('No employee data available');
                }

                // Step 1: Create a worksheet from the employee data
                const worksheet = XLSX.utils.json_to_sheet(employeeData);

                // Step 2: Create a workbook and add the worksheet
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

                // Step 3: Write the workbook to a buffer
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

                // Step 4: Create a Blob from the buffer
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Resolve the promise with the generated blob
                resolve(blob);
            } catch (error) {
                // Reject in case of error
                reject('Error generating Excel file: ' + error);
            }
        });
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

    compareGmcQuoteOptionsDialog() {
        if (this.selectedOptions.length == 0) {
            this.messageService.add({
                severity: "error",
                summary: "Fail",
                detail: "Select option for editing",
                life: 3000
            });
            return;
        }
        const ref = this.dialogService
            .open(GmcQuoteOnscreenCompareDialogComponent, {
                header: "Quote Option Comparasion",
                data: {
                    selectedQuoteTemplate: this.allQuoteOptions,
                    selectedOptions: this.selectedOptions,
                    quote: this.quote
                },
                width: "60vw",
                styleClass: "customPopup"
            })
            .onClose.subscribe(() => {
                //  this.loadQuoteDetails(this.id);
            });
    }

    sendQuoteToInsuranceCompanyRmForOtcProduct() {

        let payload = {}
        payload['isOtc'] = true;

        this.quoteService.sendQuoteToInsuranceCompanyRm(this.quote._id, payload).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // this.quoteService.setQuote(dto.data.entity);
                this.generatePDF().then((pdfBlob) => {

                    const formData = new FormData();
                    formData.append('paymentLink_QuoteSlipPdf_upload', pdfBlob, 'QuoteSlip_' + this.quote.quoteNo + '.pdf');
                    //formData.append('quoteId', this.quote._id);
                    this.quoteService.finalQuoteslipUploadForPaymentLink(formData, this.quote._id).subscribe(response => {
                        // @ts-ignore
                        if (response.status == 'success') {
                        } else {
                        }

                        this.quoteService.refresh((quote) => {

                            // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)
                            const ref = this.dialogService.open(OtcQuotePlacementSlipGeneratedDialogComponent, {
                                header: '',
                                width: '700px',
                                styleClass: 'flatPopup',
                                data: {
                                    quote: quote
                                }

                            });

                            ref.onClose.subscribe((isNavigate = true) => {
                                // If nothings comes then go to dashboard
                                if (isNavigate) this.router.navigateByUrl(`/`);
                            })

                        })

                    })


                }).catch((error) => {
                    console.error('Error generating PDF:', error);
                });





            },
            error: error => {
                console.log(error);
            }
        });




    }


    onQuoteOptionSet(quoteOption: IQuoteOption) {
        if (quoteOption) {
            this.router.navigate([],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: {
                        quoteOptionId: quoteOption?._id
                    },
                    queryParamsHandling: 'merge'
                })
        }
    }

    getAllOptionsByQuoteId() {
        this.selectedQuoteOptionOfProperty = this.activatedRoute.snapshot.queryParams?.quoteOptionId

        this.quoteOptionService.getAllOptionsByQuoteId(this.activatedRoute.snapshot.params.quote_id).subscribe({
            next: (dto: IManyResponseDto<IQuoteOption>) => {
                // this.allQuoteOptionDropdown = dto.data.entities
                //     .map(entity => ({ label: entity.quoteOption, value: entity._id }))
                const quoteOptionVersionData = dto.data.entities.filter(val => val.qcrVersion)
                this.allQuoteOptionDropdown = quoteOptionVersionData.length ?
                    // quoteOptionVersionData.map(entity => ({ label: entity.quoteOption, value: entity._id })) : 
                    [{ label: quoteOptionVersionData[quoteOptionVersionData.length - 1].quoteOption, value: quoteOptionVersionData[quoteOptionVersionData.length - 1]._id }] :
                    dto.data.entities
                        .map(entity => ({ label: entity.expiredQuoteOption == true ? entity.quoteOption = "Expired Option" : entity.quoteOption, value: entity._id }))
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onChangeQuoteOption(quoteOptionId) {
        this.router.navigate([`/backend/quotes/${this.quote._id}/requisition/review`], {
            queryParams: {
                ...this.activatedRoute.snapshot.queryParams,
                quoteOptionId: quoteOptionId
            }
        });
        this.loadQuoteOption(quoteOptionId)
    }

    loadQuoteOption(quoteOptionId) {
        if (quoteOptionId != undefined) {
            this.quoteOptionService.get(quoteOptionId, { allCovers: true }).subscribe({
                next: (dto) => {
                    this.quoteOption = dto.data.entity
                    this.quoteOptionService.setQuoteOptionForProperty(this.quoteOption)
                }
            })
        }
    }

    // New_Quote_option
    generatePlacementQuoteOptionSlip(quoteOptionId) {
        const current_url = window.location.pathname;

        if (quoteOptionId) {
            this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quoteOptionId}?prev=${current_url}`)
        }
    }
}


