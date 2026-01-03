import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { ILocationBasedCovers, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { CalculatedCovers } from '../sub-template-blus/sub-template-blus.component';
import { Subscription } from 'rxjs';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { ActivatedRoute } from '@angular/router';
import { ExpiredDetailsDialogFormService } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.service';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';
import { DeductibleExcessService } from '../../deductibles-excess-card/deductible-excess.service';
import { IDeductible } from '../../deductibles-excess-card/deductibles.model';

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
    address: any,
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
    selector: 'app-sub-template-fire',
    templateUrl: './sub-template-fire.component.html',
    styleUrls: ['./sub-template-fire.component.scss']
})
export class SubTemplateFireComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip;

    Object = Object // To Access Object Helper in HTML

    discount: CalculatedCovers;
    discountPercentage = 0;
    claimExperiences: IClaimExperience[] = []
    coversPremium: CalculatedCovers[] = [];
    gstPercentage = 0.18
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
    warranties: any[] = [];
    exclusions: any[] = [];
    subjectivities: any[] = [];

    // New_Quote_option
    @Input() quoteOption: IQuoteOption;
    private currentPropertyQuoteOption: Subscription;
    expireDetails: any;
    isAllowedToShow:boolean;

    constructor(
        private claimExperienceService: ClaimExperienceService,
        private expiredDetailsDialogFormService: ExpiredDetailsDialogFormService,
        private deductibleExcessService:DeductibleExcessService
    ) { }


    ngOnInit(): void {
        this.showQuoteOptionWiseSlip(this.quoteOption)
        this.getExpiredDetails();
        this.getdectibleEXcesstablebypolicy(this.quote?.productId['shortName'])
        this.isAllowedToShow = !['Draft', 'Pending Requisition For Quote', 'Sent To Insurance Company RM', 'Under Writer Review','QCR From Underwritter','Placement','Waiting For Approval'].includes(this.quote?.quoteState);
        // console.log(this.quote,"sssssss")

        // Old_Quote
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

        // New_Quote_Option
        // this.getAllOptionsByQuoteId()

        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 5,
        //     sortField: '_id',
        //     sortOrder: -1,
        //     filters: {
        //         // @ts-ignore
        //         quoteOptionId: [
        //             {
        //                 value: this.quoteOption?._id,
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


        // this.data = getTreeFromFlatArray(responseObject);
        // console.log(treeArrayFromFlatArray);

        // let flatArray = {
        //     "Basic Details::>::Name::>::First Name": 'Danish',
        //     "Basic Details::>::Name::>::Middle Name": 'Shabbir',
        //     "Basic Details::>::Name::>::Last Name": 'Shaikh',
        //     "Basic Details::>::Age::>::Date of Birth": '04/01/1999',
        //     "Basic Details::>::Age::>::Years": '24',
        //     "Contact Details::>::Personal::>::Phone Number": '8655332519',
        //     "Contact Details::>::Personal::>::Email": 'shaikh.danish4444@gmail.com',
        // }

        // const convertToTree = (flatObject) => {
        //     const tree = {};
        //     for (const key in flatObject) {
        //         let currentLevel = tree;
        //         const keyParts = key.split('::>::');
        //         for (let i = 0; i < keyParts.length - 1; i++) {
        //             const part = keyParts[i];
        //             if (!(part in currentLevel)) {
        //                 currentLevel[part] = {};
        //             }
        //             console.log('currentLevel', currentLevel)
        //             console.log('part', part)
        //             currentLevel = currentLevel[part];
        //         }
        //         currentLevel[keyParts[keyParts.length - 1]] = flatObject[key];
        //     }
        //     return tree;
        // };

        // let treeArrayFromFlatArrayforPrimeNgTreeTable: TreeNode[] = [{
        //     data: {
        //         Key: "Basic Details",
        //     }, children: [
        //         {
        //             data: {
        //                 key: 'Name'
        //             },
        //             children: [
        //                 {
        //                     data: {
        //                         "First Name": 'Danish',
        //                         "Middle Name": 'Shabbir',
        //                         "Last Name": 'Shaikh',
        //                     }
        //                 }
        //             ]
        //         }, {

        //             data: {
        //                 key: 'Age'
        //             },
        //             children: [
        //                 {
        //                     data: {
        //                         "Date of Birth": '04/01/1999',
        //                         "Years": '24',
        //                     }
        //                 }
        //             ]
        //         }
        //     ]
        // }, {
        //     data: {
        //         key: 'Contact Details',
        //     },
        //     children: [
        //         {
        //             data: 'Personal',
        //             children: [{

        //                 data: {
        //                     "Phone Number": '8655332519',
        //                     "Email": 'shaikh.danish4444@gmail.com',

        //                 }
        //             }
        //             ]
        //         },
        //     ]
        // }]




        // const treeArray = convertToTree(flatArray);
        // console.log(treeArray);

        // let data = {
        //     "data":
        //         [
        //             {
        //                 "data": {
        //                     "name": "Documents",
        //                     "size": "75kb",
        //                     "type": "Folder"
        //                 },
        //                 "children": [
        //                     {
        //                         "data": {
        //                             "name": "Work",
        //                             "size": "55kb",
        //                             "type": "Folder"
        //                         },
        //                         "children": [
        //                             {
        //                                 "data": {
        //                                     "name": "Expenses.doc",
        //                                     "size": "30kb",
        //                                     "type": "Document"
        //                                 }
        //                             },
        //                             {
        //                                 "data": {
        //                                     "name": "Resume.doc",
        //                                     "size": "25kb",
        //                                     "type": "Resume"
        //                                 }
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         "data": {
        //                             "name": "Home",
        //                             "size": "20kb",
        //                             "type": "Folder"
        //                         },
        //                         "children": [
        //                             {
        //                                 "data": {
        //                                     "name": "Invoices",
        //                                     "size": "20kb",
        //                                     "type": "Text"
        //                                 }
        //                             }
        //                         ]
        //                     }
        //                 ]
        //             },
        //             {
        //                 "data": {
        //                     "name": "Pictures",
        //                     "size": "150kb",
        //                     "type": "Folder"
        //                 },
        //                 "children": [
        //                     {
        //                         "data": {
        //                             "name": "barcelona.jpg",
        //                             "size": "90kb",
        //                             "type": "Picture"
        //                         }
        //                     },
        //                     {
        //                         "data": {
        //                             "name": "primeui.png",
        //                             "size": "30kb",
        //                             "type": "Picture"
        //                         }
        //                     },
        //                     {
        //                         "data": {
        //                             "name": "optimus.jpg",
        //                             "size": "30kb",
        //                             "type": "Picture"
        //                         }
        //                     }
        //                 ]
        //             }
        //         ]
        // }



        // let responseData = {}

        // Object.entries(responseObject).map(([key, value]) => {


        //     // console.log(key, value)

        //     let subRows = key.split('::>::')

        //     console.log(subRows)

        //     this.data = [{
        //         data: {
        //             'Name': subRows[0]
        //         },
        //         expanded: true,
        //         children: [
        //             {
        //                 data: {
        //                     'Name': subRows[1]
        //                 },
        //                 expanded: true,
        //                 children: [
        //                     {
        //                         expanded: true,
        //                         data: {
        //                             'Name': subRows[2],
        //                             // 'Manav House - 400062': value['Manav Cement Factory - 400066'],
        //                             // 'Manav Cement Factory - 400066': value['Manav House - 400062']
        //                             ...value
        //                         }
        //                     }
        //                 ]
        //             }]
        //     }]


        // })

        // console.log(this.breakup)

        // console.log(responseData)

        // let treeTable: TreeNode[] = []

        // let breakup: IJsonTable<typeof breakUpHeaders[number], typeof breakUpRowsLabel[number]> = {
        //     'Manav House - 400062': {
        //         "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building": 50000,
        //         "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.": 4000,
        //         "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks": 30000,
        //     },
        //     "Manav Cement Factory - 400066": {
        //         "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building": 30000,
        //         "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.": 60000,
        //         "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks": 50000,
        //     }
        // }

        // console.log(breakup)



        // Object.entries(breakup).map(([header, row]) => {
        //     console.log(header)
        //     // console.log(row)

        //     let level1: TreeNode = { data: [], children: [] }

        //     // let subRows =
        //     Object.entries(row).map(([rowLabel, value]) => {

        //         let subRows = rowLabel.split('::>::')

        //         level1['data'] = { "Name": subRows[0], children: [] }
        //         // console.log(level1['data'], subRows[0])

        //         if (level1['data']['Name'] == subRows[0]) {
        //             // if (!level1['children']) level1['children'] = []
        //             level1['children'].push({ data: { "Name": subRows[1] }, children: [] })
        //         }
        //         console.log(level1['children'][0]['data']['Name'], subRows[1])

        //         if (level1['children'][0]['data']['Name'] == subRows[1]) {
        //             level1['children'][0]['children'].push({
        //                 "data": {
        //                     "Name": subRows[2],
        //                     'Manav House - 400062': value,
        //                     'Manav Cement Factory - 400066': value
        //                 },

        //             })
        //         }

        //         // console.log(subRows)

        //         // function pushToData(obj, value) {
        //         //     // if (!obj['data']) obj['data'] = []
        //         //     console.log('obj', obj['data'])
        //         //     console.log('value', value)

        //         //     if (!obj['data']) {
        //         //         obj['data'] = value;

        //         //     } else {
        //         //         obj['children'] = [{ data: value }]
        //         //     }

        //         //     return obj;
        //         //     // return obj['data'].push({ data: value });
        //         // }

        //         // let i = 0;
        //         // while (subRows.length > 0) {
        //         // console.log()
        //         // console.log(subRows.pop())

        //         // let value = subRows.pop()
        //         // console.log('length', subRows)
        //         // console.log('level', subRows[0])
        //         // console.log('level', level1['data'])

        //         // let value = { data: subRows[0], children: [] }

        //         // function f1(level1, value) {
        //         //     console.log('value', value)
        //         //     if (!level1['data']) {
        //         //         level1 = value
        //         //     } else {

        //         //         level1['children'] = [value]
        //         //         // if (!level1['children']) {
        //         //         // }
        //         //         // if (value) level1['children'] = [f1(level1, value)]
        //         //     }
        //         //     console.log('level1', level1)

        //         //     console.log('--------------------------------------------------')
        //         //     return level1
        //         // }

        //         // function wrap(level1, value) {
        //         //     return level1 = { data: value, children: level1 };
        //         // }

        //         // level1['data'].push(wrap(level1, value))

        //         // level1 = f1(level1, value)



        //         // if (i > 0) {
        //         //     level1['children'].push({ data: subRows[i] })
        //         // }

        //         // level1 = pushToData(level1, { 'Name': subRows[i] })
        //         // if (i == subRows.length - 1) {
        //         //     // console.log(value)

        //         //     level1['data'].push({
        //         //         'Name': subRows[i],
        //         //         'Manav House - 400062': value,
        //         //         'Manav Cement Factory - 400066': value
        //         //     });
        //         // } else {
        //         //     level1['data'].push({ 'Name': subRows[i] });
        //         // }

        //         // }
        //         // console.log(level1)
        //     })
        //     treeTable.push({ data: level1 })
        // })

        // console.log({ data: treeTable })



        // Old_Quote
        // if (this.quote?.allCoversArray) {

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


        //     if (this.quote.allCoversArray?.fireFloaterCoverAddOnCover?.isChecked) {

        //         let sectionOrCover = 'Floater Addon Cover'
        //         let netPremium = this.quote.totalFireFloater;
        //         let sumInsured = this.quote.allCoversArray.fireFloaterCoverAddOnCover.sumInsured;

        //         // for (const si of this.quote.allCoversArray.lovReferences.filter((item) => item.lovReference == AllowedLovReferences.FLOATER_ADDON_STOCKS)) {
        //         //     if (si.lovValue > sumInsured) sumInsured = si.lovValue;
        //         // }

        //         let gst = netPremium * this.gstPercentage

        //         this.coversPremium.push({
        //             sectionOrCover: sectionOrCover,
        //             netPremium: netPremium ?? 0,
        //             gst: gst ?? 0,
        //             sumInsured: sumInsured ?? 0,
        //             totalPremium: (netPremium ?? 0) + (gst ?? 0),
        //         })
        //     }

        //     if (this.quote.allCoversArray.quoteLocationPropertyDamageAddonCoversSumInsured) {

        //         let sectionOrCover = 'Property Damage Addon'
        //         // let netPremium = this.quote.totalIndictiveQuoteAmt - (this.quote.totalFireFloater + (this.quote?.totalFlexa ?? 0) + (this.quote?.totalStfi ?? 0) + (this.quote?.totalEarthquake ?? 0) + (this.quote?.totalTerrorism ?? 0));
        //         let netPremium = Number(this.quote.totalQuoteLocationAddonCover ?? 0);
        //         let sumInsured = this.quote.allCoversArray.quoteLocationPropertyDamageAddonCoversSumInsured;

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
        //     totalNetPremium = totalNetPremium + Number(cover.netPremium)
        //     totalGst = totalGst + cover.gst
        //     totalSumInsured = totalSumInsured + Number(cover.sumInsured)
        //     totalPremium = totalPremium + Number(cover.totalPremium)
        // })

        // this.coversPremium.push({
        //     sectionOrCover: 'Total',
        //     netPremium: totalNetPremium ?? 0,
        //     gst: totalGst ?? 0,
        //     sumInsured: totalSumInsured ?? 0,
        //     totalPremium: totalPremium,
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

        // this.warranties = this.quote.allCoversArray?.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true);
        // this.exclusions = this.quote.allCoversArray?.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true);
        // this.subjectivities = this.quote.allCoversArray?.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true);

        // this.quote.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {

        //     let firstLocationData = Object.values(this.quote?.allCoversArray?.quoteLocationBreakupMaster)[0]

        //     this.quoteLocationOccupancies = [`${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`]

        //     console.log(this.quote.allCoversArray?.quoteLocationRiskManagement)


        //     this.covers.push({
        //         quoteLocationOccupancy: `${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,

        //         // riskDescriptionCover: this.quote?.allCoversArray?.quoteLocationRiskManagement.filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map((cover) => ({ name: cover.riskManagementFeatureId['name'] })),
        //         riskDescriptionCover: this.quote.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.checkbox).filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map(cover => {
        //             // console.log(cover)
        //             return ({ name: cover.name })
        //         }),
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
        //             .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
        //             .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured })),
        //         riskDescription: getTreeFromFlatArray(this.quote?.allCoversArray?.quoteLocationBreakupMaster),
        //         perilsToBeDeleted: {
        //             stfi: quoteLocationOccupancy.isStfi,
        //             earthquake: quoteLocationOccupancy.isEarthquake,
        //             terrorism: quoteLocationOccupancy.isTerrorism,
        //         },

        //     })
        // })


    }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    // New_Quote_option
    showQuoteOptionWiseSlip(quoteOption: IQuoteOption) {
        this.coversPremium = []
        this.covers = []
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 5,
            sortField: '_id',
            sortOrder: -1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: quoteOption?._id,
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

        let responseObject: IJsonTablev2<typeof this.listOfValues[number], typeof this.quoteLocationOccupancies[number]> = {
            "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Building": {
                "Manav House - 400062": 5000,
                "Manav Cement Factory - 400066": 6000
            },
            "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Plinth & Foundation, roads and bridges, etc.": {
                "Manav House - 400062": 5000,
                "Manav Cement Factory - 400066": 0
            },
            "Section I: Property Damage (PD)::>::(A) Material Damage Section::>::Stocks": {
                "Manav House - 400062": 3000,
                "Manav Cement Factory - 400066": 6000,
            },
            "Section II: Property Damage (PD)::>::(A) Material Damage Section::>::Other Items": {
                "Manav House - 400062": 3000,
                "Manav Cement Factory - 400066": 6000,
            }
        }


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




        if (quoteOption?.allCoversArray) {
            let sectionOrCover = this.quote.productId['type']
            let netPremium = 0;
            let sumInsured = 0;

            quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
                netPremium = netPremium + Number(quoteLocationOccupancy?.totalPremium ?? 0);
                sumInsured = sumInsured + Number(quoteLocationOccupancy?.sumAssured ?? 0);
            })

            let gst = netPremium * this.gstPercentage

            this.coversPremium.push({
                sectionOrCover: sectionOrCover,
                netPremium: netPremium ?? 0,
                gst: gst ?? 0,
                sumInsured: sumInsured ?? 0,
                totalPremium: (netPremium ?? 0) + (gst ?? 0),
            })

            if (quoteOption.allCoversArray?.fireFloaterCoverAddOnCover?.isChecked) {

                let sectionOrCover = 'Floater Addon Cover'
                let netPremium = quoteOption.totalFireFloater;
                let sumInsured = quoteOption.allCoversArray.fireFloaterCoverAddOnCover.sumInsured;
                let gst = netPremium * this.gstPercentage

                this.coversPremium.push({
                    sectionOrCover: sectionOrCover,
                    netPremium: netPremium ?? 0,
                    gst: gst ?? 0,
                    sumInsured: sumInsured ?? 0,
                    totalPremium: (netPremium ?? 0) + (gst ?? 0),
                })
            }

            if (quoteOption.allCoversArray.quoteLocationPropertyDamageAddonCoversSumInsured) {

                let sectionOrCover = 'Property Damage Addon'
                let netPremium = Number(quoteOption.totalQuoteLocationAddonCover ?? 0);
                let sumInsured = quoteOption.allCoversArray.quoteLocationPropertyDamageAddonCoversSumInsured;

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
            totalNetPremium = totalNetPremium + Number(cover.netPremium)
            totalGst = totalGst + cover.gst
            totalSumInsured = totalSumInsured + Number(cover.sumInsured)
            totalPremium = totalPremium + Number(cover.totalPremium)
        })

        this.coversPremium.push({
            sectionOrCover: 'Total',
            netPremium: totalNetPremium ?? 0,
            gst: totalGst ?? 0,
            sumInsured: totalSumInsured ?? 0,
            totalPremium: totalPremium,
        })

        this.discountPercentage = quoteOption?.discountId ? quoteOption?.discountId['discountPercentage'] : 0

        if( this.discountPercentage){

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

        this.warranties = quoteOption?.allCoversArray?.warranties.filter(warranty => warranty?.warranty_dict?.checkbox === true);
        this.exclusions = quoteOption?.allCoversArray?.exclusions.filter(exclusion => exclusion?.exclusion_dict.checkbox === true);
        this.subjectivities = quoteOption?.allCoversArray?.subjectivities.filter(subjectivity => subjectivity?.subjectivity_dict.checkbox === true);

        quoteOption?.allCoversArray?.quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {

            let firstLocationData = Object.values(quoteOption?.allCoversArray?.quoteLocationBreakupMaster)[0]

            this.quoteLocationOccupancies = [`${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`]
            console.log(this.quoteLocationOccupancies)

            this.covers.push({
                quoteLocationOccupancy: `${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,

                riskDescriptionCover: quoteOption.allCoversArray?.quoteLocationRiskManagement.filter(cover => cover.checkbox).filter((cover) => cover.quoteLocationOccupancyId == quoteLocationOccupancy._id).map(cover => {
                    return ({ name: cover.name })
                }),
                address: {
                    address: quoteLocationOccupancy.locationName,
                    occupancy: quoteLocationOccupancy.occupancyId['occupancyType'],
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
                clauses: quoteOption?.allCoversArray?.quoteLocationAddonCovers
                    // .filter(filterBySector => filterBySector?.addOnCoverId['sectorId'] == this.quote['sectorId']['_id'])
                    // .filter(item => item?.quoteLocationOccupancyId == quoteLocationOccupancy._id)
                    // .filter(cover => (cover.isChecked && cover.sumInsured > 0) || cover.addOnCoverId['addonTypeFlag'] == 'Free')
                    .map((cover) => ({ label: cover.addOnCoverId['name'], sumInsured: cover.sumInsured, category:cover.addOnCoverId['category'] })),
                riskDescription: getTreeFromFlatArray(quoteOption?.allCoversArray?.quoteLocationBreakupMaster),
                perilsToBeDeleted: {
                    stfi: quoteLocationOccupancy.isStfi,
                    earthquake: quoteLocationOccupancy.isEarthquake,
                    terrorism: quoteLocationOccupancy.isTerrorism,
                },

            })
        })
    }

    // ngOnDestroy(): void {
    //     this.currentPropertyQuoteOption.unsubscribe();
    // }

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

        getdectibleEXcesstablebypolicy(policyName: string) {
        
        
            let lazyLoadEvent: LazyLoadEvent = {
              filters: {
                // @ts-ignore
                policyType: [
                  {
                    value: [
                      {
                        value: policyName
                      }
                    ],
                    matchMode: "in",
                    operator: "and"
                  }
                ],
                    // @ts-ignore
                    quoteOptionId: [
                        {
                            value: [
                                {
                                    value: this.quoteOption._id
                                }
                            ],
                            matchMode: "in",
                            operator: "and"
                        },
                    ]
                },
                sortField: "_id",
                sortOrder: 1
            };
            
          
            this.deductibleExcessService.getDeductibletable(lazyLoadEvent).subscribe({
              next: (dto: IManyResponseDto<IDeductible>) => {
                console.log(dto);
              }
            });
          }
}
