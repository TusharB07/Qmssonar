import { ILov } from "src/app/app.model";
import { ICategoryProductMaster } from "../category-product-master-features/category-product-master.model";

export interface IProduct {
    _id?: string;
    type: string;
    category?: string;
    categoryId: string | ICategoryProductMaster;
    status: boolean;
    shortName?: string;
    fromSI: Number;
    toSI: Number;
    isOtc: boolean
    bscCovers?: AllowedProductBscCover[],
    mandatoryCovers?: AllowedProductBscCover[],
    productTemplate: AllowedProductTemplate
    is_validation_check?: boolean;
    isFlexaShow: boolean;
    isOccupancySubTypeShow: boolean;
    renewalPolicyPeriodinMonthsoryears?: AllowedMonthorYears;
    isOccupancyWiseRate?: boolean
    isSubOccupancyWiseRate?: boolean
    numberOfYears?:Number;
    numberOfMonths?:Number;
    isFire: boolean;
    isSTFI: boolean;
    isTerrorism: boolean;
    isEarthQuake: boolean;
    isFireRequired: boolean;
    isSTFIRequired: boolean;
    isTerrorismRequired: boolean;
    isEarthQuakeRequired: boolean;
    isOccupancywiseTenure: boolean,
    isOccupancyWiseInbuiltaddonRate: boolean;
    isBuildingAndContentWiseRate:boolean;
}
export interface ICategoryOption {
    label: string;
    value: string;
}
export enum AllowedProductTemplate {
    BLUS = 'BLUS',
    FIRE = 'FIRE',
    IAR = 'IAR',
    GMC = 'GMC',
    MARINE = 'MARINE',
    WORKMENSCOMPENSATION = "WORKMENSCOMPENSATION",
    LIABILITY = "LIABILITY",
    LIABILITY_EANDO = "LIABILITY_EANDO",
    LIABILITY_CGL = "LIABILITY_CGL",
    LIABILITY_PRODUCT = "LIABILITY_PRODUCT",
    LIABILITY_PUBLIC = "LIABILITY_PUBLIC",
    LIABILITY_CYBER = "LIABILITY_CYBER",
    LIABILITY_CRIME = "LIABILITY_CRIME"

}

export enum AllowedMonthorYears {
    M = 'Monthly',
    Y = 'Yearly'
}

export enum Cateagory {
    PROPERTY = 'property'
}

export enum AllowedProductBscCover {
    FLOATER_COVER_ADD_ON = 'FLOATER_COVER_ADD_ON',
    DECLARATION_POLICY = 'DECLARATION_POLICY',
    LOSE_OF_RENT = 'LOSE_OF_RENT',
    RENT_FOR_ALTERNATIVE_ACCOMODATION = 'RENT_FOR_ALTERNATIVE_ACCOMODATION',
    PERSONAL_ACCIDENT_COVER = 'PERSONAL_ACCIDENT_COVER',
    VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS = 'VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS',

