import { IOccupancyRate } from 'src/app/features/admin/occupancy-rate/occupancy-rate.model';
import { ISector } from './../sector/sector.model';
import { SectorId } from 'src/app/features/admin/client/client.model';
import { ILov } from "src/app/app.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";
import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";

export interface IAddOnCover {
    [x: string]: any;
    totalPremium: Number;

    _id?: string;
    name: string;                                        // ?
    productId: string | IProduct;                    // ?
    category: AllowedAddonCoverCategory;                                    // ?
    addonTypeFlag: string;                               // ?
    categoryOfImportance: string;
    freeUpToText: string;                                // ?
    description: string;                                // ?
    freeUpToNumber: string;                              // ?
    rateType: string;                                    // ?
    rate: number;                                        // ?
    // tenurewiseRate? : number; 
    identity: string;                                    // ?
    freeUpToFlag: string;                                // ?
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    sectorId: string | ISector;
    // subCategory: string;                                 // ! TOBE Remove Not in used
    // isFree: boolean;                                     // ! TOBE Remove Not in used
    // isTariff: Boolean;                                   // ! TOBE Remove Not in used
    // claimClause: string;                                 // ! TOBE Remove Not in used
    // monthOrDays: Boolean;                                // ! TOBE Remove Not in used
    // siLimit: Boolean;                                    // ! TOBE Remove Not in used
    // categoryOfImportance: string;                        // ! TOBE Remove Not in used
    // sequenceNo: string;                                  // ! TOBE Remove Not in used
    // // entityTypeId: string;                             // ! TOBE Remove Not in used
    // policyType: string;                                  // ! TOBE Remove Not in used
    // addOnType: string;                                   // ! TOBE Remove Not in used
    // sumInsured: number;                                  // ! TOBE Remove Not in used
    // isAddonSelected: Boolean;                            // ! TOBE Remove Not in used
    // rateParameter: string;                               // ! TOBE Remove Not in used
    // freeUpToParameter: string;                           // ! TOBE Remove Not in used
    // calculatedIndicativePremium: number;                 // ! TOBE Remove Not in used

    applicableTo: Date,
    applicableFrom: Date,
    occupancyId : string | IOccupancyRate,
    
    // buildingRateType:number;
    // buildingRate:number;
    // buildingTenurewiseRate:number;
    // contentRateType:number;
    // contentRate:number;
    // contentTenurewiseRate:number;
    partnerId: string | IPartner

    //Liability
    addonCoverOptions: ILov[];
    typeOfProductOptions: ILov[];
    insuredBusinessActivityOptions: ILov[];
    rateLimit: RateLimit[];

}

export interface RateLimit {
    limits: number;
    rate: number;
}


export const OPTIONS_MONTH_OR_DAYS = [
    { value: true, label: 'Month' },
    { value: null, label: 'Days' }
];

export enum AllowedAddonCoverCategory {
    PROPERTY_DAMAGE = 'Property Damage',
    BUSINESS_INTURREPTION = 'Business Interruption',
}

export enum AllowedAddonTypeFlag {
    FREE = 'Free',
    CONDITION_FIX_PAID = 'Condition Fix Paid',
    CONDITION_PERCENTAGE_PAID = 'Condition Perc Paid',
    PAID = 'Paid',
}

export enum AllowedAddonRateType {
    POLICY_RATE = "Policy Rate",
    PERCENTAGE_OF_POLICY_RATE = "Perc of policy rate",
    TIME_OF_POLICY_RATE = "Time of policy rate",
    DIRECT_RATE = "Direct Rate",
}

