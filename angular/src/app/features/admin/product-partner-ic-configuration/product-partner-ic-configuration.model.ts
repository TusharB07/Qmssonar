import { IMappedRmEmail, IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IProductPartnerIcConfigration {
    _id: string;
    brokerPartnerId: string | IPartner;
    productId: string | IProduct;
    insurerPartnerId: string | IPartner;
    otcType?: AllowedOtcTypes;
    occupancyRules: IOccupancyRule[]
    discountRules: IDiscountRule,
    wcConfigurationDiscount:number
    lovRules: any[],
    bscCoverRules: IBscRule[];

    applicableFrom: Date;
    applicableTo: Date;

    fromSI: Number;
    toSI: Number;


    mappedRmEmails: IMappedRmEmail[];

    active: boolean
    validateSI: boolean
}



export interface IOccupancyRule {
    isAll: boolean,
    occupancySubType: {
        _id: string,
        shopName : string
    }
    occupancy: {
        _id: string,
        name: string
    },
    sumInsured: Number,
    maxNstp : Number;
}

export interface IBscRule {
    isAllowed : boolean,
    name : string,
    // sumInsured : Number
}

export interface IDiscountRule {
    discountFrom: Number,
    discountTo: Number,
    isNstp:Boolean,
    NstpMaxDiscount:Number
}

export enum AllowedOtcTypes {
    OTC = "OTC",
    NONOTC = "NONOTC",
    BOTH = "BOTH",
}



export const OPTIONS_ALLOWED_TYPES = [
    { label: 'OTC', value: AllowedOtcTypes.OTC },
    { label: 'NON OTC', value: AllowedOtcTypes.NONOTC },
    { label: 'BOTH', value: AllowedOtcTypes.BOTH },
];








