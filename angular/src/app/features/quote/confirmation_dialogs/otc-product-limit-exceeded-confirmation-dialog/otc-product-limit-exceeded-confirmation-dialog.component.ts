import { _BSC_TYPES } from './../../../admin/bsc-cover/bsc-cover.model';
import { AllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { AllowedProductBscCover, AllowedProductTemplate } from './../../../admin/product/product.model';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AllowedOtcTypes, IProductPartnerIcConfigration } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ChoosePaymentModeDialogComponent } from '../../components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import * as html2pdf from 'html2pdf.js';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { IBulkImportResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';

@Component({
    selector: 'app-otc-product-limit-exceeded-confirmation-dialog',
    templateUrl: './otc-product-limit-exceeded-confirmation-dialog.component.html',
    styleUrls: ['./otc-product-limit-exceeded-confirmation-dialog.component.scss']
})
export class OtcProductLimitExceededConfirmationDialogComponent implements OnInit {

    @ViewChild('QuoteSlipPDFPreview', { static: false }) quoteSlipPDFPreview: ElementRef;

    quote: IQuoteSlip;
    productPartnerIcConfigurationId: IProductPartnerIcConfigration;
    currentUser$: Observable<IUser>;
    user: IUser

    JSON = JSON
    //toSI: any;

