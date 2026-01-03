import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AllowedAddonCoverCategory, AllowedAddonTypeFlag } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { AllowedProductBscCover, AllowedProductTemplate, IProduct, OPTIONS_PRODUCT_BSC_COVERS } from 'src/app/features/admin/product/product.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, AllowedQuoteTypes, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from 'src/app/features/quote/components/quote-slip-dialog/quote-slip-dialog.component';

@Component({
  selector: 'app-external-qcr',
  templateUrl: './external-qcr.component.html',
  styleUrls: ['./external-qcr.component.scss']
})
export class ExternalQcrComponent implements OnInit {
  queryParams:any;
  quoteId:any;
  decodedUrl: string;
  id: string;
  quote: IQuoteSlip;

  private currentQuote: Subscription;

  tabs: MenuItem[] = [];
  openDropDownClaimExpireance: boolean = false;
  isCloseErrow: boolean = false;
  isOpenErrow: boolean = true;
  selectedQuoteLocationOccupancy: ILov;
  optionsQuoteLocationOccupancies: ILov[];

  visibleSidebar = false;
  displayBasic = false;
  message: any;
  sendLinkForm:any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private quoteService: QuoteService,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    private dialogService: DialogService,
    private appService: AppService,
    private claimExperienceService: ClaimExperienceService,
    private fb:FormBuilder,
    private messageService: MessageService
) {
    // this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
    // console.log(this.id)

    this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
        next: (quote: IQuoteSlip) => {
            this.quote = quote
        }
    })
    this.sendLinkForm = this.fb.group({
        email:['']
    })
}

claimExperiences: IClaimExperience[] = []
selectedTabId: string;

  ngOnInit() {
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    if (this.queryParams.quoteId) {
      let payload = {};
      // @ts-ignore
      this.decodedUrl = decodeURIComponent(this.queryParams.quoteId).replaceAll(' ', '+')

      console.log(this.decodedUrl)

      this.quoteId = this.decodedUrl
      this.loadQuoteLocationOccupancies();
    }
}

ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
}

visible() {
    this.visibleSidebar = true
}

mapping = []


cols: MenuItem[] = []

loadData(brokerQuote: IQuoteSlip) {
    this.cols = [];
    this.tabs = this.loadTabs(brokerQuote.productId as IProduct)

    this.selectTab(this.tabs.find(tab => tab.id == this.selectedTabId))

    this.cols.push({ id: 'labels', style: "width:200px" })

    this.cols.push({ id: brokerQuote._id, label: brokerQuote.originalIntermediateName, style: "width:200px" })

    if (brokerQuote.partnerId["brokerModeStatus"] == true) {
        for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
            if (insurerQuote.parentQuoteId) {
                insurerQuote.partnerId['name'] = "Expired Term"
            }
            this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
        }
    } else {
        for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
            this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })

        }
    }
}

