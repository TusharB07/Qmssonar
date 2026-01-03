import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IWCDescriptionOfEmployee {
    _id?: string;
    productId: string | IProduct;
    description:string;
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner 
}