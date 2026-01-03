import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { stringify } from 'query-string';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AllowedAddonCoverCategory } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteTypes, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from '../../components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { QuoteAuditTrailDialogComponent } from '../../components/quote/quote-audit-trail-dialog/quote-audit-trail-dialog.component';
import { QuoteUnderwritterReviewStatusDialogComponent } from '../../components/quote/quote-underwritter-review-status-dialog/quote-underwritter-review-status-dialog.component';

@Component({
    selector: 'app-quote-compare-and-analytics-page',
    templateUrl: './quote-compare-and-analytics-page.component.html',
    styleUrls: ['./quote-compare-and-analytics-page.component.scss']
})
export class QuoteCompareAndAnalyticsPageComponent implements OnInit {


    id: string;
    quote: IQuoteSlip;

    private currentQuote: Subscription;

    tabs: MenuItem[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private dialogService: DialogService,
        private claimExperienceService: ClaimExperienceService,
        private routerService: Router

    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab



        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote

            }
        })
    }
    claimExperiences: IClaimExperience[] = []

    selectedTabId: string;

    claimExperienceQuoteIds: ILov[] = []
    selectedClaimExperience: ILov

    ngOnInit(): void {


        this.loadQuote();



    }

    loadQuote() {

        console.log(this.activatedRoute.snapshot.queryParams.selectedBrokerQuotes)
        this.quoteService.get(`${this.id}`, { allCovers: true, brokerQuotes: true, selectedBrokerQuotes: this.activatedRoute.snapshot.queryParams.selectedBrokerQuotes }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // console.log(dto.data.entity)
                this.quoteService.setQuote(dto.data.entity)

                this.loadData(dto.data.entity)

                // console.log(this.data)
            },
            error: e => {
                console.log(e);
            }
        });
    }

    loadClaimExperience(claimExperience: ILov) {

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 5,
            sortField: '_id',
            sortOrder: -1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: claimExperience.value,
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
                // console.log('***', this.claimExperiences)

                this.selectedClaimExperience = claimExperience

            }
        })

    }

    ngOnDestroy(): void {
        // this.currentQuoteLocationOccupancyId.unsubscribe();
        this.currentQuote.unsubscribe();
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

    loadData(brokerQuote: IQuoteSlip) {
        this.tabs = this.loadTabs(brokerQuote.productId as IProduct)

        this.selectTab(this.tabs.find(tab => tab.id == this.selectedTabId))



        // Setting the headers
        this.cols.push({ id: 'labels', style: "width:200px" })

        // Pushing the Broker Quote Header
        this.cols.push({ id: brokerQuote._id, label: brokerQuote.originalIntermediateName, style: "width:200px" })

        this.claimExperienceQuoteIds.push({ label: `${brokerQuote.originalIntermediateName} (${brokerQuote.quoteNo})`, value: brokerQuote._id })

        // this.selectedClaimExperience = ;

        this.loadClaimExperience(this.claimExperienceQuoteIds[0]);

        // Pushing  Insurer Quote Headers
        for (const insurerQuote of brokerQuote.brokerWiseQuotes) {
            this.cols.push({ id: insurerQuote._id, label: insurerQuote.originalIntermediateName, style: "width:200px" })

            this.claimExperienceQuoteIds.push({ label: `${insurerQuote.originalIntermediateName} (${insurerQuote.quoteNo})`, value: insurerQuote._id })
        }

        // console.log(this.cols)
        // console.log(brokerQuote.brokerWiseQuotes)
        // console.log(this.claimExperienceQuoteIds)



    }


    nextClaimExperience() {

        let selectedIndex = this.claimExperienceQuoteIds.indexOf(this.selectedClaimExperience)

        console.log(selectedIndex)
        if ((selectedIndex + 1) < this.claimExperienceQuoteIds.length) {

            this.selectedClaimExperience = this.claimExperienceQuoteIds[selectedIndex + 1]


            this.loadClaimExperience(this.selectedClaimExperience)
        }
        // let selectedClaimExperience =
        // console.log(this.claimExperienceQuoteIds.find((item) => this.selectedClaimExperience.value == item.value))
    }
    prevClaimExperience() {

        let selectedIndex = this.claimExperienceQuoteIds.indexOf(this.selectedClaimExperience)

        if ((selectedIndex) > 0) {

            this.selectedClaimExperience = this.claimExperienceQuoteIds[selectedIndex - 1]
            this.loadClaimExperience(this.selectedClaimExperience)
        }
        // let selectedClaimExperience =
        // console.log(this.claimExperienceQuoteIds.find((item) => this.selectedClaimExperience.value == item.value))
    }

    // ---------------------------------------------------------------


    // ----------------------------------------------------------

    loadTabs(product: IProduct): MenuItem[] {
        switch (product.productTemplate) {
            case AllowedProductTemplate.BLUS:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Coverage and Addons", id: "add_ons" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                    { label: "Other Details", id: "other_details" },
                ]

            case AllowedProductTemplate.FIRE:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Coverage and Addons", id: "add_ons" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Other Details", id: "other_details" },
                ]
            case AllowedProductTemplate.IAR:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Coverage and Addons", id: "add_ons" },
                    { label: "Risk Management Features", id: "risk_management_features" },
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
            case AllowedProductTemplate.GMC:
                if (this.quote.quoteType != 'new') {
                    return [
                        { label: "Client Details", id: "client_details" },
                        { label: "Basic Details", id: "basic_details" },
                        { label: "Employee Details", id: "employee_features" },
                        { label: "Family Composition", id: "family_composition" },
                        { label: "Standard Coverages", id: "coverages" },
                        { label: "Enhanched Covers", id: "enhanched" },
                        { label: "Maternity Benifits", id: "maternity_benifits" },
                        { label: "Other Restrictions", id: "cost_containment" },
                        { label: "Final Rater", id: "final_rater" },
                        { label: "Other Details", id: "other_details" }

                    ]
                }
                else {
                    return [{ label: "Client Details", id: "client_details" },
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Employee Details", id: "employee_features" },
                    { label: "Family Composition", id: "family_composition" },
                    { label: "Standard Coverages", id: "coverages" },
                    { label: "Enhanched Covers", id: "enhanched" },
                    { label: "Maternity Benifits", id: "maternity_benifits" },
                    { label: "Other Restrictions", id: "cost_containment" },                  
                    { label: "Other Details", id: "other_details" }
                    ]
                }
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                return [
                    { label: "Workmen Details", id: "wm_details" },
                    { label: "Additional Coverages", id: "additional_coverages" },

                ]
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

        // console.log(tab)

        if (!tab) tab = this.tabs.find(tab => tab.id == this.selectedTabId) ?? this.tabs[0]
        // this.router.navigate([], { queryParams: { tab: tab?.id, selectedBrokerQuotes: this.activatedRoute.snapshot.queryParams.selectedBrokers } });
        this.selectedTabId = tab?.id
        this.mapping = []

        // this.mapping.push(Object.assign({
        //     'labels': { type: 'string', value: "" },
        //     [this.quote._id]: { type: 'button', buttonClassName: "btn btn-primary p-0 px-2", onClick: () => this.openQuoteSlip(), value: 'View Quote' },
        // }, ...this.quote.brokerWiseQuotes.map((quote) => {
        //     return ({
        //         [quote._id]: {
        //             type: 'buttons', buttons: [
        //                 { onClick: () => this.openQuoteSlip(quote._id), buttonClassName: "btn btn-primary p-0 px-2", value: 'View Quote' },
        //                 { onClick: () => this.generatePlacementSlip(quote._id), buttonClassName: "btn btn-success p-0 px-2 ml-2", value: 'Generate Placement Slip' },
        //             ]
        //         }
        //     })
        // })));

        // console.log(this.quote._id)
        this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "" },
            [this.quote._id]: { type: 'string', value: this.quote.quoteNo, isLabelAligned: true },
        }, ...this.quote.brokerWiseQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: quote.quoteNo, isLabelAligned: true } })
        })));

        switch (tab?.id) {
            case 'client_details':

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Policy" },
                    [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
                })));


                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured Name" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['name'] },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.clientId['name'] } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Proposal" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteType },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.quoteType != quote.quoteType ? this.quote.quoteType : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Details of Existing Insurer</strong>" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Name of Insurer" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "City of Insurer Office", },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "DO No." },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Current Policy Details</strong>" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {

                    /// TODO: Value to be planned later
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: "Expiring Policy Period" },
                        [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                    }, ...this.quote.brokerWiseQuotes.map((quote) => {
                        return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                    })));
                }

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Policy Period" },
                    [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                })));

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Policy Range Month / Year" },
                //     [this.quote._id]: { type: 'string', value: '-' },
                // }, ...this.quote.brokerWiseQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: 'string', value: '-' } })
                // })));

                // ! Removed as Recurring
                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Renewal Policy Period" },
                //     [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                // }, ...this.quote.brokerWiseQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                // })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured's Business" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['natureOfBusiness'] ?? '-' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.clientId['natureOfBusiness'] ?? '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Risk Location/s" },
                    [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray?.quoteLocationOccupancies?.length },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray?.quoteLocationOccupancies?.length } })
                })));

                // this.mapping.push(Object.assign({
                //     'labels': { type: 'string', value: "Risk Description" },
                //     [this.quote._id]: { type: 'string', value: '-' },
                // }, ...this.quote.brokerWiseQuotes.map((quote) => {
                //     return ({ [quote._id]: { type: 'string', value: '-' } })
                // })));

                break;

            case 'sum_insured_details':

                // Get Higher Breakup Name
                let higherSumAssuredLocatioName = `${this.quote.allCoversArray?.higherSumAssuredLocation?.clientLocationId['locationName']} - ${this.quote.allCoversArray?.higherSumAssuredLocation?.pincodeId['name']}`

                let breakupKeys = []

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Total Sum Insured" },
                    [this.quote._id]: { type: 'currency', value: this.quote.totalSumAssured },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'currency', value: quote.totalSumAssured } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Higher Location Sum Insured" },
                    [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray.higherSumAssuredLocation.sumAssured },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray.higherSumAssuredLocation.sumAssured } })
                })));

                this.mapping.push({
                    'labels': { type: 'html', value: '' }
                });


                // Loop Over entire breakup and pushs the data to mapping

                if (this.quote.allCoversArray) {
                    let level1HeaderKey = '';
                    let level2HeaderKey = '';
                    let level3HeaderKey = '';

                    Object.entries(this.quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([breakUpkey, breakup]) => {

                        // Select Value of Higher Breakup from breakup response
                        let value = Number(Object.entries(breakup).find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1] ?? 0)


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
                                        [this.quote._id]: { type: 'currency', value: value },
                                    }, ...this.quote.brokerWiseQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.allCoversArray?.higherSumAssuredLocation?.clientLocationId['locationName']} - ${this.quote.allCoversArray?.higherSumAssuredLocation?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue } })
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
                                    }, ...this.quote.brokerWiseQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.allCoversArray?.higherSumAssuredLocation?.clientLocationId['locationName']} - ${this.quote.allCoversArray?.higherSumAssuredLocation?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue } })
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
                                    }, ...this.quote.brokerWiseQuotes.map((quote) => {

                                        let insurerBreakupValue;

                                        Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                            let higherSumAssuredLocatioName = `${quote.allCoversArray?.higherSumAssuredLocation?.clientLocationId['locationName']} - ${this.quote.allCoversArray?.higherSumAssuredLocation?.pincodeId['name']}`

                                            if (insurerBreakUpkey == breakUpkey) {
                                                if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                                                    insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                                // insurerBreakupValue = value ?? 0
                                            }
                                        })

                                        return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue } })
                                    })));
                                }
                            }
                        }


                        // this.mapping.push(Object.assign({
                        //     'labels': { type: 'string', value: breakUpkey.split('::>::')[2] },
                        //     [this.quote._id]: { type: 'currency', value: value },
                        // }, ...this.quote.brokerWiseQuotes.map((quote) => {

                        //     let insurerBreakupValue;

                        //     Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                        //         let higherSumAssuredLocatioName = `${quote.allCoversArray?.higherSumAssuredLocation?.clientLocationId['locationName']} - ${this.quote.allCoversArray?.higherSumAssuredLocation?.pincodeId['name']}`

                        //         if (insurerBreakUpkey == breakUpkey) {
                        //             if (Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName))
                        //                 insurerBreakupValue = Object.entries(insurerBreakup)?.find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                        //             // insurerBreakupValue = value ?? 0
                        //         }
                        //     })

                        //     return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue } })
                        // })));
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

                        const higherMachineryAndElectricalBreakdown = this.quote?.allCoversArray?.machineryElectricalBreakdown?.find((item) => item._id = higherQuoteLocationOccupancy?._id)

                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Reduction in Sum Insured on accountof piping etc (${higherMachineryAndElectricalBreakdown?.machineryPercentage ?? 0}%)` },
                            [this.quote._id]: { type: 'currency', value: higherMachineryAndElectricalBreakdown?.sumInsurred ?? 0 }
                        }, ...this.quote.brokerWiseQuotes.map((quote) => {

                            const higherQuoteLocationOccupancy = this.quote?.allCoversArray?.higherSumAssuredLocation

                            const higherMachineryAndElectricalBreakdown = this.quote?.allCoversArray?.machineryElectricalBreakdown?.find((item) => item._id = higherQuoteLocationOccupancy?._id)

                            return ({ [quote._id]: { type: 'currency', value: higherMachineryAndElectricalBreakdown?.sumInsurred ?? 0 } })
                        })));

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Fire Loss of profit (FLop) </strong>' }
                        });
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Gross Profit` },
                            [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0 }
                        }, ...this.quote.brokerWiseQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0 } })
                        })));
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Indmenity Period` },
                            [this.quote._id]: { type: 'string', value: this.quote.allCoversArray?.bscFireLossOfProfitCover?.indmenityPeriod ?? 'N/A' }
                        }, ...this.quote.brokerWiseQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'string', value: quote.allCoversArray?.bscFireLossOfProfitCover?.indmenityPeriod ?? 'N/A' } })
                        })));

                        this.mapping.push({
                            'labels': { type: 'html', value: '<strong>Machinery Loss Of Profit (MBLOP) </strong>' }
                        });
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Gross Profit` },
                            [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0 }
                        }, ...this.quote.brokerWiseQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0 } })
                        })));
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: `Indmenity Period` },
                            [this.quote._id]: { type: 'string', value: this.quote.allCoversArray?.machineryLossOfProfitCover?.indmenityPeriod ?? 'N/A' }
                        }, ...this.quote.brokerWiseQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'string', value: quote.allCoversArray?.machineryLossOfProfitCover?.indmenityPeriod ?? 'N/A' } })
                        })));
                        break;
                }



                break;

            case 'add_ons':

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'Earthquake' },
                    [this.quote._id]: { type: 'boolean', value: this.quote.allCoversArray?.higherSumAssuredLocation?.isEarthquake },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    console.log(quote.allCoversArray)
                    return ({ [quote._id]: { type: 'boolean', value: quote.allCoversArray?.higherSumAssuredLocation?.isEarthquake } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'STFI' },
                    [this.quote._id]: { type: 'boolean', value: this.quote.allCoversArray?.higherSumAssuredLocation?.isStfi },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'boolean', value: quote.allCoversArray?.higherSumAssuredLocation?.isStfi } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: 'Terrorism' },
                    [this.quote._id]: { type: 'boolean', value: this.quote.allCoversArray?.higherSumAssuredLocation?.isTerrorism },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'boolean', value: quote.allCoversArray?.higherSumAssuredLocation?.isTerrorism } })
                })));

                this.mapping.push({
                    'labels': { type: 'html', value: '<strong>Property Damage </strong>' }
                });

                // Loaded Add on Covers Dynamically
                for (let cover of this.quote?.allCoversArray?.quoteLocationAddonCovers.filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE).filter(cover => cover.isChecked).map((cover) => {
                    return ({ id: cover.addOnCoverId['_id'], label: cover.addOnCoverId['name'], value: cover['sumInsured'] })
                })) {
                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: cover.label },
                        [this.quote._id]: { type: 'currency', value: cover.value },
                    }, ...this.quote.brokerWiseQuotes.map((quote) => {
                        return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured'] } })
                    })));
                }

                if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) {

                    this.mapping.push({
                        'labels': { type: 'html', value: '<strong>Business Interreption </strong>' }
                    });

                    for (let cover of this.quote?.allCoversArray?.quoteLocationAddonCovers.filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.BUSINESS_INTURREPTION).filter(cover => cover.isChecked).map((cover) => {
                        return ({ id: cover.addOnCoverId['_id'], label: cover.addOnCoverId['name'], value: cover['sumInsured'] })
                    })) {
                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: cover.label },
                            [this.quote._id]: { type: 'currency', value: cover.value },
                        }, ...this.quote.brokerWiseQuotes.map((quote) => {
                            return ({ [quote._id]: { type: 'currency', value: quote.allCoversArray?.quoteLocationAddonCovers.find((inCover => inCover.addOnCoverId['name'] == cover.label))['sumInsured'] } })
                        })));
                    }
                }
                break;

            case 'risk_management_features':

                // TODO: NEEDS TO BE IMPLEMED
                const higherSumAssuredLocatioId = this.quote.allCoversArray?.higherSumAssuredLocation._id

                for (const riskManagementFeature of this.quote.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.quoteLocationOccupancyId == higherSumAssuredLocatioId)) {

                    this.mapping.push(Object.assign({
                        'labels': { type: 'string', value: riskManagementFeature.name },
                        [this.quote._id]: { type: 'boolean', value: riskManagementFeature.checkbox },
                    }, ...this.quote.brokerWiseQuotes.map((quote) => {

                        let item = quote.allCoversArray?.quoteLocationRiskManagement.find((inRiskManagementFeature) => inRiskManagementFeature['name'] == riskManagementFeature['name'])
                        console.log(item)

                        return ({ [quote._id]: { type: 'boolean', value: item['checkbox'] } })
                    })));
                }
                break;

            case 'other_details':

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Deductibles/Excess" },
                    [this.quote._id]: { type: 'currency', value: this.quote.deductiblesExcessPd == undefined || this.quote.deductiblesExcessPd == null ? 0 : Number(this.quote.deductiblesExcessPd) },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    console.log(quote.deductiblesExcessPd)
                    return ({ [quote._id]: { type: 'currency', value: quote.deductiblesExcessPd == undefined || quote.deductiblesExcessPd == null ? 0 : Number(quote.deductiblesExcessPd) } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Brokerages" },
                    [this.quote._id]: { type: 'string', value: this.quote.brokerage },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.brokerage } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Quote Submission Date" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteSubmissionDate ? new Date(this.quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.quoteSubmissionDate ? new Date(quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Target Premium" },
                    [this.quote._id]: { type: this.quote.targetPremium ? 'currency' : 'string', value: this.quote.targetPremium },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: quote.targetPremium ? 'currency' : 'string', value: quote.targetPremium } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
                    [this.quote._id]: { type: 'string', value: this.quote.existingBrokerCurrentYear },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.existingBrokerCurrentYear } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Preferred insurer" },
                    [this.quote._id]: { type: 'string', value: this.quote.preferredInsurer },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.preferredInsurer } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Other Terms" },
                    [this.quote._id]: { type: 'string', value: this.quote.otherTerms },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.otherTerms } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Any Additional Information" },
                    [this.quote._id]: { type: 'string', value: this.quote.additionalInfo },
                }, ...this.quote.brokerWiseQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.additionalInfo } })
                })));




                break;

        }

        // console.log(this.mapping)
    }
    // --------------------------------------------------------------



    openQuoteSlip(quoteId?) {
        console.log(quoteId)

        const quote = quoteId ? this.quote.brokerWiseQuotes.find((quote) => quote._id == quoteId) : this.quote

        if (quote) {
            console.log(quote)

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

    generatePlacementSlip(quoteId) {

        const quote = this.quote.brokerWiseQuotes.find((quote) => quote._id == quoteId)


        if (quote) {
            this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}`)
        }
    }


    selectedBrokerQuotes() {

        this.quoteService.get(`${this.id}`, { allCovers: true, brokerQuotes: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // console.log(dto.data.entity)
                const ref2 = this.dialogService.open(QuoteSelectBrokerForCompareDialogComponent, {
                    header: '',
                    width: '540px',
                    styleClass: "flatPopup",
                    data: {
                        brokerWiseQuotes: dto.data.entity.brokerWiseQuotes,
                        selectedBrokers: this.activatedRoute.snapshot.queryParams.selectedBrokerQuotes
                    },
                    // contentStyle: { "max-height": "400px", "overflow": "auto" },
                    // baseZIndex: 10000
                });

                ref2.onClose.subscribe((selectedBrokers) => {

                    console.log(selectedBrokers)
                    this.router.navigate([], {
                        queryParams: {
                            // tab: tab?.id,
                            selectedBrokerQuotes: JSON.stringify(selectedBrokers)
                        }
                    });

                    window.location.href = `/backend/quotes/${this.quote._id}/compare-and-analytics?${stringify({ selectedBrokerQuotes: JSON.stringify(selectedBrokers) })}`
                    // this.loadQuote()


                    // if (selectedBrokers) this.routerService.navigateByUrl(`/backend/quotes/${this.quote._id}/compare-and-analytics?${stringify({ selectedBrokerQuotes: selectedBrokers })}`)
                })

                // console.log(this.data)
            },
            error: e => {
                console.log(e);
            }
        });
    }

    showQuoteAuditTrailDialog() {

        const ref = this.dialogService.open(QuoteAuditTrailDialogComponent, {
            header: 'Quote Change History',
            width: '900px',
            styleClass: 'flatPopup task-dialog',
        })
    }

    showTaskDialogModal() {
        // this.showTaskDialog = true;


        const ref = this.dialogService.open(QuoteUnderwritterReviewStatusDialogComponent, {
            header: 'View Status',
            width: '500px',
            styleClass: 'flatPopup task-dialog',
        })

        // ref.onClose.subscribe(() => {
        //     this.router.navigateByUrl(`/`);
        // })

    }

}


