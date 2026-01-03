import { IEscalationCover } from './../../../../blus_bsc_dialogs/escalation-form-dialog/escalation-form-dialog.component';
import { AdditionalCustomDutyFormDialogComponent, IAdditionalCustomDutyCover } from './../../../../blus_bsc_dialogs/additional-custom-duty-form-dialog/additional-custom-duty-form-dialog.component';
import { IRemovalOfDebrisCover } from './../../../../blus_bsc_dialogs/removal-of-debris-form-dialog/removal-of-debris-form-dialog.component';
import { TenantsLegalLiabilityFormDialogComponent } from './../../../../blus_bsc_dialogs/tenants-legal-liability-form-dialog/tenants-legal-liability-form-dialog.component';
import { IThirdPartyLiabilityCover } from './../../../../blus_bsc_dialogs/third-party-liability-form-dialog/third-party-liability-form-dialog.component';
import { BscWorkmenCompensationFormDialogComponent } from './../../../../blus_bsc_dialogs/bsc-workmen-compensation-form-dialog/bsc-workmen-compensation-form-dialog.component';
import { AccountService } from 'src/app/features/account/account.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { IBscAccompaniedBaggage } from 'src/app/features/admin/bsc-accompanied-baggage/bsc-accompanied-baggage.model';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { IBscElectronicEquipmentsCover } from 'src/app/features/admin/bsc-electronic-equipment/bsc-electronic-equipment.model';
import { IBSCFidelityGurantee } from 'src/app/features/admin/bsc-fidelity-gurantee/bsc-fidelity-gurantee.model';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { IBscLiability } from 'src/app/features/admin/bsc-liability/bsc-liability.model';
import { IBscMoneySafeTillCover } from 'src/app/features/admin/bsc-money-safe-till/bsc-money-safe-till.model';
import { IBscMoneyTransitCover } from 'src/app/features/admin/bsc-money-transit/bsc-money-transit.model';
import { IBscAllRisks, IBscPortableEquipments } from 'src/app/features/admin/bsc-portable-equipments/bsc-portable-equipment.model';
import { IBscPedalCycle, IBscSignage } from 'src/app/features/admin/bsc-signage/bsc-signage.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { BscCoverCardProps } from '../../../bsc-cover-card/bsc-cover-card.component';
import { LossOfRentDialogComponent } from '../../standerd-addons-dialog/loss-of-rent-dialog/loss-of-rent-dialog.component';
import { PersonalAccidentCoverDialogComponent } from '../../standerd-addons-dialog/personal-accident-cover-dialog/personal-accident-cover-dialog.component';
import { ValuebleContentAgreedValueBasisDialogComponent } from '../../standerd-addons-dialog/valueble-content-agreed-value-basis-dialog/valueble-content-agreed-value-basis-dialog.component';
import { RentForAlternativeAccomodationDialogComponent } from '../../standerd-addons-dialog/rent-for-alternative-accomodation-dialog/rent-for-alternative-accomodation-dialog.component';
import { DeclarationPolicyDialogComponent } from '../../standerd-addons-dialog/declaration-policy-dialog/declaration-policy-dialog.component';
import { FloaterCoverAddonDialogComponent } from '../../standerd-addons-dialog/floater-cover-addon-dialog/floater-cover-addon-dialog.component';
import { IFloaterCoverAddOn } from 'src/app/features/admin/floater-cover-addon/floater-cover-addon.model';
import { IValuableContentsOnAgreedValue } from 'src/app/features/admin/valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.model';
import { AllowedProductBscCover } from 'src/app/features/admin/product/product.model';
import { BscFireLossOfProfitFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-fire-loss-of-profit-form-dialog/bsc-fire-loss-of-profit-form-dialog.component';
import { BscBuglaryAndHousebreakingViewQuoteBreakupDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-buglary-and-housebreaking-view-quote-breakup-dialog/bsc-buglary-and-housebreaking-view-quote-breakup-dialog.component';
import { BscMoneyInSafeTillFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-money-in-safe-till-form-dialog/bsc-money-in-safe-till-form-dialog.component';
import { BscMoneyInSafeTillViewQuoteBreakupDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-money-in-safe-till-view-quote-breakup-dialog/bsc-money-in-safe-till-view-quote-breakup-dialog.component';
import { BscMoneyInTransitFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-money-in-transit-form-dialog/bsc-money-in-transit-form-dialog.component';
import { BscElectronicEquipmentsFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-electronic-equipments-form-dialog/bsc-electronic-equipments-form-dialog.component';
import { BscElectronicEquipmentsViewQuoteBreakupDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-electronic-equipments-view-quote-breakup-dialog/bsc-electronic-equipments-view-quote-breakup-dialog.component';
import { BscPortableEquipmentsFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-portable-equipments-form-dialog/bsc-portable-equipments-form-dialog.component';
import { BscFixedPlateGlassFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-fixed-plate-glass-form-dialog/bsc-fixed-plate-glass-form-dialog.component';
import { BscFixedPlateGlassViewQuoteBreakupDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-fixed-plate-glass-view-quote-breakup-dialog/bsc-fixed-plate-glass-view-quote-breakup-dialog.component';
import { BscAccompaniedBaggageFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-accompanied-baggage-form-dialog/bsc-accompanied-baggage-form-dialog.component';
import { BscFidelityGuranteeFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-fidelity-gurantee-form-dialog/bsc-fidelity-gurantee-form-dialog.component';
import { BscSignageFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-signage-form-dialog/bsc-signage-form-dialog.component';
import { BscLiabilitySectionFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-liability-section-form-dialog/bsc-liability-section-form-dialog.component';
import { BscBurglaryAndHousebreakingFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-burglary-and-housebreaking-form-dialog/bsc-burglary-and-housebreaking-form-dialog.component';
import { IBscFixedPlateGlassCover } from 'src/app/features/admin/bsc-fixed-plate-glass/bsc-fixed-plate-glass.model';
import { IDeclarationPolicy } from 'src/app/features/admin/declaration-policy-cover/declaration-policy-cover.model';
import { ILossOfRent } from 'src/app/features/admin/loss-of-rent-cover/loss-of-rent-cover.model';
import { IRentForAlternativeAccomodation } from 'src/app/features/admin/rent-for-alternative-accomodation-cover/rent-for-alternative-accomodation-cover.model';
import { IPersonalAccidentCover } from 'src/app/features/admin/personal-accident-cover/personal-accident-cover.model';
import { SidebarService } from '../../../quote-requisition-sidebar/sidebar.service';
import { IBscWorkmenCompensation } from 'src/app/features/admin/bsc-workmen_compensation/bsc-workmen_compensation.model';
import { ConfirmEventType, ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DeleteBscCoverComponent } from '../../../delete-bsc-cover/delete-bsc-cover.component';
import { BscPedalCycleFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-pedal-cycle-form-dialog/bsc-pedal-cycle-form-dialog.component';
import { BscAllRiskFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/bsc-all-risk-form-dialog/bsc-all-risk-form-dialog.component';
import { ThirdPartyLiabilityFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/third-party-liability-form-dialog/third-party-liability-form-dialog.component';
import { RemovalOfDebrisFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/removal-of-debris-form-dialog/removal-of-debris-form-dialog.component';
import { ProtectionAndPreservationOfPropertyFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/protection-and-preservation-of-property-form-dialog/protection-and-preservation-of-property-form-dialog.component';
import { AccidentalDamageFormDialogComponent, IAccidentalDamageCover } from 'src/app/features/quote/blus_bsc_dialogs/accidental-damage-form-dialog/accidental-damage-form-dialog.component';
import { ClaimPreparationCostFormDialogComponent, IClaimPreparationCostCover } from 'src/app/features/quote/blus_bsc_dialogs/claim-preparation-cost-form-dialog/claim-preparation-cost-form-dialog.component';
import { CoverOfValuableContentsFormDialogComponent, ICoverOfValuableContentsCover } from 'src/app/features/quote/blus_bsc_dialogs/cover-of-valuable-contents-form-dialog/cover-of-valuable-contents-form-dialog.component';
import { IKeysAndLocksCover, KeysAndLocksFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/keys-and-locks-form-dialog/keys-and-locks-form-dialog.component';
import { ILandscapingIncludingLawnsPlantShrubsOrTreesCover, LandscapingIncludingLawnsPlantShrubsOrTreesFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog.component';
import { DeteriorationofStocksinBFormDialogComponent, IDeteriorationofStocksinBCover } from 'src/app/features/quote/blus_bsc_dialogs/deteriorationof-stocksin-b-form-dialog/deteriorationof-stocksin-b-form-dialog.component';
import { DeteriorationofStocksinAFormDialogComponent, IDeteriorationofStocksinACover } from 'src/app/features/quote/blus_bsc_dialogs/deteriorationof-stocksin-a-form-dialog/deteriorationof-stocksin-a-form-dialog.component';
import { EscalationFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/escalation-form-dialog/escalation-form-dialog.component';
import { EmiProtectionCoverFormDialogComponent, IEmiProtectionCover } from 'src/app/features/quote/blus_bsc_dialogs/emi-protection-cover-form-dialog/emi-protection-cover-form-dialog.component';
import { IInsuranceOfAdditionalExpenseCover, InsuranceOfAdditionalExpenseFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/insurance-of-additional-expense-form-dialog/insurance-of-additional-expense-form-dialog.component';
import { IInvoluntaryBettermentCover, InvoluntaryBettermentFormDialogComponent } from 'src/app/features/quote/blus_bsc_dialogs/involuntary-betterment-form-dialog/involuntary-betterment-form-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BscCoverDescriptionService } from 'src/app/features/admin/bsc-cover-description/bsc-cover-description.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-business-suraksha-covers-tab',
    templateUrl: './business-suraksha-covers-tab.component.html',
    styleUrls: ['./business-suraksha-covers-tab.component.scss']
})
export class BusinessSurakshaCoversTabComponent implements OnInit {

    @Input() isEditAllowed = true;

    covers: BscCoverCardProps[] = [];

    quote: IQuoteSlip
    // quoteLocationOccupancyId: string

    toWords = new ToWords();
    showIndicativeQuote: boolean = true;

    totalBasePremium: number = 0;
    totalCoverOptedPremium: number = 0;
    totalFireLossOfProfit: number = 0;
    totalBurglaryAndHousebreaking: number = 0;
    totalMoneyInSafeOrTill: number = 0;
    totalMoneyInTransit: number = 0;
    totalElectronicEquipment: number = 0;
    totalPortableEquipment: number = 0;
    totalAccompaniedBaggage: number = 0;
    totalFidelityGuarantee: number = 0;
    totalSignage: number = 0;
    totalLiabilitySection: number = 0;

    bscAccompaniedBaggageCoverTotal: Number
    bscPortableEquipmentsCoverTotal: Number
    bscFidelityGuaranteeCoverTotal: Number
    bscSignageCoverTotal: Number
    bscLiabilitySectionCoverTotal: Number
    bscworkmencompensationTotal: Number
    togglesidebar: boolean = false;
    currentUser: any;
    isMobile: boolean = false;
    bscCoverDescription = []

    private currentQuote: Subscription;
    // private currentUser: Subscription;

    private currentPropertyQuoteOption: Subscription;
    @Input() quoteOptionData: IQuoteOption

    constructor(
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private router: Router,
        private sidebarService: SidebarService,
        private accountService: AccountService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private deviceService: DeviceDetectorService,
        private bscCoverDescriptionService: BscCoverDescriptionService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.accountService.currentUser$.subscribe({
            next: user => {
                this.currentUser = user;
            }
        });
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                // console.log(quote.locationBasedCovers?.bscBurglaryHousebreakingCover?.total)

                // console.log(quote.locationBasedCovers?.bscAccompaniedBaggageCover.map(el => el.total).reduce((a: number, b: number) => a + b, 0))

                // Old_Quote
                // this.bscPortableEquipmentsCoverTotal = quote?.locationBasedCovers?.bscPortableEquipmentsCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                // this.bscAccompaniedBaggageCoverTotal = quote?.locationBasedCovers?.bscAccompaniedBaggageCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                // this.bscFidelityGuaranteeCoverTotal = quote?.locationBasedCovers?.bscFidelityGuaranteeCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                // this.bscSignageCoverTotal = quote?.locationBasedCovers?.bscSignageCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                // this.bscLiabilitySectionCoverTotal = quote?.locationBasedCovers?.bscLiabilitySectionCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                // this.bscworkmencompensationTotal = quote?.locationBasedCovers?.bscWorkmenCompensationCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                // let lazyLoadEvent: LazyLoadEvent = {
                //     first: 0,
                //     rows: 200,
                //     sortField: null,
                //     sortOrder: 1,
                //     filters: {
                //         //@ts-ignore
                //         active: [
                //             {
                //                 //@ts-ignore
                //                 value: true,
                //                 matchMode: "equals",
                //                 operator: "and"
                //             }
                //         ]
                //     },
                //     globalFilter: null,
                //     multiSortMeta: null
                // }
                // this.bscCoverDescriptionService.getMany(lazyLoadEvent).subscribe(res => {
                //     this.bscCoverDescription = res.data.entities;
                //     this.setCovers();
                // })
            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto

                this.bscPortableEquipmentsCoverTotal = dto?.locationBasedCovers?.bscPortableEquipmentsCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                this.bscAccompaniedBaggageCoverTotal = dto?.locationBasedCovers?.bscAccompaniedBaggageCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                this.bscFidelityGuaranteeCoverTotal = dto?.locationBasedCovers?.bscFidelityGuaranteeCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                this.bscSignageCoverTotal = dto?.locationBasedCovers?.bscSignageCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                this.bscLiabilitySectionCoverTotal = dto?.locationBasedCovers?.bscLiabilitySectionCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                this.bscworkmencompensationTotal = dto?.locationBasedCovers?.bscWorkmenCompensationCovers?.map(el => el?.total)?.reduce((a: number, b: number) => a + b, 0)
                let lazyLoadEvent: LazyLoadEvent = {
                    first: 0,
                    rows: 200,
                    sortField: null,
                    sortOrder: 1,
                    filters: {
                        //@ts-ignore
                        active: [
                            {
                                //@ts-ignore
                                value: true,
                                matchMode: "equals",
                                operator: "and"
                            }
                        ]
                    },
                    globalFilter: null,
                    multiSortMeta: null
                }
                this.bscCoverDescriptionService.getMany(lazyLoadEvent).subscribe(res => {
                    this.bscCoverDescription = res.data.entities;
                    this.setCovers();
                })
            }
        });


    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
    }
    // Old_Quote
    // setCovers() {

    //     this.covers = [];
    //     let existingCovers = this.quote?.selectedAllowedProductBscCover

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Fire Loss of Profit",
    //         premium: this.quote?.locationBasedCovers?.bscFireLossOfProfitCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.bscFireLossOfProfitCover?.grossProfit ?? 0) + Number(this.quote?.locationBasedCovers?.bscFireLossOfProfitCover?.auditorsFees ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.bscFireLossOfProfitCover?.isNonOtc,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)[0],
    //         modelname: AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER,
    //         formDialogFunction: () => this.openFireLossOfProfitFormDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: this.quote.productId['isOccupancySubTypeShow'] ? "* Burglary & Housebreaking (including Theft & RSMD)" : "Burglary & Housebreaking (including Theft & RSMD)",
    //         premium: this.quote?.locationBasedCovers?.bscBurglaryHousebreakingCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.bscBurglaryHousebreakingCover?.isFirstLossOpted ? this.quote?.locationBasedCovers?.bscBurglaryHousebreakingCover?.firstLossSumInsured : this.quote?.locationBasedCovers?.bscBurglaryHousebreakingCover?.otherContents,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         modelname: AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)[0],
    //         // isNonOtc : this.quote?.locationBasedCovers.bscBurglaryHousebreakingCover?.isNonOtc,
    //         formDialogFunction: () => this.openBuglaryAndHouseBreakingFormDialog(),
    //         viewDialogFunction: () => this.openBuglaryAndHouseBreakingViewQuoteBreakupDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {

    //         let total = 0
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote?.locationBasedCovers?.bscPortableEquipmentsCovers.map((cover: IBscPortableEquipments) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Electrical and Mechanical Appliances",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)[0],
    //             formDialogFunction: () => this.openPortableEquipmentsFormDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER),

    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quote?.locationBasedCovers?.bscElectronicEquipmentsCover) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Electronic Equipment",
    //         premium: this.quote?.locationBasedCovers?.bscElectronicEquipmentsCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.bscElectronicEquipmentsCover?.sumInsured,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.bscElectronicEquipmentsCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER)[0],
    //         modelId: this.quote?.locationBasedCovers.bscElectronicEquipmentsCover?._id,
    //         formDialogFunction: () => this.openElectronicEquipmentsFormDialog(),
    //         viewDialogFunction: () => this.openElectronicEquipmentsViewQuoteBreakupDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Money In Transit",
    //         premium: this.quote?.locationBasedCovers?.bscMoneyTransitCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.bscMoneyTransitCover?.singleCarryingLimit,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.bscMoneyTransitCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)[0],
    //         formDialogFunction: () => this.openMoneyInTransitFormDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quote?.locationBasedCovers?.bscMoneySafeTillCover) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Money In Safe / Till",
    //         premium: this.quote?.locationBasedCovers?.bscMoneySafeTillCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.bscMoneySafeTillCover?.moneySafe ?? 0) + Number(this.quote?.locationBasedCovers?.bscMoneySafeTillCover?.moneyTillCounter ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.bscMoneySafeTillCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER)[0],
    //         modelId: this.quote?.locationBasedCovers.bscMoneySafeTillCover?._id,
    //         formDialogFunction: () => this.openMoneyInSafeTillFormDialog(),
    //         viewDialogFunction: () => this.openMoneyInSafeViewQuoteBreakupDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
    //         let total = 0;
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote.locationBasedCovers?.bscFidelityGuaranteeCovers.map((cover: IBSCFidelityGurantee) => {
    //             total = total + Number(cover?.total ?? 0)
    //             sumInsured = sumInsured + cover.sumInsured;
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Fidelity Guarantee",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)[0],
    //             formDialogFunction: () => this.openFidelityGuranteeFormDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER),

    //         })
    //     }


    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quote?.locationBasedCovers?.bscFixedPlateGlassCover) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Fixed Plate Glass",
    //         premium: this.quote?.locationBasedCovers?.bscFixedPlateGlassCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.bscFixedPlateGlassCover?.sumInsured,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.bscFixedPlateGlassCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER)[0],
    //         modelId: this.quote?.locationBasedCovers.bscFixedPlateGlassCover?._id,
    //         formDialogFunction: () => this.openFixedPlateGlassFormDialog(),
    //         viewDialogFunction: () => this.openFixedPlateGlassViewQuoteBreakupDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
    //         let total = 0;
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote.locationBasedCovers?.bscSignageCovers.map((cover: IBscSignage) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured;
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Signage",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_SIGNAGE_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_SIGNAGE_COVER)[0],
    //             formDialogFunction: () => this.openSignageFormDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_SIGNAGE_COVER),

    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
    //         let total = 0
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote?.locationBasedCovers?.personalAccidentCoverCover.map((cover: any) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Personal Accident Cover",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             isNonOtc: isNonOtc,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             modelname: AllowedProductBscCover.PERSONAL_ACCIDENT_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)[0],
    //             formDialogFunction: () => this.openPersonalAccidentCoverDialog(),
    //         })
    //     }


    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) {
    //         let total = 0;
    //         let sumInsured = 0;
    //         let isNonOtc = false
    //         console.log(this.quote?.locationBasedCovers)
    //         this.quote?.locationBasedCovers?.bscWorkmenCompensationCovers.map((cover: IBscWorkmenCompensation) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Workmen Compensation",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)[0],
    //             formDialogFunction: () => this.openWorkmenCompensationDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER),

    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
    //         let total = 0;
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote?.locationBasedCovers?.bscLiabilitySectionCovers.map((cover: IBscLiability) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Liability Section",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)[0],
    //             formDialogFunction: () => this.openLiabilitySectionFormDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER),

    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) {

    //         let total = 0
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote?.locationBasedCovers?.bscPedalCycleCovers.map((cover: IBscPedalCycle) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Pedal Cycle",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)[0],
    //             formDialogFunction: () => this.openPedalCycleDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER),

    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {

    //         let total = 0;
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote.locationBasedCovers?.bscAccompaniedBaggageCovers.map((cover: IBscAccompaniedBaggage) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Accompanied Baggage",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)[0],
    //             formDialogFunction: () => this.openAccompaniedBaggageFormDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER),

    //         })
    //     }


    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) {

    //         let total = 0
    //         let sumInsured = 0;
    //         let isNonOtc = false

    //         this.quote?.locationBasedCovers?.bscAllRiskCovers.map((cover: IBscAllRisks) => {
    //             total = total + Number(cover?.total ?? 0);
    //             sumInsured = sumInsured + cover.sumInsured
    //             if (!isNonOtc && cover.isNonOtc) {
    //                 isNonOtc = cover.isNonOtc
    //             }
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "All Risk",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: isNonOtc,
    //             modelname: AllowedProductBscCover.BSC_ALL_RISK_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_ALL_RISK_COVER)[0],
    //             formDialogFunction: () => this.openAllRiskDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER),

    //         })
    //     }


    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
    //         let total = 0;
    //         let sumInsured = 0;

    //         this.quote?.locationBasedCovers?.floaterCoverAddOnCovers.map((cover: IFloaterCoverAddOn) => {
    //             // total = total + Number(cover?.total ?? 0)
    //             if (Number(cover?.total ?? 0) > total) total = Number(cover?.total ?? 0);

    //             if (Number(cover?.sumInsured ?? 0) > sumInsured) sumInsured = Number(cover?.sumInsured ?? 0);
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Floater Cover Addon",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.FLOATER_COVER_ADD_ON)[0],
    //             formDialogFunction: () => this.openFloaterCoverAddonDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.FLOATER_COVER_ADD_ON),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Declaration Policy",
    //         premium: this.quote?.locationBasedCovers?.declarationPolicyCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.declarationPolicyCover?.sumInsured,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         formDialogFunction: () => this.openDeclarationPolicyDialog(),
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.DECLARATION_POLICY)[0],
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.DECLARATION_POLICY)

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Loss of Rent",
    //         premium: this.quote?.locationBasedCovers?.loseOfRentCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.loseOfRentCover?.sumInsured,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         modelname: AllowedProductBscCover.LOSE_OF_RENT,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.LOSE_OF_RENT)[0],
    //         formDialogFunction: () => this.openLossofRentDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.LOSE_OF_RENT),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Rent for Alternative Accomodation",
    //         premium: this.quote?.locationBasedCovers?.rentForAlternativeAccomodationCover?.total,
    //         sumInsured: this.quote?.locationBasedCovers?.rentForAlternativeAccomodationCover?.sumInsured,
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         modelname: AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)[0],
    //         formDialogFunction: () => this.openRentForAlternativeAccomodationDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION),

    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {

    //         let total = 0;
    //         let sumInsured = 0;

    //         this.quote?.locationBasedCovers?.valuableContentsOnAgreedValueBasisCovers?.map((cover: IValuableContentsOnAgreedValue) => {
    //             total = total + Number(cover?.total ?? 0)
    //             sumInsured = sumInsured + Number(cover?.sumInsured ?? 0)
    //         })

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Valuable Contents on Agreed Value Basis",
    //             premium: total,
    //             sumInsured: sumInsured,
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             modelname: AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)[0],
    //             formDialogFunction: () => this.openValuebleContentonAgreedDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS),

    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) {
    //         console.log(this.quote?.locationBasedCovers?.accidentalDamageCover)
    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Accidental Damage",
    //             premium: this.quote?.locationBasedCovers?.accidentalDamageCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.accidentalDamageCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.accidentalDamageCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.ACCIDENTAL_DAMAGE,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.ACCIDENTAL_DAMAGE)[0],
    //             formDialogFunction: () => this.openAccidentalDamageDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Claim Preparation Cost",
    //             premium: this.quote?.locationBasedCovers?.claimPreparationCostCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.claimPreparationCostCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.claimPreparationCostCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.CLAIM_PREPARATION_COST,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.CLAIM_PREPARATION_COST)[0],
    //             formDialogFunction: () => this.openClaimPreparationCostDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Cover of Valuable Contents",
    //             premium: this.quote?.locationBasedCovers?.coverOfValuableContentsCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.coverOfValuableContentsCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.coverOfValuableContentsCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)[0],
    //             formDialogFunction: () => this.openCoverOfValuableContentsDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.KEYS_AND_LOCKS)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Keys and Locks",
    //             premium: this.quote?.locationBasedCovers?.keysAndLocksCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.keysAndLocksCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.keysAndLocksCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.KEYS_AND_LOCKS,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.KEYS_AND_LOCKS)[0],
    //             formDialogFunction: () => this.openKeysAndLocksDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Landscaping including Lawns, Plant, Shrubs or Trees",
    //             premium: this.quote?.locationBasedCovers?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.landscapingIncludingLawnsPlantShrubsOrTreesCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)[0],
    //             formDialogFunction: () => this.openLandscapingDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "EMI Protection Cover",
    //             premium: this.quote?.locationBasedCovers?.emiProtectionCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.emiProtectionCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.emiProtectionCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.EMI_PROTECTION_COVER,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.EMI_PROTECTION_COVER)[0],
    //             formDialogFunction: () => this.openEmiProtectionDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Insurance of Additional Expense",
    //             premium: this.quote?.locationBasedCovers?.insuranceOfAdditionalExpenseCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.insuranceOfAdditionalExpenseCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.insuranceOfAdditionalExpenseCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)[0],
    //             formDialogFunction: () => this.openInsuranceOfAdditionalExpenseDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) {

    //         this.covers.push({
    //             productName: this.quote.productId['type'],
    //             label: "Involuntary Betterment",
    //             premium: this.quote?.locationBasedCovers?.involuntaryBettermentCover?.total,
    //             sumInsured: Number(this.quote?.locationBasedCovers?.involuntaryBettermentCover?.sumInsured ?? 0),
    //             permissions: ['create', 'read', 'update', 'delete'],
    //             isNonOtc: this.quote?.locationBasedCovers.involuntaryBettermentCover?.isNonOtc,
    //             modelname: AllowedProductBscCover.INVOLUNTARY_BETTERMENT,
    //             description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.INVOLUNTARY_BETTERMENT)[0],
    //             formDialogFunction: () => this.openInvoluntaryBettermentDialog(),
    //             // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //         })
    //     }

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Protection and Preservation of Property",
    //         premium: this.quote?.locationBasedCovers?.protectionAndPreservationOfPropertyCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.protectionAndPreservationOfPropertyCover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.removalOfDebrisCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)[0],
    //         formDialogFunction: () => this.openProtectionAndPreservationOfPropertyDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.REMOVAL_OF_DEBRIS)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Removal Of Debris (in excess of 2% of the claim)",
    //         premium: this.quote?.locationBasedCovers?.removalOfDebrisCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.removalOfDebrisCover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.removalOfDebrisCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.REMOVAL_OF_DEBRIS,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.REMOVAL_OF_DEBRIS)[0],
    //         formDialogFunction: () => this.openRemovalOfDebrisFormDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Tenants Legal Liability",
    //         premium: this.quote?.locationBasedCovers?.tenatLegalLiabilityCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.tenatLegalLiabilityCover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.tenatLegalLiabilityCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.TENANTS_LEGAL_LIABILITY,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)[0],
    //         formDialogFunction: () => this.openTenantsLegalLiabilityFormDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.THIRD_PARTY_LIABILITY)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Third Party Liability",
    //         premium: this.quote?.locationBasedCovers?.thirdPartyLiabilityCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.thirdPartyLiabilityCover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.thirdPartyLiabilityCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.THIRD_PARTY_LIABILITY,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.THIRD_PARTY_LIABILITY)[0],
    //         formDialogFunction: () => this.openThirdPartyLiabilityDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Additional Custom Duty",
    //         premium: this.quote?.locationBasedCovers?.additionalCustomDuty?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.additionalCustomDuty?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.additionalCustomDuty?.isNonOtc,
    //         modelname: AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)[0],
    //         formDialogFunction: () => this.openAdditionalCustomDutyDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Deterioration of Stocks in B",
    //         premium: this.quote?.locationBasedCovers?.deteriorationofStocksinBCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.deteriorationofStocksinBCover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.deteriorationofStocksinBCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)[0],
    //         formDialogFunction: () => this.openDeteriorationofStocksinBDeteriorationofStocksinBDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Deterioration of Stocks in A",
    //         premium: this.quote?.locationBasedCovers?.deteriorationofStocksinACover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.deteriorationofStocksinACover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.deteriorationofStocksinACover?.isNonOtc,
    //         modelname: AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)[0],
    //         formDialogFunction: () => this.openDeteriorationofStocksinBDeteriorationofStocksinADialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    //     if (this.quote?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) this.covers.push({
    //         productName: this.quote.productId['type'],
    //         label: "Escalation",
    //         premium: this.quote?.locationBasedCovers?.escalationCover?.total,
    //         sumInsured: Number(this.quote?.locationBasedCovers?.escalationCover?.sumInsured ?? 0),
    //         permissions: ['create', 'read', 'update', 'delete'],
    //         isNonOtc: this.quote?.locationBasedCovers.escalationCover?.isNonOtc,
    //         modelname: AllowedProductBscCover.ESCALATION,
    //         description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.ESCALATION)[0],
    //         formDialogFunction: () => this.openEscalationDialog(),
    //         // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
    //     })

    // }

    // New_Quote_option
    setCovers() {

        this.covers = [];
        let existingCovers = this.quoteOptionData?.selectedAllowedProductBscCover

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Fire Loss of Profit",
            premium: this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover?.grossProfit ?? 0) + Number(this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover?.auditorsFees ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.bscFireLossOfProfitCover?.isNonOtc,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)[0],
            modelname: AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER,
            formDialogFunction: () => this.openFireLossOfProfitFormDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: this.quote.productId['isOccupancySubTypeShow'] ? "* Burglary & Housebreaking (including Theft & RSMD)" : "Burglary & Housebreaking (including Theft & RSMD)",
            premium: this.quoteOptionData?.locationBasedCovers?.bscBurglaryHousebreakingCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.bscBurglaryHousebreakingCover?.isFirstLossOpted ? this.quoteOptionData?.locationBasedCovers?.bscBurglaryHousebreakingCover?.firstLossSumInsured : this.quoteOptionData?.locationBasedCovers?.bscBurglaryHousebreakingCover?.otherContents,
            permissions: ['create', 'read', 'update', 'delete'],
            modelname: AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)[0],
            // isNonOtc : this.quote?.locationBasedCovers.bscBurglaryHousebreakingCover?.isNonOtc,
            formDialogFunction: () => this.openBuglaryAndHouseBreakingFormDialog(),
            viewDialogFunction: () => this.openBuglaryAndHouseBreakingViewQuoteBreakupDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {

            let total = 0
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData?.locationBasedCovers?.bscPortableEquipmentsCovers.map((cover: IBscPortableEquipments) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Electrical and Mechanical Appliances",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)[0],
                formDialogFunction: () => this.openPortableEquipmentsFormDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER),

            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quoteOptionData?.locationBasedCovers?.bscElectronicEquipmentsCover) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Electronic Equipment",
            premium: this.quoteOptionData?.locationBasedCovers?.bscElectronicEquipmentsCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.bscElectronicEquipmentsCover?.sumInsured,
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.bscElectronicEquipmentsCover?.isNonOtc,
            modelname: AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER)[0],
            modelId: this.quoteOptionData?.locationBasedCovers.bscElectronicEquipmentsCover?._id,
            formDialogFunction: () => this.openElectronicEquipmentsFormDialog(),
            viewDialogFunction: () => this.openElectronicEquipmentsViewQuoteBreakupDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Money In Transit",
            premium: this.quoteOptionData?.locationBasedCovers?.bscMoneyTransitCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.bscMoneyTransitCover?.singleCarryingLimit,
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.bscMoneyTransitCover?.isNonOtc,
            modelname: AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)[0],
            formDialogFunction: () => this.openMoneyInTransitFormDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quoteOptionData?.locationBasedCovers?.bscMoneySafeTillCover) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Money In Safe / Till",
            premium: this.quoteOptionData?.locationBasedCovers?.bscMoneySafeTillCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.bscMoneySafeTillCover?.moneySafe ?? 0) + Number(this.quoteOptionData?.locationBasedCovers?.bscMoneySafeTillCover?.moneyTillCounter ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.bscMoneySafeTillCover?.isNonOtc,
            modelname: AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER)[0],
            modelId: this.quoteOptionData?.locationBasedCovers.bscMoneySafeTillCover?._id,
            formDialogFunction: () => this.openMoneyInSafeTillFormDialog(),
            viewDialogFunction: () => this.openMoneyInSafeViewQuoteBreakupDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
            let total = 0;
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData.locationBasedCovers?.bscFidelityGuaranteeCovers.map((cover: IBSCFidelityGurantee) => {
                total = total + Number(cover?.total ?? 0)
                sumInsured = sumInsured + cover.sumInsured;
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Fidelity Guarantee",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)[0],
                formDialogFunction: () => this.openFidelityGuranteeFormDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER),

            })
        }


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quoteOptionData?.locationBasedCovers?.bscFixedPlateGlassCover) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Fixed Plate Glass",
            premium: this.quoteOptionData?.locationBasedCovers?.bscFixedPlateGlassCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.bscFixedPlateGlassCover?.sumInsured,
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.bscFixedPlateGlassCover?.isNonOtc,
            modelname: AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER)[0],
            modelId: this.quoteOptionData?.locationBasedCovers.bscFixedPlateGlassCover?._id,
            formDialogFunction: () => this.openFixedPlateGlassFormDialog(),
            viewDialogFunction: () => this.openFixedPlateGlassViewQuoteBreakupDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
            let total = 0;
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData.locationBasedCovers?.bscSignageCovers.map((cover: IBscSignage) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured;
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Signage",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_SIGNAGE_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_SIGNAGE_COVER)[0],
                formDialogFunction: () => this.openSignageFormDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_SIGNAGE_COVER),

            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
            let total = 0
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData?.locationBasedCovers?.personalAccidentCoverCover.map((cover: any) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Personal Accident Cover",
                premium: total,
                sumInsured: sumInsured,
                isNonOtc: isNonOtc,
                permissions: ['create', 'read', 'update', 'delete'],
                modelname: AllowedProductBscCover.PERSONAL_ACCIDENT_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)[0],
                formDialogFunction: () => this.openPersonalAccidentCoverDialog(),
            })
        }


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) {
            let total = 0;
            let sumInsured = 0;
            let isNonOtc = false
            this.quoteOptionData?.locationBasedCovers?.bscWorkmenCompensationCovers.map((cover: IBscWorkmenCompensation) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Workmen Compensation",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)[0],
                formDialogFunction: () => this.openWorkmenCompensationDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER),

            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
            let total = 0;
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData?.locationBasedCovers?.bscLiabilitySectionCovers.map((cover: IBscLiability) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Liability Section",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)[0],
                formDialogFunction: () => this.openLiabilitySectionFormDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER),

            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) {

            let total = 0
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData?.locationBasedCovers?.bscPedalCycleCovers.map((cover: IBscPedalCycle) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Pedal Cycle",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)[0],
                formDialogFunction: () => this.openPedalCycleDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER),

            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {

            let total = 0;
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData.locationBasedCovers?.bscAccompaniedBaggageCovers.map((cover: IBscAccompaniedBaggage) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Accompanied Baggage",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)[0],
                formDialogFunction: () => this.openAccompaniedBaggageFormDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER),

            })
        }


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) {

            let total = 0
            let sumInsured = 0;
            let isNonOtc = false

            this.quoteOptionData?.locationBasedCovers?.bscAllRiskCovers.map((cover: IBscAllRisks) => {
                total = total + Number(cover?.total ?? 0);
                sumInsured = sumInsured + cover.sumInsured
                if (!isNonOtc && cover.isNonOtc) {
                    isNonOtc = cover.isNonOtc
                }
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "All Risk",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: isNonOtc,
                modelname: AllowedProductBscCover.BSC_ALL_RISK_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.BSC_ALL_RISK_COVER)[0],
                formDialogFunction: () => this.openAllRiskDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER),

            })
        }


        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
            let total = 0;
            let sumInsured = 0;

            this.quoteOptionData?.locationBasedCovers?.floaterCoverAddOnCovers.map((cover: IFloaterCoverAddOn) => {
                // total = total + Number(cover?.total ?? 0)
                if (Number(cover?.total ?? 0) > total) total = Number(cover?.total ?? 0);

                if (Number(cover?.sumInsured ?? 0) > sumInsured) sumInsured = Number(cover?.sumInsured ?? 0);
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Floater Cover Addon",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.FLOATER_COVER_ADD_ON)[0],
                formDialogFunction: () => this.openFloaterCoverAddonDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.FLOATER_COVER_ADD_ON),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Declaration Policy",
            premium: this.quoteOptionData?.locationBasedCovers?.declarationPolicyCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.declarationPolicyCover?.sumInsured,
            permissions: ['create', 'read', 'update', 'delete'],
            formDialogFunction: () => this.openDeclarationPolicyDialog(),
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.DECLARATION_POLICY)[0],
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.DECLARATION_POLICY)

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Loss of Rent",
            premium: this.quoteOptionData?.locationBasedCovers?.loseOfRentCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.loseOfRentCover?.sumInsured,
            permissions: ['create', 'read', 'update', 'delete'],
            modelname: AllowedProductBscCover.LOSE_OF_RENT,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.LOSE_OF_RENT)[0],
            formDialogFunction: () => this.openLossofRentDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.LOSE_OF_RENT),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Rent for Alternative Accomodation",
            premium: this.quoteOptionData?.locationBasedCovers?.rentForAlternativeAccomodationCover?.total,
            sumInsured: this.quoteOptionData?.locationBasedCovers?.rentForAlternativeAccomodationCover?.sumInsured,
            permissions: ['create', 'read', 'update', 'delete'],
            modelname: AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)[0],
            formDialogFunction: () => this.openRentForAlternativeAccomodationDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION),

        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {

            let total = 0;
            let sumInsured = 0;

            this.quoteOptionData?.locationBasedCovers?.valuableContentsOnAgreedValueBasisCovers?.map((cover: IValuableContentsOnAgreedValue) => {
                total = total + Number(cover?.total ?? 0)
                sumInsured = sumInsured + Number(cover?.sumInsured ?? 0)
            })

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Valuable Contents on Agreed Value Basis",
                premium: total,
                sumInsured: sumInsured,
                permissions: ['create', 'read', 'update', 'delete'],
                modelname: AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)[0],
                formDialogFunction: () => this.openValuebleContentonAgreedDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS),

            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) {
            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Accidental Damage",
                premium: this.quoteOptionData?.locationBasedCovers?.accidentalDamageCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.accidentalDamageCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.accidentalDamageCover?.isNonOtc,
                modelname: AllowedProductBscCover.ACCIDENTAL_DAMAGE,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.ACCIDENTAL_DAMAGE)[0],
                formDialogFunction: () => this.openAccidentalDamageDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Claim Preparation Cost",
                premium: this.quoteOptionData?.locationBasedCovers?.claimPreparationCostCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.claimPreparationCostCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.claimPreparationCostCover?.isNonOtc,
                modelname: AllowedProductBscCover.CLAIM_PREPARATION_COST,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.CLAIM_PREPARATION_COST)[0],
                formDialogFunction: () => this.openClaimPreparationCostDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Cover of Valuable Contents",
                premium: this.quoteOptionData?.locationBasedCovers?.coverOfValuableContentsCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.coverOfValuableContentsCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.coverOfValuableContentsCover?.isNonOtc,
                modelname: AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)[0],
                formDialogFunction: () => this.openCoverOfValuableContentsDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.KEYS_AND_LOCKS)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Keys and Locks",
                premium: this.quoteOptionData?.locationBasedCovers?.keysAndLocksCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.keysAndLocksCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.keysAndLocksCover?.isNonOtc,
                modelname: AllowedProductBscCover.KEYS_AND_LOCKS,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.KEYS_AND_LOCKS)[0],
                formDialogFunction: () => this.openKeysAndLocksDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Landscaping including Lawns, Plant, Shrubs or Trees",
                premium: this.quoteOptionData?.locationBasedCovers?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.landscapingIncludingLawnsPlantShrubsOrTreesCover?.isNonOtc,
                modelname: AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)[0],
                formDialogFunction: () => this.openLandscapingDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "EMI Protection Cover",
                premium: this.quoteOptionData?.locationBasedCovers?.emiProtectionCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.emiProtectionCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.emiProtectionCover?.isNonOtc,
                modelname: AllowedProductBscCover.EMI_PROTECTION_COVER,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.EMI_PROTECTION_COVER)[0],
                formDialogFunction: () => this.openEmiProtectionDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Insurance of Additional Expense",
                premium: this.quoteOptionData?.locationBasedCovers?.insuranceOfAdditionalExpenseCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.insuranceOfAdditionalExpenseCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.insuranceOfAdditionalExpenseCover?.isNonOtc,
                modelname: AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)[0],
                formDialogFunction: () => this.openInsuranceOfAdditionalExpenseDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) {

            this.covers.push({
                productName: this.quote.productId['type'],
                label: "Involuntary Betterment",
                premium: this.quoteOptionData?.locationBasedCovers?.involuntaryBettermentCover?.total,
                sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.involuntaryBettermentCover?.sumInsured ?? 0),
                permissions: ['create', 'read', 'update', 'delete'],
                isNonOtc: this.quoteOptionData?.locationBasedCovers.involuntaryBettermentCover?.isNonOtc,
                modelname: AllowedProductBscCover.INVOLUNTARY_BETTERMENT,
                description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.INVOLUNTARY_BETTERMENT)[0],
                formDialogFunction: () => this.openInvoluntaryBettermentDialog(),
                // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
            })
        }

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Protection and Preservation of Property",
            premium: this.quoteOptionData?.locationBasedCovers?.protectionAndPreservationOfPropertyCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.protectionAndPreservationOfPropertyCover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.removalOfDebrisCover?.isNonOtc,
            modelname: AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)[0],
            formDialogFunction: () => this.openProtectionAndPreservationOfPropertyDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.REMOVAL_OF_DEBRIS)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Removal Of Debris (in excess of 2% of the claim)",
            premium: this.quoteOptionData?.locationBasedCovers?.removalOfDebrisCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.removalOfDebrisCover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.removalOfDebrisCover?.isNonOtc,
            modelname: AllowedProductBscCover.REMOVAL_OF_DEBRIS,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.REMOVAL_OF_DEBRIS)[0],
            formDialogFunction: () => this.openRemovalOfDebrisFormDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Tenants Legal Liability",
            premium: this.quoteOptionData?.locationBasedCovers?.tenatLegalLiabilityCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.tenatLegalLiabilityCover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.tenatLegalLiabilityCover?.isNonOtc,
            modelname: AllowedProductBscCover.TENANTS_LEGAL_LIABILITY,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)[0],
            formDialogFunction: () => this.openTenantsLegalLiabilityFormDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.THIRD_PARTY_LIABILITY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Third Party Liability",
            premium: this.quoteOptionData?.locationBasedCovers?.thirdPartyLiabilityCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.thirdPartyLiabilityCover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.thirdPartyLiabilityCover?.isNonOtc,
            modelname: AllowedProductBscCover.THIRD_PARTY_LIABILITY,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.THIRD_PARTY_LIABILITY)[0],
            formDialogFunction: () => this.openThirdPartyLiabilityDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Additional Custom Duty",
            premium: this.quoteOptionData?.locationBasedCovers?.additionalCustomDuty?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.additionalCustomDuty?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.additionalCustomDuty?.isNonOtc,
            modelname: AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)[0],
            formDialogFunction: () => this.openAdditionalCustomDutyDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Deterioration of Stocks in B",
            premium: this.quoteOptionData?.locationBasedCovers?.deteriorationofStocksinBCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.deteriorationofStocksinBCover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.deteriorationofStocksinBCover?.isNonOtc,
            modelname: AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)[0],
            formDialogFunction: () => this.openDeteriorationofStocksinBDeteriorationofStocksinBDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Deterioration of Stocks in A",
            premium: this.quoteOptionData?.locationBasedCovers?.deteriorationofStocksinACover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.deteriorationofStocksinACover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.deteriorationofStocksinACover?.isNonOtc,
            modelname: AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)[0],
            formDialogFunction: () => this.openDeteriorationofStocksinBDeteriorationofStocksinADialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

        if (this.quoteOptionData?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) this.covers.push({
            productName: this.quote.productId['type'],
            label: "Escalation",
            premium: this.quoteOptionData?.locationBasedCovers?.escalationCover?.total,
            sumInsured: Number(this.quoteOptionData?.locationBasedCovers?.escalationCover?.sumInsured ?? 0),
            permissions: ['create', 'read', 'update', 'delete'],
            isNonOtc: this.quoteOptionData?.locationBasedCovers.escalationCover?.isNonOtc,
            modelname: AllowedProductBscCover.ESCALATION,
            description: this.bscCoverDescription.filter(item => item?.bscType == AllowedProductBscCover.ESCALATION)[0],
            formDialogFunction: () => this.openEscalationDialog(),
            // deleteDialogFunction: () => this.openDeleteCoverDialog(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER),
        })

    }

    ngOnDestroy(): void {
        // this.currentQuoteLocationOccupancyId.unsubscribe();
        // this.currentQuote.unsubscribe();
    }

    // openDeleteCoverDialog(allowedProductBscCover) {

    //     let currentCovers = allowedProductBscCover
    //     let existingCovers = this.quote.selectedAllowedProductBscCover

    //     let removedCovers = existingCovers.filter(x => x == currentCovers)

    //     // console.log(addedCovers);
    //     console.log(removedCovers);

    //     if (removedCovers.length > 0) {
    //         const ref = this.dialogService.open(RemoveAllowedProductBscCoverDialogComponent, {
    //             header: "Are you sure you want to remove the cover",
    //             data: {
    //                 quoteId: this.quote._id,
    //                 removedCovers: removedCovers.map((cover) => cover.replace(/(?:_| |\b)(\w)/g, function (key, p1) { return ` ${p1.toUpperCase()}` })),

    //                 // clientLocationId: this.clientLocation?._id,
    //                 // bscFireLossOfProfitCover: this.bscFireLossOfProfitCover
    //             },
    //             width: '45%',
    //             styleClass: "flatPopup"
    //         })

    //         ref.onClose.subscribe({
    //             next: (response: boolean = false) => {
    //                 if (response) {

    //                     this.quoteService.deleteProductBscCoversIC(this.quote._id, {
    //                         removed_covers: removedCovers,
    //                         selectedAllowedProductBscCover: existingCovers.filter(x => x != currentCovers),
    //                     }).subscribe({
    //                         next: (dto) => {
    //                             const quote = this.quote
    //                             // this.quoteService.setQuoteLocationOccupancyId(quote.locationBasedCovers.quoteLocationOccupancy._id)
    //                             this.quoteService.refresh((quote) => {

    //                             })

    //                         }
    //                     })
    //                 } else {

    //                     alert('Covers not changed')
    //                 }
    //             }
    //         })
    //     } else {
    //         this.quoteService.deleteProductBscCoversIC(this.quote._id, {
    //             removed_covers: removedCovers,
    //             selectedAllowedProductBscCover: existingCovers,
    //         }).subscribe({
    //             next: (dto) => {
    //                 const quote = this.quote
    //                 this.quoteService.refresh()


    //             }
    //         })
    //     }

    // }

    openFloaterCoverAddonDialog() {
        const ref = this.dialogService.open(FloaterCoverAddonDialogComponent, {
            header: "Floater Cover Addon",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                covers: this.quote.locationBasedCovers?.floaterCoverAddOnCovers

            },
            width: '45%',
            // width: '500px',
            // height: "250px",
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IFloaterCoverAddOn) => {

            if (cover?._id) {
                this.quoteService.refresh(() => {
                    this.totalQuoteSIExeeded(this.quote)
                })
            }
        });
    }

    openDeclarationPolicyDialog() {
        const ref = this.dialogService.open(DeclarationPolicyDialogComponent, {
            header: "Declaration Policy",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                cover: this.quote.locationBasedCovers?.declarationPolicyCover
            },
            width: '500px',
            // height: "250px",
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IDeclarationPolicy) => {


            if (cover?._id) {
                this.quoteService.refresh(() => {
                    this.totalQuoteSIExeeded(this.quote)
                })
            }
        });
    }

    openLossofRentDialog() {
        const ref = this.dialogService.open(LossOfRentDialogComponent, {
            header: "Loss of Rent",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                // cover: this.quote.locationBasedCovers?.loseOfRentCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                cover: this.quoteOptionData.locationBasedCovers?.loseOfRentCover
            },
            width: '500px',
            // height: "250px",
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: ILossOfRent) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openRentForAlternativeAccomodationDialog() {
        const ref = this.dialogService.open(RentForAlternativeAccomodationDialogComponent, {
            header: "Rent for Alternative Accomodation",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                // cover: this.quote.locationBasedCovers?.rentForAlternativeAccomodationCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                cover: this.quoteOptionData.locationBasedCovers?.rentForAlternativeAccomodationCover
            },
            width: '700px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IRentForAlternativeAccomodation) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openPersonalAccidentCoverDialog() {
        const ref = this.dialogService.open(PersonalAccidentCoverDialogComponent, {
            header: "Personal Accident Covers",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // cover: this.quote.locationBasedCovers?.personalAccidentCoverCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                cover: this.quoteOptionData.locationBasedCovers?.personalAccidentCoverCover
            },
            width: this.isMobile ? '98vw' : '500px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IPersonalAccidentCover) => {
            // Old_Quote
            // if (cover) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }

        });
    }

    openValuebleContentonAgreedDialog() {
        const ref = this.dialogService.open(ValuebleContentAgreedValueBasisDialogComponent, {
            header: "Valuable Content Agreed Value",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                // covers: this.quote.locationBasedCovers?.valuableContentsOnAgreedValueBasisCovers
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                covers: this.quoteOptionData.locationBasedCovers?.valuableContentsOnAgreedValueBasisCovers
            },
            // width: '700px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IValuableContentsOnAgreedValue[]) => {
            // Old_Quote
            // this.quoteService.refresh(() => {
            //     this.totalQuoteSIExeeded(this.quote)
            // })

            // New_Quote_option
            this.quoteOptionService.refreshQuoteOption(() => {
                this.totalQuoteOptionSIExeeded(this.quoteOptionData)
            })

        });
    }

    openFireLossOfProfitFormDialog() {
        const ref = this.dialogService.open(BscFireLossOfProfitFormDialogComponent, {
            header: "Fire Loss of Profit",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id,
                // bscFireLossOfProfitCover: this.quote.locationBasedCovers?.bscFireLossOfProfitCover

                // New_Quote_option
                quoteOption: this.quoteOptionData,
                quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id,
                bscFireLossOfProfitCover: this.quoteOptionData.locationBasedCovers?.bscFireLossOfProfitCover
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: "customPopup"
        })

        ref.onClose.subscribe((cover: IBscFireLossOfProfitCover) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openBuglaryAndHouseBreakingViewQuoteBreakupDialog() {
        const ref = this.dialogService.open(BscBuglaryAndHousebreakingViewQuoteBreakupDialogComponent, {
            header: "BSC Burglary House Breakup for all locations",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // New_Quote_option
                quoteOption: this.quoteOptionData,
            },
            width: this.isMobile ? '98vw' : '70%',
            styleClass: "customPopup"
        })
    }

    openBuglaryAndHouseBreakingFormDialog() {

        const ref = this.dialogService.open(BscBurglaryAndHousebreakingFormDialogComponent, {
            header: "Burglary & Housebreaking (including Theft & RSMD)",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quoteId: this.quote._id,
                quote: this.quote,
                // quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id,
                // bscBurglaryHousebreakingCover: this.quote.locationBasedCovers?.bscBurglaryHousebreakingCover,

                // New_Quote_option
                quoteOption: this.quoteOptionData,
                quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id,
                bscBurglaryHousebreakingCover: this.quoteOptionData.locationBasedCovers?.bscBurglaryHousebreakingCover,
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: "customPopup"
        })

        ref.onClose.subscribe((cover: IBscBurglaryHousebreakingCover) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    totalQuoteSIExeeded(quote: IQuoteSlip) {
        if (quote.totalQuoteSIExceeded) {
            this.messageService.add({
                key: "error",
                detail: "Total Sum Insured Exceeded",
                severity: "error",
                summary: "Validation Errors"
            })
        }
    }

    totalQuoteOptionSIExeeded(quoteOption: IQuoteOption) {
        if (quoteOption.totalQuoteSIExceeded) {
            this.messageService.add({
                key: "error",
                detail: "Total Sum Insured Exceeded",
                severity: "error",
                summary: "Validation Errors"
            })
        }
    }

    openMoneyInSafeTillFormDialog() {
        const ref = this.dialogService.open(BscMoneyInSafeTillFormDialogComponent, {
            header: "Money In Safe / Till",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // occupancy: this.occupancy,
                // quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id,
                // clientLocationId: this.clientLocation?._id,
                // bscMoneySafeTillCover: this.quote.locationBasedCovers?.bscMoneySafeTillCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id,
                bscMoneySafeTillCover: this.quoteOptionData.locationBasedCovers?.bscMoneySafeTillCover,

            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IBscMoneySafeTillCover) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openMoneyInSafeViewQuoteBreakupDialog() {
        const ref = this.dialogService.open(BscMoneyInSafeTillViewQuoteBreakupDialogComponent, {
            header: "BSC Money in Safe Breakup for all locations",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // New_Quote_option
                quoteOption: this.quoteOptionData,
            },
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup'
        })

    }

    openMoneyInTransitFormDialog() {
        const ref = this.dialogService.open(BscMoneyInTransitFormDialogComponent, {
            header: "Money In Transit",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscMoneyTransitCover: this.quote.locationBasedCovers?.bscMoneyTransitCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscMoneyTransitCover: this.quoteOptionData.locationBasedCovers?.bscMoneyTransitCover

            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IBscMoneyTransitCover) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openElectronicEquipmentsFormDialog() {
        const ref = this.dialogService.open(BscElectronicEquipmentsFormDialogComponent, {
            header: "Electronic Equipment",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id,
                // clientLocationId: this.clientLocation?._id,
                // bscElectronicEquipmentsCover: this.quote.locationBasedCovers?.bscElectronicEquipmentsCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id,
                bscElectronicEquipmentsCover: this.quoteOptionData.locationBasedCovers?.bscElectronicEquipmentsCover

            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((cover: IBscElectronicEquipmentsCover) => {
            // Old_Quote
            // if (cover?._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover?._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openElectronicEquipmentsViewQuoteBreakupDialog() {
        const ref = this.dialogService.open(BscElectronicEquipmentsViewQuoteBreakupDialogComponent, {
            header: "BSC Electronic Equipments Breakup for all locations",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // New_Quote_option
                quoteOption: this.quoteOptionData,
            },
            width: this.isMobile ? '98vw' : '50%',
            styleClass: 'customPopup'
        })
    }

    openPortableEquipmentsFormDialog() {
        const ref = this.dialogService.open(BscPortableEquipmentsFormDialogComponent, {
            header: "Electrical and Mechanical Appliances",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscPortableEquipmentsCover: this.quote.locationBasedCovers?.bscPortableEquipmentsCovers,
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscPortableEquipmentsCover: this.quoteOptionData.locationBasedCovers?.bscPortableEquipmentsCovers,

            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBscPortableEquipments[]) => {
            // Old_Quote
            // if (covers) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (covers) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openPedalCycleDialog() {
        const ref = this.dialogService.open(BscPedalCycleFormDialogComponent, {
            header: "Pedal Cycle",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                bscPedalCycleCover: this.quote.locationBasedCovers?.bscPedalCycleCovers
            },
            width: '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBscPedalCycle[]) => {
            if (covers) {
                this.quoteService.refresh(() => {
                    this.totalQuoteSIExeeded(this.quote)
                })
            }
        });
    }

    openAllRiskDialog() {
        const ref = this.dialogService.open(BscAllRiskFormDialogComponent, {
            header: "All Risk",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                bscAllRiskCover: this.quote.locationBasedCovers?.bscAllRiskCovers
            },
            width: '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBscAllRisks[]) => {
            if (covers) {
                this.quoteService.refresh(() => {
                    this.totalQuoteSIExeeded(this.quote)
                })
            }
        });
    }

    openFixedPlateGlassFormDialog() {
        const ref = this.dialogService.open(BscFixedPlateGlassFormDialogComponent, {
            header: "Fixed Plate Glass",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // quoteLocationOccupancyId: this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id,
                // clientLocationId: this.clientLocation?._id,
                // bscFixedPlateGlassCover: this.quote.locationBasedCovers?.bscFixedPlateGlassCover
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                quoteLocationOccupancyId: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id,
                bscFixedPlateGlassCover: this.quoteOptionData.locationBasedCovers?.bscFixedPlateGlassCover

            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((cover: IBscFixedPlateGlassCover) => {
            // Old_Quote
            // if (cover._id) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (cover._id) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        })
    }

    openFixedPlateGlassViewQuoteBreakupDialog() {
        const ref = this.dialogService.open(BscFixedPlateGlassViewQuoteBreakupDialogComponent, {
            header: "BSC Fixed Plate Glass Breakup for all locations",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // New_Quote_option
                quoteOption: this.quoteOptionData,
            },
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup'
        })
    }

    openAccompaniedBaggageFormDialog() {
        const ref = this.dialogService.open(BscAccompaniedBaggageFormDialogComponent, {
            header: "Accompanied Baggage",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscAccompaniedBaggageCover: this.quote.locationBasedCovers?.bscAccompaniedBaggageCovers
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscAccompaniedBaggageCover: this.quoteOptionData.locationBasedCovers?.bscAccompaniedBaggageCovers
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBscAccompaniedBaggage[]) => {
            // Old_Quote
            // if (covers) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (covers) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openFidelityGuranteeFormDialog() {
        const ref = this.dialogService.open(BscFidelityGuranteeFormDialogComponent, {
            header: "Fidelity Guarantee",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscFidelityGuaranteeCover: this.quote.locationBasedCovers?.bscFidelityGuaranteeCovers
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscFidelityGuaranteeCover: this.quoteOptionData.locationBasedCovers?.bscFidelityGuaranteeCovers

            },
            width: this.isMobile ? '98vw' : '45%',
            style: { 'min-height': '60%' },
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBSCFidelityGurantee[]) => {
            // Old_Quote
            // if (covers) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (covers) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openSignageFormDialog() {
        const ref = this.dialogService.open(BscSignageFormDialogComponent, {
            header: "Signage",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscSignageCover: this.quote.locationBasedCovers?.bscSignageCovers
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscSignageCover: this.quoteOptionData.locationBasedCovers?.bscSignageCovers
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBscSignage[]) => {
            // Old_Quote
            // if (covers) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (covers) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openLiabilitySectionFormDialog() {
        const ref = this.dialogService.open(BscLiabilitySectionFormDialogComponent, {
            header: "Liability Section",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscLiabilitySectionCover: this.quote.locationBasedCovers?.bscLiabilitySectionCovers
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscLiabilitySectionCover: this.quoteOptionData.locationBasedCovers?.bscLiabilitySectionCovers
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe((covers: IBscLiability[]) => {
            // Old_Quote
            // if (covers) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (covers) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openWorkmenCompensationDialog() {
        const ref = this.dialogService.open(BscWorkmenCompensationFormDialogComponent, {
            header: "Workmen Compensation",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                // bscWorkmenCompensationCover: this.quote.locationBasedCovers?.bscWorkmenCompensationCovers
                // New_Quote_option
                quoteOption: this.quoteOptionData,
                bscWorkmenCompensationCover: this.quoteOptionData.locationBasedCovers?.bscWorkmenCompensationCovers
            },
            width: this.isMobile ? '98vw' : '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IBscWorkmenCompensation[]) => {
            // Old_Quote
            // if (covers) {
            //     this.quoteService.refresh(() => {
            //         this.totalQuoteSIExeeded(this.quote)
            //     })
            // }

            // New_Quote_option
            if (covers) {
                this.quoteOptionService.refreshQuoteOption(() => {
                    this.totalQuoteOptionSIExeeded(this.quoteOptionData)
                })
            }
        });
    }

    openEmiProtectionDialog() {
        const ref = this.dialogService.open(EmiProtectionCoverFormDialogComponent, {
            header: "EMI Protection",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                emiProtectionCover: this.quote.locationBasedCovers?.emiProtectionCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IEmiProtectionCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openInsuranceOfAdditionalExpenseDialog() {
        const ref = this.dialogService.open(InsuranceOfAdditionalExpenseFormDialogComponent, {
            header: "Insurance Of Additional Expense",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                insuranceOfAdditionalExpenseCover: this.quote.locationBasedCovers?.insuranceOfAdditionalExpenseCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IInsuranceOfAdditionalExpenseCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openInvoluntaryBettermentDialog() {
        const ref = this.dialogService.open(InvoluntaryBettermentFormDialogComponent, {
            header: "Involuntary Betterment",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                involuntaryBettermentCover: this.quote.locationBasedCovers?.involuntaryBettermentCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IInvoluntaryBettermentCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openAccidentalDamageDialog() {
        const ref = this.dialogService.open(AccidentalDamageFormDialogComponent, {
            header: "Accidental Damage",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                accidentalDamageCover: this.quote.locationBasedCovers?.accidentalDamageCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IAccidentalDamageCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openClaimPreparationCostDialog() {
        const ref = this.dialogService.open(ClaimPreparationCostFormDialogComponent, {
            header: "Claim Preparation Cost",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                claimPreparationCostCover: this.quote.locationBasedCovers?.claimPreparationCostCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IClaimPreparationCostCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openCoverOfValuableContentsDialog() {
        const ref = this.dialogService.open(CoverOfValuableContentsFormDialogComponent, {
            header: "Cover of Valuable Contents",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                coverOfValuableContentsCover: this.quote.locationBasedCovers?.coverOfValuableContentsCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: ICoverOfValuableContentsCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openKeysAndLocksDialog() {
        const ref = this.dialogService.open(KeysAndLocksFormDialogComponent, {
            header: "Keys and Locks",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                keysAndLocksCover: this.quote.locationBasedCovers?.keysAndLocksCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IKeysAndLocksCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openLandscapingDialog() {
        const ref = this.dialogService.open(LandscapingIncludingLawnsPlantShrubsOrTreesFormDialogComponent, {
            header: "Landscaping including Lawns, Plant, Shrubs or Trees",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                landscapingIncludingLawnsPlantShrubsOrTreesCover: this.quote.locationBasedCovers?.landscapingIncludingLawnsPlantShrubsOrTreesCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: ILandscapingIncludingLawnsPlantShrubsOrTreesCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }
    openProtectionAndPreservationOfPropertyDialog() {
        const ref = this.dialogService.open(ProtectionAndPreservationOfPropertyFormDialogComponent, {
            header: "Protection and Preservation of Property",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                removalOfDebrisCover: this.quote.locationBasedCovers?.protectionAndPreservationOfPropertyCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IRemovalOfDebrisCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openRemovalOfDebrisFormDialog() {
        const ref = this.dialogService.open(RemovalOfDebrisFormDialogComponent, {
            header: "Removal Of Debris (in excess of 2% of the claim)",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                removalOfDebrisCover: this.quote.locationBasedCovers?.removalOfDebrisCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IRemovalOfDebrisCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openTenantsLegalLiabilityFormDialog() {
        const ref = this.dialogService.open(TenantsLegalLiabilityFormDialogComponent, {
            header: "Tenants Legal Liability",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                tenatLegalLiabilityCover: this.quote.locationBasedCovers?.tenatLegalLiabilityCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IThirdPartyLiabilityCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openThirdPartyLiabilityDialog() {
        const ref = this.dialogService.open(ThirdPartyLiabilityFormDialogComponent, {
            header: "Third Party Liability",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                thirdPartyLiabilityCover: this.quote.locationBasedCovers?.thirdPartyLiabilityCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IThirdPartyLiabilityCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openAdditionalCustomDutyDialog() {
        const ref = this.dialogService.open(AdditionalCustomDutyFormDialogComponent, {
            header: "Additional Custom Duty",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                additionalCustomDutyCover: this.quote.locationBasedCovers?.additionalCustomDuty
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IAdditionalCustomDutyCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openDeteriorationofStocksinBDeteriorationofStocksinBDialog() {
        const ref = this.dialogService.open(DeteriorationofStocksinBFormDialogComponent, {
            header: "Deterioration of Stocks in B",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                deteriorationofStocksinBCover: this.quote.locationBasedCovers?.deteriorationofStocksinBCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IDeteriorationofStocksinBCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openDeteriorationofStocksinBDeteriorationofStocksinADialog() {
        const ref = this.dialogService.open(DeteriorationofStocksinAFormDialogComponent, {
            header: "Deterioration of Stocks in A",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                deteriorationofStocksinACover: this.quote.locationBasedCovers?.deteriorationofStocksinACover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IDeteriorationofStocksinACover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openEscalationDialog() {
        const ref = this.dialogService.open(EscalationFormDialogComponent, {
            header: "Escalation",
            data: {
                permissions: ['create', 'read', 'update', 'delete'],
                quote: this.quote,
                quoteId: this.quote._id,
                escalationCover: this.quote.locationBasedCovers?.escalationCover
            },
            width: '45%',
            styleClass: 'customPopup'
        })
        ref.onClose.subscribe((covers: IEscalationCover[]) => {
            if (covers) {
                this.quoteService.refresh()
            }
        });
    }

    openSidebar() {
        if (this.isMobile) {
            this.sidebarService.openSideBar(true)
            this.router.navigate([], {
                queryParams: {
                    location: this.activatedRoute.snapshot.queryParams.location
                }

            });
        }
        else {
            this.togglesidebar = !this.togglesidebar
            this.sidebarService.openSideBar(this.togglesidebar)
        }
    }

    deleteCover(e) {
        if (this.quote.quoteState != AllowedQuoteStates.REJECTED) {
            const ref = this.dialogService.open(DeleteBscCoverComponent, {
                header: "Are you sure you want to remove the cover",
                data: {
                    quote: this.quote,
                    quoteId: this.quote._id,
                    coverName: e?.modelName,
                    id: e?.modelId,
                },
                width: '45%',
                styleClass: 'flatPopup'
            })

            ref.onClose.subscribe((data) => {
                this.quoteService.refresh()
            });
        }

        // this.confirmationService.confirm({
        //     message: 'Do you want to delete this record?',
        //     header: 'Delete Confirmation',
        //     icon: 'pi pi-info-circle',
        //     accept: () => {
        //         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'Record deleted'});
        //     },
        //     reject: (type) => {
        //         switch(type) {
        //             case ConfirmEventType.REJECT:
        //                 this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
        //             break;
        //             case ConfirmEventType.CANCEL:
        //                 this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
        //             break;
        //         }
        //     }
        // });
    }
}