    // New_Quote_option
    quoteOption: IQuoteOption
    private currentPropertyQuoteOption: Subscription;
    private currentSelectedOption: Subscription;
    selectedQuoteOption: any
    selectedQuoteTemplate: any
    constructor(
        private router: Router,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private accountService: AccountService,
        private renderer: Renderer2,
        private quoteOptionService: QuoteOptionService,
        private appService: AppService,
        private quoteService: QuoteService,
        private liabilityService: liabilityTemplateService
    ) {
        this.currentUser$ = this.accountService.currentUser$;
        this.currentUser$.subscribe(user => {
            this.user = user
            console.log(this.user);
        })
        this.quote = this.config.data.quote
        this.productPartnerIcConfigurationId = this.quote.productPartnerIcConfigurations.find((item: { productPartnerIcConfigurationId: IProductPartnerIcConfigration }) => item.productPartnerIcConfigurationId.otcType == AllowedOtcTypes.BOTH || item.productPartnerIcConfigurationId.otcType == AllowedOtcTypes.NONOTC)?.productPartnerIcConfigurationId;

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOption = dto
            }
        });

        this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                const temp = template;
                this.selectedQuoteOption = template._id;
                this.selectedQuoteTemplate = template;

            }

        })
    }
    nonOtcBreachedValue = []
    ngOnInit(): void {
        const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
        const configurationOtcTypes = productPartnerIcConfigurations.map((item: { productPartnerIcConfigurationId: IProductPartnerIcConfigration }) => item.productPartnerIcConfigurationId?.otcType)
        const isOtcBreached = configurationOtcTypes.includes(AllowedOtcTypes.BOTH)
        if (this.quote?.nonOtcBreachedValue) {
            this.nonOtcBreachedValue = this.quote?.nonOtcBreachedValue.split(',')
        }

        if ((this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY || this.quote.productId['productTemplate'] == AllowedProductTemplate.WORKMENSCOMPENSATION
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_EANDO || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL ||
            this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CYBER || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) && this.quote.quoteState == 'Under Writter Review'
        ) {
            if (isOtcBreached) {
                this.quote.nonOtcBreachedValue
            } else {
                this.nonOtcBreachedValue = []
                this.nonOtcBreachedValue.push("AS this product is by default Non-OTC product there is no exceed reason for it");
            }
        }
        else {
            this.nonOtcBreachedValue = this.nonOtcBreachedValue.map(item => {
                if (item.includes(AllowedListOfValuesMasters.BSC_FIDELITY_GURANTEE_RISK_TYPE)) {
                    let t = item.replace(AllowedListOfValuesMasters.BSC_FIDELITY_GURANTEE_RISK_TYPE, 'FIDELITY GURANTEE RISK TYPE')
                    return t.toLowerCase();
                }
                if (item.includes(AllowedListOfValuesMasters.BSC_ACCOMPANIED_BAGGAGE_TYPE)) {
                    let t = item.replace(AllowedListOfValuesMasters.BSC_ACCOMPANIED_BAGGAGE_TYPE, 'ACCOMPANIED BAGGAGE TYPE')
                    return t.toLowerCase();
                }
                if (item.includes(AllowedListOfValuesMasters.BSC_FIXED_PLATE_GLASS_TYPE)) {
                    let t = item.replace(AllowedListOfValuesMasters.BSC_FIXED_PLATE_GLASS_TYPE, 'FIXED PLATE GLASS TYPE')
                    return t.toLowerCase();
                }
                if (item.includes(AllowedListOfValuesMasters.BSC_LIABILITY_SECTION_RISK_TYPE)) {
                    let t = item.replace(AllowedListOfValuesMasters.BSC_LIABILITY_SECTION_RISK_TYPE, 'LIABILITY SECTION RISK TYPE')
                    return t.toLowerCase();
                }
                if (item.includes(AllowedListOfValuesMasters.BSC_PORTABLE_EQUIPMENT_TYPE)) {
                    let t = item.replace(AllowedListOfValuesMasters.BSC_PORTABLE_EQUIPMENT_TYPE, 'PORTABLE EQUIPMENT TYPE')
                    return t.toLowerCase();
                }
                if (item.includes(AllowedListOfValuesMasters.BSC_SIGNAGE_TYPE)) {
                    let t = item.replace(AllowedListOfValuesMasters.BSC_SIGNAGE_TYPE, 'SIGNAGE TYPE')
                    return t.toLowerCase();
                }
                if (item.includes(_BSC_TYPES.fire_loss_of_profit)) {
                    let t = item.replace(_BSC_TYPES.fire_loss_of_profit, 'Fire Loss Of Profit')
                    return t;
                }
                if (item.includes(_BSC_TYPES.money_in_safe_till)) {
                    let t = item.replace(_BSC_TYPES.money_in_safe_till, 'Money In Safe Till')
                    return t;
                }
                if (item.includes(_BSC_TYPES.money_in_transit)) {
                    let t = item.replace(_BSC_TYPES.money_in_transit, 'Money In Transit')
                    return t;
                }
                if (item.includes(_BSC_TYPES.electronic_equipments)) {
                    let t = item.replace(_BSC_TYPES.electronic_equipments, 'Electronic Equipments')
                    return t;
                }
                if (item.includes(_BSC_TYPES.pedal_cycle_type)) {
                    let t = item.replace(_BSC_TYPES.pedal_cycle_type, 'Pedal Cyclem Type')
                    return t;
                }
                if (item.includes(_BSC_TYPES.risk_all_type)) {
                    let t = item.replace(_BSC_TYPES.risk_all_type, 'Risk All Type')
                    return t;
                }
                if (item.includes(_BSC_TYPES.workmen_compansation_risk_type)) {
                    let t = item.replace(_BSC_TYPES.workmen_compansation_risk_type, 'Workmen Compansation Risk Type')
                    return t;
                }
                if (item.includes(_BSC_TYPES.personal_accident_cover)) {
                    let t = item.replace(_BSC_TYPES.personal_accident_cover, 'Personal Accident Cover')
                    return t;
                }

                return item;
            })
        }
    }

    accept() {
        this.ref.close(true);
    }

    exit() {
        this.ref.close(false);
    }

    async downloadDocument({ fileFormatToGenerate }: { fileFormatToGenerate: string }): Promise<void> {
        try {
            const payload = { quoteId: this.quote?._id, fileFormatToGenerate: fileFormatToGenerate, quoteNo: this.quote?.quoteNo, quoteState: this.quote?.quoteState, };
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
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
            // Use this.quote.id instead of this.quoteId
            this.quoteOptionService.downloadQCRExcelGmc(this.selectedQuoteOption, this.quote.quoteNo).subscribe({
                next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                    if (dto.status == 'success') {
                        // Download the sample file
                        this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

                    }
                }
            })
        }
        else if (this.isAllowedProductLiability()) {
            this.liabilityService.downloadQCRExcelLiability(this.selectedQuoteOption, this.quote.quoteNo, this.quote.productId["_id"]).subscribe({
                next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                    if (dto.status == 'success') {
                        this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)
                    }
                }
            })
        }
        else {
            // Use this.quote.id instead of this.quoteId
            this.quoteOptionService.downloadQCRExcel(this.quoteOption._id, this.quote.quoteNo).subscribe({
                next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                    if (dto.status == 'success') {
                        // Download the sample file
                        this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

                    }
                }
            })
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
        return isTemplateAllowed;
    }

}