loadTabs(product: IProduct): MenuItem[] {
    switch (product.productTemplate) {
        case AllowedProductTemplate.BLUS:
            return [
                { label: "Client Details", id: "client_details" },
                { label: "Sum Insured Details", id: "sum_insured_details" },
                { label: "Coverage and Addons", id: "add_ons" },
                { label: "Business Suraksha Covers", id: "business_suraksha_covers" },
                { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                { label: "Other Details", id: "other_details" },
            ]

        case AllowedProductTemplate.FIRE:
            return [
                { label: "Client Details", id: "client_details" },
                { label: "Sum Insured Details", id: "sum_insured_details" },
                { label: "Coverage and Addons", id: "add_ons" },
                { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                { label: "Other Details", id: "other_details" },
            ]
        case AllowedProductTemplate.IAR:
            return [
                { label: "Client Details", id: "client_details" },
                { label: "Sum Insured Details", id: "sum_insured_details" },
                { label: "Coverage and Addons", id: "add_ons" },
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
                { label: "Other Details", id: "other_details" }
                ]
            }
        case AllowedProductTemplate.LIABILITY:
            return [
                { label: "Basic Details", id: "basic_details" },
                { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
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
    this.router.navigate([], { queryParams: { tab: tab?.id, location: this.selectedQuoteLocationOccupancy?.value ?? this.selectedQuoteLocationOccupancy } });
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

            break;

        case 'sum_insured_details':

            let higherSumAssuredLocatioName = `${this.quote.locationBasedCovers?.quoteLocationOccupancy?.clientLocationId['locationName']} - ${this.quote.locationBasedCovers?.quoteLocationOccupancy?.pincodeId['name']}`

            let breakupKeys = []

            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Total Sum Insured" },
                [this.quote._id]: { type: 'currency', value: this.quote.totalSumAssured },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({ [quote._id]: { type: 'currency', value: quote.totalSumAssured, styleaddon: quote.totalSumAssured != this.quote.totalSumAssured ? 'red' : '' } })
            })));

            console.log("Agent", this.quote.allCoversArray.higherSumAssuredLocation.sumAssured)
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Higher Location Sum" },

                [this.quote._id]: { type: 'currency', value: this.quote.allCoversArray.higherSumAssuredLocation.sumAssured },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                console.log("Insurer", quote.allCoversArray.higherSumAssuredLocation.sumAssured)
                return ({
                    [quote._id]: {
                        type: 'currency', value: quote.allCoversArray.higherSumAssuredLocation.sumAssured,
                        styleaddon: quote.allCoversArray.higherSumAssuredLocation.sumAssured != this.quote.allCoversArray.higherSumAssuredLocation.sumAssured ? 'red' : ''
                    }
                })
            })));

            this.mapping.push({
                'labels': { type: 'html', value: '' }
            });


            if (this.quote.allCoversArray) {
                let level1HeaderKey = '';
                let level2HeaderKey = '';
                let level3HeaderKey = '';
                let level4HeaderKey = '';

                Object.entries(this.quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([breakUpkey, breakup]) => {

                    let value = Object.entries(breakup).find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1] ?? 0

                    value = typeof (value) == 'number' ? Number(value) : value
                    

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

                                        }
                                    })

                                    return ({ [quote._id]: { type: typeof (insurerBreakupValue) == 'string' ? 'string' : 'currency', isAlignmentRequired: true, value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'red' : '' } })
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

                                        }
                                    })

                                    return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'red' : '' } })
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

                                        }
                                    })

                                    return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'red' : '' } })
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

                                            
                                        }
                                    })

                                    return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue, styleaddon: insurerBreakupValue != value ? 'red' : '' } })
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
                console.log(quote.allCoversArray)
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

            
            for (let cover of this.quote?.locationBasedCovers?.quoteLocationAddonCovers
                .filter(cover => cover?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                .filter(cover => cover?.addOnCoverId?.addonTypeFlag != AllowedAddonTypeFlag.FREE)
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
                                ? 'red'
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

        
            const higherSumAssuredLocatioId = this.quote.locationBasedCovers?.quoteLocationOccupancy?._id

            for (const riskManagementFeature of this.quote.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.quoteLocationOccupancyId == higherSumAssuredLocatioId)) {

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: riskManagementFeature['name'] },
                    [this.quote._id]: { type: 'string', value: riskManagementFeature['checkbox'] == false ? "Not Selected" : "Selected" },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                    let item = quote.locationBasedCovers?.riskManagementFeatures.find((inRiskManagementFeature) => inRiskManagementFeature['riskManagementFeaturesdict']['name'] == riskManagementFeature['name'])
                    let quoteItem = this.quote.locationBasedCovers?.riskManagementFeatures.find((inRiskManagementFeature) => inRiskManagementFeature['riskManagementFeaturesdict']['name'] == riskManagementFeature['name']);

                    return ({ [quote._id]: { type: 'string', value: item['riskManagementFeaturesdict']['checkbox'] == false ? "Not Selected" : "Selected" , styleaddon: item['riskManagementFeaturesdict']['checkbox'] != quoteItem['riskManagementFeaturesdict']['checkbox'] ? 'red' : '' } })
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
                            styleaddon: this.quote.totalFloater != quote.totalFloater ? 'red' : ''
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
                            styleaddon: this.quote.totalDeclarationPolicy != quote.totalDeclarationPolicy ? 'red' : ''
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
                            styleaddon: this.quote.totalLossOfRent != quote.totalLossOfRent ? 'red' : ''
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
                            styleaddon: this.quote.totalRentForAlternative != quote.totalRentForAlternative ? 'red' : ''
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
                        
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalPersonalAccident,
                            styleaddon: this.quote.totalPersonalAccident != quote.totalPersonalAccident ? 'red' : '',
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
                            styleaddon: this.quote.totalValuableContent != quote.totalValuableContent ? 'red' : ''
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.locationBasedCovers?.bscFireLossOfProfitCover?.total,
                            styleaddon: this.quote.locationBasedCovers?.bscFireLossOfProfitCover?.total != quote.locationBasedCovers?.bscFireLossOfProfitCover?.total ? 'red' : '',
                           
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
                            styleaddon: this.quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total != quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total ? 'red' : ''
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
                      
                        [quote._id]: {
                            type: 'currency',
                            value: quote.locationBasedCovers?.bscMoneySafeTillCover?.total,
                            styleaddon: this.quote.locationBasedCovers?.bscMoneySafeTillCover?.total != quote.locationBasedCovers?.bscMoneySafeTillCover?.total ? 'red' : '',
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
                      
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalMoneyTransit,
                            styleaddon: this.quote.totalMoneyTransit != quote.totalMoneyTransit ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total,
                            styleaddon: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total != quote.locationBasedCovers?.bscElectronicEquipmentsCover?.total ? 'red' : '',
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
                        
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalPortableEquipment,
                            styleaddon: this.quote.totalPortableEquipment != quote.totalPortableEquipment ? 'red' : '',
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
                      
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalPedalCycle,
                            styleaddon: this.quote.totalPedalCycle != quote.totalPedalCycle ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalFixedPlateGlass,
                            styleaddon: this.quote.totalFixedPlateGlass != quote.totalFixedPlateGlass ? 'red' : '',
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
                      
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalAccompaniedBaggage,
                            styleaddon: this.quote.totalAccompaniedBaggage != quote.totalAccompaniedBaggage ? 'red' : '',
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
                        
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalFidelityGuarantee,
                            styleaddon: this.quote.totalFidelityGuarantee != quote.totalFidelityGuarantee ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalSignage,
                            styleaddon: this.quote.totalSignage != quote.totalSignage ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalAllRisk,
                            styleaddon: this.quote.totalAllRisk != quote.totalAllRisk ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalLiabilitySection,
                            styleaddon: this.quote.totalLiabilitySection != quote.totalLiabilitySection ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalWorkmenCompensation,
                            styleaddon: this.quote.totalWorkmenCompensation != quote.totalWorkmenCompensation ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalAllRisk,
                            styleaddon: this.quote.totalAccidentalDamage != quote.totalAccidentalDamage ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalClaimPreparationCost,
                            styleaddon: this.quote.totalClaimPreparationCost != quote.totalClaimPreparationCost ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalDeteriorationofStocksinB,
                            styleaddon: this.quote.totalDeteriorationofStocksinB != quote.totalDeteriorationofStocksinB ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalDeteriorationofStocksinA,
                            styleaddon: this.quote.totalDeteriorationofStocksinA != quote.totalDeteriorationofStocksinA ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalEscalation,
                            styleaddon: this.quote.totalEscalation != quote.totalEscalation ? 'red' : '',
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
                        
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalEMIProtectionCover,
                            styleaddon: this.quote.totalEMIProtectionCover != quote.totalEMIProtectionCover ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalInsuranceofadditionalexpense,
                            styleaddon: this.quote.totalInsuranceofadditionalexpense != quote.totalInsuranceofadditionalexpense ? 'red' : '',
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
                       
                        [quote._id]: {
                            type: 'currency',
                            value: quote.totalInvoluntarybettermen,
                            styleaddon: this.quote.totalInvoluntarybettermen != quote.totalInvoluntarybettermen ? 'red' : '',
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

          

            break;

        case 'other_details':
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Deductibles/Excess" },
                [this.quote._id]: { type: 'currency', value: this.quote.deductiblesExcessPd == undefined || this.quote.deductiblesExcessPd == null ? 0 : Number(this.quote.deductiblesExcessPd) },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({
                    [quote._id]: {
                        type: 'currency', value: quote.deductiblesExcessPd == undefined || quote.deductiblesExcessPd == null ? 0 : Number(quote.deductiblesExcessPd),
                        styleaddon: quote.deductiblesExcessPd != this.quote.deductiblesExcessPd ? 'red' : ''
                    }
                })
            })));
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Brokerages" },
                [this.quote._id]: { type: 'string', value: this.quote.brokerage ? this.quote.brokerage : '-' },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.brokerage, styleaddon: quote.brokerage != this.quote.brokerage ? 'red' : '' } })
            })));
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Quote Submission Date" },
                [this.quote._id]: { type: 'string', value: this.quote.quoteSubmissionDate ? new Date(this.quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.quoteSubmissionDate ? new Date(quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ', styleaddon: quote.quoteSubmissionDate != this.quote.quoteSubmissionDate ? 'red' : '' } })
            })));
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Target Premium" },
                [this.quote._id]: { type: this.quote.targetPremium ? 'currency' : 'string', value: this.quote.targetPremium ?? '-' },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({ [quote._id]: { type: (quote.targetPremium && quote.targetPremium != this.quote.targetPremium) ? 'currency' : 'string', value: quote.targetPremium == this.quote.targetPremium ? '-' : quote.targetPremium } })
            })));
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
                [this.quote._id]: { type: 'string', value: this.quote.existingBrokerCurrentYear ? this.quote.existingBrokerCurrentYear : '-' },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({
                    [quote._id]:
                        { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.existingBrokerCurrentYear ? quote.existingBrokerCurrentYear : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'red' : '' }
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
                return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.otherTerms ? quote.otherTerms : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'red' : '' } })
            })));
            this.mapping.push(Object.assign({
                'labels': { type: 'string', value: "Any Additional Information" },
                [this.quote._id]: { type: 'string', value: this.quote.additionalInfo ? this.quote.additionalInfo : '-' },
            }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.additionalInfo ? quote.additionalInfo : '-', styleaddon: quote.additionalInfo != this.quote.additionalInfo ? 'red' : '' } })
            })));




            break;

    }


}

