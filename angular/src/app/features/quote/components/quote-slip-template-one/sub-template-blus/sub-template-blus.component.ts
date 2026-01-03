import { LandscapingCoverService } from './../../../blus_bsc_dialogs/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog/landscaping-cover.service';
import { DynamicClausesService } from './../../../../admin/dynamic-clauses/dynamic-clauses.service';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { LazyLoadEvent } from 'primeng/api';
import { IBscAccompaniedBaggage } from 'src/app/features/admin/bsc-accompanied-baggage/bsc-accompanied-baggage.model';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { IBscElectronicEquipmentsCover } from 'src/app/features/admin/bsc-electronic-equipment/bsc-electronic-equipment.model';
import { IBSCFidelityGurantee } from 'src/app/features/admin/bsc-fidelity-gurantee/bsc-fidelity-gurantee.model';
import { IBscFixedPlateGlassCover } from 'src/app/features/admin/bsc-fixed-plate-glass/bsc-fixed-plate-glass.model';
import { IBscLiability } from 'src/app/features/admin/bsc-liability/bsc-liability.model';
import { IBscMoneySafeTillCover } from 'src/app/features/admin/bsc-money-safe-till/bsc-money-safe-till.model';
import { IBscAllRisks, IBscPortableEquipments } from 'src/app/features/admin/bsc-portable-equipments/bsc-portable-equipment.model';
import { IBscPedalCycle, IBscSignage } from 'src/app/features/admin/bsc-signage/bsc-signage.model';
import { IFloaterCoverAddOn } from 'src/app/features/admin/floater-cover-addon/floater-cover-addon.model';
import { AllowedProductBscCover, AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IValuableContentsOnAgreedValue } from 'src/app/features/admin/valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.model';
import { TermsConditionsService } from 'src/app/features/admin/terms-conditions/terms-conditions.service';
import { ExpiredDetailsDialogFormService } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.service';
import { IOneResponseDto } from 'src/app/app.model';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';

export interface CalculatedCovers {
    sectionOrCover: string,
    sumInsured: number,
    netPremium: number,
    gst: number,
    totalPremium: number,
    isRequired?: boolean
}

@Component({
    selector: 'app-sub-template-blus',
    templateUrl: './sub-template-blus.component.html',
    styleUrls: ['./sub-template-blus.component.scss']
})
export class SubTemplateBlusComponent implements OnInit {

    @Input() quote: IQuoteSlip;

    covers: CalculatedCovers[] = [];
    total = [];

    addressData = []

    gstPercentage = 0.18

    warranties: any[];
    exclusions: any[];
    subjectivities: any[];
    allowedQuoteStates = AllowedQuoteStates
    termsAndConditions = []
    totalRiskInspectionDiscount = 0

    // https://alwrite.youtrack.cloud/issues?q=&preview=BLUS-32
    // To  show Discount in quoteslip
    discount: CalculatedCovers;
    discountPercentage = 0;
    isQuoteslipAllowedUser: boolean = false;
    role: any;
    private currentUser: Subscription;

    // New_Quote_option
    @Input() quoteOption: IQuoteOption;
    expireDetails: any;

    constructor(
        private dynamicClausesService: DynamicClausesService,
        private termsConditionsService: TermsConditionsService,
        private accountService: AccountService,
        private expiredDetailsDialogFormService:ExpiredDetailsDialogFormService
    ) {
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
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
    }
    selectedBscClauses: any[]