export enum AllowedAddonLimitType {
    UPTO_10_PCT_OF_POLICY_SI_WITHOUT_FLEXA_RISKS = 'Upto 10% of policy SI without FLEXA risks',
    UPTO_10_PCT_OF_POLICY_SI_WITH_FLEXA_RISKS = 'Upto 10% of policy SI with FLEXA risks',
    ABOVE_10_PCT_OF_POLICY_SI_WITHOUT_FLEXA_RISKS = 'Above 10% of Policy SI but without FLEXA Risks',
    ABOVE_10_PCT_OF_POLICY_SI_WITH_FLEXA_RISKS = 'Above 10% of policy SI but with FLEXA risks',
    UPTO_10_PCT_OF_SI = 'Upto 10% of SI',
    ABOVE_10_PCT_AND_UPTO_50_PCT_OF_SI = 'Above 10% and upto 50% of SI',
    ABOVE_50_PCT_AND_UPTO_FULL_SI = 'Above 50% and upto Full SI',
    UPTO_RS_50_LAKHS = 'Upto Rs.50 lakhs',
    ABOVE_RS_50_LAKHS_AND_UPTO_RS_10_CRS = 'Above Rs.50 lakhs and upto Rs.10 crs',
    ABOVE_RS_10_CRORES_AND_UPTO_RS_25_CRS = 'Above Rs.10 crores and upto Rs.25 crs',
    ABOVE_RS_25_CRS = 'Above Rs.25 crs',
    AOA_LIMIT_UPTO_RS_10_CR = 'AOA limit upto Rs.10 cr',
    AOA_LIMIT_ABOVE_RS_10_CR_BUT_UPTO_RS_25_CR = 'AOA limit above Rs.10 cr but upto Rs.25 cr',
    LOADING_25_PCT_ON_ABOVE_RATES = '25% loading on the above rates',
    RESTRICTED_BETWEEN_PRINCIPAL_AND_CONTRACTOR = 'N.B.: This should be restricted between Principal and the contractor and should not be waived for others',
    UPTO_10_PCT_OF_POLICY_SI = 'Upto 10% of policy SI',
    ABOVE_10_PCT_OF_POLICY_SI_AND_UPTO_50_PCT = 'Above 10% of policy SI and upto 50%',
    UPTO_30_PCT_OF_NET_CLAIM_AMOUNT = 'Upto 30% of net claim Amount',
    BEYOND = 'Beyond',
    FOR_EVERY_12_MONTHS_OR_PART_THEREOF = 'for every 12 months or part thereof',
    FOR_EVERY_MONTH_OR_PART_THEREOF = 'For every month or part thereof',
    UPTO_RS_10_CR = 'Upto Rs.10 cr',
    RS_10_CR_TO_RS_30_CR = 'Rs.10 cr to Rs.30 cr',
    BEYOND_RS_30_CR = 'Beyond Rs.30 cr',
}





export const OPTIONS_ADDON_COVER_CATEGORIES: ILov[] = [
    { label: AllowedAddonCoverCategory.PROPERTY_DAMAGE, value: AllowedAddonCoverCategory.PROPERTY_DAMAGE },
    { label: AllowedAddonCoverCategory.BUSINESS_INTURREPTION, value: AllowedAddonCoverCategory.BUSINESS_INTURREPTION },
]

export const OPTIONS_ADDON_COVER_TYPE_FLAGS: ILov[] = [
    { label: AllowedAddonTypeFlag.FREE, value: AllowedAddonTypeFlag.FREE },
    { label: AllowedAddonTypeFlag.CONDITION_FIX_PAID, value: AllowedAddonTypeFlag.CONDITION_FIX_PAID },
    { label: AllowedAddonTypeFlag.CONDITION_PERCENTAGE_PAID, value: AllowedAddonTypeFlag.CONDITION_PERCENTAGE_PAID },
    { label: AllowedAddonTypeFlag.PAID, value: AllowedAddonTypeFlag.PAID },
]
export const OPTIONS_ADDON_COVER_RATE_TYPE: ILov[] = [
    { label: AllowedAddonRateType.POLICY_RATE, value: AllowedAddonRateType.POLICY_RATE },
    { label: AllowedAddonRateType.PERCENTAGE_OF_POLICY_RATE, value: AllowedAddonRateType.PERCENTAGE_OF_POLICY_RATE },
    { label: AllowedAddonRateType.TIME_OF_POLICY_RATE, value: AllowedAddonRateType.TIME_OF_POLICY_RATE },
    { label: AllowedAddonRateType.DIRECT_RATE, value: AllowedAddonRateType.DIRECT_RATE },
]
export const OPTIONS_ZONE : ILov[] = [
    { label: 'I', value: 'I' },
    { label: 'II', value: 'II' },
    { label: 'III', value: 'III' },
    { label: 'IV', value: 'IV' }
]

export const LIABILITY_COVERS_OPTIONS : ILov[] = [
    { label: 'Covered', value: 'Covered' },
    { label: 'Not Covered', value: 'Not Covered' },
    { label: 'Sub Limited', value: 'Sub Limited' } 
]

export const LIABILITY_PERIOD_COVERS_OPTIONS : ILov[] = [
    { label: '30 days', value: '30 days' },
    { label: '60 days', value: '60 days' },
    { label: '90 days', value: '90 days' } ,
    { label: '120 days', value: '120 days' } 
]