openQuoteSlip(quoteId?) {
    console.log(quoteId)

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

downloadExcel(): void {
    this.quoteService.downloadQCRExcel(this.quote._id, this.quote.quoteNo).subscribe({
        next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)
            if (dto.status == 'success') {
                this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

            }
        }
    })
}

loadQuoteLocationOccupancies() {
    let lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 20,
        sortField: null,
        sortOrder: 1,
        filters: {
            // @ts-ignore
            quoteId: [
                {
                    value: this.quoteId,
                    matchMode: "equals",
                    operator: "and"
                }
            ]
        },
        globalFilter: null,
        multiSortMeta: null
    };

    this.quoteLocationOccupancyService.externalLocationForQCR(lazyLoadEvent).subscribe({
        next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
            this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IQuoteLocationOccupancy) => {
                let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation;
                let pincode: IPincode = entity.pincodeId as IPincode;
                return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id };
            });

            this.selectedQuoteLocationOccupancy = this.activatedRoute.snapshot.queryParams.location
            console.log(this.selectedQuoteLocationOccupancy);

            const ql = this.activatedRoute.snapshot.queryParams.location;
            this.optionsQuoteLocationOccupancies = this.optionsQuoteLocationOccupancies.map((lov: ILov) =>
                lov.value == this.quote?.locationBasedCovers?.higherSumAssuredLocation?._id ? { value: lov.value, label: `* ${lov.label.replace("*", "")}` } : lov
            );
            this.quoteService.externalQCR(this.quoteId, { allCovers: true, qcr: true, quoteLocationOccupancyId: this.selectedQuoteLocationOccupancy?.value}).subscribe({
                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                    console.log(dto.data.entity.locationBasedCovers.quoteLocationOccupancy,"kkkkkk")
                    this.quoteService.setQuote(dto.data.entity)

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

                    // this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
                    //     next: (dto: IManyResponseDto<IClaimExperience>) => {
                    //         this.claimExperiences = dto.data.entities
                    //         console.log('***', this.claimExperiences)
                    //     }
                    // })
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
    this.router.navigate([], { queryParams: { tab: this.selectedTabId, location: quoteLocationOccupancyId } });
    this.quoteService.externalQCR(this.quoteId,{ allCovers: true, qcr: true, quoteLocationOccupancyId: quoteLocationOccupancyId }).subscribe({
        next: (dto: IOneResponseDto<IQuoteSlip>) => {
            console.log(dto.data.entity)
            this.quoteService.setQuote(dto.data.entity)

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

            // this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
            //     next: (dto: IManyResponseDto<IClaimExperience>) => {
            //         this.claimExperiences = dto.data.entities
            //         console.log('***', this.claimExperiences)
            //     }
            // })
        },
        error: e => {
            console.log(e);
        }
    });

  }
}