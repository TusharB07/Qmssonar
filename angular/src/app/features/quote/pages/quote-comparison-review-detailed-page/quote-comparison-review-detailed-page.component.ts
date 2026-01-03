import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AllowedAddonCoverCategory, AllowedAddonTypeFlag } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { AllowedProductBscCover, AllowedProductTemplate, AllowedPushbacks, IProduct, OPTIONS_PRODUCT_BSC_COVERS } from 'src/app/features/admin/product/product.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, AllowedQuoteTypes, IQuoteOption, IQuoteSlip, OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { AppService } from "../../../../app.service";
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};
import { FormBuilder } from '@angular/forms';
import { QuoteSentForApprovalDialogComponent } from '../../status_dialogs/quote-sent-for-approval-dialog/quote-sent-for-approval-dialog.component';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { CoInsuranceFormDialogComponent } from '../../components/other-details-crud-card/co-insurance-form-dialog/co-insurance-form-dialog.component';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProjectDetailsDialogComponent } from 'src/app/features/broker/project-details-dialog/project-details-dialog.component';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';
import { ProjectDetailsService } from 'src/app/features/broker/project-details-dialog/project-details.service';
import { QuoteSentForPlacementCheckerMakerComponent } from '../../status_dialogs/quote-sent-for-placement-checker-maker/quote-sent-for-placement-checker-maker.component';
import { QuoteSentForPlacementMakerComponent } from '../../status_dialogs/quote-sent-for-placement-maker/quote-sent-for-placement-maker.component';
import { IcListDialogComponent } from './ic-list-dialog/ic-list-dialog.component';


@Component({
    selector: 'app-quote-comparison-review-detailed-page',
    templateUrl: './quote-comparison-review-detailed-page.component.html',
    styleUrls: ['./quote-comparison-review-detailed-page.component.scss']
})

export class QuoteComparisonReviewDetailedPageComponent implements OnInit {


    id: string;
    quote: IQuoteSlip;

    private currentQuote: Subscription;

    tabs: MenuItem[] = [];
    // openDropDownClaimExpireance:object = { 'display': 'none' };
    openDropDownClaimExpireance: boolean = false;
    isCloseErrow: boolean = false;
    isOpenErrow: boolean = true;
    selectedQuoteLocationOccupancy: ILov;
    optionsQuoteLocationOccupancies: ILov[];

    visibleSidebar = false;
    displayBasic = false;
    message: any;
    sendLinkForm: any;

    // New_Quote_Option
    quoteOptionId: string;
    private currentPropertyQuoteOption: Subscription;
    quoteOptionData: IQuoteOption
    selectedQuoteOptionOfProperty: ILov
    allQuoteOptionDropdown: ILov[]
    private currentUser: Subscription;
    user: IUser;
    isMobile: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private dialogService: DialogService,
        private appService: AppService,
        private claimExperienceService: ClaimExperienceService,
        private quoteOptionService: QuoteOptionService,

        private fb: FormBuilder,
        private messageService: MessageService,
        private accountService: AccountService,
        private deviceService: DeviceDetectorService,
        private projectDetailsService: ProjectDetailsService
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.quoteOptionId = this.activatedRoute.snapshot.queryParams.quoteOptionId;

