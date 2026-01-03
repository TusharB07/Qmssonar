import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AllowedAddonCoverCategory } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { IMachineryELectricalBreakDownCover } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.model';
import { IMachineryLossOfProfitCover } from 'src/app/features/admin/machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { ProjectDetailsService } from 'src/app/features/broker/project-details-dialog/project-details.service';
import { IProject } from 'src/app/features/broker/project-details-dialog/project-details-dialog.model';
import { ExpiredDetailsDialogFormService } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.service';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';
import { InstallmentService } from '../../../installment-tab/installment.service';
import { Iinstallment } from '../../../installment-tab/installment.model';

export interface CalculatedCovers {
    sectionOrCover: string,
    sumInsured: number,
    netPremium: number,
    gst: number,
    totalPremium: number,
}


type TRiskDescriptionCoverages = {
    name: string
}
type TRiskDescription = {
    label: string,
    value?: string,
}
type TPerilsToBeDeleted = {
    stfi: boolean
    earthquake: boolean
    terrorism: boolean
}
type TClause = {
    label: string,
}
type TLocationBasedCover = {
    riskDescriptionCover: TRiskDescriptionCoverages[]
    riskDescription: any
    perilsToBeDeleted: TPerilsToBeDeleted
    clauses: TClause[],
    biclauses: TClause[],
    address: any,
    machineryElectricalBreakdown: IMachineryELectricalBreakDownCover;
    quoteLocationOccupancy?: string
}

type IJsonTable<R extends string, H extends string> = {
    [rowKey in R]: {
        [headerKey in H]: any
    }
}

type IJsonTablev2<R extends string, H extends string> = {
    [rowKey in R]: {
        [headerKey in H]: any
    }
}


const headers = [
    'Basic::Type of Policy',
    'Basic::Name',
    'Sum Insured Detail::Total'
] as const;

const rows = ['RFQ', 'Insurer 1']

let qcrDetailed: IJsonTable<typeof headers[number], typeof rows[number]> = {
    "Basic::Type of Policy": {
        "RFQ": "something",
        "Insurer 1": false,
    },
    "Basic::Name": {
        "RFQ": "something",
        "Insurer 1": false,
    },
    "Sum Insured Detail::Total": {
        "RFQ": "something",
        "Insurer 1": "Me",
    }
}

const breakUpHeaders = [
    'Manav House - 400062',
    'Manav Cement Factory - 400066'
] as const

const breakUpRowsLabel = [
    'Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building',
    'Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.',
    'Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks',
] as const




@Component({
    selector: 'app-sub-template-iar',
    templateUrl: './sub-template-iar.component.html',
    styleUrls: ['./sub-template-iar.component.scss']
})
export class SubTemplateIarComponent implements OnInit {
    @Input() quote: IQuoteSlip;
    addressData = []
    Object = Object // To Access Object Helper in HTML

    // https://alwrite.youtrack.cloud/issues?q=&preview=BLUS-32
    // To  show Discount in quoteslip
    discount: CalculatedCovers;
    discountPercentage = 0;
    projectData: any;
    expireDetails: any;
    installmentDetailsData: any;

    constructor(
        private claimExperienceService: ClaimExperienceService,
        private projectDetailsService: ProjectDetailsService,
        private expiredDetailsDialogFormService:ExpiredDetailsDialogFormService,
        private installmentService:InstallmentService
    ) { }

    claimExperiences: IClaimExperience[] = []
    quoteLocationOccupancies = []
    listOfValues = [
        'Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building',
        'Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.',
        'Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks',
        'Section II: Property Damage (PD)::>::(A) Material Damage Section::>::Other Items',
    ] as const

    covers: TLocationBasedCover[] = []
    data: TreeNode[]
    JSON = JSON
    bscFireLossOfProfit: IBscFireLossOfProfitCover;
    machineryLossOfProfit: IMachineryLossOfProfitCover;
    warranties: any[];
    exclusions: any[];
    subjectivities: any[];
    coversPremium: CalculatedCovers[] = [];
    gstPercentage = 0.18
    isAllowedToShow:boolean

    // New_Quote_option
    @Input() quoteOption: IQuoteOption;