    BSC_FIRE_LOSS_OF_PROFIT_COVER = 'BSC_FIRE_LOSS_OF_PROFIT_COVER',
    BSC_BURGLARY_HOUSEBREAKING_COVER = 'BSC_BURGLARY_HOUSEBREAKING_COVER',
    BSC_MONEY_SAFE_TILL_COVER = 'BSC_MONEY_SAFE_TILL_COVER',
    BSC_MONEY_TRANSIT_COVER = 'BSC_MONEY_TRANSIT_COVER',
    BSC_ELECTRONIC_EQUIPMENTS_COVER = 'BSC_ELECTRONIC_EQUIPMENTS_COVER',
    BSC_PORTABLE_EQUIPMENTS_COVER = 'BSC_PORTABLE_EQUIPMENTS_COVER',
    BSC_FIXED_PLATE_GLASS_COVER = 'BSC_FIXED_PLATE_GLASS_COVER',
    BSC_ACCOMPANIED_BAGGAGE_COVER = 'BSC_ACCOMPANIED_BAGGAGE_COVER',
    BSC_FIDELITY_GUARANTEE_COVER = 'BSC_FIDELITY_GUARANTEE_COVER',
    BSC_SIGNAGE_COVER = "BSC_SIGNAGE_COVER",
    BSC_LIABILITY_SECTION_COVER = 'BSC_LIABILITY_SECTION_COVER',
    BSC_WORKMEN_COMPENSATION_COVER = 'BSC_WORKMEN_COMPENSATION_COVER',
    BSC_PEDAL_CYCLE_COVER = 'BSC_PEDAL_CYCLE_COVER',
    BSC_ALL_RISK_COVER = 'BSC_ALL_RISK_COVER',
    THIRD_PARTY_LIABILITY = 'THIRD_PARTY_LIABILITY',
    TENANTS_LEGAL_LIABILITY = 'TENANTS_LEGAL_LIABILITY',
    REMOVAL_OF_DEBRIS = 'REMOVAL_OF_DEBRIS',
    PROTECTION_AND_PRESERVATION_OF_PROPERTY = 'PROTECTION_AND_PRESERVATION_OF_PROPERTY',
    LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES = 'LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES',
    KEYS_AND_LOCKS = 'KEYS_AND_LOCKS',
    COVER_OF_VALUABLE_CONTENTS = 'COVER_OF_VALUABLE_CONTENTS',
    CLAIM_PREPARATION_COST = 'CLAIM_PREPARATION_COST',
    ACCIDENTAL_DAMAGE = 'ACCIDENTAL_DAMAGE',
    ADDITIONAL_CUSTOM_DUTY = 'ADDITIONAL_CUSTOM_DUTY',
    DETERIORATION_OF_STOCKS_IN_B = 'DETERIORATION_OF_STOCKS_IN_B',
    DETERIORATION_OF_STOCKS_IN_A = 'DETERIORATION_OF_STOCKS_IN_A',
    ESCALATION = 'ESCALATION',
    EMI_PROTECTION_COVER = 'EMI_PROTECTION_COVER',
    INSURANCE_OF_ADDITIONAL_EXPENSE = 'INSURANCE_OF_ADDITIONAL_EXPENSE',
    INVOLUNTARY_BETTERMENT = 'INVOLUNTARY_BETTERMENT',
}

export enum LocationBasedBscCover {
    FLOATER_COVER_ADD_ON = 'floaterCoverAddOnCovers',
    DECLARATION_POLICY = 'declarationPolicyCover',
    LOSE_OF_RENT = 'loseOfRentCover',
    RENT_FOR_ALTERNATIVE_ACCOMODATION = 'rentForAlternativeAccomodationCover',
    PERSONAL_ACCIDENT_COVER = 'personalAccidentCoverCover',
    VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS = 'valuableContentsOnAgreedValueBasisCovers',
    BSC_FIRE_LOSS_OF_PROFIT_COVER = 'bscFireLossOfProfitCover',
    BSC_BURGLARY_HOUSEBREAKING_COVER = 'bscBurglaryHousebreakingCover',
    BSC_MONEY_SAFE_TILL_COVER = 'bscMoneySafeTillCover',
    BSC_MONEY_TRANSIT_COVER = 'bscMoneyTransitCover',
    BSC_ELECTRONIC_EQUIPMENTS_COVER = 'bscElectronicEquipmentsCover',
    BSC_PORTABLE_EQUIPMENTS_COVER = 'bscPortableEquipmentsCovers',
    BSC_FIXED_PLATE_GLASS_COVER = 'bscFixedPlateGlassCover',
    BSC_ACCOMPANIED_BAGGAGE_COVER = 'bscAccompaniedBaggageCovers',
    BSC_FIDELITY_GUARANTEE_COVER = 'bscFidelityGuaranteeCovers',
    BSC_SIGNAGE_COVER = "bscSignageCovers",
    BSC_LIABILITY_SECTION_COVER = 'bscLiabilitySectionCovers',
    BSC_WORKMEN_COMPENSATION_COVER = 'bscWorkmenCompensationCovers',
    BSC_PEDAL_CYCLE_COVER = 'bscPedalCycleCovers',
    BSC_ALL_RISK_COVER = 'bscAllRiskCovers'
}