        this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto) => {
                this.quoteOptionData = dto
            }
        });
        this.sendLinkForm = this.fb.group({
            email: ['']
        })
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user;
                console.log(user);
            }
        });
    }

    claimExperiences: IClaimExperience[] = []
    selectedTabId: string;

    ngOnInit(): void {
        // this.loadQuoteLocationOccupancies();

        this.getQuoteOptions()

    }



    ngOnDestroy(): void {
        // this.currentQuoteLocationOccupancyId.unsubscribe();
        this.currentQuote.unsubscribe();
    }

    visible() {
        this.visibleSidebar = true
    }

    mapping = []
    // mapping: Array<{
    //     [colId: string]: {
    //         type: 'html' | 'string' | 'button' | 'boolean' | 'currency',
    //         value: string | number,
    //         buttonClassName?: string
    //         buttonOnClick?: any

    //     }
    // }> = []

    cols: MenuItem[] = []

    // ---------------------------------------------------------------

    loadData(brokerQuoteOption: IQuoteOption) {
        this.cols = [];
        this.tabs = this.loadTabs(brokerQuoteOption.quoteId["productId"] as IProduct)
        // Old_Quote
        // this.selectTab(this.tabs.find(tab => tab.id == this.selectedTabId))

        // New_Quote_option
        this.selectTabQuoteOptionWise(this.tabs.find(tab => tab.id == this.selectedTabId))

        // Setting the headers
        this.cols.push({ id: 'labels', style: "width:200px" })

        // Pushing the Broker Quote Header
        this.cols.push({ id: brokerQuoteOption.quoteId["_id"], label: brokerQuoteOption.quoteId["originalIntermediateName"], style: "width:200px" })

        // Expired Term
        // Pushing  Insurer Quote Headers
        // if (brokerQuote.partnerId["brokerModeStatus"] == true) {
        //     for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
        //         if (insurerQuote.parentQuoteId) {
        //             insurerQuote.partnerId['name'] = "Expired Term"
        //         }
        //         this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
        //     }
        // } else {
        for (const insurerQuote of this.quote.insurerProcessedQuotes) {
            this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })

            // }
        }
    }


    loadTabs(product: IProduct): MenuItem[] {
        switch (product.productTemplate) {
            case AllowedProductTemplate.BLUS:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Coverage and Addons", id: "add_ons" },
                    // { label: "Business Suraksha Covers", id: "business_suraksha_covers" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                    { label: "Other Details", id: "other_details" },
                ]

            case AllowedProductTemplate.FIRE:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Coverage and Addons", id: "add_ons" },
                    //{ label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                    { label: "Other Details", id: "other_details" },
                ]
            case AllowedProductTemplate.IAR:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Coverage and Addons", id: "add_ons" },
                    //{ label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                    { label: "Other Details", id: "other_details" },
                ]
            case AllowedProductTemplate.MARINE:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Add-ons", id: "add_ons" },
                    { label: "Other Details", id: "other_details" },
                ]
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                return [
                    { label: "Workmen Details", id: "wm_details" },
                    { label: "Additional Coverages", id: "additional_coverages" },
                ]
            case AllowedProductTemplate.GMC:
                if (this.quote.quoteType != 'new') {
                    return [
                        { label: "Client Details", id: "client_details" },
                        { label: "Basic Details", id: "basic_details" },
                        { label: "Employee Details", id: "employee_features" },
                        { label: "Family Composition", id: "family_composition" },
                        { label: "Coverages", id: "coverages" },
                        { label: "Maternity Benifits", id: "maternity_benifits" },
                        { label: "Other Restrictions", id: "cost_containment" },
                        { label: "Claim Analytics", id: "claim_analytics" },
                        { label: "Final Rater", id: "final_rater" },
                        { label: "Other Details", id: "other_details" }

                    ]
                }
                else {
                    return [{ label: "Client Details", id: "client_details" },
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Employee Details", id: "employee_features" },
                    { label: "Family Composition", id: "family_composition" },
                    { label: "Coverages", id: "coverages" },
                    { label: "Maternity Benifits", id: "maternity_benifits" },
                    { label: "Other Restrictions", id: "cost_containment" },
                    // { label: "Claim Analytics", id: "claim_analytics" },
                    // { label: "Final Rater", id: "final_rater" },
                    { label: "Other Details", id: "other_details" }
                    ]
                }
            case AllowedProductTemplate.LIABILITY:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    // { label: "Exclusion & Subjectivity", id: "exclusionsubjectivity" },
                    { label: "Deductibles", id: "deductibles" },
                ]
            case AllowedProductTemplate.LIABILITY_EANDO:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    { label: "Revenue Details", id: "revenue_details" },
                    { label: "Deductibles", id: "deductibles" },
                ]
            case AllowedProductTemplate.LIABILITY_CGL:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    { label: "Claim Experience & Turnover Details", id: "revenue_details" },
                ]
            case AllowedProductTemplate.LIABILITY_PRODUCT:
                return [
                    { label: "Basic Details", id: 'basic_details' },
                    { label: "Territory & Subsidiary Details", id: 'territorysubsidiary' },
                    { label: "Turnover Details", id: 'revenue_details' },
                    { label: "Deductibles & Claim Experience", id: 'deductibles' }
                ]
            case AllowedProductTemplate.LIABILITY_CYBER:
                return [
                    { label: "Basic Details", id: 'basic_details' },
                    { label: "Territory & Subsidiary Details", id: 'territorysubsidiary' },
                    { label: "Breakup Details", id: 'revenue_details' },
                    { label: "Deductibles & Claim Experience", id: 'deductibles' }
                ]
            case AllowedProductTemplate.LIABILITY_PUBLIC:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory Details", id: "territorysubsidiary" },
                    { label: "Turnover Details", id: "revenue_details" },
                ]
            case AllowedProductTemplate.LIABILITY_CRIME:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    { label: "Breakup Details", id: 'revenue_details' },
                    { label: "Deductibles & Claim Experience", id: 'deductibles' }

                ]
        }
    }

    selectTab(tab?: MenuItem) {

        if (!tab) tab = this.tabs.find(tab => tab.id == this.selectedTabId) ?? this.tabs[0]
        this.router.navigate([], { queryParams: { tab: tab?.id, location: this.selectedQuoteLocationOccupancy?.value ?? this.selectedQuoteLocationOccupancy, quoteOptionId: this.quoteOptionId } });
        this.selectedTabId = tab?.id
        this.mapping = []

        this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "" },
            [this.quote?._id]: { type: 'button', buttonClassName: "btn btn-primary p-0 px-2", onClick: () => this.openQuoteSlip(), value: 'View Quote' },
        }, ...this.quote?.insurerProcessedQuotes.map((quote) => {
            return ({
                [quote._id]: {
                    type: 'buttons', buttons: [
                        { onClick: () => this.openQuoteSlip(quote._id), buttonClassName: "btn btn-primary p-0 px-2", value: 'View Quote' },
                        {
                            onClick: () =>
                                quote?.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER ? this.generatePlacementSlip(quote._id) : this.openRejectedReason(quote?.rejectReason),
                            buttonClassName: quote?.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER ? "btn btn-success p-0 px-2 ml-2" : "btn btn-danger p-0 px-2 ml-2",
                            value: quote?.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER ? 'Generate Placement Slip' : 'Rejected Quote'
                        },
                    ]
                }
            })
        })));


        this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Premium Without Taxes" },
            [this.quote._id]: { type: 'currency', value: this.quote.totalIndictiveQuoteAmt },
        }, ...this.quote.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'currency', value: quote.totalIndictiveQuoteAmt } })
        })));

        switch (tab?.id) {
            case 'client_details':
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Policy" },
                    [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured Name" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['name'] },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.clientId['name'] } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Proposal" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteType },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.quoteType != quote.quoteType ? this.quote.quoteType : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Details of Existing Insurer</strong>" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Name of Insurer" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "City of Insurer Office", },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "DO No." },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Current Policy Details</strong>" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));


                if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: "Expiring Policy Period" },
                        [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                    })));
                }

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Policy Period" },
                    [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                })));


                // NOT NEEDED IN QCR
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Policy Range Month / Year" },
                //     [this.quote._id]: { type: 'string', value: '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                // })));

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Renewal Policy Period" },
                //     [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                // })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured's Business" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['natureOfBusiness'] ?? '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: quote.clientId['natureOfBusiness'] ?? '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Risk Location/s" },
                    [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray?.quoteLocationOccupancies?.length },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: quote?.allCoversArray?.quoteLocationOccupancies?.length } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Co-Insurer", },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Risk Description" },
                //     [this.quote._id]: { type: 'string', value: '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                // })));



                break;

            case 'sum_insured_details':

                // Get Higher Breakup Name
                let higherSumAssuredLocatioName = `${this.quote.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quote.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                let breakupKeys = []

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Total Sum Insured" },
                    [this.quote._id]: { type: 'currency', value: this.quote.totalSumAssured },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'currency', value: quote.totalSumAssured, styleaddon: quote.totalSumAssured != this.quote.totalSumAssured ? 'black' : '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Higher Location Sum" },

                    [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray.higherSumAssuredLocation.sumAssured },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({
                        [quote._id]: {
                            type: 'currency', value: quote.allCoversArray.higherSumAssuredLocation.sumAssured,
                            styleaddon: quote.allCoversArray.higherSumAssuredLocation.sumAssured != this.quote.allCoversArray.higherSumAssuredLocation.sumAssured ? 'black' : ''
                        }
                    })
                })));

                this.mapping.push({
                    'labels': { type: 'html', value: '' }
                });

                // Loop Over entire breakup and pushs the data to mapping

                if (this.quote.allCoversArray) {
                    let level1HeaderKey = '';
                    let level2HeaderKey = '';
                    let level3HeaderKey = '';
                    let level4HeaderKey = '';

                    Object.entries(this.quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([breakUpkey, breakup]) => {

                        // Select Value of Higher Breakup from breakup response
                        let value = Object.entries(breakup).find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1] ?? 0

                        value = typeof (value) == 'number' ? Number(value) : value
                        // Header Logic

                        if (level1HeaderKey != breakUpkey.split('::>::')[0]) {
                            level1HeaderKey = breakUpkey.split('::>::')[0];

                            if (level1HeaderKey) {

                                if (breakUpkey.split('::>::').length > 1) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level1HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level1HeaderKey },
                                        [this.quote._id]: { type: typeof (value) == 'string' ? 'string' : 'currency', isAlignmentRequired: true, value: value },
                                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quote.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: typeof (insurerBreakupValue) == 'string' ? 'string' : 'currency', isAlignmentRequired: true, value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }


                        if (level2HeaderKey != breakUpkey.split('::>::')[1]) {
                            level2HeaderKey = breakUpkey.split('::>::')[1];

                            if (level2HeaderKey) {

                                if (breakUpkey.split('::>::').length > 2) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level2HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level2HeaderKey },
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quote.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }

                        if (level3HeaderKey != breakUpkey.split('::>::')[2]) {
                            level3HeaderKey = breakUpkey.split('::>::')[2];

                            if (level3HeaderKey) {

                                if (breakUpkey.split('::>::').length > 3) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level3HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level3HeaderKey },
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quote.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }

                        if (level4HeaderKey != breakUpkey.split('::>::')[3]) {
                            level4HeaderKey = breakUpkey.split('::>::')[3];

                            if (level4HeaderKey) {

                                if (breakUpkey.split('::>::').length > 4) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level4HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level4HeaderKey },
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quote.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }
                    })
                }

                switch (this.quote.productId['productTemplate']) {
                    case AllowedProductTemplate.IAR:
                        this.mapping.push({
                            'labels': { type: 'html', value: '' }
                        });

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Machinery / Electrical BreakDown </strong>' }
                        });

                        const higherQuoteLocationOccupancy = this.quote?.allCoversArray?.higherSumAssuredLocation

                        const higherMachineryAndElectricalBreakdown = this.quote?.allCoversArray?.machineryElectricalBreakdown?.find((item) => item._id = higherQuoteLocationOccupancy._id)

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Reduction in Sum Insured on accountof piping etc (${higherMachineryAndElectricalBreakdown?.machineryPercentage ?? 0}%)` },
                            [this.quote._id]: { type: 'currency', value: higherMachineryAndElectricalBreakdown?.sumInsurred ?? 0 }
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                            const higherQuoteLocationOccupancy = this.quote?.allCoversArray?.higherSumAssuredLocation

                            const higherMachineryAndElectricalBreakdown = this.quote?.allCoversArray?.machineryElectricalBreakdown?.find((item) => item._id = higherQuoteLocationOccupancy._id)

                            return ({ [quote._id]: { type: 'currency', value: higherMachineryAndElectricalBreakdown?.sumInsurred ?? 0 } })
                        })));

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Fire Loss of profit (FLop) </strong>' }
                        });
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Gross Profit` },
                            [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0 }
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0 } })
                        })));
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Indmenity Period` },
                            [this.quote._id]: { type: 'string', isAlignmentRequired: true, value: this.quote.allCoversArray.bscFireLossOfProfitCover?.indmenityPeriod ?? 'N/A' }
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'string', isAlignmentRequired: true, value: quote.allCoversArray?.bscFireLossOfProfitCover?.indmenityPeriod ?? 'N/A' } })
                        })));

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Machinery Loss Of Profit (MBLOP) </strong>' }
                        });
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Gross Profit` },
                            [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0 }
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0 } })
                        })));
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Indmenity Period` },
                            [this.quote._id]: { type: 'string', isAlignmentRequired: true, value: this.quote.allCoversArray?.machineryLossOfProfitCover?.indmenityPeriod ?? 'N/A' }
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'string', isAlignmentRequired: true, value: quote.allCoversArray?.machineryLossOfProfitCover?.indmenityPeriod ?? 'N/A' } })
                        })));
                        break;
                }


                break;

            case 'add_ons':

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'Earthquake' },
                    [this.quote._id]: { type: 'boolean', value: this.quote.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'boolean', value: quote.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'STFI' },
                    [this.quote._id]: { type: 'boolean', value: this.quote.locationBasedCovers?.quoteLocationOccupancy?.isStfi },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'boolean', value: quote.locationBasedCovers?.quoteLocationOccupancy?.isStfi } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'Terrorism' },
                    [this.quote._id]: { type: 'boolean', value: this.quote.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'boolean', value: quote.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism } })
                })));


                this.mapping.push({
                    'labels': { type: 'html', value: '<strong>Property Damage </strong>' }
                });

                // Loaded Add on Covers Dynamically
                for (let cover of this.quote?.locationBasedCovers?.quoteLocationAddonCovers
                    .filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                    .filter(cover => cover?.addOnCoverId?.addonTypeFlag != AllowedAddonTypeFlag.FREE)
                    .filter(cover => cover?.addOnCoverId?.sectorId._id == this.quote.sectorId['_id'])
                    .map((cover) => {
                        return ({ id: cover.addOnCoverId['_id'], label: cover.addOnCoverId['name'], value: cover['sumInsured'] })
                    })) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: cover.label },
                        [this.quote._id]: { type: 'currency', value: cover.value },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency'
                                , value: quote.locationBasedCovers?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured']
                                , styleaddon: quote.locationBasedCovers?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured'] != cover.value
                                    ? 'black'
                                    : ''
                            }
                        })
                    })));
                }

                if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) {

                    this.mapping.push({
                        'labels': { type: 'html', value: '<strong>Business Interreption </strong>' }
                    });

                    for (let cover of this.quote?.locationBasedCovers?.quoteLocationAddonCovers.filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.BUSINESS_INTURREPTION).filter(cover => cover.isChecked).map((cover) => {
                        return ({ id: cover.addOnCoverId['_id'], label: cover.addOnCoverId['name'], value: cover['sumInsured'] })
                    })) {
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: cover.label },
                            [this.quote._id]: { type: 'currency', value: cover.value },
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'currency', value: quote.locationBasedCovers?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured'] } })
                        })));
                    }
                }
                break;

            case 'risk_management_features':

                // TODO: NEEDS TO BE IMPLEMED
                const higherSumAssuredLocatioId = this.quote.locationBasedCovers?.quoteLocationOccupancy?._id

                for (const riskManagementFeature of this.quote.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.quoteLocationOccupancyId == higherSumAssuredLocatioId)) {

                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: riskManagementFeature['name'] },
                        [this.quote._id]: { type: 'string', value: riskManagementFeature['checkbox'] == false ? "Not Selected" : "Selected" },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                        let item = quote.locationBasedCovers?.riskManagementFeatures.find((inRiskManagementFeature) => inRiskManagementFeature['riskManagementFeaturesdict']['name'] == riskManagementFeature['name'])
                        let quoteItem = this.quote.locationBasedCovers?.riskManagementFeatures.find((inRiskManagementFeature) => inRiskManagementFeature['riskManagementFeaturesdict']['name'] == riskManagementFeature['name']);

                        return ({ [quote._id]: { type: 'string', value: item['riskManagementFeaturesdict']['checkbox'] == false ? "Not Selected" : "Selected", styleaddon: item['riskManagementFeaturesdict']['checkbox'] != quoteItem['riskManagementFeaturesdict']['checkbox'] ? 'black' : '' } })
                    })));
                }
                break;

            case 'business_suraksha_covers':

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.FLOATER_COVER_ADD_ON).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalFloater },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency', value: quote.totalFloater,
                                styleaddon: this.quote.totalFloater != quote.totalFloater ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.DECLARATION_POLICY).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalDeclarationPolicy },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency', value: quote.totalDeclarationPolicy,
                                styleaddon: this.quote.totalDeclarationPolicy != quote.totalDeclarationPolicy ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.LOSE_OF_RENT).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalLossOfRent },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency', value: quote.totalLossOfRent,
                                styleaddon: this.quote.totalLossOfRent != quote.totalLossOfRent ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalRentForAlternative },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency', value: quote.totalRentForAlternative,
                                styleaddon: this.quote.totalRentForAlternative != quote.totalRentForAlternative ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.PERSONAL_ACCIDENT_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalPersonalAccident },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalPersonalAccident != 0 && quote.totalPersonalAccident == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalPersonalAccident != 0 && quote.totalPersonalAccident == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER) ? 'DENIED' : quote.totalPersonalAccident,
                            //     styleaddon: this.quote.totalPersonalAccident != quote.totalPersonalAccident ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalPersonalAccident != 0 && quote.totalPersonalAccident == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalPersonalAccident,
                                styleaddon: this.quote.totalPersonalAccident != quote.totalPersonalAccident ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalValuableContent },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency', value: quote.totalValuableContent,
                                styleaddon: this.quote.totalValuableContent != quote.totalValuableContent ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalFireLossOfProfit },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalFireLossOfProfit != 0 && quote.totalFireLossOfProfit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalFireLossOfProfit != 0 && quote.totalFireLossOfProfit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER) ? 'DENIED' : quote.totalFireLossOfProfit,
                            //     styleaddon: this.quote.totalFireLossOfProfit != quote.totalFireLossOfProfit ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalFireLossOfProfit != 0 && quote.totalFireLossOfProfit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.locationBasedCovers?.bscFireLossOfProfitCover?.total,
                                styleaddon: this.quote.locationBasedCovers?.bscFireLossOfProfitCover?.total != quote.locationBasedCovers?.bscFireLossOfProfitCover?.total ? 'black' : '',
                                // isAlignmentRequired: this.quote.totalFireLossOfProfit != 0 && quote.totalFireLossOfProfit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER) ? true : false
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            [quote._id]: {
                                type: 'currency', value: quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total,
                                styleaddon: this.quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total != quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total != 0 && quote.locationBasedCovers?.bscMoneySafeTillCover?.total == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) ? 'string' : 'currency',
                            //     value: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total != 0 && !quote.locationBasedCovers?.bscMoneySafeTillCover && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) ? 'DENIED' : quote.locationBasedCovers?.bscMoneySafeTillCover?.total,
                            //     styleaddon: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total != quote.locationBasedCovers?.bscMoneySafeTillCover?.total ? 'black' : '',
                            //     isAlignmentRequired: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total != 0 && quote.locationBasedCovers?.bscMoneySafeTillCover?.total == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.locationBasedCovers?.bscMoneySafeTillCover?.total,
                                styleaddon: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total != quote.locationBasedCovers?.bscMoneySafeTillCover?.total ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalMoneyTransit },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalMoneyTransit != 0 && quote.totalMoneyTransit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalMoneyTransit != 0 && quote.totalMoneyTransit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER) ? 'DENIED' : quote.totalMoneyTransit,
                            //     styleaddon: this.quote.totalMoneyTransit != quote.totalMoneyTransit ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalMoneyTransit != 0 && quote.totalMoneyTransit == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalMoneyTransit,
                                styleaddon: this.quote.totalMoneyTransit != quote.totalMoneyTransit ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total != 0 && quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) ? 'string' : 'currency',
                            //     value: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total != 0 && !quote.locationBasedCovers?.bscElectronicEquipmentsCover && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) ? 'DENIED' : quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total,
                            //     styleaddon: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total != quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total ? 'black' : '',
                            //     isAlignmentRequired: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total != 0 && quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total,
                                styleaddon: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total != quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalPortableEquipment },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalPortableEquipment != 0 && quote.totalPortableEquipment == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalPortableEquipment != 0 && quote.totalPortableEquipment == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER) ? 'DENIED' : quote.totalPortableEquipment,
                            //     styleaddon: this.quote.totalPortableEquipment != quote.totalPortableEquipment ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalPortableEquipment != 0 && quote.totalPortableEquipment == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalPortableEquipment,
                                styleaddon: this.quote.totalPortableEquipment != quote.totalPortableEquipment ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalPedalCycle },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalPedalCycle != 0 && quote.totalPedalCycle == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalPedalCycle != 0 && quote.totalPedalCycle == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER) ? 'DENIED' : quote.totalPedalCycle,
                            //     styleaddon: this.quote.totalPedalCycle != quote.totalPedalCycle ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalPedalCycle != 0 && quote.totalPedalCycle == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalPedalCycle,
                                styleaddon: this.quote.totalPedalCycle != quote.totalPedalCycle ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.locationBasedCovers?.bscFixedPlateGlassCover?.total },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.locationBasedCovers?.bscFixedPlateGlassCover?.total != 0 && quote.locationBasedCovers?.bscFixedPlateGlassCover?.total == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) ? 'string' : 'currency',
                            //     value: this.quote.locationBasedCovers?.bscFixedPlateGlassCover?.total != 0 && !quote.locationBasedCovers?.bscFixedPlateGlassCover && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) ? 'DENIED' : quote.locationBasedCovers?.bscFixedPlateGlassCover?.total,
                            //     styleaddon: this.quote.locationBasedCovers?.bscFixedPlateGlassCover?.total != quote.locationBasedCovers?.bscFixedPlateGlassCover?.total ? 'black' : '',
                            //     isAlignmentRequired: this.quote.locationBasedCovers?.bscFixedPlateGlassCover?.total != 0 && quote.locationBasedCovers?.bscFixedPlateGlassCover?.total == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalFixedPlateGlass,
                                styleaddon: this.quote.totalFixedPlateGlass != quote.totalFixedPlateGlass ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalAccompaniedBaggage },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalAccompaniedBaggage != 0 && quote.totalAccompaniedBaggage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalAccompaniedBaggage != 0 && quote.totalAccompaniedBaggage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER) ? 'DENIED' : quote.totalAccompaniedBaggage,
                            //     styleaddon: this.quote.totalAccompaniedBaggage != quote.totalAccompaniedBaggage ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalAccompaniedBaggage != 0 && quote.totalAccompaniedBaggage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalAccompaniedBaggage,
                                styleaddon: this.quote.totalAccompaniedBaggage != quote.totalAccompaniedBaggage ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalFidelityGuarantee },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalFidelityGuarantee != 0 && quote.totalFidelityGuarantee == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalFidelityGuarantee != 0 && quote.totalFidelityGuarantee == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER) ? 'DENIED' : quote.totalFidelityGuarantee,
                            //     styleaddon: this.quote.totalFidelityGuarantee != quote.totalFidelityGuarantee ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalFidelityGuarantee != 0 && quote.totalFidelityGuarantee == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalFidelityGuarantee,
                                styleaddon: this.quote.totalFidelityGuarantee != quote.totalFidelityGuarantee ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_SIGNAGE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalSignage },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalSignage != 0 && quote.totalSignage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalSignage != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER) && quote.totalSignage == 0 ? 'DENIED' : quote.totalSignage,
                            //     styleaddon: this.quote.totalSignage != quote.totalSignage ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalSignage != 0 && quote.totalSignage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalSignage,
                                styleaddon: this.quote.totalSignage != quote.totalSignage ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_ALL_RISK_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalAllRisk },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalAllRisk != 0 && quote.totalAllRisk == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalAllRisk != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER) && quote.totalAllRisk == 0 ? 'DENIED' : quote.totalAllRisk,
                            //     styleaddon: this.quote.totalAllRisk != quote.totalAllRisk ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalAllRisk != 0 && quote.totalAllRisk == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalAllRisk,
                                styleaddon: this.quote.totalAllRisk != quote.totalAllRisk ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalLiabilitySection },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalLiabilitySection != 0 && quote.totalLiabilitySection == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalLiabilitySection != 0 && quote.totalLiabilitySection == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER) ? 'DENIED' : quote.totalLiabilitySection,
                            //     styleaddon: this.quote.totalLiabilitySection != quote.totalLiabilitySection ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalLiabilitySection != 0 && quote.totalLiabilitySection == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalLiabilitySection,
                                styleaddon: this.quote.totalLiabilitySection != quote.totalLiabilitySection ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalWorkmenCompensation },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalWorkmenCompensation != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER) && quote.totalWorkmenCompensation == 0 ? 'string' : 'currency',
                            //     value: this.quote.totalWorkmenCompensation != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER) && quote.totalWorkmenCompensation == 0 ? 'DENIED' : quote.totalWorkmenCompensation,
                            //     styleaddon: this.quote.totalWorkmenCompensation != quote.totalWorkmenCompensation ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalWorkmenCompensation != 0 && quote.totalWorkmenCompensation == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalWorkmenCompensation,
                                styleaddon: this.quote.totalWorkmenCompensation != quote.totalWorkmenCompensation ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.ACCIDENTAL_DAMAGE).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalAccidentalDamage },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalAccidentalDamage != 0 && quote.totalAccidentalDamage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE) ? 'string' : 'currency',
                            //     value: this.quote.totalAccidentalDamage != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE) && quote.totalAccidentalDamage == 0 ? 'DENIED' : quote.totalAllRisk,
                            //     styleaddon: this.quote.totalAccidentalDamage != quote.totalAccidentalDamage ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalAccidentalDamage != 0 && quote.totalAccidentalDamage == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalAllRisk,
                                styleaddon: this.quote.totalAccidentalDamage != quote.totalAccidentalDamage ? 'black' : '',
                            }
                        })
                    })));
                }


                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.CLAIM_PREPARATION_COST).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalClaimPreparationCost },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalClaimPreparationCost != 0 && quote.totalClaimPreparationCost == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST) ? 'string' : 'currency',
                            //     value: this.quote.totalClaimPreparationCost != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST) && quote.totalClaimPreparationCost == 0 ? 'DENIED' : quote.totalClaimPreparationCost,
                            //     styleaddon: this.quote.totalClaimPreparationCost != quote.totalClaimPreparationCost ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalClaimPreparationCost != 0 && quote.totalClaimPreparationCost == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalClaimPreparationCost,
                                styleaddon: this.quote.totalClaimPreparationCost != quote.totalClaimPreparationCost ? 'black' : '',
                            }
                        })
                    })));
                }


                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalDeteriorationofStocksinB },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalDeteriorationofStocksinB != 0 && quote.totalDeteriorationofStocksinB == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B) ? 'string' : 'currency',
                            //     value: this.quote.totalDeteriorationofStocksinB != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B) && quote.totalDeteriorationofStocksinB == 0 ? 'DENIED' : quote.totalDeteriorationofStocksinB,
                            //     styleaddon: this.quote.totalDeteriorationofStocksinB != quote.totalDeteriorationofStocksinB ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalDeteriorationofStocksinB != 0 && quote.totalDeteriorationofStocksinB == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalDeteriorationofStocksinB,
                                styleaddon: this.quote.totalDeteriorationofStocksinB != quote.totalDeteriorationofStocksinB ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalDeteriorationofStocksinA },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalDeteriorationofStocksinA != 0 && quote.totalDeteriorationofStocksinA == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A) ? 'string' : 'currency',
                            //     value: this.quote.totalDeteriorationofStocksinA != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A) && quote.totalDeteriorationofStocksinA == 0 ? 'DENIED' : quote.totalDeteriorationofStocksinA,
                            //     styleaddon: this.quote.totalDeteriorationofStocksinA != quote.totalDeteriorationofStocksinA ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalDeteriorationofStocksinA != 0 && quote.totalDeteriorationofStocksinA == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalDeteriorationofStocksinA,
                                styleaddon: this.quote.totalDeteriorationofStocksinA != quote.totalDeteriorationofStocksinA ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.ESCALATION).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalEscalation },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalEscalation != 0 && quote.totalEscalation == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION) ? 'string' : 'currency',
                            //     value: this.quote.totalEscalation != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION) && quote.totalEscalation == 0 ? 'DENIED' : quote.totalEscalation,
                            //     styleaddon: this.quote.totalEscalation != quote.totalEscalation ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalEscalation != 0 && quote.totalEscalation == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalEscalation,
                                styleaddon: this.quote.totalEscalation != quote.totalEscalation ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.EMI_PROTECTION_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalEMIProtectionCover },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalEMIProtectionCover != 0 && quote.totalEMIProtectionCover == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER) ? 'string' : 'currency',
                            //     value: this.quote.totalEMIProtectionCover != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER) && quote.totalEMIProtectionCover == 0 ? 'DENIED' : quote.totalEMIProtectionCover,
                            //     styleaddon: this.quote.totalEMIProtectionCover != quote.totalEMIProtectionCover ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalEMIProtectionCover != 0 && quote.totalEMIProtectionCover == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalEMIProtectionCover,
                                styleaddon: this.quote.totalEMIProtectionCover != quote.totalEMIProtectionCover ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalInsuranceofadditionalexpense },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalInsuranceofadditionalexpense != 0 && quote.totalInsuranceofadditionalexpense == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE) ? 'string' : 'currency',
                            //     value: this.quote.totalInsuranceofadditionalexpense != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE) && quote.totalInsuranceofadditionalexpense == 0 ? 'DENIED' : quote.totalInsuranceofadditionalexpense,
                            //     styleaddon: this.quote.totalInsuranceofadditionalexpense != quote.totalInsuranceofadditionalexpense ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalInsuranceofadditionalexpense != 0 && quote.totalInsuranceofadditionalexpense == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalInsuranceofadditionalexpense,
                                styleaddon: this.quote.totalInsuranceofadditionalexpense != quote.totalInsuranceofadditionalexpense ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.INVOLUNTARY_BETTERMENT).label },
                        [this.quote._id]: { type: 'currency', value: this.quote.totalInvoluntarybettermen },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({
                            // [quote._id]: {
                            //     type: this.quote.totalInvoluntarybettermen != 0 && quote.totalInvoluntarybettermen == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT) ? 'string' : 'currency',
                            //     value: this.quote.totalInvoluntarybettermen != 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT) && quote.totalInvoluntarybettermen == 0 ? 'DENIED' : quote.totalInvoluntarybettermen,
                            //     styleaddon: this.quote.totalInvoluntarybettermen != quote.totalInvoluntarybettermen ? 'black' : '',
                            //     isAlignmentRequired: this.quote.totalInvoluntarybettermen != 0 && quote.totalInvoluntarybettermen == 0 && !quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT) ? true : false
                            // }
                            [quote._id]: {
                                type: 'currency',
                                value: quote.totalInvoluntarybettermen,
                                styleaddon: this.quote.totalInvoluntarybettermen != quote.totalInvoluntarybettermen ? 'black' : '',
                            }
                        })
                    })));
                }

                break;

            case 'risk_inspection_status_and_claim_experience':

                const higherSumAssuredLocation = this.quote.allCoversArray?.higherSumAssuredLocation
                const brokerRiskInspectionReport = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionReport
                let brokerKeys = [];

                Object.keys(brokerRiskInspectionReport).forEach((key) => brokerKeys.push(key))

                brokerKeys.map(item => {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: item.split("_").join(" ") },
                        [this.quote._id]: { type: 'string', value: brokerRiskInspectionReport[item]['label'] ?? '-' },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        const higherSumAssuredLocationInsurer = quote.allCoversArray?.quoteLocationOccupancies[0]['riskInspectionReport']
                        return ({ [quote._id]: { type: 'tickOrValue', value: brokerRiskInspectionReport[item]['label'] ? brokerRiskInspectionReport[item]['label'] != higherSumAssuredLocationInsurer[item]['label'] ? higherSumAssuredLocationInsurer[item]['label'] : null : '-' } })
                    })));
                })

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Age of Building' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.ageOfBuilding ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.ageOfBuilding ? higherSumAssuredLocation.ageOfBuilding === higherSumAssuredLocationInsurer.ageOfBuilding ? higherSumAssuredLocationInsurer.ageOfBuilding : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Construction Type' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.constructionType ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.constructionType ? higherSumAssuredLocation.constructionType === higherSumAssuredLocationInsurer.constructionType ? higherSumAssuredLocationInsurer.constructionType : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: '3 Year Loss History' },
                //     [this.quote._id]: { type: 'string', value: OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY.find(item => item.value == higherSumAssuredLocation.yearLossHistory)?.label ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.yearLossHistory ? (higherSumAssuredLocation.yearLossHistory === higherSumAssuredLocationInsurer.yearLossHistory ? OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY.find(item => item.value == higherSumAssuredLocationInsurer.yearLossHistory)?.label : null) : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Fire Protection' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.fireProtection ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.fireProtection ? higherSumAssuredLocation.fireProtection === higherSumAssuredLocationInsurer.fireProtection ? higherSumAssuredLocationInsurer.fireProtection : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Whether AMC for the Fire Protection Appliances is in force' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.amcFireProtection ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.amcFireProtection ? higherSumAssuredLocation.amcFireProtection === higherSumAssuredLocationInsurer.amcFireProtection ? higherSumAssuredLocationInsurer.amcFireProtection : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Distance between the risk to be covered and nearest Fire Brigade' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.distanceBetweenFireBrigade ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.distanceBetweenFireBrigade ? higherSumAssuredLocation.distanceBetweenFireBrigade === higherSumAssuredLocationInsurer.distanceBetweenFireBrigade ? higherSumAssuredLocationInsurer.distanceBetweenFireBrigade : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Premises Basement/Ground/ Above Ground' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.premises ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.premises ? higherSumAssuredLocation.premises === higherSumAssuredLocationInsurer.premises ? higherSumAssuredLocationInsurer.premises : null : '-' } })
                // })));

                break;

            case 'other_details':
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Deductibles/Excess" },
                //     [this.quote._id]: { type: 'currency', value: this.quote.deductiblesExcessPd == undefined || this.quote.deductiblesExcessPd == null ? 0 : Number(this.quote.deductiblesExcessPd) },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({
                //         [quote._id]: {
                //             type: 'currency', value: quote.deductiblesExcessPd == undefined || quote.deductiblesExcessPd == null ? 0 : Number(quote.deductiblesExcessPd),
                //             styleaddon: quote.deductiblesExcessPd != this.quote.deductiblesExcessPd ? 'black' : ''
                //         }
                //     })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Brokerages" },
                //     [this.quote._id]: { type: 'string', value: this.quote.brokerage ? this.quote.brokerage : '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.brokerage, styleaddon: quote.brokerage != this.quote.brokerage ? 'black' : '' } })
                // })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Quote Submission Date" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteSubmissionDate ? new Date(this.quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.quoteSubmissionDate ? new Date(quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ', styleaddon: quote.quoteSubmissionDate != this.quote.quoteSubmissionDate ? 'black' : '' } })
                })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Target Premium" },
                //     [this.quote._id]: { type: this.quote.targetPremium ? 'currency' : 'string', value: this.quote.targetPremium ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: (quote.targetPremium && quote.targetPremium != this.quote.targetPremium) ? 'currency' : 'string', value: quote.targetPremium == this.quote.targetPremium ? '-' : quote.targetPremium } })
                // })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
                    [this.quote._id]: { type: 'string', value: this.quote.existingBrokerCurrentYear ? this.quote.existingBrokerCurrentYear : '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({
                        [quote._id]:
                            { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.existingBrokerCurrentYear ? quote.existingBrokerCurrentYear : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'black' : '' }
                    })
                })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Preferred insurer" },
                //     [this.quote._id]: { type: 'string', value: this.quote.preferredInsurer },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue':'string', value: quote.preferredInsurer } })
                // })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Other Terms" },
                    [this.quote._id]: { type: 'string', value: this.quote.otherTerms ? this.quote.otherTerms : '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.otherTerms ? quote.otherTerms : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Any Additional Information" },
                    [this.quote._id]: { type: 'string', value: this.quote.additionalInfo ? this.quote.additionalInfo : '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.additionalInfo ? quote.additionalInfo : '-', styleaddon: quote.additionalInfo != this.quote.additionalInfo ? 'black' : '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Submit Co-insurer Details" },
                    // [this.quote._id]: {
                    //     type: 'button',
                    //     value: "Co-insurer Details",
                    //     buttonClassName: 'btn btn-primary',
                    //     onClick: () => { this.submitCoinsurerDetails() }
                    // }
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({
                        [quoteOption.quoteId["_id"]]: {
                            type: 'button',
                            value: "Co-insurer Details",
                            buttonClassName: 'btn btn-primary',
                            onClick: () => { this.submitCoinsurerDetails(quoteOption.quoteId["_id"]) }
                        }
                    });
                })));

                break;


        }
    }

    submitCoinsurerDetails(quote?) {
        // const quote = quoteId ? this.quote.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote
        const ref = this.dialogService.open(CoInsuranceFormDialogComponent, {
            header: "Co-Insurance Details",
            styleClass: 'customPopup',
            width: '1000px',
            data: {
                quote: quote,
                // quoteOptionData: this.quoteOptionData
            }
        })

        ref.onClose.subscribe((data) => {
        });
    }

    // New_Quote_option
    selectTabQuoteOptionWise(tab?: MenuItem) {

        if (!tab) tab = this.tabs.find(tab => tab.id == this.selectedTabId) ?? this.tabs[0]
        this.router.navigate([], { queryParams: { tab: tab?.id, location: this.selectedQuoteLocationOccupancy?.value ?? this.selectedQuoteLocationOccupancy, quoteOptionId: this.quoteOptionId } });
        this.selectedTabId = tab?.id
        this.mapping = []

        if (this.quote.productId["categoryId"].name !== "Property") {
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "" },
                [this.quote?._id]: { type: 'button', buttonClassName: "btn btn-primary p-0 px-2", onClick: () => this.openQuoteSlip(), value: 'View Quote' },
            }, ...this.quote?.insurerProcessedQuotes.map((quote) => {
                return ({
                    [quote._id]: {
                        type: 'buttons', buttons: [
                            { onClick: () => this.openQuoteSlip(quote._id), buttonClassName: "btn btn-primary p-0 px-2", value: 'View Quote' },
                            {
                                onClick: () =>
                                    quote?.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER ? this.generatePlacementSlip(quote._id) : this.openRejectedReason(quote?.rejectReason),
                                buttonClassName: quote?.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER ? "btn btn-success p-0 px-2 ml-2" : "btn btn-danger p-0 px-2 ml-2",
                                value: quote?.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER ? 'Generate Placement Slip' : 'Rejected Quote'
                            },
                        ]
                    }
                })
            })));
        } else {
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "" },
                [this.quote?._id]: { type: 'button', buttonClassName: "btn btn-primary p-0 px-2", onClick: () => this.openQuoteOption(), value: 'View Quote' },
            }, ...this.quoteOptionData?.insurerProcessedQuotes.map((quoteOption) => {
                return ({
                    [quoteOption.quoteId["_id"]]: {
                        type: 'buttons', buttons: [
                            { onClick: () => this.openQuoteOption(quoteOption._id), buttonClassName: "btn btn-primary p-0 px-2", value: 'View Quote' },
                            {
                                onClick: () =>
                                    quoteOption.quoteId["quoteState"] == AllowedQuoteStates.QCR_FROM_UNDERWRITTER && quoteOption.quoteOptionStatus == "Accept" ? this.generatePlacementQuoteOptionSlip(quoteOption._id) :
                                        quoteOption.quoteOptionStatus == "Reject" ? this.openRejectedReason("Rejcted Option") : this.openRejectedReason(quoteOption.quoteId["rejectReason"]),
                                buttonClassName: quoteOption.quoteId["quoteState"] == AllowedQuoteStates.QCR_FROM_UNDERWRITTER && quoteOption.quoteOptionStatus == "Accept" ? "btn btn-success p-0 px-2 ml-2" : "btn btn-danger p-0 px-2 ml-2",
                                value: quoteOption.quoteId["quoteState"] == AllowedQuoteStates.QCR_FROM_UNDERWRITTER && quoteOption.quoteOptionStatus == "Accept" ? 'Generate Placement Slip' :
                                    quoteOption.quoteOptionStatus == "Reject" ? 'Rejected Quote Option' : 'Rejected Quote', disabled: !this.quote?.qcrApproved
                            },
                            { onClick: () => this.createQuoteOptionQCRVersioning(quoteOption._id, this.quote._id), buttonClassName: this.quote.qcrApproved != null ? "btn btn-dark p-0 px-2 mr-2" : "hidden", value: 'Quote Version' },
                            // { onClick: () => this.editQCR(this.quote.quoteNo), buttonClassName: "btn btn-dark p-0 px-2", value: 'Qcr Edit' },
                        ]
                    }
                })
            })));
        }
        // if isRate is true show below code
        // this.mapping.push(Object.assign({
        //     'labels': { type: 'string', value: "Premium Without Taxes" },
        //     [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalIndictiveQuoteAmt },
        // }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
        //     return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: quoteOption.totalIndictiveQuoteAmt ?? 0 } })
        // })));


        switch (tab?.id) {
            case 'client_details':
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Policy" },
                    [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured Name" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['name'] },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.clientId['name'] } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Proposal" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteType },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.quoteType != quote.quoteType ? this.quote.quoteType : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Details of Existing Insurer</strong>" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Name of Insurer" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "City of Insurer Office", },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "DO No." },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Current Policy Details</strong>" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
                })));


                if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: "Expiring Policy Period" },
                        [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                    }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                        return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                    })));
                }

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Policy Period" },
                    [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured's Business" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['natureOfBusiness'] ?? '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: quote.clientId['natureOfBusiness'] ?? '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Risk Location/s" },
                    [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray?.quoteLocationOccupancies?.length },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: quote?.allCoversArray?.quoteLocationOccupancies?.length } })
                })));

                const companyNames = this.quoteOptionData.coInsurers.map(quoteOption => quoteOption['companyName']).join(', ');
                // const quotecompanyNames = this.quote.coInsurers.map(quoteOption => quoteOption['companyName']).join(', ');
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Co-Insurers" },
                    [this.quote._id]: { type: 'string', value: '-' },

                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: 'string', value: companyNames ?? '-' } })
                    // return ({ [quote._id]: { type: 'tickOrValue', value: quoteOption.clientId['natureOfBusiness']  } })
                })));
                if (this.quote?.productId?.['shortName'] === 'CAR' || this.quote?.productId?.['shortName'] === 'EAR') {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: "Project Detail" },
                        [this.quote._id]: {
                            type: 'button',
                            value: "Project Detail",
                            buttonClassName: 'btn btn-primary',
                            onClick: () => { this.projectDetails() }
                        }
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quote) => {
                        return ({ [quote._id]: { type: 'tickOrValue', value: "Project Detail" } })
                    })));
                }

                break;

            case 'sum_insured_details':

                // Get Higher Breakup Name
                let higherSumAssuredLocatioName = `${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`
                let breakupKeys = []

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Total Sum Insured" },
                    [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalSumAssured },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: quoteOption.totalSumAssured, styleaddon: quoteOption.totalSumAssured != this.quoteOptionData.totalSumAssured ? 'black' : '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Higher Location Sum" },
                    [this.quote._id]: { type: 'currency', value: this.quoteOptionData.allCoversArray.higherSumAssuredLocation.sumAssured },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({
                        [quoteOption.quoteId["_id"]]: {
                            type: 'currency', value: quoteOption.allCoversArray.higherSumAssuredLocation.sumAssured,
                            styleaddon: quoteOption.allCoversArray.higherSumAssuredLocation.sumAssured != this.quoteOptionData.allCoversArray.higherSumAssuredLocation.sumAssured ? 'black' : ''
                        }
                    })
                })));

                this.mapping.push({
                    'labels': { type: 'html', value: '' }
                });

                // Loop Over entire breakup and pushs the data to mapping

                if (this.quote.allCoversArray) {
                    let level1HeaderKey = '';
                    let level2HeaderKey = '';
                    let level3HeaderKey = '';
                    let level4HeaderKey = '';

                    Object.entries(this.quoteOptionData.allCoversArray?.quoteLocationBreakupMaster).forEach(([breakUpkey, breakup]) => {
                        // Select Value of Higher Breakup from breakup response
                        let value = Object.entries(breakup).find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1] ?? 0

                        value = typeof (value) == 'number' ? Number(value) : value
                        // Header Logic

                        if (level1HeaderKey != breakUpkey.split('::>::')[0]) {
                            level1HeaderKey = breakUpkey.split('::>::')[0];

                            if (level1HeaderKey) {

                                if (breakUpkey.split('::>::').length > 1) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level1HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level1HeaderKey },
                                        [this.quote._id]: { type: typeof (value) == 'string' ? 'string' : 'currency', isAlignmentRequired: true, value: value },
                                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {

                                        let insurerBreakupValue;

                                        Object.entries(quoteOption.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quoteOption.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]
                                            }
                                        })

                                        return ({ [quoteOption.quoteId["_id"]]: { type: typeof (insurerBreakupValue) == 'string' ? 'string' : 'currency', isAlignmentRequired: true, value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }


                        if (level2HeaderKey != breakUpkey.split('::>::')[1]) {
                            level2HeaderKey = breakUpkey.split('::>::')[1];

                            if (level2HeaderKey) {

                                if (breakUpkey.split('::>::').length > 2) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level2HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level2HeaderKey },
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {

                                        let insurerBreakupValue;

                                        Object.entries(quoteOption.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quoteOption.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]
                                            }
                                        })

                                        return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }

                        if (level3HeaderKey != breakUpkey.split('::>::')[2]) {
                            level3HeaderKey = breakUpkey.split('::>::')[2];

                            if (level3HeaderKey) {

                                if (breakUpkey.split('::>::').length > 3) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level3HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level3HeaderKey },
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {

                                        let insurerBreakupValue;

                                        Object.entries(quoteOption.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quoteOption.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]
                                            }
                                        })

                                        return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }

                        if (level4HeaderKey != breakUpkey.split('::>::')[3]) {
                            level4HeaderKey = breakUpkey.split('::>::')[3];

                            if (level4HeaderKey) {

                                if (breakUpkey.split('::>::').length > 4) {
                                    this.mapping.push({
                                        'labels': { type: 'html', value: `<strong>${level4HeaderKey}</strong>` },
                                    });
                                } else {
                                    this.mapping.push(Object.assign({
                                        'labels': { type: 'string', value: level4HeaderKey },
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {

                                        let insurerBreakupValue;

                                        Object.entries(quoteOption.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quoteOption.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]
                                            }
                                        })

                                        return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'black' : '' } })
                                    })));
                                }
                            }
                        }
                    })
                }

                switch (this.quote.productId['productTemplate']) {
                    case AllowedProductTemplate.IAR:
                        this.mapping.push({
                            'labels': { type: 'html', value: '' }
                        });

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Machinery / Electrical BreakDown </strong>' }
                        });

                        const higherQuoteLocationOccupancy = this.quoteOptionData?.allCoversArray?.higherSumAssuredLocation

                        const higherMachineryAndElectricalBreakdown = this.quoteOptionData?.allCoversArray?.machineryElectricalBreakdown?.find((item) => item._id = higherQuoteLocationOccupancy._id)

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Reduction in Sum Insured on accountof piping etc (${higherMachineryAndElectricalBreakdown?.machineryPercentage ?? 0}%)` },
                            [this.quote._id]: { type: 'currency', value: higherMachineryAndElectricalBreakdown?.sumInsurred ?? 0 }
                        }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {

                            const higherQuoteLocationOccupancy = this.quoteOptionData?.allCoversArray?.higherSumAssuredLocation

                            const higherMachineryAndElectricalBreakdown = this.quoteOptionData?.allCoversArray?.machineryElectricalBreakdown?.find((item) => item._id = higherQuoteLocationOccupancy._id)

                            return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: higherMachineryAndElectricalBreakdown?.sumInsurred ?? 0 } })
                        })));

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Fire Loss of profit (FLop) </strong>' }
                        });

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Gross Profit` },
                            [this.quote._id]: { type: 'currency', value: this.quoteOptionData.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0 }
                        }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                            return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: quoteOption.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0 } })
                        })));

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Indmenity Period` },
                            [this.quote._id]: { type: 'string', isAlignmentRequired: true, value: this.quoteOptionData.allCoversArray.bscFireLossOfProfitCover?.indmenityPeriod ?? 'N/A' }
                        }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                            return ({ [quoteOption.quoteId["_id"]]: { type: 'string', isAlignmentRequired: true, value: quoteOption.allCoversArray?.bscFireLossOfProfitCover?.indmenityPeriod ?? 'N/A' } })
                        })));

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Machinery Loss Of Profit (MBLOP) </strong>' }
                        });

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Gross Profit` },
                            [this.quote._id]: { type: 'currency', value: this.quoteOptionData.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0 }
                        }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                            return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: quoteOption.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0 } })
                        })));

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Indmenity Period` },
                            [this.quote._id]: { type: 'string', isAlignmentRequired: true, value: this.quoteOptionData.allCoversArray?.machineryLossOfProfitCover?.indmenityPeriod ?? 'N/A' }
                        }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                            return ({ [quoteOption.quoteId["_id"]]: { type: 'string', isAlignmentRequired: true, value: quoteOption.allCoversArray?.machineryLossOfProfitCover?.indmenityPeriod ?? 'N/A' } })
                        })));

                        break;
                }


                break;

            case 'add_ons':

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'Earthquake' },
                    [this.quote._id]: { type: 'boolean', value: this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: 'boolean', value: quoteOption.locationBasedCovers?.quoteLocationOccupancy?.isEarthquake } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'STFI' },
                    [this.quote._id]: { type: 'boolean', value: this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.isStfi },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: 'boolean', value: quoteOption.locationBasedCovers?.quoteLocationOccupancy?.isStfi } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'Terrorism' },
                    [this.quote._id]: { type: 'boolean', value: this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: 'boolean', value: quoteOption.locationBasedCovers?.quoteLocationOccupancy?.isTerrorism } })
                })));


                this.mapping.push({
                    'labels': { type: 'html', value: '<strong>Property Damage </strong>' }
                });

                // Loaded Add on Covers Dynamically
                for (let cover of this.quoteOptionData?.locationBasedCovers?.quoteLocationAddonCovers
                    .filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                    .filter(cover => cover?.addOnCoverId?.addonTypeFlag != AllowedAddonTypeFlag.FREE)
                    .map((cover) => {
                        return ({ id: cover.addOnCoverId['_id'], label: cover.addOnCoverId['name'], value: cover['sumInsured'] })
                    })) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: cover.label },
                        [this.quote._id]: { type: 'currency', value: cover.value },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency'
                                , value: quoteOption.locationBasedCovers?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured']
                                , styleaddon: quoteOption.locationBasedCovers?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured'] != cover.value
                                    ? 'black'
                                    : ''
                            }
                        })
                    })));
                }

                if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) {

                    this.mapping.push({
                        'labels': { type: 'html', value: '<strong>Business Interreption </strong>' }
                    });

                    for (let cover of this.quoteOptionData?.locationBasedCovers?.quoteLocationAddonCovers.filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.BUSINESS_INTURREPTION).filter(cover => cover.isChecked).map((cover) => {
                        return ({ id: cover.addOnCoverId['_id'], label: cover.addOnCoverId['name'], value: cover['sumInsured'] })
                    })) {
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: cover.label },
                            [this.quote._id]: { type: 'currency', value: cover.value },
                        }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                            return ({ [quoteOption.quoteId["_id"]]: { type: 'currency', value: quoteOption.locationBasedCovers?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured'] } })
                        })));
                    }
                }
                break;

            case 'risk_management_features':

                // TODO: NEEDS TO BE IMPLEMED
                const higherSumAssuredLocatioId = this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?._id

                for (const riskManagementFeature of this.quoteOptionData.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.quoteLocationOccupancyId == higherSumAssuredLocatioId)) {

                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: riskManagementFeature['name'] },
                        [this.quote._id]: { type: 'string', value: riskManagementFeature['checkbox'] == false ? "Not Selected" : "Selected" },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {

                        let item = quoteOption.locationBasedCovers?.riskManagementFeatures.find((inRiskManagementFeature) => inRiskManagementFeature['riskManagementFeaturesdict']['name'] == riskManagementFeature['name'])
                        let quoteItem = this.quoteOptionData.locationBasedCovers?.riskManagementFeatures.find((inRiskManagementFeature) => inRiskManagementFeature['riskManagementFeaturesdict']['name'] == riskManagementFeature['name']);

                        return ({ [quoteOption.quoteId["_id"]]: { type: 'string', value: item['riskManagementFeaturesdict']['checkbox'] == false ? "Not Selected" : "Selected", styleaddon: item['riskManagementFeaturesdict']['checkbox'] != quoteItem['riskManagementFeaturesdict']['checkbox'] ? 'black' : '' } })
                    })));
                }
                break;

            case 'business_suraksha_covers':

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.FLOATER_COVER_ADD_ON).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalFloater },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency', value: quoteOption.totalFloater,
                                styleaddon: this.quoteOptionData.totalFloater != quoteOption.totalFloater ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.DECLARATION_POLICY).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalDeclarationPolicy },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency', value: quoteOption.totalDeclarationPolicy,
                                styleaddon: this.quoteOptionData.totalDeclarationPolicy != quoteOption.totalDeclarationPolicy ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.LOSE_OF_RENT).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalLossOfRent },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency', value: quoteOption.totalLossOfRent,
                                styleaddon: this.quoteOptionData.totalLossOfRent != quoteOption.totalLossOfRent ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalRentForAlternative },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency', value: quoteOption.totalRentForAlternative,
                                styleaddon: this.quoteOptionData.totalRentForAlternative != quoteOption.totalRentForAlternative ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.PERSONAL_ACCIDENT_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalPersonalAccident },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalPersonalAccident,
                                styleaddon: this.quoteOptionData.totalPersonalAccident != quoteOption.totalPersonalAccident ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalValuableContent },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency', value: quoteOption.totalValuableContent,
                                styleaddon: this.quoteOptionData.totalValuableContent != quoteOption.totalValuableContent ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalFireLossOfProfit },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.locationBasedCovers?.bscFireLossOfProfitCover?.total,
                                styleaddon: this.quoteOptionData.locationBasedCovers?.bscFireLossOfProfitCover?.total != quoteOption.locationBasedCovers?.bscFireLossOfProfitCover?.total ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.locationBasedCovers?.bscBurglaryHousebreakingCover?.total },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency', value: quoteOption.locationBasedCovers?.bscBurglaryHousebreakingCover?.total,
                                styleaddon: this.quoteOptionData.locationBasedCovers?.bscBurglaryHousebreakingCover?.total != quoteOption.locationBasedCovers?.bscBurglaryHousebreakingCover?.total ? 'black' : ''
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.locationBasedCovers?.bscMoneySafeTillCover?.total },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.locationBasedCovers?.bscMoneySafeTillCover?.total,
                                styleaddon: this.quoteOptionData.locationBasedCovers?.bscMoneySafeTillCover?.total != quoteOption.locationBasedCovers?.bscMoneySafeTillCover?.total ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalMoneyTransit },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalMoneyTransit,
                                styleaddon: this.quoteOptionData.totalMoneyTransit != quoteOption.totalMoneyTransit ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.locationBasedCovers?.bscElectronicEquipmentsCover?.total },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.locationBasedCovers?.bscElectronicEquipmentsCover?.total,
                                styleaddon: this.quoteOptionData.locationBasedCovers?.bscElectronicEquipmentsCover?.total != quoteOption.locationBasedCovers?.bscElectronicEquipmentsCover?.total ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalPortableEquipment },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalPortableEquipment,
                                styleaddon: this.quoteOptionData.totalPortableEquipment != quoteOption.totalPortableEquipment ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalPedalCycle },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalPedalCycle,
                                styleaddon: this.quoteOptionData.totalPedalCycle != quoteOption.totalPedalCycle ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.locationBasedCovers?.bscFixedPlateGlassCover?.total },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.locationBasedCovers?.bscFixedPlateGlassCover?.total,
                                styleaddon: this.quoteOptionData.locationBasedCovers?.bscFixedPlateGlassCover?.total != quoteOption.locationBasedCovers?.bscFixedPlateGlassCover?.total ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalAccompaniedBaggage },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalAccompaniedBaggage,
                                styleaddon: this.quoteOptionData.totalAccompaniedBaggage != quoteOption.totalAccompaniedBaggage ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalFidelityGuarantee },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalFidelityGuarantee,
                                styleaddon: this.quoteOptionData.totalFidelityGuarantee != quoteOption.totalFidelityGuarantee ? 'black' : '',
                            }
                        })
                    })));
                }
                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_SIGNAGE_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalSignage },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalSignage,
                                styleaddon: this.quoteOptionData.totalSignage != quoteOption.totalSignage ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_ALL_RISK_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalAllRisk },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalAllRisk,
                                styleaddon: this.quoteOptionData.totalAllRisk != quoteOption.totalAllRisk ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalLiabilitySection },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalLiabilitySection,
                                styleaddon: this.quoteOptionData.totalLiabilitySection != quoteOption.totalLiabilitySection ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalWorkmenCompensation },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalWorkmenCompensation,
                                styleaddon: this.quoteOptionData.totalWorkmenCompensation != quoteOption.totalWorkmenCompensation ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.ACCIDENTAL_DAMAGE).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalAccidentalDamage },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalAllRisk,
                                styleaddon: this.quoteOptionData.totalAccidentalDamage != quoteOption.totalAccidentalDamage ? 'black' : '',
                            }
                        })
                    })));
                }


                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.CLAIM_PREPARATION_COST).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalClaimPreparationCost },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalClaimPreparationCost,
                                styleaddon: this.quoteOptionData.totalClaimPreparationCost != quoteOption.totalClaimPreparationCost ? 'black' : '',
                            }
                        })
                    })));
                }


                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalDeteriorationofStocksinB },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalDeteriorationofStocksinB,
                                styleaddon: this.quoteOptionData.totalDeteriorationofStocksinB != quoteOption.totalDeteriorationofStocksinB ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalDeteriorationofStocksinA },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalDeteriorationofStocksinA,
                                styleaddon: this.quoteOptionData.totalDeteriorationofStocksinA != quoteOption.totalDeteriorationofStocksinA ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.ESCALATION).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalEscalation },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalEscalation,
                                styleaddon: this.quoteOptionData.totalEscalation != quoteOption.totalEscalation ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.EMI_PROTECTION_COVER).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalEMIProtectionCover },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalEMIProtectionCover,
                                styleaddon: this.quoteOptionData.totalEMIProtectionCover != quoteOption.totalEMIProtectionCover ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalInsuranceofadditionalexpense },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalInsuranceofadditionalexpense,
                                styleaddon: this.quoteOptionData.totalInsuranceofadditionalexpense != quoteOption.totalInsuranceofadditionalexpense ? 'black' : '',
                            }
                        })
                    })));
                }

                if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: OPTIONS_PRODUCT_BSC_COVERS.find(item => item.value == AllowedProductBscCover.INVOLUNTARY_BETTERMENT).label },
                        [this.quote._id]: { type: 'currency', value: this.quoteOptionData.totalInvoluntarybettermen },
                    }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                        return ({
                            [quoteOption.quoteId["_id"]]: {
                                type: 'currency',
                                value: quoteOption.totalInvoluntarybettermen,
                                styleaddon: this.quoteOptionData.totalInvoluntarybettermen != quoteOption.totalInvoluntarybettermen ? 'black' : '',
                            }
                        })
                    })));
                }

                break;

            case 'risk_inspection_status_and_claim_experience':

                // const higherSumAssuredLocation = this.quoteOptionData.allCoversArray?.higherSumAssuredLocation
                // const brokerRiskInspectionReport = this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionReport
                // let brokerKeys = [];

                // Object.keys(brokerRiskInspectionReport).forEach((key) => brokerKeys.push(key))

                // brokerKeys.map(item => {
                //     this.mapping.push(Object.assign({
                //         'labels': { type: 'string', value: item.split("_").join(" ") },
                //         [this.quote._id]: { type: 'string', value: brokerRiskInspectionReport[item]['label'] ?? '-' },
                //     }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                //         const higherSumAssuredLocationInsurer = quoteOption.allCoversArray?.quoteLocationOccupancies[0]['riskInspectionReport']
                //         return ({ [quoteOption.quoteId["_id"]]: { type: 'tickOrValue', value: brokerRiskInspectionReport[item]['label'] ? brokerRiskInspectionReport[item]['label'] != higherSumAssuredLocationInsurer[item]['label'] ? higherSumAssuredLocationInsurer[item]['label'] : null : '-' } })
                //     })));
                // })

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Age of Building' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.ageOfBuilding ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.ageOfBuilding ? higherSumAssuredLocation.ageOfBuilding === higherSumAssuredLocationInsurer.ageOfBuilding ? higherSumAssuredLocationInsurer.ageOfBuilding : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Construction Type' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.constructionType ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.constructionType ? higherSumAssuredLocation.constructionType === higherSumAssuredLocationInsurer.constructionType ? higherSumAssuredLocationInsurer.constructionType : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: '3 Year Loss History' },
                //     [this.quote._id]: { type: 'string', value: OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY.find(item => item.value == higherSumAssuredLocation.yearLossHistory)?.label ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.yearLossHistory ? (higherSumAssuredLocation.yearLossHistory === higherSumAssuredLocationInsurer.yearLossHistory ? OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY.find(item => item.value == higherSumAssuredLocationInsurer.yearLossHistory)?.label : null) : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Fire Protection' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.fireProtection ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.fireProtection ? higherSumAssuredLocation.fireProtection === higherSumAssuredLocationInsurer.fireProtection ? higherSumAssuredLocationInsurer.fireProtection : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Whether AMC for the Fire Protection Appliances is in force' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.amcFireProtection ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.amcFireProtection ? higherSumAssuredLocation.amcFireProtection === higherSumAssuredLocationInsurer.amcFireProtection ? higherSumAssuredLocationInsurer.amcFireProtection : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Distance between the risk to be covered and nearest Fire Brigade' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.distanceBetweenFireBrigade ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.distanceBetweenFireBrigade ? higherSumAssuredLocation.distanceBetweenFireBrigade === higherSumAssuredLocationInsurer.distanceBetweenFireBrigade ? higherSumAssuredLocationInsurer.distanceBetweenFireBrigade : null : '-' } })
                // })));
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: 'Premises Basement/Ground/ Above Ground' },
                //     [this.quote._id]: { type: 'string', value: higherSumAssuredLocation.premises ?? '-' },
                // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                //     const higherSumAssuredLocationInsurer = quote.allCoversArray?.higherSumAssuredLocation
                //     return ({ [quote._id]: { type: 'tickOrValue', value: higherSumAssuredLocation.premises ? higherSumAssuredLocation.premises === higherSumAssuredLocationInsurer.premises ? higherSumAssuredLocationInsurer.premises : null : '-' } })
                // })));

                break;

            case 'other_details':
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Deductibles/Excess" },
                //     [this.quote._id]: { type: 'currency', value: this.quoteOptionData.deductiblesExcessPd == undefined || this.quoteOptionData.deductiblesExcessPd == null ? 0 : Number(this.quoteOptionData.deductiblesExcessPd) },
                // }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                //     return ({
                //         [quoteOption.quoteId["_id"]]: {
                //             type: 'currency', value: quoteOption.deductiblesExcessPd == undefined || quoteOption.deductiblesExcessPd == null ? 0 : Number(quoteOption.deductiblesExcessPd),
                //             styleaddon: quoteOption.deductiblesExcessPd != this.quoteOptionData.deductiblesExcessPd ? 'black' : ''
                //         }
                //     })
                // })));

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Brokerages" },
                //     [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                // }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                //     return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption.brokerage, styleaddon: quoteOption.brokerage != this.quoteOptionData.brokerage ? 'black' : '' } })
                // })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Quote Submission Date" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.quoteSubmissionDate ? new Date(this.quoteOptionData.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption.quoteSubmissionDate ? new Date(quoteOption.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ', styleaddon: quoteOption.quoteSubmissionDate != this.quoteOptionData.quoteSubmissionDate ? 'black' : '' } })
                })));

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Target Premium" },
                //     [this.quote._id]: { type: this.quoteOptionData.targetPremium ? 'currency' : 'string', value: this.quoteOptionData.targetPremium ?? '-' },
                // }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                //     return ({ [quoteOption.quoteId["_id"]]: { type: (quoteOption.targetPremium && quoteOption.targetPremium != this.quoteOptionData.targetPremium) ? 'currency' : 'string', value: quoteOption.targetPremium == this.quoteOptionData.targetPremium ? '-' : quoteOption.targetPremium } })
                // })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.existingBrokerCurrentYear ? this.quoteOptionData.existingBrokerCurrentYear : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({
                        [quoteOption.quoteId["_id"]]:
                            { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption.existingBrokerCurrentYear ? quoteOption.existingBrokerCurrentYear : '-', styleaddon: quoteOption.existingBrokerCurrentYear != this.quoteOptionData.existingBrokerCurrentYear ? 'black' : '' }
                    })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Other Terms" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.otherTerms ? this.quoteOptionData.otherTerms : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption.otherTerms ? quoteOption.otherTerms : '-', styleaddon: quoteOption.existingBrokerCurrentYear != this.quoteOptionData.existingBrokerCurrentYear ? 'black' : '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Any Additional Information" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.additionalInfo ? this.quoteOptionData.additionalInfo : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption.additionalInfo ? quoteOption.additionalInfo : '-', styleaddon: quoteOption.additionalInfo != this.quoteOptionData.additionalInfo ? 'black' : '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Payment Details" },
                    [this.quote._id]: {
                        type: 'string',
                        value: `${this.quoteOptionData.referenceNo ?? '-'}, 
                                ${this.quoteOptionData.chequeNo ?? '-'},
                                ${this.quoteOptionData.bankName ?? '-'},
                                ${this.quoteOptionData.paymentDate ?? '-'},
                                ${this.quoteOptionData.paymentAmount ?? '-'}`
                    },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({
                        [quoteOption.quoteId["_id"]]: {
                            type: 'string',
                            value: `${quoteOption.referenceNo ?? '-'}, 
                                    ${quoteOption.chequeNo ?? '-'}, 
                                    ${quoteOption.bankName ?? '-'}, 
                                    ${quoteOption.paymentDate ?? '-'},
                                    ${quoteOption.paymentAmount ?? '-'}`
                        }
                    });
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Submit Bank Details" },
                    // [this.quote._id]: {
                    //     type: 'button',
                    //     value: "Submit Payment Details",
                    //     buttonClassName: 'btn btn-primary',
                    //     onClick: () => { this.submitBankDetails() }
                    // }
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({
                        [quoteOption.quoteId["_id"]]: {
                            type: 'button',
                            value: "Submit Payment Details",
                            buttonClassName: 'btn btn-primary',
                            onClick: () => { this.submitBankDetails(quoteOption) }
                        }
                    });
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Submit Co-insurer Details" },
                    // [this.quote._id]: {
                    //     type: 'string',
                    //     value: "",
                    //     buttonClassName: 'btn btn-primary',
                    //     onClick: () => { this.submitCoinsurerDetails() }
                    // }
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({
                        [quoteOption.quoteId["_id"]]: {
                            type: 'button',
                            value: "Co-insurer Details",
                            buttonClassName: 'btn btn-primary',
                            onClick: () => { this.submitCoinsurerDetails(quoteOption) }
                        }
                    });
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Premium Details</strong>" },
                },));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Premium" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.premium, styleaddon: quoteOption?.premiumDetails?.premium != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Premium Brokerage" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.premiumBrokerage, styleaddon: quoteOption?.premiumDetails?.premiumBrokerage != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Brokerage Amt" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.brokerageAmt, styleaddon: quoteOption?.premiumDetails?.brokerageAmt != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Terrorism Premium" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.terrorismPremium, styleaddon: quoteOption?.premiumDetails?.terrorismPremium != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Terrorism Brokerage" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.terrorismBrokerage, styleaddon: quoteOption?.premiumDetails?.terrorismBrokerage != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Terrorism Brokerage Amt" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.terrorismBrokerageAmt, styleaddon: quoteOption?.premiumDetails?.terrorismBrokerageAmt != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Total Brokerage" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.totalBrokerage, styleaddon: quoteOption?.premiumDetails?.totalBrokerage != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Brokerage Rewards" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.brokerageRewards, styleaddon: quoteOption?.premiumDetails?.brokerageRewards != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Brokerage RewardsAmt" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.brokerageRewardsAmt, styleaddon: quoteOption?.premiumDetails?.brokerageRewardsAmt != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Terrorism Rewards" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.terrorismRewards, styleaddon: quoteOption?.premiumDetails?.terrorismRewards != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Terrorism Rewards Amt" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.terrorismRewardsAmt, styleaddon: quoteOption?.premiumDetails?.terrorismRewardsAmt != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Total Rewards" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.totalRewards, styleaddon: quoteOption?.premiumDetails?.totalRewards != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "total Brokerage Rewards" },
                    [this.quote._id]: { type: 'string', value: this.quoteOptionData.brokerage ? this.quoteOptionData.brokerage : '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: this.quoteOptionData.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quoteOption?.premiumDetails?.totalBrokerageRewards, styleaddon: quoteOption?.premiumDetails?.totalBrokerageRewards != this.quoteOptionData.brokerage ? 'black' : '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Discount" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quoteOptionData.insurerProcessedQuotes.map((quoteOption) => {
                    return ({ [quoteOption.quoteId["_id"]]: { type: 'string', value: quoteOption?.discountId['discountedAmount'], styleaddon: '' } })
                })));

                break;
        }
    }


    submitBankDetails(quote?) {
        // const quote = quoteId ? this.quote.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote
        if (quote) {
            console.log(quote)
            const ref = this.dialogService.open(PaymentDetailComponent, {
                        header: "Payment Details",
                        width: '1200px',
                        styleClass: 'customPopup-dark',
                        data: {
                            quote: quote,
                        }
                    })
                    
        }
    }

    openQuoteSlip(quoteId?) {
        const quote = quoteId ? this.quote.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote

        if (quote) {
            const ref = this.dialogService.open(QuoteSlipDialogComponent, {
                header: quote.quoteNo,
                width: '1200px',
                styleClass: 'customPopup-dark',
                data: {
                    quote: quote,
                }
            })
        }
    }

    openRejectedReason(message) {
        this.message = ""
        // alert(message)
        this.displayBasic = true
        this.message = "Reject Reason - " + message
    }

    generatePlacementSlip(quoteId) {

        const quote = this.quote.insurerProcessedQuotes.find((quote) => quote._id == quoteId)

        const current_url = window.location.pathname;

        if (quote) {
            this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}?prev=${current_url}`)
        }
    }

    // New_Quote_option
    generatePlacementQuoteOptionSlip(quoteOptionId) {
        const quoteOption = this.quoteOptionData.insurerProcessedQuotes.find((quoteOption) => quoteOption._id == quoteOptionId)

        const current_url = window.location.pathname;

        if (quoteOption) {
            this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quoteOption._id}?prev=${current_url}`)
        }
    }

    // New_Quote_option
    openQuoteOption(quoteOptionId?) {
        const quoteOption = quoteOptionId ? this.quoteOptionData.insurerProcessedQuotes.find((quoteOption) => quoteOption._id == quoteOptionId) : this.quoteOptionData
        if (quoteOption) {
            const ref = this.dialogService.open(QuoteSlipDialogComponent, {
                header: quoteOption.quoteId["quoteNo"],
                width: '1200px',
                styleClass: 'customPopup-dark',
                data: {
                    quoteOption: quoteOption,
                    quote: quoteOption.quoteId
                }
            })
        }
    }

    downloadExcel(): void {
        // Use this.quote.id instead of this.quoteId
        // Old_Quote
        // this.quoteService.downloadQCRExcel(this.quote._id, this.quote.quoteNo).subscribe({

        // New_Quote_Option
        this.quoteOptionService.downloadQCRExcel(this.quoteOptionData._id, this.quote.quoteNo).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    loadQuoteLocationOccupancies() {
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 20,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.id,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }
        //         ]
        //     },
        //     globalFilter: null,
        //     multiSortMeta: null
        // };

        // New_Quote_Option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
                this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IQuoteLocationOccupancy) => {
                    let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation;
                    let pincode: IPincode = entity.pincodeId as IPincode;
                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id };
                });

                this.selectedQuoteLocationOccupancy = this.activatedRoute.snapshot.queryParams.location ?? this.optionsQuoteLocationOccupancies[0];

                const ql = this.activatedRoute.snapshot.queryParams.location;
                // Old_Quote
                // this.optionsQuoteLocationOccupancies = this.optionsQuoteLocationOccupancies.map((lov: ILov) =>
                //     lov.value == this.quote?.locationBasedCovers?.higherSumAssuredLocation?._id ? { value: lov.value, label: `* ${lov.label.replace("*", "")}` } : lov
                // );

                // New_Quote_Option
                this.optionsQuoteLocationOccupancies = this.optionsQuoteLocationOccupancies.map((lov: ILov) =>
                    lov.value == this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?._id ? { value: lov.value, label: `* ${lov.label.replace("*", "")}` } : lov
                );
                this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true, quoteLocationOccupancyId: this.selectedQuoteLocationOccupancy?.value ?? ql }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quoteService.setQuote(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });

                this.quoteOptionService.get(`${this.quoteOptionId}`, { allCovers: true, qcr: true, quoteLocationOccupancyId: this.selectedQuoteLocationOccupancy?.value ?? ql }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)

                        this.loadData(dto.data.entity)

                        // let lazyLoadEvent: LazyLoadEvent = {
                        //     first: 0,
                        //     rows: 5,
                        //     sortField: '_id',
                        //     sortOrder: -1,
                        //     filters: {
                        //         // @ts-ignore
                        //         quoteId: [
                        //             {
                        //                 value: this.quote._id,
                        //                 matchMode: "equals",
                        //                 operator: "and"
                        //             }
                        //         ]
                        //     },
                        //     globalFilter: null,
                        //     multiSortMeta: null
                        // };

                        let lazyLoadEvent: LazyLoadEvent = {
                            first: 0,
                            rows: 5,
                            sortField: '_id',
                            sortOrder: -1,
                            filters: {
                                // @ts-ignore
                                quoteOptionId: [
                                    {
                                        value: this.quoteOptionId,
                                        matchMode: "equals",
                                        operator: "and"
                                    }
                                ]
                            },
                            globalFilter: null,
                            multiSortMeta: null
                        };

                        this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
                            next: (dto: IManyResponseDto<IClaimExperience>) => {
                                this.claimExperiences = dto.data.entities
                            }
                        })
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            },
            error: e => { }
        });
    }

    onChangeQuoteLocationOccupancy(quoteLocationOccupancyId) {
        this.router.navigate([], { queryParams: { tab: this.selectedTabId, location: quoteLocationOccupancyId, quoteOptionId: this.quoteOptionId } });
        // this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true, quoteLocationOccupancyId: quoteLocationOccupancyId }).subscribe({
        //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //         this.quoteService.setQuote(dto.data.entity)


        this.quoteOptionService.get(`${this.quoteOptionId}`, { allCovers: true, qcr: true, quoteLocationOccupancyId: quoteLocationOccupancyId }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)

                this.loadData(dto.data.entity)

                let lazyLoadEvent: LazyLoadEvent = {
                    first: 0,
                    rows: 5,
                    sortField: '_id',
                    sortOrder: -1,
                    filters: {
                        // @ts-ignore
                        quoteId: [
                            {
                                value: this.quote._id,
                                matchMode: "equals",
                                operator: "and"
                            }
                        ]
                    },
                    globalFilter: null,
                    multiSortMeta: null
                };

                this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
                    next: (dto: IManyResponseDto<IClaimExperience>) => {
                        this.claimExperiences = dto.data.entities
                    }
                })
            },
            error: e => {
                console.log(e);
            }
        });

    }


    // New_Quote_option
    getQuoteOptions() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.activatedRoute.snapshot.params.quote_id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.quoteOptionService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteOption>) => {
                this.selectedQuoteOptionOfProperty = this.activatedRoute.snapshot.queryParams.quoteOptionId
                this.allQuoteOptionDropdown = dto.data.entities
                    .map(entity => ({ label: entity.expiredQuoteOption == true ? entity.quoteOption = "Expired Option" : entity.quoteOption, value: entity._id }))

                this.quoteOptionService.get(`${this.quoteOptionId}`, { allCovers: true, qcr: true, quoteLocationOccupancyId: this.selectedQuoteLocationOccupancy?.value }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                        this.loadQuoteLocationOccupancies();
                    }
                })
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onChangeQuoteOption(quoteOptionId) {
        this.router.navigate([`/backend/quotes/${this.quote._id}/comparision-review-detailed`], {
            queryParams: {
                ...this.activatedRoute.snapshot.queryParams,
                quoteOptionId: quoteOptionId,
            }
        });
        this.quoteOptionId = quoteOptionId
        this.quoteOptionService.get(`${quoteOptionId}`, { allCovers: true, qcr: true, quoteLocationOccupancyId: this.selectedQuoteLocationOccupancy?.value }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                this.loadQuoteLocationOccupancies();
            }
        })
    }

    // }
    onSubmit() {
        let payload = {};
        payload['email'] = this.sendLinkForm.value.email;
        payload['quoteId'] = this.quote._id;

        this.quoteService.sendQCREmailToClient(payload).subscribe(response => {
            //@ts-ignore
            if (response.status == 'success') {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Email Send Sucessfully`,
                    life: 3000
                });
                this.sendLinkForm.reset();
            } else {
                this.messageService.add({
                    severity: "error",
                    summary: "Failed",
                    //@ts-ignore
                    detail: response.message,
                    life: 3000
                });
            }
        })
    }

    createQuoteOptionQCRVersioning(insurerQuoteOptionId, brokerQuoteId) {
        this.quoteOptionService.createQuoteOptionQCRVersioning(insurerQuoteOptionId, brokerQuoteId).subscribe({
            next: response => {
                this.router.navigateByUrl(`/backend/quotes`)
            }
        });
    }
    sendQuoteForApproval() {
        this.quoteService.sendForQCRApproval(this.quote._id, { qcrApprovalRequested: true, quoteSlipApprovalRequested: false }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.messageService.add({
                    summary: 'Success',
                    detail: 'QCR Approval Sent Successfully!',
                    severity: 'success',
                    life: 500000
                });
                this.quoteService.refresh((quote) => {

                    // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)
                    const ref = this.dialogService.open(QuoteSentForPlacementCheckerMakerComponent, {
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

            },
            error: error => {
                console.log(error);
            }
        });
    }

    sendQuoteForApprovalbymaker() {
        this.quoteService.sendForQCRApproval(this.quote._id, { qcrApprovalRequested: true, quoteSlipApprovalRequested: false }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // this.quoteService.refresh((quote) => {
                //   this.router.navigateByUrl(`/`);
                // })
                this.quoteService.refresh((quote) => {

                    // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)
                    const ref = this.dialogService.open(QuoteSentForPlacementMakerComponent, {
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
            },
            error: error => {
                console.log(error);
            }
        });
    }
    projectDetails() {
        const ref = this.dialogService.open(ProjectDetailsDialogComponent, {
            header: "Project Details",
            data: {
                quote: this.quote,
                quoteOptionId: this.quoteOptionId,
            },
            width: "60vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            // this.loadQuoteDetails(this.id);
            this.getProjectDetails();
        })
    }
    getProjectDetails() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.projectDetailsService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IOneResponseDto<IExpiredDetails>) => {
            },
            error: e => {
                console.log(e);
            }
        });
    }
    pushBackTo() {
        const payload = {};
        payload["pushBackFrom"] = AllowedPushbacks.QCR;
        payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
        this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
            this.router.navigateByUrl('/backend/quotes')
        })
    }

    editQCR(quoteNo) {
        this.quoteOptionService.editQCR(quoteNo).subscribe({
            next: response => {
                this.quoteOptionService.refreshQuoteOption()
                this.router.navigateByUrl(`/backend/quotes`)
            }
        });
    }

    qcrEdit() {
        const ref = this.dialogService.open(IcListDialogComponent, {
            header: "Select IC",
            width: "400px",
            styleClass: "flatPopup",
            data: {
                quoteId: this.quote,
            }
        })
    }
}