    ngOnInit(): void {
        this.getProjectDetails();
        this.getInstallment();
        this.showQuoteOptionWiseSlip(this.quoteOption);

        this.isAllowedToShow = !['Draft', 'Pending Requisition For Quote', 'Sent To Insurance Company RM', 'Under Writer Review','QCR From Underwritter','Placement','Waiting For Approval'].includes(this.quote?.quoteState);
        // Old_Quote
        // this.quote.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {

        //     const quoteLocationOccupancyId = quoteLocationOccupancy._id
        //     let addonDetails = []

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

        // this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
        //     next: (dto: IManyResponseDto<IClaimExperience>) => {
        //         this.claimExperiences = dto.data.entities
        //     }
        // })

        // this.warranties = this.quote.allCoversArray?.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true);
        // this.exclusions = this.quote.allCoversArray?.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true);
        // this.subjectivities = this.quote.allCoversArray?.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true);


        // let responseObject: IJsonTablev2<typeof this.listOfValues[number], typeof this.quoteLocationOccupancies[number]> = {
        //     "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building": {
        //         "Manav House - 400062": 5000,
        //         "Manav Cement Factory - 400066": 6000
        //     },
        //     "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.": {
        //         "Manav House - 400062": 5000,
        //         "Manav Cement Factory - 400066": 0
        //     },
        //     "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks": {
        //         "Manav House - 400062": 3000,
        //         "Manav Cement Factory - 400066": 6000,
        //     },
        //     "Section II: Property Damage (PD)::>::(A) Material Damage Section::>::Other Items": {
        //         "Manav House - 400062": 3000,
        //         "Manav Cement Factory - 400066": 6000,
        //     }
        // }


        // function getTreeFromFlatArray(flatArray) {
        //     const delimiter = "::>::";

        //     const treeArrayFromFlatArray: TreeNode[] = [];

        //     for (const key in flatArray) {
        //         const keys = key.split(delimiter);
        //         let currentNode = treeArrayFromFlatArray;
        //         for (let i = 0; i < keys.length; i++) {
        //             let found = false;
        //             for (let j = 0; j < currentNode.length; j++) {
        //                 if (currentNode[j].data.key === keys[i]) {
        //                     currentNode = currentNode[j].children;
        //                     found = true;
        //                     break;
        //                 }
        //             }
        //             if (!found) {
        //                 let newNode = {};
        //                 if (i === keys.length - 1) {
        //                     newNode = {
        //                         data: {
        //                             "key": keys[i],
        //                             ...flatArray[key]
        //                         },
        //                         leaf: true,
        //                         // expanded: false,
        //                         // children: []
        //                     };
        //                 } else {
        //                     newNode = {
        //                         data: {
        //                             "key": keys[i]
        //                         },
        //                         expanded: true,
        //                         leaf: false,
        //                         children: []
        //                     };
        //                 }
        //                 currentNode.push(newNode);
        //                 currentNode = newNode['children'];
        //             }
        //         }
        //     }


        //     return treeArrayFromFlatArray
        // }




        // if (this.quote?.allCoversArray) {
        //     this.coversPremium = [];

        //     let sectionOrCover = this.quote.productId['type']
        //     let netPremium = 0;
        //     let sumInsured = 0;

        //     this.quote?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
        //         netPremium = netPremium + Number(quoteLocationOccupancy?.totalPremium ?? 0);
        //         sumInsured = sumInsured + Number(quoteLocationOccupancy?.sumAssured ?? 0);
        //     })

        //     let gst = netPremium * this.gstPercentage

        //     this.coversPremium.push({
        //         sectionOrCover: sectionOrCover,
        //         netPremium: netPremium ?? 0,
        //         gst: gst ?? 0,
        //         sumInsured: sumInsured ?? 0,
        //         totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //     })

        //     if (true) {
        //         let sectionOrCover = 'Machinery / Electrical BreakDown'
        //         let netPremium = 0;
        //         let sumInsured = 0;

        //         this.quote?.allCoversArray?.machineryElectricalBreakdown.map((cover) => {
        //             netPremium = netPremium + Number(cover.total);
        //             sumInsured = sumInsured + Number(cover.sumInsurred);
        //         })


        //         let gst = netPremium * this.gstPercentage

        //         this.coversPremium.push({
        //             sectionOrCover: sectionOrCover,
        //             netPremium: netPremium ?? 0,
        //             gst: gst ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //             totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //         })
        //     }

        //     if (true) {

        //         let sectionOrCover = 'Machinery Loss Of Profit (MBLOP)'
        //         let sumInsured = this.quote?.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0
        //         let netPremium = this.quote?.totalMachineryLossOfProfit ?? 0;
        //         let gst = netPremium * this.gstPercentage

        //         this.coversPremium.push({
        //             sectionOrCover: sectionOrCover,
        //             netPremium: netPremium ?? 0,
        //             gst: gst ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //             totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //         })
        //     }
        //     if (true) {

        //         let sectionOrCover = 'Fire Loss Profit (Flop)'
        //         let sumInsured = this.quote?.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0;
        //         let netPremium = this.quote?.totalFireLossOfProfit;
        //         let gst = netPremium * this.gstPercentage

        //         this.coversPremium.push({
        //             sectionOrCover: sectionOrCover,
        //             netPremium: netPremium ?? 0,
        //             gst: gst ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //             totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //         })
        //     }
        //     if (this.quote.partnerId['type'] == "Erection All Risk") {
        //         if (true) {

        //             let sectionOrCover = 'Rate for 1 Month + 1 month testing(Rs. %o)'
        //             let sumInsured = this.quote?.totalOpt1 ?? 0

        //             this.coversPremium.push({
        //                 sectionOrCover: sectionOrCover,
        //                 sumInsured: sumInsured ?? 0,
        //                 netPremium: 0,
        //                 gst: 0,
        //                 totalPremium: sumInsured ?? 0
        //             })
        //         }
        //         if (true) {

        //             let sectionOrCover = 'Rate for 1 month or part thereof, for subsequent 10 months(Rs. %o)'
        //             let sumInsured = this.quote?.totalOpt2 ?? 0

        //             this.coversPremium.push({
        //                 sectionOrCover: sectionOrCover,
        //                 sumInsured: sumInsured ?? 0,
        //                 netPremium: 0,
        //                 gst: 0,
        //                 totalPremium: sumInsured ?? 0
        //             })
        //         }
        //         if (true) {

        //             let sectionOrCover = 'Rate for 1 month or part thereof, for period exceeding 12 months(Rs. %o)'
        //             let sumInsured = this.quote?.totalOpt3 ?? 0

        //             this.coversPremium.push({
        //                 sectionOrCover: sectionOrCover,
        //                 sumInsured: sumInsured ?? 0,
        //                 netPremium: 0,
        //                 gst: 0,
        //                 totalPremium: sumInsured ?? 0
        //             })
        //         }
        //         if (true) {

        //             let sectionOrCover = 'Rate for 1 month or part thereof, for testing period extension within policy period(Rs. %o)'
        //             let sumInsured = this.quote?.totalOpt4
        //             this.coversPremium.push({
        //                 sectionOrCover: sectionOrCover,
        //                 sumInsured: sumInsured ?? 0,
        //                 netPremium: 0,
        //                 gst: 0,
        //                 totalPremium: sumInsured ?? 0
        //             })
        //         }
        //     }
        //     if (this.quote.allCoversArray?.quoteLocationPropertyDamageAddonCoversSumInsured) {

        //         let sectionOrCover = 'Property Damage Addons'
        //         let sumInsured = this.quote.allCoversArray?.quoteLocationPropertyDamageAddonCoversSumInsured;
        //         let netPremium = 0
        //         netPremium = this.quote?.totalPDAddonCover;
        //         let gst = netPremium * this.gstPercentage

        //         this.coversPremium.push({
        //             sectionOrCover: sectionOrCover,
        //             netPremium: netPremium ?? 0,
        //             gst: gst ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //             totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //         })
        //     }
        //     if (this.quote.allCoversArray?.quoteLocationBusinessInturruptionAddonCoversSumInsured) {

        //         let sectionOrCover = 'Business Interruption Addons'
        //         let sumInsured = this.quote.allCoversArray?.quoteLocationBusinessInturruptionAddonCoversSumInsured;
        //         let netPremium = 0;
        //         netPremium = this.quote?.totalBIAddonCover;
        //         let gst = netPremium * this.gstPercentage

        //         this.coversPremium.push({
        //             sectionOrCover: sectionOrCover,
        //             netPremium: netPremium ?? 0,
        //             gst: gst ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //             totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //         })
        //     }
        // }

        // let totalNetPremium = 0;
        // let totalGst = 0;
        // let totalSumInsured = 0;
        // let totalPremium = 0;

        // this.coversPremium.map((cover: CalculatedCovers) => {
        //     totalNetPremium = totalNetPremium + cover.netPremium
        //     totalGst = totalGst + cover.gst
        //     totalSumInsured = totalSumInsured + cover.sumInsured
        //     totalPremium = totalPremium + cover.totalPremium
        // })

        // this.coversPremium.push({
        //     sectionOrCover: 'Total',
        //     netPremium: totalNetPremium ?? 0,
        //     gst: totalGst ?? 0,
        //     sumInsured: totalSumInsured ?? 0,
        //     totalPremium: totalPremium ?? 0,
        // })

        // // https://alwrite.youtrack.cloud/issues?q=&preview=BLUS-32
        // // To  show Discount in quoteslip
        // this.discountPercentage = this.quote?.discountId ? this.quote?.discountId['discountPercentage'] : 0

        // if (this.discountPercentage > 0) {

        //     let discountedTotalNetPremium = totalNetPremium - totalNetPremium * (this.discountPercentage / 100);
        //     let discountedTotalGst = totalGst - totalGst * (this.discountPercentage / 100);
        //     let discountedTotalSumInsured = totalSumInsured - totalSumInsured * (this.discountPercentage / 100);
        //     let discountedTotalPremium = totalPremium - totalPremium * (this.discountPercentage / 100);

        //     this.discount = {
        //         sectionOrCover: 'Discount Premium',
        //         netPremium: discountedTotalNetPremium ?? 0,
        //         gst: discountedTotalGst ?? 0,
        //         sumInsured: discountedTotalSumInsured ?? 0,
        //         totalPremium: discountedTotalPremium,
        //     }
        // }

        // this.bscFireLossOfProfit = this.quote.allCoversArray.bscFireLossOfProfitCover;
        // this.machineryLossOfProfit = this.quote.allCoversArray.machineryLossOfProfitCover;




        // this.quote.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {


        //     let firstLocationData = Object.values(this.quote?.allCoversArray?.quoteLocationBreakupMaster)[0]


        //     this.covers.push({
        //         quoteLocationOccupancy: `${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,
        //         // riskDescriptionCover: this.quote?.allCoversArray?.quoteLocationRiskManagement.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map((cover) => ({ name: cover.riskManagementFeatureId['name'] })),
        //         riskDescriptionCover: this.quote.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.checkbox).filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map(cover => {
        //             return ({ name: cover.name })
        //         }),
        //         machineryElectricalBreakdown: this.quote.allCoversArray.machineryElectricalBreakdown?.find((item) => item.quoteLocationOccupancyId == quoteLocationOccupancy._id),
        //         address: {
        //             address: quoteLocationOccupancy.locationName,
        //             occupancy: quoteLocationOccupancy.occupancyId['occupancyType'], //
        //             premium: quoteLocationOccupancy.flexaPremium + quoteLocationOccupancy.STFIPremium + quoteLocationOccupancy.earthquakePremium + quoteLocationOccupancy.terrorismPremium,
        //             totalSumAssured: quoteLocationOccupancy.sumAssured,
        //             locationDetailHeaders: ["Flexa+RSMD", "STFI", "Earthquake", "Terrorism"],
        //             locationDetail: [
        //                 Number(quoteLocationOccupancy.flexaPremium),
        //                 Number(quoteLocationOccupancy.STFIPremium),
        //                 Number(quoteLocationOccupancy.earthquakePremium),
        //                 Number(quoteLocationOccupancy.terrorismPremium)
        //             ],

        //         },
        //         clauses: this.quote?.allCoversArray?.quoteLocationAddonCovers
        //             .filter(filterBySector => filterBySector?.addOnCoverId['sectorId'] == this.quote['sectorId']['_id'])
        //             .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
        //             .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
        //             .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
        //             .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
        //         biclauses: this.quote?.allCoversArray?.quoteLocationAddonCovers
        //             .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
        //             .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.BUSINESS_INTURREPTION)
        //             .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
        //             .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
        //         riskDescription: getTreeFromFlatArray(this.quote?.allCoversArray?.quoteLocationBreakupMaster),
        //         perilsToBeDeleted: {
        //             stfi: quoteLocationOccupancy.isStfi,
        //             earthquake: quoteLocationOccupancy.isEarthquake,
        //             terrorism: quoteLocationOccupancy.isTerrorism,
        //         }
        //     })
        // })

       
    }

