import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IBusinessType {
    _id?: string;
    productId: string | IProduct;
    businessType:string;
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner 
}