    ngOnInit(): void {
        this.addressData = []
        // Old_Quote
        // this.loadSumInsuredAndPremiumDetails();
        // this.loadSelectedBscClauses();
        this.loadTermsAndConditions();

        // New_Quote_option
        this.loadSelectedBscClausesQuoteOptionWise()
        this.loadSumInsuredAndPremiumDetailsForQuoteOption()
        this.getExpiredDetails();

        // Old_Quote
        // this.quote.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {

        //     const quoteLocationOccupancyId = quoteLocationOccupancy._id
        //     let addonDetails = []

        //     this.totalRiskInspectionDiscount += quoteLocationOccupancy.totalPremiumWithDiscount ?? 0

        //     if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
        //         let sectionOrCover = "Floater Cover AddOn"
        //         let netPremium = 0;
        //         let sumInsured = 0;

        //         this.quote?.allCoversArray?.floaterCoverAddOnCovers.map((cover: IFloaterCoverAddOn) => {
        //             if (Number(cover?.total ?? 0) > netPremium) netPremium = Number(cover?.total ?? 0);
        //             if (Number(cover?.sumInsured ?? 0) > sumInsured) sumInsured = Number(cover?.sumInsured ?? 0);
        //         })

        //         let gst = netPremium * this.gstPercentage

        //         addonDetails.push({
        //             coverName: sectionOrCover,
        //             premium: netPremium ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //         })
        //     }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) {
        //     //     let sectionOrCover = "Declaration Policy"
        //     //     let netPremium = this.quote?.allCoversArray?.declarationPolicyCover?.total;
        //     //     let gst = this.quote?.allCoversArray?.declarationPolicyCover?.total * this.gstPercentage
        //     //     let sumInsured = this.quote?.allCoversArray?.declarationPolicyCover?.sumInsured


        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) {
        //     //     let sectionOrCover = "Lose Of Rent"
        //     //     let netPremium = this.quote?.allCoversArray?.loseOfRentCover?.total;
        //     //     let gst = this.quote?.allCoversArray?.loseOfRentCover?.total * this.gstPercentage
        //     //     let sumInsured = this.quote?.allCoversArray?.loseOfRentCover?.sumInsured


        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) {
        //     //     let sectionOrCover = "Rent For Alternative Accomodation"
        //     //     let netPremium = this.quote?.allCoversArray?.rentForAlternativeAccomodationCover?.total;
        //     //     let gst = this.quote?.allCoversArray?.rentForAlternativeAccomodationCover?.total * this.gstPercentage
        //     //     let sumInsured = this.quote?.allCoversArray?.rentForAlternativeAccomodationCover?.sumInsured


        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
        //     //     let sectionOrCover = "Personal Accident Cover"
        //     //     let netPremium = this.quote?.allCoversArray?.personalAccidentCoverCover?.total;
        //     //     let gst = this.quote?.allCoversArray?.personalAccidentCoverCover?.total * this.gstPercentage
        //     //     let sumInsured = 0


        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {
        //     //     let sectionOrCover = "Valuable Contents On Agreed Value Basis"
        //     //     let netPremium = 0;
        //     //     let sumInsured = 0;

        //     //     this.quote?.allCoversArray?.valuableContentsOnAgreedValueBasisCovers.map((cover: IValuableContentsOnAgreedValue) => {
        //     //         netPremium = netPremium + Number(cover.total);
        //     //         sumInsured = sumInsured + Number(cover.sumInsured);
        //     //     })

        //     //     let gst = netPremium * this.gstPercentage

        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) {
        //     //     let sectionOrCover = "Bsc Fire Loss Of Profit Cover"
        //     //     let netPremium = this.quote?.allCoversArray?.bscFireLossOfProfitCover?.total;
        //     //     let gst = this.quote?.allCoversArray?.bscFireLossOfProfitCover?.total * this.gstPercentage
        //     //     let sumInsured = this.quote?.allCoversArray?.bscFireLossOfProfitCover?.grossProfit


        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     this.warranties = this.quote.allCoversArray?.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true);
        //     this.exclusions = this.quote.allCoversArray?.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true);
        //     this.subjectivities = this.quote.allCoversArray?.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true);

        //     if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) {
        //         let sectionOrCover = "Bsc Burglary Housebreaking Cover"

        //         let netPremium = 0;
        //         let sumInsured = 0;

        //         this.quote?.allCoversArray?.bscBurglaryHousebreakingCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscBurglaryHousebreakingCover) => {
        //             netPremium = netPremium + Number(cover.total);
        //             sumInsured = sumInsured + Number(cover.firstLossSumInsured);
        //         })

        //         let gst = netPremium * this.gstPercentage



        //         addonDetails.push({
        //             coverName: sectionOrCover,
        //             premium: netPremium ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //         })
        //     }

        //     if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quote?.totalMoneySafeTill > 0) {
        //         let sectionOrCover = "Bsc Money Safe Till Cover"

        //         let netPremium = 0;
        //         let sumInsured = 0;

        //         this.quote?.allCoversArray?.bscMoneySafeTillCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscMoneySafeTillCover) => {
        //             netPremium = netPremium + Number(cover.total);
        //             sumInsured = sumInsured + Number(cover.moneySafe);
        //         })

        //         let gst = netPremium * this.gstPercentage


        //         addonDetails.push({
        //             coverName: sectionOrCover,
        //             premium: netPremium ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //         })
        //     }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) {
        //     //     let sectionOrCover = "Bsc Money Transit Cover"


        //     //     let netPremium = this.quote?.allCoversArray?.bscMoneyTransitCover?.total;
        //     //     let gst = this.quote?.allCoversArray?.bscMoneyTransitCover?.total * this.gstPercentage
        //     //     let sumInsured = this.quote?.allCoversArray?.bscMoneyTransitCover?.annualTurnover

        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quote?.totalelectronicEquipment > 0) {
        //         let sectionOrCover = "Bsc Electronic Equipments Cover"

        //         let netPremium = 0;
        //         let sumInsured = 0;

        //         this.quote?.allCoversArray?.bscElectronicEquipmentsCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscElectronicEquipmentsCover) => {
        //             netPremium = netPremium + Number(cover.total);
        //             sumInsured = sumInsured + Number(cover.sumInsured);
        //         })

        //         let gst = netPremium * this.gstPercentage

        //         addonDetails.push({
        //             coverName: sectionOrCover,
        //             premium: netPremium ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //         })
        //     }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {
        //     //     let sectionOrCover = "Bsc Portable Equipments Cover"

        //     //     let netPremium = 0;
        //     //     let sumInsured = 0;

        //     //     this.quote?.allCoversArray?.bscPortableEquipmentsCovers.map((cover: IBscPortableEquipments) => {
        //     //         netPremium = netPremium + Number(cover.total);
        //     //         sumInsured = sumInsured + Number(cover.sumInsured);
        //     //     })

        //     //     let gst = netPremium * this.gstPercentage

        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quote?.totalFixedPlateGlass > 0) {
        //         let sectionOrCover = "Bsc Fixed Plate Glass Cover"

        //         let netPremium = 0;
        //         let sumInsured = 0;

        //         this.quote?.allCoversArray?.bscFixedPlateGlassCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscFixedPlateGlassCover) => {
        //             netPremium = netPremium + Number(cover.total);
        //             sumInsured = sumInsured + Number(cover.sumInsured);
        //         })

        //         let gst = netPremium * this.gstPercentage


        //         addonDetails.push({
        //             coverName: sectionOrCover,
        //             premium: netPremium ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //         })
        //     }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {
        //     //     let sectionOrCover = "Bsc Accompanied Baggage Cover"

        //     //     let netPremium = 0;
        //     //     let sumInsured = 0;

        //     //     this.quote?.allCoversArray?.bscAccompaniedBaggageCovers.map((cover: IBscAccompaniedBaggage) => {
        //     //         netPremium = netPremium + Number(cover.total);
        //     //         sumInsured = sumInsured + Number(cover.sumInsured);
        //     //     })

        //     //     let gst = netPremium * this.gstPercentage
        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
        //     //     let sectionOrCover = "Bsc Fidelity Guarantee Cover"

        //     //     let netPremium = 0;
        //     //     let sumInsured = 0;

        //     //     this.quote?.allCoversArray?.bscFidelityGuaranteeCovers.map((cover: IBSCFidelityGurantee) => {
        //     //         netPremium = netPremium + Number(cover.total);
        //     //         sumInsured = sumInsured + Number(cover.sumInsured);
        //     //     })

        //     //     let gst = netPremium * this.gstPercentage



        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
        //     //     let sectionOrCover = "Bsc Signage Cover"

        //     //     let netPremium = 0;
        //     //     let sumInsured = 0;

        //     //     this.quote?.allCoversArray?.bscSignageCovers.map((cover: IBscSignage) => {
        //     //         netPremium = netPremium + Number(cover.total);
        //     //         sumInsured = sumInsured + Number(cover.sumInsured);
        //     //     })

        //     //     let gst = netPremium * this.gstPercentage


        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
        //     //     let sectionOrCover = "Bsc Liability Section Cover"

        //     //     let netPremium = 0;
        //     //     let sumInsured = 0;

        //     //     this.quote?.allCoversArray?.bscLiabilitySectionCovers.map((cover: IBscLiability) => {
        //     //         netPremium = netPremium + Number(cover.total);
        //     //         sumInsured = sumInsured + Number(cover.sumInsured);
        //     //     })

        //     //     let gst = netPremium * this.gstPercentage

        //     //     addonDetails.push({
        //     //         coverName: sectionOrCover,
        //     //         premium: netPremium ?? 0,
        //     //         sumInsured: sumInsured ?? 0,
        //     //     })
        //     // }

        //     this.addressData.push(
        //         {
        //             address: quoteLocationOccupancy.locationName,
        //             occupancy: quoteLocationOccupancy.occupancyId['occupancyType'], //
        //             premium: quoteLocationOccupancy.flexaPremium + quoteLocationOccupancy.STFIPremium + quoteLocationOccupancy.earthquakePremium + quoteLocationOccupancy.terrorismPremium,
        //             totalSumAssured: quoteLocationOccupancy.sumAssured,
        //             locationDetailHeaders: ["Flexa+RSMD", "STFI", "Earthquake", "Terrorism"],
        //             locationDetail: [
        //                 Number(quoteLocationOccupancy.flexaPremium),
        //                 Number(quoteLocationOccupancy.STFIPremium),
        //                 Number(quoteLocationOccupancy.earthquakePremium),
        //                 Number(quoteLocationOccupancy.terrorismPremium)],

        //             addonDetails: addonDetails
        //         }
        //     )

        // })

        // New_Quote_option
        this.quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {

            const quoteLocationOccupancyId = quoteLocationOccupancy._id
            let addonDetails = []

            this.totalRiskInspectionDiscount += quoteLocationOccupancy.totalPremiumWithDiscount ?? 0

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
                let sectionOrCover = "Floater Cover AddOn"
                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.floaterCoverAddOnCovers.map((cover: IFloaterCoverAddOn) => {
                    if (Number(cover?.total ?? 0) > netPremium) netPremium = Number(cover?.total ?? 0);
                    if (Number(cover?.sumInsured ?? 0) > sumInsured) sumInsured = Number(cover?.sumInsured ?? 0);
                })

                let gst = netPremium * this.gstPercentage

                addonDetails = [{
                    coverName: sectionOrCover,
                    premium: netPremium ?? 0,
                    sumInsured: sumInsured ?? 0,
                }]
            }

            this.warranties = this.quoteOption?.allCoversArray?.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true);
            this.exclusions = this.quoteOption?.allCoversArray?.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true);
            this.subjectivities = this.quoteOption?.allCoversArray?.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true);

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) {
                let sectionOrCover = "Bsc Burglary Housebreaking Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscBurglaryHousebreakingCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscBurglaryHousebreakingCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.firstLossSumInsured);
                })

                let gst = netPremium * this.gstPercentage

                addonDetails.push({
                    coverName: sectionOrCover,
                    premium: netPremium ?? 0,
                    sumInsured: sumInsured ?? 0,
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quoteOption?.totalMoneySafeTill > 0) {
                let sectionOrCover = "Bsc Money Safe Till Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscMoneySafeTillCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscMoneySafeTillCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.moneySafe);
                })

                let gst = netPremium * this.gstPercentage


                addonDetails.push({
                    coverName: sectionOrCover,
                    premium: netPremium ?? 0,
                    sumInsured: sumInsured ?? 0,
                })
            }

            if (this.quoteOption.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quoteOption?.totalelectronicEquipment > 0) {
                let sectionOrCover = "Bsc Electronic Equipments Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscElectronicEquipmentsCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscElectronicEquipmentsCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                addonDetails.push({
                    coverName: sectionOrCover,
                    premium: netPremium ?? 0,
                    sumInsured: sumInsured ?? 0,
                })
            }

            if (this.quoteOption.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quoteOption?.totalFixedPlateGlass > 0) {
                let sectionOrCover = "Bsc Fixed Plate Glass Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscFixedPlateGlassCovers.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancyId).map((cover: IBscFixedPlateGlassCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage


                addonDetails.push({
                    coverName: sectionOrCover,
                    premium: netPremium ?? 0,
                    sumInsured: sumInsured ?? 0,
                })
            }

            this.addressData.push(
                {
                    address: quoteLocationOccupancy.locationName,
                    occupancy: quoteLocationOccupancy.occupancyId['occupancyType'], //
                    premium: quoteLocationOccupancy.flexaPremium + quoteLocationOccupancy.STFIPremium + quoteLocationOccupancy.earthquakePremium + quoteLocationOccupancy.terrorismPremium,
                    totalSumAssured: quoteLocationOccupancy.sumAssured,
                    locationDetailHeaders: ["Flexa+RSMD", "STFI", "Earthquake", "Terrorism"],
                    locationDetail: [
                        Number(quoteLocationOccupancy.flexaPremium),
                        Number(quoteLocationOccupancy.STFIPremium),
                        Number(quoteLocationOccupancy.earthquakePremium),
                        Number(quoteLocationOccupancy.terrorismPremium)],

                    addonDetails: addonDetails
                }
            )

        })


    }

    loadTermsAndConditions() {
        const productId = this.quote.productId as IProduct
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                productId: [
                    {
                        value: productId?._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                //@ts-ignore
                partnerId: [
                    {
                        //@ts-ignore
                        value: this.quote.partnerId?._id ?? this.quote.partnerId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
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
        this.termsConditionsService.getMany(lazyLoadEvent).subscribe({
            next: dto => {
                let sections = dto.data.entities.map(tc => tc?.section).filter((value, index, current_value) => current_value.indexOf(value) === index);
                this.termsAndConditions = sections.map(item => {
                    let tc = dto.data.entities.filter(t => t.section == item).map(item => {
                        //@ts-ignore
                        item.description = item.description.replaceAll('&lt;', '<')
                        return item;
                    })
                    return {
                        section: item,
                        tc: tc
                    }
                })
            },
            error: e => { }
        });
    }

    // Old_Quote
    loadSelectedBscClauses() {
        if (this.quote.selectedAllowedProductBscCover.length > 0) {
            let payload = {}
            payload['quoteId'] = this.quote._id
            this.dynamicClausesService.getALlClauses(payload).subscribe(response => {
                this.selectedBscClauses = response['data'].entity.map(item => {
                    item.description = item.description.replaceAll('&lt;', '<')
                    return item;
                })
            })

        }
    }

    // New_Quote_option
    loadSelectedBscClausesQuoteOptionWise() {
        if (this.quoteOption?.selectedAllowedProductBscCover.length > 0) {
            let payload = {}
            payload['quoteId'] = this.quote._id
            payload['quoteOptionId'] = this.quoteOption?._id
            this.dynamicClausesService.getALlClauses(payload).subscribe(response => {
                this.selectedBscClauses = response['data'].entity.map(item => {
                    item.description = item.description.replaceAll('&lt;', '<')
                    return item;
                })
            })

        }
    }

    loadSumInsuredAndPremiumDetails() {
        if (this.quote?.allCoversArray) {
            let sectionOrCover = this.quote.productId['type']
            let netPremium = 0;
            let sumInsured = 0;

            this.quote?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
                netPremium = netPremium + Number(quoteLocationOccupancy?.totalPremium ?? 0);
                sumInsured = sumInsured + Number(quoteLocationOccupancy?.sumAssured ?? 0);
            })

            let gst = netPremium * this.gstPercentage

            this.covers.push({
                sectionOrCover: sectionOrCover,
                netPremium: netPremium ?? 0,
                gst: gst ?? 0,
                sumInsured: sumInsured ?? 0,
                totalPremium: (netPremium ?? 0) + (gst ?? 0),
                isRequired: true
            })

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) {
                let sectionOrCover = "Fire Loss Of Profit Cover"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.bscFireLossOfProfitCover?.total ?? 0;
                sumInsured = Number(this.quote?.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0) +
                    Number(this.quote?.allCoversArray?.bscFireLossOfProfitCover?.auditorsFees ?? 0)

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) {
                let sectionOrCover = "Burglary Housebreaking Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscBurglaryHousebreakingCovers.map((cover: IBscBurglaryHousebreakingCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.isFirstLossOpted ? cover.firstLossSumInsured : cover.otherContents);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {
                let sectionOrCover = "Electrical and Mechanical Appliances"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscPortableEquipmentsCovers.map((cover: IBscPortableEquipments) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quote?.totalelectronicEquipment > 0) {
                let sectionOrCover = "Electronic Equipments Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscElectronicEquipmentsCovers.map((cover: IBscElectronicEquipmentsCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) {
                let sectionOrCover = "Money Transit Cover"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.bscMoneyTransitCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.bscMoneyTransitCover?.singleCarryingLimit ?? 0;

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quote?.totalMoneySafeTill > 0) {
                let sectionOrCover = "Money Safe Till Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscMoneySafeTillCovers.map((cover: IBscMoneySafeTillCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.moneySafe) + Number(cover.moneyTillCounter);
                })

                let gst = netPremium * this.gstPercentage


                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
                let sectionOrCover = "Fidelity Guarantee Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscFidelityGuaranteeCovers.map((cover: IBSCFidelityGurantee) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage



                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quote?.totalFixedPlateGlass > 0) {
                let sectionOrCover = "Fixed Plate Glass Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscFixedPlateGlassCovers.map((cover: IBscFixedPlateGlassCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
                let sectionOrCover = "Signage Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscSignageCovers.map((cover: IBscSignage) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage


                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
                let sectionOrCover = "Personal Accident Cover"

                let netPremium = 0;
                let sumInsured = 0;

                /* netPremium = this.quote?.allCoversArray?.personalAccidentCoverCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.personalAccidentCoverCover?.sumInsured ?? 0; */

                this.quote?.locationBasedCovers?.personalAccidentCoverCover.map((cover: any) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) {
                let sectionOrCover = "Workmen Compensation Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscWorkmenCompensationCover.map((cover: IBscLiability) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
                let sectionOrCover = "Liability Section Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscLiabilitySectionCovers.map((cover: IBscLiability) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) {
                let sectionOrCover = "Pedal Cycle Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscPedalCycleCovers.map((cover: IBscPedalCycle) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage


                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {
                let sectionOrCover = "Accompanied Baggage Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscAccompaniedBaggageCovers.map((cover: IBscAccompaniedBaggage) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) {
                let sectionOrCover = "All Risks Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.bscAllRiskCovers.map((cover: IBscAllRisks) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
                let sectionOrCover = "Floater Cover AddOn"
                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.floaterCoverAddOnCovers.map((cover: IFloaterCoverAddOn) => {
                    if (Number(cover?.total ?? 0) > netPremium) netPremium = Number(cover?.total ?? 0);
                    if (Number(cover?.sumInsured ?? 0) > sumInsured) sumInsured = Number(cover?.sumInsured ?? 0);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) {
                let sectionOrCover = "Accidental Damage"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.accidentalDamageCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.accidentalDamageCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.THIRD_PARTY_LIABILITY)) {
                let sectionOrCover = "Third party liability"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.thirdPartyLiabilityCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.thirdPartyLiabilityCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)) {
                let sectionOrCover = "Tenants legal Liability"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.tenatLegalLiabilityCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.tenatLegalLiabilityCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.REMOVAL_OF_DEBRIS)) {
                let sectionOrCover = "Removal Of Debris"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.removalOfDebrisCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.removalOfDebrisCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)) {
                let sectionOrCover = "Protection and Preservation of Property"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.protectionAndPreservationOfPropertyCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.protectionAndPreservationOfPropertyCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)) {
                let sectionOrCover = "Landscaping including lawns plant shrubs or trees"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }


            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.KEYS_AND_LOCKS)) {
                let sectionOrCover = "Keys and Locks"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.keysAndLocksCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.keysAndLocksCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)) {
                let sectionOrCover = "Cover of Valuable Contents"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.coverOfValuableContentsCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.coverOfValuableContentsCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) {
                let sectionOrCover = "Claim Preparation Cost"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.claimPreparationCostCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.claimPreparationCostCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)) {
                let sectionOrCover = "Additional Custom Duty"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.additionalCustomDuty?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.additionalCustomDuty?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) {
                let sectionOrCover = "Deterioration of Stocks in B"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.deteriorationofStocksinBCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.deteriorationofStocksinBCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) {
                let sectionOrCover = "Deterioration of Stocks in A"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.deteriorationofStocksinACover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.deteriorationofStocksinACover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) {
                let sectionOrCover = "Escalation"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.escalationCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.escalationCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) {
                let sectionOrCover = "EMI Protection Cover"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.emiProtectionCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.emiProtectionCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) {
                let sectionOrCover = "Insurance of additional expense"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.insuranceOfAdditionalExpenseCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.insuranceOfAdditionalExpenseCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) {
                let sectionOrCover = "Involuntary betterment"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.involuntaryBettermentCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.involuntaryBettermentCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) {
                let sectionOrCover = "Declaration Policy"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.declarationPolicyCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.declarationPolicyCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) {
                let sectionOrCover = "Lose Of Rent"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.loseOfRentCover?.total ?? 0;
                sumInsured = this.quote?.allCoversArray?.loseOfRentCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) {
                let sectionOrCover = "Rent For Alternative Accomodation"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quote?.allCoversArray?.rentForAlternativeAccomodationCover?.total ?? 0
                sumInsured = this.quote?.allCoversArray?.rentForAlternativeAccomodationCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
            if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {
                let sectionOrCover = "Valuable Contents On Agreed Value Basis"
                let netPremium = 0;
                let sumInsured = 0;

                this.quote?.allCoversArray?.valuableContentsOnAgreedValueBasisCovers.map((cover: IValuableContentsOnAgreedValue) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
        }


        let totalNetPremium = 0;
        let totalGst = 0;
        let totalSumInsured = 0;
        let totalPremium = 0;

        this.covers.map((cover: CalculatedCovers) => {
            totalNetPremium = totalNetPremium + cover.netPremium
            totalGst = totalGst + cover.gst
            totalSumInsured = totalSumInsured + cover.sumInsured
            totalPremium = totalPremium + cover.totalPremium
        })

        this.covers.push({
            sectionOrCover: 'Total',
            netPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount) ?? 0,
            gst: Math.round((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage) ?? 0,
            sumInsured: totalSumInsured ?? 0,
            totalPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount + ((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage)),
        })
        this.total.push({
            sectionOrCover: 'Total',
            netPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount) ?? 0,
            gst: Math.round((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage) ?? 0,
            sumInsured: totalSumInsured ?? 0,
            totalPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount + ((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage)),
        })

        // https://alwrite.youtrack.cloud/issues?q=&preview=BLUS-32
        // To  show Discount in quoteslip
        this.discountPercentage = this.quote?.discountId ? this.quote?.discountId['discountPercentage'] : 0

        if (this.discountPercentage) {

            let discountedTotalNetPremium = totalNetPremium - totalNetPremium * (this.discountPercentage / 100);
            let discountedTotalGst = totalGst - totalGst * (this.discountPercentage / 100);
            let discountedTotalSumInsured = totalSumInsured - totalSumInsured * (this.discountPercentage / 100);
            let discountedTotalPremium = totalPremium - totalPremium * (this.discountPercentage / 100);

            this.discount = {
                sectionOrCover: 'Discount Premium',
                netPremium: Math.round(discountedTotalNetPremium ?? 0),
                gst: Math.round(discountedTotalGst ?? 0),
                sumInsured: Math.round(discountedTotalSumInsured ?? 0),
                totalPremium: Math.round(discountedTotalPremium),
            }
        }
    }

    // New_Quote_option
    loadSumInsuredAndPremiumDetailsForQuoteOption() {
        this.covers = []
        this.total = []
        if (this.quoteOption?.allCoversArray) {
            let sectionOrCover = this.quote.productId['type']
            let netPremium = 0;
            let sumInsured = 0;

            this.quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
                netPremium = netPremium + Number(quoteLocationOccupancy?.totalPremium ?? 0);
                sumInsured = sumInsured + Number(quoteLocationOccupancy?.sumAssured ?? 0);
            })

            let gst = netPremium * this.gstPercentage

            this.covers.push({
                sectionOrCover: sectionOrCover,
                netPremium: netPremium ?? 0,
                gst: gst ?? 0,
                sumInsured: sumInsured ?? 0,
                totalPremium: (netPremium ?? 0) + (gst ?? 0),
                isRequired: true
            })

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)) {
                let sectionOrCover = "Fire Loss Of Profit Cover"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.bscFireLossOfProfitCover?.total ?? 0;
                sumInsured = Number(this.quoteOption?.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0) +
                    Number(this.quoteOption?.allCoversArray?.bscFireLossOfProfitCover?.auditorsFees ?? 0)

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)) {
                let sectionOrCover = "Burglary Housebreaking Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscBurglaryHousebreakingCovers.map((cover: IBscBurglaryHousebreakingCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.isFirstLossOpted ? cover.firstLossSumInsured : cover.otherContents);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)) {
                let sectionOrCover = "Electrical and Mechanical Appliances"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscPortableEquipmentsCovers.map((cover: IBscPortableEquipments) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER) || this.quoteOption?.totalelectronicEquipment > 0) {
                let sectionOrCover = "Electronic Equipments Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscElectronicEquipmentsCovers.map((cover: IBscElectronicEquipmentsCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER)) {
                let sectionOrCover = "Money Transit Cover"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.bscMoneyTransitCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.bscMoneyTransitCover?.singleCarryingLimit ?? 0;

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER) || this.quoteOption?.totalMoneySafeTill > 0) {
                let sectionOrCover = "Money Safe Till Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscMoneySafeTillCovers.map((cover: IBscMoneySafeTillCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.moneySafe) + Number(cover.moneyTillCounter);
                })

                let gst = netPremium * this.gstPercentage


                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER)) {
                let sectionOrCover = "Fidelity Guarantee Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscFidelityGuaranteeCovers.map((cover: IBSCFidelityGurantee) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage



                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER) || this.quoteOption?.totalFixedPlateGlass > 0) {
                let sectionOrCover = "Fixed Plate Glass Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscFixedPlateGlassCovers.map((cover: IBscFixedPlateGlassCover) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER)) {
                let sectionOrCover = "Signage Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscSignageCovers.map((cover: IBscSignage) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage


                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER)) {
                let sectionOrCover = "Personal Accident Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.locationBasedCovers?.personalAccidentCoverCover.map((cover: any) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER)) {
                let sectionOrCover = "Workmen Compensation Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscWorkmenCompensationCover.map((cover: IBscLiability) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER)) {
                let sectionOrCover = "Liability Section Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscLiabilitySectionCovers.map((cover: IBscLiability) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER)) {
                let sectionOrCover = "Pedal Cycle Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscPedalCycleCovers.map((cover: IBscPedalCycle) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage


                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)) {
                let sectionOrCover = "Accompanied Baggage Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscAccompaniedBaggageCovers.map((cover: IBscAccompaniedBaggage) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER)) {
                let sectionOrCover = "All Risks Cover"

                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.bscAllRiskCovers.map((cover: IBscAllRisks) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                    isRequired: true
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON)) {
                let sectionOrCover = "Floater Cover AddOn"
                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.floaterCoverAddOnCovers.map((cover: IFloaterCoverAddOn) => {
                    if (Number(cover?.total ?? 0) > netPremium) netPremium = Number(cover?.total ?? 0);
                    if (Number(cover?.sumInsured ?? 0) > sumInsured) sumInsured = Number(cover?.sumInsured ?? 0);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ACCIDENTAL_DAMAGE)) {
                let sectionOrCover = "Accidental Damage"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.accidentalDamageCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.accidentalDamageCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.THIRD_PARTY_LIABILITY)) {
                let sectionOrCover = "Third party liability"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.thirdPartyLiabilityCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.thirdPartyLiabilityCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.TENANTS_LEGAL_LIABILITY)) {
                let sectionOrCover = "Tenants legal Liability"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.tenatLegalLiabilityCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.tenatLegalLiabilityCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.REMOVAL_OF_DEBRIS)) {
                let sectionOrCover = "Removal Of Debris"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.removalOfDebrisCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.removalOfDebrisCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY)) {
                let sectionOrCover = "Protection and Preservation of Property"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.protectionAndPreservationOfPropertyCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.protectionAndPreservationOfPropertyCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES)) {
                let sectionOrCover = "Landscaping including lawns plant shrubs or trees"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.landscapingIncludingLawnsPlantShrubsOrTreesCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }


            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.KEYS_AND_LOCKS)) {
                let sectionOrCover = "Keys and Locks"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.keysAndLocksCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.keysAndLocksCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS)) {
                let sectionOrCover = "Cover of Valuable Contents"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.coverOfValuableContentsCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.coverOfValuableContentsCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.CLAIM_PREPARATION_COST)) {
                let sectionOrCover = "Claim Preparation Cost"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.claimPreparationCostCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.claimPreparationCostCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY)) {
                let sectionOrCover = "Additional Custom Duty"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.additionalCustomDuty?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.additionalCustomDuty?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B)) {
                let sectionOrCover = "Deterioration of Stocks in B"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.deteriorationofStocksinBCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.deteriorationofStocksinBCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A)) {
                let sectionOrCover = "Deterioration of Stocks in A"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.deteriorationofStocksinACover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.deteriorationofStocksinACover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.ESCALATION)) {
                let sectionOrCover = "Escalation"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.escalationCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.escalationCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.EMI_PROTECTION_COVER)) {
                let sectionOrCover = "EMI Protection Cover"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.emiProtectionCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.emiProtectionCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE)) {
                let sectionOrCover = "Insurance of additional expense"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.insuranceOfAdditionalExpenseCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.insuranceOfAdditionalExpenseCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.INVOLUNTARY_BETTERMENT)) {
                let sectionOrCover = "Involuntary betterment"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.involuntaryBettermentCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.involuntaryBettermentCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY)) {
                let sectionOrCover = "Declaration Policy"
                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.declarationPolicyCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.declarationPolicyCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT)) {
                let sectionOrCover = "Lose Of Rent"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.loseOfRentCover?.total ?? 0;
                sumInsured = this.quoteOption?.allCoversArray?.loseOfRentCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)) {
                let sectionOrCover = "Rent For Alternative Accomodation"

                let netPremium = 0;
                let sumInsured = 0;

                netPremium = this.quoteOption?.allCoversArray?.rentForAlternativeAccomodationCover?.total ?? 0
                sumInsured = this.quoteOption?.allCoversArray?.rentForAlternativeAccomodationCover?.sumInsured ?? 0

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
            if (this.quoteOption?.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)) {
                let sectionOrCover = "Valuable Contents On Agreed Value Basis"
                let netPremium = 0;
                let sumInsured = 0;

                this.quoteOption?.allCoversArray?.valuableContentsOnAgreedValueBasisCovers.map((cover: IValuableContentsOnAgreedValue) => {
                    netPremium = netPremium + Number(cover.total);
                    sumInsured = sumInsured + Number(cover.sumInsured);
                })

                let gst = netPremium * this.gstPercentage

                this.covers.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }
        }


        let totalNetPremium = 0;
        let totalGst = 0;
        let totalSumInsured = 0;
        let totalPremium = 0;

        this.covers.map((cover: CalculatedCovers) => {
            totalNetPremium = totalNetPremium + cover.netPremium
            totalGst = totalGst + cover.gst
            totalSumInsured = totalSumInsured + cover.sumInsured
            totalPremium = totalPremium + cover.totalPremium
        })

        this.covers.push({
            sectionOrCover: 'Total',
            netPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount) ?? 0,
            gst: Math.round((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage) ?? 0,
            sumInsured: totalSumInsured ?? 0,
            totalPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount + ((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage)),
        })
        this.total.push({
            sectionOrCover: 'Total',
            netPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount) ?? 0,
            gst: Math.round((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage) ?? 0,
            sumInsured: totalSumInsured ?? 0,
            totalPremium: Math.round(totalNetPremium + this.totalRiskInspectionDiscount + ((totalNetPremium + this.totalRiskInspectionDiscount) * this.gstPercentage)),
        })

        // https://alwrite.youtrack.cloud/issues?q=&preview=BLUS-32
        // To  show Discount in quoteslip
        this.discountPercentage = this.quoteOption?.discountId ? this.quoteOption?.discountId['discountPercentage'] : 0

        if (this.discountPercentage > 0) {

            let discountedTotalNetPremium = totalNetPremium - totalNetPremium * (this.discountPercentage / 100);
            let discountedTotalGst = totalGst - totalGst * (this.discountPercentage / 100);
            let discountedTotalSumInsured = totalSumInsured - totalSumInsured * (this.discountPercentage / 100);
            let discountedTotalPremium = totalPremium - totalPremium * (this.discountPercentage / 100);

            this.discount = {
                sectionOrCover: 'Discount Premium',
                netPremium: Math.round(discountedTotalNetPremium ?? 0),
                gst: Math.round(discountedTotalGst ?? 0),
                sumInsured: Math.round(discountedTotalSumInsured ?? 0),
                totalPremium: Math.round(discountedTotalPremium),
            }
        }
    }

    ngOnChanges(): void {
        this.ngOnInit();
    }
    getExpiredDetails() {
                let lazyLoadEvent: LazyLoadEvent = {
                    first: 0,
                    rows: 20,
                    sortField: null,
                    sortOrder: 1,
                    filters: {
                        // @ts-ignore
                        quoteOptionId: [
                            {
                                value: this.quoteOption?._id,
                                matchMode: "equals",
                                operator: "and"
                            }
                        ]
                    },
                    globalFilter: null,
                    multiSortMeta: null
                }
                this.expiredDetailsDialogFormService.getMany(lazyLoadEvent).subscribe({
                    next: (dto: IOneResponseDto<IExpiredDetails>) => {
                        this.expireDetails = dto.data.entities;
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }

}

