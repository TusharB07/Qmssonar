import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IWCCoverageType {
    _id?: string;
    productId: string | IProduct;
    coverageType:string;
    rate:number;
    isPaid: boolean;
    isFree: boolean;
    active: boolean;
    isSelected:boolean;
    coveragePaidORFree:string;
    isStandard: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner 
}