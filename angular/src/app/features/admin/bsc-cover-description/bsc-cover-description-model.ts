import { IProduct } from "../product/product.model";

export interface IBscCoverDescription {
    _id?: string;
    bscType: string;
    productId: string | IProduct;
    description: string;
    active: boolean;
}

export const OPTIONS_BSC_TYPES = [
    { label: 'Fire Loss of Profit', value: 'BSC_FIRE_LOSS_OF_PROFIT_COVER' },
    { label: 'Burglary Housebreaking', value: 'BSC_BURGLARY_HOUSEBREAKING_COVER' },
    { label: 'Money in Safe Till', value: 'BSC_MONEY_SAFE_TILL_COVER' },
    { label: 'Money in Transit', value: 'BSC_MONEY_TRANSIT_COVER' },
    { label: 'Electronic Equipments', value: 'BSC_ELECTRONIC_EQUIPMENTS_COVER' },
    { label: 'Electrical and Mechanical Appliances', value: 'BSC_PORTABLE_EQUIPMENTS_COVER' },
    { label: 'Fixed Plate Glass', value: 'BSC_FIXED_PLATE_GLASS_COVER' },
    { label: 'Accompanied Baggage', value: 'BSC_ACCOMPANIED_BAGGAGE_COVER' },
    { label: 'Fidelity Guarantee', value: 'BSC_FIDELITY_GUARANTEE_COVER' },
    { label: 'Signage', value: 'BSC_SIGNAGE_COVER' },
    { label: 'Liability Section', value: 'BSC_LIABILITY_SECTION_COVER' },
    { label: 'Floater Addon', value: 'FLOATER_COVER_ADD_ON' },
    { label: 'Loss Of Rent', value: 'LOSE_OF_RENT' },
    { label: 'Personal Accident Cover', value: 'PERSONAL_ACCIDENT_COVER' },
    { label: 'Rent for alternative accomodation', value: 'RENT_FOR_ALTERNATIVE_ACCOMODATION' },
    { label: 'Declaration Policy', value: 'DECLARATION_POLICY' },
    { label: 'Workmen Compensation', value: 'BSC_WORKMEN_COMPENSATION_COVER' },
    { label: 'All Risk', value: 'BSC_ALL_RISK_COVER' },
    { label: 'Pedal Cycle', value: 'BSC_PEDAL_CYCLE_COVER' },
    { label: "Accidental Damage", value:  'ACCIDENTAL_DAMAGE' },
    { label: "Claim Preparation Cost", value:  'CLAIM_PREPARATION_COST' },
    { label: "Cover Of Valuable Contents", value:  'COVER_OF_VALUABLE_CONTENTS' },
    { label: "Keys And Locks", value:  'KEYS_AND_LOCKS' },
    { label: "Landscaping Including Lawns Plant Shrubs Or Trees", value:  'LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES' },
    { label: "Protection And Preservation Of Property", value:  'PROTECTION_AND_PRESERVATION_OF_PROPERTY' },
    { label: "Removal Of Debris", value:  'REMOVAL_OF_DEBRIS' },
    { label: "Tenants legal Liability", value:  'TENANTS_LEGAL_LIABILITY' },
    { label: "Third Party Liability", value:  'THIRD_PARTY_LIABILITY' },
    { label: "Additional Custom Duty", value:  'ADDITIONAL_CUSTOM_DUTY' },
    { label: "Deterioration of Stocks in B", value:  'DETERIORATION_OF_STOCKS_IN_B' },
    { label: "Deterioration of Stocks in A", value:  'DETERIORATION_OF_STOCKS_IN_A' },
    { label: "Escalation", value:  'ESCALATION' },
    { label: "EMI Protection Cover", value:  'EMI_PROTECTION_COVER' },
    { label: "Insurance of additional expense", value:  'INSURANCE_OF_ADDITIONAL_EXPENSE' },
    { label: "Involuntary betterment", value:   'INVOLUNTARY_BETTERMENT'},
];