export const OPTIONS_PRODUCT_TEMPLATES: ILov[] = [
    { label: 'BLUS', value: AllowedProductTemplate.BLUS },
    { label: 'FIRE', value: AllowedProductTemplate.FIRE },
    { label: 'IAR', value: AllowedProductTemplate.IAR },
    { label: 'GMC', value: AllowedProductTemplate.GMC },
    { label: 'MARINE', value: AllowedProductTemplate.MARINE },
    { label: 'WORKMENSCOMPENSATION', value: AllowedProductTemplate.WORKMENSCOMPENSATION },
    { label: 'LIABILITY', value: AllowedProductTemplate.LIABILITY },
    { label: 'LIABILITY_EANDO', value: AllowedProductTemplate.LIABILITY_EANDO },
    { label: "LIABILITY_CGL", value: AllowedProductTemplate.LIABILITY_CGL },
    { label: "LIABILITY_PRODUCT", value: AllowedProductTemplate.LIABILITY_PRODUCT },
    { label: "LIABILITY_PUBLIC", value: AllowedProductTemplate.LIABILITY_PUBLIC },
    { label: "LIABILITY_CYBER", value: AllowedProductTemplate.LIABILITY_CYBER },
    { label: "LIABILITY_CRIME", value: AllowedProductTemplate.LIABILITY_CRIME }
]

export const OPTIONS_PRODUCT_BSC_COVERS: ILov[] = [
    { label: "Floater Cover Add On Cover", value: AllowedProductBscCover.FLOATER_COVER_ADD_ON },
    { label: "Declaration Policy Cover", value: AllowedProductBscCover.DECLARATION_POLICY },
    { label: "Lose Of Rent Cover", value: AllowedProductBscCover.LOSE_OF_RENT },
    { label: "Rent For Alternative Accomodation Cover", value: AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION },
    { label: "Personal Accident Cover", value: AllowedProductBscCover.PERSONAL_ACCIDENT_COVER },
    { label: "Valuable Contents On Agreed Value Basis Cover", value: AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS },

    { label: "Fire Loss Of Profit Cover", value: AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER },
    { label: "Burglary Housebreaking Cover", value: AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER },
    { label: "Money Safe Till Cover", value: AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER },
    { label: "Money Transit Cover", value: AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER },
    { label: "Electronic Equipments Cover", value: AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER },
    { label: "Electrical and Mechanical Appliances", value: AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER },
    { label: "Fixed Plate Glass Cover", value: AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER },
    { label: "Accompanied Baggage Cover", value: AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER },
    { label: "Fidelity Guarantee Cover", value: AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER },
    { label: "Signage Cover", value: AllowedProductBscCover.BSC_SIGNAGE_COVER },
    { label: "Liability Section Cover", value: AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER },
    { label: "Workmen Compensation Cover", value: AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER },
    { label: "Pedal Cycle Cover", value: AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER },
    { label: "All Risk Cover", value: AllowedProductBscCover.BSC_ALL_RISK_COVER },
    { label: "Accidental Damage", value: AllowedProductBscCover.ACCIDENTAL_DAMAGE },
    { label: "Claim Preparation Cost", value: AllowedProductBscCover.CLAIM_PREPARATION_COST },
    { label: "Cover Of Valuable Contents", value: AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS },
    { label: "Keys And Locks", value: AllowedProductBscCover.KEYS_AND_LOCKS },
    { label: "Landscaping Including Lawns Plant Shrubs Or Trees", value: AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES },
    { label: "Protection And Preservation Of Property", value: AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY },
    { label: "Removal Of Debris", value: AllowedProductBscCover.REMOVAL_OF_DEBRIS },
    { label: "Tenants legal Liability", value: AllowedProductBscCover.TENANTS_LEGAL_LIABILITY },
    { label: "Third Party Liability", value: AllowedProductBscCover.THIRD_PARTY_LIABILITY },
    { label: "Additional Custom Duty", value: AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY },
    { label: "Deterioration of Stocks in B", value: AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B },
    { label: "Deterioration of Stocks in A", value: AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A },
    { label: "Escalation", value: AllowedProductBscCover.ESCALATION },
    { label: "EMI Protection Cover", value: AllowedProductBscCover.EMI_PROTECTION_COVER },
    { label: "Insurance of additional expense", value: AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE },
    { label: "Involuntary betterment", value: AllowedProductBscCover.INVOLUNTARY_BETTERMENT },
]


export const OPTIONS_MONTH_YEAR = [
    { label: "Monthly", value: 'M' },
    { label: "Yearly", value: 'Y' },
]
export enum AllowedPushbacks {
    QCR = 'QCR',
    QUOTE_SLIP_GENERATION = 'Quote Slip Generation',
    RFQ = 'RFQ',
  }