import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IBscCover {
    _id?: string;
    bscType: string;
    ratePerMile: Number;
    productId: string | IProduct;
    partnerId: string | IPartner
    applicableFrom: Date;
    applicableTo: Date;
    fromSI: Number;
    toSI: Number;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    isZoneWiseRate: Boolean
    eqZone1?: Number
    eqZone3?: Number
    eqZone2?: Number
    eqZone4?: Number
    stfiRate?: Number
    maxNstp: Number
}


export const OPTIONS_BSC_TYPES = [
    { label: 'Fire Loss of Profit', value: 'fire_loss_of_profit' },
    { label: 'Burglary Housebreaking', value: 'burglary_housebreaking' },
    { label: 'Money in Safe Till', value: 'money_in_safe_till' },
    { label: 'Money in Transit', value: 'money_in_transit' },
    { label: 'Electronic Equipments', value: 'electronic_equipments' },
    { label: 'Electrical and Mechanical Appliances', value: 'portable_equipments' },
    { label: 'Fixed Plate Glass', value: 'fixed_plate_glass' },
    { label: 'Accompanied Baggage', value: 'accompanied_baggage' },
    { label: 'Fidelity Guarantee', value: 'fidelity_guarantee' },
    { label: 'Signage', value: 'signage' },
    { label: 'Liability Section', value: 'liability_section' },
    { label: 'Floater Addon', value: 'floater_cover_add_on' },
    { label: 'Machinery Electrical BreakDown', value: 'machinery_electrical_breakDown' },
    { label: 'Machinery Loss Of Profit', value: 'machinery_loss_of_profit' },
    { label: 'Loss Of Rent', value: 'loss_of_rent' },
    { label: 'Personal Accident Cover', value: 'personal_accident_cover' },
    { label: 'Rent for alternative accomodation', value: 'rent_for_alternative_accomodation' },
    { label: 'Valuable Contents on agreed value', value: 'valuable_contents_on_agreed_value' },
    { label: 'Declaration Policy', value: 'declaration_policy' },
    { label: 'Workmen Compensation', value: 'workmen_compensation' },
    { label: 'All Risk', value: 'all_risk' },
    { label: 'Pedal Cycle', value: 'pedal_cycle' },
    { label: "Accidental Damage", value:  'accidental_damage' },
    { label: "Claim Preparation Cost", value:  'claim_preparation_cost' },
    { label: "Cover Of Valuable Contents", value:  'cover_of_valuable_contents' },
    { label: "Keys And Locks", value:  'keys_and_locks' },
    { label: "Landscaping Including Lawns Plant Shrubs Or Trees", value:  'landscaping_including_lawns_plant_shrubs_or_trees' },
    { label: "Protection And Preservation Of Property", value:  'protection_and_preservation_of_property' },
    { label: "Removal Of Debris", value:  'removal_of_debris' },
    { label: "Tenants legal Liability", value:  'tenants_legal_liability' },
    { label: "Third Party Liability", value:  'third_party_liability' },
    { label: "Additional Custom Duty", value:  'additional_custom_duty' },
    { label: "Deterioration of Stocks in B", value:  'deterioration_of_stocks_in_b' },
    { label: "Deterioration of Stocks in A", value:  'deterioration_of_stocks_in_a' },
    { label: "Escalation", value:  'escalation' },
    { label: "EMI Protection Cover", value:  'emi_protection_cover' },
    { label: "Insurance of additional expense", value:  'insurance_of_additional_expense' },
    { label: "Involuntary betterment", value:   'involuntary_betterment'},
    { label: 'Discount', value: 'discount' },
    
];
export const OPTIONS_BSC_COVER_RULES = [
    { label: 'Fire Loss of Profit', value: 'fire_loss_of_profit' },
    { label: 'Money in Safe Till', value: 'money_in_safe_till' },
    { label: 'Money in Transit', value: 'money_in_transit' },
    { label: 'Electronic Equipments', value: 'electronic_equipments' },
    { label: "Accidental Damage", value:  'accidental_damage' },
    { label: "Claim Preparation Cost", value:  'claim_preparation_cost' },
    { label: "Cover Of Valuable Contents", value:  'cover_of_valuable_contents' },
    { label: "Keys And Locks", value:  'keys_and_locks' },
    { label: "Landscaping Including Lawns Plant Shrubs Or Trees", value:  'landscaping_including_lawns_plant_shrubs_or_trees' },
    { label: "Protection And Preservation Of Property", value:  'protection_and_preservation_of_property' },
    { label: "Removal Of Debris", value:  'removal_of_debris' },
    { label: "Tenants legal Liability", value:  'tenants_legal_liability' },
    { label: "Third Party Liability", value:  'third_party_liability' },
    { label: "Additional Custom Duty", value:  'additional_custom_duty' },
    { label: "Deterioration of Stocks in B", value:  'deterioration_of_stocks_in_b' },
    { label: "Deterioration of Stocks in A", value:  'deterioration_of_stocks_in_a' },
    { label: "Escalation", value:  'escalation' },
    { label: "EMI Protection Cover", value:  'emi_protection_cover' },
    { label: "Insurance of additional expense", value:  'insurance_of_additional_expense' },
    { label: "Involuntary betterment", value:   'involuntary_betterment'}
];

export const _BSC_TYPES = {
    fire_loss_of_profit: "fire_loss_of_profit",
    burglary_housebreaking: "burglary_housebreaking",
    money_in_safe_till: "money_in_safe_till",
    money_in_transit: "money_in_transit",
    electronic_equipments: "electronic_equipments",
    portable_equipments: "portable_equipments",
    fixed_plate_glass: "fixed_plate_glass",
    accompanied_baggage: "accompanied_baggage",
    fidelity_guarantee: "fidelity_guarantee",
    signage: "signage",
    liability_section: "liability_section",
    declaration_policy: "declaration_policy",
    floater_cover_add_on: "floater_cover_add_on",
    loss_of_rent: "loss_of_rent",
    personal_accident_cover: "personal_accident_cover",
    rent_for_alternative_accomodation: "rent_for_alternative_accomodation",
    valuable_contents_on_agreed_value: "valuable_contents_on_agreed_value",
    machinery_electrical_breakDown: "machinery_electrical_breakDown",
    machinery_loss_of_profit: "machinery_loss_of_profit",
    pedal_cycle_type: "pedal_cycle_type",
    risk_all_type: "risk_all_type",
    workmen_compansation_risk_type: "workmen_compansation_risk_type",
    accidental_damage :"accidental_damage",
    claim_preparation_cost:"claim_preparation_cost",
    cover_of_valuable_contents:"cover_of_valuable_contents",      
    keys_and_locks :"keys_and_locks",  
    landscaping_including_lawns_plant_shrubs_or_trees:"landscaping_including_lawns_plant_shrubs_or_trees",  
    protection_and_preservation_of_property:"protection_and_preservation_of_property",   
    removal_of_debris:"removal_of_debris",
    tenants_legal_liability:"tenants_legal_liability",  
    third_party_liability:"third_party_liability",   
    additional_custom_duty:"additional_custom_duty",   
    deterioration_of_stocks_in_b:"deterioration_of_stocks_in_b",   
    deterioration_of_stocks_in_a:"deterioration_of_stocks_in_a",   
    escalation:"escalation",
    emi_protection_cover:"emi_protection_cover",   
    insurance_of_additional_expense:"insurance_of_additional_expense",   
    involuntary_betterment:"involuntary_betterment"
};