export const OPTIONS_ADDON_COVER_LIMIT_TYPE: ILov[] = [
    { label: AllowedAddonLimitType.UPTO_10_PCT_OF_POLICY_SI_WITHOUT_FLEXA_RISKS, value: AllowedAddonLimitType.UPTO_10_PCT_OF_POLICY_SI_WITHOUT_FLEXA_RISKS },
    { label: AllowedAddonLimitType.UPTO_10_PCT_OF_POLICY_SI_WITH_FLEXA_RISKS, value: AllowedAddonLimitType.UPTO_10_PCT_OF_POLICY_SI_WITH_FLEXA_RISKS },
    { label: AllowedAddonLimitType.ABOVE_10_PCT_OF_POLICY_SI_WITHOUT_FLEXA_RISKS, value: AllowedAddonLimitType.ABOVE_10_PCT_OF_POLICY_SI_WITHOUT_FLEXA_RISKS },
    { label: AllowedAddonLimitType.ABOVE_10_PCT_OF_POLICY_SI_WITH_FLEXA_RISKS, value: AllowedAddonLimitType.ABOVE_10_PCT_OF_POLICY_SI_WITH_FLEXA_RISKS },
    { label: AllowedAddonLimitType.UPTO_10_PCT_OF_SI, value: AllowedAddonLimitType.UPTO_10_PCT_OF_SI },
    { label: AllowedAddonLimitType.ABOVE_10_PCT_AND_UPTO_50_PCT_OF_SI, value: AllowedAddonLimitType.ABOVE_10_PCT_AND_UPTO_50_PCT_OF_SI },
    { label: AllowedAddonLimitType.ABOVE_50_PCT_AND_UPTO_FULL_SI, value: AllowedAddonLimitType.ABOVE_50_PCT_AND_UPTO_FULL_SI },
    { label: AllowedAddonLimitType.UPTO_RS_50_LAKHS, value: AllowedAddonLimitType.UPTO_RS_50_LAKHS },
    { label: AllowedAddonLimitType.ABOVE_RS_50_LAKHS_AND_UPTO_RS_10_CRS, value: AllowedAddonLimitType.ABOVE_RS_50_LAKHS_AND_UPTO_RS_10_CRS },
    { label: AllowedAddonLimitType.ABOVE_RS_10_CRORES_AND_UPTO_RS_25_CRS, value: AllowedAddonLimitType.ABOVE_RS_10_CRORES_AND_UPTO_RS_25_CRS },
    { label: AllowedAddonLimitType.ABOVE_RS_25_CRS, value: AllowedAddonLimitType.ABOVE_RS_25_CRS },
    { label: AllowedAddonLimitType.AOA_LIMIT_UPTO_RS_10_CR, value: AllowedAddonLimitType.AOA_LIMIT_UPTO_RS_10_CR },
    { label: AllowedAddonLimitType.AOA_LIMIT_ABOVE_RS_10_CR_BUT_UPTO_RS_25_CR, value: AllowedAddonLimitType.AOA_LIMIT_ABOVE_RS_10_CR_BUT_UPTO_RS_25_CR },
    { label: AllowedAddonLimitType.LOADING_25_PCT_ON_ABOVE_RATES, value: AllowedAddonLimitType.LOADING_25_PCT_ON_ABOVE_RATES },
    { label: AllowedAddonLimitType.RESTRICTED_BETWEEN_PRINCIPAL_AND_CONTRACTOR, value: AllowedAddonLimitType.RESTRICTED_BETWEEN_PRINCIPAL_AND_CONTRACTOR },
    { label: AllowedAddonLimitType.UPTO_10_PCT_OF_POLICY_SI, value: AllowedAddonLimitType.UPTO_10_PCT_OF_POLICY_SI },
    { label: AllowedAddonLimitType.ABOVE_10_PCT_OF_POLICY_SI_AND_UPTO_50_PCT, value: AllowedAddonLimitType.ABOVE_10_PCT_OF_POLICY_SI_AND_UPTO_50_PCT },
    { label: AllowedAddonLimitType.UPTO_30_PCT_OF_NET_CLAIM_AMOUNT, value: AllowedAddonLimitType.UPTO_30_PCT_OF_NET_CLAIM_AMOUNT },
    { label: AllowedAddonLimitType.BEYOND, value: AllowedAddonLimitType.BEYOND },
    { label: AllowedAddonLimitType.FOR_EVERY_12_MONTHS_OR_PART_THEREOF, value: AllowedAddonLimitType.FOR_EVERY_12_MONTHS_OR_PART_THEREOF },
    { label: AllowedAddonLimitType.FOR_EVERY_MONTH_OR_PART_THEREOF, value: AllowedAddonLimitType.FOR_EVERY_MONTH_OR_PART_THEREOF },
    { label: AllowedAddonLimitType.UPTO_RS_10_CR, value: AllowedAddonLimitType.UPTO_RS_10_CR },
    { label: AllowedAddonLimitType.RS_10_CR_TO_RS_30_CR, value: AllowedAddonLimitType.RS_10_CR_TO_RS_30_CR },
    { label: AllowedAddonLimitType.BEYOND_RS_30_CR, value: AllowedAddonLimitType.BEYOND_RS_30_CR },
];