    showQuoteOptionWiseSlip(quoteOption: IQuoteOption) {
         // New_Quote_option
         this.addressData = [];
         this.covers = [];
         this.quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
             const quoteLocationOccupancyId = quoteLocationOccupancy._id
             let addonDetails = []
 
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
 
         let lazyLoadEvent: LazyLoadEvent = {
             first: 0,
             rows: 5,
             sortField: '_id',
             sortOrder: -1,
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
         };
 
         this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
             next: (dto: IManyResponseDto<IClaimExperience>) => {
                 this.claimExperiences = dto.data.entities
             }
         })
 
         this.warranties = this.quoteOption?.allCoversArray?.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true);
         this.exclusions = this.quoteOption?.allCoversArray?.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true);
         this.subjectivities = this.quoteOption?.allCoversArray?.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true);
 
 
         // let responseObject: IJsonTablev2<typeof this.listOfValues[number], typeof this.quoteLocationOccupancies[number]> = {
         //     "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building": {
         //         "Manav House - 400062": 5000,
         //         "Manav Cement Factory - 400066": 6000
         //     },
         //     "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.": {
         //         "Manav House - 400062": 5000,
         //         "Manav Cement Factory - 400066": 0
         //     },
         //     "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks": {
         //         "Manav House - 400062": 3000,
         //         "Manav Cement Factory - 400066": 6000,
         //     },
         //     "Section II: Property Damage (PD)::>::(A) Material Damage Section::>::Other Items": {
         //         "Manav House - 400062": 3000,
         //         "Manav Cement Factory - 400066": 6000,
         //     }
         // }
 
 
         function getTreeFromFlatArray(flatArray) {
             const delimiter = "::>::";
 
             const treeArrayFromFlatArray: TreeNode[] = [];
 
             for (const key in flatArray) {
                 const keys = key.split(delimiter);
                 let currentNode = treeArrayFromFlatArray;
                 for (let i = 0; i < keys.length; i++) {
                     let found = false;
                     for (let j = 0; j < currentNode.length; j++) {
                         if (currentNode[j].data.key === keys[i]) {
                             currentNode = currentNode[j].children;
                             found = true;
                             break;
                         }
                     }
                     if (!found) {
                         let newNode = {};
                         if (i === keys.length - 1) {
                             newNode = {
                                 data: {
                                     "key": keys[i],
                                     ...flatArray[key]
                                 },
                                 leaf: true,
                                 // expanded: false,
                                 // children: []
                             };
                         } else {
                             newNode = {
                                 data: {
                                     "key": keys[i]
                                 },
                                 expanded: true,
                                 leaf: false,
                                 children: []
                             };
                         }
                         currentNode.push(newNode);
                         currentNode = newNode['children'];
                     }
                 }
             }
 
 
             return treeArrayFromFlatArray
         }
 
 
 
 
         if (this.quoteOption?.allCoversArray) {
             this.coversPremium = [];
 
             let sectionOrCover = this.quote.productId['type']
             let netPremium = 0;
             let sumInsured = 0;
 
             this.quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
                 netPremium = netPremium + Number(quoteLocationOccupancy?.totalPremium ?? 0);
                 sumInsured = sumInsured + Number(quoteLocationOccupancy?.sumAssured ?? 0);
             })
 
             let gst = netPremium * this.gstPercentage
 
             this.coversPremium = [{
                 sectionOrCover: sectionOrCover,
                 netPremium: netPremium ?? 0,
                 gst: gst ?? 0,
                 sumInsured: sumInsured ?? 0,
                 totalPremium: (netPremium ?? 0) + (gst ?? 0),
             }]
 
             if (true) {
                 let sectionOrCover = 'Machinery / Electrical BreakDown'
                 let netPremium = 0;
                 let sumInsured = 0;
 
                 this.quoteOption?.allCoversArray?.machineryElectricalBreakdown.map((cover) => {
                     netPremium = netPremium + Number(cover.total);
                     sumInsured = sumInsured + Number(cover.sumInsurred);
                 })
 
 
                 let gst = netPremium * this.gstPercentage
 
                 this.coversPremium.push({
                     sectionOrCover: sectionOrCover,
                     netPremium: netPremium ?? 0,
                     gst: gst ?? 0,
                     sumInsured: sumInsured ?? 0,
                     totalPremium: (netPremium ?? 0) + (gst ?? 0),
                 })
             }
 
             if (true) {
 
                 let sectionOrCover = 'Machinery Loss Of Profit (MBLOP)'
                 let sumInsured = this.quoteOption?.allCoversArray?.machineryLossOfProfitCover?.grossProfit ?? 0
                 let netPremium = this.quoteOption?.totalMachineryLossOfProfit ?? 0;
                 let gst = netPremium * this.gstPercentage
 
                 this.coversPremium.push({
                     sectionOrCover: sectionOrCover,
                     netPremium: netPremium ?? 0,
                     gst: gst ?? 0,
                     sumInsured: sumInsured ?? 0,
                     totalPremium: (netPremium ?? 0) + (gst ?? 0),
                 })
             }
             if (true) {
 
                 let sectionOrCover = 'Fire Loss Profit (Flop)'
                 let sumInsured = this.quoteOption?.allCoversArray?.bscFireLossOfProfitCover?.grossProfit ?? 0;
                 let netPremium = this.quoteOption?.totalFireLossOfProfit;
                 let gst = netPremium * this.gstPercentage
 
                 this.coversPremium.push({
                     sectionOrCover: sectionOrCover,
                     netPremium: netPremium ?? 0,
                     gst: gst ?? 0,
                     sumInsured: sumInsured ?? 0,
                     totalPremium: (netPremium ?? 0) + (gst ?? 0),
                 })
             }
             if (this.quote.productId['type'] == "Erection All Risk") {
                 if (true) {
 
                     let sectionOrCover = 'Rate for 1 Month + 1 month testing(Rs. %o)'
                     let sumInsured = this.quoteOption?.totalOpt1 ?? 0
 
                     this.coversPremium.push({
                         sectionOrCover: sectionOrCover,
                         sumInsured: sumInsured ?? 0,
                         netPremium: 0,
                         gst: 0,
                         totalPremium: sumInsured ?? 0
                     })
                 }
                 if (true) {
 
                     let sectionOrCover = 'Rate for 1 month or part thereof, for subsequent 10 months(Rs. %o)'
                     let sumInsured = this.quoteOption?.totalOpt2 ?? 0
 
                     this.coversPremium.push({
                         sectionOrCover: sectionOrCover,
                         sumInsured: sumInsured ?? 0,
                         netPremium: 0,
                         gst: 0,
                         totalPremium: sumInsured ?? 0
                     })
                 }
                 if (true) {
 
                     let sectionOrCover = 'Rate for 1 month or part thereof, for period exceeding 12 months(Rs. %o)'
                     let sumInsured = this.quoteOption?.totalOpt3 ?? 0
 
                     this.coversPremium.push({
                         sectionOrCover: sectionOrCover,
                         sumInsured: sumInsured ?? 0,
                         netPremium: 0,
                         gst: 0,
                         totalPremium: sumInsured ?? 0
                     })
                 }
                 if (true) {
 
                     let sectionOrCover = 'Rate for 1 month or part thereof, for testing period extension within policy period(Rs. %o)'
                     let sumInsured = this.quoteOption?.totalOpt4
                     this.coversPremium.push({
                         sectionOrCover: sectionOrCover,
                         sumInsured: sumInsured ?? 0,
                         netPremium: 0,
                         gst: 0,
                         totalPremium: sumInsured ?? 0
                     })
                 }
             }
             if (this.quoteOption?.allCoversArray?.quoteLocationPropertyDamageAddonCoversSumInsured) {
 
                 let sectionOrCover = 'Property Damage Addons'
                 let sumInsured = this.quoteOption?.allCoversArray?.quoteLocationPropertyDamageAddonCoversSumInsured;
                 let netPremium = 0
                 netPremium = this.quoteOption?.totalPDAddonCover;
                 let gst = netPremium * this.gstPercentage
 
                 this.coversPremium.push({
                     sectionOrCover: sectionOrCover,
                     netPremium: netPremium ?? 0,
                     gst: gst ?? 0,
                     sumInsured: sumInsured ?? 0,
                     totalPremium: (netPremium ?? 0) + (gst ?? 0),
                 })
             }
             if (this.quoteOption?.allCoversArray?.quoteLocationBusinessInturruptionAddonCoversSumInsured) {
 
                 let sectionOrCover = 'Business Interruption Addons'
                 let sumInsured = this.quoteOption?.allCoversArray?.quoteLocationBusinessInturruptionAddonCoversSumInsured;
                 let netPremium = 0;
                 netPremium = this.quoteOption?.totalBIAddonCover;
                 let gst = netPremium * this.gstPercentage
 
                 this.coversPremium.push({
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
 
         this.coversPremium.map((cover: CalculatedCovers) => {
             totalNetPremium = totalNetPremium + cover.netPremium
             totalGst = totalGst + cover.gst
             totalSumInsured = totalSumInsured + cover.sumInsured
             totalPremium = totalPremium + cover.totalPremium
         })
 
         this.coversPremium.push({
             sectionOrCover: 'Total',
             netPremium: totalNetPremium ?? 0,
             gst: totalGst ?? 0,
             sumInsured: totalSumInsured ?? 0,
             totalPremium: totalPremium ?? 0,
         })
 
 
         this.discountPercentage = this.quoteOption?.discountId ? this.quoteOption?.discountId['discountPercentage'] : 0
 
         if (this.discountPercentage) {
 
             let discountedTotalNetPremium = totalNetPremium - totalNetPremium * (this.discountPercentage / 100);
             let discountedTotalGst = totalGst - totalGst * (this.discountPercentage / 100);
             let discountedTotalSumInsured = totalSumInsured - totalSumInsured * (this.discountPercentage / 100);
             let discountedTotalPremium = totalPremium - totalPremium * (this.discountPercentage / 100);
 
             this.discount = {
                 sectionOrCover: 'Discount Premium',
                 netPremium: discountedTotalNetPremium ?? 0,
                 gst: discountedTotalGst ?? 0,
                 sumInsured: discountedTotalSumInsured ?? 0,
                 totalPremium: discountedTotalPremium,
             }
         }
 
         this.bscFireLossOfProfit = this.quoteOption?.allCoversArray?.bscFireLossOfProfitCover;
         this.machineryLossOfProfit = this.quoteOption?.allCoversArray?.machineryLossOfProfitCover;
 
 
 
 
         this.quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
 
 
             let firstLocationData = Object.values(this.quoteOption?.allCoversArray?.quoteLocationBreakupMaster)[0]
             this.quoteLocationOccupancies = [`${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`]
             this.covers.push({
                 quoteLocationOccupancy: `${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,
                 riskDescriptionCover: this.quoteOption?.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.checkbox).filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map(cover => {
                     return ({ name: cover.name })
                 }),
                 machineryElectricalBreakdown: this.quoteOption?.allCoversArray.machineryElectricalBreakdown?.find((item) => item.quoteLocationOccupancyId == quoteLocationOccupancy._id),
                 address: {
                     address: quoteLocationOccupancy.locationName,
                     occupancy: quoteLocationOccupancy.occupancyId['occupancyType'], //
                     premium: quoteLocationOccupancy.flexaPremium + quoteLocationOccupancy.STFIPremium + quoteLocationOccupancy.earthquakePremium + quoteLocationOccupancy.terrorismPremium,
                     totalSumAssured: quoteLocationOccupancy.sumAssured,
                     locationDetailHeaders: ["Flexa+RSMD", "STFI", "Earthquake", "Terrorism"],
                     locationDetail: [
                         Number(quoteLocationOccupancy.flexaPremium),
                         Number(quoteLocationOccupancy.STFIPremium),
                         Number(quoteLocationOccupancy.earthquakePremium),
                         Number(quoteLocationOccupancy.terrorismPremium)
                     ],
 
                 },
                 clauses: this.quoteOption?.allCoversArray?.quoteLocationAddonCovers
                    //  .filter(filterBySector => filterBySector?.addOnCoverId['sectorId'] == this.quote['sectorId']['_id'])
                    //  .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
                     .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                    //  .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
                     .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
                 biclauses: this.quoteOption?.allCoversArray?.quoteLocationAddonCovers
                    //  .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
                     .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.BUSINESS_INTURREPTION)
                    //  .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
                     .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
                 riskDescription: getTreeFromFlatArray(this.quoteOption?.allCoversArray?.quoteLocationBreakupMaster),
                 perilsToBeDeleted: {
                     stfi: quoteLocationOccupancy.isStfi,
                     earthquake: quoteLocationOccupancy.isEarthquake,
                     terrorism: quoteLocationOccupancy.isTerrorism,
                 }
             })
 
             // this.covers = [{
             //     quoteLocationOccupancy: `${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,
             //     riskDescriptionCover: this.quoteOption?.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.checkbox).filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map(cover => {
             //         return ({ name: cover.name })
             //     }),
             //     machineryElectricalBreakdown: this.quoteOption?.allCoversArray.machineryElectricalBreakdown?.find((item) => item.quoteLocationOccupancyId == quoteLocationOccupancy._id),
             //     address: {
             //         address: quoteLocationOccupancy.locationName,
             //         occupancy: quoteLocationOccupancy.occupancyId['occupancyType'], //
             //         premium: quoteLocationOccupancy.flexaPremium + quoteLocationOccupancy.STFIPremium + quoteLocationOccupancy.earthquakePremium + quoteLocationOccupancy.terrorismPremium,
             //         totalSumAssured: quoteLocationOccupancy.sumAssured,
             //         locationDetailHeaders: ["Flexa+RSMD", "STFI", "Earthquake", "Terrorism"],
             //         locationDetail: [
             //             Number(quoteLocationOccupancy.flexaPremium),
             //             Number(quoteLocationOccupancy.STFIPremium),
             //             Number(quoteLocationOccupancy.earthquakePremium),
             //             Number(quoteLocationOccupancy.terrorismPremium)
             //         ],
 
             //     },
             //     clauses: this.quoteOption?.allCoversArray?.quoteLocationAddonCovers
             //         .filter(filterBySector => filterBySector?.addOnCoverId['sectorId'] == this.quote['sectorId']['_id'])
             //         .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
             //         .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.PROPERTY_DAMAGE)
             //         .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
             //         .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
             //     biclauses: this.quoteOption?.allCoversArray?.quoteLocationAddonCovers
             //         .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
             //         .filter((item) => item?.addOnCoverId?.category == AllowedAddonCoverCategory.BUSINESS_INTURREPTION)
             //         .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
             //         .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
             //     riskDescription: getTreeFromFlatArray(this.quoteOption?.allCoversArray?.quoteLocationBreakupMaster),
             //     perilsToBeDeleted: {
             //         stfi: quoteLocationOccupancy.isStfi,
             //         earthquake: quoteLocationOccupancy.isEarthquake,
             //         terrorism: quoteLocationOccupancy.isTerrorism,
             //     }
             // }]
         })
    }

    ngOnChanges(): void {
        this.ngOnInit();
    }
    getProjectDetails(){
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
        this.projectDetailsService.getMany(lazyLoadEvent).subscribe({
          next: (dto: IOneResponseDto<IProject>) => {
              this.projectData = dto.data?.entities;
          },
          error: e => {
            console.log(e);
          }
        });
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

    getInstallment() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOption._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.installmentService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IOneResponseDto<Iinstallment>) => {
                this.installmentDetailsData = dto.data?.entities[0]['installments'];
                console.log(this.installmentDetailsData);
            },
            error: e => {
                console.log(e);
            }
        });
    }

}
