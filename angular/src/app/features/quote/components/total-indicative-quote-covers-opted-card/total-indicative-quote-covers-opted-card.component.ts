import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AllowedProductBscCover, AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { BscCoverCardProps } from '../bsc-cover-card/bsc-cover-card.component';
import { ConfigureDiscountDialogeComponent } from '../configure-discount-dialoge/configure-discount-dialoge.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-total-indicative-quote-covers-opted-card',
    templateUrl: './total-indicative-quote-covers-opted-card.component.html',
    styleUrls: ['./total-indicative-quote-covers-opted-card.component.scss']
})
export class TotalIndicativeQuoteCoversOptedCardComponent implements OnInit, OnChanges {

    id: string;
    @Input() quote: IQuoteSlip;

    toWord = new ToWords();

    covers: BscCoverCardProps[] = []
    isMobile: boolean = false;
    hideOptValue: boolean;
    private currentQuote: Subscription;

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        // private quoteService: QuoteService,
        private dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService
    ) {
        // this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        // this.setCovers()                  // Old_Quote
        this.setCoversForQuoteOptions()      // New_Quote_Option
        if (this.quote.productId['type'] == 'Erection All Risk') {
            this.hideOptValue = true
        } else {
            this.hideOptValue = false;
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        // this.setCovers()                  // Old_Quote
        this.setCoversForQuoteOptions()      // New_Quote_Option
    }

    setCovers() {
        this.covers = []

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Fire Loss of Profit",
            premium: this.quote?.totalFireLossOfProfit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Burglary & Housebreaking (including Theft & RSMD)",
            premium: this.quote?.totalBurglaryHouse ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Electrical and Mechanical Appliances",
            premium: this.quote?.totalPortableEquipment ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quote?.totalelectronicEquipment > 0) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Electronic Equipment",
            premium: this.quote?.totalelectronicEquipment ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Money In Transit",
            premium: this.quote?.totalMoneyTransit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quote?.totalMoneySafeTill > 0) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Money In Safe / Till",
            premium: this.quote?.totalMoneySafeTill ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Fidelity Guarantee",
            premium: this.quote?.totalFidelityGuarantee ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quote?.totalFixedPlateGlass > 0) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Fixed Plate Glass",
            premium: this.quote?.totalFixedPlateGlass ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Signage",
            premium: this.quote?.totalSignage ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Personal Accident Cover",
            premium: this.quote?.totalPersonalAccident,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Workmen Compensation",
            premium: this.quote?.totalWorkmenCompensation ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Liability Section",
            premium: this.quote?.totalLiabilitySection ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Pedal Cycle",
            premium: this.quote?.totalPedalCycle ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Accompanied Baggage",
            premium: this.quote?.totalAccompaniedBaggage ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "All Risks",
            premium: this.quote?.totalAllRisk ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Floater Addon Cover",
            premium: this.quote.totalFloater,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Declaration Policy",
            premium: this.quote.totalDeclarationPolicy,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Loss of Rent",
            premium: this.quote?.totalLossOfRent,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Rent for Alternative Accomodation",
            premium: this.quote?.totalRentForAlternative,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Valuable Contents on Agreed Value Basis",
            premium: this.quote?.totalValuableContent,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Accidental Damage",
            premium: this.quote?.totalAccidentalDamage,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.THIRD_PARTY_LIABILITY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Third party liability",
            premium: this.quote?.totalThirdPartyLiability,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Tenants legal Liability",
            premium: this.quote?.totalTenantslegalLiability,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.REMOVAL_OF_DEBRIS)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Removal Of Debris",
            premium: this.quote?.totalRemovalOfDebris,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Protection and Preservation of Property",
            premium: this.quote?.totalProtectionandPreservationofProperty,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Landscaping including lawns plant shrubs or trees",
            premium: this.quote?.totalLandscapingincludinglawnsplantshrubsortrees,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.KEYS_AND_LOCKS)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Keys and Locks",
            premium: this.quote?.totalKeysandLocks,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Cover of Valuable Contents",
            premium: this.quote?.totalCoverofValuableContents,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Claim Preparation Cost",
            premium: this.quote?.totalClaimPreparationCost,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Additional Custom Duty",
            premium: this.quote?.totalAdditionalCustomDuty,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Deterioration of Stocks in B",
            premium: this.quote?.totalDeteriorationofStocksinB,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Deterioration of Stocks in A",
            premium: this.quote?.totalDeteriorationofStocksinA,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Escalation",
            premium: this.quote?.totalEscalation,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "EMI Protection Cover",
            premium: this.quote?.totalEMIProtectionCover,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Insurance of additional expense",
            premium: this.quote?.totalInsuranceofadditionalexpense,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Involuntary betterment",
            premium: this.quote?.totalInvoluntarybettermen,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Machinery / Electrical BreakDown ",
            premium: this.quote?.totalMachineryElectricalBreakDown ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],

        })
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Machinery Loss Of Profit (MBLOP)",
            premium: this.quote?.totalMachineryLossOfProfit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],

        })
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) this.covers.push({
            productName: this.quote.productId['type'],
            label: " Fire Loss Profit (Flop)",
            premium: this.quote?.totalFireLossOfProfit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],

        })

        if ([AllowedProductTemplate.FIRE, AllowedProductTemplate.BLUS].includes(this.quote.productId['productTemplate'])) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Floater Addon Cover",
            premium: this.quote.totalFireFloater,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if ([AllowedProductTemplate.FIRE, AllowedProductTemplate.BLUS].includes(this.quote.productId['productTemplate'])) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Addon Covers",
            // premium: this.quote.totalIndictiveQuoteAmt - (this.quote.totalFireFloater + (this.quote?.totalFlexa ?? 0) + (this.quote?.totalStfi ?? 0) + (this.quote?.totalEarthquake ?? 0) + (this.quote?.totalTerrorism ?? 0)),
            premium: this.quote.totalQuoteLocationAddonCover,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if ([AllowedProductTemplate.BLUS].includes(this.quote.productId['productTemplate']) && this.quote.totalInbuiltAddonCover > 0) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Inbuilt Addon Cover",
            premium: this.quote.totalInbuiltAddonCover,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?.totalDiscount) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Risk Inspection Discount Percentage",
            premium: this.quote?.locationBasedCovers?.quoteLocationOccupancy?.totalDiscount ?? 0,
            percentage: true,
            // isNegative: false,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?.totalDiscount) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Risk Inspection Discount",
            premium: this.quote?.locationBasedCovers?.quoteLocationOccupancy?.totalPremiumWithDiscount ?? 0,
            // isNegative: false,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quote.discountId) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Discount ",
            premium: this.quote?.discountId['discountedAmount'] ?? 0,
            isNegative: true,
            permissions: ['create', 'read', 'update', 'delete'],

        })
    }

    setCoversForQuoteOptions() {
        this.covers = []

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Fire Loss of Profit",
            premium: this.quoteOptionData?.totalFireLossOfProfit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Burglary & Housebreaking (including Theft & RSMD)",
            premium: this.quoteOptionData?.totalBurglaryHouse ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Electrical and Mechanical Appliances",
            premium: this.quoteOptionData?.totalPortableEquipment ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quoteOptionData?.totalelectronicEquipment > 0) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Electronic Equipment",
            premium: this.quoteOptionData?.totalelectronicEquipment ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Money In Transit",
            premium: this.quoteOptionData?.totalMoneyTransit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quoteOptionData?.totalMoneySafeTill > 0) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Money In Safe / Till",
            premium: this.quoteOptionData?.totalMoneySafeTill ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Fidelity Guarantee",
            premium: this.quoteOptionData?.totalFidelityGuarantee ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quoteOptionData?.totalFixedPlateGlass > 0) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Fixed Plate Glass",
            premium: this.quoteOptionData?.totalFixedPlateGlass ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Signage",
            premium: this.quoteOptionData?.totalSignage ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Personal Accident Cover",
            premium: this.quoteOptionData?.totalPersonalAccident,
            permissions: ['create', 'read', 'update', 'delete'],
        })


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Workmen Compensation",
            premium: this.quoteOptionData?.totalWorkmenCompensation ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Liability Section",
            premium: this.quoteOptionData?.totalLiabilitySection ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Pedal Cycle",
            premium: this.quoteOptionData?.totalPedalCycle ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Accompanied Baggage",
            premium: this.quoteOptionData?.totalAccompaniedBaggage ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "All Risks",
            premium: this.quoteOptionData?.totalAllRisk ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Floater Addon Cover",
            premium: this.quoteOptionData?.totalFloater,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Declaration Policy",
            premium: this.quoteOptionData?.totalDeclarationPolicy,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Loss of Rent",
            premium: this.quoteOptionData?.totalLossOfRent,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Rent for Alternative Accomodation",
            premium: this.quoteOptionData?.totalRentForAlternative,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Valuable Contents on Agreed Value Basis",
            premium: this.quoteOptionData?.totalValuableContent,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Accidental Damage",
            premium: this.quoteOptionData?.totalAccidentalDamage,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.THIRD_PARTY_LIABILITY)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Third party liability",
            premium: this.quoteOptionData?.totalThirdPartyLiability,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Tenants legal Liability",
            premium: this.quoteOptionData?.totalTenantslegalLiability,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.REMOVAL_OF_DEBRIS)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Removal Of Debris",
            premium: this.quoteOptionData?.totalRemovalOfDebris,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Protection and Preservation of Property",
            premium: this.quoteOptionData?.totalProtectionandPreservationofProperty,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Landscaping including lawns plant shrubs or trees",
            premium: this.quoteOptionData?.totalLandscapingincludinglawnsplantshrubsortrees,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.KEYS_AND_LOCKS)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Keys and Locks",
            premium: this.quoteOptionData?.totalKeysandLocks,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Cover of Valuable Contents",
            premium: this.quoteOptionData?.totalCoverofValuableContents,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Claim Preparation Cost",
            premium: this.quoteOptionData?.totalClaimPreparationCost,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Additional Custom Duty",
            premium: this.quoteOptionData?.totalAdditionalCustomDuty,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Deterioration of Stocks in B",
            premium: this.quoteOptionData?.totalDeteriorationofStocksinB,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Deterioration of Stocks in A",
            premium: this.quoteOptionData?.totalDeteriorationofStocksinA,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Escalation",
            premium: this.quoteOptionData?.totalEscalation,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "EMI Protection Cover",
            premium: this.quoteOptionData?.totalEMIProtectionCover,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Insurance of additional expense",
            premium: this.quoteOptionData?.totalInsuranceofadditionalexpense,
            permissions: ['create', 'read', 'update', 'delete'],
        })
        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Involuntary betterment",
            premium: this.quoteOptionData?.totalInvoluntarybettermen,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.quoteId["productId"]['productTemplate'] == AllowedProductTemplate.IAR) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Machinery / Electrical BreakDown ",
            premium: this.quoteOptionData?.totalMachineryElectricalBreakDown ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],

        })
        if (this.quoteOptionData?.quoteId["productId"]['productTemplate'] == AllowedProductTemplate.IAR) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Machinery Loss Of Profit (MBLOP)",
            premium: this.quoteOptionData?.totalMachineryLossOfProfit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],

        })
        if (this.quoteOptionData?.quoteId["productId"]['productTemplate'] == AllowedProductTemplate.IAR) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: " Fire Loss Profit (Flop)",
            premium: this.quoteOptionData?.totalFireLossOfProfit ?? 0,
            permissions: ['create', 'read', 'update', 'delete'],

        })

        if ([AllowedProductTemplate.FIRE, AllowedProductTemplate.BLUS].includes(this.quoteOptionData?.quoteId["productId"]['productTemplate'])) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Floater Addon Cover",
            premium: this.quoteOptionData.totalFireFloater,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if ([AllowedProductTemplate.FIRE, AllowedProductTemplate.BLUS].includes(this.quoteOptionData?.quoteId["productId"]['productTemplate'])) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Addon Covers",
            // premium: this.quote.totalIndictiveQuoteAmt - (this.quote.totalFireFloater + (this.quoteOptionData?.totalFlexa ?? 0) + (this.quoteOptionData?.totalStfi ?? 0) + (this.quoteOptionData?.totalEarthquake ?? 0) + (this.quoteOptionData?.totalTerrorism ?? 0)),
            premium: this.quoteOptionData.totalQuoteLocationAddonCover,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if ([AllowedProductTemplate.BLUS].includes(this.quoteOptionData?.quoteId["productId"]['productTemplate']) && this.quoteOptionData.totalInbuiltAddonCover > 0) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Inbuilt Addon Cover",
            premium: this.quoteOptionData.totalInbuiltAddonCover,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.totalDiscount) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Risk Inspection Discount Percentage",
            premium: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.totalDiscount ?? 0,
            percentage: true,
            // isNegative: false,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.totalDiscount) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Risk Inspection Discount",
            premium: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.totalPremiumWithDiscount ?? 0,
            // isNegative: false,
            permissions: ['create', 'read', 'update', 'delete'],
        })

        if (this.quoteOptionData?.discountId) this.covers.push({
            productName: this.quoteOptionData.quoteId["productId"]['type'],
            label: "Discount ",
            premium: this.quoteOptionData?.discountId['discountedAmount'] ?? 0,
            isNegative: true,
            permissions: ['create', 'read', 'update', 'delete'],

        })
    }

    opneConfigureDiscountDialoge() {
        const ref = this.dialogService.open(ConfigureDiscountDialogeComponent, {
            header: "Configure Discount",
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData

            },
            width: this.isMobile ? '98vw' : '30%',
            height: this.isMobile ? '50%' : '60%',
            styleClass: "customPopup"
        })


        ref.onClose.subscribe(() => {
            this.quoteService.refresh()
            this.quoteOptionService.refreshQuoteOption()

        });
    }
}
